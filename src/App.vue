<template>
  <div>
    <BasicLayout></BasicLayout>
  </div>

</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { healthUsingGet } from '@/api/mainController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

/**
 * 获取用户登录信息
 */
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

healthUsingGet().then((res) => {
  console.log(res)
})
</script>



<style scoped>

</style>
