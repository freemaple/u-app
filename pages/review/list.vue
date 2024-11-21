<template>
	<view class="review-list-box dui-padding-top-header">
		<pageHeader :title="$t('review_list.header')"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="review-list-content">
			<block v-if="list && list.length">
				<block v-for="(item, index) in list" :key="index">
					<view class="review-list-item">
						<view class="order-num">
							<text>{{$t('review_list.order_num')}}:{{'&nbsp;'}}</text><text>{{item.order_no}}</text>
						</view>
						<view class="top flex justify-content-between align-items-start">
							<view class="user-avatar" @click="$public.handleNavTo('/pages/goods-detail/index?id='+item.product_id)">
								<image style="width: 160rpx;" mode="widthFix" :src="item.product_image"></image>
							</view>
							<view>
								<fiveStarPraise starSize="32rpx" :num="Number(item.rate_star)"></fiveStarPraise>
							</view>
						</view>
						<view class="contents">{{item.review_content}}</view>
						<view class="images" v-if="item.review_images">
							<block v-for="(img,index) in item.review_images" :key="index">
								<image class="img-item" mode="widthFix" :src="img"></image>
							</block>
						</view>
						<view class="date">{{item.new_review_date}}</view>
					</view>
				</block>
			</block>
			
			<empty v-else></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				p: 1, // 当前页数
				pageTotal: 1, // 总页数
				list: [],
				showBacktopBtn: false,
				isLoad:false,
			}
		},
		onReachBottom() {
			if (this.p < this.pageTotal) {
				this.p++;
				this.getList()
			}
		},
		onShow() {
			if(!this.isLoad || (this.isLoad && this.$store.getters.hasLogin)) {
				this.getList();
			}
			this.$maEvent.visit_event({
				event_category: 'my_reviews',
				event_action: 'my_reviews_visit',
				event_name: 'my_reviews_visit'
			})
		},
		onPageScroll: function (t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
		},
		methods: {
			getList() {
				this.$apis.myReviewsList({
					p: this.p
				}).then(res => {
					const result = res.data;
					this.list = this.p == 1 ? result.user_comment_list : this.list.concat(result.user_comment_list);
					this.pageTotal = result.page_count;
					this.isLoad = true;
					uni.hideLoading();
				}).catch(e=>{
					uni.hideLoading();
					this.isLoad = true;
				})
			}
		}
	}
</script>

<style scoped>
.review-list-box .review-list-content {
	padding: 24rpx;
}
.review-list-box .review-list-content .review-list-item {
	border-top: unset;
	border-bottom: 1px solid #e5e5e5;
}
.review-list-item {
	border-top: 1px solid #e5e5e5;
	padding: 24rpx 0;
}
.review-list-item .contents {
	margin-top: 24rpx;
	font-size: 28rpx;
	word-break: break-word;
	max-height: 280rpx;
	overflow-y: auto;
}
.review-list-item .images {
	display: flex;
	flex-wrap: wrap;
	margin-top: 24rpx;
}
.review-list-item .images .img-item {
	width: calc(50% - 10rpx);
	margin-right: 20rpx;
	margin-top: 20rpx;
}
.review-list-item .images .img-item:nth-of-type(2n) {
	margin-right: 0;
}
.review-list-item .images .img-item:nth-child(-n+2) {
	margin-top: 0;
}
.review-list-item .date {
	font-size: 28rpx;
	color: #999999;
	padding-top: 24rpx;
}
.order-num {
	padding-bottom: 24rpx;
}
</style>
