<template>
  <el-dialog
    v-model="dialogVisible"
    title="兑换游戏"
    width="30%"
    @close="closeExchangeDialog"
  ></el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeExchangeDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  },
  { immediate: true }
)
</script>

<style lang="less" scoped></style>
