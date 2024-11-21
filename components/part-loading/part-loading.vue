<template>
	<view class="part-loading-container" v-if="show">
		<view class="loading-overlay">
			<view class="spinner"></view>
		</view>
	</view>   
</template>

<script>
	export default {
		name:"part-loading",
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.part-loading-container {
	position: absolute;
	z-index: 2;
	top: 0;
	left: 0;
	pointer-events: none;
	bottom: 0;
	right: 0;
	.loading-overlay{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		opacity: 0.8;
		.spinner{
			display: inline-block;
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			border: 4rpx solid #999;
			border-right-color: transparent;
			background-color: transparent;
			animation: spinner-rotate 0.8s linear infinite;
		}
	}
}
@keyframes spinner-rotate {
	100% {
		transform: rotate(360deg);
	}
}
</style>