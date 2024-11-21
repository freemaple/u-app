<template>
	<view class="container">
		<nav-back :title="$t('setting.language')"></nav-back>
		<view class="wrapper">
			<single-multi-check @checkBoxChange="checkBoxChange" :dataLists="languageLists"></single-multi-check>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			language: {},
			languageLists: [],
		};
	},
	onLoad(option) {
		const that = this
		const langList = that.$i18n.availableLocales
		const locale = that.$i18n.locale
		uni.showLoading()
		this.$apis.queryLangLists().then((res)=> {
			if(res.code == 200) {
				uni.hideLoading()
				const {lists} = res.data
				lists.forEach(item=>{
					that.languageLists.push({
						name: item.languageName,
						value: item.code,
						checked: item.selected,
					})
				})
			}
		})
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('changeLang', (data) => {
			that.languageLists.forEach(item => {
				if (item.value === data.checkedVal) {
					item.checked = true
				}
			})
		})
	},
	methods: {
		checkBoxChange(data) {
			if (!data.length || data[0] == this.$i18n.locale) return
			uni.setStorageSync('fecshop-lang', data[0]); // 添加事件
			this.$i18n.locale = data[0];
			uni.setLocale(data[0])
			this.$apis.saveLangLists({
				language: data[0]
			}).then(res=>{
				
			}).catch(err=>{})
			//刷新部分页面
			uni.$emit('languageChange')
			uni.$emit('homeUpdate');
		},
		handleChange(e) {
			this.checkedVal = e.target.value[0]
			//api
			setTimeout(() => {
				// uni.navigateBack(-1)
			}, 1000)
		},
	}
}
</script>

<style scoped >
.container {
	font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
	background-color: #f3f3f3;
	height: 100%;
}
</style>
