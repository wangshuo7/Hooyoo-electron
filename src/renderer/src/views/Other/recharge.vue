<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('recharge.title')"
    width="700px"
    @close="closeRechargeDialog"
  >
    <div>
      <span style="font-size: 14px; color: #cfd3dc; margin-right: 20px">{{
        $t('recharge.type')
      }}</span>
      <el-radio-group v-model="recharge_type" class="recharge-radio">
        <el-radio label="1" size="large">{{ $t('recharge.key') }}</el-radio>
        <el-radio label="2" size="large">{{ $t('recharge.vx') }}</el-radio>
      </el-radio-group>
    </div>
    <div>
      <span style="font-size: 14px; color: #cfd3dc; margin-right: 20px">{{
        $t('recharge.target')
      }}</span>
      <el-radio-group v-model="target_type" class="recharge-radio">
        <el-radio label="1" size="large">{{ $t('system.price') }}</el-radio>
        <el-radio label="2" size="large">
          {{ $t('system.diamond') }}
          <el-text type="info" style="margin-left: 10px">
            ({{ $t('recharge.tip') }})
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
        <el-form-item :label="$t('recharge.card')" prop="miyao">
          <el-input
            v-model="form.miyao"
            required
            :placeholder="$t('recharge.card_placeholder')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">{{
            $t('buttons.confirm')
          }}</el-button>
          <el-button @click="cancel">{{ $t('buttons.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="recharge-content">
      <el-form label-width="68px">
        <el-form-item :label="$t('recharge.amount')">
          <el-input-number
            v-model="vx_price"
            :min="0"
            controls-position="right"
            style="width: 180px"
            @input="changePrice"
          ></el-input-number>
          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="onRechargeWeixin"
          >
            {{ $t('buttons.confirm') }}
          </el-button>
          <el-button @click="onCancelRechargeWeixin">{{
            $t('buttons.cancel')
          }}</el-button>
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
import { computedPrice } from '../../api/global'
import { getConfig } from '../../api/global'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const dialogVisible = ref<boolean>(false)
const vx_price = ref<number>(0)
const form = ref<any>({
  miyao: ''
})
const info = ref<any>()
const code_url = ref<any>()
const qrcode = useQRCode(code_url)
const recharge_type = ref<string>('2')
const target_type = ref<string>('2')
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
const diamonds = ref<any>(0)
async function changePrice(num) {
  const res: any = await computedPrice({ cny: num })
  diamonds.value = res?.data?.jifen
}
// 充值
const ruleFormRef = ref<FormInstance>()
const rechargeForm = ref<any>({ miyao: '' })
const getJifen = computed(() => {
  return `${vx_price.value} ${t('recharge.dui')} ${diamonds.value} ${t('detail.divide_diamonds')}`
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
        ElMessage.success(t('recharge.message_success'))
        // viewBalance()
        return (dialogVisible.value = false)
      }
      return ElMessage.error(res?.msg)
    } else {
      // 表单验证未通过
      return ElMessage.error('表单验证未通过')
    }
  })
}

// 卡密-取消
function cancel() {
  form.value.miyao = ''
}
const order_id = ref<any>()
// 检查微信订单
async function checkOrder() {
  const res: any = await checkWeixinOrder({ order_id: order_id.value })
  if (res?.data?.status === 'yes') {
    ElMessage.success(t('recharge.message_vx_success'))
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
      code_url.value = res?.data?.code_url
      order_id.value = res?.data?.order_id
      ElMessage.success(t('message_qrcode'))
      intervalId.value = setInterval(async () => {
        await checkOrder()
      }, 5000)
      timeoutId.value = setTimeout(
        () => {
          ElMessage.warning(t('message_timeout'))
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
  info.value = res?.data?.one
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
