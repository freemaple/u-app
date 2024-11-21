<template>
  <view class="box flex align-items-center"
    :style="'height:' + titleBarHeight + 'px;padding-top:' + statusBarHeight + 'px'">
    <slot name="back">
      <text class="left" @tap="navigatorBack">
        <i class="iconfont"></i>
      </text>
    </slot>
    <slot name="logo">
      <view class="title">{{ title }}</view>
    </slot>
    <slot name="home"></slot>
  </view>
</template>
<script>
const app = getApp();
export default {
  data() {
    return {};
  },
  computed: {
    statusBarHeight() {
      return app.globalData.statusBarHeight
    },
    titleBarHeight() {
      return app.globalData.titleBarHeight
    }
  },
  props: {
    title: {
      type: String,
      default: "Settings",
    },
  },
  methods:{
	  navigatorBack(){
		this.$public.handleGoBack();
	  }
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/mixins.scss";

.box {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  @include onepxBorder(#e0e0e0);
  position: sticky;
  top: 0;
  z-index: 99;

  .left {
    width: 96rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;

    i {
      font-size: 40rpx;

      &::before {
        content: "\E697";
      }
    }
  }

  .title {
    width: 574rpx;
    font-size: 36rpx;
    color: #333;
    font-weight: 700;
    box-sizing: border-box;
    padding-left: 48rpx;
  }
}
</style>