<template>
	<view class="container">
		<view class="img-icon">
			<image src="@/static/images/404-2.png" mode="widthFix" />
		</view>
		<view class="text-content">{{$t('error.not_found')}}</view>		
		<view class="btn-wrapper" @tap="()=>{$public.handleNavTo('/pages/index/index')}">
			{{$t('error.to_home')}}
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

<style scoped lang="scss">
.container{
	width: 100%;
	height: 100vh;
	.img-icon {
		display: flex;
		justify-content: center;
		image {
			width: 80%;
			margin: 250rpx 0 30rpx;
		}
	}
	.text-content{
		color: #000;
		font-size: 40rpx;
		text-align: center;
		font-weight: bold;
	}
	.btn-wrapper{
		background: #000;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		height: 80rpx;
		width: 400rpx;
		margin: 30rpx auto 0;
	}
}
</style>
