<template>
	<view class="navgation-box page-max-width">
		<view class="header align-items-center justify-content-between flex">
			<view class="header-left align-items-center justify-content-between flex">
				<view v-if="showPopLeft" @tap="handleOpenPopup" class="menu-icon">
					<i class="iconfont"></i>
				</view>
				<view v-if="showBack" @tap="handleBack" class="menu-icon back-icon">
					<i class="iconfont"></i>
				</view>
				<view v-if="showLogo" class="header-logo flex align-items-center">
					<image mode='heightFix' src="@/static/images/nav_logo.png" alt=""></image>
				</view>
				<view v-if="title" class="left-title flex align-items-center">{{ title }}</view>
			</view>
			<view class="header-right">
				<view class="account" @tap="handleToAccount">
					<i class="iconfont"></i>
				</view>
				<view @tap="() => { $public.handleNavTo('/pages/search/search') }" class="search">
					<i class="iconfont"></i>
				</view>
				<view v-if="showWishlist" class="wishlist" @tap="() => { $public.handleNavTo('/pages/fav-list/fav-list') }">
					<i class="iconfont"></i>
				</view>
				<view v-if="showLayoutChange" @tap="handleChangeListType" class="changeListLayout">
					<image
					v-show="showSingleList"
						class="view_img"
						src="@/static/images/icon/viewGrid.png"
						mode="heightFix"
					/>
					<image
					v-show="!showSingleList"
						class="view_img"
						src="@/static/images/icon/hangzhuangshitu.png"
						mode="heightFix"
					/>
				</view>
				<navigator url="/pages/cart/cartPage" hover-class="navigator-hover">			
					<view class="cart">
						<uni-badge absolute="rightTop" type="error" size="small"  :max-num=999 :text=cartCount>
						<i class="iconfont"></i>
					</uni-badge>
					</view>					
				</navigator>
				<navigator url="/pages/my/checkin" hover-class="navigator-hover">
					<view class="checkin">
						<i class="iconfont icon-date"></i>
					</uni-badge>
					</view>					
				</navigator>
		</view>
	</view>
	<popupLeft v-if="showPopLeft" ref='popupLeft'></popupLeft>
	</view>
</template>

<script>
const app = getApp();
import {
	mapState,
	mapMutations,
} from 'vuex'
import popupLeft from '../popupLeft/popupLeft.vue';
export default {
  components: { popupLeft },
	data() {
		return {
			statusBarHeight: 0,
			titleBarHeight: 0, //yours: '搜索你关注的内容',
			showSingleList: false,
		};
	},
	props: {
		//小程序页面的表头
		title: {
			type: String,
			default: ''
		},
		//是否展示返回和主页按钮
		showIcon: {
			type: Boolean,
			default: true
		},
		//是否显示标题
		showTitle: {
			type: Boolean,
			default: true
		},
		yourSearchContent: {
			type: String,
			default: ''
		},
		//是否显示搜索框
		showSearch: {
			type: Boolean,
			default: true
		},
		nowRef: {
			type: String,
			default: 'popupIndex',
		},
		showPopLeft: {
			type: Boolean,
			default: false,
		},
		showBack: {
			type: Boolean,
			default: false,
		},
		showLogo: {
			type: Boolean,
			default: false,
		},
		showWishlist: {
			type: Boolean,
			default: false,
		},
		showLayoutChange: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapState(['cartCount'])
	},
	mounted: function () {
		// 因为很多地方都需要用到，所有保存到全局对象中
		if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
			this.setData({
				statusBarHeight: app.globalData.statusBarHeight,
				titleBarHeight: app.globalData.titleBarHeight
			});
			this.SET_STATUS_BAR_HEIGHT(app.globalData.titleBarHeight)
		} else {
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
					if (!app.globalData) {
						app.globalData = {};
					}

					if (res.model.indexOf('iPhone') !== -1) {
						app.globalData.titleBarHeight = 44;
					} else {
						app.globalData.titleBarHeight = 48;
					}
					
					app.globalData.statusBarHeight = res.statusBarHeight;
					that.setData({
						statusBarHeight: app.globalData.statusBarHeight,
						titleBarHeight: app.globalData.titleBarHeight
					});
					//更新store
					that.$store.commit('SET_STATUS_BAR_HEIGHT', that.titleBarHeight)
				},

				failure() {
					that.setData({
						statusBarHeight: 0,
						titleBarHeight: 0
					});
				}
			});
		}
	},
	methods: {
		...mapMutations(['SET_STATUS_BAR_HEIGHT']),
		headerBack() {
			uni.navigateBack({
				delta: 1,

				fail(e) {
					uni.switchTab({
						url: '/pages/grouponList/main'
					});
				}
			});
		},

		headerHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},

		headerSearch() {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		handleOpenPopup() {
            this.$refs['popupLeft'] && this.$refs['popupLeft'].$refs['popup'] && this.$refs['popupLeft'].$refs['popup'].open()
        },
		handleBack() {
			this.$public.handleGoBack();
		},
		handleToAccount() {
			uni.switchTab({
				url: '/pages/my/my'
			})
		},
		handleChangeListType(){
			this.showSingleList = !this.showSingleList
			this.$emit('changeListType', this.showSingleList)
		}
	}
};
</script>
<style scoped lang="scss">
	.navgation-box {
		position: fixed;
		width: 100%;
		top: 0;
		background: #fff;
		z-index: 1;
		height: 88rpx;
		box-shadow: 0 1rpx 3rpx #d7d7d7;
	}
.loading-gif {
	width: 46rpx;
	height: 8rpx;
}

.loading-wrap {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 20rpx;
}

.loading-wrap image {
	background-color: transparent;
}

.header {
	height: 100%;
	// background-color: palegoldenrod;
	// top: 0;
	// position: fixed;
	// width: 100%;
	// background-color: #fff;
	// z-index: 99998;
	// box-shadow: 0 1rpx 3rpx #d7d7d7;

	.header-left {
		height: 48rpx;
		.menu-icon {
			width: 48rpx;
			height: 48rpx;
			display: flex;
			align-items: center;

			// height: var(--status-bar-height);
			i::before {
				content: "\E605";
				color: #333;
				font-size: 48rpx;
			}
		}

		.back-icon {
			i::before {
				content: "\E697";
			}
		}

		.header-logo {
			height: 80%;
			>image {
				margin-left: 36rpx;
				height: 100%;
			}
		}

		.left-title {
			display: flex;
			align-items: center;
			margin-left: 18rpx;
			// line-height: 100%;
			width: 270rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 36rpx;
			color: #000;
			font-weight: 700;
			height: 100%;
		}
	}

	.header-right {
		width: 327.5rpx;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		font-size: 40rpx;
		color: #333;
		align-items: center;

		.account {
			>i::before {
				content: "\E607";
			}
		}

		.search {
			>i::before {
				content: "\E604";
			}
		}
		.wishlist{
			>i::before {
				content: "\E6B8";
			}
		}
		.cart {
		
			/deep/.uni-badge{
				top: -5px!important;
			}
			i::before {
				content: "\E698";
			}

		}
		.checkin {
			>i::before {
				content: "\E667";
			}
			position: relative;
			right: 10rpx;
		}
		.changeListLayout{
			height: 48rpx;
			.view_img{
				height: 48rpx;
			}
		}
		
	}
}

.header .line {
	border-left: 1rpx solid #d7d7d7;
	height: 36rpx;
}

.header .back,
.header .home {
	height: 32rpx;
	width: 40%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.header .title-bar {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 138rpx;
	height: 56rpx;
	border: 1rpx solid #f1f1f1;
	border-radius: 32rpx;
	margin-left: 14rpx;
	padding: 0 14rpx;
}

.header .title-bar image {
	width: 32rpx;
	height: 32rpx;
	background: transparent;
	vertical-align: top;
}

.header .header-title {
	position: absolute;
	left: 50%;
	font-size: 38rpx;
	transform: translateX(-50%);
}

.header .search-box {
	/* border: 1px solid #eee; */
	border-radius: 27px;
	background: hsla(0, 0%, 100%, 0.6);
	height: 32px;
	width: 355rpx;
	background: #f7f7f7;
	margin-left: 20rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.header .search-box text {
	height: 30px;
	line-height: 30px;
	color: #d1d1d1;
	/* padding-left: 14px; */
	font-size: 26rpx;
	margin-left: 5rpx;
}

.header .search-box image {
	height: 34rpx;
	width: 34rpx;
	margin-left: 14px;
}
</style>
