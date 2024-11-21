<template>
  <view class="container">
      <web-view v-if="isShowWebview" :src="serviceWebviewSrc"  :update-title="false"></web-view>
  </view>
</template>

<script>
 import { mapState } from 'vuex'
export default {
  data() {
      return {
        isShowWebview: false,
      }
  },
  computed: {
        ...mapState({
              serviceWebviewSrc: state => state?.appConfig?.webviewSrc
          }),
    },
    mounted() {
        this.isShowWebview = true
	},
	onShow() {
		this.$maEvent.visit_event({
			event_category: 'contact',
			event_action: 'contact_visit',
			event_name: 'contact_visit'
		})
	}
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}
web-view {
  width: 100%;
  height: 100%;
}
</style>
