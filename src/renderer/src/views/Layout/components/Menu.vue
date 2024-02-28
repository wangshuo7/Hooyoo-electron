<template>
  <div class="menu-box">
    <div class="logo">
      <el-image
        class="logo-img"
        :src="logo ? logo : './system/hooyoo.gif'"
      ></el-image>
    </div>
    <div style="height: 85%; display: flex; flex-direction: column">
      <el-menu text-color="#757575" :default-active="menu_active" router>
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t('menu.home') }}</template>
        </el-menu-item>
        <el-menu-item index="/mall">
          <el-icon><Shop /></el-icon>
          <template #title>{{ $t('menu.mall') }}</template>
        </el-menu-item>
        <el-menu-item index="/develop">
          <el-icon><Avatar /></el-icon>
          <template #title>{{ $t('menu.developer') }}</template>
        </el-menu-item>
        <!-- <el-menu-item index="library">
          <el-icon><Menu /></el-icon>
          <template #title>{{ $t('menu.library') }}</template>
        </el-menu-item> -->
      </el-menu>
      <!-- <el-menu class="down" style="margin-top: auto" default-active="1">
        <el-menu-item index="1" class="live-info" style="height: 80px">
          <template #title>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
              "
            >
              <span
                style="
                  display: block;
                  line-height: 1;
                  margin-right: 10px;
                  color: rgb(2, 206, 2);
                  margin-bottom: 2px;
                "
                >开播中</span
              >
              <span style="display: flex; line-height: 1; align-items: center">
                <span style="margin-right: 5px">钻石：{{ diamond }}</span
                ><el-button type="primary">刷新</el-button>
              </span>
            </div>
          </template>
        </el-menu-item>
      </el-menu> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'
import { Avatar, HomeFilled, Shop } from '@element-plus/icons-vue'
import { getGuildOem } from '../../../api/global'
import { getPersonalInfo } from '../../../api/wallet'
import { useRoute } from 'vue-router'
const route = useRoute()
const menu_active = ref<any>('/home')
const logo = ref<any>()
const diamond = ref<any>()
async function viewPersonal() {
  const res = await getPersonalInfo()
  const result = await getGuildOem({ id: res.data.one.gonghui_id })
  logo.value = result.data.list[0].tiepai_icon
  diamond.value = res.data.one.jifen
}

watchEffect(() => {
  menu_active.value = route.path
})
onMounted(() => {
  viewPersonal()
})
</script>

<style lang="less" scoped>
.live-info {
  font-size: 16px;
}
@media screen and (max-width: 1280px) {
  .live-info {
    font-size: 14px;
  }
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
