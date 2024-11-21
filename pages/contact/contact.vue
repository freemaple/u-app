<template>
	<view class="container">
		<nav-back :title="$t('contacts.header')"></nav-back>
		<view class="wrapper">
			<uni-forms ref="contactForm" :rules="changeRules" :modelValue="contactData">
				<uni-forms-item name="comment" :label="$t('contacts.your_msg') + ' *'">
					<textarea maxlength="200" v-model="contactData.comment" name="ss" id="df" cols="30" rows="10"
						:placeholder="$t('contacts.characters_max')"></textarea>
				</uni-forms-item>
				<uni-forms-item name="name">
					<input type="text" v-model="contactData.name" class="input" :placeholder="$t('contacts.name') + ' *'"/>
				</uni-forms-item>
				<uni-forms-item name="email">
					<input type="text" v-model="contactData.email" class="input"
						:placeholder="$t('contacts.email_address') + ' *'"/>
				</uni-forms-item>
				<uni-forms-item name="telephone">
					<input type="text" v-model="contactData.telephone" class="input"
						:placeholder="$t('contacts.telephone') + ' *'"/>
				</uni-forms-item>
				<!--<uni-forms-item name="sercrity_code">
					<view class="captcha flex align-items-center justify-content-center"><img v-if="url" @click="refreshCaptcha"
							:src="'data:image/png;base64,' + url" alt="captcha"></view>
					<input type="text" v-model="contactData.sercrity_code" class="input captcha_input"
						placeholder="Captcha" />
				</uni-forms-item>-->
				<view class="uni-btn-v">
					<button @click="formSubmit" form-type="submit">{{ $t('contacts.submit') }}</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			url: '',
			contactData: {
				comment: '',
				name: '',
				telephone: '',
				email: '',
				//sercrity_code: '',
			},
			changeRules: {
				name: {
					rules: [
						{
							required: true,
							errorMessage: 'Please enter your full name.'
						},
					]
				},
				email: {
					rules: [
						{
							required: true,
							errorMessage: 'The email you entered is invalid, Please check your email and try again.'
						},
					]
				},
				/*sercrity_code: {
					rules: [
						{
							required: true,
							errorMessage: 'Please enter your captcha.'
						},
					]
				},*/
				telephone: {
					rules: [
						{
							required: true,
							errorMessage: 'Please enter your phone number.'
						},
					]
				},
				comment: {
					rules: [
						{
							required: true,
							errorMessage: 'Please enter your message.'
						},
					]
				},

			}
		};
	},
	onLoad(option) {
		// const that = this
		// const eventChannel = this.getOpenerEventChannel();
		// eventChannel.on('changeLang', (data) => {
		// 	that.checkedVal = data.checkedVal
		// })
	},
	onShow() {
		//this.refreshCaptcha()
	},
	methods: {
		refreshCaptcha() {
			let that = this
			this.$apis.queryCaptcha({}).then((res) => {
				if (res.code == 200) {
					that.url = res.data.image
				}
			})
		},
		
		formSubmit() {
			const that = this
			that.$refs.contactForm.validate().then(res => {
				that.$apis.contractUsSave(that.contactData).then((res)=>{
					uni.showToast({
						title: res.content,
						icon: 'none'
					})
				})
				.catch((err)=>{
					uni.showToast({
						title: err,
						icon: 'error'
					})
				})
			}).catch(err => {

			})
		},
	}
}
</script>

<style scoped lang="scss">
@import '@/common/mixins.scss';

.container {
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
	background-color: #f3f3f3;
	height: 100%;

	.captcha {
		height: 104rpx;
		width: 328rpx;
		position: absolute;
		right: 0;
		top: 0;

		img {
			width: 277rpx;
		}
	}

	.wrapper {
		width: 100%;
		box-sizing: border-box;
		padding: 16rpx 32rpx;
		background-color: #fff;
		height: calc(100vh - 96rpx);

		/deep/.captcha_input {
			width: 360rpx;
		}

		/deep/.uni-forms-item__error {
			font-size: 28rpx;
		}

		/deep/.uni-textarea-wrapper {
			width: 650rpx;
		}

		.uni-forms-item {
			// margin-top: 32rpx;
			margin-bottom: 16rpx;
			height: 104rpx;

			@include onepxBorder(#ccc);

			.input {
				height: 100%;
			}

			&:nth-child(1) {
				flex-wrap: wrap;
				height: 210rpx;

				/deep/.uni-forms-item__label {
					width: 100% !important;
					color: #999;
					font-size: 28rpx;

				}

				uni-textarea {
					font-size: 28rpx;
				}
			}
/deep/uni-textarea{
	height: 100rpx!important;
}
			/deep/.uni-textarea-placeholder {
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.3);
				height: 32rpx;
				line-height: 32rpx;
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
