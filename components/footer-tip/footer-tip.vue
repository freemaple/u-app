<template>
	<view v-if="showTip">
		<view class="fission_footer_tips_mask"></view>
		<view class="fission_footer_tips">
			<view class="fission_footer_tips_bg"></view>
			<!-- 底部的提示信息指引 -->
			<view class="fission_footer_tips_left">
				{{toastData.text}}
			</view>
			<view class="fission_footer_tips_right">
				<image
					class="close_icon"
					src="@/static/images/new-cashgrab-rewards/close.png"
					mode="aspectFill"
					v-if="toastData.showClose == 1"
					@tap="closeFooterTip"
				/>
				<view class="go_btn" v-if="toastData.showGo == 1" @tap="toReg">
					{{toastData.rightText}}
				</view>
			</view>
			<view class="triangle_down"></view>
		</view>
	</view>
</template>
<script>

export default {
	name:"footerTip",
	props: {
		in_site_source:{
			type: String,
			default: ''
		}
	},
    data(){
        return {
			toastData: {},
			showTip: false
        }
    },
    methods: {
		showFooterTip(type) {
			this.tipType = type;
			const obj = JSON.parse(uni.getStorageSync('footer_tip_data'));
			if(obj) {
				this.toastData = obj['type' + type];
				this.showTip = true;
				let hideTime = this.toastData.showGo == 1 ? 30 * 1000 : 3 * 1000;
				setTimeout(() => {
					this.closeFooterTip();
				}, hideTime)
			}
		},
		toReg() {
			const utmParams = uni.getStorageSync("utmParams") || {};
			this.$maEvent.custom_event({
				event_category: 'cashgrab_register_float',
				event_action: 'cashgrab_register_float_button',
				event_name: 'cashgrab_register_float_button',
				event_data: {
					event_value: 'register',
					utm_channel_source: utmParams
				},
				module: 'cashgrab_register_float'
			});
			this.closeFooterTip();
			uni.navigateTo({
				url: '/pages/login/index?page=register&in_site_source='+this.in_site_source+'&is_special=2&returnUrl=/'
			})
		},
		closeFooterTip() {
			this.showTip = false;
		}
    }
}
</script>
<style lang="scss" scoped>
	.fission_footer_tips {
		position: fixed;
		bottom: 20rpx;
		right: 22rpx;
		background: rgba(0,0,0,0.75);
		border-radius: 8rpx;
		z-index: 11;
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 24rpx;
		height: 72rpx;
		padding: 14rpx 14rpx 14rpx 20rpx;
		
		.close_icon {
			width: 36rpx;
			height: 36rpx;
			margin-left: 18rpx;
		}
		.triangle_down {  
			position: absolute;
			bottom: -20rpx;
			right: 40rpx;
			width: 0;  
			height: 0;  
			border-left: 14rpx solid transparent;  
			border-right: 14rpx solid transparent;  
			border-top: 20rpx solid rgba(0,0,0,0.75); /* 使用你想要的颜色 */  
		}
		.go_btn {
			width: 104rpx;
			height: 44rpx;
			line-height: 44rpx;
			text-align: center;
			color: #fff;
			border-radius: 6rpx;
			margin: 0 6rpx 0 22rpx;
			background: linear-gradient( 90deg, #FD4992 0%, #FE7370 49%, #FF9A49 100%), #D9D9D9;
		}
	}
	.fission_footer_tips_mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9;
	}
</style>
