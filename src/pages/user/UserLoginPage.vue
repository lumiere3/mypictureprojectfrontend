<template>
  <div id="userLoginPage">
    <h2 class="title">用户登录</h2>
    <div class="desc">登录云图库</div>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
      >
        <a-form-item
          label="用户账号"
          name="userAccount"
          :rules="[{ required: true, message: '请输入账号!' }, {min: 4, message: '账号不能小于4位'}]"
        >
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
        </a-form-item>

        <a-form-item
          label="用户密码"
          name="userPassword"
          :rules="[{ required: true, message: '请输入密码! ' }, {min: 6 , message: '密码不能小于6位'}]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
        </a-form-item>

        <div class="tips">
          没有账号?
          <RouterLink to="/user/register">前往注册</RouterLink>
        </div>


        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
  </div>
</template>


<script lang="ts" setup>
import { reactive } from 'vue';
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

const loginUserStore = useLoginUserStore()

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});
/**
 * 提交当前表单
 * @param values
 */
const  handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  //登陆成功
  if(res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser();
    message.success('登陆成功');
    router.push({
      path: '/',
      replace: true,
    });
  } else{
    message.error("登录失败" +  res.data.message);
  }
};

</script>



<style scoped>
#userLoginPage {
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
