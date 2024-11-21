<template>
		<view>
			<pageHeader :styleType="2" :isTitleUppercase="true" :title="$t('goods_detail.assistant')"></pageHeader>
			<view class="poster">
				<image :src="staticblock['app-unicoeye-assistant'].AssistantPicUrl" mode="widthFix" style="width: 100%"></image>
			</view>
		</view>
</template>

<script>
	export default {
		name: "assistant",
		onLoad() {
			this.getStaticblock()
		},
		data() {
			return {
				staticblock: {
					'app-unicoeye-assistant': {
						AssistantPicUrl: ""
					}
				}
			}
		},
		methods: {
			// 获取静态块
			getStaticblock() {
				this.$apis.getStaticblock({identify:'app-unicoeye-assistant'}).then(res=>{
					var data = res.data || {};
					var filterData = Object.fromEntries(
						Object.entries(data).filter(([key, value]) => value !== null && value !== '')
					);
					this.staticblock = {...this.staticblock,...filterData}
				})
				console.log(this.staticblock)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.poster {
		margin-top: 92.31rpx;
		width: 100vw;
		height: 100%;
	}
</style>