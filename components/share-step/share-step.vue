<template>
	<view class="share-and-win-main" :class="stepTyle == 2 ? 'share-and-win-main2' : ''">
		<view class="share-content-box">
			<view class="text1"><i>{{textParam.uni_earn_cash_rewards}}{{textParam.uni_within_dressin}}</i></view>
			<view class="share-content-box-main">
				<view class="text2-box">
					{{textParam.you_and_your_friend}}
				</view>
				<view class="text-both">
					<view></view> <i>{{textParam.both}}</i> <view></view>
				</view>
				<view class="text3-box">
					<view class="text3-get">{{textParam.get}}</view>
					<view class="text3-1 font-family-KronaOne" :style="String(textParam.inviter_money).length>2?'font-size:180rpx':''">
						<view class="text3-1-content">
							<view class="text3-1-money">{{textParam.symbol}}</view>
							<view class="">
								{{textParam.inviter_money}}
							</view>
						</view>
						<view class="text3-1-content text3-1-bg">
							<view class="text3-1-money">{{textParam.symbol}}</view>
							<view class="">
								{{textParam.inviter_money}}
							</view>
						</view>
					</view>
				</view>
				<view class="text4-box">
					<image class="text4-img-bg" mode="widthFix" src="@/static/images/new-cashgrab-rewards/cash_bg.png"></image>
					<view class="text4" v-html="textParam.uni_unlimited"></view>
				</view>
				<view class="text5-box">
					<view>
						<text v-html="textParam.invite_friends_line1"></text>
						<text v-html="textParam.invite_friends_line2"></text>
					</view>
					<view class="" v-html="textParam.invite_friends_line3"></view>
				</view>
				<view class="text6-box">
					<view></view>
					<image class="text6-box-img" mode="widthFix" src="@/static/images/new-cashgrab-rewards/line2.png"></image>
				</view>
				<view class="text7-box">
					<image class="text7-img" mode="widthFix" src="@/static/images/new-cashgrab-rewards/line.png"></image>
				</view>
			</view>
			<view @click="$emit('showSharePopup')" class="invite-now-btn">{{textParam.invite_now}}</view>
			<view class="fraudulent flex align-items-center justify-content-center" @tap="$emit('showFraudulent')">
				<image src="@/static/images/new-cashgrab-rewards/lb.png" mode="widthFix" class="tip-img"></image>
				<text>{{textParam.fraudulent_title}}</text>
			</view>
			<view class="rules-box"  @click="$emit('showRules')" >
				<view class="rules-text">{{textParam.rules}}</view>
				<image class="prompt-img" mode="widthFix" src="@/static/images/fission_sharing/prompt.png"></image>
			</view>
		</view>
		<view class="step-footer-box" v-if="stepTyle == '1'">
			<image class="step-footer-box-bg" mode="widthFix" src="@/static/images/new-cashgrab-rewards/cashgrab_off_bg@2x.png"></image>
			<view class="step-footer-money step-footer-money1">{{textParam.symbol}}{{textParam.inviter_money}}</view>
			<view class="step-footer-money step-footer-money2">{{textParam.nextorder_rate}}</view>
			<view class="step-footer-money3">
				{{textParam.get}}{{textParam.symbol}}{{textParam.inviter_money}}
			</view>
		</view>		
	</view>
</template>

<script>
	export default {
		name:"share-step",
		props: {
			textParam: {
				type: Object,
				default: ()=>{
					return {}
				}
			},
			// 1 banner营销页样式; 2 从个人中心进入的样式
			stepTyle: {
				type: String,
				default: '1'
			}
		},
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss" scoped>
.share-and-win-main {
	min-height: calc(100vh - 96rpx - 96.16rpx);
	background-image: url('@/static/images/fission_sharing/fission_bg_2.png');
	background-size: cover;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	.share-content-box {
		padding-top: 108rpx;
		.text1 {
			text-align: center;
			font-size: 32rpx;
			height: 96rpx;
			padding-top: 12rpx;
			width: 608rpx;
			background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
			border-radius: 16rpx;
			color: #fff;
			margin-left: 32rpx;
			font-family: 'Jost-SemiBold';
		}
		.share-content-box-main {
			background: linear-gradient( 230deg, #F0EAFF 0%, #FFEAFE 100%);
			border-radius: 16rpx;
			margin: -25rpx 32rpx 0;
		}
		.text2-box {
			text-align: center;
			padding-top: 62rpx;
			color: #3F1867;
			margin-bottom: 15.38rpx;
			font-size: 40rpx;
			font-family: 'Montserrat-SemiBold';
			font-weight: 600;
		}
		.text-both {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #3F1867;
			margin-bottom: 20rpx;
			view {
				width: 32rpx;
				height: 2rpx;
				background: #41176D;
			}
			i {
				margin: 0 24rpx;
			}
		}
		.text3-box {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 17.31rpx;
			.text3-1 {
				position: relative;
				font-size: 216rpx;
				color: #41176D;
				text-shadow: 
					-1px -1px 0 #fff,  
					 1px -1px 0 #fff,
					-1px  1px 0 #fff,
					 1px  1px 0 #fff;
					 -webkit-text-stroke: 3.85rpx #fff;
					 text-stroke: 3.85rpx #fff;
				.text3-1-money {
					font-size: 168rpx;
				}
				.text3-1-bg {
					position: absolute;
					top: -8rpx;
					left: -8rpx;
				}
				.text3-1-content {
					display: flex;
					align-items: center;
					view {
						margin-right: -15rpx;
					}
				}
			}
			.text3-get {
				height: 76rpx;
				width: 168rpx;
				background: #41176D;
				border-radius: 8rpx;
				font-family: 'Montserrat-Bold';
				font-size: 56rpx;
				color: #FFFFFF;
				letter-spacing: 4rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				text-align: center;
				transform: rotate(-90deg);
				margin-right: -34rpx;
			}
		}
		.text4-box {
			position: relative;
			padding: 0 34rpx;
			margin-bottom: 52rpx;
			.text4-img-bg {
				width: 100%;
			}
			.text4 {
				position: absolute;
				color: #fff;
				font-size: 22rpx;
				line-height: 60rpx;
				left: 0;
				right: 0;
				text-align: center;
				top: 0;
				bottom: 0;
			}
		}
		.text5-box {
			font-size: 28rpx;
			color: #41176D;
			text-align: center;
			word-spacing: -1px;
		}
		.text6-box {
			display: flex;
			justify-content: space-between;
			margin: 12rpx 22rpx 0 0;
			.text6-box-img {
				width: 48rpx;
			}
		}
		.text7-box {
			margin: 0 22rpx;
			display: flex;
			padding: 12rpx 0;
			.text7-img {
				width: 100%;
			}
		}
		.invite-now-btn {
			height: 92.31rpx;
			color: #41176D;
			font-size: 30.77rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: url(@/static/images/new-cashgrab-rewards/btn_bg.png);
			background-size: 100% 100%;
			margin: 46rpx 48rpx 26rpx;
			font-family: 'Montserrat-Bold';
		}
		.fraudulent {
			font-size: 20rpx;
			color: #333333;
			text-decoration-line: underline;
			margin-top: 31rpx;
			text-align: center;
			margin-bottom: 51rpx;
			.tip-img {
				width: 31rpx;
				margin-right: 8rpx;
			}
		}
		.rules-box {
			position: absolute;
			right: 0;
			top: 128rpx;
			width: 145rpx;
			height: 62rpx;
			display: flex;
			align-items: center;
			justify-content: end;
			background: #F6F2FF;
			border-radius: 31rpx 0rpx 0rpx 31rpx;
			padding-right: 6rpx;
			.rules-text {
				text-decoration: underline;
				color: #41176D;
				font-size: 24rpx;
			}
			.prompt-img {
				width: 46.15rpx;
			}
		}
	}
}
.step-footer-box {
	position: relative;
	height: 208rpx;
	.step-footer-box-bg {
		width: 100%;
		position: absolute;
		left: 0;
		height: 208rpx;
		bottom: 0;
	}
	.step-footer-money {
		position: absolute;
		color: #fff;
		font-size: 40rpx;
		transform: rotate(24deg);
	}
	.step-footer-money1 {
		left: 64rpx;
		top: 50rpx;
	}
	.step-footer-money2 {
		width: 84rpx;
		font-size: 32rpx;
		line-height: 1;
		left: 220rpx;
		top: 90rpx;
		text-align: center;
		word-break: break-word;
	}
	.step-footer-money3 {
		position: absolute;
		color: #41176D;
		font-family: 'Montserrat-Regular';
		right: 58rpx;
		top: 84rpx;
		transform: rotate(-13deg) scale(0.35);
	}
}
.share-and-win-main2 {
	display: block;
}
</style>