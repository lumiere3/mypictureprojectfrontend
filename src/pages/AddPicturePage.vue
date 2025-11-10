<template>
  <div class="addPicturePage">
    <h2 style="margin-bottom: 16px">创建图片</h2>
    <!-- 图片上传组件 -->
    <PictureUpload :picture="picture" :on-success="onSuccess" />
    <!-- 图片信息表单 -->
    <a-form name="pictureForm" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="name" label="图片名称">
        <a-input v-model:value="pictureForm.name" placeholder="输入图片名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="图片简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="输入图片简介"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category" label="图片分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="输入图片分类"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="图片标签">
        <a-select
          mode="tags"
          v-model:value="pictureForm.tags"
          placeholder="输入图片标签"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost, listPictureTagCategoryUsingGet } from '@/api/pictureController'
import { useRouter } from 'vue-router'
// 一个用于接收前端输入的值

const pictureForm = reactive<API.PictureEditRequest>({})

const picture = ref<API.PictureVO>()
const router = useRouter()

/**
 * 图片上传成功, 解析图片信息
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

//提交
const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id
  if (pictureId == null) {
    return
  }
  //调用方法
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败 ' + res.data.message)
  }
}

//获取后端的默认分类
const categoryOptions = ref<string[]>([])
const tagsOptions = ref<string[]>([])
//从后端获取

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagsOptions.value = res.data.data.tagList ?? []
    categoryOptions.value = res.data.data.categoryList ?? []
  }else {
    message.error('获取分类和标签失败 ' + res.data.message)
  }
}
</script>

<style scoped>
.addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
