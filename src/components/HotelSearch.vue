<template>
  <div class="hotel-app-container">
    <!-- 页面标题 -->
    <h2 class="page-title">酒店查询预订</h2>

    <!-- 根据当前页面状态显示不同内容 -->
    <div v-if="currentPage === 'search'">
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
            <option value="单人房">单人房</option>
            <option value="双人房">双人房</option>
            <option value="套房">套房</option>
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
            <option value="rating-desc">评分从高到低</option>
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
              <button @click="goToDetail(hotel.id)" class="book-btn">查看详情</button>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredHotels.length === 0 && hasSearched" class="no-results">
          没有找到符合条件的酒店，请尝试调整搜索条件
        </div>
      </div>
    </div>

    <!-- 酒店详情及预订页 -->
    <div v-if="currentPage === 'detail' && currentHotel">
      <button @click="goBack" class="back-btn">← 返回列表</button>
      
      <div class="hotel-detail-container">
        <!-- 酒店基本信息 -->
        <div class="hotel-basic-info">
          <div class="detail-images">
            <img :src="currentHotel.imageUrl" :alt="currentHotel.name" class="main-image" />
            <div class="sub-images">
              <img 
                v-for="(img, index) in currentHotel.subImages" 
                :key="index" 
                :src="img" 
                :alt="`${currentHotel.name}图片${index+1}`" 
                class="sub-img"
              />
            </div>
          </div>
          
          <div class="detail-header">
            <h2 class="detail-name">{{ currentHotel.name }}</h2>
            <div class="detail-rating">
              <span class="rating-star">★</span>
              <span class="rating-value">{{ currentHotel.rating }}/5</span>
              <span class="review-count">({{ currentHotel.reviews.length }}条评价)</span>
            </div>
            <p class="detail-address">地址：{{ currentHotel.address }}</p>
            <div class="detail-tags">
              <span class="detail-tag" v-for="tag in currentHotel.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        
        <!-- 预订信息摘要 -->
        <div class="booking-summary">
          <div class="summary-item">
            <span class="summary-label">入住日期：</span>
            <span class="summary-value">{{ formatDate(searchParams.checkinDate) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">退房日期：</span>
            <span class="summary-value">{{ formatDate(searchParams.checkoutDate) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">入住天数：</span>
            <span class="summary-value">{{ calculateDays() }} 天</span>
          </div>
          <div class="summary-item total-price">
            <span class="summary-label">总价：</span>
            <span class="summary-value">¥{{ currentHotel.price * calculateDays() }}</span>
          </div>
        </div>
        
        <!-- 酒店详情标签页 -->
        <div class="detail-tabs">
          <div class="tab-buttons">
            <button 
              @click="activeTab = 'description'" 
              :class="{ 'active-tab': activeTab === 'description' }"
              class="tab-btn"
            >
              酒店介绍
            </button>
            <button 
              @click="activeTab = 'facilities'" 
              :class="{ 'active-tab': activeTab === 'facilities' }"
              class="tab-btn"
            >
              设施服务
            </button>
            <button 
              @click="activeTab = 'rooms'" 
              :class="{ 'active-tab': activeTab === 'rooms' }"
              class="tab-btn"
            >
              房型详情
            </button>
            <button 
              @click="activeTab = 'reviews'" 
              :class="{ 'active-tab': activeTab === 'reviews' }"
              class="tab-btn"
            >
              宾客评价
            </button>
          </div>
          
          <!-- 酒店介绍 -->
          <div v-if="activeTab === 'description'" class="tab-content">
            <h3>酒店介绍</h3>
            <p class="description-content">{{ currentHotel.detailedDescription }}</p>
          </div>
          
          <!-- 设施服务 -->
          <div v-if="activeTab === 'facilities'" class="tab-content">
            <h3>设施与服务</h3>
            <div class="facilities-grid">
              <div class="facility-item" v-for="facility in currentHotel.facilities" :key="facility.id">
                <span class="facility-icon">•</span>
                <span class="facility-name">{{ facility.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- 房型详情 -->
          <div v-if="activeTab === 'rooms'" class="tab-content">
            <h3>房型详情</h3>
            <div class="room-types">
              <div 
                v-for="room in currentHotel.availableRooms" 
                :key="room.id" 
                class="room-type-item"
                :class="{ 'selected-room': selectedRoomId === room.id }"
                @click="selectRoom(room.id)"
              >
                <div class="room-info">
                  <h4 class="room-name">{{ room.name }}</h4>
                  <p class="room-desc">{{ room.description }}</p>
                  <div class="room-features">
                    <span class="feature" v-for="feature in room.features" :key="feature">{{ feature }}</span>
                  </div>
                </div>
                <div class="room-price">
                  <span class="room-price-value">¥{{ room.price }}/晚</span>
                  <span class="room-capacity">最多{{ room.capacity }}人</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 宾客评价 -->
          <div v-if="activeTab === 'reviews'" class="tab-content">
            <div class="reviews-header">
              <h3>宾客评价</h3>
              <button @click="showReviewForm = true" class="write-review-btn">写评价</button>
            </div>
            
            <!-- 评价表单 -->
            <div v-if="showReviewForm" class="review-form-container">
              <h4>发表评价</h4>
              <div class="review-form">
                <div class="form-group">
                  <label class="form-label">评分：</label>
                  <select v-model="newReview.rating" class="form-select">
                    <option value="1">1星 - 很差</option>
                    <option value="2">2星 - 较差</option>
                    <option value="3">3星 - 一般</option>
                    <option value="4">4星 - 良好</option>
                    <option value="5">5星 - 优秀</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">评价内容：</label>
                  <textarea 
                    v-model="newReview.content" 
                    class="form-textarea" 
                    placeholder="请分享您的入住体验..."
                    rows="4"
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button @click="submitReview" class="submit-review">提交</button>
                  <button @click="showReviewForm = false" class="cancel-review">取消</button>
                </div>
              </div>
            </div>
            
            <!-- 评价列表 -->
            <div class="reviews-list">
              <div 
                v-for="(review, index) in currentHotel.reviews" 
                :key="index" 
                class="review-item"
              >
                <div class="review-header">
                  <span class="reviewer-name">{{ review.userName }}</span>
                  <span class="review-date">{{ formatDate(review.date) }}</span>
                  <span class="review-rating">★ {{ review.rating }}/5</span>
                </div>
                <div class="review-content">
                  {{ review.content }}
                </div>
              </div>
              
              <div v-if="currentHotel.reviews.length === 0" class="no-reviews">
                暂无评价，快来成为第一个评价的人吧！
              </div>
            </div>
          </div>
        </div>
        
        <!-- 预订表单 -->
        <div class="booking-form-container">
          <h3 class="booking-title">预订信息</h3>
          <div class="booking-form">
            <div class="form-group">
              <label class="form-label">入住人姓名：</label>
              <input 
                v-model="bookingInfo.name" 
                type="text" 
                class="form-input" 
                placeholder="请输入姓名"
              />
            </div>
            <div class="form-group">
              <label class="form-label">联系电话：</label>
              <input 
                v-model="bookingInfo.phone" 
                type="tel" 
                class="form-input" 
                placeholder="请输入手机号码"
              />
            </div>
            <div class="form-group">
              <label class="form-label">电子邮箱：</label>
              <input 
                v-model="bookingInfo.email" 
                type="email" 
                class="form-input" 
                placeholder="请输入邮箱（选填）"
              />
            </div>
            <div class="form-group">
              <label class="form-label">特殊要求：</label>
              <textarea 
                v-model="bookingInfo.specialRequests" 
                class="form-textarea" 
                placeholder="如有特殊需求，请在此说明"
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button 
                @click="confirmBooking" 
                class="confirm-btn"
                :disabled="!selectedRoomId || !bookingInfo.name || !bookingInfo.phone"
              >
                确认预订
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预订成功提示 -->
    <div v-if="currentPage === 'success'">
      <div class="success-container">
        <div class="success-icon">✓</div>
        <h2 class="success-title">预订成功！</h2>
        <p class="success-message">您已成功预订 {{ bookingSuccessInfo.hotelName }}</p>
        <div class="booking-details">
          <p>预订编号：{{ bookingSuccessInfo.bookingId }}</p>
          <p>入住日期：{{ formatDate(bookingSuccessInfo.checkinDate) }}</p>
          <p>退房日期：{{ formatDate(bookingSuccessInfo.checkoutDate) }}</p>
          <p>房型：{{ bookingSuccessInfo.roomType }}</p>
          <p>总价：¥{{ bookingSuccessInfo.totalPrice }}</p>
        </div>
        <button @click="goToSearch" class="back-to-search">返回搜索</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 页面状态管理
const currentPage = ref('search'); // search, detail, success
const currentHotel = ref(null);
const selectedRoomId = ref(null);
const activeTab = ref('description');
const showReviewForm = ref(false);

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

// 预订信息
const bookingInfo = ref({
  name: '',
  phone: '',
  email: '',
  specialRequests: ''
});

// 新评价信息
const newReview = ref({
  rating: '5',
  content: ''
});

// 预订成功信息
const bookingSuccessInfo = ref({});

// 模拟酒店数据（更详细）
const hotels = ref([
  {
    id: 1,
    name: '滨海国际酒店',
    description: '位于市中心，紧邻地铁站，交通便利，配套设施完善',
    detailedDescription: '滨海国际酒店地处城市核心商圈，距离地铁站仅300米，周边购物中心、餐饮娱乐设施齐全。酒店拥有各类豪华客房，装修现代典雅，配备高速WiFi、智能电视和独立卫浴系统。酒店内设有中西餐厅、健身中心和室内游泳池，为您提供全方位的舒适体验。我们的专业服务团队将24小时为您提供贴心服务，确保您的入住体验愉悦难忘。',
    imageUrl: 'https://picsum.photos/id/1031/800/500',
    subImages: [
      'https://picsum.photos/id/1048/400/300',
      'https://picsum.photos/id/1057/400/300',
      'https://picsum.photos/id/1060/400/300'
    ],
    price: 580,
    roomType: '双人房',
    address: '上海市浦东新区世纪大道123号',
    tags: ['免费WiFi', '含早餐', '游泳池'],
    rating: 4.7,
    city: '上海',
    facilities: [
      { id: 1, name: '免费停车场' },
      { id: 2, name: '健身中心' },
      { id: 3, name: '室内游泳池' },
      { id: 4, name: '餐厅' },
      { id: 5, name: '24小时前台' },
            { id: 6, name: '商务中心' },
      { id: 7, name: '会议室' },
      { id: 8, name: '行李寄存' },
      { id: 9, name: '电梯' },
      { id: 10, name: '免费WiFi' }
    ],
    availableRooms: [
      {
        id: 101,
        name: '豪华单人房',
        description: '30平方米，特大床，独立卫浴，城市景观',
        price: 480,
        capacity: 1,
        features: ['大床', '独立卫浴', '免费WiFi', '空调']
      },
      {
        id: 102,
        name: '高级双人房',
        description: '40平方米，双床或大床可选，独立卫浴，部分海景',
        price: 580,
        capacity: 2,
        features: ['双床/大床', '独立卫浴', '免费WiFi', '空调', '海景']
      },
      {
        id: 103,
        name: '行政套房',
        description: '60平方米，独立卧室和客厅，行政礼遇，全景海景',
        price: 980,
        capacity: 2,
        features: ['独立客厅', '独立卫浴', '免费WiFi', '空调', '海景', '行政礼遇']
      }
    ],
    reviews: [
      {
        userName: '张先生',
        rating: 4.8,
        content: '位置非常好，出行方便，房间干净整洁，服务态度也很好，早餐很丰富，值得推荐。',
        date: '2025-06-15'
      },
      {
        userName: '李女士',
        rating: 4.5,
        content: '海景房视野很棒，房间设施新，床很舒适，唯一不足是淋浴水压有点小，总体很满意。',
        date: '2025-05-28'
      },
      {
        userName: '王先生',
        rating: 5.0,
        content: '酒店服务一流，前台热情专业，行李员帮忙搬运行李很贴心。房间宽敞明亮，设施齐全，下次还会选择。',
        date: '2025-04-10'
      }
    ]
  },
  {
    id: 2,
    name: '青山湖度假酒店',
    description: '湖景房，环境优美，适合休闲度假，提供接送服务',
    detailedDescription: '青山湖度假酒店坐落在风景秀丽的青山湖畔，占地面积达500亩，拥有广阔的园林景观和湖景资源。酒店建筑融合了当地传统文化元素，营造出宁静舒适的度假氛围。所有客房均配备高品质床品、私人阳台和现代卫浴设施，部分房间可欣赏到壮丽的湖景。酒店提供多种休闲娱乐设施，包括温泉浴场、SPA中心、网球场和自行车租赁服务。此外，酒店还提供往返市区的定时班车服务，方便客人出行。',
    imageUrl: 'https://picsum.photos/id/1039/800/500',
    subImages: [
      'https://picsum.photos/id/1040/400/300',
      'https://picsum.photos/id/1053/400/300',
      'https://picsum.photos/id/1061/400/300'
    ],
    price: 780,
    roomType: '套房',
    address: '杭州市西湖区湖光路88号',
    tags: ['湖景房', '温泉', '免费停车'],
    rating: 4.9,
    city: '杭州',
    facilities: [
      { id: 1, name: '免费停车场' },
      { id: 2, name: '温泉浴场' },
      { id: 3, name: 'SPA中心' },
      { id: 4, name: '餐厅' },
      { id: 5, name: '24小时前台' },
      { id: 6, name: '网球场' },
      { id: 7, name: '自行车租赁' },
      { id: 8, name: '会议室' },
      { id: 9, name: '电梯' },
      { id: 10, name: '免费WiFi' }
    ],
    availableRooms: [
      {
        id: 201,
        name: '湖景双人房',
        description: '45平方米，大床或双床，私人阳台，湖景',
        price: 680,
        capacity: 2,
        features: ['大床/双床', '独立卫浴', '免费WiFi', '空调', '湖景', '阳台']
      },
      {
        id: 202,
        name: '豪华湖景套房',
        description: '70平方米，独立卧室和客厅，私人温泉池，全景湖景',
        price: 1280,
        capacity: 2,
        features: ['独立客厅', '独立卫浴', '免费WiFi', '空调', '湖景', '温泉池', '阳台']
      },
      {
        id: 203,
        name: '家庭套房',
        description: '90平方米，两间卧室，适合家庭入住，湖景',
        price: 1580,
        capacity: 4,
        features: ['两间卧室', '独立卫浴', '免费WiFi', '空调', '湖景', '阳台']
      }
    ],
    reviews: [
      {
        userName: '陈女士',
        rating: 5.0,
        content: '环境优美，空气清新，湖景房视野无敌。酒店设施完善，温泉泡着很舒服，服务也很周到，是放松身心的好地方。',
        date: '2025-06-20'
      },
      {
        userName: '刘先生',
        rating: 4.7,
        content: '带全家来度假，家庭套房很宽敞，孩子们很喜欢。酒店的自行车租赁服务很方便，沿着湖边骑行很惬意。早餐品种丰富，推荐。',
        date: '2025-05-12'
      },
      {
        userName: '赵女士',
        rating: 4.9,
        content: '豪华湖景套房的私人温泉池很赞，晚上可以边泡温泉边看星星。服务人员热情友好，有求必应，下次还会再来。',
        date: '2025-04-25'
      }
    ]
  },
  {
    id: 3,
    name: '城市便捷酒店',
    description: '经济实惠，地理位置优越，靠近商业中心',
    detailedDescription: '城市便捷酒店位于城市商业中心地带，周边商场、超市、餐厅林立，交通十分便利。酒店致力于为商务和休闲旅客提供经济实惠的住宿选择。客房设计简约现代，配备舒适的床铺、高速WiFi和独立卫浴。酒店提供24小时前台服务、免费早餐和自助洗衣服务，满足您的各种需求。无论是商务出差还是旅游观光，城市便捷酒店都是您理想的下榻之所。',
    imageUrl: 'https://picsum.photos/id/1040/800/500',
    subImages: [
      'https://picsum.photos/id/1041/400/300',
      'https://picsum.photos/id/1042/400/300',
      'https://picsum.photos/id/1043/400/300'
    ],
    price: 320,
    roomType: '单人房',
    address: '上海市黄浦区南京东路567号',
    tags: ['性价比高', '24小时前台', '免费WiFi'],
    rating: 4.3,
    city: '上海',
    facilities: [
      { id: 1, name: '免费WiFi' },
      { id: 2, name: '24小时前台' },
      { id: 3, name: '免费早餐' },
      { id: 4, name: '自助洗衣' },
      { id: 5, name: '电梯' }
    ],
    availableRooms: [
      {
        id: 301,
        name: '标准单人房',
        description: '20平方米，单人床，独立卫浴，安静舒适',
        price: 280,
        capacity: 1,
        features: ['单人床', '独立卫浴', '免费WiFi', '空调']
      },
      {
        id: 302,
        name: '商务单人房',
        description: '25平方米，加大床，办公桌，独立卫浴',
        price: 320,
        capacity: 1,
        features: ['加大床', '独立卫浴', '免费WiFi', '空调', '办公桌']
      },
      {
        id: 303,
        name: '双人标准房',
        description: '30平方米，双床，独立卫浴，适合双人入住',
        price: 420,
        capacity: 2,
        features: ['双床', '独立卫浴', '免费WiFi', '空调']
      }
    ],
    reviews: [
      {
        userName: '孙先生',
        rating: 4.2,
        content: '位置很好，出行方便，价格实惠，房间干净整洁，很适合商务出差。早餐虽然简单但很可口。',
        date: '2025-06-10'
      },
      {
        userName: '周女士',
        rating: 4.5,
        content: '酒店性价比很高，服务也不错，房间虽小但布局合理，该有的都有。离地铁站很近，购物吃饭都很方便。',
        date: '2025-05-20'
      },
      {
        userName: '吴先生',
        rating: 4.0,
        content: '作为经济型酒店来说很不错了，房间安静，床很舒服，前台服务态度很好。唯一不足是早餐种类较少。',
        date: '2025-04-05'
      }
    ]
  },
  {
    id: 4,
    name: '花园精品酒店',
    description: '闹中取静，花园式设计，提供特色餐饮',
    detailedDescription: '花园精品酒店位于市中心繁华地段，但却巧妙地营造出宁静的花园氛围。酒店由知名设计师精心打造，融合了现代与传统元素，每一处细节都展现出独特的艺术品味。酒店拥有50间风格各异的客房，每间都配备高品质的床品、智能家居系统和私人露台。酒店内的花园餐厅提供地道的本地美食和国际佳肴，食材均选用当地新鲜有机农产品。此外，酒店还设有SPA中心、健身房和图书馆，为客人提供全方位的舒适体验。',
    imageUrl: 'https://picsum.photos/id/1042/800/500',
    subImages: [
      'https://picsum.photos/id/1043/400/300',
      'https://picsum.photos/id/1044/400/300',
      'https://picsum.photos/id/1045/400/300'
    ],
    price: 650,
    roomType: '双人房',
    address: '北京市朝阳区建国路88号',
    tags: ['花园景观', '特色餐饮', '健身房'],
    rating: 4.6,
    city: '北京',
    facilities: [
      { id: 1, name: '花园餐厅' },
      { id: 2, name: 'SPA中心' },
      { id: 3, name: '健身房' },
      { id: 4, name: '图书馆' },
      { id: 5, name: '24小时前台' },
      { id: 6, name: '行李寄存' },
      { id: 7, name: '电梯' },
      { id: 8, name: '免费WiFi' }
    ],
    availableRooms: [
      {
        id: 401,
        name: '花园景观房',
        description: '35平方米，大床，私人露台，花园景观',
        price: 580,
        capacity: 2,
        features: ['大床', '独立卫浴', '免费WiFi', '空调', '花园景观', '露台']
      },
      {
        id: 402,
        name: '豪华套房',
        description: '60平方米，独立卧室和客厅，私人花园，管家服务',
        price: 1180,
        capacity: 2,
        features: ['独立客厅', '独立卫浴', '免费WiFi', '空调', '花园景观', '管家服务']
      },
      {
        id: 403,
        name: '家庭房',
        description: '50平方米，一间大床和一间双床，适合家庭入住',
        price: 880,
        capacity: 3,
        features: ['双卧室', '独立卫浴', '免费WiFi', '空调', '花园景观']
      }
    ],
    reviews: [
      {
        userName: '郑女士',
        rating: 4.8,
        content: '酒店环境非常好，花园很漂亮，房间宽敞明亮，设施齐全。餐厅的菜品很有特色，味道很棒。服务人员态度亲切，很满意这次入住。',
        date: '2025-06-18'
      },
      {
        userName: '王先生',
        rating: 4.7,
        content: '位置很好，交通便利，但却很安静。房间设计很有品味，床很舒适。SPA中心的服务很棒，强烈推荐。',
        date: '2025-05-25'
      },
      {
        userName: '林女士',
        rating: 4.9,
        content: '带孩子来北京旅游，家庭房很适合我们。房间干净整洁，设施安全，孩子很喜欢花园。早餐很丰富，服务周到，下次还会选择。',
        date: '2025-04-15'
      }
    ]
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
  } else if (sortType.value === 'price-desc') {
    filteredHotels.value.sort((a, b) => b.price - a.price);
  } else if (sortType.value === 'rating-desc') {
    filteredHotels.value.sort((a, b) => b.rating - a.rating);
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

// 页面导航函数
const goToDetail = (hotelId) => {
  const hotel = hotels.value.find(h => h.id === hotelId);
  if (hotel) {
    currentHotel.value = hotel;
    currentPage.value = 'detail';
    // 默认选择第一个房型
    if (hotel.availableRooms && hotel.availableRooms.length > 0) {
      selectedRoomId.value = hotel.availableRooms[0].id;
    }
  }
};

const goBack = () => {
  currentPage.value = 'search';
  currentHotel.value = null;
  selectedRoomId.value = null;
  activeTab.value = 'description';
};

const goToSearch = () => {
  currentPage.value = 'search';
  bookingInfo.value = {
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  };
};

// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 计算入住天数
const calculateDays = () => {
  if (!searchParams.value.checkinDate || !searchParams.value.checkoutDate) return 0;
  const checkin = new Date(searchParams.value.checkinDate);
  const checkout = new Date(searchParams.value.checkoutDate);
  const diffTime = Math.abs(checkout - checkin);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 选择房型
const selectRoom = (roomId) => {
  selectedRoomId.value = roomId;
};

// 获取当前选择的房型
const getSelectedRoom = computed(() => {
  if (!currentHotel.value || !selectedRoomId.value) return null;
  return currentHotel.value.availableRooms.find(room => room.id === selectedRoomId.value);
});

// 提交评价
const submitReview = () => {
  if (!newReview.value.content.trim()) {
    alert('请输入评价内容');
    return;
  }
  
  // 添加新评价
  const newReviewObj = {
    userName: '匿名用户',
    rating: parseFloat(newReview.value.rating),
    content: newReview.value.content,
    date: new Date().toISOString().split('T')[0]
  };
  
  currentHotel.value.reviews.unshift(newReviewObj);
  
  // 更新酒店评分
  const ratings = currentHotel.value.reviews.map(r => r.rating);
  const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  currentHotel.value.rating = parseFloat(averageRating.toFixed(1));
  
  // 重置表单
  newReview.value = {
    rating: '5',
    content: ''
  };
  
  showReviewForm.value = false;
  alert('评价提交成功！感谢您的反馈。');
};

// 确认预订
const confirmBooking = () => {
  if (!selectedRoomId.value) {
    alert('请选择房型');
    return;
  }
  
  if (!bookingInfo.value.name) {
    alert('请输入入住人姓名');
    return;
  }
  
  if (!bookingInfo.value.phone) {
    alert('请输入联系电话');
    return;
  }
  
  // 生成预订信息
  const room = getSelectedRoom.value;
  const totalPrice = room.price * calculateDays();
  const bookingId = 'BK' + Date.now().toString().slice(-8);
  
  bookingSuccessInfo.value = {
    bookingId,
    hotelName: currentHotel.value.name,
    checkinDate: searchParams.value.checkinDate,
    checkoutDate: searchParams.value.checkoutDate,
    roomType: room.name,
    totalPrice
  };
  
  // 切换到成功页面
  currentPage.value = 'success';
};
</script>

<style scoped>
.hotel-app-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30px 20px;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.back-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.back-btn::before {
  content: '←';
  margin-right: 5px;
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

/* 酒店详情页 */
.hotel-detail-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.hotel-basic-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.detail-images {
  flex: 1;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.sub-images {
  display: flex;
  gap: 10px;
}

.sub-img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.sub-img:hover {
  opacity: 1;
}

.detail-header {
  flex: 1;
}

.detail-name {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.detail-rating {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-star {
  color: #ffb400;
  margin-right: 5px;
}

.rating-value {
  margin-right: 10px;
  font-weight: bold;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.detail-address {
  color: #666;
  margin-bottom: 15px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.detail-tag {
  font-size: 14px;
  padding: 4px 10px;
  background: #f0f7ff;
  color: #007bff;
  border-radius: 4px;
}

.booking-summary {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.summary-item {
  display: flex;
  margin-bottom: 10px;
}

.summary-label {
  width: 100px;
  color: #666;
}

.summary-value {
  font-weight: bold;
}

.total-price {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

.total-price .summary-value {
  color: #ff5a5f;
  font-size: 18px;
}

.detail-tabs {
  margin-bottom: 30px;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  position: relative;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: transparent;
  transition: background 0.3s;
}

.tab-btn:hover {
  color: #007bff;
}

.active-tab {
  color: #007bff;
  font-weight: bold;
}

.active-tab::after {
  background: #007bff;
}

.tab-content {
  padding: 0 10px;
}

h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
}

.description-content {
  color: #666;
  line-height: 1.8;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.facility-item {
  display: flex;
  align-items: center;
}

.facility-icon {
  color: #007bff;
  margin-right: 8px;
}

.facility-name {
  color: #666;
}

.room-types {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.room-type-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.room-type-item:hover {
  border-color: #007bff;
  background: #f8fafc;
}

.selected-room {
  border-color: #007bff;
  background: #f0f7ff;
}

.room-info {
  flex: 1;
  margin-right: 20px;
}

.room-name {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.room-desc {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.room-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature {
  font-size: 12px;
  padding: 2px 8px;
  background: #e9ecef;
  color: #666;
  border-radius: 4px;
}

.room-price {
  text-align: right;
}

.room-price-value {
  font-size: 20px;
  font-weight: bold;
  color: #ff5a5f;
  display: block;
  margin-bottom: 5px;
}

.room-capacity {
  color: #666;
  font-size: 14px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.write-review-btn {
  padding: 8px 15px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.write-review-btn:hover {
  background: #0056b3;
}

.review-form-container {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-weight: bold;
}

.form-select, .form-input, .form-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.submit-review {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-review:hover {
  background: #0056b3;
}

.cancel-review {
  padding: 10px 20px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-review:hover {
  background: #f5f5f5;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.review-header {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: #666;
}

.review-rating {
  color: #ffb400;
}

.review-content {
  color: #333;
  line-height: 1.6;
}

.no-reviews {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.booking-form-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.booking-title {
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.confirm-btn {
  padding: 12px 20px;
  background: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 16px;
  font-weight: bold;
}

.confirm-btn:hover {
  background: #e04e53;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.success-container {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  background: #28a745;
  color: #fff;
  border-radius: 50%;
  font-size: 36px;
  line-height: 60px;
  margin-bottom: 20px;
}

.success-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.success-message {
  color: #666;
  font-size: 18px;
  margin-bottom: 30px;
}

.booking-details {
  text-align: left;
  max-width: 300px;
  margin: 0 auto 40px;
}

.booking-details p {
  margin-bottom: 10px;
}

.back-to-search {
  padding: 12px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 16px;
}

.back-to-search:hover {
  background: #0056b3;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-filters {
    padding: 15px;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-action {
    width: 100%;
    justify-content: center;
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
  
  .hotel-basic-info {
    flex-direction: column;
  }
  
  .main-image {
    height: 250px;
  }
  
  .facilities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .room-type-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .room-price {
    text-align: left;
    margin-top: 10px;
  }
  
  .review-header {
    flex-direction: column;
    gap: 5px;
  }
  
  .success-container {
    padding: 20px;
  }
}
</style>