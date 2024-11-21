<template>
	<view class="goods-detail-sizeguide-box dui-padding-top-header">
		<pageHeader :title="$t('goods_detail.size_guide')"></pageHeader>
		<!-- switch to -->
		<view v-if="codeData.length || unitData.length" class="switch-to-box flex justify-content-between align-items-center">
			<view class="left">{{$t("goods_detail.switch_to")}}</view>
			<view class="right flex align-items-center">
				<view v-if="codeData.length && showCodeData" class="country-size-select flex align-items-center" @click="$refs.codeSelect.open('bottom')">
					<text>{{codeData[currentCodeIndex].label}}</text>
					<view class="iconfont icon-down"></view>
				</view>
				<view class="unit-select flex align-items-center">
					<block v-for="(unit,index) in unitData" :key="index">
						<view class="unit-item" :class="index==currentUnitIndex?'on':''" @click="handleUnit(index)">
							{{unit}}
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- fit type -->
		<view class="size-guide-ruler-box" v-if="fitTypeObj.check">
			<view class="ruler-label">{{$t("goods_detail.fit_type")}}</view>
			<view class="ruler-body flex justify-content-between">
				<block v-for="(item,index) in fitTypeObj.list" :key="index">
					<view>
						<view :class="justClass(fitTypeObj.list,index,fitTypeObj.check)" class="ruler-mark">
							<view v-if="fitTypeObj.check == index" class="mark-active"></view>
							<view v-if="index % 2 !== 0" class="mark-label">
								{{item}}
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 分割线 -->
		<view v-if="fitTypeObj.check" class="split-line"></view>
		<!-- tab-表格 -->
		<view class="product-view-Measurements-tabs-box produce-sizeguide-padding">
			<ul class="Measurements-tabs-box flex justify-content-center">
				<block v-for="(item,index) in tabsArr" :key="index">
					<li :class="index==currentTabIndex?'active':''" class="Measurements-tab"
						@click="currentTabIndex = index">
						<view class="Measurements-tab-label">
							{{ item.label }}
						</view>
					</li>
				</block>
			</ul>
			<ul class="Measurements-tabs-content-box">
				<block v-for="(item,index) in tabsArr">
					<li :class="index==currentTabIndex?'active':''" class="Measurements-tab-content">
						<!-- 表格-->
						<view class="measurements-table-box">
							<view class="size-table">
								<block v-if="Array.isArray(measureTableValue[item.value])">
									<uni-table :emptyText="$t('common.empty_text')" v-if="measureTableValue[item.value].length">
										<block v-for="(tr,trIndex) in measureTableValue[item.value]">
											<uni-tr class="size-table-tr">
												<block v-for="(td,tdIndex) in tr">
													<uni-td>{{ td }}</uni-td>
												</block>
											</uni-tr>
										</block>
									</uni-table>
									<view v-else class="empty-content">
										<image class="img" src="/static/images/empty_order.png"></image>
										<view class="text">{{$t('goods_detail.size_guide_empty')}}</view>
									</view>
								</block>
								<block v-else>
									<view class="dress-filter-box flex align-items-center" v-if="Object.keys(measureTableValue[item.value]).length > 1">
										<view @click="currentDressFilterIndex = tableIndex+item.value" class="dress-filter-item" :class="tableIndex+item.value == currentDressFilterIndex?'on':''" v-for="(table,tableKey,tableIndex) in measureTableValue[item.value]" :key="tableKey">
											{{tableKey}}
										</view>
									</view>
									<block v-for="(table,tableKey,tableIndex) in measureTableValue[item.value]">
										<uni-table :emptyText="$t('common.empty_text')" v-if="tableIndex+item.value == currentDressFilterIndex">
											<block v-for="(tr,trIndex) in table">
												<uni-tr class="size-table-tr">
													<block v-for="(td,tdIndex) in tr">
														<uni-td>{{ td }}</uni-td>
													</block>
												</uni-tr>
											</block>
										</uni-table>
									</block>
								</block>
								
							</view>
						</view>
						<!-- 表格温馨提示 -->
						<view v-if="measureNoteValue[item.value]" class="measurements-table-note">
							{{measureNoteValue[item.value]}}
						</view>
						<!-- guideImage and contents -->
						<view class="measurements-contents-and-img-box">
							<view class="measurements-contents" v-html="measureDescValue[item.value]"></view>
							<view class="measurements-img">
								<image mode="widthFix" :src="measureImageValue[item.value]" alt="">
							</view>
						</view>
					</li>
				</block>
			</ul>
		</view>
		<!-- code筛选弹窗 -->
		<singleSelect ref="codeSelect" refName="popupCode" :currentIndex="currentCodeIndex" :options="codeData"
			@change="handleCode">
		</singleSelect>
		<view v-if="!codeData.length && !unitData.length && !fitTypeObj.check && !tabsArr.length " class="empty-content">
			<image class="img" src="/static/images/empty_order.png"></image>
			<view class="text">{{$t('goods_detail.size_guide_empty')}}</view>
		</view>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	import singleSelect from '@/components/singleSelect/singleSelect.vue'
	import popupContentTemplate from '@/components/popupContentTemplate/popupContentTemplate.vue'
	var app = getApp();
	export default {
		components: {
			pageHeader,
			popupContentTemplate,
			singleSelect
		},
		data() {
			return {
				showCodeData:true,
				id: '',
				codeData: [],
				unitData: [],
				currentCodeIndex: 0,
				currentUnitIndex: 1,
				currentDressFilterIndex:'0pMeasureValue',
				fitTypeObj: {
					list: {},
					check: ''
				},
				currentTabIndex: 0,
				tabsArr: [],
				measureTableValue: {
					pMeasureValue: [],
					bMeasureValue: [],
				},
				measureNoteValue: {
					pMeasureValue: '',
					bMeasureValue: '',
				},
				measureDescValue: {
					pMeasureValue: '',
					bMeasureValue: '',
				},
				measureImageValue: {
					pMeasureValue: '',
					bMeasureValue: '',
				},
				modalVisible: false,
			}
		},
		onLoad(e) {
			// 获取sizeguide详情数据
			this.id = e.id;
			this.getDetail()
		},
		methods: {
			// 判断返回className
			justClass(data, index, check) {
				let isCheck = check == index ? 'on' : '';
				let itemPosition = index == Object.keys(data).length ? 'p_last' : index == 1 ? 'p_start' : 'p_center';
				return isCheck + ' ' + itemPosition;
			},
			// 获取sizeguide详情数据
			getDetail() {
				this.$apis.sizeGuideInit({productid:this.id}).then(res =>{
					this.showCodeData = res.data.showCodeData;
					this.fitTypeObj.check = res.data.fit_type.check;
					this.fitTypeObj.list = res.data.fit_type.list
					let pObj = res.data.product_measurements_data || [];
					let bObj = res.data.body_measurements_data || [];
					this.unitData = pObj.unit_list || [];
					if(!this.unitData.length) {
						this.unitData = bObj.unit_list || [];
					}
					const _pCodeData = pObj.code_list || [];
					const _bCodeData = bObj.code_list || [];
					let _codeData = Array.from(new Set(_pCodeData.concat(_bCodeData)));
					this.codeData = _codeData.map(item=>{return{label:item,value:item}})
					// 表格数据
					this.measureTableValue.pMeasureValue = pObj.value || [];
					this.measureTableValue.bMeasureValue = bObj.value || [];
					// 表格温馨提示
					this.measureNoteValue.pMeasureValue = pObj.note;
					this.measureNoteValue.bMeasureValue = bObj.note;
					// 表格描述
					this.measureDescValue.pMeasureValue = pObj.product_measure_desc;
					this.measureDescValue.bMeasureValue = bObj.body_measure_desc;
					// 表格图片
					this.measureImageValue.pMeasureValue = pObj.product_measure_img;
					this.measureImageValue.bMeasureValue = bObj.body_measure_img;
					this.tabsArr = [];
					if (_pCodeData.length) {
						this.tabsArr.push({
							label: 'Product Measurements',
							value: 'pMeasureValue'
						})
					}
					if (_bCodeData.length) {
						this.tabsArr.push({
							label: 'Body Measurements',
							value: 'bMeasureValue'
						})
					}
					uni.hideLoading();
				})
			},
			// 筛选sizeguide数据
			filterSizeGuide() {
				var that = this;
				var data = {
					area:that.codeData[that.currentCodeIndex].value,
					productid:that.id,
					type:'',
					size:that.unitData[that.currentUnitIndex]
				}
				this.$apis.getSizeGuide(data).then(res =>{
					// 表格数据
					that.measureTableValue.pMeasureValue = res.data.product_measurements_value || [];
					that.measureTableValue.bMeasureValue = res.data.body_measurements_value || [];
					// that.tabsArr = [];
					// if (res.data.product_measurements_value && (res.data.product_measurements_value.length || !Array.isArray(res.data.product_measurements_value))) {
					// 	that.tabsArr.push({
					// 		label: 'Product Measurements',
					// 		value: 'pMeasureValue'
					// 	})
					// }
					// if (res.data.body_measurements_value && res.data.body_measurements_value.length) {
					// 	that.tabsArr.push({
					// 		label: 'Body Measurements',
					// 		value: 'bMeasureValue'
					// 	})
					// }
					uni.hideLoading();
				})
			},
			// 点击单位筛选
			handleUnit(index) {
				this.currentUnitIndex = index;
				this.filterSizeGuide()
			},
			// 点击地区筛选
			handleCode(index,item) {
				this.currentCodeIndex = index;
				this.$refs.codeSelect.close();
				this.filterSizeGuide()
			}
		}
	}
</script>

<style scoped>
	@import './css/sizeguide.css';
</style>
