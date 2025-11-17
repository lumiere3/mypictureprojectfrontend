<template>
  <div class="addPicturePage">
    <h2 style="margin-bottom: 16px">
      <!-- 有id就是编辑图片, 没有就是创建 -->
      {{'批量导入图片'}}
    </h2>
    <!-- 图片信息表单 -->
    <a-form
      name="formData"
      layout="vertical"
      :model="formData"
      @finish="handleSubmit"
    >
      <a-form-item name="searchText" label="关键词">
        <a-input v-model:value="formData.searchText" placeholder="输入图片关键词" allow-clear />
      </a-form-item>
      <a-form-item name="count" label="图片抓取数量">
        <a-input-number
          v-model:value="formData.count"
          placeholder="输入图片抓取数量"
          style="min-width: 120px"
          :min="1"
          :max="15"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="namePrefix" label="图片名称前缀">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="输入图片名称前缀, 图片名称为前缀加图片序号"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">执行抓取</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureByIdUsingGet,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet, uploadPictureByBatchUsingPost,
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
// 一个用于接收前端输入的值

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 5,
})
const picture = ref<API.PictureVO>()
const router = useRouter()
//选择上传的图片上传方式
const uploadType = ref<'file' | 'url'>('file')

//加载
const loading = ref(false)


//提交
const handleSubmit = async (values: any) => {
  loading.value = true

  //调用方法
  const res = await uploadPictureByBatchUsingPost({
    ...formData
  })

  if (res.data.code === 0 && res.data.data) {
    message.success(`批量导入成功, 一共${res.data.data}条`)
    // 跳转到图片详情页
    router.push({
      path: `/`,
    })
  } else {
    message.error('导入失败 ' + res.data.message)
  }
}
</script>

<style scoped>
.addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
