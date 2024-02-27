<template>
  <div>
    <Login v-if="!is_login"></Login>
    <Home v-else></Home>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Login from './Login/index.vue'
import Home from './Home/index.vue'
import { useDeveloperStore } from '../../store/developer'
const developerStore = useDeveloperStore()

const is_login = computed(() => {
  return developerStore.is_login
})
</script>

<style lang="less" scoped></style>
