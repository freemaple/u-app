<template>
	<view class="recommend-goods-list-box">
		<scroll-view :show-scrollbar="false" :scroll-x="true" @scroll="scrollHandel">
			<view class="goods-box">
				<view @click="toDetailsTap(item, index);selectItem(item)" class="goods-item-box position-relative" v-for="(item,index) in goods" :key="index" :id="`recommendProductItems${item.id}`">
					<view style="margin-bottom: 10rpx;">
						<image :src="item.pic" class="image" mode="aspectFill" :lazy-load="true" />
					</view>
					<specialOfferDiscountTab :discount="item.special_price_off" v-if="(item.special_data&&item.special_data.is_special=='1')"></specialOfferDiscountTab>
					<view class="flex justify-content-between">
						<saleRemaining :percent="item.special_data&&item.special_data.spu_stock_percent" :remaining_count="item.special_data&&item.special_data.spu_stock_text" v-show="item.special_data&&item.special_data.is_show=='1'&&item.special_data.is_special=='1'"></saleRemaining>
						<block v-if="item.special_price && item.special_price.value">
                            <block v-if="item.special_data&&item.special_data.is_special =='1'">
                                <view class="price-box flex align-items-baseline flex-1 no-wrap lower_price_text">
                                    <view class="goods-price font-bold">{{ item.special_price.symbol }}{{ item.special_price.value }}</view>
                                    <view class="goods-originalPrice goods-originalPrice-specialPrice" v-if="item.special_price_off">
                                        {{item.price.symbol}}{{item.price.value}}
                                    </view>
                                    <view v-else class="goods-originalPrice">{{ item.price.symbol }}{{ item.price.value }}</view>
                                </view>
                            </block>
                            <block v-else>
                                <view class="price-box flex align-items-baseline flex-1 no-wrap">
                                    <view class="goods-price font-bold">{{ item.special_price.symbol }}{{ item.special_price.value }}</view>
                                    <view class="goods-originalPrice goods-originalPrice-specialPrice" v-if="item.special_price_off">
                                        -{{item.special_price_off}}%
                                    </view>
                                    <view v-else class="goods-originalPrice">{{ item.price.symbol }}{{ item.price.value }}</view>
                                </view>
                            </block>
                        </block>
                        <block v-else>
                            <block v-if="showVip && item.isVip && item.member_product">
                                <view class="member-price price-box flex align-items-center text-overflow-ellipsis flex-1 no-wrap">
                                    <image class="vip-tag-img" src="@/static/images/vip/vip_icon.png"/>
                                    <view class="goods-price font-bold">{{ item.member_price.symbol }}{{ item.member_price.value }}</view>
                                    <view class="goods-originalPrice text-overflow-ellipsis">{{ item.price.symbol }}{{ item.price.value }}</view>
                                </view>
                            </block>
                            <block v-else>
                                <view class="goods-list-money font-bold flex-1 no-wrap align-items-center flex">{{ item.price.symbol }}{{ item.price.value }}</view>
                            </block>
                        </block>
						<image
							@tap.stop="(e) => { $debounce(addCart, 300, [e, item, index])}"
							class="add-to-cart-icon"
							src="@/static/images/icon/cart_icon@2x.png"
							mode="scaleToFill"
						/>
					</view>
					<view class="goods-name">{{item.name}}</view>
				</view>
			</view>
		</scroll-view>
		<shopping-cart-popup ref="shoppingCartPopup" @addToBag="$emit('addSuccess')" @popupChange="(value)=>{$emit('popupChange',value)}"></shopping-cart-popup>
	</view>
</template>

<script>
import shoppingCartPopup from '../shoppingCartPopup/shoppingCartPopup.vue';
import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue';
import saleRemaining from '@/components/sale-remaining/sale-remaining.vue';
import { mapState } from 'vuex'

	export default {
		name:"recommend-goods-list",
		components:{
			shoppingCartPopup,
			specialOfferDiscountTab,
			saleRemaining
		},
		data() {
			return {
				
			};
		},
		props: {
			goods: {
				type: Array,
				default: [],
			},
			scrollTop: {
				type: Number,
				default: 0,
			},
			module_name: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapState(['showVip'])
		},
		watch: {
		  goods: {
		    handler() {
				this.$debounce(() => {
					this.$nextTick(() => {
						this.startObserver(); // 列表更新后重新设置观察器
					});
				}, 100);
		    },
		    deep: true,
		  },
		},
		destroyed(){
			if(this.observer){
				this.observer.disconnect();
				this.observer = null;
			}
		},
		mounted(){
			this.$debounce(() => {
				this.$nextTick(() => {
					this.startObserver(); // 列表更新后重新设置观察器
				});
			}, 100);
		},
		methods:{
			// 开始观察产品曝光
			startObserver() {	
				if(this.goods.length == 0){
					return;
				}
				if(!this.observer){
					this.observer = this.$public.createIntersectionObserver();
				}
				if(this.observer){
					this.goods.forEach((item, index) => {
						if(!item.observer){
							const elementSelector = "#recommendProductItems" + item.id;
							this.$public.observeVisibility(this.observer, elementSelector, () => {
								this.handleVisibilityChange(item, index);
							});
						}
					});
				}
			},
			handleVisibilityChange(item, index) {
				if(this.goods[index].observer){
					return false;
				}
				this.goods[index].observer = true;
				if(this.module_name){
					item.module = this.module_name;
				}
				this.$trackEvent.impression_product_item(item, index);
			  // 记录曝光数据或进行其他操作
			},
			scrollHandel(){
				this.$debounce(() => {
					this.startObserver(); 
				}, 100);
			},
			async addCart(e, item, index) {
				uni.removeStorage({
					key: 'animation_product_detail',
					success: function() {
					},
					fail: function(err) {
					}
				});


				let id = item.id;
			    e.preventDefault();
			    const that = this
				// 获取到点击当前商品的大图
				const copyImgUrl = item.pic
				const query = uni.createSelectorQuery().in(this);
				let currentImgEle = ''
				// 选择父元素
				/*query.selectAll('.recommend-goods-list-box .image').boundingClientRect(res => {
					// res 包含了父元素的大小等信息
					currentImgEle = res[index]
				}).exec();*/
				try{
					let res = await this.getElemClientRect('.recommend-goods-list-box .image');
					if(res && res[index]){
						currentImgEle = res[index]
					}
				} catch(e){
					
				}
				const currentImgobj = {
					copyImgUrl,
					currentImgEle
				}
				that.$refs.shoppingCartPopup.scrollTop = that.scrollTop
				if(this.module_name){
					item.module = this.module_name;
				}
				let productItem = item;
			    that.$refs.shoppingCartPopup.open(id, 1, {isSizeSelected:false, productItem: productItem, currentImgobj});
				this.selectItem(item);
				productItem.event_data = {
					goods_location: index + 1
				};
				this.$trackEvent.quick_view_item(productItem);
				if(!item.observer){
					this.handleVisibilityChange(item, index);
				}
				this.productClick(item, index);
			},
			getElemClientRect(name){
				var that = this;
			    return new Promise ((resolve,reject)=>{
					const query = uni.createSelectorQuery().in(that);
					query.selectAll(name).boundingClientRect(res => {
					  	resolve(res);
					}).exec();
			    })
			}, 
			toDetailsTap(item, index){
				let product_url = '/pages/goods-detail/index?id=' + item.id;
				if(item.rec_code){
					product_url +="&rec_code=" + item.rec_code;
				}
				if(item.rec_engine){
					product_url +="&rec_engine=" + item.rec_engine;
				}
				if(item.ab_key){
					product_url +="&ab_key=" + item.ab_key;
				}
				if(this.module_name){
					product_url +="&module=" + this.module_name;
				}
				this.$public.handleNavTo(product_url)
				if(!item.observer){
					this.handleVisibilityChange(item, index);
				}
				this.productClick(item, index);
			},
			selectItem(item){
				let trackData = {
					item_list_id: 'recommended_product',
					item_list_name: 'recommended_product',
					items: [{
						item_id: item.sku,
						item_name: item.name
					}]
				}
				this.$trackEvent.select_item(trackData);
			},
			productClick(item, index){
				let product_track_data = item;
				if(this.module_name){
					product_track_data['module'] = this.module_name;
				}
				this.$maEvent.product_click(product_track_data, index);
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/.remaining_box{
    width: 100%;
    margin-bottom: 11.54rpx;
}
.lower_price_text .goods-price{
    font-size: 31rpx;
    color: #FF5C00;
    line-height: 36rpx;
    text-align: left;
}

.member-price {
	.goods-price {
		color: #873c00;
	}
	.vip-tag-img {
		width: 24rpx;
		height: 24rpx;
		margin-right: 4rpx;
	}
}
.lower_price_text .goods-originalPrice-specialPrice{
    border: 0;
    font-weight: 400;
    font-size: 19rpx;
    color: #999999;
    line-height: 23rpx;
    text-align: center;
    font-style: normal;
    text-decoration: line-through;
    margin-left: 7.69rpx;
}
.goods-originalPrice {
	padding-left: 10rpx;
	font-size: 24.77rpx;
	color: #999;
	text-decoration: line-through;
	display: inline-block;
}
	.recommend-goods-list-box {
		padding-left: 32rpx;
		background: #fff;
		padding-bottom: 60rpx;
		.goods-box {
			display: flex;
			flex-wrap: nowrap;
			.goods-item-box {
				width: 288rpx;
				margin-right: 16rpx;
				.image {
					width: 288rpx;
					height: 384rpx;
				}
				
				.add-to-cart-icon {
					width: 53.85rpx;
					height: 53.85rpx;
				}
				.goods-name {
					width: 100%;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					font-size: 28rpx;
					color: #333;
					margin-top: 16rpx;
					margin-bottom: 20rpx;
				}
				.price-box {
					display: flex;
					align-items: center;
					.price-value {
						font-size: 32rpx;
						color: #FF005D;
						font-weight: bold;
						margin-right: 10rpx;
					}
					.discount-off {
						font-size: 20rpx;
						color: #FF005D;
						padding: 0 4rpx;
						border: 1px solid #FF005D;
					}
				}
			}
		}
	}
</style>