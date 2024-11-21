<template>
	<!-- special_type>0 属于特价活动商品 -->
	<view class="flex no-wrap cart-list-product-item-box" 
		:class="{
			'not-active_product_item': item.not_active_status > 0,
			'isBelongSpecialActivity': item.special_type > 0,
			'mb15r': !item.not_active_status
		}"
		:style="item.left">
		<!-- 如果是享受优惠的y集合产品，禁止选中/取消选中 -->
		<!-- itemtype【n_n:普通】【y_n：y不享受优惠】【y_y：y享受优惠】【x_n：x商品】 -->
		<!-- not_active_status 1:已下架 2无库存 -->
		<view class="check-box"
			@click="$emit('handleEmitSelect',item)" 
			:class="getClass(item.active,item.itemtype,item.not_active_status)">
		</view>
		<view class="goods-info flex no-wrap justify-content-between">
			<view @click="item.not_active_status == 1 ? '': $public.handleNavTo('/pages/goods-detail/index?id='+item.product_id)"  
				class="left-part">
				<view class="img-box">
					<image :src="item.img_url" class="img" />
					<!-- 如果无库存 优先显示无库存文案 special_type>0是特价活动商品；spu_stock_type==0表示显示only x left的文案，其他类型的文案不展示 -->
					<view class="flex flash-box" 
						v-if="!item.not_active_text && 
							item.special_type > 0 &&
							item.special_data && 
							item.special_data.spu_stock_type === 0 &&
							item.special_data.is_show == 1 && 
							item.special_data.is_special == 1 && 
							!item.not_active_status" >
						<image class="icons" src="@/static/images/flash.png" mode="widthFix" />
						<view class="info">{{item.special_data.spu_stock_text}}</view>
					</view>
					<!-- 理论上特价商品不会是会员商品,因为后端脚本问题,会出现共存的情况,所以多加一(item.member_product!=1 || !showVip)判断 -->
					<!-- item.special_type > 0 && (item.member_product != 1 || !showVip) -->
					<off-tag v-if="item.discount_off && !item.not_active_status"  class="offTag" 
						:offPrecent="item.discount_off"
						:tagType="setTagType(item)"
					></off-tag>
					<view class="product-item-not-active-mask" v-if="item.not_active_text">
						<view class="product-item-not-active-text">
							{{item.not_active_text}}
						</view>
					</view>
				</view>
				<!-- Edit Remove -->
				<view class="text-btn">
					<view v-if="item.not_active_status!=1 && item.itemtype.indexOf('y_y') == -1"
						@click.stop="$emit('handleEmitEdit',item)" 
						class="mr31r">
						{{$t('cart.edit')}}
					</view>
					<view @click.stop="$emit('handleEmitDelete',item)" 
						:style="{'padding-left': item.not_active_status!=1 && item.itemtype.indexOf('y_y') == -1 ? '0' : '78rpx'}">
						{{$t('cart.remove')}}
					</view>
				</view>
				<!-- 理论上特价商品不会是会员商品,因为后端脚本问题,会出现共存的情况,所以多加一(item.member_product!=1 || !showVip)判断 -->
				<!-- <specialOfferDiscountTab 
					v-if="item.special_type > 0 && (item.member_product != 1 || !showVip)" 
					:discount="item.discount_off">
				</specialOfferDiscountTab>
				<view v-if="showVip && item.member_product == 1" class="vip-member-discount_off">
					-{{item.discount_off}}%
				</view>
				<view v-else-if="item.line_price && item.special_type <= 0 " class="special-price-discount_off">
					-{{item.discount_off}}%
				</view> -->
				
				<!-- 如果无库存 优先显示无库存文案 special_type>0是特价活动商品；spu_stock_type==0表示显示only x left的文案，其他类型的文案不展示 -->
				<!-- <specialOfferStockTextBox 
					v-if="!item.not_active_text && item.special_type > 0 &&
							item.special_data && item.special_data.spu_stock_type === 0 &&
							item.special_data.is_show==1" 
					:text="item.special_data.spu_stock_text">
				</specialOfferStockTextBox> -->
			</view>
			<view class="right-part flex justify-content-between flex-column">
				<view>
					<!-- 货物标题 -->
					<view class="flex justify-content-between align-items-center">
						<view @click="item.not_active_status == 1? '': $public.handleNavTo('/pages/goods-detail/index?id='+item.product_id)" 
							class="goods-title ellipsis-rows-two">
							{{ item.name }}
						</view>
					</view>
					<!-- 颜色尺寸 -->
					<view v-if="item.spu_options_str" class="goods-label">
						<view class="option-box text-overflow-ellipsis"
							v-for="(value, key, index) in item.custom_option_info">
							<view class="option">
								<view class="option-key">{{key}}:</view>
								<!-- <text style="padding-right: 11.54rpx" ></text> -->
								<!-- v-if="index+1 < Object.keys(item.custom_option_info).length"  -->
								<view class="option-value">{{value}}</view>
							</view>
						</view>
					</view>
					<!-- 优惠券   -->
					<view v-if="item.explain" class="show-coupon flex align-items-center">
						<!-- <view class="iconfont iconfont-coupon"></view> -->
						<image src="@/static/images/cart/coupon_tab.png" mode="widthFix" style="width:30.77rpx; height: 30.77rpx;"></image>
						<view >{{item.explain}}1.99 Flash Sale</view>
					</view>
				</view>
				<!-- 右下底部 价格 优惠价格 数量 -->
				<view class="right_bottom">
					<view class="vip-member-price-box" v-if="showVip && item.member_product == 1">
						<view class="text-line-through-and-gray" v-if="!item.not_active_status">{{currencySymbol}}{{item.line_price}}</view>
						<view class="flex align-items-center" v-else>
							<!-- <image class="vip-icon" mode="widthFix" src="@/static/images/vip/vip_icon.png"></image> -->
							<text class="vip-member-price font-MS" style="color: #222">
								<text class="fs31r">{{currencySymbol}}{{ item.product_price_int }}</text>
								<text class="fs23r">{{ item.product_price_decimal }}</text>
							</text>
						</view>
					</view>	
					<!-- 有折扣的价格 -->
					<view v-else class="goods-price">
						<!-- 
							item.not_active_status 判断是否处于 Still Interested / Restock Notification状态 
							item.not_active_status 不为空则处于，此时价格只显示原价格
						-->
						<view class="has-discount-price" v-if="item.line_price && !item.not_active_status">
							<view class="special-price">
								<view class="price-whole">{{ currencySymbol }}{{ item.product_price_int }}</view>
								<view class="price-decimal">{{ item.product_price_decimal }}</view>
							</view>
							<view class="original-price">
								{{currencySymbol}}{{item.line_price}}
							</view>
						</view>
						<view v-else class="normal-price">
							<view class="price-whole">{{currencySymbol}}{{ item.product_price_int }}</view>
							<view class="price-decimal">{{ item.product_price_decimal }}</view>
						</view>
					</view>
					<!-- Item taken off the shelves -->
					<!-- 商品按钮 Restock Notification、 Still Interested等 -->
					<view v-if="item.not_active_status" class="not-active-status-box">
						<view v-if="item.not_active_status == 2" class="flex-cc"
							:class="item.if_subscribe == 1 ? 'not-active-status-disabled' : 'not-active-status'"
							@click="$emit('handleEmitOutOfStock',item)">
							{{$t('cart.out_of_stock_text')}}
						</view>
						<view v-if="item.not_active_status == 1" class="flex-cc"
							:class="item.if_subscribe == 1 ? 'not-active-status-disabled' : 'not-active-status'"
							style="padding:13.85rpx 30.77rpx"
							@click="$emit('handleEmitOffShelf',item)">
							{{$t('cart.still_interested')}}
						</view>
					</view>
					<!-- 数量选择器 -->
					<view v-else class="buy-num flex justify-content-center align-items-center">
						<view class="jian-btn" @tap.stop.prevent="$emit('handleEmitReduceNumber',item)"></view>
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
			setTagType(good) {
				const {schedule, special_data} = good || {}
				// 首页接口返回的数据有两套格式，第1套通过schedule判断， 第二套通过special_data判断
				// 这是设置off标签是渐变色的还是普通紫色。 tagType是true(1)是渐变色，其他则是普通紫色
				if(schedule && schedule.is_special) {
					return schedule.is_special
				} else if(special_data && special_data.is_special) {
					return special_data.is_special
				}
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
@import '@/common/mixins.scss';
.cart-list-product-item-box.not-active_product_item {
	.special-price {
		color: #999;
	}
	.vip-member-price {
		color: #999;
	}
}
.cart-list-product-item-box {
	border-radius: 23rpx;
	background-color: #fff;
	padding-right: 23.08rpx;

	.check-box {
		position: relative;
		top: 111.54rpx;
	}
	.icon-radio-check {
		width: 46.15rpx;
		height: 46.15rpx;
		background-image: url('@/static/images/cart/radio_check@2x.png');
		background-size: cover;
		margin: 0 7.69rpx 0 15.38rpx;
	}
	.icon-radio-checked {
		width: 46.15rpx;
		height: 46.15rpx;
		background-image: url('@/static/images/cart/radio_checked@2x.png');
		background-size: cover;
		margin: 0 7.69rpx 0 15.38rpx;
	}
	.icon-radio-disabled {
		width: 44rpx;
		height: 44rpx;
		background-image: url('@/static/images/cart/choose_disabled.png');
		background-size: cover;
		margin: 0 7.69rpx 0 15.38rpx;
		pointer-events: none;
	}
	.goods-info {
		padding: 0;
		box-sizing: border-box;
		flex: 1;
		.left-part {
			.img-box {
				overflow: hidden;
			    background-color: #ffffff;
				margin: 30.77rpx 23.08rpx 32.69rpx 0;
				position: relative;
				.flash-box {
					position: absolute;
					top: 7.69rpx;
					left: 9.62rpx;
					width: 277rpx;
					flex-wrap: nowrap;
					.icons{
						width: 30.77rpx;
						height: 30.77rpx;
					}
					.info {
						display: flex;
						justify-content: center;
						align-items: center;
						background: #EDE5FF;
						border-radius: 4rpx;
						padding: 3.85rpx 5.77rpx;
						@include font-SemiBold($color: #814EFF, $fs: 19rpx);
						line-height: 23rpx;
					}
				}
				.img {
					width: 185rpx;
					height: 185rpx;
				}
				.offTag {
					position: absolute;
					bottom: 13.46rpx;
					right: 11.54rpx;
				}
				.product-item-not-active-mask {
					width: 184.62rpx;
					height: 184.62rpx;
					border-radius: 8rpx;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0,0,0,0.5);
					.product-item-not-active-text {
						//#ifdef APP-IOS
						@include font-SemiBold($color:#fff, $fs: 25rpx, $fw: 500);
						letter-spacing: -0.6px;
						word-spacing: -0.3px;
						//#endif
						@include font-SemiBold($color:#fff, $fs: 27rpx);
						display: flex;
						align-items: center;
						justify-content: center;
						position: absolute;
						top: 71.15rpx;
						left: 0;
						right: 0;
						line-height: 42rpx;
						letter-spacing: -0.69rpx;
					}
				}
			}
			
			.text-btn {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				font-family: "Montserrat-Regular";
				text-decoration-line: underline;
				font-weight: 400;
				font-size: 23rpx;
				line-height: 42rpx;
				color: #000;
				margin-bottom: 30.77rpx;
			}
		}
		.right-part {
			flex: 1;
			padding: 30.77rpx 0 28.85rpx;
			border-bottom: 1px solid #F5F5F5;
			.goods-title {
				font-size: 23rpx;
				color: #666666;
				max-width: 381rpx;
				line-height: 31rpx;
			}
			.goods-label {
				margin-top: 12rpx;
				.option-box {
					margin-bottom: 11.54rpx;
					max-width: 320rpx;
					margin-right: 4px;
					.option {
						display: flex;
						font-size: 23rpx;
						color: #000000;
						line-height: 27rpx;
						.option-key {
							font-weight: 500;
							margin-right: 11.54rpx;
						}
						.option-value {
							font-weight: 400;
						}
					}
				}
			}
			.vip-member-price-box {
				.text-line-through-and-gray {
					font-weight: 600 !important;
					font-size: 31rpx;
				}
			}
			.buy-num {
				border-radius: 46rpx;
				padding: 7.69rpx 15.38rpx;
				border: 2rpx solid #CCCCCC;
				font-weight: 500;
				font-size: 27rpx;
				color: #393939;
				line-height: 32rpx;
				.jia-btn {
					width: 34.62rpx;
					height: 34.62rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_add@2x.png');
				}
				.jian-btn {
					width: 34.62rpx;
					height: 34.62rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_reduce@2x.png');
					
				}
				.jian-btn.no_active {
					width: 34.62rpx;
					height: 34.62rpx;
					background-size: cover;
					background-image: url('@/static/images/cart/cart_reduce_disabled@2x.png');
					pointer-events: none;
				}
			}
			
			.right_bottom {
				// flex flex-nowrap justify-content-between align-items-end
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;
				align-items: end;
			}
			.not-active-status-box {
				display: flex;
				align-items: center;
				text-align: right;
				flex-grow: 0;
				
				font-size: 26.92rpx;
				.not-active-status, .not-active-status-disabled{
					border-radius: 79rpx;
					padding: 13.85rpx 17.31rpx 15.38rpx;
					white-space: nowrap;
					background: #222;
					color: #fff;
				}
				.not-active-status-disabled{
					background: #eee;
					color: #999;
				}
			}
			.goods-price {
				font-size: 32rpx;
				color: #000;
				padding: 5.78rpx 0;
				letter-spacing: 0;
				flex-shrink: 0;
				.has-discount-price {
					display: flex;
					align-items: center;
					.special-price {
						@include font-SemiBold($color: #8A61E7)
						display: flex;
					}
				}
				.original-price {
					color: #999;
					@include font-MRegular;
					line-height: 27.04rpx;
					margin-left: 21.15rpx;
					margin-top: 7.69rpx;
					text-decoration: line-through;
				}
				.normal-price {
					@include font-SemiBold;
					display: flex;
				}
				.price-whole {
				    font-size: 30.77rpx;
				}
				.price-decimal {
				    font-size: 23.08rpx;
					display: flex;
					align-items: flex-end;
					margin-bottom: 2rpx;
				}
			}
			.show-coupon {
				color: #FF6ED3;
				font-size: 23.08rpx;
				padding: 3px 0;
				font-family: 'Montserrat-Regular';
				font-weight: 400;
				line-height: 31rpx;
				.iconfont-coupon {
					margin-right: 3px;
				}
				.iconfont-coupon:before {
					content: '\E618';
				}
			}
			
		}
	}
}	
</style>