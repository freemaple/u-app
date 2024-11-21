<!-- 单选下拉框弹窗 -->
<template>
	<view>
		<view class="int-tel-box" @click="open('bottom')">
			<view class="int-tel-inner-box">
				<image class="country-image" :src="currentData.icon" mode="widthFix" />
				<text class="currency-code" v-if="currentData.code">+{{currentData.code}}</text>
				<i class="iconfont icon-down"></i>
			</view>
			<view class="loading-box" v-if="loading">
				<image
				    src="@/static/images/loading.gif"
				    mode="scaleToFill"
				    class="loading"
				/>
			</view>
		</view>
		<uni-popup class="int-tel-popup" :ref="refName" background-color="#fff" @maskClick="handleMask">
			<popupContentTemplate @close="close()">
				<template v-slot:content>
					<view class="select-list-box">
						<block v-for="(item,index) in options" :key="index">
							<view class="select-item flex align-items-center"
								@click="handleSelect(index,item)">
								<image v-if="showflags" :lazy-load="true" class="icon" mode="widthFix" :src="item.icon" />
								<text class="select-item-label">{{item.label}}</text>
								<text class="select-item-code">+{{item.code}}</text>
							</view>
						</block>
					</view>
				</template>
			</popupContentTemplate>
		</uni-popup>
	</view>
</template>

<script>
	import popupContentTemplate from '@/components/popupContentTemplate/popupContentTemplate.vue'
	import phoneCountry from '@/common/phone_country.js'
	export default {
		name:"int-tel-input",
		components: {
			popupContentTemplate
		},
		props: {
			refName: {
				type: String,
				default: ''
			},
			initialCountry:{
				type:String,
				default: ''
			},
			showLoding:{
				type:Boolean,
				default:false
			},
			showflags:{
				type:Boolean,
				default:true,
			}
		},
		watch: {
			initialCountry:{
				handler(newValue,oldValue) {
					if(newValue !== oldValue && newValue) {
						this.currentData = this.options.filter(item=>{
							if(item.c_code == newValue) {
								return item
							}
						})[0] || {}
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				options:phoneCountry.list,
				currentData:{
					icon:'',
					code:''
				},
				loading:false
			};
		},
		methods: {
			open(type) {
				if(this.showLoding) {
					this.loading = true
				}
				this.$refs[this.refName].open(type)
			},
			close() {
				if(this.showLoding) {
					this.loading = false
				}
				this.$refs[this.refName].close()
			},
			handleMask() {
				if(this.showLoding) {
					this.loading = false
				}
			},
			handleSelect(index,item) {
				this.$emit('change',index,item)
			}
		}
	}
</script>

<style scoped>
.select-list-box .select-item {
	font-size: 28rpx;
	color: #000000;
	min-height: 52rpx;
	margin-bottom: 10rpx;
	flex-wrap: nowrap;
}
.select-list-box .select-item.on {
	color: #f85184;
}
.select-list-box .select-item .icon {
	width: 40rpx;
	height: 30rpx;
	margin-right: 20rpx;
	box-shadow: 0px 0px 1px 0px #888;
}
.select-list-box .select-item .select-item-label {
	margin-right: 20rpx;
}
.select-list-box .select-item .select-item-code {
	color: #999;
}
.select-list-box .select-item .icon-checked {
	font-size: 40rpx;
}
.select-list-box .select-item .icon-checked:before {
	content: "\E60F";
}
.int-tel-box {
	display: inline-block;
	background: #f2f2f2;
	height: 64rpx;
	padding-left: 10rpx;
	margin-right: 10rpx;
	position: relative;
}
.int-tel-box .loading-box {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	pointer-events: none;
	display: flex;
	align-items: center;
	justify-content: center;
}
.int-tel-box .loading-box .loading {
	width: 35rpx;
	height: 35rpx;
}
.int-tel-box .int-tel-inner-box {
	display: flex;
	align-items: center;
	height: 100%;
}
.int-tel-box .country-image {
	width: 40rpx;
	height: auto;
	margin-right: 10rpx;
}
.int-tel-box .currency-code {
	color: #000000;
}
.int-tel-popup>>> .popup-content-template-box .main-content-box {
	max-height: 60vh;
}
.int-tel-popup>>>.select-list-box .select-item {
	margin-bottom: 40rpx;
}
</style>