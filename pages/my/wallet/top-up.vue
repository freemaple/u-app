<template>
	<view class="payPopup dui-padding-top-header">
		<pageHeader :title="$t('my_wallet.top_up_title')"></pageHeader>
		<view class="content">
			<view class="payPopup-content">
				<view class="payPopup-content-input">
					<view class="payPopup-content-tip">
						{{$t('my_wallet.pay_input_tip')}}
					</view>
					<view class="flex">
						<view class="payPopup-content-input-main flex">
							{{symbol}}<input type="text" v-model="recharge_price" @blur="checkVal(recharge_price)"/>
						</view>
					</view>
				</view>
				<view class="payPopup-content-list flex">
					<view @click="choosePayMoney(item)" :class="['payPopup-content-list-item', recharge_price == item ? 'active' : '']" v-for="(item,index) in recharge_list" :key="index">
						{{symbol}} {{formatNumber(item)}}
					</view>
				</view>
				<view class="popup-content-pay-type">
					<view class="payPopup-content-tip">
						{{$t('my_wallet.pay_type_tip')}}
					</view>
					<radio-group @change="payTypeMethodCheck($event)">
						<view class="popup-content-pay-type-item" v-for="(value, key, ind) in payments" :key="key">
							<view class="flex align-items-center">
								<radio color="#000" :value="key" :checked="value.checked" />
								<view @click="choosePayType(key)">{{value.label}}</view>
							</view>
						</view>
					</radio-group>
				</view>
			</view>
			<view class="to-pay-btn dui-primary-btn" @click="payMoney">
				{{$t("my_wallet.top_up_btn")}}
			</view>
		</view>
	</view>
</template>

<script>
	import fn from '@/common/utils.js'
	export default {
		data() {
			return {
				symbol: '',
				recharge_price: '', // 支付金额
				recharge_list: [], // 充值的固定价格
				payments: {}, // 全部充值方式
				payment_method: '', // 选中的充值方式
				canPay: false, // 是否可以支付
			}
		},
		onLoad() {
			this.getInfo();
		},
		methods: {
			// 千分位格式化
			formatNumber(val) {
				return fn.formatNumber(val)
			},
			// 展示充值弹窗
			showPayToast() {
				this.$refs.payPopupRef.open();
			},
			// 切换支付方式
			payTypeMethodCheck(e) {
				this.payment_method = e.target.value;
			},
			// 点击支付方式的名称-切换
			choosePayType(key) {
				for (let k in this.payments) {
					this.payments[k].checked = false;
				}
				this.payments[key].checked = true;
				this.payment_method = key;
			},
			// 切换支付金额
			choosePayMoney(val) {
				this.recharge_price = val;
				this.canPay = true;
			},
			// 获取支付信息
			getInfo(type) {
				this.$apis.distributeWallet({}).then(res => {
					let result = res.data;		
					this.symbol = result.symbol;			
					let len = 0;
					for (let k in result.payments) {
						result.payments[k].checked = len == 0 ? true : false;
						if(len == 0) {
							this.payment_method = k;
							len = 1;
						}
					}
					this.payments = result.payments;
					this.recharge_list = result.recharge_list;
				})
			},
			// 输入校验
			checkVal(val) {
				val = val.replace(/[^\d.]/g, ''); // 清除非数字和小数点之外的字符
				
				// 截取两位小数
				const decimalIndex = val.indexOf('.');
				if (decimalIndex !== -1) {
					val = val.slice(0, decimalIndex + 3);
				}
				
				const regex = /^\d+(\.\d{1,2})?$/; // 正则表达式：非负数，允许两位小数
				if (regex.test(this.recharge_price)) {
					this.canPay = true;
				} else {
					this.canPay = false;
				}
				this.recharge_price = val;
			},
			// 支付
			payMoney() {
				if(this.recharge_price == '' || !this.canPay) {
					return;
				}
				let postData = {
					payment_method: this.payment_method,
					recharge_price: this.recharge_price
				};
				uni.showLoading();
				this.$apis.WalletTopUp(postData).then(res => {
					uni.hideLoading();
					if(res.code == 200){
						var orderData = res.data;
						this.handelPay(orderData);
					}
				}).catch(() => {
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.payPopup {
	.content {
		padding: 20rpx;
	}
	.payPopup-content {
		padding-bottom: 20rpx;
	}
	.payPopup-content-tip {
		color: #919191;
		margin-bottom: 30rpx;
	}
	.payPopup-content-input-main {
		border: 1px solid #9f9b9b;
		margin-bottom: 30rpx;
		padding: 10rpx;
		input {
			width: 200rpx;
			margin-left: 10rpx;
		}
	}
	.payPopup-content-list {
		margin-bottom: 30rpx;
	}
	.payPopup-content-list-item {
		border: 1px solid #ccc;
		min-width: 100rpx;
		padding: 10rpx;
		margin: 0 30rpx 30rpx 0;
		border-radius: 10rpx;
	}
	.payPopup-content-list-item.active {
		background: #e6e6e6;
	}
	.popup-content-pay-type-item {
		margin-bottom: 30rpx;
	}
	.to-pay-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
}
</style>
