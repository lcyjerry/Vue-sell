import Vue from 'vue'
import VueRouter from 'vue-router'
import goods from 'components/goods/goods.vue'
import seller from 'components/seller/seller.vue'
import ratings from 'components/ratings/ratings.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path:'/goods',
      component:goods
    },

    {
      path:'/ratings',
      component:ratings

    },

    {
      path:'/seller',
      component:seller
    }

]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

export default router
