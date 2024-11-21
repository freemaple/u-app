<template>
	<view class="review-list-item">
		<view class="top flex justify-content-between align-items-center no-wrap">
			<view class="flex align-items-center top-left">
				<view class="name">{{reviewData.name}}</view>
				<starRate :num="Number(reviewData.rate_star)"></starRate>
			</view>
			<view class="points-program-box">
				<view class="points-program">{{$t('review_list.points_program')}}</view>
				<view class="points-program-hover-content">
					{{ $t('review_list.points_program_content', {site_name: $store.state.site_name_upper}) }}
				</view>
			</view>
		</view>
		<view class="date-attr-box flex align-items-center">
			<view class="date">
				{{reviewData.new_review_date}}
			</view>
			<!-- <view class="attr-box">
				<block v-for="(item,index) in reviewData.product_option">
					<text>{{item.key}}: {{item.value}}</text> <text class="option-split" v-if="index+1 != reviewData.product_option.length">/</text>
				</block>
			</view> -->
		</view>
		<view class="contents-box">
			<view class="contents" :class="viewMore?'open':''">
				<text v-if="!viewMore" 
					@click="viewMore = !viewMore;showSizeMore=true;" 
					class="view-more-btn">
					{{$t('review_list.see_more')}}
				</text>
				{{reviewData.review_content}}
			</view>
		</view>
		<view class="images" v-if="reviewData.review_images && reviewData.review_images.length">
			<view class="img-box" v-for="(img,index) in reviewData.review_images" :key="index">
				<image @click="partLoadingName=='listImg'+index?'':handleReviewItem(index,'listImg'+index)" mode="widthFix" :src="img"></image>
				<partLoading :show="partLoadingName=='listImg'+index"></partLoading>
			</view>
		</view>
		<view class="points-program-helpful-box flex justify-content-between align-items-baseline">
			<view class="attr-box">
				<block v-for="(item,index) in reviewData.product_option">
					<text>{{item.key}}: {{item.value}}</text> 
					<text v-if="index+1 != reviewData.product_option.length" class="option-split" >/</text>
				</block>
			</view>
			
			<!-- <view class="body-size-box">
				<view v-if="sizeArr.firstLineArr&&sizeArr.firstLineArr.length" class="flex align-items-center">
					<block v-for="(item,index) in sizeArr.firstLineArr">
						<text :key="index">
							<block v-if="item.label">{{item.label}}: {{item.value}}</block>
							<block v-else>{{item.value}}</block>
						</text>
						<text v-if="index+1!=sizeArr.firstLineArr.length" class="split-icon">,</text>
					</block>						
					<image v-if="sizeArr.secondLineArr&&sizeArr.secondLineArr.length" @click="showSizeMore=!showSizeMore" class="arrow-img" :class="showSizeMore?'bottom':'right'" src="@/static/images/p_detail_arrow_right@2x.png" mode="widthFix"></image>
				</view>
				
				<view class="size-box" v-if="sizeArr.secondLineArr&&sizeArr.secondLineArr.length&&showSizeMore">
					<view class="size-item" v-for="(item,index) in sizeArr.secondLineArr" :key="index">
						<text v-if="item.label">{{item.label}}: {{item.value}}</text>
						<text v-else>{{item.value}}</text>
					</view>
				</view>
			</view> -->
			<view class="review-item-tools-box flex align-items-center">
				<view @click="handleHelpful(reviewData)" class="helpful-item-js flex align-items-center" :class="reviewData.is_helpful?'on':''">
					<view class="helpful-img"></view>
					<view>{{ $t('review_list.helpful')}}<text class="helpful-nums-js">{{Number(reviewData.helpful_nums)?' ('+reviewData.helpful_nums+')':''}}</text></view>
				</view>
				<!-- <view class="more-js"></view> -->
			</view>
		</view>
		<!-- 评论详情弹窗 -->
		<reviewDetailDialog @handleUpdateShareData="$emit('handleUpdateShareData')" ref="reviewDetail" :itemDetail="itemDetail" :shareData="shareData" @changeHelpful="(data)=>{$emit('changeHelpful',data)}"></reviewDetailDialog>
	</view>
</template>

<script>
	import starRate from '@/components/star-rate/star-rate.vue'
	import partLoading from '@/components/part-loading/part-loading.vue'
	import reviewDetailDialog from '@/components/review-detail-dialog/review-detail-dialog.vue'
	export default {
		name:"reviewListItem",
		components: {
			starRate,
			partLoading,
			reviewDetailDialog
		},
		props: {
			reviewData: {
				type: Object,
				default () {
					return {}
				}
			},
			shareData: {
				type: Object,
				default() {
					return {}
				}
			},
			scrollTop: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		watch: {
			reviewData:{
				handler(newValue,oldValue) {
					if(!newValue.sizeDetailData) {
						var sizeDetailArr=[];
						if(newValue.size_fit) {
							sizeDetailArr.push({value:newValue.size_fit})
						}
						if(newValue.size_bust) {
							sizeDetailArr.push({value:newValue.size_bust,label:this.$t('review_add.Bust')})
						}
						if(newValue.size_height) {
							sizeDetailArr.push({value:newValue.size_height,label:this.$t('review_add.Height')})
						}
						if(newValue.size_weight) {
							sizeDetailArr.push({value:newValue.size_weight,label:this.$t('review_add.Weight')})
						}
						if(newValue.size_waist) {
							sizeDetailArr.push({value:newValue.size_waist,label:this.$t('review_add.Waist')})
						}
						if(newValue.size_hips) {
							sizeDetailArr.push({value:newValue.size_hips,label:this.$t('review_add.Hips')})
						}
						if(sizeDetailArr.length>2) {
							var copySizeDetailArr = [...sizeDetailArr];
							copySizeDetailArr.splice(0, 2);
							this.sizeArr={firstLineArr:[sizeDetailArr[0],sizeDetailArr[1]],secondLineArr:copySizeDetailArr}
						} else {
							this.sizeArr = {firstLineArr:sizeDetailArr};
						}
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				showSizeMore:false,
				sizeArr:{},
				open: false,
				itemDetail: {},
				swiperIndex:0,
				partLoadingName:'',
				viewMore:false,
			}
		},
		methods: {
			handleReviewItem(index,loadingName) {
				this.partLoadingName = loadingName
				this.swiperIndex = index;
				this.$apis.getReviewsDetail({review_id:this.reviewData.id}).then(res => {
					this.itemDetail = res.data
					this.partLoadingName = ''
					this.$refs.reviewDetail.open(index);
				}).catch(e=>{
					this.partLoadingName = ''
				})
			},
			handleHelpful(data) {
				const that = this
				this.$apis.reviewHelpful({review_id:data.id}).then(res=>{
					uni.hideLoading();
					this.$emit('changeHelpful',res.data)
				}).catch(e=>{
					if(e.code == '1100003'){	
						console.log(that.scrollTop,'that.scrollTop');					
						uni.setStorageSync('page_scroll_top', that.scrollTop)
						uni.setStorageSync('changeReviewHelpful', data.id);
					}
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

.review-list-item {
	border-bottom: 1px solid #f5f5f5;
	padding: 46.15rpx 0;
}
.review-list-item .top .top-left {
	flex: 1;
	width: 0;
}
.review-list-item .name {
	margin-right: 20rpx;
	max-width: 220rpx;
	overflow: hidden;
	text-overflow: ellipsis;
}
.review-list-item .contents-box {
	display: flex;
	margin-top: 24rpx;
	overflow: hidden;
}
.review-list-item .contents {
	font-size: 26.92rpx;
	word-break: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	// text-align: justify;
	white-space: break-spaces;
	position: relative;
	line-height: 1.5;
	max-height: 4.5em;
	transition: .3s max-height;
}
.review-list-item .contents::before{
  content: '';
  float: right;
  height: calc(100% - 46rpx);
}
.review-list-item .contents::after {
	content: '';
	width: 999vw;
	height: 999vw;
	position: absolute;
	box-shadow: inset calc(200rpx - 999vw) calc(60rpx - 999vw) 0 0 #fff;
	margin-left: -200rpx;
}
.review-list-item .contents.open {
	max-height: none;
}
.review-list-item .contents.open::after{
  visibility: hidden;
}
.review-list-item .contents.open .view-more-btn::before{
  visibility: hidden;
}
.review-list-item .contents .view-more-btn {
	display: flex;
	position: relative;
	float: right;
	clear: both;
	font-size: 23.08rpx;
	margin-left: 30rpx;
	padding: 0 16rpx;
	color: #0071E3;
	line-height: 48rpx;
	::before{
	  content: '...';
	  position: absolute;
	  left: -4rpx;
	  color: #333;
	  font-size: 33.08rpx;
	  transform: translateX(-100%)
	}
}
.review-list-item .images {
	display: flex;
	flex-wrap: wrap;
	margin-top: 40rpx;
}
.review-list-item .images .img-box {
	margin-right: 20rpx;
	margin-top: 20rpx;
	position: relative;
}
.review-list-item .images image {
	width: 236rpx;
}
// .review-list-item .images .img-box:nth-of-type(2n) {
// 	margin-right: 0;
// }
.review-list-item .date-attr-box {
	font-size: 23.08rpx;
	font-family: "Montserrat-Regular";
	font-weight: 400;
	color: #999999;
	margin-top: 16rpx;
}
.attr-box {
	font-family: "Montserrat-Regular";
	color: #999;
}
.review-list-item .date {
	margin-right: 32rpx;
}
.review-list-item .options-box {
	margin-top: 10rpx;
}
.review-list-item .options-box .option-item {
	color: #767676;
	font-size: 24rpx;
	margin-right: 20rpx;
}
.review-item-tools-box .helpful-item-js {
    position: relative;
}
.points-program-helpful-box {
    color: #999;
    padding-top: 40rpx;
	font-size: 24rpx;
}

.body-size-box {
	line-height: 42rpx;
	flex: 1;
	width: 0;
	.split-icon {
		margin-right: 10rpx;
	}
	.arrow-img.right {
		width: 36rpx;
		margin-left: 16rpx;
	}
	.arrow-img.bottom {
		width: 36rpx;
		transform: rotate(90deg);
		margin-left: 16rpx;
	}
	.size-box {
		display: flex;
		flex-wrap: wrap;
		.size-item {
			width: 50%;
		}
	}
}
.points-program{
    background: #F5F5F5;
    color: #999;
    padding: 7.69rpx 15.38rpx;
	font-size: 19.23rpx;
	border-radius: 38rpx;
}
.review-item-tools-box .helpful-item-js .helpful-img {
    width: 36rpx;
    height: 36rpx;
	background-image: url('@/static/images/p_detail_support_icon@2x.png');
    background-size: cover;
    margin-right: 10rpx;
}
.review-item-tools-box .helpful-item-js.on .helpful-img {
    background-image: url('@/static/images/p_detail_support_icon_sel_pink@2x.png');
}
.review-item-tools-box .more-js {
    margin-left: 10rpx;
    width: 36rpx;
    height: 36rpx;
    background-image: url('@/static/images/icon/more-icon.png');
    background-size: cover;
}
.points-program-box {
    position:relative;
	margin-left: 10rpx;
}
.points-program-box .points-program-hover-content {
    position: absolute;
    right: 0px;
    top: 60rpx;
    width: 500rpx;
    border-radius: 5px;
    background: #fff;
    color: #666666;
    font-size: 24rpx;
    padding: 20rpx;
    box-shadow: 0 2px 5px rgba(0,0,0,.08);
    z-index: 1;
    display: none;
    border: 1px solid #f2f2f2;
    white-space: normal;
}
.points-program-box:hover .points-program-hover-content {
    display: block;
}
.points-program-box .points-program-hover-content:before {
    top: -12rpx;
    right: 40rpx;
    content: '';
    position: absolute;
    transform: rotate(45deg);
    width: 24rpx;
    background: #fff;
    border-top: 1px solid #f2f2f2;
    height: 24rpx;
    border-left: 1px solid #f2f2f2;
}
.option-split {
	padding: 0 10rpx;
}
</style>