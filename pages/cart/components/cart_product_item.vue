<template>
	<!-- special_type>0 属于特价活动商品 -->
	<view class="flex align-items-center no-wrap cart-list-product-item-box" :class="{'not-active_product_item':item.not_active_status>0,'isBelongSpecialActivity':item.special_type>0}"
		:style="item.left">
		<!-- 如果是享受优惠的y集合产品，禁止选中/取消选中 -->
		<!-- itemtype【n_n:普通】【y_n：y不享受优惠】【y_y：y享受优惠】【x_n：x商品】 -->
		<!-- not_active_status 1:已下架 2无库存 -->
		<view @click="$emit('handleEmitSelect',item)" :class="getClass(item.active,item.itemtype,item.not_active_status)" ></view>
		<view class="goods-info flex no-wrap justify-content-between">
			<view @click="item.not_active_status==1?'':toProductDetail(item,index);productClick(item, itemIndex)"  class="img-box position-relative">
				<image mode="aspectFit" :src="item.img_url" class="img" />
				<!-- 理论上特价商品不会是会员商品,因为后端脚本问题,会出现共存的情况,所以多加一(item.member_product!=1 || !showVip)判断 -->
				<specialOfferDiscountTab v-if="item.special_type>0&&(item.member_product!=1 || !showVip)" :discount="item.discount_off"></specialOfferDiscountTab>
				<view v-if="showVip && item.member_product == 1" class="vip-member-discount_off">-{{item.discount_off}}%</view>
				<view v-else-if="item.line_price&&item.special_type<=0 " class="special-price-discount_off">-{{item.discount_off}}%</view>
				<view class="product-item-not-active-mask" v-if="item.not_active_text">
					<view class="product-item-not-active-text">{{item.not_active_text}}</view>
				</view>
				<!-- 如果无库存 优先显示无库存文案 special_type>0是特价活动商品；spu_stock_type==0表示显示only x left的文案，其他类型的文案不展示 -->
				<specialOfferStockTextBox v-if="!item.not_active_text&&item.special_type>0 &&item.special_data && item.special_data.spu_stock_type === 0&&item.special_data.is_show==1" :text="item.special_data.spu_stock_text"></specialOfferStockTextBox>
				
			</view>
			<view class="text-box flex justify-content-between flex-column">
				<view>
					<view class="r-top flex justify-content-between align-items-center">
						<view @click="item.not_active_status==1?'':toProductDetail(item,index);productClick(item, itemIndex)" class="goods-title text-overflow-ellipsis">{{ item.name }}</view>
						<view @click.stop="$emit('handleEmitDelete',item)" class="delete">{{$t('cart.remove')}}</view>
					</view>
					<!-- 颜色尺寸 -->
					<view v-if="item.spu_options_str" class="goods-label">
						<view class="label-box flex align-items-center">
							<view class="label-name text-overflow-ellipsis">
								<block v-for="(attr,key,index) in item.custom_option_info">
									<text>{{attr}}</text>
									<text style="padding: 0 8rpx;" v-if="index+1<Object.keys(item.custom_option_info).length">;</text>
								</block>
							</view>
							<view @click.stop="$emit('handleEmitEdit',item);productClick(item, itemIndex)" v-if="item.not_active_status!=1&&item.itemtype.indexOf('y_y') == -1" class="edit">{{$t('cart.edit')}}</view>
						</view>
					</view>
					<!-- 优惠券-->
					<view v-if="item.explain" class="show-coupon flex align-items-center">
						<view class="iconfont iconfont-coupon"></view>
						<view >{{item.explain}}</view>
					</view>
				</view>
				<view class="r-bottom flex justify-content-between align-items-end">
					<view class="vip-member-price-box" v-if="showVip && item.member_product == 1">
						<view class="text-line-through-and-gray">{{currencySymbol}}{{item.line_price}}</view>
						<view class="flex align-items-center">
							<!-- <image class="vip-icon" mode="widthFix" src="@/static/images/vip/vip_icon.png"></image> -->
							<text class="vip-member-price font-bold">{{currencySymbol}}{{item.product_price}}</text>
						</view>
					</view>												
					<view v-else class="goods-price">
						<view class="has-discount-price" v-if="item.line_price">
							<view class="special-price">{{ currencySymbol }}{{ item.product_price }}</view>
							<view class="original-price">{{currencySymbol}}{{item.line_price}}</view>
						</view>
						<view v-else class="normal-price">{{ currencySymbol }}{{ item.product_price }}</view>
						
					</view>
					<view class="not-active-status-box" :class="item.if_subscribe==1?'_disabled':''" v-if="item.not_active_status">
						<view class="not-active-status" @click="$emit('handleEmitOutOfStock',item)" v-if="item.not_active_status==2">{{$t('cart.out_of_stock_text')}}</view>
						<view class="not-active-status" @click="$emit('handleEmitOffShelf',item)" v-if="item.not_active_status==1">{{$t('cart.off_shelf')}}</view>
					</view>
					<view v-else class="buy-num flex justify-content-center align-items-center">
						<view class="jian-btn"
							@tap.stop.prevent="$emit('handleEmitReduceNumber',item)">
						</view>
						<input @focus="(e)=>{$emit('handleEmitFocus',{e,item})}" @blur="(e)=>{$emit('handleEmitBlur',{e,item})}" step="1" style="width: 68rpx;text-align: center;margin: 0 4rpx;" type="number" v-model="item.qty" />
						<view class="jia-btn iconfont" :class="item.special_data&&item.special_data.btn_grey?'_disabled':''"
							@tap.stop.prevent="$emit('handleEmitAddNumber',item)"
							>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue';
	import specialOfferStockTextBox from '@/components/special-offer-stock-text/special-offer-stock-text.vue';
	export default {
		components: {
			specialOfferDiscountTab,
			specialOfferStockTextBox
		},
		props: {
			showVip: {
				type:Boolean,
				default:false,
			},
			item:{
				type:Object,
				default(){
					return {}
				}
			},
			itemIndex:{
				type: Number
			},
			moduleName: {
				type:String,
				default: ''
			},
			currencySymbol:{
				type:String,
				default: ''
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			getClass(active,itemtype,not_active_status) {
				const a = active==1?'icon-radio-checked':'icon-radio-check';
				const b = itemtype.indexOf('y_y') == -1 && not_active_status<=0?'':'icon-radio-disabled';
				return a+' '+b;
			},
			toProductDetail(item, index){
				let url = '/pages/goods-detail/index?id='+item.product_id;
				if(this.moduleName){
					url +="&module=" + this.moduleName;
				}
				this.$public.handleNavTo(url);
			},
			productClick(item, index){
				let product_track_data = {
					sku: item.sku,
					name: item.name,
					price: item.base_product_price || '',
					module: 'cart'
				};
				this.$maEvent.product_click(product_track_data, index);
				this.$emit('cartProductClick', item, index);
			}
		}
	}
</script>

<style lang="scss" scoped>
.cart-list-product-item-box.not-active_product_item {
	.special-price {
		color: #999;
	}
	.normal-price {
		color: #999;
	}
	.vip-member-price {
		color: #999;
	}
}
.cart-list-product-item-box.isBelongSpecialActivity {
	.text-box {
		.goods-price {
			.has-discount-price {
				.special-price {
					color: #FF5C00FF;
				}
			}
		}
	}
}
.cart-list-product-item-box {
	.icon-radio-check {
		width: 44rpx;
		height:44rpx;
		background-image: url('@/static/images/cart/radio_check@2x.png');
		background-size: cover;
		margin-right: 20rpx;
	}
	.icon-radio-checked {
		width: 44rpx;
		height: 44rpx;
		background-image: url('@/static/images/cart/radio_checked@2x.png');
		background-size: cover;
		margin-right: 20rpx;
	}
	.icon-radio-disabled {
		width: 44rpx;
		height: 44rpx;
		background-image: url('@/static/images/cart/radio_disabled@2x.png');
		background-size: cover;
		margin-right: 20rpx;
		pointer-events: none;
	}
	.goods-info {
		padding: 0;
		box-sizing: border-box;
		flex: 1;
		.delete {
			color: #000;
			font-size: 28rpx;
			margin-left: 22rpx;
			text-decoration: underline;
		}
		.text-box {
			flex: 1;
			padding: 24rpx 0;
			border-bottom: 1px solid #F5F5F5;
			.r-top {
				margin-bottom: 18rpx;
			}
			.vip-member-price-box {
				.text-line-through-and-gray {
					font-weight: 400 !important;
					font-size: 24rpx;
				}
			}
			.buy-num {
				border-radius: 82rpx;
				padding: 4rpx 10rpx;
				border: 1px solid #DDDDDD;
				.jia-btn {
					width: 48rpx;
					height: 48rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_add@2x.png');
				}
				.jian-btn {
					width: 48rpx;
					height: 48rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_reduce@2x.png');
					
				}
				.jian-btn.no_active {
					width: 48rpx;
					height: 48rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_reduce_disabled@2x.png');
					pointer-events: none;
				}
			}
			.not-active-status-box {
				flex: 1;
				text-align: right;
				margin-top: 10rpx;
				.not-active-status{
					font-size: 28rpx;
					background: rgba(255,243,231,0.6);
					border-radius: 8rpx;
					height: 56rpx;
					display: inline-block;
					line-height: 56rpx;
					padding: 0 20rpx;
					white-space:nowrap;
					color: #FF004D;
				}
			}
			.not-active-status-box._disabled {
				.not-active-status {
					opacity: 1;
					background: #eeeeee;
					color: #999999;
				}
			}
			.goods-price {
				font-weight: bold;
				font-size: 32rpx;
				color: #000;
				.has-discount-price {
					display: flex;
					align-items: center;
				}
				.special-price{
					color: #FF004D;
				}
				.original-price {
					color: #999999;
					font-size: 24rpx;
					margin-left: 16rpx;
					font-weight: 400;
					text-decoration: line-through;
				}
			}
			.show-coupon {
				color: #999999;
				font-size: 26rpx;
				padding: 3px 0;
				.iconfont-coupon {
					margin-right: 3px;
				}
				.iconfont-coupon:before {
					content: '\E618';
				}
			}
			.goods-label {
				.label-box {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #666;
					.label-name {
						max-width: 320rpx;
						margin-right: 4px;
					}
					.edit {
						color: #0071E3;
						margin-left: 24rpx;
					}
				}
			}
		}
		.goods-title {
			width: 0;
			flex: 1;
			color: #000;
			font-size: 28rpx;
		}
		.img-box {
			width: 180rpx;
			height: 240rpx;
			overflow: hidden;
		    background-color: #ffffff;
			margin: 24rpx 24rpx 24rpx 0;
			.img {
				width: 180rpx;
				height: 240rpx;
			}
			.product-item-not-active-mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0,0,0,0.5);
				.product-item-not-active-text {
					width: 100%;
					height: 56rpx;
					display: flex;
					align-items: center;
					background: rgba(0,0,0,0.6);
					color: #fff;
					font-size: 28rpx;
					justify-content: center;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
				}
			}
		}
	}
}	
</style>