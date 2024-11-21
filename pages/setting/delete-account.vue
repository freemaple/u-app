<template>
	<view class="container">
		<nav-back :title="$t('setting.delete_account')"></nav-back>
		<view class="wrapper">
			<uni-forms ref="changeForm" :rules="formRules" :modelValue="formData">
				<uni-forms-item name="password">
					<input type="password" v-model="formData.password" class="input"
						:placeholder="'* ' + $t('change_password.current_pwd')" />
				</uni-forms-item>
				<view class="uni-btn-v">
					<button @click="formSubmit" :loading="saveLoading" form-type="submit">{{ $t('setting.delete_account') }}</button>
				</view>
				<view class="tip_info">{{ $t('setting.delete_account_tip') }}</view>
			</uni-forms>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			formData: {
				password: ''
			},
			formRules: {
				password: {
					rules: [
						{
							validateFunction: function (rule, value, data, callback) {
								// debugger
							}
						},
						{
							required: true,
							errorMessage: 'Please enter you current password.',
						}]
				}
			},
			saveLoading: false
		};
	},
	onLoad(option) {
		
	},
	methods: {
		formSubmit() {
			if(this.saveLoading){
				return false;
			}
			//表单验证
			this.$refs.changeForm.validate().then(res => {
				try {
					uni.showModal({
					    title: this.$t('setting.delete_account'),
					    content: this.$t('setting.delete_account_comfirm'),
					    success: (res) => {
					        if (res.confirm) {
								var requestData = {
									password: Buffer.from(this.formData.password).toString('base64')
								}
								uni.showLoading();
					            this.$apis.delAccount(requestData).then((ret) => {
									uni.hideLoading();
									if (ret.code == 200) {
										uni.showToast({
											title: ret.message,
											icon: 'none',
											duration: 3000
										});
										setTimeout(() =>  {
											this.$store.dispatch('logout');
										}, 1000);
									} else {
										uni.showToast({
											title: ret.message,
											icon: 'none',
											duration: 3000
										});
									}
								}).then(() => {
									uni.hideLoading();
								});
					        }
					    }
					});

				} catch {

				}
			}).catch(err => {
				if (err.length) {
					console.log(err[0].errorMessage);
				}
			})
			//api

		}
	}
}
</script>

<style scoped lang="scss">
@import "@/common/mixins.scss";
.tip_info {
	color: #666;
	font-size: 24rpx;
}
.container {
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
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
			margin-bottom: 16rpx;
			height: 104rpx;
			@include onepxBorder(#ccc);

			.input {
				height: 100%;
			}

			/deep/.uni-input-placeholder {
				font-size: 28rpx;
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
