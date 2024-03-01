<template>
  <div class="menu-box">
    <div class="logo">
      <el-image
        class="logo-img"
        :src="logo ? logo : './system/hooyoo.gif'"
      ></el-image>
    </div>
    <div
      style="
        height: 85%;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
      "
    >
      <el-menu text-color="#757575" :default-active="menu_active" router>
        <el-menu-item index="/home" class="menu-item">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t('menu.home') }}</template>
        </el-menu-item>
        <el-menu-item index="/mall" class="menu-item">
          <el-icon><Shop /></el-icon>
          <template #title>{{ $t('menu.mall') }}</template>
        </el-menu-item>
        <el-menu-item index="/develop" class="menu-item">
          <el-icon><Avatar /></el-icon>
          <template #title>{{ $t('menu.developer') }}</template>
        </el-menu-item>
        <!-- <el-menu-item index="library">
          <el-icon><Menu /></el-icon>
          <template #title>{{ $t('menu.library') }}</template>
        </el-menu-item> -->
      </el-menu>
      <el-menu class="down" style="margin-top: auto" default-active="1">
        <el-menu-item index="1" class="live-info" style="cursor: default">
          <template #title>
            <span
              class="state-title"
              :style="{
                color: live_state_before === 'yes_live' ? '#67C23A' : '#F56C6C'
              }"
              >{{ live_state }}</span
            >
            <span>{{ $t('system.diamond') }}：{{ diamond }}</span>
            <span class="refresh" @click="onRefresh">
              <el-icon class="refresh-icon"><Refresh /></el-icon>
            </span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { Avatar, HomeFilled, Shop } from '@element-plus/icons-vue'
import { Refresh } from '@element-plus/icons-vue'
import { getGuildOem } from '../../../api/global'
import { getPersonalInfo } from '../../../api/wallet'
import { useRoute } from 'vue-router'
import { useLiveStore } from '../../../store/live'
import { useLanguageStore } from '../../../store/languageStore'
const languageStore = useLanguageStore()
const liveStore = useLiveStore()
const live_state_before = computed(() => {
  return liveStore.state
})
const live_state = computed(() => {
  if (languageStore.locale == 'zh') {
    return liveStore.state == 'no_live' ? '未开播' : '已开播'
  } else if (languageStore.locale == 'tw') {
    return liveStore.state == 'no_live' ? '未開播' : '已開播'
  }
  return liveStore.state == 'no_live'
    ? 'Not broadcasted'
    : 'Started broadcasting'
})
const diamond = computed(() => {
  return liveStore.diamond
})
const route = useRoute()
const menu_active = ref<any>('/home')
const logo = ref<any>()
async function viewPersonal() {
  const res: any = await getPersonalInfo()
  liveStore.setDiamond(res.data.one.jifen)
  const result: any = await getGuildOem({ id: res.data.one.gonghui_id })
  logo.value = result.data.list[0].tiepai_icon
}
async function viewPrice() {
  const res: any = await getPersonalInfo()
  liveStore.setDiamond(res.data.one.jifen)
}
function onRefresh() {
  viewPrice()
}
watchEffect(() => {
  menu_active.value = route.path
})
onMounted(() => {
  viewPersonal()
  liveStore.setState('no_live')
})
</script>

<style lang="less" scoped>
.refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  .refresh-icon {
    position: relative;
    left: 2px;
    transition: color 0.1s linear;
  }
}
.refresh .refresh-icon:hover {
  color: #e6a23c;
}

.state-title {
  display: block;
  line-height: 1;
  margin-right: 10px;
  margin-bottom: 2px;
}
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
  .menu-item:hover {
    background-color: var(--text-menu-background-hover);
  }
  .el-menu-item.is-active {
    color: var(--text-menu-color-active);
    background: var(--text-menu-background-active);
  }
  .menu-item.is-active:hover {
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
