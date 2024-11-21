<template>
	<view class="dui-padding-top-header">
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.description')"></pageHeader>
		<view class="goods-detail-descript-box" v-if="goodsDetail.sku">
			<view class="product-params">
				<block v-for="(value,key) of goodsDetail.groupAttrArr" :key="key">
					<view class="param-item flex" v-if="!(type==1&&key.toLowerCase() =='size')">
						<view class="key">{{key}}:</view>
						<view class="value">{{value}}</view>
					</view>
				</block>
				<view class="param-item flex" v-if="type !=1">
					<view class="key">{{$t('goods_detail.product_code')}}:</view>
					<view class="value flex">
						<text>{{goodsDetail.sku}}</text>
						<view class="copy-item flex align-items-center" @click="handleCopy(goodsDetail.sku)">
							<image mode="widthFix" src="@/static/images/p_detail_copt@2x.png" />
							<text class="copy">{{$t('goods_detail.copy')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				type:'',
				goodsDetail:{
					groupAttrArr:{},
					sku:"",
				}
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
				this.$apis.getProductDetail({product_id: this.id}).then(res =>{
					this.goodsDetail = res.data.product;
					uni.hideLoading()
				})
			},
			handleCopy(data) {
				var that = this
				uni.setClipboardData({
					data,
					showToast:false,
					success() {
						uni.showToast({
						    title: that.$t('goods_detail.copy_success'),
						    icon: 'none',
						    duration: 3000
						});
					}
				})
			}
			
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
