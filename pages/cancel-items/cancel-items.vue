<template>
    <view class="dui-padding-top-header">
        <pageHeader :title="$t('cancelItems.cancel_items')"></pageHeader>
		<view class="cancel-items-content">
            <view class="top_order_details">
                <view class="order_no flex align-items-center">
                    <view class="order_no_label">{{ $t('cancelItems.order_no') }}: </view>
                    <view class="order_no_content">{{ orderInfo.increment_id }}</view><view class="copy_btn" @tap="()=>{$copyId(orderInfo.increment_id)}">{{ $t('order.copy') }}</view>
                </view>
                <view class="order_date flex">
                    <view class="order_date_label">{{$t('cancelItems.order_date')}}: </view>
                    <view class="order_date_content">{{orderInfo.created_at_str}}</view>
                </view>
            </view>

            <view v-if="!showNextContent" class="product_items_box flex" >
                <view class="product_item flex" v-for="item in orderInfo.products" :key="item.product_id">
                    <view class="left_check_box flex" @tap="checkedItem(item)">
                        <i :class=" 'iconfont ' +'check_product_item ' + (item.checked ?'checked' : '')"></i>
                    </view>
                    <view class="right_product_item flex">
                        <view class="product_img_box">
                            <image :src="item.image" class="image" mode="widthFix" :lazy-load="true" />
                        </view>
                        <view class="right_attrs_box flex">
                            <view class="product_name">{{ item.name }}</view>
                            <!-- item.custom_option_info -->
                            <view class="spu_attrs" v-for="(ite, key) in item.spu_options" :key="key">{{ key }}: {{ ite }}</view>
                            <view class="product_price">{{orderInfo.currency_symbol}}{{ item.price }}</view>
                            <view class="product_count_box flex">
                                <view class="count_max flex">{{$t('cancelItems.max')}}: {{ item.qty }}</view>
                                <view class="flex count_input_box">
                                    <view :class="'count_inc ' + (item.after_qty <2 ? 'disabled' : '')" @tap="handleDes(item)">-</view>
                                    <input class="count_input" @blur="(e)=>{handleInputCount(item,e)}" type="number" placeholder="" v-model="item.after_qty">
                                    <view :class="'count_dsc ' + (item.after_qty >= item.qty ? 'disabled' : '')" @tap="handleInc(item)">+</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="next_step_content">
                <view class="refund_amount_box flex">
                    <view class="amount_label font-bold">{{$t('cancelItems.refund_amount')}}</view>
                    <view class="amount flex"><view>{{orderInfo.currency_symbol}}</view>{{ return_total }}</view>
                </view>
                <view class="method_wrapper">
                    <view class="refund_title font-bold">{{$t('cancelItems.select_refund')}}</view>
                    <view class="select_method_box flex" @tap="checkRefundMethod(1)">
                        <view class="method_name">{{$t('cancelItems.payment_account')}}</view>
                        <i :class="'iconfont check_product_item ' + (paymentAccount == 1 ? 'checked' : '')"></i>
                    </view>
                    <view class="payment_account_des">{{ $t('cancelItems.payment_account_des') }}</view>
                    <view class="select_method_box flex" @tap="checkRefundMethod(2)">
                        <view class="method_name">{{$t('cancelItems.my_wallet')}}</view>
                        <i :class="'iconfont check_product_item ' + (paymentAccount == 2 ? 'checked' : '')"></i>
                    </view>
                    <view class="payment_account_des">{{ $t('cancelItems.my_wallet_des') }}</view>
                </view>
                <view class="cancel_reason_box">
                    <view class="cancel_title font-bold">{{$t('cancelItems.cancellation_reason')}}</view>
                    <view class="cancel_select flex" @tap="clickSelect">
                        <view :class="(cancel_reason.title ? '' : 'fakeInputPlaceholder ')">{{ cancel_reason.title ? cancel_reason.title : '* ' + $t('cancelItems.please_choose_cancellation')}}</view>
                        <!-- <input type="text"  placeholder="Please choose a cancellation reason" :value="cancel_reason.title"> -->
                        <i class="iconfont"></i>
                    </view>
                    <view v-if="otherReasonShow" class="other_reason_box">
                        <textarea v-model="otherReasonText" @input="changeOtherReason" name="other_reason" id="other_reason" cols="30" rows="3" :placeholder="$t('cancelItems.know_your_reason')"></textarea>
                    </view>
                </view>
                <view class="submit_wrapper flex">
                    <view :class="'submit_btn flex ' + ((!paymentAccount || !reason_id ||(cancel_reason.need_text == '1'&&!otherReasonText)) ? 'disabled' : '' )" @tap="handleSubmit">{{$t('cancelItems.submit')}}</view>
                </view>
            </view>
            
        </view>
        <view class="bottom_btn_wrapper flex" v-show="!showNextContent">
            <view class="bottom_btn_inner flex">
                <view class="selet_all_box flex" @tap="checkAll">
                    <i :class=" 'iconfont ' +'check_product_item ' + (checkedCount == (orderInfo.products&&orderInfo.products.length) ?'checked' : '')"></i>
                    <view class="all_text">{{$t('cancelItems.select_all')}}</view>
                </view>
                <view @tap="toNext" :class="'next_step_btn ' + (!checkedCount ? 'disabled' : '')" >{{$t('cancelItems.next_step')}}</view>
            </view>
        </view>
        <view v-show="successModalShow" class="submit_success_modal">
            <view class="modal_content flex">
                <view class="success_text">{{ success_text }}</view>
                <view class="ok_btn flex" @tap="handleGo">{{$t('cancelItems.view_order')}}</view>
            </view>
        </view>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_select_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{$t('cancelItems.please_choose_cancellation')}}</view>
                            <i class="iconfont" @tap="closePopup"></i>
                        </view>
                        <view class="select_reason_tip">{{ $t('cancelItems.select_reason_tip') }}</view>
                        <view class="flex select_options">
                            <view class="select_option flex" v-for="item in reasons" :key="item.id" @tap="checkReason(item)">
                                <i :class="'iconfont check_product_item ' + (item.id == clickedReason.id ? 'checked' :'')"></i>
                                <view class="select_option_text">{{ item.title }}</view>
                            </view>
                        </view>
                        
                        <view class="confirm_reason_wrapper flex">
                            <view :class="'confirm_reason_btn font-bold flex ' + (disableConfirm ? 'disabled' : '')" @tap="confirmReason">{{$t('cancelItems.confirm')}}</view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
    </view>
  
</template>


<script>
export default {
    data(){
        return {
            orderInfo: {
            },
            reasons: [],
            screenHeight: 0,
            checkedCount: 0,
            showNextContent: false,
            return_total: '0',
            disableConfirm: true,
            paymentAccount: '',
            otherReasonText: "",
            reason_id: '',
            order_id: '',
            success_text: '',
            item_list: [],
            disableSubmit: true,
            successModalShow: false,
            sale_no: '',
            cancel_reason: {
                id: '',
                title: '',
                need_text: '',
            },
            clickedReason: {
                id: '',
                title: '',
                need_text: ''
            },
            otherReasonShow: false,
        }
    },

    onLoad(options) {
        const that = this
        const {order_id, sale_no} = options
        that.order_id = order_id
        that.sale_no = sale_no
        this.queryInitData()         
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
        queryInitData(){
            const that = this
            const sale_no = that.sale_no
            const order_id = that.order_id
            const params = {
                order_id
            }            
            if(sale_no){
                Object.assign(params, {sale_no})
            }            
            that.$apis.initCancelItems(params).then(res => {
                uni.hideLoading()
                if(res.code == '200') {
                    const {orderInfo, reason, sale_no, pay_type} = res.data
                    that.orderInfo = orderInfo
                    that.paymentAccount = pay_type
                    that.orderInfo.products.forEach(item=>{
                        if(!item.after_qty){
                            item.after_qty = item.qty
                        }
                    })
                    that.reasons = reason
                    that.sale_no = sale_no
                }
            }).catch(err => {
                uni.hideLoading()
            })
        },

        checkedItem(item){
            if(item.checked) {
                item.checked = 0
                this.checkedCount--
            }else {
                item.checked = 1
                this.checkedCount++
            }
        },

        checkAll() {
            const products = this.orderInfo.products
            if(this.checkedCount == products.length) {
                products.forEach(item=>{
                    item.checked = 0
                })
                this.checkedCount = 0
            }else {
                products.forEach(item=>{
                    item.checked = 1
                })
                this.checkedCount = products.length
            }
        },

        toNext(){
            if(!this.checkedCount)return
            this.queryNextAmount()           
        },

        checkRefundMethod(type){
            if(this.paymentAccount == type) {
                this.paymentAccount = ''
            }else {
                this.paymentAccount = type
            }
           
        },
        renderOtherReason(){
            const that = this 
            const {id, title, need_text} = that.cancel_reason
            that.clickedReason.id = id
            that.clickedReason.title = title
            that.clickedReason.need_text = need_text
            that.otherReasonShow = false
            that.reasons.forEach(item =>{
                if(item.id == id && item.need_text == '1') {
                    that.otherReasonShow = true
                }
            })
        },

        clickSelect(){
            const that = this   
            const {id, title, need_text} = that.cancel_reason
            that.clickedReason.id = id
            that.clickedReason.title = title  
            that.clickedReason.need_text = need_text  
            if(that.clickedReason.id){
                that.disableConfirm = false
            }    
            that.openPopup()            
        },

        openPopup(){
            this.$refs.bottom_select_popup.open()
        },

        queryNextAmount(){
            const that = this
            const item_list = []
            that.orderInfo.products.forEach(item => {
                if(item.checked){
                    const obj = {
                        qty: item.after_qty,
                        item_id: item.item_id
                    }
                    item_list.push(obj)

                }
            })
            that.item_list = item_list
            const str_item_list = JSON.stringify(item_list)
            const params = {
                order_id: that.orderInfo.order_id,
                item_list: str_item_list
            }
            that.$apis.queryCancelAmount(params).then(res=>{
                uni.hideLoading()
                if(res.code == '200') {
                    that.showNextContent = true  
                    that.return_total = res.data.return_total
                    that.renderOtherReason()
                }else{

                }
            })
            .catch(err=>{
                uni.hideLoading()
            })
        },

        closePopup(){
            this.$refs.bottom_select_popup.close()
        },

        checkReason(item){
            const that = this
            const {id, need_text, title} = item
            
            if(id == that.clickedReason.id) {
                that.clickedReason.id = ''
                that.clickedReason.title = ''
                that.clickedReason.need_text = ''
                that.disableConfirm = true
                return
            }
            
            that.clickedReason.id = id
            that.clickedReason.title = title
            that.clickedReason.need_text = need_text
            that.disableConfirm = false
        },
        changeOtherReason(e){
            if(this.otherReasonText) {
                this.disableConfirm = false
            }else {
                this.disableConfirm = true
            }
        },
        handleInc(item){
            if(item.qty < 2 || item.after_qty>= item.qty)return
            item.after_qty++
        },
        handleDes(item){
            if(item.after_qty <2)return
            item.after_qty--
        },
        handleSubmit(){
            const that = this
            if(!that.paymentAccount || !that.reason_id)return
            if(that.cancel_reason.need_text == '1'&&!that.otherReasonText)return
            const item_list = JSON.stringify(that.item_list)
            const params = {
                order_id: that.order_id,
                item_list,
                reason_id: that.reason_id,
                sale_no: that.sale_no,
                pay_type: that.paymentAccount,
                reason: that.otherReasonText
            }
            that.$apis.submitRefund(params).then(res => {
                uni.hideLoading()
                if(res.code == '200'){
                    that.success_text = res.message
                    that.successModalShow = true
                    that.sale_no = res.data.sale_no
                    setTimeout(() => {
                        that.successModalShow = false
                        that.handleGo() 
                    }, 3000);
					that.$trackEvent.refund({
						transaction_id: res.data.sale_no,
						value: parseFloat(that.return_total),
						currency:that.orderInfo.order_currency_code,
						increment_id: that.orderInfo.increment_id
					});
                }

            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleInputCount(item,e){
            const count = e.detail.value.replace(/\D|^0/g,'1')
            if(count < 1){
                item.after_qty = 1
                return '1'
            }
            if(count > item.qty) {
                item.after_qty = item.qty
                return item.qty
            }
        },
        handleGo(){
            uni.redirectTo({
                        url: '/pages/return-track/return-track?' + 'order_id='+ this.order_id+ '&sale_no='+this.sale_no
                    })
        },
        confirmReason() {
            let that = this
            if(that.disableConfirm)return
            const {title, id, need_text} = that.clickedReason
            that.otherReasonShow = false
            that.reasons.forEach(item =>{
                if(item.id == id && item.need_text == '1') {
                    that.otherReasonShow = true
                }
            })
            if(!that.otherReasonShow) {
                that.otherReasonText = ''
            }
            that.cancel_reason.title = title
            that.cancel_reason.id = id
            that.cancel_reason.need_text = need_text
            that.reason_id = id
            that.closePopup()
            
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
.cancel-items-content{
    background: #eee;    
}
.order_no_label,.order_date_label{
    margin-right: 10rpx;
}
.top_order_details{
    padding: 12px 12px;
    margin-bottom: 12px;
    background: #fff;
    font-size: 14px;
}
.order_no, .order_date{
    justify-content: center;
    align-items: center;
}
.order_no .copy_btn{
    padding: 5rpx 10rpx;
    border: 1px solid #333;
    border-radius: 5rpx;
    margin-left: 10rpx;
    font-size: 14px;
}
.left_check_box{
    width: 4rem;
    height: 4rem;
    justify-content: center;
    align-items: center;
    
}
.check_product_item{
        font-size: 18px;
        color: #222;
        &::before{
            content:'\e63b';
        }
    }
    .check_product_item.checked{
        &::before{
            content:'\e640';
        }
    }
.right_product_item{
    flex: 1;
    width: 100%;
    .right_attrs_box{
        flex: 1;
    }
}
.product_item {
    align-items: center;
    width: 100%;
    padding: 5px 0;
    margin-bottom: 12px;
}
.product_items_box{
    position: relative;
    background: #fff;
    flex-wrap: nowrap;
    flex-direction: column;
    padding-bottom: 100rpx;
    .product_img_box{
        margin-right: 10px;
        width: 180rpx;
        min-height: 240rpx;
        height: 240rpx;
        margin-right: 40rpx;
        .image{
            width: 100%;
        }
    }
}
.product_price,.spu_attrs,.product_name{
    width: 100%;
    font-size: 12px;
}
.product_name{
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}
.product_count_box {
    width: 100%;
    font-size: 12px;
    .count_max{
        width: 200rpx;
        justify-content: start;
        margin-bottom: 5px;
        align-items: end;
    }
    .count_input_box{
        width: 200rpx;
        justify-content: center;
        align-items: end;
        flex-wrap: nowrap;
    }
    /deep/uni-input{
        width: 1.6rem;
        height: 1.6rem;
        text-align: center;
        font-size: 12px;
    }
    .count_inc, .count_dsc {
        background: #eee;
        width: 1.6rem;
        text-align: center;
        height: 1.6rem;
        line-height: 1.6rem;
    }
    .count_inc{
        border-radius: 50% 0 0 50%;
    }
    .count_inc.disabled, .count_dsc.disabled{
        opacity: 0.5;
    }
    .count_dsc{
        border-radius: 0 50% 50% 0;
    }
    
}
.bottom_btn_wrapper{
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    
}
.bottom_btn_inner{
    width: 100%;
    height: 100rpx;
    justify-content: space-between;
    align-items: center;
    padding: 12px 12px;
    @include onepxBorderTop(#e0e0e0);
}
.next_step_btn{
    padding: 0.4rem 0.3rem;
    background: #222;
    color: #fff;
}
.all_text{
    margin-left: 12px;
}
.next_step_btn.disabled{
    opacity: 0.5;
}
.next_step_content{
    padding: 12px;
    background: #fff;
}
.refund_amount_box{
    justify-content: space-between;
    margin: 50rpx 0;
}
.select_method_box{
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
    background: #eee;
    height: 60rpx;
    margin: 30rpx 0;
}
.payment_account_des{
    color: #999;
    padding-bottom: 12px;
    font-size: 12px;
}
.refund_title{
    margin: 12px 0;
    font-size: 14px;
}
.cancel_select{
    background: #eee;
    align-items: center;
    height: 60rpx;
    padding: 0 5px;
    width: 100%;
    margin-top: 12px;
    position: relative;
    input{
        width: 100%;
    }
    .fakeInputPlaceholder{
        color: #999;
    }
    i{
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        &:before{
            content: '\e6ad';
        }
    }
}
.pop_wrapper{
    width: 100%;
	background-color: #fff;
	overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
}
.select_reason_tip{
    font-size: 12px;
    color: #999;
    text-align: center;
    padding: 10rpx 30rpx;
}
.pop_header{
    padding: 10rpx 30rpx;
    position: relative;
    height: 80rpx;
    i{
        position: absolute;
        right: 20rpx;
        top: 20rpx;
        color: #999;
        font-size: 12px;
        &:before{
            content: '\e6ab';
        }
    }
}
.header_title{
    font-size: 14px;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.select_options{
    width: 100%;
    .select_option{
        width: 100%;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        padding: 0 30rpx;
        @include onepxBorder(#e0e0e0);
        .select_option_text{
            flex: 1;
            margin-left: 50rpx;
        }
    }
}
.confirm_reason_wrapper{
    width: 100%;
    height: 100rpx;
    margin-top: 40rpx;
    justify-content: center;
    align-items: center;
    .confirm_reason_btn{
        width: 80%;
        background: #333;
        height: 80%;
        font-size: 16px;
        color: #fff;
        justify-content: center;
        align-items: center;
    }
    .confirm_reason_btn.disabled{
        opacity: 0.5;
    }
}
.other_reason_box{
    width: 100%;
    padding: 30rpx;
    #other_reason{
        width: 100%;
        background: #eee;
        border-radius: 10rpx;
        height: 200rpx;
        padding: 16rpx;
    }
}
.cancel_reason_box{
    margin-top: 50rpx;
    margin-bottom: 50rpx;
}
.submit_wrapper{
    width: 100%;
    height: 100rpx;
    margin-top: 100rpx;
    justify-content: center;
    align-items: center;
    .submit_btn{
        width: 80%;
        background: #333;
        height: 80%;
        font-size: 16px;
        color: #fff;
        justify-content: center;
        align-items: center;
    }
    .submit_btn.disabled{
        opacity: 0.5;
    }
}
.submit_success_modal{
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    z-index: 2;
    top: 0;
    background: rgba(0,0,0,0.5);
    .modal_content{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 75%;
        height: 300rpx;
        background: #fff;
        transform: translate(-50%,-50%);
        align-items: center;
        padding: 20rpx;
        justify-content: center;
        .success_text{
            color: #666;
            font-size: 14px;
        }
        .ok_btn{
            font-size: 16px;
            color: #fff;
            background: #222;
            width: 100%;
            height: 60rpx;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>