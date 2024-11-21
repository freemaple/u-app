<template>
	<view class="dressin-vip-page-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader color="white" :title="$t('vip.page_title', {site_name: $store.state.site_name_upper})" showImg imgSrc="../../static/images/vip/vip_icon.png" :useFlex="true">
			<template v-slot:title>
				<view class="flex align-items-center">
					<image mode="widthFix" src="@/static/images/vip/vip_icon.png" style="width:48rpx"></image>
					<view>{{$t('vip.page_title', {site_name: $store.state.site_name_upper})}}</view>
				</view>
			</template>
		</pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="vip-page-content">
			<view class="vip-card-box">
				<view class="card-box" style="background-image: url(../../static/images/vip/prime_hd_card.png);">
					<view class="card-title flex align-items-center">
						<image mode="widthFix" src="../../static/images/vip/vip_icon.png"></image>
						<view class=" vip-card-title">{{$t('vip.page_title', {site_name: $store.state.site_name_upper})}}</view>
					</view>
					<view class="card-content ">
						<text v-if="isVip">
							{{$t('vip.text_2')}}
						</text>
						<block v-else>
							<text>{{$t('vip.text_3')}}</text>
							<text class="big">{{$t('vip.double_shopping_points')}}</text>
							<text>{{$t('vip.text_4')}}</text>
							<text class="big">{{discount_off}} {{$t('vip.Discount')}}.</text>
						</block>
					</view>
				</view>
			</view>
			<view class="vip-type-choose-box">
				
				<view class="vip-choose-title flex align-items-center justify-content-center">
					<text></text>
					<view class="choose-title">{{$t('vip.choose_way_become_plus', {site_name: $store.state.site_name_upper})}}</view>
					<text></text>
				</view>
				
				<view class="vip-choose-card-box">
					<view :style="!isPurchasePlus && 'flex: 1'" :class="vipType == 1?'card-item active':'card-item'" @click="vipType = 1">
						<view class="card-item-header flex align-items-center justify-content-center">
							<view class="font-bold">{{$t('vip.free_of_charge')}}</view>
							<i class="iconfont icon-question-fill vip-question" @click="$refs.popupFreeTip.open('center')"></i>
							<!-- 试用标识 -->
							<view class="renew-tag">
								<view class="renew-tag__animation"></view>
								<view class="renew-tag__text">{{$t('vip.limited_time')}}</view>
							</view>
						</view>
						<view class="card-item-content font-bold flex align-items-center justify-content-center">
							{{$t('vip.FREE')}}
						</view>
					</view>
					<view v-if="isPurchasePlus" :class="vipType == 2?'card-item active':'card-item'" @click="vipType = 2">
						<view class="card-item-header flex align-items-center justify-content-center">
							<view class="font-bold">{{$t('vip.Annually')}}</view>
						</view>
						<view class="card-item-content font-bold flex align-items-center justify-content-center">
							{{vip_price.symbol}}{{vip_price.value}}
						</view>
					</view>
				</view>
				
				<view class="vip-equity-box">
					<view class="flex justify-content-between align-items-center discount-item equity-item btn-cursor" @click="handleScrollTo('.discount-goods-module-box')">
						<view class="flex justify-content-between align-items-center">
							<i class="iconfont3 icon-my-coupons"></i>
							<view>{{$t('vip.exclusive_deal')}}: {{discount_off}} {{$t('vip.OFF')}}!</view>
						</view>
						<i class="iconfont icon-arrow-r middle"></i>
					</view>
					<view class="flex justify-content-between align-items-center points-item equity-item btn-cursor" @click="handleScrollTo('.double-points-module-box')">
						<view class="flex justify-content-between align-items-center">
							<i class="iconfont3 icon-my-points"></i>
							<view>{{$t('vip.double_shopping_points')}}</view>
						</view>
						<i class="iconfont icon-arrow-r middle"></i>
					</view>
					<view>
						<view v-if="isVip" class="flex align-items-center">
							<text>{{$t('vip.expiration_date')}}: {{expData}} {{$t('vip.days')}}</text><i @tap="handleOpenExpirationModal" class="iconfont icon-question-fill vip-question"></i>
						</view>
						<text v-else>{{$t('vip.valid_time')}}: 365 {{$t('vip.days')}}</text>
					</view>
				</view>
				
				<view class="btnGround-center-box">
					<!-- 同意协议  -->
					<view v-if="vipType == 2" class="agree-box flex align-items-center flex-nowrap" :class="isVip?'is-vip-disabled':''">
						<view class="agree-btn flex" :class="isAgree?'active':''" @click="handleAgree">
							<image mode="widthFix" src="../../static/images/vip/agree-select-icon.png" />
						</view>
						<view class="flex-1">{{$t('vip.I have read and agree the')}}<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-dressin-plus-terms-conditions')" class="text-underline">{{$t('vip.vip_terms_conditions', {site_name: $store.state.site_name_upper})}}</text></view>
					</view>
					<!-- 收费 -->
					<view v-if="vipType == 2" class="fee-submit-btn font-bold" :class="isVip?'disabled':''" @click="handleSumbit">
						{{$t('vip.buy_now')}}({{vip_price.symbol}}{{vip_price.value}})
					</view>
					<!-- 错误提示 -->
					<view class="error-box" v-if="isError">
						{{$t('vip.Please confirm that you have fully read and understood the above terms')}}
					</view>
					<!-- 免费试用 -->
					<view @click="$public.handleNavTo('/pages/distribute/generateurl')" v-if="vipType == 1" class="free-submit-btn flex flex-column align-items-center justify-content-center">
						<view class="font-bold">
							<text v-if="isVip">{{$t('vip.plus_acitve', {site_name: $store.state.site_name_upper})}}</text>
							<text v-else>{{$t('vip.get_now')}}</text>
						</view>
						<view>
							{{$t('vip.Invite friends and get rewards')}}
						</view>
					</view>
				</view>
				
				<!-- 折扣商品模块 -->
				<view class="discount-goods-module-box module">
					<view class="block-loading" v-if="loading">
						<view class="la-ball-pulse-box">
							<view></view>
							<view></view>
							<view></view>
						</view>
					</view>
					<view class="wrapper-bg"></view>
					<view class="discount-goods-module-main module-main" :style="loading?'opacity:0':'opacity:1'">
						<view class="header">
							<view class="flex align-items-center name">
								<i class="iconfont3 icon-my-coupons"></i>
								<view class="font-bold">{{$t('vip.exclusive_deal')}}: {{discount_off}} {{$t('vip.OFF')}}!</view>
							</view>
							<view class="tip">{{$t('vip.Exclusively for you: Enjoy an extra')}} {{discount_off}} {{$t('vip.OFF_on_almost_store_wide_items')}}</view>
						</view>
						<view class="lists">
							<view class="recommend-main-list" v-if="productList.length">
								<good-list module_name="plus_epp" ref="good_list_ref_re" :showWhiteIcon="true" @popupChange="(value)=>{pageMetaShow=value}" :goods="productList"></good-list>
							</view>
							<view class="no-data-box" v-else>{{$t('vip.No data')}}</view>
							<view @click="$public.handleNavTo('/pages/search/search?vipProduct=true&module=plus_epp')" class="flex align-items-center justify-content-center view-all-items">
								{{$t('vip.View all exclusive items', {site_name: $store.state.site_name_upper})}}
								<i class="iconfont icon-arrow-r"></i>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 双倍积分模块 -->
				<view class="double-points-module-box module" :class="isShowFooter?'double-points-pb':''">
					<view class="wrapper-bg"></view>
					<view class="double-points-module-main module-main">
						<view class="header">
							<view class="flex align-items-center">
								<i class="iconfont3 icon-my-points"></i>
								<view class="font-bold name">{{$t('vip.double_shopping_points')}}</view>
							</view>
							<view class="tip">{{$t('vip.Enjoy exclusive Shopping Points')}}</view>
						</view>
						<view class="content">
							<view class="item-box">
								<view class="text1 font-bold">{{$t('vip.with_plus', {site_name: $store.state.site_name_upper})}}</view>
								<!-- <view class="text2">{{$t('vip.double_point_text1_1')}}</view> -->
								<view class="text3">{{$t('vip.double_point_text1_2')}}</view>
								<!-- <view class="text4">{{$t('vip.double_point_text1_3')}}</view> -->
							</view>
							<view class="item-box">
								<view class="text1 font-bold">{{$t('vip.without_plus',{site_name: $store.state.site_name_upper})}}</view>
								<!-- <view class="text2">{{$t('vip.double_point_text2_1')}}</view> -->
								<view class="text3">{{$t('vip.double_point_text2_2')}}</view>
								<!-- <view class="text4">{{$t('vip.double_point_text2_3')}}</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class="btnGround-footer-box page-max-width" v-if="isShowFooter">
					<block v-if="isVip">
						<view @click="$public.handleNavTo('/pages/distribute/generateurl')" class="free-submit-btn flex flex-column align-items-center justify-content-center">
							<view class="font-bold">
								<text v-if="isVip">{{$t('vip.plus_acitve', {site_name: $store.state.site_name_upper})}}</text>
								<text v-else>{{$t('vip.get_now')}}</text>
							</view>
							<view>
								{{$t('vip.Invite friends and get rewards')}}
							</view>
						</view>
					</block>
					<block v-else>
						<!-- 同意协议  -->
						<view v-if="vipType == 2" class="agree-box flex align-items-center flex-nowrap" :class="isVip?'disabled':''">
							<view class="agree-btn flex" :class="isAgree?'active':''" @click="handleAgree">
								<image mode="widthFix" src="../../static/images/vip/agree-select-icon.png" />
							</view>
							<view class="flex-1">{{$t('vip.I have read and agree the')}}<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-dressin-plus-terms-conditions')" class="text-underline">{{$t('vip.vip_terms_conditions', {site_name: $store.state.site_name_upper})}}</text></view>
						</view>
						<!-- 收费 -->
						<view v-if="vipType == 2" class="fee-submit-btn font-bold" :class="isVip?'disabled':''" @click="handleSumbit">
							{{$t('vip.buy_now')}}({{vip_price.symbol}}{{vip_price.value}})
						</view>
						<!-- 错误提示 -->
						<view class="error-box" v-if="isError">
							{{$t('vip.Please confirm that you have fully read and understood the above terms')}}
						</view>
						<!-- 免费试用 -->
						<view @click="$public.handleNavTo('/pages/distribute/generateurl')" v-if="vipType == 1" class="free-submit-btn flex flex-column align-items-center justify-content-center">
							<view class="font-bold">
								<text v-if="isVip">{{$t('vip.plus_acitve', {site_name: $store.state.site_name_upper})}}</text>
								<text v-else>{{$t('vip.get_now')}}</text>
							</view>
							<view>
								{{$t('vip.Invite friends and get rewards')}}
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		
		<!-- 免费提示 -->
		<uni-popup ref="popupFreeTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="free-tip-box">
					<!-- <view v-if="isVip">
						{{$t('vip.is-member-tip',{site_name: $store.state.site_name_upper})}}
					</view> -->
					<view>
						{{$t('vip.non-member-tip', {site_name: $store.state.site_name_upper})}}
					</view>
					<view class="close-btn" @click="$refs.popupFreeTip.close()">{{ $t('vip.got_it') }}</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="expiration_popup" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="free-tip-box">
					<view class=" flex justify-content-center" style="font-size:28rpx">
						{{$t('vip.expiration_tip', {date: purchase_date})}}
					</view>			
					<view class="close-btn" @click="$refs.expiration_popup.close()">{{ $t('vip.got_it') }}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageMetaShow:false,
				isVip: true,
				vipType: 1,// 1 免费 2 收费
				isError: false,
				isAgree: false,
				productList:[],
				loading: true, // 会员接口请求loading
				wHeight:0,
				isShowFooter: false,
				expData: "",
				discount_off: "" ,// 会员折扣
				vip_price: {}, // 会员价格
				showBacktopBtn: false,
				purchase_date: '',
			}
		},
		computed: {
			//是否显示plus购买
			isPurchasePlus(){
				let platform = uni.getSystemInfoSync().platform;
				if(platform == 'ios'){
					if(!this.$store.state.appConfig || !this.$store.state.appConfig.purchase_plus){
						return false;
					}
				}
				return true;
			}
		},
		methods: {
			// vip用户信息
			getVipInfo() {
				this.$apis.getVipInfo().then(res => {
					let result = res.data
					this.purchase_date = result.purchase_date
					this.vipType = result.vipType;
					this.isVip = result.isVip;
					this.expData = result.expData;
					this.discount_off = result.discount_off;
					this.vip_price = result.vip_price;
				})
			},
			// 获取推荐列表
			recommendProduct() {
				const params = {
					type: 'plus_rec',
					size: 6
				}
				this.$apis.recommendProduct(params).then(res => {
					this.productList = res.data.products || [];
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})
			},
			handleAgree() {
				this.isAgree = !this.isAgree;
				if(this.isAgree) {
					this.isError = false
				}
			},
			handleSumbit() {
				if(this.isAgree) {
					this.$public.handleNavTo('/pages/vip/pay-vip')
				} else{
					this.isError = true
				}
			},
			handleOpenExpirationModal(){
				this.$refs.expiration_popup.open('center')
			},
			handleScrollTo(className) {
				uni.createSelectorQuery().select(className).boundingClientRect(data => { 
					uni.pageScrollTo({
						duration: 300, // 滚动动画过渡时间
						scrollTop: data.top, // 滚动的值
					})
				}).exec();
			}
		},
		onLoad() {
			var that = this;
			uni.getSystemInfo({
				success: function (res) {
					that.wHeight = res.windowHeight
				}
			});
			this.getVipInfo();
			this.recommendProduct()
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'di_plus',
				event_action: 'di_plus_visit',
				event_name: 'di_plus_visit'
			})
		},
		onPageScroll(t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
			uni.createSelectorQuery().select('.btnGround-center-box').boundingClientRect(rect => {
				if (rect.top <= 0) {
					this.isShowFooter = true
				} else if (rect.top > this.wHeight) {
					this.isShowFooter = true
				} else {
					//可见
					this.isShowFooter = false
				}
			}).exec();
			this.$debounce(() => {
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
		}
	}
</script>

<style scoped lang="scss">
.dressin-vip-page-box {
	background-image: url('../../static/images/vip/no-member-bg.png');
	min-height: 100vh;
	background-size: 100%;
    background-repeat: no-repeat;
    background-color: rgb(22, 22, 22);
	font-size: 32rpx;
	::v-deep .goods-lists {
		background: unset;
		padding: 0;
		.goods-list-title {
			display: none;
		}
		.vip-tag-box {
			display: none;
		}
		.goods-list-money {
			display: none;
		}
		.vip-page-member-price {
			display: inline-block;
			.goods-price {
				color: #ffba97;
				font-weight: bold;
			}
		}
		.member-price {
			display: none;
		}
	}
	.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
	.page-header-box {
		background: linear-gradient(360deg, rgb(224, 116, 67), rgb(245, 123, 70)) rgba(226, 118, 70, 0);
		box-shadow: unset;
		::v-deep .title {
			// color: #fff;
		}
		::v-deep .icon-goback {
			color: #fff;
		}
	}
	.vip-card-box {
		padding: 0 24rpx;
		.card-box {
			border-radius: 8rpx 8rpx 0 0;
			margin: auto;
			background-repeat: no-repeat;
			background-size: cover;
			font-size: 30rpx;
			.card-title {
				background: linear-gradient(90deg,#ffdbc9,rgba(255,226,211,0) 76.92%);
				padding: 4rpx 6rpx;
				border-radius: 8rpx 8rpx 0 0;
				image {
					width: 48rpx;
					margin-right: 4rpx;
				}
				.vip-card-title {
					font-weight: bold;
				}
			}
			.card-content {
				padding: 24rpx;
				color: #873c00;
				text-align: center;
				padding-bottom: 48rpx;
				font-weight: bold;
				.big {
					font-size: 34rpx;
					color: #fa6338;
					padding: 0 8rpx;
				}
			}
		}
	}
	.vip-type-choose-box {
		background-image: url('../../static/images/vip/cycle_bg.png');
		margin-top: -24rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		color: #ffba97;
		padding: 48rpx 24rpx 0;
		.vip-choose-title {
			margin-bottom: 40rpx;
			.choose-title {
				padding: 0 24rpx;
			}
			text {
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				background: #ffba97;
			}
		}
		.vip-choose-card-box {
			display: flex;
			flex-wrap: nowrap;
			margin-bottom: 48rpx;
			.card-item:nth-child(1) {
				margin-right: 40rpx;
			}
			.card-item {
				width: calc(50% - 20rpx);
				box-shadow: inset 0 0 0 4rpx rgba(255,186,151,.5);
				border-radius: 8rpx;
				cursor: pointer;
				.card-item-header {
					height: 96rpx;
					background-color: rgba(255,175,118,.1);
					border-radius: 8rpx 8rpx 0 0;
					color: #ffba97;
					position: relative;
					.vip-question {
						font-size: 32rpx;
						color: #ffba97;
						margin-left: 8rpx;
					}
				}
				.renew-tag {
					position: absolute;
					right: 0;
					bottom: 90%;
					border-radius: 0 12rpx;
					background: linear-gradient(97.82deg,#ff5656 1.43%,#c73bff);
					color: #fff;
					padding: 4rpx 12rpx;
					transform-origin: bottom right;
					transform: scale(.8333);
					font-size: 24rpx;
					.renew-tag__animation {
					    position: absolute;
					    top: 0;
					    opacity: 0;
					    width: 20rpx;
					    height: 100%;
					    left: 0;
					    background: linear-gradient(95deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,.5),hsla(0,0%,100%,.1));
					    -webkit-animation: tag-move-ltr .5s ease;
					    animation: tag-move-ltr .5s ease;
					    -webkit-animation-fill-mode: forwards;
					    animation-fill-mode: forwards;
					    -webkit-animation-iteration-count: 1;
					    animation-iteration-count: 1;
					    -webkit-animation-delay: 1s;
					    animation-delay: 3s;
					}
				}
				.card-item-content {
					height: 140rpx;
					font-size: 40rpx;
				}
			}
			.card-item.active {
				.card-item-header {
					background: linear-gradient(90deg,#ffc3a5,#eaa27e);
					color: #873c00;
					.vip-question {
						color: rgba(135,60,0,.5);
					}
				}
				.card-item-content {
					background: radial-gradient(#fdc0a154, #fdc0a11f);
				}
			}
		}
		.vip-equity-box {
			background-color: rgba(255,186,151,.1);
			border-radius: 10rpx;
			padding: 24rpx;
			color: rgba(255,186,151,.8);
			font-size: 28rpx;
			.vip-question{
				font-size: 32rpx;
				color: #ffba97;
				margin-left: 8rpx;
			}
			.icon-my-coupons {
				font-size: 50rpx;
				margin-right: 8rpx;
			}
			.icon-my-points {
				font-size: 50rpx;
				margin-right: 8rpx;
			}
			.icon-arrow-r {
				font-size: 36rpx;
			}
			.discount-item {
				margin-bottom: 24rpx;
				line-height: 1;
			}
			.points-item {
				padding-bottom: 24rpx;
				border-bottom: 1px dashed rgba(255,186,151,.5);
				line-height: 1;
				margin-bottom: 24rpx;
			}
		}
		.agree-box {
			margin-top: 24rpx;
			color: #666666;
			font-size: 28rpx;
			.agree-btn {
				width: 42rpx;
				height: 42rpx;
				border: 2px solid #666666;
				margin-right: 8rpx;
				border-radius: 50%;
				cursor: pointer;
				image {
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
			.agree-btn.active {
				border: 0;
				image {
					opacity: 1;
				}
			}
		}
		.free-submit-btn {
			background: linear-gradient(97.82deg,#ff5656 1.43%,#c73bff);
			padding: 10rpx 0;
			border-radius: 152rpx;
			margin-top: 24rpx;
			color: #fff;
			font-size: 28rpx;
		}
		.fee-submit-btn {
			background: linear-gradient(90deg,#ffc3a5,#eaa27e);
			padding: 20rpx 0;
			border-radius: 152rpx;
			margin-top: 24rpx;
			font-size: 31rpx;
			color: #873c00;
			text-align: center;
			cursor: pointer;
		}
		.error-box {
			color: red;
			margin-top: 18rpx;
			font-size: 26rpx;
		}
		.discount-goods-module-box {
			position: relative;
			.la-ball-pulse-box view {
				background-color: #fff;
			}
			.discount-goods-module-main {
				opacity: 0;
			}
			.no-data-box {
				text-align: center;
				font-size:42rpx;
				color: #ffba97;
				opacity: 0.3;
				font-weight: bold;
			}
			.lists {
				margin-top: 24rpx;
				.view-all-items {
					margin-top: 24rpx;
					font-size: 28rpx;
					color: #ffba97;
					.icon-arrow-r {
						font-size: 36rpx;
					}
				}
			}
		}
		.double-points-pb {
			padding-bottom: 340rpx;
		}
		.double-points-module-box {
			.content {
				.item-box {
					margin-top: 24rpx;
					background: linear-gradient(0deg,#ffe2d3,#ffe2d3),#fff;
					padding: 24rpx;
					border-radius: 10rpx;
					color: rgba(135,60,0,.6);
					font-size: 40rpx;
					.text1 {
						color: #873c00;
					}
					.text2 {
						font-size: 28rpx;
						color: #873c00;
						margin-bottom: 16rpx;
						margin-top: 8rpx;
					}
					.text3,.text4 {
						position: relative;
						font-size: 24rpx;
						padding-left: 14rpx;
					}
					.text3::before,.text4::before {
						content: "";
						position: absolute;
						top: 50%;
						height: 12rpx;
						width: 12rpx;
						background-color: rgba(135,60,0,.6);
						left: 0;
						transform: translateY(-50%) scale(.5);
						border-radius: 50%;
						transform-origin: center;
					}
				}
			}
		}
		.module {
			margin-top: 48rpx;
			background: rgba(255,186,151,.1);
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			.wrapper-bg {
				text-align: right;
				height: 208rpx;
			}
			.module-main {
				padding: 0 24rpx 48rpx 24rpx;
				margin-top: -165rpx;
				.header {
					.name {
						font-size: 40rpx;
					}
					.icon-my-coupons,.icon-my-points {
						color: rgba(255,186,151,.8);
						margin-right: 8rpx;
						font-size: 50rpx;
					}
					.tip {
						opacity: 0.5;
						font-size: 28rpx;
						padding-top: 10rpx;
					}
				}
			}
		}
		.btnGround-footer-box {
			position: fixed;
			bottom: 0;
			background: #161616;
			padding: 24rpx;
			width: 100vw;
			margin-left: -24rpx;
		}
	}
}
@keyframes tag-move-ltr {
	0% {
		opacity: 1;
		left: 0;
	}
	80% {
		opacity: 1;
	}
	100% {
		left: calc(100% - 0.3rem);
		opacity: 0;
	}
}
.free-tip-box {
	padding: 64rpx;
	.close-btn {
		height: 96rpx;
		text-align: center;
		color: #fff;
		background: #000;
		line-height: 96rpx;
		margin-top: 32rpx;
	}
}
.is-vip-disabled {
    opacity: 0.4;
	.agree-btn {
		pointer-events: none;
	}
}
</style>
