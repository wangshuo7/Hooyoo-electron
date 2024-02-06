<template>
  <div class="menu-box">
    <div class="logo">
      <el-image
        class="logo-img"
        src="./system/hooyoo.gif"
        @click="onOpenBetaTool"
      ></el-image>
    </div>
    <div style="height: 85%; display: flex; flex-direction: column">
      <el-menu text-color="#757575" default-active="mall" router>
        <el-menu-item index="mall">
          <el-icon><PriceTag /></el-icon>
          <template #title>商城</template>
        </el-menu-item>
        <el-menu-item index="library">
          <el-icon><Menu /></el-icon>
          <template #title>库</template>
        </el-menu-item>
      </el-menu>
      <el-menu
        v-if="res.message"
        class="down"
        style="margin-top: auto"
        default-active="1"
      >
        <el-menu-item index="1">
          <template #title>
            <span
              :style="{ color: res.success === 'success' ? 'green' : 'red' }"
              >{{ res.message }}</span
            >
          </template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
  <BetaTool :visible="toolVisible" @close="closeBetaTool"></BetaTool>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { PriceTag, Menu } from '@element-plus/icons-vue'
import { useStateStore } from '../../../store/state'
import BetaTool from '../../Other/betaTool.vue'
// const message = ref<string>()
const stateStore = useStateStore()
const res: any = computed(() => {
  return stateStore.state
})
const toolVisible = ref<boolean>(false)
const clickCount = ref<number>(0)
const clickTimer = ref<any>(null)
function onOpenBetaTool() {
  clickCount.value++
  if (clickCount.value === 1) {
    clickTimer.value = setTimeout(() => {
      if (clickCount.value >= 10) {
        toolVisible.value = true
        clickCount.value = 0
      } else {
        clickCount.value = 0
      }
      clearTimeout(clickTimer.value)
    }, 2000)
  }
}
function closeBetaTool() {
  toolVisible.value = false
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 1280px) {
  .logo {
    height: 40px;
    .logo-img {
      width: 40px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 50px;
    }
  }
}
@media screen and (min-width: 1281px) and (max-width: 1600px) {
  .logo {
    height: 60px;
    .logo-img {
      width: 60px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 60px;
    }
  }
}
@media screen and (min-width: 1601px) {
  .logo {
    height: 60px;
    .logo-img {
      width: 60px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 70px;
      font-size: 16px;
    }
  }
}
.menu-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  // border: 1px solid #ccc;
  position: relative;
}
// .download {
//   background-color: #202020;
//   position: absolute;
//   bottom: 50px;
//   left: 50px;
//   margin: 0 auto;
//   width: 90%;
//   height: 60px;
//   border-radius: 6px;
//   margin-bottom: 3px;
// }
.logo {
  display: flex;
  // height: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  .logo-img {
    border-radius: 50%;
    // width: 40px;
  }
}
.el-menu {
  background: #121212;
  // color: var(--text-menu-color);
  border: none;
  .el-menu-item {
    margin: 0 auto;
    width: 90%;
    // height: 60px;
    border-radius: 6px;
    margin-bottom: 3px;
  }
  .el-menu-item:hover {
    background-color: var(--text-menu-background-hover);
  }
  .el-menu-item.is-active {
    color: var(--text-menu-color-active);
    background: var(--text-menu-background-active);
  }
  .el-menu-item.is-active:hover {
    background-color: var(--text-menu-background-active-hover);
  }
}
// .menu {
//   flex: 1;
//   color: var(--text-menu-color);
//   .menu-item {
//     margin: 0 auto;
//     width: 90%;
//     height: 50px;
//     border-radius: 6px;
//     display: flex;
//     align-items: center;
//     // justify-content: center;
//     padding-left: 25px;
//     .item-icon {
//       margin-right: 25px;
//     }
//   }
//   .menu-item:hover {
//     background: #202020;
//     color: var(--text-menu-color-active);
//   }
// }
.list-item {
  margin: 0 auto;
  background-color: #202020;
  // border: 1px solid #ccc;
  width: 600px;
  height: 70px;
  border-radius: 10px;
  padding: 10px;
}
</style>
