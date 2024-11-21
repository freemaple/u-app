<template>
	<view class="reviews-bar-box">
		<view class="reviews-detail">
			<view class="top flex align-items-center">
				<view class="scores">{{reviewsData.reviw_rate_star_average||0}}.0</view>
				<starRate :num="reviewsData.reviw_rate_star_average"></starRate>
				<view>({{reviewsData.review_count || 0}} {{$t('goods_detail.shop_ratings')}})</view>
			</view>
			<view class="bottom progress-box flex justify-content-between" v-if="reviewsData.reviw_size_fit_info">
				<view class="progress-item">
					<view class="progress-value">{{reviewsData.reviw_size_fit_info.Small}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info.Small+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label">{{$t('goods_detail.small')}}</view>
				</view>
				<view class="progress-item">
					<view class="progress-value">{{reviewsData.reviw_size_fit_info['True to Size']}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info['True to Size']+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label">{{$t('goods_detail.true_to_size')}}</view>
				</view>
				<view class="progress-item">
					<view class="progress-value">{{reviewsData.reviw_size_fit_info.Large}}%</view>
					<view class="clothing-progress">
						<view :style="{width:reviewsData.reviw_size_fit_info.Large+'%'}" class="clothing-progress-active"></view>
					</view>
					<view class="progress-label">{{$t('goods_detail.large')}}</view>
				</view>
			</view>
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
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.reviews-bar-box {
	margin-bottom: 24rpx;
	background: #F3F3F3;
	padding: 32rpx;
}
.reviews-bar-box .top {
	color: #333333;
	font-size: 24rpx;
	margin-bottom: 52rpx;
}
.reviews-bar-box .top .scores {
	font-size: 48rpx;
	font-weight: bold;
	margin-right: 30rpx;
}
.progress-item {
	width: calc((100% - 96rpx) / 3);
	margin-right: 48rpx;
	font-size: 24rpx;
	color: #333333;
}
.progress-item:last-child {
	margin-right: 0;
}
.reviews-bar-box .bottom .clothing-progress {
	width: 100%;
	background: #ddd;
	height: 8rpx;
	border-radius: 18rpx;
	position: relative;
	margin: 10rpx 0;
}

.reviews-bar-box .bottom .clothing-progress .clothing-progress-active {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	background: #000;
	border-radius: 18rpx;
}

</style>