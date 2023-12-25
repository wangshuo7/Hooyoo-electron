<template>
  <div class="box">
    <TheSwiper></TheSwiper>
    <br />
    <!-- <TheSwiperCards></TheSwiperCards> -->
  </div>
</template>

<script lang="ts" setup>
import TheSwiper from '../../../components/TheSwiper/index.vue'
// import TheSwiperCards from '../../../components/TheSwiperCards/index.vue'
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  min-height: 100%; // 使用 min-height 可以解决滚轮往下滑是白色的问题
  // background: black;
  // padding-top: 40px;
}
</style>
