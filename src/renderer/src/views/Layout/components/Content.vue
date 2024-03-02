<template>
  <div class="box">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
@media screen and (min-width: 2001px) {
  .box {
    // padding: 0 2%;
    width: 100rem;
    padding-bottom: 40px;
  }
}
@media screen and (max-width: 2000px) {
  .box {
    padding: 0 5% 40px;
  }
}
.box {
  width: 100%;
  min-height: 100vh - 60px; // 使用 min-height 可以解决滚轮往下滑是白色的问题
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // background: black;
  // padding-top: 40px;
  .header {
    position: fixed;
    top: 0;
  }
}
</style>
