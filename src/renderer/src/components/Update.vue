<template>
  <el-dialog
    v-model="updateVisible"
    :close-on-press-escape="false"
    :title="$t('system.update')"
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
          <span></span>
          <span>{{ bytesToMegabytes() }}M</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getTBoxVersion } from '../api/rc4'
import { useGlobalStore } from '../store/globalStore'
const globalStore = useGlobalStore()
const updateVisible = ref<boolean>(false)
const update_content = ref<any>([{ content: '' }])
const boxVersion = ref<any>() // 远程版本
const appVersion = ref<any>() // 当前版本
const appUrl = ref<string>('')
window.api.mainSendVersion((version) => {
  appVersion.value = version
  globalStore.setAppVersion(version)
})
async function getVersion() {
  const res: any = await getTBoxVersion()
  boxVersion.value = res?.data?.info?.version
  appUrl.value = res?.data?.info?.url
}
// 检查是否需要更新
function checkUpdates() {
  console.log('current', appVersion.value)
  console.log('remote', boxVersion.value)
  const res: boolean = checkUpdateNeeded(appVersion.value, boxVersion.value)
  if (res) {
    updateVisible.value = true
    window.api.updateApp(appUrl.value)
    console.log('需要更新')
  } else {
    console.log('不需要更新')
  }
}
/**
 * 检查当前版本是否需要更新
 * @param {string} currentVersion 当前版本号
 * @param {string} remoteVersion 远程版本号
 * @returns {boolean} 如果需要更新返回true，否则返回false
 */
function checkUpdateNeeded(currentVersion, remoteVersion) {
  const currentParts = currentVersion?.split('.').map(Number)
  const remoteParts = remoteVersion?.split('.').map(Number)

  for (
    let i = 0;
    i < Math.max(currentParts?.length, remoteParts?.length);
    i++
  ) {
    const currentPart = currentParts[i] || 0
    const remotePart = remoteParts[i] || 0

    if (currentPart < remotePart) {
      return true
    } else if (currentPart > remotePart) {
      return false
    }
  }
  // 如果所有版本号相同，则不需要更新
  return false
}
onMounted(async () => {
  await getVersion()
  await checkUpdates()
})
const progress = ref<number>(0)
const totalSize = ref<number>(0)
function bytesToMegabytes() {
  return (totalSize.value / (1024 * 1024)).toFixed(2)
}
window.api.downloadAppProgress((data) => {
  progress.value = data?.progress
  totalSize.value = data?.totalSize
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
