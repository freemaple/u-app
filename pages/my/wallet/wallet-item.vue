<template>
	<view>
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<view class="wallet-item-box" :class="openid==item.id?'on':''" v-for="(item,index) in list" :key="index" >
			<view class="wallet-item flex align-items-center justify-content-between" @click="openid == item.id?openid='':openid=item.id">
				<view class="date">{{item.created_at}}</view>
				<view class="type-box">
					<view class="type">
						<view class="" v-if="listType == 2">
							<text class="price">{{symbol}}{{formatPrice(item.left_amount)}}</text>
						</view>
						<view>{{listType == 1 ? item.type : item.type_text}}</view>
						<view class="price-box justify-content-center show-more-btn" v-if="listType == 2">
							<i class="iconfont icon-arrow-r"></i>
							<text>{{$t('distribute.cash.view_details')}}</text>
						</view>
					</view>
					<view class="amount-source flex justify-content-center" v-if="item.source">
						<view class="flex align-items-center" @click.stop="$public.handleNavTo('/pages/my/wallet/wallet-source?id='+item.id)">{{$t('my_wallet.amount_source')}}<i class="iconfont icon-arrow-r"></i></view>
					</view>
				</view>
				<view v-if="listType != 2" class="price-box" :class="Number(item.amount)<0?'red':'green'">
					<text class="price">{{Number(item.amount)<0?'-':'+'}}{{symbol}}{{formatPrice(item.amount)}}</text>
					<i class="iconfont icon-arrow-r"></i>
				</view>
				<view :class="['withdrawBtn', item.status == 2 ? 'btn-disable' : '']" v-if="listType == 2" @tap.stop="toWithDraw(item)">{{$t('distribute.cash.withdrawBtn')}}</view>
			</view>
			<view class="wallet-item-detail">
				<view class="detail-item flex justify-content-between">
					<view>{{$t('my_wallet.date')}}</view>
					<view>{{item.created_at}}</view>
				</view>
				<view class="detail-item flex justify-content-between">
					<view>{{$t('my_wallet.type')}}</view>
					<view>{{listType != 1 ? item.type_text : item.type}}</view>
				</view>
				<view class="detail-item flex justify-content-between">
					<view>{{$t('my_wallet.amount')}}</view>
					<view>{{symbol}}{{item.amount}}</view>
				</view>
				<view class="detail-item flex justify-content-between">
					<view>{{$t('my_wallet.transaction_no')}}<i @click="tipContent=$t('my_wallet.transaction_no_tip');$refs.toastTip.showToast()" class="iconfont icon-question"></i></view>
					<view>{{item.order_increment_id}}</view>
				</view>
				<view class="detail-item flex justify-content-between" v-show="listType != 2">
					<view>
						{{$t('my_wallet.status')}}
						<i v-if="item.type_rel == 'wallet_type_cash_withdraw_deduct'" @click="getBalanceWithdrawTip();$refs.balanceToastTip.open('center');" class="iconfont icon-question" style="margin-left: 4rpx;"></i>
					</view>
					<view>{{listType == 3 ? item.status_text : item.status}}</view>
				</view>
			</view>
		</view>
		
		<!-- balance-withdraw提示信息 -->
		<uni-popup ref="balanceToastTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 40px)">
				<view class="tip-box balance-toast-main">
					<view class="balance-toast-title">
						{{$t('my_wallet.balance_toast_title')}}
					</view>
					<image class="balance-toast-close-img" @click="$refs.balanceToastTip.close()" src="@/static/images/distribute/close.png" mode=""></image>
					<block>
						<view class="balance-toast-content" v-html="balanceWithdrawTipHtml"></view>
					</block>
					<view class="close-btn" @click="$refs.balanceToastTip.close()">
						<block>{{$t('my_wallet.ok')}}</block>
					</view>
				</view>
			</view>
		</uni-popup>
		<ToastTip ref="toastTip" :tipContent="tipContent"></ToastTip>
		<!-- 退款提现弹窗 -->
		<uni-popup ref="popupWithdrawTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="tip-box">
					<view class="font-bold withdraw-toast-title">
						{{$t('distribute.cash.refund_withdrawal_toast_title')}}
					</view>
					<view class="withdraw-toast-content" style="padding-bottom: 20rpx;">
						{{$t('distribute.cash.refund_withdrawal_toast_content')}}
					</view>
					<view class="withdraw-toast-content">
						{{$t('distribute.cash.refund_withdrawal_toast_content2')}}
					</view>
					<view class="flex withdraw-toast-btn-box">
						<view class="cancel-btn" @click="$refs.popupWithdrawTip.close()">{{$t('distribute.cash.cash_cancel')}}</view>
						<view class="submit-btn" @click="handleToWithdraw">{{$t('distribute.cash.cash_confirm')}}</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<message-tip ref='messageTipRef' />
	</view>
</template>

<script>
	import ToastTip from "@/components/toast-tip/toast-tip.vue"
	export default {
		components:{
			ToastTip
		},
		data() {
			return {
				pageMetaShow:false,
				openid:'',
				clickItem: '',
				tipContent: '',
				balanceWithdrawTipHtml: ''
			}
		},
		props: {
			list: {
				type: Array,
				default: [],
			},
			symbol: {
				type:String,
				default:''
			},
			email: {
				type:String,
				default:''
			},
			// 1 默认样式 2 钱包提现页样式 3 钱包提现记录页
			listType: {
				type: String,
				default: '1'
			}
		},
		methods: {
			formatPrice(data) {
				return Math.abs(data).toFixed(2);
			},
			// 点击提现按钮
			toWithDraw(item) {
				this.openid = 0;
				// 当前是 不可提现 && 是钱包提现页面 && 是奖励提现 
				if(item.status == 2 && this.listType == 2 && item.cate == 1) {
					// uni.showToast({
					// 	title: this.$t('distribute.cash.reward_withdrawal_tips'),
					// 	icon: "none"
					// });
					// this.tipContent = this.$t('distribute.cash.reward_withdrawal_tips');
					// this.$refs.toastTip.showToast()
					return
				}
				if(item.status != 1) {
					return
				}
				// 退款提现
				if(item.cate == 0) {
					this.clickItem = item;
					this.$refs.popupWithdrawTip.open('center');
				}
				// 奖励提现
				if(item.cate == 1) {
					const url = '/pages/my/wallet/cash-withdraw?money=' + item.amount + '&email=' + this.email + '&symbol=' + this.symbol + '&id=' + item.id;
					this.$public.handleNavTo(url);
				}
			},
			// 发起提现请求
			handleToWithdraw() {
				const params = {
					id: this.clickItem.id,
				}
				this.$apis.distributeCashwithdraw(params).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.$refs.popupWithdrawTip.close();
						this.$emit('widthSuccess');
						// uni.showToast({
						// 	title: res.message,
						// 	icon: "none"
						// });
						this.$refs.messageTipRef.showMessage(this.$t('distribute.cash.withdraw_success'), 1);
						setTimeout(()=>{
							this.$public.handleNavTo('/pages/my/wallet/cash-records');
						},1500)
					}
				}).catch( err => {
					uni.showToast({
					    title: err.message,
					    icon: 'none',
					    duration: 3000
					});
				})
			},
			getBalanceWithdrawTip() {
				if(this.balanceWithdrawTipHtml != '') {
					return;
				}
				this.$apis.getHtmlBlock({identify: 'balance-withdrawal-status-tips'}).then(res => {
					uni.hideLoading();
					if (res.code == 200 && res.data && res.data['balance-withdrawal-status-tips']) {
						this.balanceWithdrawTipHtml = res.data['balance-withdrawal-status-tips'];
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.wallet-item-box {
	.wallet-item {
		border-bottom: 1px solid #e5e5e5;
		padding: 24rpx;
		.date {
			width: 160rpx;
			color: #959595;
			font-size: 24rpx;
		}
		.type-box {
			flex: 1;
			text-align: center;
		}
		.amount-source{
			color: #2d68a8;
			display: flex;
			justify-content: center;
			.icon-arrow-r {
				font-size: 40rpx;
			}
		}
		.price-box.green {
			.price {
				color: #3fb341;
			}
		}
		.price-box.red {
			.price {
				color: red;
			}
		}
		.price-box {
			display: flex;
			align-items: center;
			.price {
				margin-right: 10rpx;
			}
			.icon-arrow-r {
				transform: rotate(90deg);
				display: inline-block;
				font-size: 50rpx;
				color: #666;
			}
		}
	}
	.wallet-item-detail {
		display: none;
		background: #f6f6f6;
		padding: 24rpx;
		font-size: 26rpx;
	}
}
.wallet-item-box.on {
	.wallet-item {
		.price-box {
			.icon-arrow-r {
				transform: rotate(270deg)
			}
		}
	}
	.wallet-item-detail {
		display: block;
	}
}
.tip-box {
	padding: 28rpx;
	.tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		margin-bottom: 30rpx;
	}
	.content {
		font-size: 28rpx;
		line-height: 1.5;
	}
	.close-btn {
		height: 96rpx;
		text-align: center;
		color: #fff;
		background: #000;
		line-height: 96rpx;
		margin-top: 32rpx;
	}
}
.withdrawBtn {
	padding: 5rpx 10rpx;
	background: #000;
	color: #fff;
	border-radius: 10rpx;
	font-size: 28rpx;
}
.show-more-btn {
	color: #2d68a8;
	.iconfont {
		color: #2d68a8 !important;
	}
}
.btn-disable {
	background: #ccc;
	color: #000;
}
.withdraw-toast-title {
	text-align: center;
	padding-bottom: 30rpx;
}
.withdraw-toast-content {
	line-height: 40rpx;
}
.withdraw-toast-btn-box {
	align-items: center;
	justify-content: space-between;
	margin-top: 32rpx;
	view {
		width: 45%;
		text-align: center;
		line-height: 80rpx;
	}
	.cancel-btn {
		border: 1px solid #ccc;
	}
	.submit-btn {
		background: #000;
		color: #fff;
	}
}
.balance-toast-title {
	text-align: center;
	padding: 14rpx 0 32rpx;
	font-weight: bold;
}
.balance-toast-close-img {
	position: absolute;
	right: 24rpx;
	top: 24rpx;
	width: 36rpx;
	height: 36rpx;
}
.balance-toast-main {
	padding-bottom: 40rpx;
}
.balance-toast-content {
	max-height: 582rpx;
	overflow: auto;
	padding: 0 20rpx;
	margin-bottom: 60rpx;
	::v-deep {
		.balance_withdrawal_tips_item {
			margin-bottom: 20rpx;
			line-height: 44rpx;
		}
	}
}
</style>