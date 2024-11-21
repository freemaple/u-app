<template>
	<view class="dui-padding-top-header">
		<pageHeader :isTitleUppercase="true" :styleType="2" :title="$t('goods_detail.materials')"></pageHeader>
		<view class="goods-detail-descript-box">
			<view class="product-params">
				<block v-for="(value,key) of goodsDetail.material_composition" :key="key">
					<view class="param-item flex">
						<view class="key">{{key}}:</view>
						<view class="value">{{value}}</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				goodsDetail:{
					material_composition:{}
				}
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.getDetails();
		},
		methods: {
			// 获取产品详情
			getDetails() {
				this.$apis.getProductDetail({product_id: this.id}).then(res =>{
					this.goodsDetail = res.data.product;
					uni.hideLoading()
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
.goods-detail-descript-box .product-params {
	padding: 40rpx 32rpx;
	font-size: 32rpx;
}

.goods-detail-descript-box .param-item {
	color: #333;
	margin-bottom: 28rpx;
	flex-wrap: wrap;
}

.goods-detail-descript-box .param-item .key {
	width: 38%;
	color: #666;
	word-break: break-word;
}
.goods-detail-descript-box .param-item .value {
	flex: 1;
}
.goods-detail-descript-box .param-item .copy-item .copy {
	color: #0071E3;
	font-size: 28rpx;
}
.goods-detail-descript-box .param-item .copy-item image {
	width: 36rpx;
	margin-left: 10rpx;
	margin-right: 10rpx;
}

.goods-detail-descript-box .description-box {
	/* font-size: 28rpx; */
	padding: 24rpx;
}

.goods-detail-descript-box .description-box>>>img {
	max-width: 100%;
}
</style>
