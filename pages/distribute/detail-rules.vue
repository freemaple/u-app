<template>
	<view class="detail-rules-box dui-padding-top-header">
		<pageHeader :isTitleUppercase="true" :showShadow="true" :styleType="2" :title="$t('distribute.generateurl.detail_rules_title')"></pageHeader>
		<view class="tip-box">
			<view class="content">
				<view class="text1" v-html="distribute_share_article.text1"></view>
				<view class="text2" v-html="distribute_share_article.text2"></view>
				<view class="text3" v-html="distribute_share_article.text3"></view>
				<view class="rule-tab-box" v-if="distribute_share_article.text4">
					<view class="rule-item-box" v-for="(item,index) in distribute_share_article.text4" :key="index" :id="`rule-item-way-${index}`">
						<view class="title-box"  @click="ruleOpenObj['open_'+index] = !ruleOpenObj['open_'+index];ruleOpenClick(item,index)">
							<view class="name">{{item.title}}</view>
							<image class="icon" mode="widthFix" :src="ruleOpenObj['open_'+index]?item.icon_down:item.icon_right"></image>
						</view>
						<view v-if="ruleOpenObj['open_'+index]">
							<view class="content-box" v-html="item.content"></view>
							<view @click="handleClickBtn(item.btn)" class="rule-btn" v-if="item.btn">{{item.btn.name}}</view>
						</view>
					</view>
				</view>
				
				<view v-if="distribute_share_article.text5">
					<view v-for="(item,index) in distribute_share_article.text5" :index="index">
						<view class="content-box" v-html="item.content"></view>
						<view class="rule-btn" id="rule-get-now" @click="handleClickBtn(item.btn);btnEvent(item)" v-if="item.btn">{{item.btn.name}}</view>
					</view>
				</view>
				<view class="text6-box" v-if="distribute_share_article.text6">
					<view class="title font-bold">{{distribute_share_article.text6.title}}</view>
					<view class="text6-content-box" v-if="distribute_share_article.text6.content">
						<view class="content-item" v-for="(item,index) in distribute_share_article.text6.content" :key="index">
							<view class="title-m-tb c_title" :class="item.class_name" v-html="item.title"></view>
							<view class="text6-content" v-html="item.content"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				distribute_share_article:{},
				ruleOpenObj:{},
				anchorPoint:'',
				headerHeight:0,
				scrollTop:0,
				observerElements: [{
					elementSelector:  '#rule-get-now',
					event_category: 'rewards_rules',
					event_action: 'rewards_rules_page',
					event_name: 'get now',
					event_data: {
						event_value: 'get now'
					},
					module: 'rewards_rules'
				}]
			}
		},
		onLoad(e) {
			this.anchorPoint = e.anchorPoint;
			this.getInfo();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'rewards_rules',
				event_action: 'rewards_rules_visit',
				event_name: 'rewards_rules_visit'
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			this.$debounce(() => {
				this.pageScrollObserver();
			}, 200)
		},
		mounted() {
			// #ifdef H5
			// 恢复页面滚动
			document.body.style.overflow = 'auto';
			//#endif
		},
		methods: {
			handleClickBtn(data) {
				uni.setStorageSync('shareDetailRules',1)
				// 运行APP到真机不兼容
				// // 获取页面栈
				// let pages = getCurrentPages();
				// // 获取上一个页面实例
				// let previousPage = pages[pages.length - 2];
				// // 设置上一个页面的参数
				// if(previousPage) {
				// 	previousPage.setData({
				// 	  btnToCenter: 1
				// 	});
				// }
				this.$public.handleGoBack();
				// uni.redirectTo({
				// 	url:'/pages/distribute/generateurl?btnToCenter=1'
				// })
			},
			btnEvent(item){
				this.$maEvent.custom_event({
					event_category: 'rewards_rules',
					event_action: 'rewards_get_button',
					event_name: 'get now',
					module: 'rewards_rules',
				});
			},
			getInfo() {
				uni.showLoading();
				this.$apis.getDistributeRuleDetail().then(res => {
					this.distribute_share_article = res.data.distribute_share.distribute_share_article;
					if(this.distribute_share_article.text4&&this.distribute_share_article.text4.length) {
						var obj = {};
						this.distribute_share_article.text4.map((item,index)=>{
							obj['open_'+index] = false
						})
						this.ruleOpenObj = obj;
						this.$nextTick(() => {
							this.pageScrollObserver();
						});
					}
					if(this.anchorPoint) {
						setTimeout(()=>{
							this.$nextTick(()=>{
								uni.createSelectorQuery().select('.detail-rules-box .page-header-box').boundingClientRect(data => {
									this.headerHeight = data.height;
								}).exec((res)=>{
									uni.createSelectorQuery().select('.rewardWithdraw').boundingClientRect(rect => {
										uni.pageScrollTo({
											duration: 300, // 滚动动画过渡时间
											scrollTop: rect.top+this.scrollTop-this.headerHeight*1.3, // 滚动的值
										})
									}).exec();
									uni.hideLoading()
								});
							});
						},1000)
					} else {
						uni.hideLoading()
					}
				}).catch(e=>{
					uni.hideLoading()
				});
			},
			ruleOpenClick(item, index){
				if(this.ruleOpenObj['open_'+index]){
					this.$maEvent.custom_event({
						event_category: 'rewards_rules',
						event_action: 'rewards_rules_button',
						event_name: 'way' + (index + 1),
						event_data: {
							event_value: 'way ' + (index + 1)
						},
						module: 'rewards_rules',
					});
				}
			},
			pageScrollObserver(){
				if(!this.scrollObserver){
					this.scrollObserver = this.$public.createIntersectionObserver();
				}
				this.observerElements.forEach((item, index) => {
					if(item.observer){
						return true;
					}
					let elementSelector = item.elementSelector;
					this.$public.observeVisibility(this.scrollObserver, elementSelector, () => {
						if(item.observer){
							return false;
						}
						this.$maEvent.impression_event({
							event_category: item.event_category,
							event_action: item.event_action,
							event_name: item.event_name,
							event_data: item.event_data,
							module: item.module
						});
						item.observer = true;
						this.observerElements[index].observer = true;
					});
				});
				this.distribute_share_article.text4.forEach((item, index) => {
					if(item.observer){
						return true;
					}
					let elementSelector = "#rule-item-way-" + index;
					this.$public.observeVisibility(this.scrollObserver, elementSelector, () => {
						if(item.observer){
							return false;
						}
						this.$maEvent.impression_event({
							event_category: 'rewards_rules',
							event_action: 'rewards_rules_page',
							event_name: 'way ' + (index + 1),
							event_data: {
								event_value: 'way ' + (index + 1)
							},
							module: 'rewards_rules'
						});
						item.observer = true;
						this.distribute_share_article.text4[index].observer = true;
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
/deep/.gradient_text{
    background: linear-gradient(to right, #780EFF, #DA49D6, #FF6EA7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
#rule-get-now{
	margin-top: 34.62rpx;
}
.detail-rules-box {
	.tip-box {
		padding: 47.19rpx 39.74rpx 89.4rpx 39.74rpx;
		background: #fff;
		::v-deep {
			.content {
				font-size: 28rpx;
				line-height: 1.5;
				.or-line {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height:89.4rpx;
					font-size: 29.8rpx;
					width: 397.35rpx;
					color: #333333FF;
					.line {
						width: 129.14rpx;
						height: 1px;
						background: #999999FF;
					}
				}
				.text1 {
					font-size: 32rpx;
					margin-bottom: 22.35rpx;
				}
				.text2 {
					margin-bottom: 49.67rpx;
				}
				.text3 {
					margin-bottom: 34.28rpx;
				}
				.rule-tab-box {
					.rule-item-box {
						padding-bottom:23rpx;
						border-top: 1px solid #EEEEEEFF;
						padding-top: 23rpx;
						.title-box {
							display: flex;
							align-items: center;
							justify-content: space-between;
							color: #000000FF;
							font-weight: bold;
							.icon {
								width: 30.77rpx;
							}
						}
					}
					.rule-item-box:last-child {
						border-bottom:1px solid #EEEEEEFF;
					}
				}
				
				.content-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-top: 47.19rpx;
					.content-img {
						max-width: 100%;
						width: 397.35rpx;
					}
					.icon-jiantou {
						width: 29.66rpx !important;
						margin-left: 14rpx;
					}
				}
				.rule-btn {
					height: 81rpx;
					background: #000000;
					font-weight: bold;
					font-size: 32rpx;
					line-height: 81rpx;
					color: #ffffff;
					text-align: center;
					margin-bottom: 64.57rpx;
					border-radius: 40rpx;

				}
				.mt-15 {
					margin-top: 15rpx;
				}
				.mb-45 {
					margin-bottom: 45rpx;
				}
				.mt-34 {
					margin-top: 34rpx;
				}
				.mb-65 {
					margin-bottom: 65rpx;
				}
				.mt-50 {
					margin-top: 50rpx;
				}
				.text6-box {
					margin-top: 64.57rpx;
					.title {
						line-height: 54.64rpx;
						font-size: 32rpx;
					}
					.c_title {
						font-weight: bold;
					}
					.cg_title {
						font-size: 26rpx;
						font-weight: bold;
					}
					.title-m-tb {
						margin-top: 32.28rpx;
						margin-bottom: 22.35rpx;
					}
					.text-m-b {
						margin-bottom: 19.87rpx;
					}
				}
			}
		}
	}
}
</style>
