<template>
    <view>
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('share_success.order_complete')"></pageHeader>
        <view class="container">
            <view class="order-box">
                <view class="icon-box">
					<text class="iconfont icon-fail"></text>
				</view>
                <view class="order-info">
                    <view class="sub-title">
						{{ $t('pay.payment_fail') }}	
                    </view>
					<view class="desc-box">
						<view class="ordero-box" v-if="orderDetail.increment_id">{{ $t('pay.order_fail_orderno') }}<view class="order-id" v-if="orderDetail.increment_id">{{ orderDetail.increment_id || ''}}</view></view>
						<view>{{ $t('pay.payment_fail_tip') }}	</view>
						<view>{{ $t('pay.payment_fail_contact') }} <uni-link style="font-size: 27rpx; color: #0071E3; text-decoration: underline;" :href="`mailto:${$store.state.appConfig.contacts_email}`">{{ $store.state.appConfig.contacts_email}}</uni-link>.	</view>
					</view>
					<view class="btn-box">
						<button type="primary" class="primary" @tap="toPay">{{ $t('pay.try_again') }}</button>
						<button class="btn btn-default" @tap="toHome">{{ $t('pay.continue_shopping') }}</button>
					</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
var app = getApp(); // 语言

export default {
    components: {
        navigation
    },
    data() {
        return {
           orderDetail: {}
        };
    },
    onShow: function () {
        
    },
    onLoad: function (e) {
		var orderId = e.orderId;
		this.orderId = orderId;
		if(this.orderId){
			this.loadOrderData();
		}
    },
    methods: {
		loadOrderData: function () {
			this.$apis.getOrderDetail({order_id: this.orderId}).then(res =>{
				if(res.data && res.data.order){
					this.orderDetail = res.data.order;
				}
			});
		},
		toPay(){
			uni.redirectTo({
				url: '/pages/order/order-detail?id=' + this.orderId
			});
		},
		toHome(){
			uni.switchTab({
				url: '/pages/index/index'
			});
		}
    }
};
</script>
<style scoped lang="scss">
.container{
	margin-top: 88rpx;
}
.order-box {
    width: 100%;
	.icon-box {
		padding: 60rpx 0px 20rpx 0px;
		text-align: center;
		.icon-fail {
			font-size: 173rpx;
			color: #FF3B30;
		}
	}
}
.font-bold {
	color: #000;
	font-family: Montserrat-SemiBold;
}
.order-box .order-info {
	padding: 10rpx 46rpx 20rpx 46rpx;
	font-size: 28rpx;
	text-align: center;
	.sub-title {
		color: #000;
		font-family: Montserrat-SemiBold;
		font-size: 36rpx;
		margin-top: 20rpx;
	}
	.desc-box {
		margin: 30rpx 0px;
		font-size: 26.92rpx;
		font-family: Montserrat-Regular;
		line-height: 38rpx;
		color: #393939;
		.ordero-box {
			padding: 20rpx 0px;
			font-size: 31rpx;
			line-height: 50rpx;
			.order-id {
				font-family: 'Montserrat-Medium';
			}
		}
	}
	.btn-box {
		margin: 0px auto;
		margin-top: 69rpx;
		text-transform: uppercase;
		button {
			margin: 30rpx auto;
			width: 658rpx;
			height: 92rpx;
			border-radius: 46rpx;
			line-height: 90rpx;
			font-size: 28rpx;
			font-size: 31rpx;
			&.primary {
				background-color: #222;
			}
			&.btn-default {
				border: 2rpx solid #222222;
				line-height: 88rpx;
				color: #393939;
			}
		}
	}
}
</style>
