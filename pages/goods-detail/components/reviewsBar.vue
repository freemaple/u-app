<template>
	<view class="reviews-bar-box" :style="{'padding-left': paddingLeft}">
		<view class="reviews-detail">
			<view class="top flex align-items-center">
				<view class="scores">{{reviewsData.reviw_rate_star_average||0}}</view>
				<view class="line"></view>
				<view class="star_box">
					<starRate :num="reviewsData.reviw_rate_star_average"></starRate>
					<view class="count">({{reviewsData.review_count || 0}} {{$t('goods_detail.shop_ratings')}})</view>
				</view>
			</view>
			<!-- <view v-if="reviewsData.reviw_size_fit_info"
				class="bottom progress-box flex justify-content-between">
				<view class="progress-item">
					<view class="progress-value font-MM">{{reviewsData.reviw_size_fit_info.Small}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info.Small+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label font-MR">{{$t('goods_detail.natural')}}</view>
				</view>
				<view class="progress-item">
					<view class="progress-value font-MM">{{reviewsData.reviw_size_fit_info['True to Size']}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info['True to Size']+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label font-MR">{{$t('goods_detail.beautiful')}}</view>
				</view>
				<view class="progress-item">
					<view class="progress-value font-MM">{{reviewsData.reviw_size_fit_info.Large}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info.Large+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label font-MR">{{$t('goods_detail.comfortable')}}</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>	
	import starRate from '@/components/star-rate/star-rate.vue'

	export default {
		name:"reviewsBar",
		components: {
			starRate
		},
		props: {
			reviewsData: {
				type: Object,
				default() {
					return {}
				}
			},
			paddingLeft: {
				type: String,
				default: '0rpx'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
.reviews-bar-box {
	padding: 50rpx 0 46.15rpx 0;
	border-top: 2rpx solid #f1f1f1;
	.top {
		color: #222;
		font-size: 23.08rpx;
		.scores {
			width: auto;
			font-family: 'Montserrat-SemiBold';
			font-size: 62rpx;
			font-weight: 600;
			margin-right: 30.77rpx;
			background: linear-gradient(0deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			text-align: left;
		}
		.line {
			margin-right: 30.77rpx;
			width: 2rpx;
			height: 65rpx;
			background: #666666;
			border-radius: 12rpx;
		}
		.star_box {
			.count {
				font-family: "Montserrat-Regular";
				font-size: 23rpx;
				color: #222;
				line-height: 27rpx;
				margin-top: 7.69rpx;
			}
		}
	}
	
	// .bottom {
	// 	.clothing-progress {
	// 		width: 100%;
	// 		background: #ddd;
	// 		height: 8rpx;
	// 		border-radius: 18rpx;
	// 		position: relative;
	// 		margin: 10rpx 0;
	// 		.clothing-progress-active {
	// 			position: absolute;
	// 			top: 0;
	// 			bottom: 0;
	// 			left: 0;
	// 			background: #000;
	// 			border-radius: 18rpx;
	// 		}
	// 	}
	// }
}


// .progress-item {
// 	width: calc((100% - 96rpx) / 3);
// 	margin-right: 48rpx;
// 	font-size: 24rpx;
// 	color: #333333;
// }
// .progress-item:last-child {
// 	margin-right: 0;
// }

</style>