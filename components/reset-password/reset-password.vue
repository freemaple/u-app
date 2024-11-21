<template>
    <view @touchmove.stop.prevent="()=>{}">
		<uni-popup ref='popup' type="bottom">
			<view class="pop-wrapper" >
                <view class="img_box" @tap="close">
                    <image
                        class="img"
                        src="@/static/images/login/close_icon@2x.png"
                        mode="scaleToFill"
                    />
                </view>
				<scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between">
					<view class="header-wrapper flex justify-content-center align-items-center">{{ $t('forget_password.forget_pwd') }}</view>
					<!-- 未发送邮件 -->
					<view v-if="!sendSuccess">
						<view class="pop_content">
						    <view class="reset_text">{{ $t('forget_password.tips1') }}</view>
						    <view class="reset_text">{{ $t('forget_password.tips2') }}</view>
						</view>
						<uni-forms ref="changeForm" :rules="changeRules()" :modelValue="changeData" validate-trigger="bind">
						    <!-- Email Address -->
							<uni-forms-item name="email">
						        <view class="input_label">{{ $t('forget_password.placeholder') }}</view>
						        <uni-easyinput type="text" v-model="changeData.email" class="input" @input="submitError = ''"/>
								<view v-if="submitError" class="tip_psw_signin">
									<view class="tip_icons">
										<image src="@/static/images/error.png" mode="widthFix" style="width: 34rpx; height: 34rpx; margin-right: 3.85rpx;"></image>
									</view>
									<view>{{ submitError }}</view>
								</view>
								<!-- <view class="tip_psw_signin ml23r" v-if="submitError">
									{{ submitError }}
								</view> -->
						    </uni-forms-item>
						</uni-forms>
						<view class="footer-box">
							<button @tap="formSubmit" :loading="submitLoading">
								{{ $t('forget_password.send') }}
							</button>
						</view>
					</view>
					<!-- 已发送 -->
                    <view v-else>
						<view class="pop_content">
						    <view class="reset_text">
								<view>{{ $t('forget_password.success_tip_1') }}</view>
								<view style="margin-top: 20rpx;">
									{{ $t('forget_password.success_tip_2') }}
								</view>
								<view>{{ $t('forget_password.success_tip_3') }}</view>
								<view>{{ $t('forget_password.success_tip_4') }} 
									<text @tap="toCustomerCare" class="u-link">
										{{ $t('forget_password.customer_care') }}
									</text>.
								</view>
							</view>
						</view>
						<view class="footer-box">
							<button class="btn_return_signin" @tap="close">{{ $t('forget_password.btn_1') }}</button>
							<button class="btn_resend_email" @tap="showSend">{{ $t('forget_password.btn_RESEND_EMAIL') }}</button>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
    export default {
        data(){
            return {
                screenHeight: 0,
                submitLoading: false,
                showError: false,
                changeData: {
                    email: '',
                },
				//发送成功
				sendSuccess: false,
				//提交错误提示语
				submitError: ''
            }
        },
        created() {
            const that = this
            uni.getSystemInfo({
                success: (res)=> {
                    that.screenHeight = res.screenHeight
                }
            })
        },
        methods: {
            open(){
                this.$refs['popup'].open()
				this.submitError = '';
            },
            close(){
                this.$refs['popup'].close()
            },
			initData(data){
				if(data.email){
					this.changeData.email = data.email;
				}
			},
            changeRules(){
                const that = this
                return {
                    email: {
                        rules: [
                            {
                                required: true,
                                errorMessage: that.$t('forget_password.empty_msg')
                            },
                            {
                                validateFunction:  (rule, value, data, callback) =>  {
                                    const reg = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
                                    if (!reg.test(value)) {
                                        that.showError = true
										console.log(that.$t('forget_password.reg_msg'), "that.$t'forget_password.reg_msg'")
                                        callback(that.$t('forget_password.reg_msg'))
                                    }else{
                                        that.showError = false
                                    }
                                }
                            },

                        ]
                    },
                }
            },
            formSubmit() {
				this.submitError = '';
                const that = this
                if(this.submitLoading){
                    return false;
                }
                that.$refs.changeForm.validate().then(async res => {
                    try {
                        that.submitLoading = true;
						that.$apis.postSendCode(that.changeData).then((response) => {
							if(response.code == 200){
							    that.sendSuccess = true;
								that.submitLoading = false;
							}
						}).catch((rst) => {
							that.submitLoading = false;
							var msg = rst.errors || rst.message || rst.content || rst.error_message || '';
							that.submitError = msg;
						});
                    } catch {
                        that.submitLoading = false;
                    }
                })
            },
			showSend(){
				this.sendSuccess = false;
			},
			toCustomerCare(){
				this.$public.handleNavTo('/pages/contact/contact');
			}
        }
    }
</script>
<style lang="scss" scoped>
.u-link {
	color: #0071E3;
	text-decoration: underline;
	margin: 0px 8rpx;
}
// 校验 
/deep/.uni-forms-item__error {
	display: flex;
	align-items: flex-start;
	font-size: 27rpx;
	color: #FF512B;
	padding: 0;
	margin-left: 23.08rpx;
	margin-top: 15.38rpx;
	line-height: 34.62rpx;
	&::before {
		content: "";
		width: 34rpx;
		height: 34rpx;
		background-image: url('@/static/images/error.png');
		margin-right: 3.85rpx;
		background-size: 100%;
		display: inline-flex;
		flex-shrink: 0;
		/* 确保图标不会缩小 */
	}
}
.pop-wrapper{
    width: 100%;
    background: #fff;
    height: 961.54rpx;
    border-radius: 30.77rpx 30.77rpx 0 0;
    position: relative;
    .img_box{
        z-index: 1;
        position: absolute;
        right: 46.15rpx;
        top: 46.15rpx;
        width: 34.62rpx;
        height: 34.62rpx;
        .img{
            width: 100%;
            height: 100%;
        }
    }
}
.header-wrapper{
    width: 100%;
    font-size: 30.77rpx;
	font-family: "Montserrat-SemiBold";
    color: #222;
    line-height: 46.15rp;
    margin-top: 38.46rpx;
    margin-bottom: 46.15rpx;
}
.reset_text{
	font-size: 26.92rpx;
	color: #666;
	line-height: 42.31rpx;
}
.pop_content{
    padding: 0 46.08rpx;
    margin-bottom: 46.15rpx;
}
.input_label{
    font-size: 27rpx;
    color: #666;
    line-height: 32rpx;
	margin: 0 0 19.23rpx 23.08rpx;
}
.tip_email_hadregistered, .tip_psw_signin {
	display: inline-flex;
	font-size: 27rpx;
	color: #FF512B;
	padding: 0;
	margin-left: 23.08rpx;
	margin-top: 15.38rpx;
	line-height: 34.62rpx;

}
/deep/.uni-forms {
	padding: 0px 46rpx;
}
/deep/.uni-input-input{
    height: 92rpx;
}
/deep/.uni-easyinput__content-input {
	height: 92.31rpx !important;
	font-size: 28rpx;
	padding-left: 46.15rpx !important;
}
/deep/.uni-forms-item{
    margin-bottom: 0;
}
.footer-box {
	position: fixed;
	width: 100%;
	bottom: 61.54rpx;
	padding: 0 30.77rpx;
	font-size: 30.77rpx;
	/deep/uni-button {
		text-align: center;
		width: 100%;
		border-radius: 73rpx;
		background: #222;
		color: #fff;
	}
	.btn_return_signin {
		margin-bottom: 23.08rpx;
	}
	.btn_resend_email {
		color: #333;
		background: #fff;
		border: 2rpx solid #222;
	}
}
/deep/.uni-forms-item__error {
	position: static;
}
/deep/ .uni-easyinput__content .content-clear-icon {
	font-size: 48rpx !important;
}
</style>