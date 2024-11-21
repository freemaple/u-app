<template>
	<view>
		<uni-table :emptyText="$t('common.empty_text')" class="tier-price-table">
			<block v-for="(tr,trIndex) in tier_price">
				<uni-tr class="size-table-tr">
					<block v-for="(td,tdIndex) in tr">
						<uni-td :class="trIndex==1&&tdIndex === activeIndex?'active':''">{{ td }}</uni-td>
					</block>
				</uni-tr>
			</block>
		</uni-table>
	</view>
</template>

<script>
	export default {
		name:"tier-price",
		props: {
			tier_price: {
				type: Array,
				default: []
			},
			activeIndex: ''
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>

.tier-price-table >>> .uni-table-td.active {
	color: #FF005D;
	font-weight: bold;
}
</style>