<template>
  <el-dialog
    v-model="settingVisible"
    :title="$t('setting.title')"
    width="500px"
    @close="closeSettingDialog"
  >
    <el-form :form="form" inline class="setting-form">
      <div class="form-item-title">{{ $t('setting.download_url') }}</div>
      <el-form-item prop="download">
        <el-input v-model.trim="form.download"></el-input>
      </el-form-item>
      <el-form-item
        ><el-button @click="changeDownloadPath">{{
          $t('buttons.modify')
        }}</el-button></el-form-item
      >
      <div class="form-item-title">{{ $t('setting.install_url') }}</div>
      <el-form-item prop="install">
        <el-input v-model.trim="form.install"></el-input>
      </el-form-item>
      <el-form-item
        ><el-button @click="changeInstallPath">{{
          $t('buttons.modify')
        }}</el-button></el-form-item
      >
      <div>
        <el-button type="info" @click="onDefault">{{
          $t('setting.default')
        }}</el-button>
      </div>
    </el-form>
    <template #footer>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        "
      >
        <span>ver {{ appVersion }}</span>
        <div class="btns">
          <el-button @click="settingVisible = false">{{
            $t('buttons.cancel')
          }}</el-button>
          <el-button type="primary" @click="onChangePaths">{{
            $t('buttons.confirm')
          }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useGlobalStore } from '../../store/globalStore'
const globalStore = useGlobalStore()
const form = ref<any>({})
const settingVisible = ref<boolean>(false)

const appVersion = computed(() => {
  return globalStore.appVersion
})
window.api.getPathReply((paths: any) => {
  form.value.download = paths.downloadPath
  form.value.install = paths.installPath
})
function changeDownloadPath() {
  const options = {
    title: '选择下载路径',
    defaultPath: form.value.download,
    properties: ['openDirectory']
  }
  window.api.openDialog('download', options)
}
window.api.getDownloadPath((path) => {
  form.value.download = path
})
function changeInstallPath() {
  const options = {
    title: '选择安装路径',
    defaultPath: form.value.install,
    properties: ['openDirectory']
  }
  window.api.openDialog('install', options)
}
window.api.getInstallPath((path) => {
  form.value.install = path
})
// 最终确定
function onChangePaths() {
  if (!isDrivePath(form.value.download)) {
    return ElMessage.error('请检查下载路径格式')
  }
  if (!isDrivePath(form.value.install)) {
    return ElMessage.error('请检查安装路径格式')
  }
  const paths = {
    downloadPath: form.value.download,
    installPath: form.value.install
  }
  window.api.changeStore(paths)
  return (settingVisible.value = false)
}
// 检查是否为盘符路径
function isDrivePath(path) {
  const drivePathRegex =
    /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/
  return drivePathRegex.test(path)
}
// 恢复默认
function onDefault() {
  window.api.settingDefault()
}
window.api.settingDefaultReply((paths) => {
  form.value.download = paths.downloadPath
  form.value.install = paths.installPath
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeSettingDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    settingVisible.value = val
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.setting-form {
  .el-input {
    width: 300px;
  }
}
.form-item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
</style>
