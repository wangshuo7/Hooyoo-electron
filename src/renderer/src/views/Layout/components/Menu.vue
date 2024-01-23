<template>
  <div class="menu-box">
    <div class="logo">
      <el-image class="logo-img" src="./system/hooyoo.gif"></el-image>
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
        <el-button type="success" @click="testRc4">测试加密</el-button>
      </el-menu>
      <!-- <el-menu class="down" style="margin-top: auto" default-active="1">
        <el-menu-item index="1" @click="onOpenDownList">
          <el-icon><Download /></el-icon>
          <template #title>下载</template>
        </el-menu-item>
      </el-menu> -->
    </div>
    <!-- <div>
      <div class="download" @click="onOpenDownList">下载列表</div>
    </div> -->
    <!-- <el-dialog v-model="downlistVisible" title="下载列表" width="700">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        "
      >
        <el-button type="primary">全部暂停</el-button>
        <el-button type="danger">全部取消</el-button>
      </div>
      <div v-for="(item, index) in progress" :key="index" class="list-item">
        <div>{{ item.id }}</div>
        <div style="display: flex">
          <el-progress style="width: 80%" :percentage="item.progress" />
          <el-button>暂停</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { PriceTag, Menu } from '@element-plus/icons-vue'
import { getGameUse } from '../../../api/rc4'
// import { reactive, ref } from 'vue'
// import { PriceTag, Menu, Download } from '@element-plus/icons-vue'
// const downlistVisible = ref<boolean>(false)
// function onOpenDownList() {
//   downlistVisible.value = true
// }
// const progress = reactive<any>([])
// window.api.downloadProgress((obj) => {
// progress[obj.id] = obj.progress
// })

async function testRc4() {
  const send_data = {
    game_id: 57
  }
  const res: any = getGameUse(send_data)
  console.log('res', res)
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
