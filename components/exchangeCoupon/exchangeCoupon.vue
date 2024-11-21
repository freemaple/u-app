<template>
	<view class="exchange-coupon-box flex">
		<input v-model="couponCode" :placeholder="$t('exchangeCoupon.placeholder')" />
		<view class="exchange-coupon-btn" @click="handleApply">{{$t('exchangeCoupon.apply')}}</view>
	</view>
</template>

<script>
	export default {
		name:"exchangeCoupon",
		data() {
			return {
				couponCode:''
			};
		},
		methods: {
			handleApply() {
				if (!this.couponCode) {
				  // 如果 coupon_code 为空，则展示错误信息
				  // 可以使用框架提供的提示组件或者通过设置错误信息的数据来展示
				  this.errorMessage = this.$t("exchange_coupon.valid_coupon_code")
				  uni.showToast({
				  	title: this.errorMessage,
					icon: "none"
				  });
				  return; // 停止继续执行下面的代码
				}
				this.$apis.exchangeCoupon({coupon_code:this.couponCode}).then(res => {
					this.$emit('submit')
					this.couponCode = ''
				}).catch(e => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
.exchange-coupon-box {
	box-shadow: 0 1PX 6px rgb(0 0 0 / 17%);
	margin: 24rpx;
}
.exchange-coupon-box input {
	height: 80rpx;
	flex: 1;
	font-size: 28rpx;
	padding-left: 30rpx;
}
.exchange-coupon-box .exchange-coupon-btn {
	padding: 0 32rpx;
	background: linear-gradient(to right bottom,#4d4d4d,#333);
	color: #fff;
	font-size: 28rpx;
	line-height: 80rpx;
}
</style>