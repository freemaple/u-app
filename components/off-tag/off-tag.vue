<template>
		<view :style="setTagWidthHeight()">
			<image v-if="tagType" 
				class="tagFlash" :style="setTagWidthHeight()" src="./icons/offTab@2x.png" />
			<view v-else 
				class="tagNormal" :style="setTagWidthHeight()"></view>
			<text :style="setText()" class="font-bold">{{offPrecent}}%OFF</text>
		</view>
</template>

<script>
	export default {
		name: "off-tag",
		props: {
			tagType: {
				type: Boolean | Number,
				default: false
			},
			offPrecent: {
				type: Number | String,
				default: 0
			},
			ImgWidth: {
				type: String,
				default: '107.69'
			},
			ImgHeight: {
				type: String,
				default: '38.46'
			},
			fs: {
				type: String,
				default: '19.24'
			},
			lh: {
				type: String,
				default: '26.92'
			},
		},
		methods: {
			setTagWidthHeight() {
				return `width: ${this.ImgWidth}rpx; height: ${this.ImgHeight}rpx`
			},
			setText() {
				return `font-size: ${this.fs}rpx; line-height: ${this.lh}rpx`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tagFlash {
		position: absolute;
	}
	.tagNormal {
		position: absolute;
		background: #814EFF;
		border-radius: 38.46rpx;
	}
	text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Montserrat-Bold';
		color: #ffffff;
	}
</style>