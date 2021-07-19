import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/mnist',
    name: 'mnist',
    component: () => import('../views/Mnist/index.vue')
  },
  {
    path: '/knn',
    name: 'knn',
    component: () => import('../views/Knn/index.vue')
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('../views/Stock/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
