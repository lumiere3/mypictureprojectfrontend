<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">云图库</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <!-- 用户信息展示栏-->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '未命名用户' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="toUserPage">
                    <ContactsOutlined  />
                    个人信息
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined/>
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, reactive, ref } from 'vue'
import { HomeOutlined, GithubOutlined, EditOutlined,PlusSquareOutlined, LogoutOutlined,ContactsOutlined,UserOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
//const current = ref<string[]>(['mail']);
const loginUserStore = useLoginUserStore()
// 原始数据
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    icon: () => h(PlusSquareOutlined),
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/userManage',
    icon: () => h(EditOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(EditOutlined),
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    icon: () => h(EditOutlined),
    label: '空间管理',
    title: '空间管理',
  },
  {
    key: 'others',
    icon: () => h(GithubOutlined),
    label: h('a', { href: 'https://github.com/lumiere3', target: '_blank' }, '关于作者'),
    title: '关于作者',
  },
]

// 过滤菜单 -> 用户如果还没有登录, 就不让用户看到'管理用户'的页面
const filterMenus = (menus = [] as MenuProps['items']) => {
  // 遍历我们的菜单, 如果是以'/admin'开头,就代表是管理员才能看到的页面
  return menus?.filter((menu) => {
    if (menu?.key?.startsWith('/admin')) {
      // 查看用户的权限(角色)
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

//展示菜单
const items = computed(() => {
  return  filterMenus(originItems)
})

const router = useRouter()

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出成功!')
    router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败!' + res.data.message)
  }
}

// 去到用户页
const toUserPage = () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser) {
    return
  }
  router.push({
    path: `/user/${loginUser.id}`,
  })
}


</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}
.logo {
  height: 48px;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}
</style>
