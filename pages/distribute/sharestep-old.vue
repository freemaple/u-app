<template>
	<view class="share-and-win-box">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :styleType="2" :title="$t('distribute.index.page_title')"></pageHeader>
		<view class="share-and-win-main" v-if="JSON.stringify(pageConfigData) != '{}'">
			<image class="share-step-page-bg" :src="pageConfigData.pageBg" mode="widthFix"></image>
			<view class="share-and-win-title">{{pageConfigData.pageTitle}}</view>
			<view class="share-and-win-step step1">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}1</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.one">
					{{pageConfigData.one.stepTxt[0].val}}
					<text :class="hasLogin ? '' : 'blue-line'" @click="toLogin">{{pageConfigData.one.stepTxt[1].val}}</text>
					{{pageConfigData.one.stepTxt[2].val}}
				</view>
			</view>
			<view class="share-and-win-step step2">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}2</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.two">
					{{pageConfigData.two.stepTxt[0].val}}
					<text class="line" @click="showToast('two')">{{pageConfigData.two.stepTxt[1].val}}</text>
				</view>
			</view>
			<view class="share-and-win-step step3">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}3</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.three">
					{{pageConfigData.three.stepTxt[0].val}}
					<text class="line" @click="showToast('three')">{{pageConfigData.three.stepTxt[1].val}}</text>
				</view>
			</view>
			<view class="share-and-win-step step4">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}4</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.four">
					{{pageConfigData.four.stepTxt[0].val}}
					<text class="line" @click="showToast('four')">{{pageConfigData.four.stepTxt[1].val}}</text>
				</view>
			</view>
			<view class="share-and-win-step step5">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}5</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.five">
					<text class="line" @click="showToast('five')">{{pageConfigData.five.stepTxt[0].val}}</text>
				</view>
			</view>
			<view class="share-and-win-step step6">
				<view class="share-and-win-step-title">{{$t('distribute.index.step_title')}}6</view>
				<view class="share-and-win-step-content" v-if="pageConfigData.six">
					{{pageConfigData.six.stepTxt[0].val}}
					<text class="blue-line" @click="toShareAndWin">{{pageConfigData.six.stepTxt[1].val}}</text>
				</view>
			</view>
			<view class="sharestep-btn-box">
				<view class="go-to-win-btn" @click="toShareAndWin">
					{{$t('distribute.index.go_to_share_and_win')}}
				</view>
				<view class="back-page-btn" @click="goBack">
					<!-- <image :src="pageConfigData.continue" mode="heightFix" /> -->
					{{$t('distribute.index.continue_shipping')}}
				</view>
			</view>
		</view>
		<!-- 提示弹窗 -->
		<uni-popup ref="popupTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="tip-box">
					<view class="close">
						<image @click="$refs.popupTip.close()" class="close-btn" src="@/static/images/distribute/close.png" mode=""></image>
					</view>
					<view class="tip-title">
						{{toastData.tipsTitle}}
					</view>
					<view class="tip-content" v-if="toastData.tipType == 1">
						{{toastData.tipContent}}
					</view>
					<!-- 第五步的提示 -->
					<view class="tip-content" v-if="toastData.tipType == 2">
						<view :class="item.class" v-for="(item,index) in toastData.tipContent">
							<block v-if="item.type == 'array'">
								<text :class="it.class" v-for="(it,ind) in item.val" :key="ind">{{it.val}}</text>
							</block>
							<block v-else>
								{{item.val}}
							</block>
						</view>
					</view>
					<view class="btn-ok" @click="$refs.popupTip.close()">{{$t('distribute.index.toast_btn')}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			pageMetaShow:false,
			toastInd: 0,
			toastData: {
				title: '',
				content: ''
			},
			pageConfigData: {},
		}
	},
	computed: {
		...mapGetters(['hasLogin'])
	},
	mounted() {
		this.getData();
	},
	methods: {
		getData() {
			// 获取百分比等数据
			this.$apis.distributeShareStepData().then(res=>{
				// 第四部/第五步的数据要替换
				if(res.data['distribute_share_and_win_step'].four) {
					const fourData = res.data['distribute_share_and_win_step'].four;
					fourData.tipContent = fourData.tipContent.replace(/\{invitee_money\}/g, res.data.invitee_money);
					fourData.tipContent = fourData.tipContent.replace(/\{invitee_money_app\}/g, res.data.invitee_money_app);
				}
				if(res.data['distribute_share_and_win_step'].five) {
					const fiveData = res.data['distribute_share_and_win_step'].five;
					fiveData.tipContent.map(e => {
						if(typeof e.val == 'string') {
							e.val = e.val.replace(/\{money\}/g, res.data.money);
							e.val = e.val.replace(/\{money2\}/g, res.data.money2);
							e.val = e.val.replace(/\{discount_off\}/g, res.data.discount_off);
						}
						if(typeof e.val == 'object') {
							e.val.map(i => {
								i.val = i.val.replace(/\{money\}/g, res.data.money);
								i.val = i.val.replace(/\{money2\}/g, res.data.money2);
								i.val = i.val.replace(/\{discount_off\}/g, res.data.discount_off);
							})
						}
					})
				}
				this.pageConfigData = res.data['distribute_share_and_win_step'];
			})
		},
		goBack() {
			this.$public.handleGoBack()
		},
		toLogin() {
			if (!this.hasLogin) {
				this.$public.handleNavTo('/pages/login/index')
			}
		},
		showToast(ind) {
			this.toastInd = ind;
			this.$refs.popupTip.open('center');
			this.toastData = this.pageConfigData[ind];
		},
		toShareAndWin() {
			if (!this.hasLogin) {
				this.$public.handleNavTo('/pages/login/index?redirectUrl=' + escape('/pages/distribute/generateurl'));
			}else{
				this.$public.handleNavTo('/pages/distribute/generateurl')
			}
			this.$trackEvent.shareandwin();
		}
	}
}
</script>

<style scoped>
	.share-and-win-box {
		padding-top: 96rpx;
		background: #FFF5E7;
		min-height: calc(100vh - 96rpx);
	}
	.share-step-page-bg {
		width: 100%;
	}
	.share-and-win-main {
		position: relative;
	}
	.share-and-win-title {
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		top: 296rpx;
		color: #fff;
		font-size: 28rpx;
	}
	.share-and-win-step {
		position: absolute;
		background: #FFF5E6;
		border-radius: 8rpx;
		padding: 16rpx 32rpx 24rpx;
	}
	.share-and-win-step-title {
		color: #FF3A99;
		font-size: 28rpx;
		font-weight: blod;
	}
	.share-and-win-step-content {
		padding-top: 8rpx;
		font-size: 12px;
		font-weight: bold;
	}
	.share-and-win-step-content .line {
		border-bottom: 1px dashed #000;
	}
	.share-and-win-step-content .blue-line {
		text-decoration: underline;
		color: #0071E3;
	}
	.step1 {
		top: 360rpx;
		left: 244rpx;
	}
	.step2 {
		top: 512rpx;
		left: 48rpx;
	}
	.step3 {
		top: 664rpx;
		left: 48rpx;
	}
	.step4 {
		top: 816rpx;
		left: 48rpx;
	}
	.step5 {
		top: 968rpx;
		right: 48rpx;
	}
	.step6 {
		top: 1120rpx;
		left: 48rpx;
	}
	.sharestep-btn-box {
		position: absolute;
		top: calc(100vw/750 * 1278);
		left: 48rpx;
		right: 48rpx;
	}
	.go-to-win-btn {
		border-radius: 8rpx;
		font-size: 32rpx;
		background: #000000;
		text-align: center;
		color: #fff;
		padding: 24rpx 0;
		font-weight: bold;
		margin-bottom: 24rpx;
	}
	.back-page-btn {
		text-align: center;
		font-size: 32rpx;
		text-decoration: underline;
		color: #333333;
		font-weight: bold;
	}
	.tip-box {
		padding: 48rpx;
		position: relative;
	}
	::v-deep .uni-popup__wrapper {
		border-radius: 16rpx;
	}
	.close-btn {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		top: 24rpx;
		right: 24rpx;
	}
	.tip-title {
		font-weight: bold;
		font-size: 32rpx;
		text-align: center;
		margin: 12rpx 46rpx 32rpx;
	}
	.tip-content {
		font-size: 28rpx;
		font-weight: 400;
		line-height: 44rpx;
	}
	.tip-step4-content {
		text-align: center;
	}
	.btn-ok {
		background: #000;
		color: #fff;
		border-radius: 8rpx;
		height: 84rpx;
		line-height: 84rpx;
		margin-top: 160rpx;
		text-align: center;
	}
	.reward {
		font-weight: bold;
		margin: 5rpx 0;
	}
	.reward-pink {
		color: #FF3A99;
	}
	.success_icon {
		width: 144rpx;
		height: 144rpx;
		margin: 72rpx auto 46rpx;
	}
	.tip-blue {
		color: #0071E3;
		text-decoration: underline;
	}
	@media screen and (min-width: 1020px) {
	  .sharestep-btn-box {
		top: 1250rpx;
	  }
	}
</style>
