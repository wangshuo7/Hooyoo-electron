<template>
  <div
    class="image-container"
    @mouseenter="showOverlay = true"
    @mouseleave="showOverlay = false"
  >
    <img :src="props.src" alt="Image" class="image" />
    <div v-if="showOverlay" class="overlay">
      <span class="icon" @click="zoomIn">
        <el-icon><ZoomIn /></el-icon>
      </span>
      <span class="icon" @click="saveImage">
        <el-icon><Download /></el-icon
      ></span>
    </div>
    <el-dialog v-model="dialogVisible" width="500px">
      <img style="width: 400px" :src="props.src" alt="" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ZoomIn, Download } from '@element-plus/icons-vue'
// const url = ref<string>('') // 图片地址
const showOverlay = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  src: {
    type: String
  }
})
const zoomIn = () => {
  dialogVisible.value = true
}

const saveImage = () => {
  if (props.src) {
    window.api.saveImage(props.src)
  }
}
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
}

.icon {
  color: white;
  cursor: pointer;
  font-size: 24px;
}

.image {
  max-width: 100%;
}
</style>
