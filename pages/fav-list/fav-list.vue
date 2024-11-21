<template>
	<view class="fav-list-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :title="$t('fav_list.header')"  :backSelf="{type: 'emit'}" @handleClick="onBack"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="fav-list-content">
			<block v-if="favList && favList.length">
				<block v-for="(item, index) in favList" :key="index">
					<view class="fav-item flex no-wrap" @click="toDetail(item, index)" :id="`favlistitem-${item.product_id}`">
						<view class="left img-box">
							<image mode="widthFix" :src="item.imgUrl" :lazy-load="true"></image>
							<view v-if="item.member_product && item.platinum_user" class="show-member-discount">-{{item.discount_off}}%</view>
						</view>
						<view class="right flex flex-column justify-content-between">
							<view class="top">
								<view class="title text-overflow-ellipsis">{{ item.name }}</view>
								<view class="show-member-price-box"
									v-if="item.member_product && item.platinum_user">
									<view class="original-price">
										{{item.price_info.price.symbol}}{{item.price_info.price.value}}
									</view>
									<view class="price">{{item.price_info.member_price.symbol}}{{item.price_info.member_price.value}}
									</view>
								</view>
								<block v-else>
								<view class="special-price-box flex align-items-center"
									v-if="item.price_info.special_price">
									<view class="special-price">
										{{item.price_info.special_price.symbol}}{{item.price_info.special_price.value}}
									</view>
									<view class="price">{{item.price_info.price.symbol}}{{item.price_info.price.value}}
									</view>
								</view>
								<view v-else class="price">{{item.price_info.price.symbol}}{{item.price_info.price.value}}</view>
								</block>
							</view>
							<view class="bottom flex justify-content-end align-items-center">
								<view class="iconfont icon-bag" @click.stop="showShoppingCartPopup(item, index)"></view>
								<view class="iconfont icon-more"
									@click.stop="handleShare(item)"></view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<empty v-if="!hasLogin" :show_btn="true" routeType="navigateTo" routeUrl="/pages/login/index?in_site_source=wishlist" :btn_text="$t('fav_list.sign_in_and_register')" :text="$t('fav_list.empty_tips')"></empty>
			<empty v-if="hasLogin && favList.length == 0" :text="$t('fav_list.empty_tips')"></empty>
			<!-- 推荐 -->
			<view v-if="recommendList.length&&p>=pageTotal" class="goods-container">
				<recommendHeader :title="$t('recommend.header2')"></recommendHeader>
				<good-list module_name="wishlist_ymal" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="recommendList"></good-list>
			</view>
		</view>
		<!-- 更多操作弹窗 -->
		<uni-popup ref="popupMore" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<popupContentTemplate @close="$refs.popupMore.close()">
				<template v-slot:content>
					<view class="popup-more-action-box flex justify-content-around">
						<view class="action-box" @click="handleCancelCollection">
							<view class="icon-box">
								<!-- <view class="iconfont icon-heart"></view> -->
								<image class="calcle-like" src="@/static/images/icon/cancle-like.png" mode=""></image>
							</view>
							<view class="label">{{$t('fav_list.cancel_collection')}}</view>
						</view>
						<view class="action-box" @click="handleOpenShare()">
							<view class="icon-box">
								<!-- <view class="iconfont icon-share"></view> -->
								<image mode="widthFix" style="width: 48rpx;" src="@/static/images/p_detail_share_2@2x.png"></image>
							</view>
							<view class="label">{{$t('fav_list.share')}}</view>
						</view>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
		<!-- 购物车弹窗 -->
		<shoppingCartPopup @popupChange="(value)=>{pageMetaShow=value}" ref="shoppingCartPopup" :showFav="false"></shoppingCartPopup>
		<!-- 分享弹窗弹窗 -->
		<sharePopup @clickBarItem="(type)=>{handleClickBarItem(type)}" key_prefix="product_share_" @changePageMeta="(show)=>{pageMetaShow = show;}" ref="popupShare" :isDifferPlatformWord="true" :shareData="shareData" :title="$t('fission_sharing.share_popup_title')"></sharePopup>
		<customTooltip ref="tooltip" :title="$t('fission_sharing.share_success_text')"></customTooltip>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue";
	import shoppingCartPopup from '@/components/shoppingCartPopup/shoppingCartPopup.vue';
	import recommendHeader from '@/components/recommend-header/recommend-header.vue';
	import sharePopup from '@/components/sharePopup/sharePopup.vue';
	import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
	export default {
		components: {
			pageHeader,
			sharePopup,
			shoppingCartPopup,
			recommendHeader,
			customTooltip
		},
		computed: {
		    hasLogin() {
		        return this.$store.getters.hasLogin;
		    }
		},
		data() {
			return {
				pageMetaShow:false,
				id: '',
				currentProductDetail: {},
				favList: [],
				selectSize: '',
				p: 1, // 当前页数
				pageTotal: 1, // 总页数
				showBacktopBtn: false,
				recommendList:[],
				shareData:{},
				isShared:false, // 是否点击了分享,
				module_name: 'wishlist'
			};
		},
		onTabItemTap(item) {
			this.$maEvent.custom_event({
				event_category: 'tabBar',
				event_action: 'tabBar_button',
				event_name: 'tabBar_button',
				module: 'tabBar',
				event_data: {
					event_value: 'wishlist'
				},
			});
		},
		onReachBottom() {
			if (this.$store.getters.hasLogin && this.p < this.pageTotal) {
				this.p++;
				this.getList()
			}
		},
		onLoad() {
			this.recommendProduct();
			this.$trackEvent.pageView({
				action_name: 'Wishlist'
			});
		},
		//下拉刷新
		onPullDownRefresh() {
			if(this.$store.getters.hasLogin) {
				this.getList();
			}
			this.recommendProduct();
		},
		onShow(){
			if(this.$store.getters.hasLogin) {
				this.getList();
			}
			this.redirect_url = uni.getStorageSync('wishlist_back_url');
			uni.removeStorageSync('wishlist_back_url');
			if(this.isShared) {
				this.$refs.popupShare.close();
				this.$refs.tooltip.open({time:2000});
				this.isShared = false;
			}
			uni.$emit('appDateLog');
			this.$maEvent.visit_event({
				event_category: 'wishlist',
				event_action: 'wishlist_visit',
				event_name: 'wishlist_visit'
			})
		},
		onPageScroll: function (t) {
			this.$refs.shoppingCartPopup['scrollTop'] = t.scrollTop
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
			this.$debounce(() => {
				this.startObserver();
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
		},
		onBackPress(){
			if(this.redirect_url){
				uni.navigateTo({
					url: this.redirect_url
				});
				return false;
			}
			return true;
		},
		methods: {
			// 开始观察产品曝光
			startObserver() {
				if(this.favList.length == 0){
					return false;
				}
				if(!this.observer){
					this.observer = this.$public.createIntersectionObserver();
				}
				this.favList.forEach((item, index) => {
					if(!item.observer){
						let elementSelector = '#favlistitem-' + item.product_id;
						this.$public.observeVisibility(this.observer, elementSelector, () => {
							if(item.observer){
								return false;
							}
							this.handleVisibilityChange(item, index);
						});
					}
				});
			},
			handleClickBarItem(type) {
				if(type != 'more') {
					this.isShared = true
				}
			},
			handleOpenShare() {
				if(this.shareData&&this.shareData.url) {
					this.$refs.popupShare.open('bottom');
					this.$trackEvent.open_share_code({
						from_page: 'product_detail_wish',
						event_name: 'open share from product detail page',
						event_action: 'open_share_product',
						product_id:this.currentProductDetail.product_id
					});
					this.$maEvent.custom_event({
						event_category: 'wishlist',
						event_action: 'wishlist_share_button',
						event_name: 'wishlist_share_button',
						module: "wishlist",
						product_sku: this.currentProductDetail.sku,
						product_name: this.currentProductDetail.name
					});
				}
			},
			// 获取推荐列表
			recommendProduct() {
				this.$apis.recommendProduct({type: 'wishlist_rec'}).then(res => {
					this.recommendList = res.data.products || []
					uni.stopPullDownRefresh();
				}).catch(e=>{
					uni.stopPullDownRefresh();
				})
				
			},
			handleShare(item) {
				this.currentProductDetail = {
					...item
				};
				this.shareData = {
					share_from: 'product',
					from_page: "product_detail_wish",
					product_id: item.product_id,
					description:item.name,
					url:item.short_url,
					image:item.shareImgUrl,
					hashtag:item.share_hashtag,
					multi_meta_tag:item.multi_meta_tag,
					subject:item.share_subject,
					prefix_email_content:item.prefix_email_content,
					tw_share_description:item.share_description
				};
				if(item.product_share_content) {
					this.shareData = {...this.shareData,...item.product_share_content}
				}
				this.$refs.popupMore.open('bottom')
			},
			// 打开购物车弹窗
			async showShoppingCartPopup(item, index) {
				let id = item.product_id;
				this.id = id;
				const that = this
				// 获取到点击当前商品的大图
				const copyImgUrl = item.imgUrl
				let currentImgEle = '';
				/*const query = uni.createSelectorQuery().in(this);
				// 选择父元素
				query.selectAll('.img-box').boundingClientRect(res => {
					// res 包含了父元素的大小等信息
					currentImgEle = res[index]
				}).exec();*/
				try{
					let res = await this.getElemClientRect('.img-box')
					currentImgEle = res[index] || '';
				} catch(e){
					
				}
				const currentImgobj = {
					copyImgUrl,
					currentImgEle
				}
				this.$refs.shoppingCartPopup.open(id,1,{isSizeSelected:true,currentImgobj})
				this.selectItem(item);
			},
			// 取消收藏
			handleCancelCollection() {
				this.$apis.removeCustomerFav({
					favorite_id: this.currentProductDetail.favorite_id
				}).then(res => {
					this.p = 1;
					this.$refs.popupMore.close();
					this.getList();
					this.$trackEvent.remove_wishlist({
						name: this.currentProductDetail.name,
						sku: this.currentProductDetail.sku,
						module: this.module_name
					})
				})
			},
			getList() {
				this.$apis.getfavList({
					p: this.p
				},{loading:this.isShared?false:true}).then(res => {
					if (res.code == 200) {
						const result = res.data
						const count = Number(result.count);
						this.favList = this.p == 1 ? result.productList : this.favList.concat(result.productList);
						this.pageTotal = Math.ceil(count / result.numPerPage)
						this.$nextTick(() => {
							this.startObserver();
						})
					}
					uni.hideLoading()
				})
			},
			onBack(){
				if(this.redirect_url){
					uni.navigateTo({
						url: this.redirect_url
					});
					return false;
				}
				this.$public.handleGoBack();
			},
			toDetail(item, index){
				let url = '/pages/goods-detail/index?id=' + item.product_id + "&module=" + this.module_name;
				url +="&goods_location=" + (index + 1);
				this.$public.handleNavTo(url);
				this.selectItem(item);
				if(!item.observer){
					this.handleVisibilityChange(item, index);
				}
				let product_track_data = item;
				if(this.module_name){
					product_track_data['module'] = this.module_name;
				}
				this.$maEvent.product_click(product_track_data, index);
			},
			selectItem(item){
				let trackData = {
					item_list_id: 'wish_list',
					item_list_name: 'wish_list',
					items: [{
						item_id: item.sku,
						item_name: item.name
					}]
				}
				this.$trackEvent.select_item(trackData);
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
			handleVisibilityChange(item, index) {
				if(this.favList[index].observer){
					return false;
				}
				this.favList[index].observer = true;
				if(this.module_name){
					item.module = this.module_name;
				}
				this.$trackEvent.impression_product_item(item, index);
			},
		}
	};
</script>
<style scoped>
	.fav-list-box .fav-list-content {
		padding: 24rpx;
	}

	.fav-list-box .fav-list-content .fav-item {
		border-bottom: 1px solid #e5e5e5;
		padding: 24rpx 0;
	}

	.fav-list-box .fav-list-content .fav-item:first-child {
		padding-top: 0;
	}

	.fav-list-box .fav-list-content .img-box {
		margin-right: 24rpx;
	}
	.fav-list-box .fav-list-content .left {
		position: relative;
	}
	.fav-list-box .fav-list-content .left .show-member-discount {
		position: absolute;
		top: 16rpx;
		left: 0;
		background: #ffe3d4;
		color: #825a3d;
		font-size: 24rpx;
		padding: 4rpx 12rpx;
	}
	.fav-list-box .fav-list-content .left image {
		width: 180rpx;
	}

	.fav-list-box .fav-list-content .fav-item .right .top .title {
		font-size: 26rpx;
		margin-bottom: 24rpx;
		width: 498rpx;
	}

	.fav-list-box .fav-list-content .fav-item .right .top .price {
		font-size: 32rpx;
	}

	.fav-list-box .fav-list-content .fav-item .right .top .special-price-box .special-price {
		font-size: 32rpx;
		color: #f85184;
		margin-right: 12rpx;
	}

	.fav-list-box .fav-list-content .fav-item .right .top .special-price-box .price {
		font-size: 24rpx;
		color: #999999;
		text-decoration: line-through;
	}
	.fav-list-box .fav-list-content .fav-item .right .top .show-member-price-box .original-price {
		font-size: 24rpx;
		color: #999999;
		text-decoration: line-through;
	}
	.fav-list-box .fav-list-content .fav-item .right .top .show-member-price-box .price {
		color: #873c00;
		font-weight: bold;
	}
	.fav-list-box .fav-list-content .fav-item .right .bottom {
		width: 498rpx;
	}

	.fav-list-box .fav-list-content .fav-item .right .bottom .icon-bag {
		margin-right: 48rpx;
	}

	/* 更多弹窗 start */
	.popup-more-action-box .action-box {
		text-align: center;
	}

	.popup-more-action-box .action-box .icon-box {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 1px solid #e5e5e5;
		margin: 0 auto;
		margin-bottom: 24rpx;
		line-height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popup-more-action-box .action-box .icon-box .calcle-like {
		width: 48rpx;
		height: 48rpx;
	}
	
	.popup-more-action-box .action-box .icon-box .iconfont {
		font-size: 48rpx;
	}

	.popup-more-action-box .action-box .icon-heart {
		color: #ffffff;
	}

	.popup-more-action-box .action-box .icon-heart:before {
		content: "\E602";
	}

	.popup-more-action-box .action-box .icon-share {
		color: #666666
	}

	.popup-more-action-box .action-box .icon-share:before {
		content: "\E648";
	}

	.popup-more-action-box .action-box .label {
		font-size: 24rpx;
		color: #333333;
	}

	/* 更多弹窗 end */
</style>
