<template>
  <div id="SpaceDetailPage">
    <!-----------展示空间信息----------->
    <a-flex justify="space-between" >
      <!-- 空间名称 -->
      <h2>{{space.spaceName}} (私有空间) </h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">上传图片</a-button>
        <!-- 当前空间的容量 -->
        <a-tooltip :title="`空间容量: ${formatSize(space.totalSize)}/${formatSize(space.maxSize)}`">
          <a-progress
            type="circle"
            size="small"
            :percent="((space.totalSize *100 / space.maxSize).toFixed(1))">
          </a-progress>
        </a-tooltip>
      </a-space>
    </a-flex>
   <!-- 搜索页面 --->
    <a-space>
      <picture-search-form></picture-search-form>
    </a-space>
    <!------------展示图片列表---------->
    <!-- 图片展示列表 -->
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" :onReload="fetchAfterDoingDelete"/>
    <!-- 分页 -->
    <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onChangePage"
      style="text-align: right"
      showQuickJumper
      showSizeChanger />
  </div>
</template>

<script setup lang="ts">
import {  onMounted, reactive, ref } from 'vue'
import {  getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { listPictureVoByPageWithCacheUsingPost } from '@/api/pictureController'
import { formatSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'


//loginUserStore 来校验用户的权限 -> 只有管理员和空间的上传者才可以修改和删除空间
const loginUserStore = useLoginUserStore()

// 定义数据
const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})
const route = useRouter()

/**
 * 获取空间信息
 */
const fetchDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败! ' + res.data.message)
    }
  } catch (e) {
    message.error('获取空间详情失败! ' + e)
  }
}
// 首次渲染的时候获取空间信息
onMounted(() => {
  fetchDetail()
})
/**
 * 获取图片
 */
// 定义数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)
//加载
const loading = ref(true)

// 定义一个搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const onChangePage = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

/**
 * 删除图片逻辑, 删除图片后刷新页面,获取图片列表和空间 信息
 */
const fetchAfterDoingDelete = async () => {
  await fetchData()
  await fetchDetail()
}


const fetchData = async () => {
  loading.value = true
  const params = {
    spaceId: props.id,
    ...searchParams,
  }

  const res = await listPictureVoByPageWithCacheUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.data.message)
  }
  loading.value = false
}
//我们在页面加载时获取数据, 只会请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#SpaceDetailPage {
}
</style>
