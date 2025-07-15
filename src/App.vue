<template>
  <div class="navbar">
    <div class="nav-content">
      <!-- 左侧品牌/Logo区 -->
      <div class="nav-brand">
        <span class="brand-text">酒店管理系统</span>
      </div>
      
      <!-- 中间导航链接 -->
      <div class="nav-links">
        <router-link 
          to="/" 
          class="nav-item" 
          :class="{ 'nav-active': $route.path === '/' }"
        >首页</router-link>
         <router-link 
          to="/hotel-search" 
          class="nav-item" 
          :class="{ 'nav-active': $route.path === '/hotel-search' }"
        >酒店搜索</router-link>
         <router-link 
          to="/order" 
          class="nav-item" 
          :class="{ 'nav-active': $route.path === '/order' }"
        >订单管理</router-link>
        <router-link 
          to="/personal" 
          class="nav-item" 
          :class="{ 'nav-active': $route.path === '/personal' }"
        >个人信息</router-link>
        <span class="nav-item">关于我们</span>
      </div>
      
      <!-- 右侧用户信息区 -->
      <div class="nav-user" ref="navUserRef">
        <div class="user-avatar" @click="toggleDropdown">
          <img 
            :src="avatarUrl" 
            alt="用户头像" 
            class="avatar-img" 
          />
        </div>
        <!-- 用户下拉菜单 -->
        <div 
          class="user-dropdown" 
          :class="{ 'dropdown-active': dropdownVisible }"
        >
          <div class="dropdown-item" @click="goToPersonal">个人中心</div>
          <div class="dropdown-item">设置</div>
          <div class="dropdown-item" @click="logout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
  <router-view />
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  setup() {
    const dropdownVisible = ref(false)
    // 使用默认占位头像
    const avatarUrl = ref('https://picsum.photos/id/1005/200/200')
    // 创建DOM引用
    const navUserRef = ref(null)
    
    // 切换下拉菜单
    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value
    }
    
    // 跳转到个人中心
    const goToPersonal = () => {
      dropdownVisible.value = false
      // 确保router已正确引入
      window.location.href = '/personal'
    }
    
    // 退出登录
    const logout = () => {
      alert('退出登录成功')
      dropdownVisible.value = false
    }
    
    // 点击外部关闭下拉菜单
    const handleClickOutside = (e) => {
      if (navUserRef.value && !navUserRef.value.contains(e.target)) {
        dropdownVisible.value = false
      }
    }
    
    // 生命周期钩子
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      dropdownVisible,
      avatarUrl,
      navUserRef,
      toggleDropdown,
      goToPersonal,
      logout
    }
  }
}
</script>

<style>
/* 保持原有样式不变 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 导航栏容器 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 999;
}

/* 导航内容区 */
.nav-content {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

/* 品牌区样式 */
.nav-brand {
  font-size: 18px;
  font-weight: 600;
  color: #007bff;
  display: flex;
  align-items: center;
}
.brand-text {
  padding: 0 16px;
}

/* 导航链接区 */
.nav-links {
  display: flex;
  justify-content: center;
  flex: 1; /* 占据中间剩余空间 */
}

/* 导航项通用样式 */
.nav-item {
  position: relative;
  color: #333;
  text-decoration: none;
  padding: 0 20px;
  font-size: 15px;
  line-height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 激活态样式 */
.nav-active {
  color: #007bff;
}
.nav-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  width: calc(100% - 40px);
  height: 3px;
  background: #007bff;
  border-radius: 3px 3px 0 0;
}

/* 点击效果 */
.nav-item:active {
  background-color: rgba(0, 123, 255, 0.05);
}

/* 用户信息区 */
.nav-user {
  display: flex;
  align-items: center;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 用户下拉菜单 */
.user-dropdown {
  position: absolute;
  top: 50px;
  right: 16px;
  width: 160px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
}
.dropdown-active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #007bff;
}
.dropdown-item:active {
  background-color: #e6f7ff;
}
</style>