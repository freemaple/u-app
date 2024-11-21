<template>
	<view class="popup-content-template-box">
		<view class="header-box flex justify-content-between" :class="is_show_header_border?'border-bottom':''">
			<slot name="title">
				<view class="title font-MS">{{title}}</view>
			</slot>
			<view class="iconfont icon-close" @click="handleClose"></view>
		</view>
		<slot name="extend"></slot>
		<view class="main-content-box" 
			:style="{'padding': hidePaddingRight ? '0 0 0 32rpx' : '0 32rpx'}">
			<slot name="content"></slot>
		</view>
		<view class="footer-box">
			<slot name="footer"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "popupContentTemplate",
		props: {
			title: {
				type: String,
				default: ''
			},
			is_show_header_border: {
				type: Boolean,
				default:false
			},
			hidePaddingRight: {
				type: Boolean,
				default:false
			}
		},
		methods: {
			handleClose() {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
	.popup-content-template-box {
		padding: 30.77rpx 0;
		background: #fff;
		border-radius: 16rpx 16rpx 0 0;
	}

	.popup-content-template-box .header-box {
		padding: 32rpx;
		padding-top: 0;
	}
	.popup-content-template-box .header-box.border-bottom{
		@include onepxBorder(#eee);
	}

	.popup-content-template-box .header-box .title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		color: #333;
	}

	.popup-content-template-box .header-box .icon-close {
		font-size: 46rpx;
		color: #333;
	}

	.popup-content-template-box .header-box .icon-close:before {
		content: "\E6AB";
	}

	.popup-content-template-box .main-content-box {
		max-height: 520rpx;
		overflow-y: scroll;
		color: rgba(0,0,0,0.9);
	}
</style>
