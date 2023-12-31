import { createRouter, createWebHashHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StatisticsView from '../views/StatisticsView.vue';
import LoginView from '../views/LoginView.vue';
import MyActivityView from '../views/MyActivityView.vue'
import PeopleSearchView from '../views/PeopleSearchView.vue'
import SignupView from '../views/SignUpView.vue'
import { getSession } from '@/model/session';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: requireLogin
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView
    },
    { 
      path: "/login", 
      name: "login", 
      component: LoginView 
    },
    { // Adding the new route for MyActivityView
      path: '/my-activity',
      name: 'my-activity',
      component: MyActivityView,
      beforeEnter: requireLogin
    },
    { // Adding the new route for PeopleSearchView
      path: '/people-search',
      name: 'people-search',
      component: PeopleSearchView,
      //beforeEnter: requireLogin
    },
    { // Adding the new route for AdminView
      path: '/signup',
      name: 'signup',
      component: SignupView,
      //beforeEnter: requireLogin
    }
  ]
})

function requireLogin(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  
  const session = getSession();
  if(!session.user){
    session.redirectUrl = to.fullPath;
    next('/login');
  }else{
    next();
  }
}

export default router