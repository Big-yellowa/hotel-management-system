// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// 引入组件
import HotelIndex from '../components/HotelIndex.vue'
import PersonalInfo from '../components/PersonalInfo.vue' // 引入个人信息组件
import HotelSearch from '../components/HotelSearch.vue';
// 配置路由规则
const routes = [
  {
    path: '/', // 默认首页路径
    name: 'HotelIndex',
    component: HotelIndex
  },
  {
    path: '/personal', // 个人信息页路径（访问时用这个路径）
    name: 'PersonalInfo',
    component: PersonalInfo // 关联到个人信息组件
  },
  {
    path: '/hotel-search',
    name: 'HotelSearch',
    component: HotelSearch
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 历史模式（无 # 号）
  routes
})

export default router // 导出路由，供入口文件使用