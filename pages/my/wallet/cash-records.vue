<template>
	<view class="wallet-cash-box dui-padding-top-header">
		<pageHeader :title="$t('distribute.records.title')"></pageHeader>
		<view class="cash-box">
			<view class="back-money-tips flex">
				<image style="width: 30rpx;margin: 4rpx 5rpx 0 0;" src="@/static/images/icon/info-circle.png" mode="widthFix"></image>
				<view class="flex tips-box" style="flex: 1;">
					<view class="tips-item-txt">{{$t('distribute.cash.record_withdrawal_tips')}}</view>
				</view>
			</view>
			<view class="list-box">
				<view class="list-header-box">
					<view class="filter-box flex align-items-center justify-content-between">
						<view class="month-filter flex align-items-center">
							<view v-for="(item,index) in wallet_month_options" :key="index" class="month-item" :class="listParams.month==item.value?'on':''" @click="monthFilter(item)">{{$t(item.language)}}</view>
						</view>
						<view v-if="info.type_list.length" class="type-filter flex align-items-center">
							<view class="type-select-box" @click="$refs.typeSelect.open('bottom')">
								<text class="type-label">{{judgeCurrent(listParams.type)}}</text>
								<i class="iconfont icon-goto"></i>
							</view>
						</view>
					</view>
				</view>
				<view v-if="list.length" class="list">
					<walletItem listType="3" :list="list" :symbol="info.symbol" :email="info.email"></walletItem>
					<!-- <list-loading v-show="!isLastPage"></list-loading> -->
				</view>
				<empty v-else></empty>
			</view>
		</view>
		<!-- 时间筛选 -->
		<singleSelect ref="typeSelect" refName="popupMonth"
			:currentIndex="type" :options="info.type_list" @change="handleType">
		</singleSelect>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="popupFreeTip" background-color="#fff">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="tip-box">
					<view>
						{{tips}}
					</view>
					<view class="close-btn" @click="$refs.popupFreeTip.close()">{{$t('distribute.cash.cash_ok')}}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 提现申请提交之后，进入该页面的提示弹窗 -->
		<uni-popup ref="popupWithdrawTip">
			<view class="popup-content" style="width:calc(100vw - 110px);border-radius: 23rpx; background-color:#fff;">
				<view class="withdraw-tip-content">
					<view class="withdraw-tip-content-title font-bold">
						{{$t("distribute.cash.status_guide", {site_name: $store.state.site_name_upper})}}
					</view>
					<image @click="$refs.popupWithdrawTip.close()" mode="widthFix" src="@/static/images/login/close_icon@2x.png" class="close"></image>
					<view v-for="(item,index) in withdrawText" class="withdraw-tip-item" :key="index">
						<text v-for="(it,ind) in item" v-html="it.val" :style="it.style" :key="ind">
						</text>
					</view>
					<view class="close-btn" @click="$refs.popupWithdrawTip.close()">{{$t('distribute.cash.cash_ok')}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import walletItem from "./wallet-item.vue"
	export default {
		components:{
			walletItem
		},
		data() {
			return {
				wallet_cash_max_amount:'',
				listParams: {
					cate: 2,
					type: '',
					month: 6
				},
				type: 0,
				wallet_month_options:[
					{
						value:6,
						label:'Last 6 Months',
						language:'my_wallet.month_options.last_6_months'
					},
					{
						value:12,
						label:'Last 12 Months',
						language:'my_wallet.month_options.last_12_months'
					},
					{
						value:'all',
						label:'All',
						language:'my_wallet.month_options.all'
					},
				],
				tips: '',
				info: {
					type_list: []
				},
				list:[],
				isLastPage:false, // 是否最后一页
				page: 0,
				withdrawText: []
			}
		},
		onLoad() {
			this.getInfo();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'withdraw_records',
				event_action: 'withdraw_records_visit',
				event_name: 'withdraw_records_visit'
			})
		},
		onReachBottom() {
			//判断是否到 最后一页了
			if (!this.isLastPage) {
				this.getInfo()
			}
		},
		methods: {
			// 获取钱包信息
			getInfo() {
				this.page += 1; 
				this.$apis.distributeWalletInfo({...this.listParams,p:this.page}).then(res => {
					uni.hideLoading();
					let result = res.data
					if(this.page == 1) {
						this.list = result.withdraw_list
					} else {
						this.list = this.list.concat(result.withdraw_list);
					}
					result.type_list = [{value:'',label:this.$t('my_wallet.type_option.all')}].concat(this.formatOption(res.data.type_list))
					let page_count = result.totalPage;
					if (page_count == this.page || page_count == 0) { //已经是最后一页了
						this.isLastPage = true;
					}
					this.info = result;
					this.showTips();
				});
			},
			chooseCate(cate) {
				this.listParams.cate = cate;
				this.listParams.type = 0;
				this.isLastPage = false;
				this.page = 0;
				this.getInfo();
			},
			// 切换时间
			monthFilter(item) {
				this.listParams.month = item.value;
				this.isLastPage = false;
				this.page = 0;
				this.getInfo();
			},
			// 格式化下拉选项
			formatOption(obj) {
				let result = []
				for(let i in obj) {
					result.push({value:i,label:obj[i]})
				}
				return result;
			},
			// 获取当前选中内容
			judgeCurrent(data) {
				let currentValue = '';
				this.info.type_list.map((item,index) => {
					if(item.value == data) {
						currentValue = item.label;
					}
				})
				return currentValue;
			},
			handleType(ind) {
				this.listParams.type = this.info.type_list[ind].value;
				this.type = ind;
				this.$refs.typeSelect.close();
				this.isLastPage = false;
				this.page = 0;
				this.getInfo();
			},
			showTips() {
				const IS_SHOW_REWARD_WITHDRAWAL_TIPS_APP = uni.getStorageSync('IS_SHOW_REWARD_WITHDRAWAL_TIPS_APP') || 2;
				let html = this.info.withdraw_tips || '[]';
				html = html.replace(/&quot;/g, '"');
				html = JSON.parse(html);
				if(IS_SHOW_REWARD_WITHDRAWAL_TIPS_APP == 1 && html.length) {
					this.withdrawText = html;
					this.$refs.popupWithdrawTip.open('center');
					uni.removeStorageSync('IS_SHOW_REWARD_WITHDRAWAL_TIPS_APP');
					this.$maEvent.impression_event({
						event_category: 'reward_withdraw_succeed',
						event_action: 'reward_withdraw_succeed_page',
						event_name: 'reward_withdraw_succeed_page',
						event_data: {},
						module: 'reward_withdraw_succeed'
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.popup-content{
	border-radius: 23rpx 23rpx 23rpx 23rpx;
}
.wallet-cash-box {
	font-size: 30rpx;
	.cash-box {
		.back-money-tips {
			padding: 24rpx;
		}
		.tips-item-txt {
			color: #fa6338;
			font-size: 24rpx;
		}
		.icon-goto {
			transform: rotate(90deg);
			display: inline-block;
			margin-left: 4rpx;
		}
		.list-header-box {
			.title {
				padding: 24rpx;
			}
			.filter-box {
				padding: 0 24rpx 24rpx 24rpx;
				.month-filter {
					font-size: 24rpx;
					border: 1px solid #e6e6e6;
					.month-item {
						padding: 15rpx 10rpx;
						line-height: 1;
						border-right: 1px solid #e6e6e6;
					}
					.month-item:last-child {
						border-right: 0;
					}
					.month-item.on {
						background: #f5f5f5;
					}
				}
				.type-filter {
					.type-select-box {
						border: 1px solid #333;
						padding: 4rpx 8rpx;
						display: flex;
						align-items: center;
						.type-label {
							max-width: 200rpx;
							display: inline-block;
							overflow: hidden;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
}
.withdraw-tip-content {
	position: relative;
	padding: 61.54rpx 42.31rpx 46.15rpx;
	border-radius: 23rpx;
	text-align: center;
	.close {
		width: 34.62rpx;
		position: absolute;
		right: 15.38rpx;
		top: 15.38rpx;
	}
	.withdraw-tip-content-title {
		font-size: 32rpx;
		color: #000;
		margin-bottom: 46.15rpx;
	}
	.withdraw-tip-item {
		margin-bottom: 8rpx;
		line-height: 42rpx;
		font-size: 27rpx;
		color: #393939;
		font-weight: 400;
	}
	.close-btn {
		background: #000;
		color: #fff;
		font-size: 32rpx;
		padding: 24rpx 0;
		margin-top: 48rpx;
		height: 81rpx;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
	}
}
</style>
