<template>
    <view>
        <pageHeader :title="$t('order.order_details')">
        	<template v-slot:extend>
				<!-- #ifdef APP-PLUS -->
				<view class="right-box"><i @tap="handleCeckWebView" class="iconfont2 iconfont3 icon-customerservice" style="color:#333;"></i></view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="right-box"><i  @tap="handleDialog" class="iconfont2 iconfont3 icon-customerservice" style="color:#333;"></i></view>
				<!-- #endif -->
        	</template>
        </pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>

		<view class="container">
            <view class="sec-wrap">
                <view class="order-status">
                    <view class="iconfont icon-time"></view>
					<view class="text">
						{{ orderDetail.order_status_txt }}
					</view>
                </view>
                <block>
					<view class="wuliu-box">
						<view class="item-list">
							<view class="item-box">
								<text class="text">{{ $t('order.order_no') }}:</text> <text class="value">{{ orderDetail.increment_id }}</text><view v-if="orderDetail.increment_id" class="copy_btn" @tap="()=>{$copyId(orderDetail.increment_id)}">{{ $t('order.copy') }}</view>
							</view>
							<view class="item-box">
								<text class="text">{{ $t('order.datetime') }}:</text> <text class="value">{{ orderDetail.created_at }}</text>
							</view>
							<view class="item-box" v-if="orderDetail.shipping_method_txt">
								<text class="text">{{ $t('order.shipping_method') }}: </text> <text class="value">{{ orderDetail.shipping_method_txt }}</text>
							</view>
							<view class="item-box" v-if="orderDetail.payment_method_text">
								<text class="text">{{ $t('order.payment_method') }}: </text> <text class="value">{{ orderDetail.payment_method_text }}</text>
							</view>
							<!--<view class="logistics-timeliness" v-if="ageing_info['ageing']">
								{{$t("pay_order.arrives_between")}}
								<text class="ageing">{{ageing_info['ageing']}};</text>
								<text class="ageing_title">{{ageing_info['ageing_title']}}</text>
								<i @click="$refs.popupAgeing.open('bottom')" class="iconfont icon-question"></i>
							</view>-->
							<view class="item-box" v-if="orderDetail.auto_cancel_order_remain_time > 0">
								<text class="text">{{ $t('order.remaining_time') }}:</text> 
								<text class="value">
									<text class="countdown-box" v-if="orderDetail.auto_cancel_order_remain_time > 0">
										<text class="tx"></text>
										<uni-countdown
										class="countdown"
										v-if="orderDetail.auto_cancel_order_remain_time > 0"
										@is-down="isPayDown(orderDetail)"
										:showColon="true"
										:show-day="true"
										:leftTime="orderDetail.auto_cancel_order_remain_time"></uni-countdown>
									</text>
								</text>
							</view>
							
						</view>
					</view>
                    <view class="address-box">
						<view class="little-title border-bottom-1px flex align-items-center">{{ $t('pay_order.shipping_address') }}<i @tap="()=>{showNoeditAddressModal=true}" class="iconfont noedit_tip"></i></view>
                        <view class="address-sec">
							<view class="icon-box">
                            <image class="icon" src="/static/images/order-details/icon-address.png"></image>
                        </view>
                        <view class="right-box">
                            <view class="name-tel">{{ orderDetail.customer_firstname }} {{ orderDetail.customer_lastname }} {{ orderDetail.customer_telephone }}</view>
                            <view class="text">
                                <text v-if="orderDetail.customer_address_street1">{{ orderDetail.customer_address_street1 }},{{'&nbsp;'}}</text>
								<text v-if="orderDetail.customer_address_street2">{{ orderDetail.customer_address_street2 }},{{'&nbsp;'}}</text>
								<text v-if="orderDetail.customer_address_city">{{ orderDetail.customer_address_city }},{{'&nbsp;'}}</text>
								<text v-if="orderDetail.customer_address_state_name">{{ orderDetail.customer_address_state_name }},{{'&nbsp;'}}</text> 
								<text v-if="orderDetail.customer_address_country_name">{{ orderDetail.customer_address_country_name }},{{'&nbsp;'}}</text> 
								<text v-if="orderDetail.customer_address_zip">{{ orderDetail.customer_address_zip }}</text>
                            </view>
                        </view>
						</view>
                    </view>
                </block>
            </view>
			<view class="payment-methods-box" v-if="payments.length">
				<view class="little-title border-bottom-1px">{{$t("pay_order.payment_methods")}}</view>
				<view>
					<view @tap="changePay(pay)" class="pay-box flex"
						v-for="(pay,index) in payments" :key="index">
						<view class="iconfont"
							:class="orderDetail.payment_method == pay.key?'icon-radio-checked':'icon-radio-check'"></view>
						<view class="flex-1">
							<view class="flex align-items-center">
								<image style="height: 60rpx;margin-right:16rpx" v-if="pay.imageUrl" mode="heightFix"
									:src="pay.imageUrl"></image>
								<view class="pay-label flex align-items-center">
									<view>{{pay.label}}</view>
									<image @click.stop="$refs.popupTip.open();tipContent = pay.label_description;" mode="widthFix" class="question-icon" v-if="pay.label_description" src="@/static/images/checkout_icon/question@2x.png"></image>
									
								</view>
							</view>
							<view class="support-images" v-if="pay.supportImageUrl && pay.supportImageUrl.length">
								<image v-for="(s_i,index) in pay.supportImageUrl" :src="s_i" mode="heightFix" :key="index"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
            <view class="goods-list" v-if="orderDetail.products">
                <view class="list-title">{{ $t('order.product_list') }}</view>
                <form :report-submit="true">
                    <block v-for="(item, index) in orderDetail.products" :key="index">
						<view class="single_status_wrapper flex justify-content-between align-items-center">
							<view class="single_status_name flex align-items-center">{{ item.order_status }}</view>
							<view @tap="toReturnRecord(orderDetail)" v-if="item.sale_no" class="status_to_records flex align-items-center">{{ $t('order.return_refund_records') }}<i class="iconfont"></i></view>
						</view>
						<view @click="productClick(ite, ind)" class="single_status_goods" v-for="(ite, ind) in item.products" :key="ind" :id="`orderProductItems-${ite.product_id}`">
							<navigator open-type="navigate" :url="'/pages/goods-detail/index?id='  + ite.product_id + (module_name ? '&module=' + module_name : '')">
								<view class="a-goods">
									<view class="img-box position-relative fff">
										<image :src="ite.imgUrl" class="img" />
										<view v-if="ite.member_product != 1 &&ite.line_price" class="special-price-discount_off">-{{ite.discount_off}}%</view>
									</view>
									<view class="text-box">
										<view class="arow arow01">
											<view class="goods-name">{{ ite.name }}</view>
											<view class="goods-price">
												<view v-if="ite.member_product == 1" class="vip-member-price-box text-align-right">
													<view class="flex align-items-center">
														<!-- <image class="vip-icon" mode="widthFix" src="@/static/images/vip/vip_icon.png"></image> -->
														<text class="vip-member-price font-bold">{{orderDetail.currency_symbol}}{{ite.price}}</text>
													</view>
													<view v-if="ite.line_price" class="text-line-through-and-gray">{{orderDetail.currency_symbol}}{{ite.line_price}}</view>
												</view>
												<block v-else>
													<view>{{ orderDetail.currency_symbol }}{{ ite.price }}</view>
													<view v-if="ite.line_price" class="text-line-through-and-gray">{{ orderDetail.currency_symbol }}{{ ite.line_price }}</view>
												</block>
											</view>
										</view>
										<view class="arow">
											<view class="goods-label">
												<view v-for="(property, key) in ite.custom_option_info" :key="key">{{key}}: {{ property }} </view>
											</view>
											<view class="goods-num">x{{ ite.qty }}</view>
										</view>
									</view>
								</view>
							</navigator>
						</view>
					</block>
                </form>
            </view>
            <view class="goods-info">
                <view class="row-box">
                    <view class="row-label">{{ $t('amount.subtotal') }}:</view>
                    <view class="right-text">{{ orderDetail.currency_symbol }}{{ orderDetail.subtotal }}</view>
                </view>
                <view class="row-box">
                    <view class="row-label">{{ $t('amount.shipping_cost') }}:</view>
                    <view class="right-text">{{ orderDetail.currency_symbol }}{{ orderDetail.shipping_total }}</view>
                </view>
				<view class="row-box" v-if="Number(orderDetail.cost_buy_vip)">
				    <view class="row-label">{{$t("amount.dressin_Fee", {site_name: $store.state.site_name_upper})}}:</view>
				    <view class="right-text">{{ orderDetail.currency_symbol }}{{ orderDetail.cost_buy_vip }}</view>
				</view>
                <view class="row-box" v-if="orderDetail.is_shipping_insurance">
                    <view class="row-label">{{$t('pay_order.on_time_delivery_guarantee')}}:</view>
                    <view class="right-text">{{ orderDetail.currency_symbol }}{{ shipping_insurance_total }}</view>
                </view>
				<view class="row-box">
				    <view class="row-label">{{ $t('amount.coupon') }}:</view>
				    <view class="right-text">- {{ orderDetail.currency_symbol }}{{ orderDetail.coupon_with_discount }}</view>
				</view>
				<view class="row-box">
				    <view class="row-label">{{ $t('amount.point', {site_name: $store.state.site_name_upper}) }}:</view>
				    <view class="right-text">- {{ orderDetail.currency_symbol }}{{ orderDetail.point_with_discount }}</view>
				</view>
                <view class="row-box" v-if="orderDetail.wallet_total">
                    <view class="row-label">{{$t('pay_order.wallet_balance')}}:</view>
                    <view class="right-text">- {{ orderDetail.currency_symbol }}{{ orderDetail.wallet_total }}</view>
                </view>
				<view class="row-box">
				    <view class="row-label">{{ $t('amount.sale_tax_fee') }}:</view>
				    <view class="right-text">{{ orderDetail.currency_symbol }}{{ orderDetail.tax_total }}</view>
				</view>
                <view class="row-box total-number-row">
                    <view class="row-label">{{ $t('amount.total') }}:</view>
                    <view class="right-text total-number">{{ orderDetail.currency_symbol }}{{ orderDetail.grand_total }}</view>
                </view>
            </view>
        </view>
		<view class="order-detail-btn-box page-max-width" v-if="orderDetail">
			<scroll-view scroll-x="true" id="opt_btns">
				<view class="order-detail-btn-block" style="white-space:nowrap;text-align: right;">
					<button class="order-detail-btn" v-if="orderDetail.can_after_sale" @tap="$debounce(toAfterSale, 200, [orderDetail])">
						<text>{{ $t('order.btns.after_sale') }}</text>
					</button>
					<button class="order-detail-btn" @tap="()=>{$debounce(toShowCancelModal,200,[orderDetail])}" v-if="orderDetail.can_cancel&&!orderDetail.is_pay">
						<text>{{ $t('order.btns.cancel') }}</text>
					</button>
					<button class="order-detail-btn" @tap="$debounce(handleOpenModal, 200, [orderDetail])" v-if="orderDetail.can_cancel&&orderDetail.is_pay">
						<text>{{ $t('order.btns.cancel') }}</text>
					</button>
					<button class="order-detail-btn" type="primary" v-if="orderDetail.can_payment" @tap="toPayOrder(orderDetail)" :loading="payLoading">
						<text>{{ $t('order.btns.order_now_pay') }}</text>
					</button>
					<button class="order-detail-btn" v-if="orderDetail.can_query_shipping" @tap="toShippingOrder(orderDetail)"><text>{{ $t('order.btns.view_shipping') }}</text></button>
					<button class="order-detail-btn" @tap="toReturnRecord(orderDetail)" v-if="orderDetail.can_record">
						<text>{{ $t('order.btns.view_record') }}</text>
					</button>
					<button class="order-detail-btn" @tap="()=>{$debounce(toReorder,200,[orderDetail])}" v-if="orderDetail.can_reorder">
						<text>{{ $t('order.btns.reorder') }}</text>
					</button>
					<button class="order-detail-btn" type="primary" @tap="toConfirmOrder(orderDetail)" v-if="orderDetail.can_received">
						<text>{{ $t('order.btns.confirm_receipt') }}</text>
					</button>
					<button class="order-detail-btn" type="primary" v-if="orderDetail.can_review" @tap="toReview(orderDetail)"><text>{{ $t('order.btns.review') }}</text></button>
				</view>
			</scroll-view>
			
		</view>
		<list-loading v-show="showLoading" :fixedCenter="true"></list-loading>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_cancel_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px; min-height: 300px;'">
                        <view class="pop_inner_wrapper flex">
							<view class="pop_header">
								<view class="header_title flex">{{ $t('order.cancel_reason') }}</view>
								<i class="iconfont" @tap="closePopup('bottom_cancel_popup')"></i>
							</view>
							<view class="reason_tips">{{ $t('order.cancel_reason_tips') }}</view>
							
							<view class="reason_ul flex">								
								<scroll-view class="reason_scroll" scroll-y="true">
									<view @tap="handleCheckReason(item)" class="reason_li flex align-items-center" v-for="(item, index) in reasons" :key="index">
										<view :class="'radio_box ' + (item.checked ? 'reason_checked' : '')" ><i class="iconfont "></i></view>
										<view class="reason_text">{{item.title }}</view>
									</view>
								</scroll-view>
								<view v-show="needTextTips" class="flex" style="flex-wrap:nowrap;">
									<view id="tips">{{ needTextTips }}</view><view style="color:red;">*</view>
								</view>
								<textarea v-show="needTextTips" name="" id="tips_text" cols="30" rows="3" @input="handleChangeMoreReason" v-model="more_reason"></textarea>
							</view>
							
						</view>                       
                        <view class="bottom_confirm flex">
                            <view @tap="handleSubmit()" :class="'btn_confirm font-bold flex ' + (canSubmitReason ? '' : 'disabled') ">{{ $t('order.submit') }}</view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
		<view v-show="showAddBack" class="add_cart_modal modal">
            <view class="add_cart_content flex align-items-center">
                <view class="add_back_tittle font-bold">{{ $t('order.cancel_success_tips') }}</view>
                <view class="add_to_cart_btn font-bold btn" @tap="()=>{$debounce(handleAddBackToCart,300)}">{{ $t('order.add_to_cart') }}</view>
                <view class="no_thanks_btn font-bold btn" @tap="handleCloseModal">{{ $t('order.no_thanks') }}</view>
            </view>
        </view>
        <view v-show="showBackSuccess" class="add_success_modal modal">
            <view class="add_success_content flex align-items-center">
                <i class="nc-icon close_success_modal"></i>
                <view class="add_success_tips">{{ $t('order.add_back_success') }}</view>
                <view class="btn ok_btn" @tap="handleCloseModal">{{ $t('order.ok') }}</view>
            </view>
        </view>
        
        <view v-show="showCancekItemModal" class="cancel_item_modal modal">
			<view class="add_success_content flex align-items-center cancel_item_content">
				<view class="add_success_tips font-bold">{{ $t('order.cancelitem_tips') }}</view>
				<view class="btn no_btn font-bold" @tap="()=>{showCancekItemModal=false}">{{ $t('order.no') }}</view>
				<view class="btn yes_btn font-bold" @tap="handleOk">{{ $t('order.yes') }}</view>
			</view>
		</view>
		<view v-show="showNoeditAddressModal" class="noedit_address_modal modal">
			<view class="add_success_content flex align-items-center cancel_item_content">
				<view class="add_success_tips font-bold">{{ $t('order.noedit_address_tips') }}</view>
				<view class="btn yes_btn font-bold" @tap="()=>{showNoeditAddressModal=false}">{{ $t('order.ok') }}</view>
			</view>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='recieve_popup' type="center">
				<view class="receive_content flex align-items-center">
				<view class="recieve_tittle font-bold" style="text-align:center;">{{ $t('order.confirm_receive_tittle') }}</view>
				<view class="receive_tips">{{ $t('order.confirm_receive_product') }}<view class="font-bold" style="display:inline;">{{ $t('order.all_the_items') }}</view>{{ $t('order.in_your_order_arrived') }}</view>
				<view class="btn received_btn font-bold" @tap="handleConfirmReceive">{{ $t('order.yes_received') }}</view>
				<view class="btn not_yet_btn font-bold" @tap="()=>{$refs.recieve_popup.close()}">{{ $t('order.not_yet') }}</view>
			</view>
			</uni-popup>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='toreview_popup' type="center">
				<view class="receive_content flex align-items-center">
				<view class="receive_tips">{{ $t('order.congratulations1') }}<view class="font-bold" style="display:inline;">{{ cangetPoints }}</view>{{ $t('order.congratulations2', {site_name: $store.state.site_name_upper}) }}</view>
				<view class="btn received_btn font-bold" @tap="handleToReview">{{ $t('order.write_a_review') }}</view>
			</view>
			</uni-popup>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='is_case_popup' type="center">
				<view class="receive_content flex align-items-center">
					<view class="receive_tips">{{ $t('order.is_case_tip') }}</view>
					<view class="btn received_btn font-bold" @tap="()=>{$refs.is_case_popup.close()}">{{ $t('order.ok') }}</view>
				</view>
			</uni-popup>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='is_case_aftersale_tip' type="center">
				<view class="receive_content flex align-items-center">
					<view class="receive_tips">{{ $t('order.is_case_aftersale_tip') }}</view>
					<view class="btn received_btn font-bold" @tap="()=>{$refs.is_case_aftersale_tip.close()}">{{ $t('order.ok') }}</view>
				</view>
			</uni-popup>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='aftersale_popup' type="center">
				<view class="aftersale_content flex align-items-center">
				<view class="recieve_tittle font-bold">{{ $t('order.have_you_received') }}</view>
				<div class="btns_wrapper flex justify-content-between">
                    <view class="btn aftersale_yes font-bold" @tap.stop="handleToAftersale">{{ $t('order.yes') }}</view>
					<view class="btn aftersale_no font-bold" @tap.stop="()=>{$refs.aftersale_popup.close()}">{{ $t('order.no') }}</view>
                </div>				
			</view>
			</uni-popup>
		</view>
		<!-- 物流时效弹窗 -->
		<uni-popup ref="popupAgeing" background-color="#fff">
			<popupContentTemplate v-if="ageing_info" :title="ageing_info['ageing_title']" @close="$refs.popupAgeing.close()">
				<template v-slot:content>
					<view class="ageing-list-box">
						<view class="ageing-list-item flex align-items-center justify-content-between" v-for="(item,index) in ageing_info['ageing_list']" :key="index">
							<view class="item-left-label">{{item.key}}{{$t('pay_order.days')}}</view>
							<view class="item-bar">
								<view class="item-bar-active" :style="{width:item.value}"></view>
							</view>
							<view class="item-right-label">{{item.value}}</view>
						</view>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 统一提示框 -->
		<uni-popup ref="popupTip" class="popup-common-center-tip">
			<view class="popup-content" style="width:72vw">
				<view class="header">
					<view class="title font-bold">{{$t('pay_order.tip_block.title',{site_name:$store.state.site_name_upper})}}</view>
					<image @click="$refs.popupTip.close();" mode="widthFix" class="close" src="@/static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="content">
					<view>{{tipContent}}</view>
				</view>
				<view @click="$refs.popupTip.close();" class="ok-btn">{{$t('pay_order.tip_block.ok')}}</view>
			</view>
		</uni-popup>
    </view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import ListLoading from '@/components/list-loading/list-loading.vue';
import uniCountdown from "@/components/l-uni-countdown/uni-countdown.vue"
import chatPlugin from '@/utils/chatPlugin.js'
import { mapState } from 'vuex'
var app = getApp(); // 语言

var util = require('../../utils/util.js');

import event from './../../utils/event.js';
export default {
    components: {
        navigation,
		ListLoading,
		uniCountdown
    },
    data() {
        return {
			tipContent:'',
            orderId: 0,
            goodsList: [],
            orderStatus: 0,
            share: false,
			payments: [],
            orderDetail: {
				increment_id: '',
				order_status_txt: '',
                trackingNumber: '',
                trackingCompany: '',
                customer_firstname: '',
				customer_lastname: '',
                customer_telephone: '',
                address: '',
                product: [],
                symbol: '',
                product_amount: '',
                shipping_cost: '',
                subtotal_with_discount: '',
                grand_total: ''
            },
            orderStatusStr: '',
			showLoading: false,
            reasons: [],
			canSubmitReason: false,
			needTextTips: '',
			more_reason: '',
			order_id: '',
			showAddBack: false,
			showBackSuccess: false,
            screenHeight: '',
            showCancekItemModal: false,
			showNoeditAddressModal: false,
			recieveItem: {},
			ageing_info:{},
			is_shipping_insurance:0,// 是否启用及时险
			shipping_insurance_total:0,// 及时险金额
			cangetPoints: 0,
			showBacktopBtn: false,
			payLoading: false,
			reasonSubmitLoading: false,
			module_name: 'order_detail'
        };
    },
	computed: {
        ...mapState({
            serviceScriptUrl: state => state?.appConfig?.scriptUrl,
			serviceWebviewSrc: state => state?.appConfig?.webviewSrc
        }),
    },
    onLoad: function (e) {
        this.queryCancelReason()
        var orderId = e.id;
        if (!e.share) {
            this.setData({
                share: true
            });
        }
        this.orderId = orderId;
        this.loadOrderData();
    },
	onPageScroll: function (t) {
		if (t.scrollTop >= 2000) {
			this.showBacktopBtn = true
		} else {
			this.showBacktopBtn = false
		}
		this.$debounce(() => {
			this.startObserver();
		}, 300)
	},
	//下拉刷新
	onPullDownRefresh() {
		this.loadOrderData({
			onPullDownRefresh: true
		});
	},
    onShow: function () {
		this.$maEvent.visit_event({
			event_category: 'order_details',
			event_action: 'order_details_visit',
			event_name: 'order_details_visit'
		})
    },
    created() {
		const that = this
		uni.getSystemInfo({
			success: (res)=> {
				that.screenHeight = res.screenHeight
			}
		})
	},
    methods: {
		// 客服
		handleDialog(){
			if(this.serviceScriptUrl){
				chatPlugin.openTidioChat(this.serviceScriptUrl);
			}
		},
		handleCeckWebView() {
			if (this.serviceWebviewSrc) {
				uni.navigateTo({
					url:"/pages/contact/web"
				})
			}
		},
        loadOrderData: function (opt) {
			if(!opt || !opt.onPullDownRefresh){
				this.showLoading = true;
			}
			this.$apis.getOrderDetail({order_id: this.orderId}).then(res =>{
				uni.stopPullDownRefresh();
				this.showLoading = false;
				if(res.data && res.data.order){
					var payment_method = '';
					if(this.orderDetail && this.orderDetail.payment_method){
						payment_method = this.orderDetail.payment_method;
					}
					this.orderDetail = res.data.order;
					this.payments = res.data.payments;
					this.ageing_info = res.data.ageing_info;
					this.shipping_insurance_total = res.data.shipping_insurance_total;// 及时险金额
					if(payment_method){
						this.orderDetail.payment_method = payment_method;
					}
					this.$nextTick(() => {
						this.startObserver();
					})
				}
			}).catch(() => {
				uni.stopPullDownRefresh();
				this.showLoading = false;
			});
        }, 
        handleOpenModal(item){
			const {is_case} = item
			if(is_case == '1') {
				this.$refs['is_case_popup'].open()
				return
			}
			this.order_id = item.order_id
			this.showCancekItemModal = true
		},
		handleOk(){
			const that = this
			const order_id = that.order_id
			that.$apis.orderCancel({order_id: order_id}).then((res) => {
				if (res.code == 200) {
                    that.showCancekItemModal = false
					//跳转到取消cancelitem页面                    
					if(res.data.type == 1){
						uni.navigateTo({
							url: '/pages/cancel-items/cancel-items?order_id=' + order_id
						});
						return;
					}
					//跳转到returntrack页面
					if(res.data.type == 2 && res.data.sale_no){
						uni.navigateTo({
							url: '/pages/order/order-detail?order_id=' + order_id + '&sale_no=' + res.data.sale_no
						});
						return;
					}
				}
			}).catch(err=>{
			});
		},
		changePay(pay){
			this.orderDetail.payment_method = pay.key;
			this.orderDetail.payment_method_text = pay.label;
		},
        toPayOrder(item){
			if(this.payLoading){
				return false;
			}
			var payment_method = item.payment_method;
			var q = {
				payment_method: payment_method,
				order_id: this.orderId
			};
			uni.showLoading();
			this.payLoading = true;
			this.$apis.payOrderData(q).then((res) => {
				if(res.code == 200){
					var orderData = res.data;
					//抵扣无需付款情况
					if(orderData.paid && orderData.paid == 1){
						uni.redirectTo({
							url: '/pages/pay/success?orderId=' + this.orderId
						});
						return;
					}
					if(payment_method == 'pacypay'){
						uni.navigateTo({
							url: '/pages/pay/webview?order_id=' + this.orderId +'&payUrl=' + orderData.payData.startUrl
						});
						uni.hideLoading();
						this.payLoading = false;
					}
					else if(payment_method == 'paypal_standard'){
						orderData.order_id = this.orderId; 
						this.paypalPay(orderData);
					}
					else if(payment_method == 'stripe'){
						this.stripePay( orderData);
					} else {
						uni.hideLoading();
						this.payLoading = false;
					}
				} else {
					uni.hideLoading();
					this.payLoading = false;
				}
			}).catch(() => {
				uni.hideLoading();
				this.payLoading = false;
			});
        },
		paypalPay(orderData){
			uni.showLoading();
			uni.requestPayment({
				"provider": "paypal", 
				"orderInfo": orderData.payData,
				success: (res) => {
					var rawdata = JSON.parse(res.rawdata);
					this.$apis.paypalCapture({'order_id': orderData.order_id, 'token': rawdata.orderId}).then((cresult) => {
						if(cresult.code == 200){
							uni.navigateTo({
								url: '/pages/pay/success?orderId=' + orderData.order_id
							});
							this.orderDetail.can_payment = false;
						} else {
							this.payLoading = false;
						}
						uni.hideLoading();
						this.loadOrderData();
					}).catch((err) => {
						uni.hideLoading();
						this.payLoading = false;
						this.loadOrderData();
					});
				},
				fail: (err) => {
					uni.hideLoading();
					this.payLoading = false;
					this.loadOrderData();
				}
			});
		},
		//stripe付款
		stripePay(orderData){
			uni.showLoading();
			uni.requestPayment({
				"provider": 'stripe', 
				"orderInfo": orderData.payData,
				success: (res) => {
					this.$apis.orderStripeReview({'order_id': orderData.order_id, 'paymentId': orderData.payData.paymentId}).then((cresult) => {
						if(cresult.code == 200){
							uni.navigateTo({
								url: '/pages/pay/success?orderId=' + orderData.order_id
							});
							this.orderDetail.can_payment = false;
						} else {
							this.payLoading = false;
						}
						uni.hideLoading();
						this.loadOrderData();
					}).catch((err) => {
						uni.hideLoading();
						this.payLoading = false;
						console.log(err);
					});
				},
				fail: (err) =>  {
					uni.hideLoading();
					this.payLoading = false;
					console.log(err);
				}
			});
		},
		handleConfirmReceive(){
			const orderId = this.recieveItem.increment_id;
			uni.showLoading({mask: true});
			this.$apis.orderReceive({
				orderId
			}).then((res) => {
				if (res.code == 200) {
					this.$refs.recieve_popup.close()
					this.$refs.toreview_popup.open()
					this.cangetPoints  = res.data.point
					// this.toReview(this.recieveItem);
					this.loadOrderData();
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
				uni.hideLoading();
			})
		},
        toConfirmOrder: function (item) {
            this.recieveItem = item
			this.$refs.recieve_popup.open()			
        },
		toShippingOrder(item){
			uni.navigateTo({
				url: '/pages/order/shipping?order_id=' + item.order_id
			});
		},
		handleToReview(){
			this.$refs.toreview_popup.close()
			this.toReview(this.recieveItem)
		},
		handleToAftersale(){
			uni.showLoading({mask: true});
			const order_id = this.order_id
			this.$apis.getAfterStatus({
				order_id: order_id
			}).then((res) => {
				if (res.code == 200) {
					this.$refs.aftersale_popup.close()
				    //跳转到order-aftersale页面
				    if(res.data.type == 1){
				    	uni.navigateTo({
				    		url: '/pages/order-aftersale/order-aftersale?order_id=' + order_id
				    	});
				    	return;
				    }
				    //跳转到return-track
				    if(res.data.type == 2 && res.data.sale_no){
				    	uni.navigateTo({
				    		url: '/pages/return-track/return-track?order_id=' + order_id + '&sale_no=' + res.data.sale_no
				    	});
				    	return;
				    }
				}
				uni.hideLoading();
			})
		},
		toAfterSale(item){
			const {is_case} = item
			if(is_case == '1') {
				this.$refs['is_case_aftersale_tip'].open()
				return
			}
			this.order_id = item.order_id;
			this.$refs.aftersale_popup.open()
		},	
		toReturnRecord(item){
			uni.navigateTo({
				url: '/pages/return-records/return-records?order_id=' + item.order_id
			});
		},
		toReorder(item){
			var order_id = item.order_id;
			uni.showLoading({mask: true});
			this.$apis.orderReorder({
				order_id: order_id
			}).then((res) => {
				if (res.code == 200) {
				    uni.navigateTo({
				    	url: '/pages/cart/cartPage'
				    });
				}
				uni.hideLoading();
			})
		},
		toReview(item){
			this.$public.handleNavTo('/pages/order/order-product-review-list?order_id='+item.order_id);
		},
		isPayDown(item, index){
			item.auto_cancel_order_remain_time = 0;
		},
        toShowCancelModal(item){
			this.order_id = item.order_id
			this.$refs['bottom_cancel_popup'].open()
		},
        closePopup(key){
            this.$refs[key].close()
        },
		handleSubmit(){					
			const that = this
			if(that.reasonSubmitLoading)return	
			that.reasonSubmitLoading = true
			if(!that.canSubmitReason)return
			const item = that.reasons.find(item=>{
				return item.checked
			})
			const reason_id = item&&item.id || ''
			const params = {
				order_id: that.order_id,
				reason_id,
				text: that.needTextTips ? that.more_reason: ''
           }
			that.$apis.submitCancelReason(params).then(res=>{				
				uni.hideLoading()
				that.reasonSubmitLoading = false
				if(res.code == '200'){
					that.closePopup('bottom_cancel_popup')
					that.showAddBack = true
					that.loadOrderData();
				}
			}).catch(error=>{				
				uni.hideLoading()
				that.reasonSubmitLoading = false
			})
		},
		checkSubmit(){
			const that = this
			const item = this.reasons.find(item=>{
				return item.checked
			})
			const need_text = item&&item.need_text || '2'
			// order_id&&(need_text == '1'&&that.more_reason)
			if(item){
				if(need_text == '1'&&!that.more_reason){
					that.canSubmitReason = false
				}else{
					that.canSubmitReason = true
				}
			}else{
				that.canSubmitReason = false
			}
		},
		handleChangeMoreReason(e){
			this.checkSubmit()
		},
		handleCheckReason(item){
			const that = this
			const {id, tips, title, need_text, checked} = item			
			that.reasons.forEach(ite => {
				ite.checked = false
			})
			item.checked = !checked
			that.needTextTips = tips
			that.checkSubmit()
		},
        queryCancelReason(){
			const that = this
			that.$apis.queryCancelReason().then((res)=>{
				if(res.code == '200'){
					that.reasons = res.data.list
					that.reasons.forEach(item => {
						that.$set(item, 'checked', false)
					})
				}
			}).catch(()=>{

			})
		},
		handleCloseModal(){
			this.showAddBack = false
			this.showBackSuccess = false
			// 更新页面
			this.loadOrderData();
			this.queryCancelReason()
		},
		handleAddBackToCart(){
			const that = this
			const order_id = that.order_id
			uni.showLoading({mask: true})
			that.$apis.orderReorder({
				order_id
			}).then(res=>{
				uni.hideLoading()
				if(res.code == '200') {
					that.showAddBack = false
					that.showBackSuccess = true
				}
			}).catch(err=>{
				uni.hideLoading()
			})
		},
		startObserver(){
			if(!this.orderDetail.products || this.orderDetail.products.length == 0){
				return false;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			let product_index = 0;
			this.orderDetail.products.forEach((item, index) => {
				if(item.products.length){
					item.products.forEach((p_item, p_index) => {
						let p_i = product_index;
						if(!p_item.observer){
							let elementSelector = '#orderProductItems-' + p_item.product_id;
							this.$public.observeVisibility(this.observer, elementSelector, () => {
								if(p_item.observer){
									return false;
								}
								this.handleProductVisibilityChange(p_item, p_i);
							});
						}
						product_index++;
					});
				}
			});
		},
		handleProductVisibilityChange(p_item, p_index) {
			if(p_item.observer){
				return false;
			}
			p_item.observer = true;
			let track_data = {
				sku: p_item.sku,
				name: p_item.name,
				price: p_item.base_price
			}
			if(this.module_name){
				track_data.module = this.module_name;
			}
			this.$trackEvent.impression_product_item(track_data, p_index);
		},
		productClick(item, index){
			let product_track_data = {
				sku: item.sku,
				name: item.name,
			}
			if(this.module_name){
				product_track_data.module = this.module_name;
			}
			this.$maEvent.product_click(product_track_data, index);
			this.handleProductVisibilityChange(item, index);
		}
    }
};
</script>
<style scoped lang="scss">
.single_status_wrapper{
	flex-wrap: nowrap;
	font-size: 28rpx;
	padding: 20rpx 30rpx;
	.single_status_name{
		white-space: nowrap;
		color: #f85184;
	}
	.status_to_records{
		white-space: nowrap;
		font-size: 24rpx;
		color: #333;
		flex-wrap: nowrap;
		i:before{
			content: '\e609';
		}
	}
}
	.popup-common-center-tip {
		.popup-content {
			background: #fff;
			border-radius: 16rpx;
			padding: 28rpx 40rpx 40rpx 40rpx;
			.header {
				text-align: center;
				font-size: 32rpx;
				color: #000;
				position: relative;
				margin-bottom: 24rpx;
				.close {
					position: absolute;
					width: 36rpx;
					top: -4rpx;
					right: -16rpx;
				}
			}
			.content {
				font-size: 28rpx;
				color: #333333;
				text-align: center;
				line-height: 44rpx;
				padding-bottom: 136rpx;
			}
			.ok-btn {
				border-radius: 8rpx;
				background: #000;
				text-align: center;
				color: #fff;
				height: 84rpx;
				line-height: 84rpx;
				font-size: 32rpx;
			}
		}
	}
page {
    min-height: 100%;
    background-color: #f2f2f2;
}
.page-header-box {
	.right-box {
		position: absolute;
		top: 0px;
		right: 10rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
}
.noedit_tip{
	margin-left: 10rpx;
	color: #888;
	&:before{
		content: '\e6bd';
	}
}
.copy_btn{
    padding: 5rpx 10rpx;
    border: 1px solid #333;
    border-radius: 5rpx;
    margin-left: 10rpx;
    font-size: 24rpx;
}
.no_btn,.not_yet_btn{
    width: 90%;
    background: #fff;
    color: #333;
    border: 1px solid #333;
    text-align: center;
    padding: 20rpx 40rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
}
.yes_btn,.received_btn{
    width: 90%;
    background: #333;
    color: #fff;
    text-align: center;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
}
.not_yet_btn{
	margin-top: 30rpx;
}

.container {
    min-height: 100%;
	padding-bottom: 110rpx;
    overflow: hidden;
    overflow-y: hidden;
	margin-top: 88rpx;
	background-color: #f2f2f2;
}
.bottom-fiexd {
    position: fixed;
    bottom: 0;
    left: 0;
}

.sec-wrap .order-status {
    width: 100%;
    border-bottom: 1rpx solid #eee;
    height: 110rpx;
    display: flex;
    align-items: center;
	background-size: 100%;
	background-image: url(/static/images/order_status_bg.png);
	color: #fff;
	font-size: 28rpx;
}
.order-status .icon-time {
    font-size: 44rpx;
	padding: 0px 20rpx;
}
.address-box {
	background-color: #fff;
	margin-bottom: 20rpx;
}
.address-sec {
    width: 720rpx;
    margin-left: 30rpx;
    display: flex;
    align-items: center;
    padding: 30rpx 0;
}

.address-sec .icon-box {
    width: 30rpx;
    align-self: flex-start;
    overflow: hidden;
    margin-right: 35rpx;
}

.address-sec .icon-box .icon {
    width: 30rpx;
    height: 30rpx;
}

.address-sec .right-box {
    width: 620rpx;
}

.address-sec .right-box .name-tel {
    font-size: 28rpx;
    color: #000;
    margin-bottom: 20rpx;
}

.address-sec .right-box .text {
    font-size: 24rpx;
    color: #888;
    line-height: 36rpx;
    overflow: hidden;
}
.payment-methods-box {
	background: #fff;
	margin-top: 20rpx;
}
.payment-methods-box .pay-box {
	color: #333333;
	font-size: 28rpx;
	padding: 26rpx 24rpx;
}
.payment-methods-box .pay-box .question-icon {
	width: 48rpx;
}
.payment-methods-box .little-title,.little-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #000;
	padding: 20rpx 0 20rpx 20rpx;
	border-bottom: 1px solid #e2e2e2;
}
.payment-methods-box .pay-box .icon-radio-check {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border: 1px solid #cccccc;
	margin-right: 24rpx;
}

.payment-methods-box .pay-box .icon-radio-checked {
	font-size: 48rpx;
	color: #000;
	margin-right: 24rpx;
}

.payment-methods-box .pay-box .icon-radio-checked:before {
	content: "\E6C2";
}
.payment-methods-box .support-images {
	margin-top: 20rpx;
}
.payment-methods-box .support-images image {
	height: 40rpx;
	margin-right: 10rpx;
}
.item-list {
	width: 100%;
}
.item-box {
	display: flex;
	margin-bottom: 20rpx;
    align-items: center;
	.text {
		flex: 0 0 40%;
		color: #999;
		font-size: 26rpx;
	}
	.value {
		font-size: 26rpx;
	}
}

.wuliu-box {
    width: 100%;
    display: flex;
    align-items: center;
	margin-bottom: 20rpx;
	background: #fff;
	.item-list {
		padding: 30rpx 20rpx;
	}
}

.wuliu-box .icon-box {
    width: 40rpx;
    height: 40rpx;
    overflow: hidden;
    margin-right: 31rpx;
    align-self: flex-start;
}

.wuliu-box .icon-box .icon {
    width: 40rpx;
    height: 40rpx;
}

.wuliu-box .arrow-right {
    width: 15rpx;
    height: 24rpx;
}

.wuliu-box .arrow-right .arrow {
    width: 15rpx;
    height: 24rpx;
}

.wuliu-box .right-text {
    width: 575rpx;
    margin-right: 30rpx;
}

.wuliu-box .right-text .order-number {
    font-size: 28rpx;
    color: #000;
    margin-bottom: 14rpx;
}
.total-number-row {
	.total-number {
		color: #ff165e;
		font-weight: bold;
	}
}


.wuliu-box .right-text .wuliu-text,
.wuliu-box .right-text .wuliu-date {
    font-size: 24rpx;
    color: #888;
    line-height: 36rpx;
}

.right-text .wuliu-text {
    width: 70%;
    display: inline-block;
}

.right-text .wuliu-date {
    width: 28%;
    display: inline-block;
    text-align: right;
}

.goods-list {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
}

.goods-list .list-title {
    font-size: 28rpx;
    color: #000;
	font-weight: bold;
    padding: 30rpx 0 25rpx 30rpx;
}

.goods-list .a-goods {
    width: 720rpx;
    margin-left: 30rpx;
    display: flex;
    /*justify-content: space-between;*/
    border-top: 1px solid #eee;
    padding: 30rpx 30rpx 30rpx 0;
}

.goods-list .a-goods .img-box {
    width: 140rpx;
    height: 186rpx;
    overflow: hidden;
    margin-right: 20rpx;
    background-color: #d8d8d8;
}

.goods-list .img-box .img {
    width: 140rpx;
    height: 186rpx;
}

.goods-list .a-goods .text-box {
    width: 510rpx;
    box-sizing: border-box;
    padding-top: 10rpx;
}

.goods-list .btn-row {
    width: 720rpx;
    margin-left: 30rpx;
    border-top: 1rpx solid #eee;
    padding-bottom: 6rpx;
}

.confirm-btn {
    background: #fff;
    border: 1rpx solid #e64340;
    border-radius: 6rpx;
    width: 164rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    margin: 20rpx 30rpx 20rpx auto;
    font-size: 26rpx;
    color: #e64340;
    text-align: center;
}

.a-goods .text-box .arow {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.a-goods .text-box .arow .goods-name {
    width: 360rpx;
    font-size: 26rpx;
    height: 74rpx;
    color: #000;
    line-height: 1.6;
    overflow: hidden;
}

.a-goods .text-box .arow01 {
    margin-bottom: 20rpx;
}

.a-goods .text-box .arow .goods-price {
    font-size: 26rpx;
    color: #000;
    align-self: flex-start;
	text-align: right;
}

.a-goods .text-box .arow .goods-label {
    font-size: 26rpx;
    color: #999;
}

.a-goods .text-box .arow .goods-num {
    font-size: 26rpx;
    color: #999;
}

.peisong-way {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20rpx;
}

.peisong-way .row-box {
    width: 720rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #eee;
    margin-left: 30rpx;
}

.peisong-way .row-label {
    font-size: 28rpx;
    color: #000;
}

.peisong-way .right-text {
    font-size: 28rpx;
    color: #666;
    padding-right: 30rpx;
}

.peisong-way .liuyan {
    width: 510rpx;
    font-size: 28rpx;
}

.goods-info {
    width: 100%;
    background-color: #fff;
    padding-bottom: 20rpx;
}

.goods-info .row-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 24rpx 30rpx 12rpx 30rpx;
    font-size: 28rpx;
    color: #000;
}

.goods-info .row-box .right-text {
    text-align: right;
}

.jiesuan-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #eee;
    background-color: #fff;
    z-index: 4;
}

.jiesuan-box .to-pay-btn {
    width: 250rpx;
    text-align: center;
    height: 100%;
    line-height: 100rpx;
    background-color: #e64340;
    font-size: 32rpx;
    color: #fff;
    border-radius: 0;
}

.jiesuan-box .left-price {
    display: flex;
    width: 500rpx;
    justify-content: flex-end;
    line-height: 100rpx;
    padding: 0 30rpx 0 0;
    font-size: 28rpx;
    box-sizing: border-box;
}

.jiesuan-box .total {
    color: #e64340;
    text-align: right;
}
.order-detail-btn-box {
	position: fixed;
	width: 100%;
	bottom: 0px;
	height: 110rpx;
	background-color: #fff;
	border-top: 1px solid #eee;
}
.order-detail-btn-block {
	// display: flex;
	padding: 15rpx 20rpx;
	// align-items: center;
	// justify-content: flex-end;
}
.order-detail-btn {
	display: inline-block;
	text-align: center;
	margin: 0rpx 16rpx;
	font-size: 24rpx;;
	padding: 10rpx 15rpx;
}
@import "@/common/mixins.scss";
.modal{
	// display: none;
	width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.add_cart_content,.add_success_content,.receive_content{
    width: 90%;
    min-height: 400rpx;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 40rpx 26rpx;
    flex-direction: column;
	font-size: 28rpx;
}
.aftersale_content{
	background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 40rpx 26rpx;
    flex-direction: column;
}
.receive_content,.aftersale_content {
	width: 640rpx;
	height: unset;
}
.btns_wrapper{
	width: 100%;
}
.add_success_content{
    min-height: 300rpx;
}
.cancel_item_content{
    // height: 400rpx;
}
.add_back_tittle{
    text-align: center;
    font-size: 28rpx;
}
.no_thanks_btn,.aftersale_no{
    width: 95%;
    padding: 20rpx;
    color: #333;
    background: #fff;
    border: 1px solid #333;
    text-align: center;
    margin-top: 30rpx;
}

.add_to_cart_btn{
    width: 95%;
    padding: 20rpx;
    color: #fff;
    background: #333;
    text-align: center;
    margin-top: 30rpx;
}
.add_success_tips,.receive_tips{
    text-align: center;
    font-size: 28rpx;
    color: #333;
    /* margin-top: .4rem; */
    margin-bottom: 40rpx;
}
.receive_tips{
	margin: 30rpx;
}
.ok_btn,.aftersale_yes{
    color: #fff;
    background: #333;
    font-size: 28rpx;
    width: 100%;
    padding: 20rpx;
    text-align: center;
}
.aftersale_no,.aftersale_yes{
	width: 45%;
	margin: 40rpx 0 0;
}

.reason_scroll{
	height: 100%;
	width: 100%;
}
.pop_wrapper{
    width: 100%;
    // padding: 10rpx 30rpx;
	background-color: #fff;
	overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
	font-size: 28rpx;
	uni-textarea {
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	.pop_inner_wrapper{
		flex-direction: column;
		height: 100%;
	}
    .pop_header{
		// margin-bottom: 20rpx;
        padding: 10rpx 30rpx;
		width: 100%;
        position: relative;
        height: 80rpx;
        // @include onepxBorder(#e0e0e0);
        i{
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #999;
            font-size: 24rpx;
            // transform: translateY(-50%);
            &:before{
                content: '\e6ab';
            }
        }
    }
    .header_title{
        font-size: 28rpx;
        width: 100%;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .track_wrapper{
        padding: 12px;
        .track_item{
            position: relative;
            width: 100%;
            height: 80rpx;
            justify-content: start;
            align-items: center;
            // padding-bottom: 40rpx;
            .item_left{
                margin-right: 40rpx;
                line-height: 100%;
                height: 100%;
                display: flex;
                align-items: center;

                i{
                    font-size: 40rpx;
                    color: #222;
                    &:before{
                        content: '\e63b';
                    }
                }
                
            }
            .item_right{
                color: #222;
                flex: 1;
                overflow: hidden;
                .status{
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
           
        }
        .track_item.checked{
            i:before{
                content: '\e640';
            }
        }
       
       
    }
	.radio_box>i{
		font-size: 40rpx;
	}
	.radio_box>i:before{
		content: '\e63b';
	}
	.radio_box.reason_checked>i:before{
		content: '\e6c2';
	}
	.reason_text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		margin-left: 20rpx;
	}
	.need_text{
		display: none;
		font-size: 14px;
	}
	#tips{
		width: 100%;
	}
	.pop_inner_wrapper{
		padding: 20rpx;
	}
	.reason_tips{
		background: #eee;
		padding: 20rpx;
		// height: 120rpx;
	}
	#tips_text{
		width: 100%;
		height: 100rpx;
	}
	.reason_ul{
		flex-grow: 1;
		overflow: auto;
		padding-bottom: 110rpx;
	}
	.reason_li {
		width: 100%;
		/* padding: 0.4rem 0; */
		height: 60rpx;
		margin: 20rpx 0;
	}
    .bottom_confirm{
        width: 100%;
		background: #fff;
		z-index: 1;
        // @include onepxBorderTop(#e0e0e0);
		position: fixed;
		bottom: 0;
        align-items: center;
        // height: 100rpx;
        padding: 20rpx;
        .btn_confirm{
            height: 90rpx;
            width: 100%;
            background: #222;
            font-size: 32rpx;
            color: #fff;
            align-items: center;
            justify-content: center;
        }
        .btn_confirm.disabled{
            opacity: 0.5;
        }
    }
}
	.logistics-timeliness {
		font-size: 28rpx;
		color: #000000E6;
		padding-bottom: 20rpx;
		.ageing {
			color: #198055;
			margin-left: 8rpx;
		}
		.ageing_title {
			color: #A86104;
			margin-left: 8rpx;
			margin-right: 8rpx;
		}
	}
	.ageing-list-box {
		font-size: 28rpx;
		.ageing-list-item {
			padding: 10rpx 0;
		}
		.item-left-label {
			min-width: 160rpx;
		}
		.item-right-label {
			min-width: 120rpx;
			text-align: right;
		}
		.item-bar {
			flex: 1;
			background:#e5e5e3;
			height: 18rpx;
			border-radius: 10rpx;
			overflow: hidden;
			.item-bar-active {
				height: 18rpx;
				background: #000;
			}
		}
	}
</style>
