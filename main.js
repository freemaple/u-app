import App from './App';

import messages from './locale/index'
import uitls from '@/common/utils.js'

let i18nConfig = {
  locale: uni.getLocale(),
  messages,
  silentTranslationWarn: true, // 去除国际化警告
}


// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';
//回到顶部
import BackTopMixins from './common/mixins/backTopMixins';
import debounce from '@/common/debounce.js'

// #ifndef VUE3
import Vue from 'vue';
import store from './store';
import * as $apis from './apis/index.js';

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

// 过滤器
import filters from "@/common/filters.js";
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});
const needAuthRoute = [
	'/pages/checkout/index',
    '/pages/my/my',
    '/pages/setting/setting',
    '/pages/distribute/index',
    '/pages/distribute/child',
    '/pages/distribute/profit/index',
    '/pages/my/wallet/index',
    '/pages/my/wallet/cash',
    '/pages/order/order-list',
    '/pages/order/order-detail',
    '/pages/point/index',
    '/pages/point/source',
    '/pages/address/list',
    '/pages/address/add',
    '/pages/coupon/my-coupons',
    '/pages/coupon/coupon-center',
    '/pages/change-password/change-password',
    '/pages/recently-viewed/recently-viewed',
    '/pages/review/list',
    '/pages/investigation/investigation',
    '/pages/my/profile/index',
    '/pages/my/checkin',
    '/pages/vip/index',
    ]
const methodToPatch = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']
methodToPatch.map(item => {
    const original = uni[item]
    let isViewRecordsRunning = false; // 添加标志位
    uni[item] = function (opt = {}) {
        const origin_path = opt.url&&opt.url.split('?')[0]
        const needAuth = needAuthRoute.indexOf(origin_path) > -1;
		
		// 点击个人中心埋点
		if(opt.from && opt.from == 'tabBar' && opt.url == '/pages/my/my') {
			Vue.prototype.$maEvent.custom_event({
				event_category: 'tabBar',
				event_action: 'tabBar_button',
				event_name: 'tabBar_button',
				module: 'tabBar',
				event_data: {
					event_value: 'account'
				},
			});
		}
		
		if(origin_path && origin_path !='/pages/distribute/generateurl') {
			uni.removeStorageSync('shareDetailRules') // 当路由不是个人中心裂变主页时，移除shareDetailRules
		}
        if (needAuth && !store.getters.token) { // 需要登录且未登录
            let url = '/pages/login/index?redirectUrl=' + escape(opt.url);
			if(opt.url == '/pages/my/my') {
				// 站内来源，埋点使用
				url = '/pages/login/index?in_site_source=account&redirectUrl=' + escape(opt.url);
			}
			uni.navigateTo({
				url: url
			})
        } else {
            const { url } = opt;
            if (url !== '/pages/recently-viewed/recently-viewed' && !isViewRecordsRunning) {
                isViewRecordsRunning = true; // 设置标志位为 true
                uitls.viewRecords();

                setTimeout(() => {
                    isViewRecordsRunning = false; // 在一定时间后恢复标志位
                }, 500); // 设置一个适当的时间间隔，单位为毫秒
            }      
            return original.call(this, opt)
        }
    }
})

// 公共方法
import $public from '@/utils/public.js';
Vue.prototype.$public = $public;
Vue.prototype.$uitls = uitls;
Vue.prototype.$copyId = uitls.copyId
import $trackEvent from '@/common/track.js'
Vue.prototype.$trackEvent = $trackEvent;
import $maEvent from '@/common/matomo.js'
Vue.prototype.$maEvent = $maEvent;

// message 提示组件
import messageTip from '@/components/message-tip/message-tip.vue';
Vue.component('message-tip', messageTip);

//注册全局组件添加购物车弹出
// import shoppingCartPopup from '@/components/shoppingCartPopup/index.js';
// Vue.prototype.$shoppingCartPopup = shoppingCartPopup.install
Vue.prototype.$debounce = debounce
Vue.mixin(Mixin);
// Vue.mixin(BackTopMixins);
Vue.config.productionTip = false;
Vue.prototype.$apis = $apis;
Vue.prototype.$store = store;
App.mpType = 'app';
const app = new Vue({
	 i18n,
    ...App,
    store,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
    const app = createSSRApp(App);
    app.mixin(Mixin);
	app.use(i18n)
    return {
        app,
        store,
    };
}
// #endif
