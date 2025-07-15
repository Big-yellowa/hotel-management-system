<template>
  <div class="my-orders-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">我的订单</h2>
      <button @click="goBack" class="back-btn">返回</button>
    </div>

    <!-- 订单筛选区域 -->
    <div class="order-filters">
      <div class="filter-group">
        <label class="filter-label">订单状态：</label>
        <select v-model="statusFilter" class="status-select" @change="filterOrders">
          <option value="all">全部订单</option>
          <option value="pending">待入住</option>
          <option value="checkin">已入住</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      <div class="filter-group date-filter">
        <label class="filter-label">日期范围：</label>
        <input 
          v-model="dateRange.start" 
          type="date" 
          class="date-input"
          placeholder="开始日期"
        />
        <span class="date-separator">至</span>
        <input 
          v-model="dateRange.end" 
          type="date" 
          class="date-input"
          placeholder="结束日期"
        />
        <button @click="filterOrders" class="filter-btn">筛选</button>
        <button @click="resetFilters" class="reset-btn">重置</button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list">
      <!-- 订单状态标签筛选 -->
      <div class="status-tabs">
        <button 
          v-for="tab in statusTabs" 
          :key="tab.value"
          @click="statusFilter = tab.value; filterOrders()"
          :class="{ 'active-status': statusFilter === tab.value }"
          class="status-tab"
        >
          {{ tab.label }}
          <span v-if="tab.value !== 'all'" class="status-count">{{ getStatusCount(tab.value) }}</span>
        </button>
      </div>

      <!-- 订单列表项 -->
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-item"
        @click="viewOrderDetail(order.id)"
      >
        <div class="order-header">
          <div class="order-status" :class="getOrderStatusClass(order.status)">
            {{ getOrderStatusText(order.status) }}
          </div>
          <div class="order-date">
            订单日期：{{ formatDate(order.orderDate) }}
          </div>
        </div>

        <div class="order-hotel-info">
          <img :src="order.hotelImage" :alt="order.hotelName" class="hotel-img" />
          <div class="hotel-info">
            <h3 class="hotel-name">{{ order.hotelName }}</h3>
            <p class="hotel-address">{{ order.hotelAddress }}</p>
            <div class="booking-dates">
              <span class="date-icon">📅</span>
              <span class="date-text">
                {{ formatDate(order.checkinDate) }} - {{ formatDate(order.checkoutDate) }}
                ({{ order.days }}晚)
              </span>
            </div>
            <div class="room-type">
              房型：{{ order.roomType }}
            </div>
          </div>
        </div>

        <div class="order-summary">
          <div class="order-price">
            <span class="price-label">总价：</span>
            <span class="price-value">¥{{ order.totalPrice }}</span>
          </div>
          <div class="order-number">
            订单编号：{{ order.orderNumber }}
          </div>
          <button class="detail-btn">查看详情</button>
        </div>
      </div>

      <!-- 无订单提示 -->
      <div v-if="filteredOrders.length === 0" class="no-orders">
        <img src="https://picsum.photos/id/20/100/100" alt="无订单" class="no-orders-img" />
        <p class="no-orders-text">暂无相关订单</p>
        <button @click="goToSearch" class="book-btn">去预订</button>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">订单详情</h3>
          <button @click="closeDetailModal" class="close-btn">×</button>
        </div>

        <div v-if="currentOrder" class="modal-content">
          <div class="detail-section">
            <h4 class="section-title">订单信息</h4>
            <div class="detail-item">
              <span class="detail-label">订单编号：</span>
              <span class="detail-value">{{ currentOrder.orderNumber }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态：</span>
              <span class="detail-value" :class="getOrderStatusClass(currentOrder.status)">
                {{ getOrderStatusText(currentOrder.status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单日期：</span>
              <span class="detail-value">{{ formatDate(currentOrder.orderDate) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">酒店信息</h4>
            <div class="hotel-detail">
              <img :src="currentOrder.hotelImage" :alt="currentOrder.hotelName" class="detail-hotel-img" />
              <div class="hotel-detail-info">
                <h5 class="detail-hotel-name">{{ currentOrder.hotelName }}</h5>
                <p class="detail-hotel-address">{{ currentOrder.hotelAddress }}</p>
                <div class="detail-hotel-contact">
                  <span class="contact-label">联系电话：</span>
                  <span class="contact-value">{{ currentOrder.hotelPhone }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">预订信息</h4>
            <div class="detail-item">
              <span class="detail-label">入住日期：</span>
              <span class="detail-value">{{ formatDate(currentOrder.checkinDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">退房日期：</span>
              <span class="detail-value">{{ formatDate(currentOrder.checkoutDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">入住天数：</span>
              <span class="detail-value">{{ currentOrder.days }}晚</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">房型：</span>
              <span class="detail-value">{{ currentOrder.roomType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">入住人：</span>
              <span class="detail-value">{{ currentOrder.guestName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">联系电话：</span>
              <span class="detail-value">{{ currentOrder.contactPhone }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">支付信息</h4>
            <div class="detail-item">
              <span class="detail-label">房间单价：</span>
              <span class="detail-value">¥{{ currentOrder.roomPrice }}/晚</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">入住天数：</span>
              <span class="detail-value">{{ currentOrder.days }}晚</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">服务费：</span>
              <span class="detail-value">¥{{ currentOrder.serviceFee }}</span>
            </div>
            <div class="detail-item total-price">
              <span class="detail-label">订单总价：</span>
              <span class="detail-value">¥{{ currentOrder.totalPrice }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付方式：</span>
              <span class="detail-value">{{ currentOrder.paymentMethod }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付状态：</span>
              <span class="detail-value">{{ currentOrder.paymentStatus ? '已支付' : '未支付' }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button 
              v-if="currentOrder.status === 'pending'" 
              @click="cancelOrder(currentOrder.id); closeDetailModal()"
              class="cancel-btn"
            >
              取消订单
            </button>
            <button 
              v-if="currentOrder.status === 'completed' && !currentOrder.reviewed" 
              @click="writeReview(currentOrder.id); closeDetailModal()"
              class="review-btn"
            >
              写评价
            </button>
            <button @click="closeDetailModal" class="close-modal-btn">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 状态管理
const statusFilter = ref('all');
const dateRange = ref({
  start: '',
  end: ''
});
const showDetailModal = ref(false);
const currentOrder = ref(null);
const orders = ref([]);

// 订单状态标签
const statusTabs = ref([
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待入住' },
  { value: 'checkin', label: '已入住' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]);

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD' + Date.now() - 10000000,
    orderDate: '2025-06-10',
    status: 'completed', // pending, checkin, completed, cancelled
    hotelName: '滨海国际酒店',
    hotelAddress: '上海市浦东新区世纪大道123号',
    hotelImage: 'https://picsum.photos/id/1031/200/150',
    hotelPhone: '021-12345678',
    checkinDate: '2025-06-15',
    checkoutDate: '2025-06-18',
    days: 3,
    roomType: '高级双人房',
    roomPrice: 580,
    serviceFee: 50,
    totalPrice: 580 * 3 + 50,
    guestName: '张先生',
    contactPhone: '13800138000',
    paymentMethod: '微信支付',
    paymentStatus: true,
    reviewed: false
  },
  {
    id: 2,
    orderNumber: 'ORD' + Date.now() - 5000000,
    orderDate: '2025-06-15',
    status: 'pending',
    hotelName: '青山湖度假酒店',
    hotelAddress: '杭州市西湖区湖光路88号',
    hotelImage: 'https://picsum.photos/id/1039/200/150',
    hotelPhone: '0571-87654321',
    checkinDate: '2025-07-05',
    checkoutDate: '2025-07-08',
    days: 3,
    roomType: '豪华湖景套房',
    roomPrice: 1280,
    serviceFee: 100,
    totalPrice: 1280 * 3 + 100,
    guestName: '李女士',
    contactPhone: '13900139000',
    paymentMethod: '支付宝',
    paymentStatus: true,
    reviewed: false
  },
  {
    id: 3,
    orderNumber: 'ORD' + Date.now() - 20000000,
    orderDate: '2025-05-20',
    status: 'cancelled',
    hotelName: '城市便捷酒店',
    hotelAddress: '上海市黄浦区南京东路567号',
    hotelImage: 'https://picsum.photos/id/1040/200/150',
    hotelPhone: '021-56789012',
    checkinDate: '2025-06-01',
    checkoutDate: '2025-06-03',
    days: 2,
    roomType: '商务单人房',
    roomPrice: 320,
    serviceFee: 30,
    totalPrice: 320 * 2 + 30,
    guestName: '王先生',
    contactPhone: '13700137000',
    paymentMethod: '银行卡',
    paymentStatus: true,
    reviewed: false
  },
  {
    id: 4,
    orderNumber: 'ORD' + Date.now() - 15000000,
    orderDate: '2025-06-05',
    status: 'checkin',
    hotelName: '花园精品酒店',
    hotelAddress: '北京市朝阳区建国路88号',
    hotelImage: 'https://picsum.photos/id/1042/200/150',
    hotelPhone: '010-98765432',
    checkinDate: '2025-07-10',
    checkoutDate: '2025-07-15',
    days: 5,
    roomType: '花园景观房',
    roomPrice: 580,
    serviceFee: 60,
    totalPrice: 580 * 5 + 60,
    guestName: '赵女士',
    contactPhone: '13600136000',
    paymentMethod: '微信支付',
    paymentStatus: true,
    reviewed: false
  }
];

// 初始化订单数据
onMounted(() => {
  // 实际项目中这里会从API获取数据
  orders.value = [...mockOrders];
});

// 过滤后的订单
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // 状态过滤
    if (statusFilter.value !== 'all' && order.status !== statusFilter.value) {
      return false;
    }
    
    // 日期范围过滤
    const orderDate = new Date(order.orderDate);
    if (dateRange.value.start && orderDate < new Date(dateRange.value.start)) {
      return false;
    }
    if (dateRange.value.end && orderDate > new Date(dateRange.value.end)) {
      return false;
    }
    
    return true;
  });
});

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '待入住',
    checkin: '已入住',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || '未知状态';
};

// 获取订单状态样式类
const getOrderStatusClass = (status) => {
  const classMap = {
    pending: 'status-pending',
    checkin: 'status-checkin',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };
  return `order-status ${classMap[status]}`;
};

// 获取特定状态的订单数量
const getStatusCount = (status) => {
  if (status === 'all') return '';
  return orders.value.filter(order => order.status === status).length;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 筛选订单
const filterOrders = () => {
  // 如果开始日期大于结束日期，交换它们
  if (dateRange.value.start && dateRange.value.end && 
      new Date(dateRange.value.start) > new Date(dateRange.value.end)) {
    [dateRange.value.start, dateRange.value.end] = [dateRange.value.end, dateRange.value.start];
  }
};

// 重置筛选条件
const resetFilters = () => {
  statusFilter.value = 'all';
  dateRange.value = {
    start: '',
    end: ''
  };
};

// 查看订单详情
const viewOrderDetail = (orderId) => {
  const order = orders.value.find(order => order.id === orderId);
  if (order) {
    currentOrder.value = { ...order };
    showDetailModal.value = true;
  }
};

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false;
  currentOrder.value = null;
};

// 返回上一页
const goBack = () => {
  // 实际项目中这里会导航到上一页
  console.log('返回上一页');
};

// 去搜索酒店
const goToSearch = () => {
  // 实际项目中这里会导航到酒店搜索页
  console.log('跳转到酒店搜索页');
};

// 取消订单
const cancelOrder = (orderId) => {
  if (confirm('确定要取消该订单吗？')) {
    const orderIndex = orders.value.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled';
      alert('订单已取消');
    }
  }
};

// 写评价
const writeReview = (orderId) => {
  // 实际项目中这里会跳转到写评价页面
  alert('跳转到写评价页面，订单ID：' + orderId);
  
  // 标记为已评价
  const orderIndex = orders.value.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders.value[orderIndex].reviewed = true;
  }
};
</script>

<style scoped>
.my-orders-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30px 20px;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-btn::before {
  content: '←';
  margin-right: 5px;
}

.order-filters {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  min-width: 70px;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.date-filter {
  flex: 1;
  min-width: 350px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.date-separator {
  margin: 0 5px;
  color: #666;
}

.filter-btn, .reset-btn {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-btn {
  background: #007bff;
  color: #fff;
  border: none;
}

.filter-btn:hover {
  background: #0056b3;
}

.reset-btn {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.reset-btn:hover {
  background: #f5f5f5;
}

.orders-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 8px 15px;
  background: #f0f2f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
}

.status-tab:hover {
  background: #e6e9ed;
}

.active-status {
  background: #007bff;
  color: #fff;
}

.status-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff5a5f;
  color: #fff;
  font-size: 10px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.order-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.order-status {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-checkin {
  background: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-date {
  color: #666;
  font-size: 14px;
}

.order-hotel-info {
  padding: 15px;
  display: flex;
  gap: 15px;
}

.hotel-img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.hotel-info {
  flex: 1;
}

.hotel-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.hotel-address {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.booking-dates, .room-type {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.date-icon {
  margin-right: 5px;
}

.order-summary {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.order-price {
  color: #333;
  font-size: 16px;
}

.price-label {
  color: #666;
  margin-right: 5px;
}

.price-value {
  color: #ff5a5f;
  font-weight: bold;
}

.order-number {
  color: #666;
  font-size: 14px;
}

.detail-btn {
  padding: 6px 15px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.detail-btn:hover {
  background: #0056b3;
}

.no-orders {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

.no-orders-img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-orders-text {
  margin-bottom: 20px;
}

.book-btn {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.book-btn:hover {
  background: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

.modal-title {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.section-title {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.detail-label {
  width: 120px;
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
}

.hotel-detail {
  display: flex;
  gap: 15px;
}

.detail-hotel-img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.detail-hotel-info {
  flex: 1;
}

.detail-hotel-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.detail-hotel-address {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.detail-hotel-contact {
  color: #666;
  font-size: 14px;
}

.contact-label {
  margin-right: 5px;
}

.total-price {
  font-weight: bold;
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background: #fff;
}

.cancel-btn, .review-btn, .close-modal-btn {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.cancel-btn {
  background: #ff5a5f;
  color: #fff;
  border: none;
}

.cancel-btn:hover {
  background: #e04e53;
}

.review-btn {
  background: #007bff;
  color: #fff;
  border: none;
}

.review-btn:hover {
  background: #0056b3;
}

.close-modal-btn {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.close-modal-btn:hover {
  background: #f5f5f5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .order-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .date-filter {
    min-width: auto;
  }
  
  .date-input {
    min-width: 100px;
  }
  
  .order-item {
    margin-bottom: 15px;
  }
  
  .order-hotel-info {
    flex-direction: column;
  }
  
  .hotel-img {
    width: 100%;
    height: 150px;
  }
  
  .order-summary {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-label {
    margin-bottom: 5px;
  }
  
  .hotel-detail {
    flex-direction: column;
  }
  
  .detail-hotel-img {
    width: 100%;
    height: 150px;
  }
}
</style>