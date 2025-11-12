<template>
  <div id="pictureManagePage">
    <!-- 搜索框 -->
    <a-row justify="space-between">
      <a-col>
        <a-form layout="inline" :model="searchParams" @finish="doSearch">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="搜索图片名称和简介"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="图片类型">
            <a-input
              v-model:value="searchParams.category"
              placeholder="搜索图片类型"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="图片标签">
            <a-select
              mode="tags"
              v-model:value="searchParams.tags"
              placeholder="输入图片标签"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <template #icon >
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col>
        <a-button type="primary" :href="`/add_picture`">
          <template #icon >
            <FileAddOutlined />
          </template>
          添加图片
        </a-button>
      </a-col>
    </a-row>

    <div style="margin-bottom: 18px"></div>

    <!-- 表格部分-->
    <a-table :columns="columns" :data-source="dataList" :pagination @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" width="64px"></a-image>
        </template>
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'picInfo'">
          <a-space wrap>
            <div>格式: {{ record.picFormat }}</div>
            <div>宽度: {{ record.picWidth }}</div>
            <div>高度: {{ record.picHeight }}</div>
            <div>宽高比: {{ record.picScale }}</div>
            <div>大小: {{ (record.picSize / 1024).toFixed(2) }}KB</div>
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
              <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank">
                <template #icon >
                  <EditOutlined />
                </template>
                修改图片
              </a-button>
              <a-button danger @click="doDelete(record.id)">
                <template #icon >
                  <DeleteOutlined />
                </template>
                删除图片
              </a-button>
            </a-space>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { DeleteOutlined, EditOutlined ,SearchOutlined, FileAddOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  getPictureByIdUsingGet,
  listPictureByPageUsingPost,
  listPictureVoUsingPost,
  updatePictureUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useLoginPictureStore } from '@/stores/useLoginPictureStore'
import PictureAddRequest = API.PictureAddRequest



const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
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
const dataList = ref<API.Picture[]>([])
const total = ref(0)

// 定义一个搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
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
  const res = await listPictureByPageUsingPost({
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
  const res = await deletePictureUsingPost({ id })
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
