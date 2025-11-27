<template>
  <div id="PictureDetailPage">
    <!-- 展示图片 一行两页: 左侧展示大图, 右侧展示图片详情 -->
    <a-row :gutter="[16, 16]">
      <a-col :sm="24" :md="12" :xl="16">
        <a-card title="图片预览">
          <a-image :src="picture.url" style="max-width: 600px; object-fit: contain"> </a-image>
        </a-card>
      </a-col>
      <!-- 展示图片信息 -->
      <a-col :sm="24" :md="12" :xl="8">
        <a-card title="图片详情">
          <a-descriptions :column="1">
            <a-descriptions-item label="上传者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="图片名称">{{
              picture.name ?? '未命名'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片简介">{{
              picture.introduction ?? '无'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片分类">{{
              picture.category ?? '默认'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片标签">
              <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">{{ picture.picFormat ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="图片宽度">{{
              picture.picWidth ?? '-'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片高度">{{
              picture.picHeight ?? '-'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片宽高比">{{
              picture.picScale ?? '-'
            }}</a-descriptions-item>
            <a-descriptions-item label="图片大小">{{
              formatSize(picture.picSize)
            }}</a-descriptions-item>
          </a-descriptions>
          <!-- 补充一个操作 -->
          <a-space wrap>
            <template v-if="canEditOrDelete">
              <a-button  @click="doEdit">
              <template #icon>
                <EditOutlined />
              </template>
              编辑图片
            </a-button>
            </template>
            <template v-else>
              <!-- 否则不能编辑 -->
            <a-tooltip  placement="top" title="没有编辑权限">
              <a-button disabled>
                <template #icon>
                  <DeleteOutlined />
                </template>
                编辑图片
              </a-button>
            </a-tooltip>
            </template>
            <!-- 删除图片同理 -->
            <template v-if="canEditOrDelete">
              <a-popconfirm
              title="确定要删除图片吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doDelete"
            >
              <a-button  danger>
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除图片
              </a-button>
            </a-popconfirm>
            </template>
            <template v-else>
              <a-tooltip placement="top" title="没有删除权限">
              <a-button disabled>
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除图片
              </a-button>
            </a-tooltip>
            </template>
            <!-- 下载图片 -->
            <a-button @click="doDownload" type="primary">
              <template #icon>
                <DownloadOutlined />
              </template>
              下载图片
            </a-button>
            <!-- 快捷审核  -->
<!--            <template v-if="canReview">
              <a-button  @click="showReview">
                <template #icon>
                  <SelectOutlined  />
                </template>
                审核图片
              </a-button>
            </template>-->
          </a-space>
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined, DownloadOutlined ,CloseSquareOutlined,SelectOutlined} from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost, getPictureByIdUsingGet,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { downloadImage, formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import router from '@/router'
import { PIC_REVIEW_STATUS_MAP } from '@/constants/picture'

//loginUserStore 来校验用户的权限 -> 只有管理员和图片的上传者才可以修改和删除图片
const loginUserStore = useLoginUserStore()

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
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
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
  fetchDetail()
})
//是否具有编辑和删除图片的权限
const canEditOrDelete = computed(() => {
  const loginUSer = loginUserStore.loginUser
  if (!loginUSer.id) {
    return false
  }
  //检验权限 -> 只有管理员和图片的上传者才可以修改和删除图片
  const user = picture.value.user || {}
  return loginUSer.id === user.id || loginUSer.userRole === 'admin'
})

// 删除图片
const doDelete = async () => {
  const id = picture.value.id
  if (!id) return
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除图片成功!')
    route.back()
  } else {
    message.error('删除失败')
  }
}
// 编辑图片
// 编辑
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId
    }
  })
}

//下载图片
const doDownload = () => {
  downloadImage(picture.value.url)
}

//权限检测 -> 是否能审核 -> 只有管理员可以

</script>

<style scoped>
#PictureDetailPage {
}
</style>
