<template>
  <div id="pictureManagePage">
    <!-- 搜索框 -->
    <a-row justify="space-between">
      <a-col>
        <a-form layout="inline" :model="searchParams" @finish="doSearch">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="搜索图片名称和简介"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="图片类型">
            <a-input v-model:value="searchParams.category" placeholder="搜索图片类型" allow-clear />
          </a-form-item>
          <a-form-item label="图片标签">
            <a-select
              mode="tags"
              v-model:value="searchParams.tags"
              placeholder="输入图片标签"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item name="reviewStatus" label="审核状态">
            <a-select
              v-model:value="searchParams.reviewStatus"
              placeholder="输入审核状态"
              :options="PIC_REVIEW_STATUS_OPTIONS"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col>
        <a-space>
          <a-tooltip
            placement="top"
            title="根据关键词抓取多张图片"
          >
            <a-button type="primary" :href="`/add_picture/batch`">
              <template #icon>
                <FileAddOutlined />
              </template>
              批量导入
            </a-button>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="手动添加单张图片"
          >
            <a-button type="primary" :href="`/add_picture`">
              <template #icon>
                <FileAddOutlined />
              </template>
              添加图片
            </a-button>
          </a-tooltip>
        </a-space>
      </a-col>
    </a-row>

    <div style="margin-bottom: 18px"></div>

    <!-- 表格部分-->
    <a-table :columns="columns" :data-source="dataList" :pagination @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" width="64px"></a-image>
        </template>
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag
              v-for="tag in JSON.parse(record.tags || '[]')" :key="tag"
              color="blue"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'picInfo'">
          <a-space wrap>
            <div>格式: {{ record.picFormat }}</div>
            <div>宽度: {{ record.picWidth }}</div>
            <div>高度: {{ record.picHeight }}</div>
            <div>宽高比: {{ record.picScale }}</div>
            <div>大小: {{ (record.picSize / 1024).toFixed(2) }}KB</div>
          </a-space>
        </template>
        <!-- 审核信息 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <a-space wrap v-if="!record.spaceId">
            <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
            <div>审核信息：{{ record.reviewMessage ?? '-' }}</div>
            <div>审核人：{{ record.reviewerId ?? '-' }}</div>
          </a-space>
          <a-space v-else>
            <div>私有图库无需审核</div>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <!-- 操作列-->
        <template v-else-if="column.key === 'action'">
          <div>
            <a-space wrap>
              <!-- 公开图片 -->
              <template v-if="!record.spaceId">
              <a-button
                v-if="PIC_REVIEW_STATUS_ENUM.PASS !== record.reviewStatus"
                @click="doReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
              >
                <template #icon>
                  <CheckSquareOutlined />
                </template>
                审核通过
              </a-button>
              <a-button
                v-if="PIC_REVIEW_STATUS_ENUM.REJECT !== record.reviewStatus"
                danger
                @click="showReject(record)"
              >
                <template #icon>
                  <CloseSquareOutlined />
                </template>
                审核拒绝
              </a-button>
              </template>
              <!-- 私有图片 -->
              <template v-else>
                <a-tooltip
                  placement="top"
                  title="私有图片无法审核"
                >
                  <a-button disabled>
                    <CloseSquareOutlined />
                    私有图片
                  </a-button>
                </a-tooltip>
              </template>

              <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank">
                <template #icon>
                  <EditOutlined />
                </template>
                修改图片
              </a-button>
                <a-popconfirm
                  title="确定要删除图片吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="doDelete(record.id)"
                >
                  <a-button danger >
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                    删除图片
                  </a-button>
                </a-popconfirm>
            </a-space>
          </div>
        </template>
      </template>


    </a-table>
     <!-- 表示审核拒绝图片的弹窗-->
    <a-modal
      v-model:open="openReject"
      title="拒绝图片"
      @ok="handleRejectConfirm"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form :model="currentRecord">
        <a-form-item label="拒绝理由">
          <a-textarea
            v-model:value="currentRecord.reviewMessage"
            placeholder="请输入拒绝理由"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FileAddOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 定义数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)

// 定义一个搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

//分页参数
const pagination = computed(() => {
  return {
    columns: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
  }
})

//获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
    nullSpaceId: true,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.data.message)
  }
}
//我们在页面加载时获取数据, 只会请求一次
onMounted(() => {
  fetchData()
})

// 搜索栏方法
const doSearch = () => {
  // 每次搜索, 都需要把页号恢复至第一页
  searchParams.current = 1
  fetchData()
}

// 改变页数
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 删除图片
const doDelete = async (id: string) => {
  if (!id) return
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除图片成功!')
    //更新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

//审核图片
// 拒绝审核弹窗
const openReject = ref(false)
const currentRecord = ref<API.Picture>({})
const showReject = (record : API.Picture) => {
  currentRecord.value = {
    ...record,
    reviewMessage: '管理员拒绝',
  }
  openReject.value = true
}
// 添加处理拒绝确认的方法
const handleRejectConfirm = async () => {
  await doReview(currentRecord.value, PIC_REVIEW_STATUS_ENUM.REJECT);
  openReject.value = false;
}

const doReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : record.reviewMessage
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewMessage,
    reviewStatus,
  })
  if (res.data.code === 0) {
    message.success('审核操作成功')
    //更新数据
    fetchData()
  } else {
    message.error('审核失败' + res.data.message)
  }
}
</script>

<style scoped></style>
