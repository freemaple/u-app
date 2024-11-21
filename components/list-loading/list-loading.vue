<template>
  <view class="gif_wrapper flex justify-content-center align-items-center" :class="fixedCenter && 'fixed-center'">
    <image
        src="@/static/images/loading.gif"
        mode="scaleToFill"
        class="loading_gif"
    />
  </view>
</template>

<script>
export default {
	props:{
		fixedCenter: false
	}
}
</script>

<style>
.gif_wrapper.fixed-center{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
.loading_gif{
    width: 80rpx;
    height: 80rpx;
}
</style>