<template>
		<view class="scroll_bar" :style="setTop(distanceFromList)">
			<view v-for="(i, idx) in validDotNum" :class="setScrollBar(idx)" :style="setColor(dotColor)"></view>
		</view>
</template>

<script>
	export default {
		name: "scroll-bar",
		computed: {
			validDotNum() {
				return isNaN(this.dotNum)? 0 : this.dotNum;
			}
		},
		props: {
			dotNum: {
				type: Number,
				default: 5
			},
			scrollLeft: {
				type: Number,
				default: 0
			},
			scrollWidth: {
				type: Number,
				default: 0
			},
			dotColor: {
				type: String,
				default: "#999"
			},
			distanceFromList: {
				type: String,
				default: "42.31rpx"
			},
			dotType: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				activeDot: 0
			}
		},
		watch: {
			scrollLeft(val) {
				if(val == 0) {
					this.activeDot = 0
				}
				if(val == this.scrollWidth) {
					this.activeDot = this.dotNum
				}
				const sectionPart = val / this.scrollWidth
				let nowIdxActive = this.getDotIdx(sectionPart)
				this.setScrollBar(nowIdxActive)
			}
		},
		methods: {
			getDotIdx(sectionPart) {
				if(sectionPart > 1) {
					this.activeDot = this.dotNum - 1
				} else {
					for(let i = 1; i <= this.dotNum; i++) {
						if(i / this.dotNum < sectionPart && i+1 / this.dotNum > sectionPart){
							this.activeDot = i
						}
					}
				}
			},
			setScrollBar(idx) {
				if(idx === this.activeDot) {
					return this.dotType == 'shoppingCartPopup' ? 'shoppingCartPopup_dot_active' : 'bar_dot_active'
				} else {
					return this.dotType == 'shoppingCartPopup' ? 'shoppingCartPopup_dot' : 'bar_dot'
				}
			},
			setColor(color) {
				return `background-color: ${this.dotColor};`
			},
			setTop(distanceFromList) {
				return `position: relative; top: ${distanceFromList}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll_bar {
		display: flex;
		justify-content: center;
		align-items: center;
		.bar_dot, .bar_dot_active {
			height: 8rpx;
			border-radius: 42rpx;
			margin-right: 7.69rpx;
		}
		.bar_dot {
			width: 12rpx;
			opacity: 0.3;
		}
		.bar_dot_active {
			width: 23rpx;
		}
		
		.shoppingCartPopup_dot_active {
			width: 35rpx;
			height: 12rpx;
			border-radius: 15rpx;
			background: rgba(255,255,255,0.8);
			border: 2px solid #222222;
			margin-right: 11.54rpx;
		}
		.shoppingCartPopup_dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 15rpx;
			background: rgba(255,255,255,0.4);
			border: 2rpx solid #D9D9D9;
			margin-right: 11.54rpx;
		}
	}
</style>