<template>
	<view class="message_tip_box" :class="isShowTip == true ? 'message_tip_show' : ''">
		<view class="message_tip_content">
			<image class="message_tip_icon" v-show="tipType == 1" src="@/static/images/tip-success.png" mode="widthFix"></image>
			<image class="message_tip_icon" v-show="tipType == 2" src="@/static/images/tip-err.png" mode="widthFix"></image>
			<image class="message_tip_icon" v-show="tipType == 3" src="@/static/images/tip-warn.png" mode="widthFix"></image>
			{{tipContent}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"messageTip",
		data() {
			return {
				tipContent: '',
				tipType: 1, // 1 成功；2 失败； 3 警告
				isShowTip: false,
				timer: null,
				timer2: null
			};
		},
		methods: {
			showMessage(tipContent, tipType) {
				this.tipContent = tipContent;
				this.tipType = tipType;
				// 关闭上一次的提示弹窗
				if(this.isShowTip) {
					this.isShowTip = false;
					clearTimeout(this.timer);
					clearTimeout(this.timer2);
				}
				// 显示提示弹窗
				this.timer2 = setTimeout(()=>{
					this.isShowTip = true;
					this.timer = setTimeout(()=>{
						this.isShowTip = false;
					}, 3500)	
				},100)
			}
		}
	}
</script>

<style scoped lang="scss">
	.message_tip_box {
		display: flex;
		justify-content: center;
		position: fixed;
		top: 150rpx;
		z-index: 99999;
		left: 0;
		right: 0;
		transition: all .3s ease;
		transform: translate3d(0, -330rpx, 0);
		opacity: 0;
	}
	.message_tip_content {
		background: #FFFFFF;
		box-shadow: 0px 8rpx 28rpx 16rpx rgba(0,0,0,0.05), 0px 6rpx 16rpx 0px rgba(0,0,0,0.08);
		border-radius: 16rpx;
		max-width: 616rpx;
		padding: 18rpx 36rpx 18rpx 26rpx;
		font-size: 28rpx;
		color: rgba(0,0,0,0.88);
		word-wrap: break-word;
	}
	.message_tip_icon {
		width: 28rpx;
		margin-right: 16rpx;
	}
	.message_tip_show {
		transform: translateZ(0);
		opacity: 1;
	}
</style>