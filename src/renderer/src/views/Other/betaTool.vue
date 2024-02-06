<template>
  <el-dialog v-model="settingVisible" width="500px" @close="closeBetaTool">
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const settingVisible = ref<boolean>(false)

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeBetaTool() {
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

<style lang="less" scoped></style>
