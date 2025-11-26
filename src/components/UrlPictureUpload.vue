<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 110px)"
        placeholder="请输入图片地址"
      >
      </a-input>
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 110px">
        提交
      </a-button>
    </a-input-group>
    <div class="img-wrapper">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost, uploadPictureUsingPost } from '@/api/pictureController'

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
//用户输入图片文件url地址
const fileUrl = ref<string>('')

const props = defineProps<Props>()
const loading = ref<boolean>(false)
/**
 * 上传图片
 * @param options
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = {fileUrl : fileUrl.value}
    params.spaceId = props.spaceId
    if (!params.fileUrl) {
      message.error('请输入图片地址')
      return
    }
    if (props.picture) {
      params.id = props.picture.id
    }

    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      props.onSuccess?.(res.data.data)
    } else {
      message.error('上传失败')
    }
  } catch (e) {
    console.log('上传失败: ' + e)
    message.error('上传失败: ' + e)
  }
  loading.value = false
}

const imageUrl = ref<string>('')

</script>
<style scoped>
.url-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 360px;
}

.url-picture-upload img-wrapper{
  text-align: center;
  margin-top: 20px;
}
</style>
