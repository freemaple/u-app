<template>
	<view class="reviews-list-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :styleType="2" :showShadow="false" :isTitleUppercase="true" :title="$t('goods_detail.customer_reviews')"></pageHeader>
		<view class="reviews-box">
			<reviewsBar :reviewsData="reviewsData"></reviewsBar>
		</view>
		<view class="menu_mask" @tap="open_popmenu = false" v-show="open_popmenu"></view>
		<view class="my-filter-box flex">
			<view @tap="open_popmenu = !open_popmenu" class="filter-menu flex align-items-center justify-content-center">
				<view class="choosed font-bold">
					{{ $t(sortData[currentSortIndex].language) }}
				</view>
				<view class="open-pop">
					<image src="@/static/images/icon/filter@2x.png" mode="widthFix" :lazy-load="true" class="down_arrow_img" :class="open_popmenu?'open':''"/>
		
				</view>
				<view :class="'pop_menu ' + (open_popmenu ? 'open' : '')" >
					<view @tap="handleSort(index,item)" v-for="(item, index) in sortData" :key="index" :class="'menu_item flex justify-content-between align-items-center ' + (index == currentSortIndex ? 'selected' : '')">
						<view class="text">{{ $t(item.language) }}</view>
					</view>	
				</view>
			</view>
			<view class="filter-dialog  flex align-items-center justify-content-center" @tap="$refs.popupMoreFilter.open('right');open_popmenu = false">
				<view class="font-bold">{{ $t('search.filter') }}</view>
				<image src="@/static/images/icon/down_arrow@2x.png" mode="widthFix" :lazy-load="true" class="filter_img"/>
			</view>
		</view>
		<!-- 筛选 -->
		<view class="filter-box flex align-items-center" style="display: none;">
			<view @click="$refs.sortSelect.open('bottom')" class="filter-item">
				<view class="label font-bold">{{$t("goods_detail.sort")}}</view>
				<view class="iconfont icon-down"></view>
			</view>
			<view @click="$refs.starSelect.open('bottom')" class="filter-item">
				<view class="label font-bold">{{$t("goods_detail.rating")}}</view>
				<view class="iconfont icon-down"></view>
			</view>
		</view>
		<!-- 图片 -->
		<view class="all-reviews-images-box" v-if="imgList.length">
			<view class="title-box flex align-items-center justify-content-between">
				<view class="title">{{$t('goods_detail.reviews_with_images')}}</view>
				<view class="see-all-photos" @click="$refs.popupAllPhotoDialog.open('right')">{{$t('goods_detail.see_all_phptos')}}</view>
			</view>
			<view class="images-wrapper">
				<scroll-view :show-scrollbar="false" :scroll-x="true" @scroll="handleXScrollbar" @scrolltolower="handleXScrollbarRight" class="all-imgs-x-scroll-view">
					<view class="images-box">
						<view class="img-item" @click="partLoadingName=='allPhotos'+index?'':handleReviewsItem(item,'allPhotos'+index)" v-for="(item,index) in imgList" :key="index">
							<image :src="item.image" mode="aspectFill" />
							<partLoading :show="partLoadingName=='allPhotos'+index"></partLoading>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="scroll-progress-box" v-if="imgList.length>3">
				<view class="current-postion" :style="{left:xscrollPercentage}"></view>
			</view>
		</view>
		<view class="list-content-box">
			<!-- 评论列表 -->
			<block v-for="(item,index) in reviewsList" :key="index">
				<reviewListItem @handleUpdateShareData="handleUpdateShareData()" :shareData="shareData" :reviewData="formatReviewItem(item)" @changeHelpful="(data)=>{changeHelpful(data,item)}"></reviewListItem>
			</block>
		</view>
		<!-- star下拉选项弹窗 -->
		<singleSelect ref="starSelect" refName="popupStar" :currentIndex="currentStarIndex" :options="starData"
			@change="handleStar">
		</singleSelect>
		<!-- sort下拉选项弹窗 -->
		<singleSelect ref="sortSelect" refName="popupSort" :currentIndex="currentSortIndex" :options="sortData"
			@change="handleSort">
		</singleSelect>
		<!-- 更多筛选弹窗 -->
		<uni-popup ref="popupMoreFilter" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content popup-more-filter">
				<view class="header">
					<image mode="widthFix" class="goback" @click="$refs.popupMoreFilter.close()" src="@/static/images/p_detail_left_arrow@2x.png" />
					<view class="title">{{$t('goods_detail.view_all')}}</view>
				</view>
				<view class="filter-content-box">
					<view class="filter-item-box">
						<view class="label">{{$t('goods_detail.star')}}</view>
						<view class="options-box">
							<view @click="handleStar(index,item)" class="option-item" :class="index == currentStarIndex?'on':''" v-for="(item,index) in starData" :key="index">
								{{$t(item.language)}}
							</view>
						</view>
					</view>
					<view class="filter-item-box">
						<view class="label">{{$t('goods_detail.picture')}}</view>
						<view class="picture-options-box">
							<view class="picture-option-item" :class="has_image==item.value?'on':''" @click="has_image==item.value?has_image='':has_image=item.value"  v-for="(item,index) in pictureFilterData">
								{{$t(item.language)}}
							</view>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="clear-btn" @click="handleFilterClear">{{$t('goods_detail.clear_btn')}}</view>
					<view class="done-btn" @click="handleFilterDone">{{$t('goods_detail.done_btn')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 所有图片弹窗 -->
		<uni-popup ref="popupAllPhotoDialog" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content popup-all-phptos">
				<view class="header">
					<image mode="widthFix" class="goback" @click="$refs.popupAllPhotoDialog.close()" src="@/static/images/p_detail_left_arrow@2x.png" />
					<view class="title">{{$t('goods_detail.all_photos')}}</view>
				</view>
				<view class="all-imgs-box">
					<scroll-view :show-scrollbar="false" :scroll-y="true" @scroll="handleYScrollbar" class="all-imgs-scroll-view">
						<view class="all-box">
						<view class="img-item" v-for="(item,index) in imgList" :key="index" @click="partLoadingName=='allPhotosDialog'+index?'':handleReviewsItem(item,'allPhotosDialog'+index)">
							<image mode="aspectFill" :src="item.image"></image>
							<partLoading :show="partLoadingName=='allPhotosDialog'+index"></partLoading>
						</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		<!-- 评论详情弹窗 -->
		<reviewDetailDialog @handleUpdateShareData="handleUpdateShareData()" ref="reviewDetail_all_photos" :shareData="shareData" :itemDetail="reviewItemDetail"  @changeHelpful="allPhotosChangeHelpful"></reviewDetailDialog>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue";
	import singleSelect from '@/components/singleSelect/singleSelect.vue'

	import reviewsBar from '@/pages/goods-detail/components/reviewsBar.vue'
	import reviewListItem from '@/components/reviewListItem/reviewListItem.vue'
	import partLoading from '@/components/part-loading/part-loading.vue'
	import reviewDetailDialog from '@/components/review-detail-dialog/review-detail-dialog.vue'
	export default {
		components: {
			pageHeader,
			reviewsBar,
			reviewListItem,
			singleSelect,
			partLoading,
			reviewDetailDialog
		},
		data() {
			return {
				pageMetaShow:false,
				partLoadingName:'',
				showAllPhotosDialog:true,
				open_popmenu: false,
				id: '',
				spu:'',
				reviewsList:[],
				reviewsData: {},
				currentSortIndex: 0,
				reviewItemDetail:{},
				sortData: [{
						label: 'Recommend',
						value: '',
						language: "goods_detail.recommend"
					},
					{
						label: 'Oldest to Most Recent',
						value: 'asc',
						language: "goods_detail.asc"
					},
					{
						label: 'Most Recent to Oldest',
						value: 'desc',
						language: "goods_detail.desc"
					}
				],
				currentStarIndex: 0,
				pictureFilterData:[
					{
						label: 'Just Look At The Pictures',
						value: 1,
						language: 'goods_detail.look_at_pictures'
					},
					{
						label: "Don't Look At Pictures",
						value: 2,
						language: 'goods_detail.do_not_look_at_picture'
					}
				],
				has_image:'',
				params: {
					p:1,// 当前页码
					reviewdate:"",
					star:"",
					has_image:"",
				},
				img_params_p: 1, // 图片分页
				imgList:[], // 图片列表
				img_pageTotal:1,// 图片总页数
				pageTotal: 1,// 总页数
				starData: [{
						label: 'All',
						value: '',
						language: "goods_detail.all"
					},
					{
						label: '5 Star',
						value: 5,
						language: "goods_detail.star5"
					},
					{
						label: '4 Star',
						value: 4,
						language: "goods_detail.star4"
					},
					{
						label: '3 Star',
						value: 3,
						language: "goods_detail.star3"
					},
					{
						label: '2 Star',
						value: 2,
						language: "goods_detail.star2"
					},
					{
						label: '1 Star',
						value: 1,
						language: "goods_detail.star1"
					}
				],
				xscrollPercentage:0,
				shareData:{},
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.spu = e.spu;
			this.getList();
			this.getImgList();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'reviews',
				event_action: 'reviews_visit',
				event_name: 'reviews_visit'
			})
		},
		onReachBottom() {
			if (this.params.p < this.pageTotal) {
				this.params.p++;
				this.getList()
			}
		},
		methods: {
			handleUpdateShareData() {
				this.getList()
			},
			handleReviewsItem(data,loadingName) {
				this.partLoadingName = loadingName
				this.$apis.getReviewsDetail({review_id:data.review_id}).then(res => {
					this.reviewItemDetail = res.data
					this.partLoadingName = ''
					this.$refs.reviewDetail_all_photos.open(data.img_index);
				}).catch(e=>{
					this.partLoadingName = ''
				})
			},
			handleXScrollbar(e) {
				uni.createSelectorQuery().select('.all-imgs-x-scroll-view').boundingClientRect((res) => {
					uni.createSelectorQuery().select('.scroll-progress-box').boundingClientRect((progressRes)=>{
						uni.createSelectorQuery().select('.current-postion').boundingClientRect((result) => {
							var left = ((e.detail.scrollLeft) / (e.detail.scrollWidth - res.width)) * (progressRes.width - result.width)
							this.xscrollPercentage = left+'px'
						}).exec()
					}).exec()
				}).exec()
			},
			handleXScrollbarRight(e) {
				if(this.img_params_p < this.img_pageTotal) {
					this.img_params_p++;
					this.getImgList()
				}
			},
			handleYScrollbar(e) {
				uni.createSelectorQuery().select('.all-imgs-scroll-view').boundingClientRect((res) => {
					if(e.detail.scrollTop > e.detail.scrollHeight - res.height - 200 && this.img_params_p < this.img_pageTotal){
						this.img_params_p++;
						this.getImgList()
					}
				}).exec()
			},
			changeHelpful(data,item) {
				item.helpful_nums = data.helpful_nums;
				item.is_helpful = item.is_helpful == 1?0:1;
			},
			allPhotosChangeHelpful(data) {
				this.reviewsList.find((item,index)=>{
					if(item.id == data.review_id) {
						item.helpful_nums = data.helpful_nums;
						item.is_helpful = item.is_helpful == 1?0:1
					}
				})
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
			// 排序下拉
			handleSort(index, item) {
				this.currentSortIndex = index;
				this.params.reviewdate = this.sortData[index].value
				this.params.p = 1;
				this.reviewsList = []
				this.getList()
			},
			// 星级下拉
			handleStar(index, item) {
				this.currentStarIndex = index;
			},
			// 筛选done
			handleFilterDone() {
				this.params.p = 1;
				this.params.star = this.starData[this.currentStarIndex].value;
				this.params.has_image = this.has_image;
				this.reviewsList = [];
				this.$refs.popupMoreFilter.close();
				this.getList();
			},
			// 筛选clear
			handleFilterClear() {
				this.currentSortIndex = 0;
				this.currentStarIndex = 0;
				this.has_image = '';
				this.params = {
					p:1,
					reviewdate:"",
					star:"",
					has_image:'',
				}
				this.$refs.popupMoreFilter.close();
				this.reviewsList = [];
				this.getList();
			},
			getList() {
				uni.showLoading()
				this.$apis.getReviewProduct({product_id:this.id,...this.params}).then(res =>{
					this.reviewsData = res.data;
					this.reviewsList = this.reviewsList.concat(res.data.reviewList)
					this.pageTotal = Math.ceil(res.data.filter_review_count/Number(res.data.review_numPerPage))
					let goodsDetail = res.data.product
					this.shareData = {
						share_from: 'product',
						product_id: goodsDetail.product_id,
						url: goodsDetail.short_url,
						image: goodsDetail.thumbnail_share_img,
						hashtag:goodsDetail.share_hashtag,
						multi_meta_tag:goodsDetail.multi_meta_tag,
						description:goodsDetail.name,
						subject:goodsDetail.share_subject,
						prefix_email_content:goodsDetail.prefix_email_content || '',
						tw_share_description:goodsDetail.share_description
					}
					if(res.data.product_share_content) {
						this.shareData = {...this.shareData,...res.data.product_share_content}
					}
					
					this.$refs.sortSelect.close();
					this.$refs.starSelect.close();
					uni.hideLoading()
				})
			},
			getImgList() {
				this.$apis.getProductReviewsImgList({p:this.img_params_p,spu:this.spu}).then(res=>{
					this.imgList = this.imgList.concat(res.data.list)
					this.img_pageTotal = res.data.maxPage || 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
	::v-deep {
		.page-header-box {
			z-index: 3;
		}
	}
	.menu_mask{
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.4);
		z-index: 1;
		position: fixed;
		top: 0;
		left: 0;
	}
	.reviews-list-box .reviews-box {
		padding: 32rpx;
		padding-top: 8rpx;
		padding-bottom: 18rpx;
		position: relative;
		z-index: 2;
		background: #fff;
	}

	.reviews-list-box .list-content-box {
		padding: 32rpx;
		padding-top: 0;
	}

	.reviews-list-box  .filter-box {
		font-size: 28rpx;
		@include onepxBorder(#F1F1F1);
		@include onepxBorderTop(#F1F1F1);
		height: 96rpx;
	}
	.reviews-list-box .filter-box .filter-item {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.reviews-list-box .filter-box .icon-down {
		font-size: 48rpx;
		margin-left: 8rpx;
	}
	
	.my-filter-box {
		width: 100%;
		height: 96rpx;
		border-top: 1px solid #F1F1F1;
		border-bottom: 1px solid #F1F1F1;
		position: relative;
		z-index: 2;
		background: #fff;
	}
	
	.filter-menu {
		height: 100%;
		width: 50%;
		font-size: 28rpx;
		position: relative;
		.pop_menu{
			position: absolute;
			width: 100vw;		
			background: #fff;
			left: 0;
			top: calc(1px + 100%);
			z-index: 9;
			height: 0;
			transition: all 200ms;
			overflow: hidden;
			border-radius: 0rpx 0rpx 15rpx 15rpx;
			padding: 0 30.77rpx 0 94.23rpx;
			.menu_item{
				width: 100%;
				height: 92.31rpx;
				padding: 0 65.38rpx 0 0;
				color: #666;
				@include onepxBorder(#eee);
				&.selected{
					color: #000;
					font-weight: bold;
				}
				.text{
					font-size: 27rpx;				
					line-height: 32rpx;
				}
				.img_box{
					width: 30.77rpx;
					height: 30.77rpx;
					.img{
						width: 30.77rpx;
						height: 30.77rpx;
					}
				}
			}
		}
		.pop_menu.open{
			height: unset;
		}
	
		.choosed {
			color: #000000;
			font-size: 27rpx;
			line-height: 32rpx;
			height: 38rpx;
			margin-right: 7.69rpx;
		}
	
		.open-pop .down_arrow_img{
			width: 34.62rpx;
			height: 34.62rpx;
		}
		.open-pop .down_arrow_img.open {
			transform: rotate(180deg);
		}
	
	}
	
	.filter-dialog {
		text-align: center;
		width: 50%;
		font-size: 27rpx;
		line-height: 32rpx;
		color: #000000;
		.filter_img{
			width: 34.62rpx;
			height: 34.62rpx;
			margin-left: 7.69rpx;
		}
	}
	.popup-more-filter {
		background: #fff;
		width: 80vw;
		height: 100vh;
		border-radius: 16rpx 0 0 16rpx;
		padding-top: 110rpx;
		display: flex;
		flex-direction: column;
		.header {
			display: flex;
			justify-content: center;
			position: relative;
			font-size: 32rpx;
			font-weight: bold;
			color: #000;
			padding-bottom: 24rpx;
			height: 48rpx;
			@include onepxBorder(#eee);
			box-sizing: content-box;
			.goback {
				width: 48rpx;
				position: absolute;
				left: 42rpx;
			}
		}
		.filter-content-box {
			padding: 62rpx 42rpx;
			flex: 1;
			height: 0;
			overflow-y: auto;
			.filter-item-box {
				margin-bottom: 22rpx;
				.label{
					font-size: 28rpx;
					color: #000;
					font-weight: bold;
					margin-bottom: 22rpx;
				}
				.options-box {
					display: flex;
					flex-wrap: wrap;
					.option-item {
						width: 120rpx;
						height: 60rpx;
						font-size: 24rpx;
						color: #000;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #ccc;
						margin-right: 32rpx;
						margin-bottom: 32rpx;
						border-radius: 4rpx;
					}
					.option-item.on {
						border-color: #000;
					}
				}
				.picture-options-box {
					.picture-option-item {
						font-size: 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 408rpx;
						height: 60rpx;
						line-height: 60rpx;
						border: 1px solid #ccc;
						margin-right: 32rpx;
						margin-bottom: 32rpx;
						border-radius: 4rpx;
					}
					.picture-option-item.on {
						border-color: #000;
					}
				}
			}
		}
		.footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 28rpx;
			@include onepxBorderTop(#eee);
			padding: 30rpx 42rpx 70rpx 42rpx;
			.clear-btn {
				padding: 12rpx 30rpx;
				border: 1px solid #ccc;
				color: #000;
				margin-right: 32rpx;
			}
			.done-btn {
				padding: 12rpx 30rpx;
				border: 1px solid #000;
				color: #fff;
				background: #000;
			}
		}
	}
	.all-reviews-images-box {
		.title-box {
			padding: 22rpx 32rpx;
			.title{
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
			}
			.see-all-photos {
				font-size: 24rpx;
				color: #107EFF;
			}
		}
		.images-wrapper{
			padding-left: 32rpx;
			margin-bottom: 32rpx;
			.images-box {
				display: flex;
				flex-wrap: nowrap;
				.img-item {
					width: 200rpx;
					margin-right: 16rpx;
					height: 200rpx;
					position: relative;
					image {
						width: 200rpx;
						height: 200rpx;
					}
				}
			}
		}
		.scroll-progress-box {
			width: 72rpx;
			height: 4rpx;
			background: #D9D9D9;
			border-radius: 14rpx;
			position: relative;
			margin: auto;
			margin-bottom: 24rpx;
			.current-postion {
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				width: 24rpx;
				border-radius: 14rpx;
				background: #000;
			}
		}
	}
	.all-photos-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99998;
		background: #fff;
		color: #333;
	}
	::v-deep .popup-content.popup-all-phptos {
		background: #fff;
		width: 100vw;
		height: 100vh;
		.header {
			height: 96rpx;
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			position: relative;
			.goback {
				width: 48rpx;
				position: absolute;
			}
			.title {
				font-size: 36rpx;
				color: #333333;
				margin-left: 24rpx;
				font-weight: bold;
				text-align: center;
				flex: 1;
			}
		}
		.all-imgs-box {
			height: calc(100vh - 96rpx);
			padding: 54rpx 32rpx;
			.all-imgs-scroll-view {
				height: 100%;
			}
			.all-box {
				display: flex;
				flex-wrap: wrap;
			}
			.uni-scroll-view-content {
				
				.img-item {
					width: calc((100vw - 96rpx) / 3);
					height: calc((100vw - 96rpx) / 3);
					// position: relative;
					margin-right: 16rpx;
					margin-top: 16rpx;
					image {
						width: 100%;
						height: 100%;
						// position: absolute;
					}
				}
				.img-item:nth-of-type(3n) {
					margin-right: 0;
				}
				.img-item:nth-child(-n+3) {
					margin-top: 0;
				}
			}
		}
	}
</style>
