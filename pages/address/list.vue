<template>
	<view class="my-address-box dui-padding-top-header">
		<pageHeader :title="$t('address.header')"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="address-list-box">
			<block v-if="addressList && addressList.length">
				<block v-for="(item,index) in addressList" :key="index">
					<view class="address-item-box flex justify-content-between align-items-center">
						<view @click="handleClickDefaultAddress(item)" class="iconfont" :class="item.is_default == '1'?'icon-radio-checked':'icon-radio-check'"></view>
						<view class="content-box flex-1">
							<view class="top">
								{{item.first_name}} {{item.last_name}} {{item.telephone}}
							</view>
							<view class="bottom">
								<text v-if="item.is_default == '1'" class="default-address">[{{$t('address.default_text')}}]</text> <span v-if="!item.street2 || item.street2.trim() === ''">{{item.street1}}, {{item.city}}, {{item.stateName}}, {{item.countryName}}, {{item.zip}}</span> <span v-if="item.street2">{{item.street1}}, {{item.street2}}, {{item.city}}, {{item.stateName}}, {{item.countryName}}, {{item.zip}}</span>
							</view>
						</view>
						<view @click="$public.handleNavTo('/pages/address/add?actionType=edit&id=' + item.address_id)" class="iconfont icon-edit"></view>
					</view>
				</block>
			</block>
			
			<empty v-else></empty>
		</view>
		<!-- 添加地址 -->
		<view class="add-address-box page-max-width">
			<view @click="$public.handleNavTo('/pages/address/add?actionType=add')" class="add-new-address-btn dui-primary-btn">+ {{$t("address.add_new_address")}}</view>
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
				addressList: [],
				backType: "",
				showBacktopBtn: false,
			};
		},
		onLoad(e) {
			this.backType = e.backType;
			this.getCustomerAddressList();
			uni.$off('updateAddressList').$on('updateAddressList',this.getCustomerAddressList);
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'address',
				event_action: 'address_visit',
				event_name: 'address_visit'
			})
		},
		onPageScroll: function (t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
		},
		methods: {
			// 设置默认地址
			handleClickDefaultAddress(item) {
				this.$apis.changeAddressDefault({address_id: item.address_id}).then(res => {
					if(this.backType == 'payOrder') {
						this.$public.handleNavTo('/pages/checkout/index')
					} else {
						this.getCustomerAddressList({loading:false})
					}
				})
			},

			// 获取用户地址列表
			getCustomerAddressList (config) {
				this.$apis.addressList({},config).then(res =>{
					let result = res.data
					this.addressList = result.addressList || []
					uni.hideLoading();
				});
			}
		}
	};
</script>
<style scoped>
/deep/.global-top-btn{
	bottom: 200rpx;
}
	.my-address-box {
		min-height: 100vh;
		position: relative;
	}
	.my-address-box .address-list-box {
		padding: 0 24rpx;
		padding-bottom: 120rpx;
	}
	.my-address-box .address-list-box .address-item-box {
		padding: 32rpx 0;
		border-bottom: 1px solid #e5e5e5;
	}
	.my-address-box .address-list-box .address-item-box .icon-radio-check {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 1px solid #cccccc;
		margin-right: 24rpx;
	}
	.my-address-box .address-list-box .address-item-box .icon-radio-checked {
		font-size: 34rpx;
		color: #000;
		margin-right: 24rpx;
	}
	.my-address-box .address-list-box .address-item-box .icon-radio-checked:before {
		content: "\E6C2";
	}
	.my-address-box .address-list-box .address-item-box .icon-edit {
		font-size: 32rpx;
		color: #999999;
		margin-left: 10px;
	}
	.my-address-box .address-list-box .address-item-box .icon-edit:before {
		content: "\E6B6";
	}
	.my-address-box .address-list-box .address-item-box .content-box .top {
		color: #333333;
		font-size: 28rpx;
	}
	.my-address-box .address-list-box .address-item-box .content-box .bottom {
		font-size: 24rpx;
		color: #666666;
		margin-top: 5px;
		word-break: break-word;
	}
	.my-address-box .address-list-box .address-item-box .content-box .bottom .default-address {
		color: #ff165e;
		margin-right: 5px;
	}
	.my-address-box .add-address-box {
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		padding: 24rpx;
		padding-top: 0;
		color: #ffffff;
		font-size: 36rpx;
	}
</style>
