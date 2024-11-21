<template>
	<view style="width: 100%;">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<!-- <back-top :showBtn="showBacktopBtn"></back-top> -->
		<view class="cart-list-wrapper">
			<!-- 移除商品之后底部弹出Undo撤回栏 -->
			<view v-if="undoObj.id" class="undo-wrapper" :style="{position: 'fixed', bottom: goodsList.list.length > 0 ? '238rpx' : '123rpx'}">
				<view class="undo-box flex justify-content-between align-items-center">
					<view style="font-family: 'Montserrat-Medium';">{{$t('cart.item_removed')}}</view>
					<view class="undo-right-box flex align-items-center">
						<view class="undo-btn" @click="handleUndo">{{$t('cart.Undo')}}</view>
						<image mode="widthFix" @click="handleCloseUndo" class="undo-close-btn" src="@/static/images/distribute/close.png"></image>
					</view>
				</view>
			</view>
			<pageHeader :showIcon="false" :styleType="2" :title="$t('cart.bag_upper')"></pageHeader>
			<view class="container-box">
				<template v-if="goodsList.list.length > 0 && !$store.getters.hasLogin && shipping_info != ''">
					<view class="cart-to-login-tip mb16r">
						<view style="flex: 1;">{{ shipping_info.text.guest_text }}</view>
						<view class="cart-to-login-btn" @click="toLogin">
							{{ $t('cart.sign_in') }}
						</view>
					</view>
				</template>
				<template v-if="goodsList.list.length > 0 && $store.getters.hasLogin && free_shipping_tips != ''">
					<view class="cart-to-free-shipping">
						<view class="flex no-wrap">
							<image src="@/static/images/cart/free-shipping-icon.png" class="icon" mode="widthFix" />
							<view class="content" v-html="free_shipping_tips"></view>
						</view>
					</view>
				</template>
				<template v-if="shipping_info != '' && shipping_info.is_free_shipping == 1">
					<view class="free-shipping-box flex justify-content-between">
						<view class="free-shipping-box-left">
							<image src="@/static/images/icon/car.png" mode="widthFix"></image>
							<i class="free-shipping-need-transform">{{shipping_info.text.free_shippng_text}}</i>
						</view>
						<view class="free-shipping-box-right free-shipping-need-transform">
							<i>{{shipping_info.text.free_shippng_text2}}</i>
						</view>
					</view>
				</template>
				<!-- 商品空白页 -->
				<template v-if="goodsList.list.length == 0">
					<view class="cart-empty-box">
						<image mode="widthFix" class="cart-empty-img" src="@/static/images/cart/cart_empty@2x.png"></image>
						<view class="cart-empty-text">{{$t("cart.empty_word")}}</view>
						<view v-if="!$store.getters.hasLogin" class="cart-empty-text-sign-in">{{ $t('cart.empty_sign_in') }}</view>
						<!-- 已登录 -->
						<view class="btns-container is-login" v-if="$store.getters.hasLogin">
							<view class="primary-btn cart-btn mt75r" @tap="toHome">{{ $t('cart.go_shopping') }}</view>
						</view>
						<!-- 无登录 -->
						<view class="btns-container" v-else>
							<view class="primary-btn cart-btn font-MS" @tap="$public.handleNavTo('/pages/login/index?in_site_source=cart')">{{ $t('cart.sign_in_and_register') }}</view>
							<view class="cart-btn font-MM" @tap="toHome">{{ $t('cart.continue_shop') }}</view>
						</view>
					</view>
				</template>

				<template name="cart-goods-list" v-if="goodsList.list.length > 0">
					<view class="mt23r"></view>
					<view class="goodsList">
						<view class="a-gooods" v-for="(item, index) in goodsList.list" :key="index" :id="`cartProductItems-${item.product_id}`">
							<cartProductItem
								:currencySymbol="currencySymbol"
								:showVip="showVip"
								:item="item"
								@handleEmitSelect="handleSelect"
								@handleEmitDelete="handleDelete"
								@handleEmitOutOfStock="handleOutOfStock"
								@handleEmitOffShelf="handleOffShelf"
								@handleEmitReduceNumber="handleReduceNumber"
								@handleEmitAddNumber="handleAddNumber"
								@handleEmitBlur="handleBlur"
								@handleEmitFocus="handleFocus"
								@cartProductClick="cartProductClick"
								@handleEmitEdit="(item)=>{old_item = item;id = item.product_id;$refs.shoppingCartPopup_Cart.open(item.product_id,item.qty,{isSizeSelected:true})}"
							></cartProductItem>
						</view>
					</view>
				</template>
				<template name="cart-goods-list" v-if="goodsList.notActiveList.length > 0">
					<view class="goods-line" v-if="goodsList.list.length > 0"></view>
					<view class="goodsList-no-active">
						<view class="no-active-goods-header flex align-items-center justify-content-between">
							<view class="title">{{$t('cart.item_taken_off_the_shelves')}}({{goodsList.notActiveList.length}})</view>
							<view class="remove-all" @click="$refs.popupRemoveAll.open('center')">{{$t('cart.remove_all')}}</view>
						</view>
						<view class="a-gooods" v-for="(item, index) in goodsList.notActiveList" :key="index" :id="`cartProductItems-${item.product_id}`">
							<cartProductItem
								:currencySymbol="currencySymbol"
								:showVip="showVip"
								:item="item"
								:itemIndex="index"
								:moduleName="module_name"
								@handleEmitSelect="handleSelect"
								@handleEmitDelete="handleDelete"
								@handleEmitOutOfStock="handleOutOfStock"
								@handleEmitOffShelf="handleOffShelf"
								@handleEmitReduceNumber="handleReduceNumber"
								@handleEmitAddNumber="handleAddNumber"
								@handleEmitBlur="handleBlur"
								@cartProductClick="cartProductClick"
								@handleEmitEdit="(item)=>{old_item = item;id = item.product_id;$refs.shoppingCartPopup_Cart.open(item.product_id,item.qty,{isSizeSelected:true})}"
							></cartProductItem>
						</view>
					</view>
				</template>
				<view class="dividing-line" v-if="recommendList.length"></view>
				<!-- 推荐RECOMMEND FOR YOU -->
				<view v-if="recommendList.length" class="goods-container"  
					:style="{'padding-bottom': goodsList.list.length === 0 ? '180rpx' : '0', 
						'background-color': '#fff'}">
					<view class="u-text-header">
						{{$t('recommend.header1')}}
					</view>
					<good-list ref="good_list_ref_re"
						module_name="cart_ymal" 
						@popupChange="(value)=>{pageMetaShow=value;$public.isPullDown(!pageMetaShow)}" 
						:goods="recommendList" 
						@addSuccess="loadCartInfo()"
						:setPadding="goodsList.list.length > 0">
					</good-list>
				</view>
			</view>
			<!-- 结算框遮罩层 -->
			<view class="overlay" v-if="settleBoxVisible && !hideSettleBox" @click="settleBoxVisible = false"></view>
			<!-- 结算框 -->
			<view v-if="goodsList.list.length > 0" class="footer-box app-bottom">
				<!-- <view v-if="shipping_info != '' && shipping_info.is_free_shipping != 1"
					class="cart-select-shop-tips" >
					<image src="@/static/images/icon/trumpet.png"></image>
					<view style="flex: 1;" v-html="shipping_info.text.shipping_cost_text"></view>
				</view> -->
				<view class="top flex justify-content-between" :class="settleBoxVisible && !hideSettleBox ? '' : 'top-border'">
					<transition name="fade">
						<view class="settleBox" v-if="settleBoxVisible && !hideSettleBox">
							<view class="settle_bag">
								<text>{{$t('cart.bag')}}({{activeNumber}})</text>
								<image @click="settleBoxVisible = false" 
									src="@/static/images/distribute/close.png" mode="widthFix" />
							</view>
							<view class="settle_Promotions">
								<view class="promotions_text">{{$t('cart.promotions')}}</view>
								<view class="promotions_item mb15r" v-if="Number(goodsList.special_product_reduction_total) > 0">
									<view class="itemText">{{$t('cart.discount_applied')}}</view>
									<view class="discount">-{{currencySymbol}}{{goodsList.special_product_reduction_total}}</view>
								</view>
								<view class="promotions_item" v-if="Number(goodsList.promotion_product_reduction_total) > 0">
									<view class="itemText">{{$t('cart.falsh_sale')}}</view>
									<view class="discount">-{{currencySymbol}}{{goodsList.promotion_product_reduction_total}}</view>
								</view>
							</view>
							<view class="total_sale" v-if="Number(goodsList.totalPrice)">
								<view class="text">{{$t('cart.totalNew')}}</view>
								<view class="sale_val">
									Saved {{currencySymbol}}{{ goodsList.totalPrice }}
								</view>
							</view>
						</view>
					</transition>
					<!-- ALL -->
					<view class="select-all flex align-items-center">
						<view @click="bindAllSelect" :class="isAllSelect?'icon-radio-checked':'icon-radio-check'"></view>
						<view>{{$t('cart.all')}}</view>
					</view>
					<view class="flex align-items-center">
						<view class="footer-right-box" 
							:class="[String(goodsList.totalPrice).length > 7 ? 'fs20' : '']"
							@click="onShowSettleBox">
							<!-- @click="$refs.popupSaveMoney.open('bottom')" -->
							<!-- @click="settleBoxVisible = !settleBoxVisible" -->
							<view v-if="Number(goodsList.totalPrice)" class="total-price-box flex align-items-end">
								<!-- Subtotal: -->
								<view class="subtotal-text"
									:class="[String(goodsList.totalPrice).length > 7 ? 'fs20' : '']">
									{{$t('cart.total')}}:
								</view>
								<!-- 价格 -->
								<text class="total-price" :class="[String(goodsList.totalPrice).length > 7 ? 'fs20' : '']">
									<text style="font-size: 23.08rpx">{{currencySymbol}}</text>
									<text v-if="goodsList.totalPrice.includes('.')">
										<text class="price-integer">{{ goodsList.totalPrice_int }}</text>
										<text>{{ goodsList.totalPrice_decimal }}</text>
									</text>
									<text v-else>
										<text class="price-integer">{{ goodsList.totalPrice }}</text>
									</text>
								</text>
							</view>
							<!-- Saved $xxx  -->
							<view v-if="Number(goodsList.product_reduction_total)" class="reduction-total" >
								<text>{{$t('cart.saved')}} {{currencySymbol}}{{goodsList.product_reduction_total}}</text>
								<image v-if="settleBoxVisible && !hideSettleBox" class="cart-down-icon" src="@/static/images/cart/cart_up_arrow.png" mode="widthFix"></image>
								<image v-else class="cart-down-icon" src="@/static/images/cart/cart_down_arrow.png" mode="widthFix"></image>
							</view>
						</view>
						<!-- CHECKOUT -->
						<button :loading="isCheckouting" 
							style="width: auto; margin-left: 15.38rpx;" 
							class="dui-primary-btn" 
							:class="activeNumber?'':'_disabled'" 
							@tap="isCheckouting?''
							:handleCheckOut()">
						{{$t("cart.check_out")}}({{activeNumber}})
						</button>					
					</view>
				</view>
			</view>
			<!-- 购物车弹窗 -->
			<shoppingCartPopup
				@popupChange="(value)=>{pageMetaShow=value;$public.isPullDown(!pageMetaShow)}"
				ref="shoppingCartPopup_Cart" 
				@changeOtherAttr="handleChangeOtherAttr" 
				@changeColor="handleChangeColor"
				@save="handleSave"
				btnType="save"
			>
			</shoppingCartPopup>
			<!-- 获取优惠券弹窗 -->
			<uni-popup ref="popupCoupon" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<popupContentTemplate :title="$t('goods_detail.discount_coupon')" @close="$refs.popupCoupon.close()">
					<template v-slot:content>
						<view class="coupon-list-box">
							<block v-for="(item,index) in couponList" :key="index">
								<couponItem :couponItemData="item" position='product' @change="getCouponList()"></couponItem>
							</block>
						</view>
					</template>
				</popupContentTemplate>
			</uni-popup>
			<!-- 删除二次确认弹窗 -->
			<uni-popup ref="popupDelete" class="delete-popup-box" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<view class="content-main">
					<image @click="$refs.popupDelete.close()" mode="widthFix" src="@/static/images/distribute/close.png" class="close"></image>
					<view class="title">{{$t('cart.delete_popup_text_Upper')}}</view>
					<view class="dui-primary-btn move-to-wish" @click="handleDeleteConfirm('move-to-wish')">{{$t('cart.move_wish_upper')}}</view>
					<view class="dui-primary-btn delete" @click="handleDeleteConfirm()">{{$t('cart.delete_upper')}}</view>
				</view>
			</uni-popup>
			<!-- 清空无库存或下架产品确认弹窗 -->
			<uni-popup ref="popupRemoveAll" class="delete-all-popup-box" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<view class="content-main">
					<image @click="$refs.popupRemoveAll.close()" mode="widthFix" src="@/static/images/distribute/close.png" class="close"></image>
					<view class="title">{{$t('cart.delete_all_popup_text')}}</view>
					<view class="dui-primary-btn delete" @click="handleDeleteAll">{{$t('cart.delete_upper')}}</view>
					<view class="dui-primary-btn cancle" @click="$refs.popupRemoveAll.close()">{{$t('cart.cancle_upper')}}</view>
				</view>
			</uni-popup>
			<!-- 省钱详细弹窗 -->
			<uni-popup ref="popupSaveMoney" class="save-money-popup-box" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<view class="content-main">
					<view class="header">
						<view class="title">{{$t('cart.cart')}}({{activeNumber}})</view>
						<image mode="widthFix" class="close" @click="$refs.popupSaveMoney.close()" src="@/static/images/distribute/close.png"></image>
					</view>
					<view class="content">
						<view class="promotions">
							<view class="label">{{$t('cart.promotions')}}</view>
							<view class="value">-{{currencySymbol}}{{goodsList.product_reduction_total}}</view>
						</view>
						<view class="specials">{{$t('cart.specials')}}</view>
						<view class="save-popup-footer-box">
							<view class="top flex justify-content-between">
								<view class="select-all flex align-items-center">
									<view @click="bindAllSelect" :class="isAllSelect?'icon-radio-checked':'icon-radio-check'"></view>
									<view>{{$t('cart.all')}}</view>
								</view>
								<view class="footer-right-box flex align-items-center" :style="String(goodsList.totalPrice).length>7?'font-size:20rpx;':''">
									<view class="flex " :class="String(goodsList.totalPrice).length>7?'align-items-center':'align-items-end'">
										<view @click="$refs.popupSaveMoney.open('bottom')" v-if="Number(goodsList.product_reduction_total)" class="reduction-total">{{$t('cart.saved')}} {{currencySymbol}}{{goodsList.product_reduction_total}}</view>
										<view v-if="Number(goodsList.totalPrice)" class="total-price-box flex align-items-end">
											<text>{{$t('cart.total')}}: </text><text class="total-price" :style="String(goodsList.totalPrice).length>7?'font-size:20rpx;':''">{{currencySymbol}}{{ goodsList.totalPrice }}</text>
										</view>
									</view>
								</view>
							</view>
							<button :loading="isCheckouting" class="dui-primary-btn" :class="activeNumber?'':'_disabled'" @tap="isCheckouting?'':handleCheckOut()">{{$t("cart.check_out")}}({{activeNumber}})</button>
						</view>
					</view>
				</view>
			</uni-popup>
			<!-- 发送来货通知订阅弹窗 -->
			<uni-popup ref="popupNotify" class="notify-popup-box" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<view class="content-main">
					<view class="header">
						<view class="title">{{notify_item.record_type=='out_of_stock'?$t('cart.out_stock_popup.title'):$t('cart.off_shelf_popup.title')}}</view>
						<image @click="$refs.popupNotify.close()" src="@/static/images/distribute/close.png" mode="widthFix" class="close-btn" />
					</view>
					<view class="content">{{notify_item.record_type=='out_of_stock'?$t('cart.out_stock_popup.content'):$t('cart.off_shelf_popup.content',{site_name:$store.state.site_name_upper})}}</view>
					<view class="email">{{$t('cart.email')}}</view>
					<view class="email-value-box">
						<input @input="handleEmailValidate" v-model="email" />
						<image v-if="email" @click="email='';showEmailValidateError = true;" class="close" mode="widthFix" src="@/static/images/cart/close_fill@2x.png"></image>
					</view>
					<view v-if="showEmailValidateError" class="error-msg-box">{{$t('cart.email_validate')}}</view>
					<view class="dui-primary-btn" :class="showEmailValidateError || (!showEmailValidateError&&!email)?'_disabled':''" @click="sendStockNotice()">{{$t('cart.submit')}}</view>
				</view>
			</uni-popup>
			<!-- 订阅成功弹窗 -->
			<uni-popup ref="popupNotifySuccess" class="notify-success-popup-box" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
				<view class="content-main">
					<view class="header">
						<view class="title">{{notify_item.record_type=='out_of_stock'?$t('cart.out_stock_popup.title'):$t('cart.off_shelf_popup.title')}}</view>
						<image @click="$refs.popupNotifySuccess.close()" src="@/static/images/distribute/close.png" mode="widthFix" class="close-btn" />
					</view>
					<view class="content">{{notify_item.record_type=='out_of_stock'?$t('cart.out_stock_popup.content_success'):$t('cart.off_shelf_popup.content_success')}}</view>
					<view class="dui-primary-btn" @click="$refs.popupNotifySuccess.close()">{{$t('cart.ok')}}</view>
				</view>
			</uni-popup>
		</view>
		<list-loading v-show="showLoading" :fixedCenter="true"></list-loading>
		<custom-tabbar currentTab="Cart"></custom-tabbar>
	</view>
</template>

<script>
import shoppingCartPopup from '@/components/shoppingCartPopup/shoppingCartPopup.vue'
import cartProductItem from './components/cart_product_item.vue';
import ListLoading from '@/components/list-loading/list-loading.vue';
import { mapState } from 'vuex'

export default {
    components: {
		shoppingCartPopup,
		ListLoading,
		cartProductItem
    },
    data() {
        return {
			free_shipping_tips: '', //免邮提示s
			pageMetaShow:false,
			showEmailValidateError:false,
			old_item:{},
			notify_item:{},
			delete_item:{},
			id:'',
			email:'',
            currencySymbol: '',
			isAllSelect: false, // 是否全选
			activeNumber:0, // 选中的数量
			recommendList: [], // 推荐列表
            goodsList: {
                totalPrice: 0,
				base_product_total: 0,
				product_reduction_total:0,
				promotion_product_reduction_total: 0,
				special_product_reduction_total: 0,
                currencySymbol: '',
                list: [],
				currency:{},
				notActiveList:[],
            },
			undoObj:{},
			undoTimer:'',
			couponList: [], // 优惠券列表
			showLoading: false,
			showBtn: false,
			containerScrollTop: 0,
			old: {
				containerScrollTop: 0
			},
			showBacktopBtn: false,
			shipping_info: '',
			isCheckouting:false,
			currentClickItem:{},
			special_qty_left_text:"",
			oldNumber:'',
			settleBoxVisible: false,
			hideSettleBox: false,
			module_name: 'cart'
        };
    },
	computed: {
		...mapState(['showVip'])
    },
    onShow () {
		this.showLoading = true;
		getApp().globalData.getShopCartNum();
		this.loadCartInfo({loading:false});
		this.$maEvent.visit_event({
			event_category: 'cart',
			event_action: 'cart_visit',
			event_name: 'cart_visit'
		})
    },
	//下拉刷新
	onPullDownRefresh() {
		getApp().globalData.getShopCartNum();
		this.loadCartInfo({loading:false});
		this.recommendProduct();
	},
	onLoad() {
		// 优惠券领取入口暂时关闭
		// this.getCouponList();
		this.$trackEvent.view_cart();
		this.recommendProduct();
	},
	onHide() {
		clearTimeout(this.undoTimer);
		this.undoObj = {};
	},
	onPageScroll: function (t) {
		if (t.scrollTop >= 180) {
			this.showBacktopBtn = true
		} else {
			this.showBacktopBtn = false
		}
		this.$debounce(() => {
			this.startObserver();
			this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
		}, 300)
	},
    methods: {
		handleEmailValidate(e) {
			var myReg = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
			this.showEmailValidateError = !myReg.test(e.detail.value);
		},
		handleOutOfStock(item) {
			this.notify_item={...item,record_type:'out_of_stock'};
			if(item.if_subscribe != 1) {
				this.$refs.popupNotify.open('bottom')
			}
		},
		handleOffShelf(item) {
			this.notify_item={...item,record_type:'off_shelf'};
			if(item.if_subscribe != 1) {
				this.$refs.popupNotify.open('bottom')
			}
		},
		// 调用发货通知接口
		sendStockNotice() {
			const params = {
				email:this.email,
				sku:this.notify_item.sku,
				record_type:this.notify_item.record_type
			}
			this.$apis.stockNotify(params).then(res=>{
				uni.hideLoading()
				this.$refs.popupNotify.close();
				this.$refs.popupNotifySuccess.open('center');
				this.loadCartInfo({loading:false});
			}).catch(e=>{
				uni.hideLoading()
			})
		},
		judgeContainerHeight() {
			if(this.goodsList.list.length>0) {
				return {'padding-top':'96rpx','padding-bottom':'216rpx'}
			} else {
				return {'padding-top':'96rpx'}
			}
		},
		handleGoTop(){
			this.containerScrollTop = this.old.containerScrollTop
			this.$nextTick(function() {
				this.containerScrollTop = 0
			})
		},
		onContainerScroll(t){
			this.old.containerScrollTop = t.detail.scrollTop
			if (t.target.scrollTop >= 180) {
            	this.showBtn = true
			} else {
				this.showBtn = false
			}
		},
		// 获取优惠券列表
		getCouponList(){
			this.$apis.getProductCouponList().then(res => {
				this.couponList = res.data.coupons || [];
				uni.hideLoading();
			})
		},
		// 获取推荐列表
		recommendProduct() {
			const params = {
				type: 'cart_rec'
			}
			this.$apis.recommendProduct(params).then(res => {
				this.recommendList = res.data.products || []
				uni.stopPullDownRefresh();
			}).catch(e=>{
				uni.stopPullDownRefresh();
			})
		},
		handleCheckOut() {
			this.isCheckouting = true;
			this.$apis.checkCartList().then(res=>{
				this.$public.handleNavTo('/pages/checkout/index')
				setTimeout(() => {
					this.isCheckouting = false;
				}, 1000);
				let items = [];
				this.goodsList.list.forEach((item, index) => {
					if(item.active == 1){
						items.push({
							sku: item.sku,
							name: item.name,
							price: item.product_price,
							quantity: item.qty
						})
					} 
				})
				this.$trackEvent.checkout({
					currency: this.goodsList.currency.code,
					value: this.goodsList.totalPrice, // Total Revenue
					base_total: this.goodsList.base_product_total,
					items: items
				})
			}).catch(e=>{
				this.isCheckouting = false;
			})
			
		},
		countTotal(data) {
			let goodsAllList = this.goodsList.list.concat(this.goodsList.notActiveList);
			let _total = data.qty;
			let _filterProduct = goodsAllList.filter((item)=>{return item.item_id==data.item_id});
			_total = _filterProduct.reduce((total,item)=>{return total + Number(item.qty);}, 0);
			return _total
		},
		// 聚焦
		handleFocus(data) {
			this.oldNumber = data.item.qty
		},
		// 失去焦点
		handleBlur(data) {
			if(data.e.detail.value == this.oldNumber) {
				return
			}
			if(data.e.detail.value>this.oldNumber) {
				this.currentClickItem = {...data.item};
			}
			if (!Number(data.e.detail.value)){
				data.item.qty = 1
			}
			let _total = this.countTotal(data.item)
			
			let params = {item_id:data.item.item_id,up_type:_total}
			this.$apis.updateCartInfo(params).then(res =>{
				this.loadCartInfo()
			}).catch(e=>{
				this.loadCartInfo({loading:false})
			})
		},
		// 添加
		handleSave() {
			uni.showLoading()
			let data = {
				origin_product_id:this.old_item.product_id,
				origin_item_id:this.old_item.item_id,
				update_product_id:this.id,
				qty:this.$refs.shoppingCartPopup_Cart.qtyValue,
			}
			this.$apis.updateCartItemoptions(data).then(res =>{
				if(res.status == 'success') {
					this.loadCartInfo({loading:false})
				}
			})
			this.$refs.shoppingCartPopup_Cart.close()
		},
		// 改变size
		handleChangeOtherAttr(data) {
			if (data._id !== this.id) {
				this.id = data._id;
			}
		},
		// 改变color
		handleChangeColor(data) {
			if (data._id !== this.id) {
				this.id = data._id;
			}
		},
		onShowSettleBox() {
			this.settleBoxVisible = !this.settleBoxVisible
		},
        loadCartInfo (config) {
			this.$apis.getCartList({v:'1.1'},config).then(res =>{
				this.showLoading = false;
				let carNum = 0;
				if (res.code == 200) {
					let result = res.data;
					this.email = result.email;
					var cart_info = result.cart_info;
					var currency = result.currency;
					var goodsList = {
					    totalPrice: 0,
						base_product_total: 0,
						product_reduction_total:0,
						promotion_product_reduction_total: 0,
						special_product_reduction_total: 0,
					    currencySymbol: '',
						currency: currency,
					    list: [],
						notActiveList:[]
					};
					if (cart_info) {
						let cart_products = cart_info.products || [];
						this.activeNumber = cart_info.active_items_count;
					    goodsList.totalPrice = cart_info.product_total;
						goodsList.base_product_total = cart_info.base_product_total;
						goodsList.product_reduction_total = cart_info.product_reduction_total;
						goodsList.promotion_product_reduction_total = cart_info.promotion_product_reduction_total
						goodsList.special_product_reduction_total = cart_info.special_product_reduction_total
						const transformTotalPrice = this.$public.transformPrice(goodsList.totalPrice, 'totalPrice')
						goodsList = {...goodsList, ...transformTotalPrice}
						if(Number(goodsList.promotion_product_reduction_total) <= 0 && Number(goodsList.special_product_reduction_total) <= 0) {
							this.hideSettleBox = true
						} else {
							this.hideSettleBox = false
						}
					    goodsList.currencySymbol = currency.symbol;
					    this.setData({
					        currencySymbol: currency.symbol
					    });
						cart_products.map(item=>{
							item = {
								...item,
								...this.$public.transformPrice(item.product_price,'product_price')
							}
							if(item.not_active_status) {
								goodsList.notActiveList.push(item);
							} else {
								goodsList.list.push(item);
							}
						})
						carNum = cart_info.items_count
						
						let no_active_product_arr = goodsList.list.filter((item)=>{ return !item.active });
						this.isAllSelect = !no_active_product_arr.length;
					} else {
						this.isAllSelect = false
						this.activeNumber = 0;
						carNum = 0;
					}
					if(!Number(goodsList.product_reduction_total)) {
						this.$refs.popupSaveMoney.close()
					}
					this.setData({
					    goodsList: goodsList,
						shipping_info: result.shipping_info,
						special_qty_left_text:result.special_qty_left_text
					});
					this.free_shipping_tips = result.free_shipping_tips;
					if(this.currentClickItem&&this.currentClickItem.special_type>0) {
						var filterData =  this.goodsList.list.filter((item)=>{return item.special_data && item.special_data.btn_grey && item.product_id == this.currentClickItem.product_id })
						if(filterData.length) {
							uni.showToast({
							    title: this.special_qty_left_text,
							    icon: 'none',
							    duration: 3000
							});
						}
						this.currentClickItem = {};
					}
					this.$nextTick(() => {
						this.startObserver();
					});
				}
				this.$store.commit('SET_CART_COUNT', carNum)
				getApp().globalData.getShopCartNum();
				uni.hideLoading()
			}).catch(() => {
				this.showLoading = false;
			});
        },
		// 取消、添加收藏
		handleChangeWish (params) {
			this.$apis.changeFav(params).then(res =>{
				if(params.type=='add') {
					this.$refs.popupDelete.close()
					this.loadCartInfo()
					if(this.delete_item.not_active_status<=0) {
						this.undoObj = {id: this.delete_item.product_id,qty: this.delete_item.current_qty,isMoveWish:true}
						clearTimeout(this.undoTimer)
						this.undoTimer = setTimeout(()=>{
							this.undoObj = {}
						},60000)
					}
					let track_data = {
						sku: this.delete_item.sku,
						name: this.delete_item.name,
						module: 'cart'
					}
					this.$trackEvent.add_to_wishlist(track_data)
				} else {
					this.undoObj = {}
					clearTimeout(this.undoTimer)
					this.loadCartInfo()
					let track_data = {
						sku: this.delete_item.sku,
						name: this.delete_item.name,
						module: 'cart'
					}
					this.$trackEvent.remove_wishlist(track_data)
				}
			})
		},
		
		// 清空所有下架商品
		handleDeleteAll() {
			var _id = [];
			var allDeleteProducts = this.goodsList.notActiveList
			this.goodsList.notActiveList.map(item=>{
				_id.push(item.item_id)
			})
			const params = {up_type:0,item_id:_id,is_remove:true}
			this.$apis.updateCartInfo(params).then(res=>{
				this.loadCartInfo();
				this.$refs.popupRemoveAll.close();
				allDeleteProducts.map(item=>{
					this.$trackEvent.remove_from_cart(item, this.goodsList.currency);
				})
			})
		},
		// 确认删除
		handleDeleteConfirm(type) {
			let params = {up_type: this.delete_item.up_type,item_id: this.delete_item.item_id,is_remove:true};
			this.$apis.updateCartInfo(params).then(res =>{
				if(type == 'move-to-wish') {
					this.handleChangeWish({product_id:this.delete_item.product_id,type:'add'})
				} else {
					this.$refs.popupDelete.close()
					this.loadCartInfo()
					if(this.delete_item.not_active_status<=0) {
						this.undoObj = {id: this.delete_item.product_id,qty: this.delete_item.current_qty,isMoveWish:false}
						clearTimeout(this.undoTimer)
						this.undoTimer = setTimeout(()=>{
							this.undoObj = {}
						},60000)
					}
				}
			})
			this.$trackEvent.remove_from_cart(this.delete_item, this.goodsList.currency);
			
		},
		// 删除
		handleDelete(data) {
			let current_qty = Number(data.qty);
			let _total = this.countTotal(data);			
			let params = {up_type: _total - current_qty,item_id: data.item_id,current_qty:current_qty};
			this.delete_item = {...data,...params}
			// not_active_status 1:下架 2:无库存
			console.log(data, 'data');
			console.log(data.not_active_status);
			if(!data.not_active_status && this.$store.getters.hasLogin) {
				this.$refs.popupDelete.open('center');
			} else {
				this.handleDeleteConfirm()
			}
			
		},
		// 关闭删除撤回弹窗
		handleCloseUndo() {
			this.undoObj = {}
			clearTimeout(this.undoTimer)
		},
		// 删除撤回
		handleUndo() {
			// 加入购物车
			this.$apis.addShopCar({qty: this.undoObj.qty,product_id:this.undoObj.id}).then(res => {
				if(this.undoObj.isMoveWish) {
					this.handleChangeWish({product_id:this.delete_item.product_id,type:'del'})
				} else {
					this.undoObj = {}
					clearTimeout(this.undoTimer)
					this.loadCartInfo()
				}
			}).catch(err =>{
				this.undoObj = {}
				clearTimeout(this.undoTimer)
			})
		},

		// 选中、取消选中
		handleSelect(data) {
			let params = {
				checked:data.active?0:1,
				special_type:data.special_type,
				select_qty: data.qty,
				item_id: data.item_id
			}
			this.$apis.checkoutCartSelectone(params).then(res =>{
				if (res.code === 200) {
					this.loadCartInfo();
				}
			})
			
		},

        bindAllSelect() {
			this.$apis.updateCartSelectAll({checked:this.isAllSelect?0:1}).then(res => {
				if (res.code == 200) {
					this.loadCartInfo({loading:false});
				}
			})
		},

        // 加个数
        handleAddNumber (item) {
			this.currentClickItem = {...item};
			this.$apis.updateCartInfo({up_type: 'add_one',item_id: item.item_id}).then(res => {
				if (res.status == 'success') {
					this.loadCartInfo({loading:false})
				}
			})
        },
		// 减个数
        handleReduceNumber(item) {
			if(item.qty == 1) {
				this.handleDelete(item);
			} else {
				this.$apis.updateCartInfo({up_type: 'less_one',item_id: item.item_id}).then(res => {
					if (res.status == 'success') {
						this.loadCartInfo({loading:false})
					}
				})
			}
        },
		toHome(){
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		toLogin(){
			uni.navigateTo({
				url: '/pages/login/index?in_site_source=cart'
			});
		},
		startObserver(){
			if(this.goodsList.list.length == 0 && this.goodsList.notActiveList.length == 0){
				return false;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			this.goodsList.list.forEach((p_item, index) => {
				if(!p_item.observer){
					let elementSelector = '#cartProductItems-' + p_item.product_id;
					this.$public.observeVisibility(this.observer, elementSelector, () => {
						if(p_item.observer){
							return false;
						}
						this.handleProductVisibilityChange(p_item, index);
					});
				}
			});
			this.goodsList.notActiveList.forEach((p_item, index) => {
				if(!p_item.observer){
					let elementSelector = '#cartProductItems-' + p_item.product_id;
					this.$public.observeVisibility(this.observer, elementSelector, () => {
						if(p_item.observer){
							return false;
						}
						this.handleProductVisibilityChange(p_item, index);
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
				price: p_item.base_product_price || ''
			}
			if(this.module_name){
				track_data.module = this.module_name;
			}
			this.$trackEvent.impression_product_item(track_data, p_index);
		},
		cartProductClick(p_item, p_index){
			this.handleProductVisibilityChange(p_item, p_index);
		}
    }
};
</script>
<style lang="scss" scoped>
.cart-list-wrapper .footer-box{
}
.settleBox {
	bottom: 100rpx !important;
}
::v-deep {
	.global-top-btn {
		bottom: 340rpx;
	}
}
@import "cart.scss"
</style>
