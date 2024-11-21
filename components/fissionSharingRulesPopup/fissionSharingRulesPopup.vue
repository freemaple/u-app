<template>
	<view>
		<!-- 裂变规则弹窗 -->
		<uni-popup class="fissionRulesPopup" ref="fissionSharingRulesPopup" @change="(e)=>{$emit('popupChange',e.show)}">
			<popupContentTemplate @close="close()" :is_show_header_border="true" :title="params.title">
				<template v-slot:content>
					<view class="fission-rules-box">
						<view class="text1 font-MS">
							<view v-html="params.desc"></view>
						</view>
						<view class="fission-rules-list">
							<view class="rule-list-item" v-for="(item,index) in listData" :key="index">
								<view class="rule-content-box">
									<view class="content-img-box">
										<image class="content-img" mode="widthFix" :src="item.step_img"></image>
									</view>
									<view class="rule-content">
										<view class="line"></view>
										<view class="serial-num">{{item.name}}</view>
										<view class="content" v-html="item.desc"></view>
										<view class="line" v-if="index == listData.length - 1"></view>
									</view>
								</view>
								<!-- <view class="break-up">
									<view class="down-img-box">
										<image  v-if="item.img_jt" class="down-img" mode="widthFix":src="item.img_jt"></image>
									</view>
									<view class="line"></view>
								</view> -->
							</view>
						</view>
						<view v-if="showInviteButton" class="invite-now-btn font-bold" @click="$emit('handleInviteNow')">
							<view>{{params.btn}}</view>
							<image class="arrow-right-icon" mode="widthFix" :src="params.btn_img"></image>
						</view>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"fissionSharingRulesPopup",
		props: {
			params: {
				type: Object,
				default: () => {
					return {}
				}
			},
			listData: {
				type: Array,
				default:() => {
					return []
				}
			},
			showInviteButton: {
			type: Boolean,
			default: true
		}
		},
		data() {
			return {
				
			};
		},
		methods: {
			open() {
				this.$refs.fissionSharingRulesPopup.open('bottom');
			},
			close() {
				this.$refs.fissionSharingRulesPopup.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';
.fissionRulesPopup {
	::v-deep {
		.popup-content-template-box {
			.main-content-box {
				max-height: 80vh;
				padding: 0 61.54rpx 0 30.77rpx;
			}
		} 
	}
	.fission-rules-box {
		padding-top: 30.77rpx;
		.text1 {
			font-size: 27rpx;
			color: #393939;
			line-height: 50rpx;
			margin-bottom: 15.38rpx;
		}
		.fission-rules-list {
			.break-up {
				display: flex;
				align-items: center;
				padding-top: 15.38rpx;
				padding-bottom: 11.54rpx;
				.down-img-box {
					width: 92.31rpx;
					margin-right: 46.15rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.down-img {
						width: 30.77rpx;
						height: 30.77rpx;
					}
				}
				.line {
					flex: 1;
					height: 1px;
					background: #EEEEEE;
				}
			}
			.break-up:first-child {
				height: 0;
			}
			.rule-list-item {
				.rule-content-box {
					display: flex;
					.content-img-box{
						width: 92.31rpx;
						height: 92.31rpx;
						margin-top: 25rpx;
						margin-right: 46.15rpx;
						display: flex;
						align-items: flex-start;
						justify-content: center;
						.content-img {
							width: 100%;
							height: 100%;
						}
					}
					.rule-content {
						flex: 1;
						width: 0;
						font-size: 26.92rpx;
						.line {
							height: 1px;
							background: #EEEEEE;
						}
						.serial-num {
							font-size: 27rpx;
							color: #393939;
							line-height: 46.15rpx;
							margin-bottom: 4rpx;
							margin-top: 11.54rpx;
						}
						.content {
							line-height: 34.62rpx;
							margin-bottom: 15.38rpx;
							@include font-MRegular($fs: 27rpx, $color: #666)
						}
					}
				}
			}
			.rule-list-item:last-child {
				.break-up {
					.down-img-box {
						opacity: 0;
					}
				}
			}
		}
		.invite-now-btn {
			height: 92rpx;
			background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
			border-radius: 42rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 32.69rpx;
			font-weight: 600;
			font-family: 'Montserrat-SemiBold';
			font-size: 28rpx;
			color: #ffffff;
			.arrow-right-icon {
				width: 46.15rpx;
				margin-left: 7.69rpx;
			}
		}
	}
}
</style>