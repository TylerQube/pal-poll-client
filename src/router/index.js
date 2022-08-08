import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView'
import AdminView from '../views/AdminView'
import QuizView from '../views/QuizView'

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
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/play',
    name: 'play',
    component: QuizView,
    meta: {
      requiresAuth: true,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log(to.name)
  if (to.meta.requiresAuth && localStorage.getItem("jwt") == null) {
    console.log(to.name + " requires auth...")
    return next({ name: 'login' })
  }
  if (to.name == 'login' && localStorage.getItem("jwt") != null && localStorage.getItem('jwt') != "null") {
    console.log("already logged in")
    return next({ name: 'home' })
  }

  if (to.meta.requiresAdmin && localStorage.getItem("jwt") == null) {
    console.log(to.name + " requires admin auth...")
    return next({ name: 'home' })
  }
  else if (to.meta.requiresAdmin) {
    console.log("Must authenticate admin");
    // authenticate admin through backend
    const res = await fetch("http://localhost:3030/user/adminAuth", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
    });
    console.log(res)
    const isAdmin = res.status == 200;

    if(!isAdmin) return next(false);
  }
  return next();
});

export default router
