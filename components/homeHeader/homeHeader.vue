<template>
	<view class="title" :style="setMargin()">{{title}}</view>
</template>

<script>
	export default {
		name: "homeHeader",
		props: {
			title: {
				type: String
			},
			mt: {
				type: Number,
				default: 69.23
			},
			mb: {
				type: Number,
				default: 38.46
			}
		},
		methods: {
			setMargin() {
				return `margin: ${this.mt}rpx 0 ${this.mb}rpx`
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';
.title {
	@include font-SemiBold;
	text-align: center;
	text-transform: none;
	line-height: 36.06rpx;
}
</style>