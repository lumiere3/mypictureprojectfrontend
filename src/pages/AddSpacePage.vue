<template>
  <div class="addSpacePage">
    <h2 style="margin-bottom: 16px">
      <!-- 有id就是编辑空间, 没有就是创建 -->
      {{ route.query.id ? '编辑空间' : '创建空间' }}
    </h2>
    <!-- 空间信息表单 -->
    <a-form name="spaceForm" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="spaceName" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="输入空间名称" allow-clear />
      </a-form-item>

      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          placeholder="输入空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%">
          提交
        </a-button>
      </a-form-item>
    </a-form>
    <!-- 展示空间级别的介绍 -->
    <a-card title="空间级别">
      <a-typography-paragraph>
        目前仅允许创建普通版空间, 升级空间请前往
        <a href="/user/space/add" target="_blank">空间升级</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{spaceLevel.text}} : 最大容量 {{formatSize(spaceLevel.maxSize)}}, 最大上传数 :{{spaceLevel.maxCount}}张
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  editSpaceUsingPost,
  getSpaceByIdUsingGet,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet, updateSpaceUsingPost,
} from '@/api/spaceController'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'

const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({})
const space = ref<API.SpaceVO>()
const router = useRouter()

const loading = ref(false)

//空间级别的介绍
const spaceLevelList = ref<API.SpaceLevel[]>([])

//提交
const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id;
  loading.value = true
  //调用方法 -> 根据id判断是创建空间还是编辑空间
  let res;
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...values,
    })
  }else{
     res = await addSpaceUsingPost({
      ...values,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    // 跳转到空间详情页
    router.push({
      path: `/space/${res.data.data}`,
    })
  } else {
    message.error('操作失败 ' + res.data.message)
  }
  loading.value = false
}
/**
 * 获取空间等级的介绍
 */
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间等级介绍失败 ' + res.data.message)
  }
}
onMounted(() => {
  fetchSpaceLevelList()
})

/**
 * 现在我们来实现编辑空间功能
 * 我们在url后面添加空间id, 就像 add_space?spaceId=1
 * 如果有空间id, 表示编辑空间, 否则创建空间
 * 所以我们需要获取空间id, 并且根据空间id获取空间信息
 * 可以使用 useRoute
 */
const route = useRoute()
/**
 * 获取原来空间的信息
 */
const getOldSpace = async () => {
  const id = route.query?.id
  //如果存在空间id, 则获取空间信息
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}
// 首次渲染的时候获取空间信息
onMounted(() => {
  getOldSpace()
})
</script>

<style scoped>
.addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
