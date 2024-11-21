<template>
	<view class="block-item-box">
		<view class="flex justify-content-between" @click="handleClick()">
			<view class="left flex align-items-center">
				<view v-if="isShowDot" class="tips-dot"></view>
				<view class="text">{{ title }}</view>
			</view>
			<view v-if="isShowRightIcon" class="right">
				<view class="iconfont icon-goto"></view>
			</view>
		</view>
		<slot name="content"></slot>
	</view>
</template>

<script>
	export default {
		name:"blockItemBox",
		props: {
			title: {
				type: String,
				default: 'title'
			},
			isShowDot: {
				type: Boolean,
				default: false
			},
			isShowRightIcon: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			handleClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style scoped>
.block-item-box {
	background: #ffffff;
	margin-bottom: 16rpx;
	font-size: 27rpx;
	font-weight: 500;
	padding: 24rpx;
	color: #393939;
}
.block-item-box .left .tips-dot {
	width: 8rpx;
	height: 8rpx;
	background-color: #ff165e;
	border-radius: 50%;
	margin-right: 16rpx;
}
.text {
	font-family: "Montserrat-Regular";
}
</style>
