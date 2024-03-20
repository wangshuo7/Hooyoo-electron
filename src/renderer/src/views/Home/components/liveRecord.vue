<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('liveLog.live_log')"
    width="1300px"
    top="5vh"
    @close="closeLiveRecordDialog"
  >
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%; height: 700px"
      border
    >
      <el-table-column label="ID" width="60">
        <template #default="{ row }">{{ row.zhibo_log_id }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.anchor')">
        <template #default="{ row }">{{ row.zhubo_name }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.avatar')">
        <template #default="{ row }">
          <div style="width: 100%; height: 100%">
            <img
              :src="row.header_img"
              alt=""
              style="width: 50px; height: auto"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.game')">
        <template #default="{ row }">{{ row.game_name }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.live_start')">
        <template #default="{ row }">{{ formatTime(row.kbtime) }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.live_end')">
        <template #default="{ row }">{{ formatTime(row.xbtime) }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.live_time')">
        <template #default="{ row }">{{
          convertTimestampsToString(row.kbtime, row.xbtime)
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.gift_income')">
        <template #default="{ row }">{{
          row.is_php_jisuan == 2 ? row.lw_price_req : $t('liveLog.computed')
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.kou_diamond')">
        <template #default="{ row }">{{
          row.is_php_jisuan == 2 ? row.lw_price : $t('liveLog.computed')
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.kou_diamond_log')" max-width="210">
        <template #default="{ row }">
          <el-button type="success" @click="viewDiamondLog(row.zhibo_log_id)">{{
            $t('liveLog.view_button')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="total, prev, pager, next"
        :total="totalItems"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-dialog>
  <!-- 扣钻记录 -->
  <el-dialog
    v-model="diamondLogVisible"
    :title="$t('liveLog.kou_diamond_log')"
    @close="closeDiamondLog"
  >
    <el-table :data="diamondTable" border style="max-height: 50vh">
      <el-table-column :label="$t('liveLog.kou_diamond')">
        <template #default="{ row }">{{ row.del_jifen_price }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.gift_income')">
        <template #default="{ row }">{{ row.del_jifen_price_req }}</template>
      </el-table-column>
      <el-table-column :label="$t('liveLog.kou_time')">
        <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage_log"
        background
        layout="total, prev, pager, next"
        :total="totalItems_log"
        @current-change="handleLogCurrentChange"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Moment from 'moment'
import { deductDiamond, getLiveRecording } from '../../../api/live'
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const diamondLogVisible = ref<boolean>(false)
const diamondTable = ref<any>()
const loading = ref<boolean>(false)
const tableData = ref<any>()

const currentPage = ref<any>()
const totalItems = ref<any>()
const currentPage_log = ref<any>()
const totalItems_log = ref<any>()
// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
function handleLogCurrentChange(newPage: number) {
  currentPage_log.value = newPage
  queryLog()
}
async function query() {
  try {
    loading.value = true
    const response = await getLiveRecording({
      page: currentPage.value
    })
    tableData.value = response?.data?.list
    totalItems.value = response?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
const logId = ref<any>()
async function queryLog() {
  const res: any = await deductDiamond({
    page: currentPage_log.value,
    zhibo_log_id: logId.value
  })
  diamondTable.value = res.data.list
  totalItems_log.value = res.data.count
}
function viewDiamondLog(id: any) {
  diamondLogVisible.value = true
  logId.value = id
  queryLog()
}
function closeDiamondLog() {
  logId.value = null
}
// 计算时长
function convertTimestampsToString(startTime: number, endTime: number) {
  if (endTime === 0) {
    return '-'
  }
  const timeDiffInSeconds = Math.abs(endTime - startTime)
  const days = Math.floor(timeDiffInSeconds / (24 * 60 * 60))
  const hours = Math.floor((timeDiffInSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((timeDiffInSeconds % (60 * 60)) / 60)
  const seconds = timeDiffInSeconds % 60
  let result = ''
  if (days > 0) {
    result += days + '天'
  }
  if (hours > 0) {
    result += hours + '时'
  }
  if (minutes > 0) {
    result += minutes + '分'
  }
  if (seconds > 0) {
    result += seconds + '秒'
  }
  if (result === '') {
    result = '0秒'
  }
  return result
}
// 时间格式化
function formatTime(time: number) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
}
const emits = defineEmits(['close'])
function closeLiveRecordDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    if (val) {
      query()
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 20px;
  margin-right: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
