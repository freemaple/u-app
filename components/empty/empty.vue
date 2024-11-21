<template>
	<view class="empty-box">
		<image mode="widthFix" src="@/static/images/empty.png" ></image>
		<view class="empty-text">{{text || $t('common.empty_text')}}</view>
		<view v-if="show_btn" class="action-btn" @click="handleTo()">{{btn_text || $t('common.go_shopping_btn')}}</view>
	</view>
</template>
<script>
	export default {
		props: {
			text: {
				type: String,
				default:''
			},
			btn_text: {
				type: String,
				default:''
			},
			show_btn: {
				type: Boolean,
				default: false
			},
			routeType: {
				type: String,
				default: 'switchTab'
			},
			routeUrl: {
				type: String,
				default: '/pages/index/index'
			}
		},
		data() {
			return {}
		},
		methods:{
			handleTo() {
				uni[this.routeType]({
					url:this.routeUrl
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.empty-box {
		text-align: center;
		padding-top: 48rpx;
		margin-bottom: 48rpx;
		.empty-text {
			color: #666;
			font-size: 30rpx;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}
		.action-btn {
			width: 416rpx;
			height: 84rpx;
			text-align: center;
			background: #000;
			line-height: 84rpx;
			font-size: 32rpx;
			color: #fff;
			border-radius: 40rpx;
			border: 1px solid #000;
			font-family: 'Montserrat-SemiBold';
			margin: auto;
			margin-top: 48rpx;
		}
	}
</style>