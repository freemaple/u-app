<template>
	<view>
		<!-- 裂变规则弹窗 -->
		<uni-popup class="fissionRulesPopup" ref="fissionSharingRulesPopup" @change="(e)=>{$emit('popupChange',e.show)}">
			<popupContentTemplate @close="close()" :is_show_header_border="true" :title="params.title">
				<template v-slot:content>
					<view class="fission-rules-box">
						<view class="text1 font-bold">{{params.desc}}</view>
						<view class="fission-rules-list">
							<view class="break-up">
								<view class="down-img-box">
									<image class="down-img" style="opacity: 0" mode="widthFix" src="@/static/images/fission_sharing/down-icon.png"></image>
								</view>
								<view class="line"></view>
							</view>
							<view class="rule-list-item" v-for="(item,index) in listData" :key="index">
								<view class="rule-content-box">
									<view class="content-img-box">
										<image class="content-img" mode="widthFix" :src="item.step_img"></image>
									</view>
									<view class="rule-content">
										<view class="serial-num font-bold">{{item.name}}</view>
										<view class="content" v-html="item.desc"></view>
									</view>
								</view>
								<view class="break-up">
									<view class="down-img-box">
										<image class="down-img" mode="widthFix" src="@/static/images/fission_sharing/down-icon.png"></image>
									</view>
									<view class="line"></view>
								</view>
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
.fissionRulesPopup {
	::v-deep {
		.popup-content-template-box {
			.main-content-box {
				max-height: 80vh;
			}
		} 
	}
	.fission-rules-box {
		padding: 32.69rpx 0;
		.text1 {
			font-size: 30.77rpx;
			color: #000000;
			margin-bottom: 23.08rpx;
		}
		.fission-rules-list {				
			.break-up {
				display: flex;
				align-items: center;
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
			.rule-list-item {

				.rule-content-box {
					display: flex;
					.content-img-box{
						width: 92.31rpx;
						min-height: 120rpx;
						margin-right: 46.15rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						.content-img {
							width: 100%;
						}
					}
					.rule-content {
						flex: 1;
						width: 0;
						font-size: 26.92rpx;
						.serial-num {
							color: #333333;
							line-height: 46.15rpx;
							margin-bottom: 4rpx;
						}
						.content {
							color: #666666;
							line-height: 34.62rpx;
							// letter-spacing: -0.73rpx;
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
			background: linear-gradient( 90deg, #FD4992 0%, #FE7370 49%, #FF9A49 100%), #000000;
			font-size: 30.77rpx;
			color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 32.69rpx;
			.arrow-right-icon {
				width: 46.15rpx;
				margin-left: 7.69rpx;
			}
		}
	}
}
</style>