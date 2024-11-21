<template>
    <view class="container">
        <nav-back :title="$t('my.drop_shipping')"></nav-back>
        <view class="card-list">
            <view @tap="handleTo(item)" v-for="item in cardListData" :key="item.title"
                class="card-item flex align-items-center justify-content-center">
                <i :class="'iconfont2 ' + item.type"></i>
                <view class="card-content flex align-items-center justify-content-between">
                    <view class="text">
                        {{ item.language?$t(item.language,{site_name: $store.state.site_name_upper}):item.title }}
                    </view>
                    <i class="iconfont"></i>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data(){
        return{
            cardListData: [
                {
                    language:'my.drop_shippping_information',
					type: 'iconfont3 icon-personal-information',
					url: '/pages/my/drop-shipping/edit'
                },
                {
                    language:'my.download_goodsinfo',
					type: 'iconfont3 icon-download-goodsinfor',
					url: '/pages/my/drop-shipping/download-goodsinfo'
                }
            ]
        }    
    },
    methods: {
        handleTo(item) {
            if (item.url) {
                uni.navigateTo({
                    url: item.url
                })
            } else {
				// this.$emit('emitClick',item)
			}
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    background-color: #f3f3f3;
	// height: 100vh;
}
@import "@/common/mixins.scss";

.card-list {
    width: 100%;
    z-index: 1;
    background: #fff;
    .card-item {
        width: 100%;
        height: 90rpx;
        // padding-left: 41.25rpx;
        box-sizing: border-box;

        >i {
            width: 54rpx;
            font-size: 46.5rpx;
            color: #444;
            height: 100%;
            line-height: 90rpx;
        }

        .card-content {
            width: calc(100% - 165rpx);
            height: 100%;
            font-size: 24rpx;
            color: #444;
            padding-left: 22.5rpx;
            position: relative;
            @include onepxBorder(#e0e0e0);

            >i {
                font-size: 40rpx;

                &::before {
                    color: #ccc;
                    content: "\e609";
                }
            }
        }
    }
}
</style>