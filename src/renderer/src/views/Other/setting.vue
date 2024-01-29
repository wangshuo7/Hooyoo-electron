<template>
  <el-dialog
    v-model="settingVisible"
    title="游戏设置"
    width="500px"
    @close="closeSettingDialog"
  >
    <el-form :form="form" inline class="setting-form">
      <div class="form-item-title">下载地址</div>
      <el-form-item prop="download">
        <el-input v-model.trim="form.download"></el-input>
      </el-form-item>
      <el-form-item
        ><el-button @click="changeDownloadPath">修改</el-button></el-form-item
      >
      <div class="form-item-title">安装地址</div>
      <el-form-item prop="install">
        <el-input v-model.trim="form.install"></el-input>
      </el-form-item>
      <el-form-item
        ><el-button @click="changeInstallPath">修改</el-button></el-form-item
      >
      <div>
        <el-button type="info" @click="onDefault">恢复默认</el-button>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="settingVisible = false">取消</el-button>
      <el-button type="primary" @click="onChangePaths">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
const form = ref<any>({})
const settingVisible = ref<boolean>(false)

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
