<template>
	<view id="box" class="flex">
		<view class="login_header flex align-items-center">
			<view class="img_box">
				<image class="img" @click="goHome()" src="@/static/images/header_back_icon@2x.png" mode="scaleToFill" />
			</view>
			<view class="title">
				<image class="img" src="@/static/images/login/unicoeye_logo@2x.png" mode="heightFix" />
			</view>
		</view>
		<view class="login_box" v-if="!isAicodePage">
			<!-- 标签页 REGISTER / SIGN IN -->
			<view class="top_tabs">
				<view class="tab" @tap="changeTab(false)">
					<view :class="'text ' + (!showLogin ? 'active' : '')">
						{{ $t('register.title') }}
					</view>
				</view>
				<view class="tab" @tap="changeTab(true)">
					<view :class="'text ' + (showLogin ? 'active' : '')">
						{{ $t('login.title') }}
					</view>
				</view>
			</view>
			<view class="tabs_border"></view>
			<!-- 账号检测 - 提示语: 不确定是否有账号 -->
			<view class="tip_login_check" v-show="showCheck">
				<view>{{ $t('login.check_tip_1') }}</view>
				<view>{{ $t('login.check_tip_2') }}</view>
				<!-- Not sure if you have an account?  -->
				<!-- Enter your email and we'll check for you -->
			</view>
			<!-- 3标签栏 v-if="!showCashBanner"-->
			<view v-if="!showCashBanner" class="tip_discount_box" >
				<view class="tip">
					<image class="tip-icon" mode="widthFix" src="@/static/images/login/wallet-check@2x.png" />
					<text class="tip-title">{{ showCashList.point_top }}</text>
					<text class="tip-content">{{showCashList.point_bottom}}</text>
				</view>
				<view class="line"></view>
				<view class="tip">
					<image class="tip-icon" mode="widthFix" src="@/static/images/login/tag-2@2x.png" />
					<text class="tip-title">{{showCashList.discount_top}}</text>
					<text class="tip-content">{{showCashList.discount_bottom}}</text>
				</view>
				<view class="line"></view>
				<view class="tip" @tap="handleOpenTipsPopup">
					<image class="tip-icon" mode="widthFix" src="@/static/images/login/dollar-square@2x.png" />
					<text class="tip-title">{{showCashList.reward_top}}</text>
					<text class="tip-content">{{showCashList.reward_bottom}}</text>
					<view class="tip_img_box">
						<image mode="widthFix" class="tip-icon" src="@/static/images/login/login_rewards_icon@2x.png" />
					</view>
				</view>
			</view>
			<!-- 裂变 v-else Get $6 Now CashGrab Rewards-->
			<view v-else class="cash_banner_wrapper">
				<view class="cash_rewards_banner">
					<view class="banner_text">
						<text class="font-MS">{{$t('login.get')}}</text>
						<text class="font-MBold reward_count">
							<text class="pr2r">{{showCashList.base_symbol}}</text>
							{{reward_count}}
						</text>
						<text class="font-MBold reward_count2">
							<text class="pr2r">{{showCashList.base_symbol}}</text>
							{{reward_count}}
						</text>
						
						<text class="font-MS">{{$t('login.now')}}</text>
						<view class="small">{{$t('login.cashgrab_rewards')}}</view>
					</view>
				</view>
				<view class="rules_box" @tap="handleOpenTipsPopup">
					<text class="rules_text">{{$t('login.rules')}}</text>
					<image src="@/static/images/login/login_rewards_icon@2x.png" 
						style="width: 46.15rpx" mode="widthFix" />
				</view>
				<view v-if="showCashBanner&&!showLogin" class="register_to_get flex-cc" >
					<view class="content">{{$t('login.register_to_get')}}</view>
				</view>
				<view v-if="showCashBanner&&!showLogin" class="register_get_tips flex-cc" >
					<view v-html="showCashList.distribute_share_tips"></view>
				</view>
			</view>
			<!-- 账号检测 - 表单 - 跟上面tip_login_check一起使用 - 提示语: 不确定是否有账号 -->
			<view class="error_tip_form" v-show="showCheck">
				<uni-forms ref="checkform" :modelValue="loginData" :rules="loginCheckRules" validate-trigger="bind">
					<uni-forms-item name="email">
						<view class="input_label">* {{ $t('login.email') }}</view>
						<uni-easyinput v-model="loginData.email" type="text" :focus="checkEmailFocus"
							@blur="blurCheckEmail" />
					</uni-forms-item>
					<view class="func_btn">
						<button type="primary" @tap="bindLoginCheck" :loading="submitCheckBtnDis">
							{{ $t('login.submit') }}
						</button>
					</view>
					<view class="policy_box">
						<view>{{ $t('login.policy_check', {site_name: $store.state.site_name_upper}) }}</view>
						<view class="under_line"
							@click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')">
							{{ $t('login.terms_conditions') }}
						</view>
						<view>{{ $t('login.and') }}</view>
						<view class="under_line"
							@click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">
							{{ $t('login.privacy_policy') }}
						</view>
						<view>.</view>
					</view>
				</uni-forms>
			</view>
			<!-- SIGN IN -->
			<view class="error_tip_form" v-show="!showCheck && showLogin">
				<uni-forms ref="login_form" :modelValue="loginData" :rules="loginRules" validate-trigger="bind">
					<!-- Email Address -->
					<uni-forms-item name="email" :class="signInEmailNotValidated ? 'mb115r' : ''">
						<view class="input_label">{{ $t('login.email') }}*</view>
						<uni-easyinput v-model="loginData.email" type="text" 
							:clearable="true" @clear="signInEmailNotValidated = true" />
					</uni-forms-item>
					<!-- Password -->
					<uni-forms-item name="password" :class="signInPswNotValidated ? 'mb58r' : ''">
						<view class="input_label">{{ $t('login.password') }}*</view>
						<uni-easyinput v-model="loginData.password" type="password" 
							@input="handleSignInPswInp"
							:clearable="true" />
						<view v-if="signSubmitError" class="tip_psw_signin">
							<view class="tip_icons">
								<image src="@/static/images/error.png" mode="widthFix" style="width: 34rpx; height: 34rpx; margin-right: 3.85rpx;"></image>
							</view>
							<view>{{ signSubmitError }}</view>
						</view>
					</uni-forms-item>
					<!-- 按钮 Foget Password?  -->
					<view class="signin_forgot_psw">
						<text @tap="handleToForget">{{ $t('login.forgot_password') }}</text>
					</view>
					<!-- 按钮 CONTINUE -->
					<view class="func_btn">
						<button type="primary" @tap="bindLogin" :loading="submitBtnDis">
							{{ $t('login.continue') }}
						</button>
					</view>
				</uni-forms>
			</view>
			<!-- REGISTER -->
			<view class="error_tip_form" v-show="!showCheck && !showLogin">
				<uni-forms ref="changeForm" :rules="regRules()" :modelValue="regData" validate-trigger="bind">
					<!-- Email Address -->
					<uni-forms-item name="email" :class="regEmailNotValidated ? 'mb115r' : ''">
						<view class="input_label">{{ $t('login.email') }}*</view>
						<uni-easyinput type="text" v-model="regData.email"
							@clear="handleRegEmailClear"
							:clearable="true" />
						<view v-if="showSignTip" class="tip_email_hadregistered">
							<view class="tip_icons">
								<image src="@/static/images/error.png" mode="widthFix" style="width: 34rpx; height: 34rpx; margin-right: 3.85rpx;"></image>
							</view>
							<view>
								<text>{{ regSubmitError }}</text> 
								<text class="register_link_tosignin" @tap="showRegSignIn">
									{{$t('login.sign_in_link')}}
								</text> 
								<text>{{$t('login.or_change_email')}}</text> 
							</view>
						</view>
					</uni-forms-item>
					<!-- Password -->
					<uni-forms-item name="password" :class="show_pwd_error ? 'register_psw_error' : ''">
						<view class="input_label">{{ $t('login.password') }}*</view>
						<uni-easyinput v-model="regData.password" type="password" 
							@input="regPwdChange" 
							:clearable="true" />
						<!-- 密码校验提示 -->
						<view v-show="show_pwd_checks" class="register_psw_check_box" >
							<view class="check_text mt15r mb8r">{{ $t('login.pwd_require_text') }}</view>
							<view class="check_item">
								<image :src="'/static/images/login/' + (pwd_length_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')"  mode="widthFix" />
								<view>{{ $t('login.characters_in_length') }}</view>
							</view>
							<view class="check_item">
								<image :src="'/static/images/login/' + (pwd_letter_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')"  mode="widthFix" />
								<view>{{ $t('login.container_letter') }}</view>
							</view>
							<view class="check_item">
								<image :src="'/static/images/login/' + (pwd_number_checked ? 'pwd_checked1@2x.png' : 'pwd_checked2@2x.png')" mode="widthFix" />
								<view>{{ $t('login.contain_number') }}</view>
							</view>
						</view>
					</uni-forms-item>
					<!-- Confirm Password -->
					<uni-forms-item name="reEnterPwd" :class="regRePswNotValidated ? 'mb100r' : ''">
						<view class="input_label">{{ $t('login.confirm_password') }}*</view>
						<uni-easyinput v-model="regData.reEnterPwd" type="password" 
							@input="handleRegRePswInp"
							:clearable="true" />
					</uni-forms-item>
					<!-- captcha -->
					<!-- 
					<uni-forms-item name="captcha" class="captcha-form-item">
						<uni-easyinput type="text" v-model="regData.captcha" class="captcha_input"
							:placeholder="'* ' + $t('register.captcha')" />
						<view class="captcha">
							<image v-if="url" :src="'data:image/png;base64,' + url"
								class="captcha-img"
								@click="refreshCaptcha" 
								 alt="captcha">
							</image>
						</view>
					</uni-forms-item> 
					<uni-forms-item name="privacy">
						<checkbox-group class="flex" @change="checkboxChange">
							<checkbox checked value="checked" />
							<view class="privacy-text">
								{{ $t('register.agree_to', {site_name: $store.state.site_name_upper}) }} 
								<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')"
									class="text-underline">
								{{ $t('register.privacy_policy')}}
								</text>
								<text>{{ $t('register.and')}}</text>
								<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')" 
									class="text-underline">
									{{ $t('register.terms_conditions')}}
								</text> 
								<text style="margin-left: -2px;">.</text>
							</view>
						</checkbox-group>
					</uni-forms-item> -->
					<!-- 协议勾选 -->
					<view class="register_protocol">
						<view class="check_box" @tap="()=>{regData.is_subscribed = !regData.is_subscribed;maSendEmail()}">
							<image :src="'/static/images/login/' + (regData.is_subscribed ? 'checked@2x.png' : 'uncheck@2x.png')" mode="scaleToFill" />
						</view>
						<view class="protocol_text ml4r">
							<!-- {{ !showCashBanner ? $t('register.subscribed_tip') : $t('register.special_subscribed_tip')}} -->
							{{ $t('register.subscribed_tip') }}
						</view>
					</view>
					<!-- 按钮Continue -->
					<view class="func_btn">
						<button :loading="registerBtnDis" @click="regSubmit" form-type="submit" type="primary">
							{{ $t('register.continue') }}
						</button>
					</view>
				</uni-forms>
			</view>
		</view>

		<!-- 第三方登录  v-if="!isAicodePage" 1期不上, 隐藏 -->
		<!-- <view v-if="!isAicodePage" class="login_auth"> -->
			<!-- 分割线 Or -->
			<!-- <view class="separator_or">{{ $t('login.or_sign_in')}}</view> -->
			<!-- Continue with Google / Continue with Facebook -->
			<!-- <view class="auth_list font-MM">
				<view class="auth_item" @tap.stop="snsLogin('google')">
					<image class="auth_icon" src="@/static/images/google_logo.png" alt="google"></image>
					{{ $t('login.sign_in_google') }}
				</view>
				<view class="auth_item" @tap.stop="snsLogin('facebook')">
					<image class="auth_icon" src="@/static/images/fb_logo.png" alt="fb"></image>
					{{ $t('login.sign_in_fb') }}
				</view>
				<view v-if="platform == 'ios'" class="auth_item apple" @tap.stop="snsLogin('apple')">
					<image class="auth_icon" src="@/static/images/apple.png" alt="apple"></image>
					{{ $t('login.sign_in_apple') }}
				</view>
			</view>
		</view> -->
		
		<!-- 底部协议内容 -->
		<!-- By clicking CONTINUE, you agree to the UNICOEYE terms & conditions and privacy policy. -->
		<view v-if="!isAicodePage" class="policy_box fix_crt">
			<view class="text_under_fix">{{ $t('login.policy_check', {site_name: $store.state.site_name}) }}</view>
			<view>
				<text class="under_line mr8r" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions')">
					{{ $t('login.terms_conditions') }}
				</text>
				<text class="mr8r">{{ $t('login.and') }}</text>
				<text class="under_line mr8r"
					@click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">
					{{ $t('login.privacy_policy') }}
				</text>
				<text>.</text>
			</view>
		</view>

		<!-- 推荐码填写页面  v-if="isAicodePage" -->
		<view v-if="isAicodePage" class="referral_code_box">
			<view class="tip-box">
				{{$t('login.enter_aicode')}}
			</view>
			<uni-forms ref="bindForm">
				<view class="form-label">{{ $t('register.referral_code') }}</view>
				<uni-forms-item name="aicode" class="aicode-input">
					<uni-easyinput type="text" v-model="bindData.aicode" />
				</uni-forms-item>
				<view class="func_btn">
					<button type="primary" @tap="bindAicode" :loading="submitBindDis" style="font-size: 32rpx;">{{ $t('login.submit') }}</button>
				</view>
				<view class="skip-box" @tap="skipBindCode">
					{{$t('login.skip')}}
				</view>
			</uni-forms>
		</view>
		
		<reset-password ref="resetPopup"></reset-password>
		<fissionSharingRulesPopup ref="fissionSharingRulesPopup" 
			:showInviteButton="showInviteButton"
			@handleInviteNow="handleShowSharePopup()"
			:params="{
				title:$t('login.rules'),
				desc: rulesParam.rule_step_top.desc
			}" 
			:listData="rulesParam.steps">
		</fissionSharingRulesPopup>
		<!-- 注册成功页面 -->
		<RegisterSuccessPopup ref="pRegisterSuccess" :registerSuccessData="registerSuccessData"
			@loginHandel="loginHandel" @change="(data)=>{showRegisterSuccess=data;}">
		</RegisterSuccessPopup>
		<getCoupon moduleName="register_succeed" ref="getCouponRef"></getCoupon>
		<uni-popup ref="turnstile_popup" type="center" borderRadius="10px" :is-mask-click="false">
			<!-- 注册 -->
			<view class="code_view" v-if="!showLogin">
				<CodeView @update:actionData="handleIsFlagRegister" :cf_code_params="cf_code_params" type="APP_REGISTER"
					:track-data="registerTurnstileTrackData">
				</CodeView>
			</view>
			<!-- 登录 -->
			<view class="code_view" v-else>
				<CodeView @update:actionData="handleIsFlagLogin" :cf_code_params="cf_code_params" type="APP_LOGIN"
					:track-data="loginTurnstileTrackData">
				</CodeView>
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
					cfTurnstileRegisterToken: ""
				},
				cf_code_params: "",
				is_interaction: "",
				is_login_interaction: "",
				is_special: '',
				// is_special 用于处理从不同地方跳到登录注册页后，显示的不同rules的情况
				// 1 - 首页 / 裂变页广告位分享跳转
				// 2 - 被裂变者打开（首页 / 列表页 / 订单成功页）然后跳转
				// 3 - 被裂变者打开商详页
				// 普通登录页不带此参数。
				// UI图中的B用户指被裂变用户
				showInviteButton: false,
				rulesParamLogin: {
					rule_step_top: {},
					steps: [],
				},
				rulesParamRegister: {
					rule_step_top: {},
					steps: [],
				},
				showCashList: [],
				policyChecked: false,
				regPolicyChecked: false,
				pwd_length_checked: false,
				pwd_letter_checked: false,
				pwd_number_checked: false,
				showRegisterSuccess: false,
				show_pwd_checks: false,
				show_pwd_error: false,
				registerSuccessData: {
					active_email_points: '',
					contact_email: '',
					expired_time: 0
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
								validateFunction: (rule, value, data, callback) => {
									const reg =
										/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
									if (!reg.test(value)) {
										callback(this.$t('login.reg_email'))
									}
								}
							}
						]
					}
				},
				//登录验证规则
				loginRules: {
					// 对email字段进行必填验证
					email: {
						rules: [
							{
								required: true,
								errorMessage: this.$t('login.empty_email'),
							},
							// {
							// 	format: 'email',
							// 	errorMessage: this.$t('login.reg_email'),
							// },
							{
								validateFunction: (rule, value, data, callback) => {
									this.signSubmitError = '';
									const reg =
										/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
									this.signInEmailNotValidated = !reg.test(value)
									if (!reg.test(value)) {
										callback(this.$t('login.reg_email'))
									}
								}
							}
						]
					},
					// 对password字段进行必填验证
					password: {
						rules: [
							{
								required: true,
								errorMessage: this.$t('login.empty_pwd')
							}
						]
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
				signInEmailNotValidated: false,
				signInPswNotValidated: false,
				regEmailNotValidated: false,
				regRePswNotValidated: false,
				in_site_source:'',
				isLoginVisit: true,
				isregVisit: true,
			}
		},
		watch: {
			showCashList(val) {
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
			rulesParam() {
				if (!this.showLogin) {
					return this.rulesParamRegister
				} else {
					return this.rulesParamLogin
				}
			},
			loginTurnstileTrackData() {
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
			if (pageType == 'register') {
				this.showLogin = false;
			} else if (pageType == 'login') {
				this.showLogin = true;
			} else {
				uni.getStorage({
					key: 'hasLoginBefore',
					success: (res) => {
						const hasLoginBefore = res.data
						if (hasLoginBefore == '1') {
							this.showLogin = true
						} else {
							this.showLogin = false
						}
					},
					fail: () => {
						this.showLogin = false;
					}
				})
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
			this.loginNavigateBack = query.loginNavigateBack == 1 ? true : false;
			this.loginNavigateBackType = query.loginNavigateBackType || '';
			if (query.is_special) {
				this.showCashBanner = true
				this.is_special = query.is_special
				this.getBaseData(this.showCashBanner, this.is_special)
			} else {
				this.showCashBanner = false
				this.getBaseData(this.showCashBanner)
			}
			this.in_site_source = query.in_site_source || ''
			this.$trackEvent.pageView({
				action: 'Login'
			});
			this.maPageImpression();
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
		onBackPress() {
			if (this.showRegisterSuccess) {
				this.$refs.pRegisterSuccess.close();
				this.loginHandel();
				return true;
			} else {
				return false;
			}
		},
		methods: {
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
					setTimeout(() => {
						this.handleContinueLogin(this.loginData)
					}, 200)
				}
			},
			handleIsFlagRegister(actionData) {
				if (actionData.isShow) {
					this.registerRegData.cfTurnstileRegisterToken = actionData.cf_code;
					this.$refs.turnstile_popup.close();
					// 走注册流程
					setTimeout(() => {
						this.registerApiData(this.registerRegData)
					}, 200)
				}
			},
			// 注册接口操作
			registerApiData(val) {
				const that = this
				that.$apis.postRegister(val).then((response) => {
					that.registerBtnDis = false;
					if (response.code == '200') {
						uni.setStorage({
							key: 'hasLoginBefore',
							data: '1',
							success: (result) => {},
							fail: (error) => {}
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
			async getBaseData(data, is_special) {
				if (data) {
					this.$apis.getBaseData({
						'distribute_share_type': is_special
					}).then((res) => {
						this.showCashList = res.data
						this.rulesParamLogin = res.data.login_steps_rule;
						this.rulesParamRegister = res.data.register_steps_rule;
						this.reward_count  =res.data.reward_value;
					});
				} else {
					this.$apis.getBaseData().then((res) => {
						this.showCashList = res.data
						this.rulesParamLogin = res.data.login_steps_rule;
						this.rulesParamRegister = res.data.register_steps_rule;
						this.reward_count = res.data.reward_value
					});
				}
			},
			regRules() {
				const that = this
				return {
					email: {
						rules: [{
								required: true,
								errorMessage: that.$t('register.email_validate'),
							},
							// {
							// 	format: 'email',
							// 	errorMessage: that.$t('register.email_validate'),
							// }
							{
								validateFunction: (rule, value, data, callback) => {
									const reg =
										/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
									this.regEmailNotValidated = !reg.test(value) // 用于边距处理样式
									if (!reg.test(value)) {
										callback(that.$t('register.email_validate'))
									}
								}
							}
						]
					},
					password: {
						rules: [{
								required: false,
								// errorMessage: that.$t('register.password_validate'),
							},
							{
								validateFunction: (rule, value, data, callback) => {
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
						rules: [{
								required: true,
								errorMessage: this.$t('register.confirm_password_tip')
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (value !== data.password) {
										this.regRePswNotValidated = value !== data.password ? true : false
										callback(that.$t('register.confirm_password_tip'))
									}
									// const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/
									// if(!reg.test(value)){
									// 	callback(that.$t('register.confirm_password_tip'))
									// }
								}
							},
						]
					},
				}
			},
			regPwdChange(e) {
				if(!this.regData.email) {
					this.regEmailNotValidated = true
				}
				if(this.regRePswNotValidated == false) {
					this.regRePswNotValidated = this.regData.reEnterPwd !== e // 用于处理边距样式
				}
				this.show_pwd_checks = true
				// const reg = /^(?=.*[A-Za-z])(?=.*\d)\S{6,30}$/
				const reg1 = /^.{6,30}$/
				const reg2 = /[a-zA-Z]/
				const reg3 = /\d/
				this.pwd_length_checked = reg1.test(e)
				this.pwd_letter_checked = reg2.test(e)
				this.pwd_number_checked = reg3.test(e)
				if (this.pwd_length_checked && this.pwd_letter_checked && this.pwd_number_checked) {
					this.show_pwd_error = false
				} else {
					this.show_pwd_error = true
				}
				this.$refs.changeForm.validate()
				// if (!reg.test(value)) {
				// 	callback(that.$t('register.reg_tips'))
				// }
			},
			handleSignInPswInp(val) {
				this.signSubmitError = '' 
				this.signInPswNotValidated = val == '' ? true : false
			},
			// 注册--邮箱框-清空按钮
			handleRegEmailClear() {
				this.regEmailNotValidated = true
				this.regSubmitError = ''
				this.showSignTip = false
			},
			handleRegRePswInp(val) {
				this.regRePswNotValidated = val == '' ? true : false
				if(val === this.regData.password && val != '') {
					this.regRePswNotValidated = false
				} else {
					this.regRePswNotValidated = true
				}
				if(!this.regData.email) {
					this.regEmailNotValidated = true
				}
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
			handleOpenTipsPopup() {
				this.$refs['fissionSharingRulesPopup'].open()
			},
			checkboxChange(e) {
				this.regData.privacy = e.detail.value.length
			},
			//注册邮箱已存在，跳转登录
			showRegSignIn() {
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
				this.regEmailNotValidated = this.regData.email ? false : true
				this.regRePswNotValidated = this.regData.reEnterPwd ? false :true
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
			async bindLoginCheck() {
				const that = this
				this.$refs.checkform.validate().then(async res => {
					try {
						that.submitCheckBtnDis = true;
						let rst = await that.$apis.postLoginCheck(that.loginData);
						console.log(rst, 'rst');
						that.submitCheckBtnDis = false;
						if (rst.code == '200') {
							//账号存在，显示登录
							if (rst.data.check_result == '1') {
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
				}).catch(err => {})
			},
			// 确认登录
			handleContinueLogin() {
				const that = this
				that.signSubmitError = '';
				try {
					that.submitBtnDis = true;
					that.$apis.postLogin(that.loginData).then((rst) => {
						if (rst.code == '200' || rst.code == '1100006') {
							// 更新VIP是否展示的开关字段 1true 2false
							rst.data.is_show_vip && this.$store.commit('SET_SHOW_VIP', rst.data.is_show_vip ==
								'1' ? true : false)
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
							that.signSubmitError = rst.msg;
							that.submitBtnDis = false;
							that.signInEmailNotValidated = false
							uni.showToast({
								title: rst.status.error_desc || 'Login Failed',
								icon: "none"
							});
							that.signSubmitError = rst.msg;
							that.submitBtnDis = false;
							that.signInEmailNotValidated = false
						}
					}).catch((rst) => {
						var msg = rst.errors || rst.message || rst.content || rst.error_message || 'Login Failed';
						that.signSubmitError = msg;
						that.submitBtnDis = false;
						that.signInEmailNotValidated = false
					});
				} catch (e) {
					that.submitBtnDis = false;
					that.signInEmailNotValidated = false
				}
			},
			// 登录校验
			async bindLogin() {
				const that = this
				this.signInEmailNotValidated = this.loginData.email ? false : true
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
				}).catch(err => {})
			},
			//显示账号检查步骤
			goShowCheck() {
				this.showCheck = true;
				this.showLogin = false;
				this.checkEmailFocus = true;
			},
			//显示账号email输入框失去焦点
			blurCheckEmail() {
				this.checkEmailFocus = false;
			},
			getCartInfo() {
				this.$apis.getCartList({}, {
					loading: false
				}).then(res => {
					let num = res.data.cart_info ? res.data.cart_info.items_count : 0;
					this.$store.commit('SET_CART_COUNT', num)
					getApp().globalData.getShopCartNum();
				})
			},
			loginHandel(userInfo) {
				// 这里最好是登录成功返回购物车数量，而不是调取购物车接口
				this.getCartInfo();
				this.loginRedirect();
				if (userInfo) {
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
						if (this.redirectRoute.path.indexOf('?') != -1) {
							url += '&loginback=1'
						} else {
							url += '?loginback=1'
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
			snsLogin(type) {
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
					success: (loginRes) => {
						// 登录成功
						uni.getUserInfo({
							provider: type,
							success: (info) => {
								var data = {
									type: type
								};
								if (this.loginData.client_id) {
									data.client_id = this.loginData.client_id;
								}
								for (var i in info.userInfo) {
									data['userInfo[' + i + ']'] = info.userInfo[i];
								}
								if (loginRes.authResult.access_token) {
									data['third_token'] = loginRes.authResult.access_token;
								}
								//邀请码
								if (this.$store.state.aicode) {
									data.aicode = this.$store.state.aicode;
								}
								let new_user_time_diff = this.$uitls.getNewUseTimeDiff();
								if (new_user_time_diff !== false) {
									data.new_user_time_diff = new_user_time_diff;
								}
								this.$apis.postThirdLogin(data).then((res) => {
									if (res.code == '200') {
										this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP',
											false);
										if (res.data.loginType == 'register') {
											this.handelReg(res.data);
											this.$trackEvent.sign_up({
												type: type,
												email: data['userInfo[email]'] ||
													''
											});
										} else {
											this.loginHandel(res.data);
											uni.$emit('loginSuccess', {
												loginNavigateBackType: this
													.loginNavigateBackType,
												loginNavigateBack: this
													.loginNavigateBack
											});
											this.$trackEvent.login({
												type: type,
												email: data['userInfo[email]'] ||
													''
											});
										}
										this.$store.commit('SET_USER_TYPE', 1)
									} else {
										var message = res.message ? res.message : this.$t(
											'login.sns_login_error');
										uni.showToast({
											title: message,
											icon: "none",
											duration: 3000
										});
									}
								}).catch((res) => {
									var message = res.message ? res.message : this.$t(
										'login.sns_login_error');
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
						if (platform == 'android') {
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
			handelReg(userInfo) {
				if (!this.$store.state.aicode) {
					this.isAicodePage = true;
				}
				if (!this.isAicodePage) {
					this.showRegSuccess();
				}
				if (userInfo) {
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
			showRegSuccess() {
				let isRegSuccess = true;
				if (this.redirectRoute && this.redirectRoute.path) {
					if (this.redirectRoute.path.indexOf('/pages/my/my') == -1) {
						isRegSuccess = false;
					}
					if (this.redirectRoute.path == '/pages/index/index') {
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
				if (isRegSuccess) {
					this.showRegisterSuccess = true;
					this.$refs.pRegisterSuccess.open();
					this.$refs.getCouponRef.getNewcomerCouponList();
				} else {
					this.loginHandel();
				}
			},
			//绑定邀请码
			bindAicode() {
				if (!this.bindData.aicode) {
					this.showRegSuccess();
					return;
				}
				if (this.submitBindDis) {
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
			skipBindCode() {
				this.showRegSuccess();
			},
			//app日活记录
			appDateLog() {
				//#ifdef APP-PLUS
				let currentDate = this.$uitls.currentDate();
				let data = {
					device_id: this.$uitls.getDeviceId()
				}
				if (this.appLogLoading) {
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
					this.$maEvent.impression_event({
						event_category: 'register',
						event_action: 'sign_in_page',
						module: 'sign_in'
					});
					if(this.isLoginVisit) {
						this.$maEvent.visit_event({
							event_category: 'sign_in',
							event_action: 'sign_in_visit',
							event_name: 'sign_in_visit'
						})
						this.isLoginVisit = false;
					}
				} else {
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
					this.$maEvent.impression_event({
						event_category: 'register',
						event_action: 'register_page',
						module: 'register',
						event_data: {
							...(this.$store.state.utmParams && {utm_channel_source:this.$store.state.utmParams}),
							...(this.in_site_source && { in_site_source: this.in_site_source })
						}
					});
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
    @import './index.scss';
</style>