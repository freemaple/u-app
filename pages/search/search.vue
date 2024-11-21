<template>
	<view>
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<popup-right @handleFilterQuery="handleFilterQuery" belong_module="search" :showFilter="showFilter" ref="popupRight" :symbol="symbol" :filter_info="filter_info"></popup-right>

		<!-- <filter-modal @filterPrice="handleFilterPrice" @closeFilter="handleCloseFilter" :showFilter="showFilter">
		</filter-modal> -->
		<popupLeft ref='popupLeft'></popupLeft>
		<view v-if="showNav&&!showCountDown" class="my-search-nav">
			<view class="search-box flex">
				<view @tap="handleBack" class="search-back">
					<image
						class="img"
						src="@/static/images/header_back_icon@2x.png"
						mode="scaleToFill"
					/>
				</view>
				<view class="nav-cates" @tap="handleSwitchToCate">
					<i class="iconfont"></i>
				</view>
				<view class="nav-search">
					<view class="nav-glass">
						<i class="iconfont"></i>
					</view>
					<view @tap="handleShowSearchEntry();handleSearchClickMa()" :class="'nav-content ' + (!searchContent?'nosearchContent':'')">
						{{ searchContent ? searchContent : $t('search.shoppingfor', {site_name: $store.state.site_name_upper})}}
					</view>
					<view v-if="searchContent" @tap="handleShowSearchEntry(1);handleSearchClickMa()" class="nav-cancle">
						<i class="iconfont"></i>
					</view>
				</view>
				<view class="header_right_icons flex">
					<view @tap="handleChangeListType" class="changeListLayout flex align-items-center">
					<image
					v-show="showSingleList"
						class="view_img"
						src="@/static/images/icon/viewGrid.png"
						mode="heightFix"
					/>
					<image
						v-show="!showSingleList"
							class="view_img"
							src="@/static/images/icon/hangzhuangshitu.png"
							mode="heightFix"
						/>
					</view>
					<view class="nav-bag" @tap="goToCart">
						<uni-badge absolute="rightTop" type="error" size="small"  :max-num=999 :text=cartCount>
							<i class="iconfont"></i>
						</uni-badge>
					</view>
				</view>
			</view>
		</view>
		<back-top ref="backtop" :showBtn="showBtn"></back-top>

		<view v-show="!showNav&&!showCountDown" class="search-header" style="height: 92rpx;display: flex;align-items: center;">
			<view class="search-wrap flex align-items-center">
				<view @tap="handleBack" class="search-back">
					<image
						class="img"
						src="@/static/images/header_back_icon@2x.png"
						mode="scaleToFill"
					/>
				</view>
				<view class="search-input">
					<input v-model="searchContent" @focus="handleSearchClickMa()" @confirm="newSearchFunc(searchContent)" class="uni-input"
						:placeholder="$t('search.shoppingfor', {site_name: $store.state.site_name_upper})" />
					<image
						class="img"
						v-show="!searchContent"
						src="@/static/images/category_top_search@2x.png"
						mode="scaleToFill"
					/>
					<i v-show="searchContent" @tap="handleCancle" class="iconfont"></i>
				</view>
			</view>
		</view>
		<!-- 活动页头部 -->
		<view v-show="showCountDown" class="my-search-nav">
			<view class="search-box campaign_header flex justify-content-between align-items-center">
				<view @tap="handleBack" class="search-back flex align-items-center" style="height:100%">
					<image
						class="img"
						src="@/static/images/header_back_icon@2x.png"
						mode="scaleToFill"
					/>
				</view>
				<view class="page_title font-bold">{{ saleTitle }}</view>
				<view class="right_box flex align-items-center">
					<view class="search_icon flex align-items-center" @tap="handleShowSearchEntry">
						<image
							class="img"
							src="@/static/images/checkout_icon/search_icon@2x.png"
							mode="scaleToFill"
						/>	
					</view>
					<view class="nav-bag nav-bag-lower" @tap="goToCart">
						<uni-badge absolute="rightTop" type="error" size="small"  :max-num=999 :text=cartCount>
							<i class="iconfont"></i>
						</uni-badge>
					</view>
					<view @tap="handleChangeListType" class="changeListLayout flex align-items-center">
						<image
						v-show="showSingleList"
							class="view_img"
							src="@/static/images/icon/viewGrid.png"
							mode="heightFix"
						/>
						<image
							v-show="!showSingleList"
								class="view_img"
								src="@/static/images/icon/hangzhuangshitu.png"
								mode="heightFix"
							/>
					</view>
				</view>
			</view>
		</view>

		<view class="container">
			<view class="search_page" v-if="searchHidden">
				<scroll-view scroll-y="true">
					<view class="keywrods_wrapper recently_search_ma" v-show="recentSearch.length&&searchHidden">
					<view class="search-title recently_search font-bold">
						<view>{{ $t('search.recently_searched') }}</view>				
						<view class="recently_btns flex justify-content-between">
							<view v-show="!showOpenDelete" class="clearall" @tap="handleClearall">{{ $t('search.clear_all') }}</view>
							<view class="iconfont gap" v-show="!showOpenDelete">|</view>
							<view class="done" v-show="!showOpenDelete" @tap="handleOpenDelete">{{ $t('search.done') }}</view>
							<!-- <i class="iconfont delete" v-show="showOpenDelete" @tap="handleOpenDelete"></i> -->
							<image
								src="@/static/images/delete_records_icon@2x.png"
								class="img_delete"
								mode="scaleToFill"
								v-show="showOpenDelete" 
								@tap="handleOpenDelete"
							/>
						</view>
					</view>
					<view :class="'search-keys ' + (recentMore ? 'more' : '')" v-show="recentSearch.length&&searchHidden">						
						<text-show-more @showItmsChange="(items)=>{recentlyMaValueArr = items;recentlyItemVisibility()}" @tapKey="(key)=>{handleTapKey({key,maModuleName:'search_recent',maEventName:'search_recent_click'})}" clsName="RECENT_CLS" :allItems="recentSearch" :isRecently="true" :showOpenDelete="showOpenDelete"></text-show-more>
					</view>
				</view>
				<view class="keywrods_wrapper hot_search_ma" v-show="hotWords.length&&searchHidden">
					<view class="search-title recently_search font-bold">
						<view>{{ $t('search.hot') }}</view>
					</view>
					<view class="search-keys" v-show="hotWords.length&&searchHidden">
						<text-show-more @showItmsChange="(items)=>{hotMaValueArr = items;hotItemVisibility()}" @tapKey="(key)=>{handleTapKey({key,maModuleName:'search_popular',maEventName:'search_popular_click'})}" clsName="HOTITEM_CLS" :allItems="hotWords" :isHotItems="true"></text-show-more>
					</view>
				</view>
				<view class="keywrods_wrapper trend_search_ma" v-show="trend_search_words.length&&searchHidden">
					<view class="search-title recently_search font-bold">
						<view>{{ $t('search.trending') }}</view>
					</view>
					<view class="search-keys" v-show="trend_search_words.length&&searchHidden">
						<text-show-more @showItmsChange="(items)=>{trendMaValueArr = items;trendItemVisibility()}" @tapKey="(key)=>{handleTapKey({key,maModuleName:'search_trending',maEventName:'search_trending_click'})}" clsName="TRENDING_CLS" :allItems="trend_search_words" :isTrending="true"></text-show-more>
					</view>
				</view>
				</scroll-view>
				
			</view>
			
			<!-- <view class="search-title" v-show="recentSearch.length && searchHidden">
				{{ $t('search.hot') }}
			</view> -->
			<view class="tips_wrapper" v-if="!searchHidden && (origin_searchtext&&origin_searchtext.toLocaleUpperCase() != searchText.toLocaleUpperCase()) && (!specialCateParams.cate_id && !saleParams.is_all)">
				<view class="ori">{{$t("search.ori_tip",{'ori': origin_searchtext})}}</view>
				<view class="now font-bold">{{ $t('search.now_tip',{'now': searchText}) }}</view>
			</view>
			
			<view class="searchCorrection-box" v-if="searchCorrectionText && searchCorrectionText.toLocaleUpperCase() != searchText.toLocaleUpperCase()">
				<view class="search-text">{{$t('search.no_results_found',{'searchtext':searchText})}}</view>
				<view class="correction-text">{{$t('search.showing_result_for', {'searchCorrectionText': searchCorrectionText})}}</view>
			</view>
			<view v-if="!searchHidden && (!specialCateParams.cate_id && !saleParams.is_all)&&tophits.length" class="tophits_wrapper flex space-between">
				<view v-for="(value,key) of tophits" :key="key">
					<view :class="'search_tag ' + (checkedTag==v ? 'checked' : '')" v-for="(v,k) in value" :key="k" @tap="handleClickTag(k,v)">{{ v }}</view>
				</view>
			</view>
			<campaign-countdown @changeSaleTitle="(val)=>{saleTitle=val}" v-if="showCountDown" @handleChangecountDownType="handleChangecountDownType" :countDownType="countDownType"></campaign-countdown>

			<!-- 优惠券xy不展示筛选 -->
			<view v-show="!searchHidden && couponParams" class="flex align-items-center" style="height: 96rpx;padding: 0 41rpx;color: #333;">{{ $t('search.searchCount',{searchCount: searchCount}) }}</view>
			<view v-show="!searchHidden && !couponParams" class="my-filter-box flex justify-content-between align-items-center">
				<view v-if="searchCount == 0" style="font-size:26.92rpx;color:#000">{{ $t('search.searchCount',{searchCount: searchCount}) }}</view>
				<view v-else-if="searchCount == 1" style="font-size:26.92rpx;color:#000">{{ $t('search.searchCount',{searchCount: searchCount}) }}</view>
				<view v-else style="font-size:26.92rpx;color:#000">{{ $t('search.searchCounts',{searchCount: searchCount}) }}</view>
				<view class="filter-dialog" @tap="openFilter">
					<i class="iconfont"></i>
				</view>
			</view>
			<!-- <view class="search-keys" v-show="recentSearch.length && searchHidden">
				<view v-for="item in recentSearch" @tap="handleTapKey(item)" class="search-item" :key="item">
					{{ item }}
				</view>
			</view>			 -->

			<good-list :module_name="module_name" ref="good_list_ref" :item_list_type="'search'" :showCountDown="showCountDown" :item_list_id="'search'"  :item_list_name="searchValue" :isFirstQuery="isFirstQuery" @popupChange="(value)=>{pageMetaShow=value}" :showLoading="(loadingMoreHidden&&searchs.length>0)" :loadingMoreHidden="loadingMoreHidden" :showNoMore="true" :showSingleList="showSingleList" v-if="!searchHidden" :goods="searchs" :ishowSpecialPriceOff="true">
			</good-list>

			<getCoupon moduleName="search"  ref="getCouponRef"></getCoupon>
<!-- 			<view class="bottom-nomore flex justify-content-center align-items-center"
				v-if="loadingMoreHidden && !searchHidden">{{ $t('search.nomore_good') }}</view> -->
			<view v-if="!noneHidden" class="goods-none">
				<image src="/static/images/search_empty.png" />
				<text>{{ language.empty_product }}</text>
			</view>
			<!-- </scroll-view> -->
		</view>
	</view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import popupRight from '@/components/popupRight/popupRight'
import getCoupon from "@/components/get-coupon/get-coupon.vue";

const app = getApp(); // 语言
import {
	mapState,
} from 'vuex'
export default {
	components: {
		navigation,
		getCoupon,
		popupRight
	},
	data() {
		return {
			pageMetaShow:false,
			searchCorrectionText:'',//搜索纠错词
			search: true,
			searchs: [],
			noneHidden: true,
			searchHidden: true,
			isLoadProduct: false,
			recentSearch: [],
			hotWords: [],
			staticHotWords: [],
			trend_search_words: [],
			searchValue: '',
			page: 0,
			recentMore: false,
			//语言 - begin
			language: {
				search: '',
				cancel: '',
				recent_search: '',
				empty_product: ''
			},

			//语言 - end
			categoryId: '',

			searchE: '',
			searchInput: false,
			toView: '',
			searchContent: '',
			showNav: false,
			showFilter: false,
			isLastPage: false,
			loadingMoreHidden: false,
			filterPriceRange: '',//价格范围
			couponParams:'',
			saleParams:{},
			specialCateParams: {},
			vipParams:false,
			showBtn: false,
			showOpenDelete: true,
			showSingleList: false,
			origin_searchtext: '',
			searchText: '',
			tophits: [],
			search_tag_string:'',
			attrq: '',
			symbol: '$',
			filterAttrs: '',
			filter_info: {},
			selected_filter_info: '',
			showExpandBtn: true,
			checkedTag: '',
			price_max: 0,	
			price_min: 0,
			searchCount: 0,
			isFirstQuery: true,
			countDownType: 'dressin_sale',
			showCountDown: false,
			saleTitle: '#DRESSINSALE',
			nowPath: '/pages/search/search',
			isSearchBoxImpression:false,
			isNavSearchImpression:false,
			isTophitsImpression:false,
			
			recentlyMaValueArr:[], // recently当前显示的数据
			recentlyMaEDValueArr:[], // recently已曝光过的数据
			
			hotMaValueArr:[], // hot当前显示的数据
			hotMaEDValueArr:[], // hot已曝光过的数据
			
			trendMaValueArr:[], // trend当前显示的数据
			trendMaEDValueArr:[], // trend已曝光过的数据
			module_name: 'search_hp'
		};
	},
	computed: {
		...mapState(['cartCount']),
		statusBarHeight() {
			return app.globalData.statusBarHeight
		},
		titleBarHeight() {
			return app.globalData.titleBarHeight
		}		
	},	
	
	mounted() {
		this.$nextTick(()=>{
			this.startSearchBoxObserver();
			this.startNavSearchObserver();
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(!this.vipParams && !this.couponParams) {
			// 处理搜出来只有一个产品跳详情页之后回退展示有bug
			this.setData({
				showNav: false,
				noneHidden: true,
				isLastPage: false,
				loadingMoreHidden: false,
				search: true,
				searchInput: false,
				searchHidden: true,
			})
		}
		if(options.module){
			this.module_name = options.module;
		}
		this.getRecentSearch();
		// 优惠券XY列表
		if (options && options.couponProduct) {
			this.searchHidden = false;
			this.showNav = true;
			this.couponParams = JSON.parse(decodeURIComponent(options.couponProduct))
			this.getCouponXYProductList()
		}
		// 会员列表
		if (options && options.vipProduct) {
			this.searchHidden = false;
			this.showNav = true;
			this.vipParams = true;
			this.getVipProductList()
		}
		// 特价列表
		if(options && options.saleProduct) {
			this.searchHidden = false;
			this.showNav = true;
			this.saleParams = JSON.parse(decodeURIComponent(options.saleProduct))
			const {type} = this.saleParams
			this.showCountDown = true
			this.countDownType = String(type)
			this.searchProduct()
		}
		// 特殊分类搜索
		if(options && options.specialcate) {
			this.searchHidden = false;
			this.showNav = true;
			this.specialCateParams = JSON.parse(decodeURIComponent(options.specialcate))
			uni.showLoading()
			this.searchProduct()
		}
		// 热词查询
		this.queryHotWords()
		setTimeout(()=>{
			this.matomoVisit(this.searchHidden)
		},300)
	},
	watch: {
		searchHidden(newValue) {
			this.matomoVisit(newValue)
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if(this.showCountDown){
			const that = this
			setTimeout(() => {
				that.$refs.getCouponRef.getNewcomerCouponList();
			}, 0);
		}	
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload(){
		if(this.observer){
			this.observer.disconnect();
			this.observer = null;
		}
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () { },
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		this.isFirstQuery = false
		//判断是否到 最后一页了
		if(this.searchHidden||this.isLastPage)return
		this.loadingMoreHidden = true
		if (!this.isLastPage) {
			this.loadProduct()
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () { },
	onPageScroll: function (t) {
		this.$refs['good_list_ref'] && this.$refs['good_list_ref'].pageScrollFunc(t.scrollTop)
        if (t.scrollTop >= 180) {
            this.showBtn = true
        } else {
            this.showBtn = false
        }
		this.$debounce(() => {
			this.$refs['good_list_ref']&&this.$refs['good_list_ref'].startObserver();
		}, 300)
    },
	methods: {
		matomoVisit(val) {
			if(val) {
				this.$maEvent.visit_event({
					event_category: 'search',
					event_action: 'search_visit',
					event_name: 'search_visit'
				})
			} else {
				this.$maEvent.visit_event({
					event_category: 'search_result',
					event_action: 'search_result_visit',
					event_name: 'search_result_visit'
				})
			}
		},
		startSearchResultObserver() {
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			this.$public.observeVisibility(this.observer, ".recently_search_ma", () => {
				this.recentlyItemVisibility();
			});
			this.$public.observeVisibility(this.observer, ".hot_search_ma", () => {
				this.hotItemVisibility();
			});
			this.$public.observeVisibility(this.observer, ".trend_search_ma", () => {
				this.trendItemVisibility();
			});
		},
		recentlyItemVisibility() {
			const uniqueInMa = this.recentlyMaValueArr.filter(item => !this.recentlyMaEDValueArr.includes(item));
			if(uniqueInMa.length) {
				this.recentlyMaEDValueArr = [...this.recentlyMaEDValueArr,...uniqueInMa]
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_recent_page',
					event_name: uniqueInMa.join(','),
					module: 'search_recent',
					event_data: {
						event_value: uniqueInMa.join(',')
					}
				})
			}
		},
		hotItemVisibility() {
			const uniqueInMa = this.hotMaValueArr.filter(item => !this.hotMaEDValueArr.includes(item));
			if(uniqueInMa.length) {
				this.hotMaEDValueArr = [...this.hotMaEDValueArr,...uniqueInMa]
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_popular_page',
					event_name: uniqueInMa.join(','),
					module: 'search_popular',
					event_data: {
						event_value: uniqueInMa.join(',')
					}
				})
			}
		},
		trendItemVisibility() {
			const uniqueInMa = this.trendMaValueArr.filter(item1 => !this.trendMaEDValueArr.some(item2 => item2.search_key === item1.search_key));
			if(uniqueInMa.length) {
				this.trendMaEDValueArr = [...this.trendMaEDValueArr,...uniqueInMa]
				let maValue = uniqueInMa.map(item => item.search_key)
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_trending_page',
					event_name: maValue.join(','),
					module: 'search_trending',
					event_data: {
						event_value: maValue.join(',')
					}
				})
			}
		},
		startSearchTagsObserver() {
			if(!this.tophits.length) {
				return;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			let elementSelector = ".tophits_wrapper";
			this.$public.observeVisibility(this.observer, elementSelector, () => {
				if(this.isTophitsImpression){
					return false;
				}
				this.isTophitsImpression = true;
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_tag_page',
					event_name: this.search_tag_string,
					module: 'search_tag',
					event_data: {
						event_value: this.search_tag_string,
						search_keyword:this.searchText
					}
				})
			});
		},
		startSearchBoxObserver() {
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			let elementSelector = ".search-input";
			this.$public.observeVisibility(this.observer, elementSelector, () => {
				if(this.isSearchBoxImpression){
					return false;
				}
				this.isSearchBoxImpression = true;
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_box_page',
					event_name: 'search',
					module: 'search_box',
					event_data: {
						page_in: 'search'
					}
				})
			});
		},
		startNavSearchObserver() {
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			let elementSelector = ".nav-search";
			this.$public.observeVisibility(this.observer, elementSelector, () => {
				if(this.isNavSearchImpression){
					return false;
				}
				this.isNavSearchImpression = true;
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_box_page',
					event_name: 'search',
					module: 'search_box',
					event_data: {
						page_in: 'search'
					}
				})
			});
		},
		handleSearchClickMa() {
			this.$maEvent.custom_event({
				event_category: 'search',
				event_action: 'search_box_button',
				event_name: 'search',
				module: 'search_box',
				event_data: {
					page_in: 'search'
				}
			})
		},
		handleChangecountDownType(data){
			const that = this
			that.page = 0
			that.isLastPage = false,
			// that.searchCount = 0
			that.saleParams['type'] = data.key
			that.searchs = []
			that.searchProduct()
			
		},
		handleShowSearchEntry(clear='0'){
			if(this.showCountDown){
				uni.redirectTo({
					url: "/pages/search/search"
				})

			}
			this.setData({
				showNav: false,
				noneHidden: true,
				isLastPage: false,
				loadingMoreHidden: false,
				search: true,
				searchInput: false,
				searchHidden: true,
				attrq: '',
			})
			if(clear =='1'){
				this.searchContent = ''
			}
			this.specialCateParams = {}
			this.saleParams = {}
		},
		handleChangeListType(){
			this.showSingleList = !this.showSingleList
		},
		queryHotWords() {
			this.$apis.queryHotWords({}).then(res =>{
				if(res.data){
					const  all_search_words  = res.data.all_search_words || []
					const  trend_search_words  = res.data.trend_search_words || []
					this.hotWords = all_search_words
					this.staticHotWords = all_search_words
					this.trend_search_words = trend_search_words
					
					this.$nextTick(()=>{
						this.startSearchResultObserver();
					})
				}
			}).catch(()=>{

			})
		},
		// 优惠券X Y列表
		getCouponXYProductList(){			
			var that = this;
			that.setData({
				page: that.page + 1
			});
			let params = {
				q: that.searchValue,
				p: that.page,
				price: that.filterPriceRange,
				...that.couponParams
			}
			if(that.filterAttrs){
				params.filterAttrs = that.filterAttrs
			}
			this.$apis.getCouponXYProductList(params).then(res => {
				let _listData = res.data.coll || [];
				const count = res.data.count || 0
				this.searchCount = count
				if (_listData.length > 0) {
					that.searchs = that.searchs.concat(_listData);
					if (res.data.count == that.searchs.length) {
						that.setData({
							isLastPage: true,
							loadingMoreHidden: true,
						})
					}
					that.setData({
						searchHidden: false,
						noneHidden: true,
						showNav: true,
					});
					that.setData({
						isLoadProduct: false
					});
				} else {
					that.setData({
						searchHidden: false,
						noneHidden: false,
						showNav: true,
					});
				}
				uni.hideLoading()
			})
		},
		// 会员列表
		getVipProductList() {
			var that = this;
			that.setData({
				page: that.page + 1
			});
			let params = {
				q: that.searchValue,
				p: that.page,
				price: that.filterPriceRange
			}
			if(that.filterAttrs){
				params.filterAttrs = that.filterAttrs
			}
			uni.showLoading()	
			this.$apis.getVipProductList(params).then(res => {
				let _listData = res.data.coll || [];
				const count = res.data.count || 0
				this.searchCount = count
				const filter_info = Array.isArray(res.data.filter_info) ? {} : res.data.filter_info
				for(let k in filter_info){
					filter_info[k]['opened'] = false						
				}
				that.filter_info = filter_info || {}
				if (_listData.length > 0) {
					that.searchs = that.searchs.concat(_listData);
					if (res.data.count == that.searchs.length) {
						that.setData({
							isLastPage: true,
							loadingMoreHidden: false,
						})
					}
					that.setData({
						searchHidden: false,
						noneHidden: true,
						showNav: true,
					});
					that.setData({
						isLoadProduct: false
					});
				} else {
					that.setData({
						searchHidden: false,
						noneHidden: false,
						showNav: true,
					});
				}
				uni.hideLoading()
			})
		},
		handleBack() {
			// uni.navigateBack({ delta: 1 })
			this.$public.handleGoBack();
		},
		getRecentSearch: function () {
			let recentSearch = uni.getStorageSync('recentSearch') || [];
			this.setData({
				recentSearch
			});
		},

		clearHistory: function () {
			uni.clearStorageSync('recentSearch');
			this.setData({
				recentSearch: []
			});
		},

		goSearch: function (e) {
			this.setData({
				searchE: e
			});
			this.searchFun(e);
		},


		changeLanguage() {
			this.setData({
				language: uni.T.getLanguage()
			});
			this.searchFun();
		},

		searchFun: function (e) {
			if (!e) {
				var e = this.searchE;
			}

			let that = this;
			let keywords;
			that.setData({
				searchs: [],
				page: 0
			});

			if (e.detail.value) {
				keywords = e.detail.value;
			} else {
				keywords = e.currentTarget.dataset.text;
			}

			that.searchValue = keywords;
			if (that.searchValue) {
				// 记录最近搜索
				let recentSearch = uni.getStorageSync('recentSearch') || [];

				if (!app.globalData.isStrInArray(keywords, recentSearch)) {
					recentSearch.unshift(that.searchValue);
					uni.setStorageSync('recentSearch', recentSearch);
					that.setData({
						recentSearch: recentSearch
					});
				}
			}
			if(that.couponParams) {
				that.getCouponXYProductList()
			} else if(that.vipParams) {
				that.getVipProductList()
			} else {
				that.searchProduct();
			}
			this.trackEvent();
		},
		handleOpenDelete(){
			this.showOpenDelete = !this.showOpenDelete
		},
		handleClearall(){
			uni.setStorageSync('recentSearch', []);
			this.showOpenDelete = true
			this.recentSearch = []
		},
		handleDeleteSingleRecently(keyword){
			const recentSearch = uni.getStorageSync('recentSearch') || [];
			const result = []
			recentSearch.map(item=>{
				if(item != keyword){
					result.push(item)
				}
			})
			uni.setStorageSync('recentSearch', result);
			if(!result.length){
				this.showOpenDelete = true
			}
			this.setData({
				recentSearch: result
			});	
		},
		handleClickTag(keys,value){
			if(value == this.checkedTag)return
			this.checkedTag = value
			const key = keys.split('.keyword')[0] 
			this.attrq = encodeURIComponent(key + "." + value)
			this.specialCateParams = {}
			uni.showLoading()
			this.page = 0
			this.searchs = []
			this.searchProduct()
			this.$maEvent.custom_event({
				event_category: 'search',
				event_action: 'search_tag_button',
				event_name: value,
				module: 'search_tag',
				event_data: {
					event_value: value,
					search_keyword:this.searchText
				}
			})
		},
		searchProduct: function () {
			uni.showLoading()	
			var that = this;
			that.setData({
				page: that.page + 1
			});
			let params = {
				q: that.searchValue,
				p: that.page,
				// filterAttrs: {
				// 	color: "red"
				// },
				price: that.filterPriceRange,
				...that.saleParams,
				...that.specialCateParams
			}
			if(that.filterAttrs){
				params.filterAttrs = that.filterAttrs
			}
			if(that.attrq){
				params.attrq = that.attrq
			}
			that.$apis.queryProductLists(params).then(res=>{
				uni.hideLoading()
				if (res.code == 200 ) {
						// if(res.data.data.products.length == 1&&that.page == 1) {
						// 	that.$public.handleNavTo('/pages/goods-detail/index?id=' + res.data.data.products[0].id)
						// }
						var searchs = that.searchs;
						that.price_max = res.data.price_range&&res.data.price_range.price_max
						that.price_min = res.data.price_range&&res.data.price_range.price_min
						that.$refs['popupRight'].price2 = that.$refs['popupRight'].price2 ? that.$refs['popupRight'].price2 : that.price_max
						that.$refs['popupRight'].price1 = that.$refs['popupRight'].price1 ? that.$refs['popupRight'].price1 : that.price_min
						that.origin_searchtext = res.data.origin_searchtext;
						that.searchCorrectionText = res.data.searchtext; // 搜索纠错词
						that.tophits = res.data.tophits||[]
						let searchTagsValue = that.tophits.map(obj => Object.values(obj)[0]);
						that.isTophitsImpression = false;
						that.search_tag_string = searchTagsValue.join(',');
						that.searchText = res.data.searchText
						if(res.data.searchCount){
							that.searchCount = res.data.searchCount
						}else{
							that.searchCount = 0
						}
						const filter_info = Array.isArray(res.data.filter_info) ? {} : res.data.filter_info
						const symbol = res.data.symbol
						that.symbol = symbol
						// if(!Object.keys(that.filter_info).length){
							for(let k in filter_info){
								filter_info[k]['opened'] = false						
							}
							that.filter_info = filter_info || {}
						// }
						for (var i = 0; i < res.data.products.length; i++) {
							searchs.push(res.data.products[i]);
						}
						if (searchs.length >= res.data.searchCount) { //已经是最后一页了
							console.log('last page');
							that.setData({
								isLastPage: true,
								loadingMoreHidden: false,
							})
						}
						that.setData({
							searchs: searchs,
							searchHidden: false,
							noneHidden: true,
							showNav: true,
						});
						that.setData({
							isLoadProduct: false
						});
						if(!res.data.products.length&&!searchs.length){
							that.searchs = []
							if(!that.searchs.length){
								that.setData({
									searchHidden: false,
									noneHidden: false,
									showNav: true,
								});
								if(that.showCountDown){
									that.setData({
										noneHidden: true,
										isFirstQuery: false
									})
								}
							}
						}
						var maFilter = {}
						if(params.filterAttrs) {
							maFilter = {...JSON.parse(params.filterAttrs)}
						}
						if(params.price) {
							let priceArr = params.price.split('-');
							let pArr = priceArr.map(item => item || '0');
							maFilter['price'] = pArr.join('-');
						}
						
						var maResultType = res.data.products.length?1:2
						if(this.searchCorrectionText && this.searchCorrectionText.toLocaleUpperCase() != this.searchText.toLocaleUpperCase()) {
							maResultType = 3
						}
						if(params.p == 1) {
							this.$maEvent.custom_event({
								event_category: 'search',
								event_action: 'search_pageview_button',
								event_name:this.searchText,
								module: 'search_pageview',
								event_data: {
									event_value:this.searchText,
									result_type:maResultType, // 1（有结果） / 2 （无结果） / 3 （搜索建议）
									filter:maFilter
								}
							})
						}
						this.$nextTick(()=>{
							this.startSearchTagsObserver();
						})
						if(res.data.products.length){
							this.trackProductEvent(res.data.products);
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.message||'error'
						})
					}
			}).catch(err=>{
				uni.showToast({
					icon: "none",
					title: err || 'error'
				})
			})
			
		},

		loadProduct: function () {
			var that = this;

			if (that.isLoadProduct == false) {
				that.setData({
					isLoadProduct: true
				});
				if(that.couponParams) {
					that.getCouponXYProductList();
				} else if(that.vipParams) {
					that.getVipProductList();
				} else {
					that.searchProduct();
				}
			}
		},

		searchFocus: function () {
			this.setData({
				search: false,
				searchInput: true
			});
		},

		searchClose: function () {
			// this.getRecentSearch()
			this.setData({
				search: true,
				searchInput: false,
				searchHidden: true
			});
		},
		handleTapKey(item) {
			let that = this
			if(!that.showOpenDelete){
				that.handleDeleteSingleRecently(item.key)
			}else{
				that.setData({
					searchContent: item.key
				})
				that.newSearchFunc(item.key);
			}		
			that.$maEvent.custom_event({
				event_category: 'search',
				event_action: item.maEventName,
				event_name: item.key,
				module: item.maModuleName,
				event_data: {
					event_value:item.key
				}
			})
		},
		newSearchFunc(key) {
			this.isFirstQuery = true							
			this.checkedTag = ''
			// 回到顶部
			this.$refs['backtop'].backTop()
			let k = key.trim()		
			let that = this
			if(!k){
				that.searchContent = ''
				return
			}	
			uni.showLoading()		
			that.setData({
				searchs: [],
				page: 0,
				isLastPage: false,
				loadingMoreHidden: false,
				showFilter: false,
				// filterPriceRange: '',
			});
			that.showOpenDelete = true
			// 记录最近搜索
			let recentSearch = uni.getStorageSync('recentSearch') || [];
			that.searchValue = k
			const result = []
			recentSearch.map(item =>{
				const upperK = k.toLocaleUpperCase()
				const upperItem = item.toLocaleUpperCase()
				if(upperItem != upperK&&result.length < 9){
					result.push(item)
				}
			})
			result.unshift(k)
			uni.setStorageSync('recentSearch', result);
				that.setData({
					recentSearch: result
				});			
			
			that.searchProduct();
			this.trackEvent();
		},
		handleToSearch() {
			this.setData({
				showNav: false,
				noneHidden: true,
				isLastPage: false,
				loadingMoreHidden: false,
			})
			this.handleCancle()
		},
		handleCancle() {

			this.setData({
				search: true,
				searchInput: false,
				searchHidden: true,
				searchContent: '',
			});
		},
		openFilter() {
			const that = this
			that.showFilter = true
			that.$refs['popupRight'].open()
			that.$refs['popupRight'].checkSelectedTag(that.selected_filter_info)
			that.$maEvent.custom_event({
				event_category: 'search',
				event_action: 'search_filter_button',
				module: 'search_filter'
			})
		},
		handleCloseFilter() {
			this.showFilter = false
		},
		handleSwitchToCate() {
			uni.switchTab({ url: '/pages/cate/index' })
		},
		goToCart() {
			uni.navigateTo({ url: '/pages/cart/cartPage' })
		},
		// handleFilterPrice(val = '') {
		// 	this.setData({
		// 		searchs: [],
		// 		page: 0,
		// 		isLastPage: false,
		// 		loadingMoreHidden: false,
		// 		showFilter: false,
		// 		filterPriceRange: val,
		// 	})
		// 	uni.showLoading()
		// 	if(this.couponParams) {
		// 		this.getCouponXYProductList()
		// 	} else if(this.vipParams) {
		// 		this.getVipProductList();
		// 	} else {
		// 		this.searchProduct()
		// 	}
		// },
		handleFilterQuery(data) {
			const {filterAttrs, priceRange} = data
			this.selected_filter_info = filterAttrs
			this.setData({
				searchs: [],
				filterAttrs,
				page: 0,
				isLastPage: false,
				loadingMoreHidden: false,
				showFilter: false,
				filterPriceRange: priceRange,
			})
			uni.showLoading()
			if(this.couponParams) {
				this.getCouponXYProductList()
			} else if(this.vipParams) {
				this.getVipProductList();
			} else {
				this.searchProduct()
			}
		},
		trackEvent(){
			this.$trackEvent.search(this.searchValue);
		},
		trackProductEvent(products){
			this.$trackEvent.view_list_item({
				name: this.searchValue,
				products: products
			});
			this.$maEvent.searchListView({
				name: this.searchValue,
				products: products
			});
		}
	}
};
</script>
<style scoped lang="scss">
/* pages/search/search.wxss */
@import "@/common/mixins.scss";
.tophits_wrapper{
	padding: 20rpx;
}
.keywrods_wrapper{
	margin-top: 30rpx;
}
.tips_wrapper{
	padding: 20rpx;
	
	.ori{
		font-size: 12px;
		text-align: center;
		color: #666;
		line-height: 40rpx;
	}
	.now{
		font-size: 14px;
		text-align: center;
		color: #222;
		line-height: 40rpx;
	}
}
.tophits_wrapper .search_tag{
	font-size: 26.92rpx;
	background: #fff;
	color: #666;
	padding: .2rem .4rem;
	margin: .2rem .4rem;
	white-space: nowrap;
	cursor: pointer;
	border: 1px solid #e5e5e5;
	&.checked{
		border: 1px solid #333;
	}
}
.changeListLayout{
	height: 96rpx;
	max-width: 100rpx;
	margin-left: 12rpx;
	overflow: hidden;
	flex-wrap: nowrap;
	.view_img{
		height: 48rpx;
	}
}
.search-back {
	width: 46.15rpx;
	height: 46.15rpx;

	.img{
		width: 46.15rpx;
		height: 46.15rpx;
	}
}
.search_icon{
	width: 46.15rpx;
	height: 46.15rpx;

	.img{
		width: 46.15rpx;
		height: 46.15rpx;
	}
}
.my-search-nav {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 98;
	width: 100%;
	height: 96rpx;
	background-color: #fff;
	.page_title{
		height: 50rpx;
		font-size: 35rpx;
		color: #000000;
		line-height: 41rpx;
	}
	.right_box{
		.changeListLayout{
			margin-left: 46.15rpx;
		}
	}
	.search-box {
		@include onepxBorder(#eaeaea);
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.campaign_header{
		padding: 0 30.77rpx;
	}


	.nav-cates {
		height: 96rpx;
		line-height: 96rpx;
		width: 72rpx;
		text-align: center;

		i::before {
			content: "\E605";
			font-size: 48rpx;
			color: #333;
		}
	}

	.nav-search {
		// width: 582rpx;
		width: calc(100vw - 349rpx);
		flex: 1;
		height: 64rpx;
		display: flex;
		align-items: center;
		background-color: #f3f3f3;
		box-sizing: border-box;
		padding: 0 8rpx;
		color: #333;

		.nav-glass {
			i {
				width: 48rpx;
				height: 48rpx;

				&::before {
					content: "\E687";
					font-size: 48rpx;
				}
			}
		}

		.nav-content {
			height: 64rpx;
			line-height: 64rpx;
			font-size: 29.77rpx;
			// width: 450rpx;
			width: 100%;
			margin: 0 10rpx;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.nav-content.nosearchContent{
			color: #999;
		}

		.nav-cancle {
			width: 48rpx;
			height: 48rpx;

			i::before {
				content: "\E688";
				font-size: 48rpx;
			}
		}
	}
.header_right_icons{
	width: 172rpx;
	flex-wrap: nowrap;
	justify-content: space-between;
}
	.nav-bag {
		display: flex;
		width: 72rpx;
		margin: 12rpx 16rpx;
		align-items: center;

		i:nth-child(1) {
			&::before {
				content: "\E698";
				font-size: 48rpx;
				color: #333;
			}
		}

		i:nth-child(2) {
			margin-top: 10rpx;
			margin-left: -8rpx;
			text-align: center;
			line-height: 30rpx;
			color: #fff;
			font-size: 20rpx;
			background: linear-gradient(to bottom right, #fd4d4d, #ff165e);
			width: 30rpx;
			height: 30rpx;
			display: inline-block;
			border-radius: 50%;
		}
	}
	.nav-bag-lower{
		margin: 0 0 0 46.15rpx;
		width: 46.15rpx;
	}
}

.search-header {
	background: #fff;
	width: 750rpx;
	height: 98rpx;
	position: fixed;
	z-index: 2;
	.search-wrap {
		display: flex;
		z-index: 1;
		width: 100%;
		height: 69rpx;
		top: 0;
		left: 0;
		padding-left: 32.69rpx;
		padding-right: 30.77rpx;
		// @include onepxBorder(#eee);
	}


	

	.search-input {
		// margin-left: 48rpx;
		height: 69rpx;
		width: 615rpx;
		display: flex;
		background: #EEEEEE;
		border-radius: 63rpx 63rpx 63rpx 63rpx;
		position: relative;
		margin-left: 11.54rpx;
		flex: 1;

		/deep/.uni-input {
			height: 69rpx;
			font-size: 29.77rpx;
			width: 615rpx;
			caret-color: red;
			padding-left: 34.62rpx;
			padding-right: 72rpx;
		}
		.img{
			width: 46.15rpx;
			height: 46.15rpx;
			position: absolute;
			right: 26.92rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		>i {
			position: absolute;
			right: 26.92rpx;
			top: 50%;
			transform: translateY(-50%);

			&::before {
				content: "\E619";
				font-size: 48rpx;
				color: #666;
			}
		}
	}
}

.container {
	.search_page{
		height: calc(100vh - 98rpx);
	}
	box-sizing: border-box;
	padding-top: 96rpx;

	.search-title {
		width: 100%;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 30.77rpx;
		color: #333;
		box-sizing: border-box;
		padding-left: 34.62rpx;
		padding-right: 34.62rpx;

	}
	.recently_search{
		position: relative;
		.recently_btns{
			position: absolute;
			right: 23.08rpx;
			top: 50%;
			transform: translateY(-50%);
			.clearall{
				font-size: 26.92rpx;
				color: #999;				
			}
			.done{
				font-size: 26.92rpx;
				color: #333;
			}
			.gap{
				color: #d9d9d9;
				margin: 0 15.38rpx;
			}
			.img_delete{
				width: 34.62rpx;
				height: 34.62rpx;
			}
			i.delete{
			
			&:before{
				content: '\e6a7';
			}
		}
		}
		
	}

	.my-filter-box {
		width: 100%;
		height: 96rpx;
		padding: 0 41rpx;
		color: #333;
		.filter-dialog {
			text-align: center;
			line-height: 96rpx;
			font-size: 28rpx;
			width: 48rpx;

			i::before {
				content: "\E612";
				font-size: 48rpx;
				color: #666;
			}
		}
	}

	.search-keys {
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		margin-top: 19.23rpx;
		padding: 0 34.62rpx 0 34.62rpx;	
		position: relative;	
		.expand_btn{
			padding-right: 0!important;
			.img{
				width: 34.62rpx;
				height: 34.62rpx;
			}
			&.less_btn{
				.img{
					transform: rotate(-180deg);
				}
			}
		}
		&.more{
			max-height: 136.76rpx;
			overflow: hidden;
			
			
		}
		.more_tag{
			position: absolute;
			right: 0;
			bottom: 0;
			background: pink;
		}
		.search-item {
			box-sizing: border-box;
			padding: 0 23.08rpx;
			height: 54rpx;
			line-height: 54rpx;
			margin: 0 15.38rpx 15.38rpx 0;
			font-size: 26.92rpx;
			color: #666666;
			background-color: #F5F5F5;
			max-width: 100%;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			position: relative;
			.key_content{
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				flex: 1;
			}
			
		}
		.hot_search_item i{
			color: #fa6338;
			margin-right: 6rpx;
			font-size: 24rpx;
			&:before{
				content: '\e690';
			}
		}
		.delete_item{
			padding-right: 0rpx;
			i{
				font-size: 20rpx;
				height: 100%;
    			transform: translateY(-20%) scale(0.8);
				padding: 0 8rpx 0 16rpx;
				color: #666;
				&:before{
					content: '\e6ab';
				}
			}

		}
	}
}

.type-header-menu {
	height: 120rpx;
	width: 100%;
	background-color: #fff;
	z-index: 99999;
	border-bottom: 1rpx solid #f8f8f8;
	box-sizing: border-box;
	overflow: hidden;
}

page {
	height: 100%;
}

.goods-container {
	width: 100%;
	margin-bottom: 0px;
	height: 100%;
}

.type-header-menu .type-search {
	width: 690rpx;
	margin-left: 30rpx;
	position: relative;
	height: 66rpx;
	overflow: hidden;
	margin-top: 30rpx;
	box-sizing: border-box;
}

.type-header-menu .type-search image {
	width: 16px;
	height: 16px;
	position: absolute;
	top: 14rpx;
	left: 16rpx;
}

.type-header-menu .type-search .input {
	width: 625rpx;
	height: 60rpx;
	background-color: #f5f5f5;
	border-radius: 50rpx;
	font-size: 28rpx;
	padding-left: 65rpx;
	display: inline-block;
	transition: all 0.6s;
}

.type-header-menu .type-search .active {
	width: 525rpx;
	transition: all 0.6s;
}

.type-header-menu .type-search .header-search-btn {
	float: right;
	font-size: 30rpx;
	line-height: 60rpx;
	color: #b5272d;
	font-size: 30rpx;
	width: 100rpx;
	text-align: center;
}

.bottom-nomore {
	height: 80rpx;
	font-size: 30rpx;
	color: #ccc;
}

.goods-none {
	margin-top: 25%;
	margin-bottom: 25%;
}

.goods-none image {
	width: 200rpx;
	height: 200rpx;
	display: block;
	margin: 0 auto;
}

.goods-none text {
	font-size: 28rpx;
	display: block;
	color: #999;
	text-align: center;
	margin-top: 10rpx;
}

.goods-box {
	width: 45%;
	margin: 20px 0 0 13px;
	display: inline-block;
}

.img-box image {
	width: 100%;
	display: block;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
}

.img-box {
	width: 100%;
	background-color: #f5f5f5;
	margin-bottom: 5px;
	position: relative;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	overflow: hidden;
}

.goods-characteristic {
	font-size: 22rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	background-color: #f0ece1;
	color: #a18d65;
	height: 35px;
	line-height: 35px;
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
}

.goods-characteristic text {
	padding-left: 5px;
}

.goods-title {
	font-size: 28rpx;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0 5px;
}

.goods-price {
	color: #b5272d;
	font-size: 28rpx;
	text-align: left;
	width: 100%;
	padding: 3px 4px;
}

.goods-price-naver {
	color: #999;
	font-size: 24rpx;
	line-height: 28px;
	width: 100%;
	text-align: right;
	padding: 0 3px;
}

.search-cont-box {
	padding: 0 30rpx;
}

.search-cont-box .title-and-btn {
	display: flex;
	justify-content: space-between;
	padding: 30rpx 0 20rpx 0;
}

.search-cont-box .title-and-btn .btn image {
	height: 48rpx;
	width: 48rpx;
}

.search-cont-box .title-and-btn .title {
	color: #777;
	font-size: 28rpx;
}

.search-cont-box .keywords-li {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.search-cont-box .keywords-li .item {
	font-size: 22rpx;
	color: #777;
	border: 1rpx solid #777;
	padding: 4rpx 12rpx;
	border-radius: 5rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
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
.searchCorrection-box {
	text-align: center;
	padding: 40rpx;
	.search-text {
		font-size: 28rpx;
		margin-bottom: 24rpx;
	}
	.correction-text {
		font-size: 36rpx;
		font-weight: bold;
	}
}
</style>
