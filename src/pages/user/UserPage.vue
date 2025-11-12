<template>
  <div class="userPage">
    <!-- 目前只能修改个人信息 -->
    <h2 style="margin-bottom: 16px">个人中心</h2>
    <h2 style="margin-bottom: 16px">修改个人信息</h2>
    <a-form
    name="userForm"
    layout="vertical"
    :model="userForm"
    >
      <a-form-item name="userName" label="用户昵称">
        <a-input v-model:value="userForm.userName" placeholder="请输入用户昵称"  allow-clear/>
      </a-form-item>
      <a-form-item name="userAvatar" label="用户头像">
        <AvatarUpload
          v-model:imageUrl="userForm.userAvatar" />
      </a-form-item>
      <a-form-item name="userProfile" label="用户简介">
        <a-textarea
          v-model:value="userForm.userProfile"
          placeholder="输入用户简介"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit">
          <template #icon>
            <CheckCircleOutlined />
          </template>
           提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserVoByIdUsingGet, updateUserUsingPost } from '@/api/userController'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import AvatarUpload from '@/components/AvatarUpload.vue'

const props = defineProps<{
  id: string | number
}>()
//修改用户的表单
const userForm = reactive<API.UserUpdateRequest>({
  id: props.id,
})
const user = ref<API.UserVO>()
const loginUserStore = useLoginUserStore()

//获取用户信息
const getUserInfo = async () => {
  const id = props.id
  //如果id存在
  if (id) {
    const res = await getUserVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 0 && res.data.data){
      const data = res.data.data
      user.value = data
      userForm.userName = data.userName
      userForm.userProfile = data.userProfile
      userForm.userAvatar = data.userAvatar
    }
  }
}
//首次加载的时候获取用户信息
onMounted(() => {
  getUserInfo()
})

//提交修改
const submit = async () => {
  const id = props.id
  if (id) {
    const res = await updateUserUsingPost(userForm)
    if (res.data.code === 0) {
      message.success('修改成功')
      //更新数据
      await getUserInfo()
      await loginUserStore.fetchLoginUser()
    } else {
      message.error('修改失败' + res.data.message)
    }
  }
}





</script>

<style scoped>
.userPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
