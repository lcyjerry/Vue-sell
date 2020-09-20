<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          @click="selectMenu(index, $event)"
          :class="{ current: currentIndex === index }"
          class="menu-item"
          v-for="(item, index) in goods"
          :key="index"
        >
          <span class="text">
            <span
              v-show="item.type > 0"
              class="icon"
              :class="classMap[item.type]"
            >
            </span
            >{{ item.name
            }}<i class="count" v-show="countAll[index] > 0">
              {{ countAll[index] }}
            </i>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li
          class="food-list food-list-hook"
          v-for="(item, index) in goods"
          :key="index"
        >
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li
              @click="selectFood(food)"
              class="food-item border-1px"
              v-for="(food, index) in item.foods"
              :key="index"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span
                  ><span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{ food.price }}</span
                  ><span class="old" v-show="food.oldPrice"
                    >¥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="onAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      ref="shopCart"
      :selectFoods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
    >
    </shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import axios from "axios";
import BScroll from "@better-scroll/core";
import shopcart from "components/shopcart/shopcart";
import cartcontrol from "components/cartcontrol/cartcontrol";
import food from "components/food/food";

export default {
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
    };
  },

  components: {
    shopcart,
    cartcontrol,
    food,
  },

  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },

    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    },

    // countAll() {
    //   return function(index) {
    //     let ret = [];
    //     this.goods.forEach((good) => {
    //       const { foods } = good;
    //       let count = 0;
    //       foods.forEach((food) => {
    //         if (!food.count) {
    //           this.$set(food, "count", 0);
    //         } else {
    //           count += food.count;
    //         }
    //       });
    //       ret.push(count);
    //     });
    //     this.count.splice(index, 1, ret[index]);
    //     return this.count[index];
    //   };
    // },

    countAll() {
      let ret = [];
      this.goods.forEach((good) => {
        const { foods } = good;
        let count = 0;
        foods.forEach((food) => {
          count += food.count || 0;
        });
        ret.push(count);
      });
      return ret;
    },
  },

  props: {
    seller: {
      type: Object,
    },
  },

  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    axios.get("/api/goods").then((res) => {
      this.goods = res.data.data;
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
    });
  },

  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true,
      });

      this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3,
      });

      this.foodsScroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },

    _calculateHeight() {
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },

    selectMenu(index, e) {
      if (!e._constructed) {
        return;
      }
      let foodslist = this.$refs.foodWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let el = foodslist[index];
      this.foodsScroll.scrollToElement(el, 300);
    },

    selectFood(food) {
      this.selectedFood = food;
      this.$refs.food.show();
    },

    onAdd(el) {
      this.$refs.shopCart.drop(el);
    },

    // countAll() {
    //   let ret = [];
    //   this.goods.forEach((good) => {
    //     const { foods } = good;
    //     let count = 0;
    //     foods.forEach((food) => {
    //       if (!food.count) {
    //         this.$set(food, "count", 0);
    //       } else {
    //         count += food.count;
    //       }
    //     });
    //     ret.push(count);
    //   });
    //   this.count.splice(index, 1, ret[index]);
    //   return ret[index];
    // },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

    .goods
        display flex
        position absolute
        top 174px
        bottom 46px
        width 100%
        overflow hidden
        .menu-wrapper
            flex 0 0 80px
            width 80px
            background-color #f3f5f7
            .menu-item
                position relative
                display table
                height 54px
                width 56px
                line-height 14px
                padding 0 12px
                &.current
                    position relative
                    margin-top -1px
                    z-index 10
                    background-color #fff
                    font-weight 700
                    .text
                        border-none()
                .icon
                    display inline-block
                    vertical-align top
                    width 12px
                    height 12px
                    margin-right 2px
                    background-size 12px 12px
                    background-repeat no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display table-cell
                    width 56px
                    vertical-align middle
                    border-1px(rgba(7,17,27,.1))
                    font-size 12px
                    .count
                      position absolute
                      display inline-block
                      width:15px
                      height 15px
                      color #fff
                      font-weight 700
                      text-align center
                      border-radius 50%
                      background red
                      left 50px
                      top 5px
        .foods-wrapper
            flex 1
            .title
                padding-left 14px
                height 26px
                line-height 26px
                border-left 2px solid #d9dde1
                color rgb(147,153,159)
                background #f3f5f7
            .food-item
                display flex
                margin 18px
                padding-bottom  18px
                border-1px(rgba(7,17,27,.1))
                &:last-child
                    border-none()
                    margin-bottom 0
                .icon
                    flex 0 0 57px
                    margin-right 10px
                .content
                    flex 1
                    .name
                        margin 2px 0 8px 0
                        height 14px
                        line-height 14px
                        font-size 14px
                        color rgb(7,17,27)
                    .desc, .extra
                        line-height 10px
                        font-size 10px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 8px
                        line-height 12px
                    .extra
                        .count
                            margin-right 12px
                    .price
                        font-weight 700
                        line-height 24px

                        .now
                            margin-right 8px
                            font-size 14px
                            color rgb(240,20,20)
                        .old
                            text-decoration line-through
                            font-size 10px
                            color rgb(147,153,159)
                    .cartcontrol-wrapper
                        position absolute
                        right 0
                        bottom 12px
</style>
