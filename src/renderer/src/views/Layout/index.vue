<template>
  <el-container class="container" style="height: 100vh">
    <el-aside class="aside">
      <Menu class="menu"></Menu>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main class="main">
        <el-scrollbar>
          <Content></Content>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
  <!-- <div class="box">
    <TheSwiper></TheSwiper>
    <br />
    <TheSwiperCards></TheSwiperCards>
  </div> -->
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
// import TheSwiper from '../../components/TheSwiper/index.vue'
// import TheSwiperCards from '../../components/TheSwiperCards/index.vue'
</script>

<style lang="less" scoped>
.container {
  padding-top: 50px;
  background: #121212;
}
.container .el-header {
  position: relative;
  // background-color: var(--el-color-primary-light-7);
  // color: var(--el-text-color-primary);
  padding: 0;
  height: calc(14% - 57px);
  // background-color: orange;
}
.container .el-aside {
  color: var(--el-text-color-primary);
  // background-color: #ccc;
}
.aside {
  width: 17%; // 196 0.1670929241
}
.main {
  padding: 0;
  background-color: #121212;
}
// .box {
//   width: 100%;
//   min-height: 100%; // 使用 min-height 可以解决滚轮往下滑是白色的问题
//   background: black;
//   padding-top: 40px;
// }
</style>
