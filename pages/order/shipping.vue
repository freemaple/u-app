<template>
    <view class="view_shipping_box dui-padding-top-header">
        <pageHeader :title="$t('viewShipping.view_shipping')"></pageHeader>
        <view class="shipping_content">
            <view class="track_front">
                <view class="tabs_wrapper">
                    <view class="tabs flex" v-if="packages.length > 1">
                        <view @tap="handleClickTab(index)" v-for="(item, index) in packages" :key="index" :class="'tab_item font-bold flex ' + (activeIndex== index ? 'active' : '')">{{ $t('viewShipping.package') }} {{ index + 1 }}</view>
                    </view>
                </view>
                <view class="products_wrapper">
                    <view class="products flex">
                        <view class="product_item flex" v-for="(item,index) in packages[activeIndex]&&packages[activeIndex].product" :key="index">
                            <image class="picture" :src="item.image" alt=""></image>
                            <view class="count flex">x{{ item.qty }}</view>
                        </view>
                    </view>
                </view>
                <view class="order_details" v-show="packages[activeIndex]&&packages[activeIndex].tracknumber">
                    <!-- <view class="track_name">{{ packages[activeIndex]&&packages[activeIndex].shipping_code }}</view> -->
                    <view class="tracking_no">{{ $t('viewShipping.tracking_number') }}</view>
                    <view class="tracking_no_wrapper flex">
                        <view class="no font-bold">{{ packages[activeIndex]&&packages[activeIndex].tracknumber }}</view>
                        <view class="copy" @tap="()=>{$copyId(packages[activeIndex]&&packages[activeIndex].tracknumber)}">{{ $t('viewShipping.copy') }}</view>
                    </view>
                </view>
                <!--<view class="estimate_tracking">
                    <view class="tips">
                        <!-- <view class="tips_tittle">{{ $t('viewShipping.estimate_delivery_time') }}:</view> -->
                         <!--<view class="flex time_text">
                            <view>{{ $t('viewShipping.arrives_between') }}{{"&nbsp"}}</view>
                            <view class="date_range">{{ ageing_info.ageing }}</view>
                        </view>
                    </view>
                    <view class="percent_time flex">
                        <view class="text">{{ ageing_info.ageing_title}}</view>
                        <view class="tips_wrapper" @tap="$refs.popupAgeing.open('bottom')">
                            <i class="iconfont"></i>
                        </view>                        
                    </view>
                    <view class="estimate_tips flex"><text class="warning-tip">!</text><view class="estimate_tips_text">{{ $t('viewShipping.estimate_tips_text') }}</view></view>
                </view>-->
            </view>
            <view :class="'track_content flex ' + (packages[activeIndex]&&packages[activeIndex].track&&packages[activeIndex].track.nowData&&packages[activeIndex].track.nowData.length == 1 ? 'single_item' : '')">
                <view class="flex">
                    <view class="track_item flex" v-for="(item,index) in packages[activeIndex]&&packages[activeIndex].track&&packages[activeIndex].track&&packages[activeIndex].track.nowData" :key="index">
                    <view class="item_left">
                        <view class="date">{{ item.date }}</view>
                        <view class="time">{{ item.time }}</view>
                    </view>
                    <view class="item_middle"> 
                        <image  class="track_img" mode="widthFix" v-if="item.status" :src="(index == '0' ? item.check_img: item.img)" ></image>
                        <view v-else class="mark"></view>
                    </view>
                    <view class="item_right">
                        <view class="status" v-if="item.status">{{ item.status }}</view>
                        <view class="location" v-if="item.location">{{ item.location }}</view>
                    </view>
                </view>
                </view>
                <view class="view_all opt flex" v-show="packages[activeIndex]&&packages[activeIndex].track&&packages[activeIndex].track.shortData&&!packages[activeIndex].track.showAll" @tap="handleShowAll()">
                    <view class="font-bold">{{ $t('viewShipping.view_all') }}</view>
                    <i class="iconfont"></i>
                </view>
                <view class="pack_up opt flex" @tap="handlePackUp" v-show="packages[activeIndex]&&packages[activeIndex].track&&packages[activeIndex].track.showAll">
                    <view class="font-bold">{{ $t('viewShipping.pack_up') }}</view>
                    <i class="iconfont"></i>
                </view>
            </view>
        </view>
        <!-- 物流时效弹窗 -->
        <uni-popup ref="popupAgeing" background-color="#fff">
        	<popupContentTemplate :title="$t('viewShipping.standard_shipping')" @close="$refs.popupAgeing.close()">
        		<template v-slot:content>
					<view class="text-center ageing-list-title">{{ageing_info['ageing_title']}}</view>
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
    </view>
</template>

<script>
export default {
    data(){
        return {
            packages: [],
            activeIndex: 0,
            screenHeight: 0,
			ageing_info:{},
        }
},
    onLoad(options){
        const {order_id} = options
        this.order_id = order_id
        this.initTrack()
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
        initTrack() {
            const that = this
            const order_id = that.order_id
            that.$apis.viewShippingTrack({order_id}).then(res =>{
                uni.hideLoading()
                if(res.code == '200') {
                    const {packages} = res.data
                    packages.forEach(item => {
                        if(item.track&&item.track.trackData&&item.track.trackData.length > 5) {
                            that.$set(item.track, 'showAll', false)
                            const shortData = [...item.track.trackData].splice(0,5)
                            that.$set(item.track, 'shortData', shortData)
                            that.$set(item.track, 'nowData', shortData)
                        }
                        else{
                            that.$set(item.track, 'nowData', item.track.trackData) 
                        }
                        
                    });
                    that.packages = packages
					that.ageing_info = res.data.ageing_info
                }
            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleClickTab(index) {
            const that = this
            that.activeIndex = index
        },
        handleShowAll(){
           const that = this
           that.packages[that.activeIndex].track.nowData = that.packages[that.activeIndex].track.trackData
           that.packages[that.activeIndex].track.showAll = true
        },
        handlePackUp() {
            const that = this
            that.packages[that.activeIndex].track.nowData = that.packages[that.activeIndex].track.shortData
            that.packages[that.activeIndex].track.showAll = false
        },
        handleOpenPopup(){
            this.$refs.bottom_time_popup.open()
        },
    }

}

</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";

.shipping_content{
    // padding: 0 12px;
    background: #eee;
    .tabs_wrapper{
        width: 100%;
        overflow-x: auto;
    }
    .tabs{
        height: 80rpx;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: start;
        @include onepxBorder(#e0e0e0);
        .tab_item{
            width: 200rpx;
            height: 100%;
            margin-right: 30rpx;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 14px;
            flex-shrink: 0;
            &.active{
                color: #222;
            }
        }
    }
    .products_wrapper{
        width: 100%;
        height: 200rpx;
        overflow-x: auto;
        .products{
            height: 100%;
            flex-wrap: nowrap;
            .product_item{
                width: 150rpx;
                margin-right: 20rpx;
                flex-shrink: 0;
                position: relative;
                .picture{
                    width: 100%;
                    max-height: 100%;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .count{
                    width: 40rpx;
                    height: 40rpx;
                    right: 0;
                    position: absolute;
                    bottom: 0;
                    background: #fff;
                    color: #222;
                    justify-content: center;
                    opacity: .8;
                    align-items: center;
                    font-size: 24rpx;
                }
            }
        }
    }
}
.track_content{
    width: 100%;
    padding: 20rpx 12px;
    margin-top: 18rpx;
    .track_item{
        width: 100%;
        min-height: 80rpx;
        flex-wrap: nowrap;
        padding-bottom: 60rpx;
        font-size: 24rpx;
        .item_left{
            width: 180rpx;
            height: 100%;
            // margin-right: 30rpx;
            .date{
                text-align: right;
                color: rgba(153,153,153,40%);
                width: 100%;
            }
            .time{
                text-align: right;
                color: rgba(153,153,153,40%);
                width: 100%;
            }
        }
        .item_middle{
            width: 80rpx;
            height: 140%;
            position: relative;
            .track_img{
                width: 40rpx;
                position: absolute;
                background: #fff;
                z-index: 1;
                top: 0;
                left: 50%;
                transform: translateX(-50%);

            }
            .mark{
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                background: #ccc;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
            }
            &:after{
                content: '';
                position: absolute;
                // width: 1px;
                border-left: 1px solid #e5e5e5;
                height: 100%;
                left: 49%;
                top: 20rpx;
                // background: red;

            }
        }
        .item_right{
            flex: 1;
            .location{
                width: 100%;
                color: rgba(153,153,153,40%);
            }
            .status{
                width: 100%;
                color: rgba(34,34,34,40%);
            }
        }
        &:last-child{
            .item_middle:after{
                height: 0;
            }
        }
    }


    .track_item:first-child{
        .status, .date{
            color: #222;
        }
        .location, .time{
            color: #666;
        }
    }  
}
.single_item .item_middle{
    height: 0!important;
}
.opt{
    width: 100%;
    height: 80rpx;
    background: #fff;
    justify-content: center;
    align-items: center;
    color: #222;
    i{
        color: #999;
        font-size: 24px;
        margin-left: 20rpx;
        &:before{
            content: '\e661';
        }
    }
}
.pack_up i:before{
    content: '\e641';
}
.order_details{
    width: 100%;
    background: #f6f6f6;
    padding: 40rpx 20rpx;
    margin: 80rpx 0 0;
    .track_name{
        font-size: 28rpx; 
        color: #222;
    }
    .tracking_no{
        color: #666;
        margin-top: 30rpx;
        font-size: 24rpx;
        
    }
    .tracking_no_wrapper{
        justify-content: space-between;
        align-items: center;
        margin-top: 30rpx;
        .no{
            font-size: 28rpx;
        }
        .copy{
            border: 1px solid #999;
            padding: 6rpx 10rpx;
            font-size: 24rpx;
        }
    }

}
.track_front, .track_content{
    padding: 20rpx 24rpx;
    background: #fff;
}
.estimate_tracking{
    font-size: 24rpx;    
    padding: 30rpx 20rpx;
}
.estimate_tracking .tips{
    font-size: 24rpx;
    color: #222;
}
.estimate_tracking .tips .tips_tittle{
    color: #767676;
    margin-bottom: 10rpx;
}
.estimate_tracking .tips .date_range{
    margin-left: 5rpx;
    color: rgb(25, 128, 85);
}
.time_text{
    margin-top: 10rpx;
}
.estimate_tips{
    color: #767676;
    font-size: 28rpx;
    margin-top: 10rpx;
	.warning-tip {
		width: 32rpx;
		text-align: center;
		height: 32rpx;
		border-radius: 50%;
		border: 1px solid #959595;
		font-size: 20rpx;
		transform: scale(0.8);
		color: #959595;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.estimate_tips_text{
    flex: 1;
}
.estimate_tips>i{
    color: #999;
    font-size: 32rpx;
    margin-right: 10rpx;
}
.estimate_tips>i:before{
    content: '\e652';
}
.percent_time{
    margin-top: 20rpx;
}
.percent_time .text{
    color: #a86104;
}
.percent_time i{
    color: #959595;
    font-size: 32rpx;
}
.percent_time i:before{
    content: '\e613';
}
.tips_wrapper{
    margin-left: 5rpx;
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
        @include onepxBorder(#e0e0e0);
        i{
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #999;
            font-size: 12px;
            // transform: translateY(-50%);
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
}
.ageing-list-title {
	background: #f5fcfb;
	color: #A86104;
	padding: 10rpx 0;
	margin-bottom: 10rpx;
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