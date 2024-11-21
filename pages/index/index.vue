<template>
    <view :class="categoriesHome.length > 1 ? 'mt164r' : 'mt93r'">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<view class="fixed-header page-max-width" :style="{'padding-bottom': !isAllPage && !tabBanner ? '28.92rpx' : '1px', 'border-bottom': '2rpx solid #f1f1f1' }">
			<view class="top_search_header flex justify-content-between align-items-center">
			    <view class="fake_input flex justify-content-between align-items-center" @tap="handleToSearch">
			        <view class="search_placeholder">{{ $t('category.search_by_di', {site_name: $store.state.site_name}) }}</view>
			        <view class="search_icon">
			            <image class="img" :src="getImgPathFunc('/static/images/category_top_search')" mode="aspectFill" />
			        </view>
			    </view>
			    <view class="sign_in_icon" @tap="handleCheckIn">
			        <image class="img" :src="getImgPathFunc('/static/images/category_sign_in2')" mode="aspectFill" />
			    </view>
			</view>
			<scroll-view scroll-x="true" show-scrollbar="false" v-if="categoriesHome.length > 1">	
				<view class="home-tabs-box">
					<view class="home-tabs-item" @tap="handleSwitchToAll">
						<view :class="'flex-cc'+(isAllPage ? ' home-tabs-item-content-active' : ' home-tabs-item-content')">
							<text>{{ $t('category.all') }}</text>
						</view>
					</view>
					<view class="home-tabs-item" @tap="handleSwitchTab(item)"
						v-for="(item, index) in categoriesHome" :id="'navItems' + item.id" :key="index">
						<view :class="'flex-cc'+(!isAllPage && homeTab === item.name ? ' home-tabs-item-content-active' : ' home-tabs-item-content')">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>    
		</view>
		
        <back-top v-if="showBtn" :showBtn="showBtn" />
        <view class="container" v-if="isAllPage">
			<!-- 首页轮播 图片比例 750:400-->
			<view class="home-swiper-banner-box" v-if="staticblock['app-home-top-banner'].data">
				<swiper class="swiper" circular 
					:autoplay="true" :interval="5000" :duration="500"
					:indicator-dots="staticblock['app-home-top-banner'].data.length > 1" 
					indicator-color="#000"
					indicator-active-color="#865614" 
					@change="startBannerObserver">
					<swiper-item v-for="(item,index) in staticblock['app-home-top-banner'].data" :key="index">
						<view class="swiper-item" @click="checkRoute(item); bannerClick(item,index)">
							<image v-if="item.inviter_money" :src="item.image_new" mode="widthFix" style="width: 100%;"></image>
							<image v-else :src="item.image" mode="widthFix" style="width: 100%;"></image>
							<view class="dynamic-price" :class="[
								getBannerPriceClass(item.inviter_money)
							]" v-if="item.inviter_money">
								<!-- <text class="dynamic-price-get">{{$t('cashgrab_rewards.get')}}</text> -->
								<text class="dynamic-price-unit">{{item.symbol || '$'}}</text>
								<text class="dynamic-price-number">{{ item.inviter_money }}</text>
							</view>
							<block v-if="item.inviter_money">
								<text class="dynamic-discount">{{item.discount}}%</text>
								<text class="phone-price">GET {{(item.symbol || '$') + item.inviter_money}}</text>
							</block>
						</view>
					</swiper-item>
				</swiper>
			</view>
			
			<!-- <view class="home-top-text-box flex">
				<view class="flex"
					v-if="staticblock['app-home-top-text'].data"
					v-for="(item,index) in staticblock['app-home-top-text'].data"
					:key="index">
					<view class="text-item" 
						@click="$public.staticBlockJump(item)">
						<view class="text-item-top">BUY 3 GET 1 FREE</view>
						<view class="text-item-bottom">[Add 4 pairs to cart]</view>
					</view>
					<view class="line" v-if="![staticblock['app-home-top-text'].data.length - 1].includes(index)"></view>
				</view>
			</view> -->
			
			<!-- SHOP BY COLOR -->
			<view>
				<view v-if="colorTags.length > 0">
					<homeHeader :title="$t('home.shopByColor')"></homeHeader>
					<tag-list :tagArray="colorTags" :tagId="colorTag.id" 
						@emitTag="setTag('color', $event)"
						:activedColor="'#FFFFFF'"
						:activedBackgroundColor="'#222'"
						:unActivedColor="'#393939'"
						:unActivedBackgroundColor="'#F5F5F5'"
						:boxMargin="'0 30.77rpx 30.77rpx'">
					</tag-list>
				</view>
				<!-- 有special_price_off但是is_special是0，仍不显示左上角off标签 -->
				<good-scroll-list v-if="goodsSortByColor.length > 0"
					ref='goodsSortByColor'
					:tagName="colorTag"
					:listData="goodsSortByColor"
					@popupChange="(value)=>{ pageMetaShow=value; $public.isPullDown(!pageMetaShow) }"
					:navRoute="`/pages/cate/list?id=${colorTag.id}&type=${colorTag.type}`"/>
			</view>
			
			<!-- SHOP BY REPLACEMENT -->
			<view>
				<homeHeader :title="staticblock['app-unicoeye-replacement'].title" :mt="colorTags.length > 0 && goodsSortByColor.length > 0 ? 161.54 : 69.23" :mb="34.62"></homeHeader>
				<view class="replacement-box" v-if="staticblock['app-unicoeye-replacement'] && staticblock['app-unicoeye-replacement'].Pics">
					<view class="left-images">
						<image v-for="(i,idx) in staticblock['app-unicoeye-replacement'].Pics.leftPart" 
							:src="i.imageSrc"
							@click="checkRoute(i)" 
							mode="heightFix" />
					</view>
					<view class="right-image">
						<image v-for="i in staticblock['app-unicoeye-replacement'].Pics.rightPart" 
							:src="i.imageSrc"
							@click="checkRoute(i)" 
							mode="heightFix" />
					</view>
				</view>
			</view>
			
			<!-- CHOOSE YOUR BUDGET -->
			<view>
				<view v-if="priceTags.length > 0">
					<homeHeader :title="priceRangeTitle" :mt="101.92"></homeHeader>
					<tag-list :tagArray="priceTags" :tagId="priceTag.id"
						@emitTag="setTag('price', $event)"
						:activedColor="'#FFFFFF'"
						:activedBackgroundColor="'#814EFF'"
						:unActivedColor="'#393939'"
						:unActivedBackgroundColor="'#EFEAF4'"
						:boxMargin="'0 30.77rpx 30.77rpx'">
					</tag-list>
				</view>
				<good-scroll-list v-if="priceRangeList.length > 0" 
					ref="goodsSortByPrice"
					:tagName="priceTag"
					itemIdName="saleTtemBox-"
					:listData="priceRangeList"
					@popupChange="(value)=>{ pageMetaShow=value; $public.isPullDown(!pageMetaShow) }"
					:showStockRemaining="showStockRemaining"
					:tagType="showStockRemaining ? '1' : '2'"
					:navRoute="setPriceRangePath()"
					:setDotColor="'#9795D6'"
					:spacingOfImage="23.08" />
			</view>
			
			<!-- SERIES -->
			<view v-if="staticblock['app-unicoeye-series']">
				<homeHeader :title="staticblock['app-unicoeye-series'].title" :mt="priceTags.length > 0 ? 161.54 : 24" :mb="53.85"></homeHeader>
				<view class="series-scroll">
					<scroll-view scroll-x="true" show-scrollbar="false" @scroll="SeriesScroll">
						<view class="flex">
							<view class="flex series-images">
								<image v-for="(i, idx) in staticblock['app-unicoeye-series'].SeriesPics" :key="idx"
									:src="i.imageSrc" mode="heightFix"
									@click="checkRoute(i)">
								</image>
							</view>
						</view>
					</scroll-view>
					<scroll-bar
						:scrollLeft="SeriesScrollLeft"
						:scrollWidth="SeriesScrollWidth"
						:dotNum="setDotNum(staticblock['app-unicoeye-series'].SeriesPics.length)"
						:distanceFromList="'30.77rpx'">
					</scroll-bar>
				</view>
			</view>
			
			<!-- PRE-SALE -->
			<view v-if="staticblock['app-pre-sale-banner']">
				<view class="pre-sale">
					<homeHeader :title="$t('home.pre_sale')" :mt="0" :mb="30.77"></homeHeader>
					<view class="pre-sale-img flex-cc" v-if="staticblock['app-pre-sale-banner'].preSaleImgSrc"
						@tap="checkRoute(staticblock['app-pre-sale-banner'])">
						<image :src="staticblock['app-pre-sale-banner'].preSaleImgSrc" mode="widthFix"></image>
					</view>
					<good-scroll-list
						style="padding-bottom: 80.77rpx"
						:hiddenViewMore="false"
						:listData="preSaleData"
						@popupChange="(value)=>{ pageMetaShow=value; $public.isPullDown(!pageMetaShow) }"
						:setDotColor="'#D6C495'" />
				</view>
			</view>
			
			<!-- ABOUT US -->
			<view class="aboutUS" v-if="staticblock['app-unicoeye-about-us'] && staticblock['app-unicoeye-about-us'].topImage">
				<homeHeader v-if="staticblock['app-unicoeye-about-us'].title"
					:title="staticblock['app-unicoeye-about-us'].title" :mb="34.62"></homeHeader>
				<view class="image_box">
					<image class="image_pic" :src="staticblock['app-unicoeye-about-us'].topImage.imageSrc" mode="widthFix"></image>
					<text class="font-MBold image_text">{{ staticblock['app-unicoeye-about-us'].topImage.imageText }}</text>
					<view class="image_tap font-MS flex-cc" 
						 @tap="$public.handleNavTo('/pages/cms/article/article?url_key=app-about-us')">
						{{ staticblock['app-unicoeye-about-us'].topImage.buttonText }}
					</view>
				</view>
				<advantages-list v-if="staticblock['app-unicoeye-about-us'] && staticblock['app-unicoeye-about-us'].advantages"
					:list="staticblock['app-unicoeye-about-us'].advantages"></advantages-list>
			</view>
			
			<!-- FOLLOW OUR STORY@UNICOEYE -->
			<view class="redperson-box" v-if="redpersonData.red_person_product_list && redpersonData.red_person_product_list.length">
				<homeHeader :title="redpersonData.title" :mt="100" :mb="34.62"></homeHeader>
				<scroll-view scroll-x="true" show-scrollbar="false" @scroll="redpersonScroll">
					<view :class="redpersonData.red_person_product_list.length <= 4 ? 'flex-cc' : 'flex' ">
						<view class="redperson-img">
							<view class="redperson-img-item" 
								v-for="(item,ind) in redpersonData.red_person_product_list" :key="ind"
								:id="'redperson-img-item-' + item.product_id"
								@tap="toDetailsTap(item)">
								<image :src="item.red_person_image_url" class="redperson-realImage"></image>
							</view>										
						</view>
					</view>
				</scroll-view>
				<scroll-bar
					:scrollLeft="barScrollLeft"
					:scrollWidth="barScrollWidth"
					:dotNum="setDotNum(redpersonData.red_person_product_list.length, 4.5)"
					:distanceFromList="'30.77rpx'">
				</scroll-bar>
				<view class="redperson-share" id="home_media_list">
					<view class="redperson-share-item"
						v-for="(item,ind) in redpersonData.media_list" :key="ind"
						:id="`redperson-share-item-${ind}`"
						@tap="redpersonDataMediaClick(item)" >
						<image :src="item.media_img_url" mode="widthFix" />
					</view>
				</view>
			</view>
        </view>
		
		<!-- 落地页 -->
		<view v-else>
			<tabPage ref="tabPage" :homeTab="homeTab" :homeTabId="homeTabId" :tabBanner="tabBanner" />
		</view>
		
		<!-- RECOMMEND FOR YOU -->
		<view class="Recommend" v-if="goods && goods.length > 0 && isAllPage">
			<homeHeader :title="$t('recommend.header1')" :mb="46.15" :mt="0"></homeHeader>
			<good-list ref='goods_list' 
				:item_list_type="'recommended_product'" 
				:item_list_id="'recommended_product'" 
				:item_list_name="'related_products'"  
				@popupChange="(value)=>{pageMetaShow=value;$public.isPullDown(!pageMetaShow)}" 
				:goods="goods" 
				:showLoading="goodsHasNext">
			</good-list>
			<view class="is-over-tip" v-show="!goodsHasNext">
				{{$t('home.lis_over_tip')}}
			</view>
		</view>
		
		<!-- 获取优惠券弹窗 -->
		<uni-popup ref="popupCoupon" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
			<popupContentTemplate style="width:90vw;background:#fff;" :title="$t('goods_detail.discount_coupon')" @close="$refs.popupCoupon.close()">
				<template v-slot:content>
					<view class="coupon-list-box">
						<block v-for="(item,index) in couponList" :key="index">
							<couponItem :couponItemData="item" @change="getCouponList()" couponClassType='index-coupon-item' :showCircleEdge="true"></couponItem>
						</block>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 新人优惠券 -->
		<getCoupon moduleName="home" returnUrl="/pages/index/index" ref="getCouponRef" v-if="$store.state.isHomeCoupon" @showFooterTips="showFooterTips"></getCoupon>
		<cashgrabRewardsModal ref="cashgrab_rewards_popup" @showFooterTips="showFooterTips"></cashgrabRewardsModal>
		<footerTip in_site_source="cashgrab_register_float" ref="footer_tip"></footerTip>
		<view class="special_toast_tip_box">
			<ToastTip ref="toast_tip" :popupTipType="popupTipType" :title="$t('toastTip.dressinsale_rules',{site_name:this.$store.state.site_name_upper})">
				<template v-slot:content>				
					<view v-html="saleRules"></view>
				</template>
			</ToastTip>
		</view>
		
    </view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import uniCountdown from "@/components/l-uni-countdown/uni-countdown.vue";
import getCoupon from "@/components/get-coupon/get-coupon.vue";
import cashgrabRewardsModal from "@/components/cashgrab-rewards-modal/cashgrab-rewards-modal.vue"
import chatPlugin from '@/utils/chatPlugin.js'
 import { mapState } from 'vuex'
import footerTip from "@/components/footer-tip/footer-tip.vue"
import ToastTip from "@/components/toast-tip/toast-tip.vue"
import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue'
import saleRemaining from '@/components/sale-remaining/sale-remaining.vue'
import backTop from '@/components/back-top/back-top.vue';
import tabPage from './components/tabPage.vue'

//获取应用实例
const app = getApp();
export default {
    components: {
        navigation,
		uniCountdown,
		getCoupon,
		cashgrabRewardsModal,
		footerTip,
		ToastTip,
		specialOfferDiscountTab,
		saleRemaining,
		backTop,
		tabPage
    },
    data() {
        return {
			pageMetaShow:false,
			// 静态特价数据
			saleSwiperHeight:'470rpx',
			//当前显示特价index
			saleCurrentIndex:0,
			// 是否处理ALL页
			isAllPage: true,
			// 静态块数据
			staticblock:{
				'app-home-top-banner':{
					"data": []
				},
				'app-home-coupon-discount':{},
				'app-home-styles':{},
				'app-home-point-and-vip':{},
				'app-home-trending':{},
				'app-unicoeye-about-us': {
					"title": "",
					"topImage": {
						"imageText": "",
						"imageSrc": "",
						"buttonText": ""
					},
					"advantages": []
				},
				'app-unicoeye-replacement': {
					"title": "",
					"Pics": {
						"leftPart": [],
						"rightPart": []
					}
				},
				'app-unicoeye-series': {
					"title": "",
					"SeriesPics": []
				},
				'app-pre-sale-banner': {
					"preSaleImgSrc": ""
				}
			},
			// 新人券
			newcomerCouponData:{},
			// 全部优惠券
			couponList:[],
            indicatorDots: true,
            autoplay: true,
            swiperCurrent: 0,
            loadingHidden: false,

            loadingMoreHidden: true,
            showSearch: true,
            goods: [],
			goodsPage: 0, // 当前页
			goodsHasNext: true, // 是否还有下一页数据
			goodsLoading: false, // 是否正在请求数据
            fadeAni: '',
            refName: 'popupIndex',
            showBtn: false,
			categories: [], // 分类信息
			categoriesHome: [], // 分类信息
			categorieslist: [],
			lineLeft: '0', // 特价商品滚动条距离
			showMore: true,
			swiperShopStyle: {flexFlow: 'column wrap'},
			redpersonData: {
				red_person_product_list: [],
				title: ""
			}, // 红人图数据
			isShowMessageIcon: false,
			popupTipType: 1,
			saleRules: '',
			observerElements: [{
				elementSelector:  '#sale_rules_btn',
				event_category: 'home',
				event_action: 'sale_tag_page',
				event_name: 'rules',
				event_data: {
					event_value: 'rules'
				},
				module: "sale_tag"
			}],
			// 顶部tab
			homeTab: "ALL",
			homeTabId: '',
			tabBanner: '',
			preHomeTab: '',
			showStockRemaining: false, 
			colorTag: {},
			colorTags: [],
			colorGoodsStorage: {},
			isAllowedToLoadColorData: true,
			priceTag: {},
			priceTags: [],
			priceRangeTitle: '',
			priceRangeList: [],
			AllSaleData: [],
			barScrollLeft: 0,
			barScrollWidth: 0,
			SeriesScrollLeft: 0,
			SeriesScrollWidth: 0,
			goodsSortByColor: [],
			preSaleData: []
        };
    },
	computed: {
        ...mapState({
            serviceScriptUrl: state => state?.appConfig?.scriptUrl,
			serviceWebviewSrc: state => state?.appConfig?.webviewSrc
        }),
    },
	watch: {
	  
	},
    onShow() {
        //获取购物车商品数量
        app.globalData.getShopCartNum();
		setTimeout(()=> {
			this.$refs.getCouponRef && this.$refs.getCouponRef.getNewcomerCouponList();
		})
		if(this.homeUpdate){
			this.loadHomeData();
			this.homeUpdate = false;
		}
		this.pageScrollObserver();
		this.$maEvent.visit_event({
			event_category: 'home',
			event_action: 'home_visit',
			event_name: 'home_visit'
		})
    },
	onTabItemTap({index, pagePath, text}) {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]; // 获取当前页面实例
		const currentRoute = currentPage.route; // 当前页面的路径
		if(pagePath === currentRoute && !this.isAllPage) {
			this.isAllPage = true
		}
		this.$maEvent.custom_event({
			event_category: 'tabBar',
			event_action: 'tabBar_button',
			event_name: 'tabBar_button',
			module: 'tabBar',
			event_data: {
				event_value: 'home'
			},
		});
	},
	onUnload(){
		if(this.observer){
			this.observer.disconnect();
			this.observer = null;
		}
	},
    onLoad() {
        var that = this; // 语言
        // 设置picker的语言选项
        uni.$off(that.refName).$on(that.refName, () => {
            that.handleOpenPopup()
        })

        app.globalData.fadeInOut(this, 'fadeAni', 0);
		
       // ajax请求
		this.loadHomeData();
		// 优惠券领取入口暂时关闭
		// that.getCouponList();
		uni.onNetworkStatusChange( (res) => {
			if(res.isConnected && !this.isNetworkStatusLoad){
				this.loadHomeData();
				this.isNetworkStatusLoad = true;
			}
		});
		uni.$off('homeUpdate').$on('homeUpdate',(data) => {
			this.homeUpdate = true;
		});
		uni.$off('homeCashgrabRewards').$on('homeCashgrabRewards',(data) => {
			let ishomeCashgrabRewards = false;
			if(!this.$store.getters.hasLogin && data && data.aicode && !uni.getStorageSync('homeCashgrabRewards')){
				ishomeCashgrabRewards = true;
			}
			if(ishomeCashgrabRewards){
				this.$refs.cashgrab_rewards_popup && this.$refs.cashgrab_rewards_popup.open();
				uni.setStorageSync('homeCashgrabRewards', 1);
				this.$store.commit('SET_HomeCoupon', false);
			} else {
				this.$store.commit('SET_HomeCoupon', true);
				this.$refs.getCouponRef && this.$refs.getCouponRef.getNewcomerCouponList();
			}
		});
		setTimeout(() => {
			this.$trackEvent.pageView({
				action_name: 'Home'
			});
		}, 1000);
    },
    onPageScroll: function (t) {
		this.$refs['goods_list']&&this.$refs['goods_list'].pageScrollFunc(t.scrollTop)
        if (t.scrollTop >= 180) {
            this.showBtn = true
            // uni.setNavigationBarColor({
            //     frontColor: '#000000',
            //     backgroundColor: '#ffffff'
            // });
            app.globalData.fadeInOut(this, 'fadeAni', 1);
        } else {
            this.showBtn = false
            // uni.setNavigationBarColor({
            //     frontColor: '#ffffff',
            //     backgroundColor: '#ffffff'
            // });
            app.globalData.fadeInOut(this, 'fadeAni', 0);
        }
		this.$debounce(() => {
			this.$refs['goods_list']&&this.$refs['goods_list'].startObserver();
			this.startObserver(); // 列表更新后重新设置观察器
		// 	this.startRedpersonObserver();
		// 	this.pageScrollObserver();
		}, 200)
    },
	// 滚动到底部
	onReachBottom(){
		if(this.isAllPage) {
			this.recommendProduct();
		} else {
			this.$nextTick(() => {
				if (this.$refs['tabPage'] && !this.$refs.tabPage.isFirstQuery && this.$refs.tabPage.goodsHasNext) {
					this.$refs['tabPage'].loadProduct()
				}
			})
		}
	},
    //下拉刷新
    onPullDownRefresh() {
		if(this.isAllPage) {
			this.loadHomeData();
			// 页面刷新后让横滚列表回到最左边
			if(this.$refs['goodsSortByColor']) {
				this.$refs['goodsSortByColor'].scrollViewLeft = 0
				this.$refs['goodsSortByColor'].tagScrollLeft = {}
			}
			if(this.$refs['goodsSortByPrice']) {
				this.$refs['goodsSortByPrice'].scrollViewLeft = 0
				this.$refs['goodsSortByPrice'].tagScrollLeft = {}
			}
		} else {
			this.$refs['tabPage'] && this.$refs['tabPage'].refresh(this.homeTabId)
		}
    },
    methods: {
		handleSwitchToAll() {
			this.isAllPage = true
			this.loadHomeData()
			uni.pageScrollTo({
			    scrollTop: 0,
			    duration: 100
			}) 
		},
		handleSwitchTab({id, name, level, image}) {
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'navigation_button',
				event_name: 'navigation_button',
				module: 'home_navigation',
				event_data: {
					event_value: name
				},
			});
		    this.homeTab = name;
			this.homeTabId = id
			this.tabBanner = image || ""
			if(this.homeTab !== this.preHomeTab || this.isAllPage) {
				this.isAllPage = false
				this.preHomeTab = this.homeTab
				this.$nextTick(() => {
					this.$refs.tabPage.goods = []
					this.$refs.tabPage.isFirstQuery = true
					this.$refs.tabPage.goodsHasNext = false
					this.$refs.tabPage.fetchCategory(id, true);
				})
			} else {
				this.isAllPage = false
			}
			uni.pageScrollTo({
			    scrollTop: 0,
			    duration: 100
			}) 
			
		},
		handleCheckIn() {
			this.$maEvent.custom_event({
				event_category: 'menu_box',
				event_action: 'menu_box_button',
				event_name: 'menu_box_button',
				module: 'menu_box',
				event_data: {
					checkin_type: 'home',
					event_value: 'check_in'
				}
			});
			if(this.$store.getters.hasLogin) {
				this.$public.handleNavTo('/pages/my/checkin')
			} else {
				uni.navigateTo({
					 url: '/pages/login/index?in_site_source=check_in'
				});	
			}
		},
		// 开始观察产品曝光
		startObserver() {
			if(this.AllSaleData.length == 0){
				return false;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			this.AllSaleData.forEach((item, s_index) => {
				if(item.products){
					item.products.forEach((p_item, p_index) => {
						if(!p_item.observer){
							let elementSelector = '#saleTtemBox-' + p_item.id;
							this.$public.observeVisibility(this.observer, elementSelector, () => {
								if(p_item.observer){
									return false;
								}
								p_item.observer = true;
								this.$trackEvent.impression_product_item(p_item, p_index);
							});
						}
					})
				}
			});
		},
		// 开始观察红人曝光
		startRedpersonObserver() {
			if(!this.redpersonData || this.redpersonData.red_person_product_list.length == 0){
				return false;
			}
			if(!this.redpersonObserver){
				this.redpersonObserver = this.$public.createIntersectionObserver();
			}
			this.redpersonData.red_person_product_list.forEach((p_item, p_index) => {
				if(!p_item.observer){
					let elementSelector = '#redperson-img-item-' + p_item.product_id;
					this.$public.observeVisibility(this.redpersonObserver, elementSelector, () => {
						if(p_item.observer){
							return false;
						}
						p_item.observer = true;
						if(p_item.red_person_image_url){
							p_item.event_data = {
								kol_pic: p_item.red_person_image_url
							}
						}
						this.$trackEvent.impression_product_item(p_item, p_index);
					});
				}
			})
		},
		SeriesScroll(e) {
			const { scrollLeft, scrollWidth } = e.detail
			this.SeriesScrollLeft = scrollLeft
			this.SeriesScrollWidth = scrollWidth - 390
		},
		redpersonScroll(e){ 
			const { scrollLeft, scrollWidth } = e.detail
			this.barScrollLeft = scrollLeft
			this.barScrollWidth = scrollWidth - 390
			if(this.redpersonScrollObserver){
				return false;
			}
			this.redpersonScrollObserver = false;
			// setTimeout(() => {
			// 	this.startRedpersonObserver();
			// 	this.redpersonScrollObserver = false;
			// }, 100);
		},
		pageScrollObserver(){
			if(!this.scrollObserver){
				this.scrollObserver = this.$public.createIntersectionObserver();
			}
			this.observerElements.forEach((item, index) => {
				if(item.observer){
					return true;
				}
				let elementSelector = item.elementSelector;
				this.$public.observeVisibility(this.scrollObserver, elementSelector, () => {
					if(item.observer){
						return false;
					}
					this.$maEvent.impression_event({
						event_category: item.event_category,
						event_action: item.event_action,
						event_name: item.event_name,
						event_data: item.event_data,
						module: item.module
					});
					item.observer = true;
					this.observerElements[index].observer = true;
				});
			});
			this.AllSaleData.forEach((item, index) => {
				if(item.observer){
					return true;
				}
				let elementSelector = "#sale-tab-" + index;
				this.$public.observeVisibility(this.observer, elementSelector, () => {
					if(item.observer){
						return false;
					}
					this.$maEvent.impression_event({
						event_category: 'home',
						event_action: 'sale_tag_page',
						event_name: item.type,
						event_data: {
							event_value: item.type
						},
						module: 'home_sale_tag'
					});
					item.observer = true;
					this.AllSaleData[index].observer = true;
				});
			});
			this.redpersonData.media_list && this.redpersonData.media_list.forEach((item, index) => {
				if(item.observer){
					return true;
				}
				let elementSelector = "#redperson-share-item-" + index;
				this.$public.observeVisibility(this.observer, elementSelector, () => {
					if(item.observer){
						return false;
					}
					this.$maEvent.impression_event({
						event_category: 'home',
						event_action: 'media_page',
						event_name: item.name,
						event_data: {
							event_value: item.name
						},
						module: 'home_media'
					});
					item.observer = true;
					this.redpersonData.media_list[index].observer = true;
				});
			});
		},
		async checkRoute(item){
			if(item.type == 'sale') {
				try{
					const blockMsg = await this.getSaleBlockTop()
					const tabMsg = await this.getHomeTabTop()
					const top = blockMsg.top - tabMsg.top
					uni.pageScrollTo(
						{
							scrollTop: top || 600,
							duration: 300
						}
					)
				}catch(err){

				}
				
			}else{
				this.$public.staticBlockJump(item)
			}
		},
		getSaleBlockTop(){
			return new Promise ((resolve,reject)=>{
				uni.createSelectorQuery().select('.sale_block_title').boundingClientRect(res => {
				  	resolve(res);
				}).exec();
		    })
		},
		getHomeTabTop(){
			return new Promise ((resolve,reject)=>{
				uni.createSelectorQuery().select('.home-swiper-banner-box').boundingClientRect(res => {
				  	resolve(res);
				}).exec();
		    })
		},
		// 获取banner价格class
		getBannerPriceClass(price){
			const priceLength = price?.toString().length;
			return `dynamic-price-${priceLength}`
		},
		handleClickRules() {
			if(this.saleRules){
				this.$refs['toast_tip'].showToast()
			} else {
				this.$apis.getSaleRulesBlock().then(res=> {
					this.saleRules = res.data.distribute_share_article || ''
					this.saleRules && this.$refs['toast_tip'].showToast()
				})	
			}
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'sale_rules_tag_button',
				event_name: "rules",
				module: 'home_sale_tag'
			});
		},
		handleCheckCoupons() {
			this.$refs.popupNewcomerCoupon.close();
			setTimeout(()=>{
				this.$public.handleNavTo('/pages/coupon/my-coupons')
			},1)
		},
		//加载首页数据
		loadHomeData(){
			this.getStaticblock();
			this.getSaleProduct();
			this.recommendProduct(true);
			this.getCateGoryList();
			this.getRedpersonData();
			this.getMessageNum();
			this.getPreSaleData()
		},
		// 获取首页特价内容
		getSaleProduct() {
			const that = this;
			this.$apis.getSaleStaticblock({is_need_all: true}).then(res => {
				const { title, dressin_sale } = res.data || {}
				that.priceRangeTitle = title;
				if(dressin_sale && Array.isArray(dressin_sale)) {
					that.AllSaleData = dressin_sale
					const tagsHasProducts = dressin_sale.filter(pI => pI?.products?.length > 0)
					const priceTags = tagsHasProducts.map((i, idx) => ({
						id: idx,
						name: i?.type
					}));
					const initTag = priceTags[0] || {}
					that.setData({
						priceTags,
						priceTag: initTag
					})
					that.setTag('price', initTag)
				}
				this.$nextTick(() => {
					this.startObserver();
				});
			})
		},
		setPriceRangePath() {
			let priceTagName = this.priceTag.name
			if(priceTagName && priceTagName.toString().includes("+")) {
				priceTagName = encodeURIComponent(priceTagName)
			}
			return `/pages/cate/list?type=${this.priceRangeTitle}&tag=${priceTagName}&isPriceRangePart=true`
		},
		toSaleProduct(item){
			let url = '/pages/goods-detail/index?id=' + item.id;
			if(item.module){
				url +='&module=' + item.module;
			}
			if(item.rec_code){
				url +='&rec_code=' + item.rec_code;
			}
			if(item.rec_engine){
				url +='&rec_engine=' + item.rec_engine;
			}
			if(item.ab_key){
				url +='&ab_key=' + item.ab_key;
			}
			this.$public.handleNavTo(url);
			this.selectItem(item);
		},
		// 获取静态块
		getStaticblock() {
			this.$apis.getStaticblock({identify:'app-home-top-text,app-home-top-banner,app-home-coupon-discount,app-home-styles,app-home-point-and-vip,app-home-trending,app-unicoeye-about-us,app-unicoeye-series,app-unicoeye-replacement,app-pre-sale-banner'}).then(res=>{
				var data = res.data || {};
				var filterData = Object.fromEntries(
					Object.entries(data).filter(([key, value]) => value !== null && value !== '')
				);
				this.staticblock = {...this.staticblock,...filterData}
				this.$nextTick(()=>{
					this.sendBannerObserver(0);
				})
			})
		},
		// 获取优惠券列表
		getCouponList(){
			this.$apis.getProductCouponList().then(res => {
				this.couponList = res.data.coupons || [];
				uni.hideLoading();
			})
		},
		// 获取推荐列表
		recommendProduct(type) {
			if(type) {
				this.goodsHasNext = true;
				this.goodsPage = 0;
				this.goodsLoading = false;
			}
			if(!this.goodsHasNext || this.goodsLoading) {
				return false;
			}
			const params = {
				type: 'home_rec',
				page_num: ++this.goodsPage,
				size: 30
			}
			this.goodsLoading = true;
			this.$apis.recommendProduct(params).then(res => {
				this.goodsLoading = false;
				if(res.data.products) {
					const list = res.data.products || [];
					this.goods = this.goodsPage == 1 ? list : this.goods.concat(list);
					uni.stopPullDownRefresh();
					if(list.length < 30) {
						this.goodsHasNext = false;
					}
				} else {
					this.goodsHasNext = false;
				}
			})
		},
		// 获取预售PRE-SALE产品列表
		getPreSaleData() {
			const that = this
			that.$apis.getPreSaleProducts().then(res => {
				const { code, data } = res || {}
				if(code == 200) {
					const { products } = data
					this.preSaleData = products
				}
			})
		},
        scrollToTop() {
            const selectorQuery = uni.createSelectorQuery().in(this)
            selectorQuery.select('#box').boundingClientRect(data=>{
                //超过150开始展示回到顶部  
                if(Math.abs(data.top)> 150) {
                    this.showBtn = true
                } else{ 
                    this.showBtn = false
                }
            }).exec()  
        },
		bannerClick(item, index){
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'top_banner_button',
				event_name: 'top_banner_button',
				module: 'home_top_banner',
				event_data: {
					location: index + 1,
					image_url: item.image,
					banner_link: item.route
				},
			});
			this.$trackEvent.banner_click(index + 1, {
				image: item.image,
				route: item.route
			});
		},
        handleOpenPopup() {
            this.$refs['popupLeft'] && this.$refs['popupLeft'].$refs['popup'] && this.$refs['popupLeft'].$refs['popup'].open()
        },
        getImgPathFunc(path){
            const pixelRatio = uni.getSystemInfoSync().pixelRatio
            const imageName = pixelRatio >= 2 ? '@2x.png' : '.png'; 
            return `${path}${imageName}`
        },
        handleToSearch(){
            this.$public.handleNavTo('/pages/search/search')
        },
		// 跳转分类页
        toCategory(id){
			this.$store.commit('SET_CATEGORYSHOWID', id);
            uni.switchTab({
            	url: '/pages/cate/index'
            });
        },
		// 获取分类信息
		getCateGoryList() {
			const that = this;
			that.$apis.initCate().then(res =>{
				uni.hideLoading()
				if(res.code == 200) {
					let { categories, categoriesHome, categoriesHomeColor, categorieslist } = res.data;
					that.setData({
						categories,
						categoriesHome: categoriesHome,
						colorTags: categoriesHomeColor,
						colorTag: categoriesHomeColor[0]
					});
					this.setTag('color', this.colorTag);
					this.$nextTick(()=>{
						this.startNavObserver();
					})
				}
			}).catch(err =>{
				uni.hideLoading()
			})   
		},
		// 设置滚动条滚动距离
		setSwiperLine(e) {
			uni.createSelectorQuery().select('.swiper-shop-line-box').boundingClientRect((scrollBar) => {
				uni.createSelectorQuery().select('.swiper-shop-line').boundingClientRect((scrollBarLine) => {
					let scrollBarwidth = scrollBar.width - scrollBarLine.width; // 滚动条总长度 - 滚动条长度 = 滚动条可滚长度
					uni.createSelectorQuery().select('.active-sale-item-box .swiper-shop').boundingClientRect((res) => {
						let left = ((e.detail.scrollLeft) / (e.detail.scrollWidth - res.width)) * scrollBarwidth;
						this.lineLeft = left + 'px';
					}).exec();
				}).exec();
			}).exec();
			// if(this.startObserverFlag){
			// 	return false;
			// }
			// this.startObserverFlag = true;
			// setTimeout(() => {
			// 	this.startObserver();
			// 	this.startObserverFlag = false;
			// }, 100);
		},
		// 获取红人数据
		getRedpersonData() {
			this.$apis.getRedperson().then(res => {
				this.redpersonData = res.data.red_person_img;
				// this.$nextTick(() => {
				// 	this.startRedpersonObserver();
				// });
			})
		},
		// 跳转主页
        toPage(url){
            //#ifdef APP-PLUS
            plus.runtime.openURL(
				url, 
                function(err) {  
                    console.log(err);  
                }
            ); 
            //#endif
            // #ifdef H5
				window.open(url);
			// #endif
        },
		redpersonDataMediaClick(item){
			this.toPage(item.media_url);
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'media_button',
				event_name: item.name,
				event_data: {
					event_value: item.name
				},
				module: 'home_media'
			});
		},
        toDetailsTap(item){
			let url = '/pages/goods-detail/index?id=' + item.product_id;
			if(item.rec_code){
				url +='&rec_code=' + item.rec_code;
			}
			if(item.rec_engine){
				url +='&rec_engine=' + item.rec_engine;
			}
			if(item.module){
				url +='&module=' + item.module;
			}
			if(item.ab_key){
				url +='&ab_key=' + item.ab_key;
			}
			this.$public.handleNavTo(url);
			this.selectItem(item);
        },
		selectItem(item){
			let trackData = {
				item_list_id: 'home',
				item_list_name: 'home',
				items: [{
					item_id: item.sku,
					item_name: item.name
				}]
			}
			this.$trackEvent.select_item(trackData);
		},
		getMessageNum() {
			const that = this;
			that.$apis.messageGetHasNotRead().then(res=> {
				that.setData({
					isShowMessageIcon: res.data.has_message_need_to_read == 1
				})
			});
		},
		handleDialog(){
			if(this.serviceScriptUrl){
				chatPlugin.openTidioChat(this.serviceScriptUrl);
			}
		},
		handleCeckWebView() {
			if (this.serviceWebviewSrc) {
				uni.navigateTo({
					url:"/pages/contact/web"
				})
			}
		},
		// 调用子组件,展示footer-tip组件
		showFooterTips(type) {
			this.$refs.footer_tip.showFooterTip(type);
		},
		setTag(type, tag) {
			if(type == 'color') {
				const colorTag = this.colorGoodsStorage[tag.id];
				if(colorTag) {
					this.colorTag = tag
					this.goodsSortByColor = colorTag
					return
				}
				if(this.isAllowedToLoadColorData) {
					this.isAllowedToLoadColorData = false
					const params = {
						categoryId: tag.id,
						p: 1,
						price: "",
						sort: "",				
						v: '1.0'
					}
					this.$apis.queryCatelist(params).then(res=> {
						if(res.code === 200) {
							const { products } = res.data || {}
							const filter_products = products.filter(i=>i.item_type !== 'banner')
							this.goodsSortByColor = filter_products
							this.colorGoodsStorage[tag.id] = filter_products
							this.colorTag = tag
						}
					}).catch(err => {
						// console.log(err);
					}).finally(() => {
						this.isAllowedToLoadColorData = true
						this.colorTag = tag
					})
				}
			}
			if(type == 'price') {
				const { products, end_time } = this.AllSaleData.find(i => i.type == tag.name || i.label == tag.name) || {}
				this.priceRangeList = products?.length ? products : [],
				this.showStockRemaining = Boolean(end_time)  // 存在end_time商品的显示秒杀条
				setTimeout(() => {
					this.startObserver();
				}, 200);
				this.$maEvent.custom_event({
					event_category: 'home',
					event_action: 'sale_tag_button',
					event_name: tag.name,
					event_data: {
						event_value: tag.name
					},
					module: 'home_sale_tag'
				});
				this.priceTag = tag
			}
		},
		setDotNum(listLen, picsNumInOneScreen = 1.3) {
			const dotNum = Math.ceil(listLen / picsNumInOneScreen)
			return dotNum == 1 ? 0 : dotNum
		},
		// 导航栏曝光
		startNavObserver() {	
			if(this.categoriesHome.length == 0){
				return;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			if(this.observer){
				this.categoriesHome.forEach((item, index) => {
					if(!item.observer){
						const elementSelector = "#navItems" + item.id;
						this.$public.observeVisibility(this.observer, elementSelector, () => {
							this.handleVisibilityChange(item, index);
						});
					}
				});
			}
		},
		handleVisibilityChange(item, index) {
			if(item.observer){
				return false;
			}
			this.categoriesHome[index].observer = true;
			item.observer = true;
			// 记录曝光数据或进行其他操作
			this.$maEvent.impression_event({
				event_category: 'home',
				event_action: 'navigation_page',
				event_name: 'navigation_page',
				event_data: {
					event_value: item.name
				},
				module: 'home_navigation'
			});
		},
		// banner曝光
		startBannerObserver(detailData) {
			const ind = detailData.detail.current;
			const selectorQuery = uni.createSelectorQuery().in(this)
			selectorQuery.select('#box').boundingClientRect(data=>{
				if(Math.abs(data.top) < 130 && !this.staticblock['app-home-top-banner'].data[ind].observer) {
					this.sendBannerObserver(ind); // 当前在banner轮播区域,曝光埋点
				}
			}).exec()
		},
		// 发起banner曝光埋点请求
		sendBannerObserver(ind) {
			this.$maEvent.impression_event({
				event_category: 'home',
				event_action: 'top_banner_page',
				event_name: 'top_banner_page',
				event_data: {
					image_url: this.staticblock['app-home-top-banner'].data[ind].image,
					banner_link: this.staticblock['app-home-top-banner'].data[ind].route
				},
				module: 'home_top_banner'
			});
			this.staticblock['app-home-top-banner'].data[ind].observer = true;
		},
    }
}

</script>
<style lang="scss" scoped>
@import './index.scss'
</style>
