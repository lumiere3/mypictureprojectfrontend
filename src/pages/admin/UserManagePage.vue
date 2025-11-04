<template>
  <div id="userManagePage">
    <!-- 搜索框 -->
    <a-row justify="space-between">
      <a-col>
        <a-form layout="inline" :model="searchParams" @finish="doSearch">
          <a-form-item label="账号">
            <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <!--添加新用户 -->
      <a-col>
        <a-button type="primary" @click="showModal">添加新用户</a-button>
        <a-modal
          v-model:visible="visible"
          title="添加新用户"
          ok-text="添加"
          cancel-text="取消"
          @ok="doAddUser"
        >
          <a-form :model="formState">
            <a-form-item
              name="userAccount"
              label="用户账号"
              :rules="[
                { required: true, message: '必须输入用户账号!' },
                { min: 4, message: '账号不能小于4位' },
              ]"
            >
              <a-input v-model:value="formState.userAccount" placeholder="请输入账号" allow-clear />
            </a-form-item>
            <a-form-item name="userName" label="用户昵称">
              <a-input
                v-model:value="formState.userName"
                placeholder="请输入用户昵称"
                allow-clear
              />
            </a-form-item>
            <a-form-item name="userProfile" label="用户简介">
              <a-textarea
                v-model:value="formState.userProfile"
                placeholder="请输入简介"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              name="userRole"
              label="用户权限"
              :rules="[
                {
                  required: true,
                  message: '请选择用户权限',
                },
              ]"
            >
              <a-radio-group v-model:value="formState.userRole">
                <a-radio value="user">普通用户</a-radio>
                <a-radio value="admin">管理员</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-col>
    </a-row>

    <div style="margin-bottom: 18px"></div>

    <!-- 表格部分-->
    <a-table :columns="columns" :data-source="dataList" :pagination @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" width="64px"></a-image>
        </template>

        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else-if="record.userRole === 'user'">
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <!-- 操作列-->
        <template v-else-if="column.key === 'action'">
          <div>
            <a-button
              v-if="record.id !== loginUserStore.loginUser.id"
              danger
              @click="doDelete(record.id)"
              >删除用户</a-button
            >
            <a-tooltip
              v-if="record.id === loginUserStore.loginUser.id"
              placement="top"
              title="不能删除自己"
            >
              <a-button disabled>删除用户</a-button>
            </a-tooltip>
            <a-button @click="showUpdateModal(record)" style="margin-left: 12px">修改用户</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 修改用户信息的弹窗表单 -->
    <a-modal
      v-model:visible="updateVisible"
      title="修改当前用户信息"
      ok-text="修改"
      cancel-text="取消"
      @ok="doUpdate"
    >
      <a-form :model="updateFormState">
        <a-form-item name="userAccount" label="用户账号">
          <a-input v-model:value="updateFormState.userAccount" readonly />
        </a-form-item>
        <a-form-item name="userName" label="用户昵称">
          <a-input
            v-model:value="updateFormState.userName"
            placeholder="请输入用户昵称"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="userProfile" label="用户简介">
          <a-textarea
            v-model:value="updateFormState.userProfile"
            placeholder="请输入简介"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          name="userRole"
          label="用户权限"
          :rules="[{ required: true, message: '请选择用户权限' }]"
        >
          <a-radio-group v-model:value="updateFormState.userRole">
            <a-radio value="user">普通用户</a-radio>
            <a-radio value="admin">管理员</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  addUserUsingPost,
  deleteUserUsingPost,
  getUserByIdUsingGet,
  listUserPageVoUsingPost,
  updateUserUsingPost,
} from '@/api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import UserAddRequest = API.UserAddRequest

//当前的登录用户
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 定义数据
const dataList = ref<API.UserVO>([])
const total = ref(0)

// 定义一个搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})

//分页参数
const pagination = computed(() => {
  return {
    columns: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
  }
})

//获取数据
const fetchData = async () => {
  const res = await listUserPageVoUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.data.message)
  }
}
//我们在页面加载时获取数据, 只会请求一次
onMounted(() => {
  fetchData()
})

// 搜索栏方法
const doSearch = () => {
  // 每次搜索, 都需要把页号恢复至第一页
  searchParams.current = 1
  fetchData()
}

// 改变页数
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

//控制新用户的表单 - 弹窗显示
const visible = ref(false)
//展示新增用户弹窗
const showModal = () => {
  visible.value = true
}

//默认用户数据表单
const defaultFormState = reactive<API.UserAddRequest>({
  //默认权限为普通用户
  userAccount: '',
  userName: '',
  userProfile: '',
  userAvatar: '',
  userRole: 'user',
})
//新建用户的数据表单
const formState = reactive<API.UserAddRequest>({
  ...defaultFormState,
})

//新增用户
const doAddUser = async () => {
  // todo
  const res = await addUserUsingPost(formState)
  if (res.data.code === 0) {
    message.success('添加用户成功!')
    //更新数据
    await fetchData()
    //关闭窗口
    visible.value = false
    //清空新增用户列表, 恢复至初始状态
    Object.assign(formState, defaultFormState)
  } else {
    message.error('添加用户失败' + res.data.message)
  }
}

// 删除用户
const doDelete = async (id: string) => {
  if (!id) return
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除用户成功!')
    //更新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

//修改用户弹窗控制
const updateVisible = ref(false)

// 展示修改用户弹窗
const showUpdateModal = (record) => {
  updateVisible.value = true
  Object.assign(updateFormState, record)
}

//修改用户数据表单
const updateFormState = reactive<API.UserAddRequest>({})

//修改用户
const doUpdate = async (id: string) => {
  const res = await updateUserUsingPost(updateFormState)
  if (res.data.code === 0) {
    message.success('修改用户成功!')
    //更新数据
    await fetchData()
    //关闭窗口
    updateVisible.value = false
    message.info('修改用户成功!' )
    // todo
  } else {
    message.error('修改用户失败' + res.data.message)
  }
}
</script>

<style scoped></style>
