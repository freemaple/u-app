<template>
	<uni-popup ref="fraudulentRef">
		<popupContentTemplate class="wrapper" @close="close()" :title="title">
			<template v-slot:content>
				<view class="fraudulent_content" v-html="content"></view>
			</template>
			<template v-slot:footer>
				<button class="btn-close" type="primary" @tap="close()">{{$t("fraudulent.ok")}}</button>
			</template>
		</popupContentTemplate>
	</uni-popup>
</template>
<script>
	export default {
		data() {
			return {
				title: this.$t('fraudulent.title'),
				content: '',
			}
		},
		methods: {
			getData() {
				uni.showLoading()
				this.$apis.getStaticblock({
					identify: 'distribute-fraudulent',
					is_html: 1
				}).then(res => {
					this.content = res.data['distribute-fraudulent'];
					this.$refs.fraudulentRef.open()
				}).finally(()=> {
					uni.hideLoading()
				})
			},
			close() {
				this.$refs.fraudulentRef.close()
			},
			open() {
				if(!this.content) {
					this.getData()
				} else {
					this.$refs.fraudulentRef.open()
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.wrapper {
		border-radius: 24rpx;
		width: 626rpx;
		position: relative;


		::v-deep .title {
			padding-top: 16rpx;
			color: #222 !important;
		}

		::v-deep {
			.main-content-box {
				overflow: visible !important;
				max-height: none !important;
			}
			.icon-close {
				position: absolute;
				right: 16rpx;
				top: 16rpx;
				font-size: 36rpx !important;
			}
			.header-title {
				font-weight: bold;
				font-size: 27rpx;
				line-height: 47rpx;
			}
			.content {
				font-size: 27rpx;
				line-height: 47rpx;
				padding-inline-start: 0;
				list-style: none;
			}
			
			.content-item {
				line-height: 47rpx;
				display: flex;
				flex-wrap: nowrap;
				.dot {
					margin-right: 8rpx;
					margin-left: 4rpx;
				}
			}
			.fraudulent-item {
				margin-bottom: 25rpx;
			}
			.btn-close::after {
				border: none !important;
			}
		}

		.btn-close {
			height: 81rpx;
			margin: 20rpx 32rpx 0;
			font-size: 31rpx;
			line-height: 81rpx;
			border-radius: 42rpx;
		}
		
		.fraudulent_content {
			max-height: 610rpx;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
</style>