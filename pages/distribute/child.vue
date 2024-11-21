<template>
	<view class="distribute-child-box dui-padding-top-header">
		<pageHeader :title="$t('distribute.child.title')"></pageHeader>
        <view class="child-list-box">
			<block v-if="list && list.length">
				<view v-for="(item,index) in list" :key="index" class="item-box">
					<view class="flex justify-content-between align-items-center">
						<view>{{item.email}}</view>
						<view class="time">{{$t('distribute.child.end_date')}}: {{item.distribute_expired_at_str}}</view>
					</view>
					
					<view class="flex justify-content-between align-items-center">
						<view class="status">{{$t('distribute.child.status')}}: {{item.distribute_status_str}}</view>
						<view class="status">{{$t('distribute.child.enable_date')}}: {{item.distribute_enable_at_str}}</view>
					</view>
				</view>
			</block>
			<empty v-else :show_btn="true"></empty>
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
				this.$apis.distributeChild().then(res => {
					this.list = res.data.childColl || [];
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
.distribute-child-box {
	.child-list-box {
		padding-bottom: 24rpx;
		.item-box {
			padding: 24rpx;
			border-bottom: 1px solid #00000014;
			font-size: 24rpx;
			color: #333;
			.status {
				margin-top: 48rpx;
			}
		}
	}
}
</style>
