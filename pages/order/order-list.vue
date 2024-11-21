<template>
    <view>
		<pageHeader :title="$t('order.order_list')">
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
            <view class="status-box page-max-width">
                <view @tap="statusTap(item)" :class="'status-label ' + (item.order_status == order_status ? 'active' : '')" :data-index="index" v-for="(item, index) in statusType" :key="index">
                    {{ item.label }}
                </view>
            </view>
			<view class="no-order" v-if="empty" :style="'height: ' + bodyHeight + 'px;'">
			  <empty :text="$t('order.no_data_tips')"></empty>
			</view>
			<view class="order-list-content">
				<view class="order-list" v-if="!(orderList ? false : true)">
				    <view class="order-list-item" v-for="(item, index) in orderList" :key="index">
				        <view class="order-status-box" @tap="orderDetail(item)">
				            <view>{{ $t('order.order_no') }}: {{ item.increment_id }}</view>
				            <view class="status">{{ item.order_status_txt }}</view>
				        </view>
				        <view class="list-item-con-box" @tap="orderDetail(item)">
							<view v-if="item.item_products.length <= 5" class="goods-list">
								<view class="a-goods" v-for="(pitem, p_index) in item.item_products" :key="p_index">
									<view class="img-box">
										<image :src="pitem.pic" class="img" />
										<specialOfferDiscountTab v-if="pitem.member_product != 1 && pitem.line_price" :is-special="pitem.is_special_price==1" :discount="pitem.discount_off"  fontSize="18rpx"></specialOfferDiscountTab>
									</view>
									<view class="text-box-info">
										<view class="goods-name">{{ pitem.name }}</view>
										<view class="goods-label">
											<view v-for="(property, key) in pitem.spu_options" :key="key">{{key}}: {{ property }} </view>
										</view>
									</view>
									<view class="text-box-price">
										<view>
											<view class="goods-price">
											<view v-if="pitem.member_product == 1" class="vip-member-price-box text-align-right">
												<view class="flex align-items-center">
													<!-- <image class="vip-icon" mode="widthFix" src="@/static/images/vip/vip_icon.png"></image> -->
													<text class="vip-member-price font-bold">{{item.currency_symbol}}{{pitem.price}}</text>
												</view>
												<view class="text-line-through-and-gray" v-if="pitem.line_price">{{item.currency_symbol}}{{pitem.line_price}}</view>
											</view>
											<block v-else>
												<view>{{ item.currency_symbol }}{{ pitem.price }}</view>
												<view v-if="pitem.line_price" class="text-line-through-and-gray">{{ item.currency_symbol }}{{ pitem.line_price }}</view>
											</block>
											</view>
											<view><text class="qty">x{{ pitem.qty }}</text></view>
										</view>
									</view>
								</view>
							</view>
							<view v-else>
								<scroll-view class="goods-img-container" :scroll-x="true">
								    <view class="img-box" v-for="(pitem, p_index) in item.item_products" :key="p_index">
								        <image :src="pitem.pic" class="goods-img"></image>
								    </view>
								</scroll-view>
							</view>
				           
							<view class="price-box">
								<view class="price-box-block">
									<view class="countdown-box" v-if="item.auto_cancel_order_remain_time > 0">
										<uni-countdown
										class="countdown"
										v-if="item.auto_cancel_order_remain_time > 0"
										@is-down="isPayDown(item, index)"
										:showColon="true"
										:showIcon="true"
										:show-day="true"
										:leftTime="item.auto_cancel_order_remain_time"></uni-countdown>
									</view>
									<view class="total-price">{{ $t('order.grand_total') }}:<text class="value">{{ item.currency_symbol }}{{ item.grand_total }}</text></view>
								</view>
							</view>
				        </view>
						
				        <view class="btn-box">
							<scroll-view scroll-x="true" id="opt_btns">
								<view  style="white-space: nowrap;text-align:right;">
									<button class="btn" v-if="item.can_after_sale&&order_status_copy!='refund'" @tap="toAfterSale(item)">{{ $t('order.btns.after_sale') }}</button>
									<button class="btn cancel-btn" v-if="item.can_cancel&&!item.is_pay" @tap="toShowCancelModal(item)">{{ $t('order.btns.cancel') }}</button>
									<button class="btn cancel-btn" v-if="item.can_cancel&&item.is_pay" @tap="handleOpenModal(item)">{{ $t('order.btns.cancel') }}</button>
									<button class="btn" type="primary" v-if="item.can_payment" @tap="toPayTap(item)">
										{{ $t('order.btns.order_now_pay') }}
									</button>
									<button class="btn" v-if="item.can_query_shipping" @tap="toShippingOrder(item)">{{ $t('order.btns.view_shipping') }}</button>
									<button class="btn" v-if="order_status_copy=='refund'" @tap="toReturnRecord(item)">{{ $t('order.btns.view_record') }}</button>
									<button class="btn" v-if="item.can_reorder" @tap="toReorder(item)">{{ $t('order.btns.reorder') }}</button>
									<button class="btn" type="primary" v-if="item.can_received" @tap="toConfirmOrder(item)">{{ $t('order.btns.confirm_receipt') }}</button>
									<button class="btn" type="primary" v-if="item.can_review" @tap="toReview(item)">{{ $t('order.btns.review') }}</button>
								</view>
							</scroll-view>				            
				        </view>
				    </view>
				</view>
			</view>
			<list-loading v-show="showLoading" :fixedCenter="!showLoadingMore"></list-loading>
        </view>
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
                <view class="add_to_cart_btn font-bold btn" @tap="handleAddBackToCart">{{ $t('order.add_to_cart') }}</view>
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
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='is_case_popup' type="center">
				<view class="receive_content flex align-items-center">
					<view class="receive_tips">{{ $t('order.is_case_tip') }}</view>
					<view class="btn received_btn font-bold" @tap="()=>{$refs.is_case_popup.close()}">{{ $t('order.ok') }}</view>
				</view>
			</uni-popup>
		</view>
		<view @touchmove.stop.prevent="()=>{}">
			<uni-popup ref='is_case_aftersale_popup' type="center">
				<view class="receive_content flex align-items-center">
					<view class="receive_tips">{{ $t('order.is_case_aftersale_tip') }}</view>
					<view class="btn received_btn font-bold" @tap="()=>{$refs.is_case_aftersale_popup.close()}">{{ $t('order.ok') }}</view>
				</view>
			</uni-popup>
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
    </view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
import ListLoading from '@/components/list-loading/list-loading.vue';
import uniCountdown from "@/components/l-uni-countdown/uni-countdown.vue"
import chatPlugin from '@/utils/chatPlugin.js'
import { mapState } from 'vuex'
import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue'

var app = getApp(); // 语言

export default {
    components: {
        navigation,
		ListLoading,
		uniCountdown,
		specialOfferDiscountTab
    },
    data() {
        return {
			screenHeight: '',
            statusType: [],
            order_status: 'all',
			order_status_copy: 'all',
            bodyHeight: null,
            share: '',
            orderList: [],
			pageNum: 1,
			loadmore: true,
			showLoading: false,
			showLoadingMore: false,
			empty: false,
			reasons: [],
			canSubmitReason: false,
			needTextTips: '',
			more_reason: '',
			order_id: '',
			showAddBack: false,
			showBackSuccess: false,
			showCancekItemModal: false,
			recieveItem: {},
			showBacktopBtn: false,
			cangetPoints: 0,
        };
    },
	computed: {
        ...mapState({
            serviceScriptUrl: state => state?.appConfig?.scriptUrl,
			serviceWebviewSrc: state => state?.appConfig?.webviewSrc
        }),
    },
    onLoad: function (e) {
        if (e.order_status) {
            this.order_status = e.order_status;
        }
		this.getOrderListData(e);
		this.queryCancelReason()
    },
	onPageScroll: function (t) {
        if (t.scrollTop >= 180) {
            this.showBacktopBtn = true
        } else {
            this.showBacktopBtn = false
        }
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function (e) {
		this.$maEvent.visit_event({
			event_category: 'orders',
			event_action: 'orders_visit',
			event_name: 'orders_visit'
		})
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function () {
		if(this.loadmore){
			this.pageNum ++;
			this.showLoadingMore = true;
			this.getOrderListData();
		}
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
		closePopup(key){
            this.$refs[key].close()
        },
		handleOpenModal(item){
			const {is_case} = item
			if(is_case == '1'){
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
		handleSubmit(){			
			const that = this
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
				if(res.code == '200'){
					that.closePopup('bottom_cancel_popup')
					that.showAddBack = true
					that.refreshOrderListData();
				}
			}).catch(error=>{
				uni.hideLoading()
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
		// 从refund分类的orderlist页，跳转到return-records页
		toReturnRecord(item) {
			uni.navigateTo({
				url: '/pages/return-records/return-records?order_id=' + item.order_id
			});
		},
		//倒计时结束
		isPayDown(item, index){
			item.auto_cancel_order_remain_time = 0;
		},
		refreshOrderListData(){
			this.pageNum = 1;
			this.getOrderListData();
		},
        getOrderListData: function (e) {
			if(this.pageNum == 1){
				this.loadmore = true;
			}
            // 获取订单列表
			let pageNum = this.pageNum;
			this.showLoading = true;
			this.$apis.getOrderList({
                p: pageNum,
				order_status: this.order_status
            }).then(res =>{
				this.showLoading = false;
				this.showLoadingMore = false;
				this.order_status_copy = this.order_status
				if (res.code == 200) {
				    var orderList = res.data.orderList;
					if(pageNum > 1){
						if(orderList.length == 0){
							this.loadmore = false;
						}
						orderList = this.orderList.concat(orderList);
					} 
					if(orderList.length == 0){
						this.empty = true;
					} else {
						this.empty = false;
					}
				    this.setData({
				        orderList: orderList
				    });
					this.statusType = res.data.order_status_list;
				} else {
					if(pageNum <=1){
						this.setData({
						    orderList: null
						});
					}
				}
			}).catch(() => {
				this.showLoading = false;
			});
        },

        statusTap: function (item) {
            this.order_status = item.order_status;
			this.pageNum = 1;
            this.getOrderListData({});
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
		handleToReview(){
			this.$refs.toreview_popup.close()
			this.toReview(this.recieveItem)
		},
		handleCloseModal(){
			this.showAddBack = false
			this.showBackSuccess = false
			// 更新页面
			this.getOrderListData({});
			this.queryCancelReason()
		},
		handleAddBackToCart(){
			const that = this
			const order_id = that.order_id
			uni.showLoading()
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
        orderDetail: function (item) {
            var order_id = item.order_id;
            uni.navigateTo({
                url: '/pages/order/order-detail?id=' + order_id + '&share=1'
            });
        },        
		toShowCancelModal(item){
			this.order_id = item.order_id
			this.$refs['bottom_cancel_popup'].open()
		},
        toPayTap: function (item) {
            this.orderDetail(item);
        },
		handleConfirmReceive(){
			const orderId = this.recieveItem.increment_id;
			uni.showLoading();
			this.$apis.orderReceive({
				orderId
			}).then((res) => {
				if (res.code == 200) {
					this.$refs.recieve_popup.close()
					this.refreshOrderListData();
					this.$refs.toreview_popup.open()
					this.cangetPoints  = res.data.point
					// this.toReview(this.recieveItem);
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
		handleToAftersale(){
			uni.showLoading();
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
			if(is_case == '1'){
				this.$refs['is_case_aftersale_popup'].open()
				return
			}
			this.order_id = item.order_id;
			this.$refs.aftersale_popup.open()		
			
		},
		toReorder(item){
			var order_id = item.order_id;
			uni.showLoading();
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
		}
    }
};
</script>
<style scoped lang="scss">
@import "@/common/mixins.scss";
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
.no_btn,.not_yet_btn,.aftersale_no{
    width: 90%;
    background: #fff;
    color: #333;
    border: 1px solid #333;
    text-align: center;
    padding: 20rpx 40rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
}
.not_yet_btn{
	margin-top: 30rpx;
}
.yes_btn,.received_btn,.aftersale_yes{
    width: 90%;
    background: #333;
    color: #fff;
    text-align: center;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
}
.btns_wrapper{
	width: 100%;
}
.aftersale_yes,.aftersale_no{
	width: 45%;
	margin: 40rpx 0 0;
}
.add_cart_content,.add_success_content,.receive_content,.aftersale_content{
    width: 90%;
    height: unset;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 40rpx 26rpx;
    flex-direction: column;
	font-size: 28rpx;
}

.aftersale_content,.receive_content{
	width: 640rpx;
}

.receive_content,.aftersale_content{
	height: unset;
}
.cancel_item_content{
    height: unset;
}
.add_back_tittle{
    text-align: center;
    font-size: 28rpx;
}
.no_thanks_btn{
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
.ok_btn{
    color: #fff;
    background: #333;
    font-size: 28rpx;
    width: 100%;
    padding: 20rpx;
    text-align: center;
}
.container {
    width: 100%;
    overflow: hidden;
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
		height: 150rpx;
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
		min-height: 60rpx;
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
.status-box {
	position: fixed;
	top: calc(var(--window-top) + 88rpx);
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
	overflow-x: auto;
	overflow-y: hidden;
	z-index: 10;
	border-bottom: 1px solid #e2e2e2;
	.status-label {
	    height: 100%;
		padding: 0px 20rpx;
	    text-align: center;
	    font-size: 28rpx;
	    color: #353535;
	    box-sizing: border-box;
	    position: relative;
		&.active{
			color: #8A61E7;
			border-bottom: 6rpx solid #8A61E7;
		}
		.red-dot {
		    width: 16rpx;
		    height: 16rpx;
		    position: absolute;
		    left: 125rpx;
		    top: 20rpx;
		    background-color: #b5272d;
		    border-radius: 50%;
		}
	}
}
.order-list-content {
	margin-top:  calc(var(--window-top) + 176rpx);
	background-color: #f5f5f5;
}
.no-order {
    width: 100%;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    padding-top: 188rpx;
}

.no-order-img {
    width: 220rpx;
    height: 220rpx;
    margin-bottom: -10rpx;
    margin-top: 30%;
}

.no-order .text {
    font-size: 28rpx;
    color: #999;
    text-align: center;
}

.order-list {
    width: 100%;
}

.order-list-item {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20rpx;
}

.order-list-item .order-status-box {
    padding: 0 30rpx;
    height: 70rpx;
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    color: #000;
    align-items: center;
}

.order-list-item .order-status-box .status {
    font-size: 24rpx;
    color: #f85184;
}

.order-list-item .list-item-con-box {
    width: 100%;
    border-top: 1rpx solid #f5f5f5;
	border-bottom: 1rpx solid #f5f5f5;;
    padding: 20rpx 30rpx;
    color: #333;
}
.goods-img-container {
	display: flex;
	align-items: center;
    height: 186rpx;
    box-sizing: border-box;
    white-space: nowrap;
}
.goods-img-container .img-box {
    width: 140rpx;
    height: 140rpx;
    overflow: hidden;
    margin-right: 10rpx;
    background-color: #f7f7f7;
    display: inline-block;
}
.goods-img-container .img-box .goods-img {
    width: 140rpx;
    height: 140rpx;
}
.goods-list .a-goods {
    display: flex;
	margin-bottom: 20rpx;
}
.goods-list .a-goods:last-child {
	margin-bottom: 0rpx;
}
.goods-list .a-goods .img-box {
    width: 140rpx;
    height: 140rpx;
    margin-right: 20rpx;
    background-color: #f7f7f7;
	position: relative;
}
.goods-list .a-goods .img-box .img {
	width: 140rpx;
	height: 140rpx;
}
.goods-list .text-box {
	flex: 1;
	display: flex;
}
.goods-list .text-box-info {
	flex: 1;
	width: 300rpx;
	margin-right: 20rpx;
}
.goods-list .text-box-price {
	display: flex;
	justify-content: flex-end;
	text-align: right;
}
.goods-list .goods-name {
    font-size: 28rpx;
    color: #000;
    overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.goods-list .goods-label {
	margin-top: 10rpx;
    font-size: 26rpx;
    color: #999;
}
.order-list-item .a-goods .goods-price {
    font-size: 26rpx;
    color: #000;
}
.order-list-item .a-goods .qty {
    font-size: 26rpx;
    color: #000;
}
.order-list-item .price-box {
    position: relative;
    box-sizing: border-box;
    padding: 20rpx 0rpx;
    font-size: 26rpx;
	overflow: auto;
}
.order-list-item .price-box .price-box-block {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
}
.order-list-item .price-box .countdown-box{
	flex: 1;
	margin-right: 10rpx;
}

.order-list-item .price-box .total-price {
    font-size: 26rpx;
}
.order-list-item .price-box .total-price .value{
    font-weight: bold;
	margin-left: 3px;
}
.order-list-item .btn-box {
    display: flex;
    justify-content: flex-end;
	padding: 20rpx;
}
.order-list-item .btn-box .btn {
	display: inline-block;
    padding: 0px 15rpx;
    height: 68rpx;
    box-sizing: border-box;
    text-align: center;
    line-height: 68rpx;
    margin-right: 16rpx;
	margin-left: 0px;
	font-size: 24rpx;
	overflow: unset;
}
.order-list-item .btn-box .btn:last-child {
	margin-right: 0rpx;
}
</style>
