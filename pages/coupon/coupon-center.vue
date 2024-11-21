<template>
	<view class="coupon-center-box dui-padding-top-header">
		<pageHeader :title="$t('coupon_center.header')"></pageHeader>
		<view class="header-box flex flex-column justify-content-between">
			<view class="top">
				<view class="title">{{$t("coupon_center.coupon_center")}}</view>
				<view @click="$public.handleNavTo('/pages/coupon/my-coupons')" class="go-to-my-coupons">{{$t("coupon_center.my_coupons")}} ></view>
			</view>
		</view>
		<view class="exchange-box">
			<exchangeCoupon @submit="getList()"></exchangeCoupon>
		</view>
		<view class="coupons-list-box">
			<block v-for="(item,index) in couponList">
				<couponItem :couponItemData="item" @change="getList"></couponItem>
			</block>
		</view>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	import exchangeCoupon from "@/components/exchangeCoupon/exchangeCoupon.vue"
	import couponItem from '@/components/couponItem/couponItem.vue'
	export default {
		components: {
			pageHeader,
			exchangeCoupon,
			couponItem
		},
		data() {
			return {
				couponList: [],
				isLoad: false
			}
		},
		onLoad(){
			this.getList();
		},
		onShow() {
			if(this.$store.getters.hasLogin && this.isLoad){
				this.getList();
			}
		},
		methods: {
			getList() {
				this.$apis.getProductCouponList().then(res =>{
					this.isLoad = true;
					this.couponList = res.data.coupons || []
					uni.hideLoading()
				}).catch(() => {
					this.isLoad = true;
				})
			}
		}
	}
</script>

<style scoped>
	.coupon-center-box .header-box {
		height: 291rpx;
		background-image: url('../../static/images/banner/coupon-center-banner.jpg');
		background-size: 100% 100%;
	}

	.coupon-center-box .header-box .top {
		margin-top: 44rpx;
		text-align: center;
		color: #ffffff;
	}

	.coupon-center-box .header-box .top .title {
		font-size: 52rpx;
		font-weight: 700;
	}

	.coupon-center-box .header-box .top .go-to-my-coupons {
		display: inline-block;
		border: 1px solid #ffffff;
		padding: 15rpx 32rpx;
		border-radius: 40rpx;
		margin-top: 28rpx;
		line-height: 1;
		font-size: 24rpx;
	}

	.coupon-center-box .header-box .bottom {
		font-size: 30rpx;
		color: #333333;
		font-weight: 700;
		padding-left: 24rpx;
	}

	.coupon-center-box .exchange-box {
		margin-top: -24rpx;
	}
	.coupon-center-box .coupons-list-box {
		padding: 24rpx;
	}
</style>
