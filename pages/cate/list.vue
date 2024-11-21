<template>
	<view :class="'cate-list ' + (open_popmenu ? 'no_scroll ' : '') + (showTabbar ? 'showTabbar ' : '') + (child_category_info.length ? '' : 'pt_class')">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<!-- 点击头部菜单按钮左侧弹窗 -->
		<popupLeft v-if="showPopupLeft" ref='popupLeft'></popupLeft>
		<!-- 导航栏 -->
		<view class="new_header_wrapper">			
			<view class="cate_header_box flex align-items-center justify-content-between">
				<view @tap="handleBack" class="cate_back">
					<image
						class="img"
						src="@/static/images/header_back_icon@2x.png"
						mode="scaleToFill"
					/>
				</view>
				<view class="cate_name font-bold">{{ language.category_list }}</view>
				<view class="right_icons flex">
					<view @tap="handleToSearch" class="search_icon flex align-items-center">
						<image
							class="img"
							src="@/static/images/category_top_search@2x.png"
							mode="scaleToFill"
						/>
					</view>
					<view class="layout_icon flex align-items-center">
						<image
							@tap="changeListType"
							v-show="showSingleList"
							class="img"
							src="@/static/images/icon/viewGrid.png"
							mode="scaleToFill"
						/>
						<image
							@tap="changeListType"
							v-show="!showSingleList"
							class="img"
							src="@/static/images/icon/hangzhuangshitu.png"
							mode="scaleToFill"
						/>
					</view>
				</view>
				
			</view>
		</view>
		<view :class="'global-top-btn flex align-items-center justify-content-center '+ (!showBtn?'global-btn-none':'')" @click="backTop">
            <image class="img"
				mode="aspectFill"
                src="@/static/images/icon/back_top_icon@2x.png"
            />
        </view>
		<!-- <view class="list_cart">
			<navigator url="/pages/cart/cartPage" hover-class="navigator-hover">			
				<view class="cart">
					<uni-badge absolute="rightTop" type="error" size="small"  :max-num=999 :text=cartCount>
					<i class="iconfont"></i>
				</uni-badge>
				</view>					
			</navigator>	
		</view> -->
		<!-- 过滤筛选 -->
		<popup-right @handleFilterQuery="handleFilterQuery" :showFilter="showFilter" belong_module="category" ref="popupRight" :symbol="symbol" :filter_info="filter_info"></popup-right>
		
		
		<view @touchmove.stop.prevent="()=>{}" class="menu_mask" @tap="handleCloseMenu" v-show="open_popmenu"></view>
		<!-- 商品列表 -->
		<view :class="'container ' + iphone">
			<view @touchmove.stop.prevent="()=>{}" style="position: relative;z-index:10;background:#fff;" v-show="child_category_info.length">
				<view @tap="handleCloseMenu" :class="showListChildCates ? 'sticky_wrapper' : 'sticky_out_wrapper'">
					<scroll-view  :scroll-left="scrollLeft" :scroll-x="true" :class="'child_categorys '+(showListChildCates?'':'new_child_categorys')" v-show="child_category_info.length">
						<view class="flex ">
							<view class="child_categorys_wrapper flex" >
								<view @tap="handleSelectChildCategory(item)" v-for="(item,index) in child_category_info" :key="index" :class="'child_category_item flex '+ (item.checked ? 'checked': '')">
									<image :src="item.img" mode="widthFix" :lazy-load="true" class="child_category_img"/>
									<view class="child_category_name">
										<view class="text">{{ item.name }}</view>	
									</view>
								</view>	
								
							</view>
						</view>
					</scroll-view>	
				</view>
			</view>					
			
			<view @touchmove.stop.prevent="()=>{}" v-if="showTabbar&&child_category_info.length" :class="'my-filter-box flex ' + (showListChildCates ? ' ' : 'fixed_box ')+ (!showListChildCates ? 'fixed_box2 ' : '') " >
				<view @tap="openPop" class="filter-menu flex align-items-center justify-content-center">
					<view class="choosed font-bold">
						{{ choosedMenu.label }}
					</view>
					<view class="open-pop">
						<image src="@/static/images/icon/filter@2x.png" mode="widthFix" :lazy-load="true" class="down_arrow_img"/>

					</view>
					<view :class="'pop_menu ' + (open_popmenu ? 'open' : '')" >
						<view @tap="handleChangeMenu(item)" v-for="(item, index) in cards" :key="index" :class="'menu_item flex justify-content-between align-items-center ' + (item.selected ? 'selected' : '')">
							<view class="text">{{ item.label }}</view>
							<view v-show="item.selected" class="img_box">
								<image class="img"
									mode="aspectFill"
									src="@/static/images/icon/checked_icon@2x.png"
								/>	
							</view>
						</view>	
					</view>
				</view>
				<view class="filter-dialog  flex align-items-center justify-content-center" @tap="openFilter">
					<view class="font-bold">{{ $t('search.filter') }}</view>
					<image  src="@/static/images/icon/down_arrow@2x.png" mode="widthFix" :lazy-load="true" class="filter_img"/>
				</view>
			</view>
			<view @touchmove.stop.prevent="()=>{}" v-if="showTabbar&&!child_category_info.length" :class="'my-filter-box flex fixed_box3' " >
				<view @tap="openPop" class="filter-menu flex align-items-center justify-content-center">
					<view class="choosed font-bold">
						{{ choosedMenu.label }}
					</view>
					<view class="open-pop">
						<image src="@/static/images/icon/filter@2x.png" mode="widthFix" :lazy-load="true" class="down_arrow_img"/>

					</view>
					<view :class="'pop_menu ' + (open_popmenu ? 'open' : '')" >
						<view @tap="handleChangeMenu(item)" v-for="(item, index) in cards" :key="index" :class="'menu_item flex justify-content-between align-items-center ' + (item.selected ? 'selected' : '')">
							<view class="text">{{ item.label }}</view>
							<view v-show="item.selected" class="img_box">
								<image class="img"
									mode="aspectFill"
									src="@/static/images/icon/checked_icon@2x.png"
								/>	
							</view>
						</view>	
					</view>
				</view>
				<view class="filter-dialog  flex align-items-center justify-content-center" @tap="openFilter">
					<view class="font-bold">{{ $t('search.filter') }}</view>
					<image  src="@/static/images/icon/down_arrow@2x.png" mode="widthFix" :lazy-load="true" class="filter_img"/>
				</view>
			</view>
			<view class="lists_wrapper">
				<view v-show="goods.length" class="flex align-items-center justify-content-center searchCount">{{ $t('search.searchCount', {searchCount: product_count}) }}</view>
				<good-list :module_name="module_name" :item_list_type="'category'" :item_list_id="categoryId" :item_list_name="language.category_list" @popupChange="(value)=>{pageMetaShow=value}" :showSingleList="showSingleList" ref="goodList" :loadingMoreHidden="loadingMoreHidden" :showNoMore="false" :isFirstQuery="isFirstQuery" :language="language" :goods="goods" :ishowSpecialPriceOff="true" :showLoading="loadingMoreHidden&&goods.length>0"></good-list>
			</view>
			<!-- 推荐 -->
			<view v-if="recommendList.length" class="goods-container">
				<view class="u-text-header">
					{{$t('recommend.header1')}}
				</view>
				<good-list module_name="category_rfy" ref='good_list_ref_re' @popupChange="(value)=>{pageMetaShow=value}" :showSingleList="showSingleList" :goods="recommendList"></good-list>
			</view>
			
		</view>
		<view :class="'cus_bar_box ' + (showTabbar? 'show' : 'hide')"><custom-tabbar realPageName="cateList"></custom-tabbar></view>
		<getCoupon moduleName="category" ref="getCouponRef"></getCoupon>
	</view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import popupRight from '@/components/popupRight/popupRight'
import getCoupon from "@/components/get-coupon/get-coupon.vue";
import {mapState} from 'vuex'
//index.js
//获取应用实例
var app = getApp(); // 语言

export default {
	components: {
		navigation,
		popupRight,
		getCoupon
	},

	data() {
		return {
			id: '',
			queryType: '',
			pageMetaShow:false,
			//语言 - begin
			language: {
				category_list: '',
				empty_product: ''
			},
			scrollLeft: 0,
			categoryId: '',
			originCategoryId: '',
			page: 0,
			goods: [],
			showTabbar: true,
			//语言 - end
			isLoadProduct: false,
			showBtn: false,
			iphone: '',
			loadingMoreHidden: false,
			toView: '',
			scrollH: 0,
			cards: [],
			choosedMenu: {
				label: '',
			},
			pageStyle: "overflow: auto",
			showFilter: false,
			refName: 'popupCateList',
			isLastPage: false,//查询到最后一页不再调接口
			priceRange: '',//价格范围
			isFirstQuery: true,
			showPopupLeft: false,
			child_category_info: [],
			scrollTop: 0,
			showListChildCates: true,
			recommendList: [], // 推荐列表
			showSingleList: false,
			filter_info: {},
			symbol: '$',
			filterAttrs: '',
			open_popmenu: false,			
			price_max: 0,	
			price_min: 0,
			product_count: 0,
			module_name: 'category_hp',
			lastScrollTop: 0,
			scrollThreshold: 10,
			nearBottom: false,
			nearTop: false
		};
	},
	watch: {
		showListChildCates(oldVal, nowVal){
			// const width = nowVal ? '256.57' :'188.47'
			const width = nowVal ? '157.77' :'225.8'
			this.child_category_info.forEach((item, index)=>{
				if(item.checked){
					this.scrollLeft = index * width
				}
			})
		}
	},
	onLoad: function (e) {
		uni.showLoading();
		var that = this;
		uni.$off(that.refName).$on(that.refName, () => {
			that.showPopupLeft = true
			that.$refs['popupLeft'] && that.$refs['popupLeft'].$refs['popup'].open()
		})
		that.setData({
			isFirstQuery: true,
			categoryId: e.id,
			originCategoryId: e.id,
			language: {
				category_list: e.type,
			}
		}); 
		that.id = e.id;
		that.queryType = e.type;
		if(e.module){
			this.module_name = e.module;
		}
		that.fetchCategory();
		// 监听加购动画 显示底部tabbar
		uni.$off('showBottomTabbar').$on('showBottomTabbar', that.changeTabbar);
	},
	onReachBottom() {
		this.showTabbar = false
		
		//判断是否到 最后一页了
		if (!this.isLastPage) {
			this.loadProduct()
		}
	},
	onShow() {
		getApp().globalData.getShopCartNum();
		setTimeout(()=> {
			this.$refs.getCouponRef.getNewcomerCouponList();
		})
		this.$maEvent.visit_event({
			event_category: 'goods_list',
			event_action: 'goods_list_visit',
			event_name: 'goods_list_visit'
		})
	},
	computed: {
		...mapState(['cartCount'])
	},
	methods: {
		changeTabbar(){
			this.showTabbar = true
		},
		handleSelectChildCategory(item){
			if(item.checked){
				this.categoryId = this.originCategoryId
				item.checked = false
			}else{
				this.categoryId = item.category_id
				
				this.child_category_info.forEach(ite=>{
					ite.checked = false
				})
				item.checked = true
			}
			this.isFirstQuery = true
			this.setData({
				loadingMoreHidden: true,
				isLastPage: false,
				page: 0,
				goods: [],
			})
			uni.showLoading();
			this.fetchCategory()
		},
		backTop() {
            uni.pageScrollTo({
				scrollTop: 0,
				duration: 100
			}) 
			this.$maEvent.custom_event({
				event_category: 'to_top',
				event_action: 'to_top_button',
				event_name: 'to_top_button',
				module: 'to_top',
				event_data: {}
			});        
        },	
		scrollFunc(toTop){
			if(toTop){
				this.showTabbar = true
			}else{
				this.showTabbar = false
			}
		},
		onPageScroll(t){
			this.$refs['goodList']&&this.$refs['goodList'].pageScrollFunc(t.scrollTop)			
			this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].pageScrollFunc(t.scrollTop)			
			let toTop = false
			// if(t.scrollTop - this.scrollTop > 0 && t.scrollTop > 50){
			// 	toTop = false
			// 	this.scrollFunc(toTop)
			// }
			// if(t.scrollTop - this.scrollTop <= 0 && t.scrollTop > 50){
			// 	toTop = true
			// 	// this.$debounce(this.scrollFunc, 300, [toTop])
			// 	this.scrollFunc(toTop)
			// }	
			// 获取页面高度和滚动位置
			const scrollTop = t.scrollTop;
			const windowHeight = uni.getSystemInfoSync().windowHeight;
			const query = uni.createSelectorQuery().in(this);

			if (scrollTop < 100) { // 100是距离顶部的范围
				this.nearTop = true;
			} else {
				this.nearTop = false;
			}
			
			query.select('.cate-list').boundingClientRect((data) => {
			if (data) {
				const listHeight = data.height;				
				// 判断是否接近底部
				if (listHeight - scrollTop - windowHeight < 100) { // 100是距离底部的范围
					this.nearBottom = true;
				} else {
					this.nearBottom = false;
				}
				
				
			}
			}).exec();
			
			const currentScrollTop = t.scrollTop;
			const scrollDistance = currentScrollTop - this.lastScrollTop;			
			if (Math.abs(scrollDistance) > this.scrollThreshold) {
				if (scrollDistance > 0) {
					if(!this.nearTop) {
						// 向下滚动，隐藏 TabBar
						this.showTabbar = false;
					}					
				} else {
					// 考虑在页面滚动到接近底部区间某一范围内，直接隐藏tabbar，不走下面的方向判断逻辑
					if(!this.nearBottom) {
						// 向上滚动，显示 TabBar
						this.showTabbar = true;
					}					
				}
				this.lastScrollTop = currentScrollTop;
			} 

			this.scrollTop = t.scrollTop
			if (t.scrollTop >= 180) {
            	this.showBtn = true
			}else {
				this.showBtn = false
			}
			if(t.scrollTop > 50){
				this.showListChildCates = false
				
			}else{
				this.showListChildCates = true
			}
			this.$debounce(() => {
				this.$refs['goodList']&&this.$refs['goodList'].startObserver();
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
		},
		fetchCategory: function () {
			if(this.page ==0) {
				this.recommendList = []
			}
			const that = this;
			that.setData({
				page: that.page + 1
			});
			const params = {
				categoryId: that.categoryId,
				p: that.page,
				price: that.priceRange,
				sort: that.choosedMenu.value,				
				v: '1.0'
			}
			if(this.filterAttrs){
				params.filterAttrs = this.filterAttrs
			}
			that.$apis.queryCatelist(params).then(res=> {
				this.isFirstQuery = false
				if(res.code == '200') {
					uni.hideLoading&&uni.hideLoading();
					that.setData({
						loadingMoreHidden: true
					});
					let goods = that.goods;
					const {products, page_count, query_item, child_category_info, filter_info, symbol, price_range, product_count} = res.data
					that.symbol = symbol
					that.product_count = product_count || 0
					that.price_min = price_range.price_min
					that.price_max = price_range.price_max
					that.$refs['popupRight'].price2 = that.$refs['popupRight'].price2 ? that.$refs['popupRight'].price2 : that.price_max
					that.$refs['popupRight'].price1 = that.$refs['popupRight'].price1 ? that.$refs['popupRight'].price1 : that.price_min
					if(!Object.keys(that.filter_info).length){
						for(let k in filter_info){
							filter_info[k]['opened'] = false						
						}
						that.filter_info = filter_info
					}
					
					products.forEach(item => {
						goods.push(item)
					});
					child_category_info.forEach(item=>{
						item.checked = false
					})
					const choosedItem = query_item.frontSort.find(item => {
						return item.selected
					})
					that.setData({
						goods,
						isLoadProduct: false,
						cards: query_item.frontSort,
						choosedMenu: choosedItem,			
						language: {
							category_list: res.data.name,
						}
					});
					if(!that.child_category_info.length){
						that.child_category_info = child_category_info
					}
					if (page_count == that.page || page_count==0) { //已经是最后一页了
						
						that.setData({
							isLastPage: true
						})
						that.$apis.recommendProduct({category_id:that.categoryId,type: 'cate_rec',size: 30}).then(res => {
							that.recommendList = res.data.products || [];
							that.loadingMoreHidden = false
						}).catch(e=>{
							that.loadingMoreHidden = false
						})
					}
					this.trackEvent({
						id: that.categoryId,
						name: res.data.name,
						products: products
					});
					var maFilter = {}
					if(params.filterAttrs) {
						maFilter = {...JSON.parse(params.filterAttrs)}
					}
					
					if(params.sort || (choosedItem&&choosedItem.label)) {
						maFilter['sort'] = params.sort || choosedItem.label;
					}
					if(params.price) {
						console.log(params);
						let priceArr = params.price.split('-');
						let pArr = priceArr.map(item => item || '0');
						console.log(pArr);
						maFilter['price'] = pArr.join('-');
					}
					if(params.p == 1) {
						this.$maEvent.custom_event({
							event_category: 'category',
							event_action: 'category_pageview_button',
							event_name:params.categoryId,
							module: 'category_pageview',
							event_data: {
								event_value:params.categoryId,
								result_type:products.length?1:2, // 1（有结果） / 2 （无结果）
								filter:maFilter
							}
						})
					}
				}
				if (res.code != 200 || res.data.products.length == 0) {
						that.setData({
							loadingMoreHidden: false
						});
						return;
					}
			})
		},
		trackEvent(data){
			this.$maEvent.cateListView(data);
			if(data.products && data.products.length){
				setTimeout(() => {
					this.$trackEvent.view_list_item({
						id: data.id,
						name: data.name,
						products: data.products
					});
				}, 1000);
			}
		},
		loadProduct() {
			//this.fetchCategory()
			var that = this;
			if (that.isLoadProduct == false) {//正在加载中
				that.setData({
					isLoadProduct: true
				});
				that.fetchCategory();
			}
		},
		changeListType(type){
			this.showSingleList = !this.showSingleList
		},
		openPop() {
			const that = this
			that.open_popmenu = !that.open_popmenu
		},
		handleCloseMenu(){
			this.open_popmenu = false
		},
		openFilter() {
			const that = this
			that.showFilter = true
			that.$refs['popupRight'].open()
			that.open_popmenu = false
			that.$maEvent.custom_event({
				event_category: 'category',
				event_action: 'category_filter_button',
				module: 'category_filter'
			})
		},
		handleCloseFilter() {
			this.showFilter = false
		},
		handleBack() {
			this.$public.handleGoBack();
		},
		handleToSearch() {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		handleChangeMenu(val) {
			this.choosedMenu = val
			this.isFirstQuery = true
			this.setData({
				loadingMoreHidden: true,
				isLastPage: false,
				page: 0,
				goods: [],
			})
			uni.showLoading();
			this.fetchCategory()
		},
		refresherpulling() {
			// debugger
		},		
		// handleFilterPrice(val = '') {
		// 	this.setData({
		// 		priceRange: val,
		// 		goods: [],
		// 		page: 0,
		// 		isLastPage: false,
		// 		loadingMoreHidden: false,
		// 		showFilter: false,
		// 		isFirstQuery: true,
		// 	})
		// 	uni.showLoading();
		// 	this.fetchCategory()
		// },
		handleFilterQuery(data) {
			const {filterAttrs, priceRange} = data
			this.setData({
				filterAttrs,
				priceRange,
				goods: [],
				page: 0,
				isLastPage: false,
				loadingMoreHidden: false,
				showFilter: false,
				isFirstQuery: true,
			})
			uni.showLoading();
			this.fetchCategory()
		},
	}


};
</script>
<style lang="scss" scoped>
@import "@/common/mixins.scss";
.cus_bar_box.hide /deep/.custom_tabbar_container {
	transform:  translateY(100%);
	transition: all linear 200ms;
}
.cus_bar_box.show /deep/.custom_tabbar_container {
	transform:  translateY(0);
	transition: all linear 200ms;
}
.searchCount{
	margin-top: 15rpx;
	margin-bottom: 15rpx;
	font-size: 19.23rpx;
	color: #999;
}
.menu_mask{
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.4);
	z-index: 8;
	position: fixed;
	top: 0;
	left: 0;
}
.cate_header_box{
	width: 100%;
	height: 100%;
	padding: 21.15rpx 30.77rpx 25rpx 30.77rpx;
	.cate_back{
		margin-right: 92.30rpx;
		.img{
			width: 46.15rpx;
			height: 46.15rpx;
		}
	}
	.cate_name{
		font-size: 34.62rpx;
		color: #000;
		height: 46.15rpx;
		flex: 1;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

	}
	.search_icon{
		.img{
			width: 46.15rpx;
			height: 46.15rpx;
		}
	}
	.layout_icon{
		margin-left: 46.15rpx;
		.img{
			width: 46.15rpx;
			height: 46.15rpx;
		}
	}
	.right_icons{
		// margin-left: 46.15rpx;
	}
}
.list_cart{
	position: fixed;
	right: 30.77rpx;
	bottom: 340rpx;
	z-index: 8;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #fff;
	box-shadow: 0 0 2px rgba(0,0,0,.12);
	font-size: 40rpx;
	.cart {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			/deep/.uni-badge{
				top: -5px!important;
			}
			i::before {
				content: "\E698";
			}

		}
}
.cate-list {	
	-webkit-overflow-scrolling: auto;
	overscroll-behavior: none;
	overflow: hidden;
	&.showTabbar{
		padding-bottom: 115.38rpx;		
	}
	&.pt_class{
		.lists_wrapper {
			padding-top: 96rpx;
		}
	}
	&.no_scroll{
		overflow-y: hidden;
		// height: calc(100vh - var(--window-top));
	}
}
.child_categorys{
	// position: sticky;
	// top: 0;
	// left: 0;
	// max-height: 200rpx;
	z-index: 10;
	background: #fff;
}
.new_child_categorys{
	max-height: 200rpx;
	z-index: 10;
	background: #fff;
	position: fixed;
	top: 0;
	transform: translateZ(13px);
	transition: top 0.3s ease 0s;
}
.fake_child_categorys{
	
}
.new_header_wrapper{
	// position: -webkit-sticky;
	position: fixed;
	width: 100%;
	height: 88rpx;
	top: 0;
	left: 0;
	z-index: 9;
	background: #fff;
}
.goods-container {
	width: 100%;
	margin-bottom: 0px;
	height: 100%;
	position: relative;
}





.my-filter-box {
	margin-top: -1px;
	width: 100%;
	height: 96rpx;	
	@include onepxBorder(#F1F1F1);
	@include onepxBorderTop(#F1F1F1);
	
	z-index: 8;
	background: #fff;
	// margin-bottom: 22rpx;
	&.fixed_box{
		position: fixed;
		top: calc(88rpx + 200rpx);
		z-index: 8;
	}
	&.fixed_box2{
		position: fixed;
		z-index: 8;
		top: calc(0rpx + 136.54rpx);
		// top: calc(0rpx + 144.23rpx);
	}
	&.fixed_box3{
		position: fixed;
		top: calc(0rpx + 88rpx);
	}
}

.filter-menu {
	height: 100%;
	width: 50%;
	font-size: 26.92rpx;
	position: relative;
	text-transform: capitalize;
	.pop_menu{
		position: absolute;
		width: 100vw;		
		background: #fff;
		left: 0;
		top: calc(0px + 100%);
		z-index: 9;
		height: 0;
		transition: all 200ms;
		overflow: hidden;
		border-radius: 0rpx 0rpx 15rpx 15rpx;
		padding: 0 30.77rpx 0 94.23rpx;
		.menu_item{
			width: 100%;
			height: 92.31rpx;
			padding: 0 65.38rpx 0 0;
			color: #666;
			@include onepxBorder(#eee);
			&.selected{
				color: #000;
				font-weight: bold;
			}
			.text{
				font-size: 26.92rpx;				
				line-height: 32rpx;
			}
			.img_box{
				width: 30.77rpx;
				height: 30.77rpx;
				.img{
					width: 30.77rpx;
					height: 30.77rpx;
				}
			}
		}
	}
	.pop_menu.open{
		height: unset;
	}

	.choosed {
		color: #000000;
		font-size: 26.92rpx;
		line-height: 32rpx;
		height: 38rpx;
	}

	.open-pop .down_arrow_img{
		width: 34.62rpx;
		height: 34.62rpx;
		margin-left: 7.69rpx;
	}

}

.filter-dialog {
	text-align: center;
	width: 50%;
	font-size: 26.92rpx;
	line-height: 32rpx;
	color: #000000;
	.filter_img{
		width: 34.62rpx;
		height: 34.62rpx;
		margin-left: 7.69rpx;
	}
}


page {
	height: 100%;
}

.no-more-goods {
	text-align: center;
	margin-top: 20%;
	margin-bottom: 20%;
}



.no-order-img {
	width: 220rpx;
	height: 220rpx;
}

.no-more-goods .text {
	font-size: 28rpx;
	color: #999;
	margin-top: -5px;
}
.container{
	height: calc(100% - 48px);
	padding-top: 88rpx;
}
.goods-list-title {
	font-size: 30rpx;
	color: #333;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.goods-originalPrice {
	padding-left: 20rpx;
	font-size: 30rpx;
	color: #999;
	text-decoration: line-through;
	line-height: 52rpx;
	display: inline-block;
}

.goods-price {
	color: #b5272d;
	font-size: 30rpx;
	padding-top: 10rpx;
	display: inline;
}

.goods-list-money {
	font-size: 30rpx;
	color: #ab2b2b;
}
.bottom-nomore {
	height: 80rpx;
	font-size: 30rpx;
	color: #ccc;
}
.child_category_item{
	width: 134.62rpx;
	height: 182.69rpx;
	padding: 7.69rpx 21.5rpx 0 21.5rpx;
	background: #f5f5f5;
	margin-right: 23.08rpx;
	margin-bottom: 7.69rpx;
	border: 1px solid transparent;
}
.child_category_item.checked{
	position: relative;
	border: 1px solid #222;
	i{
		color: #222;
		font-size: 14px;
		position: absolute;
		right: 0;
		top: 0;
		&:after{
		content: '\e619';
	}
	}
}
.child_categorys_wrapper{
	padding: 5.77rpx 0 30.77rpx 30.77rpx;
	flex-wrap: nowrap;
	width: 100%;
	
}
.sticky_wrapper{
	// height: 200rpx;
	background: #fff;
	position: -webkit-sticky;
	position: sticky;
	left: 0;
	z-index: 10;
	top: -1000px;
}
.sticky_out_wrapper{
	height: 200rpx;
	background: #fff;
}
.child_category_img{
	width: 92.31rpx;
	height: 123.08rpx;
}
.child_category_name{
	overflow: hidden;
	width:100%;
	font-size: 23.08rpx;
	
	
	color: #666666;
	// line-height: 23rpx;
	line-height: 1;
	.text{
		//#ifdef APP-IOS
		height: 42rpx;
		line-height: 24rpx;
		//#endif
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		text-align: center;
		word-break: break-word;
		transform: scale(.9);
	}

}
.oldChildCates{
	transform: translateZ(13px);
    top: 0px;
    transition: top 0.3s ease 0s;
	position: fixed;

}
.new_child_categorys .child_category_item{
	min-width: 200rpx;
	width: 202rpx;
	height: 100rpx;
	flex-wrap: nowrap;
	padding: 7.69rpx 15.38rpx;
	margin-right: 23.08rpx;
	align-items: center;
	.child_category_img{
		margin-right: 7.69rpx;
		width: 56rpx;
		height: 69rpx;
	}
	.child_category_name{
		min-width: 80rpx;
		font-size: 23.08rpx;
		color: #333;
		line-height: 30rpx;
		// height: 50rpx;
	}
}
</style>
