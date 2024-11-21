<template>
	<view class="my-points-box dui-padding-top-header">
		<pageHeader :title="$t('point.title')"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="my-points-main">
			<view class="points-header">
				<view class="total">{{point_amount_total}}</view>
				<view>
					<text>= {{point_offset_amount}} {{$t('point.dollars')}}</text>
				</view>
				<view class="checkin-btn-rj">
					<text class="checkin-btn" @tap="$public.handleNavTo('/pages/my/checkin')">{{$t('point.go_checkin')}}</text>
				</view>
			</view>
			<view class="tabs-box flex justify-content-around">
				<block v-for="(item,index) in tabsArr">
					<view @click="changeTab(item)" class="tab-item" :class="item.type==currentTabObj.type?'on':''">
						{{$t(item.language)}}
					</view>
				</block>
			</view>
			<view class="dividing-line"></view>
			<block v-for="(tab,tabIndex) in tabsArr">
				<block v-if="tab.type == currentTabObj.type">
					<view class="list-box" v-if="tab.list && tab.list.length">
						<block v-for="(item,index) in tab.list">
							<view class="list-item flex justify-content-center align-items-center no-wrap">
								<view class="date">{{item.created_at}}</view>
								<view class="center-box">
									<view class="type">{{item.type}}</view>
									<view v-if="currentTabObj.param !== 'offset' && item.invaild_time" class="e-date">
										{{$t('point.expired_on')}}: {{item.expired_date}}
									</view>
									<view v-if="item.source || item.order_increment_id" class="point-source-box">
										<view v-if="item.order_increment_id" class="point-order">{{$t('point.order')}} # {{item.order_increment_id}}</view>
										<view v-if="item.source" @click="$public.handleNavTo('/pages/point/source?id='+item.id)" class="point-source flex align-items-center">
											<view>{{$t('point.source')}}</view>
											<i class="iconfont icon-arrow-r"></i>
										</view>
									</view>
								</view>
								<view class="point" :class="Number(item.amount)>0?'add':''">{{Number(item.amount)>0?'+':''}}{{item.amount}}</view>
							</view>
						</block>
						<list-loading v-if="tab.list && tab.list.length" v-show="currentTabObj.showLoading"></list-loading>
					</view>
					<view v-else class="empty_work">
						{{$t("point.empty_work")}}
					</view>
				</block>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				point_amount_total:0,
				point_offset_amount:0,
				showLoading: false,
				tabsArr:[
					{
						type: 1,
						param:'',
						language: "point.tab.all",
						list:[],
						currentPage:1,
						totalCounts:0,
						showLoading: false,
						isFirst: true
					},
					{
						type: 2,
						param:'recharge',
						language: "point.tab.earned",
						list:[],
						currentPage:1,
						totalCounts:0,
						showLoading: false,
						isFirst: true
					},
					{
						type: 3,
						param: 'offset',
						language: "point.tab.used",
						list:[],
						currentPage:1,
						totalCounts:0,
						showLoading: false,
						isFirst: true
					},
					{
						type: 4,
						param: 'expired',
						language: "point.tab.expired",
						num: 0,
						list:[],
						currentPage:1,
						totalCounts:0,
						showLoading: false,
						isFirst: true
					}
				],
				currentTabObj: {type:1,param:'',showLoading:false},
				showBacktopBtn: false,
			}
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'points',
				event_action: 'points_visit',
				event_name: 'points_visit'
			})
		},
		onReachBottom() {
			if (this.currentTabObj.showLoading) {
				this.getList(this.currentTabObj.param)
			}
		},
		onPageScroll: function (t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
		},
		methods: {
			changeTab(item) {
				this.currentTabObj = item
				if (this.currentTabObj.isFirst) {
					this.getList(item.param)
				}
			},
			getList(data='') {
				this.$apis.getMyPoint({type:this.currentTabObj.param,p:this.currentTabObj.currentPage || 1}).then(res => {
					this.point_amount_total = res.data.point_amount_total;
					this.point_offset_amount = res.data.point_offset_amount;
					this.tabsArr.map(item => {
						if(item.param == data) {
							item.list = item.currentPage == 1?res.data.point_historys || []:item.list.concat(res.data.point_historys || []);
							item.totalCounts =  res.data.total_counts;
							if(item.isFirst) {
								item.isFirst = false;
							}
							if(item.list.length == item.totalCounts) {
								item.showLoading = false;
							} else {
								item.showLoading = true;
								item.currentPage = item.currentPage + 1;
							}
							this.currentTabObj = item
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.my-points-box {
	.my-points-main {
		.points-header {
			background: #000000;
			color: #ffffff;
			padding: 40rpx 24rpx;
			font-size: 28rpx;
			.total {
				font-size: 86rpx;
			}
			.checkin-btn-rj {
			  display: flex;
			  align-items: center;
			  justify-content: flex-end;
			}
			.checkin-btn {
				padding: 12rpx 30rpx;
				text-align: center;
				border-radius: 20rpx;
				background-color: #f5f5f5;
				color: #333;
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}
		.tabs-box {
			padding: 24rpx 0;
			font-size: 28rpx;
			color: #333333b3;
			.tab-item.on {
				color: #f85184;
			}
		}
		.dividing-line {
			height: 30rpx;
			background: #f6f6f6;
		}
		.list-box {
			.list-item {
				padding: 40rpx 24rpx;
				font-size: 28rpx;
				border-bottom: 1px solid #e5e5e5;
				.date {
					color: #959595;
					width: 150rpx;
					font-size: 24rpx;
				}
				.center-box {
					flex: 1;
					margin: 0 16rpx;
					word-break: break-word;
					.type {
						margin-bottom: 8rpx;
					}
					.e-date {
						color: #959595;
						font-size: 24rpx;
					}
					.point-source-box {
						font-size: 24rpx;
						color: #959595;
						.point-source {
							color: #2d68a8;
							.icon-arrow-r {
								margin-top: 8rpx;
							}
						}
					}
				}
				.point {
					font-size: 24rpx;
				}
				.point.add {
					color: #3fb341;
				}
			}
		}
		.empty_work {
			text-align: center;
			margin: 80rpx 0;
			color: #959595;
		}
	}
}
</style>
