<template>
	<view class="distribute-profit-box dui-padding-top-header">
		<pageHeader :title="$t('distribute.profit.title')"></pageHeader>
        <view class="profit-list-box">
			<block v-if="list && list.length">
				<view v-for="(item,index) in list" :key="index" class="item-box">
					<view class="flex justify-content-between align-items-center">
						<view><text class="font-bold">{{$t('distribute.profit.order_num')}}:{{'&nbsp;'}}</text>{{item.increment_id}}</view>
						<view><text class="font-bold">{{$t('distribute.profit.profit')}}:{{'&nbsp;'}}</text>{{item.distribute_profit_str}}</view>
					</view>
					<view class="status"><text class="font-bold">{{$t('distribute.profit.status')}}:{{'&nbsp;'}}</text>{{item.status_str}}</view>
				</view>
			</block>
			<empty :show_btn="true" v-else></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				this.$apis.distributeProfit().then(res => {
					this.list = res.data.items || [];
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
.distribute-profit-box {
	.profit-list-box {
		padding-bottom: 24rpx;
		.item-box {
			padding: 24rpx;
			border-bottom: 1px solid #00000014;
			font-size: 28rpx;
			color: #333;
			.status {
				margin-top: 48rpx;
			}
		}
	}
}
</style>
