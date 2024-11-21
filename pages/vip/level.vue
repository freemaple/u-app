<template>
	<view class="dressin-vip-page-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :title="$t('vip.title_vip', {site_name: $store.state.site_name_upper})">
			<template v-slot:extend><text class="iconfont icon-question" @click="$public.handleNavTo('/pages/cms/article/article?url_key=' + vip_url_key)"></text></template>
		</pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="vip-page-content">
			<view class="vip-guide-box">
				<view class="vip-account-box" v-if="customer_vip_info">
					<view class="flex">
					    <view class="icon-box">
						  <image width="40" mode="widthFix"  src="/static/images/vip.png" />
					    </view>
					    <view class="vip-account-info">
						  <view>{{ customer_vip_info.email }}</view>
						  <view class="current-vip-block" v-if="customer_vip_info.name"><text class="current-vip-box">{{ customer_vip_info.name }}</text></view>
					    </view>
					</view>
					<view class="vip-step-list">
						<view v-for="(c_item, index) in customer_vip_config" class="vip-step-item" :class="index == 0 &&  'current'">
						  <text class="vip-tag">{{ c_item.name }}</text>
						</view>
					</view>
					<view v-if="customer_vip_info.next_level" class="next-level-box">
						{{ $t('vip_level.spend_reach_more', [customer_vip_info.currency + customer_vip_info.next_amount, customer_vip_info.next_level_name]) }}
					</view>
				</view>
			</view>
			<view class="upgrade-guide-box" v-if="customer_vip_config && customer_vip_config.length">
				<view class="upgrade-guide-header font-bold">
					{{ $t('vip_level.upgrade_guide') }}
				</view>
				<view class="upgrade-guide-list">
					<view v-show="ckey<=4" v-for="(c_item, ckey) in customer_vip_config" class="upgrade-guide-item">
						{{ $t('vip_level.spend_reach', [customer_vip_info.currency + c_item.amount_format, c_item.name]) }}
					</view>
				</view>
				<view v-if="customer_vip_config.length > 5" class="view-all-box">
					<text class="view-all-link view-all-upgrade" @tap="handelShowGuide">{{ $t('vip_level.view_all_guide') }}</text>
				</view>
			</view>
			<view class="vip-redemption-box" v-if="customer_vip_config && customer_vip_config.length">
				<div class="font-bold">
					{{ $t('vip_level.point_redemption_ratio') }}
				</div>
				<view class="point-ratio-list">
					<view v-for="(c_item, ckey) in customer_vip_config" class="point-ratio-list-item" :class="ckey == 0 && 'current'" v-show="ckey<=5 || showAllRatio">
						<text class="vip-tag">{{ c_item.name }}</text>
						{{ c_item.rate }} {{ $t('vip_level.points') }} = {{ customer_vip_info.currency }}{{ customer_vip_info.rate_amount }}
					</view>
				</view>
				<view v-if="customer_vip_config.length > 6 && !showAllRatio" class="view-all-box" @tap="handShowAllRatio">
					<text class="view-all-link view-all-ratio">{{ $t('vip_level.view_all_guide') }}<i class="iconfont icon-arrow-b"></i></text>
				</view>
			</view>
		</view>
		<view v-if="goods.length" class="product-side-recommend-main goods-container">
			<view class="u-text-header">
				{{ $t('vip_level.recommend_for_you') }}
			</view>
		    <!-- 推荐页商品列表 -->
		    <good-list module_name="vip_rfy" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="goods"></good-list>
		</view>
		<!-- 裂变提示 -->
		<uni-popup class="popupRecheckinTip" ref="popupRecheckinTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content page-max-width">
				<view class="tip-box">
					<view class="tip-title">
						<view class="upgrade-guide-header font-bold">
							{{ $t('vip_level.upgrade_guide') }}
						</view>
					</view>
					<view class="content">
						<view class="upgrade-guide-list">
							<view v-for="(c_item, ckey) in customer_vip_config" class="upgrade-guide-item">
								{{ $t('vip_level.spend_reach', [customer_vip_info.currency + c_item.amount_format, c_item.name]) }}
							</view>
						</view>
					</view>
					<view class="close-btn" @click="$refs.popupRecheckinTip.close()">
						<block>{{$t('vip_level.confirm')}}</block>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageMetaShow:false,
				loading: true, // 接口请求loading
				showBacktopBtn: false,
				customer_vip_info: null,
				customer_vip_config: [],
				vip_url_key: null,
				showAllRatio: false,
				goods: []
			}
		},
		onLoad() {
			var that = this;
			this.getVipLevelInfo();
			this.recommendProduct()
		},
		onPageScroll(t) {
			this.$debounce(() => {
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'di_vip',
				event_action: 'di_vip_visit',
				event_name: 'di_vip_visit'
			})
		},
		methods: {
			// vip等级信息
			getVipLevelInfo() {
				uni.showLoading();
				this.$apis.getVipLevelInfo().then(res => {
					uni.hideLoading();
					if(res.data){
						let type = res.data.customer_vip_info.type;
						this.customer_vip_config = res.data.config[type] || [];
						this.customer_vip_info = res.data.customer_vip_info;
						this.vip_url_key = res.data.vip_url_key;
					}
				}).catch(() => {
					uni.hideLoading();
				})
			},
			handShowAllRatio(){
				this.showAllRatio = true;
			},
			handelShowGuide(){
				this.$refs.popupRecheckinTip.open('center');
			},
			// 获取推荐列表
			recommendProduct() {
				const params = {
					type: 'personal_vip_rec'
				}
				this.$apis.recommendProduct(params).then(res => {
					this.goods = res.data.products || [];
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-header-box {
		.icon-question {
			position: absolute;
			right: 24rpx;
			font-weight: normal;
			font-size: 40rpx;
		}
	}
	.vip-guide-box {
	    font-size: 24rpx;
	}
	.vip-account-box {
	    width: 100%;
	    padding-left: 40rpx;
	    border: 1px solid #e2e2e2;
	    margin-top: 20rpx;
	    padding: 40rpx;
	}
	.vip-account-info {
	    flex: 1;
	}
	.vip-account-box .icon-box {
	    margin-right: 53rpx;
	}
	.vip-account-box .icon-box image {
	    width: 80rpx;
		height: auto;
	}
	.current-vip-block {
	    margin-top: 10rpx;
	}
	.current-vip-box {
	    border-radius: 5px;
	    background-color: #797979;
	    color: #fff;
	    padding: 0px 15px;
	}
	.vip-step-list {
	    display: flex;
	    flex-wrap: wrap;
	    max-width: 70%;
	}
	.vip-step-item  {
	    width: 20%;
	    position: relative;
	    display: flex;
	    align-items: center;
	    margin-top: 10px;
		.vip-tag {
		    border-radius: 50%;
		    background: #aaaaaa;
		    color: #fff;
		    text-align: center;
		    padding: 8px 5px;
		    z-index: 1;
		    font-size: 24rpx;
		}
		&.current {
			.vip-tag {
			    background: #797979;
			}
		}
	}
	.vip-step-item:after {
	    content: '';
	    height: 1px;
	    width: 100%;
	    background: #bcbcbc;
	    position: absolute;
	    left: 0px;
	 }
	 .vip-step-item:last-child:after{
	    display: none;
	 }
	 .vip-step-item:nth-child(5):after{
	    display: none;
	 }
	 .next-level-box {
	    margin-top: 20rpx;
	 }
	 .upgrade-guide-box {
	    border: 1px solid #e2e2e2;
	    margin-top: 20rpx;
	    padding: 40rpx;
	 }
	 .upgrade-guide-list {
	    margin-top: 20rpx;
	 }
	 .upgrade-guide-item {
	    margin-top: 20rpx;
	    color: #777;
	    font-size: 24rpx;
	 }
	 .upgrade-guide-item:before {
	    content: '';
	    height: 16px;
	    width: 16px;
	    border-radius: 50%;
	    background: #aaa;
	    margin-right: 10px;
	    display: inline-block;
	    vertical-align: middle;
	}  
	.view-all-box {
	    margin-top: 10rpx;
		text-align: center;
	}
	.view-all-link {
	    cursor: pointer;
	    color: #000080;
	    font-size: 24rpx;
	}
	.vip-redemption-box {
	    border: 1px solid #e2e2e2;
	    padding: 10px 20px;
	    margin-top:  20px;
	    padding: 40rpx;
	}
	.point-ratio-list {
	    display: flex;
	    flex-wrap: wrap;
	}
	.point-ratio-list-item  {
	    width: 31.33%;
	    position: relative;
	    padding: 60rpx 10rpx;
	    border: 1px solid #444;
	    margin-right: 2%;
	    margin-top: 15rpx;
	    font-size: 24rpx;
		text-align: center;
		.vip-tag  {
		    position: absolute;
		    background-color: #aaaaaa;
		    color: #fff;
		    padding: 0px 10px;
		    top: 0px;
		    left: 0px;
		}
		&.current .vip-tag  {
		    background: #797979;
		}
	}
	.view-all-ratio .iconfont {
	    font-size: 24rpx;
	    color: #000080;
	}
	.product-side-recommend-main {
	    width: 100%;
	    border: 1px solid #e2e2e2;
	    margin-top:  20rpx;
	    padding: 20rpx 20rpx;
	} 
	.popupRecheckinTip {
		.popup-content {
			width: calc(750rpx - 40rpx);
		}
		.tip-title {
			padding: 30rpx 10rpx 10rpx 10rpx;
			text-align: center;
		}
		.content {
			padding: 0rpx 40rpx;
		}
		.close-btn {
			background: #000;
			color:#fff;
			width: 100%;
			padding: 16rpx 32rpx;
			cursor: pointer;
			margin: auto;
			margin-top: 30rpx;
			text-align: center;
		}
	}
</style>
