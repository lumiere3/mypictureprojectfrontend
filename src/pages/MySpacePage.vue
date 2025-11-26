<template>
  <div class="mySpacePage">
    <p>正在跳转中...</p>
  </div>
</template>


<script setup lang="ts">
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRouter } from 'vue-router'
import { getSpaceVoByIdUsingGet, listSpaceVoByPageUsingPost } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'


/**
 * 当前页面作为一个跳转页面, 跳转到用户自己的空间页面, 方法如下
 * 如果用户没有登录, 就跳转到登录页面
 * 如果登录用户有空间, 就跳转到用户空间页面
 * 如果登录用户没有空间, 就跳转到创建空间页面
 */
const loginUserStore = useLoginUserStore ()
const router = useRouter()

/**
 * 跳转方法
 */
const checkUserSpace = async () =>{
  const loginUser = loginUserStore.loginUser
  // 如果未登录
  if (!loginUser?.id){
    // 跳转登录页面
    router.replace('/user/login')
    return;
  }
  // 获取用户空间
  const res = await listSpaceVoByPageUsingPost( {
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })
  //如果成功返回
  if (res.data.code === 0){
    // 判断空间是否存在
    if(res.data.data?.records?.length > 0){
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    }else{
      //不存在
      router.replace('/add_space')
      message.warn('您还没有空间, 请创建一个空间')
    }
  }else{
    message.error('获取空间失败' + res.data.message)
  }
}

onMounted(() => {
  checkUserSpace()
})

</script>

<style scoped>
.mySpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
