<template>
	<view id="box" class="flex">
		<view class="login-box">
			<nav-back>
				<template v-slot:logo>
					<image @click="goHome()" class="logo" mode="widthFix" src="@/static/images/nav_logo.png" alt="logo"></image>
				</template>
			</nav-back>
			<view class="wrapper">
				<view class="bars flex align-items-center">
					<view class="bar flex justify-content-center" @tap="() => { showLogin = false }">
						<view :class="'text ' + (!showLogin ? 'active' : '')">{{ $t('drop_shipping_login_register.register_title') }}</view>
					</view>
					<view class="bar flex justify-content-center" @tap="() => { showLogin = true }">
						<view :class="'text ' + (showLogin ? 'active' : '')">{{ $t('drop_shipping_login_register.login_title') }}</view>
					</view>
				</view>
			</view>
			<view class="error_tip_form" v-show="showLogin">
				<view class="login-header flex">
					<span class="icomoon icon-close" @tap="closeLogin"></span>
				</view>

				<uni-forms ref="form" :modelValue="loginData" :rules="loginRules" validate-trigger="bind">
					<uni-forms-item name="email">
						<uni-easyinput type="text" v-model="loginData.email" :placeholder="'* ' + $t('login.email')" />
					</uni-forms-item>
					<uni-forms-item name="password">
						<uni-easyinput type="password" v-model="loginData.password"
							:placeholder="'* ' + $t('login.password')" />
					</uni-forms-item>
					<view class="uni-btn-v">
						<button type="primary" @tap="bindLogin" :loading="submitBtnDis">{{ $t('login.submit') }}</button>
					</view>
					<view class="forget-wrapper flex justify-content-end">
						<view class="forget-pwd" @tap="handleToForget">{{ $t('login.forget_password') }}?</view>
					</view>
				</uni-forms>
			</view>
			<view class="register-wrap error_tip_form" v-show="!showLogin">
				<uni-forms ref="changeForm" :rules="regRules()" :modelValue="regData" validate-trigger="bind">
					<uni-forms-item name="full_name">
						<uni-easyinput type="text" v-model="regData.full_name" :placeholder="'* ' + $t('drop_shipping_login_register.form.full_name')" />
					</uni-forms-item>
					<uni-forms-item class="customize-form-item" name="country">
						<view @click="$refs.countryPopup.open('bottom')" class="coumter-input uni-input"
							:class="regData.country?'':'placeholder'">
							{{currentCountry.value|| $t('drop_shipping_login_register.form.country_label')}}
						</view>
					</uni-forms-item>
					<uni-forms-item name="phone" class="customize-form-item">
						<view class="int-tel-input-box">
							<int-tel-input ref="intTel" :showflags="false" :showLoding="true" :initialCountry="regData.phone_country_code" refName="popupIntTel" @change="handleChangeIntTel"></int-tel-input>
							<input class="flex align-items-center" style="height: auto;" type="text" v-model="regData.phone" :placeholder="$t('drop_shipping_login_register.form.phone')" />
						</view>
					</uni-forms-item>
					<uni-forms-item name="shop_url">
						<uni-easyinput type="text" v-model="regData.shop_url" class="input"
							:placeholder="'* ' + $t('drop_shipping_login_register.form.shop_url')" />
					</uni-forms-item>
					<uni-forms-item name="category_sold_in_shop">
						<uni-easyinput type="text" v-model="regData.category_sold_in_shop" class="input"
							:placeholder="'* ' + $t('drop_shipping_login_register.form.category_sold_in_shop')" />
					</uni-forms-item>
					<uni-forms-item name="email">
						<uni-easyinput type="text" v-model="regData.email" class="input"
							:placeholder="'* ' + $t('drop_shipping_login_register.form.email')" />
					</uni-forms-item>
					<uni-forms-item name="password">
						<uni-easyinput type="password" v-model="regData.password" class="input"
							:placeholder="'* ' + $t('drop_shipping_login_register.form.password')" />
					</uni-forms-item>
					<uni-forms-item name="confirmation">
						<uni-easyinput type="password" v-model="regData.confirmation" class="input"
							:placeholder="'* ' + $t('drop_shipping_login_register.form.confirm_password')" />
					</uni-forms-item>
					<!--<uni-forms-item name="captcha" class="captcha-form-item">
						<uni-easyinput type="text" v-model="regData.captcha" class="captcha_input"
							:placeholder="'* ' + $t('register.captcha')" />
						<view class="captcha flex align-items-center justify-content-center"><image v-if="url" class="captcha-img"
								@click="refreshCaptcha" :src="'data:image/png;base64,' + url" alt="captcha"></image></view>
					</uni-forms-item>-->
					<uni-forms-item name="privacy">
						<checkbox-group class="privacy-group" @change="checkboxChange">
							<checkbox checked value="checked" />
							<view class="privacy-text">{{ $t('register.agree_to', {site_name: $store.state.site_name_upper}) }} 
							<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')" class="text-underline">{{ $t('register.terms_conditions')}}</text> 
							<text>{{ $t('register.and')}}</text> <text class="text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{ $t('register.privacy_policy')}}</text> <text style="margin-left: -2px;">.</text>
							</view>
						</checkbox-group>

					</uni-forms-item>
					<view class="uni-btn-v">
						<button :loading="registerBtnDis" @click="regSubmit" form-type="submit" type="primary">{{ $t('register.submit')
							}}</button>
					</view>
				</uni-forms>
			</view>
			
			<view class="dropshipper-entrance-container">
				<text @click="$public.handleNavTo('/pages/login/index')">{{$t('drop_shipping_login_register.back_to_general_login')}} >></text>
			</view>
		</view>
		
		<!-- 国家选择器 -->
		<uni-popup ref="countryPopup" background-color="#fff">
			<view class="picker-header-box flex justify-content-between align-items-center">
				<view class="cancel" @click="$refs.countryPopup.close()">{{$t("my_dropshipping.cancelText")}}</view>
				<!-- 搜索框 -->
				<uni-easyinput class="uni-mt-5" v-model="countrySearchKey" :placeholder="$t('my_dropshipping.please_enter')"
					@input="handleSearchCountry"></uni-easyinput>
				<view class="confirm" @click="confirmSelectedCountry">{{$t("my_dropshipping.confirmText")}}</view>
			</view>
			<picker-view v-if="searchCountryList.length" :value="currentCountryIndex" indicator-style="height:50px"
				@change="bindPickerChangeCountry" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in searchCountryList" :key="index">
						{{ item.value }}
					</view>
				</picker-view-column>
			</picker-view>
			<view class="nodata" v-else>
				{{$t('my_dropshipping.nodata')}}
			</view>
		</uni-popup>
		<!-- 注册成功弹窗 -->
		<RegisterSuccessPopup :registerSuccessData="registerSuccessData" ref="pRegisterSuccess" @change="(data)=>{showRegisterSuccess=data;}"></RegisterSuccessPopup>
	</view>
</template>

<script>
const app = getApp();
import $util from '@/utils/util.js';
import RegisterSuccessPopup from '@/components/register-success-popup/register-success-popup.vue'
import {
	mapState,
	mapMutations,
	mapGetters,
	mapActions
} from 'vuex'
export default {
	components: {
		RegisterSuccessPopup
	},
	data() {
		return {
			showRegisterSuccess:false,
			registerSuccessData: {
				active_email_points:'',
				contact_email:'',
				expired_time:0
			},
			countrySearchKey: '', // 国家搜索关键词
			initAddressCountryList: [], // 国家列表初始数据
			searchCountryList: [], // 筛选国家的列表
			currentCountryIndex: [0], // 当前选择国家的index
			currentCountry: {value:'United States'}, // 当前选择的国家
			platform: '',
			showLogin: true,
			btnDis: false,
			submitBtnDis: false,
			registerBtnDis: false,
			url: '',
			//登录数据
			loginData: {
				email: "",
				password: ""
			},
			//注册数据
			regData: {
				full_name:'',
				country:'US',
				phone:'',
				phone_country_code:'us',
				phone_area_code:'1',
				shop_url:'',
				category_sold_in_shop:'',
				email: '',
				password: '',
				confirmation: '',
				//captcha: '',
				privacy: 1,
				is_dropshipper:1,
			},
			//登录验证规则
			loginRules: {
				// 对email字段进行必填验证
				email: {
					rules: [{
						required: true,
						errorMessage: 'The email you entered is invalid, Please check your email and try again.',
					}, {
						format: 'email',
						errorMessage: 'The email you entered is invalid, Please check your email and try again.',
					}]
				},
				// 对password字段进行必填验证
				password: {
					rules: [{
						required: true,
						errorMessage: 'Please enter your password.',
					}]
				},
			},
			reqBody: {},
			// 如果为登录状态 默认跳转的地址
			redirectRoute: {},
			routeQuery: {},
		}
	},
	computed: {
		statusBarHeight() {
			return app.globalData.statusBarHeight
		},
		titleBarHeight() {
			return app.globalData.titleBarHeight
		}
	},
	onBackPress() {
		if(this.showRegisterSuccess) {
			this.$refs.pRegisterSuccess.close();
			this.loginHandel();
			return true;
		} else {
			return false;
		}
	},
	onLoad(query) {
		// 获取国家列表
		this.getCountry();
		let pageType = query.page && query.page.toLocaleLowerCase();
		if(pageType == 'register'){
			this.showLogin = false;
		}
		// #ifdef APP-PLUS
		var info = plus.push.getClientInfo();
		this.loginData.client_id = info.clientid;
		this.regData.client_id = info.clientid;
		// #endif
		this.initredirectRouteData(query);
		// #ifdef APP-PLUS
		let platform = uni.getSystemInfoSync().platform;
		this.platform = platform;
		//#endif
	},
	onUnload() {
		//#ifdef APP-PLUS
		uni.hideLoading();
		//#endif
	},
	onShow() {
		//this.refreshCaptcha()
	},
	onHide() {
		//#ifdef APP-PLUS
		if (this.isUniLogining) {
			uni.hideLoading();
			this.isUniLogining = false;
		}
		//#endif
	},
	methods: {
		getCountry() {
			this.$apis.getCountryList().then(res=>{
				this.initCountryList = this.formatObjToArray(res.data.countryArr);
				this.searchCountryList = this.initCountryList;
			})
		},
		// 国家搜索
		handleSearchCountry(e) {
			this.countrySearchKey = e;
			this.searchCountryList = this.initCountryList.filter(item => {
				if (item.value.toLowerCase().indexOf(this.countrySearchKey.toLowerCase()) > -1) {
					return item
				}
			})
		},
		// 对象转数组
		formatObjToArray(data) {
			const keys = Object.keys(data)
			let arr = [];
			return keys.map(item => {
				return {
					value: data[item],
					text: item
				}
			})
		},
		// 国家选择
		bindPickerChangeCountry(e) {
			this.currentCountryIndex = e.detail.value
		},
		// 确认国家选择
		confirmSelectedCountry() {
			this.currentCountry = this.searchCountryList[this.currentCountryIndex[0]]
			this.regData.country = this.currentCountry.text
			this.$refs.countryPopup.close()
		},
		handleChangeIntTel(index,data) {
			this.regData.phone_area_code = data.code;
			this.regData.phone_country_code = data.c_code;
			this.$refs.intTel.close();
		},
		regRules(){
			const that = this
			return {
				full_name:{
					rules: [
						{
							required: true,
							errorMessage: that.$t('drop_shipping_login_register.form.full_name_p'),
						}
					]
				},
				shop_url:{
					rules: [
						{
							required: true,
							errorMessage: that.$t('drop_shipping_login_register.form.shop_url_p'),
						}
					]
				},
				category_sold_in_shop:{
					rules: [
						{
							required: true,
							errorMessage: that.$t('drop_shipping_login_register.form.category_sold_in_shop_p'),
						}
					]
				},
				phone:{
					rules: [
						{
							required: true,
							errorMessage: that.$t('drop_shipping_login_register.form.phone_p'),
						}
					]
				},
				email: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('register.email_validate'),
						},
						{
						format: 'email',
						errorMessage: that.$t('register.email_validate'),
					}
					]
				},
				password: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('register.password_validate'),
						},
						{
							validateFunction:  (rule, value, data, callback) =>  {
								// if (value !== data.reEnterPwd) callback(that.$t('register.reg_tips'))
								const reg = /^(?=.*[A-Za-z])(?=.*\d)\S{6,30}$/
								if (!reg.test(value)) {
									callback(that.$t('register.reg_tips'))
								}
							}
						},
					]
				},
				confirmation: {
					rules: [
						{
							required: true,
							errorMessage: this.$t('register.confirm_password_tip')
						},
						{
							validateFunction: (rule, value, data, callback) =>  {
								if (value !== data.password) callback(that.$t('register.confirm_password_tip'))
								// const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/
								// if(!reg.test(value)){
								// 	callback(that.$t('register.confirm_password_tip'))
								// }
							}
						},]
				},
			}
		},
		goHome() {
			uni.switchTab({
				url:'/pages/index/index'
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
		handleToForget() {
			uni.navigateTo({
				url: '/pages/forget-password/forget-password'
			})
		},
		checkboxChange(e) {
			this.regData.privacy = e.detail.value.length
		},
		regSubmit() {
			const that = this
			//表单验证
			this.$refs.changeForm.validate().then(async res => {
				if (!this.regData.privacy) {
					console.log('please check');
					return
				}
				try {
					this.registerBtnDis = true
					let regData = this.regData;
					//邀请码
					if(this.$store.state.aicode){
						regData.aicode = this.$store.state.aicode;
					}
					let response = await this.$apis.dropShippingRegister(regData);
					this.registerBtnDis = false;
					if (response.code == '200') {
						// 注册成功显示注册成功信息
						// this.loginHandel();
						this.registerSuccessData = response.data;
						this.$refs.pRegisterSuccess.open();
						this.getCartInfo();
					} else if(response.message) {
						uni.showToast({
							title: response.message,
							icon: "none"
						});
					}
				} catch {
					this.registerBtnDis = false;
				}
			}).catch(err => {
				if (err.length) {
					console.log(err[0].errorMessage);
				}
			})
		},
		getCartInfo() {
			this.$apis.getCartList({},{loading:false}).then(res => {
				let num = res.data.cart_info ? res.data.cart_info.items_count : 0;
				this.$store.commit('SET_CART_COUNT', num)
				getApp().globalData.getShopCartNum();
			})			
		},
		initredirectRouteData(query) {
			if (query.redirectUrl) {
				let redirectUrl = query.redirectUrl;
				delete query.redirectUrl;
				redirectUrl = $util.objParseUrlAndParam(redirectUrl, query);
				this.redirectRoute.path = redirectUrl;
				delete query.redirectUrl;
				this.routeQuery = query;
			}
		},
		// 登录
		async bindLogin() {
			const that = this
			that.$refs.form.validate().then(async res => {
				try {
					// 校验通过...
					that.submitBtnDis = true;
					let rst = await that.$apis.dropShippingLogin(that.loginData);
					if (rst.code == '200' || rst.code == '1100006') {
						// 更新VIP是否展示的开关字段 1true 2false
						rst.data.is_show_vip&&this.$store.commit('SET_SHOW_VIP', rst.data.is_show_vip=='1' ? true : false)	
						that.$store.commit('SET_USER_TYPE', 2)
						that.loginHandel();
					} else {
						uni.showToast({
							title: rst.status.error_desc || 'Login Failed',
							icon: "none"
						});
						that.submitBtnDis = false;
					}
				} catch (e) {
					that.submitBtnDis = false;
				}
			}).catch(err => {
			})
		},
		loginHandel(){
			// 这里最好是登录成功返回购物车数量，而不是调取购物车接口
			this.getCartInfo();		
			this.loginRedirect();
			if(userInfo){
				this.$store.commit('SET_USERINFO', userInfo);
			}
		},
		//登录后跳转页面
		loginRedirect() {
			if (this.redirectRoute.path && this.redirectRoute.path.indexOf('/pages/login') == -1 && this.redirectRoute.path.indexOf('/pages/dropshipping-login')== -1) {
				let switchIndex = $util.checkSwitch(this.redirectRoute.path, this)
				//判断是否是底部tab
				if (switchIndex > -1) {
					uni.switchTab({
						'url': this.redirectRoute.path
					});
				} else {
					let url = this.redirectRoute.path;
					if(this.redirectRoute.path.indexOf('?') != -1){
						url +='&loginback=1'
					} else {
						url +='?loginback=1'
					}
					uni.redirectTo({
						'url': url
					});
				}
			} else {
				let pages = getCurrentPages();
				let l = pages.length;
				if (l > 1) {
					let prev_page = '/' + pages[l - 2].route;
					if (prev_page != '/pages/login/index'&&prev_page != '/pages/dropshipping-login/index') {
						uni.navigateBack();
					} else {
						uni.switchTab({
							url: '/pages/my/my'
						});
					}
				}
				uni.reLaunch({
					url: '/pages/my/my'
				});
			}
		},
		//关闭登录
		closeLogin() {
			let pages = getCurrentPages();
			let l = pages.length;
			if (l > 1) {
				let prev_page = '/' + pages[l - 2].route;
				if (prev_page != this.$mRoutesConfig.login.path) {
					this.$mRouter.navigateBack();
					return false;
				}
			}
			this.$mRouter.switchTab({
				route: this.$mRoutesConfig.main
			});
		},
		snsLogin(type){
			uni.login({
			    provider: type,
			    success: (loginRes) =>  {
			        // 登录成功
			        uni.getUserInfo({
			            provider: type,
			            success: (info) => {
							var data = {
								type: type
							};
							if(this.loginData.client_id){
								data.client_id = this.loginData.client_id;
							}
							for(var i in info.userInfo){
								data['userInfo[' + i +']'] = info.userInfo[i];
							}
							if(loginRes.authResult.access_token){
								data['third_token'] = loginRes.authResult.access_token;
							}
							if(!data['userInfo[email]']){
								var msg = this.$t('login.sns_login_no_email');
								if(type == 'apple'){
									msg = this.$t('login.apple_login_no_email');
								} 
								uni.showToast({
									title: msg,
									icon: "none",
									duration: 3000
								});
								return;
							}
							//邀请码
							if(this.$store.state.aicode){
								data.aicode = this.$store.state.aicode;
							}
							this.$apis.postThirdLogin(data).then((res) => {
								if(res.code == '200'){
									this.loginHandel();
								} else {
									var message = res.message ? res.message : this.$t('login.sns_login_error');;
									uni.showToast({
										title: message,
										icon: "none",
										duration: 3000
									});
								}
							}).catch((res) => {
								var message = res.message ? res.message : this.$t('login.sns_login_error');;
								uni.showToast({
									title: message,
									icon: "none",
									duration: 3000
								});
							})
			            }
			        })
			    },
			    fail: (err) => {
					let platform = uni.getSystemInfoSync().platform;
					if(platform == 'android'){
						var message = this.$t('login.sns_login_error');
						uni.showToast({
							title: message,
							icon: "none",
							duration: 3000
						});
					}
			    }
			});
		},
		nagToPage(url) {
			uni.navigateTo({
				url
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';

page {
	background-color: #FFFFFF;
}

#box {
	flex-direction: column;
	min-height: 100vh;
}

.titleBold {
	font-size: 48rpx;
	padding-left: 20upx;
	color: #444444;
	text-align: center;
	margin-bottom: 20rpx;
}

.logo {
	height: auto;
	width: 140rpx;
}
.captcha-form-item{
	position: relative;
	/deep/.captcha_input {
	width: 360rpx;
}
	
}
.captcha {
	height: 104rpx;
	width: 358rpx;
	position: absolute;
	right: 0;
	top: 0;
	.captcha-img{
		width: 277rpx;
		height: 64rpx;
	}
	// img {
	// 	width: 277rpx;
	// }
}

.login-box {
	// padding: 0 20upx 20upx 20upx;
	width: 100%;
	position: relative;
	flex-grow: 1;
	// box-sizing: border-box;
}

.join {
	height: 192rpx;
	margin-bottom: 40rpx;
	.title {
		color: #999;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 24rpx;
		text-align: center;
		margin-bottom: 24rpx;
	}

	.lists {
		padding: 0px 10rpx;
		.item{
			margin: 20rpx 10rpx;
			background-color: #fff;
			border: 1px solid #e2e2e2;
			flex: 1;
			height: 80upx;
			font-size: 26rpx;
			text-align: center;
			line-height: 80upx;
			border-radius: 14rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333;
			max-width: 80%;
			&.apple {
				color: #FFFFFF;
				background-color: #000;
				.flex-img{
					width: 38rpx;
					height: 38rpx;
					margin-right: 10rpx;
				}
			}
			.flex-img{
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
}
.forget-wrapper{
	width: 100%;
}
.forget-pwd {
	// width: 50%;
	text-align: right;
	font-size: 28rpx;
	color: #333;
	padding-right: 20rpx;
}

.uni-btn-v {
	// width: 686rpx;
	height: 96rpx;
	margin-top: 72rpx;
	margin-bottom: 32rpx;

	/deep/uni-button {

		height: 100%;
		background: #000;
		font-size: 32rpx;
		line-height: 96rpx;
		color: #fff;
		border-radius: 0;

		&::after {
			display: -webkit-flex;
			display: flex;
			text-align: center;
			align-items: center;

		}
	}
}

.wrapper {
	.bars {
		width: 100%;
		height: 96rpx;
		@include onepxBorder(#e0e0e0);

		.bar {
			width: 50%;
			height: 100%;

			.text {
				text-align: center;
				display: inline-block;
				line-height: 96rpx;
				height: 100%;
				font-size: 28rpx;
				color: #333;
				// @include onepxBorder(#333, 8px);
				position: relative;
			}

			.active {
				font-weight: 700;

				&::after {
					content: "";
					width: 100%;
					height: 1px;
					position: absolute;
					bottom: 0;
					left: 0;
					background-color: #333;
					z-index: 1;
				}
			}
		}
	}
}

/deep/.uni-forms {
	padding: 0 20rpx;
}



/deep/.login-box .uni-easyinput__content-input {
	height: 104rpx!important;
	font-size: 28rpx;
}

/deep/.login-box .uni-input-wrapper {
	height: 104rpx;

	.uni-input-placeholder {
		font-size: 28rpx !important;
	}
}

.register-wrap {
	width: 100%;
	.privacy-group {
		display: flex;
	}
	.privacy-text {
		display: inline-block;
		font-size: 24rpx;
		text {
			padding-left: 3px;
		}
	}

	/deep/.uni-checkbox-input-checked {
		box-sizing: border-box;
		background: #000;
		border: 0;

		&::before {
			color: #fff;
		}
	}

	/deep/.uni-checkbox-input {
		box-sizing: border-box;
		border-radius: 50%;
	}

	/deep/.uni-forms-item__error {
		font-size: 28rpx;
	}

	.uni-forms-item {
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		height: 104rpx;

		// @include onepxBorder(#ccc);
		// &:last-child {
		// 	background: pink;
		// 	&::after{
		// 		content: '';
		// 	}
		// }
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
	&.error_tip_form .uni-forms-item{
		margin-bottom: 80rpx;
	}

}

.login-header {
	flex-direction: row;
	justify-content: flex-end;
	margin-bottom: 10px;
	padding-top: 20px;

	&>.icon-close {
		font-size: 28px;
		margin-right: 20px;
	}
}

.error_tip_form .uni-forms-item{
		margin-bottom: 80rpx;
	}

.h2 {
	font-size: 50upx;
	text-align: center;
	padding: 60upx 0;
}

.protocolBox {
	font-size: 12px;
	padding-top: 25px;
	height: 30px;
	display: flex;
	flex-direction: row;
	align-items: center;

	.none-checked {
		display: inline-block;
		height: 35upx;
		line-height: 35upx;
		width: 35upx;
		border: 2upx solid #DADADA;
		border-radius: 50%;
		margin-right: 5upx;
	}

	.checked {
		height: 35upx;
		line-height: 35upx;
		width: 35upx;
		background-color: #F00C41;
		border: 2upx solid #DADADA;
		border-radius: 50%;
		color: #ffffff;
		text-align: center;
		font-size: 30upx;
		margin-right: 5upx;
	}

	.terms {
		color: #000000;
		opacity: 0.7;
		text-decoration: underline;
		margin-left: 5px;
	}
}
.dropshipper-entrance-container {
	text-align: center;
	color: #0071E3;
	margin-bottom: 40rpx;
	font-size: 28rpx;
	margin-top: 20rpx;
}
.int-tel-input-box {
	display: flex;
	align-items: center;
	padding-bottom: 16rpx;
}
/deep/.int-tel-input-box  .uni-input-wrapper {
	height: unset;
}

/* 弹窗 */
	.picker-header-box {
		font-size: 17px;
		color: #888888;
		height: 60px;
		border-bottom: 1px solid #e5e5e5;
		padding: 0 24rpx;
	}

	.picker-header-box .cancel {
		margin-right: 10px;
	}

	.picker-header-box .confirm {
		color: #000;
		margin-left: 10px;
	}

	.picker-view {
		height: 600rpx;
		background: #ffffff;
	}

	.item {
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
		display: flex;
	}
	.customize-form-item {
		border: 1px solid rgb(229, 229, 229);
		border-radius: 4px;
		display: flex;
		align-items: center;
		padding-left: 10px;
	}
	.customize-form-item .int-tel-input-box {
		padding-bottom: 0;
		height: 110rpx;
	}
	.coumter-input.uni-input {
		font-size: 28rpx;
	}
</style>
