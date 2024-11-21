<template>
	<view class="uni-countdown">
		<text v-if="showIcon" class="iconfont icon-time" :style="{color:color}"></text>
		<view v-if="showDay && d > 0" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor, fontSize: fontSize, padding: padding}">{{d}}{{dayLabel}}</view>
		<view v-if="showDay && d > 0" class="uni-countdown__splitor" :style="{color:splitorColor, padding: padding}">{{daySplitor}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor, fontSize: fontSize, padding: padding}">{{h}}h</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor, padding: padding}">{{showColon ? ':' : '' }}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor, fontSize: fontSize, padding: padding}">{{i}}m</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor, padding: padding}">{{showColon ? ':' : '' }}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor, fontSize: fontSize, padding: padding}">{{s}}s</view>
		<view class="uni-countdown__splitor" v-if="showMs" :style="{color:splitorColor, padding: padding}">{{showColon ? ':' : '' }}s</view>
		<view class="uni-countdown__number" v-if="showMs" :style="{borderColor:borderColor, color:color, background:backgroundColor, fontSize: fontSize, padding: padding}">{{ms}}</view>
	</view>
</template>
<script>
	export default {
		name: "uni-countdown",
		props: {
			showIcon: {
				type: Boolean,
				default: true
			},
			showDay: {
				type: Boolean,
				default: true
			},
			daySplitor: {
				type: String,
				default: 'D'
			},
			dayLabel:{
				type: String,
				default: ''
			},
			showColon: {
				type: Boolean,
				default: true
			},
			showMs: {
				type: Boolean,
				default: false
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#000"
			},
			padding: {
				type: String,
				default: "2px"
			},
			borderRadius:{
				type: String,
				default: "0px"
			},
			fontSize:{
				type: String,
				default: "28rpx"
			},
			color: {
				type: String,
				default: "#f85184"
			},
			splitorColor: {
				type: String,
				default: "#f85184"
			},
			endDate: {
				type: String,
				default: null
			},
			leftTime: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				isEnd: false,
				d: '00', // 天
				h: '00', // 时
				i: '00', // 分
				s: '00', // 秒
				ms: '0' // 毫秒
			}
		},
		created () {
			this.countTime()
		},
		beforeDestroy() {
		},
		methods: {
			countTime() {
				this.leftTimes = this.leftTimes ? this.leftTimes : parseInt(this.leftTime);
				this.handelTime();
				var timerInterval = setInterval(() => {
					this.handelTime(timerInterval);
				}, 1000)
			},
			handelTime(timerInterval){
				var leftTime = this.leftTimes;
				var d, h, m, s, ms;
				if (leftTime > 0) {
					d = Math.floor(leftTime / 60 / 60 / 24) ; // 天
					h = Math.floor(leftTime / 60 / 60 % 24); // 时
					m = Math.floor(leftTime / 60 % 60); // 分
					s = Math.floor(leftTime  % 60); // 秒
					ms = Math.floor(leftTime * 1000 % 1000); // 毫秒
					this.d = d < 10 ? '0' + d : d // 天
					this.h = h < 10 ? "0" + h : h // 时
					this.i = m < 10 ? "0" + m : m // 分
					this.s = s < 10 ? "0" + s : s // 秒
					this.ms = ms < 100 ? ms < 10 ? ms : ms/10 : ms/100 ,// 毫秒
					leftTime -= 1;
					this.leftTimes = leftTime;
				}
				else {
					this.d = '00' // 天
					this.h = '00' // 时
					this.i = '00' // 分
					this.s = '00' // 秒
					this.ms = '000' // 毫秒
					this.$emit('is-down', false);
					clearInterval(timerInterval);
				}
			}
		}
	}
</script>
<style lang="scss">
	$countdown-height:44upx;

	.uni-countdown {
		padding: 2upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		font-size: 30rpx;
		align-items: center;
	}
</style>