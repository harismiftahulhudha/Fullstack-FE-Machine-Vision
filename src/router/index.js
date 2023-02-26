import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import HomeView from '../views/home/HomeView.vue'
import UserView from '../views/user/UserView.vue'
import ChangePasswordUserView from '../views/user/ChangePasswordUserView.vue'
import ListPostUserView from '../views/post/ListPostUserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'auth.login', component: LoginView, meta: { requiredAuth: false } },
    { path: '/register', name: 'auth.register', component: RegisterView, meta: { requiredAuth: false } },
    { path: '/home', name: 'home.index', component: HomeView, meta: { requiredAuth: true } },
    { path: '/user', name: 'user.index', component: UserView, meta: { requiredAuth: true } },
    { path: '/user/change-password', name: 'user.changePassword', component: ChangePasswordUserView, meta: { requiredAuth: true } },
    { path: '/post', name: 'post.user', component: ListPostUserView, meta: { requiredAuth: true } },
  ]
})

export default router
