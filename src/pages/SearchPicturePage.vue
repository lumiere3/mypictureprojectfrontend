<template>
  <div id="searchPicturePage">
    <!-- 标题 -->
    <h2 style="margin-bottom: 15px">以图搜图</h2>
    <h3 style="margin: 15px 0">原图</h3>
    <!-- 展示原图 -->
    <a-card style="width: 360px">
      <template #cover>
        <img
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
          style="height: 180px; object-fit: cover"
        />
      </template>
    </a-card>
    <h3 style="margin: 15px 0">相似图片</h3>
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a :href="picture.fromUrl" target="_blank">
            <a-card hoverable>
              <template #cover>
                <img :src="picture.thumbUrl" style="height: 240px; object-fit: cover" />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  deletePictureUsingPost,
  getPictureVoByIdUsingGet,
  searchPictureByPictureUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons-vue'

// 定义数据
const picture = ref<API.PictureVO>({})
const route = useRoute()
//图片id
const pictureId = computed(() => {
  return route.query?.pictureId
})
/**
 * 获取原图片信息
 */
const getOldPic = async () => {
  if (!pictureId) {
    message.error('图片id不能为空')
    return
  }

  try {
    const res = await getPictureVoByIdUsingGet({
      id: pictureId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败! ' + res.data.message)
    }
  } catch (e) {
    message.error('获取图片详情失败! ' + e)
  }
}
// 首次渲染的时候获取图片信息
onMounted(() => {
  getOldPic()
})
/**
 * 获取以图搜图结果
 */
const dataList = ref<API.ImageSearchResult[]>([])
//
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try{
  const res = await searchPictureByPictureUsingPost({
    pictureId: pictureId.value,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data
  } else {
    message.error('获取图片详情失败! ' + res.data.message)
  }
  } catch (e) {
    message.error('获取图片详情失败! ' + e)
  }
  loading.value = false
}
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#searchPicturePage {
}
</style>
