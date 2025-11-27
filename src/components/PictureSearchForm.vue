<template>
  <div class="pictureSearchForm">
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
            <a-input v-model:value="searchParams.category" placeholder="搜索图片类型" allow-clear />
          </a-form-item>
          <!-- 以图片标签搜索 -->
          <a-form-item label="图片标签">
            <a-select
              mode="tags"
              v-model:value="searchParams.tags"
              placeholder="输入图片标签"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <!-- 以编辑时间搜索 -->
          <a-form-item label="编辑时间" name="dateRange">
            <a-range-picker
              v-model:value="dateRange"
              show-time
              :placeholder="['开始时间', '结束时间']"
              format="YYYY/MM/DD HH:mm:ss"
              style="width: 350px"
              :presets="rangePresets"
              @change="dateRangeChange"
              allow-clear
            />
          </a-form-item>
          <!-- 以图片名称搜索 -->
          <a-form-item label="图片名称" name="name">
          <a-input
            v-model:value="searchParams.name"
            placeholder="请输入图片名称"
            allow-clear
          />
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
            <a-button type="primary" html-type="submit" size="middle">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import {
  SearchOutlined,
} from '@ant-design/icons-vue'
import { reactive } from 'vue'
import {
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'

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
</script>

<style scoped></style>
