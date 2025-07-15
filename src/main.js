// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入上面配置的路由

// 创建应用并挂载路由
createApp(App)
  .use(router) // 关键：启用路由功能
  .mount('#app') // 挂载到页面的 #app 元素