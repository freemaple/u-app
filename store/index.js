import Vue from 'vue'
import Vuex from 'vuex'
import $mUtils from '@/utils/util.js';
import * as $apis from '@/apis/index.js';

Vue.use(Vuex)

const SHOW_SIMPLE = uni.getStorageSync('showSimple') || false

const TOKEN = uni.getStorageSync("access-token") || "";

const IS_LOGIN = uni.getStorageSync("access-token") ? true : false;

//用户显示信息
const USER_INFO = uni.getStorageSync("userInfo") || {};

const CART_COUNT = uni.getStorageSync("cart_count") || 0;

//邀请码
let aicode = uni.getStorageSync("aicode") || '';
// 站外来源
let utmParams = uni.getStorageSync("utmParams") || '';
// 是否浏览过裂变活动页或者个人中心裂变页
const isViewFissionPage = uni.getStorageSync("isViewFissionPage") || false;
// 是否显示过商详页的裂变的浮层提示
const isShowedDetailFloatTip = uni.getStorageSync("isShowedDetailFloatTip") || false;
//app配置信息
let site_name = uni.getAppBaseInfo().appName;
let global_mauid = uni.getStorageSync("global_mauid_cache") || '';
let appConfig =  uni.getStorageSync("app_config_data") || {
	site_name: site_name,
	site_name_upper:site_name.toLocaleUpperCase(),
	share_account: "",
    google_maps_key: "",
	media_channel: null,
	global_mauid: global_mauid
};

const store = new Vuex.Store({
	state: {
		//站点名
		site_name: appConfig.site_name,
		site_name_upper:appConfig.site_name_upper,
		//站点配置
		appConfig: appConfig,
		// 前端token
		token: TOKEN,
		// 用户信息 头像 昵称
		userInfo: USER_INFO,
		hasLogin: IS_LOGIN,
		//是否显示简单版本
		showSimple: SHOW_SIMPLE,
		currencyList: [],
		currentCurrency: '',
		//购物车数量
		cartCount: CART_COUNT,
		name: 'jack',
		statusBarHeight: 0,
		// 是否展示有关VIP的标志数据等
		showVip: true,
		userType:1, // 1-小c；2-小b
		cateGoryShowId: -1, // 首页 => 点击顶部的 women 和 men , 进入分类页面 , 默认展示哪个,
		global_mauid: appConfig.global_mauid || '',
		//邀请码
		aicode: aicode,
		// 站外来源
		utmParams:utmParams,
		showCheckoutLeaveToast: true, // checkout 选择玩优惠券，离开页面是否弹窗，true 是
		footerMobileId: '',
		isHomeCoupon: false,
		isViewFissionPage:isViewFissionPage, // 是否浏览过裂变活动页或者个人中心裂变页
		isShowedDetailFloatTip:isShowedDetailFloatTip, // 是否显示过商详页的裂变的浮层提示
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			if (state.token) {
				return true;
			} else {
				return false
			}
		},
		userInfo: state => {
			return state.userInfo
		},
		token: state => {
			return state.token
		},
		//当前货币类型代码
		currentCurrency: state => {
			return state.currentCurrency
		},
		// 获取购物车数量
		cartCount: state => {
			return state.cartCount
		},
		getShowVip: state => {
			return state.showVip
		},
		getUserType: state => {
			return state.userType
		},
		statusBarHeight: state => {
			return state.statusBarHeight
		},
		//app配置信息
		appConfig: state => {
			return state.appConfig;
		},
		// 首页 => 点击顶部的 women 和 men , 进入分类页面 , 默认展示哪个
		getCateGoryShowId: state => {
			return state.cateGoryShowId
		},
		getShowCheckoutLeaveToast: state => {
			return state.showCheckoutLeaveToast
		}
	},
	mutations: {
		SET_SIMPLE(state, flag){
			state.showSimple = flag;
			uni.setStorageSync("showSimple", flag);
		},
		SET_TOKEN(state, token) {
			state.token = token;
			state.hasLogin = true;
			uni.setStorageSync("access-token", token);
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			if(userInfo.global_mauid){
				state.global_mauid = userInfo.global_mauid;
				uni.setStorageSync('global_mauid_cache', userInfo.global_mauid);
			}
			uni.setStorageSync("userInfo", userInfo);
		},
		SET_LOGOUT(state) {
			let _this = this;
			state.token = "";
			state.hasLogin = false;
			uni.removeStorageSync("access-token");
			uni.removeStorageSync("userInfo");
			uni.removeStorageSync("cart_count");
			$apis.getBaseData().then((res) => {
				state.global_mauid = res.data.global_mauid;
				uni.setStorageSync('global_mauid_cache', state.global_mauid);
				_this.commit("SET_APPCONFIG", res.data);
			});
		},
		CHANGE_NAME(state, name){
			state.name = name
		},
		SET_STATUS_BAR_HEIGHT(state, height) {
			state.statusBarHeight = height
		},
		//设置当前货币类型
		SET_CURRENT_CURRENCY(state, currentCurrency) {
			state.currentCurrency = currentCurrency
			uni.$emit('homeUpdate');
		},
		// 设置购物车数量
		SET_CART_COUNT(state,num) {
			state.cartCount = num
			uni.setStorageSync("cart_count", num);
			getApp().globalData.getShopCartNum();
		},
		SET_SHOW_VIP(state, showVip){
			state.showVip = showVip
		},
		SET_USER_TYPE(state, userType){
			state.userType = userType
		},
		SET_APPCONFIG(state, data) {
			state.appConfig = data;
			if(data.site_name){
				state.site_name = data.site_name;
				state.site_name_upper = data.site_name.toLocaleUpperCase();
			}
			if(data.global_mauid){
				state.global_mauid = data.global_mauid;
				uni.setStorageSync('global_mauid_cache', data.global_mauid);
			}
			uni.setStorageSync("app_config_data", data);
		},
		// 首页 => 点击顶部的 women 和 men , 进入分类页面 , 默认展示哪个
		SET_CATEGORYSHOWID(state, cateGoryShowId) {
			state.cateGoryShowId = cateGoryShowId;
		},
		SET_AICODE(state, aicode) {
			if(aicode){
				state.aicode = aicode;
				uni.setStorageSync("aicode", aicode);
			}
		},
		SET_UTMPARAMS(state, utmParams) {
			if(utmParams){
				state.utmParams = utmParams;
				uni.setStorageSync("utmParams", utmParams);
			}
		},
		SET_Show_Checkout_Leave_Toast(state, showCheckoutLeaveToast) {
			state.showCheckoutLeaveToast = showCheckoutLeaveToast;
		},
		SET_Forter_Mobile_Id(state, mobile_id) {
			state.footerMobileId = mobile_id;
			uni.setStorageSync("footer_mobile_id", mobile_id);
		},
		SET_HomeCoupon(state, flag){
			state.isHomeCoupon = flag;
		},
		SET_ISVIEWFISSIONPAGE(state,isViewFissionPage) {
			state.isViewFissionPage = isViewFissionPage;
			uni.setStorageSync("isViewFissionPage", isViewFissionPage);
		},
		SET_ISSHOWEDDETAILFLOATTIP(state,isShowedDetailFloatTip) {
			state.isShowedDetailFloatTip = isShowedDetailFloatTip;
			uni.setStorageSync("isShowedDetailFloatTip", isShowedDetailFloatTip);
		}
	},
	actions: {
		//登录操作
		login({
			commit
		}, userData) {
			return new Promise((resolve, reject) => {
				commit("SET_TOKEN", userData.access_token);
				if(userData.user_info){
					commit("SET_USERINFO", userData.user_info);
				}
				uni.setStorageSync('isNeedUpdate', '1');
				uni.removeStorageSync('billing_address');
				uni.setStorageSync('sign_behavior', '1');
				resolve();
			})
		},
		// 登录过期 重新登录
		reLogin({
			commit
		}, info) {
			commit("SET_LOGOUT", "");
			let pages = getCurrentPages();
			let redirectUrl = '';
			let path = '';
			if(pages.length > 0){
				let c_page = pages[pages.length - 1];
				//#ifdef H5
				let route = c_page.$route;
				path = route && route.path ? route.path : '';
				redirectUrl = route.fullPath;
				//#endif
				//#ifndef H5
				path = c_page.route;
				redirectUrl = '/' + path;
				var param = [];
				for (let key in c_page.options) {
				    param.push(key + '=' + c_page.options[key]);
				}
				if(param.length > 0){
					redirectUrl += "?" + param.join("&");
				}
				//#endif
			}
			// 小b
			if(store.state.userType == 2) {
				if(redirectUrl.indexOf('/pages/dropshipping-login/index') == -1){
					uni.navigateTo({
						url: '/pages/dropshipping-login/index?redirectUrl=' + escape(redirectUrl)
					});
				}
			} else {
				// 小c
				if(redirectUrl.indexOf('/pages/login/index') == -1){
					let switchIndex = $mUtils.checkSwitch(redirectUrl)
					if (switchIndex > -1) {
						uni.navigateTo({
							url: '/pages/login/index?redirectUrl=' + escape(redirectUrl)
						});
					} else{
						uni.navigateTo({
							url: '/pages/login/index?redirectUrl=' + escape(redirectUrl)
						});
					}
				}
			}
		},
		// 注销操作
		logout({
			commit
		}, info) {
			return new Promise((resolve, reject) => {
				commit("SET_LOGOUT", "");
				uni.reLaunch({
					url: '/pages/index/index'
				});
				store.state.cartCount = 0
				
				//注销账户隐藏购物车小红点
				uni.hideTabBarRedDot({
					index: 3
				});
			});
		},		
		ASYNC_CHANGE({commit}, name) {
			setTimeout(()=>{
				commit('CHANGE_NAME',name)
			},3000)
		}		
	}
})

export default store
