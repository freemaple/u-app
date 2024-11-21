<template>
	<view class="stars flex align-items-center">
		<!-- 
			当前 index < num 时，显示满星
			当前 index > num 且 index - 1 < num,  显示半星  如index是4， 分数是3.58
			当前 index > num 且 index - 1 > num,  显示空星  如index是5， 分数num是3.58 
		-->
		<block v-for="index in 5" :key="index">
			<!-- 满星 -->
			<image v-if="num >= index" src="@/static/images/detail/starfilled@2x.png"
				@click="$emit('changeStar',index)" 
				:style="{width:starSize}"  
				mode="widthFix"/>
			<!-- 空星 -->
			<image v-else-if="num < index && num <= index - 1" src="@/static/images/detail/starempty.png"
				@click="$emit('changeStar',index)" 
				:style="{width:starSize}" 
				mode="widthFix"/>
			<!-- 半星 -->
			<image v-else-if="num < index && num > index - 1" src="@/static/images/detail/starhalf@2x.png" 
				@click="$emit('changeStar',index)" 
				:style="{width:starSize}" 
				mode="widthFix"/>
		</block>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"star-rate",
		props: {
			num: {
				type: Number | String,
				default: 0
			},
			starSize: {
				type: String,
				default: '36rpx'
			}
		},
		data() {
			return {};
		}
	}
</script>

<style scoped>
</style>