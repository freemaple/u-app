<template>
	<web-view :src="payUrl"></web-view>
</template>

<script>
	export default{
		data(){
			return {
				payUrl: '',
				order_id: ''
			}
		},
		onShow: function() {
			
		},
		onLoad: function(query) {
			this.order_id = query.order_id;
			this.payUrl = query.payUrl;
		},
		methods: {
			
		}
	}
</script>

<style>
</style>