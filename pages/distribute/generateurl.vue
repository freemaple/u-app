<template>
	<view class="generateUrl-box dui-padding-top-header" style="padding-bottom: 98rpx;">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :isTitleUppercase="true" :showShadow="false" :styleType="2" :title="$t('distribute.generateurl.header')"></pageHeader>
		<shareStep
			stepTyle="2"
			:textParam="text_param"
			@showRules="handleShowRules" 
			@showSharePopup="showSharePopup"
			@showFraudulent="$refs.fraudulentPopup.open()"
			></shareStep>
		<view class="box">
			<view class="my-rewards-box">
				<view class="title">{{$t('distribute.generateurl.my_rewards')}}</view>
				<view class="reward-data-box">
					<view class="bottom-circle"></view>
					<view class="top-circle"></view>
					<!-- <view class="dividing-line"></view> -->
					<view class="item-box">
						<view class="value">{{reward_nums}}</view>
						<view class="label">{{$t('distribute.generateurl.invited_friends')}}</view>
					</view>
					<view class="item-box">
						<view class="value">{{symbol}}{{balance_wallet_total}}</view>
						<view class="label">{{$t('distribute.generateurl.reward')}}</view>
						<image class="item-bg" mode="widthFix" :src="distribute_share_and_win_step.my_rewards_bg.uni_img"></image>
					</view>
				</view>
				<view @click="claimRewardToWallet" class="dui-primary-btn" id="claim_reward_to_wallet_btn">{{$t('distribute.generateurl.claim_reward_to_wallet')}}</view>
				<view @click="shareHistoryHandel" class="share-history-btn" id="share-history-btn">{{$t('distribute.generateurl.share_history_btn')}}</view>
			</view>
		</view>
		<view class="step-footer-box">
			<image class="step-footer-box-bg" mode="widthFix" src="@/static/images/new-cashgrab-rewards/cashgrab_off_bg@2x.png"></image>
			<view class="step-footer-money step-footer-money1">{{text_param.symbol}}{{text_param.inviter_money}}</view>
			<view class="step-footer-money step-footer-money2">{{text_param.nextorder_rate}}</view>
			<view class="step-footer-money3">
				{{text_param.get}}{{text_param.symbol}}{{text_param.inviter_money}}
			</view>
		</view>
		<custom-tabbar currentTab="Account" realPageName="Generateurl"></custom-tabbar>
		<!-- 分享弹窗 -->
		<sharePopup ref="sharePopup" @clickBarItem="(type)=>{handleClickBarItem(type)}" :title="$t('fission_sharing.share_popup_title')" :isDifferPlatformWord="true" :shareData="shareData" @changePageMeta="(show)=>{pageMetaShow = show}"></sharePopup>
		
		<!-- 提现弹窗 -->
		<uni-popup ref="popupWithdraw" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content withdraw-content">
				<view class="title">{{$t('distribute.generateurl.claim_to_my_wallet')}}</view>
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
				<view class="pending-box">
					<view class="item">
						<view class="label">{{$t('distribute.generateurl.pending_to_withdrawal')}}</view>
						<view class="value pending">{{symbol}}{{pending_wallet_total}}</view>
					</view>
					<view @click="handleShowPendingMoneyPopup" v-if="pending_wallet_total" class="pending-day flex align-items-center">({{pending_time_text}})
				<image style="width:48rpx;" mode="widthFix" src="@/static/images/fission_sharing/prompt_gray@2x.png"></image></view>
				</view>
				<view class="_btn save-btn" :class="available_wallet_total>0?'':'disabled'" @click="available_wallet_total>0?handleSave():''">{{$t('distribute.generateurl.save_btn')}}</view>
				<view class="_btn cancle-btn" @click="$refs.popupWithdraw.close();cancelWithdraw()">{{$t('distribute.generateurl.cancle_btn')}}</view>
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
		<customTooltip ref="tooltip" :title="$t('fission_sharing.share_success_text')"></customTooltip>
		<!-- 冻结列表弹窗 -->
		<uni-popup ref="popupPendingMoney" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content pending-money-content" style="width:100%">
				<view class="title font-bold">{{$t('distribute.generateurl.rewards_holding_amount')}}</view>
				<image @click="$refs.popupPendingMoney.close()" class="close-img" mode="widthFix" src="@/static/images/distribute/close.png" />
				<view class="text1" v-html="pending_data_text"></view>
				<view class="text2">{{$t('distribute.generateurl.learn_more_in')}} <text @click="$public.handleNavTo('/pages/distribute/detail-rules?anchorPoint=rewardWithdraw')">{{$t('distribute.generateurl.detailed_rules')}}</text>.</view>
				<view class="pending-money-list-box">
					<view class="list-header-box font-bold">
						<view v-for="(item,index) in pending_data_title" class="header-name" :class="'header'+index">{{item}}</view>
					</view>
					<view class="list-item-box" v-for="(item,index) in pending_data" :key="index">
						<view class="list-item item1">{{item.email}}</view>
						<view class="list-item item2">{{item.distribute_profit_text}}</view>
					</view>
					<view class="empty-text" v-if="!pending_data.length">{{ pending_data_empty_tip || $t('message.empty')}}</view>
				</view>
				<view class="ok-btn" @click="$refs.popupPendingMoney.close()">{{$t('distribute.generateurl.ok')}}</view>
			</view>
		</uni-popup>
		<!-- 防欺诈弹窗 -->
		<fraudulent-popup ref="fraudulentPopup"></fraudulent-popup>
	</view>
</template>

<script>
	import fissionSharingRulesPopup from '@/components/fissionSharingRulesPopup/fissionSharingRulesPopup.vue';
	import sharePopup from '@/components/sharePopup/sharePopup.vue';
	import shareStep from '../../components/share-step/share-step.vue';
	import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
	import fraudulentPopup from '../../components/fraudulent-popup/fraudulent-popup.vue';
	export default {
		components:{
			fraudulentPopup,
			fissionSharingRulesPopup,
			sharePopup,
			shareStep,
			customTooltip
		},
		data() {
			return {
				pageMetaShow:false,
				share_list:[],
				shareData:{},
				ruleOpenObj:{},
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
					distribute_share_image:''
				},
				distribute_share_article:{},
				distribute_tips:'',
				reward_nums:'', // 邀请数量
				available_wallet_total:'', //可提现金额
				withdraw_wallet_total:'', //已体现金额
				balance_wallet_total:'', // 总金额
				pending_wallet_total:'', // 冻结金额
				pending_time_text:'', // 冻结文案描述
				pending_day:'',//解冻添加
				is_double_point:false,// 当前用户是否获得双倍积分
				symbol:'',
				isLoad: false,
				aicode: '',
				text_param:{},
				isShared:false,
				scrollTop:0,
				wHeight:0,
				pending_data_text:"",
				pending_data_title:[],
				pending_data:[],
				pending_data_empty_tip: '',
				observerElements: [{
					elementSelector:  '#claim_reward_to_wallet_btn',
					event_category: 'my_rewards',
					event_action: 'rewards_claim_page',
					event_name: 'rewards_claim_page',
					module: 'rewards_claim'
				}, {
					elementSelector: '#share-history-btn',
					event_category: 'my_rewards',
					event_action: 'sharing_history_page',
					event_name: 'sharing_history_page',
					module: 'rewards_claim'
				}],
				distribute_share_and_win_step: {
					my_rewards_bg: {
						uni_img: ''
					}
				}
			}
		},
		onLoad(e){
			var that = this;
			uni.getSystemInfo({
				success: function (res) {
					that.wHeight = res.windowHeight
				}
			});
			that.$store.commit('SET_ISVIEWFISSIONPAGE', true);
			this.getInfo();
			this.$maEvent.impression_event({
				event_category: 'my_rewards',
				event_action: 'rewards_invite_page',
				event_name: 'rewards_invite_page',
				module: 'my_rewards_invite'
			});
		},
		onShow() {
			if(uni.getStorageSync('shareDetailRules') == 1) {
				this.$refs.popupPendingMoney&&this.$refs.popupPendingMoney.close();
				this.$refs.popupWithdraw&&this.$refs.popupWithdraw.close();
				uni.removeStorageSync('shareDetailRules')
				setTimeout(()=>{
					this.handleInviteNowBtnToCenter();
				},800)
			}
			if(this.isShared) {
				this.$refs.sharePopup&&this.$refs.sharePopup.close();
				this.$refs.tooltip&&this.$refs.tooltip.open({time:2000});
				this.isShared = false;
			}
			this.$maEvent.visit_event({
				event_category: 'my_rewards',
				event_action: 'my_rewards_visit',
				event_name: 'my_rewards_visit'
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			this.$debounce(() => {
				this.pageScrollObserver();
			}, 200)
		},
		methods: {
			pageScrollObserver(){
				if(!this.scrollObserver){
					this.scrollObserver = this.$public.createIntersectionObserver();
				}
				this.observerElements.forEach((item, index) => {
					if(item.observer){
						return true;
					}
					let elementSelector = item.elementSelector;
					this.$public.observeVisibility(this.scrollObserver, elementSelector, () => {
						if(item.observer){
							return false;
						}
						this.$maEvent.impression_event({
							event_category: item.event_category,
							event_action: item.event_action,
							event_name: item.event_name,
							module: item.module
						});
						item.observer = true;
						this.observerElements[index].observer = true;
					});
				});
			},
			// 打开冻结列表弹窗
			handleShowPendingMoneyPopup() {
				uni.showLoading();
				this.getInfo({openPopup:'popupPendingMoney'})
			},
			handleClickBtn(data) {
				// type =1代表关闭弹窗并且把invite now按钮显示在可视区域内并且垂直居中
				if(data.type) {
					this.$refs.popupDistributeTip.close();
					this.handleInviteNowBtnToCenter();
				} else {
					this.$refs.popupDistributeTip.close();
					setTimeout(()=>{
						this.$public.handleNavTo(data.url)
					},1);
				}
			},
			handleInviteNowBtnToCenter() {
				var that = this;
				uni.createSelectorQuery().select('.invite-now-btn').boundingClientRect(rect => {
					uni.pageScrollTo({
						duration: 300, // 滚动动画过渡时间
						scrollTop: rect.top + that.scrollTop + (rect.height / 2) - (that.wHeight / 2), // 滚动的值
					})
				}).exec();
			},
			handleClickBarItem(type) {
				if(type != 'more') {
					this.isShared = true
				}
			},
			handleShowRules() {
				this.$public.handleNavTo('/pages/distribute/detail-rules')
				this.$maEvent.custom_event({
					event_category: 'my_rewards',
					event_action: 'rewards_invite_rules_button',
					event_name: 'rules',
					module: 'my_rewards_invite',
				});
			},
			handleToWallet() {
				this.$refs.popupWithdrawSuccess.close();
				setTimeout(()=>{
					this.$public.handleNavTo('/pages/my/wallet/index');
				},1)
			},
			handleSave() {
				this.$public.handleNavTo('/pages/choose-rewards/choose-rewards')
				// 当前用户已经满足双倍积分，直接提现，否则跳提现页面
				// if(this.is_double_point) {
				// 	uni.showLoading();
				// 	this.$apis.withdrawToWallet().then(res=>{
				// 		uni.hideLoading();
				// 		this.$refs.popupWithdrawSuccess.open('center');
				// 		this.$refs.popupWithdraw.close();
				// 		this.getInfo();
				// 	}).catch(e=>{
				// 		uni.hideLoading();
				// 	})
				// } else {
				// 	this.$public.handleNavTo('/pages/distribute/history?type=1');
				// 	this.$refs.popupWithdraw.close();
				// }
				this.$maEvent.custom_event({
					event_category: 'my_rewards',
					event_action: 'claim_rewards_save_wallet',
					event_name: 'save to my wallet',
					module: 'rewards_claim',
				});
			},
			cancelWithdraw(){
				this.$maEvent.custom_event({
					event_category: 'my_rewards',
					event_action: 'claim_rewards_not_now',
					event_name: 'not now',
					module: 'rewards_claim',
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
			getInfo(params) {
				this.$apis.distributeShareInfo({v:'1.0'}).then(res => {
					this.aicode = res.data.aicode
					this.isLoad = true;
					let result = res.data;
					this.distribute_share = result.distribute_share;
					this.distribute_share_article = this.distribute_share.distribute_share_article;
					if(this.distribute_share_article.text4&&this.distribute_share_article.text4.length) {
						var obj = {};
						this.distribute_share_article.text4.map((item,index)=>{
							obj['open_'+index] = false
						})
						this.ruleOpenObj = obj;
					}
					this.distribute_tips = result.distribute_tips;
					this.distribute_share_and_win_step = result.distribute_share_and_win_step;
					this.share_list = result.share_list;
					this.text_param = res.data.text_param;
					this.text_param.fraudulent_title = res.data.fraudulent_title;
					this.text_param.inviter_money = res.data.inviter_money;
					this.shareData = {
						from_page: "share_referral_account_center",
						share_from: 'distribute',
						url: res.data.short_url,
						image:res.data.distribute_share.distribute_share_facebook_image,
						...res.data.distribute_share,
						event_data: {
							event_category: 'my_rewards',
							event_action: 'rewards_invite_via_button',
							module: 'my_rewards_invite_via'
						}
						
					};
					this.reward_nums=result.reward_nums; // 邀请数量
					this.available_wallet_total=result.available_wallet_total; //可提现金额
					this.withdraw_wallet_total=result.withdraw_wallet_total; //已提现金额
					this.balance_wallet_total=result.balance_wallet_total; // 总金额
					this.pending_wallet_total=result.pending_wallet_total; // 冻结金额
					this.pending_time_text = result.pending_time_text;
					this.pending_day = result.pending_day// 解冻天数
					this.pending_data_text = result.pending_data_text // 解冻列表文案
					this.pending_data_title = result.pending_data_title // 解冻列表表头
					this.pending_data = result.pending_data
					this.pending_data_empty_tip = result.pending_data_empty_tip || '';
					this.is_double_point = result.is_double_point // 当前用户是否获得双倍积分
					this.symbol = result.symbol
					if(params.openPopup) {
						this.$refs[params.openPopup].open('bottom');
					}
					this.$nextTick(() => {
						this.pageScrollObserver();
					});
					uni.hideLoading()
				}).catch(() => {
					this.isLoad = true;
					uni.hideLoading()
				})
			},
			showSharePopup(){
				if(this.shareData && this.shareData.url) {
					this.$refs.sharePopup.open('bottom');
					this.$trackEvent.open_share_code({
						from_page: 'share_referral_account_center',
						event_action: 'open_share_distribute',
						event_name: 'open share from share referral account center'
					});
					this.$maEvent.custom_event({
						event_category: 'my_rewards_invite',
						event_action: 'rewards_invite_now_button',
						event_name: 'invite now',
						module: 'my_rewards_invite',
					});
				}
			},
			shareHistoryHandel(){
				this.$public.handleNavTo('/pages/distribute/history');
				this.$maEvent.custom_event({
					event_category: 'my_rewards',
					event_action: "sharing_history_button",
					event_name: 'sharing history',
					module: 'share_history'
				});
			},
			claimRewardToWallet(){
				this.$refs.popupWithdraw.open('bottom');
				this.$maEvent.custom_event({
					event_category: 'my_rewards',
					event_action: 'rewards_claim_button',
					event_name: 'claim rewards to wallet',
					module: 'rewards_claim',
				});
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
	padding-bottom: 115.38rpx;
	background-image: url('@/static/images/new-cashgrab-rewards/cashgrab_rewards_bg@2x.png');
	// background-size: cover;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	::v-deep {
		.share-and-win-main {
			min-height:unset;
			background-image: unset;
		}
	}
	.box {
		position: relative;
		padding: 0 32rpx 100rpx 32rpx;
		.my-rewards-box {
			background: #fff;
			padding: 38rpx 32rpx 40rpx;
			box-shadow: 0px 1px 16px 0px rgba(0,0,0,0.05);
			border-radius: 8rpx;
			.title {
				color: #333;
				font-size: 32rpx;
				margin-bottom: 24rpx;
				text-align: center;
				font-weight: bold;
			}
			.reward-data-box {
				background-color: #F0F3FF;
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
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					word-break: break-word;
					flex-direction: column;
					height: 192rpx;
					.value {
						font-size: 64rpx;
						color: #000;
						margin-bottom: 18rpx;
					}
					.label {
						color: #999;
						font-size: 24rpx;
						font-family: 'Montserrat-Regular';
					}
					.item-bg {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 96rpx;
					}
				}
			}
			.dui-primary-btn {
				font-size: 28rpx;
				margin-bottom: 28rpx;
				border-radius: 42rpx;
			}
			.share-history-btn {
				font-size: 28rpx;
				color: #0071E3;
				text-align: center;
				text-decoration: underline;
				font-family: 'Montserrat-Regular';
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

.withdraw-content {
	background: #fff;
	border-radius: 16rpx 16rpx 0 0;
	padding: 40rpx 36rpx 36rpx 36rpx;
	position: relative;
	.title {
		color: #000;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
		border-bottom: 1px solid #EEEEEEFF;
		padding-bottom: 25rpx;
		margin-bottom: 50rpx;
	}
	.close-img {
		position: absolute;
		top: 40rpx;
		right: 45rpx;
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
			font-size: 27rpx;
			font-weight: 500;
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
		text-align: center;
		width: 100%;
		line-height: 92rpx;
		border-radius: 73rpx 73rpx 73rpx 73rpx;
		height: 92rpx;
		background: #222222;
		font-size: 31rpx;
		font-weight: 600;
	}
	.save-btn {
		margin: 69.23rpx 0 24rpx 0;
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
.pending-money-content {
	background: #fff;
	border-radius: 16rpx 16rpx 0 0;
	padding: 37rpx 24rpx;
	position: relative;
	.title {
		font-size: 30.77rpx;
		color: #000000FF;
		line-height: 46.15rpx;
		text-align: center;
		margin-bottom: 15.38rpx;
	}
	.close-img {
		width: 34.62rpx;
		position: absolute;
		right: 23.08rpx;
		top: 23.08rpx;
	}
	.text1 {
		font-size: 26.92rpx;
		color: #000000FF;
		text-align: center;
		line-height: 42.31rpx;
		margin-bottom: 11.54rpx;
	}
	.text2 {
		text-align: center;
		text {
			color: #0071E3FF;
			margin-left: 10rpx;
			text-decoration: underline;
		}
	}
	.ok-btn {
		height: 81rpx;
		background: #000000;
		border-radius: 4rpx 4rpx 4rpx 4rpx;
		font-size: 30.77rpx;
		color: #ffffff;
		line-height: 81rpx;
		text-align: center;
	}
	.pending-money-list-box {
		max-height: 415.38rpx;
		overflow-y: scroll;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 4rpx solid #E5F3FF;
		margin-bottom: 57.69rpx;
		margin-top: 34.62rpx;
		font-size: 23.08rpx;
		color: #000000FF;
		.list-header-box {
			display: flex;
			align-items: center;
			padding: 20rpx 14rpx;
			text-align: center;
			// white-space: nowrap;
			border-bottom: 4rpx solid #E5F3FF;
			.header0 {
				width: 45%;
			}
			.header1 {
				width: 55%;
			}
		}
		
		.empty-text {
			text-align: center;
			padding: 40rpx;
			font-size: 24rpx;
			color: #999999;
		}
		.list-item-box {
			display: flex;
			align-items: center;
			padding: 20rpx 20rpx;
			text-align: center;
			font-size: 26.92rpx;
			.item1 {
				width: 45%;
			}
			.item2 {
				width: 55%;
			}
		}
		.list-item-box:nth-child(odd) {
			background: #E5F3FFFF;
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
		left: 66rpx;
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
		right: 60rpx;
		top: 84rpx;
		transform: rotate(-13deg) scale(0.35);
	}
}
</style>
