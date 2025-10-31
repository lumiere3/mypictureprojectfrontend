<template>
  <div id="userRegisterPage">
    <h2 class="title">用户注册</h2>
    <div class="desc">注册云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item
        label="用户账号"
        name="userAccount"
        :rules="[
          { required: true, message: '请输入账号!' },
          { min: 4, message: '账号不能小于4位' },
        ]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        label="用户密码"
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码! ' },
          { min: 6, message: '密码不能小于6位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        label="确认密码"
        name="confirmPassword"
        :rules="[
          { required: true, message: '请确认密码! ' },
          { min: 6, message: '密码不能小于6位' },
        ]"
      >
        <a-input-password v-model:value="formState.confirmPassword" placeholder="请输入密码" />
      </a-form-item>

      <div class="tips">
        已有账号?
        <RouterLink to="/user/login">前往登录</RouterLink>
      </div>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userRegisterUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

const loginUserStore = useLoginUserStore()

/*interface FormState {
  username: string;
  password: string;
}*/

const formState = reactive<API.UserRegisterRequest>({
  confirmPassword: '',
  userAccount: '',
  userPassword: '',
})
/**
 * 提交当前表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  if(values.userPassword !== values.confirmPassword) {
    message.error('两次输入密码不一致')
    return
  }


  const res = await userRegisterUsingPost(values)
  //注册成功, 跳转到登录页
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('注册失败' + res.data.message)
  }
}
</script>

<style scoped>
#userRegisterPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
