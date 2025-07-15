<template>
  <div class="hotel-search-container">
    <!-- 页面标题 -->
    <h2 class="page-title">酒店查询预订</h2>

    <!-- 搜索条件区域 -->
    <div class="search-filters">
      <div class="filter-item">
        <label class="filter-label">城市</label>
        <input 
          v-model="searchParams.city" 
          type="text" 
          class="filter-input" 
          placeholder="请输入城市"
        />
      </div>

      <div class="filter-item">
        <label class="filter-label">入住日期</label>
        <input 
          v-model="searchParams.checkinDate" 
          type="date" 
          class="filter-input"
        />
      </div>

      <div class="filter-item">
        <label class="filter-label">退房日期</label>
        <input 
          v-model="searchParams.checkoutDate" 
          type="date" 
          class="filter-input"
        />
      </div>

      <div class="filter-item">
        <label class="filter-label">房型</label>
        <select 
          v-model="searchParams.roomType" 
          class="filter-select"
        >
          <option value="">全部房型</option>
          <option value="single">单人房</option>
          <option value="double">双人房</option>
          <option value="suite">套房</option>
        </select>
      </div>

      <div class="filter-item filter-action">
        <button @click="handleSearch" class="search-btn">搜索</button>
        <button @click="resetFilters" class="reset-btn">重置</button>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results">
      <div class="results-header">
        <span class="results-count">{{ filteredHotels.length }} 家酒店符合条件</span>
        <select v-model="sortType" class="sort-select" @change="sortHotels">
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
        </select>
      </div>

      <!-- 酒店列表 -->
      <div class="hotel-list">
        <div 
          v-for="hotel in filteredHotels" 
          :key="hotel.id" 
          class="hotel-card"
        >
          <div class="hotel-image">
            <img :src="hotel.imageUrl" :alt="hotel.name" class="hotel-img" />
          </div>
          
          <div class="hotel-info">
            <h3 class="hotel-name">{{ hotel.name }}</h3>
            <p class="hotel-desc">{{ hotel.description }}</p>
            <div class="hotel-tags">
              <span class="tag" v-for="tag in hotel.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="hotel-details">
              <span class="room-type">房型：{{ hotel.roomType }}</span>
              <span class="rating">评分：{{ hotel.rating }}/5</span>
            </div>
          </div>
          
          <div class="hotel-price">
            <div class="price-info">
              <span class="price">¥{{ hotel.price }}</span>
              <span class="price-unit">/晚</span>
            </div>
            <button class="book-btn">立即预订</button>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-if="filteredHotels.length === 0 && hasSearched" class="no-results">
        没有找到符合条件的酒店，请尝试调整搜索条件
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 搜索参数
const searchParams = ref({
  city: '',
  checkinDate: '',
  checkoutDate: '',
  roomType: ''
});

// 排序类型
const sortType = ref('price-asc');

// 是否已搜索
const hasSearched = ref(false);

// 模拟酒店数据
const hotels = ref([
  {
    id: 1,
    name: '滨海国际酒店',
    description: '位于市中心，紧邻地铁站，交通便利，配套设施完善',
    imageUrl: 'https://picsum.photos/id/1031/400/300',
    price: 580,
    roomType: '双人房',
    tags: ['免费WiFi', '含早餐', '游泳池'],
    rating: 4.7,
    city: '上海'
  },
  {
    id: 2,
    name: '青山湖度假酒店',
    description: '湖景房，环境优美，适合休闲度假，提供接送服务',
    imageUrl: 'https://picsum.photos/id/1039/400/300',
    price: 780,
    roomType: '套房',
    tags: ['湖景房', '温泉', '免费停车'],
    rating: 4.9,
    city: '杭州'
  },
  {
    id: 3,
    name: '城市便捷酒店',
    description: '经济实惠，地理位置优越，靠近商业中心',
    imageUrl: 'https://picsum.photos/id/1040/400/300',
    price: 320,
    roomType: '单人房',
    tags: ['性价比高', '24小时前台', '免费WiFi'],
    rating: 4.3,
    city: '上海'
  },
  {
    id: 4,
    name: '花园精品酒店',
    description: '闹中取静，花园式设计，提供特色餐饮',
    imageUrl: 'https://picsum.photos/id/1042/400/300',
    price: 650,
    roomType: '双人房',
    tags: ['花园景观', '特色餐饮', '健身房'],
    rating: 4.6,
    city: '北京'
  }
]);

// 过滤后的酒店列表
const filteredHotels = computed(() => {
  if (!hasSearched.value) return [];

  return hotels.value.filter(hotel => {
    // 城市过滤
    if (searchParams.value.city && !hotel.city.includes(searchParams.value.city)) {
      return false;
    }
    // 房型过滤
    if (searchParams.value.roomType && hotel.roomType !== searchParams.value.roomType) {
      return false;
    }
    return true;
  });
});

// 处理搜索
const handleSearch = () => {
  // 简单验证
  if (!searchParams.value.city) {
    alert('请输入城市');
    return;
  }
  if (!searchParams.value.checkinDate || !searchParams.value.checkoutDate) {
    alert('请选择入住和退房日期');
    return;
  }
  if (new Date(searchParams.value.checkinDate) >= new Date(searchParams.value.checkoutDate)) {
    alert('退房日期必须晚于入住日期');
    return;
  }
  
  hasSearched.value = true;
  // 实际项目中这里会调用API获取数据
};

// 重置搜索条件
const resetFilters = () => {
  searchParams.value = {
    city: '',
    checkinDate: '',
    checkoutDate: '',
    roomType: ''
  };
  hasSearched.value = false;
};

// 排序酒店
const sortHotels = () => {
  if (sortType.value === 'price-asc') {
    filteredHotels.value.sort((a, b) => a.price - b.price);
  } else {
    filteredHotels.value.sort((a, b) => b.price - a.price);
  }
};

// 初始化日期（默认今天和明天）
onMounted(() => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  searchParams.value.checkinDate = today.toISOString().split('T')[0];
  searchParams.value.checkoutDate = tomorrow.toISOString().split('T')[0];
});
</script>

<style scoped>
.hotel-search-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30px 20px;
  box-sizing: border-box;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

/* 搜索条件区域 */
.search-filters {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.filter-item {
  display: flex;
  flex-direction: column;
  width: 180px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.filter-input, .filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-action {
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
  width: auto;
}

.search-btn {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

.reset-btn {
  padding: 10px 20px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #f5f5f5;
}

/* 搜索结果区域 */
.search-results {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.results-count {
  color: #666;
}

.sort-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 酒店列表 */
.hotel-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 20px;
}

.hotel-card {
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hotel-image {
  width: 200px;
  height: 160px;
  flex-shrink: 0;
}

.hotel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.hotel-name {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.hotel-desc {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
}

.hotel-tags {
  margin-bottom: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  padding: 3px 8px;
  background: #f0f7ff;
  color: #007bff;
  border-radius: 4px;
}

.hotel-details {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.hotel-price {
  width: 160px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  border-left: 1px solid #eee;
}

.price-info {
  text-align: right;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #ff5a5f;
}

.price-unit {
  color: #666;
  font-size: 14px;
}

.book-btn {
  width: 100%;
  padding: 8px 0;
  background: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.book-btn:hover {
  background: #e04e53;
}

.no-results {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-item {
    width: 100%;
  }
  
  .hotel-list {
    grid-template-columns: 1fr;
  }
  
  .hotel-card {
    flex-direction: column;
  }
  
  .hotel-image {
    width: 100%;
    height: 200px;
  }
  
  .hotel-price {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  
  .book-btn {
    width: auto;
    padding: 8px 20px;
  }
}
</style>