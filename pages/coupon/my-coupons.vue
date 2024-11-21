<template>
    <view class="my-coupons-box dui-padding-top-header">
		<pageHeader :title="$t('my_coupons.header')"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="tabs-box flex justify-content-around">
			<block v-for="(item,index) in tabsArr">
				<view @click="changeTab(item)" class="tab-item" :class="item.type==currentTabObj.type?'on':''">
					{{$t(item.language)}}({{item.num}})
				</view>
			</block>
		</view>
		<!--<exchangeCoupon @submit="getMyCoupons()"></exchangeCoupon>-->
		<block v-for="(tab,tabIndex) in tabsArr">
			<block v-if="tab.type == currentTabObj.type">
				<view class="coupons-list-box" v-if="tab.list && tab.list.length">
					<block v-for="(item,index) in tab.list">
						<couponItem :isOld="true" :couponItemData="{...item,type:currentTabObj.type,fetched:true}"></couponItem>
					</block>
				</view>
				<view v-else class="no-more-goods">
					<image src="/static/images/coupon_empty.png" class="no-order-img"></image>
					<view class="text">{{$t("my_coupons.empty_work")}}</view>
				</view>
			</block>
		</block>
<!--		<view @click="$public.handleNavTo('/pages/coupon/coupon-center')" class="get-more-coupon-box flex justify-content-between align-items-center">
			<view class="left flex align-items-center">
				<view class="iconfont icon-coupon"></view>
				<view class="title">{{$t('my_coupons.get_more_coupon')}}</view>
			</view>
			<view class="right">
				<view class="iconfont icon-goto"></view>
			</view>
		</view>-->
		<div ref="load_more_data_view"></div>
		<view v-show="goods.length && isOver" class="product-side-recommend-main goods-container">
			<view class="u-text-header">
				{{ $t('vip_level.recommend_for_you') }}
			</view>
		    <!-- 推荐页商品列表 -->
		    <good-list module_name="coupon_rfy" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="goods"></good-list>
		</view>
    </view>
</template>

<script>
import pageHeader from "@/components/pageHeader/pageHeader.vue"
import exchangeCoupon from "@/components/exchangeCoupon/exchangeCoupon.vue"
import couponItem from '@/components/couponItem/couponItem.vue'
export default {
    components: {
        pageHeader,
		exchangeCoupon,
		couponItem
    },
    data() {
        return {
			tabsArr:[
				{
					name: "Available",
					type: 1,
					param:'',
					language: "my_coupons.available",
					num: 0,
					list:[]
				},
				{
					name: "Used",
					type: 2,
					param: 'used',
					language: "my_coupons.used",
					num: 0,
					list:[]
				},
				{
					name: "Expired",
					type: 3,
					param: 'overtime',
					language: "my_coupons.expired",
					num: 0,
					list:[]
				}
			],
			currentTabObj: {type:1,param:''},
			showBacktopBtn: false,
			isLoad: false,
			goods: [],
			p: 0,
			isOver: false
        };
    },
	onLoad(){
		this.getMyCoupons();
		this.recommendProduct();
	},
	onShow () {
		// if(this.$store.getters.hasLogin && this.isLoad){
		// 	this.getMyCoupons();
		// }
		this.$maEvent.visit_event({
			event_category: 'coupons',
			event_action: 'coupons_visit',
			event_name: 'coupons_visit'
		})
	},
	onPageScroll: function (t) {
        if (t.scrollTop >= 180) {
            this.showBacktopBtn = true
        } else {
            this.showBacktopBtn = false
        }
		this.$debounce(() => {
			this.startObserver();
		}, 300)
    },
	// 滚动到底部
	onReachBottom(){
		if(!this.isOver) {
			this.getMyCoupons();
		}
	},
    methods: {
		startObserver(){
			this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
		},
		changeTab(item) {
			this.currentTabObj = item;
			this.p = 0;
			this.isOver = false;
			this.getMyCoupons();
		},
        getMyCoupons() {
			this.isLoad = true;
			this.p += 1;
            this.$apis.getMyCouponList({type:this.currentTabObj.param,p: this.p}).then(res => {
				this.tabsArr[0].num = res.data.coupon_available_count;
				this.tabsArr[1].num = res.data.coupon_used_count;
				this.tabsArr[2].num = res.data.coupon_unavailable_count;
				const list = res.data.coupons || [];
				if(list.length) {
					this.tabsArr.map(item => {
						if(item.param == this.currentTabObj.param) {
							if(this.p == 1) {
								item.list = list;
							} else {
								item.list = item.list.concat(list);
							}
						}
					})
				}
				if(this.p == res.data.totalPage || res.data.totalPage == 0) {
					this.isOver = true;
				}
				uni.hideLoading()
			}).catch(() => {
				this.isLoad = true;
			})
        },
		// 获取推荐列表
		recommendProduct() {
			const params = {
				type: 'coupon_rec'
			}
			this.$apis.recommendProduct(params).then(res => {
				this.goods = res.data.products || [];
				this.loading = false;
				this.startObserver();
			}).catch(() => {
				this.loading = false;
			})
		},
    }
};
</script>
<style scoped>
.my-coupons-box {
	padding-bottom: 24rpx;
}
.my-coupons-box .tabs-box {
	padding: 24rpx 0;
	box-shadow: 0 1PX 4rpx rgb(0 0 0 / 8%);
	font-size: 28rpx;
	color: #333333b3;
}
.my-coupons-box .tabs-box .tab-item.on {
	color: #f85184;
}
.my-coupons-box .coupons-list-box {
	padding: 0 24rpx;
}
.my-coupons-box .no-more-goods {
	margin-top: 0;
	margin-bottom: 96rpx;
}
.my-coupons-box .get-more-coupon-box {
	margin: 0 24rpx;
	box-shadow: 0 1PX 6rpx rgb(0 0 0 / 8%);
	padding: 24rpx;
	margin-bottom: 24rpx;
}
.my-coupons-box .get-more-coupon-box .left .icon-coupon {
	font-size: 36rpx;
	color: #f85184;
	margin-right: 24rpx;
}
.my-coupons-box .get-more-coupon-box .left .icon-coupon:before {
	content: "\E61D";
}
.my-coupons-box .get-more-coupon-box .left .title {
	color: #333333;
	font-size: 28rpx;
}
.product-side-recommend-main {
	border-top: 1px solid #e2e2e2;
	margin-top:  20rpx;
}
</style>
