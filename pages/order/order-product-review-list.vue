<template>
	<view class="order-review-product-list-box dui-padding-top-header">
		<pageHeader :title="$t('order.order_review_list_title')"></pageHeader>
		<view class="content-box p-24rpx">
			<view class="list-item flex" v-for="(item,index) in list" :key="index">
				<image @click="$public.handleNavTo('/pages/goods-detail/index?id='+item.product_id)"  :src="item.image" mode="widthFix"></image>
				<view class="right">
					<view class="p-title">{{item.name}}{{item.spu_options.size}}</view>
					<view class="p-attr">
						<block v-for="(val,key,index) in item.spu_options">
							{{key}}: {{val}}{{Object.keys(item.spu_options).length - 1 > index?', ':''}}
						</block>
					</view>
					<view class="p-price">{{item.price.symbol}}{{item.price.value}}</view>
					<view class="to-review-btn-box flex justify-content-end align-items-center">
						<view v-if="item.is_reviewed" @click="$public.handleNavTo('/pages/review/list')" class="to-review-btn">{{$t('order.btns.reviewed')}}</view>
						<block v-else>
							<view class="to-review-btn" :class="item.can_review == 0?'_disabled':''" @click="$public.handleNavTo('/pages/review/add?order_id='+item.order_id+'&item_id='+item.item_id+'&product_id='+item.product_id)">{{$t('order.btns.to_review')}}</view>
							<i @click="$refs.popupCanNotReviewTip.open('center')" v-if="item.can_review == 0" class="iconfont icon-question"></i>
						</block>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popupCanNotReviewTip" background-color="#fff">
			<view class="popup-content" style="width:calc(100vw - 40px)">
				<view class="tip-box">
					<view class="tip-title">{{$t('order.can_not_review_tip_title')}}</view>
					<view class="content">
						<view>{{$t('order.can_not_review_tip')}}</view>
					</view>
					<view class="close-btn" @click="$refs.popupCanNotReviewTip.close()">
						{{$t('order.ok')}}
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				id: '',
				isLoad:false,
			}
		},
		methods: {
			getList(){
				this.$apis.orderReviewProductList({order_id:this.id}).then(res => {
					this.list = res.data.products;
					this.isLoad = true;
				}).catch(e=>{
					this.isLoad = true;
				})
			}
		},
		onLoad(e) {
			this.id = e.order_id
		},
		onShow() {
			if(!this.isLoad || (this.isLoad && this.$store.getters.hasLogin)) {
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
.order-review-product-list-box {
	.content-box {
		.list-item {
			margin-top: 24rpx;
			image {
				width: 180rpx;
				margin-right: 24rpx;
			}
			.right {
				flex: 1;
				font-size: 26rpx;
				.p-title {
					margin-bottom: 8rpx;
					word-break: break-word;
				}
				.p-attr {
					margin-bottom: 8rpx;
					font-size: 24rpx;
					color: #777777;
					line-height: 1.5;
				}
				.p-price {
					margin-bottom: 16rpx;
				}
				.icon-question {
					margin-left: 8rpx;
				}
				.to-review-btn-box {
					.to-review-btn {
						line-height: 1;
						padding: 18rpx;
						border: 1px solid #666;
					}
				}
			}
		}
	}
}
.tip-box {
	padding: 28rpx;
	.tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		margin-bottom: 30rpx;
	}
	.content {
		font-size: 28rpx;
		line-height: 1.5;
	}
	.close-btn {
		height: 96rpx;
		text-align: center;
		color: #fff;
		background: #000;
		line-height: 96rpx;
		margin-top: 32rpx;
	}
}
</style>
