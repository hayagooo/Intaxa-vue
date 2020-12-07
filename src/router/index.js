import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Magazine from '../views/Magazine.vue'
import Bookmark from '../views/Bookmark.vue'
import Popular from '../views/Popular.vue'
import Dashboard from '../views/dashboard/Index.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: {
      type: 'General',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: {
      type: 'Auth',
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    props: {
      type: 'Auth',
    }
  },
  {
    path: '/magazine/:id',
    name: 'Magazine',
    component: Magazine,
    props: {
      type: 'General',
    }
  },
  {
    path: '/bookmark',
    name: 'Bookmark',
    component: Bookmark,
    props: {
      type: 'General',
    }
  },
  {
    path: '/popular',
    name: 'Popular',
    component: Popular,
    props: {
      type: 'General',
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/dashboard/magazines',
    name: 'DashboardMagazines',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/dashboard/magazine/:id/topics',
    name: 'DashboardTopics',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/dashboard/profile',
    name: 'DashboardProfile',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/dashboard/teams',
    name: 'DashboardTeams',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/dashboard/setting',
    name: 'DashboardSetting',
    component: Dashboard,
    props: {
      type: 'Dashboard',
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
