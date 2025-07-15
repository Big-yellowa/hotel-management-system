<template>
  <div class="hotel-index">
    <!-- 左侧内容区域 -->
    <div class="left-section">
      <div class="content-wrapper">
        <h1>欢迎来到酒店管理系统</h1>
        <p>提供优质的酒店住宿服务，给您舒适体验</p>
      </div>
    </div>
    <!-- 右侧登录注册模块 -->
    <div class="right-section">
      <div class="welcome">欢迎来到酒店管理系统</div>
      <div class="tab">
        <span :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">账号登录</span>
        <span :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">注册</span>
      </div>
      <div class="form-container" v-if="activeTab === 'login'">
        <input type="text" placeholder="请输入账号名/账号ID" class="input-field" />
        <input type="password" placeholder="请输入登录密码" class="input-field" />
        <div class="agreement">
          登录视为您已阅读并同意
          <a href="#" class="link">服务条款</a> 和 
          <a href="#" class="link">隐私政策</a>
        </div>
        <button class="login-btn">登录</button>
        <div class="other">
          <span>忘记账号</span>
          <span>忘记密码</span>
        </div>
        <div class="other-login">
          <span>其他登录方式：</span>
          <span class="icon">微信</span>
          <span class="icon">QQ</span>
        </div>
      </div>
      <div class="form-container" v-else>
        <input type="text" placeholder="请输入手机号" class="input-field" />
        <input type="text" placeholder="请输入验证码" class="input-field" />
        <button class="send-btn">发送验证码</button>
        <input type="password" placeholder="请设置登录密码" class="input-field" />
        <button class="register-btn">注册</button>
      </div>
      <div class="no-account" v-if="activeTab === 'login'">
        没有账号？<a href="#" @click="activeTab = 'register'" class="link">现在就注册</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelIndex',
  data() {
    return {
      activeTab: 'login' // 默认显示登录 tab，可切换为 'register'
    }
  }
}
</script>

<style scoped>
.hotel-index {
  display: flex;
  height: 100vh;
  background: linear-gradient(to right, #eaf6ff, #f5faff);
}
.left-section {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.left-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/id/1048/1920/1080'); /* 替换为实际背景图URL */
  background-size: cover;
  background-position: center;
  opacity: 0.6; /* 设置透明度 */
  z-index: 1;
}
.content-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #333;
  padding: 20px;
  text-align: center;
}
.right-section {
  width: 400px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
}
.welcome {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}
.tab {
  display: flex;
  margin-bottom: 20px;
}
.tab span {
  margin: 0 10px;
  cursor: pointer;
  color: #666;
}
.tab span.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}
.form-container {
  width: 100%;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.agreement {
  font-size: 12px;
  margin-bottom: 15px;
  color: #999;
}
.link {
  color: #007bff;
  text-decoration: none;
}
.login-btn, .register-btn, .send-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}
.send-btn {
  background-color: #6c757d;
}
.other {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}
.other-login {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}
.icon {
  margin: 0 5px;
  cursor: pointer;
}
.no-account {
  font-size: 12px;
  color: #999;
}
</style>