<template>
	<view>
		<!-- 评论详情弹窗 -->
		<uni-popup :ref="refName">
			<view class="popup-content popup-review-item-detail" v-if="itemDetailData.review_images&&itemDetailData.review_images.length">
				<view class="header">
					<image @click="close()" class="close" mode="widthFix" src="@/static/images/p_detail_left_arrow_white@2x.png" />
					<view class="review-detail-dots">{{swiperIndex+1}}/{{itemDetailData.review_images.length}}</view>
					<image class="share" mode="widthFix" @click.stop="handleShare()" src="@/static/images/p_detail_share_2_white@2x.png" />
				</view>
				<view class="images-box">
					<swiper :style="{ height: '100vw'}" class="swiper_box"
						:current="swiperIndex" :autoplay="false" circular="false" :interval="10000" :duration="500"
						:display-multiple-items="1"
						@change="changeSwiper"
					>
						<block v-for="(item, index) in itemDetailData.review_images" :key="index">
							<swiper-item>
								<image :src="item" class="slide-image" :lazy-load="true"
									mode="aspectFill" />
							</swiper-item>
						</block>
					</swiper>
				</view>
				<view class="detail-content-box">
					<view class="top-box">
						<view class="left">
							<view class="name">{{itemDetailData.name}}</view>
							<starRate :num="itemDetailData.rate_star"></starRate>
						</view>
						<view @click="handleHelpful(itemDetailData,'dialogHelpful')" class="helpful-item-js flex align-items-center" :class="itemDetailData.is_helpful?'on':''">
							<view class="helpful-img"></view>
							<view>{{ $t('review_list.helpful')}}<text class="helpful-nums-js">{{Number(itemDetailData.helpful_nums)?' ('+itemDetailData.helpful_nums+')':''}}</text></view>
						</view>
					</view>
					<view class="attr">
						<block v-for="(item,index) in itemDetailData.product_option">
							<text>{{item.key}}: {{item.value}}</text><text class="option-split" v-if="index+1 != itemDetailData.product_option.length">/</text>
						</block>
					</view>
					<view class="review-content">{{itemDetailData.review_content}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 分享弹窗 -->
		<sharePopup @clickBarItem="(type)=>{handleClickBarItem(type)}" key_prefix="product_share_" ref="popupShareReviewDetail" :isDifferPlatformWord="true" :shareData="{...shareData,from_page:'product_detail_comment'}" :title="$t('fission_sharing.share_popup_title')"></sharePopup>
		<customTooltip ref="tooltipReviewDetail" :title="$t('fission_sharing.share_success_text')"></customTooltip>
	</view>
</template>

<script>
	import starRate from '@/components/star-rate/star-rate.vue';
	import sharePopup from '@/components/sharePopup/sharePopup.vue';
	import customTooltip from '@/components/custom-tooltip/custom-tooltip.vue'
	export default {
		name:"review-detail-dialog",
		components:{
			starRate,
			sharePopup,
			customTooltip
		},
		computed:{
			itemDetailData() {
				return this.itemDetail
			}
		},
		props: {
			itemDetail: {
				type: Object,
				default() {
					return {}
				}
			},
			shareData:{
				type: Object,
				default() {
					return {}
				}
			},
			refName: {
				type: String,
				default: 'popupReviewItemDetailDialog'
			}
		},
		data() {
			return {
				swiperIndex:0,
				isShared:false, // 是否点击了分享
			};
		},
		beforeDestroy () {
		    uni.$off('loginSuccess');
		    uni.$off('onParentShow');
		},
		methods: {
			handleClickBarItem(type) {
				if(type != 'more') {
					this.isShared = true
				}
			},
			handleShare() {
				if(this.$store.getters.hasLogin) {
					if(this.shareData&&this.shareData.url) {
						this.$refs.popupShareReviewDetail.open('bottom');
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/index?is_special=1&in_site_source=review&loginNavigateBack=1&loginNavigateBackType=clickReviewShare'
					});
				}
				this.$trackEvent.open_share_code({
					from_page: 'product_detail_comment',
					event_name: 'open share from product detail page',
					event_action: 'open_share_product',
					product_id:this.itemDetail.product_id
				});
			},
			changeSwiper(e) {
				this.swiperIndex = e.detail.current
			},
			open(index) {
				this.swiperIndex = index;
				this.$refs[this.refName].open('right');
				uni.$off('loginSuccess').$on("loginSuccess", (data) => {
					if(data.loginNavigateBackType == 'clickReviewShare'){
						this.$emit('handleUpdateShareData')
						if(this.shareData&&this.shareData.url) {
							this.$refs.popupShareReviewDetail.open('bottom');
						}
					}
				});
				uni.$off('onParentShow').$on("onParentShow",()=>{
					console.log('onParentShow===');
					if(this.isShared) {
						this.$refs.popupShareReviewDetail.close();
						this.$refs.tooltipReviewDetail.open({time:2000});
						this.isShared = false;
					}
				});
			},
			close() {
				this.$refs[this.refName].close();
				uni.$off('loginSuccess');
				uni.$off('onParentShow');
			},
			handleHelpful(data) {
				this.$apis.reviewHelpful({review_id:data.id}).then(res=>{
					uni.hideLoading();
					if(this.itemDetailData.is_helpful) {
						this.itemDetailData.is_helpful=0
						this.itemDetailData.helpful_nums = this.itemDetailData.helpful_nums-1
					} else {
						this.itemDetailData.is_helpful=1
						this.itemDetailData.helpful_nums = this.itemDetailData.helpful_nums+1
					}
					this.$emit('changeHelpful',res.data)
				}).catch(e=>{
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .popup-content.popup-review-item-detail {
	background: #000;
	width: 100vw;
	height: 100vh;
	position: relative;
	color: #fff;
	overflow-y: auto;
	.option-split {
		padding: 0 8rpx;
	}
	.header {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 112rpx 32rpx 96rpx 32rpx;
		.share {
			width: 48rpx;
		}
		.close {
			width: 48rpx;
		}
		.review-detail-dots {
			
		}
	}
	.images-box {
		.swiper_box {
			.slide-image {
				width: 100%;
				height: 100%;
				background: #fff;
				div {
					background-size: contain !important;
				}
			}
		}
	}
	.detail-content-box {
		padding: 54rpx 44rpx 44rpx 44rpx;
		.top-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left {
				display: flex;
				align-items: center;
				.name {
					font-size: 28rpx;
				}
			}
			.helpful-item-js {
				position: relative;
				font-size: 24rpx;
			}
			.helpful-item-js .helpful-img {
				width: 36rpx;
				height: 36rpx;
				background-image: url('@/static/images/p_detail_support_icon_white@2x.png');
				background-size: cover;
				margin-right: 10rpx;
			}
			.helpful-item-js.on .helpful-img {
				background-image: url('@/static/images/p_detail_support_icon_sel@2x.png');
			}
		}
		.attr {
			font-size: 28rpx;
			color: #aaaaaa;
			margin-top: 12rpx;
		}
		.review-content {
			margin-top: 26rpx;
			font-size: 32rpx;
		}
	}
}
</style>