<template>
  <el-dialog
    v-model="dialogVisible"
    title="直播记录"
    width="1000px"
    @close="closeLiveRecordDialog"
  >
    <el-empty>
      <template #description>
        <div>{{ $t('system.incomplete') }}</div>
      </template>
    </el-empty>
  </el-dialog>
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
function closeLiveRecordDialog() {
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

<style lang="less" scoped>
.detail-head {
  width: 900px;
  height: 260px;
  position: relative;
  border-radius: 15px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .head-left {
    flex: 1;
    color: #fff;
    .head-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .info {
      height: 20px;
      margin-bottom: 20px;
    }
    .price {
      text-decoration: line-through;
      height: 18px;
      color: #f5f5f599;
    }
    .cuxiao-price {
      font-size: 18px;
      height: 18px;
      margin-bottom: 50px;
      color: #f5f5f5;
    }
    .btns {
      .el-button {
        width: 100px;
      }
    }
  }
}
</style>
