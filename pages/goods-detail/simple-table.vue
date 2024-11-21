<template>
		<view class="param-item" v-if="filterData(tableData)">
			<uni-table>
				<uni-tr v-for="(value, key, index) of filterData(tableData)" :key="key" class="uni-tr"
					:class="setRadius(index)">
					<uni-td class="key flex-cc"  align="center">{{ upperAttrKey(key) }}</uni-td>
					<uni-td class="value flex-cc" align="center">{{ value }}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
</template>

<script>
	export default {
		name: "simpleTable",
		props: {
			tableData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				dataLen: 0
			}
		},
		methods: {
			filterData(tableData) {
				let result = {}
				for(let key in tableData) {
					if(tableData[key] && !['effect_desc', 'effect_image', 'Packaging_desc'].includes(key)) {
						result[key] = tableData[key]
					}
				}
				this.dataLen = Object.keys(result).length
				return result
			},
			// 接口返回数据键值格式 a_b， 转为 A b
			upperAttrKey(key) {
				if(key.includes('_')) {
					return key.split('_').map(i => {
						return typeof i == 'string' ? i.charAt(0).toUpperCase() + i.slice(1) : i
					}).join(" ")
				} else {
					return key
				}
			},
			setRadius(index) {
				if(index === 0) {
					return 'top_radius'
				}
				if(index === this.dataLen - 1) {
					return 'bottom_radius'
				}
			}
			// 在列表上，隐藏接口返回的一些字段
			// hiddenArrs(value,key) {
			// 	if(!(this.type == 1 && key.toLowerCase() =='size')) {
			// 		return !['effect_desc', 'effect_image', 'Packaging_desc'].includes(key) && value
			// 	}
			// },
		}
	}
</script>

<style lang="scss">
	.param-item {
		margin-bottom: 30.77rpx;
		border-top: 2rpx solid #DFE3EB;
		border-radius: 15rpx;
		.key {
			color: #666;
			background: #F5FAFF;
			border-left: 2rpx solid #DFE3EB;
		}
		/deep/ .uni-table-td {
			border-bottom: 2rpx solid #DFE3EB;
			border-right: 2rpx solid #DFE3EB;
		}
		.value {
			color: #222;
			padding: 0;
			font-size: 23.08rpx;
		}
		.top_radius {
			.key {
				border-radius: 15rpx 0 0 0; 
			}
			.value {
				border-radius: 0 15rpx 0 0; 
			}
		}
		.bottom_radius {
			.key {
				border-radius: 0 0 0 15rpx; 
			}
			.value {
				border-radius: 0 0 15rpx 0; 
			}
		}
	}
</style>