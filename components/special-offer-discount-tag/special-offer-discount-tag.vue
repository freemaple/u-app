<template>
	<view class="special-offer-discount-tag-box">
		<view class="tag_image_box">
			<image class="img" src="@/static/images/lower_price/discount_tag_icon@2x.png" style="width: 100%;" mode="widthFix" />
		</view>
		<view class="discount_tag_value" :style="{ fontSize: uptateFontSize }">
			<text class="font-bold value">
				-{{discount}}</text>
			<text>%</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"special-offer-discount-tab",
		props:{
			discount: {
				type: [Number,String],
				default:''
			},
			fontSize: {
				type: String,
				default: '27rpx'
			}
		},
		computed: {
			uptateFontSize() {
				return this.fontSize;
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.special-offer-discount-tag-box {
	position: absolute;
	left: 0;
	top: 0;
	width: 92rpx;
	height: 38rpx;
	.tag_image_box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	.discount_tag_value {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		color: #fff;
		font-size: 23rpx;
		.value {
			font-size: inherit;
		}
	}
}
</style>