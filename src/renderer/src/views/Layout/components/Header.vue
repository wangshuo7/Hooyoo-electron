<template>
  <div class="header">
    <div class="left"></div>
    <div class="right">
      <!-- <div class="right-link">
        <div>愿望清单</div>
        <div>购物车</div>
      </div> -->
      <div class="right-info">
        <el-button class="info-item" @click="onSetting">
          <el-icon><Setting /></el-icon>
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
              <el-dropdown-item @click="rechargeVisible = true"
                >充值</el-dropdown-item
              >
              <el-dropdown-item divided @click="logOut"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <div class="info-item">豆</div> -->
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
  <el-dialog v-model="rechargeVisible" title="充值" width="700px">
    <div>
      <span style="font-size: 14px; color: #cfd3dc; margin-right: 20px"
        >充值方式</span
      >
      <el-radio-group v-model="recharge_type" class="recharge-radio">
        <el-radio label="1" size="large">卡密充值</el-radio>
        <el-radio label="2" size="large">微信充值</el-radio>
      </el-radio-group>
    </div>
    <div>
      <span style="font-size: 14px; color: #cfd3dc; margin-right: 20px"
        >充值目标</span
      >
      <el-radio-group v-model="target_type" class="recharge-radio">
        <el-radio label="1" size="large">云豆</el-radio>
        <el-radio label="2" size="large">
          积分
          <el-text type="info" style="margin-left: 10px">
            (积分可用于直播收益抽成)
          </el-text>
        </el-radio>
      </el-radio-group>
    </div>
    <div v-if="recharge_type == '1'" class="recharge-content">
      <el-form
        ref="ruleFormRef"
        :hide-required-asterisk="true"
        :model="rechargeForm"
        inline
      >
        <el-form-item label="充值卡" prop="miyao">
          <el-input
            v-model="form.miyao"
            required
            placeholder="请输入卡密"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="recharge-content">
      <el-form label-width="68px">
        <el-form-item label="充值数额">
          <el-input-number
            v-model="vx_price"
            placeholder="请输入充值数额"
            :min="0"
            controls-position="right"
            style="width: 180px"
          ></el-input-number>
          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="onRechargeWeixin"
          >
            确定
          </el-button>
          <el-button @click="onCancelRechargeWeixin">取消</el-button>
        </el-form-item>
        <el-form-item>
          <el-text v-if="target_type === '2' && vx_price > 0" type="info">
            {{ getJifen }}
          </el-text>
        </el-form-item>
        <!-- <div class="tip">充值金额需在 1-10000 之间</div> -->
      </el-form>
      <div v-if="code_url" class="qrcode-box">
        <img :src="qrcode" alt="QR Code" />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import {
  getPersonalInfo,
  rechargeCard,
  rechargeWeixin,
  checkWeixinOrder
} from '../../../api/wallet'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { getConfig } from '../../../api/golbal'
// 微信充值
const vx_price = ref<number>(0)
const code_url = ref<any>()
const qrcode = useQRCode(code_url)
const router = useRouter()
const form = ref<any>({})
const settingVisible = ref<boolean>(false)
const rechargeVisible = ref<boolean>(false)
const recharge_type = ref<string>('1')
const target_type = ref<string>('1')
const intervalId = ref<any>(null)
const timeoutId = ref<any>(null)
const ratio = ref<any>()
// 退出登录
function logOut() {
  router.push('/login')
  localStorage.setItem('authtoken', '')
}
function getInfo(visible: boolean) {
  visible && viewPersonal()
}

function onSetting() {
  settingVisible.value = true
  window.api.getPath()
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
const info = ref<any>()
async function viewPersonal() {
  const res = await getPersonalInfo()
  info.value = res.data.one
}
onMounted(async () => {
  viewPersonal()
  const res: any = await getConfig()
  ratio.value = +res?.data?.one?.jifenbili
})
watch(
  () => rechargeVisible.value,
  (newVal) => {
    if (newVal === false) {
      recharge_type.value = '1'
      form.value.miyao = undefined
      vx_price.value = 0
      code_url.value = ''
      clearInterval(intervalId.value)
      clearTimeout(timeoutId.value)
    }
  }
)
// 充值
const ruleFormRef = ref<FormInstance>()
const rechargeForm = ref<any>({ miyao: '' })
const getJifen = computed(() => {
  return `${vx_price.value} 元可兑换 ${vx_price.value * ratio.value} 积分`
})
// 卡密-确定
function submit() {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 表单验证通过
      const res: any = await rechargeCard({
        miyao: form.value.miyao,
        type: target_type.value == '1' ? 'yundou' : 'jifen'
      })
      if (res.code === 200) {
        ElMessage.success('充值成功')
        // viewBalance()
        return (rechargeVisible.value = false)
      }
      return ElMessage.error(res.msg)
    } else {
      // 表单验证未通过
      return ElMessage.error('表单验证未通过')
    }
  })
}

// 卡密-取消
function cancel() {
  ruleFormRef.value?.resetFields()
}
const order_id = ref<any>()
// 检查微信订单
async function checkOrder() {
  const res: any = await checkWeixinOrder({ order_id: order_id.value })
  if (res.data.status === 'yes') {
    ElMessage.success('微信充值成功')
    code_url.value = ''
    clearInterval(intervalId.value)
    clearTimeout(timeoutId.value) // 清除超时定时器
    // rechargeVisible.value = false
  }
}

// 微信-确定
async function onRechargeWeixin() {
  try {
    clearTimeout(timeoutId.value) // 清除之前的超时定时器
    clearInterval(intervalId.value) // 清除之前的订单检查定时器
    const send_data = {
      price: vx_price.value,
      type: target_type.value == '1' ? 'yundou' : 'jifen'
    }
    const res: any = await rechargeWeixin(send_data)
    if (res.code === 200) {
      code_url.value = res.data.code_url
      order_id.value = res.data.order_id
      ElMessage.success('请扫描二维码充值')
      intervalId.value = setInterval(async () => {
        await checkOrder()
      }, 5000)
      timeoutId.value = setTimeout(
        () => {
          ElMessage.warning('订单超时，请重新输入二维码')
          code_url.value = ''
          clearInterval(intervalId.value)
        },
        3 * 60 * 1000
      ) // 3分钟
    }
  } catch {
    code_url.value = ''
  }
}
function onCancelRechargeWeixin() {
  vx_price.value = 0
  code_url.value = ''
  clearInterval(intervalId.value)
  clearTimeout(timeoutId.value)
}
watch(
  () => target_type.value,
  () => {
    code_url.value = ''
    clearInterval(intervalId.value)
    clearTimeout(timeoutId.value)
  }
)
onUnmounted(() => {
  clearInterval(intervalId.value)
  clearTimeout(timeoutId.value)
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
// 充值弹框
.recharge-radio {
  margin-bottom: 40px;
}
.recharge-content {
  margin-bottom: 40px;
}
.qrcode-box {
  position: absolute;
  // margin-left: 70px;
  right: 50px;
  bottom: 50px;
}
.tip {
  color: #757575;
  position: absolute;
}
</style>
