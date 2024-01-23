<template>
  <div class="header">
    <div class="left"></div>
    <div class="right">
      <div class="right-info">
        <el-button class="info-item" @click="onSetting">
          <el-icon><Setting /></el-icon>
        </el-button>
        <el-button class="info-item" @click="onExchange">
          <span style="font-size: 16px">兑</span>
        </el-button>
        <el-dropdown
          class="info-item"
          trigger="click"
          @visible-change="getInfo"
        >
          <el-avatar
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          >
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu class="dropdown-t">
              <div style="padding: 5px 16px; font-size: 15px">
                {{ info?.nickname }}
              </div>
              <el-dropdown-item
                >余额：{{ info?.current_price }} 云豆</el-dropdown-item
              >
              <el-dropdown-item>积分：{{ info?.jifen }} 积分</el-dropdown-item>
              <el-dropdown-item @click="onRecharge">充值</el-dropdown-item>
              <el-dropdown-item divided @click="logOut"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <el-dialog v-model="settingVisible" title="游戏设置" width="500px">
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
  <Recharge :visible="rechargeVisible" @close="closeRechargeDialog"></Recharge>
  <Exchange :visible="exchangeVisible" @close="closeExchangeDialog"></Exchange>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Exchange from '../../Other/exchange.vue'
import Recharge from '../../Other/recharge.vue'
import { getPersonalInfo } from '../../../api/wallet'
const info = ref<any>()
const router = useRouter()
const form = ref<any>({})
const settingVisible = ref<boolean>(false)
const rechargeVisible = ref<boolean>(false)
const exchangeVisible = ref<boolean>(false)
// 退出登录
function logOut() {
  router.push('/login')
  localStorage.setItem('authtoken', '')
}
async function viewPersonal() {
  const res = await getPersonalInfo()
  info.value = res.data.one
}
function getInfo(visible: boolean) {
  visible && viewPersonal()
}
function onSetting() {
  settingVisible.value = true
  window.api.getPath()
}
function onExchange() {
  exchangeVisible.value = true
}
function closeExchangeDialog() {
  exchangeVisible.value = false
}
function onRecharge() {
  rechargeVisible.value = true
}
function closeRechargeDialog() {
  rechargeVisible.value = false
}

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
</script>

<style lang="less" scoped>
@media screen and (min-width: 2001px) {
  .header {
    width: 100rem;
    margin: 0 auto;
    // padding: 0 2%;
  }
}
@media screen and (max-width: 2000px) {
  .header {
    padding: 0 5%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  // overflow: hidden;
  .el-form-item {
    margin: 0;
  }
  .left {
    display: flex;
    align-items: center;
    .search {
      width: 230px;
      border-radius: 30px;
      overflow: hidden;
      background: #202020;
      display: flex;
      align-items: center;
      margin: 0 30px 0 22px;
      .search-icon {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #757575;
      }
      .search-input {
        // width: 230px;
        height: 40px;
        border: none;
        outline: none;
        background: transparent;
      }
    }
    .dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #f5f5f5;
      .el-icon--right {
        transition: all 0.2s linear;
      }
      .el-icon--right.active {
        transform: rotate(-180deg);
      }
    }
  }
  .right {
    display: flex;
    // align-items: center;
    justify-content: flex-end;
    .right-info {
      // width: 155px;
      // border-left: 1px solid #202020;
      .info-item {
        float: left;
        margin-left: 35px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        background: #202020;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .el-avatar {
          width: 100%;
          height: 100%;
        }
      }
      .info-item:hover {
        background: #2b2b2b;
      }
    }
    .right-link {
      width: 210px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: 14px;
      color: var(--text-menu-color);
      div {
        cursor: pointer;
      }
      div:hover {
        color: #f5f5f5;
      }
    }
  }
}
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
