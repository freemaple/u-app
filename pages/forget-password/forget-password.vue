<template>
  <view>
    <nav-back>
      <template v-slot:logo>
        <image class="logo" src="@/static/images/nav_logo.png" mode="widthFix" alt="logo"></image>
      </template>
    </nav-back>
    <view class="box-forget">
      <uni-forms ref="changeForm" :rules="changeRules()" :modelValue="changeData" validate-trigger="bind">

        <uni-forms-item name="tip">
          <view class="tip">{{ $t('forget_password.tips1') }}</view>
          <view class="tip">{{ $t('forget_password.tips2') }}</view>
        </uni-forms-item>
        <uni-forms-item name="email">
          <uni-easyinput type="text" v-model="changeData.email" class="input" :placeholder="$t('forget_password.placeholder')" />
        </uni-forms-item>
        <!--<uni-forms-item name="captcha">
          <uni-easyinput type="text" v-model="changeData.captcha" class="captcha_input" placeholder="Captcha" />
          <view class="captcha flex align-items-center justify-content-center"><img v-if="url" @click="refreshCaptcha"
              :src="'data:image/png;base64,' + url" alt="captcha"></view>
        </uni-forms-item>-->
        <view class="uni-btn-v">
          <button @click="formSubmit" :loading="submitLoading" form-type="submit">{{ $t('forget_password.resetpwd') }}</button>
        </view>
      </uni-forms>
    </view>
  </view>
</template>

<script>
export default {
  name: 'forget-password',
  data() {
    return {
      url: '',
	  submitLoading: false,
      
      changeData: {
        email: '',
        //captcha: ''
      }
    }
  },
  onShow() {
    //this.refreshCaptcha()
  },
  methods: {
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
									callback(that.$t('forget_password.reg_msg'))
								}
							}
						},

          ]
        },
      }
    },
    formSubmit() {
      const that = this
	  if(this.submitLoading){
		  return false;
	  }
      that.$refs.changeForm.validate().then(async res => {
        try {
		  this.submitLoading = true;
          const response = await that.$apis.postSendCode(that.changeData);
		  this.submitLoading = false;
		  if(response.code == 200){
			  uni.showToast({
			  	title: response.message,
			  	icon: "none"
			  });
		  }
        } catch {
			this.submitLoading = false;
        }
      })
    },
    refreshCaptcha() {
      let that = this
      this.$apis.queryCaptcha({}).then((res) => {
        if (res.code == 200) {
          that.url = res.data.image
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.box-forget {
  width: 100%;
  padding: 20rpx 30rpx;
}

.logo {  
  height: auto;
  width: 160rpx;
}

.tip {
  padding: 0 20rpx;
  font-size: 28rpx;
}

.captcha {
  height: 104rpx;
  width: 50%;
  position: absolute;
  right: 0;
  top: 0;

  img {
    width: 277rpx;
  }
}

/deep/.captcha_input {
  width: 360rpx;
}

/deep/.uni-input-placeholder {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.3);
  height: 32rpx;
  line-height: 32rpx;
}

.uni-btn-v {
  // width: 686rpx;
  height: 96rpx;
  margin-top: 72rpx;
  margin-bottom: 32rpx;

  // margin-left: 30rpx;
  /deep/uni-button {

    height: 100%;
    background: #000;
    font-size: 32rpx;
    line-height: 96rpx;
    color: #fff;

    &::after {
      display: flex;
      text-align: center;
      align-items: center;

    }
  }
}

/deep/.uni-easyinput__content-input {
  height: 104rpx;
  font-size: 28rpx;
}

/deep/.uni-input-wrapper {
  height: 104rpx;

  .uni-input-placeholder {
    font-size: 28rpx !important;
  }
}
</style>