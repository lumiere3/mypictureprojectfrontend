<template>
  <div id="userManagePage">
    <!-- 搜索框 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear/>
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
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
            <a-button danger @click="doDelete(record.id)">删除用户</a-button>
            <a-button   @click="doUpdate(record.id) " style="margin-left: 12px">修改用户</a-button>
          </div>

        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, getUserByIdUsingGet, listUserPageVoUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

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
  return{
    columns: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`
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
//修改用户
const doUpdate = (id: string) => {
   // todo
}


// 删除用户
const doDelete = async (id: string) => {
  if(!id) return
  const res = await deleteUserUsingPost({ id })
  if(res.data.code === 0 ) {
    message.success('删除用户成功!')
    //更新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
/*const data = []*/
</script>

<style scoped></style>
