<template>
	<view class="dui-padding-top-header">
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.shopping_security')"></pageHeader>
		<view class="security-box">
			<view class="item-box">
				<view class="title font-bold">{{$t('goods_detail.safe_payments.title')}}</view>
				<view class="desc">{{$t('goods_detail.safe_payments.desc', {site_name: $store.state.site_name_upper})}}</view>
				<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-safePayments')">{{$t('goods_detail.learn_more')}}></view>
				<view class="content-box">
					<view class="little-title">{{$t('goods_detail.safe_payments.payment_method')}}</view>
					<view class="image-box">
						<image mode="heightFix" src="@/static/images/pay_logo/paypal.png" />
						<image mode="heightFix" src="@/static/images/pay_logo/visa.png" />
						<image mode="heightFix" src="@/static/images/pay_logo/mastercard.png" />
						<image mode="heightFix" src="@/static/images/pay_logo/american_express.png" />
						<image mode="heightFix" src="@/static/images/pay_logo/diners_club.png" />
						<image mode="heightFix" src="@/static/images/pay_logo/discover.png" />
					</view>
					<view class="little-title">{{$t('goods_detail.safe_payments.security_certification')}}</view>
					<view class="image-box">
						<image mode="heightFix" src="@/static/images/security_pay_icon/mastercard_securecode.png" />
						<image mode="heightFix" src="@/static/images/security_pay_icon/verified_visa.png" />
					</view>
				</view>
			</view>
			
			<view class="item-box">
				<view class="title font-bold">{{$t('goods_detail.secure_logisitics.title')}}</view>
				<view class="little-title">{{$t('goods_detail.secure_logisitics.little_title1')}}</view>
				<view class="desc">{{$t('goods_detail.secure_logisitics.desc1')}}</view>
				<view class="learn_more" @click="$public.handleNavTo('/pages/order/order-list')">{{$t('goods_detail.learn_more')}}</view>
										
				<view class="little-title">{{$t('goods_detail.secure_logisitics.little_title2')}}</view>
				<view class="desc">{{$t('goods_detail.secure_logisitics.desc2')}}</view>
				<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-packageSafety')">{{$t('goods_detail.learn_more')}}</view>
			</view>
			
			<view class="item-box">
				<view class="title font-bold">{{$t('goods_detail.customer_service.title')}}</view>
				<view class="service-icon-box">
					<view class="item">
						<image src="@/static/images/p_detail_icon_question@2x.png" />
						<view>{{$t('goods_detail.customer_service.qusetion')}}</view>
					</view>
					<view class="item">
						<image src="@/static/images/p_detail_icon_email@2x.png" />
						<view>{{$t('goods_detail.customer_service.ticker')}}</view>
					</view>
					<view class="item">
						<image src="@/static/images/p_detail_icon_chat@2x.png" />
						<view>{{$t('goods_detail.customer_service.chat')}}</view>
					</view>
				</view>
				<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-contactUs')">{{$t('goods_detail.customer_service.contact_us')}}</view>
			</view>
			
			<view class="item-box">
				<view class="title font-bold">{{$t('goods_detail.privacy_protection.title')}}</view>
				<view class="desc">{{$t('goods_detail.privacy_protection.desc', {site_name: $store.state.site_name_upper})}}</view>
				<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{$t('goods_detail.learn_more')}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>

/* 购物安全弹窗 start */
.security-box {
	padding: 38rpx 32rpx;
	font-size: 32rpx;
	color: #666666;
}
.security-box .item-box {
	margin-bottom: 50rpx;
}
.security-box .item-box .service-icon-box {
	background: #f6f6f6;
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
	margin-top: 40rpx;
}
.security-box .item-box .service-icon-box .item {
	overflow: hidden;
	text-align: center;
	border-right: 1px solid #ebeef5;
	padding: 24rpx 6rpx;
	font-size: 28rpx;
	width: calc(100% / 3);
}
.security-box .item-box .service-icon-box .item:last-child {
	border-right: 0;
}
.security-box .item-box .service-icon-box image {
	width: 60rpx;
	height: 60rpx;
}
.security-box .title {
	font-size: 32rpx;
	margin-bottom: 20rpx;
	color: #000;
	position: relative;
}

.security-box .learn_more {
	margin-bottom: 20rpx;
	margin-top: 20rpx;
	color: #0071E3;
	text-decoration: underline;
}
.security-box .little-title {
	margin-bottom: 20rpx;
}
.security-box .image-box image {
	height: 64rpx;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}
/* 购物安全弹窗 end */
</style>
