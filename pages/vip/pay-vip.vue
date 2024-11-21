<template>
	<view class="dui-padding-top-header">
		<pageHeader :title="$t('pay_order.place_order')"></pageHeader>
		<view class="container">
			<form @submit="createOrder" :report-submit="true">
				<view class="little-title border-bottom-1px">{{$t('pay_order.billing_address')}}</view>
				<view class="address-wrapper flex justify-content-between no-wrap align-items-center">
					<view class="iconfont2 icon-address"></view>
					<view class="address-box">
						<view class="show-address" v-if="curAddressData" @tap="$public.handleNavTo('/pages/address/add?fromWhichPage=vipPage&addressType=billing&id='+curAddressData.address_id)">
							<view class="name-tel">{{ curAddressData.linkMan }} {{ curAddressData.mobile }}</view>
							<view class="addr-text">{{ curAddressData.address }}</view>
						</view>
					</view>
					<view class="iconfont icon-goto"></view>
				</view>
				<view class="split-line"></view>
				<view class="payment-methods-box">
					<view class="little-title border-bottom-1px">{{$t("pay_order.payment_methods")}}</view>
					<view v-if="paymentMethodData.length">
						<view @click="currentPay = pay.key" class="pay-box flex align-items-center"
							v-for="(pay,index) in paymentMethodData" :key="index">
							<view class="iconfont"
								:class="currentPay == pay.key?'icon-radio-checked':'icon-radio-check'"></view>
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
				<view class="split-line"></view>
				<view class="order-total-box">
					<view class="little-title border-bottom-1px">{{$t("pay_order.order_total")}}</view>
					<view class="order-info-box">
						<view class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.subtotal")}}</view>
							<view class="info-price">{{currency_info.symbol}}{{priceInfo.product_total}}</view>
						</view>
						<view class="info-box flex align-items-center justify-content-between">
							<view class="info-label">{{$t("pay_order.grand_total")}}</view>
							<view class="info-price">{{currency_info.symbol}}{{priceInfo.grand_total}}</view>
						</view>
					</view>
				</view>

				<view class="footer page-max-width">
					<view class="footer-box border-top-1px flex justify-content-between">
						<view class="left-price flex flex-column justify-content-center">
							<view class="total-label">{{$t("pay_order.all")}}:</view>
							<view class="price">{{ currency_info.symbol }}{{ priceInfo.grand_total }}</view>
						</view>
						<button class="to-pay-btn" formType="submit">{{ $t("pay_order.place_order") }}</button>
					</view>
				</view>
			</form>
		</view>
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
	import crypto from  "@/common/crypto.js";
	import $config from  "@/config.js";
	//获取应用实例
	var app = getApp();
	export default {
		data() {
			return {
				tipContent:'',
				currentShippingMethodIndex: 0,
				shippingMethodData: [],
				paymentMethodData: [],
				priceInfo: {
					product_total: "",
					base_coupon_cost: "",
					grand_total: ""
				},
				currency_info: {
					symbol: ""
				},
				currentPay: "",
				curAddressData: {
					address_id:'',
					linkMan: '',
					mobile: '',
					address: ''
				},
				isLoad: false,
			};
		},
		onShow: function() {
			var that = this;
			var shopList = [];
			if(this.$store.getters.hasLogin && this.isLoad){
				this.initCartInfo();
			}
		},
		onLoad: function(e) {
			var that = this;
			this.initCartInfo();
		},
		methods: {
			initCartInfo() {
				let platform = '';
				// #ifdef APP-PLUS
				platform = uni.getSystemInfoSync().platform;
				// #endif
				this.$apis.getVipOnepage({
					platform: platform
				}).then(res => {
					this.isLoad = true;
					if (!res.data.default_address || !res.data.default_address.address_id) {
						this.$public.handleNavTo('/pages/address/add?backType=vipNoAddress&fromWhichPage=vipPage&addressType=billing')
					}
					let addressKeyArr = ["street1", "street2", "city", "state", "country", "zip"]
					let address = res.data.default_address || {};
					let addressArr = []
					addressKeyArr.forEach(item => {
						if (address[item]) {
							addressArr.push(address[item])
						}
					})
					let curAddressData = {
						address: addressArr.join(', '),
						linkMan: address.first_name + " " + address.last_name,
						mobile: address.telephone,
						address_id: address.address_id
					};

					let cart_info = res.data.cart_info;

					let payment = res.data.payments
					let paymentArr = []
					for (let key in payment) {
						paymentArr.push({
							...payment[key],
							key: key
						})
					}
					
					let platform = uni.getSystemInfoSync().platform;
					if(platform == 'ios'){
						
					}
					this.setData({
						curAddressData: curAddressData,
						paymentMethodData: paymentArr,
						priceInfo: {
							...res.data.cart_info
						},
						currency_info: {
							...res.data.currency_info
						}
					})
					if(!this.currentPay){
						this.currentPay = res.data.current_payment_method;
					}
					uni.hideLoading()
				}).catch((err) => {
					this.isLoad = true;
				})
			},
			//创建订单
			createOrder(e) {
				let postData = {
					payment_method: this.currentPay,
				};
				uni.showLoading();
				this.$apis.createVipOrder(postData).then(res => {
					uni.hideLoading();
					if(res.code == 200){
						var orderData = res.data;
						this.handelPay(orderData);
					}
				}).catch(() => {
					uni.hideLoading();
				})
			},
			//处理付款
			handelPay(orderData){
				if(this.currentPay == 'pacypay'){
					uni.navigateTo({
						url: '/pages/pay/webview?order_id=' + orderData.order_id +'&payUrl=' + orderData.payData.startUrl
					});
				}
				else if(this.currentPay == 'paypal_standard'){
					this.paypalPay(orderData);
				}
				else if(this.currentPay == 'stripe'){
					this.stripePay(orderData);
				}
				else if(this.currentPay == 'apple'){
					this.applePay(orderData);
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
						this.$apis.vipPaypalCapture({'order_id': orderData.order_id,'token': rawdata.orderId}).then((cresult) => {
							if(cresult.code == '200'){
								uni.redirectTo({
									url: '/pages/vip/success'
								});
							}
						}).catch((err) => {
							
						});
					},
					fail: (err) =>  {
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
						this.$apis.vipStripeReview({'order_id': orderData.order_id, 'paymentId': orderData.payData.paymentId}).then((cresult) => {
							uni.hideLoading();
							if(cresult.code == '200'){
								uni.redirectTo({
									url: '/pages/vip/success'
								});
							}
						}).catch((err) => {
							console.log(err);
						});
					},
					fail: (err) =>  {
						console.log(err);
						uni.hideLoading();
					}
				});
			},
			applePay(orderData){
				uni.showLoading();
				var that = this;
				var product_id = 'vip_pay_1';
				var iap = null;  //保存应用内支付对象
				plus.payment.getChannels(function(channels){
				    for (var i in channels) {
				        var channel = channels[i];
				        // 获取 id 为 'appleiap' 的 channel  
				        if (channel.id === 'appleiap') {
				            iap = channel;
				        }
						// ids 数组中的项为 App Store Connect 配置的内购买项目产品ID（productId）
						var ids = [product_id];
						// iap 为应用内支付对象 
						iap.requestOrder(ids, function(e) {  
						   that.applePayment(orderData, product_id);
						}, function(e) {
							uni.hideLoading();
						    // 获取订单信息失败回调方法  
						    console.log('requestOrder failed: ' + JSON.stringify(e));
						});
				    }
				  }, function(e){
					uni.hideLoading();
				    console.log("获取iap支付通道失败：" + e.message);
				});
			},
			applePayment(orderData, product_id){
				uni.requestPayment({
					provider: 'appleiap',
					orderInfo: {
						productid: product_id
					},
					success: (res) => {
						var encryptedData = this.orderkeyhash({
						  'increment_id': orderData.incrementId,
						  'transaction_id': res.transactionIdentifier,
						  'product_id': product_id
						});
						var query = res;
						query.encryptedData = encryptedData;
						this.$apis.vipAppleReview(query).then((cresult) => {
							uni.hideLoading();
							if(cresult.code == '200'){
								uni.redirectTo({
									url: '/pages/vip/success'
								});
							} 
						}).catch((err) => {
							console.log(err);
						});;
					},
					fail: (res) => {
						uni.hideLoading();
						if(res.errCode == 2){
							plus.runtime.openURL("https://apps.apple.com/account/billing");
						}
					}
				})
			},
			//加密orderkey
			orderkeyhash(orderData){
				let AesKey = $config.aesKey;//加密时用的key
				let AesIv= $config.aesIv;//iv 偏移量
				var data = JSON.stringify({
					'increment_id': orderData.increment_id,
					'transaction_id': orderData.transaction_id,
					'product_id': orderData.product_id
				})
				var key = crypto.enc.Utf8.parse(AesKey);
				var iv =  crypto.enc.Utf8.parse(AesIv);
				var encrypted = crypto.AES.encrypt(data, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
				return encrypted.toString();///结果为加密后的字符串
			}
		}
	};
</script>
<style scoped>
	.container {
		margin-bottom: 120rpx;
		margin-top: 24rpx;
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
	.address-wrapper {
		background: #fff;
		padding: 24rpx;
	}

	.address-box {
		width: 100%;
		padding: 0 24rpx;
	}

	.add-addres {
		width: 100%;
	}

	.address-wrapper .icon-address {
		font-size: 32rpx;
		color: #999999;
	}

	.address-wrapper .icon-address:before {
		content: "\e7e7";
	}

	.show-address {
		box-sizing: border-box;
	}

	.show-address .name-tel {
		font-size: 28rpx;
		color: #333333;
		line-height: 1.4;
	}

	.show-address .addr-text {
		font-size: 24rpx;
		color: #666666;
	}

	.little-title {
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		color: #333333;
		font-weight: 700;
		padding: 0 24rpx;
		position: relative;
	}

	.item-box {
		padding: 24rpx;
		font-size: 28rpx;
	}

	.shipping-method-box .shipping-method {
		color: #999999;
	}

	.shipping-method-box .shipping-method .price {
		color: #333333;
	}

	.shipping-method-box .shipping-method .method-num {
		color: #333333;
	}
	.payment-methods-box .pay-box .question-icon {
		width: 48rpx;
	}
	.payment-methods-box .pay-box {
		color: #333333;
		font-size: 28rpx;
		padding: 26rpx 24rpx;
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

	.discount-box .discount .coupon-available {
		padding: 5rpx 20rpx;
		background: #FF575c;
		font-size: 18rpx;
		color: #fff;
		margin-left: 13.5rpx;
	}

	.order-total-box {
		padding-bottom: 96rpx;
	}

	.order-total-box .order-info-box .info-box {
		padding: 26rpx 24rpx;
		color: #333333;
		font-size: 28rpx;
	}

	form {
		width: 100%;
	}

	.goods-list {
		width: 100%;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.goods-list .list-title {
		font-size: 28rpx;
		color: #000;
		padding: 30rpx 0 25rpx 30rpx;
	}

	.goods-list .a-goods {
		width: 720rpx;
		display: flex;
		padding: 30rpx 30rpx 30rpx 0;
	}

	.goods-list .a-goods .img-box {
		width: 160rpx;
		height: 160rpx;
		overflow: hidden;
		margin-right: 20rpx;
		margin-left: 30rpx;
		background-color: #d8d8d8;
	}

	.goods-list .img-box .img {
		width: 160rpx;
		height: 160rpx;
	}

	.goods-list .a-goods .text-box {
		width: 510rpx;
		box-sizing: border-box;
		padding-top: 10rpx;
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
		margin-bottom: 30rpx;
	}

	.a-goods .text-box .arow .goods-price {
		font-size: 26rpx;
		color: #000;
		align-self: flex-start;
	}

	.a-goods .text-box .arow .goods-label {
		width: 360rpx;
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
		padding: 24rpx 0 24rpx 30rpx;
		border-bottom: 1rpx solid #eee;
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
		padding-bottom: 24rpx;
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

	.footer {
		width: 100%;
		height: 96rpx;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		z-index: 10;
	}

	.footer-box {
		position: relative;
	}

	.footer-box .to-pay-btn {
		padding: 0 48rpx;
		text-align: center;
		height: 100%;
		line-height: 96rpx;
		background-color: #000;
		font-size: 32rpx;
		color: #fff;
		border-radius: 0;
		margin: 0;
	}

	.footer-box .left-price {
		font-size: 28rpx;
		padding-left: 24rpx;
	}

	.footer-box .total-label {
		font-size: 24rpx;
		color: #333333;
	}

	.footer-box .price {
		font-size: 28rpx;
		color: #ff165e;
		margin-top: 4rpx;
	}
</style>
