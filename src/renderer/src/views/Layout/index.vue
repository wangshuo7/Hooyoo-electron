<template>
  <el-container class="container" style="height: 100vh">
    <el-aside class="aside">
      <Menu class="menu"></Menu>
    </el-aside>
    <el-container class="container-right">
      <el-header>
        <Header></Header>
      </el-header>
      <el-main class="main">
        <el-scrollbar :always="true">
          <Content></Content>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
</script>

<style lang="less" scoped>
.container {
  padding-top: 50px;
  background: #121212;
}
.container .el-header {
  position: relative;
  padding: 0;
}
.container .el-aside {
  color: var(--el-text-color-primary);
}
.aside {
  min-width: 240px;
  width: 17%; // 196 0.1670929241
}
.main {
  padding: 0;
  background-color: #121212;
}
</style>
