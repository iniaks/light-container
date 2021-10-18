import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Diagram/index.vue')
  },
  {
    path: '/combination/:name',
    name: 'combination',
    component: () => import('../views/Combination/index.vue')
  },
  {
    path: '/create/:group',
    name: 'create',
    component: () => import('../views/Combination/index.vue')
  },
  {
    path: '/enlighten/:number',
    name: 'enlighten',
    component: () => import('../views/Enlighten/index.vue')
  }
  //{
    // path: '/about',
    // name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  //},
  // {
  //   path: '/mnist',
  //   name: 'mnist',
  //   component: () => import('../views/Mnist/index.vue')
  // },
  // {
  //   path: '/knn',
  //   name: 'knn',
  //   component: () => import('../views/Knn/index.vue')
  // },
  // {
  //   path: '/stock',
  //   name: 'stock',
  //   component: () => import('../views/Stock/index.vue')
  // },
  // {
  //   path: '/diagram',
  //   name: 'diagram',
  //   component: () => import('../views/Diagram/index.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
