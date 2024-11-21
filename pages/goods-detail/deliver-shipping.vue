<template>
	<view class="dui-padding-top-header">
		<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.deliver_shipping')"></pageHeader>
		<view class="deliver_shipping">
			<view v-for="(item,index) in staticblock['app-deliver-shipping'].sections" :key="index">
				<view class="section" v-if="item.text">
					<view v-html="item.text"></view>
				</view>
				<view class="bill_box" v-else-if="item.bill">
					<view class="bill_title">
						{{ item.bill.title }}
					</view>
					<view class="bill" :class="idx == item.bill.RegionBill.length - 1 ? 'border-last' : ''" 
						v-for="(i,idx) in item.bill.RegionBill" :key="idx">
						<view class="region font-MM" @tap="handleShow(i)">
							{{i.Region}}
							<image mode="widthFix" v-if="setShow(i)" class="title_icon" src="@/static/images/cart/cart_reduce@2x.png" />
							<image mode="widthFix" v-else class="title_icon" src="@/static/images/cart/cart_add@2x.png" />
						</view>
						<view v-if="setShow(i)" class="info_box" v-for="(bill, idxBill) in i.Bills" :key="idxBill"
							:class="i.Bills.length > 1 && idxBill != i.Bills.length - 1 ? 'border-dashed mb19r' : ''">
							<view class='bill_info font-MR' v-for="(value, key,billIndex) in bill" :key="key">
								<view class="key">{{key}}: </view>
								<view class="value">{{value}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "deliver-shipping",
		onLoad(e) {
			this.getStaticblock()
		},
		data() {
			return {
				"United States-Show": false,
				"Canada-Show": false,
				"Australia-Show": false,
				staticblock: {
					'app-deliver-shipping': {}
				},
			}
		},
		methods: {
			getStaticblock() {
				this.$apis.getStaticblock({identify:'app-deliver-shipping'}).then(res=>{
					var data = res.data || {};
					var filterData = Object.fromEntries(
						Object.entries(data).filter(([key, value]) => value !== null && value !== '')
					);
					this.staticblock = {...this.staticblock,...filterData}
				})
			},
			handleShow(i) {
				this[`${i.Region}-Show`] = !this[`${i.Region}-Show`]
			},
			setShow(i) {
				return this[`${i.Region}-Show`]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.border-last {
		border-bottom: 2rpx solid #EEEEEE;
	}
	.border-dashed {
		border-bottom: 2rpx dashed #EEEEEE;
	}
	.deliver_shipping {
		margin: 46.15rpx;
		padding-bottom: 200rpx;
		font-family: "Montserrat-Medium";
		font-weight: 500;
		font-size: 26.92rpx;
		color: #222222;
		.section {
			margin-bottom: 23.08rpx;
		}
		.bill_box {
			margin-top: 50rpx;
			padding: 0 30.77rpx;
			margin-bottom: 69.23rpx;
			.bill_title {
				text-align: center;
				font-family:"Montserrat-SemiBold";
				font-weight: 600;
				font-size: 30.77rpx;
				color: #000000;
				padding-bottom: 46.15rpx;
			}
			.bill {
				.region {
					padding: 19.23rpx 0 25rpx;
					border-top: 2rpx solid #EEEEEE;
					display: flex;
					justify-content: space-between;
					.title_icon {
					   width: 34.62rpx;
					}
				}
				.info_box {
					padding-bottom: 19.23rpx;
					.bill_info {
						display: flex;
						justify-content: space-between;
						margin-bottom: 7.69rpx;
						font-weight: 400;
						font-size: 23rpx;
						color: #000000;
						line-height: 38rpx;
						.key {
							
						}
						.value {
							
						}
					}
				}
			}
		}
	}
</style>