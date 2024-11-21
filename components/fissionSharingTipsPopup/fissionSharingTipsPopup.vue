<template>
	<view>
		<!-- 裂变提示弹窗 -->
		<uni-popup class="fissionSharingPopup" ref="fissionSharingTipsPopup" @change="(e)=>{$emit('popupChange',e.show)}">
			<popupContentTemplate @close="close()" :is_show_header_border="false" :title="$t('fission_sharing.popup_title',{site_name: $store.state.site_name_upper})">
				<template v-slot:content>
					<view class="fission-tips-box">
						<view class="img-box">
							<image class="img" mode="widthFix" src="@/static/images/fission_sharing/fission_tips_popup_icon.png"></image>
						</view>
						<view class="tips-main-box">
							<view class="tip-text font-MM" v-for="(item,index) in tipsData">
								{{index + 1}}.<view class="tip-html" v-html="item"></view>
							</view>
						</view>
						<view @click="$public.handleNavTo(navToUrl)" class="register-now-btn font-MB">
							<view>{{$t('fission_sharing.popup_btn_text')}}</view>
							<image class="arrow-right-icon" mode="widthFix" src="@/static/images/fission_sharing/arrow_right.png"></image>
						</view>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"fissionSharingTipsPopup",
		props: {
			tipsData: {
				type: Array,
				default:()=>{
					return []
				}
			},
			navToUrl: {
				type: String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			open() {
				this.$refs.fissionSharingTipsPopup.open('bottom');
			},
			close() {
				this.$refs.fissionSharingTipsPopup.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
.fissionSharingPopup {
	::v-deep {
		.main-content-box {
			padding: 0 46.15rpx;
			max-height: 80vh;
		}
	}
	.fission-tips-box {
		padding-top: 29.54rpx;
		.img-box {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30.77rpx;
			.img {
				width: 165.38rpx;
			}
		}
		.tips-main-box {
			.tip-text {
				margin-bottom: 23.08rpx;
				font-size: 26.92rpx;
				color: #393939;
				line-height: 42.31rpx;
				display: flex;
				.tip-html {
					padding-left: 10rpx;
				}
			}
		}
		.register-now-btn {
			margin-top: 48.08rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 30.77rpx;
			height: 92rpx;
			background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
			border-radius: 73rpx;
			.arrow-right-icon {
				width: 46.15rpx;
				margin-left: 7.69rpx;
			}
		}
	}
}
</style>