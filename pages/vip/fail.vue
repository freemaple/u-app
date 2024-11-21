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
						{{ $t('pay.payment_fail_tip') }}	
					</view>
					<view class="btn-box">
						<button type="primary" class="primary" @tap="toVipPay">{{ $t('pay.try_again') }}</button>
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
           
        };
    },
    onShow: function () {
        
    },
    onLoad: function (e) {
		
    },
    methods: {
		toVipPay(){
			uni.redirectTo({
				url: '/pages/vip/pay-vip'
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
			font-size: 160rpx;
			color: #3fb341;
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
