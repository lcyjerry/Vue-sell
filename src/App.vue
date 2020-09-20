<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link class="item" to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link class="item" to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link class="item" to='/seller'>商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { urlParse } from 'common/js/util.js'
import header from 'components/header/header.vue'
import axios from 'axios'


  export default {
    data(){
      return{
        seller:{
          id:(() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      }
    },

    components:{
      'v-header' :header
    },

    created(){
      axios.get('/api/seller?id=' + this.seller.id) 
        .then((res) => {
          res = res.data.data
          this.seller = Object.assign({},this.seller,res)
        })
    }
  }
</script>

<style lang="stylus" scoped>
@import './common/stylus/mixin.styl'

  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center
      & > .item
        display block
        font-size 14px
        color rgb(77,85,93)
        &.active
          color red
</style>
