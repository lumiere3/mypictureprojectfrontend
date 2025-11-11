<template>
  <div id="PictureDetailPage">
    <!-- 展示图片 一行两页: 左侧展示大图, 右侧展示图片详情 -->
    <a-row :gutter="[16,16]">
      <a-col :sm="24" :md="12" :xl="16">
        <a-card title="图片预览">
          <a-image :src="picture.url" style="max-width: 600px; object-fit: contain" >
          </a-image>
        </a-card>
      </a-col>
      <!-- 展示图片信息 -->
      <a-col :sm="24" :md="12" :xl="8">
        <a-card title="图片详情">
          <a-descriptions :column="1">
            <a-descriptions-item label="上传者">
              <a-space >
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{picture.user?.userName}}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="图片名称">{{picture.name ?? '未命名'}}</a-descriptions-item>
            <a-descriptions-item label="图片简介">{{picture.introduction ?? '无'}}</a-descriptions-item>
            <a-descriptions-item label="图片分类">{{picture.category ?? '默认'}}</a-descriptions-item>
            <a-descriptions-item label="图片标签">
              <a-tag v-for="tag in picture.tags" :key="tag">{{tag}}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">{{picture.picFormat ?? '-'}}</a-descriptions-item>
            <a-descriptions-item label="图片宽度">{{picture.picWidth ?? '-'}}</a-descriptions-item>
            <a-descriptions-item label="图片高度">{{picture.picHeight ?? '-'}}</a-descriptions-item>
            <a-descriptions-item label="图片宽高比">{{picture.picScale ?? '-'}}</a-descriptions-item>
            <a-descriptions-item label="图片大小">{{formatSize(picture.picSize)}}</a-descriptions-item>
          </a-descriptions>
          <!-- 补充一个操作 -->
          <a-space>
            <a-button type="link" :href="`/add_picture?${record.id}`" target="_blank">
              编辑
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { formatSize } from '@/utils'

// 定义数据
const props = defineProps<{
  id: string | number
}>()
const picture = ref<API.PictureVO>({})
const route = useRouter()

/**
 * 获取图片信息
 */
const fetchDetail = async () => {
  try{
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    }else{
      message.error("获取图片详情失败! " + res.data.message)
    }
  }catch (e){
    message.error("获取图片详情失败! " + e)
  }

}
// 首次渲染的时候获取图片信息
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
#PictureDetailPage {

}
</style>
