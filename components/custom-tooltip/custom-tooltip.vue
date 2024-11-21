<template>
	<view class="custom-tooltip-box" :class="show?'show':''">
		<view class="custom-tooltip_content">
			<image mode="widthFix" class="icon" src="@/static/images/icon/white-success-icon.png"></image>
			<text>{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"custom-tooltip",
		props: {
			title: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				show:false,
				timer:'',
			};
		},
		methods: {
			open(data) {
				this.show = true;
				if(data.time) {
					this.timer = setTimeout(()=>{
						this.show = false;
					},data.time)
				}
			},
			close() {
				this.show = false;
				clearTimeout(this.timer);
			}
		}
	}
</script>

<style lang="scss" scoped>
.custom-tooltip-box.show {
	opacity: 1;
	z-index: 900;
}
.custom-tooltip-box {
	display: flex;
	justify-content: center;
	position: fixed;
	top: 50%;
	transform: translateY(-50%);
	z-index: 99999;
	left: 0;
	right: 0;
	transition: all .3s ease;
	opacity: 0;
	z-index: -1;
	.custom-tooltip_content {
		background: rgba(0,0,0,0.75);
		border-radius: 8rpx;
		max-width: 616rpx;
		padding: 26.92rpx 65.38rpx 26.92rpx 65.38rpx;
		font-size: 30.77rpx;
		color: #ffffff;
		word-wrap: break-word;
		display: flex;
		align-items: center;
		.icon {
			width: 38.46rpx;
			margin-right: 13.46rpx;
		}
	}
}
</style>