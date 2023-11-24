<template>
  <div class="container">
    <div class="titlebox">
      <a href="#" class="title">
        <span>特惠游戏</span>
        <el-icon class="right"><ArrowRight /></el-icon>
      </a>
      <div class="pagination">
        <div
          class="button prev"
          :class="{ active: !prevNone }"
          @click="prevSlide"
        >
          <el-icon class="prev-icon" :class="{ active: prevNone }"
            ><ArrowLeft
          /></el-icon>
        </div>
        <div
          class="button next"
          :class="{ active: !nextNone }"
          @click="nextSlide"
        >
          <el-icon class="next-icon" :class="{ active: nextNone }"
            ><ArrowRight
          /></el-icon>
        </div>
      </div>
    </div>
    <div class="swiperbox">
      <swiper
        :slides-per-view="1"
        :space-between="10"
        :allow-touch-move="false"
        :breakpoints="{
          375: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          1020: {
            slidesPerView: 5,
            spaceBetween: 20
          },
          1600: {
            slidesPerView: 6,
            spaceBetween: 30
          },
          9999: {
            slidesPerView: 6,
            spaceBetween: 30
          }
        }"
        :modules="modules"
        class="mySwiper"
        @swiper="onSwiper"
      >
        <swiper-slide
          v-for="(item, index) in Cards"
          :key="index"
          class="swiper-item"
        >
          <div class="swiper-img">
            <!-- :offset="16" -->
            <el-popover
              :teleported="true"
              placement="top"
              trigger="hover"
              content="添至愿望清单"
              effect="dark"
              :show-arrow="false"
              popper-style="font-size:16px;text-align:center;"
            >
              <template #reference>
                <el-icon class="plusicon"><CirclePlusFilled /></el-icon>
              </template>
            </el-popover>
            <el-image :src="item.src"></el-image>
          </div>
          <div class="swiper-info">
            <div class="type">{{ item.type }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="tag">
              <span>现已登录EPIC</span>
            </div>
            <div class="price">
              <span class="price_1">{{ item.price_1 }}</span>
              <span class="price_2">{{ item.price_2 }}</span>
              <span class="price_3">{{ item.price_3 }}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Pagination } from 'swiper/modules'
import {
  ArrowRight,
  ArrowLeft,
  CirclePlusFilled
} from '@element-plus/icons-vue'
const modules = [Pagination]
const Cards = ref<any>([
  {
    src: './swiper-card1.webp',
    type: '基础游戏',
    name: 'Gas Station Simulator',
    price_1: '-10%',
    price_2: '￥40',
    price_3: '￥36'
  },
  {
    src: './swiper-card2.webp',
    type: '基础游戏',
    name: 'Skotos',
    price_1: '-17%',
    price_2: '￥18',
    price_3: '￥14.94'
  },
  {
    src: './swiper-card3.webp',
    type: '基础游戏',
    name: 'Mystery in the Office',
    price_1: '-25%',
    price_2: '￥11',
    price_3: '￥8.25'
  },
  {
    src: './swiper-card4.webp',
    type: '基础游戏',
    name: 'Story Craft',
    price_1: '-20%',
    price_2: '￥25',
    price_3: '￥20'
  },
  {
    src: './swiper-card5.webp',
    type: '基础游戏',
    name: 'Civil War: 1862',
    price_1: '-20%',
    price_2: '￥25',
    price_3: '￥20'
  },
  {
    src: './swiper-card6.webp',
    type: '基础游戏',
    name: 'Backpack Hero',
    price_1: '-15%',
    price_2: '￥62',
    price_3: '￥52.70'
  },
  {
    src: './swiper-card7.webp',
    type: '基础游戏',
    name: 'The Shape of Things',
    price_1: '-40%',
    price_2: '￥22',
    price_3: '￥13.20'
  },
  {
    src: './swiper-card8.webp',
    type: '基础游戏',
    name: 'WARSHIFT',
    price_1: '-30%',
    price_2: '￥31',
    price_3: '￥21.70'
  },
  {
    src: './swiper-card9.webp',
    type: '基础游戏',
    name: 'Ghoul Castle 3D - Gold Edition',
    price_1: '-40%',
    price_2: '￥9',
    price_3: '￥5.40'
  },
  {
    src: './swiper-card10.webp',
    type: '基础游戏',
    name: 'Lsland Farmer',
    price_1: '-30%',
    price_2: '￥6',
    price_3: '￥4.20'
  },
  {
    src: './swiper-card11.webp',
    type: '基础游戏',
    name: 'T-Rex Dinosaur Game',
    price_1: '-50%',
    price_2: '￥3',
    price_3: '￥1.50'
  },
  {
    src: './swiper-card12.png',
    type: '基础游戏',
    name: 'Nextbots In The Backrooms',
    price_1: '-50%',
    price_2: '￥3',
    price_3: '￥1.50'
  },
  {
    src: './swiper-card13.jpg',
    type: '基础游戏',
    name: 'Treasure Of The Giantess',
    price_1: '-15%',
    price_2: '￥31',
    price_3: '￥26.35'
  },
  {
    src: './swiper-card14.jpg',
    type: '基础游戏',
    name: 'Life Changer',
    price_1: '-22%',
    price_2: '￥46.99',
    price_3: '￥36.65'
  },
  {
    src: './swiper-card1.webp',
    type: '基础游戏',
    name: 'Gas Station Simulator',
    price_1: '-10%',
    price_2: '￥40',
    price_3: '￥36'
  },
  {
    src: './swiper-card2.webp',
    type: '基础游戏',
    name: 'Skotos',
    price_1: '-17%',
    price_2: '￥18',
    price_3: '￥14.94'
  },
  {
    src: './swiper-card3.webp',
    type: '基础游戏',
    name: 'Mystery in the Office',
    price_1: '-25%',
    price_2: '￥11',
    price_3: '￥8.25'
  },
  {
    src: './swiper-card4.webp',
    type: '基础游戏',
    name: 'Story Craft',
    price_1: '-20%',
    price_2: '￥25',
    price_3: '￥20'
  },
  {
    src: './swiper-card5.webp',
    type: '基础游戏',
    name: 'Civil War: 1862',
    price_1: '-20%',
    price_2: '￥25',
    price_3: '￥20'
  },
  {
    src: './swiper-card6.webp',
    type: '基础游戏',
    name: 'Backpack Hero',
    price_1: '-15%',
    price_2: '￥62',
    price_3: '￥52.70'
  },
  {
    src: './swiper-card7.webp',
    type: '基础游戏',
    name: 'The Shape of Things',
    price_1: '-40%',
    price_2: '￥22',
    price_3: '￥13.20'
  }
])
const activeSlide = ref<any>()
const theSwiper = ref<any>()
const onSwiper = (swiper: any) => {
  theSwiper.value = swiper as any
  swiper.on('slideChange', () => {
    activeSlide.value = swiper.realIndex // 使用 realIndex 获取当前实际幻灯片索引
  })
}
const slidesPerPage = ref<number>(6) // 每页显示的轮播图数量
const nextNone = ref<boolean>(false)
function nextSlide() {
  if (nextNone.value) return
  if (theSwiper.value) {
    if (window.innerWidth < 375) {
      slidesPerPage.value = 1
    } else if (window.innerWidth < 768) {
      slidesPerPage.value = 2
    } else if (window.innerWidth < 1024) {
      slidesPerPage.value = 4
    } else if (window.innerWidth < 1600) {
      slidesPerPage.value = 5
    } else {
      slidesPerPage.value = 6
    }
    const currentIndex = theSwiper.value.realIndex
    const totalSlides = Cards.value.length // 轮播图的总数量

    // 计算下一页第一个轮播图的索引
    const nextPageFirstSlideIndex = currentIndex + slidesPerPage.value

    // 如果下一页的第一个轮播图索引超过了总轮播图数量，则不执行切换
    if (nextPageFirstSlideIndex < totalSlides) {
      theSwiper.value.slideTo(nextPageFirstSlideIndex)
    } else {
      // 到达最后一页，可以在这里修改按钮样式
      // 例如，修改按钮的背景颜色
      nextNone.value = true
    }
  }
}
const prevNone = ref<boolean>(false)
function prevSlide() {
  if (prevNone.value) return
  if (theSwiper.value) {
    if (window.innerWidth < 375) {
      slidesPerPage.value = 1
    } else if (window.innerWidth < 768) {
      slidesPerPage.value = 2
    } else if (window.innerWidth < 1024) {
      slidesPerPage.value = 4
    } else if (window.innerWidth < 1600) {
      slidesPerPage.value = 5
    } else {
      slidesPerPage.value = 6
    }
    const currentIndex = theSwiper.value.realIndex
    // 计算上一页第一个轮播图的索引
    const prevPageFirstSlideIndex = currentIndex - slidesPerPage.value

    // 如果上一页的第一个轮播图索引大于等于0，则执行切换
    if (prevPageFirstSlideIndex >= 0) {
      theSwiper.value.slideTo(prevPageFirstSlideIndex)
    } else if (prevPageFirstSlideIndex < 0) {
      theSwiper.value.slideTo(0)
      prevNone.value = false
    }
  }
}
watch(
  activeSlide,
  (newIndex) => {
    // 在轮播索引变化时执行逻辑
    const totalSlides = Cards.value.length // 轮播图的总数量
    // 计算上一页第一个轮播图的索引
    const prevPageFirstSlideIndex = newIndex - slidesPerPage.value
    // 如果上一页的第一个轮播图索引大于等于0，则设置 prevNone 为 false，否则设置为 true
    prevNone.value =
      prevPageFirstSlideIndex < 0 &&
      prevPageFirstSlideIndex == -slidesPerPage.value
    // 计算下一页第一个轮播图的索引
    const nextPageFirstSlideIndex = newIndex + slidesPerPage.value
    // 如果下一页的第一个轮播图索引超过了总轮播图数量，则设置 nextNone 为 true，否则设置为 false
    nextNone.value = nextPageFirstSlideIndex >= totalSlides
  },
  { immediate: true }
)
onMounted(() => {
  prevNone.value = true
  if (theSwiper.value) {
    if (window.innerWidth < 375) {
      slidesPerPage.value = 1
    } else if (window.innerWidth < 768) {
      slidesPerPage.value = 2
    } else if (window.innerWidth < 1024) {
      slidesPerPage.value = 4
    } else if (window.innerWidth < 1600) {
      slidesPerPage.value = 5
    } else {
      slidesPerPage.value = 6
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  // width: 62.5%;
  width: 100rem;
  position: relative;
  // padding-bottom: 20%;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.titlebox {
  width: 100%;
  height: 30px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  .title {
    color: #f5f5f5;
    font-size: 18px;
    display: flex;
    align-items: center;
    .right {
      font-size: 10px;
      margin-left: 5px;
      transition: margin-left 0.3s ease;
    }
  }
  .title:hover .right {
    margin-left: 10px;
  }
  .pagination {
    display: flex;
    .button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #202020;
      margin-left: 10px;
      color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      .prev-icon.active {
        color: #8b8b8b;
      }
      .next-icon.active {
        color: #8b8b8b;
      }
    }
    .button:hover.active {
      background-color: #2b2b2b;
      cursor: pointer;
      transition: background-color 0.5s ease;
    }
  }
}
.swiperbox {
  flex: 1;
}

.swiper-item {
  position: relative;
  .swiper-img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    .plusicon {
      position: absolute;
      background-color: #fff;
      border-radius: 50%;
      top: 10px;
      right: 10px;
      z-index: 9999;
      font-size: 24px;
      display: none;
    }
  }
  .swiper-img::after {
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
    border-radius: 0;
    transition: opacity 0.3s ease;
  }
  .swiper-img:hover::after {
    opacity: 0.1;
  }
  .swiper-img:hover .plusicon {
    display: block;
    cursor: pointer;
  }
  .swiper-info {
    display: flex;
    flex-direction: column;
    .type {
      font-size: 11px;
      color: rgba(245, 245, 245, 0.6);
      margin: 10px 0;
    }
    .name {
      color: #f5f5f5;
    }
    .tag {
      margin: 10px 0;
      span {
        font-size: 11px;
        color: rgb(245, 245, 245);
        padding: 5px 10px;
        border-radius: 2px;
        background: #2a2a2a;
        line-height: 25px;
      }
    }
    .price {
      display: flex;
      .price_1 {
        padding: 5px 10px;
        font-size: 11px;
        color: rgb(245, 245, 245);
        background-color: rgb(0, 116, 228);
        border-radius: 5px;
      }
      .price_2 {
        color: rgba(245, 245, 245, 0.6);
        text-decoration: line-through;
        margin: 0 7px;
      }
      .price_3 {
        color: #f5f5f5;
      }
    }
  }
}

/* 在屏幕宽度在大于 1600 时应用的样式 */
@media screen and (min-width: 1601px) {
  .container {
    width: 100rem;
    position: relative;
    // padding-bottom: 20%;
    margin: 0 auto;
    overflow: hidden;
  }
}
/* 在屏幕宽度在 1601 到 2150 像素之间时应用的样式 */
@media screen and (min-width: 1601px) and (max-width: 2150px) {
  .container {
    width: 62.5%;
    position: relative;
    // padding-bottom: 20%;
    margin: 0 auto;
    overflow: hidden;
  }
}

/* 在屏幕宽度在 1024 到 1600 像素之间时应用的样式 */
@media screen and (min-width: 1024px) and (max-width: 1600px) {
  .container {
    width: 74%;
    position: relative;
    // padding-bottom: 20%;
    margin: 0 auto;
    overflow: hidden;
  }
}

@media screen and (max-width: 1023px) {
  .container {
    width: 95%;
    position: relative;
    // padding-bottom: 20%;
    margin: 0 auto;
    overflow: hidden;
  }
  .content {
    // position: absolute;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    display: flex;
    flex-direction: column;
    .titlebox {
      width: 100%;
      height: 30px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      .title {
        color: #f5f5f5;
        font-size: 18px;
        display: flex;
        align-items: center;
        .right {
          font-size: 10px;
          margin-left: 5px;
          transition: margin-left 0.3s ease;
        }
      }
      .title:hover .right {
        margin-left: 10px;
      }
      .pagination {
        display: flex;
        .button {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #202020;
          margin-left: 10px;
          color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          .prev-icon.active {
            color: #8b8b8b;
          }
          .next-icon.active {
            color: #8b8b8b;
          }
        }
        .button:hover.active {
          background-color: #2b2b2b;
          cursor: pointer;
          transition: background-color 0.5s ease;
        }
      }
    }
    .swiperbox {
      flex: 1;
    }
  }
  .swiper-item {
    position: relative;
    .swiper-img {
      width: 100%;
      height: auto;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      .plusicon {
        position: absolute;
        background-color: #fff;
        border-radius: 50%;
        top: 10px;
        right: 10px;
        z-index: 9999;
        font-size: 24px;
        display: none;
      }
    }
    .swiper-img::after {
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
      border-radius: 0;
      transition: opacity 0.3s ease;
    }
    .swiper-img:hover::after {
      opacity: 0.1;
    }
    .swiper-img:hover .plusicon {
      display: block;
      cursor: pointer;
    }
    .swiper-info {
      display: flex;
      flex-direction: column;
      .type {
        font-size: 11px;
        color: rgba(245, 245, 245, 0.6);
        margin: 10px 0;
      }
      .name {
        color: #f5f5f5;
      }
      .tag {
        margin: 10px 0;
        span {
          font-size: 11px;
          color: rgb(245, 245, 245);
          padding: 5px 10px;
          border-radius: 2px;
          background: #2a2a2a;
          line-height: 25px;
        }
      }
      .price {
        display: flex;
        .price_1 {
          padding: 5px 10px;
          font-size: 11px;
          color: rgb(245, 245, 245);
          background-color: rgb(0, 116, 228);
          border-radius: 5px;
        }
        .price_2 {
          color: rgba(245, 245, 245, 0.6);
          text-decoration: line-through;
          margin: 0 7px;
        }
        .price_3 {
          color: #f5f5f5;
        }
      }
    }
  }
}
</style>
