<template>
  <div class="PictureList">

    <!-- 图片展示列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 240px; object-fit: cover"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags || '[]'" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <!--*--  卡片的快捷操作 ----->
            <template #actions v-if="showOp">
              <a-space @click="e => doEdit(picture, e)">
                <editOutlined />
                编辑
              </a-space>
              <a-popconfirm
                title="确定删除图片吗？"
                okText="确定"
                cancelText="取消"
                @confirm="e => doDelete(picture, e)"
                @click="e => e.stopPropagation()">
                <a-space>
                  <deleteOutlined />
                  删除
                </a-space>
              </a-popconfirm>
            </template>

          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

interface Props {
  dataList?: API.Picture[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
})

//点击图片跳转
const router = useRouter()
const doClickPicture = (picture: API.Picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
// 编辑
const doEdit = (picture, e) => {
  // 阻止事件冒泡
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}
// 删除
const doDelete = async (picture, e) => {
  // 阻止事件冒泡
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 让外层刷新
    props?.onReload()
  } else {
    message.error('删除失败')
  }
}

</script>

<style scoped>
</style>
