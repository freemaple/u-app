<template>
	<view class="container">
		<nav-back :title="$t('setting.settings')"></nav-back>
		<view class="cards-wrapper">
			<view class="setting-cards" v-for="item in settingData" :key="item.title">
				<view class="setting-title">
					{{ item.title }}
				</view>
				<view class="setting-contents">
					<single-card v-for="i in item.cards" :key="i.text" :itemData="i"></single-card>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			language: {},
			settingData: []
		};
	},	
	onShow() {
		this.$maEvent.visit_event({
			event_category: 'set',
			event_action: 'set_visit',
			event_name: 'set_visit'
		})
		const fecshop_currency = uni.getStorageSync('fecshop-currency');
		let locale = this.$t('locale.' + this.$i18n.locale) && this.$t('locale.' + this.$i18n.locale) != 'locale.' + this.$i18n.locale 
		? this.$t('locale.' + this.$i18n.locale) : this.$i18n.locale;
		let delAccountList = [];
		if(this.$store.state.appConfig.delete_acount_status == 1) {
			delAccountList = [{
				text: this.$t('setting.delete_account'),
				type: 'delete_account',
				url: '/pages/setting/delete-account'
			}];
		}
		this.settingData = [
			{
				title: this.$t('setting.settings'),
				cards: [
					{
						text: this.$t('setting.language'),
						checked: locale,
						type: 'lang',
						url: "/pages/language/language",

					},
					{
						text: this.$t('setting.currency'),
						checked: fecshop_currency,
						type: 'currency',
						url: "/pages/currency/currency",
					},
					{
						text: this.$t('setting.change_password'),
						type: 'pwd',
						url: '/pages/change-password/change-password'
					},
					...delAccountList
				]
			},
			{
				title: this.$t('setting.info'),
				cards: [
					{
						text: this.$t('setting.return_policy'),
						type: 'policy',
						url:'/pages/cms/article/article?url_key=app-return-policy'
					},
					{
						text: this.$t('setting.privacy_policy'),
						type: 'privacy',
						url:'/pages/cms/article/article?url_key=app-privacy-policy',
					},
					{
						text: this.$t('setting.faq'),
						type: 'faq',
						url: '/pages/faq/faq'
					},
				]
			}
		]
	},
}
</script>

<style scoped lang="scss">
.container {
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
	background-color: #f3f3f3;
	height: 100%;

	.setting-cards {
		width: 750rpx;
		box-sizing: border-box;
		padding: 0 24rpx;
		margin-bottom: 24rpx;
		background-color: #fff;

		.setting-title {
			width: 100%;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #333;
			font-weight: 700;
		}

		.setting-contents {
			width: 100%;
		}
	}

}
</style>
