<template>
	<view>
	  <pageHeader :buriedPointData="buriedPointData" :styleType="2" :isTitleUppercase="true" :title="$t('share_success.order_complete')"></pageHeader>
	  <view class="container">
		<view class="success-icon">
		  <image src="/static/images/share_success/new_right.png"></image>
		</view>
		<view class="thank-you-message">{{ $t('share_success.thank_you_order') }}</view>
		<view class="order-number">
		  <view>{{ $t('share_success.order_number') }}</view>
		  <text class="order-id" v-if="incrementIds">{{ incrementIds || '' }}</text>
		</view>
		<view class="confirmation-message">
			{{orderDetail.order_tips}}
		</view>
		<view class="view-order-button">
		  <button class="view-order-content" @click="handleGotoOrder">{{ $t('share_success.view_order') }}</button>
		</view>
		<view class="share-bottom">
		  <view class="happy-message">
			{{ $t('share_success.happy_with_purchase') }}
		  </view>
		  <view class="share-message" v-html="orderDetail.share_reward"></view>
		  <image class="share-bg" src="/static/images/share_success/share-bg.png" ></image>
		  <!-- 奖励金额 -->
		  <view class="inviter_money">
		  	{{ orderDetail.inviter_money }}
		  </view>
		  <!-- 手机里面的奖励金额 -->
		  <view class="inviter_money-phone">
			<text style="margin-right: 8rpx;">
				{{$t('share_success.get')}}
			</text>
		  	<text>{{ orderDetail.inviter_money}}</text>
		  </view>
		  <!-- 奖励折扣 -->
		  <view class="discount">
		  	{{ orderDetail.discount }}
			<view>{{$t('share_success.off')}}</view>
		  </view>
		  <view class="share-now">
			<view class="share-now-btn" @click="shareNow">
			  <view class="share-now-in">
				<text>{{ $t('share_success.show_now') }}</text>
				<image src="/static/images/share_success/towards_right.png" />
			  </view>
			</view>
		  </view>
		</view>
	  </view>
	  <!-- 分享弹窗 -->
	  <sharePopup ref="sharePopup" key_prefix="order_share_" @clickBarItem="(type)=>{handleClickBarItem(type)}" :title="$t('fission_sharing.pay_success_share_popup_title')" :isDifferPlatformWord="true" :shareData="shareData"></sharePopup> 
	  <customTooltip ref="tooltip" :title="$t('fission_sharing.share_success_text')"></customTooltip>
	</view>
  </template>
  
  <script>
import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
import sharePopup from '@/components/sharePopup/sharePopup.vue';
  export default {
	components: {
	  customTooltip,
	  sharePopup
	},
	data() {
	  return {
		shareData: {},
		orderDetail: {},
		orderId:"",
		incrementIds:'',
		isShared:false,
		currency_symbol: '',
		buriedPointData: {
			event_category: 'pay_succeed',
			event_action: 'pay_succeed_return_button',
			event_name: 'pay_succeed_return_button',
			module: 'pay_succeed',
			event_data: {},
		},
	  }
	},
	onShow() {
		if(this.isShared) {
			this.$refs.sharePopup.close();
			this.$refs.tooltip.open({time:2000});
			this.isShared = false;
		}
		this.$maEvent.visit_event({
			event_category: 'pay_succeed',
			event_action: 'pay_succeed_visit',
			event_name: 'pay_succeed_visit'
		})
	},
	onLoad(e) {
		const orderId = e.orderId;
		this.orderId = orderId;
		this.loadOrderData();
		// 页面曝光
		this.$maEvent.impression_event({
			event_category: 'pay_succeed',
			event_action: 'pay_succeed_page',
			event_name: 'pay_succeed_page',
			event_data: {},
			module: 'pay_succeed'
		});
	},
	methods: {
		handleClickBarItem(type) {
			this.$maEvent.custom_event({
				event_category: 'pay_succeed',
				event_action: 'pay_succeed_share_to_button',
				event_name: 'pay_succeed_share_to_button',
				module: 'pay_succeed',
				event_data: {
					event_value: type
				},
			});
			if(type != 'more') {
				this.isShared = true
			}
		},
		loadOrderData() {
			this.showLoading = true;
			this.$apis.getOrderDetail({ order_id: this.orderId }).then(res => {
				this.showLoading = false;
				if (res.data) {
					this.orderDetail = res.data;
					this.incrementIds = res?.data?.order?.increment_id;
					const pd = res.data.order?.products[0]?.products[0];
					this.currency_symbol = res.data.order?.currency_symbol;
					// 链接参数
					this.shareData = {
						from_page: "order_finished",
						share_from: 'distribute',
						url: res.data.short_url,
						image: res.data.order_share_content.order_share_facebook_image,
						...res.data.order_share_content,
					}
				}
				this.$trackEvent.purchase(res.data.order);
			});
		},
		handleGotoOrder() {
			this.$maEvent.custom_event({
				event_category: 'pay_succeed',
				event_action: 'pay_succeed_view_button',
				event_name: 'pay_succeed_view_button',
				module: 'pay_succeed',
				event_data: {},
			});
			uni.redirectTo({
				url: '/pages/order/order-detail?id=' + this.orderId
			});
		},
	  shareNow() {
		this.$maEvent.custom_event({
			event_category: 'pay_succeed',
			event_action: 'pay_succeed_share_button',
			event_name: 'pay_succeed_share_button',
			module: 'pay_succeed',
			event_data: {},
		});
		if(this.shareData&&this.shareData.url) {
			this.$refs.sharePopup.open('bottom')
			this.$trackEvent.open_share_code({
				from_page: 'order_finished',
				event_action: 'open_share_distribute',
				event_name: 'open share from order pay success page'
			});
		}
	  }
	}
  }
  </script>
  
  <style lang="scss" scoped>
  .container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 88rpx;
	background-color: #fff;
  }
  
  .success-icon {
	width: 100%;
	height: 200rpx;
	margin-top: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
  
	image {
	  width: 173.08rpx;
	  height: 173.08rpx;
	}
  }
  
  .thank-you-message {
	margin-top: 30rpx;
	height: 50rpx;
	font-weight: 550;
	font-size: 38rpx;
	color: #000000;
	line-height: 50rpx;
	font-style: normal;
  }
  
  .order-number {
	font-size: 28rpx;
	margin-top: 20rpx;
	display: flex;
	flex-flow: column;
	align-items: center;
	font-weight: 400;
	font-size: 32rpx;
	color: #000000;
	line-height: 50rpx;
	font-family: 'Montserrat-Regular';
	.order-id {
	  margin-top: 10rpx;
	  font-family: 'Montserrat-Medium';
	}
  }
  
  .confirmation-message {
	font-size: 26.92rpx;
	line-height: 38.46rpx;
	margin: 30rpx auto;
	width: 87%;
	text-align: center;
	color: #393939;
	font-family: 'Montserrat-Regular';
  
	text {
	  color: #444;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	  font-size: 28rpx;
	}
  }
  
  .share-button {
	margin-top: 30rpx;
  }
  
  .share-button-content {
	background-color: #000;
	color: #fff;
	padding: 20rpx 40rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
  }
  
  .view-order-button {
	margin-top: 20rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
  
	.view-order-content {
	  background-color: #222;
	  color: #fff;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  width: 88%;
	  height: 92.31rpx;
	  border-radius: 10rpx;
	  font-weight: 550;
	  font-size: 30rpx;
	  text-transform: uppercase;
	  border-radius: 46rpx;
	}
  }
  
  .share-bottom {
	position: relative;
	background-image: linear-gradient( 180deg, #C4ACFF 0%, #FF98F8 100%);;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	height: 1123rpx;
	width: 100%;
	display: flex;
	flex-flow: column;
	align-items: center;
	margin-top: 123rpx;
	.inviter_money {
		width: 135rpx;
		height: 135rpx;
		position: absolute;
		top: 629rpx;
		left: 142rpx;
		transform: rotateZ(-16deg);
		font-size: 50rpx;
		color: #FFFFFF;
		line-height: 54rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.inviter_money-phone {
		width: 100rpx;
		position: absolute;
		top: 822rpx;
		left: 397rpx;
		font-size: 15rpx;
		text-align: center;
		color: #41176D;
	}
	.discount {
		position: absolute;
		width: 96rpx;
		height: 96rpx;
		top: 865rpx;
		right: 40rpx;
		font-size: 27rpx;
		color: #FFFFFF;
		transform: rotateZ(20deg);
		word-break: break-word;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.share-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
  
	.happy-message {
	  margin-top: 50rpx;
	  height: 50rpx;
	  font-family: Montserrat-SemiBold;
	  font-weight: 600;
	  font-size: 35rpx;
	  color: #000000;
	  line-height: 50rpx;
	  display: flex;
	  justify-content: center;
	}
  
	.share-message {
	  width: 506rpx;
	  font-weight: 400;
	  font-size: 30rpx;
	  color: #333333;
	  line-height: 46rpx;
	  text-align: center;
	  margin-top: 51rpx;
	}
  
	.share-now {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  margin-top: 60rpx;
	  z-index: 1;
	  .share-now-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 415rpx;
		height: 92rpx;
		background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
		border-radius: 8rpx;
  
		.share-now-in {
		  display: flex;
		  justify-content: center;
		  align-items: center;
  
		  text {
			display: flex;
			align-items: center;
			font-family: Jost, Jost;
			font-weight: 600;
			font-size: 31rpx;
			color: #FFFFFF;
			text-transform: uppercase;
			margin-right: 10rpx;
		  }
  
		  image {
			height: 46rpx;
			width: 46rpx;
		  }
		}
	  }
	}
  
	.share-image {
	  margin-top: 50rpx;
	  display: flex;
	  justify-content: center;
  
	  image {
		width: 415rpx;
		height: 415rpx;
		margin-left: 5rpx;
	  }
	}
  }
  </style>
  