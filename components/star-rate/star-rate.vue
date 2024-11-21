<template>
	<view class="stars flex align-items-center">
		<block v-for="index in 5" :key="index">
			<image @click="$emit('changeStar',index)" :style="{width:starSize}" mode="widthFix" v-if="index>num" src="@/static/images/p_detail_star@2x.png" />
			<image @click="$emit('changeStar',index)" :style="{width:starSize}" v-else mode="widthFix" src="@/static/images/p_detail_fill_star@2x.png" />
		</block>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"star-rate",
		props: {
			num: {
				type: Number,
				default: 0
			},
			starSize: {
				type: String,
				default: '36rpx'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
</style>