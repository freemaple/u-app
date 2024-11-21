<template>
	<view class="dui-padding-top-header">
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.description')"></pageHeader>
		<view class="goods-detail-descript-box">
			<rich-text :nodes="goodsDetail.description"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				type: '',
				goodsDetail: {}
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.type = e.type;
			this.getDetails();
		},
		methods: {
			// 获取产品详情
			getDetails() {
				this.$apis.getProductDetail({
					product_id: this.id
				}).then(res => {
					this.goodsDetail = res.data.product;
					console.log(this.goodsDetail);
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/mixins.scss';
	.goods-detail-descript-box {
		padding: 46.1539rpx;
		@include MRegular();
		line-height: 1.4;
		word-break: break-word;
	}

	.goods-detail-descript-box img {
		width: 100%;
		height: auto;
		margin-bottom: 20rpx;
	}
	.goods-detail-descript-box ul {
		padding-left: 30.7693rpx;
	}
</style>