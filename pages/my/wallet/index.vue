<template>
	<view class="my-wallet-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :title="$t('my_wallet.title')">
			<template v-slot:extend>
				<i class="iconfont icon-question" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-about-my-wallet')"></i>
			</template>
		</pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="wallet-content">
			<view class="header p-24rpx">
				<view class="total font-bold">
					{{$t('my_wallet.total')}}:{{'&nbsp;'}}<text class="wallet-amount">{{symbol}}{{wallet_amount}}</text>
				</view>
				<view class="price-box flex align-items-center">
					<view class="available-price">{{$t('my_wallet.available')}}: {{symbol}}{{wallet_available}}<i @click="popupTip=$t('my_wallet.available_tip', {site_name: $store.state.site_name_upper});$refs.toastTip.showToast()" class="iconfont icon-question"></i></view>
					<view class="pending-price">{{$t('my_wallet.pending')}}: {{symbol}}{{wallet_pending}}<i @click="popupTip=$t('my_wallet.pending_tip');$refs.toastTip.showToast()" class="iconfont icon-question"></i></view>
				</view>
				<view class="flex align-items-center justify-content-end operate-btn-box">
					<view @click="$public.handleNavTo('/pages/my/wallet/cash')" class="with-draw-btn wallet-btn font-bold">{{$t('my_wallet.withdraw')}}</view>
					<!-- <view @click="$public.handleNavTo('/pages/my/wallet/top-up')" class="top-up-btn wallet-btn font-bold">{{$t('my_wallet.top_up')}}</view> -->
				</view>
				
			</view>

			<view class="list-box">
				<view class="list-header-box">
					<view class="title font-bold">{{$t('my_wallet.balance_details')}}</view>
					<view class="filter-box flex align-items-center justify-content-between">
						<view class="month-filter flex align-items-center">
							<view v-for="(item,index) in wallet_month_options" :key="index" class="month-item" :class="wallet_month==item.value?'on':''" @click="monthFilter(item)">{{$t(item.language)}}</view>
						</view>
						<view v-if="wallet_type_options.length" class="type-filter flex align-items-center">
							<view class="type-select-box" @click="$refs.typeSelect.open('bottom')">
								<text class="type-label">{{judgeCurrent(wallet_type)}}</text>
								<i class="iconfont icon-goto"></i>
							</view>
						</view>
					</view>
				</view>
				<view v-if="list.length" class="list">
					<walletItem :list="list" :symbol="symbol"></walletItem>
					<list-loading v-show="!isLastPage"></list-loading>
				</view>
				<empty :show_btn="true" v-else></empty>
			</view>
		</view>
		
		<!-- 时间筛选 -->
		<singleSelect ref="typeSelect" refName="popupMonth"
			:currentIndex="wallet_type_current_index" :options="wallet_type_options" @change="handleType">
		</singleSelect>
		<!-- 统一提示框 -->
		<!-- <uni-popup ref="popupTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 40px)">
				<view class="tip-box">
					<block>
						<view class="content">
							<view>{{ popupTip }}</view>
						</view>
					</block>
					<view class="close-btn" @click="$refs.popupTip.close()">
						<block>{{$t('my_wallet.ok')}}</block>
					</view>
				</view>
			</view>
		</uni-popup> -->
		<ToastTip ref="toastTip" :tipContent="popupTip"></ToastTip>
	</view>
</template>

<script>
	import walletItem from "./wallet-item.vue"
	import ToastTip from "@/components/toast-tip/toast-tip.vue"
	export default {
		components:{
			walletItem,
			ToastTip
		},
		data() {
			return {
				pageMetaShow:false,
				wallet_amount:'',
				wallet_available:'',
				wallet_pending:'',
				symbol:'$',
				list:[],
				popupTip:'',
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
				wallet_type_options:[],
				wallet_month:6,
				wallet_type_current_index:0,
				wallet_type: '',
				showBacktopBtn: false,
				isLastPage:false, // 是否最后一页
				page: 0,
			}
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'wallet',
				event_action: 'wallet_visit',
				event_name: 'wallet_visit'
			})
		},
		onPageScroll: function (t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
		},
		onReachBottom() {
			//判断是否到 最后一页了
			if (!this.isLastPage) {
				this.getList()
			}
		},
		methods: {
			monthFilter(item) {
				this.wallet_month = item.value;
				this.isLastPage = false;
				this.page=0;
				this.getList();
			},
			// 类型筛选
			handleType(index,item) {
				this.wallet_type = item.value;
				this.wallet_type_current_index = index;
				this.$refs.typeSelect.close();
				this.isLastPage =false;
				this.page = 0;
				this.getList()
			},
			// 获取当前选中内容
			judgeCurrent(data) {
				let currentValue = '';
				this.wallet_type_options.map((item,index) => {
					if(item.value == data) {
						currentValue = item.label;
					}
				})
				return currentValue;
			},
			// 格式化下拉选项
			formatOption(obj) {
				let result = []
				for(let i in obj) {
					result.push({value:i,label:obj[i]})
				}
				return result;
			},
			// 获取列表
			getList(type) {
				this.page += 1; 
				this.$apis.distributeWallet({wallet_month:this.wallet_month,type:this.wallet_type,p:this.page}).then(res => {
					let result = res.data
					this.wallet_amount = result.wallet_amount;
					let page_count = result.totalPage;
					this.symbol = result.symbol;
					if(this.page == 1) {
						this.list = result.wallet_historys
					} else {
						this.list = this.list.concat(result.wallet_historys);
					}
					this.wallet_month = result.wallet_month;
					this.wallet_available = result.wallet_completed;
					this.wallet_pending = result.wallet_pending;
					this.wallet_type = result.wallet_type;
					this.wallet_type_options = [{value:'',label:this.$t('my_wallet.type_option.all')}].concat(this.formatOption(result.wallet_history_type))
					if (page_count == this.page || page_count==0) { //已经是最后一页了
						this.isLastPage = true;
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.my-wallet-box {
	font-size: 30rpx;
	color: #333;
	.icon-goto {
		transform: rotate(90deg);
		display: inline-block;
		margin-left: 4rpx;
	}
	.wallet-amount {
	}
	.header {
		border-bottom: 24rpx solid #fafafa;
		.total {
			margin-bottom: 24rpx;
		}
	}
	.tabs {
		padding: 24rpx 0;
		border-bottom: 1px solid #00000014;
		.tab.on {
			color: #f85184;
		}
	}
	.list-box {
		.item-box {
			padding: 24rpx;
			border-bottom: 1px solid #00000014;
			.item-date-amount {
				margin-bottom: 48rpx;
			}
		}
		
	}
}
.list-header-box {
	.title {
		padding: 24rpx;
	}
	.filter-box {
		padding: 0 24rpx 24rpx 24rpx;
		.month-filter {
			font-size: 24rpx;
			.month-item {
				padding: 0 10rpx;
				line-height: 1;
				border-right: 1px solid #e6e6e6;
			}
			.month-item:first-child{
				padding-left: 0;
			}
			.month-item:last-child {
				border-right: 0;
			}
			.month-item.on {
				font-weight: 900;
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


.price-box {
	margin-bottom: 24rpx;
	.available-price {
		margin-right: 50rpx;
	}
	.icon-question {
		margin-left: 10rpx;
	}
}
.page-header-box {
	.icon-question {
		position: absolute;
		right: 24rpx;
		font-weight: normal;
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
.wallet-btn {
	min-width: 200rpx;
	border: 1px solid #000;
	padding: 10rpx 20rpx;
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
.top-up-btn {
	background: #000;
	color:#fff;
	margin-left: 24rpx;
}
</style>
