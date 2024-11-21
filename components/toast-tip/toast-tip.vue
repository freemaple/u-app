<template>
	<uni-popup ref="toastTip" class="popup-common-center-tip">
		<view class="popup-content" style="width:72vw">
			<view class="header">
				<view class="title font-bold">{{title ? title : $t('toastTip.title',{site_name:this.$store.state.site_name_upper})}}</view>
				<image @click="$refs.toastTip.close();" mode="widthFix" class="close" src="../../static/images/checkout_icon/close@2x.png"></image>
			</view>
			<view class="content">
				<view v-if="popupTipType==1">
					<slot name="content"></slot>
				</view>
				<view v-else>{{tipContent}}</view>
			</view>
			<view @click="$refs.toastTip.close();" class="ok-btn">{{$t('toastTip.ok')}}</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name:"toast-tip",
		props: {
			tipContent: '',
			title: {
				type: String,
				default: ''
			},
			popupTipType: {
				type: Number,
				default: 2
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			showToast() {
				this.$refs.toastTip.open('center');
			}
		}
	}
</script>

<style scoped lang="scss">
	.popup-common-center-tip {
		.popup-content {
			background: #fff;
			border-radius: 16rpx;
			padding: 28rpx 40rpx 40rpx 40rpx;
			.header {
				text-align: center;
				font-size: 32rpx;
				color: #000;
				position: relative;
				margin-bottom: 24rpx;
				.close {
					position: absolute;
					width: 36rpx;
					top: -4rpx;
					right: -16rpx;
				}
			}
			.content {
				font-size: 28rpx;
				color: #333333;
				text-align: center;
				line-height: 44rpx;
				min-height: 240rpx;
				margin-bottom: 60rpx;
			}
			.ok-btn {
				border-radius: 8rpx;
				background: #000;
				text-align: center;
				color: #fff;
				height: 84rpx;
				line-height: 84rpx;
				font-size: 32rpx;
			}
		}
	}
</style>