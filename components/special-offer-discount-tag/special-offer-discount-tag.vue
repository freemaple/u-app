<template>
	<view class="special-offer-discount-tag-box" 
		:style="{ fontSize: uptateFontSize }"
		:class="isSpecial ? 'specialBg' : 'normalBg'">
		<text class="font-bold value">{{discount}}%{{$t('goods_detail.OFF')}}</text>
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
				default: '19.24rpx'
			},
			isSpecial: {
				type: Boolean,
				default: true
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
	left: 7.7rpx;
	top: 7.7rpx;
	padding: 5.77rpx 13.47rpx;
	color: #fff;
	border-radius: 38.47rpx;
}
.specialBg {
	background: url(../off-tag/icons/offTab.png) no-repeat center/cover;
}
.normalBg {
	background: #814EFF;
}
</style>