<template>
	<view class="orders">
		<view class="order_banner flex align-items-center justify-content-between">
			<view class="my_orders">
				{{$t('my.my_orders')}}
			</view>
			<view class="view_all  flex align-items-center" @click="navTo('/pages/order/order-list')">
				{{$t('my.view_all')}}
				<!-- <i class="iconfont"></i> -->
			</view>
		</view>
		<view class="order_entrance">
			<view v-for="item in orderEntrances" :key="item.type"
				@tap="handleToOrder(item.code)" 
				class="single_entrance">
				<uni-badge absolute="rightTop" type="error" size="small"  :max-num='999' :text="item.count>0 ? item.count : ''">
					<i class="icon" v-if="item.icon" :class="item.icon"></i>
					<view v-else class="images_box">
						<image :src="item.src" :alt="item.desc" mode="widthFix" />
					</view>
				</uni-badge>
				<text>{{ item.type }}</text>
			</view>	
		</view>
	</view>
</template>

<script>
export default {
	props: {
		orderEntrances: {
			type: Array,
			default: []
		}
	},	
	methods: {
		handleToOrder(order_status) {
			this.navTo('/pages/order/order-list?order_status=' + order_status)
		},
		navTo(url, type) {
			if (!this.$store.getters.hasLogin) {
				url = '/pages/login/index?in_site_source=account';
			}
			if (url) {
				if (type && type === 'web') {
					window.location.href = url
				} else {
					uni.navigateTo({
						url
					})
				}
			}

		},
	}
}
</script>

<style lang="scss">
.orders {
	z-index: 1;
	background: #FFFFFF;
	box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0,0,0,0.1);
	border-radius: 15rpx;
	margin: 0 30.77rpx 15.38rpx;
	width: 688.46rpx;
	.order_banner {
		width: 100%;
		box-sizing: border-box;
		padding: 28.85rpx 30.77rpx;
		.my_orders {
			font-size: 31rpx;
			color: #222;
			line-height: 36rpx;
		}
		.view_all {
			font-weight: 500;
			font-size: 23rpx;
			color: #666;
			line-height: 27rpx;
			// >i { font-size: 40rpx; &::before { content: "\e609"; } }
		}
	}

	.order_entrance {
		display: flex;
		justify-content: space-between;
		margin: 19.23rpx 0 36.54rpx 0;
		padding: 0 80.77rpx 0 86.54rpx;
		.single_entrance {
			display: flex;
			align-items: center;
			flex-direction: column;
			font-family: 'Montserrat-Regular';
			font-weight: 400;
			font-size: 23rpx;
			color: #666666;
			line-height: 27rpx;
			// i.icon {
			// 	margin-bottom: 8rpx;
			// 	display: inline-block;
			// }
			.images_box {
				image {
					width: 56rpx;
				}
			}
		}
	}

}
</style>