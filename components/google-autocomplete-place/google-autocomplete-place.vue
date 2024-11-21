<template>
	<view class="google-autocomplete-place-box">
		<uni-easyinput v-bind="$attrs" @blur="handleBlur" @focus="handleFocus" :maxlength="255" @input="input" type="text" v-model="address" />
		<view v-show="isShowPlaceBox&&predictionsList.length" class="place-list-box">
			<block v-for="item in predictionsList" :key="item.placePrediction.placeId">
				<view @click="selectPlace(item.placePrediction)" class="place-item">{{item.placePrediction.text.text}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		name: 'googleAutocomplete-place',
		model: {
			// 此处的value为父组件v-model绑定数据
			// mode选项将prop重写为value，则父组件中v-model绑定值会被当前组件value属性接收
			prop: 'value',
			// 派发事件名，更新父组件数组
			event: 'updateValue'
		},
		props: {
			// 用来接收父组件v-model传递的数据
			value: {
				type: [String, Number],
				default: ''
			},
		},
		computed: {
			...mapState(['appConfig'])
		},
		watch: {
			value: {
				handler: function(newV, oldV) {
					this.address = newV
				},
				immediate: true
			}
		},
		data() {
			return {
				lastAddress: "",
				address: this.value,
				isShowPlaceBox: false,
				predictionsList: [],
				sessiontoken:""
			}
		},
		created() {
			this.sessiontoken = this.generateUUIDv4();
		},
		methods: {
			generateUUIDv4() {
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        const r = Math.random() * 16 | 0;
			        const v = c === 'x' ? r : (r & 0x3 | 0x8);
			        return v.toString(16);
			    });
			},
			input(e) {
				const value = e
				this.$emit('updateValue', value);
				if(!value) {
					this.predictionsList = []
				}
				if(!value.endsWith(' ')) {
					// 输入字符是3的倍数才请求googlemap接口（业务要求）
					if(value.length>0&&value.length% 3 == 0) {
						this.$debounce(this.getGooglePlace, 300, [value])
					}
				}
			},
			getGooglePlace(targetValue) {
				if (this.appConfig.google_maps_key) {
					if (targetValue) {
						let params = {
							input: targetValue,
							languageCode: uni.getLocale(),
							includedRegionCodes:this.appConfig.google_map_country,
							sessionToken:this.sessiontoken,
							includedPrimaryTypes:['sublocality','postal_code','street_address','route']
						}
						this.$apis.googlePlace(params).then(res => {							
							this.isShowPlaceBox = true
							if(res.suggestions&&res.suggestions.length) {
								this.predictionsList = res.suggestions		
							}
						})
					} else {
						this.isShowPlaceBox = false;
					}
				}
			},
			selectPlace(data) {
				this.$apis.googlePlaceDetails(data.placeId,{
					fields:"addressComponents",
					languageCode: uni.getLocale(),
					sessionToken:this.sessiontoken
				}).then(res => {
					// 选择地点并调用“地点详情”时会话结束， 重新生成一个sessiontoken
					this.sessiontoken = this.generateUUIDv4();
					let address_components = res.addressComponents;
					let _countryArr = address_components.filter((item) => {
						return item.types.indexOf("country") > -1
					})
					let _stateArr = address_components.filter((item) => {
						return item.types.indexOf("administrative_area_level_1") > -1
					})
					let _cityArr = address_components.filter((item) => {
						return item.types.indexOf("locality") > -1
					})
					let _postal_codeArr = address_components.filter((item) => {
						return item.types.indexOf("postal_code") > -1
					})
					let addressCountry = _countryArr[0] ? _countryArr[0].shortText : "";
					let addressCountryStr = _countryArr[0] ? _countryArr[0].longText : "";
					let addressState = _stateArr[0] ? _stateArr[0].shortText : "";
					let addressStateStr = _stateArr[0] ? _stateArr[0].longText : "";
					let city = _cityArr[0] ? _cityArr[0].longText : "";
					let zip = _postal_codeArr[0] ? _postal_codeArr[0].shortText : "";
					let resultObj = { addressCountry,addressState,city,zip,addressCountryStr,addressStateStr }
					
					let addressAutocompleteInputArr = data?.text?.text.split(', ');
					let removeArr = [
						addressCountry.toLowerCase(),
						addressState.toLowerCase(),
						city.toLowerCase(),
						addressCountryStr.toLowerCase(),
						addressStateStr.toLowerCase(),
						'usa'
					];
					let newAddressAutocompleteInputArr = addressAutocompleteInputArr.filter(function(item){
						return removeArr.indexOf(item.toLowerCase()) < 0;
					});
					this.lastAddress = this.address;
					this.address = newAddressAutocompleteInputArr.join(', ');
					this.$emit('updateValue', this.address);
					this.$emit("changeSelect",resultObj)
					this.isShowPlaceBox = false //兼容低版本手机
				})
			},
			handleBlur() {
				this.lastAddress = this.address;
				setTimeout(() => {
					this.isShowPlaceBox = false
				}, 100)
			},
			handleFocus(){
				if(this.lastAddress && this.address !== this.lastAddress){
					this.getGooglePlace(this.address);
				} else {
					if(this.predictionsList.length) {
						this.isShowPlaceBox = true
					}
				}
			}
		}
	}
</script>

<style scoped>
	.google-autocomplete-place-box {
		position: relative;
	}

	.google-autocomplete-place-box .place-list-box {
		position: absolute;
		left: 0;
		box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
		background: #fff;
		padding: 10rpx;
		right: 0;
		z-index: 1;
		max-height: 300rpx;
		overflow-y: auto;
	}

	.google-autocomplete-place-box .place-list-box .place-item {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		padding: 8rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #e6e6e6;
	}

	.google-autocomplete-place-box .place-list-box .place-item:last-child {
		border-bottom: none;
	}
</style>
