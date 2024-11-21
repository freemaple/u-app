<template>
	<!-- @touchmove.stop.prevent 防止被弹出层覆盖的页面滚动 -->
	<view @touchmove.stop.prevent="()=>{}">
		<uni-popup ref='popup' type="left">
			<view class="pop-wrapper" >
				<scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
					:style="'height:' + screenHeight + 'px'">
					<view class="pop-header flex align-items-center">
						<view class="header-wrapper flex align-items-center">
							<view class="mine" @tap="handleSwitchTab">
								<i class="iconfont"></i>
							</view>
							<view v-show="!token" class="sign" @tap="handleToLogin()">
								{{ $t('popupleft.sign_in') }}
							</view>
							|
							<view v-show="!token" class="join" @tap="handleToLogin('register')">
								{{$t('popupleft.join')}}
							</view>
							<view v-show="token" class="join">
								{{$t('popupleft.welcome', {site_name: $store.state.site_name_upper})}}
							</view>
						</view>
					</view>
					<view class="pop-cate">
						<view class="cate-item flex justify-content-between" @tap="handleToHome">
							<view class="cate-item-name">{{ $t('popupleft.home') }}</view>
							<!-- <i class="iconfont"></i> -->
						</view>
						<view class="cate-item flex justify-content-between" @tap="handleToCate(item.id)"
							v-for="(item, index) in categories" :key="item.name + index">
							<view class="cate-item-name">
								{{ item.name }}
							</view>
							<!-- <i v-if="index !== 0" class="iconfont"></i> -->
							<i class="iconfont"></i>
						</view>
						<!--<view class="cate-item flex justify-content-between" @tap="handleToFlashSale">
							<view class="cate-item-name">{{ $t('popupleft.flash_sale') }}</view>
							<i class="iconfont"></i>
						</view>
						<view class="cate-item flex justify-content-between" @tap="handleToWholeSale">
							<view class="cate-item-name">{{ $t('popupleft.whole_sale') }}</view>
							<i class="iconfont"></i>
						</view>-->
					</view>
					<view class="pop-bottom-lang">
						<view class="bottom-item" @tap="handleToLang">
							<i class="iconfont"></i>
							<view class="title">
								{{$t('popupleft.language')}}
							</view>
							<view class="content">
								{{$i18n.locale}}
							</view>
						</view>
						<view class="bottom-item" @tap="handleToCurrency">
							<i class="iconfont"></i>
							<view class="title">
								{{$t('popupleft.currency')}}
							</view>
							<view class="content">
								{{ currentCurrency }}
							</view>
						</view>
						<view class="bottom-item" @click="() => { $public.handleNavTo('/pages/contact/contact') }">
							<i class="iconfont"></i>
							<view class="title">
								{{$t('popupleft.customer_service')}}
							</view>
							<view class="content">

							</view>
						</view>
					</view>
					<view class="pop-community" v-if="$store.state.appConfig && $store.state.appConfig.media_channel">
						<i v-for="(item, key) in $store.state.appConfig.media_channel" :key="key" class="iconfont" @tap="toSocial(item)"></i>
					</view>
					<view class="pop-footer">
						<view class="copyright">
							©2023 Dressin
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
var app = getApp(); 
export default {
	name: "popupLeft",
	data() {
		return {
			screenHeight: 0,
			contentHeight: 0,
			categories: [],
		};
	},
	computed: {
		...mapGetters(['currentCurrency', 'token']),
	},

	created() {
		const that = this
		const currentCurrency = uni.getStorageSync('fecshop-currency')
		currentCurrency&&that.$store.commit('SET_CURRENT_CURRENCY',currentCurrency)
		uni.$off('languageChange').$on('languageChange', that.queryCateListWxmenu)
		that.queryCateListWxmenu()
		uni.getSystemInfo({
			success: (res)=> {
				that.screenHeight = res.screenHeight
			}
		})
	},
	methods: {
		handleToCate(type) {
			// console.log(window.devicePixelRatio)
			this.$refs['popup'].close()
			// if(type == 0) {
			// 	//点击的是home，若在首页则直接return，在其他页面则跳转首页
			// 	return uni.switchTab({
			// 			url: '/pages/index/index'
			// 		})					
			// }
			getApp().globalData.paramsData = {
						id: type,
					};
			uni.switchTab({
				url: '/pages/cate/index',
			
			})
		},
		handleToLogin(page) {
			var url = '/pages/login/index?in_site_source=account';
			if(page){
				url +="?page=" + page;
			}
			uni.navigateTo({
				url: url,
			});
		},
		handleToLang() {
			uni.navigateTo({
				url: '/pages/language/language',
				success: (res) => {
					// res.eventChannel.emit('changeLang', { checkedVal: 'English' })
				}
			})
		},
		handleToCurrency() {
			const that = this
			uni.navigateTo({
				url: '/pages/currency/currency',
				success: (res) => {
					res.eventChannel.emit('changeCurrency', { checkedVal: that.currentCurrency })
				}
			})
		},
		handleToHome() {
			this.$refs['popup'].close()
			uni.switchTab({ url: '/pages/index/index' })
		},
		handleToFlashSale() {
			const that = this
			uni.navigateTo({
				url: '/pages/flash-sale/flash-sale',
				success: (res) => {
					// res.eventChannel.emit('changeCurrency', { checkedVal: that.currentCurrency })
				}
			})
		},
		handleToWholeSale() {
			const that = this
			uni.navigateTo({
				url: '/pages/whole-sale/whole-sale',
				success: (res) => {
					// res.eventChannel.emit('changeCurrency', { checkedVal: that.currentCurrency })
				}
			})
		},

		handleSwitchTab() {
			this.$refs['popup'].close()
			uni.switchTab({ url: '/pages/my/my' })
		},
		queryCateListWxmenu() {
			let that = this
			this.$apis.queryCateListWxmenu().then(res => {
				if (res.code == 200) {
					const { categories } = res.data;
					// categories[0].name = 'Home'
					that.setData({
						categories: categories,
					});
				}
			})
		},
		toSocial(item){
			// #ifdef APP-PLUS
				plus.runtime.openURL(item.url);
			// #endif
			// #ifdef H5
				window.open(item.url);
			// #endif
		}
	}
}
</script>

<style scoped lang="scss">
.pop-wrapper {
	width: 600rpx;
	background-color: #fff;
	overflow-y: auto;
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;

	.pop-lists {
		width: 100%;
		overflow-y: auto;

		.pop-header {
			width: 100%;
			height: 96rpx;
			box-sizing: border-box;
			padding: 0 32rpx;
			background: url("~@/static/images/bg_leftmenu.jpg");
			background-size: 100% 100%;

			.header-wrapper {
				// width: 346.79rpx;
				height: 75rpx;
				color: #fff;
				font-size: 27.9998rpx;
				font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;

				.mine {
					width: 60rpx;
					height: 60rpx;
					// text-align: center;
					line-height: 60rpx;
					margin-right: 15rpx;

					i::before {
						content: "\E607";
						font-size: 41.25rpx;
					}
				}

				.sign {
					margin-right: 32rpx;
				}

				.join {
					margin-left: 30rpx;
					// text-decoration: line-through;
				}
			}

		}

		.pop-cate {
			width: 100%;
			// height: 600rpx;
			// background-color: pink;
			box-sizing: border-box;
			padding: 16rpx 0;
			margin-bottom: 16rpx;

			.cate-item {
				width: 100%;
				height: 96rpx;
				box-sizing: border-box;
				padding: 0 32rpx;
				line-height: 96rpx;

				.cate-item-name {
					font-size: 28rpx;
					color: #333;
					text-overflow: ellipsis;
					overflow: hidden;
					width: 88%;
					white-space: nowrap;
				}

				i::before {
					content: "\E609";
					color: #666;
					font-size: 48rpx;
				}
			}
		}

		.pop-bottom-lang {
			width: 100%;
			box-sizing: border-box;
			padding: 16rpx 0;
			margin: 0 0 47.33rpx 0;

			// height: 800rpx;
			.bottom-item {
				width: 100%;
				height: 96rpx;
				display: flex;
				align-items: center;
				color: #333;
				font-size: 28rpx;
				box-sizing: border-box;
				padding: 0 32rpx;

				i::before {
					font-size: 48rpx;
					color: #666;
				}

				.title {
					padding-left: 36rpx;
					width: 318.78rpx;
				}

				.content {
					color: #f85184;
					text-align: right;
					width: 163.73rpx;
				}

				&:nth-child(1) {
					i::before {
						content: "\E664";
					}
				}

				&:nth-child(2) {
					i::before {
						content: "\E663";
					}
				}

				&:nth-child(3) {
					i::before {
						content: "\E614";
					}
				}
			}
		}

		.pop-community::before {
			content: "";
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 1px;
			background-color: #e5e5e5;

			@media (min-resolution: 2dppx) {
				transform: scaleY(0.5)
			}

			;

			@media (min-resolution: 3dppx) {
				transform: scaleY(0.33);
			}
		}

		.pop-community {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			// border-top: 1px solid #e5e5e5;
			height: 140.52rpx;
			display: flex;
			justify-content: space-between;
			padding: 48rpx 32rpx 40rpx 32rpx;

			i {
				font-size: 48rpx;
				color: #000;

				&:nth-child(1)::before {
					content: "\E659";
				}

				&:nth-child(2)::before {
					content: "\E657";
				}

				&:nth-child(3)::before {
					content: "\E655";
				}

				&:nth-child(4)::before {
					content: "\E658";
				}

				&:nth-child(5)::before {
					content: "\E65a";
				}

				&:nth-child(6)::before {
					content: "\E656";
				}
			}
		}

		.pop-footer {
			width: 100%;
			height: 65.59rpx;
			box-sizing: border-box;
			padding: 0 32rpx 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			color: #999;
			margin-bottom: 50px;
			.full-site {
				display: flex;
				// width: 149.83rpx;
				justify-content: space-between;

				.fcmall {
					margin-right: 10rpx;
				}

				.gap {
					margin-right: 10rpx;
				}
			}
		}
	}
}

/deep/.uni-popup {
	z-index: 999999 !important;
}
</style>
