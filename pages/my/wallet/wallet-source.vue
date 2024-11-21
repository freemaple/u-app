<template>
	<view class="point-source-box dui-padding-top-header">
		<pageHeader :title="$t('my_wallet.source_title')"></pageHeader>
		<view class="list-box" v-if="list && list.length">
			<walletItem :list="list" :symbol="symbol"></walletItem>
			<list-loading v-show="showLoading"></list-loading>
		</view>
	</view>
</template>

<script>
	import walletItem from "./wallet-item.vue"
	export default {
		components:{
			walletItem
		},
		data() {
			return {
				id: '',
				symbol:'',
				list:[],
				currentPage:1,
				totalCounts:0,
				showLoading: false
			}
		},
		methods: {
			getList() {
				this.$apis.getWalletSource({id:this.id,p:this.currentPage}).then(res => {
					this.list = this.currentPage == 1?res.data.list || []:this.list.concat(res.data.list || []);
					this.totalCounts =  res.data.total_counts;
					this.symbol = res.data.symbol;
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
