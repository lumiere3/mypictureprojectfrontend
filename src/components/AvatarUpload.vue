<template>
   <div class="picture-upload">
     <a-upload
       list-type="picture-card"
       :show-upload-list="false"
       :custom-request="handleUpload"
       :before-upload="beforeUpload"
     >
       <img v-if="innerImageUrl" :src="innerImageUrl" alt="avatar" />
       <div v-else>
         <loading-outlined v-if="loading"></loading-outlined>
         <plus-outlined v-else></plus-outlined>
         <div class="ant-upload-text">点击或拖拽上传图片</div>
       </div>
     </a-upload>
   </div>
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { getUserAvatarUsingPost } from '@/api/pictureController'

interface Props{
  imageUrl?: string;
  onSuccess?:(url: string)=>void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:imageUrl', value: string): void
}>();

const loading = ref<boolean>(false);
const innerImageUrl = ref<string>('');

// 监听 props.imageUrl 的变化
watch(
  () => props.imageUrl,
  (newVal) => {
    innerImageUrl.value = newVal || ''
  },
  { immediate: true }
);

/**
 * 上传图片
 * @param options
 */
const handleUpload = async ({file}: any) => {
  loading.value = true;
  try{
    const res = await getUserAvatarUsingPost({}, file)
    if(res.data.code === 0 && res.data.data){
      message.success('上传成功')
      const url = res.data.data.userAvatar || ''
      innerImageUrl.value = url
      // 通知父组件更新 imageUrl
      emit('update:imageUrl', url)
      props.onSuccess?.(url)
    }else {
      message.error('上传失败')
    }
  }
  catch (e) {
    console.log('上传失败: ' + e)
    message.error('上传失败: ' + e)
  }
  loading.value = false;
};

/**
 * 前端校验文件
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式错误! 推荐使用 .jpg 或 .png 格式');
  }
  const isLt2M = file.size / 1024 / 1024 < 3;
  if (!isLt2M) {
    message.error('不支持大于3M的图片上传!');
  }
  return isJpgOrPng && isLt2M;
};
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 152px !important;
  height: 152px !important;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picture-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>