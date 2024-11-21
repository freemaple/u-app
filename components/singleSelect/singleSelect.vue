<!-- 单选下拉框弹窗 -->
<template>
	<uni-popup :ref="refName" background-color="#fff">
		<popupContentTemplate :title="isShowTitle?$t('single_select.title'):''" @close="$refs[refName].close()">
			<template v-slot:content>
				<view class="dui-select-list-box">
					<block v-for="(item,index) in options" :key="index">
						<view :class="index==currentIndex?'on':''"
							class="select-item flex justify-content-between align-items-center"
							@click="handleSelect(index,item)" v-show="(item.needShow == undefined || item.needShow) ? true : false">
							<text class="select-item-label" :class="textCenter?'text-center':''">{{item.language?$t(item.language):item.label}}</text>
							<view v-if="index==currentIndex" class="iconfont icon-checked"></view>
						</view>
					</block>
				</view>
			</template>
		</popupContentTemplate>
	</uni-popup>
</template>

<script>
	import popupContentTemplate from '@/components/popupContentTemplate/popupContentTemplate.vue'
	export default {
		name:"singleSelect",
		components: {
			popupContentTemplate
		},
		props: {
			refName: {
				type: String,
				default: ''
			},
			currentIndex: {
				type: Number,
				default: -1
			},
			options: {
				type: Array,
				default() {
					return []
				}
			},
			textCenter:{
				type: Boolean,
				default: false
			},
			isShowTitle: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			open(type) {
				this.$refs[this.refName].open(type)
			},
			close() {
				this.$refs[this.refName].close()
			},
			handleSelect(index,item) {
				this.$emit('change',index,item)
			}
		}
	}
</script>