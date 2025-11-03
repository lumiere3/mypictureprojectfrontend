import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'

// 是否是首次获取
let firstFetchUser : boolean = true;

router.beforeEach( async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 保证用户信息能一定被获取到, 在首次获取时进行
  if(firstFetchUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchUser = false;
  }
  //拿到当前的路径
  const url = to.fullPath
  // 如果是/admin的路径, 那么就验证用户的信息
  if(url.startsWith('/admin')) {
    if(!loginUser ||  loginUser.userRole !== 'admin') { //用户不存在或者不是管理员
      message.error('没有权限!')
      next(`/user/login?redirectTo=${to.fullPath}`)
      return
    }
  }
  next()
})
