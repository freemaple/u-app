<template>
    <view id="box">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<view class="fixed-header page-max-width">
			<view class="top_search_header flex justify-content-between align-items-center">
				<view class="fake_input flex justify-content-between align-items-center ma-search-box" @tap="handleToSearch">
					<view class="search_placeholder">{{ $t('category.search_by_di', {site_name: $store.state.site_name_upper}) }}</view>
					<view class="search_icon">
						<image
							class="img"
							:src="getImgPathFunc('/static/images/category_top_search')"
							mode="aspectFill"
						/>
					</view>
				</view>
				<view style="position: relative;" class="sign_in_icon is_message_icon" @tap="navBuriedPoint('message');$public.handleNavTo('/pages/message/message')">
					<image
						class="img"
						src="@/static/images/icon/message3.png"
						mode="aspectFill"
					/>
					<view class="message-icon" v-show="isShowMessageIcon"></view>
				</view>
				<view class="sign_in_icon" @tap="handleCheckIn">
					<image
						class="img"
						:src="getImgPathFunc('/static/images/category_sign_in')"
						mode="aspectFill"
					/>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="sign_in_icon" v-if="serviceWebviewSrc" @tap="handleCeckWebView">
					<i class="iconfont2 iconfont3 icon-customerservice" style="color:#333;"></i>
				</view>
                <!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="sign_in_icon" @tap="handleDialog">
					<i class="iconfont2 iconfont3 icon-customerservice" style="color:#333;"></i>
				</view>
                <!-- #endif -->
			</view>
			<view class="home-tabs-box flex justify-content-between">
				<scroll-view scroll-x="true" class="home-tabs-scroll-view" show-scrollbar="false">
					<view class="flex" style="flex-wrap: nowrap;">
						<!-- <view id="navItemsAll" class="home-tabs-item active flex" :class="categories.length == 1 ? 'item-half' : ''" @click="toCategory(-1,'ALL')">
							<view class="home-tabs-item-content">
								{{$t('category.all')}}
							</view>
						</view> -->
						<view :id="'navItems' + item.id" :class="'home-tabs-item flex ' + (categories.length == 3 ? ' home-tabs-item-double ' : '') + (index == 0 ? ' active' : '') + (categories.length == 2 ? ' item-half ' : '')"  @click="toCategory(item.id,item.name)" v-for="(item,index) in categories" :key="item.id">
							<view class="home-tabs-item-content">
								{{item.name}}
							</view>
						</view>
					</view>
				</scroll-view>    
			</view>				
		</view>
        <view :class="'global-top-btn flex align-items-center justify-content-center '+ (!showBtn?'global-btn-none':'')" @click="backTop">
            <image class="img"
                src="~/static/images/icon/back_top_icon@2x.png"
            />
        </view>
        <view class="container">
			<!-- 首页轮播 图片比例 750:400-->
			<view class="home-swiper-banner-box" v-if="staticblock['app-home-top-banner'].data">
				<swiper style="height:400rpx" class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000"
					:duration="500" indicator-active-color="#999" indicator-color="#000" @change="startBannerObserver">
					<swiper-item v-for="(item,index) in staticblock['app-home-top-banner'].data" :key="index" :id="'bannerItems' + index">
						<view class="swiper-item" @click="checkRoute(item);bannerClick(item,index)">
							<image v-if="item.inviter_money" :src="item.image_new" mode="widthFix" style="width: 100%;"></image>
							<image v-else :src="item.image" mode="widthFix" style="width: 100%;"></image>
							<view class="dynamic-price" :class="[
								getBannerPriceClass(item.inviter_money)
							]" v-if="item.inviter_money">
								<text class="dynamic-price-get">{{$t('cashgrab_rewards.get')}}</text>
								<text class="dynamic-price-unit">{{item.symbol || '$'}}</text>
								<text class="dynamic-price-number">{{ item.inviter_money }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 首页轮播顶部文字 -->
			<view class="home-top-text-box flex" v-if="staticblock['app-home-top-text'].data">
				<view :id="'topTextItems' + index" class="text-item" v-for="(item,index) in staticblock['app-home-top-text'].data" :key="index" @click="textBuriedPoint(item);$public.staticBlockJump(item)">
					<view class="text-item-txt">{{item.text}}</view>
					<image class="text-item-img" :src="item.imgUrl" />
				</view>
			</view>
			<!-- 首页优惠券banner -->
			<view class="static-banner-box mt-24" v-if="staticblock['app-home-coupon-discount'].data">
				<image v-for="(item,index) in staticblock['app-home-coupon-discount'].data" @click="$public.staticBlockJump(item)" mode="widthFix" :src="item.image" :key="index" alt=""/>
			</view>
			<!-- 首页8个styles -->
			<view class="home-styles-box" v-if="staticblock['app-home-styles'].data">
				<view class="home-styles-title">{{staticblock['app-home-styles'].title}}</view>
				<view class="styles-box">
					<view @click="styleBuriedPoint(item,index);$public.staticBlockJump(item)" :id="'stylesItems' + index" class="style-item" v-for="(item,index) in staticblock['app-home-styles'].data" :key="index">
						<view class="style-img-box">
							<!-- 268:357 -->
							<image style="width: 100%;" mode="widthFix" :src="item.image" />
						</view>
						<view class="title text-overflow-ellipsis" v-if="item.text">{{item.text}}</view>
					</view>
				</view>
			</view>
			<!-- 特价产品 -->
			<view class="position-relative" v-if="saleData&&saleData.length">
				<view class="home-styles-title sale_block_title" v-if="saleData&&saleData.length">{{saleDataTitle}}</view>
				<view class="sale_rules_wrapper flex no-wrap align-items-center" id="sale_rules_btn" @tap="handleClickRules">
					<text class="text_underline">{{$t('lower_price.rules')}}</text>
					<view class="sale_rules_image_box">
						<image src="~/static/images/fission_sharing/prompt.png" style="width: 100%;" mode="widthFix" />
					</view>
				</view>
			</view>
			
			<view class="sale-product-box" v-if="saleData&&saleData.length">
				<view class="sale-tab-box flex font-bold" v-show="showMore">
					<view @click="saleCurrentIndex = index;lineLeft=0;selectSaleTab(item, index)" class="sale-tab" :id="`sale-tab-${index}`" :class="saleCurrentIndex == index?'on':''" v-for="(item,index) in saleData" :key="index">
						{{item.symbol}}{{item.label}}
					</view>
				</view>
				<view class="sale-content-box">
					<block v-for="(item,index) in saleData" :key="index">
						<view class="sale-item-box" :class="saleCurrentIndex == index ? 'active-sale-item-box' : ''" :key="index" v-show="saleCurrentIndex == index">
							<view class="sale-list-box">
								<scroll-view scroll-x="true" @scroll="setSwiperLine" show-scrollbar="false">
									<view :class="['flex swiper-shop', showMore ? 'swiper-shop-show-more' : '']" :style="item.products.length > 4 && showMore ? swiperShopStyle : ''">
										<view class="swiper-shop-item position-relative" v-for="(p_item,p_index) in item.products" @click="toSaleProduct(p_item, p_index)" :key="p_index" :id="'saleTtemBox-' + p_item.id">
											<view class="image-box">
												<image :src="p_item.image" style="width: 100%;" mode="widthFix" />
											</view>
											<specialOfferDiscountTab :discount="p_item.special_price_off"></specialOfferDiscountTab>
											<saleRemaining v-if="p_item.schedule&&p_item.schedule.is_show == '1'" :percent="p_item.schedule.spu_stock_percent" :remaining_count="p_item.schedule.spu_stock_text"></saleRemaining>
											<view class="p_name text-overflow-ellipsis">{{p_item.name}}</view>
											<view class="s_price flex" v-if="p_item.special_price">
												<view class="s_price_num font-bold">{{p_item.special_price.symbol}}{{p_item.special_price.value}}</view>
												<view class="s_price_val">{{p_item.special_price.symbol}}{{p_item.price.value}}</view>
											</view>
										</view>										
									</view>
								</scroll-view>
							</view>
						</view>
					</block>
					<view class="swiper-shop-line-box" v-show="saleData[saleCurrentIndex].products.length > 4">
						<view class="swiper-shop-line" :style="{'left': lineLeft}"></view>
					</view>
				</view>
			</view>
			<!-- 首页vip 裂变分享banner -->
			<view style="padding: 0;" class="static-banner-box" v-if="staticblock['app-home-point-and-vip'].data">
				<image :id="'pointAndVipItems' + index" v-for="(item,index) in staticblock['app-home-point-and-vip'].data" @click="activeBuriedPoint(item, index);" mode="widthFix" :src="item.image" :key="index" alt=""/>
			</view>
			<!-- 首页TRENDING -->
			<view class="trending-box" v-if="staticblock['app-home-trending'].data">
				<view class="home-styles-title">{{staticblock['app-home-trending'].title}}</view>
				<view class="trending-items">
					<view :id="'trendingItems' + index" @click="trendingTopBuriedPoint(item,index);" class="item" v-for="(item,index) in staticblock['app-home-trending'].data" :key="index">
						<image :src="item.image" style="width: 100%;" mode="widthFix" />
					</view>
				</view>
			</view>
			<!-- 红人图模块 -->
			<view class="redperson-box" v-if="redpersonData.red_person_product_list.length">
				<view class="home-styles-title">{{redpersonData.title}}</view>
				<scroll-view scroll-x="true" show-scrollbar="false" @scroll="redpersonScroll">
					<view class="flex redperson-img">
						<view @tap="toRedpersonDetail(item, ind)" class="redperson-img-item" :id="'redperson-img-item-' + item.product_id" v-for="(item,ind) in redpersonData.red_person_product_list" :key="ind">
							<image :src="item.red_person_image_url" style="width: 100%;" mode="widthFix" />
						</view>										
					</view>
				</scroll-view>
				<view class="flex redperson-share justify-content-between" id="home_media_list">
					<view @click="redpersonDataMediaClick(item)" class="redperson-share-item" :id="`redperson-share-item-${ind}`" v-for="(item,ind) in redpersonData.media_list" :key="ind">
						<image :src="item.media_img_url" style="width: 100%;height: 100%;" mode="widthFix" />
					</view>		
				</view>
			</view>
			
            <view v-if="goods.length" class="goods-container">
				<view class="home-styles-title">
					{{$t('recommend.header1')}}
				</view>
                <!-- 推荐页商品列表 -->
                <good-list ref='goods_list' :module_name="'home_rfy'" :item_list_type="'recommended_product'" :item_list_id="'recommended_product'" :item_list_name="'related_products'"  @popupChange="(value)=>{pageMetaShow=value;$public.isPullDown(!pageMetaShow)}" :goods="goods" :showLoading="goodsHasNext"></good-list>
				<view class="is-over-tip" v-show="!goodsHasNext">
					{{$t('home.lis_over_tip')}}
				</view>
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
		saleRemaining
    },
    data() {
        return {
			pageMetaShow:false,
			// 静态特价数据
			saleSwiperHeight:'470rpx',
			saleData:[],
			saleDataTitle: '',
			//当前显示特价index
			saleCurrentIndex:0,
			// 静态块数据
			staticblock:{
				'app-home-top-text':{},
				'app-home-top-banner':{},
				'app-home-coupon-discount':{},
				'app-home-styles':{},
				'app-home-point-and-vip':{},
				'app-home-trending':{}
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
			
			lineLeft: '0', // 特价商品滚动条距离
			showMore: true,
			swiperShopStyle: {flexFlow: 'column wrap'},
			redpersonData: {
				red_person_product_list: []
			}, // 红人图数据
			isShowMessageIcon: false,
			popupTipType: 1,
			saleRules: '',
			isSearchBoxImpression:false,
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
			module: 'home_rfy'
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
	onTabItemTap(item) {
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
	onUnload(){
		if(this.observer){
			this.observer.disconnect();
			this.observer = null;
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.startSearchBoxObserver();
		})
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
		uni.$emit('appDateLog');
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
			this.startRedpersonObserver();
			this.pageScrollObserver();
		}, 200)
    },
	// 滚动到底部
	onReachBottom(){
		this.recommendProduct();
	},
    //下拉刷新
    onPullDownRefresh() {
		this.loadHomeData();
    },
    methods: {
		handleCheckIn() {
			this.navBuriedPoint('check_in');
			if(this.$store.getters.hasLogin) {
				this.$public.handleNavTo('/pages/my/checkin')
			} else {
				uni.navigateTo({
					 url: '/pages/login/index?in_site_source=check_in'
				});	
			}
		},
		startSearchBoxObserver() {
			if(!this.searchObserver){
				this.searchObserver = this.$public.createIntersectionObserver();
			}
			let elementSelector = ".ma-search-box";
			this.$public.observeVisibility(this.searchObserver, elementSelector, () => {
				if(this.isSearchBoxImpression){
					return false;
				}
				this.isSearchBoxImpression = true;
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_box_page',
					event_name: 'home',
					module: 'search_box',
					event_data: {
						page_in: 'home'
					}
				})
			});
		},
		// 开始观察产品曝光
		startObserver() {
			if(this.saleData.length == 0){
				return false;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			this.saleData.forEach((item, s_index) => {
				if(item.products){
					item.products.forEach((p_item, p_index) => {
						if(!p_item.observer){
							let elementSelector = '#saleTtemBox-' + p_item.id;
							this.$public.observeVisibility(this.observer, elementSelector, () => {
								if(p_item.observer){
									return false;
								}
								this.saleProductImpression(p_item, p_index);
							});
						}
					})
				}
			});
		},
		saleProductImpression(p_item, p_index){
			if(p_item.observer){
				return false;
			}
			if(!p_item.module){
				p_item.module = 'home_ds';
			}
			this.$trackEvent.impression_product_item(p_item, p_index);
			p_item.observer = true;
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
						this.redpersonProductImpression(p_item, p_index);
					});
				}
			})
		},
		//红人产品曝光
		redpersonProductImpression(p_item, p_index){
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
		},
		redpersonScroll(){ 
			if(this.redpersonScrollObserver){
				return false;
			}
			this.redpersonScrollObserver = false;
			setTimeout(() => {
				this.startRedpersonObserver();
				this.redpersonScrollObserver = false;
			}, 100);
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
			this.saleData.forEach((item, index) => {
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
					this.saleData[index].observer = true;
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
			if(JSON.stringify(this.staticblock['app-home-top-banner']) != '{}') {
				this.staticblock['app-home-top-text'].data.length && this.startTopTextObserver();
				this.staticblock['app-home-styles'].data.length && this.startStyleObserver();
				this.staticblock['app-home-point-and-vip'].data.length && this.startPointAndVipObserver();
				this.staticblock['app-home-trending'].data.length && this.startTrendingObserver();
			}
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
				item.module = 'home_top_banner';
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
		},
		// 获取首页特价内容
		getSaleProduct() {
			this.saleData = [];
			let saleData = [];
			this.$apis.getSaleStaticblock({is_need_all: true}).then(res=>{
				this.saleDataTitle = res.data.title;
				res.data.dressin_sale.map(item=>{
					if(item.products&&item.products.length) {
						saleData.push(item)
					}
				});
				this.saleData = saleData;
				this.$nextTick(() => {
					this.startObserver();
				});
			})
		},
		toSaleProduct(item, index){
			let url = '/pages/goods-detail/index?id=' + item.id;
			if(!item.module){
				item.module = 'home_ds';
			}
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
			url +='&goods_location=' + (index + 1);
			this.$public.handleNavTo(url);
			this.selectItem(item);
			this.saleProductImpression(item, index);
			let product_track_data = item;
			this.$maEvent.product_click(product_track_data, index);
		},
		selectSaleTab(item, index){
			setTimeout(() => {
				this.startObserver();
			}, 200);
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'sale_tag_button',
				event_name: item.type,
				event_data: {
					event_value: item.type
				},
				module: 'home_sale_tag'
			});
		},
		// 获取静态块
		getStaticblock() {
			this.$apis.getStaticblock({identify:'app-home-top-text,app-home-top-banner,app-home-coupon-discount,app-home-styles,app-home-point-and-vip,app-home-trending'}).then(res=>{
				var data = res.data || {};
				var filterData = Object.fromEntries(
					Object.entries(data).filter(([key, value]) => value !== null && value !== '')
				);
				this.staticblock = {...this.staticblock,...filterData};
				this.$nextTick(()=>{
					this.sendBannerObserver(0);
					this.startTopTextObserver();
					this.startStyleObserver();
					this.startPointAndVipObserver();
					this.startTrendingObserver();
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
        backTop() {
			this.$maEvent.custom_event({
				event_category: 'to_top',
				event_action: 'to_top_button',
				event_name: 'to_top_button',
				module: 'to_top',
				event_data: {}
			});
            uni.pageScrollTo({
				scrollTop: 0,
				duration: 100
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
            this.$public.handleNavTo('/pages/search/search');
			this.$maEvent.custom_event({
				event_category: 'search',
				event_action: 'search_box_button',
				event_name: 'home',
				module: 'search_box',
				event_data: {
					page_in: 'home'
				}
			})
        },
		// 跳转分类页
        toCategory(id,name){
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'navigation_button',
				event_name: 'navigation_button',
				module: 'home_navigation',
				event_data: {
					event_value: name
				},
			});
			if(id != 'ALL') {
				this.$store.commit('SET_CATEGORYSHOWID', id);
				uni.switchTab({
					url: '/pages/cate/index'
				});				
			}
        },
		// 获取分类信息
		getCateGoryList() {
			const that = this;
			that.$apis.initCate().then(res =>{
				uni.hideLoading()
				if(res.code == 200) {
					const { categories } = res.data;
					categories.unshift({id: this.$t('category.all'), name: this.$t('category.all')});
					that.setData({
						categories
					}); 
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
			if(this.startObserverFlag){
				return false;
			}
			this.startObserverFlag = true;
			setTimeout(() => {
				this.startObserver();
				this.startObserverFlag = false;
			}, 100);
		},
		// 获取红人数据
		getRedpersonData() {
			this.$apis.getRedperson().then(res => {
				this.redpersonData = res.data.red_person_img;
				this.$nextTick(() => {
					this.startRedpersonObserver();
				});
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
		toRedpersonDetail(item, index){
			this.toDetailsTap(item, index);
			this.redpersonProductImpression(item, index);
		},
        toDetailsTap(item, index){
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
			url +='&goods_location=' + (index + 1);
			this.$public.handleNavTo(url);
			this.selectItem(item);
			let product_track_data = item;
			this.$maEvent.product_click(product_track_data, index);
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
		showSaleMore(item){
			if(!item){
				let saleItem = this.saleData[this.saleCurrentIndex];
				item = saleItem;
			}
			this.$public.handleNavTo('/pages/search/search?saleProduct='+encodeURIComponent(JSON.stringify({type:item.type,is_all:'all'})));
		},
		handleDialog(){
			// this.navBuriedPoint('contact');
			if(this.serviceScriptUrl){
				chatPlugin.openTidioChat(this.serviceScriptUrl);
			}
		},
		handleCeckWebView() {
			this.navBuriedPoint('contact');
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
		// 顶部签到/客服/消息中心按钮埋点
		navBuriedPoint(type) {
			const eventData = {
				event_value: type
			}
			if(type == 'check_in') {
				eventData.checkin_type = 'home'
			}
			this.$maEvent.custom_event({
				event_category: 'menu_box',
				event_action: 'menu_box_button',
				event_name: 'menu_box_button',
				module: 'menu_box',
				event_data: eventData
			});
		},
		// 顶部的文字埋点
		textBuriedPoint(item) {
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'top_text_botton',
				event_name: 'top_text_botton',
				module: 'home_top_text',
				event_data: {
					event_value: item.name
				}
			});
		},
		// style埋点
		styleBuriedPoint(item,index) {
			if(!item.module){
				item.module = "home_styles";
			}
			this.$public.staticBlockJump(item);
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'styles_button',
				event_name: 'styles_button',
				module: 'home_styles',
				event_data: {
					event_value: item.name,
					location: index + 1,
					image_url: item.image,
					banner_link: item.route
				}
			});
		},
		// 主题活动埋点
		activeBuriedPoint(item) {
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'activity_button',
				event_name: 'activity_button',
				module: 'home_activity',
				event_data: {
					image_url: item.image,
					banner_link: item.route
				}
			});
			if(!item.module){
				item.module = 'home_activity';
			}
			this.$public.staticBlockJump(item);
		},
		// trending活动埋点
		trendingTopBuriedPoint(item,index) {
			this.$maEvent.custom_event({
				event_category: 'home',
				event_action: 'trending_button',
				event_name: 'trending_button',
				module: 'home_trending',
				event_data: {
					location: index + 1,
					image_url: item.image,
					banner_link: item.route
				}
			});
			if(!item.module){
				item.module = 'home_trending';
			}
			this.$public.staticBlockJump(item);
		},
		// 导航栏曝光
		startNavObserver() {	
			if(this.categories.length == 0){
				return;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			if(this.observer){
				this.categories.forEach((item, index) => {
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
			this.categories[index].observer = true;
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
		// 顶部文字曝光
		startTopTextObserver() {
			if(this.staticblock['app-home-top-text'].data.length == 0){
				return;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			if(this.observer){
				this.staticblock['app-home-top-text'].data.forEach((item, index) => {
					if(!item.observer){
						const elementSelector = "#topTextItems" + index;
						this.$public.observeVisibility(this.observer, elementSelector, () => {
							if(item.observer){
								return false;
							}
							this.staticblock['app-home-top-text'].data[index].observer = true;
							item.observer = true;
							// 记录曝光数据或进行其他操作
							this.$maEvent.impression_event({
								event_category: 'home',
								event_action: 'top_text_page',
								event_name: 'top_text_page',
								event_data: {
									event_value: item.name
								},
								module: 'home_top_text'
							});
						});
					}
				});
			}
		},
    	// style曝光
    	startStyleObserver() {
    		if(this.staticblock['app-home-styles'].data.length == 0){
    			return;
    		}
    		if(!this.observe){
    			this.observer = this.$public.createIntersectionObserver();
    		}
    		if(this.observer){
    			this.staticblock['app-home-styles'].data.forEach((item, index) => {
    				if(!item.observer){
    					const elementSelector = "#stylesItems" + index;
    					this.$public.observeVisibility(this.observer, elementSelector, () => {
    						if(item.observer){
    							return false;
    						}
    						this.staticblock['app-home-styles'].data[index].observer = true;
    						item.observer = true;
    						// 记录曝光数据或进行其他操作
    						this.$maEvent.impression_event({
    							event_category: 'home',
    							event_action: 'styles_page',
    							event_name: 'styles_page',
    							event_data: {
									location: index + 1,
									event_value: item.name,
    								image_url: item.image,
    								banner_link: item.route
    							},
    							module: 'home_styles'
    						});
    					});
    				}
    			});
    		}
    	},
		// 主题活动曝光
    	startPointAndVipObserver() {
    		if(this.staticblock['app-home-point-and-vip'].data.length == 0){
    			return;
    		}
    		if(!this.observer){
    			this.observer = this.$public.createIntersectionObserver();
    		}
    		if(this.observer){
    			this.staticblock['app-home-point-and-vip'].data.forEach((item, index) => {
    				if(!item.observer){
    					const elementSelector = "#pointAndVipItems" + index;
    					this.$public.observeVisibility(this.observer, elementSelector, () => {
    						if(item.observer){
    							return false;
    						}
    						this.staticblock['app-home-point-and-vip'].data[index].observer = true;
    						item.observer = true;
    						// 记录曝光数据或进行其他操作
    						this.$maEvent.impression_event({
    							event_category: 'home',
    							event_action: 'activity_page',
    							event_name: 'activity_page',
    							event_data: {
    								image_url: item.image,
    								banner_link: item.route
    							},
    							module: 'home_activity'
    						});
    					});
    				}
    			});
    		}
    	},
    	// trending 曝光
    	startTrendingObserver() {
    		if(this.staticblock['app-home-trending'].data.length == 0){
    			return;
    		}
    		if(!this.observer){
    			this.observer = this.$public.createIntersectionObserver();
    		}
    		if(this.observer){
    			this.staticblock['app-home-trending'].data.forEach((item, index) => {
    				if(!item.observer){
    					const elementSelector = "#trendingItems" + index;
    					this.$public.observeVisibility(this.observer, elementSelector, () => {
    						if(item.observer){
    							return false;
    						}
    						this.staticblock['app-home-trending'].data[index].observer = true;
    						item.observer = true;
    						// 记录曝光数据或进行其他操作
    						this.$maEvent.impression_event({
    							event_category: 'home',
    							event_action: 'trending_page',
    							event_name: 'trending_page',
    							event_data: {
									location: index + 1,
    								image_url: item.image,
    								banner_link: item.route
    							},
    							module: 'home_trending'
    						});
    					});
    				}
    			});
    		}
    	},
    },
	
}

</script>
<style lang="scss" scoped>
/**index.wxss**/
.special_toast_tip_box{
/deep/.popup-content{
	width: 646rpx!important;
	padding: 34.62rpx 38.46rpx 38.46rpx;
}
}
/deep/.dressin_sale_tips{
	text-align: left;
	font-weight: 400;
	font-size: 31rpx;
	color: #333333;
	line-height: 46rpx;
	
	.img{
		width: 30.77rpx;
		height: 30.77rpx;
		flex-shrink: 0;
		margin-top: 8rpx;
	}
	.text{
		margin-left: 17.31rpx;
		line-height: 46rpx;
	}
}
.sale_rules_wrapper{
	position: absolute;
	right: 30.77rpx;
	top: 0;
	.text_underline{
		font-size: 27rpx;
		color: #333333;
		text-decoration: underline;
	}
}
.sale_rules_image_box{
	width: 46.15rpx;
	height: 46.15rpx;
}
page {
    background: #f2f2f2;
}
#box{
    margin-top: 166rpx;
}
.btn {
    display: block;
    width: 100%;
    height: 200rpx;
    background-color: pink;
}
.fixed-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 99;
}
.container {
    position: relative;
    box-sizing: border-box;
    scroll-behavior: smooth;
    background-color: #fff;

    .global-top-img {
        position: fixed;
        right: 0;
        bottom: 100rpx;
        z-index: 11;

        img {
            width: 58rpx;
            height: 58rpx;
        }

    }
}


.scrollTop {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    z-index: 99999;
    width: 100%;
    height: 130rpx;
    background-color: #fff;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}

.scrollTop image {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
    margin-top: 46rpx;
}

.iphneTop {
    height: 180rpx;
}

.iphneTop image {
    width: 80rpx;
    height: 80rpx;
    margin-top: 80rpx;
}

.swiper-container .swiper_box {
    margin-top: 80rpx;
    margin-bottom: 80rpx;
    width: 750rpx;
    height: 400rpx;
    border-bottom-right-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    overflow: hidden;
}

.swiper-container .slide-image {
    width: 750rpx;
    height: 750rpx;
}

.swiper-container .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    top: 680rpx;
    height: 10rpx;
}

.swiper-container .dots .dot {
    margin: 0 5rpx;
    width: 12rpx;
    height: 8rpx;
    background: #fff;
    border-radius: 20rpx;
    transition: all 0.6s;
    opacity: 0.5;
}

.swiper-container .dots .dot.active {
    width: 22rpx;
    opacity: 1;
}

.index-menu-bg {
    position: relative;
    box-sizing: border-box;
    width: 750rpx;
    height: 391.04rpx;
    padding: 0 8rpx 32rpx 8rpx;
}

.index-menu .menu-list {
    width: 177.5rpx;
    height: 100%;
    text-align: center;
}

.index-menu .menu-list image {
    height: 80rpx;
    width: 80rpx;
    display: inline-block;
}

.index-menu-bg .index-adv image {
    width: 100%;
    height: 178rpx;
}

.index-menu .menu-list .text {
    font-size: 28rpx;
    color: #333333;
}

.index-hot {
    width: 100%;
    height: 359.04rpx;
    background-color: #fff;
}

.index-hot .hot-item {
    width: 25%;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 28rpx 24rpx 28rpx;

}

.item-text {
    text-align: center;
    color: #333;
    font-size: 24rpx;
    display: block;
    width: 100%;
    margin-top: 8rpx;
}

.index-hot .hot-item image {
    width: 127rpx;
    height: 127rpx;
    ;
    border-radius: 50%;
}

.customer-banner {
    width: 750rpx;
    height: 212rpx;
    background-color: #fff;
}

.customer-banner>.banner-img {
    width: calc(100% - 58rpx);
    margin-left: 29rpx;
    height: 180rpx;
    box-sizing: border-box;
}

.category-container {
    width: 750rpx;
    height: 465rpx;
    background-color: #fff;

}

.category-inner {
    box-sizing: border-box;
    padding: 0 24rpx;
    width: 100%;
    height: 100%;
    padding-top: 16rpx;
}

.good-list {
    width: 100%;
    height: 193rpx;
    display: flex;
    justify-content: center;

}

.good-item {
    width: 185rpx;
    height: 193rpx;
    display: flex;
    align-items: center;
    flex-direction: column;

}

.good-item>.img {
    margin-top: 16rpx;
    margin-bottom: 16rpx;
    width: 128rpx;
    height: 128rpx;
}

.good-item-text {
    height: 33.59rpx;
    font-size: 24rpx;
    width: 100%;
    text-align: center;
    line-height: 33.59rpx;
}

.separating-banner {
    width: 100%;
    height: 224rpx;

    background-image: url('~@/static/images/buy_now_shoes.png');
}

.banner-msgs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: rgb(214, 91, 71);
    box-sizing: border-box;
    padding: 0 32rpx;

    .discount-off {
        width: 638rpx;
        margin-top: 40rpx;
        height: 36.4rpx;
        line-height: 36.4rpx;
        font-size: 26rpx;
    }

    .discount-good {
        font-size: 36rpx;
        font-weight: 700;
    }

    .buy-it {
        margin-top: 24rpx;
        width: 123rpx;
        height: 40rpx;
        background-color: #333;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
        line-height: 40rpx;
    }
}

.goods-container {
    width: 100%;
    margin-bottom: 20rpx;
    background: #fff;

    .goods-lists {
        width: 100%;
        box-sizing: border-box;
        padding: 0 15rpx;
        display: flex;
        flex-wrap: wrap;

        .goods-list {
            width: 360rpx;
            height: 495rpx;
            box-sizing: border-box;
            padding: 0 9rpx 18rpx 9rpx;

            >image {
                width: 342rpx;
                height: 389rpx;
                border-radius: 6rpx;
            }
        }
    }
}

.languages-container {
    width: 100%;
    float: left;
    margin-bottom: 20rpx;
    background: #fff;
    padding: 10rpx;
    font-size: 30rpx;
    text-align: center;
}

.goods-container .goods-title {
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    color: #333;
    font-size: 32rpx;
    display: flex;
    justify-content: center;
}

.goods-container .goods-title .text {
    display: inline-block;
    margin-left: 10rpx;
    margin-right: 10rpx;
}

.goods-container .goods-title .line {
    width: 20rpx;
    border-top: 1rpx solid #b4282d;
    margin-top: 45rpx;
    height: 1rpx;
}

.goods-container .goods-title image {
    width: 36rpx;
    height: 36rpx;
    margin-bottom: -6rpx;
    margin-left: 10rpx;
}


.goods-list-title {
    font-size: 30rpx;
    color: #333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.goods-list-text {
    font-size: 24rpx;
    color: #999;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.goods-list-money {
    font-size: 30rpx;
    color: #ab2b2b;
}

.show-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99999999999;
}

.show-container .show-box {
    width: 70%;
    margin: 0 auto;
    height: 600rpx;
    background-color: #fff;
    margin-top: 40%;
    border-radius: 10rpx;
}

.show-logo-box {
    box-sizing: border-box;
    text-align: center;
    width: 80%;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 auto;
    padding-top: 20px;
}

.show-logo-box image {
    box-sizing: border-box;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
}

.show-mall-name {
    font-size: 32rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    color: #333;
}

.show-text-box {
    margin-top: 20rpx;
    margin-bottom: 40rpx;
}

.show-text-name {
    font-size: 30rpx;
    color: #333;
    width: 80%;
    margin: 0 auto;
}

.show-text-info {
    width: 80%;
    margin: 0 auto;
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
}

.show-text-info text {
    margin-right: 10rpx;
    font-size: 26rpx;
}

.show-box button::after {
    border-radius: 4rpx;
    border: 0;
}

.show-box button {
    width: 80%;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 30rpx;
    background-color: #04be01;
    color: #fff;
}

.newcoupons-hover {
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
    width: 150rpx;
    height: 150rpx;
    transition: all 0.6s;
}

.modal-box {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    z-index: 9999999;
}

.modal-body {
    width: 100%;
    height: 100%;
    text-align: center;
}

.modal-content {
    z-index: 999;
    margin-top: 40%;
}

.fenxiang {
    width: 70%;
    border-radius: 4px;
    transition: all 0.6s;
}

.knowBtnImg {
    width: 30px;
    height: 30px;
    display: block;
    margin: auto;
    margin-top: 10px;
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
    padding-left: 30rpx;
    color: #b5272d;
    font-size: 30rpx;
    padding-top: 10rpx;
    display: inline-block;
}
.static-banner-box {
	padding: 0 24rpx;
	margin-top: 32rpx;
	image {
		width: 100%;
		display: block;
	}
}
.static-banner-box.mt-24{
	margin-top: 24rpx;
}
.home-top-text-box {
	flex-wrap: nowrap;
	margin: 32rpx;
	.text-item {
		width: calc(100% / 3);
		margin-right: 16rpx;
		background: #FFEFD9;
		padding: 24rpx 30rpx 24rpx 16rpx;
		position: relative;
		.text-item-img {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		.text-item-txt {
			font-size: 23.08rpx;
			color: #7B4300;
			// font-weight: bold;
			text-wrap: nowrap;
		}
	}
	.text-item:last-child {
		margin-right: 0;
	}
}
.home-styles-title {
	font-size: 30.77rpx;
	color: #000;
	font-weight: bold;
	text-align: center;
	margin: 54rpx 0 20rpx;
	line-height: 38rpx;
}
.home-styles-box {
	padding: 0 24rpx;
	margin-top: 24rpx;
	.styles-box {
		display: flex;
		flex-wrap: wrap;
		.style-item {
			width: calc((100% - 18rpx) / 4);
			margin-right: 6rpx;
			margin-top: 22rpx;
			.style-img-box {
				position: relative;
				padding-bottom: calc(100% * 357 / 268);
				image {
					position: absolute;
					left: 0;
					top: 0;
				}
			}
			.title {
				font-size: 23.08rpx;
				text-align: center;
				margin-top: 16rpx;
				color: #000000;
			}
		}
		.style-item:nth-of-type(4n) {
			margin-right: 0;
		}
		.style-item:nth-child(-n+4) {
			margin-top: 0;
		}
	}
}
.trending-box {
	padding: 0 24rpx;
	margin-top: 24rpx;
	.trending-items {
		.item {
			width: 100%;
		}
		.style-item:nth-of-type(3n) {
			margin-right: 0;
		}
	}
}
.sale-product-box {
	margin-top: 28rpx;
	background: #FFFCF8;
	.sale-tab-box {
		background: #fff;
		flex-wrap: nowrap;
		overflow: auto;
		margin-bottom: 30.77rpx;
		margin-top: 30.77rpx;
		padding-left: 30.77rpx;
		.sale-tab {
			font-size: 28rpx;
			position: relative;
			width: 138rpx;
			height: 62rpx;
			background: #F5F5F5;
			border-radius: 35rpx 35rpx 35rpx 35rpx;
			font-size: 27rpx;
			color: #000000;
			line-height: 62rpx;
			text-align: center;
			margin-right: 15.38rpx;
			&:last-child{
				margin-right: 0;
			}
			.line {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
				width: 1px;
				height: 32rpx;
				background: #ddd;
			}
		}
		.sale-tab.on {
			background: #FFA80A;
			color: #fff;
			.line {
				display: none;
			}
		}
	}
	.sale-tab-box::-webkit-scrollbar {
	  display: none;
	}
	.sale-content-box {
		font-size: 26rpx;
		padding-bottom: 32rpx;
		.sale-item-box {
			.sale-countdown-box {
				padding: 10rpx 32rpx;
				.ends-in {
					font-size: 26.92rpx;
					margin-right: 16rpx;
					font-weight: bold;
					color: #333333;
				}
				.icon-goto {
					color: #000;
				}
				::v-deep .uni-countdown__number{
					font-weight: bold;
					background: #FF005D !important;
					color: #fff !important;
					border-radius: 4rpx;
				}
			}
			.sale-list-box {
				margin-top: 12rpx;
				padding-left: 32rpx;
				.swiper-item {
					padding: 0 8rpx;
					height: 100%;
					.image-box {
						// padding-bottom: calc(100% * 4 / 3);
						// position: relative;
						// image {
						// 	position: absolute;
						// 	top: 0;
						// 	left: 0;
						// }
					}
					.s_price{
						color: #FF005D;
					}
					.price {
						color: #999;
						text-decoration: line-through;
					}
					.p_name {
						padding: 16rpx 0 12rpx;
						font-size: 27rpx;
						color: #333;
						font-weight: 400;
					}
				}
				::v-deep uni-swiper .uni-swiper-dot {
					margin-right: 0;
					border-radius: 0;
				}
			}
		}
	}
}
.home-swiper-banner-box ::v-deep {
	.uni-swiper-dot {
		background: rgba(255,255,255,0.4) !important;
		border: 1px solid rgba(123,67,0,0.6);
		width: 12rpx;
		height: 12rpx;
		box-sizing: border-box;
		margin-right: 12rpx;
	}
	.uni-swiper-dot.uni-swiper-dot-active {
		width: 36rpx;
		border-radius: 16rpx;
		background: rgba(255, 255, 255, 0.8) !important;
		border: 1px solid #7B4300;
	}
	uni-swiper .uni-swiper-dots-horizontal {
		left: auto;
		right: 32rpx;
	}
 .dynamic-price {
  position: absolute;
  font-family: KronaOne;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  letter-spacing: 4rpx;
  margin-bottom: 60rpx;
  &-get {
   font-size: 104rpx;
   color: #000;
   margin-right: 8rpx;
  }
  &-unit {
   font-size: 104rpx;
   color: #fff;
   -webkit-text-stroke: 4rpx #000000;

  }
  &-number {
   font-size: 104rpx;
   color: #fff;
   -webkit-text-stroke: 4rpx #000000;
  }
  &.dynamic-price-1 {
   .dynamic-price-get {
    font-size: 104rpx;
   }
   .dynamic-price-unit {
    font-size: 104rpx;
   }
   .dynamic-price-number {
    font-size: 104rpx;
   }
  }
  &.dynamic-price-2 {
   .dynamic-price-get {
    font-size: 69rpx;
    letter-spacing: normal;
   }
   .dynamic-price-unit {
    font-size: 104rpx;
    letter-spacing: normal;
   }
   .dynamic-price-number {
    font-size: 104rpx;
    letter-spacing: normal;
   }
  }
  &.dynamic-price-3 {
   .dynamic-price-get {
    font-size: 69rpx;
    letter-spacing: normal;
   }
   .dynamic-price-unit {
    font-size: 104rpx;
    letter-spacing: normal;
   }
   .dynamic-price-number {
    font-size: 104rpx;
    letter-spacing: normal;
   }
  }
 }
}
.top_search_header{
    width: 100%;
    height: 92rpx;
    padding: 0 31rpx;
	flex-wrap: nowrap;
	background: #fff;
    .fake_input{
        padding: 0 34.62rpx;
        // width: 615rpx;
		// width: 568.85rpx;
		flex: 1;
        height: 69rpx;
        background: #EEEEEE;
        border-radius: 58rpx 58rpx 58rpx 58rpx;
        .search_placeholder{
            color: #999999;
            font-size: 29.77rpx;
        }
        .search_icon{
            width: 46.15rpx;
            height: 46.15rpx;
            .img{
                width: 46.15rpx;
                height: 46.15rpx;
            }
        }
    }
    .sign_in_icon{
        width: 46.15rpx;
		height: 46.15rpx;
		margin-left: 15rpx;
        .img{
            width: 46.15rpx;
            height: 46.15rpx;
        }
    }
	.is_message_icon {
		width: 46rpx;
		height: 46rpx;
        .img{
			width: 46rpx;
			height: 46rpx;
        }
	}
}
.home-tabs-box {
	background: #fff;
	box-sizing: border-box;
	.home-tabs-item {
		color: #999;
		width: 25%;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		.home-tabs-item-content {
			height: 74rpx;
			box-sizing: border-box;
			padding: 8rpx 10rpx 0;
			font-size: 30.77rpx;
		}
		&.home-tabs-item-double{
			width: calc(100% / 3);
		}
	}
	.item-half {
		width: 50%;
	}
	.home-tabs-item.active .home-tabs-item-content{
		border-bottom: 6rpx solid #000;
		color: #000;
		font-weight: bold;
	}
}
// 特价商品
.swiper-shop {
	flex-wrap: nowrap;
	width: 100%;
	white-space: nowrap;
	.swiper-shop-item {
		width: 304rpx;
		flex-shrink: 0;
		padding-right: 16rpx;
		
		.p_name {
			font-size: 26.92rpx;
			color: #333333;
			padding: 16rpx 0 12rpx;
		}
		.s_price {
			color: #FF005D;
			align-items: center;
			padding-bottom: 16rpx;
			.s_price_num {
				// font-weight: 500;
				font-size: 30.77rpx;
				color: #FF5C00;
			}
			.s_price_val {
				border-radius: 6rpx;
				font-size: 23rpx;
				padding: 0 8rpx;
				margin-left: 10rpx;
				line-height: 28rpx;
				text-decoration: line-through;
				color: #999999;
			}
		}
		.image-box {
			max-height: 396rpx;
		}
	}
}
::v-deep .uni-scroll-view::-webkit-scrollbar {
  display: none;
}
.swiper-shop-show-more {
	flex-wrap: wrap;
	max-height: 1200rpx;
	.swiper-shop-item {
		margin-bottom: 20rpx;
	}
}
.swiper-shop-line-box {
	width: 72rpx;
	height: 4rpx;
	background: #D9D9D9;
	border-radius: 14rpx;
	margin: 0 auto;
	position: relative;
	.swiper-shop-line {
		background: #000;
		width: 24rpx;
		height: 4rpx;
		border-radius: 14rpx;
		position: absolute;
		top: 0;
	}
}
.swiper-shop-more {
	background: #000;
	color: #fff;
	font-size: 26.92rpx;
	width: 384rpx;
	height: 64rpx;
	margin: 0 auto;
	.money {
		margin-left: 10rpx;
	}
	.filter_img {
		width: 36rpx;
		height: 36rpx;
		margin-left: 12rpx;
	}
}
.redperson-img {
	padding-left: 32rpx;
	flex-wrap: nowrap;
	.redperson-img-item {
		width: 288rpx;
		flex-shrink: 0;
		margin-right: 16rpx;
	}
}
.redperson-share {
	margin: 32rpx 32rpx 0;
	.redperson-share-item {
		width: 70rpx;
		height: 70rpx;
	}
}
.is-over-tip {
	text-align: center;
	color: #999;
	padding: 20rpx 0;
	font-size: 26.92rpx;
}
.message-icon {
	position: absolute;
	right: 0;
	top: 6rpx;
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #ff0000;
}
</style>
