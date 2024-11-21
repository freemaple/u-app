<template>
	<view class="share-and-win-box">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :styleType="2" :title="$t('distribute.index.page_title')" :iconUrl="require('@/static/images/checkout_icon/close@2x.png')"></pageHeader>
		<shareStep 
			:textParam="text_param"
			@showRules="showRules()" 
			@showSharePopup="handleShowSharePopup()"
			@showFraudulent="$refs.fraudulentPopup.open()"
			></shareStep>
		<custom-tabbar currentTab="Home" realPageName="Sharestep"></custom-tabbar>
		<fissionSharingRulesPopup @handleInviteNow="handleShowSharePopup()" :params="{title:text_param.rules,desc:rulesParam.rule_step_top.desc,btn:rulesParam.rule_step_bottom.desc,btn_img:rulesParam.rule_step_bottom.img}" :listData="rulesParam.steps" ref="fissionSharingRulesPopup"></fissionSharingRulesPopup>
		<!-- 分享弹窗 -->
		<sharePopup @clickBarItem="(type)=>{handleClickBarItem(type)}" ref="sharePopup" :isDifferPlatformWord="true" :shareData="shareData" :title="$t('fission_sharing.share_popup_title')" @changePageMeta="(show)=>{pageMetaShow = show}"></sharePopup>
		<!-- 分享成功弹窗 -->
		<uni-popup class="shareSuccessPopup" ref="shareSuccessPopup" @change="(e)=>{changeShareSuceessPopup(e.show)}">
			<view class="share-success-content-box">
				<image mode="widthFix" @click="$refs.shareSuccessPopup.close()" class="close-btn" src="@/static/images/icon/close-black.png"></image>
				<view class="content-box">
					<view class="success-icon-box"><image mode="widthFix" class="success-icon" src="@/static/images/icon/success-icon.png"></image></view>
					<view class="text1 font-bold">{{$t('fission_sharing.success_popup.text1')}}</view>
					<view class="text2" v-html="$t('fission_sharing.success_popup.text2',{num:time})"></view>
					<view class="text3" @click="handleGoShopping()">{{$t('fission_sharing.success_popup.text3')}}</view>
				</view>
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
import fraudulentPopup from '../../components/fraudulent-popup/fraudulent-popup.vue';

export default {
	components:{
		fissionSharingRulesPopup,
		sharePopup,
		shareStep,
		fraudulentPopup
	},
	data() {
		return {
			pageMetaShow:false,
			isShared:false, // 是否点击了分享
			shareData:{},
			isLogin:0,
			time:3,
			timer:'',
			text_param:{},
			rulesParam:{
				rule_step_top:{},
				steps: [],
				rule_step_bottom:{}
			},
		}
	},
	onLoad() {
		this.$store.commit('SET_ISVIEWFISSIONPAGE', true);
	},
	onShow() {
		this.getData();
		if(this.isShared) {
			this.$refs.sharePopup.close();
			this.$refs.shareSuccessPopup.open('center');
			this.isShared = false;
			this.starCountdown()
		}
		this.$maEvent.impression_event({
			event_category: 'invite',
			event_action: 'invite_page',
			event_name: 'invite_page',
			module: 'invite'
		});
		this.$maEvent.visit_event({
			event_category: 'invite',
			event_action: 'invite_visit',
			event_name: 'invite_visit'
		})
	},
	methods: {
		changeShareSuceessPopup(show) {
			this.pageMetaShow = show;
			if(!show) {
				this.closeCountdown();
			}
		},
		handleGoShopping() {
			this.closeCountdown();
			this.$public.handleGoBack();
		},
		handleClickBarItem(type) {
			if(type != 'more') {
				this.isShared = true
			}
		},
		handleShowSharePopup() {
			if(this.isLogin == 1) {
				if(this.shareData&&this.shareData.url) {
					this.$refs.fissionSharingRulesPopup.close();
					this.$refs.sharePopup.open('bottom')
					this.$trackEvent.open_share_code({
						from_page: 'share_referral_page',
						event_action: 'open_share_distribute',
						event_name: 'open share from share referral page'
					});
					this.$maEvent.custom_event({
						event_category: 'invite',
						event_action: 'invite_now_button',
						event_name: 'invite now',
						module: 'invite',
					});
				}
			} else {
				this.$public.handleNavTo('/pages/login/index?is_special=1&in_site_source=share_and_win')
			}
		},
		// 开启倒计时关闭分享成功弹窗
		starCountdown() {
			this.time = 3;
			this.timer = setInterval(()=> {
			    this.time--
				if(!this.time) {
					this.closeCountdown()
					this.$public.handleGoBack()
				}
			}, 1000);
		},
		// 关闭倒计时
		closeCountdown() {
			clearInterval(this.timer);
		},
		getData() {
			// 获取百分比等数据
			this.$apis.distributeShareStepData({v:'1.0'}).then(res=>{
				this.text_param = res.data.text_param;
				this.text_param.inviter_money = res.data.inviter_money;
				this.rulesParam = res.data.distribute_share_and_win_step;
				this.isLogin = res.data.isLogin;
				this.shareData = {
					from_page: "share_referral_page",
					share_from: 'distribute',
					url: res.data.short_url,
					image:res.data.distribute_share.distribute_share_facebook_image,
					...res.data.distribute_share,
					event_data: {
						event_category: 'invite',
						event_action: 'invite_via_button',
						module: 'invite_via'
					}
				};
			})
		},
		showRules(){
			this.$refs.fissionSharingRulesPopup.open();
			this.$maEvent.custom_event({
				event_category: 'invite',
				event_action: 'invite_rules_button',
				event_name: 'rules',
				module: 'invite',
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.share-and-win-box {
	padding-top: 96rpx;
	padding-bottom: 96.16rpx;
	background: #FFF5E7;
	.shareSuccessPopup {
		.share-success-content-box {
			width: 71vw;
			max-height: 90vh;
			padding: 38.46rpx;
			background: #fff;
			border-radius: 24rpx;
			position: relative;
			.close-btn {
				width: 34.62rpx;
				position: absolute;
				right: 16rpx;
				top: 16rpx;
			}
			.content-box {
				text-align: center;
				.success-icon-box {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 30.77rpx 0 50rpx 0;
					.success-icon {
						width: 138.46rpx;
					}
				}
				.text1 {
					font-size: 30.77rpx;
					color: #000000;
					line-height: 36.06rpx;
					padding-bottom: 15.38rpx;
				}
				.text2 {
					color: #666666;
					font-size: 26.92rpx;
					line-height: 31.55rpx;
					padding-bottom: 55.77rpx;
				}
				.text3 {
					background: #222;
					border-radius: 42rpx;
					height: 81rpx;
					text-align: center;
					font-size: 31rpx;
					color: #ffffff;
					line-height: 81rpx;
				}
			}
		}
	}
	::v-deep {
		.page-header-box.type2 {
			.goback {
				right:32rpx;
			}
		}
	}
}

</style>
