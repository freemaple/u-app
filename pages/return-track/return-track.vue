<template>
    <view class="return_track_box dui-padding-top-header">
        <pageHeader :title="type == 2 ? $t('returnTrack.return_title') : $t('returnTrack.refund_title')"></pageHeader>
        <view class="return_track_pagecontent" v-show="afterSaleList.length">
            <view class="return_status_box">
                <view class="status_title font-bold">{{ sale_status.status }}</view>
                <view class="status_tips flex">{{ sale_status.tips }}</view>
                <view class="status_btn_wrapper flex" style="justify-content: flex-end;">
                    <view class="track_btn" @tap="handleShowTrack">{{type == 2 ? $t('returnTrack.return_track') : $t('returnTrack.refund_track')}}</view>
                </view>
            </view>
            <view class="return_method_box" v-if="type == 2">
                <view class="title font-bold">{{ $t('returnTrack.return_method') }}</view>
                <view class="return_method_name">{{ return_type == 2 ? $t('returnTrack.self_sending') : $t('returnTrack.ups_store') }}</view>
                <view class="return_method_des">{{  return_type == 2 ? $t('returnTrack.return_your_coast') : $t('returnTrack.return_ups_label') }}</view>
                <view class="ups_label_desc" v-if="return_type == 1">{{ $t('returnTrack.ups_desc1') }}</view>
                <view class="ups_label_desc" v-if="return_type == 1">{{ $t('returnTrack.ups_desc2') }}</view>
                <view class="label_wrapper flex" v-if="sheet">
                    <view class="label_box">
                        <view class="img_warpper" @tap="handleShowImg">
                            <image class="img" src="@/static/images/download_label.png" alt=""/>
                        </view>
                        <view class="label_title">{{$t('returnTrack.return_label')}}</view>
                    </view>
                    <view class="save_label_btn flex">
                        <view class="download_wrapper download_label_img flex" @tap="handleSave">
                            <i class="iconfont"></i>
                            <view >{{$t('returnTrack.save_to_label')}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="product_information" v-show="afterSaleList.length">
                <view class="title font-bold flex">{{ $t('returnTrack.product_information') }}</view>
                <view class="product_lists">
                    <view class="right_product_item flex" v-for="item in afterSaleList" :key="item.product_id">
                        <view class="product_img_box">
                            <image :src="item.image" class="image" mode="widthFix" :lazy-load="true" />
                        </view>
                        <view class="right_attrs_box flex">
                            <view class="product_name">{{ item.name }}</view>
                            <!-- item.custom_option_info -->
                            <view class="spu_attrs" v-for="(ite, key) in item.spu_options" :key="key">{{ key }}:{{ ite }}</view>
                            
                            <view class="right_bottom_box flex">
                                <view class="product_price font-bold">{{ order_symbol }}{{ item.refund_total }}</view>
                                <view class="product_count">x{{ item.qty }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="title font-bold flex">{{ $t('returnTrack.details') }}</view>
                <view class="details_item flex">
                    <view class="label">{{$t('returnTrack.refund_amount')}}:</view>
                    <view class="content">{{ refund_total }}</view>
                </view>
                <view class="details_item flex">
                    <view class="label">{{ $t('returnTrack.application_time') }}:</view>
                    <view class="content">{{ afterSaleList[0]&&afterSaleList[0].created_at }}</view>
                </view>                
                <view class="details_item flex">
                    <view class="label">{{$t('returnTrack.refund_method')}}:</view>
                    <view class="content">{{ pay_type == 1 ? $t('returnTrack.payment_account') : $t('returnTrack.my_wallet') }}</view>
                </view>
                <view class="details_item flex align-items-center">
                    <view class="label">{{type == 2 ? $t('returnTrack.return_id') : $t('returnTrack.refund_id')}}:</view>
                    <view class="content">{{ sale_no }}</view>
                    <view class="copy flex" @tap="()=>{$copyId(sale_no)}">{{ $t('returnTrack.copy') }}</view>
                </view>
            </view>
        </view>
        <view v-show="showImg" class="show_img_modal modal">
            <view class="img_content flex">
                <image class="modal_img" :src="sheet" alt=""/>
            </view>
            <i class="iconfont" @tap="handleCloseShow"></i>
            <view class="modal_bottom flex">
                <view class="modal_save_btn flex" @tap="handleSave">{{ $t('returnTrack.save_to_album') }}</view>
            </view>
        </view>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_track_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{type == 2 ? $t('returnTrack.return_track') : $t('returnTrack.refund_track')}}</view>
                            <i class="iconfont" @tap="closePopup"></i>
                        </view>
                        <view class="track_wrapper">
                            <view :class="'track_item flex ' + (item.checked ? 'checked ' : '') + (index == track.length-1 ? ' last_item' : '') " v-for="(item, index) in track" :key="index">
                                <view class="item_left">
                                    <i class="iconfont"></i>
                                </view>
                                <view class="item_right">
                                    <view class="status">{{ item.status }}</view>
                                    <view class="time" v-if="item.time">{{ item.time }}</view>
                                </view>
                            </view>
                         
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
        <view class="confirm_cancel_modal" v-show="showCancelModal">
            <view class="cancel_content">
                <view class="confirm_tips">{{ $t('returnTrack.label_note') }}</view>
                <view class="confirm_btns flex">
                    <view class="btn_keep flex" @tap="()=>{showCancelModal = false}">{{ $t('returnTrack.keep_this_return') }}</view>
                    <view class="btn_confirm flex" @tap="handleConfirmCancel">{{ $t('returnTrack.confirm_to_cancel') }}</view>
                </view>
            </view>
        </view>
        <view class="operate_btns_wrapper flex" v-if="can_cancel || can_edit" style="justify-content: flex-end;">
            <view class="cancel_btn btn flex" v-if="can_cancel" @tap="handleToCancel">{{ $t('returnTrack.cancel') }}</view>
            <view class="modify_btn btn flex" v-if="can_edit" @tap="handleToModify">{{ $t('returnTrack.modify_return_items') }}</view>
        </view>
    </view>
  
</template>

<script>
export default {
    data() {
        return {
            sale_status: {},
            track: [],
            afterSaleList: [],
            return_type: '',
            type: '',
            sale_no: '',
            can_cancel: false,
            can_edit: false,
            sheet: '',
            showImg: false,
            screenHeight: 0,
            order_id: '',
            showCancelModal: false,
            pay_type: '',
            order_symbol: '',
            refund_total: '',
        }
    },
    onLoad(options) {
        const {order_id, sale_no} = options
        this.sale_no = sale_no
        this.order_id = order_id
        this.initReturnTrack()
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
        initReturnTrack(){
            const that = this
            const {order_id, sale_no} = that            
            const params = {
                order_id,
                sale_no
            }
            that.$apis.queryReturntrack(params).then(res => {
                uni.hideLoading()
                if(res.code == '200'){
                    const {sale_status, afterSaleList, track, type, return_type, can_cancel, can_edit, sheet, pay_type, order_symbol, refund_total} = res.data
                    that.track = track
                    that.sale_status = sale_status
                    that.afterSaleList = afterSaleList
                    that.return_type = return_type
                    that.type = type
                    that.can_edit = can_edit
                    that.can_cancel = can_cancel
                    that.sheet = sheet
                    that.pay_type = pay_type
                    that.order_symbol = order_symbol
                    that.refund_total = refund_total
                }
            }).catch(err=> {
                uni.hideLoading()
            })
        },
        handleSave() {
            const that = this
            let path=''
            uni.getImageInfo({
                src: that.sheet,
                success: (res)=>{
                    path = res.path
                    uni.saveImageToPhotosAlbum({
                    filePath: path,
                    success: ()=>{
                        uni.showToast({
                            title: that.$t('returnTrack.save_success'),
                            icon: 'success',
                            mask: true
                        })
                    },
                    fail: ()=>{
                        uni.showToast({
                            title: that.$t('returnTrack.save_failed'),
                            icon: 'error',
                            mask: true
                        })
                    }
                })
                }
            })            
           
        },
        handleCloseShow() {
            this.showImg = false
        },
        handleShowImg() {
            this.showImg = true
        },
        handleShowTrack() {
            this.$refs.bottom_track_popup.open()
        },
        closePopup(){
            this.$refs.bottom_track_popup.close()
        },
        handleToModify(){
            uni.navigateTo({ url: '/pages/order-aftersale/order-aftersale?order_id='+ this.order_id + '&sale_no=' + this.sale_no })
        },
        handleToCancel() {
            this.showCancelModal = true
        },
        handleConfirmCancel(){
            const that = this
            that.$apis.confirmCancel({sale_no: that.sale_no}).then(res=>{
                uni.hideLoading()
                if(res.code == '200') {
                    uni.redirectTo({ url: '/pages/return-records/return-records?order_id=' + that.order_id })
                }
            }).catch(err =>{
                uni.hideLoading()
            })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
.return_track_box {
	font-size: 28rpx;
}
.ups_label_desc{
    font-size: 12px;
    line-height: 1.5;
    margin: 20rpx 0;
}
.return_status_box{
    padding: 24rpx;
    background: #e1f5e3;
    .status_title{
        font-size: 28rpx;
        color: #222;
    }
    .status_tips{
        font-size: 24rpx;
        justify-content: center;
        align-items: center;
        margin: 20rpx 0;
    }
    .status_btn_wrapper{
        height: 60rpx;
        justify-content: end;
        align-items: center;
        margin: 20rpx 0;
        .track_btn{
            background: #fff;
            color: #222;
            font-size: 28rpx;
            padding: 10rpx 20rpx;
            margin-right: 40rpx;
        }
    }
}
.return_method_box{
    padding: 24rpx;
    .title{
        font-size: 28rpx;
        margin: 20rpx 0;
    }
}
.label_box{
    padding: 20rpx 20rpx 20rpx;
    border: 1px solid rgba(0,0,0,0.3);
}
.img_warpper{
    width: 144rpx;
    height: 174rpx;
    .img{
        width: 100%;
        height: 100%;
    }
}
.save_label_btn{
    flex-direction: column-reverse;
    color: #fff;
    margin-left: 20rpx;
    margin-bottom: 20rpx;
    .download_wrapper {
        background: rgba(0,0,0,.8);
        padding: 6rpx 10rpx;
        i{
            color: #fff;
            &:before{
                content: '\e6cd';
            }
        }
    }
}
.product_information{
    padding: 24rpx;
    .title{
        height: 80rpx;
        justify-content: start;
        align-items: center;
    }
    .right_product_item{
    
    width: 100%;
    overflow: hidden;
    margin-top: 20rpx;
    width: 100%;
    .right_attrs_box{
        padding-left: 10rpx;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        .product_name{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #999;
            width: 100%;
        }
    }
}
.product_item {
    align-items: center;
    width: 100%;
    padding: 10rpx 0;
    margin-bottom: 24rpx;
}
.right_product_item{
    position: relative;
    background: #fff;
    flex-wrap: nowrap;
    .product_img_box{
        width: 150rpx;
        height: 150rpx;
        margin-right: 20rpx;
        position: relative;
        .image{
            position: absolute;
            max-width: 100%;
            max-height: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
}
.right_bottom_box{
    justify-content: space-between;
    align-items: center;
    margin-top: 40rpx;
    .product_count{
        color: #999;
    }
}
.time{
    justify-content: start;
    margin-bottom: 10rpx;
    
    .label{
        margin-right: 20rpx;
    }
    .copy{
        margin-left: 20rpx;
        padding: 5rpx 10rpx;
        border: 1px solid #ccc;
    }
}
.operate_btns_wrapper{
    
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    justify-content: end;
    align-items: center;
    background: #fff;
    @include onepxBorderTop(#e0e0e0);
    position: fixed;

    .btn{
        padding: 10rpx 20rpx;
        margin-right: 24rpx;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
    }
    .modify_btn{
        color: #fff;
        background: #222;
    }
    .cancel_btn{
        color: #222;
        background: #fff;
        border: 1px solid #222;
    }
}
.show_img_modal{
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    position: fixed;
    z-index: 1;
    >i{
        color: #fff;
        font-size: 52rpx;
        position: absolute;
        top: 100rpx;
        left: 40rpx;
        &:before{
            content: '\e6ab';
        }
    }
    .img_content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        height: 400rpx;
        background: #fff;
        justify-content: center;
        align-items: center;
        .modal_img{
            max-height: 100%;
            max-width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
    .modal_bottom{
        position: absolute;
        bottom: 20rpx;
        left: 0;
        height: 100rpx;
        width: 100%;
        justify-content: center;
        align-items: center;
        .modal_save_btn{
            width: 80%;
            padding: 10rpx 20rpx;
            background: #fff;
            color: #222;
            justify-content: center;
            align-items: center;
        }
    }
    
}
.pop_wrapper{
    width: 100%;
    // padding: 10rpx 30rpx;
	background-color: #fff;
	overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
    .pop_header{
        padding: 10rpx 30rpx;
        position: relative;
        height: 80rpx;
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
        padding: 24rpx;
        .track_item{
            position: relative;
            width: 100%;
            height: 100rpx;
            justify-content: start;
            align-items: flex-start;
            padding-bottom: 40rpx;
            .item_left{
                margin-right: 40rpx;
                line-height: 100%;
                height: 100%;
                display: table-cell;
                i{
                    font-size: 40rpx;
                    color: #999;
                    &:before{
                        content: '\e640';
                    }
                }
                
            }
            .item_right{
                display: table-cell;
                color: #999;
            }
            &:before{
                width: 1px;
                content: '';
                position: absolute;
                background: #999;
                height: 75%;
                left: 20rpx;
                top: 30rpx;
            }
        }
        .track_item.last_item{
            &:before{
                height: 0;
            }
        }
        .track_item.checked{
           .item_left i{
                color: #5ebd66;
            }
            
            .item_right{
                color: #222;
            }
        }
    }
}
.label_wrapper{
    padding-top: 40rpx;
    font-size: 24rpx;
}
.return_method_name{
    font-size: 28rpx;
}
.details_item{
    font-size: 28rpx;
    justify-content: start;
    margin-bottom: 10rpx;    
    .label{
        margin-right: 20rpx;
    }
    .copy{
        margin-left: 20rpx;
        padding: 5rpx 10rpx;
        border: 1px solid #ccc;
    }
}
.confirm_cancel_modal{
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1;
    .cancel_content{
        width: 80%;
        // height: 400rpx;
        background: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        padding: 30rpx;
        .confirm_tips{
            color: #666;
            font-size: 24rpx;
            margin-bottom: 30rpx;
            text-align: center;
        }
        .confirm_btns{
            font-size: 28rpx;
            width: 100%;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            .btn_keep{
                width: 80%;
                color: #fff;
                background: #222;
                margin-bottom: 20rpx;
                padding: 20rpx;
                justify-content: center;
                align-content: center;
            }
            .btn_confirm{
                width: 80%;
                color: #222;
                background: #fff;
                margin-bottom: 20rpx;
                border: 1px solid #222;
                padding: 20rpx;
                justify-content: center;
                align-content: center;
            }
        }
    }
}
.return_track_pagecontent{
    padding-bottom: 100rpx;
}
</style>