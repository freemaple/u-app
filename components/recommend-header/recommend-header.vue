<template>
	<view class="recommend-header-box flex justify-content-between">
		<view class="title" :class="uppercase?'text-uppercase':''">{{title}}</view>
		<view class="num" v-if="num">{{num}} {{num>1?$t('recommend.items'):$t('recommend.item')}}</view>
	</view>
</template>

<script>
	export default {
		name:"recommend-header",
		props: {
			uppercase: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ''
			},
			num: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.recommend-header-box {
	padding: 52rpx 32rpx 30rpx 32rpx;
	background: #fff;
	.title {
		font-size: 32rpx;
		color: #000;
		font-weight: bold;
		padding-right: 10rpx;
	}
	.num {
		font-size: 28rpx;
		color: #999;
	}
}
</style>