<template>
		<view>
			<pageHeader :styleType="2" :title="$t('goods_detail.faq')"></pageHeader>
			<view class="fqa">
				<view class="section" v-for="(value, key) in staticblock['app-unicoeye-fqa']" :key="key">
					<view class="section_title" @tap="handleShow(key)">
						<text>{{key}}</text>
						<image v-if="shouldShowIcon(key)" class="title_icon" src="@/static/images/cart/cart_reduce@2x.png" mode="widthFix"></image>
						<image v-else class="title_icon" src="@/static/images/cart/cart_add@2x.png" mode="widthFix"></image>
					</view>
					<view v-if="shouldShowIcon(key)">
						<view class="section_info" v-for="(item, index) in staticblock['app-unicoeye-fqa'][key]">
							<view class="info_title" :style="{'margin-top': index === 0 ? '19.23rpx' : '42.13rpx'}">
								{{item.paragraphsTitle}}
							</view>
							<view class="info_text" v-for="i in item.paragraphsInfo">
								<view v-html="i.text"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name: "",
		props: {},
		onLoad(e) {
			this.getStaticblock()
		},
		data() {
			return {
				staticblock: {
					'app-unicoeye-fqa': {
						"About Pre-Sale": [],
						"About Product": [],
						"About Order": []
					}
				},
				"About Pre-Sale-Show": false,
				"About Product-Show": false,
				"About Order-Show": false,
			}
		},
		onShow() {
		  this.$maEvent.visit_event({
			event_category: 'faq',
			event_action: 'faq_visit',
			event_name: 'faq_visit'
		  })
		},
		methods: {
			getStaticblock() {
				this.$apis.getStaticblock({identify:'app-unicoeye-fqa'}).then(res=>{
					var data = res.data || {};
					var filterData = Object.fromEntries(
						Object.entries(data).filter(([key, value]) => value !== null && value !== '')
					);
					this.staticblock = {...this.staticblock,...filterData}
				})
			},
			handleShow(key) {
				this[`${key}-Show`] = !this[`${key}-Show`]
			},
			shouldShowIcon(key) {
			  return this[`${key}-Show`];
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/mixins.scss';
.fqa {
	margin: 138.46rpx 46.15rpx; 
	.section {
		border-bottom: 2rpx solid #EEEEEE;
		margin-bottom: 44.23rpx;
		margin-top: 30.77rpx;
		.section_title {
			@include font-SemiBold;
			line-height: 36rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 23.08rpx;
			.title_icon {
				width: 34.62rpx;
			}
		}
		.section_info {
			.info_title {
				font-size: 27rpx;
				color: #222;
				line-height: 38rpx;
				margin-bottom: 11.54rpx;
			}
			.text_start {
				font-family: 'Montserrat-SemiBold' !important;
			}
			.info_text {
				font-family: 'Montserrat-Regular';
				font-size: 27rpx;
				color: #393939;
				line-height: 38rpx;
				margin-bottom: 11.54rpx;
			}
		}
	}
}
</style>