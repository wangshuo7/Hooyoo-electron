<template>
  <div class="container">
    <div class="title" @click="onRefresh">
      <h1>库</h1>
      <span class="refresh">
        <el-icon
          class="refresh-icon"
          :style="{ transform: `rotate(${rotation}deg)` }"
          ><Refresh
        /></el-icon>
      </span>
    </div>
    <div class="tabs">
      <div
        class="tab"
        :class="{ active: activeTab === 'all' }"
        @click="onChangeAll"
      >
        全部
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'save' }"
        @click="onChangeSave"
      >
        收藏
      </div>
    </div>
    <div class="sort">
      <div>
        <span style="font-size: 14px; color: #9a9a9a">排序方式：</span>
        <span>
          <el-select v-model="sortType" class="m-2" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <div class="sort-icon">
        <span
          :class="{ active: viewType === 'table' }"
          @click="changeViewTable"
        >
          <i class="iconfont">&#xe696;</i>
        </span>
        <span :class="{ active: viewType === 'list' }" @click="changeViewList">
          <i class="iconfont">&#xe6b5;</i>
        </span>
      </div>
    </div>
    <div v-if="activeTab === 'all'" class="list">
      <div v-for="index in 24" :key="index" class="list-item">
        <el-image class="img" src="/swiper-card1.webp"></el-image>
        <div class="item-title">
          <span>《Fortnite》</span>
          <span
            ><el-icon><MoreFilled /></el-icon
          ></span>
        </div>
        <div class="item-download">
          <span>
            <el-icon><Download /></el-icon>
          </span>
          <span>下载</span>
        </div>
      </div>
    </div>
    <div v-else>收藏</div>
    <div class="pagination">
      <div>显示39个结果中的1-24</div>
      <el-pagination :page-size="24" layout="prev, pager, next" :total="39" />
      <div>
        <span style="color: #9a9a9a">网格视图：</span>
        <el-dropdown
          trigger="click"
          placement="top"
          @visible-change="iconChange"
        >
          <div class="dropdown">
            <span>24</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>24</el-dropdown-item>
              <el-dropdown-item>36</el-dropdown-item>
              <el-dropdown-item>48</el-dropdown-item>
              <el-dropdown-item>全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  Refresh,
  MoreFilled,
  Download,
  ArrowDown
} from '@element-plus/icons-vue'
function query() {
  console.log('refresh')
  setTimeout(() => {}, 2000)
}
const rotation = ref<number>(0)
function debounceOnRefresh() {
  rotation.value -= 180
  query()
}
const onRefresh = useDebounceFn(debounceOnRefresh, 300)
const activeTab = ref<string>('all')
function onChangeAll() {
  activeTab.value = 'all'
}
function onChangeSave() {
  activeTab.value = 'save'
}
// 排序
const sortType = ref<any>(1)
const options = [
  {
    value: 1,
    label: '最近游玩'
  },
  {
    value: 2,
    label: '最近购买'
  },
  {
    value: 3,
    label: '字母顺序A-Z'
  },
  {
    value: 4,
    label: '字母顺序Z-A'
  },
  {
    value: 5,
    label: '游戏时间'
  }
]
// 视图方式
const viewType = ref<string>('table')
function changeViewTable() {
  viewType.value = 'table'
}
function changeViewList() {
  viewType.value = 'list'
}
// 换页
const is_drop = ref<boolean>(false)
function iconChange(e: boolean) {
  is_drop.value = e
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 1280px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 25% 25% 25% 25%;
    .list-item {
      height: 320px;
    }
  }
}
@media screen and (min-width: 1281px) and (max-width: 1600px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 20% 20% 20% 20% 20%;
    .list-item {
      height: 340px;
    }
  }
}
@media screen and (min-width: 1601px) and (max-width: 2001px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
    .list-item {
      height: 360px;
    }
  }
}
@media screen and (min-width: 2000px) {
  .container {
    width: 100rem;
    margin: 0 auto;
  }
  .list {
    grid-template-columns: 14.28% 14.28% 14.28% 14.28% 14.28% 14.28% 14.28%;
    .list-item {
      height: 380px;
    }
  }
}

.title {
  margin-top: 25px;
  display: flex;
  align-items: center;
  h1 {
    font-size: 30px;
    font-weight: 400;
    margin-right: 10px;
  }
  .refresh {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #565656;
    cursor: pointer;
    transition: all 0.2s linear;
    .refresh-icon {
      transform: rotate(0deg);
      transition: all 0.6s linear;
    }
  }
  .refresh:hover {
    color: #f5f5f5;
  }
}
.tabs {
  display: flex;
  margin: 30px 0 30px;
  .tab {
    font-size: 18px;
    margin-right: 30px;
    line-height: 30px;
    color: #9a9a9a;
    cursor: pointer;
  }
  .tab.active {
    color: #f5f5f5;
    border-bottom: 2px solid #f5f5f5;
  }
}
.sort {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .sort-icon {
    display: flex;
    span {
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin-left: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    span.active {
      background: #2a2a2a;
    }
    span:hover i {
      color: #fff;
    }
  }
}
.list {
  display: grid;
  .list-item {
    padding: 16px 16px 0;
    border-radius: 6px;
    transition: all 0.2s linear;
    // height: 342px;
    position: relative;
    .img {
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .item-title {
      display: flex;
      justify-content: space-between;
      span:last-child {
        width: 32px;
        height: 22px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s linear;
      }
      span:last-child:hover {
        background: #373737;
      }
    }
    .item-download {
      margin-top: 5px;
      display: flex;
      // align-items: center;
      color: #9a9a9a;
      span {
        margin-right: 10px;
      }
      span:last-child {
        line-height: 16px;
      }
    }
  }
  .list-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    border-radius: 6px;
    transition: opacity 0.3s ease;
  }
  .list-item:hover::after {
    opacity: 0.1;
  }
}
.pagination {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  :deep(.el-pagination) {
    button {
      width: 58px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #121212;
      color: #f7f7f7;
      font-weight: 900;
    }
    button:hover {
      background: #373737;
    }
    ul li {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #121212;
      color: #9a9a9a;
    }
    ul li.is-active {
      color: #f5f5f5 !important;
    }
    ul li:hover {
      background: #373737;
    }
  }
  div:first-child {
    color: #9a9a9a;
  }
  div:last-child {
    display: flex;
    align-items: center;
    .dropdown {
      color: #f5f5f5;
      position: relative;
      top: 2px;
      .el-icon--right {
        transition: all 0.2s linear;
      }
      .el-icon--right.active {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
