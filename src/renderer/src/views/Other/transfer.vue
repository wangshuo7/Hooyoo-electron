<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('transfer.transfer')"
    width="500"
    @close="closeTransferDialog"
  >
    <el-form label-width="80px">
      <el-form-item
        :label="$t('transfer.trans_type')"
        style="display: flex; align-items: center"
      >
        <el-radio-group v-model="type" class="ml-4">
          <el-radio value="jifen" size="large">{{
            $t('system.diamond')
          }}</el-radio>
          <el-radio value="yundou" size="large">{{
            $t('system.price')
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('transfer.trans_id')"
        style="display: flex; align-items: center"
      >
        <el-input
          v-model="toId"
          :placeholder="$t('system.place_enter')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('transfer.trans_count')"
        style="display: flex; align-items: center"
      >
        <el-input
          v-model="price"
          :placeholder="$t('system.place_enter')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{
        $t('buttons.cancel')
      }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('buttons.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { theTransfer } from '../../api/wallet'
const type = ref<string>('jifen')
const toId = ref<any>()
const price = ref<any>()
async function onConfirm() {
  await theTransfer({
    toid: toId.value,
    tprice: price.value,
    type: type.value
  })
}
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close', 'getdiamond'])
function closeTransferDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    if (val) {
      type.value = 'jifen'
      toId.value = ''
      price.value = ''
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped></style>
