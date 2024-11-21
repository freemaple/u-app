<template>
	<view class="my-orders">
		<view class="title flex align-items-center justify-content-between">
			<view class="text">
				{{$t('my.my_orders')}}
			</view>
			<view class="view-all flex align-items-center" @click="navTo('/pages/order/order-list')">
				{{$t('my.view_all')}}
				<i class="iconfont"></i>
			</view>
		</view>
		<view class="my-order-entrance flex justify-content-between">
				<view @tap="handleToOrder(item.code)" v-for="item in orderEntrances" :key="item.type"
					class="single-entrance flex flex-column align-items-center">
					<uni-badge absolute="rightTop" type="error" size="small"  :max-num='999' :text="item.count>0 ? item.count : ''">
						<i class="icon" v-if="item.icon" :class="item.icon"></i>
						<view v-else class="img-wrap">
							<image class="img" :src="item.src" :alt="item.desc"/>
						</view>
					</uni-badge>
					<view class="text">
						{{ item.type }}
					</view>
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
.my-orders {
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
	width: 702rpx;
	height: 241.56rpx;
	border-radius: 8rpx;
	background-color: #fff;
	z-index: 1;
	margin-bottom: 24rpx;
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08);

	.title {
		width: 100%;
		height: 96rpx;
		box-sizing: border-box;
		padding: 0 24rpx;

		.text {
			font-size: 32rpx;
			color: #000;
			font-weight: 700;
		}

		.view-all {
			color: #999;
			font-size: 24rpx;

			>i {
				font-size: 40rpx;

				&::before {
					content: "\e609";
				}
			}
		}
	}

	.my-order-entrance {
		height: 145.56rpx;
		box-sizing: border-box;
		padding: 15.9997rpx 24rpx;

		.single-entrance {
			height: 100rpx;
			width: 218rpx;
			font-size: 24rpx;
			color: rgba(0, 0, 0, .87);
			margin-bottom: 16rpx;
			i.icon {
				margin-bottom: 8rpx;
				display: inline-block;
			}
			.img-wrap {
				width: 56rpx;
				height: 64rpx;

				.img {
					margin-bottom: 8rpx;
					width: 100%;
					height: 100%;
				}
			}
		}
	}

}
</style>