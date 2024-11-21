<template>
	<view class="checkin-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
		<pageHeader :title="$t('checkin.title')">
			<template v-slot:extend><view class="rules-box" @tap="handleShowRewordTip" v-if="checkInData.sign_in_rules_text">About Rules{{"&nbsp;"}}<text class="iconfont icon-question"></text></view></template>
		</pageHeader>
		<view class="checkin-box-content">
			<view class="calendar-block">
				<view class="points-box" v-if="checkInData.point_tips" v-html="checkInData.point_tips">
				</view>
				<view class="calendar-content">
					<uni-calendar class="uni-calendar--hook" @recheckin="postRecheckin" :selected="selected" :showMonth="false" @change="change" @monthSwitch="monthSwitch" />
				</view>
			</view>
			<view class="tip-info" v-if="checkInData.calendar_tips" v-html="checkInData.calendar_tips">
			</view>
			<view class="block-box" v-if="checkInData.get_more_points_way && checkInData.get_more_points_way.length">
				<view class="block-title">{{ $t('checkin.get_More_points') }}</view>
				<view class="link-list">
					<view class="list-item" :class="item.status == 0 ? 'disabled' : ''" v-for="(item, index) in checkInData.get_more_points_way" @tap="wayClick(item)">
						{{ item.type }}
					</view>
				</view>
			</view>
			<view v-if="goods.length" class="goods-container">
				<view class="u-text-header text-center">
					{{$t('checkin.recommend_header')}}
				</view>
			    <!-- 推荐页商品列表 -->
			    <good-list module_name="point_aptp" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :goods="goods"></good-list>
			</view>
		</view>
		<!-- 裂变提示 -->
		<uni-popup class="popupRecheckinTip" ref="popupRecheckinTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
			<view class="popup-content page-max-width">
				<view class="tip-box">
					<view class="tip-title">
						{{ $t('checkin.tip') }}
						<view class="right-box" @tap="handleShowRewordTip"  v-if="can_get_recheck_in_status">
							{{ $t('checkin.check_in_rules') }}
						</view>
					</view>
					<view class="content">
						<view v-html="recheckin_tip"></view>
						<view class="link-box" v-if="can_get_recheck_in_status">
							{{ $t("checkin.click") }} <text class="link" @tap="toShopping">{{ $t("checkin.go_shopping") }}</text>
						</view>
					</view>
					<view class="close-btn" @click="$refs.popupRecheckinTip.close()">
						<block>{{$t('checkin.close_btn')}}</block>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 裂变提示 -->
		<uni-popup ref="popupDistributeTip" background-color="#fff" v-if="checkInData.sign_in_rules_text" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
			<view class="popup-content" style="width:calc(100vw - 40px)">
				<view class="tip-box">
					<view class="tip-title">{{$t('checkin.rule_tip')}}</view>
					<view class="content">
						<view v-html="checkInData.sign_in_rules_text"></view>
					</view>
					<view class="close-btn" @click="$refs.popupDistributeTip.close()">
						<block>{{$t('checkin.close_btn')}}</block>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageMetaShow:false,
				checkInData: {
					banner: "",
					point_amount_total: '',
					point_offset_amount: '',
					get_more_points_way: [],
					sign_in_dates_arr: [],
					sign_in_rules_text: ""
				},
				showCalendar: false,
				continue_sign_in_tips: '',
				selected: [
					
				],
				recheckin_tip: '',
				can_get_recheck_in_status: false,
				goods: [],
				mailtime: 0,
			}
		},
		onLoad(){
			uni.showLoading();
			this.getCheckinData();
			this.recommendProduct();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getCheckinData();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'check_in',
				event_action: 'check_in_visit',
				event_name: 'check_in_visit'
			})
		},
		onPageScroll: function (t) {
			this.$debounce(() => {
				this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
			}, 300)
		},
		methods: {
			//获取签到数据
			getCheckinData() {
				this.$apis.getCheckinData().then((res) => {
					this.isLoad = true;
					uni.hideLoading();
					this.checkInData = res.data;
					//自动签到
					if(this.checkInData.today_sign_in != 1){
						this.postCheckin();
					}
				}).catch(() => {
					uni.hideLoading();
				});
				this.getCalendarSignData();
			},
			//查看签到规则
			handleShowRewordTip() {
				this.$refs.popupDistributeTip.open('center');
			},
			//打开日历
			openCalendar(){
				this.getCalendarSignData(() => {
					this.$refs.popupcalendar.open('bottom');
				});
			},
			//获取积分方式跳转
			wayClick(item){
				if(item.status == 0){
					return false;
				}
				switch(item.jump_to){
					case 'index': 
						uni.switchTab({
							url: '/pages/index/index'
						});
						break;
					case 'cart': 
						uni.navigateTo({
							url: '/pages/cart/cartPage'
						});
						break;
					case 'profile_index':
						uni.navigateTo({
							url: '/pages/my/profile/index'
						});
						break;
					case 'order_review': 
						uni.navigateTo({
							url: '/pages/order/order-list?order_status=waiting_review'
						});
						break;
					case 'email_verification': 
						this.sendActiveEmail();
						break;
					default:
						break;
				}
			},
			//发送激活邮件
			sendActiveEmail(){
				if(this.mailtime > 0){
					uni.showToast({
						title: this.$t('my.send_email_countdown', [this.mailtime]),
						icon: "none",
					});
					return false;
				}
				if(this.sendActive){
					return false;
				}
				uni.showModal({
				    title: this.$t('my.verify_confirm'),
				    content: '',
				    success:  (res) => {
				        if (res.confirm) {
				            this.sendActive = true;
				            this.$apis.sendActiveEmail({}).then((res) => {
								this.sendActive = false;
								if(res.code == '200'){
									this.hasSendActive = true;
									this.mailtimeInterval();
								}
								if(res.message){
									uni.showToast({
										title: res.message,
										icon: "none",
									});
								}
				           }).catch(() => {
								this.sendActive = false;
				           });
				        }
				    }
				});
				
			},
			mailtimeInterval(){
				this.mailtime = 60;
				let emailInterval = setInterval(() => {
					this.mailtime--;
					if(this.mailtime == 0){
						clearInterval(emailInterval);
					}
				}, 1000);
			},
			//签到操作
			postCheckin(){
				this.$apis.postCheckin().then((res) => {
					if(res.code == 200){
						this.checkInData.today_sign_in = 1;
						this.getCalendarSignData();
						uni.showModal({
							title: '',
							content: this.$t('checkin.sign_in_success'),
							showCancel: false,
							success: function (res) {
								
							}
						});
						this.$trackEvent.checkin({
							type: 'checkin'
						});
					}
				});
			},
			//获取日历签到数据
			getCalendarSignData(callback){
				this.$apis.getCalendarSignData().then((res) => {
					uni.stopPullDownRefresh();
					let selected = [];
					if(res.data.sign_in_data){
						let selected = [];
						res.data.sign_in_data.forEach((item, index) => {
							let sign_in_status =  false;
							let info = ''
							let re_check = false;
							if(!item.sign_in_status && item.can_recheck_in){
								re_check = true;
							}
							if (item.hasOwnProperty('sign_in_status')){
								sign_in_status = item.sign_in_status ? true : false;
								info = sign_in_status ? '✓' : 'x';
							}
							if(re_check){
								info = '';
							}
							let data = {date: item.date, not: !sign_in_status, re_check: re_check, re_check_info: 'recheckin', 'points': ''};
							if(item.point_amount > 0){
								data.points = '+'+ item.point_amount;
							}
							selected.push({
								date: item.date, info: info, data: data
							});
						});
						this.selected = selected;
					}
					if(res.data && res.data.continue_sign_in_tips){
						this.continue_sign_in_tips = res.data.continue_sign_in_tips;
					}
					callback && callback();
				}).catch(() => {
					uni.stopPullDownRefresh();
				});
			},
			//标签操作
			postRecheckin(extraInfo){
				this.$apis.postRecheckin({
					date: extraInfo.data.date
				}).then((res) => {
					if(res.code == 200){
						this.recheckin_tip = res.data.recheck_in_message;
						this.can_get_recheck_in_status = res.data.can_get_recheck_in_status;
						this.$refs.popupRecheckinTip.open('center');
						this.getCheckinData();
						this.$trackEvent.checkin({
							date: extraInfo.data.date,
							type: 'recheckin'
						});
					}
				}).catch((res) => {
					
				});
			},
			toShopping(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			monthSwitch(){
				
			},
			change(){
				
			},
			// 获取推荐列表
			recommendProduct() {
				const params = {
					type: 'sign_in_rec'
				}
				this.$apis.recommendProduct(params).then(res => {
					this.goods = res.data.products || []
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}
	.page-header-box {
		.rules-box {
			position: absolute;
			top: 0px;
			right: 10rpx;
			font-weight: normal;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			.iconfont {
				font-size: 32rpx;
			}
		}
	}
	.checkin-box {
		padding-bottom: 40rpx;
		background-color: #fff;
		::v-deep {
			.uni-calendar__header {
				height: 100rpx;
			}
			.uni-calendar__header-text {
				font-size: 28rpx;
			}
			.uni-calendar__header-btn-box {
				width: 100rpx;
				height: 100rpx;
			}
			.uni-calendar__header-btn {
				width: 20rpx;
				height: 20rpx;
				border-top-width:4rpx;
				border-left-width:4rpx;
			}
			.uni-calendar__weeks-day {
				height: 90rpx;
			}
			.uni-calendar__weeks-day-text {
				font-size: 28rpx;
			}
			.uni-calendar-item__weeks-box-text {
				font-size: 28rpx;
			}
		}
		.banner-img {
			width: 100%;
		}
		.calendar-block {
			border: 1px solid #e2e2e2;
			padding: 20rpx 10rpx;
		}
		.points-box {
			margin-top: 20rpx;
			font-size: 24rpx;
			line-height: 1.6;
			padding: 10rpx;
		}
		.block-box {
			margin-top: 20rpx;
			padding: 0px 10rpx;
			.block-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #000;
			}
		}
		.link-list {
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			overflow: auto;
			.list-item {
				border: 1px solid #e2e2e2;
				padding: 0px 10rpx;
				height: 100rpx;
				flex: 1;
				min-width: 100rpx;
				margin-right: 10rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 22rpx;
				border-radius: 10rpx;
				&:last-child {
					margin-right: 0px;
				}
				&.disabled {
					background-color: #eeeeee;
				}
			}
		}
	}
	.tip-info {
		padding: 10rpx;
		font-size: 28rpx;
		background-color: #f5f5f5;;
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
			max-height: 50vh;
			overflow: auto;
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
	.goods-container{
		.u-text-header {
			text-align: left;
		}
		
	}
	.calendar-content {
		.calendar-tip {
			font-size: 24rpx;
			line-height: 1.4;
		}
	}
	/*日历*/
	.calendar-content ::v-deep .uni-calendar-item__weeks-box-circle {
		display: none;
	}
	.calendar-content ::v-deep .uni-calendar-item--extra {
		background-color: #2bc732;
		color: #fff;
		text-align: center;
		font-size: 24rpx;
		position: absolute;
		bottom: 3px;
		border-radius: 50%;
		width: 24rpx;
		height: 24rpx;
		line-height: 24rpx;
		font-size: 20rpx;
		text-align: center;
	}
	.calendar-content ::v-deep.uni-calendar-item--not {
		background-color: #F44336;
		line-height: 20rpx;
	}
	.calendar-content ::v-deep.uni-calendar-item__weeks-re_check-text{
		color: #f00;
	}
	.calendar-content  ::v-deep.uni-calendar__box {
		border-left: 1px solid #f1f1f1;
	}
	.calendar-content  ::v-deep.uni-calendar__weeks-item {
		border-bottom: 1px solid #f1f1f1;
		border-right: 1px solid #f1f1f1;
	}
	.calendar-content  ::v-deep.uni-calendar__weeks-day {
		border-right: 1px solid #f1f1f1;
		border-bottom: 1px solid #f1f1f1;
	}
	.calendar-content ::v-deep.uni-calendar__backtoday {
		display: none;
	}
	/*日历*/
	.popupRecheckinTip {
		.popup-content {
			width: calc(750rpx - 40rpx);
		}
		.tip-box {
			padding: 0px;
		}
		.tip-title {
			display: flex;
			padding: 20rpx;
			border-bottom: 1px solid #e2e2e2;
			margin-bottom: 0px;
			.right-box {
				flex: 1;
				text-align: right;
				font-size: 24rpx;
				color: #2196f3;
			}
		}
		.content {
			padding: 20rpx 40rpx;
		}
		.link {
			padding: 0px 10rpx;
			color: #2196f3;
		}
		.close-btn {
			height: 80rpx;
			text-align: center;
			color: #333;
			background: #f1f1f1;
			font-size: 24rpx;
			line-height: 80rpx;
		}
	}
</style>
