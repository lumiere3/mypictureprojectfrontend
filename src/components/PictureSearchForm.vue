<template>
  <div class="pictureSearchForm">
    <!-- {{ searchParams }} -->
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
          <!-- 图片分类 -->
          <a-form-item name="category" label="图片分类">
            <a-auto-complete
              v-model:value="searchParams.category"
              style="min-width: 90px"
              placeholder="输入图片分类"
              :options="categoryOptions"
              allow-clear
            />
          </a-form-item>
          <a-form-item name="tags" label="图片标签">
            <a-select
              mode="tags"
              style="min-width: 90px"
              v-model:value="searchParams.tags"
              placeholder="输入图片标签"
              :options="tagsOptions"
              allow-clear
            />
          </a-form-item>
          <!-- 以编辑时间搜索 -->
          <a-form-item label="编辑时间" name="dateRange">
            <a-range-picker
              v-model:value="dataRange"
              show-time
              :placeholder="['开始时间', '结束时间']"
              format="YYYY/MM/DD HH:mm:ss"
              style="width: 350px"
              :presets="rangePresets"
              @change="onRangeChange"
              allow-clear
            />
          </a-form-item>
          <!-- 以图片名称搜索 -->
          <a-form-item label="图片名称" name="name">
            <a-input v-model:value="searchParams.name" placeholder="请输入图片名称" allow-clear />
          </a-form-item>
          <!-- 以图片简介搜索 -->
          <a-form-item label="图片简介" name="introduction">
            <a-input
              v-model:value="searchParams.introduction"
              placeholder="请输入图片简介"
              allow-clear
            />
          </a-form-item>
          <!-- 以图片宽度搜索 -->
          <a-form-item label="图片宽度" name="picWidth">
            <a-input-number
              v-model:value="searchParams.picWidth"
              placeholder="请输入图片宽度"
              allow-clear
            />
          </a-form-item>
          <!-- 以图片高度搜索 -->
          <a-form-item label="图片高度" name="picHeight">
            <a-input-number
              v-model:value="searchParams.picHeight"
              placeholder="请输入图片高度"
              allow-clear
            />
          </a-form-item>
          <!-- 以图片格式搜索 -->
          <a-form-item label="图片格式" name="picFormat">
            <a-input
              v-model:value="searchParams.picFormat"
              placeholder="请输入图片格式"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" size="middle">
                <template #icon>
                  <SearchOutlined />
                </template>
                搜索
              </a-button>
              <a-button html-type="reset" size="middle" @click="doReset">
                <template #icon>
                  <RedoOutlined />
                </template>
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import {
  listPictureTagCategoryUsingGet,
  searchPictureByColorUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'


interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}

const props = defineProps<Props>()

// 定义一个搜索条件
const searchParams = reactive<API.PictureQueryRequest>({})

// 搜索栏方法
const doSearch = () => {
  props.onSearch?.(searchParams)
}

//时间搜索
const dataRange = ref<[]>([])

type RangeValue = [Dayjs, Dayjs]
const onChange = (date: Dayjs) => {
  if (date) {
    console.log('Date: ', date)
  } else {
    console.log('Clear')
  }
}
// 改变时间
const onRangeChange = (dates: any, dateStrings: string[]) => {
  if (dates?.length >= 2) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}

//预设的时间范围
const rangePresets = ref([
  { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '最近一个月', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '最近三个月', value: [dayjs().add(-90, 'd'), dayjs()] },
])
// 获取后端的默认分类
const categoryOptions = ref<string[]>([])
const tagsOptions = ref<string[]>([])
//从后端获取

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagsOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取分类和标签失败 ' + res.data.message)
  }
}
// 进入页面的时候获取数据
onMounted(() => {
  getTagCategoryOptions()
})
// 搜索条件重置
const doReset = () => {
  // 重置搜索条件，把searchParams的值都设置为undefined
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  // 重置时间
  dataRange.value = []
  //重新搜索
  props.onSearch?.(searchParams)
}


</script>

<style scoped>
.pictureSearchForm .ant-form-item {
  margin-top: 12px;
}
</style>
