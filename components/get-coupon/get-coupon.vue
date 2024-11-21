<template>
	<!-- 新人优惠券 -->
	<uni-popup class="newcomer-dialog" ref="popupNewcomerCoupon" :mask-click="false" @change="(e)=>{pageMetaShow = e.show;$public.isPullDown(!pageMetaShow)}">
		<popupContentTemplate style="width:90vw;background:#fff;" :title="newcomerCouponData.login_status?$t('my_coupons.newComer.title2'):$t('my_coupons.newComer.title1')" @close="handleCloseNewcomer()">
			<template v-slot:content>
				<view class="coupon-list-box">
					<block v-for="(item,index) in newcomerCouponData.coupons" :key="index">
						<couponItem :couponItemData="item" :hideHeadRightBtn="true" couponClassType='index-coupon-item' :showCircleEdge="true"></couponItem>
					</block>
				</view>
				<block v-if="newcomerCouponData.login_status">
					<view @click="$refs.popupNewcomerCoupon.close();useNowMa();$emit('showFooterTips', 1);" class="dui-primary-btn">{{$t('my_coupons.newComer.ok')}}</view>
				</block>
				<block v-else>
					<view class="dui-primary-btn" @click="handleCloseNewcomer('collect_all')">{{$t('my_coupons.newComer.collect_all')}}</view>
				</block>
			</template>
		</popupContentTemplate>
	</uni-popup>
</template>
<script>
import { mapGetters } from 'vuex'
	export default {
		props: {
			returnUrl: {
				type: String,
				default: ''
			},
			moduleName: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				newcomerCouponData:{},// 新人券
			}
		},
		computed: {
			...mapGetters(['hasLogin'])
		},
		methods:{
			// 新人券
			getNewcomerCouponList(){
				let req = {};
				let new_user_time_diff = this.$uitls.getNewUseTimeDiff();
				if(new_user_time_diff !== false){
					req.new_user_time_diff = new_user_time_diff;
				}
				req.v = '1.0';
				
				if((this.hasLogin && uni.getStorageSync('newcomer_coupon_logged_hide') == 1) || (!this.hasLogin && uni.getStorageSync('newcomer_coupon_hide') == this.getNowDate()) ) {
					this.$emit('notOpenNewcomerCoupon');
					return;
				}
				this.$apis.getNewcomerCoupons(req).then(res=>{
					this.newcomerCouponData = res.data;
					if(!res.data.login_status) {
						this.$store.commit('SET_LOGOUT', '');
					}
					if(this.newcomerCouponData.login_status){
						// 已登录
						if(uni.getStorageSync('newcomer_coupon_logged_hide') != 1) {
							if(res.data.coupons.length) {
								this.$refs.popupNewcomerCoupon.open('center');
								this.$maEvent.impression_event({
									event_category: 'coupon_window',
									event_action: 'coupon_window_page',
									event_name:this.moduleName,
									event_data: {
										module:this.moduleName
									}
								});
							}
							// 展示1次之后下次不展示
							uni.setStorageSync('newcomer_coupon_logged_hide', 1);
						} else {
							this.$emit('notOpenNewcomerCoupon');
						}
					} else {
						// 未登录
						if(uni.getStorageSync('newcomer_coupon_hide') != this.getNowDate()) {
							// 首次点击关闭或者collect-all之后当日不展示，次日才展示
							if(res.data.coupons.length) {
								this.$refs.popupNewcomerCoupon.open('center');
								this.$maEvent.impression_event({
									event_category: 'coupon_window',
									event_action: 'coupon_window_page',
									event_name:this.moduleName,
									event_data: {
										module:this.moduleName
									}
								});
							}
						} else {
							this.$emit('notOpenNewcomerCoupon');
						}
					}
					if(!res.data.coupons.length) {
						this.$refs.popupNewcomerCoupon && this.$refs.popupNewcomerCoupon.close();
						this.$emit('notOpenNewcomerCoupon');
					}
				})
			},
			useNowMa() {
				this.$maEvent.custom_event({
					event_category: 'coupon_window',
					event_action: 'coupon_window_button',
					event_name: 'use now',
					event_data: {
						module:this.moduleName,
						button_type:'use now'
					}
				});
			},
			// 关闭新人券弹窗
			handleCloseNewcomer(type){
				this.$refs.popupNewcomerCoupon.close();
				if(!this.newcomerCouponData.login_status) {
					uni.setStorageSync('newcomer_coupon_hide',this.getNowDate())
					// 未登录
					if(type) {
						setTimeout(()=>{
							this.$public.handleNavTo('/pages/login/index?page=register&in_site_source=coupon_window&redirectUrl=' + this.returnUrl)
						},1)
						this.$maEvent.custom_event({
							event_category: 'coupon_window',
							event_action: 'coupon_window_button',
							event_name: 'collect all',
							event_data: {
								module:this.moduleName,
								button_type:'collect all'
							}
						});
					} else {
						this.$emit('closeNewcomerCoupon')
						// if(this.couponList.length) {
						// 	this.$refs.popupCoupon.open('bottom')
						// }
					}
				} else {
					this.$emit('closeNewcomerCoupon')
					this.$emit('showFooterTips', 1);
				}
			},
			// 获取当前年月日
			getNowDate() {
				var _newcomer_nowDate = new Date();
				console.log(_newcomer_nowDate.getFullYear()+'-'+(_newcomer_nowDate.getMonth()+1)+'-'+_newcomer_nowDate.getDate());
				return _newcomer_nowDate.getFullYear()+'-'+(_newcomer_nowDate.getMonth()+1)+'-'+_newcomer_nowDate.getDate();
			},
		}
	}
</script>
<style scoped lang="scss">
::v-deep .popup-content-template-box {
	border-radius: 24rpx;
	.header-box {
		position: relative;
		.title {
			padding: 0 20rpx;
			width: 480rpx;
			flex: none;
			margin: 0 auto;
		}
		.icon-close {
			position: absolute;
			right: 32rpx;
			top: 0;
		}
	}
	.main-content-box {
		max-height: unset;
		.coupon-list-box {
			max-height: 50vh;
			overflow-y: auto;
			.coupon-item {
				width: calc(100% - 1px);
			}
		}
		.check-coupons-btn {
			color: #1c54a3;
			margin-top: 30rpx;
			cursor: pointer;
			text-align:center;
		}
		.dui-primary-btn {
			margin-top: 40rpx;
			border-radius: 40rpx;
		}
	}
} 
</style>