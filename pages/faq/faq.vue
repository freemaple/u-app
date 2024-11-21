<template>
  <view>
    <nav-back :title="$t('faq.faq')"></nav-back>
    <back-top :showBtn="showBacktopBtn"></back-top>
    <view class="faq-container">
      <view class="faq-banner">
        <image src="@/static/images/faq/faqbg.png" alt="" class="banner-img"/>         
        <view class="search-box">
            <view class="box-text">{{ $t('faq.for_help') }}</view> 
            <view class="search">
                <input @confirm="handleSearch" v-model="inputVal" @focus="(e)=>{$debounce(changeFocus,300,[e])}" @blur="(e)=>{$debounce(changeFocus,300,[e])}" @input="(e)=>{$debounce(handleChangeInput, 300, [e])}" aria-hidden="true" tabindex="-1" type="text" maxlength="100" :placeholder="$t('faq.placeholder')" class="search-input"> 
                <i class="iconfont icon-search dark search-icon" @tap="handleSearch"></i> 
                <i :class="'iconfont ' + (inputVal ? 'clear-val' : '')" @tap="clearSearch"></i>
            </view>
            <view :class="'search-list '+ (isInputFocus ? 'searchShow' : '')">
              <view class="list-item" v-show="!searchData.length&&inputVal&&showNoData">{{ $t("faq.no_data") }}</view>
              <view v-show="searchData.length" v-for="(item) in searchData" :key="item.id" @tap="handleChoose(item)" class="list-item">{{ item.title }}</view>
            </view>
        </view>
      </view>
    <view class="nav-list">
      <view v-for="(item, index) in initData" :key="index" :class="'nav-list-item ' + (item.isOpen?'nav-list-item-active':'')">
        <view class="item-title" @tap="handleClickType(index)">
          <view class="nav-title"><image :src="(item.isOpen ? item.type_name_img_1 : item.type_name_img_2)" class="icon_img" alt=""/>{{ item.type_name }}</view>
          <i class="iconfont icon-search dark open-icon"></i>
        </view>
        <view class="list-content-wrapper">
          <view class="list-outer">
            <view class="list-inner">
              <view class="list-ul">
                <view v-for="(ite, ind) in item.list" :key="ind" :class="'nav-item ' + (ite.isOpen ? 'nav-item-active':'')">
                  <view class="article" @tap="handleClickQuestion(item.list, ind)">{{ ite.title }}</view>
                  <view class="item-answer">
                    <view class="answer-content" v-html="ite.content"></view>
                    <view class="helpful-tip">{{ $t("faq.is_helpful") }}</view>
                    <view class="iflike">
                      <view class="like">
                        <i :class="'iconfont icon-search dark like-icon ' + (ite.is_helpful == '1' ? 'hasVote':'')" @tap="handleVote(ite,1)"></i>
                      </view>
                      <view class="like">
                        <i :class="'iconfont icon-search dark unlike-icon ' + (ite.is_helpful == '2' ? 'hasVote':'')" @tap="handleVote(ite,2)"></i>
                      </view>
                    </view>
                  </view>
                </view>
                
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
let initDataCopy = []
export default {  
  data() {
    return {
      initData: [],
      searchData: [],
      isInputFocus: false,
      inputVal: '',
      showNoData: false,
      showBacktopBtn: false,
    }
  },
  onLoad() {      
    this.$apis.queryFaqLists().then((res) => {
      if(res.code == '200') {
        initDataCopy = res.data
        initDataCopy.forEach(item=>{
          item.isOpen = false
          item.list.forEach(ite=>{
            ite.isOpen = false
          })
        })
        this.initData = this.filterDataFunc(initDataCopy, '')
        
      }
       
    })
  },
  onShow() {
	  this.$maEvent.visit_event({
	  	event_category: 'faq',
	  	event_action: 'faq_visit',
	  	event_name: 'faq_visit'
	  })
  },
  onPageScroll: function (t) {
        if (t.scrollTop >= 180) {
            this.showBacktopBtn = true
        } else {
            this.showBacktopBtn = false
        }
    },
  methods: {
    //点击分类
    handleClickType(index) {
      this.initData.forEach((item, ind)=> {
        if(ind === index) {
          item.isOpen = !item.isOpen
        }else {
          item.isOpen = false
        }
      })
    },

    //点击问题
    handleClickQuestion(list, ind) {      
      list.map((item,i)=> {
        if(ind === i){
          item.isOpen = !item.isOpen
        }else {
          item.isOpen = false
        }
      })
    },

    //vote for like or unlike
    handleVote(ite, type){
      if(ite.is_helpful != '0')return
      ite.is_helpful = type
      //调接口
      this.$apis.voteFaq({
        faq_id: ite.id,
        type,
      }).then(res=> {
        if(res.status == 'success') {
          console.log('success');
        }else {
          ite.is_helpful = '0'
        }
      }).catch(()=> {
        ite.is_helpful = '0'
      })
    },

    //搜索输入
    handleChangeInput(e) {      
      const key = e.detail.value
      if(key == ''){
        this.searchData = []
        this.initData = [...initDataCopy]
        return
      }
      const filter_data = this.filterDataFunc(this.initData, key)
      this.searchData = filter_data
      if(this.searchData.length){
        this.showNoData = false
      }else{
        this.showNoData = true
      }
      
    },

    changeFocus() {      
      this.isInputFocus = !this.isInputFocus
    },

    // 选择搜索结果
    handleChoose(item) {
      const {id, type_name} = item
      this.initData.forEach((item, index)=> {
        if(item.type_name == type_name) {
          item.isOpen = true
        }else {
          item.isOpen = false
        }
        item.list.forEach((ite, ind)=> {
          if(ite.id == id) {
           ite.isOpen = true
          }else {
            ite.isOpen = false
          }
        })
      })
    },
    
    //点击搜索
    handleSearch() {
      const key = this.inputVal
      if(!key){
        this.initData = [...initDataCopy]        
        return
      }
      
      const filterData_ = []
      this.initData.map((item, index) => {
        const arr = []
        item.list.map((ite, ind) => {
          const k = key.toLowerCase()
          const title = ite.title.toLowerCase()
          const flag = title.indexOf(k)
          if(flag>-1) {
            arr.push(ite)
          }
        })
        let newObj
        if(arr.length) {          
          newObj = {
            ...item,
            list: arr
          }
          filterData_.push(newObj)
        }    
        
      })
      this.initData = [...filterData_]
    },

    //过滤数据
    filterDataFunc(data, key) {
      const filterData_ = []
      if(!key)return data
      data.map((item, index)=> {
        item.list.map((ite,ind)=>{
          const k = key.toLowerCase()
          const title = ite.title.toLowerCase()
          const flag = title.indexOf(k)
          if(flag>-1){
            filterData_.push(ite)
          }
        })
      })     
      return filterData_.slice(0,10)
    },

    //清空输入框
    clearSearch() {
      this.inputVal = ''
      this.searchData = []
      this.initData = [...initDataCopy]
    }
  },
  computed: {
   
  }
}
</script>

<style scoped>
.faq-container{
  height: 100vh;
}
.faq-banner{
  height: 275.58rpx;
  position: relative;
}
.search-box{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  z-index: 1;
  /* -webkit-transform: translate3d(-50%,0,1px); */
  /* transform: translate3d(-50%,0,1px); */
  transform: translate(-50%, -50%);
}
.faq-banner .banner-img{
  width: 100%;
  height: 275.58rpx;
}
.box-text{
  font-size: 28rpx;
  font-weight: 400;
  line-height: 28rpx;
  text-align: center;
}
.search{
  display: flex;
  display: -ms-flexbox;
  margin-top: 16rpx;
  width: 100%;
  height: 90rpx;
  position: relative;
}
.search-list{
  display:none;  
  height: 0;
  width: 100%;
  position: absolute;
  left: 0;
  background: #fff;
  border: 1px solid #222;
  border-top: 0;
  flex-wrap: wrap;
}
.searchShow{
  height: auto;
  display: flex;
  display: -webkit-flex;
}
.search-list .list-item{
  height: 45rpx;
  line-height: 45rpx;
  padding: 0 10rpx;
  color: #666;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 1px solid #e5e5e5;
  text-decoration: none;
  width: 100%;
}
input{
  width: 100%;
  padding: 10.8rpx;
  color: #222;
  -webkit-box-flex: 1;
  flex: 1;
  border: 1px solid #222;
  background: #fff;
  line-height: 1.15;
  height: 90rpx;
  font-size: 24rpx;
  box-sizing: border-box;
}
.uni-input-placeholder{
  /* font-size: 20rpx; */
  height: 30rpx;
}
.clear-val{
  position: absolute;
  right: 95rpx;
  top: 50%;
  transform: translate(-50%,-50%);  
}
.clear-val:before{
  content: '\E6AB';
}
.search-icon{
  font-size: 48rpx;
  background: #222;
  line-height: 90rpx;
  width: 90rpx;
  height: 90rpx;
  color: #fff;
  text-align: center;
  display: block; 
}
.search-icon:before{
  content: '\E687';
}
.open-icon{
  position: relative;
  
}
.nav-list-item .open-icon:before{
  position: absolute;
  content: '\E6A5';
  transform: translate(-100%,0) rotate(90deg);
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
}
.nav-list-item-active .open-icon:before{
  position: absolute;
  content: '\E6A5';
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
  transform: translate(-100%,0) rotate(-90deg);
}
.nav-list{
  display:  flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
}
.nav-list-item{
  width: 100%;
  margin-top: 26.25rpx;
}
.nav-list-item:last-child {
  /* 针对最后一个 .nav-list-item 元素的样式 */
  margin-bottom: 26.25rpx;
}
.nav-list-item-active>.item-title{
  background: #222;
  color: #fff;
}
.nav-list-item-active>.list-content-wrapper{
  display: block;
  height: auto;
  transition: all 0.25s;
}
.list-content-wrapper{
  overflow: hidden;
  height: 0;
  display: none;
  transition: all 0.25s cubic-bezier(0,0,0.2,1);
}
.item-title{
  border: 1px solid #e5e5e5;
  padding: 22.5rpx;
  display: block;
  position: relative;
  font-size: 22rpx;
  font-weight: 700;
  display:  flex;
  display: -webkit-flex;
  justify-content: space-between;
  transition: background-color 0.25s linear;
}
.nav-title{
  display: flex;
  align-items: center;
  font-size: 32rpx;
}
.item-title .icon_img{
  width: 48rpx;
  margin-right: 12rpx;
  height: 48rpx;
}
.list-outer{
  transition: height 0.25s cubic-bezier(0,0,0.2,1);
  overflow: hidden;
  /* height: 0; */
}
.list-ul{
  padding-left: 8rpx;
}
.nav-item{
  padding: 12.5rpx 0;
  margin-bottom: 1.5rpx;
  background: #fff;  
    
}
.nav-item-active>.item-answer{
  display: block;
  height: auto;
}
.article{
  padding-left: 10rpx;
  margin-left: 15rpx;
  border-left: 4px solid #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  display: block;
  color: #666;
  height: 50rpx;
  line-height: 50rpx;
  word-break: break-all;
  font-size: 24rpx;
}
.item-answer{
  word-break: break-all;
  padding-left: 10rpx;
  margin-left: 15rpx;
  overflow: hidden;
  margin-top: 10rpx;
  display: none; 
  color: #666;
  height: 0;
  -webkit-transition: height 0.25s cubic-bezier(0,0,0.2,1);
  transition: height 0.25s cubic-bezier(0,0,0.2,1);
}
.nav-item>.active {
  display: block;
  height: auto;
}
.helpful-tip{
  margin-top: 10rpx;
}
.iflike{
  height: 48rpx;
  width: 100%;
  display: flex;
  display: -webkit-flex;
}
.like, .unlike{
  display: inline-flex;
  width: 48rpx;
  height: 48rpx;
  align-items: center;
  justify-content: center;
}
.iflike i{
  font-size: 32rpx;
  color: #ccc;
}
.like-icon:before{
  content: '\E62E';
}
.unlike-icon:before{
  content: '\E67C';
}
.like>.hasVote{
  color: #000;

}
</style>