<template>
    <view>
        <navigation :showLogo="true" id="Navigation" :show-icon="true"></navigation>
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
						<view class="ordero-box" v-if="orderDetail.increment_id">{{ $t('pay.order_fail_orderno') }}:{{'&nbsp;'}}<text class="font-bold" v-if="orderDetail.increment_id">{{ orderDetail.increment_id || ''}}</text></view>
						<view>{{ $t('pay.payment_fail_tip') }}	</view>
						<view>{{ $t('pay.payment_fail_contact', {contacts_email: $store.state.appConfig.contacts_email}) }}	</view>
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
			font-size: 200rpx;
			color: #e30057;
		}
	}
}
.font-bold {
	color: #000;
	font-weight: bold;
}
.order-box .order-info {
	padding: 20rpx 20rpx;
	font-size: 28rpx;
	line-height: 48rpx;
	text-align: center;
	.sub-title {
		color: #000;
		font-weight: bold;
		font-size: 36rpx;
	}
	.desc-box {
		margin: 30rpx 0px;
		.ordero-box {
			padding: 20rpx 0px;
		}
	}
	.btn-box {
		width: 60%;
		margin: 0px auto;
		button {
			margin: 30rpx auto;
			font-size: 28rpx;
		}
	}
}
</style>
