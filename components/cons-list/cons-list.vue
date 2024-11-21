<template>
	<view class="flex goods-box">
		<view @tap="toDetailsTap(good)" class="good"
			v-for="good in listData" :key="good.id">
			<image class="good-img" :src="good.url"  />
			<off-tag class="off-tag" :tagType="good.special_price ? '' : '2'"></off-tag>
			<!-- <stock-remaining v-if="showStockRemaining"></stock-remaining> -->
			<view class="good-name">{{ good.name }}</view>
			<view>
				<view v-if="good.special_price" class="good-price flex">
					<view class="good-price_num">{{`${good.special_price.symbol}${good.special_price.value}`}}</view>
					<view class="good-price_val font-MR">{{`${good.price.symbol}${good.price.value}`}}</view>
				</view>
				<view v-else class="good-priceNormal">
					<view class="good-priceNormal_num">{{`${good.price.symbol}${good.price.value}`}}</view>
				</view>
			</view>
			<view class="good-btn">
				<button>
					<text class="btn-text">ADD TO BAG</text>
				</button>
			</view>
		</view>
		<view class="fake_good" v-if="listData.length % 2 !== 0"></view>
	</view>
</template>

<script>
	export default {
		name: "cons-list",
		props: {
			listData: {
				type: Array,
				default:() => [
					{
						id: 1, 
						name: "[Pre-Sale] SSSStardust Brown 6 Months Contact Lenses", 
						price: {
							code: "USD",
							symbol: "$",
							value: "190.00"
						},
						special_price: {
							code: "USD",
							symbol: "$",
							value: "129.00"
						},
						special_price_off: 99,
						url: "https://img.dressin.com/media/catalog/product/cache/bd935443df1c50537d4edaab4af5d446/450/600/d/hl/dihl001488/plus-size-gingham-plaid-button-lapel-regular-sleeve-long-sleeve-blouse-27870-1.webp?v=4"
					},
					{
						id: 2, 
						name: "[Pre-Sale] Stardust Brown 6 Months Contact Lenses", 
						price: {
							code: "USD",
							symbol: "$",
							value: "129.00"
						},
						special_price_off: 99,
						url: "https://img.dressin.com/media/catalog/product/cache/bd935443df1c50537d4edaab4af5d446/450/600/d/hl/dihl001488/plus-size-gingham-plaid-button-lapel-regular-sleeve-long-sleeve-blouse-27870-1.webp?v=4"
					},
					{
						id: 3, 
						name: "[Pre-Sale] Stardust Brown 6 Months Contact Lenses", 
						price: {
							code: "USD",
							symbol: "$",
							value: "123.00"
						},
						special_price: {
							code: "USD",
							symbol: "$",
							value: "123.00"
						},
						special_price_off: 99,
						url: "https://img.dressin.com/media/catalog/product/cache/bd935443df1c50537d4edaab4af5d446/450/600/d/hl/dihl001488/plus-size-gingham-plaid-button-lapel-regular-sleeve-long-sleeve-blouse-27870-1.webp?v=4"
					}
				]
			},
			showOffTag: {
				type: Boolean,
				default: false
			},
			showStockRemaining: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	%font_Montserrat {
	    font-family: 'Montserrat-Medium';
	    font-weight: 600;
	    letter-spacing: 0rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}
	.goods-box {
		justify-content: space-evenly;
		.good {
			position: relative;
			margin-bottom: 38.46rpx;
			image {
				width: 328.85rpx;
				height: 328.85rpx;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
			}
			.off-tag {
				position: absolute;
				top: 7.69rpx;
				left: 7.69rpx;
			}
			&-name {
				@extend %font_Montserrat;
				width: 328.85rpx;
				height: 61.31rpx;
				font-weight: 500;
				font-size: 23.08rpx;
				color: #666666;
				line-height: 30.77rpx;
				text-align: left;
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			&-price, &-priceNormal {
				@extend %font_Montserrat;
				width: 277rpx;
				height: 38rpx;
				font-weight: 500;
				font-size: 31rpx;
				color: #8A61E7;
				line-height: 36rpx;
				text-align: left;
				margin: 7.69rpx 0 15.38rpx 0;
				align-items: center;
				padding-bottom: 16rpx;
				&_num {
					font-size: 30.77rpx;
					color: #8A61E7;
				}
				&_val {
					border-radius: 6rpx;
					font-size: 23rpx;
					padding: 0 8rpx;
					margin-left: 10rpx;
					line-height: 28rpx;
					text-decoration: line-through;
					color: #999999;
				}
			}
			&-priceNormal {
				color: #393939;
				&_num {
					font-size: 30.77rpx;
					color: #393939;
				}
			}
			&-btn {
				width: 328.85rpx;
				button {
					width: 100%;
					height: 62rpx;
					border-radius: 408rpx 408rpx 408rpx 408rpx;
					border: 2rpx solid #393939;
					background-color: #FFFFFF;
					position: relative;
					.btn-text {
						@extend %font_Montserrat;
						width: 154rpx;
						height: 29rpx;
						font-weight: 500;
						font-size: 23rpx !important;
						color: #393939;
						line-height: 27rpx;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}
	}
	// 处理space-evenly当商品数量是单数时末列首项会居中
	.fake_good {
		background-color: #52B948;
		flex: 0 0 328.85rpx;
		height: 0px;
	}
</style>