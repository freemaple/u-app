<template>
	<view class="special-offer-stock-text-box" v-if="text">
		<image mode="widthFix" class="img" src="@/static/images/lower_price/lower_price_flash@2x.png"></image>
		<view class="text font-bold">{{text}}</view>
	</view>
</template>

<script>
	export default {
		name:"special-offer-stock-text",
		props:{
			text:{
				type: String,
				default:''
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.special-offer-stock-text-box {
	display: flex;
	align-items: center;
	position: absolute;
	bottom: 7.69rpx;
	left: 7.69rpx;
	right: 7.69rpx;
	font-size: 19.23rpx;
	background: #FFF9EFFF;
	.img {
		width: 30.77rpx;
	}
	.text {
		padding-left: 7.69rpx;
		color: #FF5C00FF;
	}
}
</style>