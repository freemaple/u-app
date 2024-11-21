<template>
	<view class="flex box">
		<view class="left-icons">
			<image class="icons" src="./icons/flash-remaining@2x.png" mode="widthFix" />
		</view>
		<view class="right-desc flex flex-column">
			<view class="desc-text">{{ supStock }}</view>
			<view class="bar-box">
				<view class="bar" :style="`width: ${precent}%`"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"stockRemaining",
		props: {
			supStock: {
				type: String,
				default: ''
			},
			precent: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss">
	.box {
		width: 277rpx;
		flex-wrap: nowrap;
		margin: 7.69rpx 0 5.77rpx;
	}
	.left-icons {
		image{
			width: 30.77rpx;
			height: 30.77rpx;
		}
		margin-right: 7.69rpx;
	}
	.right-desc {
		flex: 1;
		.desc-text {
			width: 100%;
			height: 26.92rpx;
			font-family: 'Montserrat-Regular';
			font-weight: 600;
			font-size: 19.23rpx;
			color: #8A61E6;
			line-height: 26.92rpx;
			letter-spacing: 0;
			white-space: nowrap;
		}
		.bar-box {
			background: #FFEBE2FF;
			height: 5.77rpx;
			.bar{
			    height: 100%;
			    background: linear-gradient( 90deg, #87B7FD 0%, #DA49D6 47%, #FF6EA7 100%);
			    border-radius: 5.77rpx 5.77rpx 5.77rpx 5.77rpx;
			}
		}
	}
</style>