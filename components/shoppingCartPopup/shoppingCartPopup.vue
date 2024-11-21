<template>
	<view>
		<!-- 购物车弹窗 -->
		<uni-popup ref="popupCart" class="shoppingCartPopup" 
			:class="goodsDetail.special_data && goodsDetail.special_data.is_spu_special == 1 && goodsDetail.can_sale ? 'isBelongSpecialActivity' : '' " 
			@change="(e)=>{handleChangeCartPopup(e)}">
			<popupContentTemplate @close="close()" :hidePaddingRight='true'>
				<template v-slot:content>
					<!-- 商品大图预览 -->
					<scroll-view
						:show-scrollbar="false"
						:scroll-into-view="scrollIntoView"
						:scroll-x="true"
						@scroll="goodsPopupScroll"
						style="white-space: nowrap">
						<view class="thumbnail_imgs_box">
							<image v-for="(item, index) in goodsDetail.thumbnail_img" :key="index"
								:src="item.url"
								:lazy-load="true"
								mode="aspectFill"
								:id="'img_'+index"
								@click="openShowImgDialog(index)"
								style="width: 250rpx;height:250rpx;margin-right: 15.39rpx;"
							></image>
						</view>
					</scroll-view>
					<scroll-bar
						:scrollLeft="barScrollLeft"
						:scrollWidth="barScrollWidth"
						:dotNum="setDotNum(goodsDetail.thumbnail_img.length)"
						:dotType="'shoppingCartPopup'"
						:dotColor="'#fff'"
						:distanceFromList="'11.54rpx'"
					></scroll-bar>
					<!-- 商品信息 (名字/价格/优惠/Details跳转到goods-detail) -->
					<view class="info-wrapper">
						<view class="popup-product-current-info">
							<view class="product-title">{{goodsDetail.name}}</view>
							<view class="price-box flex align-items-center justify-content-between">
								<view class="flex align-items-center">
									<!-- 属于特价活动商品并且用户已购买过该件商品且已购数量大于等于限购数量【goodsDetail.special_qty_left==0】并且已选择size时，或者无库存  恢复原价-->
									<view class="special-activity-goods-price" v-if="(goodsDetail.special_data&&goodsDetail.special_data.is_spu_special == 1&&goodsDetail.special_qty_left==0&&isSizeSelected) || (goodsDetail.special_data&&goodsDetail.special_data.is_spu_special== 1&&!goodsDetail.can_sale)">
										{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
									</view>
									<!-- 会员商品没有特价 -->
									<block v-else-if="goodsDetail.price_info.special_price && goodsDetail.price_info.special_price.value">
										<view :class="{
											'text-line-through':tierActiveIndex>0,
											'sp_price':goodsDetail.special_price_off
										}" class="price">
											{{ goodsDetail.price_info.special_price.symbol }}{{ goodsDetail.price_info.special_price.value }}
										</view>
										<view v-if="goodsDetail.special_price_off" class="p-discount-off">-{{goodsDetail.special_price_off}}%</view>
										<view class="originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
									</block>
									<block v-else>
										<block v-if="goodsDetail.member_product && goodsDetail.isVip">
											<view :class="tierActiveIndex>0?'text-line-through':''" class="price">{{ goodsDetail.member_price.symbol }}{{ goodsDetail.member_price.value }}</view>
											<view class="originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
										</block>
										<view v-else :class="tierActiveIndex>0?'price text-line-through':'price'">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
									</block>
									
									<!-- <view class="status">{{ (headerData.status || !isSizeSelected)?$t('goods_detail.in_stock'):$t('goods_detail.out_of_stock') }}</view> -->
								</view>
								<view class="to-detail-box flex align-items-center" @click="handleToDetail">
									<view class="to-detail">{{$t('goods_detail.details')}}</view>
									<!-- <view class="iconfont icon-goto"></view> -->
								</view>
							</view>
							
							<!-- 用户是vip并且是会员产品 -->
							<view v-if="goodsDetail.member_price && goodsDetail.isVip" class="user-is-vip flex align-items-center">
								<view><text class="font-bold">-{{goodsDetail.discount_off}}</text>%</view>
								<view class="vip-line"></view>
								<view class="flex-1">{{$t('vip.exclusive_discounts', {site_name: $store.state.site_name_upper,discount_off:goodsDetail.discount_off})}}</view>
							</view>
							<!-- 用户当前不是vip并且是会员产品 -->
							<view v-if="goodsDetail.member_product && !goodsDetail.isVip" @click="$public.handleNavTo('/pages/vip/index')" class="flex align-items-center justify-content-between vip-bg">
								<view class="flex align-items-center" style="padding-left: 5px;flex:1;width:0">
									<view class="font-bold">{{goodsDetail.member_price.symbol}}{{goodsDetail.member_price.value}}</view>
									<view class="vip-line"></view>
									<view class="flex align-items-center" style="flex:1;">
										<!-- <image mode="widthFix" style="width: 22px;" src="../../static/images/vip/vip_icon.png" /> -->
										{{$t('vip.product_vip_tip',{site_name: $store.state.site_name_upper,discount_off:goodsDetail.discount_off})}}</view>
								</view>
								<view class="iconfont icon-goto"></view>
							</view>
						</view>
					</view>
					
					<!-- Color/Prescription -->
					<view class="goods_detail_options-box" v-if="goodsDetail.options && goodsDetail.options.length">
						<view class="popup-product-current-attr-box" v-for="(item,index) in goodsDetail.options" :key="index">
							<view class="label info-wrapper">
								{{item.label}}: {{item.label == currentColorObj.key ?currentColorObj.value:''}}
							</view>
							<scroll-view :show-scrollbar="false" :scroll-into-view="'color_'+id" :scroll-x="true" style="white-space: nowrap;">
								<view class="attr-box" :class="item.label == currentColorObj.key?'':'flex info-wrapper'">
									<template v-for="(item_child,index_child) in item.value" >
										<!-- Color -->
										<view :class="item_child.show_as_img ? 'color_box' : ''">
											<view v-if="item_child.show_as_img" :key="index_child" :id="'color_'+item_child.id" 
												class="color-item" 
												:class="item_child.active == 'current' ? 'color-on' :
														item_child.active == 'noactive' ? 'color-disabled' : ''" 
												@click="changeColor(item_child,index_child)" >
												<!-- 图片 -->
												<image :class="(!isSizeSelected && !item_child.color_variant_stock) || (!item_child.has_stock&&isSizeSelected)?'img_out_stock':''" :src="item_child.show_as_img" mode="aspectFill"></image>
												<!-- 折扣标签 -->
												<view class="has-discount" v-if="item_child.has_discount&&!item_child.is_hot"></view>
												<!-- 如果未选中尺码，颜色的库存按颜色变体库存显示，如果选中尺码，颜色库存按sku显示 -->
												<!-- 商品禁选 -->
												<view v-if="(!isSizeSelected && !item_child.color_variant_stock) || (!item_child.has_stock&&isSizeSelected)"
													class="out-stock" >
												</view>
												<!-- 商品热门标签 -->
												<view v-if="item_child.is_hot" class="product_hot_tag flex align-items-center justify-content-center">{{$t('goods_detail.hot')}}</view>
											</view>
										</view>
										<!-- Prescription -->
										<view v-if="!item_child.show_as_img&&item_child.status==1" :key="index_child"  
											class="other-item" 
											:class="judgeAttrSelect({item,item_child})" 
											@click="changeOtherAttr(item_child,index_child,item)">
											{{item_child.attr_val}}
										</view>
									</template>
								</view>
							</scroll-view>
						</view>
					</view>
					
					<view class="info-wrapper">
						<!-- 批发价 -->
						<view v-if="goodsDetail.tier_price.length" class="shopping-cart-popup-tier-price-box">
							<tier-price v-if="goodsDetail.tier_price.length" :tier_price="goodsDetail.tier_price" :activeIndex="tierActiveIndex"></tier-price>
						</view>
						<!-- Quantity -->
						<view class="popup-product-current-attr-box popup-product-current-qty-box">
							<view class="label pb0">{{$t("goods_detail.Quantity")}}</view><br/>
							<view class="qty-box">
								<view @click="handleNumReduce()" class="iconfont icon-reduce" :class="qtyValue>1?'':'disabled'"></view>
								<input class="qty-input" step="1" type="number" @input="qtyValueChange" :value="qtyValue" />
								<view @click="handleNumAdd()" class="iconfont icon-add"></view>
							</view>
						</view>
						<view class="slod-out-tip flex no_wrap align-items-start" v-show="goodsDetail.special_data && goodsDetail.special_data.is_special == '0' && goodsDetail.special_data.is_spu_special == '1'">
							 <view class="img_box">
								<image class="img" src="@/static/images/black_tip.png" mode="widthFix" />
							 </view>
							 <view class="">
								{{ $t('goods_detail.sizefor') }}<text class="di" style="color: #8A61E7;">{{ $t('goods_detail.sale',{site_name: $store.state.site_name_upper}) }}</text>{{ $t('goods_detail.torestore') }}
							 </view>
						</view>
					</view>
				</template>
				
				<template v-slot:footer>
					<slot name="footer">
						<view class="footer flex align-items-center">
							<view @click="changeFav()" class="wish-box">  <!-- v-if="showFav"  -->
								<image v-if="goodsDetail.fav==1" src="@/static/images/p_detail_collect_sel@2x.png" mode="widthFix" />
								<image v-else src="@/static/images/p_detail_collect@2x.png" mode="widthFix" />
							</view>
							
							<view v-if="btnType == 'add'" @click="handleAddToBag" 
								class="popup-product-add-btn dui-primary-btn" 
								:class="isAddToShoppingCart?'':'disabled'">  	<!-- :style="showFav?'':'width:100%'" -->
								{{	product_spu_sold_out ? $t("goods_detail.sold_out") : $t("goods_detail.add_to_bag") }}
							</view>
							<view v-else @click="$emit('save')" 
								:class="isAddToShoppingCart?'':'disabled'" 
								class="popup-product-add-btn dui-primary-btn">	<!-- :style="showFav?'':'width:100%'" -->
								{{$t("goods_detail.update")}}
							</view>
						</view>
					</slot>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 查看大图弹窗 -->
		<uni-popup ref="popupBigImg" class="big-img-popup" v-if="goodsDetail.thumbnail_ori_img && goodsDetail.thumbnail_ori_img.length">
			<view class="popup-content" @click="closeImgDialog">
				<view class="big-image-swiper-dialog page-max-width">
					<!--无色块时展示的大图swiper  start -->
					<block v-if="!showColorBlocks&&imgDialogVisible">
						<swiper :style="{ height: '75vh'}" class="swiper_box"
							:current="swiperCurrent" :disable-programmatic-animation="true" :autoplay="false" circular="true" :interval="10000" :duration="duration"
							@change="swiperChange"
							>
							<block v-for="(item, index) in goodsDetail.thumbnail_ori_img" :key="index">
								<swiper-item class="flex align-items-center">
									<movable-area style="width:100%;height:100%;">
										<movable-view scale-min="1" scale-max="5" scale="true" class="max movable_box_class flex align-items-center" direction="all" style="width:100%;height:100%;">
											<image :id="'swiper-item-image' + index" :src="item" style="height: 100%;background:#000;" class="slide-image" :lazy-load="true"
											mode="aspectFit" />
										</movable-view>										
									</movable-area>
									
								</swiper-item>
							</block>
						</swiper>
						<view v-if="goodsDetail.thumbnail_ori_img.length" class="dots">
							{{ swiperCurrent+1}}/{{goodsDetail.thumbnail_ori_img.length}}
						</view>
						<view class="big-image-view-btn left" @click.stop="swiperCurrent==0?swiperCurrent=goodsDetail.thumbnail_ori_img.length-1:swiperCurrent--">
							<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-left@2x.png"></image>
						</view>
						<view class="big-image-view-btn right" @click.stop="swiperCurrent==goodsDetail.thumbnail_ori_img.length-1?swiperCurrent=0:swiperCurrent++">
							<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-right@2x.png"></image>
						</view>
					</block>
					<!--无色块时展示的大图swiper end -->

					<!--有色块时展示的大图swiper start -->
					<block v-if="showColorBlocks&&imgDialogVisible">
						<swiper :style="{ height: '75vh'}" class="swiper_box"
							:current="bigSwiperCurrent" :disable-programmatic-animation="true" :autoplay="false" circular="true" :interval="10000" :duration="duration"
							@change="dialogSwiperChange"
							>
							<block v-for="(item, index) in allColorThumbnailImgs" :key="index">								
								<swiper-item class="flex align-items-center">
									<movable-area style="width:100%;height:100%;">
										<movable-view scale-min="1" scale-max="5" scale="true" class="max movable_box_class flex align-items-center" direction="all" style="width:100%;height:100%;">
											<image :id="'swiper-item-image' + index" :src="item.url" style="height: 100%;background:#000;" class="slide-image" :lazy-load="true"
											mode="aspectFit" />
										</movable-view>
									</movable-area>						
								</swiper-item>
							</block>
						</swiper>
						<!--色块区域 仅多色块时展示-->
						<view class="big_img_color_wrapper" style="text-align:center">
							<view class="big_img_color">{{$t('goods_detail.color')}}:{{ currentColorBlockIDetail.attr_val }}</view>	
						</view>						
						<view class="bottom_img_wrapper" @tap.stop="()=>{}">				
							<view class="active_block_wrapper" id="active_block_wrapper">
								<view class="active_block_inner"></view>
							</view>
							<scroll-view :scroll-left="blockScrollLeft" @scroll="scrollBlocks"  :scroll-with-animation="true" :show-scrollbar="false" :scroll-x="true"  class="color_block_imgs flex justify-content-between" >
								<view class="scroll_inner flex" :style="{width:'calc('+'100vw + '+ (colorBlockImgs.length-1)+ '*100rpx' + ')'}">
									<view class="transform_con flex" >
										<view class="scroll_con flex justify-content-center" v-for="(item,index) in colorBlockImgs" :key="index" @tap="handleSelectBlock(index)">
											<image mode="aspectFill"  :src="item.url" class="color_block_image" :lazy-load="true" />	
										</view>
									</view>
								</view>
							</scroll-view>        
						</view>
						<!--色块区域-->
						<!--1/5-->
						<view v-if="goodsDetail.thumbnail_ori_img.length" class="dots">
							{{ fakeSwiperCurrent}}/{{nowColorImgs.length}}
						</view>
						<!--1/5-->
						<view class="big-image-view-btn left" @click.stop="bigSwiperCurrent==0?bigSwiperCurrent=allColorThumbnailImgs.length-1:bigSwiperCurrent--">
							<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-left@2x.png"></image>
						</view>
						<view class="big-image-view-btn right" @click.stop="bigSwiperCurrent==allColorThumbnailImgs.length-1?bigSwiperCurrent=0:bigSwiperCurrent++">
							<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-right@2x.png"></image>
						</view>
					</block>
					<!--有色块时展示的大图swiper end -->
					
					

					
					<image class="close-img" src="@/static/images/p_detail_left_arrow_white@2x.png" />
					<image class="share" @click.stop="handleShare()" src="@/static/images/p_detail_share_2_white@2x.png" />

				</view>
			</view>
		</uni-popup>
		
		<!-- 分享弹窗 -->
		<sharePopup @clickBarItem="(type)=>{handleClickBarItem(type)}" key_prefix="product_share_" ref="popupShare" :isDifferPlatformWord="true" :shareData="shareData" :title="$t('fission_sharing.share_popup_title')"></sharePopup>
		<customTooltip ref="tooltipShoppingCart" :title="$t('fission_sharing.share_success_text')"></customTooltip>
		
		<view v-if="currentImgobj&&currentImgobj.copyImgUrl" :class="'fly-item '+ (flyItemShow ? 'fly_item_show ' : '')" id='flyItem' 
		:style="animationStyle">
			<image class="img" :src="currentImgobj&&currentImgobj.copyImgUrl" />
		</view>
		<view :class="'add_success_toast flex align-items-center ' + (success_toast_flag ? 'add_success_toast_ani' : '')" v-show="add_success_toast_show">
			<image class="img" src="@/static/images/icon/add_to_cart_success_tip@2x.png" mode="widthFix" />
			<text class="text">{{$t('cart.cart_added_success')}}</text>
		</view>
	</view>
</template>

<script>
	import popupContentTemplate from '@/components/popupContentTemplate/popupContentTemplate.vue';
	import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
	import sharePopup from '@/components/sharePopup/sharePopup.vue';
	import { mapState } from 'vuex';
	export default {
		name:"shoppingCartPopup",
		components: {
			popupContentTemplate,
			sharePopup,
			customTooltip
		},
		props: {
			btnType: {
				type: String,
				default: 'add'
			},
			showFav: {
				type: Boolean,
				default: true
			},
			showFloorTab: {
				type: Boolean,
				default: false,
			},
			add_cart_type: {
				type: String,
				default: 'quick_view'
			}
		},
		data() {
			return {
				isSizeSelected:false,
				bigSwiperCurrent: null,
				changeBigSwiperFrom:'',
				allColorThumbnailImgs: [],
				colorBlockLengthArr:[],
				currentColorBlockIDetail:{},
				blockScrollLeft: 0,
				oldScroll: {
					blockScrollLeft: 0,
				},
				nowColorImgs: [],
				colorBlockWidth: 55,
				colorBlockHeight: 55,
				showColorBlocks: true,
				scrollIntoView:'img_0',
				swiperCurrent:0,
				imgDialogVisible: false,
				swiperHeight: 110,
				headerData: {},
				qtyValue:1,
				id:'',
				isAddToShoppingCart:true,// 是否可以加入购物车
				product_spu_sold_out: false,//spu是否下架
				tier_price_format: [], // 批发价格式化
				goodsDetail: {
					tier_price: []
				},
				shareData:{},
				colorBlockImgs: [],
				fakeSwiperCurrent: 1,

				currentColorObj: {
					key:'',
					value: ''
				},
				tierActiveIndex:'',
				duration: 500,
				shareBannerData: {}, // 裂变分享图片地址
				shareBannerDataCopy: {}, //裂变分享数据（保存下来的）
				show:false,// 快速加购弹窗是否展开
				currentImgobj: {},//加购动画的商品图初始位置及url
				flyItemShow: false,
				imgOffsetY: 0,
				imgOffsetX: 0,
				isRunning: false,
				animationStyle: '',
				scrollTop: 0,
				scrollLeft: 0,
				add_success_toast_show: false,
				success_toast_flag: false,
				isShared:false, // 是否点击了分享
				isShowedSpecialTOriginalTip:false,
				barScrollLeft: 0,
				barScrollWidth: 0,
			};
		},
		computed: {
			...mapState(['appConfig']),
			notAutoSelectSpuAttr() {
				return this.appConfig.notAutoSelectSpuAttr?.name?.toLowerCase() || '';
			}
		},
		watch:{
			qtyValue: {
				handler(newVal,oldVal) {
					this.$emit('qtyValueChange',newVal)
				},
			}
		},
		beforeDestroy () {
		    uni.$off('loginSuccess');
			uni.$off('onParentShow');
		},
		created(){
			
		},
		methods: {
			handleChangeCartPopup(e) {
				this.$emit('popupChange',e.show);
				if(!e.show) {
					this.isShowedSpecialTOriginalTip = false;
				}
			},
			handleNumReduce() {
				this.qtyValue--;
				this.judgingWholesalePrices(this.qtyValue)
			},
			handleNumAdd() {
				this.qtyValue++;
				this.judgingWholesalePrices(this.qtyValue)
				if(!this.isShowedSpecialTOriginalTip && this.isSizeSelected && this.qtyValue>this.goodsDetail.special_qty_left&&this.goodsDetail.special_qty_left!=0&& this.goodsDetail.special_data&& this.goodsDetail.special_data.is_spu_special == 1&&this.goodsDetail.can_sale) {
					this.showedSpecialTOriginalTip()
				}
			},
			goodsPopupScroll(e){
				const { scrollLeft, scrollWidth } = e.detail
				this.barScrollLeft = scrollLeft
				this.barScrollWidth = scrollWidth - 390
			},
			setDotNum(listLen) {
				const dotNum = Math.ceil(listLen / 2.5)
				return dotNum == 1 ? 0 : dotNum
			},
			showedSpecialTOriginalTip() {
				uni.showToast({
				    title: this.goodsDetail.special_qty_left_text,
				    icon: 'none',
				    duration: 3000
				});
				this.isShowedSpecialTOriginalTip = true;
			},
			handleClickBarItem(type) {
				if(type != 'more') {
					this.isShared = true
				}
			},
			handleShare() {
				this.shareBannerData={};
				if(this.$store.getters.hasLogin){
					if(this.shareData&&this.shareData.url) {
						this.$refs.popupShare.open('bottom');
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/index?is_special=1&in_site_source=product_details&loginNavigateBack=1&loginNavigateBackType=clickQuickViewShare'
					});
				}
				this.$trackEvent.open_share_code({
					from_page: 'product_detail_img',
					event_name: 'open share from product detail page',
					event_action: 'open_share_product',
					product_id:this.id
				});
			},
			handleToDetail() {
				this.$refs.popupCart.close();
				setTimeout(()=>{
					let product_url = '/pages/goods-detail/index?id=' + this.goodsDetail._id;
					if(this.productItem&&this.productItem.rec_code) {
						product_url +="&rec_code=" + this.productItem.rec_code;
					}
					if(this.productItem&&this.productItem.rec_engine) {
						product_url +="&rec_engine=" + this.productItem.rec_engine;
					}
					if(this.productItem&&this.productItem.module) {
						product_url +="&module=" + this.productItem.module;
					}
					if(this.productItem&&this.productItem.ab_key) {
						product_url +="&ab_key=" + this.productItem.ab_key;
					}
					this.$public.handleNavTo(product_url)
				},1)
			},
			// 判断产品属性是否选中
			judgeAttrSelect(data) {
				var className = '';
				if(data.item_child.active== 'current') {
					if(data.item.label.toLowerCase() == this.notAutoSelectSpuAttr&&!this.isSizeSelected) {
						className = !data.item_child.has_stock ? 'other-isOutStock' : ''
					} else {
						className = 'other-on';
					}
				} else if(data.item_child.active== 'noactive') {
					className = 'other-disabled'
				} else {
					className = !data.item_child.has_stock ? 'other-isOutStock' : ''
				}
				return className
			},
			closeImgDialog(){
				const that = this
				if((that.id !== this.currentColorBlockIDetail.attr_id) && that.showColorBlocks) {
					that.id = this.currentColorBlockIDetail.attr_id;
					uni.showLoading();
					that.getProductDetails({type:'color'})
				}
				// 根据当前的 index 定位到外层scroll-view 的具体位置
				if(that.showColorBlocks){
					const scrollId = Number(that.fakeSwiperCurrent) - 1
					that.scrollIntoView = 'img_'+ scrollId
				}else{
					that.scrollIntoView = 'img_'+ that.swiperCurrent
				}
				
				that.imgDialogVisible = false;
				that.$refs.popupBigImg.close();
				uni.$off('onParentShow');
				
			},
			onBackPress() {
				if(this.currentOpenPop) {
					this.$refs[this.currentOpenPop].close()
					this.currentOpenPop = '';
					return true;
				} else if(this.imgDialogVisible) {
					if(this.showColorBlocks) {
						this.closeImgDialog()
					} else {
						this.closeImgDialogNoBlock()
					}
					return true;
				} else {
					return false;
				}
			},
			dialogSwiperChange(e){
				const that = this
				that.changeBigSwiperFrom = "swiper";
				const colorBlockWidth = that.colorBlockWidth
				const swiperCurrent = e.detail.current
				var allImgsCurerntItem=that.allColorThumbnailImgs[swiperCurrent];
				that.setData({
					fakeSwiperCurrent: allImgsCurerntItem.index_in_color_block+1,
					swiperCurrent:allImgsCurerntItem.index_in_color_block,
					bigSwiperCurrent: allImgsCurerntItem.index_in_all,
					nowColorImgs:allImgsCurerntItem.item_color_block_imgs,
					currentColorBlockIDetail:{attr_val:allImgsCurerntItem.attr_val,block_index:allImgsCurerntItem.k,attr_id:allImgsCurerntItem._id}
				});
				that.changeNowBlock(colorBlockWidth*allImgsCurerntItem.k)
			},
			openShowImgDialog(index){
				// 根据当前色块 定位到大图banner选中的色块，根据当前index，确定大图的bigSwiperCurrent
				const that = this
				// that.duration=0;
				that.swiperCurrent = index;
				this.changeBigSwiperFrom = 'swiper'
				if(!that.goodsDetail.thumbnail_img.length)return
				let bigSwiperIndex = 0;
				that.colorBlockLengthArr.map((_value,_index)=>{
					if(_index<that.currentColorBlockIDetail.block_index) {
						bigSwiperIndex = bigSwiperIndex+_value
					}
				})
				
				that.imgDialogVisible = true
				that.$refs.popupBigImg.open('right');
				this.$nextTick(()=>{
					that.bigSwiperCurrent = bigSwiperIndex+that.swiperCurrent;
				})
				
				
				uni.$off('onParentShow').$on("onParentShow",()=>{
					console.log('onParentShow===');
					if(this.isShared) {
						this.$refs.popupShare.close();
						this.$refs.tooltipShoppingCart.open({time:2000});
						this.isShared = false;
					}
				});
				if(!that.showColorBlocks)return
				that.getColorBlockWidth()
			},
			getColorBlockWidth(){
				const that = this
				if(!that.showColorBlocks)return
				this.$nextTick(()=>{
					const query = uni.createSelectorQuery();
					query.select('.scroll_con').boundingClientRect(res=>{
						const {width,height} = res
						that.colorBlockWidth = width
						that.colorBlockHeight = height
					}).exec()
				})	
			},
			closeImgDialogNoBlock(){
				const that = this
				that.imgDialogVisible = false
				that.$refs.popupBigImg.close();
				uni.$off('onParentShow');
			},
			handleSelectBlock(key){
				this.changeBanner(key)
				this.blockScrollLeft = this.colorBlockWidth * key;
			},
			changeBanner(index){
				let _all_index = 0;
				this.colorBlockLengthArr.map((_value,_index)=>{
					if(_index<index) {
						_all_index = _all_index+_value
					}
				})
				this.bigSwiperCurrent = _all_index;
			},
			formatData(goodsDetail,type) {
				const that = this
				this.goodsDetail = goodsDetail
				if(goodsDetail.options && goodsDetail.options.length) {
					goodsDetail.options.map((item,index) => {
						item.value.map((item_c,index_c) => {
							if(item_c.show_as_img && item_c.active == 'current') {
								this.currentColorObj = {key:item.label,value:item_c[item.label]}
							}
						})
					})
					var sizeOptions = goodsDetail.options.filter(item=>{return item.label.toLowerCase() == this.notAutoSelectSpuAttr});
					var sizeValue = [];
					if(sizeOptions.length>0&&sizeOptions[0].value) {
						sizeValue = sizeOptions[0].value.filter(item => item.status==1)
					}
					if(sizeOptions.length == 0 || (sizeOptions.length>0 && sizeValue.length <2)) {
						this.isSizeSelected = true;
					}
				} else {
					this.isSizeSelected = true;
				}
				this.goodsDetail.thumbnail_img = goodsDetail.thumbnail_img.map(item=>{
					return {
						url: item,
						_id: this.goodsDetail._id,
						attr_val: this.currentColorObj.value
					}
					
				})
				this.shareData = {
					from_page: "product_detail_img",
					share_from: 'product',
					product_id: this.goodsDetail._id,
					url: goodsDetail.short_url,
					image: goodsDetail.thumbnail_share_img,
					hashtag:goodsDetail.share_hashtag,
					description:goodsDetail.name,
					subject:goodsDetail.share_subject,
					prefix_email_content:goodsDetail.prefix_email_content || '',
					tw_share_description:goodsDetail.share_description
				}
				if(goodsDetail.product_share_content) {
					this.shareData = {...this.shareData,...goodsDetail.product_share_content}
				}
				const colorItem = goodsDetail.options&&goodsDetail.options.find(item=>{
					return item.label == 'Color'
				})
				this.isLoading = false;
				if(!colorItem){
					this.showColorBlocks = false
					return
				}else{
					this.showColorBlocks = true
				}
				this.allColorThumbnailImgs = []
				this.colorBlockImgs = []
				let allColorItemIndex = -1;
				this.colorBlockLengthArr=[];
				colorItem.value.forEach((item, k)=>{
					if(item.active == 'current') {
						this.currentColorBlockIDetail = {
							attr_val:item.attr_val,
							block_index:k,
							attr_id:item.id
						}
					}
					if(item.thumbnail_ori_img){
						this.colorBlockLengthArr.push(item.thumbnail_ori_img.length);
						const thumbnail_ori_img = item.thumbnail_ori_img.map((ite,index_child)=>{
							allColorItemIndex++;
							return {
								url: ite,
								k: k,
								index_in_all:allColorItemIndex,
								index_in_color_block:index_child,
								item_color_block_imgs:item.thumbnail_ori_img,
								_id: item._id,
								attr_val: item.attr_val,
								price_info: {
									symbol: item.symbol,
									special_price: item.special_price,
									special_price_off: item.special_price_off,
									member_price: item.member_price,
									member_price_discount_off: item.member_price_discount_off,
									price: item.price
								}
							}
						})
						this.allColorThumbnailImgs = this.allColorThumbnailImgs.concat(thumbnail_ori_img)
						this.colorBlockImgs.push({
							url: item.show_as_img,
							_id: item._id,
							attr_val: item.attr_val
						})
					}
					// 解决首次渲染bigSwiper初始化默认字段和bigSwiperCurrent一样导致不触发大图轮播的change事件
					if(type=='show') {
						this.bigSwiperCurrent = this.allColorThumbnailImgs.length
					}
				})
			},
			// 取消、添加收藏
			changeFav () {
				if(!this.$store.getters.hasLogin){
					uni.navigateTo({
						url: '/pages/login/index?loginNavigateBack=1&in_site_source=product_details_wish&loginNavigateBackType=changeFav'
					});
					return;
				}
				this.$apis.changeFav({product_id: this.id,type: this.goodsDetail && this.goodsDetail.fav==1?'del':'add'}).then(res =>{
					uni.hideLoading()
					if(this.goodsDetail.fav == 1) {
						this.goodsDetail.fav = 2
					} else {
						this.goodsDetail.fav = 1
					}
					let track_data = this.goodsDetail;
					if(this.productItem.module){
						track_data['module'] = this.productItem.module;
					}
					if(this.goodsDetail.fav == 1){
						this.$trackEvent.add_to_wishlist(track_data);
					} else {
						this.$trackEvent.remove_wishlist(track_data);
					}
					this.$emit('changeFav',this.goodsDetail.fav==1?'add':'del');
				}).catch(res=>{
					if (res && res.code && res.code == "1100003") {
						this.close()
					}
				})
			},
			swiperChange(e) {
				this.setData({
					swiperCurrent: e.detail.current,
					scrollIntoView: 'img_'+e.detail.current
				});
				this.duration = 500;
			},
			scrollBlocks(e){
				const oldBlockScrollLeft = this.oldScroll.blockScrollLeft
				this.oldScroll.blockScrollLeft = e.detail.scrollLeft
				this.$debounce(this.scrollBlockFunc, 100, [e.detail.scrollLeft])
			},
			// 色块滑动停止
			scrollBlockFunc(num){
				
				const colorBlockWidth = this.colorBlockWidth
				let floorNum = Math.floor(num/colorBlockWidth)
				let result = num % colorBlockWidth	
				if(result > colorBlockWidth/2){
					// 向上取整
					floorNum = Math.ceil(num/colorBlockWidth)
				}
				// 结束后定位
				this.blockScrollLeft = this.oldScroll.blockScrollLeft
				this.$nextTick(function() {
					this.blockScrollLeft = floorNum * colorBlockWidth;
					if(this.changeBigSwiperFrom == 'swiper') {
						this.changeBigSwiperFrom = 'scroll'
					} else {
						this.changeBanner(floorNum)
					}
				})
				
			},
			changeNowBlock(num){
				this.blockScrollLeft = num
			},

			// 加购动画的方法 
			// current--> 商品图位置及url信息, 
			// target--> 购物车位置信息
			async addToCartAnimation(){
				const that = this
				uni.$emit('showBottomTabbar', true)
				const currentImgEle = that.currentImgobj&&that.currentImgobj.currentImgEle
				
				if(!currentImgEle)return
				let targetCartObj = ''
				
				let elemClientRect = await this.getElemClientRect('.add_to_cart_animation_icon');
				if(elemClientRect){
					targetCartObj = elemClientRect;
				} else {
					elemClientRect = await this.getElemClientRect('.nav-bag');
					if(elemClientRect){
						targetCartObj = elemClientRect;
					}
				}
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				const currentRoute = currentPage.route;
				// 有原生底部导航栏的几个页面 取固定的底部购物车位置，其它无购物车图标的加购，不加动画
				const routesArr = ['pages/index/index', 'pages/cate/index', 'pages/fav-list/fav-list', 'pages/cart/cart']
				if(!targetCartObj && (routesArr.indexOf(currentRoute) > -1)){
					const systemInfo = uni.getSystemInfoSync();
      				const screenWidth = systemInfo.windowWidth;
      				const screenHeight = systemInfo.windowHeight;
					targetCartObj = {
						left: screenWidth*3/5, //cart icon left
						top: screenHeight, //cart icon top
						width: screenWidth/5, //cart icon width
						height: 50,		//tabbar height				
					}
					
				}else{
					// 非tabbar页面
					if(!targetCartObj){
						// 无购物车图标的，toast
						that.add_success_toast_show = true
						setTimeout(() => {
							that.success_toast_flag = true
						}, 1000);
						setTimeout(() => {
							that.add_success_toast_show = false
							that.success_toast_flag = false
						}, 4000);					
						return
					}
				}
				
				  
				// 设置图片的尺寸
				const {left:leftImg, top:topImg,  width:widthImg, height:heightImg} = currentImgEle
				const {left:leftCart, top:topTCart, width:widthCart, height:heightCart,} = targetCartObj
				let isDefaultProduct = 0
				isDefaultProduct = uni.getStorageSync('animation_product_detail');
				let newTop = 0
				if(that.isRunning  == false){
					// 购物车图形出现与初始定位
					that.flyItemShow = true
					// 涉及页面滚动的部分
					if(currentRoute == 'pages/goods-detail/index' && isDefaultProduct == '1' && that.showFloorTab){
						// 商品详情页 -- 当滚动到页面看不到主图的时候，点击加购，成功的动画从当前可视区域顶部开始执行
						newTop = that.scrollTop			
						const newTopImg = topImg + that.scrollTop
						that.imgOffsetY = topTCart + heightCart / 2 - (newTopImg  + heightImg / 2);			
					}else{
						newTop = currentImgEle.top + that.scrollTop
						that.imgOffsetY = topTCart + heightCart / 2 - (topImg  + heightImg / 2);
					}
					// 中心点的水平垂直距离
					that.imgOffsetX = leftCart + widthCart / 2 - (leftImg  + widthImg / 2);
					const newLeft = currentImgEle.left + that.scrollLeft
					that.animationStyle = 'transform: translate(0px, 0px) scale(1);display:block;'	
					that.animationStyle+= 'left:'+ newLeft + 'px;top:' + newTop + 'px;'+ 'width:'+widthImg + 'px;height:'+currentImgEle.height + 'px;opacity:1;'
					// 开始动画
					setTimeout(() => {
						that.animationStyle +=  'transform: translate('+ that.imgOffsetX +'px,' + that.imgOffsetY +'px) scale(0);' + 'width:'+widthImg + 'px;height:'+currentImgEle.height + 'px;opacity:0.3;'
					}, 10);
					// 动画标志量
					that.isRunning = true
					setTimeout(function () {
						that.isRunning = false;
						that.animationStyle = ''
					}, 800)
				}
			},
			getElemClientRect(name){
			    return new Promise ((resolve,reject)=>{
					const query = uni.createSelectorQuery()
					query.select(name).boundingClientRect(res => {
					  	resolve(res);
					}).exec();
			    })
			},  
			// 添加到购物车
			handleAddToBag(){
				// 加入购物车
				if(this.isSizeSelected) {
					let req = {qty: this.qtyValue,product_id:this.id};
					if(this.productItem){
						if(this.productItem.rec_code){
							req['rec_code'] = this.productItem.rec_code;
						}
						if(this.productItem.rec_engine){
							req['rec_engine'] = this.productItem.rec_engine;
						}
						if(this.productItem.module){
							req['module'] = this.productItem.module;
						}
						if(this.productItem.ab_key){
							req['ab_key'] = this.productItem.ab_key;
						}
					}
					this.$apis.addShopCar(req).then(res => {
						uni.hideLoading()
						this.close()
						
						// add to cart animation						
						this.addToCartAnimation()
						this.$emit('addToBag',res.data);
						this.$store.commit('SET_CART_COUNT', res.data.items_count)
						let track_data = this.goodsDetail;
						if(this.productItem.rec_code){
							track_data['rec_code'] = this.productItem.rec_code;
						}
						if(this.productItem.rec_engine){
							track_data['rec_engine'] = this.productItem.rec_engine;
						}
						if(this.productItem.module){
							track_data['module'] = this.productItem.module;
						}
						if(this.productItem.ab_key){
							track_data['ab_key'] = this.productItem.ab_key;
						}
						track_data['event_data'] = {
							num: this.qtyValue,
							add_cart_type: this.add_cart_type
						}
						this.$trackEvent.add_to_cart(track_data, this.qtyValue);
					})
				} else {
					uni.showToast({
					    title: this.goodsDetail.selectedTips || this.$t('cart.choose_attribute_tip'),
					    icon: 'none',
					    duration: 3000
					});
				}
			},
			// 打开弹窗
			open(id,num,extendData={}) {
				this.id = id;
				this.qtyValue = num || 1;
				const {isSizeSelected, currentImgobj} = extendData
				this.isSizeSelected = isSizeSelected
				this.currentImgobj = currentImgobj
				if(extendData.productItem){
					this.productItem  = extendData.productItem;
				} else {
					this.productItem  = {};
				}
				uni.showLoading();
				this.getProductDetails({type:'show'})
				uni.$off('loginSuccess').$on("loginSuccess", (data) => {
					if(this.id){
						if(data.loginNavigateBackType == 'changeFav'){
							if(this.goodsDetail && this.goodsDetail.fav == 1)return
							this.changeFav();
						} else {
							this.getProductDetails({loginNavigateBackType:data.loginNavigateBackType});
						}
					}
					
				});
			},
			// 关闭弹窗
			close() {
				this.$refs.popupCart.close()
				uni.$off('loginSuccess')
				uni.$off('onParentShow');
			},
			// qty值变化
			qtyValueChange(e) {
				this.$nextTick(()=>{
					let val = Number(e.detail.value) || 1;
					this.setData({
						qtyValue: val
					})
					this.judgingWholesalePrices(val)
					if(!this.isShowedSpecialTOriginalTip && this.isSizeSelected && val>this.goodsDetail.special_qty_left&&this.goodsDetail.special_qty_left!=0&& this.goodsDetail.special_data&& this.goodsDetail.special_data.is_spu_special == 1&&this.goodsDetail.can_sale) {
						this.showedSpecialTOriginalTip()
					}
				})
			},
			
			// changeOtherAttr(data, index, parentData) {
			// 		console.log(data, index, parentData);
			// 		var isSize = parentData.label.toLowerCase() == 'size';
			// 		// 注意不能和下面的同个if合并
			// 		if(isSize) {
			// 			this.$emit('changeSize')
			// 		}
			// 		if (data.id !== this.id || !this.isSizeSelected) {
			// 			this.id = data.id;
			// 			this.getProductDetails({type:'size',isSize});
			// 		} else {
			// 			// 注意不能和上面面的同个if合并
			// 			if(isSize) {
			// 				this.isSizeSelected = true;
			// 			}
			// 		}
			// },
			// 改变Prescription
			changeOtherAttr(data,index,parentData) {
				var isSize = parentData.label.toLowerCase() == this.notAutoSelectSpuAttr;
				if (data.id !== this.id || !this.isSizeSelected) {
					this.swiperCurrent = 0
					this.id = data.id;
					this.getProductDetails({type:isSize?'size':'other',isSize});
					uni.showLoading()
				} else {
					if(isSize) {
						this.isSizeSelected = true
					}
				}
			},
			// 改变颜色
			changeColor(data,index) {
				if (data.id !== this.id || !this.isSizeSelected) {
					this.swiperCurrent = 0
					this.id = data.id;
					this.getProductDetails({type:'color'});
					uni.showLoading()
				}
			},
			setSwiperHeight() {
				let query = uni.createSelectorQuery().in(this);
				query.select('.shoppingCartPopup .swiper_box .slide-image').boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
					  this.swiperHeight = (res[0].width * 4 ) / 3;
					}
				});
			},
			// 获取产品详情
			getProductDetails(params) {
				const that = this;
				var queryData = {product_id: that.id,v:'1.0',isSizeSelected:(that.isSizeSelected || params.isSize)?1:2};
				if(that.goodsDetail.special_data) {
					queryData.is_special = that.goodsDetail.special_data.is_special
				}
				that.$apis.getProductDetail(queryData,{loading:false}).then(res =>{
					uni.hideLoading()
					let goodsDetail = res.data.product;
					const regexp = /[0-9]*/g;
					that.tier_price_format = []
					if(goodsDetail.tier_price && goodsDetail.tier_price.length) {
						goodsDetail.tier_price[0].map((item,index)=>{
							if(index > 0) {
								let priceArr = String(item).split(/[^0-9]/ig)
								let qtyFormat = index+1==goodsDetail.tier_price[0].length?priceArr.pop():priceArr[0];
								that.tier_price_format[index-1] = {qty:qtyFormat,price:goodsDetail.tier_price[1][index]}
							}
						})
					}
					that.goodsDetail = goodsDetail;
					that.formatData({...goodsDetail,product_share_content:res.data.product_share_content},params.type)
					that.judgingWholesalePrices(that.qtyValue)
					if(goodsDetail.options && goodsDetail.options.length) {
						goodsDetail.options.map((item,index) => {
							item.value.map((item_c,index_c) => {
								if(item_c.show_as_img && item_c.active == 'current') {
									that.currentColorObj = {key:item.label,value:item_c[item.label]}
								}
							})
						})
					}
					let price = "";
					if (goodsDetail.price_info.special_price) {
						price = goodsDetail.price_info.special_price.symbol+goodsDetail.price_info.special_price.value
					} else {
						price = goodsDetail.price_info.price.symbol+goodsDetail.price_info.price.value
					}
					that.headerData = {
						imgUrl:goodsDetail.basicInfo.pic,
						price:price,
						status: goodsDetail.stock && goodsDetail.qty>0
					}
					that.product_spu_sold_out = goodsDetail.product_spu_sold_out
					// 是否可以加入购物车
					that.isAddToShoppingCart = goodsDetail.can_sale;
					switch(params.type) {
						case 'show':
							// 显示弹窗
							that.$refs.popupCart.open('bottom');
							break;
						case 'size':
							that.$emit('changeOtherAttr', {...goodsDetail});
							break;
						case 'other':
							that.$emit('changeOtherAttr', {...goodsDetail});
							break;
						case 'color':
							that.$emit('changeColor', {...goodsDetail});
							break;
						default:
							break;
					}
					if(params.isSize) {
						this.isSizeSelected = true;
					}
					if(params.loginNavigateBackType == 'clickQuickViewShare') {
						if(this.shareData&&this.shareData.url) {
							this.$refs.popupShare.open('bottom');
						}
					}
					//动态设置swiper的高度
					this.$nextTick(() => {
					  this.setSwiperHeight();
					});
				}).catch(e=>{
					uni.hideLoading();
				})
			},
			// 批发价判断
			judgingWholesalePrices(newQty) {
				var _index;
				this.tier_price_format.map(function(currentValue,index){
					if (newQty >=currentValue.qty) {
						_index = index;
					}
				})
				if(_index || _index == 0) {
					this.tierActiveIndex = _index+1
				} else {
					this.tierActiveIndex = ''
				}
				this.$emit('changeTierPrice',this.tierActiveIndex)
			}
			
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';
.slod-out-tip{
	font-size: 28rpx;
	color: #666666;
	.di{
		margin-left: 8rpx;
		margin-right: 8rpx;
	}
	.img_box{
		width: 40rpx;
		height: 40rpx;
		margin: 5rpx 5rpx 0 0;
		float: left;
		.img{
			width: 40rpx;
			height: 40rpx;
		}
	}
}
.no_wrap{
	flex-wrap: nowrap;
}
.add_success_toast{
	position: fixed;
	flex-wrap: nowrap;
	z-index: 99;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background: #000000;
	opacity: 0.75;
	color: #fff;
	font-size: 31rpx;
	padding: 19.23rpx 30.77rpx;
	border-radius: 8rpx;
	transition: opacity linear 3s;
	.text{
		white-space: nowrap;
	}
	.img{
		width: 30.77rpx;
		height: 30.77rpx;
		margin-right: 5.77rpx;
	}
}
.add_success_toast_ani{
	opacity: 0;
}
.product_hot_tag{
    position: absolute;
    right: -6rpx;
    top: 0;
    width: 38rpx;
	height: 23rpx;
	background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
	border-radius: 12rpx 12rpx 12rpx 4rpx;
	font-family: 'Montserrat-SemiBold';
    font-weight: 600;
    font-size: 15rpx;
	color: #FFFFFF;
	line-height: 18rpx;
}

.fly-item {
	display: none;
	transition-timing-function: linear;
	opacity: 1;
	z-index: 99;
	position: absolute;
	transition: transform 0.8s;
	.img {
		position: absolute;
		width: 100%;
		height: 100%;
		transition: transform 0.8s;
		
		/* transition-timing-function: cubic-bezier(.55,0,.85,.36); */
		transition-timing-function: cubic-bezier(0.1, 0, 0.1, 1);
		opacity: 1;
		transition: opacity 0.8s;
	}
}
.fly_item_show{
	display: block;
	z-index: 99;
	opacity: 1;
	// animation: shrink 0.8s ease-in-out;
}
@keyframes shrink {
  0% {
    transition-timing-function: cubic-bezier(0.1, 0, 0.1, 1);
  }
  100% {
	transition-timing-function: cubic-bezier(0, 0, 0.5, 1);
  }
}

.swiper_box {
	width: 100%;
}

swiper-item image {
	width: 100%;
	display: inline-block;
	overflow: hidden;
	background: #fff;
}
.swiper_box {
	/deep/uni-image>div,.swiper_box  {
		/deep/uni-image>img  {
			background-size: contain !important;
			background-position: center;
		}
	}
} 

.swiper-container .dots {
	position: absolute;
	background: rgba(0,0,0,.2);
	right: 32rpx;
	bottom: 24rpx;
	display: flex;
	justify-content: center;
	padding: 0 18rpx;
	color: #222;
	border-radius: 30rpx;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 28rpx;
}
.big_img_color_wrapper{
	position: absolute;
	bottom: 3vh;
	left: 50%;
	transform: translateX(-50%);
	font-size:28rpx;
	color: #fff;
}
.big_img_price{
	position: absolute;
	bottom: 0;
	height: 60rpx;
	.goods-price.good_special{
		line-height: 60rpx;
		padding-left: 30rpx;
		color: #ff165e;
		font-weight: 700;
		font-size: 27px;
		display: inline-block;
	}
	.goods-originalPrice{
		display: inline-block;
		padding-left: 4px;
		font-size: 16px;
		color: #999999;
		text-decoration: line-through;
		line-height: 29px;
		font-weight: normal;
	}
	.p-discount-off{
		background-color: #FFE6EE;
		color: #8A61E7;
		font-size: 19.23rpx;
		padding: 2px 7.69rpx;
		line-height: 1;
		display: inline-block;
		margin-left: 4px;
	}
}
.scroll_con{
	width: 100rpx;
	// height: 100rpx;
}
.scroll_inner{
	// width: calc(100vw + 200rpx);
}
.transform_con{
	transform: translateX(calc(50vw - 50rpx));
}
.bottom_img_wrapper{
	position: absolute;
	bottom: 8vh;
	// let: 0;
	width: 100%;
	height: 72rpx;
	// background: #fff;
	::-webkit-scrollbar{
	display: none;
	width: 0!important;
	height: 0!important;
	-webkit-appearance: none;
	background: transparent;
}
}
.active_block_wrapper{
	width: 72rpx;
	height: 72rpx;
	border: 1px solid #fff;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	display: flex;
	flex-wrap: nowrap;
	z-index: 2;
	.active_block_inner {
		width: 100%;
		border: 2px solid #000;
		border-radius: 50%;
	}
}
.color_block_imgs{
	flex-wrap: nowrap;
	// width: 101vw;
	position: absolute;
	// justify-content: space-between;
	width: 100vw;
	height: 72rpx;
	// background-color: pink;
	left: 0;
	top: 50%;
	transform: translate(0,-50%);
	/deep/.uni-scroll-view-content{
		// display: flex;
		// justify-content: space-between;
	}
}
.color_block_image{
	width: 72rpx;
	height: 72rpx!important;
	border-radius: 50%;		
}
.big-image-view-btn {
	width: 82rpx;
	height: 82rpx;
	position: absolute;
	top: 45vh;
	.img {
		width: 100%;
	}
}
.big-image-view-btn.left{
	left: 0;
}
.big-image-view-btn.right {
	right: 0;
}
.shoppingCartPopup {
	.popup-content-template-box {
		padding-top: 12rpx;
		padding-bottom: 0;
		border-radius: 23rpx 23rpx 0 0;
		.main-content-box {
			padding-right: 0;
			max-height: 80vh;
		}
		.header-box {
			padding-bottom: 12rpx;
		}
	}
	
	.info-wrapper {
		padding-right: 32rpx;
	}
	
}

/* 购物车弹窗内容 start */
.popup-product-current-info {
	padding: 0 0 32rpx 0;
	.product-title {
		padding-top: 61.54rpx;
		font-size: 26.92rpx;
		font-weight: 500;
		color: #666666;
	}
	.thumbnail_img_swiper_box {
		width: calc(100% + 4px);
		margin-left: -2px;
	}
	::v-deep uni-swiper uni-swiper-item image {
		padding: 0 2px;
	}
	.p-discount-off {
		color: #8A61E7;
		border: 1px solid #8A61E7;
		font-size: 19.23rpx;
		border-radius: 6rpx;
		padding: 2px 7.69rpx;
		line-height: 1;
		margin-right: 16rpx;
	}
	.price-box {
		padding-top: 11.54rpx;
		.price {
			font-family: 'Montserrat-SemiBold';
			font-size: 38.46rpx;
			font-weight: 700;
			color: #000;
			padding-right: 16rpx;
		}
		.sp_price {
			// color: #ff165e;
			font-weight: 600;
			font-size: 38rpx;
			color: #8A61E7;
			line-height: 45rpx;
		}
		.special-activity-goods-price {
			font-size: 38.46rpx;
			font-weight: 700;
			color: #000;
			padding-right: 16rpx;
		}
		.originalPrice {
			display: inline-block;
			padding-right: 16rpx;
			font-size: 23.08rpx;
			color: #999999;
			/* text-decoration: line-through; */
		}
		.status {
			font-size: 26.92rpx;
			color: #999999;
		}
	}
}

.popup-product-add-btn.disabled {
	pointer-events: none;
	opacity: 0.4;
}
.popup-product-current-attr-box {
	margin-bottom: 24rpx;
	.label {
		font-size: 26.92rpx;
		padding-bottom: 20rpx;
		color:#000;
		font-weight: 500;
	}
	.attr-box::-webkit-scrollbar {
	    display: none;
	}
	.attr-box {
		padding-bottom: 30.77rpx;
		display: flex;
		flex-wrap: nowrap;
		overflow: auto;
		.color_box {
			margin-right: 26.92rpx;
		}
		.color-item {
			// margin:0 26.92rpx 0 0;
			// border-radius: 50%;
			// position: relative;
			// box-sizing: border-box;
			// display: inline-block;
			// padding: 0;
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			position: relative;
			border:1px solid #ccc;
			.has-discount {
				content: '';
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				right: -4rpx;
				top:  0rpx;
				background: #FF6ED3;
				border-radius: 50%;
			}
			.out-stock {
				position: absolute;
				top: 50%;
				bottom: 0;
				left: -2rpx;
				right: 0;
				content: '';
				width: calc(100% + 4rpx);
				height: 2rpx;
				transform: rotate(-45deg);
				background: #000;
			}
			.img_out_stock::before {
				position: absolute;
				content: '';
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(255, 255, 255, 0.55);
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.color-on {
			padding: 4rpx;
			border: 4rpx solid #393939;
		}
		.color-disabled {
			pointer-events: none;
			background: #e5e5e5;
			opacity: 0.3;
		}
		.other-item {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			margin-right: 23.08rpx;
			padding: 17.31rpx 23.08rpx 15.38rpx;
			height: 65rpx;
			border-radius: 46rpx;
			border: 2rpx solid #666;
			color: #393939;
			font-size: 26.92rpx;
		}
		.other-on {
			border: 2px solid #8A61E7;
			color: #8A61E7;
		}
		.other-disabled {
			pointer-events: none;
			background: #e5e5e5;
			opacity: 0.3;
		}
		.other-isOutStock {
			border: 1px solid #999999;
			font-size: 27rpx;
			color: #999999;
			line-height: 32rpx;
			text-decoration-line: line-through;
			text-transform: none;
		}
	}
	.size-box {
		.size {
			padding: 16rpx 24rpx;
			margin: 0 16rpx 16rpx 0;
			border: 1px solid #e5e5e5;
			font-size: 28rpx;
			color: #333333;
			line-height: 1;
			box-sizing: border-box;
			.on {
				background-color: #fe165e;
				color: #ffffff;
			}
			.disabled{
				pointer-events: none;
				background: #e5e5e5;
				opacity: 0.3;
			}
		}
	}
	.color-box {
		.color {
			padding: 1px;
			margin: 0 16rpx 16rpx 0;
			.on {
				border: 1px solid #ff165e;
			}
			image {
				width: 100rpx;
			}
			
		}
	}
	.qty-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 194rpx;
		height: 65rpx;
		border-radius: 46rpx;
		border: 2px solid #393939;
		.qty-input {
			height: 100%;
			text-align: center;
			font-size: 26.92rpx;
			width: 78.85rpx;
			color:#393939;
		}
		.iconfont {
			width: 34.62rpx;
			height: 34.62rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.icon-reduce.disabled {
			color: #999999;
			pointer-events: none;
		}
		.icon-add.disabled {
			color: #999999;
			pointer-events: none;
		}
	}
}

::v-deep {
	.shoppingCartPopup{
		.popup-content-template-box .main-content-box {
			max-height: 75vh;
		}
	}
}
/* 购物车弹窗内容 end */
.to-detail-box {
	font-family: "Montserrat-Regular";
	font-weight: 500;
	color: #0071E3;
	font-size: 26.92rpx;
	text-decoration-line: underline;
	text-transform: none;
}
.goods_detail_options-box {
	margin-bottom: 32rpx;
}
.footer {
	.popup-product-add-btn {
		width: 565rpx;
		height: 81rpx;
		background: #222222;
		border-radius: 40rpx;
		@include font-SemiBold($color: #fff)
	}
	.wish-box {
		display: flex;
		align-items: center;
		margin: 42.31rpx 38.46rpx 50rpx 32.69rpx;
		image {
			width: 60rpx;
		}
	}
}

.shopping-cart-popup-tier-price-box {
	margin-bottom: 32rpx;
	border-top: 1px #EBEEF5 solid;
}
::v-deep {
	.isBelongSpecialActivity.shoppingCartPopup {
		.popup-product-current-info{
			.price-box {
				.price {
					color:#8A61E7;
				}
			} 
			.p-discount-off{
				color: #8A61E7 ;
				border: 1px solid #8A61E7 ;
				padding: 2px 7.69rpx;
			}
		} 
	}
}
</style>