<template>
	<view class="dui-padding-top-header">
		<pageHeader :title="$t('distribute.cash.withdraw_title')"></pageHeader>
		<view class="cash-form-box p-24rpx">
			<uni-forms ref="form" :modelValue="formData" label-position="top" label-width="300px">
				<view class="reward-form-item reward-money">
				    <view class="reward-form-item-main show-reward-money">{{symbol}}{{money}}</view>
				    <view class="reward-form-item-label">{{$t('distribute.cash.form_label.w_amount')}}</view>
			    </view>
				<uni-forms-item :label="$t('distribute.cash.form_label.w_account')">
					<radio-group class="flex" @change="changePaymentMethod" style="flex: 1;">
						<div :class="index==0?'radio-box':''" v-for="(item,index) in withdrawalType" :key="index">
							<radio :value="String(item.value)" :checked="item.value == formData.payment_method" color="#000" class="radio">{{item.label}}</radio>
						</div>
				   </radio-group>
				</uni-forms-item>
				<view class="" v-show="formData.payment_method == 'paypal'">
					<uni-forms-item :label="$t('distribute.cash.form_label.p_account')">
						<uni-easyinput type="text" v-model="formData.payment_no" />
					</uni-forms-item>
				</view>
				<view class="" v-show="formData.payment_method == 'bank'">
					<uni-forms-item :label="$t('distribute.cash.bank_name')">
						<uni-easyinput type="text" v-model="formData.bank_name" />
					</uni-forms-item>
					<uni-forms-item :label="$t('distribute.cash.swift_code')">
						<uni-easyinput type="text" v-model="formData.swift_code" />
					</uni-forms-item>
					<uni-forms-item :label="$t('distribute.cash.account_name')">
						<uni-easyinput type="text" v-model="formData.name" />
					</uni-forms-item>
					<uni-forms-item :label="$t('distribute.cash.account_number')">
						<uni-easyinput type="text" v-model="formData.payment_no" />
					</uni-forms-item>
				</view>
				<uni-forms-item :label="$t('distribute.cash.form_label.email_address')">
					{{email}}
				</uni-forms-item>
				<uni-forms-item :label="$t('distribute.cash.form_label.email_code')" class="email-code-box">
					<view class="">
						<uni-easyinput type="text" v-model="formData.code" class="email-code-input"/>
						<view v-if="time == 121" class="send-code get-code-btn" @click="getEmailCode" style="font-weight: 500;">{{$t('distribute.cash.send_btn')}}</view>
						<view v-else class="send-code send-code-time">{{time}}s</view>						
					</view>
					<view class="send-email-tip" v-show="codeTip">
						{{$t('distribute.cash.email_code_tip')}}
					</view>
				</uni-forms-item>
			</uni-forms>
			<view @click="handleSubmit" :class="['cash-btn dui-primary-btn', canSubmit ? '' : 'disabled-btn']">{{$t('distribute.cash.withdraw_btn')}}</view>
			<view class="withdraw-tip">
				<view class="">
					{{$t('distribute.cash.payment_fees')}}
				</view>
				<view class="">
					{{$t('distribute.cash.withdraw_tip_content')}}
				</view>
			</view>
		</view>
		
		<message-tip ref='messageTipRef' />
		<!-- 提现失败弹窗 -->
		<uni-popup ref="failTipRef">
			<popupContentTemplate class="wrapper" @close="close()" :title="$t('distribute.cash.withdraw_success_tip', {site_name: $store.state.site_name_upper})">
				<template v-slot:content>
					<view class="content">{{failTipContent}}</view>
				</template>
				<template v-slot:footer>
					<button class="btn-close" type="primary" @tap="close()">{{$t("distribute.cash.cash_ok")}}</button>
				</template>
			</popupContentTemplate>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				failTipContent: '',
				symbol: '',
				email: '',
				money: '',
				// 表单数据
				formData: {
					payment_method: 'paypal',
					payment_no: '',
					code: '',
					bank_name: '',
					swift_code: '',
					name: '',
				},
				withdrawalType: [
					{
						label: 'Paypal',
						value: 'paypal'
					},
					{
						label: 'Bank Account',
						value: 'bank'
					}
				],
				time: 121, // 倒计时
				canSubmit: false,
				codeTip: false,
				id: ''
			}
		},
		onLoad(data) {
			this.symbol = data.symbol;
			this.email = data.email;
			this.money = data.money;
			this.id = data.id;
		},
		watch: {
			formData: {
				handler (newName, oldName) {
					this.checkSubmitBtn();
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			close() {
				this.$refs.failTipRef.close()
			},
			// 切换提现方式
			changePaymentMethod(e) {
				this.formData.payment_method = e.target.value;
			},
			// 发送邮件验证码
			getEmailCode() {
				this.$apis.distributeSendEmailCode({}).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							title: this.$t('distribute.cash.send_success'),
							icon: "none",
						})
						this.time = 120;
						const timer = setInterval(() => {
							if(this.time == 1) {
								clearInterval(timer);
								this.time = 121;
							}else{
								this.time -= 1;
							}
						}, 1000);
					}
				})
			},
			// 校验提交按钮是否可以被点击
			checkSubmitBtn() {
				let canSubmit = true;
				const formData = this.formData;
				if(formData.payment_method == 'paypal') {
					canSubmit = !(formData.code == '' || formData.payment_no == '');
				}else if(formData.payment_method == 'bank') {
					canSubmit = !(formData.bank_name == '' || formData.swift_code == '' || formData.name == '' || formData.payment_no == '' || formData.code == '')
				}
				this.canSubmit = canSubmit;
			},
			// 提交
			handleSubmit() {
				if(!this.canSubmit) {
					return
				}
				this.$maEvent.custom_event({
					event_category: 'reward_withdraw',
					event_action: 'reward_withdraw_button',
					event_name: 'reward_withdraw_button',
					event_data: {
						event_value: 'confirm application'
					},
					module: 'reward_withdraw'
				});
				const params = {
					id: this.id,
					...this.formData
				}
				if(this.formData.payment_method == 'paypal') {
					delete params.bank_name
					delete params.name
					delete params.swift_code
				}
				this.$apis.distributeCashwithdraw(params).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						// uni.navigateBack({
						// 	delta: 1
						// });
						uni.setStorageSync('IS_SHOW_REWARD_WITHDRAWAL_TIPS_APP', '1');
						this.$refs.messageTipRef.showMessage(this.$t('distribute.cash.withdraw_success'), 1);
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/my/wallet/cash-records'
							});
						}, 1500)
					}
				}).catch(err => {
					if(err.code == 20000) {
						this.codeTip = true;
					} else if (err.code == 200002) {
						this.failTipContent = err.message
						this.$refs.failTipRef.open()
					} else {
						uni.showToast({
						    title: err.message,
						    icon: 'none',
						    duration: 3000
						});
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
.wrapper {
	border-radius: 8rpx;
	width: 626rpx;
	::v-deep .title {
		margin-top: 20rpx;
	}
	::v-deep .main-content-box {
		max-height: 600rpx;
	}
	.btn-close {
		height: 81rpx;
		margin: 40rpx 32rpx 20rpx;
		font-size: 31rpx;
		line-height: 81rpx;
	}
	.content {
		line-height: 42rpx;
		text-align: center;
	}
}
.cash-form-box {
	padding: 30rpx 46rpx;
	.reward-money {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 150rpx;
		background: #F2F9FF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		margin-bottom: 32rpx;
		.show-reward-money {
			font-weight: 500;
			color: #000000;
			font-size: 46rpx;
			width: auto;
		}
	}	
	 
	 .radio-box .radio:first-child {
		 margin-right: 69rpx;
	 }
	::v-deep.uni-forms-item__label {
		color: #333;
	}
	::v-deep .uni-forms-item {
		margin-bottom: 32rpx;
		.uni-forms-item__content {
			// font-weight: bold;
			color: #000;
		}

		.email-code-input {
			.uni-input-input {
				width: 200rpx;
			}
		}
	}
	::v-deep .email-code-box {
		.uni-forms-item__label{
			width: 340rpx !important;
		}
		.uni-forms-item__content {
			display: block;
		}
		view {
			display: flex;
		}
	}
	.cash-btn {
		margin-top: 40rpx;
		font-weight: 400;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}
	.cash-btn.disabled-btn {
		background: #e9e9e9;
		border: 1px solid #ccc;
		color: #000;
	}
    .send-code {
        width: 162rpx;
        height: 81rpx;
        background: #060606;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
		margin-left: 20rpx;
        color: #fff;
		align-items: center;
		justify-content: center;
    }
    .send-email-tip {
        color: red;
		margin-top: 10rpx;
    }
	.withdraw-tip {
        background: #f5f7fa;
        padding: 20rpx;
		color: #606266;
	}
}
</style>