<template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="cart-decrease icon-remove_circle_outline"
        v-show="food.count > 0"
        @click.stop="decreaseCart"
      ></div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">
      {{ food.count }}
    </div>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>

export default {
  props: {
    food: {
      type: Object,
    },
  },

    methods: {
    addCart() {
      if (!this.food.count) {
        this.$set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      this.$emit('add',event.target);
    },

    decreaseCart() {
      if (this.food.count) {
        this.food.count--;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.cartcontrol
    font-size 0
    .cart-decrease,.cart-add
        display inline-block
        padding 6px
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
    .cart-decrease
        opacity 1
        &.move-enter-active, &.move-leave-active
            transition: all 0.5s linear
        &.move-enter, &.move-leave-active
            opacity 0
            transform translate3d(24px,0,0) rotate(180deg)
    .cart-count
        display inline-block
        vertical-align top
        width 12px
        padding-top 6px
        line-height 24px
        text-align center
        font-size 10px
        color rgb(147,153,159)
    .cart-add
        display inline-block
</style>
