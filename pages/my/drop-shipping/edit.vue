<template>
	<view class="drop-edit-box dui-padding-top-header">
		<pageHeader @handleClick="headerGoback" :backSelf="{type:'emit'}" :title="$t('my_dropshipping.title')"></pageHeader>
		<view class="container">
			<uni-forms label-position="top" ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item :label="$t('my_dropshipping.form.my_full_name')" name="full_name">
					
					<input v-if="edit" type="text" v-model="formData.full_name" :placeholder="$t('my_dropshipping.form.p_my_full_name')" />
					<text class="text" v-else>{{formData.full_name}}</text>
				</uni-forms-item>
				<uni-forms-item :label="$t('my_dropshipping.form.country_label')" name="country">
					<view @click="edit?$refs.countryPopup.open('bottom'):''" class="customer-input uni-input"
						:class="formData.country?'':'placeholder'">
						{{currentCountry.value|| $t('my_dropshipping.form.p_country_label')}}
					</view>
				</uni-forms-item>
				<uni-forms-item :label="$t('my_dropshipping.form.telephone_label')" name="phone">
					<view class="int-tel-input-box">
						<block v-if="edit">
							<int-tel-input ref="intTel" :showflags="false" :showLoding="true" :initialCountry="formData.phone_country_code" refName="popupIntTel" @change="handleChangeIntTel"></int-tel-input>
							<input type="text" v-model="formData.phone" :placeholder="$t('my_dropshipping.form.p_telephone_label')" />
						</block>
						<text v-else>(+{{formData.phone_area_code}}) {{formData.phone}}</text>
					</view>
				</uni-forms-item>
				<uni-forms-item :label="$t('my_dropshipping.form.my_shop_url')" name="shop_url">
					<input v-if="edit" type="text" v-model="formData.shop_url" :placeholder="$t('my_dropshipping.form.p_my_shop_url')" />
					<text class="text" v-else>{{formData.shop_url}}</text>
				</uni-forms-item>
				<uni-forms-item :label="$t('my_dropshipping.form.categories')" name="category_sold_in_shop">
					<input v-if="edit" type="text" v-model="formData.category_sold_in_shop" :placeholder="$t('my_dropshipping.form.p_categories')" />
					<text class="text" v-else>{{formData.category_sold_in_shop}}</text>
				</uni-forms-item>
				
			</uni-forms>
			<view class="footer-toolbar page-max-width flex justify-content-between">
				<view v-if="edit" class="btn save-btn" @click="submit">{{$t("my_dropshipping.save")}}</view>
				<view v-else class="btn save-btn" @click="edit=true;">{{$t("my_dropshipping.edit_text")}}</view>
			</view>
		</view>
		<!-- 国家选择器 -->
		<uni-popup ref="countryPopup" background-color="#fff">
			<view class="picker-header-box flex justify-content-between align-items-center">
				<view class="cancel" @click="$refs.countryPopup.close()">{{$t("my_dropshipping.cancelText")}}</view>
				<!-- 搜索框 -->
				<uni-easyinput class="uni-mt-5" v-model="countrySearchKey" :placeholder="$t('my_dropshipping.please_enter')"
					@input="handleSearchCountry"></uni-easyinput>
				<view class="confirm" @click="confirmSelectedCountry">{{$t("my_dropshipping.confirmText")}}</view>
			</view>
			<picker-view v-if="searchCountryList.length" :value="currentCountryIndex" indicator-style="height:50px"
				@change="bindPickerChangeCountry" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in searchCountryList" :key="index">
						{{ item.value }}
					</view>
				</picker-view-column>
			</picker-view>
			<view class="nodata" v-else>
				{{$t('my_dropshipping.nodata')}}
			</view>
		</uni-popup>
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
				edit:false,
				countrySearchKey: '', // 国家搜索关键词
				initCountryList: [], // 国家列表初始数据
				searchCountryList: [], // 筛选国家的列表
				currentCountry: {}, // 当前选择的国家
				currentCountryIndex: [0], // 当前选择国家的index
				// 表单数据
				formData: {
					full_name: "",
					country: null,
					phone_country_code:'us',
					phone_area_code:'1',
					phone: "",
					shop_url:'',
					category_sold_in_shop:''
				},
				rules: {
					full_name: {
						rules: [{
							required: true,
							errorMessage: this.$t("my_dropshipping.full_name_rule")
						}]
					},
					country: {
						rules: [{
							required: true,
							errorMessage: this.$t("my_dropshipping.country_rule")
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: this.$t("my_dropshipping.telephone_rule")
						}]
					},
					shop_url: {
						rules: [{
							required: true,
							errorMessage: this.$t("my_dropshipping.shop_url_rule")
						}]
					},
					category_sold_in_shop: {
						rules: [{
							required: true,
							errorMessage: this.$t("my_dropshipping.category_rule")
						}]
					}
				}
			};
		},
		onLoad() {
			this.initInfo();
		},
		onBackPress() {
			if(this.edit) {
				this.edit = false;
				return true;
			} else {
				return false;
			}
		},
		methods: {
			headerGoback() {
				if(this.edit) {
					this.edit = false;
				} else {
					this.$public.handleGoBack()
				}
			},
			handleChangeIntTel(index,data) {
				this.formData.phone_area_code = data.code;
				this.formData.phone_country_code = data.c_code;
				this.$refs.intTel.close();
			},
			// 国家搜索
			handleSearchCountry(e) {
				this.countrySearchKey = e;
				this.searchCountryList = this.initCountryList.filter(item => {
					if (item.value.toLowerCase().indexOf(this.countrySearchKey.toLowerCase()) > -1) {
						return item
					}
				})
			},
			// 对象转数组
			formatObjToArray(data) {
				const keys = Object.keys(data)
				let arr = [];
				return keys.map(item => {
					return {
						value: data[item],
						text: item
					}
				})
			},
			// 国家选择
			bindPickerChangeCountry(e) {
				this.currentCountryIndex = e.detail.value
			},
			// 确认国家选择
			confirmSelectedCountry() {
				this.currentCountry = this.searchCountryList[this.currentCountryIndex[0]]
				this.formData.country = this.currentCountry.text
				this.$refs.countryPopup.close()
			},
			// 触发提交表单
			submit() {
				this.$refs.form.validate().then(res => {
					this.handleSave({
						...this.formData
					})
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			handleSave(data) {
				this.$apis.dropShippingSave(data).then(res => {
					uni.hideLoading()
					this.edit=false;
				})
			},
			// 初始化数据
			initInfo() {
				this.$apis.dropShippingEdit().then(res => {
					this.initCountryList = this.formatObjToArray(res.data.countryArr);
					this.searchCountryList = this.initCountryList;
					this.currentCountry = this.initCountryList.find(item => item.text == res.data.dropShipper
						.country)||{};
					this.formData = {...res.data.dropShipper}
					uni.hideLoading()
				})
			}
		}
	};
</script>
<style scoped>
	page {
		height: 100%;
	}

	.drop-edit-box .container {
		padding: 24rpx;
	}

	.drop-edit-box .container>>>.uni-forms-item__content {
		font-size: 28rpx;
	}

	.drop-edit-box .container>>>.uni-forms-item {
		border-bottom: 1px solid #e5e5e5;
	}
	.drop-edit-box .container>>>.uni-forms-item.is-default {
		border-bottom: 0;
	} 
	.drop-edit-box .container>>>.uni-forms-item .no-label {
		display: none;
	}
	.pages-address-add-address-add>>>.uni-picker-container .uni-picker-item {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.drop-edit-box .container>>> uni-input {
		font-size: 28rpx;
		min-height: 64rpx;
		line-height: 64rpx;
	}

	.drop-edit-box .container>>>.uni-forms-item__label {
		font-size: 28rpx;
		min-height: 64rpx;
		line-height: 64rpx;
	}

	.drop-edit-box>>>uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #000 !important;
		border-color: #000 !important;
	}
	.drop-edit-box>>>uni-checkbox .uni-checkbox-input {
		width: 38rpx;
		height: 38rpx;
	}

	.drop-edit-box>>>uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #d1d1d1;
	}

	.drop-edit-box .placeholder {
		color: grey;
	}

	.drop-edit-box .tips {
		margin-top: -11px;
		color: #333333;
		font-size: 24rpx;
	}

	.drop-edit-box .tips a {
		color: #333333;
		margin-left: 5px;
	}

	.drop-edit-box .container .footer-toolbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #ffffff;
		padding: 24px;
	}

	.drop-edit-box .container .footer-toolbar .btn {
		width: calc(50% - 12rpx);
		height: 80rpx;
		font-size: 36rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.drop-edit-box .container .footer-toolbar .btn.cancel-btn {
		border: 1px solid #cbcbcb;
		color: #333333;
	}

	.drop-edit-box .container .footer-toolbar .btn.save-btn {
		background: #000;
		color: #ffffff;
	}

	/* 弹窗 */
	.picker-header-box {
		font-size: 17px;
		color: #888888;
		height: 60px;
		border-bottom: 1px solid #e5e5e5;
		padding: 0 24rpx;
	}

	.picker-header-box .cancel {
		margin-right: 10px;
	}

	.picker-header-box .confirm {
		color: #000;
		margin-left: 10px;
	}

	.picker-view {
		height: 600rpx;
		background: #ffffff;
	}

	.item {
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
		display: flex;
	}

	.drop-edit-box .info-tips {
		flex-wrap: nowrap;
		padding: 24rpx;
		color: #888888;
	}

	.drop-edit-box .info-tips icon {
		margin-top: 4px;
		margin-right: 4px;
	}

	.drop-edit-box .nodata {
		min-height: 270px;
		padding-top: 42px;
		text-align: center;
		color: #888888;
	}
	.uni-forms-item.is-direction-top>>> .uni-forms-item__label {
		white-space: nowrap;
	}
	.customer-input {
		padding-bottom: 8px;
	}
	.security-privacy-module-title {
	    color:#198055;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}
	.security-privacy-module-content {
		color: #666;
		padding-bottom: 128rpx;
	}
	.int-tel-input-box {
		display: flex;
		align-items: center;
		padding-bottom: 16rpx;
	}
	.int-tel-input-box >>> uni-input {
		width: 100%;
	}
	.text {
		padding-bottom: 16rpx;
		display: inline-block;
	}
</style>
