<template>
	<view class="dui-padding-top-header">
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.shipping_returns')"></pageHeader>
		<view class="shipping-return-box">
			<view class="title">{{$t('goods_detail.shipping')}}</view>
			<view class="content">
				{{$t('goods_detail.shipping_content')}}
			</view>
			<view class="go-to text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-shipping-methods')">{{$t('goods_detail.see_shipping_btn')}}</view>
	
			<view class="title">{{$t('goods_detail.returns')}}</view>
			<view class="content">
				{{$t('goods_detail.returns_content', {email: $store.state.appConfig.service_email})}}
			</view>
			<view class="go-to text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-return-policy')">{{$t('goods_detail.see_returns_btn')}}</view>
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
/* 物流弹窗内容  start*/
.shipping-return-box {
	padding: 40rpx 32rpx;
	font-size: 32rpx;
	color: #666;
}
.shipping-return-box .title {
	margin-bottom: 20rpx;
	font-weight: bold;
	color: #000;
}
.shipping-return-box .content {
	line-height: 44rpx;
	margin-bottom: 20rpx;
}
.shipping-return-box .go-to {
	color: #0071E3;
	margin-bottom: 46rpx;
}

/* 物流弹窗内容 end*/
</style>
