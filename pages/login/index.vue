<template>
	<view id="box" class="flex">
		<view class="login_header flex align-items-center">
			<view class="img_box" >
				<image
					@click="goHome()"
					class="img"
					src="@/static/images/header_back_icon@2x.png"
					mode="scaleToFill"
				/>
			</view>
			<view class="title">
				<image
					class="img"
					src="@/static/images/login/dressin_logo@2x.png"
					mode="scaleToFill"
				/>
			</view>
		</view>
		<view class="login-box" v-if="!isAicodePage">
			<view class="wrapper">
				<view class="bars flex align-items-center font-bold">
					<view class="bar flex justify-content-center" @tap="changeTab(false)">
						<view :class="'text ' + (!showLogin ? 'active' : '')">{{ $t('register.title') }}</view>
					</view>
					<view class="bar flex justify-content-center" @tap="changeTab(true)">
						<view :class="'text ' + (showLogin ? 'active' : '')">{{ $t('login.title') }}</view>
					</view>
				</view>
			</view>
			<view class="signup-tips-box" v-show="showCheck">
				<view>{{ $t('login.check_tip_1') }}</view>
				<view>{{ $t('login.check_tip_2') }}</view>
			</view>
			<view class="signup-bonus-tips-box flex align-items-center" v-if="!showCashBanner">
				<view class="bonus-tips tips1-box">
					<view class="img_box">
						<image mode="widthFix" class="tip-icon" src="@/static/images/login/get_points_icon@2x.png" />
					</view>
					<text class="tips-title font-bold">{{ showCashList.point_top }}</text>
					<text class="tips-content">{{showCashList.point_bottom}}</text>
				</view>
				<view class="line left"></view>					
				<view class="bonus-tips tips2-box">
					<view class="img_box">
						<image mode="widthFix" class="tip-icon" src="@/static/images/login/vip_benifit_icon@2x.png" />
					</view>
					<text class="tips-title font-bold">{{showCashList.discount_top}}</text>
					<text class="tips-content">{{showCashList.discount_bottom}}</text>
				</view>
				<view class="line right"></view>
				<view class="bonus-tips tips3-box position-relative" @tap="handleOpenTipsPopup">
					<view class="img_box">
						<image mode="widthFix" class="tip-icon" src="@/static/images/login/cash_grab_rewards@2x.png" />
					</view>
					<text class="tips-title font-bold">{{showCashList.reward_top}}</text>
					<text class="tips-content">{{showCashList.reward_bottom}}</text>
					<view class="tip_img_box img_box">
						<image mode="widthFix" class="tip-icon" src="@/static/images/login/login_rewards_icon@2x.png" />
					</view>
				</view>
			</view>
			<view class="cash_banner_wrapper" v-else>
				<view class="cash_rewards_banner position-relative flex align-items-center justify-content-center">
					<view class="banner_text flex no-wrap">
						<text class="font-bold">{{$t('login.get')}}</text>
						<text class="font-family-KronaOne reward_count font-bold">{{showCashList.base_symbol}}{{reward_count}}</text>
						<text class="font-bold">{{$t('login.now')}}</text>
						<text class="small">{{$t('login.cashgrab_rewards')}}</text>
					</view>
				</view>
				<view class="rules_box flex justify-content-end align-items-center " @tap="handleOpenTipsPopup">
					<text class="text">{{$t('login.rules')}}</text>
					<view class="img_box">
						<image mode="widthFix" class="img" src="@/static/images/login/login_rewards_icon@2x.png" />
					</view>
				</view>
				<view class="register_to_get flex align-items-center justify-content-center" v-if="showCashBanner&&!showLogin">
					<view class="content position-relative">{{$t('login.register_to_get')}}</view>
				</view>
				<view class="register_get_tips flex align-items-center justify-content-center" v-if="showCashBanner&&!showLogin">
					{{showCashList.distribute_share_tips}}
				</view>
			</view>
			
			<view class="error_tip_form" v-show="showCheck">
				<uni-forms ref="checkform" :modelValue="loginData" :rules="loginCheckRules" validate-trigger="bind">
					<uni-forms-item name="email">
						<view class="input_label font-bold">* {{ $t('login.email') }}</view>
						<uni-easyinput type="text" :focus="checkEmailFocus" @blur="blurCheckEmail" v-model="loginData.email" />
					</uni-forms-item>
					<view class="uni-btn-v font-bold">
						<button type="primary" @tap="bindLoginCheck" :loading="submitCheckBtnDis">{{ $t('login.submit') }}</button>
					</view>		
					<view class="policy_box policy_tip_box flex align-items-center">
						<view>{{ $t('login.policy_check', {site_name: $store.state.site_name_upper}) }}</view>
						<view class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')">{{ $t('login.terms_conditions') }}</view>
						<view>{{ $t('login.and') }}</view>
						<view class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{ $t('login.privacy_policy') }}</view>
						<view>.</view>
					</view>				
				</uni-forms>
			</view>
			<view class="error_tip_form" v-show="!showCheck && showLogin">
				<uni-forms ref="login_form" :modelValue="loginData" :rules="loginRules" validate-trigger="bind">
					<uni-forms-item name="email">
						<view class="input_label font-bold">* {{ $t('login.email') }}</view>
						<uni-easyinput type="text" v-model="loginData.email" :clearable="true"  />
					</uni-forms-item>
					<uni-forms-item class="password-form-item" name="password">
						<view class="input_label font-bold">* {{ $t('login.password') }}</view>
						<uni-easyinput type="password" v-model="loginData.password" @input="signSubmitError = ''"  :clearable="true"/>
						<view class="form-error-box">
							<view class="form-error" v-if="signSubmitError">
								{{ signSubmitError}}
							</view>
							<view class="forget-wrapper flex justify-content-end">
								<view class="forget-pwd" @tap="handleToForget">{{ $t('login.forget_password') }}</view>
							</view>
						</view>
						
					</uni-forms-item>
					<view class="uni-btn-v font-bold">
						<button type="primary" @tap="bindLogin" :loading="submitBtnDis">{{ $t('login.submit') }}</button>
					</view>
					<!-- <view class="policy_box policy_tip_box flex align-items-center">
						<view>{{ $t('login.policy_check', {site_name: $store.state.site_name_upper}) }}</view>
						<view class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')">{{ $t('login.terms_conditions') }}</view>
						<view>{{ $t('login.and') }}</view>
						<view class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{ $t('login.privacy_policy') }}</view>
						<view>.</view>
					</view>					 -->
				</uni-forms>
				
			</view>
			<view class="register-wrap error_tip_form" v-show="!showCheck && !showLogin">
				<uni-forms ref="changeForm" :rules="regRules()" :modelValue="regData" validate-trigger="bind">
					<uni-forms-item name="email">
						<view class="input_label font-bold">* {{ $t('login.email') }}</view>
						<uni-easyinput type="text" v-model="regData.email" class="input" :clearable="false" />
						<view class="form-error" v-if="showSignTip">{{ regSubmitError }}<text class="u-link" @tap="showRegSignIn">{{$t('login.sign_in_link')}}</text> {{$t('login.or_change_email')}}</view>
					</uni-forms-item>
					<uni-forms-item name="password" :class="show_pwd_error ? 'show_pwd_error' : ''">
						<view class="input_label font-bold">* {{ $t('login.password') }}</view>
						<uni-easyinput type="password" @input="regPwdChange" v-model="regData.password" class="input"/>
						<view class="split_pwd_check flex" v-show="show_pwd_checks">
							<view class="title">{{ $t('login.pwd_require_text') }}</view>
							<view class="single_pwd_check flex">
								<view class="img_box">
									<image
										class="img"
										:src="'/static/images/login/' + (pwd_length_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')"
										mode="scaleToFill"
									/>
								</view>
								<view class="text">{{ $t('login.characters_in_length') }}</view>
							</view>
							<view class="single_pwd_check flex">
								<view class="img_box">
									<image
										class="img"
										:src="'/static/images/login/' + (pwd_letter_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')"
										mode="scaleToFill"
									/>
								</view>
								<view class="text">{{ $t('login.container_letter') }}</view>
							</view>
							<view class="single_pwd_check flex">
								<view class="img_box">
									<image
										class="img"
										:src="'/static/images/login/' + (pwd_number_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')"
										mode="scaleToFill"
									/>
								</view>
								<view class="text">{{ $t('login.contain_number') }}</view>
							</view>
						</view>
					</uni-forms-item>
					<uni-forms-item name="reEnterPwd">
						<view class="input_label font-bold">* {{ $t('login.confirm_password') }}</view>
						<uni-easyinput type="password" v-model="regData.reEnterPwd" class="input"/>
					</uni-forms-item>
					<!--<uni-forms-item name="captcha" class="captcha-form-item">
						<uni-easyinput type="text" v-model="regData.captcha" class="captcha_input"
							:placeholder="'* ' + $t('register.captcha')" />
						<view class="captcha flex align-items-center justify-content-center"><image v-if="url" class="captcha-img"
								@click="refreshCaptcha" :src="'data:image/png;base64,' + url" alt="captcha"></image></view>
					</uni-forms-item>-->
					<!-- <uni-forms-item name="privacy">
						<checkbox-group class="privacy-group" @change="checkboxChange">
							<checkbox checked value="checked" />
							<view class="privacy-text">
								{{ $t('register.agree_to', {site_name: $store.state.site_name_upper}) }} 
								<text class="text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{ $t('register.privacy_policy')}}</text>
								<text>{{ $t('register.and')}}</text>
								<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')" class="text-underline">{{ $t('register.terms_conditions')}}</text> <text style="margin-left: -2px;">.</text>
							</view>
						</checkbox-group>
							
		
					</uni-forms-item> -->
					<view class="policy_box flex align-items-center">
						<view class="img_box" @tap="()=>{regData.is_subscribed = !regData.is_subscribed;maSendEmail()}">
							<image								
								class="img"
								:src="'/static/images/login/' + (regData.is_subscribed ? 'login_checked_icon@2x.png' : 'login_unchecked_icon@2x.png')"
								mode="scaleToFill"
							/>							
						</view>
						<view>{{ !showCashBanner ? $t('register.subscribed_tip') : $t('register.special_subscribed_tip')}}</view>
					</view>
					<view class="uni-btn-v font-bold">
						<button :loading="registerBtnDis" @click="regSubmit" form-type="submit" type="primary">{{ $t('register.submit')
							}}</button>
					</view>
								
				</uni-forms>
			</view>
		</view>
		<view v-if="!isAicodePage" class="join">
			<view class="flex align-items-center justify-content-center" style="width:100%;">
				<view class="title">{{ $t('login.or_sign_in')}}</view>
			</view>
			<view class="lists  align-items-center justify-content-around">
				<view class="item" @tap.stop="snsLogin('google')">
					<image class="flex-img" src="@/static/images/google_logo.png" alt="google"></image>{{ $t('login.sign_in_google') }}
				</view>
				<view class="item" @tap.stop="snsLogin('facebook')">
					<image class="flex-img" src="@/static/images/fb_logo.png" alt="fb"></image>{{ $t('login.sign_in_fb') }}
				</view>
				<view v-if="platform == 'ios'" class="item apple" @tap.stop="snsLogin('apple')">
					<image class="flex-img" src="@/static/images/apple.png" alt="apple"></image>{{ $t('login.sign_in_apple') }}
				</view>
			</view>
			<view class="policy_box policy_tip_box flex align-items-center fix_crt">
				<text class="text_under_fix">{{ $t('login.policy_check', {site_name: $store.state.site_name_upper}) }}</text>
				<text class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')">{{ $t('login.terms_conditions') }}</text>
				<text>{{ $t('login.and') }}</text>
				<text class="under_line" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{ $t('login.privacy_policy') }}</text>
				<text>.</text>
			</view>
		</view>
		<!-- 推荐码填写页面 -->
		<view v-if="isAicodePage" class="referral_code_box">
			<view class="tip-box">
				{{$t('login.enter_aicode')}}
			</view>
			<uni-forms ref="bindForm">
				<view class="form-label">{{ $t('register.referral_code') }}</view>
				<uni-forms-item name="aicode">
					<uni-easyinput type="text" v-model="bindData.aicode" :placeholder="$t('register.referral_code')" />
				</uni-forms-item>
				<view class="uni-btn-v font-bold">
					<button type="primary" @tap="bindAicode" :loading="submitBindDis">{{ $t('login.submit') }}</button>
				</view>
				<view class="skip-box">
					<text class="skip" @tap="skipBindCode">{{$t('login.skip')}}</text>
				</view>
			</uni-forms>
		</view>
		<reset-password ref="resetPopup"></reset-password>
		<fissionSharingRulesPopup :showInviteButton="showInviteButton" @handleInviteNow="handleShowSharePopup()" :params="{title:$t('login.rules'),desc:rulesParam.rule_step_top.desc}" :listData="rulesParam.steps" ref="fissionSharingRulesPopup"></fissionSharingRulesPopup>
		<!-- 注册成功页面 -->
		<RegisterSuccessPopup :registerSuccessData="registerSuccessData" ref="pRegisterSuccess" @loginHandel="loginHandel" @change="(data)=>{showRegisterSuccess=data;}">></RegisterSuccessPopup>
		<getCoupon moduleName="register_succeed" ref="getCouponRef"></getCoupon>
		<uni-popup ref="turnstile_popup" type="center"  borderRadius="10px" :is-mask-click="false">
			<!-- 注册 -->
			<view class="code_view" v-if="!showLogin">
				<CodeView  @update:actionData="handleIsFlagRegister" :cf_code_params="cf_code_params" type="APP_REGISTER" :track-data="registerTurnstileTrackData"></CodeView>
			</view>
			<!-- 登录 -->
			<view class="code_view" v-else>
				<CodeView  @update:actionData="handleIsFlagLogin" :cf_code_params="cf_code_params" type="APP_LOGIN" :track-data="loginTurnstileTrackData"></CodeView>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const app = getApp();
import $util from '@/utils/util.js';
import fissionSharingRulesPopup from '@/components/fissionSharingRulesPopup/fissionSharingRulesPopup.vue';
import RegisterSuccessPopup from '@/components/register-success-popup/register-success-popup.vue'
import getCoupon from "@/components/get-coupon/get-coupon.vue";
import CodeView from '@/components/CFCodeView/CodeView.vue';

export default {
	components: {
		RegisterSuccessPopup,
		getCoupon,
		fissionSharingRulesPopup,
		CodeView
	},
	data() {
		return {
			registerRegData: {
				email: '',
				password: '',
				reEnterPwd: '',
				privacy: 1,
				is_subscribed: 0,
				cfTurnstileRegisterToken:""
			},
			cf_code_params:"",
			is_interaction:"",
			is_login_interaction:"",
			is_special:'',
			showInviteButton:false,
			rulesParamLogin:{
				rule_step_top:{},
				steps: [],
			},
			rulesParamRegister:{
				rule_step_top:{},
				steps: [],
			},
			showCashList:[],
			policyChecked: false,
			regPolicyChecked: false,
			pwd_length_checked: false,
			pwd_letter_checked: false,
			pwd_number_checked: false,
			showRegisterSuccess:false,
			show_pwd_checks: false,
			show_pwd_error: false,
			registerSuccessData: {
				active_email_points:'',
				contact_email:'',
				expired_time:0
			},
			platform: '',
			//账号检测步骤
			showCheck: false,
			showLogin: true,
			btnDis: false,
			submitCheckBtnDis: false,
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
				email: '',
				password: '',
				reEnterPwd: '',
				//captcha: '',
				privacy: 1,
				is_subscribed: 0,
			},
			//登录验证规则
			loginCheckRules: {
				// 对email字段进行必填验证
				email: {
					rules: [{
						required: true,
						errorMessage: this.$t('login.empty_email'),
					}, 
					// {
					// 	format: 'email',
					// 	errorMessage: this.$t('login.reg_email'),
					// },
					{
						validateFunction:  (rule, value, data, callback) =>  {
							const reg = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
							if (!reg.test(value)) {
								callback(this.$t('login.reg_email'))
							}
						}
					}]
				}
			},
			//登录验证规则
			loginRules: {
				// 对email字段进行必填验证
				email: {
					rules: [{
						required: true,
						errorMessage: this.$t('login.empty_email'),
					}, 
					// {
					// 	format: 'email',
					// 	errorMessage: this.$t('login.reg_email'),
					// },
					{
						validateFunction:  (rule, value, data, callback) =>  {
							this.signSubmitError = '';
							const reg = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
							if (!reg.test(value)) {
								callback(this.$t('login.reg_email'))
							}
						}
					}]
				},
				// 对password字段进行必填验证
				password: {
					rules: [{
						required: true,
						errorMessage: this.$t('login.empty_pwd'),
					}]
				},
			},
			reqBody: {},
			// 如果为登录状态 默认跳转的地址
			redirectRoute: {},
			routeQuery: {},
			bindData: {
				aicode: ''
			},
			submitBindDis: false,
			isAicodePage: false,
			//账号检查邮箱输入框焦点
			checkEmailFocus: false,
			//显示已注册提示语
			showSignTip: false,
			regSubmitError: '',
			//登录错误提示语
			signSubmitError: '',
			showCashBanner: true,
			reward_count: '',
			in_site_source:'',
			isLoginVisit: true,
			isregVisit: true,
		}
	},
	watch:{
		showCashList(val){
			this.cf_code_params = val.public_key;
			this.is_interaction = val.is_interaction;
			this.is_login_interaction = val.is_login_interaction;
		}
	},
	computed: {
		statusBarHeight() {
			return app.globalData.statusBarHeight
		},
		titleBarHeight() {
			return app.globalData.titleBarHeight
		},
		// 切换状态
		rulesParam(){
			if(!this.showLogin){
				return this.rulesParamRegister
			}else{
				return this.rulesParamLogin
			}
		},
		loginTurnstileTrackData(){
			return {
				type: 'APP_LOGIN',
				data: {
					email: this.loginData.email
				}
			}
		},
		registerTurnstileTrackData() {
			return {
				type: 'APP_REGISTER',
				data: {
					email: this.regData.email
				}
			}
		}
	},
	onLoad(query) {
		let pageType = query.page && query.page.toLocaleLowerCase();
		if(pageType == 'register'){
			this.showLogin = false;
		}else if(pageType == 'login') {
			this.showLogin = true;
		}else{
			uni.getStorage({key: 'hasLoginBefore', success: (res)=> {
					const hasLoginBefore = res.data
					if(hasLoginBefore == '1'){
						this.showLogin = true
					}else{
						this.showLogin = false
					}
				}, fail: ()=>{
					this.showLogin = false;
				}
			})
		}
		// #ifdef APP-PLUS
		this.getPushClientId();
		if(!this.loginData.client_id){
			setTimeout(() => {
				this.getPushClientId();
			}, 1000);
			plus.push.getClientInfoAsync((info) => {
				if(info.clientid && info.clientid != "null"){
					this.loginData.client_id = info.clientid;
					this.regData.client_id = info.clientid;
				}
			});
		}
		// #endif
		this.initredirectRouteData(query);
		// #ifdef APP-PLUS
		let platform = uni.getSystemInfoSync().platform;
		this.platform = platform;
		//#endif
		this.loginNavigateBack = query.loginNavigateBack == 1 ? true : false;
		this.loginNavigateBackType = query.loginNavigateBackType || ''; 
		if (query.is_special) {
			this.showCashBanner = true
			this.is_special = query.is_special
			this.getBaseData(this.showCashBanner,this.is_special)
		} else {
			this.showCashBanner = false
			this.getBaseData(this.showCashBanner)
		}
		this.in_site_source = query.in_site_source || ''
		this.$trackEvent.pageView({
			action: 'Login'
		});
	},
	onUnload() {
		//#ifdef APP-PLUS
		uni.hideLoading();
		//#endif
	},
	onShow() {
		//this.refreshCaptcha()
		setTimeout(()=>{
			this.maPageImpression();
		},500)
	},
	onHide() {
		//#ifdef APP-PLUS
		if (this.isUniLogining) {
			uni.hideLoading();
			this.isUniLogining = false;
		}
		//#endif
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
	methods: {
		getPushClientId(){
			//#ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			if(info.clientid && info.clientid != "null"){
				this.loginData.client_id = info.clientid;
				this.regData.client_id = info.clientid;
			}
			//#endif
		},
		// 切换tab
		changeTab(value) {
			this.showLogin = value;
			this.maPageImpression();
			this.$maEvent.custom_event({
				event_category: 'register',
				event_action: 'tab_button',
				module: 'register_sign_in',
				event_name: this.showLogin?'sign_in':'register',
				event_data: {
					event_value:this.showLogin?'sign_in':'register',
				}
			})
		},
		handleIsFlagLogin(actionData) {
		    if (actionData.isShow) {
				this.loginData.cfTurnstileLoginToken = actionData.cf_code;
				this.$refs.turnstile_popup.close();
				// 走注册流程
				setTimeout(()=>{
					this.handleContinueLogin(this.loginData)
				},200)
			}
		},
		handleIsFlagRegister(actionData) {
			if (actionData.isShow) {
				this.registerRegData.cfTurnstileRegisterToken = actionData.cf_code;
				this.$refs.turnstile_popup.close();
				// 走注册流程
				setTimeout(()=>{
					this.registerApiData(this.registerRegData)
				},200)
			}
		},
		// 注册接口操作
		registerApiData(val) {
			this.$apis.postRegister(val).then((response) => {
				this.registerBtnDis = false;
				if (response.code == '200') {
					uni.setStorage({
						key: 'hasLoginBefore',
						data: '1',
						success: (result) => { },
						fail: (error) => { }
					})
					this.$trackEvent.sign_up({
						type: 'email',
						email: this.regData.email
					});
					this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', false);
					// 注册成功显示注册成功信息
					// this.loginHandel();
					this.registerSuccessData = response.data;
					this.handelReg(response.data);
					this.getCartInfo();

				} else if (response.message) {
					uni.showToast({
						title: response.message,
						icon: "none"
					});
				}
			}).catch((response) => {
				this.registerBtnDis = false;
				if (response.code == '1100000') {
					this.showSignTip = true;
					this.regSubmitError = response.message;
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				} else {
					uni.showToast({
						title: response.message || 'Register Faild',
						icon: "none"
					});
				}
			});
		},
		handleShowSharePopup() {
			this.$refs.fissionSharingRulesPopup.close();
			this.$refs.sharePopup.open('bottom')
		},
		async getBaseData(data,is_special){
			if(data){
				this.$apis.getBaseData({'distribute_share_type':is_special}).then((res) => {
				this.showCashList = res.data
				this.rulesParamLogin = res.data.login_steps_rule;
				this.rulesParamRegister = res.data.register_steps_rule;
				this.reward_count  =res.data.reward_value;
				});
			}else{
				this.$apis.getBaseData().then((res) => {
				this.showCashList = res.data
				this.rulesParamLogin = res.data.login_steps_rule;
				this.rulesParamRegister = res.data.register_steps_rule;
				this.reward_count  =res.data.reward_value
				});
			}
		},
		regRules(){
			const that = this
			return {
				email: {
					rules: [
						{
							required: true,
							errorMessage: that.$t('register.email_validate'),
						},
						// {
						// 	format: 'email',
						// 	errorMessage: that.$t('register.email_validate'),
						// }
						{
							validateFunction:  (rule, value, data, callback) =>  {
								const reg = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
								if (!reg.test(value)) {
									callback(that.$t('register.email_validate'))
								}
							}
						}
					]
				},
				password: {
					rules: [
						{
							required: false,
							// errorMessage: that.$t('register.password_validate'),
						},
						{
							validateFunction:  (rule, value, data, callback) =>  {
								// if (value !== data.reEnterPwd) callback(that.$t('register.reg_tips'))
								// const reg = /^(?=.*[A-Za-z])(?=.*\d)\S{6,30}$/
								// if (!reg.test(value)) {
								// 	callback(that.$t('register.reg_tips'))
								// }
							}
						},
					]
				},
				reEnterPwd: {
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
		regPwdChange(e){
			this.show_pwd_checks = true
			// const reg = /^(?=.*[A-Za-z])(?=.*\d)\S{6,30}$/
			const reg1 = /^.{6,30}$/
			const reg2 = /[a-zA-Z]/
			const reg3 = /\d/
			this.pwd_length_checked = reg1.test(e)
			this.pwd_letter_checked = reg2.test(e)
			this.pwd_number_checked = reg3.test(e)
			if(this.pwd_length_checked && this.pwd_letter_checked && this.pwd_number_checked){
				this.show_pwd_error = false
			}else{
				this.show_pwd_error = true
			}
			this.$refs.changeForm.validate()
			// if (!reg.test(value)) {
			// 	callback(that.$t('register.reg_tips'))
			// }
		},
		goHome() {
			// if (this.is_special) {
				uni.navigateBack({
					delta: 1,
					fail(e) {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				});
			// } else {
				// uni.switchTab({
					// url: '/pages/index/index'
				// })
			// }
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
			this.$refs['resetPopup'].open()
			this.$refs['resetPopup'].initData({
				email: this.loginData.email
			});
			// uni.navigateTo({
			// 	url: '/pages/forget-password/forget-password'
			// })
		},
		handleOpenTipsPopup(){
			this.$refs['fissionSharingRulesPopup'].open()
		},
		checkboxChange(e) {
			this.regData.privacy = e.detail.value.length
		},
		//注册邮箱已存在，跳转登录
		showRegSignIn(){
			this.showLogin = true;
			this.loginData.email = this.regData.email;
		},
		regSubmit() {
			this.$maEvent.custom_event({
				event_category: 'register',
				event_action: 'register_button',
				event_name: 'email',
				module: 'register',
				event_data: {
					event_value: 'email',
					...(this.$store.state.utmParams && {utm_channel_source:this.$store.state.utmParams}),
					...(this.in_site_source && { in_site_source: this.in_site_source })
				}
			});
			this.showSignTip = false;
			this.regSubmitError = false;
			const that = this
			//表单验证
			that.show_pwd_checks = true
			that.$refs.changeForm.validate().then(async res => {
				if (!that.pwd_length_checked || !that.pwd_letter_checked || !that.pwd_number_checked) {
					uni.showToast({
						title: that.$t('register.valid_pwd'),
						icon: "none"
					})
					return
				}
				/*if(!that.regPolicyChecked){
					uni.showToast({
						title: that.$t('register.agree_policy'),
						icon: "none"
					})
					return
				}*/
				try {
					that.registerBtnDis = true
					if(!this.regData.client_id){
						this.getPushClientId();
					}
					let regData = this.regData;
					//邀请码
					if (this.$store.state.aicode) {
						regData.aicode = this.$store.state.aicode;
					}
					if (regData.is_subscribed) {
						regData.is_subscribed = 1;
					}
					let new_user_time_diff = this.$uitls.getNewUseTimeDiff();
					if (new_user_time_diff !== false) {
						regData.new_user_time_diff = new_user_time_diff;
					}
					// cf 验证弹窗
					// 如果开启cf验证，则弹出cf验证弹窗
					// #ifdef APP-PLUS 
					if (this.is_interaction) {
						this.registerRegData = regData; // 删除client_id
						this.$refs.turnstile_popup.open();
					} else {
						// 没有开启cf验证，直接走注册流程
						this.registerApiData(regData)
					}
					// #endif
					// #ifdef H5
					this.registerApiData(regData)
					// #endif
				} catch {
					this.registerBtnDis = false;
				}
			}).catch(err => {
				if (err.length) {
					console.log(err[0].errorMessage);
				}
			})
		},
		initredirectRouteData(query) {
			if (query.redirectUrl) {
				let redirectUrl = query.redirectUrl;
				delete query.redirectUrl;
				delete query.page;
				redirectUrl = $util.objParseUrlAndParam(redirectUrl, query);
				this.redirectRoute.path = redirectUrl;
				delete query.redirectUrl;
				this.routeQuery = query;
			}
		},
		//登录检测
		async bindLoginCheck(){
			const that = this			
			this.$refs.checkform.validate().then(async res => {
				try {
					that.submitCheckBtnDis = true;
					let rst = await that.$apis.postLoginCheck(that.loginData);
					that.submitCheckBtnDis = false;
					if (rst.code == '200') {
						//账号存在，显示登录
						if(rst.data.check_result == '1'){
							that.showLogin = true;
							that.showCheck = false;
							that.signSubmitError = false;
						} else {
							//账号不存在，显示注册
							that.showLogin = false;
							that.showCheck = false;
							this.regData.email = this.loginData.email;
							this.showSignTip = false;
							this.regSubmitError = '';
						}
					} else {
						uni.showToast({
							title: rst.status.error_desc,
							icon: "none"
						});
					}
				} catch (e) {
					that.submitCheckBtnDis = false;
				}
			}).catch(err => {
			})
		},
		// 确认登录
		handleContinueLogin() {
			const that = this
			that.signSubmitError = '';
			try {
				that.submitBtnDis = true;
				if(!that.loginData.client_id){
					this.getPushClientId();
				}
				that.$apis.postLogin(that.loginData).then((rst) => {
					if (rst.code == '200' || rst.code == '1100006') {
						// 更新VIP是否展示的开关字段 1true 2false
						rst.data.is_show_vip&&this.$store.commit('SET_SHOW_VIP', rst.data.is_show_vip=='1' ? true : false)		
						this.$store.commit('SET_USER_TYPE', 1)
						this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', false);
						that.loginHandel(rst.data);
						uni.$emit('loginSuccess', {
							loginNavigateBackType: this.loginNavigateBackType,
							loginNavigateBack: this.loginNavigateBack
						});
						this.$trackEvent.login({
							type: 'direct',
							email: that.loginData.email
						});
						uni.setStorage({
							key: 'hasLoginBefore',
							data: '1',
							success: (result) => {},
							fail: (error) => {}
						})
					} else {
						uni.showToast({
							title: rst.status.error_desc || 'Login Failed',
							icon: "none"
						});
						that.submitBtnDis = false;
					}
				}).catch((rst) => {
					var msg = rst.errors || rst.message || rst.content || rst.error_message || 'Login Failed';
					this.signSubmitError = msg;
					that.submitBtnDis = false;
				});
			} catch (e) {
				that.submitBtnDis = false;
			}
		},
		// 登录校验
		async bindLogin() {
			this.$maEvent.custom_event({
				event_category: 'register',
				event_action: 'sign_in_button',
				event_name: 'email',
				module: 'sign_in',
				event_data: {
					event_value: 'email'
				}
			});
			const that = this
			that.$refs.login_form.validate().then(async res => {
				// cf 验证弹窗
				// 如果开启cf验证，则弹出cf验证弹窗
				// #ifdef APP-PLUS 
				if (that.is_login_interaction) {
					that.$refs.turnstile_popup.open();
				} else {
					// 没有开启cf验证，直接走注册流程
					that.handleContinueLogin()
				}
				// #endif
				// #ifdef H5
				that.handleContinueLogin()
				// #endif
			}).catch(err => {
			})
		},
		//显示账号检查步骤
		goShowCheck(){
			this.showCheck = true;
			this.showLogin = false;
			this.checkEmailFocus = true;
		},
		//显示账号email输入框失去焦点
		blurCheckEmail(){
			this.checkEmailFocus = false;
		},
		getCartInfo() {
			this.$apis.getCartList({},{loading:false}).then(res => {
				let num = res.data.cart_info ? res.data.cart_info.items_count : 0;
				this.$store.commit('SET_CART_COUNT', num)
				getApp().globalData.getShopCartNum();
			})			
		},
		loginHandel(userInfo){
			// 这里最好是登录成功返回购物车数量，而不是调取购物车接口
			this.getCartInfo();
			this.loginRedirect();
			if(userInfo){
				this.$store.commit('SET_USERINFO', userInfo);
			}
			this.appDateLog();
			this.$store.commit('SET_HomeCoupon', true);
		},
		//登录后跳转页面
		loginRedirect() {
			if (this.redirectRoute.path && this.redirectRoute.path.indexOf('/pages/login') == -1) {
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
					if (prev_page != '/page/login/index' || this.loginNavigateBack) {
						uni.navigateBack();
						return false;
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
			let maParams = {
				event_category: 'register',
				event_action: 'sign_in_button',
				event_name: type,
				module: 'sign_in',
				event_data: {
					event_value: type
				}
			}
			if(!this.showLogin) {
				maParams = {
					event_category: 'register',
					event_action: 'register_button',
					event_name: type,
					module: 'register',
					event_data: {
						event_value: type,
						...(this.$store.state.utmParams && {utm_channel_source:this.$store.state.utmParams}),
						...(this.in_site_source && { in_site_source: this.in_site_source })
					}
				}
			}
			this.$maEvent.custom_event(maParams);
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
							if(!this.loginData.client_id){
								this.getPushClientId();
							}
							if(this.loginData.client_id){
								data.client_id = this.loginData.client_id;
							}
							for(var i in info.userInfo){
								data['userInfo[' + i +']'] = info.userInfo[i];
							}
							if(loginRes.authResult.access_token){
								data['third_token'] = loginRes.authResult.access_token;
							}
							//邀请码
							if(this.$store.state.aicode){
								data.aicode = this.$store.state.aicode;
							}
							let new_user_time_diff = this.$uitls.getNewUseTimeDiff();
							if(new_user_time_diff !== false){
								data.new_user_time_diff = new_user_time_diff;
							}
							this.$apis.postThirdLogin(data).then((res) => {
								if(res.code == '200'){
									this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', false);
									if(res.data.loginType == 'register'){
										this.handelReg(res.data);
										this.$trackEvent.sign_up({
											type: type,
											email: data['userInfo[email]'] || ''
										});
									} else {
										this.loginHandel(res.data);
										uni.$emit('loginSuccess', {
											loginNavigateBackType: this.loginNavigateBackType,
											loginNavigateBack: this.loginNavigateBack
										});
										this.$trackEvent.login({
											type: type,
											email: data['userInfo[email]'] || ''
										});
									}
									this.$store.commit('SET_USER_TYPE', 1)
								} else {
									var message = res.message ? res.message : this.$t('login.sns_login_error');
									uni.showToast({
										title: message,
										icon: "none",
										duration: 3000
									});
								}
							}).catch((res) => {
								var message = res.message ? res.message : this.$t('login.sns_login_error');
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
		},
		//处理注册后逻辑
		handelReg(userInfo){
			if(!this.$store.state.aicode){
				this.isAicodePage = true;
			}
			if(!this.isAicodePage){
				this.showRegSuccess();
			}
			if(userInfo){
				this.$store.commit('SET_USERINFO', userInfo);
			}
			uni.$emit('loginSuccess', {
				loginNavigateBackType: this.loginNavigateBackType,
				loginNavigateBack: this.loginNavigateBack
			});
			this.$store.commit('SET_HomeCoupon', true);
			this.appDateLog();
		},
		//显示注册成功
		showRegSuccess(){
			let isRegSuccess = true;
			if (this.redirectRoute && this.redirectRoute.path) {
				if(this.redirectRoute.path.indexOf('/pages/my/my') == -1){
					isRegSuccess = false;
				}
				if(this.redirectRoute.path =='/pages/index/index'){
					isRegSuccess = true;
				}
			} else {
				let pages = getCurrentPages();
				let l = pages.length;
				if (l > 1) {
					let prev_page = '/' + pages[l - 2].route;
					if (prev_page != '/pages/login/index') {
						isRegSuccess = false;
					}
				}
			}
			if (this.loginNavigateBack) {
				isRegSuccess = false;
			}
			if(isRegSuccess){
				this.showRegisterSuccess = true;
				this.$refs.pRegisterSuccess.open();
				this.$refs.getCouponRef.getNewcomerCouponList();
			} else {
				this.loginHandel();
			}
		},
		//绑定邀请码
		bindAicode(){
			if(!this.bindData.aicode){
				this.showRegSuccess();
				return;
			}
			if(this.submitBindDis){
				return false;
			}
			this.submitBindDis = true;
			this.$apis.postBindcode(this.bindData).then((res) => {
				this.submitBindDis = false;
				this.showRegSuccess();
			}).catch(() => {
				this.submitBindDis = false;
			});
		},
		//跳过绑定邀请码
		skipBindCode(){
			this.showRegSuccess();
		},
		//app日活记录
		appDateLog(){
			//#ifdef APP-PLUS
			let currentDate = this.$uitls.currentDate();
			let data = {
				device_id: this.$uitls.getDeviceId()
			}
			if(this.appLogLoading){
				return false;
			}
			this.appLogLoading = true;
			this.$apis.postAppDateLog(data, () => {
				this.appLogLoading = false;
			}).catch(() => {
				this.appLogLoading = false;
			});
			uni.setStorageSync('app_log_date', currentDate);
			// #endif
		},
		// 页面曝光
		maPageImpression() {
			const utmParams = uni.getStorageSync("utmParams") || {};
			if(this.showLogin) {
				this.$maEvent.impression_event({
					event_category: 'register',
					event_action: 'sign_in_page',
					module: 'sign_in'
				});
				if(this.is_special) {
					this.$maEvent.impression_event({
						event_category: 'special_sign_in',
						event_action: 'special_sign_in_page',
						event_name: 'special_sign_in_page',
						event_data: {
							utm_channel_source: utmParams
						},
						module: 'special_sign_in'
					});					
				}
				if(this.isLoginVisit) {
					this.$maEvent.visit_event({
						event_category: 'sign_in',
						event_action: 'sign_in_visit',
						event_name: 'sign_in_visit'
					})
					this.isLoginVisit = false;
				}
			} else {
				this.$maEvent.impression_event({
					event_category: 'register',
					event_action: 'register_page',
					module: 'register',
					event_data: {
						...(this.$store.state.utmParams && {utm_channel_source:this.$store.state.utmParams}),
						...(this.in_site_source && { in_site_source: this.in_site_source })
					}
				});
				if(this.is_special) {
					this.$maEvent.impression_event({
						event_category: 'special_register',
						event_action: 'special_register_page',
						event_name: 'special_register_page',
						event_data: {
							utm_channel_source: utmParams
						},
						module: 'special_register'
					});
				}
				if(this.isregVisit) {
					this.$maEvent.visit_event({
						event_category: 'register',
						event_action: 'register_visit',
						event_name: 'register_visit'
					})
					this.isregVisit = false;
				}
			}
		},
		// 订阅、取消订阅点击埋点
		maSendEmail() {
			this.$maEvent.custom_event({
				event_category: 'register',
				event_action: 'send_email_button',
				module: 'register'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';
page {
	background-color: #FFFFFF;
}
.rules_box{
	width: 100%;
	height: 46.15rpx;
	margin-top: 15.38rpx;
	margin-bottom: 13.46rpx;
	.text{
		text-decoration: underline;
		font-weight: 400;
		font-size: 27rpx;
		color: #666666;
		line-height: 32rpx;
	}
	.img_box{
		width: 46.15rpx;
		height: 46.15rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
}
.register_to_get{
	font-weight: 400;
	font-size: 27rpx;
	color: #333333;
	line-height: 32rpx;
	margin-bottom: 7.69rpx;
	.content{
		&::before{
			content: '';
			position: absolute;
			left: -17.31rpx;
			top: 50%;
			transform: translate(-100%,-50%);
			width: 138rpx;
			height: 1rpx;
			background: #999999;
		}
		&::after{
			content: '';
			position: absolute;
			right: -17.31rpx;
			top: 50%;
			transform: translate(100%,-50%);
			width: 138rpx;
			height: 1rpx;
			background: #999999;
		}
	}	
}
.register_get_tips{
	font-weight: 400;
	font-size: 23rpx;
	color: #666666;
	line-height: 31rpx;
	text-align: center;
	padding: 0 30.77rpx;
}
.cash_rewards_banner{
	width: 100%;
	height: 100rpx;
	background-color: #FF8B4A;
	background-size: cover;
	background-position: 100% 100%;
	margin-top: 30.77rpx;
	background-image: url("@/static/images/login/login_cash_rewards_banner@2x.png");
	.banner_text{
		font-size: 38rpx;
		color: #000000;
		line-height: 42rpx;
		.reward_count{
			font-size: 46rpx;
			color: #FFFFFF;
			line-height: 42rpx;
			-webkit-text-stroke: 1px #000000;
			font-family:'KronaOne-Regular';
			margin: 0 7.69rpx;
		}
		
		.small{
			font-weight: 400;
			font-size: 27rpx;
			color: #000000;
			line-height: 42rpx;
			margin-left: 17.31rpx;
			white-space: nowrap;
		}
	}
	.img_box{
		width: 100%;
		height: 100%;
		.img{
			width: 100%;
			height: 100%;
		}
	}
}
.form-error-box {
	position: relative;
}
.form-error {
	color: #FF0000;
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
.u-link {
	color: #0071E3;
	text-decoration: underline;
	padding: 0px 6rpx;
}
.tip_img_box{
	position: absolute;
	right: -24rpx;
	top: -21.45rpx;
}
.login_header{
	height: 92.31rpx;
	padding-left: 30.77rpx;
	position: relative;
	width: 100%;
	.title{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		width: 207.69rpx;
		height: 38.46rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	.img_box{
		width: 46.15rpx;
		height: 46.15rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}	
}
.input_label{
	color: #666666;
	font-size: 27rpx;
	margin-bottom: 13.46rpx;
	line-height: 32rpx;
	height: 38rpx;
}
#box {
	flex-direction: column;
	min-height: 100vh;
	.show_pwd_error{
		/deep/.uni-easyinput__content{
			border-color: #FF0000!important;
		}
	}	
	.split_pwd_check{
		.title{
			height: 42rpx;
			font-size: 27rpx;
			color: #333333;
			line-height: 42rpx;
			margin-top: 3.85rpx;
			margin: 7.69rpx;
		}
		.single_pwd_check{
			.img_box{
				width: 34.62rpx;
				height: 34.62rpx;
				.img{
					width: 100%;
					height: 100%;
				}
			}
			.text{
				height: 42rpx;
				font-size: 27rpx;
				color: #333333;
				line-height: 42rpx;
				margin-left: 3.85rpx;
			}
		}
	}
	/deep/.uni-forms-item__error {
		line-height: 32rpx;
		font-size: 27rpx;
		color: #FF0000;
	}
	/deep/.uni-forms-item__error::before {
		content: "";
		width: 34rpx;
		height: 34rpx;
		background-image: url('@/static/images/error.png');
		margin-right: 4rpx;
		background-size: 100%;
		display: inline-block;
		vertical-align: text-bottom;
	}
	/deep/.is-input-error-border{
		border-color: #FF0000!important;
	}
	/deep/.uni-forms {
		position: relative;
	}
	.password-form-item /deep/.uni-forms-item__error {
		padding-right: 180rpx;
	}


	/deep/.uni-easyinput__content-input {
		height: 92.31rpx!important;
		font-size: 28rpx;
		padding-left: 30.77rpx!important;
	}
	.register-wrap .uni-forms-item:nth-child(2){
		// margin-bottom: 30.77rpx;
	}

	/deep/.uni-input-wrapper {
		height: 92.31rpx;

		.uni-input-placeholder {
			font-size: 28rpx !important;
		}
	}
	.error_tip_form{
		padding-top: 30.77rpx;
	}
	.policy_box{
		font-size: 27rpx;
		color: #666666;
		line-height: 40rpx;
		flex-wrap: nowrap;
		margin-bottom: 40rpx;
		.under_line{
			font-size: 24rpx;
			text-decoration: underline;
			color: #0071E3;
			margin: 0 8rpx;
		}
		.img_box{
			width: 34.62rpx;
			height: 34.62rpx;
			margin-right: 15.38rpx;
			flex-shrink: 0;
			.img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.policy_tip_box {
		flex-wrap: wrap;
		padding: 0 46.15rpx;
	}
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
	padding: 0 46rpx 0upx 46rpx;
	width: 100%;
	position: relative;
	// flex-grow: 1;
	// box-sizing: border-box;
}

.join {
	//height: 192rpx;
	// margin-bottom: 40rpx;
	.title {
		color: #999;
		height: 38rpx;
		line-height: 32rpx;
		font-size: 27rpx;
		text-align: center;
		// margin-bottom: 24rpx;
		color: #666666;
		width: 76.93rpx;
		position: relative;
		&:before{
			content: '';
			width: 69rpx;
			height: 1rpx;
			position: absolute;
			right: -100%;
			bottom: 50%;
			background: #CCCCCC;
			transform: translateY(-50%);
		}
		&:after{
			content: '';
			width: 69rpx;
			height: 1rpx;
			position: absolute;
			bottom: 50%;
			transform: translateY(-50%);
			background: #CCCCCC;
			left: -100%;
		}
	}

	.lists {
		padding: 0 46.15rpx 1rpx;
		margin: 30.77rpx 0;
		.item{
			// margin: 20rpx 10rpx;
			background-color: #fff;
			border: 1px solid #000000;
			flex: 1;
			height: 80upx;
			font-size: 33rpx;
			text-align: center;
			line-height: 42rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333;
			margin-bottom: 23.08rpx;
			&:last-child{
				margin-bottom: 0;
			}
			// max-width: 80%;
			width: 100%;
			&.apple {
				color: #000;
				background-color: #fff;
				.flex-img{
					width: 32.69rpx;
					height: 32.69rpx;
					margin-right: 19.23rpx;
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
	position: absolute;
	top: 100%;
	right: 0;
	padding-top: 4px;
}
.forget-pwd {
	// width: 50%;
	text-align: right;
	// padding-right: 46.15rpx;
	// height: 33rpx;
	height: 38rpx;
	line-height: 32rpx;
	font-size: 23rpx;
	color: #666666;
	// line-height: 27rpx;
	text-decoration: underline;
}
.password-form-item .forget-wrapper {
	top: 0rpx;
}
.password-form-item .form-error {
	padding-right: 200rpx;
}
.uni-btn-v {
	// width: 686rpx;
	height: 92.31rpx;
	margin-top: 32.69rpx;
	margin-bottom: 61.54rpx;
	margin-bottom: 30.77rpx;

	/deep/uni-button {

		height: 100%;
		background: #000;
		font-size: 30.77rpx;
		line-height: 92.31rpx;
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
		height: 92.31rpx;
		@include onepxBorder(#eee);

		.bar {
			width: 50%;
			height: 100%;		

			.text {
				text-align: center;
				display: inline-block;
				line-height: 92.31rpx;
				// width: 110rpx;
				height: 100%;
				font-size: 30.77rpx;
				color: #999999;
				// @include onepxBorder(#333, 8px);
				position: relative;
			}

			.active {
				color: #000;
				&::after {
					content: "";
					width: 50rpx;
					height: 3.85rpx;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					background-color: #000000;
					z-index: 1;
				}
			}
		}
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

	

	.uni-forms-item {
		// margin-top: 50rpx;
		margin-bottom: 50rpx;
		// height: 104rpx;

		// @include onepxBorder(#ccc);
		// &:last-child {
		// 	background: pink;
		// 	&::after{
		// 		content: '';
		// 	}
		// }
		.input {
			// height: 100%;
		}

		/deep/.uni-input-placeholder {
			font-size: 28rpx;
			color: rgba(0, 0, 0, 0.3);
			height: 32rpx;
			line-height: 32rpx;
		}

		/deep/.uni-input-input {
			font-size: 30.77rpx;
			color: #000000;
			line-height: 36rpx;
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
}
.signup-tips-box {
	font-size: 26rpx;
	line-height: 42rpx;
	color: #666666;
	margin-top: 30rpx;
}
.signup-bonus-tips-box {
	background: #FFF5F2;
	display: flex;
	flex-wrap: nowrap;
	font-size: 23.08rpx;
	margin-top: 30rpx;
	padding: 21.45rpx 24rpx 9.62rpx 24rpx;
	.line{
		width: 1rpx;
		background: #F0D2BB;
		height: 62rpx;
	}
}
.signup-bonus-tips-box .bonus-tips {
	width: calc((100% - 2rpx) / 3);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	.tips-content{
		line-height: 42rpx;
		height: 42rpx;
		white-space: nowrap;
		color: #333;
	}
}
.signup-bonus-tips-box .bonus-tips .tips-title {
	color: #000;
	white-space: nowrap;
}
.signup-bonus-tips-box .bonus-tips .line {
	position: absolute;
	width: 1rpx;
	background: #f1eae7;
	height: 60rpx;
	top: 50%;
	transform: translateY(-50%);
}
.signup-bonus-tips-box .bonus-tips .line.left {
	left: 0;
}
.signup-bonus-tips-box .bonus-tips .line.right {
	right: 0;
}
.signup-bonus-tips-box .bonus-tips .nc-icon {
	font-size:32rpx;
	color: #b55406;
}
.signup-bonus-tips-box .bonus-tips .tip-icon {
	width: 48rpx;
}
.signup-bonus-tips-box .iconfont3 {
	color: #b55406;
	font-size: 40rpx;
}
.form-label {
	font-size: 28rpx;
	margin-bottom: 10rpx;
}
.referral_code_box {
	padding-top: 60rpx;
	padding: 40rpx 30rpx 0px  30rpx;
	.tip-box {
		font-size: 30rpx;
		font-weight: bold;
	}
	.uni-forms {
		padding: 20rpx 0px;
	}
	.skip-box {
		text-align: center;
	}
	.skip {
		font-size: 30rpx;
		text-decoration: underline;
	}
}
.fix_crt{
	/deep/.text_under_fix{
		font-size: 24rpx;
		 span{
		font-size: 24rpx;
		}
	}
	.under_line{
		font-size: 24rpx;
	}
}
/deep/.rule-content {
		font-size: 24.5rpx !important;
	}
	
/deep/ .uni-easyinput__content .content-clear-icon {
	font-size: 48rpx !important;
}
.code_view{
	height: 400rpx;
	width: 650rpx;
}
</style>
