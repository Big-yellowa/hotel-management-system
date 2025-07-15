<template>
  <div class="personal-info-container">
    <!-- 页面标题 -->
    <h2 class="page-title">个人信息管理</h2>
    <!-- 信息编辑区域 -->
    <div class="info-edit-section">
      <!-- 昵称修改 -->
      <div class="form-item">
        <label class="form-label">昵称：</label>
        <input 
          v-model="nickname" 
          class="form-input" 
          placeholder="请输入昵称"
        />
      </div>
      <!-- 头像上传 -->
      <div class="form-item">
        <label class="form-label">头像：</label>
        <input 
          type="file" 
          @change="handleAvatarUpload" 
          class="avatar-upload"
        />
        <img 
          v-if="avatarUrl" 
          :src="avatarUrl" 
          alt="头像" 
          class="preview-avatar"
        />
      </div>
      <!-- 简介编辑 -->
      <div class="form-item">
        <label class="form-label">简介：</label>
        <textarea 
          v-model="bio" 
          class="bio-textarea" 
          placeholder="请输入简介内容"
        ></textarea>
      </div>
      <!-- 保存按钮 -->
      <button class="save-btn" @click="saveInfo">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 响应式数据，存储昵称、头像地址、简介
const nickname = ref('');
const avatarUrl = ref('');
const bio = ref('');

// 处理头像上传函数
const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 简单实现：将文件转为本地可预览的 URL（实际项目可结合后端上传）
    avatarUrl.value = URL.createObjectURL(file); 
  }
};

// 保存信息函数（实际需结合接口请求后端保存，这里先模拟提示）
const saveInfo = () => {
  // 可在此处编写调用后端接口的代码，传递 nickname、avatarUrl、bio 等数据
  console.log('保存的昵称：', nickname.value);
  console.log('保存的头像地址：', avatarUrl.value);
  console.log('保存的简介：', bio.value);
  alert('信息已保存（模拟）');
};
</script>

<style scoped>
/* 整体容器样式 */
.personal-info-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  box-sizing: border-box;
}
/* 页面标题样式 */
.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}
/* 信息编辑区域样式 */
.info-edit-section {
  width: 500px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
/* 表单项样式 */
.form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
/* 表单标签样式 */
.form-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
/* 输入框、文本域通用样式 */
.form-input,
.bio-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
}
/* 头像上传按钮及预览样式 */
.avatar-upload {
  margin-bottom: 10px;
  cursor: pointer;
}
.preview-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
/* 保存按钮样式 */
.save-btn {
  width: 100%;
  padding: 12px 0;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.save-btn:hover {
  background: #0056b3;
}
</style>