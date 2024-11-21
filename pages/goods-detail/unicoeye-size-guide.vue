<template>
	<view class="goods-detail-sizeguide-box dui-padding-top-header">
		<pageHeader :styleType="2" :title="$t('goods_detail.size_guide')"></pageHeader>
		<view v-for="(val, key) in sizeGuideTableData">
			<view class="section_title" :style="{color: key == 'For example' ? '#666' : '#222'}">
				<text>{{key}}</text><text v-if="key == 'Notice'">:</text>
			</view>
			<view class="Notice" v-if="key == 'Notice' && notice">{{notice}}</view>
			<view class="section_table">
				<!-- Notice Chart -->
				<!-- 栏目名称是竖列 -->
				<uni-table v-if="key == 'Notice'" :emptyText="$t('goods_detail.no_more_data')">
					<uni-tr class="uni-tr" v-for="(item, index) of val" :key="index">
						<uni-td :class="setColumnTableClass(index, val.length)" align="center">{{ item['A'] }}</uni-td>
						<uni-td :class="setColumnTableClassB(index, val.length)" align="center">{{ item['B'] }}</uni-td>
					</uni-tr>
				</uni-table>
				<!-- Vertex Cobversion Chart / For Example -->
				<!-- 栏目名称是横列 -->
				<uni-table v-else :emptyText="$t('goods_detail.no_more_data')">
					<uni-tr class="uni-tr" v-for="(item, index) of val" :key="index">
						<uni-td :class="setRowTableClass(index, val.length)" align="center">{{ item['A'] }}</uni-td>
						<uni-td :class="setRowTableClassB(index, val.length)" align="center">{{ item['B'] }}</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	export default {
		components: {
			pageHeader
		},
		data() {
			return {
				showCodeData:true,
				id: '',
				codeData: [],
				fitTypeObj: {
					list: {},
					check: ''
				},
				notice: "",
				// 初始化 空模板
				sizeGuideTableData: {
					"Vertex Conversion Chart": [
						{
							"A": "Glasses Sphere",
							"B": "Contacts Shpere"
						},
					],
					"For example": [
						{
							"A": "Glasses Sphere",
							"B": "Contacts Shpere"
						},
					],
					"Notice": [
						{"A":"", "B": ""}
					]
				},
				sizeGuideBanner: []
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.getDetail()
		},
		methods: {
			// 获取sizeguide详情数据
			getDetail() {
				this.$apis.sizeGuideInit({productid:this.id}).then(res =>{
					const {showCodeData, fit_type, product_measurements_data} = res.data || {}
					this.showCodeData = showCodeData;
					this.fitTypeObj.check = fit_type.check;
					this.fitTypeObj.list = fit_type.list
					let pData = product_measurements_data || [];
					this.notice = pData.notice
					if(Object.prototype.toString.call(pData?.value) === '[object Object]') {
						this.sizeGuideTableData = pData?.value
						this.sizeGuideTableData = Object.fromEntries(Object.entries(this.sizeGuideTableData)?.reverse())
					}
					this.sizeGuideBanner = pData?.code_list?.reverse()
					uni.hideLoading();
				}).catch(err => {
					console.log('sizeGuide-getDetail-err：', err);
				})
			},
			setColumnTableClass(index, length) {
				return {
					'key row_key_left_border': true,
					'row_key radius_topleft': index === 0,
					'radius_bottomleft': index === length - 1
				}
			},
			setColumnTableClassB(index, length) {
				return {
					'value value-border': true,
					'row_key radius_topright': index === 0,
					'radius_bottomright': index === length - 1
				}
			},
			setRowTableClass(index, length) {
				return {
					'row_key_left_border': true,
					'key row_key radius_topleft': index === 0,
					'radius_bottomleft': index === length - 1,
					'value value-border': index !== 0
				}
			},
			setRowTableClassB(index, length) {
				return {
					'key row_key radius_topright': index === 0,
					'radius_bottomright': index === length - 1,
					'value value-border': index !== 0
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.goods-detail-sizeguide-box {
		margin: 46.15rpx;
		.section_title {
			font-family: "Montserrat-SemiBold";
			font-weight: 600;
			font-size: 31rpx;
			color: #222;
			margin-bottom: 30.77rpx;
		}
		.Notice {
			font-size: 27rpx;
			color: #393939;
			line-height: 38rpx;
			word-break: break-all;
			margin-bottom: 28.85rpx;
		}
		.section_table {
			margin-bottom: 46.15rpx;
			.uni-tr {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				height: 69rpx;;
				.key, .value {
					color: #666;
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
				}
				.key {
					background: #F5FAFF;
					border-right: 2rpx solid #DFE3EB;
				}
				.row_key {
					border-top: 2rpx solid #DFE3EB;
				}
				.row_key_left_border {
					border-left: 2rpx solid #DFE3EB;
				}
				.value {
					padding: 0;
					font-size: 26.92rpx;
				}
				.value-border {
					border-right: 2rpx solid #DFE3EB;
				}
				.radius_topleft {
					border-radius: 15rpx 0 0 0;
				}
				.radius_topright {
					border-radius: 0 15rpx 0 0;
				}
				.radius_bottomright {
					border-radius: 0 0 15rpx 0;
				}
				.radius_bottomleft {
					border-radius: 0 0 0 15rpx;
				}
			}
		}
		
	}
</style>
