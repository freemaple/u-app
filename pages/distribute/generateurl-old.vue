<template>
	<view class="generateUrl-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :isTitleUppercase="true" :showShadow="false" :styleType="2" :title="$t('distribute.generateurl.header')"></pageHeader>
		<image v-if="distribute_share.distribute_share_image" class="banner-img" mode="widthFix" :src="distribute_share.distribute_share_image"></image>
		<view class="box">
			<view class="my-rewards-box">
				<view class="title">{{$t('distribute.generateurl.my_rewards')}}</view>
				<view class="reward-data-box">
					<view class="bottom-circle"></view>
					<view class="top-circle"></view>
					<view class="dividing-line"></view>
					<view class="item-box">
						<view class="value">{{reward_nums}}</view>
						<view class="label">{{$t('distribute.generateurl.invited_friends')}}</view>
					</view>
					<view class="item-box">
						<view class="value">{{symbol}}{{balance_wallet_total}}</view>
						<view class="label">{{$t('distribute.generateurl.reward')}}</view>
						<image class="item-bg" mode="widthFix" src="@/static/images/distribute/generateurl/bg@2x.png"></image>
					</view>
				</view>
				<view @click="$refs.popupWithdraw.open('center')" class="dui-primary-btn">{{$t('distribute.generateurl.claim_reward_to_wallet')}}</view>
				<view @click="$public.handleNavTo('/pages/distribute/history')" class="share-history-btn">{{$t('distribute.generateurl.share_history_btn')}}</view>
			</view>
			<view class="invitation-process-box">
				<view class="title">{{$t('distribute.generateurl.invitation_process')}}</view>
				<view class="step-box">
					<view class="step-item">
						<image mode="widthFix" src="@/static/images/distribute/generateurl/step1@2x.png" />
						<view class="text1">{{$t('distribute.generateurl.step1.title')}}</view>
						<view class="text2">{{$t('distribute.generateurl.step1.content')}}</view>
					</view>
					<view class="step-item item-center">
						<image mode="widthFix" src="@/static/images/distribute/generateurl/step2@2x.png" />
						<view class="text1">{{$t('distribute.generateurl.step2.title')}}</view>
						<view class="text2">{{$t('distribute.generateurl.step2.content')}}</view>
					</view>
					<view class="step-item">
						<image mode="widthFix" src="@/static/images/distribute/generateurl/step3@2x.png" />
						<view class="text1">{{$t('distribute.generateurl.step3.title')}}</view>
						<view class="text2">{{$t('distribute.generateurl.step3.content')}}</view>
					</view>
				</view>
				<view class="text-center">
					<view @click="$refs.popupDistributeTip.open('center')" class="detailed_rules-btn">{{$t('distribute.generateurl.detailed_rules')}}</view>
				</view>
			</view>
			<view class="share-link-box">
				<view class="title">{{$t('distribute.generateurl.share_link')}}</view>
				<view class="link-box">
					<view class="flex your_code align-items-center justify-content-center" v-if="aicode">
						<view class="label">{{ $t('distribute.generateurl.your_code') }}</view><view class="code flex align-items-center justify-content-center">{{ aicode }}</view><view class="copy" @tap="()=>{handleCopyCode(aicode)}">{{ $t('distribute.generateurl.copy') }}</view>
					</view>
					<view class="item-box" v-for="(item,index) in share_list" :key="index">
						<view class="header">
							<view class="left">
								<text class="text1">{{item.title}}</text>
								<image class="icon" v-if="item.type=='app'" mode="widthFix" src="@/static/images/distribute/generateurl/phone_icon@2x.png" />
								<image class="icon" v-if="item.type=='web'" mode="widthFix" src="@/static/images/distribute/generateurl/web_icon@2x.png" />
							</view>
							<view class="right">
								<text>({{$t('distribute.generateurl.you_friends_earn')}}</text>
								<text class="price">{{item.money}}</text>
								<text>)</text>
							</view>
						</view>
						<view class="link">{{item.url}}</view>
						<view class="copy-share-box">
							<view class="copy" @click="handleCopy(item)">
								<image class="icon" mode="widthFix" src="@/static/images/distribute/generateurl/copy_icon@2x.png" />
								<text>{{$t('distribute.generateurl.copyurl')}}</text>
							</view>
							<view class="share" @click="handleShare(item)">
								<block v-if="item.type =='app'">
									<image mode="widthFix" class="icon" src="@/static/images/distribute/generateurl/phone_icon@2x.png" />
									<text>{{$t('distribute.generateurl.share_app_link')}}</text>
								</block>
								<block v-else>
									<image mode="widthFix" class="icon" src="@/static/images/distribute/generateurl/web_icon@2x.png" />
									<text>{{$t('distribute.generateurl.share_website_link')}}</text>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 裂变提示 -->
		<uni-popup ref="popupDistributeTip" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:652rpx">
				<view class="tip-wrapper">
					<view class="tip-bg">
						<view class="tip-title">{{$t('distribute.generateurl.detailed_rules')}}</view>
						<image @click="$refs.popupDistributeTip.close()" class="close-img" mode="widthFix" src="@/static/images/distribute/close.png" />
						<view class="tip-box">
							<view class="content">
								<view v-html="distribute_share.distribute_share_article"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 分享弹窗 -->
		<uni-popup ref="popupShare" class="share-popup" @change="(e)=>{pageMetaShow = e.show;}">
			<popupContentTemplate :is_show_header_border="true" :title="$t('goods_detail.share_to')" @close="$refs.popupShare.close()">
				<template v-slot:content>
					<shareBar :isDifferPlatformWord="true" :shareData="shareData"></shareBar>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 提现弹窗 -->
		<uni-popup ref="popupWithdraw" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content withdraw-content" style="width:652rpx">
				<view class="title">{{$t('distribute.generateurl.save_to_my_wallet')}}</view>
				<image @click="$refs.popupWithdraw.close()" class="close-img" mode="widthFix" src="@/static/images/distribute/close.png"></image>
				<view class="item dashed">
					<view class="label">{{$t('distribute.generateurl.account_balance')}}</view>
					<view class="value">{{symbol}}{{balance_wallet_total}}</view>
				</view>
				<view class="item">
					<view class="label">{{$t('distribute.generateurl.currently_available_for_withdrawal')}}</view>
					<view class="value">{{symbol}}{{available_wallet_total}}</view>
				</view>
				<view class="item">
					<view class="label">{{$t('distribute.generateurl.previously_withdrawal')}}</view>
					<view class="value">{{symbol}}{{withdraw_wallet_total}}</view>
				</view>
				<view class="pending-box dashed">
					<view class="item">
						<view class="label">{{$t('distribute.generateurl.pending_to_withdrawal')}}</view>
						<view class="value pending">{{symbol}}{{pending_wallet_total}}</view>
					</view>
					<view v-if="pending_wallet_total" class="pending-day">({{pending_day}} {{$t('distribute.generateurl.days_until_withdrawal')}})</view>
				</view>
				<view class="_btn save-btn" :class="available_wallet_total>0?'':'disabled'" @click="available_wallet_total>0?handleSave():''">{{$t('distribute.generateurl.save_btn')}}</view>
				<view class="_btn cancle-btn" @click="$refs.popupWithdraw.close()">{{$t('distribute.generateurl.cancle_btn')}}</view>
			</view>
		</uni-popup>
		<!-- 提现成功弹窗 -->
		<uni-popup ref="popupWithdrawSuccess" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content withdraw-success-content" style="width:652rpx">
				<view class="title">{{$t('distribute.generateurl.withdrawal_successful')}}</view>
				<image @click="$refs.popupWithdrawSuccess.close()" class="close-img" mode="widthFix" src="@/static/images/distribute/close.png" />
				<view class="img-box">
					<image mode="widthFix" src="@/static/images/distribute/success.png" class="image"></image>
				</view>
				<view class="text">{{$t('distribute.generateurl.text1')}}</view>
				<view class="text">{{$t('distribute.generateurl.text2')}}</view>
				<view class="text">
					<text>{{$t('distribute.generateurl.text3')}}</text>
					<text class="to-wallet" @click="handleToWallet">{{$t('distribute.generateurl.text4')}}</text>
					<text>{{$t('distribute.generateurl.text5')}}</text>
				</view>
				<view class="ok_btn" @click="$refs.popupWithdrawSuccess.close()">{{$t('distribute.generateurl.ok')}}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageMetaShow:false,
				share_list:[],
				shareData:{},
				share_media:[
					{
						name:'Email',
						image:require('@/static/images/share-bar-icon/icon_email.png')
					},
					{
						name:'Twitter',
						image:require('@/static/images/share-bar-icon/icon_twitter.png'),
					},
					{
						name:'Facebook',
						image:require('@/static/images/share-bar-icon/icon_facebook.png'),
					},
					{
						name:'Pinterest',
						image:require('@/static/images/share-bar-icon/icon_pinterest.png')
					}
				],
				distribute_share:{
					distribute_share_image:'',
					distribute_share_article: ''
				},
				distribute_tips:'',
				reward_nums:'', // 邀请数量
				available_wallet_total:'', //可提现金额
        withdraw_wallet_total:'', //已体现金额
				balance_wallet_total:'', // 总金额
				pending_wallet_total:'', // 冻结金额
				pending_day:'',//解冻添加
				is_double_point:false,// 当前用户是否获得双倍积分
				symbol:'',
				isLoad: false,
				aicode: '',
			}
		},
		onLoad(){
			this.getInfo();
		},
		methods: {
			handleToWallet() {
				this.$refs.popupWithdrawSuccess.close();
				setTimeout(()=>{
					this.$public.handleNavTo('/pages/my/wallet/index');
				},1)
			},
			handleSave() {
				// 当前用户已经满足双倍积分，直接提现，否则跳提现页面
				if(this.is_double_point) {
					uni.showLoading();
					this.$apis.withdrawToWallet().then(res=>{
						uni.hideLoading();
						this.$refs.popupWithdrawSuccess.open('center');
						this.$refs.popupWithdraw.close();
						this.getInfo();
					}).catch(e=>{
						uni.hideLoading();
					})
				} else {
					this.$public.handleNavTo('/pages/distribute/history?type=1');
					this.$refs.popupWithdraw.close();
				}
			},
			handleShare(item) {
				this.shareData.url = item.url;
				this.shareData.share_link_type = item.type;
				this.$refs.popupShare.open('bottom');
			},
			handleCopy(item) {
				var that = this;
				uni.setClipboardData({
					data: item.copy_content || item.url,
					showToast:false,
					success() {
						uni.showToast({
						    title: that.$t('distribute.generateurl.copy_success'),
						    icon: 'none',
						    duration: 3000
						});
						that.shareRecord('copy_url', {
							share_url: item.url,
							share_link_type: item.type
						});
					}
				})
			},
			handleCopyCode(aicode){
				this.$copyId(aicode);
				this.shareRecord('copy_code', {
					share_code: aicode
				});
			},
			shareRecord(type,op){
				var r_data = {
					platform_type: type,
					share_from: 'distribute',
					share_type: 'app'
				}
				if(op.share_link_type){
					r_data.share_link_type = op.share_link_type;
				}
				var matomo_copy_val = '';
				var matomo_event_name = '';
				var matomo_event_action = '';
				if(type == 'copy_code'){
					if(op.share_code){
						r_data.share_code = op.share_code;
						matomo_copy_val = op.share_code;
						matomo_event_name = 'share code copy from code';
						matomo_event_action = "copy_code";
					}
				} else {
					if(op.share_url){
						r_data.share_url = op.share_url;
						matomo_copy_val = op.share_url;
						matomo_event_name = 'share code copy from ' + op.share_link_type;
						matomo_event_action = "copy_link_" + op.share_link_type;
					}
				}
				if(this.$store.getters.hasLogin){
					this.$apis.shareRecord(r_data);
				}
				this.$trackEvent.shareSite(r_data);
				if(matomo_event_action){
					this.$trackEvent.share_code({"event_action":matomo_event_action,"event_name":matomo_event_name,"copy_val":matomo_copy_val});
				}
			},
			getInfo() {
				this.$apis.distributeShareInfo().then(res => {
					this.aicode = res.data.aicode
					this.isLoad = true;
					let result = res.data;
					this.distribute_share = result.distribute_share;
					this.distribute_tips = result.distribute_tips;
					this.share_list = result.share_list;
					this.shareData = {
						share_from: 'distribute',
						description: this.distribute_share.distribute_share_description,
						url: '',
						hashtag:this.distribute_share.distribute_share_tags,
						image: this.distribute_share.distribute_share_image,
						subject:this.distribute_share.distribute_share_title,
						...this.distribute_share
					};
					this.reward_nums=result.reward_nums; // 邀请数量
					this.available_wallet_total=result.available_wallet_total; //可提现金额
          this.withdraw_wallet_total=result.withdraw_wallet_total; //已提现金额
					this.balance_wallet_total=result.balance_wallet_total; // 总金额
					this.pending_wallet_total=result.pending_wallet_total; // 冻结金额
					this.pending_day = result.pending_day// 解冻天数
					this.is_double_point = result.is_double_point // 当前用户是否获得双倍积分
					this.symbol = result.symbol
					uni.hideLoading()
				}).catch(() => {
					this.isLoad = true;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.your_code{
	font-size: 24rpx;
	flex-wrap: nowrap;
	margin-bottom: 20rpx;
	.label{
		font-size: 24rpx;
	}
	.code{
		color: red;
		margin-left: 20rpx;
	}
	.copy{
		border: 1px solid #ccc;
		margin-left: 20rpx;
		padding: 6rpx 8rpx;
	}
}
.generateUrl-box {
	background: #FFF9F1;
	.box {
		position: relative;
		margin-top: -180rpx;
		padding: 0 32rpx 100rpx 32rpx;
		.my-rewards-box {
			background: #fff;
			padding: 32rpx 46rpx 32rpx 32rpx;
			box-shadow: 0px 8rpx 16rpx 0px rgba(194,123,27,0.25);
			.title {
				color: #333;
				font-size: 32rpx;
				margin-bottom: 24rpx;
				text-align: center;
				font-weight: bold;
			}
			.reward-data-box {
				background-color: #FFF9F1;
				display: flex;
				border-radius: 16rpx;
				position: relative;
				margin-bottom: 48rpx;
				.top-circle {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					background: #fff;
					border-radius: 50%;
					left: 50%;
					transform: translateX(-50%);
					top: -12rpx;
				}
				.bottom-circle {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					background: #fff;
					border-radius: 50%;
					left: 50%;
					transform: translateX(-50%);
					bottom: -12rpx;
				}
				.dividing-line {
					position: absolute;
					width: 8rpx;
					top: 20rpx;
					left: 50%;
					transform: translateX(-50%);
					bottom: 20rpx;
					border-right: 4rpx solid transparent;
					margin-left: -2rpx;
					background: linear-gradient(#FFF9F1, #FFF9F1) padding-box, repeating-linear-gradient(0deg, #FFEACA 0, #FFEACA 14rpx, #FFF9F1 0, #FFF9F1 20rpx);
				}
				.item-box {
					width: 0;
					flex: 1;
					text-align: center;
					padding: 74rpx 0 48rpx 0;
					position: relative;
					word-break: break-word;
					.value {
						font-size: 64rpx;
						color: #000;
						margin-bottom: 46rpx;
						font-weight: bold;
					}
					.label {
						color: #999;
						font-size: 24rpx;
					}
					.item-bg {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 288rpx;
					}
				}
			}
			.dui-primary-btn {
				font-size: 28rpx;
				margin-bottom: 28rpx;
			}
			.share-history-btn {
				font-size: 28rpx;
				color: #0071E3;
				text-align: center;
			}
		}
		.invitation-process-box {
			background: #fff;
			margin-top: 64rpx;
			margin-bottom: 64rpx;
			padding: 40rpx 32rpx 48rpx 32rpx;
			.title {
				text-align: center;
				color: #333;
				font-size: 36rpx;
				font-weight: bold;
				margin-bottom: 54rpx;
			}
			.step-box {
				display: flex;
				flex-wrap: nowrap;
				.step-item {
					width: 30%;
					text-align: center;
					word-break: break-word;
					font-size: 24rpx;
					color: #333;
					line-height: 36rpx;
					image {
						width: 120rpx;
					}
					.text1{
						font-weight: bold;
						margin: 20rpx 0 10rpx 0;
					}
				}
				.step-item.item-center {
					width: 40%;
					padding: 0 20rpx;
				}
			}
			.detailed_rules-btn {
				border-radius: 60rpx;
				border: 1px solid #000000;
				display: inline-block;
				margin-top: 38rpx;
				font-size: 28rpx;
				color: #333;
				padding: 10rpx 20rpx;
			}
		}
		.share-link-box {
			background: #fff;
			padding: 46rpx 70rpx 60rpx 70rpx;
			.title {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 56rpx;
				text-align: center;
			}
			.link-box {
				.item-box {
					margin-bottom: 32rpx;
					.header {
						position: relative;
						display: flex;
						justify-content: space-between;
						margin-bottom:20rpx;
						padding: 0;
						.left {
							padding-left: 28rpx;
							display: flex;
							align-items: center;
							.text1{
								font-size: 28rpx;
								color: #333;
								margin-right: 16rpx;
								
							}
							.icon {
								width: 32rpx;
							}
						}
						.left::before{
							content: '';
							width: 12rpx;
							height: 12rpx;
							position: absolute;
							border-radius: 50%;
							left: 0;
							background: #FFC773;
							top: 50%;
							transform: translateY(-50%);
						}
						.right {
							font-size: 24rpx;
							.price{
								color: #FF005D;
								font-weight: bold;
								margin-left: 8rpx;
							}
						}
					}
					.link {
						background: #F5F5F5;
						padding: 20rpx 32rpx;
						color: #333;
						font-size: 28rpx;
						margin-bottom: 24rpx;
						word-break: break-all;
					}
					.copy-share-box {
						display: flex;
						justify-content: space-between;
						color: #000;
						font-size: 24rpx;
						.copy {
							display: flex;
							align-items: center;
							padding: 20rpx;
							background: #FFEACA;
							border-radius: 8rpx;
							margin-right: 32rpx;
							.icon {
								width: 32rpx;
								margin-right: 10rpx;
							}
						}
						.share {
							flex: 1;
							width: 0;
							background: #FFC773;
							border-radius: 8rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							.icon {
								width: 32rpx;
								margin-right: 10rpx;
							}
						}
					}
				}
				.item-box:last-child{
					margin-bottom: 0;
				}
			}
		}
	}
	.banner-img {
		width: 100%;
	}
	.header {
		font-size: 30rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
	}
}
.tip-wrapper{
	background: linear-gradient(135deg, #FFD595 0%, #FFF5E6 100%);
	border-radius: 16rpx;
	position: relative;
	.tip-bg {
		padding: 24rpx;
		background-image: url('@/static/images/distribute/generateurl/rule_bg@2x.png');
		background-size: cover;
	}
	.tip-title {
		color: #333;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 24rpx;
	}
	.close-img {
		width: 36rpx;
		position: absolute;
		top: 24rpx;
		right: 24rpx;
	}
	.tip-box {
		padding: 20rpx 32rpx;
		background: #fff;
		border-radius: 16rpx;
		max-height: 56vh;
		overflow: auto;
		.content {
			font-size: 28rpx;
			line-height: 1.5;
		}
	}
}

.withdraw-content {
	background: #fff;
	border-radius: 16rpx;
	padding: 60rpx 36rpx 36rpx 36rpx;
	position: relative;
	.title {
		color: #000;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
		margin-bottom: 50rpx;
	}
	.close-img {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		width: 36rpx;
	}
	.item {
		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap;
		padding: 20rpx 0;
		.label {
			flex: 1;
			width: 0;
			color: #000;
			font-size: 28rpx;
		}
		.value {
			color: #000;
			font-size: 32rpx;
			font-weight: bold;
		}
		.value.pending {
			color: #999999;
		}
	}
	.pending-box {
		padding: 20rpx 0;
		.item {
			padding: 0;
		}
		.pending-day {
			color: #999999;
			font-size: 28rpx;
		}
	}
	.dashed {
		border-bottom: 1px dashed #999999;
	}
	._btn {
		height: 84rpx;
		color: #FFFFFF;
		background: #000000;
		border: 1px solid #000;
		border-radius: 8rpx;
		font-size: 32rpx;
		text-align: center;
		width: 100%;
		line-height: 84rpx;
	}
	.save-btn {
		margin: 124rpx 0 24rpx 0;
	}
	.save-btn.disabled {
		background: #666;
		border-color: #666;
	}
	.cancle-btn {
		background: #fff;
		color: #000;
	}
}
.withdraw-success-content {
	background: #fff;
	border-radius: 16rpx;
	padding: 60rpx 48rpx 48rpx 48rpx;
	position: relative;
	.title {
		font-size: 32rpx;
		color: #000;
		text-align: center;
		font-weight: bold;
	}
	.close-img {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		width: 36rpx;
	}
	.img-box {
		text-align: center;
		margin-top: 70rpx;
		margin-bottom: 48rpx;
		.image {
			width: 144rpx;
		}
	}
	.text {
		font-size: 28rpx;
		color: #000;
		line-height: 44rpx;
		text-align: center;
		padding: 0 20rpx;
		.to-wallet {
			color: #0071E3;
			margin: 0 8rpx;
			text-decoration: underline;
		}
	}
	.ok_btn {
		margin-top: 70rpx;
		height: 84rpx;
		color: #FFFFFF;
		background: #000000;
		border: 1px solid #000;
		border-radius: 8rpx;
		font-size: 32rpx;
		text-align: center;
		width: 100%;
		line-height: 84rpx;
	}
}
</style>
