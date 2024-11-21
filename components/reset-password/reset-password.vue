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
					<view class="header-wrapper font-bold flex justify-content-center align-items-center">{{ $t('forget_password.forget_pwd') }}</view>
					<view v-if="!sendSuccess">
						<view class="pop_content">
						    <view class="reset_text">{{ $t('forget_password.tips1') }}</view>
						    <view class="reset_text">{{ $t('forget_password.tips2') }}</view>
						</view>
						<uni-forms ref="changeForm" :rules="changeRules()" :modelValue="changeData" validate-trigger="bind">
						    <uni-forms-item name="email">
						        <view class="input_label">{{ $t('forget_password.placeholder') }}</view>
						        <uni-easyinput type="text" v-model="changeData.email" class="input" @input="submitError = ''"/>
								<view class="form-error" v-if="submitError">{{ submitError }}</view>
						    </uni-forms-item>
						</uni-forms>
						<view class="footer-box">
							<view class="btn-boxs">
								<view :class="'uni-btn-v font-bold ' + (showError ? 'show_error' : '')">
									<button @click="formSubmit" :loading="submitLoading">{{ $t('forget_password.submit') }}</button>
								</view>
							</view>
						</view>
					</view>
                    <view v-else>
						<view class="pop_content">
						    <view class="reset_text">
								<view>{{ $t('forget_password.success_tip_1') }}</view>
								<view style="margin-top: 20rpx;">
									{{ $t('forget_password.success_tip_2') }}
								</view>
								<view>{{ $t('forget_password.success_tip_3') }}</view>
								<view>{{ $t('forget_password.success_tip_4') }} <text @tap="toCustomerCare" class="u-link">{{ $t('forget_password.customer_care') }}</text>.</view>
							</view>
						</view>
						<view class="footer-box">
							<view class="btn-boxs">
								<button class="btn1 font-bold" @tap="close">{{ $t('forget_password.btn_1') }}</button>
								<button class="btn2 font-bold" @tap="showSend">{{ $t('forget_password.btn_2') }}</button>
							</view>
							
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
                        this.submitLoading = true;
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
.form-error {
	color: #FF0000;
	margin-bottom: 20rpx;
	font-size: 24rpx;
	position: relative;
	margin-top: 10rpx;
}
.form-error::before {
	content: "";
	width: 34rpx;
	height: 34rpx;
	background-image: url('@/static/images/error.png');
	margin-right: 4rpx;
	background-size: 100%;
	display: inline-block;
	vertical-align: text-bottom;
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
    font-size: 35rpx;
    color: #000000;
    line-height: 41rpx;
    margin-top: 38.46rpx;
    margin-bottom: 46.15rpx;
}
.reset_text{
    font-size: 30rpx;
    color: #666666;
    line-height: 50rpx;
}
.pop_content{
    padding: 0 46rpx;
    margin-bottom: 61.54rpx;
}
.input_label{
    height: 38rpx;
    font-size: 27rpx;
    color: #666666;
    line-height: 32rpx;
    margin-bottom: 13.46rpx;
}
.footer-box {
	position: fixed;
	width: 100%;
	left: 0px;
	bottom: 40rpx;
}
/deep/.uni-forms {
	padding: 0px 46rpx;
}
/deep/.uni-input-input{
    height: 92rpx;
}
/deep/.uni-forms-item{
    margin-bottom: 0;
}
.uni-btn-v{
    margin-top: 61.54rpx;
    height: 92rpx;    
    font-size: 32rpx;
    line-height: 36rpx;    
    uni-button{
        color: #fff;
        background: #000000;
		font-size: 32rpx;
    }
    &.show_error{
        margin-top: 146.15rpx;
    }
}
.btn-boxs {
	padding: 0px 46rpx;
}
.btn1 {
	margin-top: 40rpx;
	height: 92rpx;    
	font-size: 30rpx;
	line-height: 92rpx;    
	color: #fff;
	background: #000000;
}
.btn2 {
	margin-top: 40rpx;
	height: 80rpx;    
	font-size: 30rpx;
	line-height: 80rpx;    
	color: #333;
	background: #fff;
	border: .0256rem solid #000;
}
/deep/.uni-forms-item__error {
	position: static;
}
/deep/ .uni-easyinput__content .content-clear-icon {
	font-size: 48rpx !important;
}
</style>