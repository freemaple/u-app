<template>
    <view class="campaign_wrapper">
        <view class="top_img_box" v-if="topImgUrl">
            <image
                class="img"
                :src="topImgUrl"
                mode="widthFix"
            />
        </view>
        <view class="campaign_desc_box">
            <view class="inner_text"  v-html="campaign_desc_text"></view>
        </view>
        <view class="time_countdown_box">
            <scroll-view class="type_scroll" :show-scrollbar="false" scroll-x>
                <view class="campaign_types_box flex align-items-center nowrap">
                    <view v-for="(item, index) in typeArr" :key="index" @tap="handleChangeType(item)" :class="'campaign_type_item flex align-items-center justify-content-center ' + (item.active ? 'active ' : '') +'font-bold'">{{ item.text }}</view>
                </view>
            </scroll-view>      
            <view class="ends_in_time">
                <view :class="'ends_in_time_item flex align-items-center justify-content-end ' + (item.active ? '' : 'hide')" v-for="(item, index) in typeArr" :key="index">
                    <view class="ends_in flex justify-content-start align-items-center font-bold">{{ $t('search.ends_in') }}</view>
                    <view class="time flex justify-content-center align-items-center">{{item.d}}d</view>
                    <view class="gap flex justify-content-center align-items-center">:</view>
                    <view class="time flex justify-content-center align-items-center">{{item.h}}h</view>
                    <view class="gap flex justify-content-center align-items-center">:</view>
                    <view class="time flex justify-content-center align-items-center">{{item.m}}m</view>
                    <view class="gap flex justify-content-center align-items-center">:</view>
                    <view class="time flex justify-content-center align-items-center">{{item.s}}s</view>
                </view>
            </view>      
        </view>
    </view>
</template>
<script>
    export default{
        props: {
            countDownType: {
                type: String,
                default: 'dressin_sale'
            }
        },
        data() {
            return{
                typeArr: [],
                campaign_desc_text: '',
				topImgUrl: '',
            }
        },
        created(){
            const that = this
            that.$apis.getlowpricepromotion({}).then(res=> {
                if(res.code == '200'){
                    const {app_low_price_promotion_text, type_arr, title, img} = res.data
                    that.$emit('changeSaleTitle', title)
                    that.campaign_desc_text = app_low_price_promotion_text
					that.topImgUrl = img;
                    const ObjectArr = []
                    type_arr.forEach(item => {
                        const timerObj = {
                            timer: null,
                            d: '00',
                            h: '00',
                            m: '00',
                            s: '00',
                            active: false,
                        }
                        if(that.countDownType == item.key){
                            timerObj.active = true 
                        }
                        ObjectArr.push(Object.assign({}, item, timerObj))
                    })
                    that.typeArr = [...ObjectArr]
                    that.typeArr.forEach(item => {
                        that.refreshTime(item)
                    })
                }
            }).catch(err=> {

            })
            
        },
        methods: {
            handleChangeType(item){
                const that = this
                if(item.active)return
                that.typeArr.find(ite => {
                    ite.active = false
                })
                item.active = true
                that.$emit('handleChangecountDownType', item)
            },
            countdown(item) {
                const {remaining_time:remainingTime, timer} = item
                // 如果剩余时间小于等于0，则倒计时结束
                if (remainingTime <= 0) {
                    clearInterval(timer);
                    item.s = '00'
                    return;
                }

                const days = Math.floor(remainingTime / (60 * 60 * 24));
                const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
                const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
                const seconds = remainingTime % 60;
                const formattedDays = days.toString().padStart(2, '0');
                const formattedHours = hours.toString().padStart(2, '0');
                const formattedMinutes = minutes.toString().padStart(2, '0');
                const formattedSeconds = seconds.toString().padStart(2, '0');
                item.d = formattedDays
                item.h = formattedHours
                item.m = formattedMinutes
                item.s = formattedSeconds
            },
            refreshTime(item){
                const that = this
                // 每秒钟更新一次倒计时
                item.timer = setInterval(()=> {
                    item.remaining_time--
                    that.countdown(item);
                }, 1000);
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";

   .top_img_box{
    width: 100%;
    .img{
        width: 100%;
    }
   } 
   .nowrap{
    flex-wrap: nowrap;
   }
   .campaign_desc_box{
    width: 750rpx;
    min-height: 231rpx;
    padding: 30.77rpx 65.38rpx 26.92rpx 63.46rpx;
    background: linear-gradient( 180deg, rgba(255,255,255,0.8) 0%, #FFFFFF 14%, #FFFFFF 100%);
    border-radius: 31rpx 31rpx 31rpx 31rpx;
    margin-top: -31rpx;
    position: relative;
    font-weight: 400;
    font-size: 23rpx;
    color: #000000;
    line-height: 35rpx;
    overflow: hidden;
    text-align: left;
    .inner_text{
        width: 621.15rpx;
        overflow: hidden;
    }
    /deep/p{
        font-weight: 400;
        font-size: 23rpx;
        color: #000000;
        line-height: 35rpx;
        text-align: left;
        display: flex;
    }
    /deep/.img{
        height: 35rpx;
        margin-right: 5rpx;
    }
   }
   .time_countdown_box{
    height: 173rpx;
    width: 100%;
    padding: 11.54rpx 30.77rpx 32.69rpx;
    position: relative;
    @include onepxBorder(#F1F1F1);
    background: #FFF;
    .type_scroll{
        height: 61.54rpx;
    }
    .campaign_types_box{
        overflow-x: auto;
        .campaign_type_item{
            width: 123.08rpx;
            height: 61.54rpx;
            background: #F5F5F5;
            border-radius: 35rpx 35rpx 35rpx 35rpx;
            font-size: 27rpx;
            color: #333333;
            margin-right: 19.23rpx;
            flex-shrink: 0;
            &.active{
                background: #FFA80A;
                color: #fff;
            }
            &:last-child{
                margin-right: 0;
            }
        }
    }
    .ends_in_time{
        width: 100%;  
        margin-top: 30.77rpx;      
        .ends_in_time_item{
            width: 100%;
            &.hide{
                display: none;
            }
            .ends_in{
                width: 105.77rpx;
                height: 38rpx;
                font-size: 27rpx;
                color: #333333;
                line-height: 32rpx;
            }
            .time{
                min-width: 53.85rpx;
                overflow: hidden;
                height: 34.62rpx;
                background: #FFA80A;
                font-size: 23rpx;
                color: #FFFFFF;
                border-radius: 4rpx 4rpx 4rpx 4rpx;
            }
            .gap{
                font-size: 23rpx;
                color: #333333;
                width: 23rpx;
                height: 33rpx;
            }
        }
    }
   }
</style>