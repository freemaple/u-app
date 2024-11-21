<template>
	<view class="popup-content-template-box">
		<view class="header-box flex justify-content-between" :class="is_show_header_border?'border-bottom':''">
			<slot name="title">
				<view class="title" style="font-weight: bold;">{{title}}</view>
			</slot>
			<view class="iconfont icon-close" @click="handleClose"></view>
		</view>
		<slot name="extend"></slot>
		<view class="main-content-box">
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
				default:false,
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
		padding: 28rpx 0;
		background: #fff;
		border-radius: 0rpx 0rpx 0px 0px;
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
		padding: 0 32rpx;
		color: rgba(0,0,0,0.9);
	}
</style>
