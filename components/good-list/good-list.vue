<template>
	<view>
        <view v-if="!goods.length&&!isFirstQuery" class="no-more-goods">
				<image src="@/static/images/empty_goods.png" class="no-order-img"></image>
				<view class="text">{{ language.empty_product }}</view>
        </view>
        
		<view :class="'goods-lists ' + (showSingleList ? 'singleList' : '') + (setPadding ? 'pb220r' : '')">
			<view class="goods-box flex" @tap="(e)=>{toDetailsTap(e,item, index)}" :data-id="item.id" v-for="(item, index) in goods" :key="index" :id="`productItems${item.id}`">
                <view class="img-box position-relative" :class="{'banner-img-box':item.item_type=='banner'}">
                    <block v-if="item.item_type=='banner' ">
                        <image :src="item.image[0].path" class="image" mode="aspectFill" :lazy-load="true" />
						<!-- 分享裂变图————拼接金额 -->
						<template v-if="item.banner_type == 'share'">
                            <view class="amount-box font-family-KronaOne flex align-items-center justify-content-center">
                                <text class="dollar">$</text>
                                <text class="share_amount">{{item.money}}</text>
                            </view>
							<text class="share_discount">{{item.share_discount}}%</text>
							<text class="phone_price">GET ${{item.money}}</text>
						</template>
                    </block>
                    <block v-else>
                        <image :src="item.pic ? item.pic : item.image" class="image 888" mode="aspectFill" :lazy-load="true" />
                        <specialOfferDiscountTab v-if="(item.special_price && item.special_price.value && item.special_price_off)"
							:discount="item.special_price_off" 
							:isSpecial="(item.special_data&&item.special_data.is_special=='1')">
						</specialOfferDiscountTab>
                    </block>                    
                </view>
				<view v-if="item.item_type!='banner'" :class="'good_desc ' + (showSingleList ? 'special_lower_desc' : '')">
                    <saleRemaining :percent="item.special_data&&item.special_data.spu_stock_percent" 
						:remaining_count="item.special_data&&item.special_data.spu_stock_text" 
						v-show="!showSingleList&&(item.special_data&&item.special_data.is_show=='1'&&item.special_data.is_special=='1')">
					</saleRemaining>

                    <block v-if="isViewedRecord">
                        <view v-show="item.showMask" style="display: block;" class="delete-mask" @tap.stop="item.showMask = false">
                            <view class="delete-btn flex align-items-center justify-content-center" @tap.stop="deleteRecord(item.id,index)">Delete</view>
                            <i class="iconfont delete-icon" @tap.stop="()=>{item.showMask = false}"></i>
                        </view>
                    </block>
                    <view :class="'goods-list-title ' + (item.special_data&&item.special_data.is_special=='1'&&item.special_data.is_show=='1' ? 'special-goods-list-title' : '')">
						{{ item.name }}
					</view>
                    <view class="flex align-items-center justify-content-between" style="margin-top: 7.7rpx;">
                        <!-- 会员产品不会有特价 -->
                        <saleRemaining :percent="item.special_data&&item.special_data.spu_stock_percent" :remaining_count="item.special_data&&item.special_data.spu_stock_text" v-show="(showSingleList&&item.special_data&&item.special_data.is_show=='1' &&item.special_data.is_special=='1')"></saleRemaining>
                        <view :class="showSingleList ? 'single_list-addtobag' : ''" style="width: 100%; position: relative;">
                            <!-- 会员主页专用价格 -->
                            <block v-if="showVip && item.member_price && item.member_price.value">
                                <view class="vip-page-member-price price-box flex align-items-baseline">
                                    <view class="goods-price font-bold">{{ item.member_price.symbol }}{{ item.member_price.value }}</view>
                                    <view class="goods-originalPrice">{{ item.price.symbol }}{{ item.price.value }}</view>
                                </view>
                            </block>
                            <block v-if="item.special_price && item.special_price.value">
                                <view class="price-box flex justify-content-between align-items-baseline flex-1 no-wrap lower_price_text">
                                   <view>
										<view class="goods-price">{{ item.special_price.symbol }}{{ item.special_price.value }}</view>
										<view v-if="item.special_price_off" class="goods-originalPrice goods-originalPrice-specialPrice">
											{{item.price.symbol}}{{item.price.value}}
										</view>
										<view v-else class="goods-originalPrice">{{ item.price.symbol }}{{ item.price.value }}</view>
                                   </view>
									<i v-show="isViewedRecord && !item.showMask" class="iconfont more-action" @tap.stop="()=>{item.showMask = true}" ></i>
                                </view>
                            </block>
                            <block v-else>
                                <block v-if="showVip && item.isVip && item.member_product">
                                    <view class="member-price price-box flex align-items-center text-overflow-ellipsis flex-1 no-wrap">
                                        <!-- <image class="vip-tag-img" src="@/static/images/vip/vip_icon.png"/> -->
                                        <view class="goods-price font-bold">{{ item.member_price.symbol }}{{ item.member_price.value }}</view>
                                        <view class="goods-originalPrice text-overflow-ellipsis">{{ item.price.symbol }}{{ item.price.value }}</view>
                                    </view>
                                </block>
                                <block v-else>
                                    <view class="goods-list-money">
										<view>{{ item.price.symbol }}{{ item.price.value }}</view>
										<i v-show="isViewedRecord && !item.showMask" class="iconfont more-action" @tap.stop="()=>{item.showMask = true}" ></i>
									</view>
                                </block>
                            </block>
							<!-- <block v-if="isViewedRecord">
                                <i class="iconfont more-action" @tap.stop="()=>{item.showMask = true}" v-show="!item.showMask"></i>
                            </block> -->
                            <view v-if="showAddCartBtn" :data-id="item.id" @tap.stop="(e) => { $debounce(addCart, 300, [e, item, index])}" :class="'add-cart-box ' + (showSingleList ? 'singleList-add-cart-box':'')" :style="{'margin-top':(item.special_data&&item.special_data.is_special=='1'&&item.special_data.is_show=='1') ? 0 : '15.39rpx'}">
                                {{$t('goods_detail.add_to_bag')}}
                            </view>
                        </view>
                    </view>
                </view>
			</view>
		</view>
        <list-loading v-show="showLoading"></list-loading>
        <view v-if="!loadingMoreHidden&&!isFirstQuery&&showNoMore"
			class="bottom-nomore flex justify-content-center align-items-center"
			:style="{'padding-bottom': isPriceRangePart ? '60rpx' : ''}">
			{{ $t('search.no_more') }}
		</view>
	    <shopping-cart-popup ref="shoppingCartPopup" @addToBag="$emit('addSuccess')" @popupChange="(value)=>{$emit('popupChange',value)}"></shopping-cart-popup>
	</view>
</template>

<script>
import ListLoading from '../list-loading/list-loading.vue';
import shoppingCartPopup from '../shoppingCartPopup/shoppingCartPopup.vue';
import specialOfferDiscountTab from '@/components/special-offer-discount-tag/special-offer-discount-tag.vue'
import saleRemaining from '@/components/sale-remaining/sale-remaining.vue'

import { mapState } from 'vuex'
export default {
  components: { shoppingCartPopup, ListLoading, specialOfferDiscountTab, saleRemaining },
    data() {
        return {

        }
    },
    computed: {
        ...mapState(['showVip'])
    },
    props: {
		showWhiteIcon: {
			type: Boolean,
			default:false
		},
        goods: {
            type: Array,
            default: [],
        },
        isViewedRecord: {
            type: Boolean,
            default: false,
        },
        showSingleList: {
            type: Boolean,
			default: false,
        },
		ishowSpecialPriceOff: {
			type: Boolean,
			default: false,
		},
        showLoading: {
            type: Boolean,
			default: false,
        },
        loadingMoreHidden: {
            type: Boolean,
			default: false,
        },
        isFirstQuery: {
            type: Boolean,
			default: true,
        },
		showNoMore: {
			type: Boolean,
			default: true
		},
        language: {
            type: Object,
            default: () =>{
                return {
                category_list: 'Dress',
				empty_product: ''
            }
            }
        },
		showAddCartBtn: {
			type: Boolean,
			default: true
		},
		item_list_type: {
			type: String,
			default: ''
		},
		item_list_id: {
			type: String,
			default: ''
		},
		item_list_name: {
			type: String,
			default: ''
		},
        showCountDown: {
            type: Boolean,
            default: false
        },
		module_name: {
			type: String,
			default: ''
		},
		setPadding: {
            type: Boolean,
            default: false
        },
		isPriceRangePart: {
            type: Boolean,
            default: false
        },
    },
	mounted() {
		this.$debounce(() => {
			this.$nextTick(() => {
				this.startObserver(); // 列表更新后重新设置观察器
			});
		}, 100);
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
    methods: {
		// 开始观察产品曝光
		startObserver() {
			if(this.goods.length == 0){
				return false;
			}
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			if(this.observer){
				this.goods.forEach((item, index) => {
					if(!item.observer){
						const elementSelector = "#productItems" + item.id;
						this.$public.observeVisibility(this.observer, elementSelector, () => {
							this.handleVisibilityChange(item, index);
						});
					}
				});
			}
		},
		handleVisibilityChange(item, index) {
			if(item.observer){
				return false;
			}
			this.goods[index].observer = true;
			item.observer = true;
			if(this.module_name){
				item.module = this.module_name;
			}
			this.$trackEvent.impression_product_item(item, index);
		  // 记录曝光数据或进行其他操作
		},
        handleToBannerRoute(url){
            
        },
        pageScrollFunc(scrollTop){
			this.$refs.shoppingCartPopup['scrollTop'] = scrollTop
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
			if(this.module_name){
				item.module = this.module_name;
			}
			let productItem = item;
            that.$refs.shoppingCartPopup.open(id,1,{isSizeSelected:this.isViewedRecord,productItem: productItem, currentImgobj});
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
        toDetailsTap(e, item, index){
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
				let product_url = '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id;
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
				product_url +="&goods_location=" + (index + 1);
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
				if(!item.observer){
					this.handleVisibilityChange(item, index);
				}
				this.productClick(item, index);
            }
			
        },
        deleteRecord(id, index){
            this.$emit('toDeleteViewed', id, index)
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

<style scoped lang="scss">
::v-deep .img-box uni-image>div {
	position: absolute;
}
/deep/.remaining_box{
    width: 100%;
    margin-bottom: 11.54rpx;
}
.special_lower_desc{
    display: flex!important;
    flex-direction: column;
    justify-content: space-between;
    /deep/.remaining_box {
        margin-bottom: 19.23rpx;
    }
    padding-top: 0 !important;
}
.single_list-addtobag{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.goods-lists .lower_price_text .goods-price{
    font-size: 31rpx;
    color: #8A61E7;
    line-height: 36rpx;
    text-align: left;
}
.goods-lists .lower_price_text .goods-originalPrice-specialPrice{
    border: 0;
    font-weight: 400;
    font-size: 19.24rpx;
    color: #999999;
    line-height: 23rpx;
    text-align: center;
    font-style: normal;
    text-decoration: line-through;
    margin-left: 7.69rpx;
}
.goods-lists {
    width: 100%;
    box-sizing: border-box;
    padding: 0 32rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
	background: #fff;
	.vip-tag-img {
		width: 24rpx;
		height: 24rpx;
		margin-right: 4rpx;
	}
	.product-item-discount {
		position: absolute;
		top: 0;
		left: 0;
		width: 140rpx;
		height: 40rpx;
		line-height: 40rpx;
		background-image: url('@/static/images/product/product-discount-bg.png');
		text-align: left;
		text-indent: 2rpx;
		color: #fff;
		padding-left: 4rpx;
		font-size: 23.08rpx;
		background-size: cover;
	}
    .product-item-discount_show_countdown{
        position: absolute;
        top: -7.69rpx;
        left: -7.69rpx;
        width: 92.31rpx;
        height: 92.31rpx;
        text-align: left;
        text-indent: 2rpx;
        color: #fff;
        font-size: 23.08rpx;
        background-size: cover;
        .img{
            width: 92.31rpx;
            height: 92.31rpx; 
        }
        .product_discount_tag_text{
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100%;
            white-space: nowrap;
            color: #fff;
            font-size: 19rpx;
            transform: translate(calc(-10rpx - 50%),calc(-10rpx - 50%)) rotate(-45deg) scale(1);
        }
    }
	.vip-tag-box {
		margin-top: 15rpx;
		font-size: 24rpx;
		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 4rpx;
		}
		.vip-product-tag {
			background: #fff0e8;
			padding: 0 12rpx;
			color: #873c00;
			font-weight: bold;
			line-height: 1;
		}
		.vip-discount {
			background: #873c00;
			color: #FFE2D3;
			padding: 0 10rpx;
			height: 32rpx;
			line-height: 32rpx;
		}
	}

    .goods-box {
        width: calc(50% - 10rpx);
        // height: 489rpx;
        margin: 0 0 24rpx 0;
        display: inline-block;
        position: relative;

        .add-cart-box {
            text-align: center;
            padding: 17.31rpx 0;
            border-radius: 38.47rpx;
            border: 1px solid #393939;
            font-size: 23.08rpx;
        }
        .singleList-add-cart-box{
            padding: 7.7rpx 19.24rpx;
        }
    }

    .img-box image.image {
        width: 100%;
        display: block;
		position: absolute;
		right: 0;
		top: 50%;
        padding-bottom: 100%;
		transform: translate(-50%,-50%);
		left: 50%;
		background-image: url('../../static/images/default.png');
		background-size: cover;
		height: unset;
    }
	.img-box .color-data {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		padding: 3.85rpx;
		padding-bottom: 0px;
		border-radius: 24rpx;
		background: rgba(0,0,0,.2);
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 24rpx;
	}
	.img-box .color-data image {
		width: 23.08rpx;
		height: 23.08rpx;
		border-radius: 50%;
		margin-bottom: 3.85rpx;
	}
	::v-deep .img-box .color-data image div {
		background-size: 120% !important;
	}
	.img-box .color-data .color-data-num {
		margin-bottom: 8rpx;
        color: #fff;
	}
	.img-box {
        .amount-box{
            position: absolute;
            top: 157.6924rpx;
            left: 50%;
            transform: translateX(-50%);
            color: #41176D;
            flex-wrap: nowrap;
        }
        .dollar{
            font-size: 84.6153rpx;
            text-shadow: 
			0px 0px 0 white, 0px 0px 0 white, 0px 1.924rpx 0 white, 1.924rpx 1.924rpx 0 white, 
			0px 0px 0 #41176D, 0px 0px 0 #41176D, 0px 3.847rpx 0 #41176D, 7.6923rpx 3.847rpx 0 #41176D;
        }
		.share_amount{
            font-size: 107.6924rpx;
            text-shadow: 
			0px 0px 0 white, 0px 0px 0 white, 0px 1.924rpx 0 white, 1.924rpx 1.924rpx 0 white,
			0px 0px 0 #41176D, 0px 0px 0 #41176D, 0px 3.847rpx 0 #41176D, 7.6923rpx 3.847rpx 0 #41176D;
        }
		.share_discount{
			position: absolute;
			left: 65.3846rpx;
			top: 321.1538rpx;
			font-size: 20rpx;
			font-style:italic;
			color: #41176D;
		}
        .phone_price{
            position: absolute;
            font-size: 26.9231rpx;
            right: 19.2308rpx;
            bottom: 42.3077rpx;
            transform: rotate(-9deg) scale(0.2);
            color: #41176D;
        }
	}
    .img-box {
        width: 100%;
        // height: 383.92rpx;
        margin-bottom: 5px;
        position: relative;
        // overflow: hidden;
		padding-bottom: 100%;
		position: relative;
    }
    .banner-img-box{
        padding-bottom: calc(273 / 171 * 100%);
        image.image {
            padding-bottom: calc(273 / 171 * 100%);
        }
    }

    page {
        height: 100%;
    }

    .goods-characteristic {
        font-size: 22rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: #f0ece1;
        color: #a18d65;
        height: 35px;
        line-height: 35px;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .goods-characteristic text {
        padding-left: 5px;
    }

    .goods-title {
        font-size: 28rpx;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 5px;
    }



    .goods-price-naver {
        color: #999;
        font-size: 24rpx;
        line-height: 28px;
        width: 100%;
        text-align: right;
        padding: 0 3px;
    }

    .no-more-goods {
        text-align: center;
        margin-top: 20%;
        margin-bottom: 20%;
    }


    .no-order-img {
        width: 220rpx;
        height: 220rpx;
    }

    .no-more-goods .text {
        font-size: 28rpx;
        color: #999;
        margin-top: -5px;
    }

    .goods-list-title {
        font-size: 26.93rpx;
        color: #666;
        line-height: 30.78rpx;
        min-height: 61.54rpx;
		margin-top: 7.7rpx;
        display: -webkit-box;
        word-break: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .special-goods-list-title{
        -webkit-line-clamp: 1;
        min-height: 30.78rpx;
    }
    .goods-originalPrice {
        padding-left: 10rpx;
        font-size: 24.77rpx;
        color: #999;
        text-decoration: line-through;
        display: inline-block;
    }
	
	.goods-originalPrice-specialPrice {
        font-size: 19.23rpx;
		text-decoration: none;
		color: #FF005D;
		border: 1px solid #FF005D;
		padding: 0 8rpx;
		margin-left: 16rpx;
		border-radius: 8rpx;
	}

    .goods-price {
        color: #8A61E7;
        font-size: 30.77rpx;
        // height: 44rpx;
        line-height: 36rpx;
        text-align: left;
        display: inline;
    }    
	.member-price {
		.goods-price {
			color: #873c00;
		}
	}

    .goods-list-money {
        font-size: 30.77rpx;
        color:#393939;
        display: flex;
		flex: 1;
		flex-wrap: nowrap;
		justify-content: space-between;
        align-items: center;
        line-height: 36rpx;
    }
	.vip-page-member-price {
		display: none;
	}
    .more-action{
        // position: absolute;
		display: inline-block;
        text-align: center;
        width: 56rpx;
        height: 30rpx;
        line-height: 30rpx;
		font-size: 40rpx;
        right: 48rpx;
        border-radius: 10px;
        color: #000;
        &:before{
			content: '\e6aa';
        }
    }
    .delete-mask{
        width: 100%;
        margin-bottom: 5px;
        overflow: hidden;
		padding-bottom: 100%;
		position: absolute;
        background-color: rgba(0,0,0,0.6);
        top: 0;
    }
    .delete-btn{
        width: 75%;
        height: 56rpx;
        background-color: rgba(0,0,0,1);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff; 
    }
    .delete-icon{
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        &:before{
            content: '\e6ab'; 
        }
    }
}
.singleList{
    .goods-box {
        width: calc(100% - 10rpx);
        margin: 16rpx 0 24rpx 0;
        position: relative;
        display: flex;
        // flex-wrap: nowrap;
        .img-box {
            width: 265rpx;
            // height: 354rpx;
            margin-bottom: 5px;
            position: relative;
            overflow: hidden;
            padding-bottom: 265rpx;
            position: relative;
            display: inline-block;           
            image.image {
                width: 265rpx;
                // height: 354rpx;
                display: block;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(-50%,-50%);
            }
        }
		.banner-img-box{
			padding-bottom: 423.077rpx;
			.amount-box{
				position: absolute;
				top: 130.767rpx;
				left: 50%;
				-webkit-transform: translateX(-50%);
				transform: translateX(-50%);
				color: #41176D;
				flex-wrap: nowrap;
				.dollar{
					font-size: 57.6923rpx;
				}
				.share_amount{
					font-size: 76.9231rpx;
				}
			}
			.share_discount{
				left: 48.0769rpx;
				top: 251.9230rpx;
				transform: scale(.7);
			}
			.phone_price{
				right: 7.6923rpx;
				bottom: 34.6153rpx;
				transform: rotate(-13deg) scale(0.1);
			}
		}
        .good_desc{
            width: calc(100% - 265rpx);
            display: inline-block;            
            height: 100%;
            padding: 12rpx 12rpx 12rpx 20rpx;
            .goods-list-title{
                margin-bottom: 20rpx;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                height: unset;
                white-space: unset;
            }
        }

    }
}
.bottom-nomore {
    text-align: center;
    color: #999;
    padding: 20rpx 0;
    font-size: 26.92rpx;
}
</style>