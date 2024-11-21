<template>
	<view class="root">
		<scroll-view ref="scrollView" scroll-x="true" show-scrollbar="false" @scroll="handleScroll" style="position: relative" :scroll-left="scrollViewLeft"  @touchmove.stop>
			<view class="flex goods_box">
				<view v-for="(good, index) in listData" :key="good.id"
					class="good flex flex-column"
					:id="itemIdName ? itemIdName + good.id : ''"
					@tap="(e)=>{toDetailsTap(e, good)}" >
					<image class="good_img" :style="{'margin-right': `${spacingOfImage}rpx`}"
						:src="good.pic || good.image" mode="aspectFill" :lazy-load="true" />
					<off-tag v-if="setTagShow(good)" class="off-tag" 
						:offPrecent="good.special_price_off" 
						:tagType="setTagType(good)"></off-tag>
					<stock-remaining v-if="SetRemainShow(good)" 
						:supStock="setRemainText(good)" 
						:precent="setRemainBarPrecent(good)">
					</stock-remaining>
					<view class="good_name" :style="{'margin-top': SetRemainShow(good) ? '0' : '8rpx'}">{{ good.name }}</view>
					<view class="flex-1">
						<view v-if="good.special_price" class="good_price">
							<view class="good_price_num font-MB">{{`${good.special_price.symbol}${good.special_price.value}`}}</view>
							<view class="good_price_val">{{`${good.price.symbol}${good.price.value}`}}</view>
						</view>
						<view v-else class="good_priceNormal">
							<view class="good_priceNormal_num font-MB">{{`${good.price.symbol}${good.price.value}`}}</view>
						</view>
					</view>
					<view v-if="showAddCartBtn"
						@tap.stop="(e) => { $debounce(addCart, 300, [e, good, index])}" 
						:data-id="good.id" 
						class="add_cart_box">
					    {{$t('goods_detail.add_to_bag')}}
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-bar v-if="showScrollBar"
			:scrollLeft="barScrollLeft"
			:scrollWidth="barScrollWidth"
			:dotNum="setDotNum()"
			:dotColor="setDotColor">
		</scroll-bar>
		<view v-if="hiddenViewMore && listData && listData.length > 0" 
			class="view_more"  @tap="$public.handleNavTo(navRoute)">
			{{ $t('home.view_more') }}
		</view>
		<shopping-cart-popup ref="shoppingCartPopup" 
			@addToBag="$emit('addSuccess')" 
			@popupChange="(value)=>{$emit('popupChange',value)}" 
			@changeSize="isSizeSelected = true">
		</shopping-cart-popup>
	</view>
</template>

<script>
	import shoppingCartPopup from '../shoppingCartPopup/shoppingCartPopup.vue';
	export default {
		components: {
			shoppingCartPopup
		},
		props: {
			listData: {
				type: Array,
				default:() => []
			},
			showStockRemaining: {
				type: Boolean,
				default: false
			},
			showScrollBar: {
				type: Boolean,
				default: true
			},
			showAddCartBtn: {
				type: Boolean,
				default: true
			},
			hiddenViewMore: {
				type: Boolean,
				default: true
			},
			// tagType: "1" - 秒杀 渐变色标签
			// tagType: "2" - 普通打折无渐变标签
			tagType: {
				type: String,
				default: '1'
			},
			navRoute: {
				type: String,
				default: ''
			},
			setDotColor: {
				type: String,
				default: '#999'
			},
			tagName: {
				type: Object,
				default: () => {}
			},
			itemIdName: {
				type: String,
				default: ''
			},
			spacingOfImage: {
				type: Number,
				default: 15.38
			}
		},
		watch: {
			tagName(newVal, oldVal) {
				// 记录标签切换前的宽距
				if (oldVal && oldVal.name) {
				  this.tagScrollLeft[oldVal.name] = this.scrollViewLeft;
				}
				this.$nextTick(() => {
					// 存在记录的宽距就使用否则置0，列表回到最左侧
					this.scrollViewLeft = this.tagScrollLeft[newVal.name] ?? 0
				})
			}
		},
		data() {
			return {
				isSizeSelected: false,
				barScrollLeft: 0,
				barScrollWidth: 0,
				dotNum: 5,
				scrollViewLeft: 0,
				tagScrollLeft: {},
				timer: null
			}
		},
		methods: {
			setDotNum() {
				const len = this.listData?.length
				const dotNum = Math.ceil(len / 2.5)
				return dotNum == 1 ? 0 : dotNum
			},
			handleScroll(event) {
			    const { scrollLeft, scrollWidth } = event.detail
				this.barScrollLeft = scrollLeft
				this.barScrollWidth = scrollWidth - 390
				// 记录到达左侧的距离
				if (this.timer) {
				    clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
				    this.scrollViewLeft = scrollLeft;
				}, 500);
			},
			toDetailsTap(e, item) {
				if(item.item_type == 'banner'){
				    // 判断url是app路由还是具体带http的链接
				    const url = item.url_key
				    const regex = /^(http|https):\/\//;
				    const isMatch = regex.test(url);
				    if(isMatch){
				        //#ifdef APP-PLUS
				        plus.runtime.openURL(
				        url, 
				            function(err) {  
				                console.log(err);  
				            }
				        ); 
				        //#endif
				        // #ifdef H5
				            window.open(url);
				        // #endif
				    }else{
				        uni.navigateTo({ url: url })
				    }
				}else{
					// let product_url = '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id;
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
				    this.$public.handleNavTo(product_url)
				    this.$emit('toDetailsTap', e)
					let trackData = {
						items: [{
							item_id: item.sku,
							item_name: item.name
						}]
					}
					if(this.item_list_id){
						trackData.item_list_id = this.item_list_id;
					}
					if(this.item_list_name && this.item_list_name != ''){
						trackData.item_list_name = this.item_list_name;
					}
					this.$trackEvent.select_item(trackData);
				}
			},
			async addCart(e, item, index) {
				uni.$emit('showBottomTabbar', true)
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
			    let currentImgEle = '';
				try{
					let res = await this.getElemClientRect('.img-box')
					currentImgEle = res[index] || '';
				} catch(e){
					
				}
			    const currentImgobj = {
			        copyImgUrl,
			        currentImgEle
			    }
			    that.$refs.shoppingCartPopup.open(id,1,{isSizeSelected:this.isViewedRecord,productItem: item, currentImgobj});
			    // that.$emit('addCart', id)
				let trackData = {
					items: [{
						item_id: item.sku,
						item_name: item.name
					}]
				}
				if(this.item_list_id){
					trackData.item_list_id = this.item_list_id;
				}
				if(this.item_list_name){
					trackData.item_list_name = this.item_list_name;
				}
				this.$trackEvent.select_item(trackData);
				this.$trackEvent.quick_view_item(item);
			},
			pageScrollFunc(scrollTop){
				this.$refs.shoppingCartPopup['scrollTop'] = scrollTop
			},
			setTagShow(good) {
				return !!good?.special_price
				// 首页接口返回的数据有两套格式，第1套通过schedule判断， 第二套通过special_data判断
				// 这是设置off标签的显示与隐藏
				// schedule - 平级属性中存在 special_price_off 且不为空字符串则显示
				// special_data - 平级属性中存在 special_price_off 且不为空字符串则显示
				// 	const { special_price, special_price_off, special_data, schedule } = good || {}
				//  return !!special_price
				// if(special_price_off) {
				// 	if(special_data && special_data.is_special == '1') {
				// 		return true
				// 	} else if(schedule && schedule.is_special == '1') {
				// 		return true
				// 	} else {
				// 		return false
				// 	}
				// } else {
				// 	return false
				// }
			},
			setTagType(good) {
				const {schedule, special_data} = good || {}
				// 首页接口返回的数据有两套格式，第1套通过schedule判断， 第二套通过special_data判断
				// 这里设置off标签是渐变色的还是普通紫色。 tagType是true(1)是渐变色，其他则是普通紫色
				if(schedule && schedule.is_special) {
					return schedule.is_special
				} else if(special_data && special_data.is_special) {
					return special_data.is_special
				}
			},
			SetRemainShow(good) {
				return (good?.schedule?.spu_stock_text && good.schedule.is_show == '1') ||
					(good?.special_data?.spu_stock_text && good.special_data.is_show == '1')
			},
			setRemainText(good) {
				const {schedule, special_data} = good || {}
				if(schedule && schedule.spu_stock_text) {
					return schedule.spu_stock_text
				} else if(special_data && special_data.spu_stock_text) {
					return special_data.spu_stock_text
				}
			},
			setRemainBarPrecent(good) {
				const {schedule, special_data} = good || {}
				if(schedule && schedule.spu_stock_percent) {
					return schedule.spu_stock_percent
				} else if(special_data && special_data.spu_stock_percent) {
					return special_data.spu_stock_percent
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.uni-swiper-dot {
			width: 12rpx;
			height: 8rpx;
			background: #e0dff3 !important;
			border-radius: 42rpx;
		}
		.uni-swiper-dot.uni-swiper-dot-active {
			width: 23rpx;
			height: 8rpx;
			border-radius: 42rpx;
			background: #9795D6 !important;
		}
	}
	%font_Montserrat {
	    font-weight: 600;
	    letter-spacing: 0rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}
	.root {
		width: 100%;
		margin: 0 30.77rpx 36.54rpx 0;
		.goods_box {
			padding-left: 30.77rpx;
			flex-wrap: nowrap;
			.good {
				position: relative;
				image {
					width: 276.92rpx;
					height: 276.92rpx;
					border-radius: 8rpx;
				}
				&_img {
					background-image: url('../../static/images/default.png');
					background-size: cover;
					height: unset;
				}
				.off-tag {
					position: absolute;
					top: 7.69rpx;
					left: 7.69rpx;
				}
				&_name {
					@extend %font_Montserrat;
					width: 276.92rpx;
					font-weight: 500;
					font-size: 23.08rpx;
					color: #666666;
					line-height: 30.77rpx;
					text-align: left;
					display: -webkit-box;
					overflow: hidden;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					margin-bottom: 8rpx;
				}
				&_price, &_priceNormal {
					@extend %font_Montserrat;
					display: flex;
					flex-wrap: nowrap;
					width: 277rpx;
					height: 38rpx;
					font-weight: 500;
					font-size: 31rpx;
					color: #8A61E7;
					line-height: 36rpx;
					text-align: left;
					&_num {
						font-size: 30.77rpx;
						color: #8A61E7;
					}
					&_val {
						border-radius: 6rpx;
						font-size: 23rpx;
						font-family: 'Montserrat-Regular';
						margin-left: 17.31rpx;
						text-decoration: line-through;
						color: #999;
						display: flex;
						align-items: flex-end;
					}
				}
				&_priceNormal {
					color: #393939;
					&_num {
						font-size: 30.77rpx;
						color: #393939;
					}
				}
				.add_cart_box {
					width: 277rpx;
					height: 61.54rpx;
				    text-align: center;
				    padding: 17.31rpx 0;
				    border-radius: 408rpx;
				    border: 2rpx solid #393939;
				    font-size: 23.08rpx;
					margin-top: 15.38rpx;
				}
			}
		}
		.view_more {
			position: absolute;
			right: 30.77rpx;
			height: 28.85rpx;
			font-weight: 500;
			font-size: 23.08rpx;
			color: #000000;
			line-height: 27.04rpx;
			text-decoration-line: underline;
			text-transform: none;
			margin: 26.92rpx 0;
		}
		.scroll_bar {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			top: 42.31rpx;
			.bar_dot, .bar_dot_active {
				height: 8rpx;
				background: #999999;
				border-radius: 42rpx;
				margin-right: 7.69rpx;
			}
			.bar_dot {
				width: 12rpx;
				opacity: 0.3;
			}
			.bar_dot_active {
				width: 23rpx;
			}
		}
	}
</style>