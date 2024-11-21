<template>
	<view>
		<uni-popup ref='popup' type="bottom">
			<scroll-view scroll-y="true" id="pop-lists" class="pop-lists" :style="'maxHeight:' + scrollH + 'px'">
				<view mode="card" v-for="item in cards" :key="item.value" class="list-item">
					<view :class="item.value === choosedMenu.value ? 'ischecked' : ''" @tap="handleChoose(item)">
						{{ item.label }}
					</view>
					<view v-show="item.value === choosedMenu.value" class="right-checked">
						<i class="iconfont"></i>

					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scrollH: 0,
		}
	},
	props: {
		cards: {
			type: Array,
			default: [],
		},
		choosedMenu: {
			type: Object,
			default: {
				label: 'Hot',
				value: 'hot'
			}
		}
	},

	methods: {
		open() {
			let that = this
			that.$refs['popup'].open()
			uni.getSystemInfo({
			success: (res)=> {
				that.scrollH = res.screenHeight * 0.75
			}
		})
		},
		handleChoose(menu) {
			const that = this
			//改变父组件的值
			that.$emit('changeMenu', menu)
			setTimeout(() => {
				that.$refs.popup.close()
			}, 200);

		},
	}
}
</script>

<style scoped lang="scss">
.pop-lists {
	// max-height: 576rpx;
	min-height: 96rpx;
	overflow-y: scroll;
	width: 100%;
	background-color: #fff;
	padding: 16rpx 0;
}

.list-item {
	box-sizing: border-box;
	width: 100%;
	height: 96rpx;
	line-height: 96rpx;
	padding: 0 32rpx;
	font-size: 28rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	position: relative;

	.right-checked {
		position: absolute;
		right: 40rpx;
		top: 0rpx;
		color: #f85184;
		font-size: 48rpx;

		i::before {
			content: "\E60F";
		}
	}

	.ischecked {
		color: #f85184;
	}
}
</style>