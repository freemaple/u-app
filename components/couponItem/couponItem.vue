<template>
	<!-- 优惠券 -->
	<view @click="!opacity && couponItemData.showGray != 'true' && couponSelect?$emit('handleSelect',couponItemData):''" :class="['coupon-item flex flex-column', couponClassType, getClass()]">
	    <view class="head" :style="opacity?'opacity:'+opacity:''">
	        <view class="head-left">
				<view class="coupon-item-header-box flex justify-content-between">
					<view class="coupon-item-title flex-1">
						<view class="coupon-item-title-percent-sign" v-if="couponClassType == 'index-coupon-item'">
							<view class="coupon-title-left">
								{{couponItemData.discount_cost ? filterCost(couponItemData.discount_cost) : getCouponItemName(couponItemData.discount_cost, 0)}}
							</view>
							<view class="coupon-title-right" v-if="couponItemData.coupon_discount_type == 1">
								<view class="percent-sign">%</view>
								<view class="coupon-title-off">{{$t('coupon_list.OFF')}}</view>
							</view>
						</view>
						<view class="" v-else>
							{{couponItemData.name}}
						</view>
					</view>
					<view v-if="couponSelect" class="coupon-select" :style="opacity?'display:none':''">
						<block v-if="couponItemData.showGray != 'true'">
							<image v-if="couponItemData.id == couponItemData.selectId" class="radio" src="@/static/images/checkout_icon/radio_checked@2x.png" mode="widthFix"></image>
							<image v-else class="radio" src="@/static/images/checkout_icon/radio@2x.png" mode="widthFix"></image>
						</block>
					</view>
					<block v-else>
						<view v-if="!hideHeadRightBtn" class="head-right">
							<block v-if="couponItemData.type">
								<!-- type: 1可使用 2已使用 3已过期 【个人中心】-->
								<block v-if="couponItemData.type == 1">
									<view v-if="judgeDiffDays(couponItemData)">{{$t('coupon_list.Expires Soon')}}</view>
								</block>
								<view v-else-if="couponItemData.type == 2" class="gray-btn">{{$t('coupon_list.Used')}}</view>
								<view v-else class="gray-btn">{{$t('coupon_list.Expired')}}</view>
							</block>
							<block v-else>
								<view v-if="couponItemData.fetched" :class="position== 'product'?$t('coupon_list.Got'):''" class="use-it-btn cursor-pointer white-bg-btn">{{position== 'product'?$t('coupon_list.Got'):$t('coupon_list.Use it')}}</view>
								<view v-else @click="handleGetCoupon(couponItemData)" class="get-it-btn cursor-pointer fetch_coupon red-bg-btn">{{$t('coupon_list.Get it')}}</view>
							</block>
						</view>
					</block>
				</view>
				<!-- 首页新版弹窗样式不需要展示remark -->
	            <view class="coupon-remark" v-if="couponItemData.remark && couponClassType != 'index-coupon-item'">
	                {{couponItemData.remark}}
	            </view>
				<!-- code码，首页不展示在这，所以加了一个判断 -->
	            <view class="coupon-code" v-if="hasLogin && couponClassType != 'index-coupon-item'">
	                {{$t('coupon_list.code')}}: {{couponItemData.code}}
	            </view>
				<view class="show-discount-cost" v-if="showDiscountCost" v-html="$t('coupon_list.expect_to_save_money',{money:couponItemData.symbol+couponItemData.discount_cost})">
				</view>
	        </view>
	    </view>
	    <view class="coupon-new-middle flex align-items-center">
	        <view class="middle-edge" v-if="showCircleEdge">
	            <view class="edge-circle"></view>
	        </view>
	        <view :style="opacity?'opacity:'+opacity:''" class="middle-center flex align-items-center">
	            <view></view>
	        </view>
	        <view class="middle-edge" v-if="showCircleEdge">
	            <view class="edge-circle"></view>
	        </view>
	    </view>    
	    <view :style="opacity?'opacity:'+opacity:''" class="body">
			<!-- <view class="body-item flex align-items-center" v-if="couponItemData.minimum_charge && couponItemData.max_discount_cost">
				{{$t('coupon_list.minimum_charge',{num:couponItemData.symbol+couponItemData.minimum_charge})}}, {{$t('coupon_list.max_discount_cost',{num:couponItemData.symbol+couponItemData.max_discount_cost})}}
			</view>
			<block v-else>
				<view class="body-item flex align-items-center"  v-if="couponItemData.minimum_charge">
					{{$t('coupon_list.minimum_charge',{num:couponItemData.symbol+couponItemData.minimum_charge})}}
				</view>
				<view class="body-item flex align-items-center" v-if="couponItemData.max_discount_cost">{{$t('coupon_list.max_discount_cost_upper',{num:couponItemData.symbol+couponItemData.max_discount_cost})}}</view>
			</block> -->
			<!-- code码，首页要求展示在这 -->
			<view class="body-item coupon-code" v-if="hasLogin && couponClassType == 'index-coupon-item'">
				{{$t('coupon_list.code')}}: {{couponItemData.code}}
			</view>
			<view class="body-item flex align-items-center" v-if="(couponItemData.allData && couponItemData.allData.maxmin_text) || couponItemData.maxmin_text">
				{{couponItemData.maxmin_text ? couponItemData.maxmin_text : couponItemData.allData.maxmin_text}}
			</view>
			<view class="body-item">{{couponItemData['start_date']}} {{$t('coupon_list.valid_to')}} {{couponItemData['end_date']}}</view>
			<!-- discount_type:【1:产品折扣】【2：订单折扣】【3：买X得Y】【4：免运费】 -->
	        <!-- 产品折扣 -->
			<block v-if="couponItemData.discount_type == 1">
				<!-- 适用所有产品 -->
				<view class="body-item" v-if="couponItemData.condition_product_type == 'all'">
					{{$store.state.appConfig.coupon_apply_tag || $t('coupon_list.applies_to_discount_products')}}
				</view>
				<!-- 适用指定sku -->
				<view v-else class="body-item text-overflow-ellipsis" @click="$public.handleNavTo('/pages/search/search?couponProduct='+encodeURIComponent(JSON.stringify(couponItemData.extenddata.xlink||{})))">
					<text class="space-after">{{$t('coupon_list.Applies to Products')}}:</text>
					<block v-if="couponItemData.extenddata && couponItemData.extenddata.items && couponItemData.extenddata.items.length">
						<text class="text-underline" v-for="(item,index) in couponItemData.extenddata.items" :key="index">
							{{couponItemData.condition_product_type == 'sku'?item.sku:item.name}}
							<block v-if="index<couponItemData.extenddata.items.length">,</block>
						</text>
					</block>
				</view>
			</block>
			<!-- 买X得Y -->
			<block v-else-if="couponItemData.discount_type == 3">
				<view class="body-item">
					<text>{{$t('coupon_list.Applies to Products')}}: Buy</text>
					<text @click="$public.handleNavTo('/pages/search/search?couponProduct='+encodeURIComponent(JSON.stringify(couponItemData.extenddata.xlink || {})))" class="x-text text-underline">X</text>
					<text>{{$t('coupon_list.Get')}}</text>
					<text @click="$public.handleNavTo('/pages/search/search?couponProduct='+encodeURIComponent(JSON.stringify(couponItemData.extenddata.ylink|| {})))" class="y-text text-underline">Y</text>
				</view>
			</block>
			<!-- 订单折扣、免运费 -->
			<view class="body-item" v-else>
				{{$store.state.appConfig.coupon_apply_tag || $t('coupon_list.applies_to_discount_products')}}
			</view>
	    </view>
		<!-- 优惠券不可用原因 -->
		<view class="unavailable-reason-box" v-if="couponItemData.unavailable_reason">
			<image class="icon" mode="widthFix" src="@/static/images/checkout_icon/error-icon@2x.png"></image>
			<view class="reason-label">{{couponItemData.unavailable_reason}}</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import uitls from '@/common/utils.js'
	export default {
		name:"couponItem",
		props: {
			couponItemData: {
				type: Object,
				default() {
					return {}
				}
			},
			isOld:{
				type:Boolean,
				default:true
			},
			showCircleEdge: {
				type: Boolean,
				default:false
			},
			hideHeadRightBtn: {
				type: Boolean,
				default: false
			},
			// 定义优惠券样式,不传就是默认值，目前枚举: index-coupon-item 首页的coupon弹窗 
			couponClassType: {
				type: String,
				default: ''
			},
			position: '',
			couponSelect: false,
			showDiscountCost:false, // 是否展示节约多少钱
			opacity:''
		},
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters(['hasLogin'])
		},
		methods: {
			getClass() {
				var class1 = '';
				var class2 = '';
				if((this.couponItemData.type == 1 || !this.couponItemData.type) && this.couponItemData.showGray != 'true') {
					class1 = ''
				} else {
					class1 = 'gray-coupon'
				}
				if(this.isOld) {
					class2 = 'isOld';
				}
				return class1+' '+class2
			},
			judgeDiffDays(data) {
				let differ = uitls.timeDiffer(data.assign_end_at * 1000)
				return differ.day <=7 && differ.day > 0;
			},
			handleGetCoupon(data) {
				this.$apis.getCoupon({coupon_id:data.id}).then(res => {
					this.$emit('change')
				}).catch(e => {
					uni.hideLoading()
				})
			},
			// 从优惠券名字里面截取对应要的值，有两种: 百分比 / 固定金额 ,目前有百分号就是百分比,没有就是折扣
			getCouponItemName(name, ind) {
				// name形如: 30% OFF
				const type = name.indexOf('%') == -1; // true 固定金额 ;false 折扣
				const nameList = name.split(' ');
				switch (ind){
					case 0:
						return nameList[0].split('%')[0];
					case 1:
						return nameList[1];
				}
			},
			// 折扣小数点处理
			filterCost(cost) {
				let str = String(cost).split('.');
				let costStr = '';
				if(str[1] && str[1] == '00') {
					costStr = str[0];
				} else {
					costStr = cost;
				}
				return costStr;
			}
		}
	}
</script>

<style lang="scss" scoped>
.mininum-discount::first-letter {
    text-transform: uppercase;
}
/* 优惠券样式 */
.unavailable-reason-box {
	display: flex;
	padding: 12rpx 24rpx;
	background: #FFF0F0;
	color: #FF0000;
	font-size: 28rpx;
	line-height: 34rpx;
	.icon {
		width: 36rpx;
		margin-right: 8rpx;
	}
	.reason-label {
		flex: 1;
	}
}
.coupon-item {
    width: 100%;
    min-height: 240rpx;
    background-color: #FCF2F4;
    background-repeat: no-repeat;
    background-position: right center; 
    margin-bottom: 20rpx;
    position: relative;
	font-size: 30rpx;
	overflow: hidden;
}
.coupon-item.isOld {
	.body {
		padding: 20rpx 32rpx 20rpx 32rpx;
		border: 0;
	}
	.head {
		padding: 32rpx 32rpx 20rpx 32rpx;
		border: 0;
	}
}
.coupon-item .head-right {
	margin-left: 8rpx;
}
.coupon-item.gray-coupon {
    opacity: 0.5;
}
.coupon-item:after {
    content: "";
    position: absolute;
    left: -2rpx;
    right: -2rpx;
    top: 0;
    display: block;
    background-color: #FF004D;
    height: 8rpx;
}
.gray-coupon.coupon-item:after {
    background-color: #6b6b6b;
}
.gray-coupon.coupon-item .gray-btn {
    padding: 0 18rpx;
    background: #666666;
    color: #cccccc;
    line-height: 1.5;
}
.coupon-item .red-bg-btn {
    padding: 0 18rpx;
    background: #FF004D;
    color: #ffffff;
    line-height: 1.5;
}
.coupon-item .white-bg-btn {
    padding: 0 18rpx;
    background: #ffffff ;
    cursor: auto;
    color: #FF004D;
    line-height: 1.5;
}
.coupon-item  .use-it-btn.Available {
    background: unset;
    cursor: unset;
    pointer-events: none;
}
.coupon-item .head {
    padding: 32rpx 44rpx 20rpx 68rpx;
    color: #FF004D;
	border: 1px solid #FFD9E4;
	border-top: 0;
	border-bottom: 0;
}
.gray-coupon.coupon-item .head {
    color: #6b6b6b;
}
.coupon-item .head .head-left .coupon-item-title {
    font-size: 40rpx;
    font-weight: bold;
    line-height: 1.2;
    letter-spacing: 4rpx;
	margin-bottom: 20rpx;
}
.coupon-item .head .head-left .coupon-remark {
	padding-right: 24rpx;
	color: #333333;
	font-size: 28rpx;
	// margin-bottom: 12rpx;
}
.coupon-item .head .head-left .coupon-code {
	padding-right: 24rpx;
	color: #333333;
	font-size: 28rpx;
}
.coupon-item .head .head-left .show-discount-cost {
	color: #333333;
	font-size: 28rpx;
	padding-right: 24rpx;
	margin-top: 12rpx;
}
.coupon-item .body {
    padding: 20rpx 68rpx 20rpx 68rpx;    
    font-size: 24rpx;
    color: #666666;
	box-sizing: border-box;
	line-height: 28rpx;
	width: 100%;
	border: 1px solid #FFD9E4;
	border-top: 0;
}
.coupon-item .body .body-item {
	margin-bottom: 6rpx;
}
.coupon-item .body .body-item:last-child {
	margin-bottom: 0;
}
.coupon-item .body .body-item {
    position: relative;
    padding-left: 20rpx;
}
.coupon-item .body .body-item:before {
    content: "";
    position: absolute;
    display: block;
    background-color: #666666;
    left: 0;
    border-radius: 50%;
    height: 12rpx;
    width: 12rpx;
    top: 38%;
    transform: scale(.5) translateY(-50%);
}
.coupon-item .coupon-new-middle .middle-edge {
    height: 32rpx;
    width: 16rpx;
    position: relative;
}
.coupon-item .coupon-new-middle .middle-edge .edge-circle {
    position: absolute;
    right: 0;
    width: 32rpx;
    bottom: 0px;
    top: 0px;
    background: #fff;
    border-radius: 50%;
	border: 1px solid #FFD9E4;
}
.coupon-item.isOld .coupon-new-middle .middle-edge .edge-circle{
	border: 0;
}
.coupon-item .coupon-new-middle .middle-edge:last-child .edge-circle {
    left: 0px;
}
.coupon-item .coupon-new-middle .middle-center {
    // height: 32rpx;
    flex: 1;
}
.coupon-item .coupon-new-middle .middle-center view {
    width: 100%;
    height: 1px;
    background-size: 48rpx 1px;
    background-repeat: repeat-x;
    background-image: linear-gradient(90deg,#FFD9E4 0,#FFD9E4 50%,transparent 0);
}
.x-text {
	padding: 0 8rpx;
}
.y-text {
	padding-left: 8rpx;
}
.coupon-select {
	margin-left: 8rpx;
	.radio {
		width: 48rpx;
	}
}
.space-after::after {
  content: "\00a0"; /* 使用Unicode编码的空格字符 */
}
// 首页弹窗样式
.coupon-item.index-coupon-item {
	flex-direction: row;
}
.coupon-item.index-coupon-item .head{
	width: 170rpx;
	padding: 0 0 0 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.coupon-item.index-coupon-item .coupon-new-middle {
    width: 32rpx;
	flex-direction: column;
	justify-content: space-between;
}
.coupon-item.index-coupon-item .coupon-new-middle .middle-center {
    flex: none;
	position: relative;
	width: 1px;
	height: calc(100% - 64rpx);
}
.coupon-item.index-coupon-item .coupon-new-middle .middle-center view {
	width: 1px;
	background-size: 1px 48rpx;
	background-repeat: repeat-y;
	background-image: linear-gradient(0deg, #FFD9E4 0, #FFD9E4 50%, transparent 0);
	position: absolute;
	left: 50%;
	height: calc(100% + 64rpx);
}
.coupon-item.index-coupon-item .body {
	width: calc(100% - 170rpx - 32rpx);
	padding: 22rpx 6rpx 14rpx 6rpx;
}
.coupon-item.index-coupon-item .body .body-item {
	margin-bottom: 8rpx;
	line-height: 32rpx;
	font-size: 20rpx;
}
.coupon-item.index-coupon-item .coupon-remark {
	display: none;
}
.coupon-item.index-coupon-item::after {
	left: 0;
	right: auto;
	bottom: 0;
	width: 8rpx;
	height: auto;
}
.coupon-item.index-coupon-item .coupon-new-middle .middle-edge{
	width: 32rpx;
	height: 32rpx;
}
.coupon-item.index-coupon-item .coupon-new-middle .middle-edge .edge-circle {
	width: 32rpx;
	height: 32rpx;
	top: -16rpx;
	bottom: auto;
	right: auto;
	left: 0;
}
.coupon-item.index-coupon-item .coupon-new-middle .middle-edge:last-child .edge-circle {
	left: 0;
	right: auto;
	bottom: -16rpx;
	top: auto;
}
.coupon-item.index-coupon-item .coupon-code {
	color: #FF004D;
	line-height: 32rpx;
}
.coupon-item.index-coupon-item {
	min-height: auto;
}
.index-coupon-item .coupon-item-title-percent-sign {
	display: flex;
	align-items: flex-end;
}
.index-coupon-item .percent-sign {
	font-size: 20rpx;
}
.index-coupon-item .coupon-title-off {
	font-size: 28rpx
}
.index-coupon-item .coupon-title-left {
	font-size: 56rpx
}
.index-coupon-item .body-item:last-child {
	color: #AD6D81;
	font-size: 16rpx !important;
}
.index-coupon-item .body-item:last-child::before {
	display: none;
}
</style>