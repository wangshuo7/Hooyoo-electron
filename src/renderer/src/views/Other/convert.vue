<template>
  <el-dialog
    v-model="dialogVisible"
    width="700px"
    :title="$t('convert.convert')"
    style="height: 300px"
    @close="closeConvertDialog"
  >
    <el-form ref="ruleFormRef" :model="form" inline style="padding: 50px 20px">
      <el-form-item :label="$t('system.price')" prop="price">
        <el-input
          v-model="form.price"
          controls-position="right"
          :placeholder="$t('system.place_enter')"
          @input="handleInput"
        ></el-input>
      </el-form-item>
      <el-text v-if="form.price" type="info" class="tips">{{
        `${getJifen}(${$t('recharge.tip')})`
      }}</el-text>
      <el-form-item>
        <el-button type="primary" @click="submit">{{
          $t('buttons.confirm')
        }}</el-button>
        <el-button @click="cancel">{{ $t('buttons.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { theConvert } from '../../api/wallet'
import { computedPrice, getConfig } from '../../api/global'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close', 'getdiamond'])
function closeConvertDialog() {
  emits('close', false)
}
function getDiamonds() {
  emits('getdiamond', false)
}
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    if (val) {
      form.value.price = undefined
    }
  },
  { immediate: true }
)
const ruleFormRef = ref<FormInstance>()
const form = ref<any>({ price: undefined })

const ratio = ref<any>()
// 确定
async function submit() {
  // 表单验证通过
  const res: any = await theConvert({
    price: form.value.price
  })
  if (res.code === 200) {
    getDiamonds()
    return ElMessage.success(t('convert.msg'))
  }
  return ElMessage.error(res.msg)
}
// 取消
function cancel() {
  ruleFormRef.value?.resetFields()
}
const diamonds = ref<any>(0)
async function handleInput() {
  form.value.price = form.value.price.replace(/[^\d.]/g, '')
  const res: any = await computedPrice({ cny: form.value.price })
  diamonds.value = res.data.jifen
}

const getJifen = computed(() => {
  return `${form.value.price} ${t('convert.price_convert')} ${diamonds.value} ${t('system.diamond')}`
})
onMounted(async () => {
  const res: any = await getConfig()
  ratio.value = +res?.data?.one?.jifenbili
})
</script>

<style lang="less" scoped>
session {
  position: relative;
}
.tips {
  position: absolute;
  top: 145px;
  left: 80px;
  color: #8b8b8b;
  font-size: 15px;
}
</style>
