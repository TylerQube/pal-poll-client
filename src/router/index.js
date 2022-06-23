import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && localStorage.getItem("jwt") == null) {
    console.log(to.name + " requires auth...")
    return next({ name: 'login' })
  }
  else if (to.name == 'login' && localStorage.getItem("jwt") != null && localStorage.getItem('jwt') != "null") {
    console.log("already logged in")
    return next(false)
  }
  console.log("going to: " + to.name + " from " + from.name)
  return next();
});

export default router
