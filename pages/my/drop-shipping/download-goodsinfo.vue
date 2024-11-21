<template>
    <view class="container">
        <nav-back :title="$t('my.download_goodsinfo')"></nav-back>
        <view class="content_wrapper">
            <view class="tip">{{ $t("my.download_tip") }}</view>
            <view class="download_lists">
                <view class="download_item" @tap="handleToDownload(item.zip_url)" v-for="item in records" :key="item.category_id">
                    <view class="text">{{ item.brname }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default{
    data(){
        return{
            records: []
        }
    },
	onLoad(){
		this.getInfo();
	},
    methods: {
		getInfo() {
			this.$apis.getDropshippingGoodsinfo().then(res=>{
				this.records = res.data.records;
			})
		},
        handleToDownload(url){
            // #ifdef APP-PLUS
				plus.runtime.openURL(url);
			// #endif
			// #ifdef H5
				window.open(url);
			// #endif
        }
    }
}
</script>
<style lang="scss" scoped>
.content_wrapper{
    padding: 12px;
    .tip{
        font-size: 16px;
        color: #222;
        margin-bottom: 20rpx;
    }
}
.download_lists{
    
    .download_item{
        font-size: 14px;
        width: 100%;
        margin-bottom: 10rpx;
        .text{
            height: 50rpx;
            line-height: 50rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            display: block;
            text-decoration: underline;
        }
    }
}
</style>