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
	height: 34.6154rpx;
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
            font-size: 19.24rpx;
            color: #8A61E7;
            text-align: left;
            height: 27rpx;
            margin-bottom: 1.92rpx;
            white-space: nowrap;
        }
        .remaining_process_wrapper{
            background: #F3EDE2;
            height: 6rpx;
            border-radius: 5.77rpx;
            overflow: hidden;
            width: 100%;
            .remaining_process{
                height: 100%;
                background: linear-gradient( 90deg, #87B7FD 0%, #DA49D6 47%, #FF6EA7 100%);
            }
        }
    }
}
</style>