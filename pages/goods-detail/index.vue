<template>
	<view class="goods-detail-wrap" :class="goodsDetail.special_data && goodsDetail.special_data.is_spu_special == 1?'isBelongSpecialActivity':''" @click="handleClickShareDescTipOutside">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<view class="screen-share-tip" v-if="showShareTip">
			<text class="share-text">{{ $t('goods_detail.screen_share_tip')}}</text>
			<view class="share-box"><text class="share-btn" @click="handleShare()">{{ $t('goods_detail.screen_share')}}</text></view>
		</view>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<!-- 头部 -->
		<view class="goods-detail-header-box page-max-width" :class="scrollTop>5?'bg_white':''">
			<view class="flex justify-content-between goods-detail-header">
				<view class="flex justify-content-between align-items-center">
					<image class="icon" mode="widthFix" src="@/static/images/p_detail_left_arrow@2x.png" @click="goback()" />
				</view>
				<view class="flex justify-content-between align-items-center">
					<image class="icon icon-share1" mode="widthFix" src="@/static/images/p_detail_share_2@2x.png" @tap="showShareToast(1)"></image>
				</view>
			</view>
			<view @click.stop="" class="share-desc-tip-box" v-if="showShareDescTip">
				<view class="share-desc-tips">
					<image class="tip-icon" mode="widthFix" src="@/static/images/fission_sharing/fission_tips_icon.png"></image>
					<view class="text-box">
						<view class="text1">{{goodsDetail.index_copywriting}}</view>
						<view class="text2" v-html="goodsDetail.index_copywriting_reward"></view>
					</view>
					<image @click="showShareDescTip=false" class="close-icon" mode="widthFix" src="@/static/images/fission_sharing/close_icon.png"></image>
				</view>
				
			</view>
			<view v-if="showFloorTab" id="product-floor-tab" class="page-max-width">
				<view v-for="(item,index) of floorTabArr" :key="index" class="floor-tab__item font-bold" :class="floorTabActive == index?'floor-tab__item_active':''" @click="handleScrollTo(item)">
					<text class="floor-tab__item-name">
						{{$t(item.language)}}
					</text>
				</view>
			</view>
		</view>
		<view class="container">
			<!-- 轮播 -->
			<view class="swiper-container" v-if="!goodsDetail.videoId" @click="openShowImgDialog">
				<!-- <swiper :style="{ height: (swiperHeight == 0 ?480+'rpx':swiperHeight+'px')}" class="swiper_box" -->
				<!-- 3:4 -->
				<swiper :style="{ height: '1000rpx'}" class="swiper_box"
					:current="swiperCurrent" :autoplay="false" circular="true" :interval="interval" :duration="duration"
					:display-multiple-items="1"
					@change="swiperchange">
					<block v-for="(item, index) in goodsDetail.thumbnail_img" :key="index">
						<swiper-item>
							<image :id="'swiper-item-image' + index" :src="item.url" class="slide-image" :lazy-load="true"
								mode="widthFix" />
						</swiper-item>
					</block>
				</swiper>
				<view v-if="goodsDetail.thumbnail_img.length" class="dots">
					{{ swiperCurrent+1}}/{{goodsDetail.thumbnail_img.length}}
				</view>
			</view>
			<!-- 特价活动商品售卖进度(如果有裂变banner显示，优先裂变banner) -->
			<view class="special_activity_sale_progress-box" v-if="(!aicode || (aicode && is_have_order != 0))&&goodsDetail.special_data && goodsDetail.special_data.is_spu_special == 1&&goodsDetail.special_data.is_show == 1&&goodsDetail.can_sale">
				<view class="left-box">
					<image mode="widthFix" class="img1" src="@/static/images/lower_price/lower_price_flash_white@2x.png"></image>
					<view class="stock-progress-box">
						<view class="text">{{goodsDetail.special_data.spu_stock_text}}</view>
						<view class="bar-box">
							<view v-if="goodsDetail.special_data" class="bar-inner" :style="{width:goodsDetail.special_data.spu_stock_percent+'%'}"></view>
						</view>
					</view>
				</view>
				<view class="right-box">
					{{$store.state.site_name_upper}}
					<image mode="widthFix" class="img2" src="@/static/images/lower_price/lower_price_flash_white_1@2x.png"></image>
					{{$t('lower_price_active.ale')}}
				</view>
				
			</view>
			<!-- 裂变banner显示 -->
			<view class="detail-share-banner-box" v-if="aicode">
				<block v-if="!$store.getters.hasLogin || ($store.getters.hasLogin && is_have_order == 0)">
					<image class="detail-share-banner" mode="widthFix" src="@/static/images/detail/detail_share_banner.png"></image>
					<view class="text-box font-family-KronaOne">
						<view class="text">{{$t('fission_sharing.product_detail_fission_text')}}</view>
						<view v-if="!$store.getters.hasLogin" @click="$refs.fissionSharingTipsPopup.open()" class="fission-btn">{{$t('fission_sharing.product_detail_fission_btn')}}</view>
					</view>
				</block>
			</view>
			<!-- 商品信息 -->
			<view class="goods-info">
				<view class="goods-title">{{ goodsDetail.name }}</view>
				<view class="flex justify-content-between align-items-center">
					<view>
						<!-- 属于特价活动商品并且用户已购买过该件商品且已购数量大于等于限购数量【goodsDetail.special_qty_left==0】并且已选择size时  或者是特价商品并且无库存，恢复原价-->
						<view class="special-activity-goods-price goods-price" v-if="(goodsDetail.special_data&&goodsDetail.special_data.is_spu_special == 1&&goodsDetail.special_qty_left==0&&isSizeSelected) || (goodsDetail.special_data&&goodsDetail.special_data.is_spu_special== 1&&!goodsDetail.can_sale)">
							{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
						</view>
						<view v-else>
							<!-- 会员商品没有特价 -->
							<view class="flex align-items-center"
								v-if="goodsDetail.price_info.special_price && goodsDetail.price_info.special_price.value">
								<!-- 特价 -->
								<view class="goods-price sp_price">{{ goodsDetail.price_info.special_price.symbol }}{{ goodsDetail.price_info.special_price.value }}
								</view>
								<view v-if="goodsDetail.special_price_off" class="p-discount-off">-{{goodsDetail.special_price_off}}%</view>
								<view class="goods-originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
								</view>
							</view>
							<block v-else>
								<!-- 会员价格 -->
								<view v-if="goodsDetail.member_product && goodsDetail.isVip" :class="tierActiveIndex>0?'text-line-through':''" class="goods-price flex align-items-center">
									<text>{{ goodsDetail.member_price.symbol }}{{ goodsDetail.member_price.value }}</text>
									<text class="goods-originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</text>
								</view>
								<!-- 正常价格 -->
								<view v-else :class="tierActiveIndex>0?'goods-price text-line-through':'goods-price'">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
							</block>
						</view>
					</view>
					<view @click="$public.handleNavTo('/pages/goods-detail/reviews-list?id='+id+'&spu='+goodsDetail.spu)">
						<starRate :num="goodsDetail.reviw_rate_star_average">
							<text class="review-count flex align-items-center">({{goodsDetail.review_count}})</text>
							<view class="iconfont icon-goto"></view>
						</starRate>
					</view>
				</view>
				<!-- 用户是vip并且是会员产品 -->
				<view v-if="showVip && goodsDetail.member_price && goodsDetail.isVip" class="user-is-vip flex align-items-center">
					<view><text class="font-bold">-{{goodsDetail.discount_off}}</text>%</view>
					<view class="vip-line"></view>
					<view class="flex-1">{{$t('vip.exclusive_discounts', {site_name: $store.state.site_name_upper,discount_off:goodsDetail.discount_off})}}</view>
				</view>
				<!-- 用户当前不是vip并且是会员产品 新版样式-->
				<view v-if="showVip && goodsDetail.member_product && !goodsDetail.isVip" @click="$public.handleNavTo('/pages/vip/index')" class="reminder-buy-vip flex align-items-center">
					<view class="font-bold" style="color: #873c00;">{{goodsDetail.member_price.symbol}}{{goodsDetail.member_price.value}}</view>
					<view class="vip-tips flex-1" style="margin-left: 16rpx;padding-left:16rpx;border-left: 1px solid rgb(135 60 0 / 20%);">{{$t('vip.product_vip_tip',{site_name: $store.state.site_name_upper,discount_off:goodsDetail.discount_off})}}</view>
				</view>
			</view>
			<!-- 获取优惠券 -->
			<blockItemBox v-if="couponList.length" @click="$refs.popupCoupon.open('bottom')" :title="$t('goods_detail.get_coupon_discount')">
			</blockItemBox>
			<view class="options-and-qty-box">
				<!-- 选择属性 -->
				<block v-if="goodsDetail.options && goodsDetail.options.length">
					<view class="goodsDetail-option-box">
						<view class="product-page-current-attr-box" v-for="(item,index) in goodsDetail.options" :key="index">
							<view class="label font-bold">{{item.label}}: {{item.label == currentColorObj.key ?currentColorObj.value:''}}</view>
							<view class="attr-box flex">
								<template v-for="(item_child,index_child) in item.value" >
									<view :key="index_child" class="color-item" :class="item_child.active == 'current'?'on':item_child.active =='noactive'?'disabled':''" @click="changeColor(item_child,index_child)" v-if="item_child.show_as_img">
										<image :class="(!isSizeSelected && !item_child.color_variant_stock) || (!item_child.has_stock&&isSizeSelected)?'img_out_stock':''" :src="item_child.show_as_img" mode="aspectFill"></image>
										<view class="has-discount" v-if="item_child.has_discount&&!item_child.is_hot"></view>
										<!-- 如果未选中尺码，颜色的库存按颜色变体库存显示，如果选中尺码，颜色库存按sku显示 -->
										<view class="out-stock" v-if="(!isSizeSelected && !item_child.color_variant_stock) || (!item_child.has_stock&&isSizeSelected)"></view>
										<view v-if="item_child.is_hot" class="product_hot_tag flex align-items-center justify-content-center">{{$t('goods_detail.hot')}}</view>
									</view>
									<view :key="index_child" v-if="!item_child.show_as_img&&item_child.status==1" class="other-item" :class="judgeAttrSelect({item,item_child})" @click="changeOtherAttr(item_child,index_child,item)">
										{{item_child.attr_val}}
									</view>
								</template>
							</view>
						</view>
					</view>
				</block>
				<!-- 商品数量 -->
				<view class="product-qty-box">
					<view class="title font-bold">{{$t('goods_detail.qty')}}:</view>
					<view class="qty-box flex align-items-center">
						<view @click="handleNumReduce()" class="iconfont icon-reduce" :class="qtyValue>1?'':'_disabled'"></view>
						<input class="qty-input" step="1" type="number" @blur="qtyValueChange" v-model="qtyValue" />
						<view @click="handleNumAdd()" class="iconfont icon-add"></view>
					</view>
				</view>
				<view class="slod-out-tip flex no_wrap align-items-start" v-show="goodsDetail.special_data && goodsDetail.special_data.is_special == '0' && goodsDetail.special_data.is_spu_special == '1'">
					<view class="img_box">
					<image class="img" src="@/static/images/black_tip.png" mode="widthFix" />
					</view>
					<view class="">
					{{ $t('goods_detail.sizefor') }}<text class="di" style="color: #FF5C00;">{{ $t('goods_detail.sale',{site_name: $store.state.site_name_upper}) }}</text>{{ $t('goods_detail.torestore') }}
					</view>				
				</view>
			</view>
			<!-- 批发价 -->
			<view v-if="goodsDetail.tier_price.length" class="p-detail-tier-prices-box">
				<tier-price :tier_price="goodsDetail.tier_price" :activeIndex="tierActiveIndex"></tier-price>
			</view>
			<view class="info-list-box">
				<!-- 描述 -->
				<blockItemBox @click="$public.handleNavTo(judgeToDetailUrl());maClickInfo('description')"
					:title="$t('goods_detail.description')">
				</blockItemBox>
				<!-- 材料 -->
				<blockItemBox @click="$public.handleNavTo('/pages/goods-detail/materials?id='+id);maClickInfo('materials')" v-if="goodsDetail.material_composition['Composition'] || goodsDetail.material_composition['Material']" :title="$t('goods_detail.materials')">
				</blockItemBox>
				<!-- 物流信息 -->
				<blockItemBox @click="$public.handleNavTo('/pages/goods-detail/shipping-return');maClickInfo('shipping&returns')"
					:title="$t('goods_detail.shipping_returns')">
				</blockItemBox>
				<!-- 购物安全 -->
				<blockItemBox @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-shopping-security');maClickInfo('shoppingSecurity')"
					:title="$t('goods_detail.shopping_security')">	
				</blockItemBox>
				<!-- size guide -->
				<blockItemBox @click="$public.handleNavTo('/pages/goods-detail/sizeguide?id='+id);maClickInfo('sizeGuide')"
					:title="$t('goods_detail.size_guide')">
				</blockItemBox>
			</view>
			<!-- reviews -->
			<view class="reviews-box">
				<view class="review-header flex justify-content-between align-items-center">
					<view class="reviews-title">{{$t("goods_detail.reviews")}}</view>
					<view @click="$public.handleNavTo('/pages/goods-detail/reviews-list?id='+id+'&spu='+goodsDetail.spu)" class="view-all-box flex align-items-center">
						<view>{{$t("goods_detail.view_all")}}</view>
						<view class="iconfont icon-goto"></view>
					</view>
				</view>
				<reviewsBar :reviewsData="goodsDetail"></reviewsBar>
				<view class="reviews-list-box">
					<block v-for="(item,index) in goodsDetail.productReview.coll" :key="index">
						<reviewListItem :scrollTop="scrollTop" :shareData="shareData" :reviewData="formatReviewItem(item)" @changeHelpful="(data)=>{changeHelpful(data,item)}"></reviewListItem>
					</block>
				</view>
			</view>

			<view class="recommend-box">
				<!-- 推荐 -->
				<view v-if="recommendSideList.length" class="recommend-container siimilar_products">
					<recommendHeader :title="$t('recommend.header4')" :num="recommendSideList.length"></recommendHeader>
					<recommendGoodsList module_name="product_details_sp" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="recommendSideList" :scrollTop="scrollTop"></recommendGoodsList>
				</view>
				<!-- 红人图 -->
				<view class="recommend-container" v-if="goodsDetail.red_person_image && goodsDetail.red_person_image.length">
					<recommendHeader :title="$t('goods_detail.style_gallery')" :num="goodsDetail.red_person_image.length"></recommendHeader>
					<view class="red_person_img_box">
						<scroll-view :show-scrollbar="false" :scroll-x="true">
							<view class="red-box">
								<view class="image-box" v-for="(item,index) in goodsDetail.red_person_image" :key="index">
									<image :src="item" class="image" mode="aspectFill" :lazy-load="true" />
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!-- 推荐 -->
				<view v-if="recommendList.length" class="goods-container">
					<recommendHeader :title="$t('recommend.header3')"></recommendHeader>
					<good-list module_name="product_details_cav" ref="goods_list" @popupChange="(value)=>{pageMetaShow=value}" :goods="recommendList"></good-list>
				</view>
			</view>
			<!-- footer -->
			<view class="footer-box page-max-width flex justify-content-between align-items-center">
				<view @click="isLoading?'':handleClickAddToCart()" :class="!isAddToShoppingCart?'_disabled':''" class="add-to-bag-btn flex flex-column align-items-center justify-content-center font-bold">
					<view>
					{{isLoading?'': $t("goods_detail.add_to_bag")}}
					</view>
					<view v-if="!isViewPrice&&goodsDetail.can_sale" class="flex footer-price">
						<!-- 属于特价活动商品并且用户已购买过该件商品且已购数量大于等于限购数量【goodsDetail.special_qty_left==0】并且已选择size时 或者无库存，恢复原价-->
						<view class="special-activity-goods-price goods-price" v-if="(goodsDetail.special_data&&goodsDetail.special_data.is_spu_special == 1&&goodsDetail.special_qty_left==0&&isSizeSelected) || (goodsDetail.special_data&&goodsDetail.special_data.is_spu_special== 1&&!goodsDetail.can_sale)">
							{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
						</view>
						<block
							v-else-if="goodsDetail.price_info.special_price && goodsDetail.price_info.special_price.value">
							<view class="goods-price f_sp_price">{{ goodsDetail.price_info.special_price.symbol }}{{ goodsDetail.price_info.special_price.value }}
							</view>
							<view class="goods-originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
							</view>
						</block>
						<block v-else>
							<view v-if="goodsDetail.member_product && goodsDetail.isVip" :class="tierActiveIndex>0?'text-line-through':''" class="goods-price flex align-items-center">
								<!-- <image class="vip-tag-img" src="@/static/images/vip/vip_icon.png"/> -->
								{{ goodsDetail.member_price.symbol }}{{ goodsDetail.member_price.value }}
								<text class="goods-originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</text>
							</view>
							<view v-else :class="tierActiveIndex>0?'goods-price text-line-through':'goods-price'">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
						</block>
					</view>
				</view>
				<view @click="isLoading?'':changeFav()" class="footer-wish-box">
					<image v-if="favicon" src="@/static/images/p_detail_collect_sel@2x.png" mode="widthFix" />
					<image v-else src="@/static/images/p_detail_collect@2x.png" mode="widthFix" />
				</view>
			</view>
		</view>
		<!-- 更多弹窗 -->
		<uni-popup ref="popupMore" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<popupContentTemplate @close="$refs.popupMore.close()">
				<template v-slot:content>
					<view class="more-content-box">
						<block v-for="(item,index) in moreList" :key="index">
							<view class="more-item"
								@click="handleMoreItem(item)">
								<view class="iconfont" :class="item.icon"></view>
								<view class="white-space-nowrap">{{$t(item.language)}}</view>
							</view>
						</block>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>

		<!-- 获取优惠券弹窗 -->
		<uni-popup ref="popupCoupon" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<popupContentTemplate :title="$t('goods_detail.discount_coupon')" @close="$refs.popupCoupon.close()">
				<template v-slot:content>
					<view class="coupon-list-box">
						<block v-for="(item,index) in couponList" :key="index">
							<couponItem :couponItemData="item" position='product' @change="getProductCoupons()"></couponItem>
						</block>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 购物车弹窗 -->
		<shoppingCartPopup
			@popupChange="(value)=>{pageMetaShow=value}"
			ref="shoppingCartPopup"
			@changeOtherAttr="handleChangeOtherAttr"
			@changeSize="isSizeSelected = true"
			@changeColor="handleChangeColor"
			@changeTierPrice="(value)=>{tierActiveIndex = value}"
			@addToBag="addToBagSuccess()"
			@qtyValueChange="(value)=>{qtyValue=value}"
			@changeFav="changeFavCallback"
			:showFloorTab="showFloorTab"
			:add_cart_type="'view'"
		>
		</shoppingCartPopup>
		<!-- 查看大图弹窗 -->
		<uni-popup ref="popupBigImg" class="big-img-popup product-detail" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content">
		<view v-show="showColorBlocks&&imgDialogVisible" class="big-image-swiper-dialog page-max-width"  @click="closeImgDialog">
			<swiper duration=0 :style="{ height: '75vh'}" class="swiper_box"
				:current="bigSwiperCurrent" :disable-programmatic-animation="true" :autoplay="false" circular="true" :interval="interval" :duration="duration"
				@change="dialogSwiperChange">
				<block v-for="(item, index) in allColorThumbnailImgs" :key="index">
					<swiper-item class="flex align-items-center">
						<movable-area style="width:100%;height:100%;">
							<movable-view scale-min="1" scale-max="5" scale="true" class="max movable_box_class flex align-items-start" direction="all" style="width:100%;height:100%;">
								<image :id="'swiper-item-image' + index" :src="item.url" style="height: 100%;background:#000;" class="slide-image" :lazy-load="true"
								mode="aspectFit" />
							</movable-view>
						</movable-area>
					</swiper-item>
				</block>
			</swiper>
			<view class="big-image-view-btn left" @click.stop="bigSwiperCurrent==0?bigSwiperCurrent=allColorThumbnailImgs.length-1:bigSwiperCurrent--">
				<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-left@2x.png"></image>
			</view>
			<view class="big-image-view-btn right" @click.stop="bigSwiperCurrent==allColorThumbnailImgs.length-1?bigSwiperCurrent=0:bigSwiperCurrent++">
				<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-right@2x.png"></image>
			</view>
			<view v-if="allColorThumbnailImgs.length" class="dots big_img_dots">
				{{ fakeSwiperCurrent }} / {{ nowColorImgs.length }}
			</view>
			<view class="big_img_color_wrapper" style="text-align:center">
				<view class="big_img_color">{{$t('goods_detail.color')}}: {{ currentColorBlockIDetail.attr_val }}</view>
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
			<!-- <view class="big_img_price">
				<block
					v-if="goodsDetail.price_info.special_price && goodsDetail.price_info.special_price.value">
					<view class="goods-price good_special">{{ goodsDetail.price_info.special_price.symbol }}{{ goodsDetail.price_info.special_price.value }}
					</view>
					<view class="goods-originalPrice">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}
					</view>
				</block>
				<block v-else>
					<view :class="tierActiveIndex>0?'text-line-through':''" v-if="goodsDetail.member_product && goodsDetail.isVip" class="goods-price">{{ goodsDetail.member_price.symbol }}{{ goodsDetail.member_price.value }}</view>
					<view v-else :class="tierActiveIndex>0?'goods-price text-line-through':'goods-price'">{{ goodsDetail.price_info.price.symbol }}{{ goodsDetail.price_info.price.value }}</view>
				</block>
				<view v-if="goodsDetail.special_price_off" class="p-discount-off">-{{goodsDetail.special_price_off}}%</view>
			</view> -->

			<image class="close-img" src="@/static/images/p_detail_left_arrow_white@2x.png" />
			<image class="share" @click.stop="showShareToast(2)" src="@/static/images/p_detail_share_2_white@2x.png" />
		</view>

		<!-- 无label:Color属性时查看大图弹窗 -->
		<view v-show="!showColorBlocks&&imgDialogVisible" class="big-image-swiper-dialog page-max-width"  @click="closeImgDialogNoBlock">
			<swiper :style="{ height: 'calc(100vh - 256rpx)'}" class="swiper_box"
				:current="swiperCurrent" :autoplay="false" circular="true" :interval="interval" :duration="duration"
				@change="swiperchange">
				<block v-for="(item, index) in goodsDetail.thumbnail_img" :key="index">
					<swiper-item class="flex align-items-start">
						<movable-area style="width:100%;height:100%;">
							<movable-view scale-min="1" scale-max="5" scale="true" class="max movable_box_class flex align-items-start" direction="all" style="width:100%;height:100%;">
								<image :id="'swiper-item-image' + index" :src="item.url" class="slide-image" :lazy-load="true"
								mode="widthFix" />
							</movable-view>
						</movable-area>
					</swiper-item>
				</block>
			</swiper>
			<view class="big-image-view-btn left" @click.stop="swiperCurrent==0?swiperCurrent=goodsDetail.thumbnail_img.length-1:swiperCurrent--">
				<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-left@2x.png"></image>
			</view>
			<view class="big-image-view-btn right" @click.stop="swiperCurrent==goodsDetail.thumbnail_img.length-1?swiperCurrent=0:swiperCurrent++">
				<image class="img" mode="widthFix" src="@/static/images/p_detail_light-gray-arrow-right@2x.png"></image>
			</view>
			<view v-if="goodsDetail.thumbnail_img.length" class="dots big_img_dots">
				{{ swiperCurrent+1 }} / {{ goodsDetail.thumbnail_img.length }}
			</view>
			<i class="iconfont icon-close light"></i>
		</view>
		</view>
		</uni-popup>
		<!-- 产品描述弹窗 -->
		<uni-popup ref="popupDesc" background-color="#fff" class="p-desc-popup" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content dui-padding-top-header">
				<pageHeader :styleType="2" :isTitleUppercase="true" :backSelf="{type:'emit'}" :title="$t('goods_detail.description')" @handleClick="$refs.popupDesc.close();currentOpenPop='';"></pageHeader>
				<view class="goods-detail-descript-box">
					<view class="product-params">
						<block v-for="(value,key) of goodsDetail.groupAttrArr" :key="key">
							<view class="param-item flex">
								<view class="key">{{key}}:</view>
								<view class="value">{{value}}</view>
							</view>
						</block>
						<view class="param-item flex">
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
		</uni-popup>
		<!-- material弹窗 -->
		<uni-popup ref="popupMeterial" background-color="#fff" class="p-desc-popup" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content dui-padding-top-header">
				<pageHeader :isTitleUppercase="true" :styleType="2" :backSelf="{type:'emit'}" :title="$t('goods_detail.materials')" @handleClick="$refs.popupMeterial.close();currentOpenPop='';"></pageHeader>
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
		</uni-popup>
		<!-- 物流信息弹窗 -->
		<uni-popup ref="popupShippingReturn" background-color="#fff" class="p-desc-popup" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content dui-padding-top-header">
				<pageHeader :styleType="2" :isTitleUppercase="true" :backSelf="{type:'emit'}" :title="$t('goods_detail.shipping_returns')" @handleClick="$refs.popupShippingReturn.close();currentOpenPop='';"></pageHeader>
				<view class="shipping-return-box">
					<view class="title">{{$t('goods_detail.shipping')}}</view>
					<view class="content">
						{{$t('goods_detail.shipping_content')}}
					</view>
					<view class="go-to text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-shipping-methods')">{{$t('goods_detail.see_shipping_btn')}}</view>

					<view class="title">{{$t('goods_detail.returns')}}</view>
					<view class="content">
						{{$t('goods_detail.returns_content', {email: $store.state.appConfig.service_email})}}
					</view>
					<view class="go-to text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-return-policy')">{{$t('goods_detail.see_returns_btn')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 购物安全弹窗 -->
		<uni-popup ref="popupShoppingSecurity" background-color="#fff" class="p-desc-popup" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content dui-padding-top-header">
				<pageHeader :styleType="2" :isTitleUppercase="true" :backSelf="{type:'emit'}" :title="$t('goods_detail.shopping_security')" @handleClick="$refs.popupShoppingSecurity.close();currentOpenPop='';"></pageHeader>
				<view class="security-box">
					<view class="item-box">
						<view class="title font-bold">{{$t('goods_detail.safe_payments.title')}}</view>
						<view class="desc">{{$t('goods_detail.safe_payments.desc', {site_name: $store.state.site_name_upper})}}</view>
						<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-safePayments')">{{$t('goods_detail.learn_more')}}></view>
						<view class="content-box">
							<view class="little-title">{{$t('goods_detail.safe_payments.payment_method')}}</view>
							<view class="image-box">
								<image mode="heightFix" src="@/static/images/pay_logo/paypal.png" />
								<image mode="heightFix" src="@/static/images/pay_logo/visa.png" />
								<image mode="heightFix" src="@/static/images/pay_logo/mastercard.png" />
								<image mode="heightFix" src="@/static/images/pay_logo/american_express.png" />
								<image mode="heightFix" src="@/static/images/pay_logo/diners_club.png" />
								<image mode="heightFix" src="@/static/images/pay_logo/discover.png" />
							</view>
							<view class="little-title">{{$t('goods_detail.safe_payments.security_certification')}}</view>
							<view class="image-box">
								<image mode="heightFix" src="@/static/images/security_pay_icon/mastercard_securecode.png" />
								<image mode="heightFix" src="@/static/images/security_pay_icon/verified_visa.png" />
							</view>
						</view>
					</view>

					<view class="item-box">
						<view class="title font-bold">{{$t('goods_detail.secure_logisitics.title')}}</view>
						<view class="little-title">{{$t('goods_detail.secure_logisitics.little_title1')}}</view>
						<view class="desc">{{$t('goods_detail.secure_logisitics.desc1')}}</view>
						<view class="learn_more" @click="$public.handleNavTo('/pages/order/order-list')">{{$t('goods_detail.learn_more')}}</view>

						<view class="little-title">{{$t('goods_detail.secure_logisitics.little_title2')}}</view>
						<view class="desc">{{$t('goods_detail.secure_logisitics.desc2')}}</view>
						<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-packageSafety')">{{$t('goods_detail.learn_more')}}</view>
					</view>

					<view class="item-box">
						<view class="title font-bold">{{$t('goods_detail.customer_service.title')}}</view>
						<view class="service-icon-box">
							<view class="item">
								<image src="@/static/images/p_detail_icon_question@2x.png" />
								<view>{{$t('goods_detail.customer_service.qusetion')}}</view>
							</view>
							<view class="item">
								<image src="@/static/images/p_detail_icon_email@2x.png" />
								<view>{{$t('goods_detail.customer_service.ticker')}}</view>
							</view>
							<view class="item">
								<image src="@/static/images/p_detail_icon_chat@2x.png" />
								<view>{{$t('goods_detail.customer_service.chat')}}</view>
							</view>
						</view>
						<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-product-detail-shopping-security-contactUs')">{{$t('goods_detail.customer_service.contact_us')}}</view>
					</view>

					<view class="item-box">
						<view class="title font-bold">{{$t('goods_detail.privacy_protection.title')}}</view>
						<view class="desc">{{$t('goods_detail.privacy_protection.desc', {site_name: $store.state.site_name_upper})}}</view>
						<view class="learn_more" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-policy')">{{$t('goods_detail.learn_more')}}</view>
					</view>

				</view>
			</view>
		</uni-popup>
		<!-- 裂变提示弹窗 -->
		<fissionSharingTipsPopup navToUrl="/pages/login/index?is_special=3&in_site_source=cashgrab_register_window" :tipsData="goodsDetail.index_copywriting_tips?goodsDetail.index_copywriting_tips:[]" ref="fissionSharingTipsPopup"></fissionSharingTipsPopup>
		<!-- 分享弹窗 -->
		<sharePopup key_prefix="product_share_" @clickBarItem="(type)=>{handleClickBarItem(type)}" ref="popupShare" :isDifferPlatformWord="true" :shareData="shareData" :title="$t('fission_sharing.share_popup_title')" @changePageMeta="(show)=>{pageMetaShow = show}"></sharePopup>
		
		<custom-tabbar realPageName="goodsDetails"></custom-tabbar>
		<getCoupon moduleName="product_details" ref="getCouponRef" @closeNewcomerCoupon="closeNewcomerCoupon()" @notOpenNewcomerCoupon="notOpenNewcomerCoupon()" :returnUrl="'/pages/goods-detail/index?id=' + id"></getCoupon>
		
		<customTooltip ref="tooltip" :title="$t('fission_sharing.share_success_text')"></customTooltip>
	</view>
</template>

<script>
	import blockItemBox from '@/pages/goods-detail/components/blockItemBox.vue'
	import starRate from '@/components/star-rate/star-rate.vue'
	import reviewListItem from '@/components/reviewListItem/reviewListItem.vue'
	import popupContentTemplate from '@/components/popupContentTemplate/popupContentTemplate.vue'
	import shareBar from '@/components/shareBar/shareBar.vue'
	import couponItem from '@/components/couponItem/couponItem.vue'
	import reviewsBar from '@/pages/goods-detail/components/reviewsBar.vue'
	import shoppingCartPopup from '@/components/shoppingCartPopup/shoppingCartPopup.vue'
	import { mapState } from 'vuex'
	import recommendHeader from '@/components/recommend-header/recommend-header.vue'
	import recommendGoodsList from '@/components/recommend-goods-list/recommend-goods-list.vue'
	import getCoupon from "@/components/get-coupon/get-coupon.vue";
	import fissionSharingTipsPopup from '@/components/fissionSharingTipsPopup/fissionSharingTipsPopup.vue';
	import sharePopup from '@/components/sharePopup/sharePopup.vue';
	import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
	export default {
		components: {
			blockItemBox,
			starRate,
			reviewListItem,
			popupContentTemplate,
			shareBar,
			couponItem,
			reviewsBar,
			shoppingCartPopup,
			recommendHeader,
			recommendGoodsList,
			getCoupon,
			fissionSharingTipsPopup,
			sharePopup,
			customTooltip
		},
		computed: {
			...mapState(['cartCount','showVip','aicode','isViewFissionPage','isShowedDetailFloatTip'])
		},
		data() {
			return {
				showShareDescTip:false, // 显示裂变分享浮层提示
				isSizeSelected:false, // 是否默认选中size，false不选中，true选中
				pageMetaShow:false,
				changeBigSwiperFrom:'',
				colorBlockLengthArr:[],
				currentColorBlockIDetail:{},
				qtyValue:1,
				wHeight:0,
				headerHeight:0,
				imgListHeight:0,
				reviewOffsetTop:0,
				recommendOffsetTop:0,
				floorTabActive:0,
				floorTabArr:[
					{
						language:'goods_detail.goods',
						targetClass:'',
						maValue:'goods'
					},
					{
						language:'goods_detail.reviews',
						targetClass:'.reviews-box',
						maValue:'reviews'
					},
					{
						language:'goods_detail.recommend',
						targetClass:'.recommend-box',
						maValue:'recommend'
					}
				],
				showFloorTab:false,
				big_img_price: {},
				isViewPrice:true,
				scrollTop:0,
				blockScrollLeft: 0,
				oldScroll: {
					blockScrollLeft: 0,
				},
				recommendSideList: [], // 挂边推荐列表
				recommendList: [], // 推荐列表
				couponList: [], // 优惠券列表
				moreList: [{
					name: "Home",
					icon: 'icon-home',
					path: '/pages/index/index',
					type: 'tabbar',
					language: "goods_detail.home"
				}, {
					name: "Wish list",
					icon: "icon-wish",
					path: '/pages/fav-list/fav-list',
					language: "goods_detail.wish_list"
				}, {
					name: 'Account',
					icon: 'icon-account',
					path: '/pages/my/my',
					type: 'tabbar',
					language: "goods_detail.account"
				}],
				showMore: false,
				autoplay: true,
				interval: 10000,
				duration: 500,
				swiperCurrent: 0,
				bigSwiperCurrent: 1,
				swiperHeight: 0,
				allColorThumbnailImgs: [],
				colorBlockImgs: [],
				nowColorImgs: [],
				fakeSwiperCurrent: 1,
				goodsDetail: {
					spuAttrIsShowAsImgArr: [],
					image_detail: [],
					thumbnail_img: [],
					thumbnail_ori_img: [],

					basicInfo: {
						videoId: '',
						numberOrders: ''
					},

					name: '',

					price_info: {
						special_price: {
							value: '',
							symbol: ''
						},

						price: {
							symbol: '',
							value: ''
						}
					},

					groupAttrArr: [],
					material_composition:{},
					description: "",

					productReview: {
						coll: ''
					},
					options: [],
					tier_price: [], // 批发价
					sku: "",
					isVip: false, // 是否vip
					member_product: false, // 是否会员产品
					discount_off: '', // 会员折扣
					member_price: '', // 会员价格
					special_qty_left:1,// 0表示用户已购买过该件商品且已购数量大于等于限购数量；非0表示有库存并且未购买过
				},
				selectSize: '',
				favicon: false ,// 是否收藏 true 已收藏 false 未收藏
				id:'',
				imgDialogVisible: false,//是否显示图片放大器
				tier_price_format: [],// 批发价格式化
				tierActiveIndex: '',//当前批发价index
				shareData:{},
				isLoading: true,
				showBacktopBtn: false,
				showShareTip: false,
				colorBlockWidth: 55,
				colorBlockHeight: 55,
				showColorBlocks: true,
				currentColorObj: {
					key:'',
					value: ''
				},
				currentOpenPop:'',
				staticBlock:{},
				shareBannerData: {}, // 裂变分享图片地址
				shareBannerDataCopy: {}, //裂变分享数据（保存下来的）
				isAddToShoppingCart:true,// 是否可以加入购物车
				product_spu_sold_out: false,// 是否下架
				is_have_order:1, // 用户是否下过单 0 没下过单 1下过单
				isFromH5FissionLinkOpen:false, // 是否通过其他用户分享的h5商详页链接唤起app进入对应的商详页
				timer:'',
				isShared:false, // 是否点击了分享
				isShowedSpecialTOriginalTip:false, // 是否展示过特价恢复原价的提示
				rec_code: '',
				rec_engine: '',
				ab_key: '',
				module: 'product_details',
				isLoaded: false
			};
		},
		onHide() {
			this.handleClearTimeout();
			this.showShareDescTip = false;
		},
		destroyed() {
			this.handleClearTimeout()
		},
		onLoad: function(e) {
			var that = this; // 语言
			this.rec_code = e.rec_code || '';
			this.rec_engine = e.rec_engine || '';
			this.un_rec = e.un_rec || '';
			this.ab_key = e.ab_key || '';
			if(e.module){
				this.module = e.module;
			}
			if(e.goods_location){
				this.goods_location = e.goods_location;
			}
			that.id = e.id;
			this.getShareBanner();
			this.isFromH5FissionLinkOpen = !!e.aicode;
			this.loginBack =  e.loginback || false;
			//是否点击收藏登录
			if(this.loginBack && uni.getStorageSync('changeFav') == '1'){
				this.loginBackFav = true;
			}
			//是否点赞
			if(this.loginBack && uni.getStorageSync('changeReviewHelpful')){
				this.loginBackHelpful = true;
			}
			const scrollTop = uni.getStorageSync('page_scroll_top')
			if(scrollTop > 0){
				setTimeout(() => {
					uni.pageScrollTo({
						duration: 300, // 滚动动画过渡时间
						scrollTop, // 滚动的值
					})
				}, 2000);
				uni.removeStorageSync('page_scroll_top')

			}
			uni.removeStorageSync('changeFav');
			// 获取购物车数据
			that.getProductDetails({type:'first'});
			that.refreshViewRecords()
			// 获取购物安全静态块内容
			that.getStatickBlock();
			// 临时隐藏优惠券领取入口
			// 获取优惠券
			// that.getProductCoupons();
			uni.getSystemInfo({
				success: function (res) {
					that.wHeight = res.windowHeight
				}
			});
			// #ifdef APP-PLUS
			try{
				uni.onUserCaptureScreen(() => {
				    this.showShareTip = true;
					setTimeout(() => {
						this.showShareTip = false;
					}, 3000)
				});
			} catch(e){
				
			}
			// #endif
			this.hasLogin = this.$store.getters.hasLogin;
			this.$maEvent.visit_event({
				event_category: 'product_details',
				event_action: 'product_details_visit',
				event_name: 'product_details_visit'
			})
		},
		onShow() {
			setTimeout(()=> {
				// 通过裂变链接进入商详页不弹优惠券方法
				if(this.isFromH5FissionLinkOpen) {
					// 如果是通过其他用户分享的h5商详页链接唤起app进入对应的商详页并且没有登录，自动弹出裂变分享提示弹窗,走浮层显示逻辑 如果是出现 记录出现但不显示
					if(this.$store.getters.hasLogin) {
						this.handleFloatTipShowLogic();
					} else {
						this.$refs.fissionSharingTipsPopup.open('bottom');
						this.handleFloatTipShowLogic('not_show');
					}
				} else {
					if(this.isShared) {
						this.$refs.popupShare.close();
						this.$refs.tooltip.open({time:2000});
						this.isShared = false;
						this.handleFloatTipShowLogic('not_show');
					} else {
						this.$refs.getCouponRef.getNewcomerCouponList();
					}
				}
				if(this.$store.getters.hasLogin) {
					this.$refs.fissionSharingTipsPopup.close();
				}
				// 是否点击分享登录
				if(this.loginBack && uni.getStorageSync('clickShare') == '1') {
					this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', true);
					if(this.shareData&&this.shareData.url) {
						this.$refs.popupShare.open('bottom')
					}
				}
				uni.removeStorageSync('clickShare');
			})
			if(this.isLoaded && this.hasLogin != this.$store.getters.hasLogin){
				// 获取购物车数据
				this.getProductDetails({type:'first'});
			}
		},
		onResize(){
			this.getColorBlockWidth()
		},
		methods: {
			handleShare() {
				if(this.shareData&&this.shareData.url) {
					this.$refs.popupShare.open('bottom')
				}
			},
			// 减号
			handleNumReduce() {
				this.qtyValue--;
				this.judgingWholesalePrices(this.qtyValue);
			},
			// 加号
			handleNumAdd() {
				this.qtyValue++;
				this.judgingWholesalePrices(this.qtyValue)
				if(!this.isShowedSpecialTOriginalTip && this.isSizeSelected && this.qtyValue>this.goodsDetail.special_qty_left&&this.goodsDetail.special_qty_left!=0&& this.goodsDetail.special_data&& this.goodsDetail.special_data.is_spu_special == 1&&this.goodsDetail.can_sale) {
					this.showedSpecialTOriginalTip()
				}
			},
			goback() {
				if(this.loginBack) {
					uni.navigateBack({
						delta: 2,
						fail(e) {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					});
				} else {
					this.$public.handleGoBack()
				}
			},
			// 没有打开新人券弹窗
			notOpenNewcomerCoupon() {
				this.handleFloatTipShowLogic();
			},
			closeNewcomerCoupon() {
				// 加setTimeout是为了防止比handleClickShareDescTipOutside()这个提前执行
				setTimeout(()=>{
					this.handleFloatTipShowLogic();
				},300)
			},
			handleClickBarItem(type) {
				if(type != 'more') {
					this.isShared = true
				}
			},
			handleStarTimeout(type) {
				this.timer = setTimeout(()=>{
					if(type != 'not_show') {
						this.showShareDescTip = true;
					}
					this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', true);
				},15000)
			},
			handleClearTimeout() {
				clearTimeout(this.timer);
			},
			handleClickShareDescTipOutside(event) {
				// 取消点击其他地方浮层消失逻辑
				return;
				this.showShareDescTip = false;
			},
			judgeToDetailUrl() {
				var url = '/pages/goods-detail/detail?id='+this.id;
				if(!this.isSizeSelected) {
					url = '/pages/goods-detail/detail?id='+this.id+'&type=1';
				}
				return url;
			},
			async handleClickAddToCart() {
				const that = this
				// 获取到点击当前商品的大图
				const copyImgUrl = that.goodsDetail.thumbnail_img[0]['url']
				let currentImgEle = ''
				try{
					let elemClientRect = await this.getElemClientRect('.swiper-container');
					if(elemClientRect){
						currentImgEle = elemClientRect;
					}
				} catch(e){
					
				}
				const currentImgobj = {
					copyImgUrl,
					currentImgEle
				}
				uni.setStorage({
					key: 'animation_product_detail',//详情页当前主商品（非推荐等）
					data: '1',
					success: (result) => {},
					fail: (error) => {}
				})

				if(this.isSizeSelected) {
					let req = {qty: this.qtyValue,product_id:this.id};
					if(this.rec_code){
						req.rec_code = this.rec_code;
					}
					if(this.rec_engine){
						req.rec_engine = this.rec_engine;
					}
					if(this.module){
						req.module = this.module;
					}
					if(this.ab_key){
						req.ab_key = this.ab_key;
					}
					this.$apis.addShopCar(req).then(res => {
						uni.hideLoading();
						this.addToBagSuccess();
						this.$store.commit('SET_CART_COUNT', res.data.items_count)
						let track_data = {...this.goodsDetail};
						if(this.rec_code){
							track_data.rec_code = this.rec_code;
						}
						if(this.rec_engine){
							track_data.rec_engine = this.rec_engine;
						}
						if(this.module){
							track_data.module = this.module;
						}
						if(this.ab_key){
							track_data.ab_key = this.ab_key;
						}
						track_data.event_data = {
							num: this.qtyValue,
							add_cart_type: 'view'
						}
						this.$trackEvent.add_to_cart(track_data, this.qtyValue);
						that.$refs['shoppingCartPopup'].currentImgobj = currentImgobj
						// that.$refs['shoppingCartPopup'].animationProductId = true						
						that.$refs['shoppingCartPopup'].addToCartAnimation()
					})
				} else {
					this.$refs.shoppingCartPopup.open(this.id,this.qtyValue,{productItem:{
						rec_code: this.rec_code,
						rec_engine: this.rec_engine,
						un_rec: this.un_rec,
						ab_key: this.ab_key,
						module: this.module
					},currentImgobj});
				}
			},
			getElemClientRect(name){
				let that = this
			    return new Promise ((resolve,reject)=>{
					const query = uni.createSelectorQuery().in(that);
					query.select(name).boundingClientRect(res => {
					  	resolve(res);
					}).exec();
			    })
			},  
			// 判断产品属性是否选中
			judgeAttrSelect(data) {
				var className = '';
				if(data.item_child.active== 'current') {
					if(data.item.label.toLowerCase() == 'size'&&!this.isSizeSelected) {
						if(!data.item_child.has_stock) {
							className = 'isOutStock'
						} else {
							className = ''
						}
					} else {
						className = 'on';
					}
				} else if(data.item_child.active== 'noactive') {
					className = 'disabled'
				} else {
					if(!data.item_child.has_stock) {
						className = 'isOutStock'
					} else {
						className = ''
					}
				}
				return className
			},
			// 获取购物安全静态块内容
			getStatickBlock() {
				this.$apis.getStaticblock({identify:'app-product-detail-safe-payments'}).then(res =>{
					this.staticBlock = res.data
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
			},
			// qty值变化
			qtyValueChange(e) {
				this.$nextTick(()=>{
					let val = Number(e.detail.value) || 1;
					this.setData({
						qtyValue: val
					})
					this.judgingWholesalePrices(val);
					
					if(!this.isShowedSpecialTOriginalTip && this.isSizeSelected && val>this.goodsDetail.special_qty_left&&this.goodsDetail.special_qty_left!=0&& this.goodsDetail.special_data&& this.goodsDetail.special_data.is_spu_special == 1&&this.goodsDetail.can_sale) {
						this.showedSpecialTOriginalTip()
					}
				})
			},
			// 浮层显示逻辑
			handleFloatTipShowLogic(type) {
				// 如果没有裂变活动页或个人中心裂变主页浏览记录时，立即出现浮层，如果有，15秒后出现，如果出现过了，就不再出现，重新登录时重置为没有出现过
				if(!this.isShowedDetailFloatTip) {
					if(this.isViewFissionPage) {
						this.handleStarTimeout(type);
					} else {
						if(type != 'not_show') {
							this.showShareDescTip = true;
						}
						this.$store.commit('SET_ISSHOWEDDETAILFLOATTIP', true);
					}
				}
			},
			formatData(goodsDetail,type,product_share_content) {
				this.goodsDetail = goodsDetail;
				this.is_have_order = goodsDetail.is_have_order;
				this.favicon = goodsDetail.fav === 1?true:false;
				this.product_spu_sold_out = goodsDetail.product_spu_sold_out
				// 是否可以加入购物车
				this.isAddToShoppingCart = goodsDetail.can_sale;
				//点击收藏登录后自动收藏
				if(this.loginBackFav && !this.favicon){
					this.changeFav();
				}
				if(this.loginBackHelpful){
					const review_id = uni.getStorageSync('changeReviewHelpful')
					const col = goodsDetail.productReview&&goodsDetail.productReview.coll&&goodsDetail.productReview.coll.find((item,index)=>{
						return item.id == review_id
					})
					if(col&&col.is_helpful == '1')return
					this.$apis.reviewHelpful({review_id}).then(res=>{
						uni.hideLoading();
						this.changeHelpful(res.data,col)
					}).catch(e=>{
						uni.hideLoading();
					})
				}
				uni.removeStorageSync('changeReviewHelpful');
				var regexp = /[0-9]*/g;
				this.tier_price_format = []
				if(goodsDetail.tier_price && goodsDetail.tier_price.length) {
					goodsDetail.tier_price[0].map((item,index)=>{
						if(index > 0) {
							let priceArr = String(item).split(/[^0-9]/ig)
							let qtyFormat = index+1==goodsDetail.tier_price[0].length?priceArr.pop():priceArr[0];
							this.tier_price_format[index-1] = {qty:qtyFormat,price:goodsDetail.tier_price[1][index]}
						}
					})
				}
				if(goodsDetail.options && goodsDetail.options.length) {
					goodsDetail.options.map((item,index) => {
						item.value.map((item_c,index_c) => {
							if(item_c.show_as_img && item_c.active == 'current') {
								this.currentColorObj = {key:item.label,value:item_c[item.label]}
							}
						})
					})
					var sizeOptions = goodsDetail.options.filter(item=>{return item.label.toLowerCase() == 'size'});
					if(sizeOptions.length == 0 || (sizeOptions.length>0 && sizeOptions[0].value.length <2)) {
						this.isSizeSelected = true;
					}
				} else {
					this.isSizeSelected = true;
				}
				this.goodsDetail.thumbnail_img = goodsDetail.thumbnail_img.map(item=>{
					if(typeof item ==='string') {
						return {
							url: item,
							_id: this.goodsDetail._id,
							attr_val: this.currentColorObj.value
						}
					} else {
						return item
					}
				})
				this.shareData = {
					...this.shareData,
					from_page: "product_detail",
					share_from: 'product',
					product_id: this.goodsDetail._id,
					product_sku:this.goodsDetail.sku,
					url: goodsDetail.short_url,
					image: goodsDetail.thumbnail_share_img,
					hashtag:goodsDetail.share_hashtag,
					multi_meta_tag:goodsDetail.multi_meta_tag,
					description:goodsDetail.name,
					subject:goodsDetail.share_subject,
					prefix_email_content:goodsDetail.prefix_email_content || '',
					tw_share_description:goodsDetail.share_description,
				}
				if(product_share_content) {
					this.shareData = {...this.shareData,...product_share_content}
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
				var allColorItemIndex = -1;
				this.colorBlockLengthArr=[];
				colorItem.value.forEach((item, k)=>{
					if(item.active == 'current') {
						this.currentColorBlockIDetail = {
							attr_val:item.attr_val,
							block_index:k,
							attr_id:item.id
						}
					}
					let thum_ori_img = item.thumbnail_ori_img || [];
					this.colorBlockLengthArr.push(thum_ori_img.length);
					const thumbnail_ori_img = thum_ori_img.map((ite,index_child)=>{
						allColorItemIndex++;
						return {
							url: ite,
							k: k,
							index_in_all:allColorItemIndex,
							index_in_color_block:index_child,
							item_color_block_imgs:thum_ori_img,
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
					// 解决首次渲染bigSwiper初始化默认字段和bigSwiperCurrent一样导致不触发大图轮播的change事件
					if(type=='first') {
						this.bigSwiperCurrent = this.allColorThumbnailImgs.length
					}
					if(type == 'size') {
						this.isSizeSelected = true;
					}
					if(type == 'color' || type == 'size') {
						if(this.isSizeSelected && this.goodsDetail.special_qty_left == 0 && this.goodsDetail.special_data&& this.goodsDetail.special_data.is_spu_special == 1 && !this.isShowedSpecialTOriginalTip&&this.goodsDetail.can_sale) {
							this.showedSpecialTOriginalTip();
						}
					}
				})
			},
			showedSpecialTOriginalTip() {
				uni.showToast({
				    title: this.goodsDetail.special_qty_left_text,
				    icon: 'none',
				    duration: 3000
				});
				this.isShowedSpecialTOriginalTip = true;
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
			},
			// 改变size
			changeOtherAttr(data,index,parentData) {
				var isSize = parentData.label.toLowerCase() == 'size';
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
			handleSelectBlock(key){
				this.changeBanner(key)
				this.blockScrollLeft = this.colorBlockWidth * key;
			},
			changeBanner(index){
				var _all_index = 0;
				this.colorBlockLengthArr.map((_value,_index)=>{
					if(_index<index) {
						_all_index = _all_index+_value
					}
				})
				this.bigSwiperCurrent = _all_index;
			},
			closeImgDialogNoBlock(){
				const that = this
				that.imgDialogVisible = false
				that.$refs.popupBigImg.close();
			},
			// 关闭大图预览banner 根据swiperCurrent判断是否切换sku
			closeImgDialog(){
				const that = this
				if(that.id !== this.currentColorBlockIDetail.attr_id) {
					that.id = this.currentColorBlockIDetail.attr_id;
					uni.showLoading();
					that.getProductDetails({type:'color',no_recommend:true})
				}
				that.imgDialogVisible = false;
				that.$refs.popupBigImg.close();
			},
			openShowImgDialog(){
				const that = this
				this.changeBigSwiperFrom = 'swiper'
				if(!that.goodsDetail.thumbnail_img.length)return
				var bigSwiperIndex = 0;
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
			addToBagSuccess() {
				if(this.floorTabActive != 2) {
					//this.showFloorTab = true;
					this.$nextTick(()=>{
						uni.createSelectorQuery().select('.goods-detail-header-box').boundingClientRect(data => {
							this.headerHeight = data.height;
						}).exec((res)=>{
							uni.createSelectorQuery().select('.recommend-box').boundingClientRect(rect => {
								setTimeout(()=>{
									uni.pageScrollTo({
										duration: 300, // 滚动动画过渡时间
										scrollTop: rect.top+this.scrollTop-this.headerHeight+2, // 滚动的值
									})
								},800)
							}).exec();
						});
					})

				}
			},
			handleScrollTo(item) {
				if(item.targetClass) {
					uni.createSelectorQuery().select('.goods-detail-header-box').boundingClientRect(res => {
						uni.createSelectorQuery().select(item.targetClass).boundingClientRect(data => {
							if(data) {
								uni.pageScrollTo({
									duration: 300, // 滚动动画过渡时间
									scrollTop: data.top+this.scrollTop-res.height+2, // 滚动的值
								})
							}
						}).exec();
					}).exec()
				} else {
					uni.pageScrollTo({
						duration: 300, // 滚动动画过渡时间
						scrollTop: 0, // 滚动的值
					})
				}
				this.$maEvent.custom_event({
					event_category: 'product_details',
					event_action: 'product_tab_button',
					event_name: item.maValue,
					module: 'product_details',
					event_data: {
						event_value:item.maValue
					}
				});
			},
			changeHelpful(data,item) {
				item.helpful_nums = data.helpful_nums;
				item.is_helpful = item.is_helpful == 1?0:1;
			},
			formatReviewItem(item) {
				const bodySize = ['size_bust','size_fit','size_height','size_hips','size_waist','size_weight']
				let bodySizeNum = 0;
				bodySize.map(size => {
					if(item[size]) {
						bodySizeNum++;
					}
				})
				return {...item,bodySizeNum}
			},
			// 获取推荐列表
			recommendProduct() {
				// 商品详情下SIMILAR PRODUCTS推荐
				this.$apis.recommendProduct({sku:this.goodsDetail.sku,type: 'item_side_rec',size:30}).then(res => {
					this.recommendSideList = res.data.products || []
				})
				// 商品详情页Customers Also Viewed
				this.$apis.recommendProduct({sku:this.goodsDetail.sku,type: 'item_alsoviewed_rec',size: 120}).then(res => {
					this.recommendList = res.data.products || []
				})

			},
			handleMoreItem(data) {
				if(data.type) {
					uni.switchTab({
						url: data.path
					})
				} else {
					this.$public.handleNavTo(data.path)
				}
			},
			//事件处理函数
			swiperchange: function(e) {
				this.setData({
					swiperCurrent: e.detail.current
				});
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
			// 获取产品详情
			getProductDetails(params) {

				var that = this
				// isSizeSelected 1选中 2不选中
				var queryData = {product_id: that.id,v:'1.0',isSizeSelected:(this.isSizeSelected || params.isSize)?1:2};
				if(that.goodsDetail.special_data) {
					queryData.is_special = that.goodsDetail.special_data.is_special
				}
				this.$apis.getProductDetail(queryData,{loading:false}).then(res =>{
					uni.hideLoading()
					var goodsDetail = res.data.product;


					that.formatData(goodsDetail,params.type,res.data.product_share_content)
					this.isLoaded = true;
					if(!params.no_recommend) {
						that.recommendProduct()
					}
					if(params.isSize) {
						this.isSizeSelected = true
					}
					that.isLoading = false;
					let track_data = { ...goodsDetail};
					if(track_data.sku){
						if(this.is_track_view){
							return;
						}
						if(this.rec_code){
							track_data.rec_code = this.rec_code;
						}
						if(this.rec_engine){
							track_data.rec_engine = this.rec_engine;
						}
						if(this.module){
							track_data.module = this.module;
						}
						if(this.ab_key){
							track_data.ab_key = this.ab_key;
						}
						track_data.event_data = {
							view_type: 'view'
						}
						if(this.goods_location){
							track_data.event_data.goods_location = this.goods_location;
						}
						this.$trackEvent.view_item(track_data);
						this.is_track_view = true;
					}
				})
			},
			// 改变size
			handleChangeOtherAttr(data) {
				this.id = data._id;
				this.formatData(data)
			},
			// 改变color
			handleChangeColor(data) {
				this.swiperCurrent = 0;
				this.id = data._id;
				this.formatData(data)
			},

			// 取消、添加收藏
			changeFav () {
				if(!this.$store.getters.hasLogin){
					uni.setStorageSync('changeFav', '1');
					// 获取当前页面的栈
					const pages = getCurrentPages();
					// 获取当前页面
					const currentPage = pages[pages.length - 1];
					// 获取当前页面的路径
					const currentPath = currentPage.route;
					// 获取当前页面的参数
					const currentParams = currentPage.options;
					
					let redirectUrl = "/"+currentPath
					var param = [];
					for (let key in currentParams) {
					    param.push(key + '=' + currentParams[key]);
					}
					if(param.length > 0){
						redirectUrl += "?" + param.join("&");
					}
					uni.navigateTo({
						url: '/pages/login/index?in_site_source=product_details_wish&redirectUrl='+redirectUrl
					});
					return;
				}
				this.$apis.changeFav({product_id: this.id,type: this.favicon?'del':'add'}).then(res =>{
					uni.hideLoading()
					this.loginBackFav = false;
					this.favicon = !this.favicon
					let track_data = {...this.goodsDetail};
					if(this.module){
						track_data.module = this.module;
					}
					if(this.favicon){
						this.$trackEvent.add_to_wishlist(track_data)
					} else {
						this.$trackEvent.remove_wishlist(track_data)
					}
				}).catch((res) => {
					if (res && res.code && res.code == "1100003") {
						uni.setStorageSync('changeFav', '1');
					}
				})
			},
			changeFavCallback(f){
				let fav = f == 'add' ? 1 : 0;
				this.favicon = fav;
			},

			// 更新缓存的浏览记录
			refreshViewRecords () {
				uni.getStorage({
					key: 'viewed_product_id',
					success: ({ data }) => {
						let str = this.id
						if(data) {
							const arr = data.split(',')
							const index = arr.indexOf(this.id)
							if(index > -1) {
								arr.splice(index, 1)
							}
							arr.push(this.id)
							str = arr.join(',')
						}
						uni.setStorage({
							key: 'viewed_product_id',
							data: str,
							success: (result) => {},
							fail: (error) => {}
						})


					},
					fail: (error) => {
						uni.setStorage({
							key: 'viewed_product_id',
							data: this.id,
							success: (result) => {},
							fail: (error) => {}
						})
					}
				})
			},
			// 获取优惠券列表
			getProductCoupons() {
				this.$apis.getProductCouponList({pid:this.id}).then(res => {
					this.couponList = res.data.coupons || []
					uni.hideLoading()
				})
			},
			// 获取点击分享的时候，弹窗里面的裂变banner
			getShareBanner() {
				this.$apis.getStaticblock({identify:'distribute-share-banner'}).then(res=>{
					this.shareBannerDataCopy = res.data['distribute-share-banner'];
				})
			},
			// 打开分享弹窗
			showShareToast(type) {
				
				if(this.$store.getters.hasLogin) {
					if(this.shareData&&this.shareData.url) {
						this.$refs.popupShare.open('bottom')
					}
				} else {
					uni.setStorageSync('clickShare', '1');
					this.$public.handleNavTo('/pages/login/index?is_special=1&in_site_source=product_details_share&redirectUrl=/pages/goods-detail/index?id='+this.id)
				}
				this.$trackEvent.open_share_code({
					from_page: 'product_detail',
					event_name: 'open share from product detail page',
					event_action: 'open_share_product',
					product_id:this.id
				});
				this.$maEvent.custom_event({
					event_category: 'product_details',
					event_action: 'product_share_button',
					module: 'product_details_share'
				});
			},
			maClickInfo(value) {
				this.$maEvent.custom_event({
					event_category: 'product_details',
					event_action: 'product_info_button',
					event_name: value,
					module: 'product_details',
					event_data: {
						event_value:value
					}
				});
			}
		},
		onPageScroll(e) {			
			// this.showShareDescTip = false;
			this.$refs.shoppingCartPopup['scrollTop'] = e.scrollTop
			this.$refs['goods_list']&&this.$refs['goods_list'].pageScrollFunc(e.scrollTop)
			if (e.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
			this.scrollTop = e.scrollTop
			if(e.scrollTop > 5) {
				if(this.imgListHeight == 0) {
					uni.createSelectorQuery().select('.swiper-container').boundingClientRect(rect => {
						this.imgListHeight = rect.height;
					}).exec();
				}
				let nodeQuery = uni.createSelectorQuery();
				nodeQuery.select('.reviews-box').boundingClientRect()
				nodeQuery.select('.recommend-box').boundingClientRect()
				nodeQuery.select('.goods-detail-header-box').boundingClientRect()
				nodeQuery.exec((res) => {
					this.reviewOffsetTop = res[0].top;
					this.recommendOffsetTop = res[1].top;
					this.headerHeight = res[2].height;
				})
				if(this.scrollTop > this.imgListHeight - this.headerHeight){
					this.showFloorTab = true;
					this.floorTabActive = 0;
					uni.createSelectorQuery().select('.goods-detail-header-box').boundingClientRect(rect => {
						this.headerHeight = rect.height;
					}).exec();
					if(this.reviewOffsetTop-this.headerHeight <0) {
						this.floorTabActive = 1;
						if(this.recommendOffsetTop-this.headerHeight <0) {
							this.floorTabActive = 2;
						}
					}
				} else {
					this.showFloorTab = false;
					this.floorTabActive = 0;
				}
			}
			uni.createSelectorQuery().select('.goods-detail-wrap .goods-info .goods-price').boundingClientRect(rect => {
				if (rect.top-this.headerHeight+(rect.height / 2) <= 0) {
					this.isViewPrice = false
				} else {
					this.isViewPrice = true
				}
			}).exec();
			this.$debounce(() => {
				this.$refs['goods_list']&&this.$refs['goods_list'].startObserver();
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
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
	};
</script>
<style scoped lang="scss">
	@import './css/index.css';
	::v-deep {
		.global-top-btn {
			bottom: 260rpx;
		}
	}
	.slod-out-tip{
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	.slod-out-tip .di{
		margin-left: 8rpx;
		margin-right: 8rpx;
	}
	.slod-out-tip .img_box{
		width: 40rpx;
		height: 40rpx;
		margin: 5rpx 5rpx 0 0;
		float: left;
	}
	.slod-out-tip .img_box .img{
		width: 40rpx;
		height: 40rpx;
	}
	.slod-out-tip  {
		color: #666666;
	}
	.no_wrap{
		flex-wrap: nowrap;
	}
	.product_hot_tag{
		position: absolute;
		right: -6rpx;
		top: 0;
		width: 38rpx;
		height: 23rpx;
		background: #FF004D;
		border-radius: 12rpx 12rpx 12rpx 0rpx;
		font-weight: 600;
		font-size: 15rpx;
		color: #FFFFFF;
		line-height: 18rpx;
	}
	.big-img-popup.product-detail >>> .uni-popup__wrapper .popup-content {
		padding-bottom: 376rpx;
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
			color: #ff165e;
			font-size: 13px;
			padding: 2px;
			line-height: 1;
			display: inline-block;
			margin-left: 4px;
		}
	}
	.screen-share-tip {
		position: fixed;
		left: 0;
		top: calc(var(--window-top));
		background-color: #fff;
		opacity: 0.9;
		width: 100%;
		z-index: 100;
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		.share-text {
			flex: 1;
			font-size: 28rpx;
		}
		.share-box {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			.share-btn {
				padding: 10rpx 20rpx;
				border: 1px solid #000;
			}
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
	/deep/.uni-badge{
				top: -5px!important;
			}
	::v-deep .p-desc-popup .uni-popup__wrapper {
		height: 100%;
		.popup-content {
			width: 100vw;
			height: 100%;
			overflow-y: auto;
		}
	}
	::v-deep {
		.info-list-box {
			margin-bottom: 16rpx;
			padding: 0 32rpx;
			background: #fff;
			.block-item-box {
				margin-bottom: 0;
				padding: 36rpx 0 44rpx 0;
				font-size: 32rpx;
				border-bottom: 1px solid #D9D9D9;
				.right {
					.iconfont {
						font-size: 40rpx;
						color: #000;
					}
				}
			}
			.block-item-box:last-child {
				border-bottom: 0;
			}
		}
	}
	.product-qty-box {
		.title {
			font-size: 28rpx;
			margin-bottom: 24rpx;
		}
		.qty-box {
			.iconfont {
				width: 64rpx;
				height: 64rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #EEEEEE;
				font-size: 28rpx;
			}
			.qty-input {
				width: 100rpx;
				text-align: center;
				font-size: 32rpx;
			}
		}
	}
	::v-deep .uni-popup.has-banner-share-popup {
		.main-content-box {
			padding: 0;
			max-height: 70vh;
		}
		.share-bar-box {
			padding: 46rpx 16rpx 26rpx;
		}
	}
	.big-image-view-btn {
		width: 82rpx;
		height: 82rpx;
		position: absolute;
		top: 40vh;
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
</style>
