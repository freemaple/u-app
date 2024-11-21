<template>
	<view class="container">
		<nav-back :title="$t('setting.currency')"></nav-back>
		<view class="wrapper">
			<single-multi-check @checkBoxChange="checkBoxChange" :dataLists="currencyLists" :multiple="false"></single-multi-check>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			currencyLists: [
			// 	{
			// 	name: 'EUR',
			// 	value: 'EUR',
			// 	checked: false,
			// 	singnature: '€',
			// },
			],
		};
	},
	onLoad(option) {
		const that = this		
		const eventChannel = this.getOpenerEventChannel();
		//获取货币类型列表
		uni.showLoading()
		that.$apis.queryCurrencyLists().then((res)=> {
			if(res.code == '200'){
				uni.hideLoading()
				const {currentCurrency, currencys} = res.data
				const currencyLists = []
				Object.keys(currencys).forEach((item, index) => {
					currencys[item].name = currencys[item].code
					currencys[item].singnature = currencys[item].symbol
					currencys[item].value = currencys[item].code
					currencys[item].checked = false					
					currencys[currentCurrency]['checked'] = true
					currencyLists.push(currencys[item])
					that.$store.commit('SET_CURRENT_CURRENCY',currentCurrency)
					uni.setStorageSync('fecshop-currency', currentCurrency); // 添加事件

				})
				this.currencyLists = currencyLists
			}
			
		})
		//监听路由跳转成功
		/*eventChannel.on('changeCurrency', (data) => {
			that.currencyLists.forEach(item => {
				if (item.value === data.checkedVal) {
					item.checked = true
				} else {
					item.checked = false
				}
			})
		})*/
	},
	methods: {	
		checkBoxChange(val) {
			const that = this
			const currency = val[0]||'USD'
			//调接口更新货币类型
			that.$apis.changecurrency({currency}).then((res)=> {
				if(res.code == '200') {
				//更新状态
				uni.setStorageSync('fecshop-currency', val[0]); // 添加事件
				that.$store.commit('SET_CURRENT_CURRENCY', val[0])
				uni.navigateBack(-1)
				}
			})
						
		},
		handleChange() {
			//api
			setTimeout(() => {
				uni.navigateBack(-1)
			}, 1000)
		}
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
