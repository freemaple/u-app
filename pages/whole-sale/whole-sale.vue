<template>
  <view class="whole_sale_box">
	<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
    <navigation :showBack="true" :title="$t('popupleft.whole_sale')"  :nowRef="refName" id="Navigation" :show-search="true"></navigation>
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
        that.initWholeSale()
    },
    
    methods: {
        initWholeSale() {
            const that = this
            that.$apis.initWholeSaleQuery().then(res =>{
                uni.hideLoading()
                if(res.code == 200) {
                    that.goods = res.data.products.coll
                }
            })
        },
    }
}
</script>

<style>
.whole_sale_box{
    padding-top: 88rpx;
}
</style>