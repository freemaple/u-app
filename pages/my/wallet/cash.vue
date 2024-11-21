<template>
	<view class="wallet-cash-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :title="$t('distribute.cash.title')"></pageHeader>
		<view class="cash-box">
			<view class="cash-header p-24rpx">
				<view class="wallet-total">
					<text class="font-bold" style="font-size: 30rpx;">{{$t('distribute.cash.wallet_total')}}</text>{{'&nbsp;'}}<i class="iconfont icon-question" @click="showTips(1)"></i>:{{'&nbsp;'}}
					<view class="font-bold">{{info.symbol}}{{info.wallet_amount_available}}</view>
				</view>
				<view class="withdrawable-total">
					<view class="flex" style="justify-content: space-between;">
						<view>
							{{$t('distribute.cash.withdrawable_total')}}{{'&nbsp;'}}<i class="iconfont icon-question" @click="showTips(2)"></i>:{{'&nbsp;'}}
						</view>
						<view @click="$public.handleNavTo('/pages/my/wallet/cash-records')">
							{{$t('distribute.cash.cash_history')}} <i class="iconfont icon-arrow-r dark"></i>
						</view>
					</view>
					<view class="font-bold">{{info.symbol}}{{info.wallet_amount_withdraw}}</view>
				</view>
			</view>
			<view class="cash-tabs flex">
				<view style="border-right: 1px solid #ccc;" :class="['cash-tabs-item', listParams.cate == 0 ? 'active' : '']" @click="chooseCate(0)">{{$t('distribute.cash.refund_tab')}}</view>
				<view :class="['cash-tabs-item', listParams.cate == 1 ? 'active' : '']" @click="chooseCate(1)">{{$t('distribute.cash.reward_tab')}}</view>
			</view>
			<view class="back-money-tips flex" v-show="listParams.cate != 1">
				<image style="width: 30rpx;margin: 4rpx 5rpx 0 0;" src="@/static/images/icon/info-circle.png" mode="widthFix"></image>
				<view class="flex tips-box" style="flex: 1;">
					<view class="tips-item-txt" v-show="listParams.cate == 0">
						{{$t('distribute.cash.refund_withdrawal_tips')}}
					</view>
					<!-- <view class="tips-item-txt" v-show="listParams.cate == 1">{{$t('distribute.cash.reward_withdrawal_tips')}}</view> -->
					<view class="tips-item-txt" v-show="listParams.cate == 2">{{$t('distribute.cash.record_withdrawal_tips')}}</view>
				</view>
			</view>
			<view class="list-box">
				<view class="list-header-box">
					<view class="title font-bold">{{$t('my_wallet.balance_details')}}</view>
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
					<walletItem @widthSuccess="page-=1;getInfo();" listType="2" :list="list" :symbol="info.symbol" :email="info.email"></walletItem>
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
		<!-- <uni-popup ref="popupFreeTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="tip-box">
					<view>
						{{tips}}
					</view>
					<view class="close-btn" @click="$refs.popupFreeTip.close()">{{$t('distribute.cash.cash_ok')}}</view>
				</view>
			</view>
		</uni-popup> -->
		<ToastTip ref="toastTip" :tipContent="tips"></ToastTip>
	</view>
</template>

<script>
	import ToastTip from "@/components/toast-tip/toast-tip.vue"
	import walletItem from "./wallet-item.vue"
	export default {
		components:{
			walletItem,
			ToastTip
		},
		data() {
			return {
				pageMetaShow:false,
				wallet_cash_max_amount:'',
				type: 0,
				listParams: {
					cate: 0,
					type: '',
					month: 6
				},
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
				listLen: 0,// list长度
				lastHttpObj: {}, // 最后一次请求的参数
			}
		},
		onLoad() {
			this.getInfo();
		},
		onShow() {
			if(this.lastHttpObj.p) {
				this.getInfo(true)
			}
			this.$maEvent.visit_event({
				event_category: 'withdraw',
				event_action: 'withdraw_visit',
				event_name: 'withdraw_visit'
			})
		},
		onReachBottom() {
			//判断是否到 最后一页了 
			if (!this.isLastPage) {
				this.getInfo()
			}
		},
		methods: {
			// 获取钱包信息 resetData:是否刷新当前页数据
			getInfo(resetData=false) {
				if(resetData) {
					this.page -= 1;
					this.list.length = this.listLen; // 删除最后一页数据，待会要重新获取一下
				}
				this.page += 1; 
				const params = JSON.stringify(this.lastHttpObj) == '{}' ? {...this.listParams,p:this.page} : this.lastHttpObj
				this.$apis.distributeWalletInfo(params).then(res => {
					this.lastHttpObj = {...this.listParams,p:this.page};
					uni.hideLoading();
					let result = res.data;
					this.listLen = this.list.length; // 先保存长度再赋值，用于删除最后一页的数据
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
				})
			},
			// 展示提示信息
			showTips(type) {
				this.tips = type == 1 ? this.$t('distribute.cash.wihdrawal_tip') : this.$t('distribute.cash.wihdrawal_amount_tip')
				this.$refs.toastTip.showToast();
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
			handleType(ind) {
				this.listParams.type = this.info.type_list[ind].value;
				this.type = ind;
				this.$refs.typeSelect.close();
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
		}
	}
</script>

<style lang="scss" scoped>
.wallet-cash-box {
	font-size: 30rpx;
	.tip-box {
		padding: 40rpx;
		.close-btn {
			background: #000;
			margin: 40rpx auto 0;
			width: 200rpx;
			padding: 10rpx 0;
			text-align: center;
			color: #fff;
			border-radius: 10rpx;
		}
	}
	::v-deep .uni-popup__wrapper {
		border-radius: 10rpx;
		font-size: 28rpx;
	}
	.cash-box {
		.wallet-total {
			margin: 24rpx 0;
		}
		.wallet-total,.withdrawable-total {
			font-size: 24rpx;
			margin-bottom: 24rpx;
		}
		.wallet-total text, .withdrawable-total text{
			font-size: 32rpx;
		}
		.cash-tabs {
			border: 1px solid #ccc;
			margin: 0 24rpx;
			.cash-tabs-item {
				width: 50%;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-weight: 500;
			}
			.cash-tabs-item.active {
				background: #f5f5f5;
			}
		}
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
</style>
