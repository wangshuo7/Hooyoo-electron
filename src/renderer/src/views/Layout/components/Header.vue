<template>
  <div class="header">
    <div class="left">
      <el-icon><ArrowLeftBold /></el-icon>
      <div class="search">
        <div class="search-icon">
          <el-icon><Search /></el-icon>
        </div>
        <input class="search-input" placeholder="搜索商城" />
      </div>
      <div>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @visible-change="iconChange"
        >
          <div class="dropdown">
            <span>探索</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>探索</el-dropdown-item>
              <el-dropdown-item>浏览</el-dropdown-item>
              <el-dropdown-item>新闻</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="right">
      <div class="right-link">
        <div>愿望清单</div>
        <div>购物车</div>
      </div>
      <div class="right-info">
        <div class="info-item">斗</div>
        <div class="info-item">豆</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowLeftBold, Search, ArrowDown } from '@element-plus/icons-vue'
const is_drop = ref<boolean>(false)
function iconChange(e: boolean) {
  is_drop.value = e
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .search {
      width: 230px;
      border-radius: 30px;
      overflow: hidden;
      background: #202020;
      display: flex;
      align-items: center;
      margin: 0 30px 0 22px;
      .search-icon {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #757575;
      }
      .search-input {
        // width: 230px;
        height: 40px;
        border: none;
        outline: none;
        background: transparent;
      }
    }
    .dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon--right {
        transition: all 0.2s linear;
      }
      .el-icon--right.active {
        transform: rotate(-180deg);
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .right-info {
      width: 155px;
      display: flex;
      justify-content: space-evenly;
      border-left: 1px solid #202020;
      .info-item {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        background: #202020;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .info-item:hover {
        background: #2b2b2b;
      }
    }
    .right-link {
      width: 210px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: 14px;
      color: var(--text-menu-color);
      div {
        cursor: pointer;
      }
      div:hover {
        color: #f5f5f5;
      }
    }
  }
}
</style>
