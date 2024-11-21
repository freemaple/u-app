<script>
//app.js
import locales from '././utils/locales.js';
import T from '././utils/i18n.js';
import $mUtils from '@/utils/util.js';
// #ifdef APP-PLUS
import {ForterModule} from "@/uni_modules/ut-forter";
// #endif
import  AppUpdate from '@/utils/appUpdate.js'; 

export default {
    data() {
        return {};
    },
    onPageNotFound(res) {
        uni.redirectTo({ url: '/pages/error/404' })
    },
    // 初始化url和设备
    onLaunch: function () {
		// 更新提示
		// #ifdef APP-PLUS 
		AppUpdate()
        // #endif
		this.getBaseData(() => {
			this.launchingAppEvent();
		});
		let app_open_time = uni.getStorageSync('app_open_time', '');
		if(!app_open_time || app_open_time<=0){
			uni.setStorageSync('app_open_time', Math.floor(new Date().getTime() / 1000));
		}
		//网络变化
		uni.onNetworkStatusChange((res) => {
			if(res.isConnected && !this.loadBaseData){
				this.getBaseData();
				try {
					uni.removeStorageSync('app_log_date');
				} catch (e) {

				}
				this.appDateLog();
			}
		});
		// #ifdef APP-PLUS
		this.openinstall();
		this.plusEvent();
		this.$trackEvent.app_open();
		// #endif
        var that = this;
        that.globalData.urls();
		// 初始化checkout页离开优惠券弹窗
		uni.setStorageSync('is_checkout_onepage_show_coupon', false);
        // 初始化货币

        var fecshop_currency = uni.getStorageSync('fecshop-currency');

        if (!fecshop_currency) {
            var currency_code = that.globalData.siteInfo.currency_code;
            uni.setStorageSync('fecshop-currency', currency_code);
        } // 初始化语言

        T.registerLocale(locales); // (1)

        var fecshop_lang = uni.getStorageSync('fecshop-lang');

        if (!fecshop_lang) {
            fecshop_lang = that.globalData.siteInfo.lang_code;
            uni.setStorageSync('fecshop-lang', fecshop_lang);
        }

        T.setLocaleByCode(fecshop_lang); // (2)

        uni.T = T; // (3)
        // 初始化语言 - 完成
		//#ifdef APP-PLUS
		plus.screen.lockOrientation('portrait-primary'); // 强制竖屏
		//#endif
		//#ifdef APP-PLUS
		this.getFooterMobileId(); //getFooterMobileId
		//#endif
		this.appDateLog();
		// #ifdef H5
		this.$store.commit('SET_HomeCoupon', true);
		// #endif
    },
	onShow(){
		// #ifdef APP-PLUS
		let argum = plus.runtime.arguments;
		if(argum){
			let arr = argum.split('://');
			let page = arr[1];
			if(page){
				this.appLink('/' + page);
			}
			plus.runtime.arguments = '';
		}
		// #endif
		setTimeout(() => {
			this.appDateLog();
		}, 1000);
		uni.$emit('onParentShow');
		if(this.loadBaseData){
			this.launchingAppEvent();
		}
	},
    globalData: {
        userInfo: null,

        urls: function () {
            var that = this;
            that.urls = that.siteInfo.url + that.siteInfo.subDomain;
            that.share = that.siteInfo.shareProfile;
        },

        share: '',
        siteInfo: require('./config.js'),

        token: '',

        fadeInOut: function (that, param, opacity) {
            var animation = uni.createAnimation({
                //持续时间800ms
                duration: 300,
                timingFunction: 'ease'
            });
            animation.opacity(opacity).step();
            var json = '{"' + param + '":""}';
            json = JSON.parse(json);
            json[param] = animation.export();
            that.setData(json);
        },

        //
        isStrInArray: function (item, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == item) {
                    return true;
                }
            }

            return false;
        },

        // 设置页面底部的购物车产品个数
        getShopCartNum: function () {
            var that = this;
            uni.getStorage({
                key: 'cart_count',
                success: function (res) {
                    if (res.data) {
                        if (res.data > 0) {
                            uni.setTabBarBadge({
                                index: 3,
                                text: '' + res.data + ''
                            });
                        } else {
                            uni.removeTabBarBadge({
                                index: 3
                            });
                        }
                    } else {
                        uni.removeTabBarBadge({
                            index: 3
                        });
                    }
                }
            });
        }
    },
	methods: {
		//获取基础数据接口
		async getBaseData(callback){
			this.$apis.getBaseData().then((res) => {
				if(!this.openBindData){
					if(res.data.aicode){
						this.$store.commit('SET_AICODE', res.data.aicode);
					}
				}
				this.$store.commit("SET_APPCONFIG", res.data);
				this.loadBaseData = true;
				//#ifdef APP-PLUS
				if(res.data.forter_site_id){
					this.forterInit(res.data.forter_site_id);
				}
				//#endif
				callback && callback();
			});
		},
		//openinstall
		openinstall(){
			try {
				const openinstall = uni.requireNativePlugin('openinstall-plugin');
				openinstall.init();
				openinstall.getInstall(
				    60,
				    (result) =>  {
						let aicode = ''
				        if(result.bindData){
							let bindData = JSON.parse(result.bindData);
							if(bindData.aicode){
								if(!uni.getStorageSync("aicode")){
									this.$store.commit('SET_AICODE', bindData.aicode);
								}
								this.openBindData = bindData;
								aicode = bindData.aicode;
							}
							
							let utmParams = {};
							if(bindData.utm_source) {
								utmParams.utm_source = bindData.utm_source
							}
							if(bindData.utm_medium) {
								utmParams.utm_medium = bindData.utm_medium
							}
							if(bindData.utm_campaign) {
								utmParams.utm_campaign = bindData.utm_campaign
							}
							if(bindData.mgm) {
								utmParams.mgm = bindData.mgm
							}
							if(!bindData.utm_source&&!bindData.utm_medium&&!bindData.utm_campaign&&!bindData.mgm) {
								utmParams = ''
							} else {
								this.$store.commit('SET_UTMPARAMS', utmParams);
							}
						}
						//是否显示首页优惠劵弹框
						let isHomeCoupon = true;
						if(aicode && !this.$store.getters.hasLogin){
							isHomeCoupon = false;
						}
						this.$store.commit('SET_HomeCoupon', isHomeCoupon);
						setTimeout(() => {
							//显示首页弹框
							uni.$emit("homeCashgrabRewards", {
								aicode: aicode
							});
						}, 1000);
				    }
				);
			} catch(e){
				this.$store.commit('SET_HomeCoupon', true);
			}
		},
		//plus事件
		plusEvent(){
			let client = uni.getSystemInfoSync().platform
			// 监听系统通知栏消息点击事件
			plus.push.addEventListener('click', (msg) => {
			    let link = '';
			    if (client == 'ios') {
			        // ios
			        try {
			            if (typeof msg.payload === 'object') {
			                // iOS payload 直接是对象
			                if (msg.payload.payload && msg.payload.payload.link) {
			                    link = msg.payload.payload.link;
			                }
			            } else {
			                // iOS payload 需要解析为对象
			                let parsedPayload = JSON.parse(msg.payload);
			                if (parsedPayload.payload && parsedPayload.payload.link) {
			                    link = parsedPayload.payload.link;
			                }
			            }
			        } catch (e) {
			            console.error('error', e);
			        }
			    } else {
			        // android
			        try {
			            let payload = msg.payload;
			            if (typeof payload != 'object') {
			                payload = JSON.parse(payload);
			            }
			            if (payload.payload && payload.payload.link) {
			                link = payload.payload.link;
			            }
			        } catch (e) {
			            console.error('error', e);
			        }
			    }
			    if (link) {
			        this.navTo(link);
			    }
			}, false);
			
			// 监听接收透传消息事件
			plus.push.addEventListener('receive', (msg) => {
				let payload = msg.payload;
				try {
					// 检查 payload 的类型，如果是字符串则解析为 JSON 对象
					if (typeof payload === 'string') {
						payload = JSON.parse(payload);
					}
					// 透传消息的处理逻辑
					if (payload.payload && payload.payload.link) {
						var options = {
							...payload,
							cover: false
						};
						// 在线处理
						if (payload.payload.is_online === 1) {
							let messageTitle = payload.payload.title;
							let messageContent = payload.payload.content;
							// 创建本地消息
							plus.push.createMessage(messageContent, options.payload, {
								title: messageTitle
							});
						} else {
							// 离线处理
							plus.push.createMessage(msg.content, JSON.stringify(options), options);
						}
					}
				} catch (e) {
					console.error('Error parsing payload:', e);
				}
			}, false);

		},
		navTo(url) {
			if (!url || url.length == 0) {
				return
			}
			if(url.indexOf('http:') != -1 || url.indexOf('https:') != -1){
				plus.runtime.openURL(url);
			} else {
				let switchIndex = $mUtils.checkSwitch(url, this)
				//判断是否是底部tab
				if (switchIndex != -1) {
					uni.switchTab({
						'url': url
					});
				} else {
					uni.navigateTo({
						'url': url
					});
				}
			}
		},
		//打开app内链接
		appLink(url){
			var aicode = this.getQueryVariable(url, "aicode");
			if(aicode){
				this.$store.commit('SET_AICODE', aicode);
			}
			var utm_source = this.getQueryVariable(url, "utm_source");
			var utm_medium = this.getQueryVariable(url, "utm_medium");
			var utm_campaign = this.getQueryVariable(url, "utm_campaign");
			var mgm = this.getQueryVariable(url, "mgm");
			let utmParams = {};
			if(utm_source) {
				utmParams.utm_source = utm_source
			}
			if(utm_medium) {
				utmParams.utm_medium = utm_medium
			}
			if(utm_campaign) {
				utmParams.utm_campaign = utm_campaign
			}
			if(mgm) {
				utmParams.mgm = mgm
			}
			if(!utm_source&&!utm_medium&&!utm_campaign&&!mgm) {
				utmParams = ''
			} else {
				this.$store.commit('SET_UTMPARAMS', utmParams);
			}
			let switchIndex = $mUtils.checkSwitch(url, this)
			//判断是否是底部tab
			if (switchIndex != -1) {
				uni.switchTab({
					'url': url
				});
			} else {
				uni.navigateTo({
					'url': url
				});
			}
		},
		getQueryVariable(url, variable){
			if(!url){
				return '';
			}
		    var q = url.split("?")[1];
		    var vars = q.split("&");
		    for (var i=0;i<vars.length;i++) {
		        var pair = vars[i].split("=");
		        if(pair[0] == variable){return pair[1];}
		    }
		    return(false);
		},
		forterInit(siteId){
			ForterModule && ForterModule.forterInitialize(siteId);
		},
		getFooterMobileId(){
			let mobile_id = ForterModule && ForterModule.mobileId();
			if(mobile_id){
				this.$store.commit('SET_Forter_Mobile_Id', mobile_id);
			}
		},
		//app日活记录
		appDateLog(){
			//#ifdef APP-PLUS
			let isDateLog = uni.getStorageSync('app_log_date');
			let currentDate = this.$uitls.currentDate();
			if(!isDateLog || isDateLog != currentDate){
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
			}
			// #endif
		},
		launchingAppEvent(){
			if(this.launching_app){
				return false;
			}
			this.launching_app = true;
			setTimeout(() => {
				this.$maEvent.launching_app();
			}, 1000);
			//30秒埋一次
			setTimeout(() => {
				this.launching_app = false;
			}, 1000 * 30);
		}
	}
};
</script>
<style>
	@import "static/common.css";
	body{
		font-family: 'Montserrat-Medium';
		font-weiht: 500;
	}
	/deep/.uni-tabbar {
		box-shadow: 0px -2px 16px 0px rgba(0,0,0,0.1);
	}
    /deep/.uni-tabbar__item:nth-child(2) img{
        /* transform: scale(1.5); */
    }
	/* 业务要求 密码显示隐藏icon样式调换 */
	.uniui-eye-filled:before {
		content: "\e6b4" !important;
	}
	/* 业务要求 密码显示隐藏icon样式调换 */
	.uniui-eye-slash-filled:before {
		content: "\e66a" !important;
	}
	::v-deep .uni-body.pages-cms-article-article {
		overflow-y: auto !important;
	}
	/**app.wxss**/
	.container {
		height: 100%;
	}
	.page-max-width {
		max-width: 1024px;
		margin-left: auto;
		margin-right: auto;
	}
	.wxParse-img {
		display: block !important;
	}

	.header-container {
		width: 100%;
		height: 130rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.header-container .header-name {
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 170rpx;
		font-size: 30rpx;
		color: #333;
	}

	.iphone .header-container {
		height: 180rpx;
	}

	.iphone .header-container .header-name {
		line-height: 270rpx;
	}

	.header-container .goback {
		width: 56rpx;
		height: 56rpx;
		margin-top: 50rpx;
		position: absolute;
		margin-left: 20rpx;
		border: 1rpx solid #fff;
		border-radius: 50%;
		padding: 6rpx;
	}

	.iphone .header-container .goback {
		margin-top: 90rpx;
	}
	.hidden {
		display: none;
	}
	.no-more-goods {
		text-align: center;
		margin-top: 10%;
		margin-bottom: 10%;
	}

	.no-order-img {
		width: 220rpx;
		height: 220rpx;
	}

	.no-more-goods .text {
		font-size: 28rpx;
		color: #999;
		margin-top: -5px;
	}
	.fix-top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 98;
	}
	::v-deep uni-button[loading]:before {
		margin-bottom: 9rpx;
		width: 36rpx;
		height: 36rpx;
	}
</style>
<style lang="scss">
	@import "static/common.scss";
</style>
