<template>
	<scroll-view scroll-x="true" show-scrollbar="false" @touchmove.stop>
		<view class="flex">
			<view class="flex flex-1 no-wrap" :style="`margin: ${boxMargin}`">
				<view v-for="(tag, idx) in tagArray" :key="tag.id"
					class="tag" :style="setActiveColor(tagId === tag.id)"
					@click="onChangeTag(tag)">
						{{ Object.prototype.toString.call(tag) === '[object Object]' ? tag.name : tag }}
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: "tag-list",
		props: {
			tagArray: {
				type: Array,
				default: () => []
			},
			tagId: {
				type: String | Number,
				default: 1
			},
			activedColor: {
				type: String
			},
			activedBackgroundColor: {
				type: String
			},
			unActivedColor: {
				type: String
			},
			unActivedBackgroundColor: {
				type: String
			},
			boxMargin:{
				type: String,
				defult: 0
			}
		},
		data() {
			return {
			}
		},
		methods: {
			onChangeTag(tag) {
				this.$emit("emitTag", tag)
			},
			setActiveColor(isSelected) {
				if(isSelected) {
					return `background: ${this.activedBackgroundColor}; color: ${this.activedColor}; font-family: 'Montserrat-SemiBold'`
				} else {
					return `background: ${this.unActivedBackgroundColor}; color: ${this.unActivedColor};`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tag {
		margin-right: 23.08rpx;
		padding: 11.54rpx 23.08rpx 9.62rpx;
		height: 54rpx;
		border-radius: 31rpx;
		font-size: 26.92rpx;
		white-space: nowrap; /* 防止内容换行 */
	}
</style>