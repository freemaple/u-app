<template>
	<view class="checkout-index-wrapper dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :styleType="2" :backSelf="{type: 'emit'}" :title="$t('pay_order.title')" @handleClick="handleClick"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="container">
			<form @submit="createOrder" :report-submit="true">
				<!-- shipping地址 -->
				<view>
					<view class="shipping-address-wrapper flex justify-content-between">
						<view class="address-box">
							<image class="address-icon" src="@/static/images/checkout_icon/address@2x.png" mode="widthFix" />
							<view class="current-address" v-if="curAddressData">
								<view class="name-tel-box">
									<view class="name font-bold">{{ curAddressData.name }}</view>
									<view class="phone">{{ curAddressData.mobile }}</view>
								</view>
								<view class="address-street">{{ curAddressData.street1 }} <text v-if="curAddressData.street2"> , {{curAddressData.street2}}</text></view>
								<view class="address-all">{{ curAddressData.address_all }}</view>
							</view>
						</view>
						<view @click="curAddressData.snap_id =curAddressData.address_id;$refs.popupAddressList.open('bottom');" class="address-edit">{{$t('pay_order.edit')}}</view>
					</view>
				</view>
				<image mode="widthFix" src="@/static/images/checkout_icon/address_line@2x.png" class="address-line"></image>
				<view class="split-line"></view>
				<!-- 产品列表 -->
				<view class="product-items-box">
					<view class="header">
						<view class="left-box">
							<view class="title font-bold">
								{{$t('pay_order.items_details')}}
							</view>
							<view class="num" v-if="cartInfo.active_items_count">({{cartInfo.active_items_count}} {{cartInfo.active_items_count>1?$t('pay_order.items'):$t('pay_order.item')}})</view>
						</view>
						<view class="action" @click="$refs.popupProductList.open('bottom');">{{$t('pay_order.view_details')}}</view>
					</view>
					<view class="product-items-list">
						<scroll-view :show-scrollbar="false" :scroll-x="true" style="white-space: nowrap;">
							<view class="product_imgs_box">
								<view class="product_imgs_in" v-for="(item, index) in goodsList">
									<image v-if="item.imgUrl" class="product-img" mode="widthFix" :src="item.imgUrl" :lazy-load="true"  :key="index"></image>
									<specialOfferDiscountTab v-if="item.special_type>0" :discount="item.discount_off"  fontSize="18rpx"></specialOfferDiscountTab>
									<view v-if="showVip && item.member_product == 1" class="vip-member-discount_off">-{{item.discount_off}}%</view>
									<view v-else-if="item.line_price&&item.special_type<=0 " class="special-price-discount_off">-{{item.discount_off}}%</view>
									<view class="only_offos" v-if="item.member_product == 1 || item.line_price ">
										<view class="only_offos_in" v-if="item.special_data.is_show==1&&item.special_data.is_special==1&&item.special_data.spu_stock_type==0">
											<image mode="widthFix" src="../../static/images/payment_confirmation/elebg.png"  />
											<text >{{ item.special_data.spu_stock_text }}</text>
										</view>
										</view>
								    </view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="split-line"></view>
				<!-- Shopping Method -->
				<view class="shipping-method-box">
					<view class="little-title font-bold">{{$t("pay_order.shipping_methods")}}</view>
					<view class="shipping-method-list">
						<view class="method-item-box" @click="chooseShippingMethod(item)" v-for="(item,index) in shippingMethodList" :key="index">
							<view class="method-radio-box">
								<image v-if="item.disabled" class="radio" src="@/static/images/cart/radio_disabled@2x.png" mode="widthFix"></image>
								<block v-else>
									<image v-if="item.checked" class="radio" src="@/static/images/checkout_icon/radio_checked@2x.png" mode="widthFix"></image>
									<image v-else class="radio" src="@/static/images/checkout_icon/radio@2x.png" mode="widthFix"></image>
								</block>
							</view>
							<view class="method-detail-box">
								<view style="display: flex;">
									<view style="flex: 1;">
										<view class="method-name font-bold">{{item.label}}</view>
										<view class="method-tip">{{item.label_title}}</view>									
									</view>
									<view>
										<view style="position: relative;height: 52rpx;" v-if="item.is_free_shipping == 1">
											<i class="free-shipping-text">{{$t('pay_order.free_shipping')}}</i>
											<image class="free-shipping-bg" src="@/static/images/icon/checkout-free.png" mode=""></image>
											<image @click="freeShippingText=item.free_shipping_text;$refs.popupTip2.open('center')" class="free-shipping-question" src="@/static/images/icon/checkout-question.png" mode=""></image>
										</view>
										<view class="method-price font-bold" :class="item.is_free_shipping == 1 ? 'method-price-free' : ''" v-if="!(item.is_free_shipping == 1 && item.line_cost == 0)">
											{{item.symbol}}{{item.is_free_shipping == 1 ? item.line_cost : item.cost}}
										</view>
									</view>
								</view>
								<view class="method-ageing">{{item.ageing}}</view>
							</view>
						</view>
					</view>
					<view class="split-package-box" v-if="package_status&&current_shipping_method">
						<view class="split-checkbox" @click="package_status==3?'':initCartInfo({package_status:package_status==1?2:1});package_status==3?'': chooseShippingMethodPackage({package_status:package_status==1?2:1})">
							<!-- package_status 0:不勾选不展示  1:未勾选  2:已勾选  3:已勾选置灰 -->
							<image v-if="package_status == 1" mode="widthFix" class="checkbox" src="@/static/images/checkout_icon/checkbox@2x.png"></image>
							<image v-if="package_status == 2" mode="widthFix" class="checkbox" src="@/static/images/checkout_icon/checkbox_checked@2x.png"></image>
							<image v-if="package_status == 3" mode="widthFix" class="checkbox" src="@/static/images/checkout_icon/checkbox_checked_disabled@2x.png"></image>
						</view>
						<view class="split-details-box">
							<view class="split-tip-title">
								<view>{{$t('pay_order.split_tip_title')}}</view>
								<image @click="popupTipType = 0;tipContent = $t('pay_order.tip_block.split_package_tip');$refs.popupTip.open('center');" class="tip-icon" mode="widthFix" src="@/static/images/checkout_icon/question@2x.png"></image>
							</view>
							<view class="split-tip-text" v-html="package_status_text"></view>
						</view>
					</view>
					<view class="order-timely-insurance-box">
						<view class="timely-checkbox" @click="changeTimelyInsurance()">
							<image class="checkbox" v-if="cartInfo.is_shipping_insurance" src="@/static/images/checkout_icon/checkbox_checked@2x.png" mode="widthFix"></image>
							<image class="checkbox" v-else src="@/static/images/checkout_icon/checkbox@2x.png" mode="widthFix"></image>
						</view>
						<view class="timely-detail">
							{{$t('pay_order.on_time_delivery_guarantee')}}
							<text class="shipping_insurance_total font-bold">
								{{currency_info.symbol}}{{shipping_insurance_total}}
							</text>
							<image @click="popupTipType = 1;$refs.popupTip.open('center')" class="tip-icon" mode="widthFix" src="@/static/images/checkout_icon/question@2x.png"></image>
						</view>
					</view>
				</view>
				<view class="split-line"></view>
				<!-- more savings -->
				<view class="more-savings-box">
					<view class="little-title font-bold">{{$t('pay_order.more_savings')}}</view>
					<!-- 优惠券 -->
					<view class="more-item-box" @click="$refs.popupCoupon.open('bottom');more_savings_button('coupons')">
						<view class="item-top">
							<view class="t-left flex align-items-center">
								{{$t('pay_order.coupons_block.title')}}
								<image @click.stop="popupTipType = 0;tipContent = coupon_text;$refs.popupTip.open('center')" class="tip-icon" style="width: 48rpx;height: 48rpx;" mode="widthFix" src="@/static/images/checkout_icon/question@2x.png"></image>
							</view>
							<view class="t-right">
								<view v-if="coupon_save>0" class="save-money font-bold">-{{currency_info.symbol}}{{coupon_save}}</view>
								<image class="right-icon" mode="widthFix" src="@/static/images/checkout_icon/right@2x.png"></image>
							</view>
						</view>
						<view class="item-bottom">
							<view v-if="cartInfo.coupon_available.length>0" class="b-left">{{cartInfo.coupon_available.length}} {{$t('pay_order.coupons_block.text1')}}</view>
							<view v-if="coupon_save>0" class="b-right">{{$t('pay_order.coupons_block.text2')}}</view>
						</view>
					</view>
					<!-- 积分 -->
					<view class="more-item-box" @click="$refs.popupPointUse.open('bottom');usePointType = realyUsePointType;more_savings_button('points')">
						<view class="item-top">
							<view class="t-left flex align-items-center">
								{{$t('pay_order.points_block.title')}}
								<image @click.stop="popupTipType = 0;tipContent = deduction_order_text;$refs.popupTip.open('center')" class="tip-icon" style="width: 48rpx;height: 48rpx;" mode="widthFix" src="@/static/images/checkout_icon/question@2x.png"></image>
							</view>
							<view class="t-right">
								<view v-if="Number(cartInfo.point_cost)" class="save-money font-bold">-{{currency_info.symbol}}{{cartInfo.point_cost}}</view>
								<image class="right-icon" mode="widthFix" src="@/static/images/checkout_icon/right@2x.png"></image>
							</view>
						</view>
						<view class="item-bottom">
							<view class="b-left" v-if="Number(point_total)">{{$t('pay_order.points_block.total')}} {{point_total}}</view>
							<view class="b-right" v-if="Number(realUsePoint)">-{{realUsePoint}} {{$t('pay_order.points_block.points')}}</view>
						</view>
					</view>
					<!-- 钱包 -->
					<view class="more-item-box" @click="$refs.popupWalletUse.open('bottom');more_savings_button('wallet')">
						<view class="item-top">
							<view class="t-left">{{$t('pay_order.wallet_block.title')}}</view>
							<view class="t-right">
								<view v-if="realUseWallet" class="save-money font-bold">-{{currency_info.symbol}}{{realUseWallet}}</view>
								<image class="right-icon" mode="widthFix" src="@/static/images/checkout_icon/right@2x.png"></image>
							</view>
						</view>
						<view class="item-bottom">
							<view v-if="Number(wallet_total)" class="b-left">{{$t('pay_order.wallet_block.total')}} {{currency_info.symbol}}{{wallet_total}}</view>
						</view>
					</view>
				</view>
				<view class="split-line"></view>
				<!-- 支付 -->
				<view class="payment-box">
					<view class="little-title font-bold">{{$t('pay_order.payment.title')}}</view>
					<!-- billing-address -->
					<view class="billing-address-box">
						<view class="header">
							<view class="title font-bold">{{$t('pay_order.payment.billing')}}</view>
							<view @click="$public.handleNavTo('/pages/address/add?id='+curBillingAddressData.address_id+'&addressType=billing&fromWhichPage=checkout')" class="action">{{$t('pay_order.payment.edit')}}</view>
						</view>
						<view class="address-box">
							<view class="name-tel-box">
								<view class="name font-bold">{{ curBillingAddressData.name }}</view>
								<view class="phone">{{ curBillingAddressData.mobile }}</view>
							</view>
							<view class="address-street">{{ curBillingAddressData.street1 }}<text v-if="curBillingAddressData.street2"> , {{curBillingAddressData.street2}}</text></view>
							<view class="address-all">{{ curBillingAddressData.address_all }}</view>
						</view>
						<image mode="widthFix" src="@/static/images/checkout_icon/address_line@2x.png" class="address-line"></image>
					</view>
					<!-- payment stay -->
					<view class="payment-stay-box" v-if="paymentMethodData.length">
						<view class="header">
							<view class="title font-bold">{{$t('pay_order.payment.payment_stay')}}</view>
						</view>
						<view class="pay-methods-box">
							<view class="method-item" v-for="(pay,index) in paymentMethodData" :key="index" @click="handleChangePayment(pay)">
								<view class="pay-radio-box">
									<image v-if="currentPay == pay.key" class="radio" src="@/static/images/checkout_icon/radio_checked@2x.png" mode="widthFix"></image>
									<image v-else class="radio" src="@/static/images/checkout_icon/radio@2x.png" mode="widthFix"></image>
								</view>
								<view class="content-box">
									<view class="pay-label-box">
										<view class="pay-label-img" v-if="pay.imageUrl">
											<image mode="heightFix" :src="pay.imageUrl"></image>
										</view>
										<view class="pay-label">
											<view class="label">{{pay.label}}</view>
											<image @click="$refs.popupTip.open();tipContent = pay.label_description;popupTipType=0" mode="widthFix" class="question-icon" v-if="pay.label_description" src="@/static/images/checkout_icon/question@2x.png"></image>
										</view>
									</view>
									<view class="pay-support-images" v-if="pay.supportImageUrl && pay.supportImageUrl.length">
										<image class="pay-support" v-for="(s_i,index) in pay.supportImageUrl" :src="s_i" mode="heightFix" :key="index"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 购买VIP -->
				<!-- <view class="split-line" v-if="isCheckoutOutInfo.buy_vip"></view>
				<view class="checkout-vip-card checkout-shipping-method-wrap mb-2" v-if="isCheckoutOutInfo.buy_vip">
					<view class="vip-card-header">
						<image class="vip-icon" mode="widthFix" src="../../static/images/vip/vip_icon.png"></image>
						<text style="line-height: 1rem;">{{$t("pay_order.plus", {site_name: $store.state.site_name_upper})}}</text>
					</view>
					<view class="vip-card-body flex align-items-center" @click="selectBuyVip">
						<view class="vip-card-body-left">
							<text style="position: relative;">
								<text class="vip-card-left-block"></text>
								<checkbox :checked="isCheckoutOutInfo.purchase_vip" color="#873c00" style="transform:scale(0.8)"/>
							</text>
							<text> {{currency_info.symbol}} {{isCheckoutOutInfo.vip_price}}</text>
						</view>
						<view class="vip-card-body-right flex">
							<view class="vip-card-body-right-item flex align-items-center" style="border-right: 1px solid #873c00;">
								<i class="iconfont3 icon-my-coupons"></i>
								<view> {{isCheckoutOutInfo.vip_equity.discount_off}} {{$t('pay_order.discount_off')}}</view>
							</view>
							<view class="vip-card-body-right-item flex align-items-center">
								<i class="iconfont3 icon-my-points"></i>
								<view>{{isCheckoutOutInfo.vip_equity.power_point}} {{$t('pay_order.x_points')}}</view>
							</view>
							<view class="vip-vard-right-icon">{{$t('pay_order.annually')}}</view>
						</view>
					</view>
					<view class="vip-card-footer">
						{{$t('pay_order.buy_plus_tips1')}} 
						<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-dressin-plus-terms-conditions')" class="text-underline">
							{{$t('pay_order.buy_plus_tips2', {site_name: $store.state.site_name_upper})}}
						</text>
					</view>
				</view> -->
				<view class="split-line"></view>
				<view class="order-total-box">
					<view class="little-title font-bold">{{$t("pay_order.order_total")}}</view>
					<view class="order-info-box">
						<view class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.subtotal")}}</view>
							<view class="info-price font-bold">{{currency_info.symbol}}{{cartInfo.product_total}}</view>
						</view>
						<view class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.shipping_fee")}}</view>
							<view class="info-price font-bold" v-if="cartInfo.is_free_shipping == 1">
								<text class="method-price-free" v-if="!(cartInfo.line_shipping_cost == 0)">{{currency_info.symbol}}{{cartInfo.line_shipping_cost}}</text>
								<text style="color: #198055;margin-left: 16rpx;">{{$t("pay_order.order_summary.free")}}</text>
							</view>
							<view class="info-price font-bold" v-else>{{currency_info.symbol}}{{cartInfo.shipping_cost}}</view>
						</view>
						<view v-if="isCheckoutOutInfo.purchase_vip" class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.buy_vip", {site_name: $store.state.site_name_upper})}}</view>
							<view class="info-price font-bold">{{currency_info.symbol}}{{cartInfo.cost_buy_vip}}</view>
						</view>
						<view v-if="cartInfo.is_shipping_insurance" class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.on_time_delivery_guarantee")}}</view>
							<view class="info-price font-bold" v-if="Number(shipping_insurance_total)>0">{{currency_info.symbol}}{{shipping_insurance_total}}</view>
							<view class="info-price font-bold" v-else>{{$t('pay_order.order_summary.free')}}</view>
						</view>
						<view v-if="couponSwitch.is_coupon" class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.coupon_discount")}}</view>
							<view class="show-switch-box" v-if="couponSwitch.switch_coupon">
								<view class="save-price font-bold">-{{currency_info.symbol}}{{ coupon_save}}</view>
								<switch color="#34C759" :checked="couponSwitch.is_coupon==2?true:false" @change="changeSwitch('is_coupon',couponSwitch.is_coupon)" />
							</view>
							<view class="save-price font-bold" v-else>-{{currency_info.symbol}}{{ coupon_save}}</view>
						</view>
						<view v-if="pointsSwitch.is_point" class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.dressin_point", {site_name: $store.state.site_name_upper})}}</view>
							<view class="show-switch-box" v-if="pointsSwitch.switch_point">
								<view class="save-price font-bold">-{{currency_info.symbol}}{{cartInfo.point_cost}}</view>
								<switch color="#34C759" :checked="pointsSwitch.is_point==2?true:false" @change="changeSwitch('is_point',pointsSwitch.is_point)" />
							</view>
							<view v-else class="save-price font-bold">-{{currency_info.symbol}}{{cartInfo.point_cost}}</view>
						</view>
						<view v-if="walletSwitch.is_wallet" class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.wallet_balance")}}</view>
							<view class="show-switch-box" v-if="walletSwitch.switch_wallet">
								<view class="save-price font-bold">-{{currency_info.symbol}}{{cartInfo.wallet_total}}</view>
								<switch color="#34C759" :checked="walletSwitch.is_wallet==2?true:false" @change="changeSwitch('is_wallet',walletSwitch.is_wallet)" />
							</view>
							<view v-else class="save-price font-bold">-{{currency_info.symbol}}{{cartInfo.wallet_total}}</view>
						</view>
						<view class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.order_summary.sale_tax_fee")}}</view>
							<view class="info-price font-bold">{{currency_info.symbol}}{{cartInfo.tax_total}}</view>
						</view>
						<view class="info-box reward-points flex align-items-center justify-content-end">
							<view v-html="$t('pay_order.order_summary.reward_points',{points:last_get_points,site_name: $store.state.site_name_upper})"></view>
							<image class="question-icon" @click="popupTipType=0;tipContent=$t('pay_order.point_tip', {site_name: $store.state.site_name_upper});$refs.popupTip.open('center')" mode="widthFix" src="@/static/images/checkout_icon/question@2x.png"></image>
						</view>
						<view class="split-line"></view>
						<view class="payment-security">
							<view class="title flex align-items-center">
								<image mode="widthFix" src="@/static/images/icon/anquan-icon-green.png"></image>
								<text>{{$t('pay_order.payment_security')}}</text>
							</view>
							<view class="content">{{$t('pay_order.payment_security_content', {site_name: $store.state.site_name_upper})}}</view>
							<view class="flex pay-logo-box">
								<image mode="heightFix" src="@/static/images/checkout_icon/security_visa_secure@2x.png"></image>
								<image mode="heightFix" src="@/static/images/checkout_icon/security_visa_verified@2x.png"></image>
								<image mode="heightFix" src="@/static/images/checkout_icon/security_id_check@2x.png"></image>
								<image mode="heightFix" src="@/static/images/checkout_icon/security_safekey@2x.png"></image>
								<image mode="heightFix" src="@/static/images/checkout_icon/security_mastercard_securecode@2x.png"></image>
								<image mode="heightFix" src="@/static/images/checkout_icon/security_protectbuy@2x.png"></image>
							</view>
							<view class="title flex align-items-center">
								<image style="width: 30rpx;" mode="widthFix" src="@/static/images/icon/password-icon-green.png"></image>
								<text>{{$t('pay_order.security_privacy')}}</text>
							</view>
							<view class="content">{{$t('pay_order.security_privacy_content', {site_name: $store.state.site_name_upper})}}</view>
							
						</view>
						<view class="terms-privacy-box">
							{{$t('pay_order.terms_1', {site_name: $store.state.site_name_upper})}}
							<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-terms-and-conditions');security_privacy_button_event('terms_and_conditions')" class="a-link">{{$t('pay_order.terms_2')}}</text>
							{{$t('pay_order.terms_3')}}
							<text @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy');security_privacy_button_event('privacy_policy')" class="a-link">{{$t('pay_order.terms_4')}}</text>
						</view>
					</view>
				</view>

				<view class="footer page-max-width">
					<view class="footer-box border-top-1px">
						<view class="top-price-box flex justify-content-end align-items-center">
							<image @click="$refs.popupOrderDetail.open('bottom');" mode="widthFix" src="@/static/images/checkout_icon/up@2x.png" class="up-icon"></image>
							<view class="total-label font-bold">{{$t("pay_order.all")}}:</view>
							<view class="price font-bold">{{ currency_info.symbol }}{{ cartInfo.grand_total }}</view>
						</view>
						<button class="to-pay-btn" formType="submit" :loading="payLoading">{{ $t("pay_order.place_order") }}</button>
					</view>
				</view>
			</form>
		</view>
		<!-- 下单明细弹窗 -->
		<uni-popup ref="popupOrderDetail" class="order-detail-popup" @change="(e)=>{popupShowChange(e.show,'popupOrderDetail')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t("pay_order.order_total")}}</view>
					<image @click="$refs.popupOrderDetail.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="order-detail-list-box">
					<view class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.subtotal")}}</view>
						<view class="info-price">{{currency_info.symbol}}{{cartInfo.product_total}}</view>
					</view>
					<view class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.shipping_fee")}}</view>
						<view class="info-price" v-if="cartInfo.is_free_shipping == 1">
							<text class="method-price-free" v-if="!(cartInfo.line_shipping_cost == 0)">{{currency_info.symbol}}{{cartInfo.line_shipping_cost}}</text>
							<text style="color: #198055;margin-left: 16rpx;">{{$t("pay_order.order_summary.free")}}</text>
						</view>
						<view class="info-price" v-else>{{currency_info.symbol}}{{cartInfo.shipping_cost}}</view>
					</view>
					<view v-if="isCheckoutOutInfo.purchase_vip" class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.buy_vip", {site_name: $store.state.site_name_upper})}}</view>
						<view class="info-price">{{currency_info.symbol}}{{cartInfo.cost_buy_vip}}</view>
					</view>
					<view v-if="cartInfo.is_shipping_insurance" class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.on_time_delivery_guarantee")}}</view>
						<view class="info-price" v-if="Number(shipping_insurance_total)>0">{{currency_info.symbol}}{{shipping_insurance_total}}</view>
						<view class="info-price" v-else>{{$t('pay_order.order_summary.free')}}</view>
					</view>
					<view v-if="Number(coupon_save)" class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.coupon_discount")}}</view>
						<view class="info-price is-save-price">-{{currency_info.symbol}}{{ coupon_save}}</view>
					</view>
					<view v-if="Number(cartInfo.point_cost)" class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.dressin_point", {site_name: $store.state.site_name_upper})}}</view>
						<view class="info-price is-save-price">-{{currency_info.symbol}}{{cartInfo.point_cost}}</view>
					</view>
					<view v-if="Number(cartInfo.wallet_total)" class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.wallet_balance")}}</view>
						<view class="info-price is-save-price">-{{currency_info.symbol}}{{cartInfo.wallet_total}}</view>
					</view>
					<view class="info-box flex align-items-center justify-content-between">
						<view class="info-label">{{$t("pay_order.order_summary.sale_tax_fee")}}</view>
						<view class="info-price">{{currency_info.symbol}}{{cartInfo.tax_total}}</view>
					</view>
				</view>
				<view class="footer-box">
					<view class="top-price-box flex justify-content-end align-items-center">
						<image @click="$refs.popupOrderDetail.close();" mode="widthFix" src="@/static/images/checkout_icon/down@2x.png" class="up-icon"></image>
						<view class="total-label font-bold">{{$t("pay_order.all")}}:</view>
						<view class="price font-bold">{{ currency_info.symbol }}{{ cartInfo.grand_total }}</view>
					</view>
					<button class="to-pay-btn" formType="submit" @tap="createOrder" :loading="payLoading">{{ $t("pay_order.place_order") }}</button>
				</view>
			</view>
			
		</uni-popup>
		<!-- 地址列表弹窗 -->
		<uni-popup ref="popupAddressList" class="address-list-popup" @change="(e)=>{popupShowChange(e.show,'popupAddressList')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t('pay_order.address_book')}}</view>
					<image @click="$refs.popupAddressList.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="address-filter-box">
					<view class="search-box">
						<input @confirm="handleAddressSearch()" v-model="addressSearchKey" placeholder-style="color:#999999;font-size:28rpx;" :placeholder="$t('pay_order.address_block.search_placeholder')" />
						<image @click="handleAddressSearch()" class="search-icon" mode="widthFix" src="@/static/images/checkout_icon/search_icon@2x.png"></image>
						<image @click="handleResetSearch()" v-if="addressSearchKey" class="clear-icon" mode="widthFix" src="@/static/images/checkout_icon/clear_icon@2x.png"></image>
					</view>
					<view class="sort-icon-box">
						<image @click="handleAddressSort()" class="sort-icon" mode="widthFix" src="@/static/images/checkout_icon/sort_icon@2x.png"></image>
					</view>
				</view>
				<view class="address-list">
					<view class="address-item-box" :key="key" v-for="(item,key) of addressSearchList">
						<view class="t-box flex justify-content-between" @click="curAddressData = {...curAddressData,snap_id:item.address_info.address_id}">
							<view class="t-l-box">
								<view class="name-phone-box">
									<view class="name font-bold"><text class="first-name" v-html="item.address_info.first_name"></text> <text v-html="item.address_info.last_name"></text></view>
									<view class="phone" v-html="item.address_info.telephone"></view>
								</view>
								<view class="street1">{{item.address_info.street1}} <text v-if="item.address_info.street2"> , {{item.address_info.street2}}</text></view>
								<view class="address-all">{{getAddressAll(item.address_info)}}</view>
							</view>
							<view class="t-r-box">
								<view class="address-radio">
									<image v-if="curAddressData.snap_id == item.address_info.address_id" class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio_checked@2x.png"></image>
									<image v-else class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio@2x.png"></image>
								</view>
							</view>
						</view>
						<view class="b-box">
							<view class="b-l-box">
								{{item.is_default == 1?$t('pay_order.default_address'):''}}
							</view>
							<view class="b-r-box" @click="$public.handleNavTo('/pages/address/add?id='+item.address_info.address_id+'&addressType=address&fromWhichPage=checkout')">
								{{$t('pay_order.edit')}}
							</view>
						</view>
					</view>
				</view>
				<view class="address-list-footer">
					<view class="dui-primary-btn font-bold" @click="changeAddressSelect()">{{$t('pay_order.apply')}}</view>
					<view class="add-new-address font-bold" @click="$public.handleNavTo('/pages/address/add?addressType=address&fromWhichPage=checkout')">{{$t('pay_order.add_new_address')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 产品详情列表弹窗 -->
		<uni-popup ref="popupProductList" class="product-list-popup" @change="(e)=>{popupShowChange(e.show,'popupProductList')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t('pay_order.items_details')}}</view>
					<image @click="$refs.popupProductList.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="product-list-box goods-list">
					<block v-for="(item, index) in goodsList">
						<view v-if="item.active == 1" class="a-goods" :key="index">
							<view class="img-box">
								<image mode="widthFix" :src="item.imgUrl" class="img" />
								<specialOfferDiscountTab v-if="item.special_type>0" :discount="item.discount_off"  fontSize="18rpx"></specialOfferDiscountTab>
									<view v-if="showVip && item.member_product == 1" class="vip-member-discount_off">-{{item.discount_off}}%</view>
									<view v-else-if="item.line_price&&item.special_type<=0 " class="special-price-discount_off">-{{item.discount_off}}%</view>
								<view class="only_offos" v-if="item.member_product == 1 || item.line_price ">
									<view class="only_offos_in" v-if="item.special_data.is_show==1&&item.special_data.is_special==1&&item.special_data.spu_stock_type==0">
								      <image mode="widthFix" src="../../static/images/payment_confirmation/elebg.png"  />
									  <text >{{ item.special_data.spu_stock_text }}</text>
									</view>
								</view>
							</view>
					
							<view class="product-item-detail-box">
								<view class="top">
									<view class="goods-name">{{ item.name }}</view>
									<view class="goods-label">
										<block v-for="(item,key) of item.spu_options">
											<view class="option_label">{{key}}:</view>
											<view class="option_value font-bold">{{item}}</view>
										</block>
									</view>
								</view>
								<view class="bottom">
									<view class="goods-price">
										<view class="vip-member-price-box flex align-items-center" v-if="item.member_product == 1">
											<text class="vip-member-price">{{currency_info.symbol}}{{item.product_price}}</text>
										</view>
										<block v-else>
									<view :class="item.line_price ? 'org_price_pop' : ''">{{currency_info.symbol}}{{ item.product_price }}</view>
											<view v-if="item.line_price" class="line-price">{{currency_info.symbol}}{{ item.line_price }}</view>
										</block>
									</view>
									<view class="goods-num">x{{ item.qty }}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</uni-popup>
		<!-- 优惠券弹窗 -->
		<uni-popup ref="popupCoupon" class="coupon-popup" @change="(e)=>{popupShowChange(e.show,'popupCoupon')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t('pay_order.coupons_block.my_coupons')}}</view>
					<image @click="$refs.popupCoupon.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="coupon-tabs flex justify-content-around">
					<view @click="couponCurrentTab = 1" class="tab-item font-bold" :class="couponCurrentTab == 1?'on':''">{{$t('checkout_coupon.available')}}({{cartInfo.coupon_available.length}})</view>
					<view @click="couponCurrentTab= 2" class="tab-item font-bold" :class="couponCurrentTab == 2?'on':''">{{$t('checkout_coupon.unavailable')}}({{cartInfo.coupon_unavailable.length}})</view>
				</view>
				<view class="time-filter-box">
					<view class="filter">
						<view @click="couponTimeFilterType=1" class="time-filter-item left" :class="couponTimeFilterType==1?'on':''">{{$t('pay_order.coupons_block.laste_to_arliest')}}</view>
						<view @click="couponTimeFilterType=2" class="time-filter-item right" :class="couponTimeFilterType==2?'on':''">{{$t('pay_order.coupons_block.arliest_to_laste')}}</view>
					</view>
				</view>
				<view class="cart-coupon-box">
					<view class="coupon-lists">
						<block v-if="couponCurrentTab == 1">
							<block v-if="couponTimeFilterType == 1">
								<couponItem v-for="(item,index) in cartInfo.coupon_available" :isOld="false" :showDiscountCost="true" :showCircleEdge="true" :key="index" @handleSelect="changeCoupon" :couponItemData="{...item,assign_begin_at:item.active_begin_at,assign_end_at:item.active_end_at,selectId:cartInfo.coupon_selected.id,symbol:currency_info.symbol}" :couponSelect="true"></couponItem>
							</block>
							<block v-if="couponTimeFilterType == 2" >
								<couponItem v-for="(item,index) in cartInfo.coupon_available_asc" :isOld="false" :showDiscountCost="true" :showCircleEdge="true" :key="index" @handleSelect="changeCoupon" :couponItemData="{...item,assign_begin_at:item.active_begin_at,assign_end_at:item.active_end_at,selectId:cartInfo.coupon_selected.id,symbol:currency_info.symbol}" :couponSelect="true"></couponItem>
							</block>
							<view class="coupon-empty-box" v-if="!cartInfo.coupon_available.length">
								<image class="empty-img" mode="widthFix" src="@/static/images/checkout_icon/coupon_empty@2x.png"></image>
								<view class="empty-text">{{$t('common.empty_text')}}</view>
							</view>
						</block>
						<block v-if="couponCurrentTab == 2">
							<block v-if="couponTimeFilterType == 1">
								<couponItem v-for="(item,index) in cartInfo.coupon_unavailable" :isOld="false" :showCircleEdge="true" :key="index" :couponItemData="{...item,assign_begin_at:item.active_begin_at,assign_end_at:item.active_end_at}" opacity="0.5" :couponSelect="true"></couponItem>
							</block>
							<block v-if="couponTimeFilterType == 2">
								<couponItem v-for="(item,index) in cartInfo.coupon_unavailable_asc" :isOld="false" :showCircleEdge="true" :key="index" :couponItemData="{...item,assign_begin_at:item.active_begin_at,assign_end_at:item.active_end_at}" opacity="0.5" :couponSelect="true"></couponItem>
							</block>
							<view class="coupon-empty-box" v-if="!cartInfo.coupon_unavailable.length">
								<image class="empty-img" mode="widthFix" src="@/static/images/checkout_icon/coupon_empty@2x.png"></image>
								<view class="empty-text">{{$t('common.empty_text')}}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="coupon-footer-box" v-if="couponCurrentTab == 1">
					<view class="top" v-if="coupon_save>0">
						<view class="left">{{$t('pay_order.coupons_block.coupon_selected')}}</view>
						<view class="right">
							<view class="save font-bold">{{$t('pay_order.coupons_block.save')}}</view>
							<view class="save-price font-bold">{{currency_info.symbol}}{{coupon_save}}</view>
						</view>
					</view>
					<view @click="$refs.popupCoupon.close();" class="dui-primary-btn font-bold">{{$t('pay_order.coupons_block.continue')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 是否把billing同步为shipping地址 -->
		<uni-popup ref="popupMatchesBilling" class="matches-billing" @change="(e)=>{changePopupMathchesBilling(e)}">
			<view class="checkout-popup-center-content">
				<view class="checkout-popup-center-header">
					<view class="title font-bold">{{$t('pay_order.billing_address_block.tip_title',{site_name:$store.state.site_name_upper})}}</view>
					<view class="close-box">
						<image @click="$refs.popupMatchesBilling.close();" class="close" mode="widthFix" src="@/static/images/checkout_icon/close@2x.png"></image>
					</view>
				</view>
				<view class="content-box">
					<view class="desc">{{$t('pay_order.billing_address_block.tip_content')}}</view>
					<view class="dui-primary-btn" @click="handleBillingToShipping">{{$t('pay_order.billing_address_block.matches_billing_address')}}</view>
					<view class="add-new-address-btn" @click="$refs.popupMatchesBilling.close();">{{$t('pay_order.billing_address_block.add_new_shipping_address')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 积分使用弹窗 -->
		<uni-popup ref="popupPointUse" class="points-apply-popup" @change="(e)=>{popupShowChange(e.show,'popupPointUse')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t('pay_order.points_block.my_points')}}</view>
					<image @click="$refs.popupPointUse.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="popup-content">
					<view class="total">
						<view class="label font-bold">{{$t('pay_order.total')}}:</view>
					    <view class="value">{{point_total}} {{Number(point_total)?$t('pay_order.points_block.points_1'):$t('pay_order.points_block.point')}}</view>
					</view>
					<view class="max-available">
						<view class="flex">
							<view class="label font-bold">{{$t('pay_order.max_available')}}:</view>
							<view class="value">{{`${useMaxPoint}.00`}} {{Number(useMaxPoint)?$t('pay_order.points_block.points_1'):$t('pay_order.points_block.point')}}</view>
						</view>
						<text class="available-tips" v-if="Number(useMaxPoint)">{{only_to_non_sale}}</text>
					</view>
					<block v-if="Number(useMaxPoint)">
						<view class="use-points-options">
							<view class="point-item-box" @click="usePointType=1">
								<view class="point-radio">
									<image v-if="usePointType == 1" class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio_checked@2x.png"></image>
									<image v-else class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio@2x.png"></image>
								</view>
								<view class="point-value" v-html="$t('pay_order.points_block.option_use_all',{num:currency_info.symbol+currentUseMaxPointMoney})"></view>
							</view>
							<view class="point-item-box" @click="usePointType=2">
								<view class="point-radio">
									<image v-if="usePointType == 2" class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio_checked@2x.png"></image>
									<image v-else class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio@2x.png"></image>
								</view>
								<view class="point-value">{{$t('pay_order.points_block.option_give_use_point', {site_name: $store.state.site_name_upper})}}</view>
							</view>
							<view class="point-item-box" @click="usePointType=3" :class="usePointType == 3?'border-bottom-none':''">
								<view class="point-radio">
									<image v-if="usePointType == 3" class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio_checked@2x.png"></image>
									<image v-else class="radio" mode="widthFix" src="@/static/images/checkout_icon/radio@2x.png"></image>
								</view>
								<view class="point-value">{{$t('pay_order.points_block.option_enter_use_point')}}</view>
							</view>
						</view>
						
						<view class="apply-input-box" v-if="usePointType == 3">
							<input placeholder-style="color:#ccccd0;font-size:28rpx;" type="number" @input="judgePoint" v-model="currentUsedPoint" :placeholder="$t('pay_order.use_point_placeholder')" />
						</view>
						<view v-if="usePointType" class="points-exchange-ratio" v-html="$t('pay_order.points_block.points_exchange_ratio',{num:currency_info.symbol+useOnePointToMoney})"></view>
						<view @click="usePoints()" class="apply font-bold" :class="usePointType?'':'_disabled'">{{$t('pay_order.apply_btn')}}</view>
					</block>
					<view v-else class="points-empty-box">
						<image class="empty-img" mode="widthFix" src="@/static/images/checkout_icon/point_empty@2x.png"></image>
						<view class="empty-text" v-if="Number
						(point_total) <=0 ">{{$t('common.empty_text')}}</view>
						<view class="empty-text" v-else>
							{{only_to_non_sale_empty}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 钱包使用弹窗 -->
		<uni-popup ref="popupWalletUse" class="apply-common-popup" @change="(e)=>{popupShowChange(e.show,'popupWalletUse')}">
			<view class="checkout-popup-content">
				<view class="checkout-popup-header">
					<view class="title font-bold">{{$t('pay_order.wallet_block.my_wallet')}}</view>
					<image @click="$refs.popupWalletUse.close();" class="close" mode="widthFix" src="../../static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="popup-content flex flex-column">
					<view class="apply-common-main">
						<view class="max-available font-bold">{{$t('pay_order.max_available')}}:{{'&nbsp;'}}<text>{{currency_info.symbol}}{{useMaxWallet}}</text></view>
						<block v-if="Number(useMaxWallet)">
							<view class="apply-input-box">
								<text class="money">{{currency_info.symbol}}</text>
								<input :placeholder="$t('pay_order.wallet_block.input_placeholder')" :disabled="realUseWallet?true:false" placeholder-style="color:#ccccd0;font-size:28rpx;" step="0.01" type="number" @input="judgeWallet" v-model.number="currentUsedWallet"/>
								<text @click="currentUsedWallet = useMaxWallet;showWalletIcon='clear'" v-if="showWalletIcon == 'all'&&!realUseWallet && useMaxWallet && useMaxWallet!='0.00'" class="apply-all">{{$t('pay_order.wallet_block.apply_all')}}</text>
								<view @click="currentUsedWallet = '';showWalletIcon = 'all'" v-if="showWalletIcon == 'clear'&&!realUseWallet" class="apply-clear-box">
									<text class="apply-clear">x</text>
								</view>
							</view>
							<view @click="useWallet('remove')" v-if="realUseWallet" class="apply font-bold">{{$t('pay_order.remove_btn')}}</view>
							<view @click="useWallet()" v-else class="apply font-bold" :class="currentUsedWallet?'':'_disabled'">{{$t('pay_order.wallet_block.apply_btn')}}</view>
						</block>
						<view v-else class="wallet-empty-box">
							<image class="empty-img" mode="widthFix" src="@/static/images/checkout_icon/wallet_empty@2x.png"></image>
							<view class="empty-text">{{$t('common.empty_text')}}</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 统一提示框 -->
		<uni-popup ref="popupTip" class="popup-common-center-tip" @change="(e)=>{popupShowChange(e.show,'popupTip')}">
			<view class="popup-content" style="width:72vw">
				<view class="header">
					<view class="title font-bold">{{$t('pay_order.tip_block.title',{site_name:$store.state.site_name_upper})}}</view>
					<image @click="$refs.popupTip.close();" mode="widthFix" class="close" src="@/static/images/checkout_icon/close@2x.png"></image>
				</view>
				<view class="content">
					<view v-if="popupTipType==1">
						{{$t('pay_order.on_time_tip.shipping_insurance_tip1',{site_name: $store.state.site_name,point_num: shipping_insurance_point})}}
						<text class="text-underline" @click="toArticlePage()">{{$t('pay_order.on_time_tip.shipping_insurance_tip2')}}</text>
						{{$t('pay_order.on_time_tip.shipping_insurance_tip3')}}
					</view>
					<view v-else>{{tipContent}}</view>
				</view>
				<view @click="$refs.popupTip.close();" class="ok-btn">{{$t('pay_order.tip_block.ok')}}</view>
			</view>
		</uni-popup>
		<!-- free Shipping提示框 -->
		<uni-popup ref="popupTip2" class="popup-common-center-tip" @change="(e)=>{popupShowChange(e.show,'popupTip2')}">
			<view class="popup-content" style="width:72vw">
				<view class="header">
					<view class="title font-bold">{{$t('pay_order.tip_block.title',{site_name:$store.state.site_name_upper})}}</view>
					<image @click="$refs.popupTip2.close();" mode="widthFix" class="free-ship-close" src="@/static/images/icon/close_icon_white@2x.png"></image>
				</view>
				<view class="content">
					{{freeShippingText}}
				</view>
				<view @click="$refs.popupTip2.close();" class="ok-btn">{{$t('pay_order.tip_block.ok')}}</view>
			</view>
		</uni-popup>
		<!-- 最优优惠券 -->
		<uni-popup ref="popupBestCoupon" class="popup-leave-toast" @change="(e)=>{popupShowChange(e.show,'popupBestCoupon')}">
			<view class="popup-content" style="width:calc(100vw - 40px)">
				<!-- <view class="tip-box best-coupon-box">
					<view class="iconfont close-icon" @click="$refs.popupBestCoupon.close()"></view>
					<view class="title font-bold">
						{{bestCouponData.type == 1?$t('pay_order.best_coupon.title1'):$t('pay_order.best_coupon.title2')}}
					</view>
					<view class="discounted-price font-bold">{{currency_info.symbol}}{{bestCouponData.discount}}</view>
					<view class="description">
						{{bestCouponData.type == 1?$t('pay_order.best_coupon.desc1'):$t('pay_order.best_coupon.desc2')}}
					</view>
					<view class="btn-wrapper">
						<view @click="$refs.popupBestCoupon.close()" v-if="bestCouponData.type == 1" class="continue-checking-out-btn font-bold">{{$t('pay_order.best_coupon.btn1')}}</view>
						<view v-else @click="changeCoupon({code:bestCouponData.coupons.code},'useCoupon')" class="apply-this-coupon-btn font-bold">{{$t('pay_order.best_coupon.btn2')}}</view>
					</view>
				</view> -->
				<view class="leave-coupon-toast-content">
					<view class="leave-toast-close-btn" @click="$refs.popupBestCoupon.close()"></view>
					<image class="leave-toast-bg-img" src="@/static/images/coupon/leave-toast-bg.png" alt=""></image>
					<view class="leave-toast-title">
						{{$t('pay_order.best_coupon.title1')}}
					</view>
					<view class="leave-toast-money">
						{{currency_info.symbol}}{{coupon_save}}
						<view class="leave-toast-line"></view>                        
					</view>
					<view class="leave-toast-content-txt">
						{{$t('pay_order.best_coupon.desc1')}}
					</view>
					<view class="leave-toast-btn" @click="$refs.popupBestCoupon.close()">
						{{$t('pay_order.best_coupon.btn1')}}
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 库存为空提示弹窗 -->
		<uni-popup class="ConfirmationPromptBan" ref="payConfirmationPrompt" :is-mask-click="false">
			<view class="payConfirmationboxIn">
			<view class="ConfirmationPromptBox">
				<view class="ConfirmationTxt font-bold">{{$t('checkout_coupon.stock_tips')}}</view>
				<view class="ConfirmationTxtContent">
					{{$t('checkout_coupon.continue_checkout')}}
				</view>
				<view class="ConfirmateTViewList" >
					<swiper
						class="swiper-box"
						:indicator-dots="indicatorDots"
						:autoplay="autoplay"
						:interval="interval"
						:duration="duration"
						:circular="false"
						@change="handlerSwiperChange"
						next-margin="30rpx"
						>
						<swiper-item v-for="(item, index) in empty_inventory_data" :key="index" style="width: 480rpx;height: 231rpx;" >
							<view class="item_scoops" >
								<view class="imgUrl_swiper">
									<image mode="widthFix" :src="item.imgUrl"/>
								</view>
								<view class="item_rig">
									<view class="top_item">
										<view class="item_title">{{ item.name }}</view>
										<view class="goods_label">
												<block v-for="(item,key) of item.spu_options">
													<view >{{key}}:</view>
													<view class="option_label_pos font-bold">{{item}}</view>
												</block>
										</view>
									</view>
									<view class="item_bottom">
										<text class="vip-member-price">{{empty_currency_info.symbol}}{{item.product_price}}</text>
									    <view class="goods-num">x{{ item.move_qty }}</view>
									</view>
								</view>
							</view>
							</swiper-item>
						</swiper>
				</view>
				<view class="current_page" >
					<view class="current_page_in">
						{{ currentFindIndex + 1 }}/{{ empty_inventory_data.length }}
					</view>
				</view>
				<view class="recode_btn">
				<view class="confirm_btn" @click="handleStockConfirmTips">{{$t('checkout_coupon.Confirm')}}</view>
				<view class="cancel_btn" @click="handleStockCancelTips">{{$t('checkout_coupon.Reconsider')}}</view>
				</view>
			</view>
			</view>
        </uni-popup>
		<!-- 营销库存为空提示弹窗 -->
		<uni-popup class="ConfirmationPromptBan" ref="marketingPayConfirmationPrompt" :is-mask-click="false">
			<view class="payConfirmationboxIn">
				<view class="ConfirmationPromptBox">
					<view class="ConfirmationTxt font-bold">{{$t('checkout_coupon.out_off_market_stock_tips')}}</view>
					<view class="ConfirmationTxtContentMarket">
						{{$t('checkout_coupon.marketing_continue_checkout')}}
					</view>
					<view class="ConfirmateTViewListMarket" >
						<swiper
							class="swiper-box"
							:indicator-dots="indicatorDots"
							:autoplay="autoplay"
							:interval="interval"
							:duration="duration"
							:circular="false"
							@change="handlerSwiperChange"
							next-margin="30rpx"
							>
							<swiper-item v-for="(item, index) in marketing_empty_inventory_data" :key="index" style="width: 480rpx;height: 231rpx;" >
								<view class="item_scoops" >
									<view class="imgUrl_swiper">
										<image mode="widthFix" :src="item.imgUrl"/>
									</view>
									<view class="item_rig">
										<view class="top_item">
											<view class="item_title">{{ item.name }}</view>
											<view class="goods_label">
													<block v-for="(item,key) of item.spu_options">
														<view >{{key}}:</view>
														<view class="option_label_pos font-bold">{{item}}</view>
													</block>
											</view>
										</view>
										<view class="item_bottom">
											<text class="vip-member-price">{{empty_currency_info.symbol}}{{item.product_price}}</text>
											<view class="goods-num">x{{ item.move_qty }}</view>
										</view>
									</view>
								</view>
								</swiper-item>
							</swiper>
					</view>
					<view class="current_page_mark" >
						<view class="current_page_in">
							{{ currentFindIndex + 1 }}/{{ marketing_empty_inventory_data.length }}
						</view>
					</view>
					<view class="recode_btn">
					<view class="confirm_btn" @click="marketHandleStockConfirmTips">{{$t('checkout_coupon.marketing_Confirm')}}</view>
					<view class="cancel_btn" @click="marketHandleStockCancelTips">{{$t('checkout_coupon.marketing_Reconsider')}}</view>
					</view>
				</view>
			</view>
        </uni-popup>
	  <uni-popup ref="turnstile_popup" type="center"  borderRadius="10px" :is-mask-click="false">
			<view class="code_view">
				<CodeView  @update:actionData="handleIsFlag" :cf_code_params="cf_code_params" type="APP_PAY_CHECKOUT"></CodeView>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue'
import { mapState } from 'vuex'
import CodeView from '@/components/CFCodeView/CodeView.vue';

	export default {
		components: {
			specialOfferDiscountTab,
			CodeView
		},
		data() {
			return {
				marketing_empty_currency_info:{},
				marketing_empty_inventory_data:[],
				payPostData:{},
				cf_code_params :"",
				is_interaction :"",
				empty_currency_info:{},
				openStatus:0,
				empty_inventory_data:[],
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				currentFindIndex: 0,
				addressSearchKey:'', // 地址搜索关键字
				tipContent:'', // 提示文案
				usePointType:'', // 使用积分类型
				realyUsePointType:'', // 展示使用积分类型
				has_shipping_address:1,
				// 优惠券开关
				couponSwitch: {
					is_coupon:0, // 0-从未使用过 1-使用过但关闭了 2-正在使用
					switch_coupon:0, // 管理后台配置 0关闭 1 开启
				},
				// 积分开关
				pointsSwitch: {
					is_point:0, // 0-从未使用过 1-使用过但关闭了 2-正在使用
					switch_point:0, // 管理后台配置 0关闭 1 开启
				},
				// 钱包开关
				walletSwitch: {
					is_wallet:0, // 0-从未使用过 1-使用过但关闭了 2-正在使用
					switch_wallet:0, // 管理后台配置 0关闭 1 开启
				},
				pageMetaShow:false,
				package_status:0,//0:不勾选不展示  1:未勾选  2:已勾选  3:已勾选置灰
				package_status_text:'',
				current_shipping_method:'',// 当前选中的运输方式
				showBacktopBtn: false,
				coupon_save:0,
				couponCurrentTab:1,
				couponTimeFilterType:1,
				paymentMethodData: [],
				shippingMethodList:[],
				cartInfo: {
					active_items_count: '',
					product_total: "",
					shipping_cost: "",
					tax_total:"",
					coupon_cost: "",
					grand_total: "",
					coupon_available:[],// 可使用优惠券
					coupon_unavailable:[], // 不可使用优惠券
					discount_cost:'',// 优惠价格
					coupon_selected:{},
					base_point_cost:"0.00",
					point_cost:"0.00",
					product_y_total:0,
					is_shipping_insurance:0,// 是否启用及时险
				},
				currency_info: {
					symbol: ""
				},
				currentPay: "",
				goodsList: [],
				curAddressData: {
					address_id: '',
					name:'',
					mobile: '',
					street1: '',
					street2: '',
					address_all:'',
					snap_id:''
				},
				curBillingAddressData:{
					address_id: '',
					name:'',
					mobile: '',
					street1: '',
					street2: '',
					address_all:''
				},
				point_total:0,// 用户总积分
				last_get_points:0,// 预计本单可得积分
				tipType: 'coupon',
				currentUseMaxPointMoney:'', // 最大使用积分对应金额
				useOnePointToMoney:'', // 1积分等于多少金额
				currentUsedPoint:'',// 当前用户使用积分
				realUsePoint: '', // 当时用户真实应用积分
				useMaxPoint:0,// 当前用户可使用的最大积分
				showPointIcon:'all',
				
				wallet_total:'0.00', // 用户钱包总额
				currentUsedWallet:'',// 当前用户使用钱包
				realUseWallet: '', // 当时用户真实应用钱包
				useMaxWallet:0,// 当前用户可使用的最大钱包
				showWalletIcon:'all',
				
				deduction_order:'',
				
				isLoad: false,
				bestCouponData:{},// 最优优惠券,
				popupTip: '',//提示框内容
				popupTipType: 1, // 提示类型
				shipping_insurance_total:"0.00", // 订单及时险
				shipping_insurance_point:0,// 订单及时险赔付积分
				currentOpenPop:'',
				payLoading: false,
				address_list:[],
				address_asc:[],
				addressSearchList:[],
				isCheckoutOutInfo: {}, // 详情数据
				addressSort:false,
				sortType: '',
				deduction_order_text: '',
				only_to_non_sale_empty: '', //低价促销积分限制空文案
				only_to_non_sale: '', //低价促销积分提醒文案
				coupon_text: '',
				freeShippingText: '',
				isJumpNumber:0
			};
		},
		onShow: function() {
			this.isJumpNumber = 0;
			if(this.orderId){
				if(this.currentPay == 'pacypay'){
					uni.redirectTo({
						url: '/pages/order/order-detail?id=' + this.orderId
					});
				}
				return;
			}
			if(this.$store.getters.hasLogin && this.isLoad){
				this.initCartInfo();
			}
			this.$maEvent.visit_event({
				event_category: 'checkout',
				event_action: 'checkout_visit',
				event_name: 'checkout_visit'
			})
		},
		onLoad: function(e) {
			this.initCartInfo();
			this.$maEvent.view_checkout_page();
			// this.getBestCoupon();					
		},
		onBackPress() {
			if(this.currentOpenPop) {
				this.$refs[this.currentOpenPop].close()
				this.currentOpenPop = '';
				return true;
			} else {
				if(!uni.getStorageSync('is_checkout_onepage_show_coupon') && this.bestCouponData.coupons) {
					this.$refs.popupBestCoupon.open('center')
					uni.setStorageSync('is_checkout_onepage_show_coupon',true)
					return true;
				} else {
					return false;
				}
			}
		},
		computed: {
				...mapState(['showVip'])
			},
		methods: {
			// 营销库存为空弹窗确认按钮
			marketHandleStockConfirmTips(){
				this.$refs.marketingPayConfirmationPrompt.close();
				// 刷新当前页
				this.initCartInfo();
				this.no_marketing_stock_window_button_event('continue');
			},
			// 营销库存为空弹窗REMOVE按钮
			marketHandleStockCancelTips(){
				const formattedData = this.marketing_empty_inventory_data.map(item => ({
                    special_type: item.special_type || "",
                    item_id: item.item_id || "",
                    select_qty: item.select_qty || ""
                }));
                // 构造字段数据
                const result = {
                    'unselects': formattedData
                };
				this.$refs.marketingPayConfirmationPrompt.close();
				// 执行删除sku操作
				this.$apis.deleteSkuRemoveOutOff({...result}).then((res) => {
					// 全部移除情况
                    if(res.data.allRemove){
						uni.navigateBack({delta: 1});
					}else{
						// 刷新当前页
						this.initCartInfo();
					}
				}).catch((err)=>{
					console.log('err+++++',err);
				})
				this.no_marketing_stock_window_button_event('remove');
			},
			// cf turnstile 回传流程
			handleIsFlag(actionData) {
				if (actionData.isShow) {
					this.payPostData.cfTurnstileRegisterToken = actionData.cf_code;
					this.$refs.turnstile_popup.close();
					// 走支付流程
					setTimeout(() => {
						this.getCreateOrderDataInfo(this.payPostData)
					}, 200)
				}
			},
			handleStockConfirmTips(){
				if(this.openStatus == 1){
					this.$refs.payConfirmationPrompt.close();
					uni.navigateBack({delta: 1});
				}else{
					this.createOrder()
					this.$refs.payConfirmationPrompt.close();
				}
				this.no_stock_window_button_event('confirm');
			},
			handleStockCancelTips(){
				if(this.openStatus == 1){
					this.$refs.payConfirmationPrompt.close();
					uni.navigateBack({delta: 1});
				}else{
					this.$refs.payConfirmationPrompt.close();
					this.initCartInfo();
				}
				this.no_stock_window_button_event('reconsider');
			},
			handlerSwiperChange(e) {
				this.currentFindIndex = e.detail.current;
			},
			// 情况搜索框
			handleResetSearch() {
				this.addressSearchKey = '';
				this.setData({
					addressSearchList: this.sortType == 'default' ? this.address_list : this.address_list_asc
				})
			},
			// 地址模糊搜索
			handleAddressSearch() {
				if(this.addressSearchKey) {
					const addressSearchList = JSON.parse(JSON.stringify(this.sortType === 'default' ? this.address_list : this.address_list_asc));
					const val = this.addressSearchKey.toLowerCase(); // 转换为小写
					const regex = new RegExp(`(${val})`, 'gi'); // 不区分大小写的正则表达式
					const list = addressSearchList.filter(e => {
					    return regex.test(e.address_info.first_name) || 
					           regex.test(e.address_info.last_name) || 
					           regex.test(e.address_info.telephone);
					}).map(e => {
					    // 高亮显示匹配的部分
					    e.address_info.first_name = e.address_info.first_name.replace(new RegExp(`(${val})`, 'gi'), '<text style="color: #FF004D">$1</text>');
					    e.address_info.last_name = e.address_info.last_name.replace(new RegExp(`(${val})`, 'gi'), '<text style="color: #FF004D">$1</text>');
					    e.address_info.telephone = e.address_info.telephone.replace(new RegExp(`(${val})`, 'gi'), '<text style="color: #FF004D">$1</text>');
					    return e;
					});
					
					if (list.length !== 0) {
					    this.addressSearchList = list;
					}
				}
			},
			// 地址排序
			handleAddressSort() {
				this.addressSort = !this.addressSort;
				this.searchFilter()
				if(this.addressSearchKey) {
					this.handleAddressSearch();
				}
			},
			searchFilter() {
				if(this.addressSort) {
					this.setData({
						sortType: 'asc',
						addressSearchList:this.address_list_asc
					})
				} else {
					this.setData({
						sortType: 'default',
						addressSearchList:this.address_list
					})
				}
			},
			popupShowChange(show,name) {
				this.pageMetaShow = show
				if(show) {
					this.currentOpenPop = name
				} else {
					this.currentOpenPop = ''
				}
			},
			changePopupMathchesBilling(e) {
				this.pageMetaShow = e.show;
				if(!e.show && this.has_shipping_address == 0) {
					if(this.isJumpNumber==0) {
						this.isJumpNumber++;
						this.$refs.popupMatchesBilling.close();
						setTimeout(()=>{
							this.$public.handleNavTo('/pages/address/add?addressType=address&fromWhichPage=checkout')
						},1)
						
					}
				}
			},
			// billing同步为shipping
			handleBillingToShipping() {
				uni.showLoading();
				this.$apis.billingToShipping().then(res =>{
					this.has_shipping_address = 1;
					this.$refs.popupMatchesBilling.close();
					this.initCartInfo()
					this.$trackEvent.add_shipping_info();
				}).catch(e=>{
					uni.hideLoading()
				})
			},
			// 改变选择地址
			changeAddressSelect() {
				if(this.curAddressData.address_id == this.curAddressData.snap_id) {
					this.$refs.popupAddressList.close();
				} else {
					this.$apis.addressSelectChange({address_id:this.curAddressData.snap_id}).then(res => {
						this.$refs.popupAddressList.close();
						this.initCartInfo();
					})
				}
			},
			// 返回地址
			getAddressAll(data) {
				let addressKeyArr = ["city", "state", "country_name", "zip"];
				let addressArr = []
				addressKeyArr.forEach(item => {
					if (data[item]) {
						addressArr.push(data[item])
					}
				})
				return addressArr.join(', ')
			},
			// 优惠券、积分、钱包开关
			changeSwitch(type,value) {
				uni.showLoading()
				this.$apis.changeCartByType({type,value:value==2?1:2}).then(res=>{
					if(value==2) {
						this.realyUsePointType = '';
						this.currentUsedPoint = '';
					}
					this.initCartInfo();
				})
			},
			handleChangePayment(pay) {
				this.currentPay = pay.key;
				uni.setStorageSync('payment_method',this.currentPay);
				this.$trackEvent.add_payment_info({
					payment_method: this.currentPay
				});
				this.$debounce(this.handleRecordPay, 500, [this.currentPay])
			},
			handleRecordPay(currentPay) {
				this.$apis.recordChangePay({payment_method:currentPay}).then(res=>{
					this.initCartInfo();
				})
			},
			// 是否使用及时险
			changeTimelyInsurance() {
				uni.showLoading()
				this.$apis.updateTimelyInsurance({is_shipping_insurance:this.cartInfo.is_shipping_insurance?0:1}).then(res=>{
					this.initCartInfo();
					this.chooseShippingMethodEvent({
						shipping_method: this.current_shipping_method,
						on_time: this.cartInfo.is_shipping_insurance?false:true,
						split_packages: (this.package_status == 2 || this.package_status == 3) ? true : false
					});
				}).catch(e=>{
					uni.hideLoading()
				})
			},
			handleToCoupon() {
				var headerHeight=0;
				uni.createSelectorQuery().select('.has-coupon-applied-box').boundingClientRect(rect => {
					headerHeight = rect.height;
					uni.createSelectorQuery().select('.discount-box .discount.item-box').boundingClientRect(data => {
						uni.pageScrollTo({
							duration: 300, // 滚动动画过渡时间
							scrollTop: data.top-headerHeight, // 滚动的值
						})
					}).exec();
				}).exec();
			},
			getBestCoupon() {
				this.$apis.getBestCoupon().then(res => {
					this.bestCouponData = res.data;
					// bestCouponData.type=1：当前check out页已选中优惠券（系统自匹配或用户自行切换其他券），弹窗提示内容为提示当前已选中的券；
					// bestCouponData.type=0:当前check out页未选中优惠券（用户自行取消勾选优惠券），弹窗提示内容为提示账户内当前适用的最优券；
					// if(this.bestCouponData.type == 1) {
					// 	this.showCouponApplied = true;
					// }
				})
			},
			handleSum(num1,num2) {
				var total = Number(num1)+Number(num2)
				total = total.toFixed(2)
				return total
			},
			// 使用积分
			usePoints() {
				uni.showLoading();
				let params = {point_use:0};
				if(this.usePointType == 1) {
					params.point_use = this.useMaxPoint
				}
				if(this.usePointType == 3) {
					params.point_use = this.currentUsedPoint || 0;
				}
				this.$apis.usePoints(params).then(res => {
					this.realyUsePointType = this.usePointType;
					this.$refs.popupPointUse.close();
					this.initCartInfo();
				})
			},
			
			// 使用钱包
			useWallet(type) {
				uni.showLoading();
				this.$apis.useWallet({wallet_use:type=='remove'?0:this.currentUsedWallet}).then(res => {
					this.$refs.popupWalletUse.close();
					this.initCartInfo();
				})
			},
			judgePoint(e) {
				var that = this;
				this.$nextTick(() => {
					if(e.detail.value) {
						// 只能输入正整数
						that.currentUsedPoint = Number(e.detail.value.split('.')[0]);
						if(that.currentUsedPoint > that.useMaxPoint) {
							  if (that.useMaxPoint == 0) {
								  that.currentUsedPoint = ''
							  } else {
								  that.currentUsedPoint = Number(that.useMaxPoint)
							  }
						 }
					 }
				})
			},
			judgeWallet(e) {
				this.$nextTick(() => {
					if(Number(e.detail.value) >= this.useMaxWallet) {
						  if (this.useMaxWallet == 0) {
							  this.currentUsedWallet = ''
						  } else {
							  this.currentUsedWallet = this.useMaxWallet
						  }
					 }
				})
			},
			// 改变优惠券
			changeCoupon(data,type) {
				uni.showLoading();
				if(!type && data.selectId == data.id) {
					this.$apis.removeUseCoupon().then(res => {
						this.initCartInfo();
					})
				} else {
					this.$apis.useCoupon({coupon_code:data.code}).then(res => {
						this.initCartInfo();
					})
				}
			},
			initCartInfo(params={}) {
				this.$apis.getCheckoutOnepage({
					shipping_method: params.shipping_method || this.current_shipping_method,
					package_status: params.package_status || this.package_status,
					v:'1.1'
				}).then((res) => {
					// cf 验证两个字段
					this.cf_code_params = res.data.public_key
					this.is_interaction = res.data.is_interaction

					uni.hideLoading();
					this.isLoad = true;
					if (res.data.address_list) {
						let addressKeyArr = ["city", "state_name", "country_name", "zip"]
						// shippingAddress
						let address = res.data.cart_address;
						let addressArr = []
						addressKeyArr.forEach(item => {
							if (address[item]) {
								addressArr.push(address[item])
							}
						})
						let curAddressData = {
							snap_id:res.data.cart_address_id,
							address_id: res.data.cart_address_id,
							name: address.first_name + " " + address.last_name,
							mobile: address.telephone,
							street1:address.street1,
							street2: address.street2,
							address_all:addressArr.join(', ')
						};
						// billing address
						let billing_address = res.data.billing_address;
						let billingAddressArr = [];
						addressKeyArr.forEach(item => {
							if (billing_address[item]) {
								billingAddressArr.push(billing_address[item])
							}
						})
						let curBillingAddressData = {
							address_id: billing_address.address_id,
							name: billing_address.first_name + " " + billing_address.last_name,
							mobile: billing_address.telephone,
							street1:billing_address.street1,
							street2: billing_address.street2,
							address_all:billingAddressArr.join(', ')
						}

						let cart_info = res.data.cart_info;
						let payment = res.data.payments
						let paymentArr = []
						for (let key in payment) {
							paymentArr.push({
								...payment[key],
								key: key
							})
						} 
						this.couponSwitch = {
							switch_coupon: res.data.switch_coupon,
							is_coupon: res.data.is_coupon
						}
						this.pointsSwitch = {
							switch_point: res.data.switch_point,
							is_point: res.data.is_point
						}
						this.walletSwitch = {
							switch_wallet: res.data.switch_wallet,
							is_wallet: res.data.is_wallet
						}
						this.package_status = res.data.package_status;
						this.package_status_text = res.data.package_status_text;
						this.address_list = res.data.address_list;
						this.address_list_asc = res.data.address_list_asc;
						this.searchFilter();
						this.curAddressData = curAddressData;
						this.curBillingAddressData = curBillingAddressData;
						this.goodsList = cart_info.products;
						this.paymentMethodData= paymentArr;
						this.shippingMethodList = res.data.shippings;
						this.cartInfo= {
							...res.data.cart_info
						};
						this.coupon_save = this.handleSum(this.cartInfo.coupon_cost,this.cartInfo.product_y_total)
						this.currency_info= {
							...res.data.currency_info,
						};
						this.last_get_points= res.data.last_get_points;
						this.point_total= res.data.point_total;
						this.currentUseMaxPointMoney = res.data.currentUseMaxPointMoney;
						this.useOnePointToMoney = res.data.useOnePointToMoney;
						this.currentUsedPoint= res.data.currentUsedPoint;
						this.realUsePoint= res.data.currentUsedPoint;
						this.showPointIcon=res.data.currentUsedPoint?'':'all';
						this.useMaxPoint=res.data.useMaxPoint;
						this.wallet_total= res.data.money_total;
						this.currentUsedWallet= res.data.currentUsedMoney;
						this.realUseWallet=res.data.currentUsedMoney;
						this.showWalletIcon=res.data.currentUsedMoney?'':'all';
						this.useMaxWallet=res.data.useMaxMoney;
						this.deduction_order= res.data.deduction_order;
						this.shipping_insurance_total=res.data.shipping_insurance_total;
						this.shipping_insurance_point=res.data.shipping_insurance_point;
						this.isCheckoutOutInfo= res.data;
						this.has_shipping_address = res.data.has_shipping_address;
						this.current_shipping_method = res.data.current_shipping_method;
						this.deduction_order_text = res.data.deduction_order_text;
						this.only_to_non_sale = res.data.only_to_non_sale;
						this.only_to_non_sale_empty = res.data.only_to_non_sale_empty;
						this.coupon_text = res.data.coupon_text;
						if(Number(this.currentUsedPoint)) {
							if(this.currentUsedPoint == this.useMaxPoint) {
								this.usePointType = 1;
								if(!this.realyUsePointType) {
									this.realyUsePointType = 1;
								}
							} else {
								this.usePointType = 3;
								if(!this.realyUsePointType) {
									this.realyUsePointType = 3;
								}
							}
						} else {
							this.usePointType = ''
						}
						var cPay = this.currentPay || uni.getStorageSync('payment_method') || res.data.current_payment_method;
						var cPayArr = this.paymentMethodData.filter(item=>item.key == cPay);
						if(cPayArr.length > 0) {
							this.currentPay = cPay;
						} else {
							this.currentPay = '';
						}
						if(this.has_shipping_address == 0) {
							this.$refs.popupMatchesBilling.open('center');
						}
						if(params.callback){
							typeof params.callback === 'function' && params.callback();
						}
					} else {
						uni.redirectTo({
							url:'/pages/address/add?backType=cartNoAddress&addressType=billing&fromWhichPage=checkout'
						})
					}
					this.isLoad = true;
				})
			},
			// 获取订单信息
			getCreateOrderDataInfo(postData){
				uni.showLoading();
				this.$apis.createOrder(postData).then(res => {
					if(res.code == 200){
						// 判断当前订单是否库存为空
						if(res.data.our_off_stock){
							this.empty_inventory_data = res.data.out_off_stock_item;
							this.empty_currency_info = res.data.currency_info;
							this.$refs.payConfirmationPrompt.open();
							this.openStatus = 1;
							this.no_stock_window_page_event();
						} else {
							if(res.data.out_off_stock_item&&res.data.out_off_stock_item.length){
								this.empty_inventory_data = res.data.out_off_stock_item;
								this.empty_currency_info = res.data.currency_info;
								this.$refs.payConfirmationPrompt.open();
								this.no_stock_window_page_event();
							} else {
								var orderData = res.data;
								this.orderId = orderData.order_id;
								//抵扣无需付款情况
								if(orderData.paid && orderData.paid == 1){
									uni.redirectTo({
										url: '/pages/pay/success?orderId=' + orderData.order_id
									});
									uni.hideLoading();
								} else {
									//付款
									this.handelPay(orderData);
								}
								this.updateCart();
								this.trackEvent();
							}
						}
					} else {
						uni.hideLoading();
						this.payLoading = false;
					}
				}).catch((res) => {
					if(res.data.our_off_stock){
						this.empty_inventory_data = res.data.out_off_stock_item;
						this.empty_currency_info = res.data.currency_info;
						this.$refs.payConfirmationPrompt.open();
						this.openStatus = 1;
						this.no_stock_window_page_event();
					}else{
						if(res.data.out_off_stock_item&&res.data.out_off_stock_item.length){
							this.empty_inventory_data = res.data.out_off_stock_item;
							this.empty_currency_info = res.data.currency_info;
							this.$refs.payConfirmationPrompt.open();
							this.no_stock_window_page_event();
						}else if(res.data.out_off_market_stock&& res.data.out_off_market_stock.length){
							// 营销库存为空时
							this.marketing_empty_inventory_data = res.data.out_off_market_stock;
							this.marketing_empty_currency_info = res.data.currency_info;
							this.$refs.marketingPayConfirmationPrompt.open();
							this.no_marketing_stock_window_page_event();
						}
					}
					uni.hideLoading();
					this.payLoading = false;
				});
			},
			createOrder(e) {
				// 是否勾选运输方式
				let isCheckShipping = false;
				this.shippingMethodList.map(e => {
					if(e.checked) {
						isCheckShipping = true;
					}
				})
				if(!isCheckShipping) {
					uni.showToast({
						title: this.$t('pay_order.check_shipping_method'),
						icon: 'none',
						duration: 3000
					});
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 100
					}) 
					return
				}
				// 是否勾选支付方式
				if(!this.currentPay) {
					uni.showToast({
						title: this.$t('pay_order.check_payment_method'),
						icon: 'none',
						duration: 3000
					});
					const query = uni.createSelectorQuery().in(this);
					query.select('.payment-stay-box').fields({ 
					  size: true, // 获取元素尺寸信息
					  rect: true
					}).exec((res) => {
						uni.pageScrollTo({
							// scrollTop: res[0].top - 200,
							scrollTop: 900,
							duration: 100
						}) 
					});
					return
				}
				//支付中
				if(this.payLoading){
					return false;
				}
				//已经生成订单
				if(this.orderId){
					this.payLoading = true;
					return this.toPayOrder();
				}
				let postData = {
					address_id: this.curAddressData.address_id,
					payment_method: this.currentPay,
					shipping_method: this.current_shipping_method,
				};
				// for(let k in this.billing){
				// 	if(this.billing[k]){
				// 		postData['billing[' + k +']'] = this.billing[k];
				// 	}
				// }
				this.payLoading = true;

				// cf 验证弹窗
				// 如果开启cf验证，则弹出cf验证弹窗
				// #ifdef APP-PLUS 
				if (this.is_interaction) {
					this.payPostData = postData; 
					this.$refs.turnstile_popup.open();
				} else {
					// 没有开启cf验证，直接走支付流程
					this.getCreateOrderDataInfo(postData)
				}
				// #endif
				// #ifdef H5
				this.getCreateOrderDataInfo(postData)
				// #endif
			},
			updateCart(){
				// 这里最好是登录成功返回购物车数量，而不是调取购物车接口
				this.$apis.getCartList().then(res => {
					uni.hideLoading();
					let num = res.data.cart_info ? res.data.cart_info.items_count : 0;
					this.$store.commit('SET_CART_COUNT', num)
					getApp().globalData.getShopCartNum();
				}).catch(() => {
					uni.hideLoading();
				})		
			},
			//订单付款
			toPayOrder(){
				var q = {
					payment_method: this.currentPay,
					order_id: this.orderId
				};
				this.payLoading = true;
				uni.showLoading();
				if(this.payLoading){
					return false;
				}
				this.$apis.payOrderData(q).then((res) => {
					if(res.code == 200){
						var orderData = res.data;
						this.handelPay(orderData);
					} else {
						this.payLoading = false;
						uni.hideLoading();
					}
				}).catch(() => {
					uni.hideLoading();
					this.payLoading = false;
				});
			},
			trackEvent(){
				let items = [];
				this.goodsList.forEach((item, index) => {
					items.push({
						sku: item.sku,
						name: item.name,
						price: item.product_price,
						quantity: item.qty
					});
				})
				let checkout = {
				  currency: this.currency_info.code,
				  value: this.cartInfo.grand_total, // Total Revenue
				  payment_type: this.currentPay,
				  items: items
				}
				this.$trackEvent.place_order(checkout);
			},
			chooseShippingMethod(item){
				item.disabled || item.checked?'':this.initCartInfo({shipping_method:item.shipping_method, callback: () => {
					this.chooseShippingMethodEvent({
						shipping_method: item.shipping_method,
						on_time: this.cartInfo.is_shipping_insurance ? true : false,
						split_packages: (this.package_status == 2 || this.package_status == 3) ? true : false
					});
				}})
				
			},
			chooseShippingMethodPackage(data){
				this.chooseShippingMethodEvent({
					shipping_method: this.current_shipping_method,
					on_time: this.cartInfo.is_shipping_insurance ? true : false,
					split_packages: (data.package_status == 2 || data.package_status == 3) ? true : false
				});
			},
			chooseShippingMethodEvent(data){
				if(data.shipping_method){
					data.shipping_method = data.shipping_method.toLowerCase();
					data.shipping_method = data.shipping_method.split("-")[0];
				}
				this.$trackEvent.choose_shipping_method(data);
			},
			//处理付款
			handelPay(orderData){
				if(this.currentPay == 'pacypay'){
					uni.navigateTo({
						url: '/pages/pay/webview?order_id=' + orderData.order_id +'&payUrl=' + orderData.payData.startUrl
					});
					uni.hideLoading();
					this.payLoading = false;
				}
				else if(this.currentPay == 'paypal_standard'){
					this.paypalPay(orderData);
				}
				else if(this.currentPay == 'stripe'){
					this.stripePay(orderData);
				}
				else {
					uni.redirectTo({
						url: '/pages/order/order-detail?id=' + orderData.order_id
					});
				}
			},
			//payapl付款
			paypalPay(orderData){
				uni.showLoading();
				uni.requestPayment({
					"provider": "paypal", 
					"orderInfo": orderData.payData,
					success: (res) => {
						var rawdata = JSON.parse(res.rawdata);
						this.$apis.paypalCapture({'order_id': orderData.order_id, 'token': rawdata.orderId}).then((cresult) => {
							if(cresult.code == 200){
								uni.redirectTo({
									url: '/pages/pay/success?orderId=' + orderData.order_id,
									success: () => {
										uni.hideLoading();
									}
								});
							} else {
								uni.redirectTo({
									url: '/pages/order/order-detail?id=' + orderData.order_id
								});
								uni.hideLoading();
							}
							
						}).catch((err) => {
							uni.redirectTo({
								url: '/pages/order/order-detail?id=' + orderData.order_id
							});
							uni.hideLoading();
						});
					},
					fail: (err) =>  {
						uni.redirectTo({
							url: '/pages/order/order-detail?id=' + orderData.order_id
						});
						uni.hideLoading();
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
								uni.redirectTo({
									url: '/pages/pay/success?orderId=' + orderData.order_id,
									success: () => {
										uni.hideLoading();
									}
								});
							} else {
								uni.redirectTo({
									url: '/pages/order/order-detail?id=' + orderData.order_id
								});
								uni.hideLoading();
							}
						}).catch((err) => {
							uni.redirectTo({
								url: '/pages/order/order-detail?id=' + orderData.order_id
							});
							uni.hideLoading();
							console.log(err);
						});
					},
					fail: (err) =>  {
						uni.redirectTo({
							url: '/pages/order/order-detail?id=' + orderData.order_id
						});
						uni.hideLoading();
						console.log(err);
					}
				});
			},
			// 购买VIP
			selectBuyVip() {
				this.$apis.selectBuyVIP({ purchase_vip: this.isCheckoutOutInfo.purchase_vip ? 0 : 1 }).then(res => {
					uni.hideLoading()
					if(res.code == 200) {
						this.initCartInfo();
					}
				})
			},
			toArticlePage() {
				this.$public.handleNavTo('/pages/cms/article/article?url_key=app-on-time-guarantee')
			},
			handleClick() {
				if(this.$store.getters.getShowCheckoutLeaveToast && this.coupon_save > 0) {
					this.$refs.popupBestCoupon.open('center')
					this.$store.commit('SET_Show_Checkout_Leave_Toast', false);
					return true;
				} else {
					this.$public.handleGoBack();
				}
			},
			more_savings_button(type){
				this.$maEvent.custom_event({
					event_category: 'checkout',
					event_action: 'more_savings_button',
					event_name: 'more_savings_button',
					module: 'checkout',
					event_data: {
						event_value: type
					}
				});
			},
			security_privacy_button_event(type){
				this.$maEvent.custom_event({
					event_category: 'checkout',
					event_action: 'security_privacy_button',
					event_name: 'security_privacy_button',
					module: 'checkout',
					event_data: {
						event_value: type
					}
				});
			},
			no_stock_window_page_event(){
				this.$maEvent.impression_event({
					event_category: 'checkout',
					event_action: 'no_stock_window_page',
					event_name: 'no_stock_window_page',
					module: 'checkout'
				});
			},
			no_stock_window_button_event(button_name){
				this.$maEvent.custom_event({
					event_category: 'checkout',
					event_action: 'no_stock_window_page',
					event_name: 'no_stock_window_page',
					module: 'checkout',
					event_data: {
						event_value: button_name
					}
				});
			},
			no_marketing_stock_window_page_event(){
				this.$maEvent.impression_event({
					event_category: 'checkout',
					event_action: 'no_stock_window_page',
					event_name: 'no_stock_window_page',
					module: 'checkout'
				});
			},
			no_marketing_stock_window_button_event(button_name){
				this.$maEvent.custom_event({
					event_category: 'checkout',
					event_action: 'no_marketing_stock_window_button',
					event_name: 'no_marketing_stock_window_button',
					module: 'checkout',
					event_data: {
						event_value: button_name
					}
				});
			},
		},
		onPageScroll(e) {
			if (e.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
		},
	};
</script>
<style lang="scss" scoped>
	.order-detail-popup {
		.checkout-popup-content {
			padding-bottom: 0;
			max-height: 95vh;
			overflow-y: auto;
		}
		.order-detail-list-box {
			padding: 20rpx 32rpx;
			.info-box {
				line-height: 52rpx;
				font-size: 24rpx;
				.info-label {
					color: #666666;
				}
				.info-price {
					color: #333333;
				}
				.info-price.is-save-price {
					color: #FF004D;
				}
			}
		}

		.footer-box {
			height: 204rpx;
			padding: 24rpx 32rpx;
			.up-icon {
				width: 48rpx;
				margin-right: 16rpx;
			}
			.to-pay-btn {
				width: unset;
				padding: 0 48rpx;
				text-align: center;
				height: 82rpx;
				line-height: 82rpx;
				background-color: #000;
				font-size: 36rpx;
				color: #fff;
				border-radius: 0;
				margin: 0;
				font-weight: bold;
			}
			.top-price-box {
				font-size: 28rpx;
				margin-bottom: 24rpx;
				font-size: 32rpx;
				.total-label {
					color: #333333;
					margin-right: 16rpx;
				}
				.price {
					font-size: 48rpx;
					color: #FF004D;
				}
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
				padding-bottom: 46rpx;
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
	.container {
		margin-bottom: 120rpx;
	}
	.address-line {
		width: 100%;
		display: block;
	}
	.split-line {
		height: 16rpx;
		background: #f5f5f5;
	}
	.matches-billing {
		.dui-primary-btn {
			height: 84rpx;
			line-height: 84rpx;
			font-weight: normal;
			border-radius: 8rpx;
			margin-bottom: 16rpx;
			font-size: 32rpx;
		}
		.add-new-address-btn {
			border-radius: 8rpx;
			height: 84rpx;
			line-height: 84rpx;
			font-size: 32rpx;
			text-align: center;
			color: #000;
			border: 1px solid #000000;
		}
	}
	.wallet-empty-box {
		padding: 48rpx 0 140rpx 0;
		text-align: center;
		.empty-img {
			width: 400rpx;
		}
		.empty-text {
			color: #666666;
			font-size: 32rpx;
		}
	}
	.checkout-popup-center-content {
		background: #ffffff;
		width: 72vw;
		padding: 40rpx;
		border-radius: 16rpx;
		.checkout-popup-center-header {
			text-align: center;
			position: relative;
			font-size: 32rpx;
			color: #000;
			margin-bottom: 24rpx;
			.close-box {
				position: absolute;
				top: -16rpx;
				right: -16rpx;
				.close {
					width: 36rpx;
				}
			}
		}
		.content-box {
			.desc {
				font-size: 28rpx;
				color: #333;
				line-height: 44rpx;
				text-align: center;
				margin-bottom: 36rpx;
			}
		}
	}
	.checkout-popup-content {
		background: #ffffff;
		padding-bottom: 32rpx;
		border-radius: 32rpx 32rpx 0px 0px;
			max-height: 95vh;
			overflow-y: auto;
		.checkout-popup-header {
			position: relative;
			margin: 0 32rpx;
			font-size: 32rpx;
			color: #333;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #F5F5F5;;
			.close {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				top: 32rpx;
				right: 16rpx;
			}
		}
		.product-list-box {
			max-height: 70vh;
			padding: 0 32rpx;
			overflow-y: auto;
		}
	}
	// shipping-address
	.shipping-address-wrapper {
		background: #fff;
		padding: 48rpx 32rpx 32rpx 32rpx;
		position: relative;
		.address-box {
			flex: 1;
			width: 0;
			display: flex;
			.address-icon {
				width: 48rpx;
				margin-right: 24rpx;
			}
			.current-address {
				flex: 1;
				width: 0;
				.name-tel-box {
					display: flex;
					flex-wrap: wrap;
					.name {
						font-size: 32rpx;
						color: #000;
						margin-right: 24rpx;
					}
					.phone {
						font-size: 28rpx;
						color: #666666;
					}
				}
				.address-street {
					color: #666666;
					font-size: 24rpx;
					margin-top: 12rpx;
					margin-bottom: 12rpx;
				}
				.address-all {
					color: #666666;
					font-size: 24rpx;
				}
			}
		}
		.address-edit {
			margin-left: 8rpx;
			color: #333333;
			font-size: 28rpx;
			text-decoration: underline;
		}
	}
	// 产品列表
	.product-items-box {
		padding:48rpx 0 48rpx 32rpx;
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			padding-right: 32rpx;
			font-size: 28rpx;
			color: #333333;
			.left-box {
				display: flex;
				align-items: center;
				.title {
					font-size: 32rpx;
					margin-right: 16rpx;
			        text-transform: uppercase;
				}
			}
			.action {
				text-decoration: underline;
			}
		}
		.product-items-list {
			.product_imgs_box{
				width: 116rpx;
				display: flex;
			}
		}
	}
	// 节省更多
	.more-savings-box {
		padding:48rpx 32rpx;
		padding-bottom: 6rpx;
		.little-title{
			border-bottom: 1px solid #EEEEEE;
			text-transform: uppercase;
		}
		.more-item-box {
			padding:24rpx 0;
			border-bottom: 1px dashed #EEEEEE;
			.item-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.t-left {
					font-size: 32rpx;
					color: #333333;
				}
				.t-right {
					color:#FF004D;
					font-size: 28rpx;
					display:flex;
					align-items: center;
					.right-icon {
						width: 48rpx;
					}
				}
			}
			.item-bottom {
				font-size: 24rpx;
				padding-right: 48rpx;
				color: #666666;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 6rpx;
			}
		}
		.more-item-box:last-child {
			border-bottom: 0;
		}
	}
	// 付款
	.payment-box {
		padding:48rpx 32rpx;
		.little-title{
			border-bottom: 1px solid #EEEEEE;
		}
		.billing-address-box {
			padding: 36rpx 0;
			border-bottom: 1px dashed #EEEEEE;
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin-bottom: 20rpx;
				.action {
					color: #333;
					text-decoration: underline;
				}
			}
			.address-box {
				background: #F2F7FF;
				padding: 12rpx 28rpx;
				font-size: 24rpx;
				color: #666;
				.name-tel-box {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					margin-bottom: 14rpx;
					.name {
						color: #000;
						margin-right: 32rpx;
					}
				}
				.address-all,.address-street {
					line-height: 44rpx;
				}
			}
		}
		.payment-stay-box {
			.header {
				color: #333333;
				font-size: 28rpx;
				margin-bottom: 20rpx;
				padding-top: 24rpx;
			}
			.pay-methods-box {
				.method-item:last-child {
					margin-bottom: 0;
				}
				.method-item {
					display: flex;
					margin-bottom: 32rpx;
					.pay-radio-box {
						width: 48rpx;
						margin-right: 24rpx;
						.radio {
							width: 48rpx;
							height: 48rpx;
						}
					}
					.content-box {
						.pay-label-box {
							display: flex;
							align-items: center;
							font-size: 28rpx;
							color: #333333;
							margin-bottom: 16rpx;
							flex-wrap: wrap;
							.pay-label-img {
								height: 60rpx;
								margin-right: 24rpx;
								image {
									height: 60rpx;
								}
							}
							.pay-label {
								display: flex;
								align-items: center;
								.question-icon {
									width: 48rpx;
								}
							}
						}
						.pay-support-images {
							display: flex;
							flex-wrap: wrap;
							.pay-support {
								height: 40rpx;
								margin-right: 8rpx;
							}
						}
					}
				}
			}
		}
	}
	.add-addres {
		width: 100%;
	}
	.little-title {
		font-size: 32rpx;
		color: #000;
		padding-bottom: 24rpx;
		position: relative;
	}

	.item-box {
		padding: 24rpx;
		font-size: 28rpx;
	}

	.shipping-method-box {
		padding: 48rpx 32rpx 48rpx 32rpx;
		.little-title{
			text-transform: uppercase;
		}
		.shipping-method-list {
			.method-item-box:last-child {
				margin-bottom:0;
			}
			.method-item-box {
				display: flex;
				border-radius: 16rpx;
				border: 1px solid #DDDDDD;
				padding: 20rpx 16rpx 24rpx 40rpx;
				margin-bottom: 16rpx;
				.method-radio-box {
					margin-right: 24rpx;
					display: flex;
					align-items: center;
					.radio {
						width: 48rpx;
					}
				}
				.method-detail-box {
					flex: 1;
					width: 0;
					.method-name {
						font-size: 30rpx;
						color: #333333;
						height: 52rpx;
						line-height: 52rpx;
					}
					.method-tip {
						font-size: 24rpx;
						color: #333333;
						height: 52rpx;
						line-height: 52rpx;
					}
					.method-ageing {
						font-size: 24rpx;
						color: #198055;
					}
				}
			}
		}
		.split-package-box {
			display: flex;
			margin-top: 32rpx;
			padding-left: 40rpx;
			.split-checkbox {
				margin-right: 24rpx;
				.checkbox {
					width: 48rpx;
				}
			}
			.split-details-box {
				.split-tip-title {
					font-size: 28rpx;
					color: #333333;
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					.tip-icon {
						width: 48rpx;
					}
				}
				.split-tip-text {
					font-size: 24rpx;
					color: #666666;
					line-height: 36rpx;
				}
			}
		}
	}
	
	.payment-methods-box {
		.pay-box {
			color: #333333;
			font-size: 28rpx;
			padding: 26rpx 24rpx;
			.icon-radio-check {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				border: 1px solid #cccccc;
				margin-right: 24rpx;
			}
			.icon-radio-checked {
				font-size: 34rpx;
				color: #000;
				margin-right: 24rpx;
			}
			.icon-radio-checked:before {
				content: "\E6C2";
			}
		}
		.support-images {
			margin-top: 10rpx;
			image {
				width: 80rpx;
				margin-right: 10rpx;
			}
		}
	}

	.discount-box .discount .coupon-available {
		padding: 5rpx 20rpx;
		background: #FF575c;
		font-size: 18rpx;
		color: #fff;
		margin-left: 13.5rpx;
	}

	.order-total-box {
		padding-bottom: 204rpx;
		.little-title {
			padding-top: 48rpx;
			margin: 0 32rpx;
			border-bottom: 1px solid #EEEEEE;
		}
		.order-info-box {
			padding-top: 12rpx;
			.info-box {
				padding: 24rpx 0;
				margin: 0 32rpx;
				color: #666666;
				font-size: 28rpx;
				border-bottom: 1px dashed #EEEEEE;
				.info-price {
					color: #333333;
				}
				.save-price {
					color: #FF004D;
				}
				.show-switch-box {
					display: flex;
					align-items: center;
					.save-price {
						color: #FF004D;
						margin-right: 24rpx;
					}
					::v-deep {
						uni-switch .uni-switch-wrapper {
							transform:scale(0.9);
						}
						uni-switch .uni-switch-input {
							margin-right: 0;
						}
					}
				}
			}
			.info-box.reward-points {
				border-bottom: 0;
				font-size: 24rpx;
				.question-icon {
					width: 48rpx;
				}
			}
		}
	}

	form {
		width: 100%;
	}

	.goods-list {
		.a-goods:last-child {
			.product-item-detail-box {
				border-bottom: 0;
			}
		}
		.a-goods {
			display: flex;
			padding-top: 12rpx;
			.img-box {
				width: 174rpx;
				margin-right: 32rpx;
				padding-bottom: 12rpx;
				position: relative;
				.only_offos{
					position: absolute;
					bottom: 20rpx;
					left: 0;
					width: 100%;
					display: flex;
					justify-content: center;
					.only_offos_in{
						width: 170rpx;
						height: 31rpx;
						background: #FFF9EF;
						border-radius: 4rpx ;
						display: flex;
						align-items: center;
						image{
							width: 30.77rpx;
						}
						text{
							width: 106rpx;
                            height: 30.77rpx;
							font-size: 16rpx;
							color: #FF5C00;
							margin-left: 5rpx;
							display: flex;
							align-items: center;
							font-weight: bold;
						}
					}
				}
				.img {
					width: 100%;
					display: block;
				}
			}
			.product-item-detail-box {
				flex: 1;
				width: 0;
				padding-bottom: 12rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				border-bottom: 1px solid #F5F5F5;
				font-size: 24rpx;
				color: #333333;
				.goods-name {
					line-height: 44rpx;
				}
				.goods-label {
					display: flex;
					line-height: 48rpx;
					.option_label {
						color: #666666;
					}
					.option_value {
						margin-left: 14rpx;
						margin-right: 32rpx;
					}
				}
				.bottom {
					font-size: 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.goods-price {
						display: flex;
						align-items: center;
						.line-price {
							font-size: 24rpx;
							color: #999999;
							text-decoration: line-through;
							margin-left: 8rpx;
						}
					}
				}
			}
			
		}
	}
	.footer {
		width: 100%;
		height: 204rpx;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		z-index: 10;
		.footer-box {
			position: relative;
			padding: 24rpx 32rpx;
			.up-icon {
				width: 48rpx;
				margin-right: 16rpx;
			}
			.to-pay-btn {
				width: unset;
				padding: 0 48rpx;
				text-align: center;
				height: 82rpx;
				line-height: 82rpx;
				background-color: #000;
				font-size: 36rpx;
				color: #fff;
				border-radius: 0;
				margin: 0;
				font-weight: bold;
			}
			.top-price-box {
				font-size: 28rpx;
				margin-bottom: 24rpx;
				font-size: 32rpx;
				.total-label {
					color: #333333;
					margin-right: 16rpx;
				}
				.price {
					font-size: 48rpx;
					color: #FF004D;
				}
			}
			
		}
	}

	// 地址弹窗
	.address-list-popup {
		.address-filter-box {
			display: flex;
			justify-content: space-between;
			background: #F5F5F5;
			padding: 0 32rpx;
			padding-top: 16rpx;
			.search-box {
				flex: 1;
				margin-right: 16rpx;
				position: relative;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 8rpx 0px rgba(0,0,0,0.05);
				border-radius:66rpx;
				padding: 0 100rpx 0 32rpx;
				display: flex;
				align-items: center;
				uni-input {
					width: 100%;
					font-size: 28rpx;
					color: #333;
				}
				.search-icon {
					width: 48rpx;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					right: 32rpx;
				}
				.clear-icon {
					width: 36rpx;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					right: 104rpx;
				}
			}
			.sort-icon-box {
				background: #fff;
				border-radius: 50%;
				width: 72rpx;
				height: 72rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.sort-icon {
					width: 48rpx;
				}
			}
		}
		.checkout-popup-content {
			padding-bottom: 0;
			max-height: 95vh;
			overflow-y: auto;
		}
		.address-list {
			background: #F5F5F5;
			padding: 16rpx 32rpx 0 32rpx;
			max-height: 50vh;
			overflow-y: auto;
			.address-item-box {
				background: #fff;
				border-radius: 8rpx;
				margin-bottom: 16rpx;
				color: #666666;
				font-size: 28rpx;
				.t-box {
					padding: 24rpx 32rpx;
					border-bottom: 1px dashed #EEEEEE;
					align-items: center;
					.t-l-box {
						flex: 1;
						width: 0;
						.name-phone-box {
							display: flex;
							align-items: center;
							margin-bottom: 12rpx;
							.name {
								margin-right: 24rpx;
								color: #000;
								font-size: 32rpx;
								.first-name {
									margin-right: 8rpx;
								}
							}
						}
						.address-all,.street1 {
							line-height: 44rpx;
						}
					}
					.t-r-box {
						margin-left: 32rpx;
						.address-radio {
							width: 48rpx;
							.radio {
								width: 48rpx;
							}
						}
					}
				}
				.b-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 24rpx 32rpx;
					font-size: 32rpx;
					.b-r-box {
						text-decoration: underline;
						color: #333333;
					}
				}
			}
		}
		.address-list-footer {
			padding: 24rpx 32rpx;
			.dui-primary-btn {
				height: 84rpx;
				line-height: 84rpx;
				margin-bottom: 16rpx;
				font-size: 36rpx;
			}
			.add-new-address {
				height: 84rpx;
				line-height: 84rpx;
				border: 1px solid #333;
				font-size: 36rpx;
				color: #333;
				text-align: center;
			}
		}
	}
	// 优惠券弹窗
	.coupon-popup {
		.checkout-popup-content {
			padding-bottom: 0;
			max-height: 95vh;
			overflow-y: auto;
		}
		.coupon-tabs {
			font-size: 32rpx;
			border-bottom: 1px dashed #EEEEEE;
			margin-bottom: 16rpx;
			.tab-item.on {
				color: #333333;
			}
			.tab-item.on::after {
				content: "";
				position: absolute;
				left: 20rpx;
				right: 20rpx;
				bottom: 0;
				display: block;
				background-color: #333333;
				height: 4rpx;
			}
			.tab-item {
				color: #666666;
				height: 88rpx;
				line-height: 88rpx;
				position: relative;
			}
		}
		.time-filter-box {
			margin-bottom: 16rpx;
			display: flex;
			justify-content: center;
			font-size: 28rpx;
			.filter {
				background: #FFFFFF;
				box-shadow: 0px 4rpx 8rpx 0px rgba(0,0,0,0.05);
				border-radius: 66rpx;
				border: 1px solid #DDDDDD;
				display: flex;
				justify-content: center;
				color: #666666;
				overflow: hidden;
				.time-filter-item.left {
					padding: 12rpx 34rpx;
					padding-right: 18rpx;
				}
				.time-filter-item.right {
					padding: 12rpx 34rpx;
					padding-left: 18rpx;
				}
				.time-filter-item.on {
					background: #007AFF;
					color: #fff;
				}
			}
		}
		.cart-coupon-box {
			height: 46vh;
			overflow-y: auto;
			.coupon-lists {
				width: 100vw;
				padding: 0 24rpx;
				.coupon-empty-box {
					text-align: center;
					padding-top: 6vh;
					padding-bottom: 10vh;
					.empty-img {
						width: 23vh;
					}
					.empty-text {
						color: #666666;
						font-size: 32rpx;
					}
				}
			}
			.exchange-box {
				.cut-line {
					width: 100%;
					color: #999;
					font-size: 24rpx;
					margin-bottom: 20rpx;
					padding:0  24rpx;
					.px-2 {
						padding: 0 10rpx;
					}
					i {
						flex: 1;
						background: #ccc;
						display: block;
						width: 100%;
						height: 1px;
					}
				}
			}
		}
		.coupon-footer-box {
			padding: 32rpx;
			.top {
				display: flex;
				justify-content: space-between;
				color: #666666;
				font-size: 32rpx;
				margin-bottom: 24rpx;
				.right {
					display: flex;
					.save {
						color: #333333;
						margin-right: 16rpx;
					}
					.save-price {
						color: #FF004D;
					}
				}
			}
			.dui-primary-btn {
				height: 84rpx;
				line-height: 84rpx;
				font-size: 36rpx;
			}
		}
	}
	.apply-common-popup{
		.popup-content {
			width: 100vw;
			height: 100%;
			.apply-header {
				padding: 24rpx;
				font-size: 36rpx;
				color: #333333;
				box-shadow: 0 1px 2px rgba(0,0,0,.08);
				.icon-closed {
					font-size: 40rpx;
					color: #666666;
					margin-right: 60rpx;
				}
				.icon-question-fill {
					color: #666666;
				}
			}
		}
	}
	.best-coupon-box {
		background: #fff url('@/static/images/coupon/checkout_retainalert_promtionbg.png') no-repeat;
		background-size: 100%;
		.close-icon {
			text-align: right;
			font-size: 46rpx;
			color: #999999;
		}
		.close-icon::before {
			content: "\E6AB";
		} 
		.title {
			font-size: 48rpx;
			color: #fa6338;
			text-align: center;
		}
		.discounted-price {
			text-align: center;
			color:#fa6338;
			font-size: 70rpx;
			margin-bottom: 20rpx;
		}
		.description {
			font-size: 28rpx;
			color:#000;
			text-align: center;
			line-height: 1.3;
		}
		.btn-wrapper {
			text-align: center;
		}
		.continue-checking-out-btn,
		.apply-this-coupon-btn {
			position: relative;
			min-width: 480rpx;
			background:#000;
			color:#fff;
			text-align: center;
			display: inline-block;
			font-size: 32rpx;
			padding: 0 48rpx;
			height: 88rpx;
			line-height: 88rpx;
			margin-top: 40rpx;
			margin-bottom: 40rpx;
			text-transform: uppercase;
			cursor: pointer;
		}
		.leave-now-btn {
			text-align: center;
			color:#2d68a8;
			cursor: pointer;
			font-size: 28rpx;
		}
	}
	.tip-box {
		padding: 28rpx;
		.tip-title {
			text-align: center;
			font-weight: bold;
			font-size: 36rpx;
			margin-bottom: 30rpx;
		}
		.content {
			font-size: 28rpx;
			line-height: 1.5;
		}
		.content.point-tip-content {
			text-align: center;
			padding: 40rpx 0;
			font-weight: bold;
			font-size: 32rpx;
		}
		.close-btn {
			height: 96rpx;
			text-align: center;
			color: #fff;
			background: #000;
			line-height: 96rpx;
			margin-top: 32rpx;
		}
	}
	.points-apply-popup {
		.points-empty-box {
			padding: 80rpx 0 290rpx 0;
			text-align: center;
			.empty-img {
				width: 400rpx;
			}
			.empty-text {
				color: #666;
				font-size: 32rpx;
			}
		}
		.checkout-popup-content {
			padding-bottom: 0;
			max-height: 95vh;
			overflow-y: auto;
		}
		.popup-content {
			padding: 32rpx;
			.total,.max-available {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				padding-bottom: 32rpx;
				.label {
					color: #333333;
					margin-right: 8rpx;
				}
				.value {
					color: #666666;
				}
			}
			.max-available {
				flex-direction: column;
				align-items: start;
				.available-tips {
					margin-top: 10rpx;
					font-size: 23rpx;
					color: #999999;
					line-height: 46rpx;
				}
			}
			.use-points-options {
				.point-item-box.border-bottom-none {
					border-bottom: 0 !important;
				}
				.point-item-box:last-child {
					border-bottom: 1px dashed #EEEEEE;
				}
				.point-item-box {
					display: flex;
					align-items: center;
					padding: 28rpx 0;
					border-top: 1px dashed #EEEEEE;
					color: #333333;
					font-size: 32rpx;
					.point-radio {
						margin-right: 32rpx;
						.radio {
							width: 48rpx;
							display: block;
						}
					}
				}
			}
			.apply-input-box {
				position: relative;
				input {
					background: #ffffff;
					height: 96rpx;
					padding: 0 60rpx 0 32rpx;
					border: 1px solid #DDDDDD;
				}
			}
			.apply {
				margin-top: 232rpx;
				background: #000;
				color: #fff;
				text-align: center;
				height: 84rpx;
				line-height: 84rpx;
				font-size: 36rpx;
			}
			.points-exchange-ratio {
				color: #666666;
				font-size: 24rpx;
				margin-top: 8rpx;
			}
		}
	}
	.apply-common-main {
		padding: 0 24rpx;
		.max-available {
			padding-top: 48rpx;
			color: #333333;
			font-size: 32rpx;
		}
		.apply-input-box {
			position: relative;
			input {
				background: #ffffff;
				height: 96rpx;
				margin-top: 24rpx;
				padding: 0 164rpx 0 70rpx;
				border: 1px solid #DDDDDD;
			}
			.money {
				position: absolute;
				left: 34rpx;
				top: 0;
				height: 96rpx;
				line-height: 96rpx;
				color: #000;
				font-size: 28rpx;
			}
			.apply-all {
				position: absolute;
				right: 34rpx;
				top: 0;
				height: 96rpx;
				line-height: 96rpx;
				color: #0071E3;
				font-size: 28rpx;
			}
			.apply-clear-box {
				position: absolute;
				right: 34rpx;
				top: 0;
				height: 96rpx;
				line-height: 96rpx;
				.apply-clear {
					height: 30rpx;
					width: 30rpx;
					border-radius: 50%;
					line-height: 30rpx;
					text-align: center;
					display: inline-block;
					font-size: 28rpx;
					background-color: #cccccc;
					color: #ffffff;
				}
			}
		}
		.apply {
			margin-top: 400rpx;
			background: #000;
			color: #fff;
			text-align: center;
			height: 84rpx;
			line-height: 84rpx;
			font-size: 36rpx;
		}
	}
	.points-box {
		.real-use-point-box {
			text-align: right;
			.point-cost{
				color: #fd4d4d;
			}
		}
	}
	.payment-security {
		font-size: 24rpx;
		padding: 40rpx 32rpx;
		.title {
			color: #198055;
			margin-bottom: 20rpx;
			font-size: 32rpx;
			image {
				width: 48rpx;
				margin-right: 20rpx;
			}
		}
		.content {
			color: #666666;
			line-height: 36rpx;
		}
		.pay-logo-box {
			margin-top: 20rpx;
			margin-bottom: 32rpx;
			image {
				height: 62rpx;
				margin-bottom: 16rpx;
				margin-right: 16rpx;
			}
		}
	}
	
	.terms-privacy-box {
		background: #F5F5F5;
		margin-top: 20rpx;
		padding: 40rpx 32rpx 132rpx 32rpx;
		color: #666666;
		font-size: 24rpx;
		line-height: 36rpx;
		.a-link {
			color: #2d68a8;
		}
	}
	.has-coupon-applied-tip {
		image {
			width: 65rpx;
			height: 65rpx;
		}
		color: #fff;
		background: #554e4e;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 24rpx;
	}
	.logistics-timeliness.px-0 {
		padding-left: 0;
		padding-right: 0;
	}
	.logistics-timeliness {
		font-size: 24rpx;
		color: #000000E6;
		padding: 8rpx 24rpx;
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
	.order-timely-insurance-box {
		display: flex;
		padding-left: 40rpx;
		margin-top: 32rpx;
		align-items: center;
		.timely-checkbox {
			margin-right: 24rpx;
			.checkbox {
				width: 48rpx;
				display: block;
			}
		}
		.timely-detail {
			font-size: 28rpx;
			color: #333;
			display: flex;
			align-items: center;
			.shipping_insurance_total {
				margin-left: 8rpx;
			}
			.tip-icon {
				width: 48rpx;
			}
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
	::v-deep .shipping-method-box {
		.dui-select-list-box{
			.select-item {
				padding-top: 10rpx;
				border-bottom: 1px solid #e2e2e2;
				padding-bottom: 10rpx;
				&:first-child{
					padding-top: 0px;
				}
			}
			.select-item.on {
				.select-item-label {
					color: #222;
				}
			}
		}
	}
	// 购买VIP
	.checkout-vip-card {
		background: rgba(255,216,195,.3);
	}
	.vip-card-header {
		align-items: center;
		font-weight: 700;
		font-size: 32rpx;
		color: #8e460d;
		background: linear-gradient(90deg,rgba(255,216,195,0.8) 33.48%,rgba(255,216,195,0.3));
		display: flex;
		padding: 14rpx 10rpx;
		.vip-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 10rpx;
		}
	}
	.vip-card-body {
		color: #873c00;
		font-weight: 700;
		padding: 20rpx 20rpx 0;
		font-size: 28rpx;
	}
	.vip-card-body-left {
		width: 220rpx;
		display: flex;
		align-items: center;
	}
	.vip-card-body-right {
		background: #f7d0b2;
		padding: 20rpx;
		border-radius: 10rpx;
		position: relative;
		flex: 1;
	}
	.vip-card-body-right .vip-card-body-right-item  {
		width: 50%;
		padding: 10rpx 0;
		flex-direction: column;
	}
	.vip-card-body-right .iconfont3 {
		font-size: 50rpx;
	}
	.vip-vard-right-icon {
		position: absolute;
		right: 6rpx;
		top: 6rpx;
		font-size: 24rpx;
		font-weight: 700;
	}
	.vip-card-footer {
		padding: 20rpx;
		font-size: 24rpx;
	}
	.vip-card-left-block {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.paypal-standard-tip {
		font-size: 24rpx;
		margin-left: 56rpx;
	}
	// 选中优惠券,离开页面弹窗提示
	.leave-coupon-toast-content {
		padding-bottom: 42rpx;
		>view{
			position: relative;
			color: #fff;
			text-align: center;
		}
		.leave-toast-bg-img {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
		.leave-toast-title {
			border-top: 1px solid #fff;
			border-bottom: 1px solid #fff;
			width: 330rpx;
			margin: 76rpx auto 0;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 56rpx;
		}
		.leave-toast-money {
			line-height: 90rpx;
			margin-bottom: 18rpx;
			.leave-toast-line{
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%,0);
				height: 1px;
				background: #fff;
				width: 100rpx;
			}
		}
		.leave-toast-btn {
			background: #000;
			width: 488rpx;
			height: 84rpx;
			line-height: 84rpx;
			border-radius: 8rpx;
			margin: 76rpx auto 0;
		}
		.leave-toast-close-btn {
			position: absolute;
			width: 80rpx;
			height: 80rpx;
			right: 0;
			top: 0;
			z-index: 2;
		}
		.leave-toast-content-txt {
			margin: 0 54rpx;
		}
	}
	.free-shipping-bg {
		height: 52rpx;
		width: 230rpx;
	}
	.free-shipping-question {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		top: 0;
		right: 0;
	}
	.free-shipping-text {
		position: absolute;
		right: 48rpx;
		font-size: 20rpx;
		color: #198055;
		height: 52rpx;
		line-height: 52rpx;
		z-index: 9;
	}	
	.free-ship-close {
		position: absolute;
		width: 36rpx;
		height: 36rpx;
		right: -96rpx;
		top: -28rpx;
	}
	.method-price {
		text-align: right;
		height: 52rpx;
		line-height: 52rpx;
	}
	.method-price-free {
		color: #999999 !important;
		text-decoration: line-through;
	}
	.org_price_pop{
		font-size: 32rpx;
        color: #FF5C00;
		font-weight: 550;
	}
	.ConfirmationPromptBan {
    .payConfirmationboxIn {
        width: 646rpx;
        height: 754rpx;
        background: #FFFFFF;
        border-radius: 8rpx;
    }

    .ConfirmationPromptBox {
        padding: 32.69rpx 0;

        .ConfirmationTxt {
            width: 100%;
            height: 46rpx;
            line-height: 46rpx;
            font-family: Jost, Jost;
            font-size: 31rpx;
            color: #000000;
            text-align: center;
            margin-bottom: 23.08rpx;
        }

        .ConfirmationTxtContent {
            margin-top: 10rpx;
            width: 100%;
            height: 85rpx;
            font-family: Jost, Jost;
            font-weight: 400;
            font-size: 27rpx;
            color: #333333;
            line-height: 42rpx;
            text-align: center;
        }
		.ConfirmationTxtContentMarket{
			margin: 0 auto;
			width: 95%;
            height: 85rpx;
            font-family: Jost, Jost;
            font-weight: 400;
            font-size: 27rpx;
            color: #333333;
            line-height: 32rpx;
            text-align: center;
		}

        .ConfirmateTViewList {
            width: 569rpx;
            height: 250rpx;
            margin: 30rpx auto 0;
            overflow-x: scroll;
        }
		.ConfirmateTViewListMarket{
			width: 569rpx;
            height: 250rpx;
            margin: 50rpx auto 0;
            overflow-x: scroll;
		}

        .current_page {
            width: 108rpx;
            height: 38rpx;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 29rpx;
            margin: 15rpx auto 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.current_page_in{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 54rpx;
				font-family: Jost, Jost;
				font-size: 27rpx;
				color: #FFFFFF;
			}
        }
		.current_page_mark{
			width: 108rpx;
            height: 38rpx;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 29rpx;
            margin: 15rpx auto 15rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.current_page_in{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 54rpx;
				font-family: Jost, Jost;
				font-size: 27rpx;
				color: #FFFFFF;
			}
		}

        .recode_btn {
            display: flex;
            flex-flow: column;
            align-items: center;
			text-transform: uppercase;


            .confirm_btn {
                width: 569rpx;
                height: 81rpx;
                background: #000000;
                border-radius: 4rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Jost, Jost;
                font-size: 31rpx;
                color: #FFFFFF;
            }

            .cancel_btn {
                width: 569rpx;
                height: 81rpx;
                border-radius: 4rpx;
                border: 2rpx solid #000000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Jost, Jost;
                font-size: 31rpx;
                font-size: #000000;
                margin-top: 24rpx;
            }

        }
    }
}
.item_scoops{
	width: 480rpx;
	height: 231rpx;
	background: #F5F5F5;
	border-radius: 8rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
	.imgUrl_swiper{
		width: 156rpx;
        height: 208rpx;
		margin-left: 15rpx
	}
	image{
		width: 156rpx;
        height: 208rpx;
	}
	.item_rig{
		flex: 1;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
		height: 100%;
		.top_item{
			display: flex;
			flex-flow: column;
			align-items: flex-start;
			margin-left: 15rpx;
			margin-top: 10rpx;
			.item_title{
				width: 260rpx;
				height: 42rpx;
				font-family: Jost, Jost;
				font-size: 27rpx;
				color: #000000;
				line-height: 42rpx;
				overflow: hidden; 
				white-space: nowrap;      
				overflow: hidden;   
				text-overflow: ellipsis; 
			}
			.goods_label{
				height: 42rpx;
				font-family: Jost, Jost;
				font-size: 24rpx;
				color: #666666;
				line-height: 42rpx;
				display: flex;
				block{
				font-size: 24rpx;
				display: flex;
				align-items: center;
				}
			}
		}
		.item_bottom{
			display: flex;
			justify-content: space-between;
			margin-left: 15rpx;
			margin-bottom: 10rpx;
			.vip-member-price{
				height: 42rpx;
				font-family: Jost, Jost;
				font-size: 31rpx;
				font-weight: bold;
				color: #000000;
				line-height: 42rpx;
			}
			.goods-num{
				width: 33rpx;
				height: 42rpx;
				font-family: Jost, Jost;
				font-size: 31rpx;
				color: #000000;
				line-height: 42rpx;
				margin-right: 15rpx;
				font-weight: bold;
			}
		}
	}
}
.option_label_pos{
	margin-right: 10rpx
}
.product_imgs_in{
	position: relative;
	width: 156rpx;
	margin-right: 16rpx;
	.only_offos{
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				display: flex;
				justify-content: center;
				.only_offos_in{
					width: 156rpx;
                    height: 31rpx;
					background: #FFF9EF;
					display: flex;
					align-items: center;
					image{
						width: 30.77rpx;
					}
					text{
						width: 106rpx;
						height: 30.77rpx;
						font-size: 16rpx;
						color: #FF5C00;
						margin-left: 5rpx;
						display: flex;
						align-items: center;
						font-weight: bold;
					}
				}
				}
	.product-img {
		width: 156rpx;
		display: inline-block;
	}
	.special-price-offos{
		position: absolute;
		top: 0;
		left: 0px;
		width: 92rpx;
		z-index: 99;
		height: 35rpx;
		font-size: 27rpx;
		color: #FFFFFF;
		background-size:cover;
		background-position: center;
		padding-left: 10rpx;
		display: flex;
		align-items: center;
	}

}
.swiper-box{
	height: 245rpx;
}
</style>
