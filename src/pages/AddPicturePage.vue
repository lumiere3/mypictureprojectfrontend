<template>
  <div class="addPicturePage">
    <h2 style="margin-bottom: 16px">
      <!-- 有id就是编辑图片, 没有就是创建 -->
      {{route.query.id ? '编辑图片' : '创建图片'}}
    </h2>
    <!-- 使用tabs组件 选择图片的上传方式 -->
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <!-- 图片上传组件 -->
        <PictureUpload :picture="picture" :on-success="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL上传">
        <!-- 图片上传组件 -> 通过URL -->
        <UrlPictureUpload :picture="picture" :on-success="onSuccess"></UrlPictureUpload>
      </a-tab-pane>
    </a-tabs>
    <!-- 图片信息表单 -->
    <a-form
      v-if="picture"
      name="pictureForm"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
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
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="图片标签">
        <a-select
          mode="tags"
          v-model:value="pictureForm.tags"
          placeholder="输入图片标签"
          :options="tagsOptions"
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
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureByIdUsingGet,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
// 一个用于接收前端输入的值

const pictureForm = reactive<API.PictureEditRequest>({})
const picture = ref<API.PictureVO>()
const router = useRouter()
//选择上传的图片上传方式
const uploadType = ref<'file' | 'url'>('file')

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
/**
 * 现在我们来实现编辑图片功能
 * 我们在url后面添加图片id, 就像 add_picture?pictureId=1
 * 如果有图片id, 表示编辑图片, 否则创建图片
 * 所以我们需要获取图片id, 并且根据图片id获取图片信息
 * 可以使用 useRoute
 */
const route = useRoute()
/**
 * 获取原来图片的信息
 */
const getOldPicture = async () => {
  const id = route.query?.id
  //如果存在图片id, 则获取图片信息
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}
// 首次渲染的时候获取图片信息
onMounted(() => {
  getOldPicture()
})
</script>

<style scoped>
.addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
