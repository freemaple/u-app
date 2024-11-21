<template>
	<view class="">
		<!-- 分享的时候展示的裂变banner -->
		<view class="distribute-share-banner" v-if="JSON.stringify(shareBannerData) != '{}'">
			<image class="share-banner-img" :src="shareBannerData.img" mode=""></image>
			<view class="share-banner-absolute share-banner-title">{{shareBannerData.title}}</view>
			<view class="share-banner-absolute share-banner-step" :class="'share-banner-step'+(ind+1)" v-for="(item,ind) in shareBannerData.step" :key="ind">
				<view class="share-banner-name-box">
					<view class="share-banner-name">{{item.name}}</view>
					<image class="share-banner-item-img" :src="item.stepBg" mode=""></image>
				</view>
				<view class="share-banner-val">{{item.val}}</view>
			</view>
			<view class="share-banner-btn" v-if="shareBannerData.btn.isShow == 1">
				<view class="" @click="toPage('/pages/distribute/sharestep')">
					{{shareBannerData.btn.val}}
				</view>
			</view>
		</view>
		
		<view class="share-bar-box">
			
			<block v-for="(item,index) in shareAppList">
				<view v-if="item.show" class="share-item flex flex-column align-items-center justify-content-center" @click="item.name === 'CopyURL'?handleCopy():handleShare(item)">
					<image mode="widthFix" :src="item.image"></image>
					<text class="name">{{item.label}}</text>
				</view>
			</block>
		</view>		
	</view>
</template>

<script>
	import fn from '@/common/utils.js'
	import share from '@/common/share.js'
	export default {
		name:"shareBar",
		props:{
			shareData: {
			    type: Object,
			    default: {}
			},
			key_prefix: {
				type:String,
				default: 'distribute_share_'
			},
			// 分享显示的banner
			shareBannerData: {
			    type: Object,
			    default: ()=> {
					return {}
				}
			},
			// 是否不同平台不同文案【目前裂变使用】
			isDifferPlatformWord:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
				shareAppList: [
					{
						name:'Facebook', // label用于前端文案显示
						label:'Facebook',// name：用于逻辑判断使用【不能轻易改动】
						show:true,
						image:require('@/static/images/share-bar-icon/icon_facebook.png'),
					},
					{
						name:'Pinterest',
						label:'Pinterest',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_pinterest.png')
					},
					{
						name:'Instagram',
						label:'Instagram',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_instagram_new.png'),
					},
					{
						name:'Twitter',
						label:'X',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_x@2x.png'),
					},
					{
						name:'Email',
						label:'Email',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_email.png')
					},
					{
						name:'CopyURL',
						label:'CopyURL',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_copyUrl.png')
					},
					{
						name:'More',
						label:'More',
						show:true,
						image:require('@/static/images/share-bar-icon/icon_more.png')
					}
				]
			};
		},
		mounted() {
			this.shareAppList = this.shareAppList.filter(item => 
			    !((item.name === 'Twitter' && !this.$store.state.appConfig.showTwShares) || (item.name === 'Pinterest' && !this.$store.state.appConfig.showPinShares))
			);
		},
		methods: {
			formUrl(url_has_qm,type) {
				if(this.shareData&&this.shareData.url) {
					return url_has_qm?this.shareData.url+'&share='+type:this.shareData.url+'?share='+type;
				} else {
					return '';
				}
			},
			// 分享
			handleShare(data) {
				let type = data.name.toLowerCase();
				let image = this.shareData.image;
				let images = [];
				if(Array.isArray(image)){
					images = image;
				} else {
					images.push(image);
				}
				let shareDataCurrent = {
					type: type,
					description: this.shareData.description || '',
					url: this.shareData.url || '',
					images: images || [],
					hashtag:this.shareData.hashtag || '',
					subject: this.shareData.subject || '',
					account:this.shareData.account || ''
				};
				let url_has_qm = false;
				if(this.shareData.url) {
					url_has_qm = this.shareData.url.includes('?')
				}
				shareDataCurrent.url = this.shareData.url;
				if(this.isDifferPlatformWord) {
					if(type == 'email'){
						shareDataCurrent.subject = this.shareData[this.key_prefix+'email_title'];
						shareDataCurrent.description = this.shareData[this.key_prefix+'email_description'].replace('{{URL}}',this.shareData.url);
						shareDataCurrent.url = ''
					}
					if(type == 'twitter') {
						shareDataCurrent.description = this.shareData[this.key_prefix+'twitter_description'];
						shareDataCurrent.hashtag = this.shareData[this.key_prefix+'twitter_tag'];
						shareDataCurrent.account = this.shareData[this.key_prefix+'twitter_account'];
					}
					if(type == 'facebook') {
						shareDataCurrent.hashtag = this.shareData[this.key_prefix+'facebook_tag'];
						// fb和pinterest才需要前端处理，其余后端处理，因为其他link是在管理后台配置占位符，link位置灵活可变，由后端直接替换
						shareDataCurrent.url = this.formUrl(url_has_qm,'facebook')
					}
					if(type == 'pinterest') {
						// fb和pinterest才需要前端处理，其余后端处理，因为其他link是在管理后台配置占位符，link位置灵活可变，由后端直接替换
						shareDataCurrent.url = this.formUrl(url_has_qm,'pinterest')
					}
					if(type == 'instagram') {
						shareDataCurrent.description = this.shareData[this.key_prefix+'ins_title'];
					}
				} else {
					if(type == 'email'&&this.shareData.prefix_email_content) {
						shareDataCurrent.description = this.shareData.prefix_email_content+this.shareData.description
					}
					if(type == 'twitter'&&this.shareData.tw_share_description) {
						shareDataCurrent.description = this.shareData.tw_share_description+' '+this.shareData.description
					}
					if(type == 'twitter') {
						shareDataCurrent.hashtag = this.shareData.multi_meta_tag;
					} else {
						shareDataCurrent.hashtag = this.shareData.hashtag;
					}
				}
				if(type == 'more'){
					plus.share.sendWithSystem({
						content: shareDataCurrent.description,
						href: shareDataCurrent.url,
					}, (res) => {
						this.shareRecord(type);
					}, (res) => {
						
					});
					return;
				}
				share.init(shareDataCurrent, () => {
					this.shareRecord(type);
					this.$emit('clickBarItem',type)
				});
				this.$emit('click')
			},
			shareRecord(type){
				let url_has_qm = false;
				if(this.shareData.url) {
					url_has_qm = this.shareData.url.includes('?')
				}
				var r_data = {
					platform_type: type,
					share_from: this.shareData.share_from || '',
					share_type: 'app'
				}
				if(this.shareData.product_id){
					r_data['product_id'] = this.shareData.product_id;
					if(!r_data['share_from']){
						r_data['share_from'] = 'product';
					}
				}
				if(this.shareData.url){
					r_data['shareUrl'] = this.formUrl(url_has_qm,type);
				}
				if(!this.shareData.share_link_type){
					this.shareData.share_link_type = 'web';
				}
				if(this.shareData.share_link_type){
					r_data['share_link_type'] = this.shareData.share_link_type;
				}
				if(this.$store.getters.hasLogin){
					this.$apis.shareRecord(r_data);
				}
				if(r_data['share_from'] == 'product'){
					this.$trackEvent.shareProduct(r_data);
				} else if(r_data['share_from'] == 'distribute') {
					this.$trackEvent.shareSite(r_data);
				}
				this.$trackEvent.share_code({
					"event_action":"copy_link_" + this.shareData.share_link_type + "_" + type,
					"event_name": "share code copy from " + this.shareData.share_link_type + " " + type,
					"copy_val": this.formUrl(url_has_qm,type),
					"data_share_link_type": this.shareData.share_link_type,
					"share_type": type,
					"from_page": this.shareData.from_page || '',
					"product_id": this.shareData.product_id || ''
				});
				if(this.shareData.event_data){
					let event_data = this.shareData.event_data;
					if(type){
						event_data.event_name = type;
						event_data.event_data = {
							event_value: type
						}
					}
					this.$maEvent.custom_event(event_data);
				}
				if(this.shareData.from_page == 'product_detail') {
					this.$maEvent.custom_event({
						event_category: 'product_details',
						event_action: 'product_share_type_button',
						event_name: type,
						module: 'product_details_share_type',
						event_data: {
							event_value:type
						}
					});
				}
				const pages = getCurrentPages(); // 获取当前所有页面栈
				const currentPage = pages[pages.length - 1]; // 获取当前页面
				const currentRoute = currentPage.route; // 当前页面的路由路径
				if(currentRoute == 'pages/pay/success' && type == 'copy_url') {
					this.$maEvent.custom_event({
						event_category: 'pay_succeed',
						event_action: 'pay_succeed_share_to_button',
						event_name: 'pay_succeed_share_to_button',
						module: 'pay_succeed',
						event_data: {
							event_value: 'copy_url'
						},
					});
				}
				this.$emit('click')
			},
			// 复制链接
			handleCopy() {
				// let currentUrl = fn.getCurrentPageLink();
				let currentUrl = this.shareData.url;
				if(this.shareData[this.key_prefix+'copy_title']) {
					currentUrl = this.shareData[this.key_prefix+'copy_title']
				}
				var that = this
				uni.setClipboardData({
					data:currentUrl,
					showToast:false,
					success() {
						uni.showToast({
						    title: that.$t('goods_detail.copy_success'),
						    icon: 'none',
						    duration: 3000
						});
						that.shareRecord('copy_url');
					}
				})
			},
			toPage(url) {
				this.$public.handleNavTo(url)
			}
		}
	}
</script>

<style scoped>
.share-bar-box {
	display: flex;
	flex-wrap: wrap;
	overflow: hidden;
	padding: 46rpx 16rpx 26rpx;
}
.share-bar-box .share-item {
	width: calc((100% - 60rpx) / 4);
	margin-right: 20rpx;
	margin-top:40rpx;
}
.share-bar-box .share-item:nth-of-type(4n) {
	margin-right: 0;
}
.share-bar-box .share-item:nth-child(-n+4) {
	margin-top: 0;
}
.share-bar-box .share-item image {
	width: 104rpx;
}
.share-bar-box .share-item .name {
	padding-top: 16rpx;
	font-size: 28rpx;
	color: #333;
}
/* 裂变分享的banner */
.distribute-share-banner {
	position: relative;
}
.share-banner-img {
	width: 100%;
	height: 536rpx;
}
.share-banner-absolute {
	position: absolute;
	left: 80rpx;
}
.share-banner-title {
	top: 212rpx;
	left: 0;
	right: 0;
	text-align: center;
	font-size: 24rpx;
	color: #fff;
}
.share-banner-step {
	display: flex;
	font-size: 24rpx;
}
.share-banner-step1 {
	top: 258rpx;
}
.share-banner-step2 {
	top: 306rpx;
}
.share-banner-step3 {
	top: 352rpx;
}
.share-banner-step4 {
	top: 398rpx;
}
.share-banner-name-box {
	position: relative;
	margin-right: 5rpx;
}
.share-banner-item-img {
	width: 100rpx;
	height: 34rpx;
}
.share-banner-name {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	color: #FF4C00;
	font-weight: bold;
	z-index: 9;
	text-align: center;
}
.share-banner-val {
	color: #fff;
}
.share-banner-btn {
	position: absolute;
	bottom: 28rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}
.share-banner-btn view {
	width: 328rpx;
	height: 56rpx;
	line-height: 56rpx;
	background: linear-gradient(134deg, #FFF3D3 0%, #FFDFD1 100%);
	box-shadow: 0px 8rpx 8rpx 0px rgba(255,96,0,0.5);
	border-radius: 78rpx;
	font-size: 28rpx;
	text-align: center;
	color: #FF4C00;
}
</style>