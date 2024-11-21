<template>
	<view class="container">
		<nav-back :title="$t('change_password.change_password')"></nav-back>
		<view class="wrapper">
			<uni-forms ref="changeForm" :rules="changeRules()" :modelValue="changeData" validate-trigger="bind">
				<uni-forms-item name="oldPwd">
					<uni-easyinput type="password" :inputBorder="false" v-model="changeData.oldPwd" class="input"
						:placeholder="'* ' + $t('change_password.existing_pwd')" />
				</uni-forms-item>
				<uni-forms-item name="newPwd">
					<uni-easyinput type="password" :inputBorder="false"  @blur="validateInput" @focus="validateInput" v-model="changeData.newPwd" class="input"
						:placeholder="'* ' + $t('change_password.new_pwd')" />
				</uni-forms-item>
				<uni-forms-item name="reEnterPwd">
					<uni-easyinput type="password" :inputBorder="false"  @blur="validateInput" @focus="validateInput" v-model="changeData.reEnterPwd" class="input"
						:placeholder="'* ' + $t('change_password.re_enter_pwd')" />
				</uni-forms-item>
				<view class="uni-btn-v">
					<button @click="formSubmit" :loading="saveLoading" form-type="submit">{{ $t('change_password.save') }}</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			changeData: {
				oldPwd: '',
				newPwd: '',
				reEnterPwd: '',
			},
			forgotCaptchaActive: false,
			saveLoading: false
		};
	},
	onLoad(option) {
		const that = this
		uni.showLoading()
		that.checkIfNeedCaptcha()
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('changeLang', (data) => {

		})
	},
	onReady() {
		// 需要在onReady中设置规则
		// this.$refs.changeForm.setRules(this.changeRules())
	},
	methods: {
		changeRules(){
			const that = this
			return {
				oldPwd: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('change_password.enter_current_pwd'),
						}
					]
				},
				newPwd: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('change_password.enter_new_pwd'),
						},
						{
							validateFunction: function (rule, value, data, callback) {
								const reg = /^(?=.*[A-Za-z])(?=.*\d)\S{6,30}$/
								if(!reg.test(value)){
									callback(that.$t('change_password.reg_tips'))
								}else{
									callback()
								}
							}
						}
						]
				},
				reEnterPwd: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('change_password.reenter_new_pwd'),
						},
						{
							validateFunction: function (rule, value, data, callback) {
								if (value !== data.newPwd) {
									callback(that.$t('change_password.reenter_pwd'))
								}else {
									callback()
								}
							}
						}]
				},
			}
		},
		validateInput() {
		    // 检查 newPwd 是否有值，如果有则验证 newPwd 字段
		    if (this.changeData.newPwd) {
		        this.$refs.changeForm.validateField('changeData.newPwd');
		    }
		    // 检查 reEnterPwd 是否有值，如果有则验证 reEnterPwd 字段
		    if (this.changeData.reEnterPwd) {
		        this.$refs.changeForm.validateField('changeData.reEnterPwd');
		    }
		},
		formSubmit() {
			let that = this
			//表单验证
			this.$refs.changeForm.validate().then(res => {
				try {
					const {oldPwd, newPwd, reEnterPwd} = that.changeData
					const current_password = btoa(encodeURI(oldPwd));
					const new_password = btoa(encodeURI(newPwd))
					const confirm_new_password = btoa(encodeURI(reEnterPwd))
					this.saveLoading = true;
					that.$apis.editPwd({
						current_password,
						new_password,
						confirm_new_password
					}).then((res)=> {
						this.saveLoading = false;
						if(res.code == '200'){
							uni.showToast({
								title: "Success!",
								icon: 'success',
								duration: 1000
							});
							setTimeout(() => {
								uni.switchTab({ url: '/pages/my/my' })
							}, 1000);
						}else {
							uni.showToast({
								title: res.data.error,
								icon: 'success',
								duration: 2000
							});
						}
					}).catch(() => {
						this.saveLoading = false;
					})

				} catch {
					this.saveLoading = false;
				}
			}).catch(err => {
				this.saveLoading = false;
				if (err.length) {
					console.log(err[0].errorMessage);
				}
			})
			//api

		},
		checkIfNeedCaptcha() {
			const that = this
			that.$apis.queryIfNeedCaptcha().then(res => {
				uni.hideLoading()
				if (res.code == 200) {
					that.forgotCaptchaActive = res.data.forgotCaptchaActive
				}
			})
		},
	}
}
</script>

<style scoped lang="scss">
@import "@/common/mixins.scss";

.container {
	background-color: #f3f3f3;
	height: 100%;
	
	.wrapper {
		width: 100%;
		box-sizing: border-box;
		padding: 16rpx 32rpx;
		background-color: #fff;
		height: calc(100vh - 96rpx);

		/deep/.uni-forms-item__error {
			font-size: 28rpx;
		}

		.uni-forms-item {
			margin-top: 32rpx;
			margin-bottom: 64rpx;
			height: 104rpx;
			@include onepxBorder(#ccc);

			.input {
				height: 100%;
			}

			/deep/.uni-input-placeholder {
				font-size: 28rpx !important;
				color: rgba(0, 0, 0, 0.3);
				height: 32rpx;
				line-height: 32rpx;
			}

			/deep/.uni-input-input {
				font-size: 28rpx;
			}
		}

		.uni-btn-v {
			// width: 686rpx;
			height: 96rpx;
			margin-top: 72rpx;
			margin-bottom: 32rpx;

			/deep/uni-button {

				height: 100%;
				background-color: #000 !important;
				font-size: 32rpx;
				line-height: 96rpx;
				color: #fff;
				border-radius: 0;

				&::after {
					display: flex;
					text-align: center;
					align-items: center;

				}
			}
		}
	}
}
</style>
