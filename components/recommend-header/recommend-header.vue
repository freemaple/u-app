<template>
	<view class="recommend-header-box flex">
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
	padding: 30.77rpx 0 30.77rpx 30.77rpx;
	background: #fff;
	.title {
		font-family: "Montserrat-SemiBold";
		font-weight: 600;
		font-size: 27rpx;
		color: #393939;
		line-height: 32rpx;
		text-align: left;
	}
	.num {
		color: #999;
		font-size: 23rpx;
		line-height: 27rpx;
		text-align: right;
		position: absolute;
		right: 30.77rpx;
	}
}
</style>