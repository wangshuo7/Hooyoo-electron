<template>
  <el-dialog
    v-model="dialogVisible"
    title="充值"
    width="700px"
    @close="closeRechargeDialog"
  >
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
      </el-form>
      <div v-if="code_url" class="qrcode-box">
        <img :src="qrcode" alt="QR Code" />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ElMessage, FormInstance } from 'element-plus'
import {
  checkWeixinOrder,
  getPersonalInfo,
  rechargeCard,
  rechargeWeixin
} from '../../api/wallet'
import { getConfig } from '../../api/golbal'

const dialogVisible = ref<boolean>(false)
const vx_price = ref<number>(0)
const form = ref<any>({
  miyao: ''
})
const info = ref<any>()
const code_url = ref<any>()
const qrcode = useQRCode(code_url)
const recharge_type = ref<string>('1')
const target_type = ref<string>('1')
const intervalId = ref<any>(null)
const timeoutId = ref<any>(null)
const ratio = ref<any>()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeRechargeDialog() {
  emits('close', false)
}
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
        return (dialogVisible.value = false)
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
async function viewPersonal() {
  const res = await getPersonalInfo()
  info.value = res.data.one
}
watch(
  () => target_type.value,
  () => {
    code_url.value = ''
    clearInterval(intervalId.value)
    clearTimeout(timeoutId.value)
  }
)
onMounted(async () => {
  viewPersonal()
  const res: any = await getConfig()
  ratio.value = +res?.data?.one?.jifenbili
})
watch(
  () => dialogVisible.value,
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
onUnmounted(() => {
  clearInterval(intervalId.value)
  clearTimeout(timeoutId.value)
})
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
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
