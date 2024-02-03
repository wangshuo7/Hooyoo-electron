<template>
  <el-dialog
    v-model="updateVisible"
    title="更新提示"
    width="700px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="update">
      <ul class="update-content">
        <li v-for="(item, index) in update_content" :key="index">
          {{ item.content }}
        </li>
      </ul>
      <div>
        <el-progress
          :percentage="progress"
          :text-inside="true"
          :stroke-width="15"
          striped
          striped-flow
        />
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            /* padding-right: 55px; */
          "
        >
          <span>{{ formatDownloadSpeed(downloadSpeed) }}</span>
          <span>{{ formatSize(current, total) }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const update_content = ref<any>([{ content: '' }])
interface progressObj {
  bytesPerSecond: number
  delta: number
  percent: number
  total: number
  transferred: number
}
const updateVisible = ref<boolean>(false)
const state = ref<any>()
const progress = ref<any>() // 进度
const downloadSpeed = ref<number>(0) // 速度
function formatDownloadSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024 * 1024) {
    return bytesPerSecond.toFixed(0) + ' B/s'
  } else {
    const speedInMB = bytesPerSecond / (1024 * 1024)
    return speedInMB.toFixed(2) + ' MB/s'
  }
}
const current = ref<number>(0)
const total = ref<number>(0)
function formatSize(transferred: number, total: number): string {
  const transferredStr =
    transferred < 1024 * 1024
      ? (transferred / (1024 * 1024)).toFixed(2) + 'M'
      : (transferred / (1024 * 1024)).toFixed(0) + 'M'

  const totalStr =
    total < 1024 * 1024
      ? (total / (1024 * 1024)).toFixed(2) + 'M'
      : (total / (1024 * 1024)).toFixed(0) + 'M'

  return transferredStr + '/' + totalStr
}
window.api.sendMessage('Hello from App.vue!')

window.api.checkUpdates()
window.api.printUpdaterMessage((res) => {
  console.log('res->', res)
  state.value = res
})
// 5. 收到主进程可更新的消息
window.api.updateAvailable((info) => {
  console.log('info->', info)
  updateVisible.value = true
  downloadExe()
})
// 点击立即下载
function downloadExe() {
  window.api.confirmUpdate()
}
window.api.updateDownloaded(() => {
  window.api.updateNow()
})
// 收到进度条信息
window.api.edownloadProgress((data: progressObj) => {
  // console.log('progress->', data)
  progress.value = Math.floor(data.percent)
  downloadSpeed.value = data.bytesPerSecond
  current.value = data.transferred
  total.value = data.total
})
// 更新出错时
window.api.updateError((err) => {
  console.log('err->', err)
})
</script>

<style lang="less" scoped>
.update {
  height: 100px;
  padding: 0 30px;
  .update-content {
    margin-bottom: 30px;
  }
}
li {
  list-style: none;
}
.el-button {
  width: 88px;
}
</style>
