<template>
    <view class="return_records_wrapper dui-padding-top-header">
        <pageHeader :title="$t('returnRecords.title')"></pageHeader>

        <!-- <view>return-records</view>
        <view>退货/退款申请记录页面</view> -->
        <view v-if="afterSaleList.length" class="refund_records_list">
            <view v-for="item in afterSaleList" :key="item.sale_no" class="refund_record_item">
                <view class="return_title font-bold flex">{{ item.type == '2' ? $t('returnRecords.return_item') : $t('returnRecords.refund_item') }}</view>
                <view class="product_wrapper">
                    <view class="return_products_list flex">
                        <view v-for="ite in item.products" :key="ite.product_id" class="product_item">
                            <view class="single_product_box">
                                <image class="product_img" :src="ite.image" alt=""/>
                                <view class="product_qty">x{{ ite.qty }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="status flex">
                    <view class="label">{{ $t('returnRecords.status') }}</view>
                    <view class="content">{{ item.status }}</view>
                </view>
                <view class="status flex" v-if="item.total">
                    <view class="label">{{$t('returnRecords.refund_amount')}}</view>
                    <view class="content">{{ item.symbol }}{{ item.total }}</view>
                </view>
                <view class="status flex">
                    <view class="label">{{$t('returnRecords.refund_method')}}</view>
                    <view class="content">{{ item.refund_method }}</view>
                </view>
                <view class="status flex" v-if="item.tracking_number">
                    <view class="label">{{$t('returnRecords.tracking_no')}}</view>
                    <view class="content">{{ item.tracking_number }}</view>
                </view>
                <view class="bottom_wrapper flex" style="justify-content: flex-end;">
                    <view class="to_detail_btn" v-if="item.type == '2' && item.is_edit" @tap="handleOpenTrack(item)">{{ $t('returnRecords.check_return_receipt') }}</view>
                    <view class="to_detail_btn" @tap="toDetails(item)">{{ $t('returnRecords.details') }}</view>
                </view>
            </view>
        </view>
        <view v-else class="no_records">
            <image src="/static/images/search_empty.png" />
            <text>{{ $t('returnRecords.no_records') }}</text>
        </view>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_tracking_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{ $t('returnRecords.upload_tracking') }}</view>
                            <i class="iconfont" @tap="closePopup('bottom_tracking_popup')"></i>
                        </view>
                        <view class="tracking_tip">{{ $t('returnRecords.tracking_edit_tip') }}</view>
                        <view class="track_wrapper">
                            <view class="company">
                                <view class="tittle">{{ $t('returnRecords.shipping_company') }}</view>
                                <view class="options">
                                    <view v-for="(val,key) in company" :key="key" :class="'one_option flex ' + (val==checkedCompany ? 'checked' : '')" @tap="handleSelect(val)">
                                        <view class="checkbox"><i class="iconfont"></i></view>
                                        <view class="item_text">{{ val }} </view>
                                    </view>
                                </view>
                            </view>  
                            <view class="tracking_no">
                                <view class="tittle">{{ $t('returnRecords.return_tracking_no') }}</view>
                                <input v-model="tracking_no" class="uni-input" :placeholder="$t('returnRecords.pls_input_no')" />
                            </view>  
                            <view class="submit flex align-items-center justify-content-center">
                                <view @tap="handleSubmit()" :class="'sub_btn ' +  (!tracking_no || !checkedCompany ? 'disabled' : '')">{{ $t('returnRecords.submit') }}</view>
                            </view>                        
                        </view>
                        
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
    </view>
  
</template>

<script>
export default {
    data() {
        return {
            afterSaleList: [],
            screenHeight: 0,
            tracking_no: '',
            company: {},
            checkedCompany: '',
            sale_no: '',
        }
    },
    onLoad(options) {
        const that = this
        const {order_id} = options
        that.order_id = order_id
        this.initList()
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
        initList() {
            const that = this 
            const order_id = that.order_id
            that.$apis.queryReturnRecords({order_id}).then(res => {              
                uni.hideLoading()
                if(res.code == '200') {
                    that.afterSaleList = res.data.afterSaleList
                    that.company = res.data.company
                }
            }).catch(err => {
                uni.hideLoading()
            })
        },
        handleSubmit(){
            const that = this
            if(!that.checkedCompany || !that.tracking_no)return
            const data = {
                sale_no: that.sale_no,
                tracking_number: that.tracking_no,
                tracking_company: that.checkedCompany,
            }
            that.$apis.submitReturnTrack(data).then(res => {
                uni.hideLoading()
                if(res.code=='200'){
                    that.initList()
                    that.closePopup('bottom_tracking_popup')
                }
            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleOpenTrack(item){
            this.checkedCompany = item.tracking_company
            this.tracking_no = item.tracking_number
            this.sale_no = item.sale_no
            this.openPopup('bottom_tracking_popup')
        },
        toDetails(item){
            const {order_id, sale_no} = item
            uni.navigateTo({ url: '/pages/return-track/return-track?order_id=' + order_id + '&sale_no=' + sale_no })
        },
        closePopup(key){
            this.$refs[key].close()
        },
        openPopup(key){
            this.$refs[key].open()
        },
        handleSelect(val){
            this.checkedCompany = val
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";

.no_records{
    padding-top: 3rem;
    width: 100%;
    text-align: center;
    background: #fff;
    image{
        width: 200rpx;
        height: 200rpx;
        display: block;
        margin: 0 auto;
    }
}
.return_records_wrapper{
    background: #eee;
	font-size: 28rpx;
}
.refund_records_list{
    background: #fff;
    width: 100%;
    padding: 0 24rpx;
    margin-top: 20rpx;
    .refund_record_item{
        width: 100%;
        .return_title{
            color: #222;
            font-size: 32rpx;
            height: 50rpx;
            align-items: center;
            justify-content: start;
            padding: 20rpx 0;
        }
        .product_wrapper{
            overflow-x: auto;
            overflow-y: hidden;
            width: 100%;
            height: 200rpx;
            margin: 40rpx 0;
        }
        .return_products_list{            
            flex-wrap: nowrap;
            height: 200rpx;
            align-items: center;
            justify-content: start;
            .product_item{
                width: 160rpx;
                height: 160rpx;
                margin-right: 50rpx;
                flex-shrink: 0;
                .single_product_box{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    .product_img{
                        width: 100%;
                        height: 100%;
                    }
                    .product_qty{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    }
                }
            }
        }
        .status{
            justify-content: start;
            align-items: center;
            margin: 30rpx 0;
            color: #222;
            font-size: 24rpx;
            .label{
                margin-right: 20rpx;
            }
        }
        .bottom_wrapper{
            height: 80rpx;
            justify-content: end;
            align-items: center;
            .to_detail_btn{
                background: #222;
                color: #fff;
                font-size: 28rpx;
                padding: 18rpx 30rpx;
                margin-left: 10rpx;
            }
        }
    }
}
.pop_wrapper{
    width: 100%;
	background-color: #fff;
	overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
    .pop_header{
        padding: 10rpx 30rpx;
        position: relative;
        height: 80rpx;
        @include onepxBorder(#e0e0e0);
        i{
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #999;
            font-size: 28rpx;
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
        margin-top: 5rpx;  
        .company, .tracking_no{
            @include onepxBorder(#e0e0e0); 
        }  
        .tracking_no{
            padding: 20rpx 0;
        }          
       .tittle{
            font-size: 24rpx;
            color: #666;
            text-transform: capitalize;
            padding: 10rpx 0;
            line-height: 1.5;
       }
       .one_option{
            padding: 20rpx;
            align-items: center;
            font-size: 28rpx;
            i{
                display: inline-block;
                width: 60rpx;
                padding-right: 20rpx;
                font-size: 40rpx;
                &:before{
                    content: '\e63b';
                }
            }
       }
       .one_option.checked{
            i:before{
                content: '\e6c2';
            }
        }
       
    }
    
   
}
.tracking_tip{
    background: #fff1d5;
    font-size: 24rpx;
    color: #222;
    padding: 20rpx 30rpx;
}
.submit{
    margin-top: 20rpx;
    .sub_btn{
        background: #222;
        color: #fff;
        font-size: 28rpx;
        padding: 20rpx 34rpx;
        margin-left: 10rpx;
    }
    .sub_btn.disabled{
        opacity: 0.5;
    }
}
</style>