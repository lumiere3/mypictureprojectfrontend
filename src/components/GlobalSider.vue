<template>
  <div id="globalSider">
    <a-layout-sider
      width="200"
      v-if="loginUserStore.loginUser.id"
      breakpoint="lg"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      > </a-menu>
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import {  h, ref } from 'vue'
import {
  PictureOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
//const current = ref<string[]>(['mail']);
const loginUserStore = useLoginUserStore()


// 菜单项
const menuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: '/my_space/',
    icon: () => h(UserOutlined),
    label: '我的空间',
  }
]

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
    current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

</script>

<style scoped>
#globalSider .title-bar {
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
