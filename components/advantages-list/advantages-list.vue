<template>
	<view class="advantages">
		<view v-for="item in list"
			class="advantage-item flex">
			<view class="item-image flex-cc">
				<image :src="item.icon" :class="item.title == 'Safety' ? 'imgSp' : ''"></image>
			</view>
			<view class="right-text">
				<view class="text-title font-MM">{{item.title}}</view>
				<view class="text-info font-MR">{{item.info}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "advantages-list",
		props: {
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>
	.advantages {
		margin-top: 34.62rpx;
		.advantage-item {
			.item-image {
				width: 123.08rpx;
				height: 107.69rpx;
				image {
					width: 53.85rpx;
					height: 53.85rpx;
				}
				.imgSp {
					width: 69.23rpx;
					height: 26.92rpx;
				}
			}
			.right-text {
				display: flex;
				flex-direction: column;
				flex: 1;
				justify-content: center;
				text-align: left;
				margin: 13.46rpx 0;
				.text-title {
					height: 42rpx;
					font-weight: 500;
					font-size: 31rpx;
					color: #000000;
					line-height: 42rpx;
				}
				.text-info {
					flex: 1;
					height: 42rpx;
					font-weight: 400;
					font-size: 23rpx;
					color: #333333;
					line-height: 1.5;
					letter-spacing: 0;
				}
			}
		}
	}
</style>