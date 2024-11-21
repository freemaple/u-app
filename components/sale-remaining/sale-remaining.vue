<template>
  <view class="remaining_box align-items-center flex no_wrap">
    <view class="img_box">
        <image class="img" src="~/static/images/lower_price/lower_price_flash@2x.png" style="width: 100%;" mode="widthFix" />
    </view>
    <view class="remaining_content flex align-items-center">
        <view class="content_text font-bold">{{remaining_count}}</view>
        <view class="remaining_process_wrapper">
            <view class="remaining_process" :style="'width:' + (percent > 100 ? 100 : percent) + '%'"></view>
        </view>
    </view>
  </view>
</template>

<script>
export default {
    props: {
        remaining_count: {
            type: String,
            default: "20"
        },
        percent: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.no_wrap{
    flex-wrap: nowrap;
}
.remaining_box{
    margin-top: 11.54rpx;
    .img_box{
        width: 30.77rpx;
        height: 30.77rpx;
        margin-right: 7.69rpx;
        .img{
            width: 100%;
            height: 100%;
        }
    }
    .remaining_content{
        flex: 1;
        flex-wrap: wrap;
        .content_text{
            font-size: 19rpx;
            color: #FF5C00;
            text-align: left;
            height: 27rpx;
            margin-bottom: 1.92rpx;
            white-space: nowrap;
        }
        .remaining_process_wrapper{
            background: #F3EDE2;
            height: 6rpx;
            width: 100%;
            .remaining_process{
                height: 100%;
                background: linear-gradient( 90deg, #FF5C00 0%, #FFA80A 100%), linear-gradient( 90deg, #FF5C00 0%, #FFA80A 100%), #FFA80A;
            }
        }
    }
}
</style>>