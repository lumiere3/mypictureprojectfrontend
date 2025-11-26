<template>
  <div id="homePage">
    <!--  搜索框 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="请输入关键词"
        enter-button="搜索"
        size="large"
        @search="onSearch"
      />
    </div>
    <!-- 显示标签和分类 -->
    <!--分类 -->
    <a-tabs v-model:active-key="selectedCategory" @change="onSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :tab="category" :key="category" />
    </a-tabs>
    <!-- 标签-->
    <div class="tags-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagsList"
          :key="tag"
          v-model:checked="selectedTags[index]"
          @change="onSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片展示列表 -->
    <PictureList :dataList="dataList" :loading="loading"  />
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
import { onMounted, reactive, ref } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageWithCacheUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import PictureList from '@/components/PictureList.vue'

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

//获取数据
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  //如果选择了分类
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  // 标签的处理
  selectedTags.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagsList.value[index])
    }
  })

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
//关键词搜索
const onSearch = (value: string) => {
  //重置搜索页为1
  searchParams.current = 1
  fetchData()
}
//获取后端的默认分类
const categoryList = ref<string[]>([])
const tagsList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const selectedTags = ref<string[]>([])
//从后端获取

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagsList.value = res.data.data.tagList ?? []
    categoryList.value = res.data.data.categoryList ?? []
  } else {
    message.error('获取分类和标签失败 ' + res.data.message)
  }
}
// 进入页面的时候获取数据
onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style scoped>
#homePage {
  margin-bottom: 12px;
}
.search-bar {
  width: 50%;
  margin: 0 auto 18px;
}

.tags-bar {
  margin: 18px;
}
</style>
