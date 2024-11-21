<template>
	<view>
		<uni-popup ref="popupRegisterSuccess" background-color="#fff" class="r-success-popup">
			<view class="popup-content register-success-box">
				<view class="text-center">
					<image class="rigister-icon" mode="widthFix" src="@/static/images/register-succed-icon.png" />
				</view>
				<view class="tips-1">{{$t('register_success.tip1')}}</view>
				<view class="text-center">
				<view class="shop-now-btn" @click="shop_now()">{{$t('register_success.shop_now')}}</view></view>
				<!-- <view class="content-box">
					<view class="tips-2">{{$t('register_success.tip2',{active_email_points:registerSuccessData.active_email_points})}}</view>
					<view class="tips-3">{{$t('register_success.tip3',{expired_time:registerSuccessData.expired_time})}}</view>
					<view class="tips-4 tip">{{$t('register_success.tip4')}}</view>
					<view class="tips-5 tip">{{$t('register_success.tip5.tip5_1')}}</view>
					<view class="tips-5 tip">{{$t('register_success.tip5.tip5_2',{contact_email:registerSuccessData.contact_email})}}</view>
					<view class="tips-5 tip"><text>{{$t('register_success.tip5.tip5_3')}}</text><text class="send-btn" :class="time>0?'_disabled':''" @click="time>0?'':handleSend()">{{time>0?time+'s':$t('register_success.tip5.tip5_3_1')}}</text></view>
					<view class="tips-5 tip">{{$t('register_success.tip5.tip5_4',{site_name:$store.state.site_name_upper})}}</view>
					<view class="tips-6">{{$t('register_success.tip6')}}</view>
				</view> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"register-success-popup",
		props: {
			registerSuccessData:{
				type:Object,
				default(){
					return{}
				}
			}
		},
		data() {
			return {
				time:0,
				clock:'',
			};
		},
		methods: {
			open(){
				this.$refs.popupRegisterSuccess.open('right');
				this.$emit('change',true);
			},
			close() {
				this.$emit('change',false);
				this.$refs.popupRegisterSuccess.close();
			},
			handleSend() {
				this.time = 60;
				this.clock = setInterval(()=>{
					if(this.time>0){
						this.time--;
					} else {
						clearInterval(this.clock)
					}
				},1000)
				this.$apis.sendActiveEmail();
			},
			shop_now(){
				this.$emit('change',false);
				this.$refs.popupRegisterSuccess.close();
				uni.switchTab({
					url: '/pages/index/index',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
// 注册成功弹窗
::v-deep {
	.r-success-popup {
		.uni-popup__wrapper {
			height: 100%;
			.popup-content {
				width: 100vw;
				height: 100%;
				overflow-y: auto;
				padding: 128rpx 32rpx;
				.rigister-icon {
					width: 130rpx;
					margin-bottom: 40rpx;
				}
				.tips-1 {
					color: #000;
					font-size: 36rpx;
					margin-bottom: 40rpx;
					text-align: center;
				}
				.shop-now-btn {
					min-width: 288rpx;
					height: 88rpx;
					line-height: 84rpx;
					padding: 0 40rpx;
					font-size: 32rpx;
					background: #000000;
					color: #fff;
					display: inline-block;
					margin-bottom: 60rpx;
					font-weight: bold;
				}
				.content-box {
					padding: 60rpx 48rpx;
					width: 100%;
					background: url('@/static/images/reg_success_bg.png') no-repeat right center;
					background-size: cover;
					margin: 0 auto;
				}
				.tips-2 {
					font-size: 32rpx;
					margin-bottom: 30rpx;
					text-align: center;
					font-weight: bold;
				}
				.tips-3 {
					font-size: 28rpx;
					color: #222;
					margin-bottom: 40rpx;
				}
				.tip {
					color: #666;
					font-size: 24rpx;
					line-height: 1.5;
					.send-btn {
						margin-left: 10rpx;
						color: #003569;
					}
				}
				.tips-6 {
					font-size: 28rpx;
					color: #222;
					margin-top: 60rpx;
				}
			}
		}
	}
}
</style>