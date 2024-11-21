<template>
	<view class="stars flex">
		<block v-for="index in 5" :key="index">
			<view @click="$emit('changeStar',index)"><view :style="{fontSize:starSize}" class="iconfont icon-star" :class="index>num?'icon-gray-star':'icon-pink-star'"></view></view>
		</block>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"fiveStarPraise",
		props: {
			num: {
				type: Number,
				default: 0
			},
			starSize: {
				type: String,
				default: '40rpx'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.icon-star:before {
	content: "\E6BF";
}
.icon-star.icon-gray-star {
	color: #e5e5e5;
}
.icon-star.icon-pink-star {
	color: #FA6900;
}
</style>