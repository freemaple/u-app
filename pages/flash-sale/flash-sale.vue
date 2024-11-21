<template>
  <view class="flash_sale_box">
	<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
    <navigation :showBack="true" :title="$t('popupleft.flash_sale')" :nowRef="refName" id="Navigation" :show-search="true"></navigation>
    <good-list @popupChange="(value)=>{pageMetaShow=value}" :loadingMoreHidden="true" :isFirstQuery="true" :goods="goods" :ishowSpecialPriceOff="true" :showLoading="false"></good-list>

  </view>
</template>

<script>
export default {
    data() {
        return {
			pageMetaShow:false,
            refName: 'whole_sale',
            language: {
				category_list: 'Dress',
				empty_product: ''
			},
            goods: [],
        }
    },
    onLoad: function() {
        const that = this
        that.initFlashSale()
    },
    methods: {
        initFlashSale() {
            const that = this
            that.$apis.initFlashSaleQuery().then(res =>{
                uni.hideLoading()
                if(res.code == 200) {
                    that.goods = res.data.products
                }
            })

        }
    }
}
</script>

<style>
.flash_sale_box{
    height: calc(100% - 48px);
    padding-top: 88rpx;
}
</style>