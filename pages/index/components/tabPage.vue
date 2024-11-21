<template>
	<view class="box">
		<!-- 遮罩层 -->
		<view class="menu_mask" v-show="open_popmenu" @tap="open_popmenu = false" @touchmove.stop.prevent="()=>{}"></view>
		<view class="tab_banner" v-if="tabBanner">
			<image :src="tabBanner" style="width: 100%; height: 100%; z-index: 2;"></image>
		</view>
		<!-- Recommend Filter -->
		<view :class="{ 'recommend_filter': true, 'pt27r':!tabBanner, 'pb1r': tabBanner }">
			<!-- Recommend -->
			<view @tap="open_popmenu = !open_popmenu" class="recommend_box">
				<view class="recommend">
					<text class="font-MS">{{ choosedMenu.label }}</text>
					<image :class="{ 'icon':true, 'icon_rotate': open_popmenu }" 
						v-if="choosedMenu.label"
						src="@/static/images/icon/filter@2x.png" mode="widthFix" :lazy-load="true" />
				</view>
				<view :class="{'pop_menu': true, 'pop_menu_open': open_popmenu, 'pb0': !open_popmenu }">
					<view class="menu_item" v-for="(item, index) in cards" :key="index" @tap="handleChangeMenu(item)">
						<view :class="{ 'menu_item_selected' : item.selected }">{{ item.label }}</view>
					</view>	
				</view>
			</view>
			<view class="line"></view>
			<!-- Filter -->
			<view class="filter_dialog" @tap="openFilter">
				<view class="font-MS">{{ $t('home.filter') }}</view>
				<image class="icon" src="@/static/images/icon/icon-filters@2x.png" mode="widthFix" :lazy-load="true" />
			</view>
		</view>
		<view class="goods_list">
			<view v-show="goods.length" class="items_found_text">
				{{ $t('search.searchCounts', {searchCount: product_count}) }}
			</view>
			<good-list ref="goodList"
				:item_list_type="'category'" 
				:item_list_id="homeTabId" 
				:item_list_name="language.category_list" 
				:loadingMoreHidden="loadingMoreHidden" 
				:isFirstQuery="isFirstQuery" 
				:goods="goods" 
				:showLoading="goodsHasNext && !isFirstQuery">
			</good-list>
		</view>
		<popup-right ref="popupRight" 
			@handleFilterQuery="handleFilterQuery" 
			:showFilter="showFilter" 
			:symbol="symbol" 
			:filter_info="Array.isArray(filter_info) ? {} : filter_info">
		</popup-right>
	</view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import popupRight from '@/components/popupRight/popupRight'
import getCoupon from "@/components/get-coupon/get-coupon.vue";
import backTop from '@/components/back-top/back-top.vue';
import {mapState} from 'vuex'
//index.js
//获取应用实例
var app = getApp(); // 语言

export default {
	components: {
		navigation,
		popupRight,
		getCoupon,
		backTop
	},
	props: {
		homeTab: {
			type: String
		},
		homeTabId: {
			type: String
		},
		tabBanner: {
			type: String
		}
	},
	watch: {
		homeTab: {
			handler(newVal) {
				this.isFirstQuery = true
				this.params.channel = this.formatParamsChannel(newVal)
				this.open_popmenu = false
			},
			immediate: true
		}
	},
	data() {
		return {
			open_popmenu: false,
			language: {
				category_list: '',
				empty_product: ''
			},
			// showTabbar: true,
			child_category_info: [],
			// showListChildCates: true,
			showFilter: false,
			loadingMoreHidden: false, 	//	good-list参数
			pageMetaShow:false, 		//	good-list参数
			isLastPage: false,			//	查询到最后一页不再调接口
			isFirstQuery: true,
			goodsHasNext: false,	// 只用来处理触底时加载图标的显示 
			cards: [],
			filter_info: {},
			goods: [],
			
			symbol: '$',
			filterAttrs: '',
			// price_max: 0,	
			// price_min: 0,
			page_count: 0,
			product_count: 0,
			isLoadProduct: true,
			
			page: 0,
			choosedMenu: {
				label: "",
				selected: false,
				value: ""
			},
			initSort: {
				label: "",
				selected: false,
				value: ""
			},
			params: {
				categoryId: "",
				p: "",
				price: "", 
				sort: "",
				v: "1.0"
			}
		};
	},
	methods: {
		formatParamsChannel(val) {
			return val.includes(" ") ? val.replace(/ /g, "_").toLowerCase() : val.toLowerCase() 
		},
		openFilter() {
			const that = this
			that.showFilter = true
			that.$refs['popupRight'].open()
			that.open_popmenu = false
		},
		refresh(id) {
			this.isFirstQuery = true
			this.goods = []
			this.page = 0
			this.params.categoryId = id
			this.params.p = this.page
			this.fetchCategory(id, true)
		},
		fetchCategory(id, switchTab = false) {
			if(this.isFirstQuery) {
				uni.showLoading()
			}
			this.filter_info = {}	// 初始化，修复真机点击不展开的问题
			const channelNow = this.formatParamsChannel(this.homeTab)
			const that = this;
			if(this.page == 0 || switchTab) {
				this.goods = []
				this.page = 0
			}
			if(switchTab) {
				this.isFirstQuery = true
				this.goodsHasNext = false
			}
			that.setData({
				page: that.page + 1
			});
			this.params.categoryId = id
			this.params.p = this.page
			this.params.sort = switchTab ? this.initSort.value : this.choosedMenu.value
			this.params.filterAttrs = switchTab ? '' : this.filterAttrs || ''
			that.$apis.queryCatelist(this.params).then(res=> {
				this.isFirstQuery = false
				if(res.code == '200') {
					uni.hideLoading && uni.hideLoading();
					that.setData({
						loadingMoreHidden: true
					});
					const {products, page_count, query_item, filter_info, symbol, product_count} = res.data || {}
					that.symbol = symbol
					that.product_count = product_count || 0
					that.page_count = page_count || 0
					// 判断列表是否已经加载完毕
					that.setData({
						goodsHasNext: !(page_count == that.page || page_count == 0),
						isLastPage: page_count == that.page || page_count == 0
					})
					// that.price_min = price_range.price_min
					// that.price_max = price_range.price_max
					// that.$refs['popupRight'].price2 = that.$refs['popupRight'].price2 ? that.$refs['popupRight'].price2 : that.price_max
					// that.$refs['popupRight'].price1 = that.$refs['popupRight'].price1 ? that.$refs['popupRight'].price1 : that.price_min
					
					// child_category_info.forEach(item=>{
					// 	item.checked = false
					// })
					// if(!that.child_category_info.length){
					// 	 that.child_category_info = child_category_info
					// }
					
					// 初始化排序
					const choosedItem = query_item.frontSort.find(item => {
						return item.selected
					})
					that.initSort = query_item.frontSort[0] || {label: "", selected: false, value: ""}
					// 过滤Filter
					if(!Object.keys(that.filter_info).length){
						for(let k in filter_info){
							filter_info[k]['opened'] = false						
						}
					}
					this.filter_info = filter_info;
					// 列表数据更新
					let goods = that.goods;
					if(this.params.channel === channelNow) {
						products.forEach(item => {
							goods.push(item)
						});
					}
					that.setData({
						goods,
						isLoadProduct: false,
						cards: query_item.frontSort,
						choosedMenu: choosedItem,			
						language: {
							category_list: res.data.name,
						}
					});
				}
				if (res.code != 200 || res.data.products.length == 0) {
					that.setData({
						loadingMoreHidden: false
					});
					return;
				}
				uni.stopPullDownRefresh();
			})
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
			this.fetchCategory(this.homeTabId, false)
		},
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
			this.fetchCategory(this.homeTabId, false)
		},
		loadProduct() {
			var that = this;
			if (that.isLoadProduct == false) {
				if(that.loadingMoreHidden && !that.isLastPage) {
					that.setData({isLoadProduct: true})
					that.fetchCategory(this.homeTabId, false);
				}
			}
		},
	}


};
</script>
<style lang="scss" scoped>
@import "@/common/mixins.scss";
.box {
	z-index: 2;
	background: #fff;
	height: 100vh;
	.menu_mask {
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.4);
		z-index: 1;
		position: fixed;
		left: 0;
		top: 0;
	}
	.tab_banner {
		height: 330.77rpx;
	}
	.recommend_filter {
		z-index: 2;
		width: 100%;
		height: auto;
		display: inline-flex;
		position: relative;
		background: #fff;
		border-bottom: 2rpx solid #F1F1F1;
		font-size: 23.08rpx;
		color: #222;
		// margin-top: 26.92rpx;
		.icon {
			width: 34.62rpx;
			margin-left: 7.69rpx;
		}
		.icon_rotate {
			transform: rotate(180deg);
		}
		.recommend_box {
			height: 94.23rpx;
			display: flex;
			position: relative;
			.recommend {
				width: 375rpx;
				display: flex;
				align-items: center;
				padding-left: 88.46rpx;
			}
			.pop_menu{
				z-index: 9;
				height: 0;
				width: 100vw;	
				padding: 0 88.46rpx 30.77rpx;
				background: #fff;
				border-radius: 0rpx 0rpx 23rpx 23rpx;
				position: absolute;
				top: calc(1px + 100%);
				transition: all 200ms;
				overflow: hidden;
				.menu_item {
					width: 100%;
					height: 90.38rpx;
					border-bottom: 2rpx solid #EEEEEE;
					display: flex;
					align-items: center;
					color: #666;
					&_selected {
						font-family: 'Montserrat-Bold';
						font-weight: bold;
						color: #222;
					}
				}
				.menu_item:last-child {
					border-bottom: 0;
				}
			}
			.pop_menu_open{
				height: unset;
				padding-bottom: 31rpx;
			}
		}
		.line {
			width: 2rpx;
			height: 46rpx;
			background: #F1F1F1;
			margin-top: 26.92rpx;
			position: absolute;
			right: 375rpx;
		}
		.filter_dialog {
			width: 375rpx;
			padding: 0 132.69rpx;
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: flex-end;
		}
	}
	
	.goods_list {
		 background-color: #fff; 
		 padding-bottom: 120rpx;
		 .items_found_text {
		 	font-family: "Montserrat-Regular";
		 	font-size: 19rpx;
		 	color: #999;
			margin: 15.38rpx 0 26.92rpx;
		 	text-align: center;
		 }
	}
}
</style>
