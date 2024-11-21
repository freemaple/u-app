<template>
  <view v-show="showFilter" class="filter-modal">
			<view class="filter-header flex">
				<view class="filter-close" @tap="handleClose">
					<i class="iconfont"></i>
				</view>
				<view class="filter-title">
					{{$t('search.filter')}}
				</view>
			</view>
			<view class="filter-inner">
				<view class="filter-range flex align-items-center justify-content-between">
					<view class="price-title">
						{{$t('search.filter_price')}}
					</view>
					<view class="range-box flex align-items-center justify-content-between">
						<view class="range-low flex align-items-center justify-content-center">
							<input v-model="lowPrice" class="uni-input" placeholder="$" />
						</view>
						<view class="range-gap flex align-items-center justify-content-center">
							-
						</view>
						<view class="range-high flex align-items-center justify-content-center">
							<input v-model="highPrice" class="uni-input" placeholder="$" />
						</view>
					</view>
				</view>

			</view>
			<view class="filter-bottom flex">
				<view class="bottom-reset" @tap="resetFilter">
					{{$t('search.search_reset')}}
				</view>
				<view @tap="filterPrice" class="bottom-confirm">
					{{$t('search.search_apply')}}
				</view>
			</view>
		</view>
</template>

<script>
export default {
	data() {
		return {
			lowPrice: '',
			highPrice: ''
		}
	},
    props: {
        showFilter: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        handleClose() {
            this.$emit('closeFilter')
        },
		filterPrice(){
			let val = ''
			if(this.lowPrice&&this.highPrice){
				val = `${this.lowPrice}-${this.highPrice}`
			}else{
				val = this.lowPrice || this.highPrice
			}
			this.$emit('filterPrice', val)
		},
		resetFilter() {
			this.lowPrice = ''
			this.highPrice = ''
			this.$emit('filterPrice')
		}
    }

}
</script>

<style scoped lang="scss">
@import '@/common/mixins.scss';
.filter-modal {
	width: 100%;
	height: 100%;
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99999;
    
/deep/.uni-input {
	height: 64rpx;
	line-height: 64rpx;
	text-align: center;
	font-size: 26rpx !important;
	background-color: #f8f8f8;
}

/deep/ .uni-input-wrapper {
	height: 64rpx;
}

/deep/ .uni-input-input {
	height: 64rpx;
}

/deep/ .uni-input-placeholder {
	height: 64rpx !important;
	text-align: center;

}


	.filter-header {
		width: 100%;
		height: 96rpx;
		font-size: 34rpx;
		// box-shadow: 0 1px 0 rgba(0, 0, 0, 8%);
		position: relative;
		@include onepxBorder(#e0e0e0);
		.filter-close {
			width: 102rpx;
			height: 96rpx;
			text-align: center;

			&>i::before {
				content: '\E619';
				width: 102rpx;
				height: 96rpx;
				font-size: 48rpx;
				line-height: 96rpx;
				color: #666;
			}
		}

		.filter-title {
			line-height: 96rpx;
			text-align: center;
			margin-left: 50rpx;
		}
	}

	.filter-inner {
		width: 100%;
		box-sizing: border-box;
		padding-top: 16rpx;

		.filter-range {
			width: 100%;
			height: 96rpx;
			box-sizing: border-box;
			padding: 0 32rpx;
			font-size: 28rpx;

			.price-title {
				color: #333;
			}

			.range-box {
				.range-low {
					width: 224rpx;
				}

				.range-gap {
					width: 56rpx;
					color: #ccc;
				}

				.range-high {
					width: 224rpx;

				}
			}
		}
	}

	.filter-bottom {
		position: fixed;
		width: 100%;
		font-size: 30rpx;
		height: 96rpx;
		bottom: 0;
		left: 0;

		.bottom-reset {
			width: 50%;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			color: #999;
		}

		.bottom-confirm {
			width: 50%;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			color: #f85184;
		}
	}
}

</style>