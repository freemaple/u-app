<template>
	<view class="share-and-win-main">
		<image class="share-bg" mode="widthFix" src="@/static/images/fission_sharing/fission_bg_1.png"></image>
		<view class="share-content-box">
			<view class="text1 font-family-KronaOne">{{textParam.earn_cash_rewards}}<br>{{textParam.within_dressin}}</view>
			<view class="text2-box font-family-KronaOne">
				<view class="text2-1 ">{{textParam.you}}</view>
				<view class="text2-2">
					<view class="text2-2-1">{{textParam.and_your}}</view>
					<view class="text2-2-2">{{textParam.friends}}</view>
				</view>
			</view>
			<view class="text3-box">
				<image class="img-1" mode="widthFix" src="@/static/images/fission_sharing/fission_money.png"></image>
				<view class="text3-1 font-family-KronaOne" :style="String(textParam.inviter_money).length>2?'font-size:180rpx':''">{{textParam.inviter_money}}</view>
				<image class="img-2" mode="widthFix" src="@/static/images/fission_sharing/fission_text.png"></image>
			</view>
			<view class="text4-box font-bold">
				<image class="text4-img-bg" mode="widthFix" src="@/static/images/fission_sharing/fission_text_bg.png"></image>
				<view class="text4" v-html="textParam.unlimited"></view>
			</view>
			<view class="text5-box font-bold">
				{{textParam.invite_friends}}
			</view>
			<view class="plus-line">
				<view class="line"></view>
				<view class="text">{{textParam.plus}}</view>
				<view class="line"></view>
			</view>
			<view class="text6-box">{{textParam.they_get}}</view>
			<view @click="$emit('showSharePopup')" class="invite-now-btn font-bold">{{textParam.invite_now}}</view>
			<view class="fraudulent flex align-items-center justify-content-center font-family-Jost" @tap="$emit('showFraudulent')">
				<image src="@/static/images/fraudulent-popup/tip.png" mode="widthFix" class="tip-img"></image>
				<text>{{textParam.fraudulent_title}}</text>
			</view>
			<view class="rules-box"  @click="$emit('showRules')" >
				<view class="rules-text">{{textParam.rules}}</view>
				<image class="prompt-img" mode="widthFix" src="@/static/images/fission_sharing/prompt.png"></image>
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
	min-height: calc(100vh - 96rpx - 115.38rpx);
	background-image: url('@/static/images/fission_sharing/fission_bg_2.png');
	background-size: cover;
	position: relative;
	.share-bg {
		width: 100%;
	}
	.share-content-box {
		margin-top: -36.53rpx;
		.text1 {
			text-align: center;
			font-weight: 400;
			font-size: 31rpx;
			color: #ffffff;
			line-height: 46.15rpx;
			margin-bottom: 23.08rpx;
		}
		.text2-box {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000000;
			font-weight: 400;
			margin-bottom: 15.38rpx;
			.text2-1 {
				font-size: 92.31rpx;
				line-height: 108.17rpx;
				margin-right: 11.54rpx;
			}
			.text2-2-1 {
				font-size:30.77rpx;
				line-height: 36.06rpx;
			}
			.text2-2-2 {
				font-size: 38.46rpx;
				line-height: 45.07rpx;
			}
		}
		.text3-box {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			margin-bottom: 17.31rpx;
			.img-1 {
				width: 151.92rpx;
			}
			.text3-1 {
				line-height: 1;
				font-size: 273.08rpx;
				color: #ffffff;
				text-shadow: 
					-1px -1px 0 #000,  
					 1px -1px 0 #000,
					-1px  1px 0 #000,
					 1px  1px 0 #000;
					 -webkit-text-stroke: 3.85rpx #000000;
					 text-stroke: 3.85rpx #000000;
			}
			.img-2 {
				width: 105.77rpx;
			}
		}
		.text4-box {
			position: relative;
			padding: 0 48rpx;
			margin-bottom: 48.08rpx;
			.text4-img-bg {
				width: 100%;
			}
			.text4 {
				position: absolute;
				color: #333333;
				font-size: 26.92rpx;
				line-height: 60rpx;
				left: 0;
				right: 0;
				text-align: center;
				top: 0;
				bottom: 0;
			}
		}
		.text5-box {
			font-size: 30.77rpx;
			color: #000000;
			text-align: center;
			word-spacing: -1px;
		}
		.plus-line {
			padding: 24rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				font-size: 26.92rpx;
				color: #333333;
				padding: 0 40rpx;
			}
			.line {
				flex: 1;
				width: 0;
				height: 1px;
				background: #333333;
			}
		}
		.text6-box {
			font-size: 26.92rpx;
			color: #333333;
			line-height: 40.38rpx;
			margin-bottom: 42.31rpx;
			text-align: center;
		}
		.invite-now-btn {
			height: 92.31rpx;
			margin: 0 48rpx;
			color: #fff;
			font-size: 30.77rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #000000;
			box-shadow: 0rpx 8rpx 8rpx 0rpx #D64D00;
		}
		.fraudulent {
			font-size: 23rpx;
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
			top: 260rpx;
			width: 145rpx;
			height: 62rpx;
			display: flex;
			align-items: center;
			justify-content: end;
			background: #FFE9C2;
			border-radius: 31rpx 0rpx 0rpx 31rpx;
			padding-right: 6rpx;
			.rules-text {
				text-decoration: underline;
				color: #333333;
				font-size: 27rpx;
			}
			.prompt-img {
				width: 46.15rpx;
			}
		}
	}
}
</style>