<template>
  <div id="pictureManagePage">
    <!-- 搜索框 -->
    <a-row justify="space-between">
      <a-col>
        <a-form layout="inline" :model="searchParams" @finish="doSearch">
          <a-form-item label="空间名称">
            <a-input
              v-model:value="searchParams.spaceName"
              placeholder="请输入空间名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="用户 id">
            <a-input v-model:value="searchParams.userId" placeholder="请输入用户id" allow-clear />
          </a-form-item>

          <a-form-item name="spaceLevel" label="空间级别">
            <a-select
              v-model:value="searchParams.spaceLevel"
              placeholder="输入空间级别"
              :options="SPACE_LEVEL_OPTIONS"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col>
        <a-space>
            <a-button type="primary" :href="`/add_space`">
              <template #icon>
                <FileAddOutlined />
              </template>
              创建空间
            </a-button>
        </a-space>
      </a-col>
    </a-row>

    <div style="margin-bottom: 18px"></div>

    <!-- 表格部分-->
    <a-table :columns="columns" :data-source="dataList" :pagination @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <!-- 展示空间级别 -->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-space wrap>
            <div>空间等级：{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
          </a-space>
        </template>
        <!-- 空间的使用情况展示 -->
        <template v-if="column.dataIndex === 'spaceUserInfo'">
          <a-space wrap>
            <div>使用量: {{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
            <div>使用数: {{ record.totalCount }} / {{ record.maxCount }}</div>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <!-- 操作列-->
        <template v-else-if="column.key === 'action'">
          <div>
            <a-space wrap>
              <a-button type="link" :href="`/add_space?id=${record.id}`" target="_blank">
                <template #icon>
                  <EditOutlined />
                </template>
                修改空间
              </a-button>
              <a-popconfirm
                title="确定要删除图片吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="doDelete(record.id)"
              >
                <a-button danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除空间
                </a-button>
              </a-popconfirm>
            </a-space>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FileAddOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { doPictureReviewUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUserInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 定义数据
const dataList = ref<API.Space[]>([])
const total = ref(0)

// 定义一个搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
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
  const res = await listSpaceByPageUsingPost({
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

// 删除图片
const doDelete = async (id: string) => {
  if (!id) return
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除图片成功!')
    //更新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped></style>
