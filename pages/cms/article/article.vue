<template>
	<view class="cms-article-box dui-padding-top-header">
		<pageHeader :styleType="2" :title="title"></pageHeader>
		<back-top :showBtn="showBacktopBtn"></back-top>
		<view class="article-main">
			<view v-html="content"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				showBacktopBtn: false,
			}
		},
		computed: {
		  
		},
		methods: {
			// 获取文章
			getDetail(data) {
				this.$apis.cmsArticleDetail({url_key:data}).then(res => {
					this.title = res.data.title;
					this.content = res.data.content;
				})
			}
		},
		onLoad(e) {
			var that = this; // 语言
			that.getDetail(e.url_key)
		},
		onPageScroll: function (t) {
			if (t.scrollTop >= 180) {
				this.showBacktopBtn = true
			} else {
				this.showBacktopBtn = false
			}
    	},
	}
</script>

<style lang="scss" scoped>

::v-deep .article-main {
	padding: 36rpx 32rpx;
	font-family: 'Montserrat-Regular';
	img {
		max-width: 100%;
	}
	.article-title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}
	h1 {
		font-size: 36rpx;
		margin-bottom: 8rpx;
	}
	h2 {
		font-size: 34rpx;
		margin-bottom: 8rpx;
	}
	h3 {
		font-size: 32rpx;
		margin-bottom: 8rpx;
	}
	// key 为 review-guidance 的文章,有些图片要特殊处理一下
	.is-review-guidance-flex-img {
		justify-content: scenter;
		>div {
			width: 33%;
			padding: 5rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			img {
				height: 200rpx;
				width: auto;
			}
		}
	}
}


</style>
