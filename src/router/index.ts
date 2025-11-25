import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserPage from '@/pages/user/UserPage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/AddSpacePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/picture/:id',
      name: '图片详情页',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/admin/userManage',
      name: '管理用户',
      component: UserManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: '管理图片',
      component: PictureManagePage,
    },
    {
      path: '/admin/spaceManage',
      name: '管理空间',
      component: SpaceManagePage,
    },
    {
      path: '/user/:id',
      name: '用户主页',
      component: UserPage,
      props: true,
    },
    {
      path: '/add_picture/',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/add_space/',
      name: '创建空间',
      component: AddSpacePage,
    },
    {
      path: '/add_picture/batch',
      name: '批量导入图片',
      component: AddPictureBatchPage,
    }
    /*{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },*/
  ],
})

export default router
