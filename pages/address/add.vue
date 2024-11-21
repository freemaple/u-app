<template>
	<view class="address-add-box dui-padding-top-header">
		<pageHeader :styleType="2" :backSelf="judgeBackUrl()" :title="judgePageHeader()"></pageHeader>
		<view class="container">
			<view class="container-top-tips" v-if="address_id == '' && fromWhichPage == 'checkout' && addressType == 'address' && isShowShoppingTip == '1'">
				{{$t('address.billing_address_block.tip_content')}}
			</view>
			<view class="container-top-tips" v-if="address_id == '' && fromWhichPage == 'checkout' && addressType == 'billing'">
				{{$t('address.billing_address_block.tip_content2')}}
			</view>
			<uni-forms label-position="top" ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item name="addressCountry">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.addressCountry_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<view @click="$refs.countryPopup.open('bottom');" class="customer-input uni-input"
						:class="formData.addressCountry?'':'placeholder'">
						<view class="select_label">{{currentCountry.value}}</view>
						<view class="select-icon">
							<image v-if="currentOpenPop=='countryPopup'" mode="widthFix" src="@/static/images/checkout_icon/up@2x.png"></image>
							<image v-else mode="widthFix" src="@/static/images/checkout_icon/down@2x.png"></image>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item name="first_name">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.first_name_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<uni-easyinput type="text" v-model="formData.first_name"/>
				</uni-forms-item>
				<uni-forms-item name="last_name">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.last_name_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<uni-easyinput type="text"  v-model="formData.last_name" />
				</uni-forms-item>
				<uni-forms-item name="telephone">
						<template v-slot:label="{ label, required }">
							<view class="custom-label-box">
								<view>{{ $t('address.telephone_label') }}</view>
								<view class="required-star">*</view>
							</view>
						</template>
					<uni-easyinput type="text"  v-model="formData.telephone" />
				</uni-forms-item>
				<uni-forms-item name="street1" class="form-address1">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.street1_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<googleAutocompletePlace   @changeSelect="changeSelect" v-model="formData.street1"></googleAutocompletePlace>
				</uni-forms-item>
				<uni-forms-item name="street2">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.street2_label') }}</view>
						</view>
					</template>
					<uni-easyinput type="text"  v-model="formData.street2" :placeholder="$t('address.street2')" />
				</uni-forms-item>
				<uni-forms-item name="city">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.city_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<uni-easyinput type="text"   v-model="formData.city" />
				</uni-forms-item>
				<uni-forms-item name="addressState">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.addressState_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<view @click="$refs.statePopup.open('bottom');" class="customer-input uni-input"
						:class="formData.addressState?'':'placeholder'">
						<view class="select_label">{{currentState.value}}</view>
						<view class="select-icon">
							<image v-if="currentOpenPop=='statePopup'" mode="widthFix" src="@/static/images/checkout_icon/up@2x.png"></image>
							<image v-else mode="widthFix" src="@/static/images/checkout_icon/down@2x.png"></image>
						</view>
						
					</view>
				</uni-forms-item>
				<uni-forms-item name="zip">
					<template v-slot:label="{ label, required }">
						<view class="custom-label-box">
							<view>{{ $t('address.zip_label') }}</view>
							<view class="required-star">*</view>
						</view>
					</template>
					<uni-easyinput type="text"  v-model="formData.zip"/>
				</uni-forms-item>
			</uni-forms>
			<!-- shipping address 设置默认地址 -->
			<view class="set-as-address-box" v-if="addressType == 'address' && fromWhichPage !=='vipPage'">
				<view class="set-checkbox">
					<image @click="formData.isDefaultActive = 2" v-if="formData.isDefaultActive == 1" class="checkbox" mode="widthFix" src="@/static/images/checkout_icon/checkbox_checked@2x.png"></image>
					<image @click="formData.isDefaultActive = 1" v-else class="checkbox" mode="widthFix" src="@/static/images/checkout_icon/checkbox@2x.png"></image>
				</view>
				<view class="set-label">{{$t("address.use_default_address")}}</view>
			</view>
			<!-- billing address 保存为shipping address -->
			<view class="set-as-address-box" v-if="addressType == 'billing'&&!address_id && fromWhichPage !=='vipPage'">
				<view class="set-checkbox">
					<image @click="save_as_shipping = 2" v-if="save_as_shipping == 1" class="checkbox" mode="widthFix" src="@/static/images/checkout_icon/checkbox_checked@2x.png"></image>
					<image @click="save_as_shipping = 1" v-else class="checkbox" mode="widthFix" src="@/static/images/checkout_icon/checkbox@2x.png"></image>
				</view>
				<view class="set-label">{{$t("address.billing_address_block.save_as_your_shipping_address")}}</view>
			</view>
			<view class="security-privacy-module">
				<view class="security-privacy-module-title  flex align-items-center">
					<image class="security-icon" mode="widthFix" src="@/static/images/icon/password-icon-green.png"></image>
					<view>{{$t("address.privacy_security")}}</view>
				</view>
				<view class="security-privacy-module-content">{{$t("address.privacy_security_content")}}</view>
			</view>
			<view class="footer-toolbar page-max-width flex justify-content-between">
				<view @click="submit" v-if="fromWhichPage == 'checkout'" class="dui-primary-btn">{{$t('address.next_step')}}</view>
				<block v-else>
					<view class="btn save-btn" @click="submit">{{$t("address.save")}}</view>
					<block v-if="fromWhichPage !=='vipPage'">
						<view v-if="address_id" class="btn cancel-btn" @click="handleDeleteAddress">{{$t("address.delete")}}</view>
						<view v-else class="btn cancel-btn" @click="handleCancel">{{$t("address.cancelText")}}</view>
					</block>
				</block>
			</view>
			
				<view class="tips">
					<text class="text-underline" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-privacy-cookie-policy')"> {{$t("address.privacy_policy_cookie")}} </text>
				</view>
		</view>
		<!-- 国家选择器 -->
		<uni-popup ref="countryPopup" background-color="#fff" @change="(e)=>{popupChange(e.show,'countryPopup')}">
			<view class="picker-header-box flex justify-content-between align-items-center">
				<view class="cancel" @click="$refs.countryPopup.close()">{{$t("address.cancelText")}}</view>
				<!-- 搜索框 -->
				<uni-easyinput class="uni-mt-5" v-model="countrySearchKey" :placeholder="$t('address.please_enter')"
					@input="handleSearchCountry"></uni-easyinput>
				<view class="confirm" @click="confirmSelectedCountry">{{$t("address.confirmText")}}</view>
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
				{{$t('address.nodata')}}
			</view>
		</uni-popup>
		<!-- 省份、州选择器 -->
		<uni-popup ref="statePopup" background-color="#fff" @change="(e)=>{popupChange(e.show,'statePopup')}">
			<view class="picker-header-box flex justify-content-between align-items-center">
				<view class="cancel" @click="$refs.statePopup.close()">{{$t("address.cancelText")}}</view>
				<!-- 搜索框 -->
				<uni-easyinput class="uni-mt-5" v-model="stateSearchKey" :placeholder="$t('address.please_enter')"
					@input="handleSearchState"></uni-easyinput>
				<view class="confirm" @click="confirmSelectedState">{{$t("address.confirmText")}}</view>
			</view>
			<view class="flex info-tips">
				<!-- <view>* {{$t('address.kind_tip')}}</view> -->
			</view>
			<!-- state 搜索如果收不到，就使用搜索词作为state -->
			<!-- <picker-view :value="currentStateIndex" indicator-style="height:50px" @change="bindPickerChangeState"
				class="picker-view">
				<picker-view-column>
					<block v-if="searchStateList.length">
						<view class="item" v-for="(item,index) in searchStateList" :key="index">
							{{ item.value }}
						</view>
					</block>
					<view class="flex justify-content-center align-items-center" v-else>
						{{$t('address.currently_selected_is')}} <text
							style="font-weight: 700;margin-left: 10px;">{{stateSearchKey}}</text>
					</view>
				</picker-view-column>
			</picker-view> -->
			<!-- state 搜索如果收不到 显示无数据 -->
			<picker-view v-if="searchStateList.length" :value="currentStateIndex" indicator-style="height:50px" @change="bindPickerChangeState"
				class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in searchStateList" :key="index">
						{{ item.value }}
					</view>
				</picker-view-column>
			</picker-view>
			<view class="nodata" v-else>
				{{$t('address.nodata')}}
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	import googleAutocompletePlace from "@/components/google-autocomplete-place/google-autocomplete-place.vue"
	export default {
		components: {
			pageHeader,
			googleAutocompletePlace
		},
		data() {
			return {
				currentOpenPop:'',
				addressType: 'address', // 地址类型 address代表shippingAddress；billing代表billingAddress
				fromWhichPage:'', // 从哪个页面跳转进来的
				actionType: 'add',  //add 添加地址， edit编辑地址
				isShowShoppingTip: 0, //是否显示shopping地址提示
				backType: "", // 值如果是 cartNoAddress 则跳转到/pages/checkout/index页面，vipNoAddress 则跳 /pages/vip/index页面，否则正常跳转
				save_as_shipping:2, // 首次添加时billing,是否同步为shipping[1是|2否]
				countrySearchKey: '', // 国家搜索关键词
				stateSearchKey: '', // 州搜索关键词
				address_id: '',
				initAddressCountryList: [], // 国家列表初始数据
				searchCountryList: [], // 筛选国家的列表
				currentCountry: {}, // 当前选择的国家
				currentCountryIndex: [0], // 当前选择国家的index
				initAddressStateList: [], // 州列表初始数据
				searchStateList: [], // 筛选州的列表
				currentStateIndex: [0], // 当前选择州的index
				currentState: {}, //当前选择的州
				// 表单数据
				formData: {
					first_name: "", //用户收货地址填写的first name
					last_name: "", //用户收货地址填写的last name
					telephone: "", //收货地址的telephone
					addressCountry: null, //收货地址的国家
					addressState: null, //收货地址的州/省
					city: "", //收货地址的城市
					street1: "", //收货地址的详细街道地址1
					street2: "", //收货地址的详细街道地址2
					isDefaultActive: '2', //是否是默认收货地址，1代表是，2代表不是
					zip: "", //收货地址的邮编
				},
				rules: {
					street1: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.street1_rule")
						}]
					},
					addressCountry: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.country_rule")
						}]
					},
					addressState: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.state_rule")
						}]
					},
					city: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.city_rule")
						}]
					},
					zip: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.zip_rule")
						}]
					},
					first_name: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.first_name_rule")
						}]
					},
					last_name: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.last_name_rule")
						}]
					},
					telephone: {
						rules: [{
							required: true,
							errorMessage: this.$t("address.telephone_rule")
						}]
					}

				}
			};
		},
		onLoad(e) {
			this.address_id = e.id || '';
			this.fromWhichPage = e.fromWhichPage || '';
			this.backType = e.backType;
			if(e.addressType){
				this.addressType = e.addressType;
			}
			if(e.actionType) {
				this.actionType = e.actionType;
			}
			if(e.isShowShoppingTip) {
				this.isShowShoppingTip = e.isShowShoppingTip;
			}
			this.initAddressInfo(e);
		},
		mounted() {
			// #ifdef H5
			// 恢复页面滚动
			document.body.style.overflow = 'auto';
			//#endif
		},
		methods: {
 			popupChange(show,name) {
				if(show) {
					this.currentOpenPop = name;
				} else {
					this.currentOpenPop = '';
				}
			},
			judgePageHeader() {
				if(this.fromWhichPage == 'checkout' || this.fromWhichPage == 'vipPage') {
					if(this.addressType == 'billing') {
						return this.$t('address.billing_address_block.title')
					} else {
						if (this.isShowShoppingTip == 1) {
							return this.$t('address.address_block.title')
						}
						return this.actionType == 'add' ? this.$t('address.add_new_address') : this.$t('address.title')
					}
				} else {
					return this.actionType == 'add' ? this.$t('address.add_new_address') : this.$t('address.title')
				}
			},
			// 判断返回的路径
			judgeBackUrl() {
				let backUrlObj = {}
				if (this.backType == 'cartNoAddress') {
					backUrlObj = {
						type: "redirectTo",
						url: "/pages/cart/cartPage"
					}
				}
				if (this.backType == 'vipNoAddress') {
					backUrlObj = {
						type: "redirectTo",
						url: "/pages/vip/index"
					}
				}
				return backUrlObj
			},
			changeSelect(data) {
				this.formData = {...this.formData,...data}
				this.currentCountry = {value: data.addressCountryStr,text: data.addressCountry}
				this.currentState = {value: data.addressStateStr,text: data.addressState}
			},
			// 国家搜索
			handleSearchCountry(e) {
				this.countrySearchKey = e;
				this.searchCountryList = this.initAddressCountryList.filter(item => {
					if (item.value.toLowerCase().indexOf(this.countrySearchKey.toLowerCase()) > -1) {
						return item
					}
				})
			},
			// 州搜索
			handleSearchState(e) {
				this.stateSearchKey = e;
				this.searchStateList = this.initAddressStateList.filter(item => {
					if (item.value.toLowerCase().indexOf(this.stateSearchKey.toLowerCase()) > -1) {
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
			// 州选择
			bindPickerChangeState(e) {
				this.currentStateIndex = e.detail.value
			},
			// 确认国家选择
			confirmSelectedCountry() {
				this.currentCountry = this.searchCountryList[this.currentCountryIndex[0]]
				this.formData.addressCountry = this.currentCountry.text
				// 清空州的数据
				this.formData.addressState = null;
				this.currentState = ""
				// 获取州列表数据
				this.changeCountry(this.formData.addressCountry)
			},
			// 确认州/省选择
			confirmSelectedState() {
				if (this.searchStateList.length) {
					this.currentState = this.searchStateList[this.currentStateIndex[0]]
					this.formData.addressState = this.currentState.text
				}
				this.$refs.statePopup.close();
				// else {
				// 	this.currentState = {
				// 		value: this.stateSearchKey,
				// 		text: this.stateSearchKey
				// 	}
				// 	this.formData.addressState = this.stateSearchKey
				// 	this.$refs.statePopup.close();
				// }
			},
			// 是否设置为默认地址
			checkboxChange(e) {
				this.formData.isDefaultActive = String(e.detail.value.length)
			},
			// billingAddress是否保存为shippingAddress
			changeSaveAsShipping(e) {
				this.save_as_shipping = e.detail.value.length?1:2
			},
			// 获取指定国家的州或省
			changeCountry(country) {
				this.$apis.changecountry({
					country
				}).then(res => {
					uni.hideLoading()
					this.$refs.countryPopup.close();
					this.initAddressStateList = this.formatObjToArray(res.data.stateArr)
					this.searchStateList = this.initAddressStateList

				})
			},
			// 触发提交表单
			submit() {
				this.$refs.form.validate().then(res => {
					this.addAddress({
						...res,
						address_id: this.address_id,
						isDefaultActive:this.formData.isDefaultActive
					})
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			addAddress(data) {
				if(this.fromWhichPage == 'checkout' || this.fromWhichPage == 'vipPage') {
					let params = {...data,};
					if(this.addressType == 'billing') {
						params.is_billing = 1;
						params.isDefaultActive = 2
						if(!this.address_id) {
							params.save_as_shipping = this.save_as_shipping;
						}
					} else {
						params.is_billing = 2;
					}
					this.$apis.addressSaveFromCheckout(params).then(res => {
						uni.hideLoading();
						if (this.backType == 'cartNoAddress') {
							uni.redirectTo({
								url: '/pages/checkout/index'
							});
						} else if (this.backType == 'vipNoAddress') {
							uni.redirectTo({
								url: '/pages/vip/pay-vip'
							})
						} else {
							this.$public.handleGoBack()
						}
						uni.$emit('updateAddressList');
						if(params.is_billing == 1){
							this.$trackEvent.add_billing_info();
						} else {
							this.$trackEvent.add_shipping_info();
						}
					})
				} else {
					this.$apis.addressSave(data).then(res => {
						uni.hideLoading()
						if (this.backType == 'cartNoAddress') {
							uni.redirectTo({
								url: '/pages/checkout/index'
							});
						} else if (this.backType == 'vipNoAddress') {
							uni.redirectTo({
								url: '/pages/vip/index'
							})
						} else {
							this.$public.handleGoBack()
						}
						uni.$emit('updateAddressList');
					})
				}
			},
			handleCancel() {
				if (this.backType == 'cartNoAddress') {
					uni.switchTab({
						url: '/pages/cart/cart'
					});
				} else if (this.backType == 'vipNoAddress') {
					uni.redirectTo({
						url: '/pages/vip/index'
					})
				} else {
					this.$public.handleGoBack()
				}
			},
			// 初始化数据
			initAddressInfo() {
				this.$apis.addressInfo({
					address_id: this.address_id
				}).then(res => {
					let result = res.data.address
					this.initAddressCountryList = this.formatObjToArray(result.countryArr);
					this.searchCountryList = this.initAddressCountryList;
					this.initAddressStateList = this.formatObjToArray(result.stateArr);
					this.searchStateList = this.initAddressStateList;
					//billing地址
					/*var billingEdit = false;
					if(this.addressType == 'billing'){
						let billing_address = uni.getStorageSync('billing_address');
						if(billing_address){
							result = Object.assign(result, billing_address);
							billingEdit = true;
						}
					}*/
					// if (this.address_id || billingEdit) {
						this.currentCountry = this.initAddressCountryList.find(item => item.text == result
							.country);
						this.currentState = {
							value: result.stateStr,
							text: result.state
						};
						this.formData = {
							...result,
							addressCountry: result.country,
							addressState: result.state,
							isDefaultActive: String(result.is_default)
						};
						if(!this.currentCountry) {
							this.currentCountry = {}
							this.formData.addressCountry = null;
							this.formData.addressState = null;
						}
					// }
					uni.hideLoading()

				})
			},
			// 删除地址
			handleDeleteAddress() {
				var that = this;
				uni.showModal({
					title: this.$t("address.delete_model_title"),
					content: this.$t("address.delete_model_content"),
					cancelText: this.$t("address.cancelText"),
					confirmText: this.$t("address.confirmText"),
					success: function(res) {
						if (res.confirm) {
							that.$apis.deleteAddress({
								address_id: that.address_id
							}).then(res => {
								uni.hideLoading();
								that.$public.handleGoBack();
								uni.$emit('updateAddressList');
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
		}
	};
</script>
<style scoped>
	page {
		height: 100%;
		font-size: 28rpx;
	}
	.custom-label-box {
		display: flex;
		align-items: center;
		line-height: 52rpx;
		font-size: 32rpx;
		color: #393939;
		margin-bottom: 7rpx;
		padding-left: 32rpx;
	}
	
	.custom-label-box .required-star {
		color: #FF0000;
	}
	.address-add-box .container {
		padding: 32rpx 0;
	}
	.uni-forms {
		padding:0 32rpx;
	}
	.set-as-address-box {
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		padding-bottom: 32rpx;
		padding-left: 58rpx;
		border-bottom: 16rpx solid #F5F5F5;
		margin-top: 68rpx;
		overflow: hidden;
	}
	.set-as-address-box .set-checkbox {
		margin-right: 16rpx;
	}
	.set-as-address-box .set-checkbox .checkbox {
		width: 48rpx;
		display: block;
	}
	.set-as-address-box .set-label {
		font-size: 28rpx;
		color: #333333;
	}
	.address-add-box .container>>>.uni-forms-item {
		margin-bottom: 44rpx;
	}
	.address-add-box .container>>>.uni-forms-item__content {
		font-size: 32rpx;
		/* border: 1px solid #DDDDDD; */
		/* border-radius: 46rpx; */
	}
	.address-add-box .container>>>.uni-easyinput__content {
		font-size: 32rpx;
		border-radius: 46rpx;
		padding: 0 32rpx;
	}
	
	.address-add-box .container>>>.uni-easyinput__content .uni-icons.content-clear-icon {
		font-size: 46rpx !important;
	}
	.address-add-box .container>>>.uni-forms-item__error {
		color: #FF512B;
		font-size: 27rpx;
		left: 23rpx;
	}
	.address-add-box .container>>>.uni-forms-item__error uni-text {
		display: flex;
		align-items: center;
	}
	.address-add-box .container>>>.uni-forms-item__error uni-text::before {
		content: '';
		background-image: url('@/static/images/checkout_icon/error-icon-new@2x.png');
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		background-size: cover;
		margin-right: 8rpx;
	}
	.pages-address-add-address-add>>>.uni-picker-container .uni-picker-item {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.address-add-box .container>>> uni-input {
		font-size: 32rpx;
		min-height: 92rpx;
		line-height: 92rpx;
		padding: 0 !important;
	}
	
	.customer-input {
		min-height: 92rpx;
		line-height: 92rpx;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 46rpx;
		border: 2rpx solid #999999;
	}
	.customer-input .select_label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.customer-input .select-icon {
		display: flex;
		align-items: center;
	}
	.customer-input .select-icon image {
		width: 48rpx;
	}

	.address-add-box .container>>>.uni-forms-item__label {
		font-size: 32rpx;
		min-height: 64rpx;
		line-height: 64rpx;
	}
	.address-add-box .container .form-address1 {
		margin-bottom: 60rpx;
	}
	.address-add-box>>>uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #000 !important;
		border-color: #000 !important;
	}
	.address-add-box>>>uni-checkbox .uni-checkbox-input {
		width: 38rpx;
		height: 38rpx;
	}

	.address-add-box>>>uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #d1d1d1;
	}

	.address-add-box .placeholder {
		color: grey;
	}

	.address-add-box .tips {
		color: #0071E3;
		font-size: 28rpx;
		text-align: center;
		padding-bottom: 76rpx;
		margin-top: 46rpx;
	}

	.address-add-box .tips a {
		color: #333333;
		margin-left: 5px;
	}

	.address-add-box .container .footer-toolbar {
		/* position: fixed;
		bottom: 0;
		left: 0;
		right: 0; */
		background: #ffffff;
		padding: 0 32rpx;
		padding-bottom: 24rpx;
	}

	.address-add-box .container .footer-toolbar .btn {
		width: 100%;
		height: 80rpx;
		font-size: 36rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 40rpx;
	}

	.address-add-box .container .footer-toolbar .btn.cancel-btn {
		border: 1px solid #cbcbcb;
		color: #333333;
		margin-top: 24rpx;
	}

	.address-add-box .container .footer-toolbar .btn.save-btn {
		background: #000;
		color: #ffffff;
	}

	/* 弹窗 */
	.picker-header-box {
		font-size: 34rpx;
		color: #888888;
		height: 120rpx;
		border-bottom: 1px solid #e5e5e5;
		padding: 0 24rpx;
	}
	
	.picker-header-box>>>.uni-easyinput__content-input {
		height: 70rpx;
		font-size: 28rpx;
	}
	.picker-header-box>>>.uni-easyinput__placeholder-class {
		font-size: 32rpx !important;
	}
	.picker-header-box .cancel {
		margin-right: 20rpx;
	}
	.picker-header-box .confirm {
		color: #000;
		margin-left: 20rpx;
	}

	.picker-view {
		height: 60vh;
		max-height: 600rpx;
		background: #ffffff;
	}

	.item {
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
		display: flex;
	}

	.address-add-box .info-tips {
		flex-wrap: nowrap;
		padding: 24rpx;
		color: #888888;
	}

	.address-add-box .info-tips icon {
		margin-top: 4px;
		margin-right: 4px;
	}

	.address-add-box .nodata {
		min-height: 270px;
		padding-top: 42px;
		text-align: center;
		color: #888888;
	}
	.uni-forms-item.is-direction-top>>> .uni-forms-item__label {
		white-space: nowrap;
	}
	.security-privacy-module {
		padding: 30rpx;
	}
	.security-privacy-module-title {
	    color:#198055;
		margin-bottom: 32rpx;
	}
	.security-privacy-module .security-icon {
		width: 30rpx;
		margin-right: 8rpx;
	}
	.security-privacy-module-content {
		color: #666;
		font-size: 27rpx;
		line-height: 42rpx;
	}
	.container-top-tips {
		background: #F2F7FF;
		margin: 0 32rpx 32rpx;
		padding: 15rpx 30rpx;
		color: #666666;
		font-size: 27rpx;
		line-height: 42rpx;
	}
	
	.dui-primary-btn {
		border-radius: 77rpx;
		background-color: #222;
	}
</style>
