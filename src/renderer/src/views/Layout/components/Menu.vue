<template>
  <div class="menu-box">
    <div class="logo">
      <el-image class="logo-img" src="/system/hooyoo.gif"></el-image>
    </div>
    <el-menu text-color="#757575" default-active="mall" router>
      <el-menu-item index="mall">
        <el-icon><PriceTag /></el-icon>
        <template #title>商城</template>
      </el-menu-item>
      <el-menu-item index="library">
        <el-icon><Menu /></el-icon>
        <template #title>库</template>
      </el-menu-item>
      <el-menu-item index="3">
        <template #title>{{ width + 'X' + height }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { PriceTag, Menu } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
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
}
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
</style>
