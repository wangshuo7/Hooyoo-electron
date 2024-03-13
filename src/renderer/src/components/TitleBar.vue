<template>
  <div class="header-drag">
    <div class="empty">
      <div class="box-name">
        <div v-if="!is_login">互游盒子</div>
        <div v-else>{{ oemData.tiepai_name }}</div>
      </div>
    </div>
    <div class="tool">
      <span class="item refresh" @click="controlRefresh">
        <!-- <el-icon><RefreshRight /></el-icon> -->
        <el-icon><Refresh /></el-icon>
      </span>
      <span class="item min" @click="controlMin">
        <span></span>
      </span>
      <span class="item max">
        <div v-if="changeSize" class="max-i" @click="controlMax">
          <div class="full"></div>
        </div>
        <div v-else class="max-i">
          <div class="reduction" @click="controlReduction">
            <div class="box1"></div>
            <div class="box2"></div>
          </div>
        </div>
      </span>
      <span class="item close" @click="controlClose">
        <span></span>
        <span></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useAccountStore } from '../store/account'
const accountStore = useAccountStore()
const is_login = computed(() => {
  return accountStore.is_login
})
const oemData = computed(() => {
  return accountStore.oem
})
const changeSize = ref<boolean>(true)

// 监听主进程窗口状态 => 主要针对于双击可拖拽区域时全屏修改图标问题
window.api.updateWinStatus((status) => {
  changeSize.value = !status
})
function controlRefresh() {
  window.api.refreshWindow()
}
function controlMin() {
  window.api.minimize()
}
function controlClose() {
  window.api.closeGame()
  window.api.quit()
}
function controlMax() {
  changeSize.value = false
  window.api.maximize()
}
function controlReduction() {
  changeSize.value = true
  window.api.reduction()
}
</script>

<style lang="less" scoped>
.header-drag {
  height: 25px;
  background: #121212;
  // background: #fff;
  display: flex;
  justify-content: space-between;
  .empty {
    flex: 1;
    -webkit-app-region: drag;
    .box-name {
      font-size: 20px;
      text-indent: 20px;
      margin-top: 10px;
    }
  }

  .tool {
    display: flex;
    z-index: 9999;
    .item {
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .max {
      .max-i {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .min {
      position: relative;
      span {
        display: block;
        height: 1px;
        width: 10px;
        background: #f5f5f5;
        position: absolute;
        bottom: 10px;
      }
    }
    .min:hover,
    .max:hover {
      background: #54b2de;
    }
    .close {
      width: 45px;
      position: relative;
      span {
        display: block;
        height: 1px;
        width: 13px;
        background: #f5f5f5;
      }
      span:first-child {
        transform: rotate(45deg);
        position: absolute;
      }
      span:last-child {
        transform: rotate(-45deg);
      }
    }
    .close:hover {
      background: #e62e4c;
    }
    .max:hover .box1 {
      background: #54b2de;
    }
    .refresh {
      font-size: 16px;
    }
    .refresh:hover {
      background: rgb(1, 173, 1);
    }
  }
}
.full {
  width: 10px;
  height: 10px;
  border: 1px solid #f5f5f5;
}
.reduction {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .box1 {
    width: 10px;
    height: 10px;
    border: 1px solid #f5f5f5;
    background: #121212;
    z-index: 111;
    position: absolute;
    top: 9px;
    right: 18px;
  }
  .box2 {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid #f5f5f5;
    top: 6px;
    right: 15px;
  }
}
</style>
