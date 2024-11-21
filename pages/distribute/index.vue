<template>
	<view class="container distribute-box dui-padding-top-header">
		<pageHeader color="white" title=""></pageHeader>
		<view class="user-section">
			<view class="bg"></view>
			<view class="user-info-box">
				<view class="portrait-box" @click="navTo('/pages/user/userInfo')">
					<i class="iconfont"></i>
				</view>
				<view class="nickname font-bold" @click="navTo('/pages/user/userInfo')">
					<text class="username">{{ personInfo.email || 'account' }}</text>
				</view>
				<view @click="handleCopy" v-if="shareUrl" class="invite-btn">{{$t('distribute.index.invite_btn')}}</view>
			</view>

		</view>
		
		<view class="bottom-wrapper">
			<card-list :cardListData="cardListData" @cardClickHandel="cardClickHandel"></card-list>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			logged: true,
			personInfo: {
				email: '',
			},
			shareUrl: '',
			cardListData: [],
			isLoad: false,
		};
	},
	computed: {
		...mapGetters(['hasLogin', 'token'])
	},
	onReady() {

	},
	onLoad(){
		this.queryAcountMsg();
		this.handleShareInfo()
	},
	onShow() {
		if(this.$store.getters.hasLogin && this.isLoad){
			this.queryAcountMsg();
			this.handleShareInfo()
		}
		
		this.logged = this.hasLogin;
		this.cardListData = [			
			{
				title: this.$t('distribute.index.url'),
				type: 'icon-chaolianjie1',
				page: 'my_rewards',
				url: '/pages/distribute/generateurl'
			},
			{
				title: this.$t('distribute.index.child'),
				type: 'icon-zongshouru',
				page: 'sharing_history',
				url: '/pages/distribute/history'
			},
			/*{
				title: this.$t('distribute.index.wallet'),
				type: 'icon-wallet',
				url: '/pages/my/wallet/index'
			}*/
		]
		this.$maEvent.visit_event({
			event_category: 'cashgrab',
			event_action: 'cashgrab_visit',
			event_name: 'cashgrab_visit'
		})
	},
	onPullDownRefresh() {
		this.queryAcountMsg()
	},
	methods: {	
		gotoMy() {
			uni.switchTab({
				url: '/pages/my/my'
			})
		},
		// 裂变分享信息
		handleShareInfo() {
			this.$apis.distributeShareInfo().then(res =>{
				this.shareUrl = res.data.generate_url;
				this.isLoad = true;
			}).then(() => {
				this.isLoad = true;
			})
		},
		// 复制链接
		handleCopy() {
			uni.setClipboardData({
				data:this.shareUrl,
				success() {
					uni.showToast({
						title: "Link copied! Share it with friends to get the reward.",
						icon: "none",
					})
					console.log('success')
				}
			})
		},
		queryAcountMsg() {
			this.$apis.getAccountMsg().then(res => {
				this.isLoad = true;
				this.personInfo.email = res.data.email
				uni.stopPullDownRefresh()		
			}).catch(() => {
				this.isLoad = true;
			})
		},
		/**
		 * 统一跳转接口,拦截未登录路由
		 */
		navTo(url) {
			if (!this.hasLogin) {
				url = '/pages/login/index';
			}
			if (url) {
				this.$public.handleNavTo(url)
			}

		},
		cardClickHandel(item){
			this.$maEvent.custom_event({
				event_category: 'cashgrab',
				event_action: item.page + '_button',
				event_name: item.title && item.title.toLowerCase(),
				module: 'cashgrab_list'
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.distribute-box {
	::v-deep .page-header-box {
		background: unset;
		box-shadow: unset;
		.icon-goback {
			color: #ffffff;
		}
	}
}
.container {
	height: 100%;
	min-height: 100%;
	margin-bottom: 25px;
	box-sizing: border-box;
	position: relative;
}
.user-section {
	height: 320rpx;
	width: 100%;
	box-sizing: border-box;

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 400rpx;
		filter: blur(1px);
		background: url("~@/static/images/new-cashgrab-rewards/distribute_bg@2x.png");
		background-size: 100% 100%;
		width: 100%;
	}
}

.user-info-box {
	height: 130upx;
	padding: 10rpx 30upx;
	display: flex;
	align-items: center;
	position: relative;
	flex-direction: column;
	z-index: 1;

	.portrait-box {
		width: 104rpx;
		height: 104rpx;
		background-color: #fff;
		/* border:5upx solid #fff; */
		border-radius: 50%;
		text-align: center;
		line-height: 104rpx;
		image {
			width: 100%;
			height: 100%;
		}

		i{			
			color: #ccc;
			&:before {
			content: "\E607";
			font-size: 55.99rpx;
		}
		}
	}

	.nickname {
		padding: 0 10upx;
		margin-top: 16rpx;
		font-size: 30rpx;
	}

	.username {
		font-size:30rpx;
		color: #FDECEF;
		margin-left: 10upx;
	}
	.invite-btn {
		margin-top: 32rpx;
		color: #fff;
		font-size: 30rpx;
		border: 1px solid #fff;
		padding: 8rpx 24rpx;
	}
}

.bottom-wrapper {
	background-color: #fff;
	width: 100%;
}
</style>
