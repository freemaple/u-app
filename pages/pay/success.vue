<template>
	<view id="pay-success-content">
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
		  <view class="share-image">
			<image src="/static/images/share_success/click_phone.png" mode="widthFix"></image>
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
					const pd = res.data.order?.products[0]?.products[0]
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
	font-family: Jost, Jost;
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
	font-family: Jost, Jost;
	font-weight: 400;
	font-size: 32rpx;
	color: #000000;
	line-height: 50rpx;
  
	.order-id {
	  font-weight: bold;
	  margin-top: 10rpx;
	}
  }
  
  .confirmation-message {
	font-size: 26rpx;
	margin: 30rpx auto;
	width: 95%;
	text-align: center;
	color: #666;
  
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
	  background-color: #000;
	  color: #fff;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  width: 90%;
	  height: 92.31rpx;
	  border-radius: 10rpx;
	  font-weight: 550;
	  font-size: 30rpx;
	  text-transform: uppercase;
	}
  }
  
  .share-bottom {
	background-image: url("data:image/png;base64,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");
	height: 925rpx;
	width: 100%;
	display: flex;
	flex-flow: column;
	align-items: center;
	margin-top: 30rpx;
  
	.happy-message {
	  margin-top: 50rpx;
	  height: 50rpx;
	  font-family: Jost, Jost;
	  font-weight: 550;
	  font-size: 35rpx;
	  color: #000000;
	  line-height: 50rpx;
	  display: flex;
	  justify-content: center;
	}
  
	.share-message {
	  width: 506rpx;
	  font-family: Jost, Jost;
	  font-weight: 400;
	  font-size: 28rpx;
	  color: #333333;
	  line-height: 38rpx;
	  text-align: center;
	  margin-top: 38rpx;
  
	  .reward {
		color: #f00;
		font-weight: bold;
		margin-left: 8rpx;
	  }
	}
  
	.share-now {
	  display: flex;
	  justify-content: center;
	  align-items: center;
  
	  .share-now-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 415rpx;
		height: 92rpx;
		background: linear-gradient(90deg, #FD4992 0%, #FE7370 49%, #FF9A49 100%), #000000;
		border-radius: 15rpx;
  
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
  