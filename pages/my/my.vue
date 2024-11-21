<template>
	<view class="container flex align-items-center flex-column justify-content-between" style="background-color: #fff; margin-bottom: 0; padding-bottom: 116rpx">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<view class="my-setting" @tap="goToSetting">
			<i class="iconfont"></i>
			<image src="@/static/images/my/settings.png" mode="widthFix">
		</view>
		<view class="user-section">
			<view class="bg"></view>
			<view class="user-info-box">
				<view class="portrait-box" @click="navTo('/pages/user/userInfo')">
					<image src="@/static/images/my/portrait.png" mode="widthFix">
				</view>
				<view class="nickname" @click="navTo('/pages/user/userInfo')">
					<text class="username font-MM">
						{{ personInfo.email || 'account' }}
						<button v-if="personInfo.email && !personInfo.has_active"
							class="verify_btn font-MR" 
							:loading="sendActive" 
							@click="sendActiveEmail">
							{{ $t('my.verify_button')}}
						</button>
					</text>
				</view>
				<view v-if="showVip" :class="'flex align-items-center'">
					<!-- <view :class="'flex jump-vip align-items-center vip_tag ' + (personInfo.isVip ? '' : 'gray')" @click="navTo('/pages/vip/index')">
						<image v-if="personInfo.isVip" mode="aspectFit" src="../../static/images/vip/vip_icon.png" />
						<image v-else mode="aspectFit" src="../../static/images/vip/vip_gray.png" />
						<text>{{$t('my.vip_title', {site_name: $store.state.site_name_upper})}}</text>
						<i class="iconfont"></i>
					</view> -->
					<text v-if="personInfo.customer_vip_info && personInfo.customer_vip_info.name"
						@click="navTo('/pages/vip/level')" 
						class="jump-vip current-vip-tag font-MR" >
							{{ personInfo.customer_vip_info.name}}
					</text>
				</view>
			</view>
			<view :class="'tj-sction ' + (!showVip ? 'tj_mt' : '')">
				<view class="tj-item" @click="navTo('/pages/coupon/my-coupons')">
					<text class="num">{{ personInfo.couponCount || 0 }}</text>
					<text class="tj-desc">{{$t('my.coupons')}}</text>
				</view>
				<view class="tj-item" @click="navTo('/pages/point/index')">
					<text class="num">{{ personInfo.totalPoints || parseFloat(0).toFixed(2) }}</text>
					<text class="tj-desc">{{$t('my.points')}}</text>
				</view>
				<view class="tj-item" @click="navTo('/pages/my/wallet/index')">					
					<text class="num">
						<block v-if="personInfo.totalWallet">
							{{personInfo.symbol}}{{personInfo.totalWallet}}
						</block>
						<i v-else class="iconfont3 icon-my-wallet"></i>
					</text>
					<text class="tj-desc">{{$t('my.wallet')}}</text>
				</view>
			</view>
		</view>
		
		<!-- 非会员展示  v-if="showVip && personInfo.isVip === false" -->
		<!-- <view class="paid-vip-ctn-wrapper" v-if="showVip && personInfo.isVip === false">
			<view class="atmosphere-bg">
				<view class="paid-vip-ctn">
					<view class="paid-vip-frame">
						<view class="paid-vip-header flex justify-content-between align-items-center">
							<view class="flex align-items-center">
								<image mode="aspectFit" class ="vip_icon" src="../../static/images/vip/vip_icon.png" />
								<view class="paid-vip-title">{{$t('vip.title', {site_name: $store.state.site_name_upper})}}</view>
							</view>
							<view @click="navTo('/pages/vip/index')" class="flex align-items-center paid-vip-desc">
								<image mode="aspectFill" class="join-btn" src="../../static/images/vip/joinbutton.png" />
								{{$t('vip.get_now')}}
								<image mode="aspectFill" class="more-right" src="../../static/images/vip/more_right.png"  />
								<!--<view class="renew-discount__tips">
									<view class="renew-tips__txt renew-tips__txt_bg">
										{{$t('vip.limited_time')}}
										<image mode="aspectFill" class="tips-img" src="../../static/images/vip/renew_discount_bg_tips.png" />
									</view>
								</view>
							</view>
						</view>
						<view class="paid-vip-content">
							<view class="paid-vip-content-item">
								{{$t('vip.text_1')}}
								<text>{{personInfo.discount_off}}</text>
								{{$t('vip.Discount')}}!</view>
							<view class="paid-vip-footer flex justify-content-between">
								<view class="flex align-items-center justify-content-center vip-card-footer-item no-wrap">
									<i class="iconfont3 icon-my-coupons"></i>
									<view>{{$t('vip.exclusive_deal')}}: {{personInfo.discount_off}} {{$t('vip.OFF')}}!</view>
								</view>
								<view class="flex align-items-center justify-content-center vip-card-footer-item no-wrap">
									<i class="iconfont3 icon-my-points"></i>
									<view>{{$t('vip.double_shopping_points')}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		
		<!-- my orders -->
		<my-order-box :style="showVip && personInfo.isVip===false ? '' : 'margin-top:0rpx'" 
			:orderEntrances="orderEntrances">
		</my-order-box>
		<view class="bottom-wrapper">
			<card-list-mine :cardListData="cardListData" @emitClick="handleEmitClick"></card-list-mine>
		</view>
		
		<!-- 推荐 -->
		<view v-if="recommendList.length" class="goods-container">
			<recommendHeader :title="$t('recommend.header2')"></recommendHeader>
			<good-list ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="recommendList"></good-list>
		</view>
		<!-- LOG OUT -->
		<view class="btn-wrapper" v-if="logged">
			<view class="uni-btn-v">
				<button @tap="handleLogout">{{$t('unicoeye_my.logout')}}</button>
			</view>
		</view>


	</view>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import recommendHeader from '@/components/recommend-header/recommend-header.vue'
const app = getApp();
export default {
	components: {
		recommendHeader
	},
	data() {
		return {
			pageMetaShow:false,
			recommendList:[],
			logged: true,
			userInfo: '',
			personInfo: {
				headimg: '',
				couponCount: '0',
				favoriteCount: '0',
				payOrderCount: '0',
				email: '',
				isVip: '', // 是否vip
				discount_off: '', // 会员折扣
				processing_num: '',
				unpaid_num: '',
				shipped_num: '',
				totalWallet:'',
				symbol:'',
				is_dropshipper:false, // 是否是小b
				dropshipper_reviewing:false, // 是否有提交小b申请单状态为审核中
				show_buy_vip:false, // 是否显示vip购买入口
			},
			sendActive: false,
			hasSendActive: false,
			mailtime: 0,
			orderEntrances: [],
			cardListData: [
				{
					language:'unicoeye_my.vip',
					// type: 'iconfont3 icon-rights-and-interests',
					url: '/pages/vip/level',
					src: '../../static/images/my/UnicoeyeVip.png'
				},
				// {
				// 	language:'my.vip_level',
				// 	type: 'iconfont3 icon-my-vip',
				// 	url: '/pages/vip/index'
				// },
				{
					language:'unicoeye_my.cashgrab_rewards',
					// type: 'iconfont3 icon-employee-rewards',
					url: '/pages/distribute/index',
					src: '../../static/images/my/CashgrabRewards.png'
				},
				{
					language:'unicoeye_my.my_address',
					// type: 'iconfont3 icon-my-address',
					url: '/pages/address/list',
					src: '../../static/images/my/MyAddress.png'
				},
				{
					language:'unicoeye_my.my_wishlist',
					// type: 'iconfont3 icon-my-wishlist',
					url: '/pages/fav-list/fav-list',
					src: '../../static/images/my/MyWishlist.png',
					wishlist: true
				},
				{
					language:'unicoeye_my.my_coupons',
					// type: 'iconfont3 icon-my-coupons',
					url: '/pages/coupon/my-coupons',
					src: '../../static/images/my/MyCoupons.png'
				},
				{
					language:'unicoeye_my.my_points',
					// type: 'iconfont3 icon-my-points',
					url: '/pages/point/index',
					src: '../../static/images/my/MyPoints.png'
				},
				{
					language:'unicoeye_my.my_wallet',
					// type: 'iconfont3 icon-my-wallet',
					url: '/pages/my/wallet/index',
					src: '../../static/images/my/MyWallet.png'
				},
				{
					language:'unicoeye_my.my_profile',
					// type: 'iconfont3 icon-my-profile',
					url: '/pages/my/profile/index',
					src: '../../static/images/my/MyProfile.png'
				},
				// {
				// 	language:'investigation.my_profile',
				// 	type: 'iconfont3 icon-my-preference',
				// 	url: '/pages/investigation/investigation'
				// },
				// {
				// 	language:'my.my_measurements',
				// 	type: 'iconfont3 icon-my-size',
				// 	url: '/pages/measurements/measurements'
				// },
				{
					language:'unicoeye_my.my_reviews',
					// type: 'iconfont3 icon-my-reviews',
					url: '/pages/review/list',
					src: '../../static/images/my/MyReviews.png'
				},
				{
					language:'unicoeye_my.check_in',
					// type: 'iconfont icon-date',
					url: '/pages/my/checkin',
					src: '../../static/images/my/CheckIn.png'
				},
				{
					language:'unicoeye_my.recently_viewed',
					// type: 'iconfont3 icon-recently-viewed',
					url: '/pages/recently-viewed/recently-viewed',
					src: '../../static/images/my/RecentlyViewed.png'
				},
				{
					language:'unicoeye_my.change_password',
					// type: 'iconfont3 icon-change-password',
					url: '/pages/change-password/change-password',
					src: '../../static/images/my/ChangePassword.png'
				},
				{
					language:'unicoeye_my.my_message',
					// type: '',
					img: require('@/static/images/icon/message.png'),
					url: '/pages/message/message',
					src: '../../static/images/my/MyMessage.png'
				},
				{
					language:'unicoeye_my.customer_service',
					// type: 'iconfont3 icon-customerservice',
					url: '/pages/contact/web',
					src: '../../static/images/my/CustomerService.png'
				},
				// {
				// 	language:'my.drop_shipping',
				// 	type: 'iconfont3 icon-personal-information',
				// 	url: '/pages/my/drop-shipping/index',
				// 	show: 'false'
				// },	
			],
		};
	},
	computed: {
		...mapGetters(['hasLogin', 'token']),
		...mapState(['showVip'])
	},
	onShow() {
		if(this.hasLogin){
			this.queryAcountMsg();
			this.$trackEvent.pageView({
				action: 'Account'
			});
		}
		getApp().globalData.getShopCartNum();
		this.logged = this.hasLogin;
		this.orderEntrances =  [
			{
				type: this.$t('my.unpaid'),
				code: 'waiting_payment',
				desc: 'fecmall',
				count: this.personInfo.unpaid_num,
				// icon: 'iconfont3 icon-unpaid-orders'
				src: '../../static/images/my/Unpaid.png'
			},
			{
				type: this.$t('my.processing'),
				code: 'waiting_shipping',
				desc: 'fecmall',
				count: this.personInfo.processing_num,
				// icon: 'iconfont3 icon-processing-orders'
				src: '../../static/images/my/Processing.png'
			},
			{
				type: this.$t('my.shipped'),
				code: 'waiting_receive',
				desc: 'fecmall',
				count: this.personInfo.shipped_num,
				//icon: 'iconfont3 icon-shipped-orders'
				src: '../../static/images/my/Shipped.png'
			},
		]
		uni.$emit('appDateLog');
		this.$maEvent.visit_event({
			event_category: 'account',
			event_action: 'account_visit',
			event_name: 'account_visit'
		})
	},
	onPullDownRefresh() {
		this.queryAcountMsg()
	},
	onLoad(){
		if(!this.showVip){
			this.cardListData.shift()
		}
		// 推荐先注释，等ui改版再开放
		// this.recommendProduct();
	},
	onPageScroll: function (t) {
		this.$debounce(() => {
			this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
		}, 300)
	},
	methods: {
		...mapActions(['logout']),	
		handleEmitClick(data) {
			console.log(data);
		},
		// 获取推荐列表
		recommendProduct() {
			this.$apis.recommendProduct({type: 'home_rec'}).then(res => {
				this.recommendList = res.data.products || []
			})
			
		},
		queryAcountMsg() {
			//查询到订单、优惠券、收藏、个人信息等数据
			this.$apis.getAccountMsg().then(res => {
				const {data, code} = res
				if(code == 200) {
					const {
						couponCount, 
						favoriteCount, 
						payOrderCount, 
						email, 
						isVip, 
						discount_off, 
						totalPoints, 
						has_active, 
						shipped_num, 
						unpaid_num, 
						processing_num,
						totalWallet,
						symbol,
						dropshipper_reviewing,
						is_dropshipper,
						customer_vip_info,
						show_buy_vip
					} = data	
					this.personInfo.couponCount = couponCount
					this.personInfo.favoriteCount = favoriteCount
					this.personInfo.payOrderCount = payOrderCount
					this.personInfo.email = email
					this.personInfo.isVip = isVip
					this.personInfo.discount_off = discount_off
					this.personInfo.totalPoints = totalPoints;
					this.personInfo.has_active = has_active;
					this.personInfo.shipped_num = shipped_num;
					this.personInfo.unpaid_num = unpaid_num;
					this.personInfo.processing_num = processing_num;
					this.personInfo.totalWallet = totalWallet;
					this.personInfo.symbol = symbol;
					this.personInfo.is_dropshipper = is_dropshipper;
					this.personInfo.dropshipper_reviewing = dropshipper_reviewing;
					this.personInfo.customer_vip_info = customer_vip_info;
					this.personInfo.show_buy_vip = show_buy_vip;
					if(!this.personInfo.show_buy_vip || !this.personInfo.is_dropshipper) {
						this.cardListData = this.cardListData.map(item =>{
							if((item.url =='/pages/vip/index' && !this.personInfo.show_buy_vip)||(item.url == '/pages/my/drop-shipping/index' && !this.personInfo.is_dropshipper) ) {
								item.show = 'false';
							} else {
								item.show = 'true';
							}
							return item
						})
					}
					const entranceArr = [
						unpaid_num,
						processing_num,
						shipped_num
					]
					entranceArr.forEach((item, index)=> {
						this.orderEntrances[index]['count'] = item
					})
					uni.stopPullDownRefresh()
				}				
			})
		},
		
		goToSetting() {
			uni.navigateTo({
				url: '/pages/setting/setting'
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/login/index?in_site_source=account'
			});
		},
		handleLogout() {
			const that = this
			that.logout()
		},
		//发送激活邮件
		sendActiveEmail(){
			if(this.mailtime > 0){
				uni.showToast({
					title: this.$t('my.send_email_countdown', [this.mailtime]),
					icon: "none",
				});
				return false;
			}
			if(this.sendActive){
				return false;
			}
			uni.showModal({
			    title: this.$t('my.verify_confirm'),
			    content: '',
			    success:  (res) => {
			        if (res.confirm) {
			            this.sendActive = true;
			            this.$apis.sendActiveEmail({}).then((res) => {
							this.sendActive = false;
							if(res.code == '200'){
								this.hasSendActive = true;
								this.mailtimeInterval();
							}
							if(res.message){
								uni.showToast({
									title: res.message,
									icon: "none",
								});
							}
			           }).catch(() => {
							this.sendActive = false;
			           });
			        }
			    }
			});
			
		},
		mailtimeInterval(){
			this.mailtime = 60;
			let emailInterval = setInterval(() => {
				this.mailtime--;
				if(this.mailtime == 0){
					clearInterval(emailInterval);
				}
			}, 1000);
		},
		/**
		 * 统一跳转接口,拦截未登录路由
		 * navigator标签现在默认没有转场动画，所以用view
		 */
		navTo(url, type) {
			if (!this.hasLogin) {
				url = '/pages/login/index?in_site_source=account';
			}
			if (url) {
				if (type && type === 'web') {
					window.location.href = url
				} else {
					uni.navigateTo({
						url
					})
				}
			}

		}
	}
};
</script>
<style lang="scss" scoped>
	
page {
	background-color: #f5f5f5;
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.container {
	height: 100%;
	min-height: 100%;
	overflow: hidden;
	overflow-y: hidden;
	margin-bottom: 25px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	position: relative;
	.my-setting {
		position: absolute;
		top: 22rpx;
		right: 25rpx;
		z-index: 999999;
		image {
			width: 46.15rpx;
		}
	}
	// .my-setting>i::before {
	// 	content: '\E6A1';
	// 	font-size: 46.5rpx;
	// 	z-index: 999999;
	// 	color: #fff;
	// }
}

.userinfo {
	background: #fff;
	width: 100%;
	height: 400rpx;
	text-align: center;
	background-size: 100% 115%;
	position: relative;
}

.userinfo button {
	position: absolute;
	width: 100%;
	height: 300rpx;
	top: 0;
	opacity: 0;
}

.userinfo-avatar {
	border-radius: 50%;
	margin-top: 130rpx;
	display: inline-block;
	overflow: hidden;
	width: 150rpx;
	height: 150rpx;
}

.iser-info-box {
	height: 100rpx;
	text-align: center;
	display: block;
}

.userinfo-nickname {
	color: #fff;
	font-size: 32rpx;
	text-align: center;
	margin-bottom: 10rpx;
	display: block;
}

.userinfo-score {
	font-size: 24rpx;
	margin-top: 5px;
	background-color: #b3a078;
	color: #fff;
	padding: 1px 5px;
	border-radius: 2px;
}

.userinfo-score-day {
	font-size: 24rpx;
	margin-top: 5px;
	color: #fff;
}

.userinfo-item {
	width: 100%;
	/* background: url("https://cdn.it120.cc/apifactory/2018/03/02/bccdaf7292464a539efa6a1ea9a11ee6.png") no-repeat 750rpx center; */
	background-size: 16rpx auto;
	border-bottom: 1px solid #fbfbfb;
	line-height: 100rpx;
	padding-left: 30px;
	background-color: #fff;
	font-size: 30rpx;
	color: #333;
}

.userinfo-item image {
	width: 20px;
	height: 20px;
	margin: 0 5px -4px 0;
}

.userinfo-item navigator {
	display: inline-block;
	width: 90%;
	font-size: 30rpx;
}

.user-cart-list {
	background-color: #fff;
	width: 100%;
	text-align: center;
	margin-bottom: 10px;
}

.cart-list {
	display: inline-block;
	width: 25%;
	color: #666;
	font-size: 26rpx;
	margin-top: 10px;
	margin-bottom: 10px;
	position: relative;
}

.red-dot {
	border-radius: 50%;
	width: 36rpx;
	height: 36rpx;
	position: absolute;
	right: 30rpx;
	background-color: #ff3f3e;
	color: #fff;
	font-size: 24rpx;
	line-height: 36rpx;
	top: -10rpx;
}

.cart-list image {
	width: 50rpx;
	height: 50rpx;
	display: block;
	margin: 0 auto;
	padding-bottom: 5px;
}

.userinfo-item navigator text {
	font-size: 24rpx;
	color: #999;
}

.userinfo-item-box {
	width: 100%;
}

.userinfo-item-box .userinfo-item {
	display: inline-block;
	width: 33.1%;
	text-align: center;
	height: 200rpx;
	padding-left: 0;
	line-height: 40rpx;
	position: relative;
}

.userinfo-item-box .userinfo-item:nth-child(1) {
	border-right: 1px solid #fbfbfb;
}

.userinfo-item-box .userinfo-item:nth-child(2) {
	border-right: 1px solid #fbfbfb;
}

.userinfo-item-box .userinfo-item:nth-child(4) {
	border-right: 1px solid #fbfbfb;
}

.userinfo-item-box .userinfo-item:nth-child(5) {
	border-right: 1px solid #fbfbfb;
}

.userinfo-item-box .userinfo-item image {
	width: 50rpx;
	height: 50rpx;
	display: block;
	margin: 0 auto;
	margin-top: 40rpx;
	margin-bottom: 12rpx;
}

.userinfo-item-box .userinfo-item text {
	position: absolute;
	bottom: 20rpx;
	width: 100%;
	left: 0;
	color: #999;
	font-size: 22rpx;
}

.userinfo-item-box .userinfo-item navigator {
	font-size: 26rpx;
	color: #333;
	margin-top: 5rpx;
}

.userinfo-item-box .userinfo-item button {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	opacity: 0;
}

.userinfo-info {
	font-size: 26rpx;
	color: #999;
	margin-top: 30rpx;
}

/* notice */

.userinfo-notice {
	display: flex;
	background-color: #fff;
	align-items: center;
	width: 100%;
	height: 80rpx;
	margin-bottom: 20rpx;
}

.userinfo-notice image {
	width: 36rpx;
	height: 36rpx;
	padding-left: 30rpx;
	padding-right: 20rpx;
}

.userinfo-notice .notice_swiper {
	height: 80rpx;
	width: 85%;
	line-height: 80rpx;
	font-size: 28rpx;
	color: #ab2b2b;
}

.login button {
	width: 690rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	margin-top: 30rpx;
	border-radius: 6rpx;
	box-sizing: border-box;
}

.user-section {
	// height: 350upx;
	width: 100%;
	box-sizing: border-box;
	padding-top: 87.99rpx;

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		// height: 330upx;
		height: 483rpx;
		// filter: blur(1px);
		background: url("~@/static/images/my/InfoBg.png");
		background-size: 100% 100%;
	}
}

.info-box {
	margin: 0 20upx 30upx;
	width: calc(100% - 40upx);
}

.goods-box {
	margin: 0 0 30upx;
	width: 100%;
}

.user-info-box {
	// height: 130rpx;
	padding: 10rpx 30rpx 0;
	display: flex;
	align-items: center;
	position: relative;
	flex-direction: column;
	z-index: 1;

	.portrait-box {
		width: 104rpx;
		height: 104rpx;
		background-color: #fff;
		border-radius: 50%;
		padding: 28.85rpx;
		image {
			width: 46.15rpx;
			height: 46.15rpx;
		}
		// i{			
		// 	color: #ccc;
		// 	&:before {
		// 		content: "\E607";
		// 		font-size: 55.99rpx;
		// 	}
		// }
	}

	.nickname {
		margin-top: 23.08rpx;
		font-size: 34.62rpx;
	}

	.username {
		font-size: 34.62rpx;
		color: #fff;
		word-break: break-all;
	}

	.icomoon {
		color: #FAB9C6;
		margin-left: 10upx;
	}
	.verify_btn {
		display: inline-block;
		vertical-align: middle;
		width: auto;
		height: auto;
		line-height: 42.31rpx;
		background-color: unset;
		border: 2rpx solid #FFFFFF;
		border-radius: 37rpx;
		color: #fff;
		padding: 0 15.38rpx;
		font-size: 23.08rpx;
		font-weight: 400;
		margin: 0px 15.38rpx;
	}
}

.tj-sction {
	display: flex;
	justify-content: space-around;
	align-content: center;
	border-radius: 15rpx;
	z-index: 1;
	position: relative;
	font-family: 'Montserrat-Regular';
	background-color: #fff;
	box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0,0,0,0.1);
	padding: 42.31rpx 0 38.46rpx;
	margin: 53.85rpx 30.77rpx 30.77rpx;
	// margin-top: 108rpx;
	&.tj_mt{
		margin-top: 60rpx;
	}
	.tj-item {
		@extend %flex-center;
		flex-direction: column;
		height: 89.2rpx;
		width: 234rpx;
		font-size:3 4.62rpx;
	}
	.num {
		display: block;
		text-align: center;
		width: 100%;
		margin-bottom: 9.62rpx;
		line-height: 40.56rpx;
		font-size: 34.62rpx;
		color: #000;
	}
	.tj-desc {
		line-height: 27.04rpx;
		font-size: 23.08rpx;
		color: #666;
	}
}

.bottom-wrapper {
	background-color: #fff;
	width: 100%;
}

.btn-wrapper {
	width: 100%;
	background: #fff;
	display: flex;
	justify-content: center;
	.uni-btn-v {
		width: 534.62rpx;
		height: 80.77rpx;
		margin-top: 75rpx;
		/deep/uni-button {
			background: #222;
			font-size: 30.77rpx;
			color: #fff;
			border-radius: 40rpx;
			&::after {
				display: flex;
				text-align: center;
				align-items: center;

			}
		}
	}
}


// vip卡片
.paid-vip-ctn-wrapper {
	width: 702rpx;
	// margin-top: -148rpx;
	z-index: 1;
	margin-bottom: 24rpx;
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08);
    position: relative;
    background: #fff;
    border-radius: 8rpx;
    font-size: 24rpx;
}
.paid-vip-ctn {
	background-image: url('../../static/images/vip/paid_vip_bg.png');
    background-size: cover;
}
.atmosphere-bg {
	background-image: url('../../static/images/vip/atmosphere_vip.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.paid-vip-frame {
	background-image: url('../../static/images/vip/paid_vip_light.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.paid-vip-header {
	background-image: url('../../static/images/vip/paid_vip_title.png');
    background-position: 0 0;
    background-size: cover;
    border-radius: 8rpx 8rpx 0 0;
    padding-left: 24rpx;
    color: #873c00;
    
}
.paid-vip-header .paid-vip-title {
	font-weight: bold;
}
.paid-vip-header .vip_icon {
    width: 36rpx;
	height: 36rpx;
}
.paid-vip-desc {
    background:linear-gradient(1turn,#fcab82,#ffc3a5);
    height:70rpx;
    padding-right: 12rpx;
    border-radius: 0 8rpx 8rpx 0;
    font-weight: bold;
    position: relative;
    margin-top: -4rpx;
}
.paid-vip-desc .join-btn {
    position: absolute;
    left: -60rpx;
    height:70rpx;
	width: 60rpx;
    top: 0;
}
.paid-vip-desc .more-right {
    width: 30rpx;
	height: 30rpx;
    margin-left: 10rpx;
}
.paid-vip-content {
    padding: 24rpx;
    color:#873c00;
}
.paid-vip-content .paid-vip-content-item {
    padding-bottom: 24rpx;
    margin-bottom: 24rpx;
    border-bottom: 1px solid rgba(135,60,0,.1);
}
.paid-vip-content .paid-vip-content-item text {
	color:#fa6338;
	font-weight: bold;
	padding: 0 10rpx;
}
.paid-vip-content .iconfont {
    color:#873c00;
}
.paid-vip-content .vip-card-footer-item {
    flex: 1;
    padding: 12rpx;
}
.paid-vip-content .vip-card-footer-item i {
    margin-right: 8rpx;
}
.paid-vip-content .vip-card-footer-item:first-child {
    border-right: 1px solid rgba(135,60,0,.1);
}

.renew-discount__tips {
    position: absolute;
    top: -50%;
    transform: translateY(-50%) scale(.8333);
    background: #c73bff;
    color: #fff;
    border-radius: 2px;
    right: 0;
    font-size: 24rpx;
}
.renew-tips__txt {
	background-image: url('../../static/images/vip/renew_discount_bg.png');
    padding: 4px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
	// width: 250rpx;
	text-align: center;
}
.renew-tips__txt .tips-img {
	width: 24rpx;
	height: 16rpx;
    position: absolute;
    bottom: -16rpx;
    left: 50%;
    transform: translateX(-50%);
}
.icon-coupon::before {
	content: "\e609";
	font-size: 48rpx;
	font-weight: bold;
}
.icon-points::before {
	content: "\e61b";
	font-size: 48rpx;
	font-weight: bold;
}
.vip_tag{
    border-radius: 10rpx 8rpx 10rpx 8rpx;
    padding: 0 20rpx 0 0;
    color: #c44a01;
    background: linear-gradient(-60deg,transparent 20rpx, rgba(255,216,195,.7) 0) top right;
    background-repeat: no-repeat;
    cursor: pointer;
    font-size: 24rpx;
    
}
.vip_tag.gray{
    color: #ccc;
    background-repeat: no-repeat;
	background: linear-gradient(-60deg,transparent 20rpx, #eee 0) top right;

}
.vip_tag i{
    font-size: 24rpx;
    
}
.vip_tag i:before{
	content: '\e609';
    color: #c44a01;
}
.vip_tag.gray i:before{
	color: #ccc;
}
.jump-vip {
	margin-top: 23.08rpx;
	image {
		width: 40rpx;
		height: 40rpx;
	}
}
.current-vip-tag {
    border: 2rpx solid #fff;
    border-radius: 37rpx;
    padding: 0 15.38rpx;
	line-height: 42.31rpx;
	display: flex;
	align-items: center;
    font-size: 26.92rpx;
    margin-left: 10rpx;
	color: #fff;
}
.wallet_icon{
	color: #fff;
	font-size: 32rpx;
	&:before{
		content: '\e668';
	}
}
::v-deep {
	.goods-container {
		width: 100%;
		margin-top: 24rpx;
		.recommend-header-box {
			justify-content: center;
		}
	}
}
</style>
