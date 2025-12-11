<template>
  <div class="batch-edit-pic-modal">
    <a-modal v-model:visible="visible" title="批量编辑图片" :footer="false" @cancel="closeModal">
      <a-typography-paragraph type="secondary">
        批量编辑只对当前界面里面的图片生效</a-typography-paragraph
      >
      <!-- 表单项 -->
      <a-form  layout="vertical" :model="formData" @finish="handleSubmit">
        <a-form-item name="category" label="图片分类">
          <a-auto-complete
            v-model:value="formData.category"
            placeholder="输入图片分类"
            :options="categoryOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="tags" label="图片标签">
          <a-select
            mode="tags"
            v-model:value="formData.tags"
            placeholder="输入图片标签"
            :options="tagsOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="nameRule" label="图片名称规则">
          <a-input
            v-model:value="formData.nameRule"
            placeholder="输入命名规则： 名称{序号} "
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults, defineExpose, reactive, onMounted } from 'vue'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
/**
 * 定义组件属性类型
 */
interface Props {
  pictureList: API.PictureVO[]
  spaceId: string
  onSuccess: () => void
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {})

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 暴露函数给父组件
defineExpose({
  openModal,
})

// 初始化表单
const formData = reactive({
  category: '', //  分类
  tags: [], //
  nameRule: '', // 命名规则
})
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


// 提交表单时处理
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('操作失败，' + res.data.message)
  }
}



</script>

<style scoped></style>
