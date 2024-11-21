<template>
	<view class="my-examine-box dui-padding-top-header">
		<pageHeader :title="$t('drop_examine.title')"></pageHeader>
		<view class="examine-table">
			<view class="tip">
				<view class="table-tip">{{$t('drop_examine.tip1')}}</view>
				<view class="table-title font-bold">{{$t('drop_examine.table_header')}}</view>
			</view>
			<uni-table :emptyText="$t('common.empty_text')" v-if="list.length">
				<uni-tr class="examine-table-tr">
					<uni-td>{{$t('drop_examine.number')}}</uni-td>
					<uni-td>{{$t('drop_examine.tyle')}}</uni-td>
					<uni-td>{{$t('drop_examine.status')}}</uni-td>
					<uni-td>{{$t('drop_examine.create_time')}}</uni-td>
					<uni-td>{{$t('drop_examine.update_time')}}</uni-td>
				</uni-tr>
				<block v-for="(item,index) in list">
					<uni-tr class="examine-table-tr">
						<uni-td>{{index+1}}</uni-td>
						<uni-td>{{item.record_type}}</uni-td>
						<uni-td>{{item.apply_status}}</uni-td>
						<uni-td>{{item.created_at}}</uni-td>
						<uni-td>{{item.updated_at}}</uni-td>
					</uni-tr>
				</block>
			</uni-table>
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
			getList(){
				this.$apis.dropShippingExamine().then(res=>{
					this.list = res.data.records || []
				})
			}
		}
	}
</script>

<style scoped>
.examine-table {
	overflow: auto;
	padding: 24rpx;
}
.table-tip {
	margin-bottom: 24rpx;
}
.table-title {
	margin-bottom: 24rpx;
}
.examine-table >>> .uni-table {
	border-collapse: collapse;
	min-width: 100%;
}

.examine-table .examine-table-tr {
	text-align: center;
}

.examine-table .examine-table-tr:first-child .uni-table-td,
.examine-table .examine-table-tr .uni-table-td:first-child {
	table-layout: fixed;
	font-weight: 700;
}

.examine-table .examine-table-tr .uni-table-td {
	border: 1px solid #e5e5e5;
	padding: 0 8rpx;
	min-width: 60rpx;
	height: 76rpx;
	color: #222;
	white-space: nowrap;
	line-height: 76rpx;
}

.examine-table .examine-table-tr .uni-table-td {
	font-size: 26rpx;
	text-align: center !important;
}
</style>
