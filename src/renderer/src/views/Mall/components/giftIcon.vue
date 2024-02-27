<template>
  <el-dialog
    v-model="giftVisible"
    title="礼物贴纸"
    width="500px"
    @close="closeGiftDialog"
  >
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const giftVisible = ref<boolean>(false)

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeGiftDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    giftVisible.value = val
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
