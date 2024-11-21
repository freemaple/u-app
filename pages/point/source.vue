<template>
	<view class="point-source-box dui-padding-top-header">
		<pageHeader :title="$t('point.source_title')"></pageHeader>
		<view class="list-box" v-if="list && list.length">
			<block v-for="(item,index) in list">
				<view class="list-item flex justify-content-center align-items-center no-wrap">
					<view class="date">{{item.created_at}}</view>
					<view class="center-box">
						<view class="type">{{item.type}}</view>
						<view v-if="item.invaild_time" class="e-date">
							{{$t('point.expired_on')}}: {{item.expired_date}}
						</view>
					</view>
					<view class="point" :class="Number(item.amount)>0?'add':''">{{Number(item.amount)>0?'+':''}}{{item.amount}}</view>
				</view>
			</block>
			<list-loading v-show="showLoading"></list-loading>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				list:[],
				currentPage:1,
				totalCounts:0,
				showLoading: false
			}
		},
		methods: {
			getList() {
				this.$apis.getPointSource({id:this.id,p:this.currentPage}).then(res => {
					this.list = this.currentPage == 1?res.data.list || []:this.list.concat(res.data.list || []);
					this.totalCounts =  res.data.total_counts;
					if(this.list.length == this.totalCounts) {
						this.showLoading = false;
					} else {
						this.showLoading = true;
						this.currentPage = this.currentPage + 1;
					}
				})
			}
		},
		
		onReachBottom() {
			if (this.showLoading) {
				this.getList()
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.getList()
		}
	}
</script>

<style lang="scss" scoped>
.list-box {
	.list-item {
		padding: 40rpx;
		font-size: 28rpx;
		border-bottom: 1px solid #e5e5e5;
		.date {
			color: #959595;
			width: 150rpx;
			font-size: 24rpx;
		}
		.center-box {
			flex: 1;
			margin: 0 30rpx;
			word-break: break-word;
			.type {
				margin-bottom: 8rpx;
			}
			.e-date {
				color: #959595;
				font-size: 24rpx;
			}
		}
		.point.add {
			color: #3fb341;
		}
	}
}
</style>
