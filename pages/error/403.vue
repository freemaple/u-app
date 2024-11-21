<template>
  <view class="container">
    <view class="header-title">Welcome</view>
    <view class="img-icon">
      <image src="@/static/images/403-2.png" mode="widthFix" />
    </view>
    <view class="text-content">Website Under Construction... </view>
  </view>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  .header-title {
    width: 100%;
    height: 92rpx;
    font-family: Jost, Jost;
    font-weight: 550;
    font-size: 35rpx;
    color: #000000;
    text-transform: uppercase;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.05);
  }
  .img-icon {
    margin-top: 134rpx;
    display: flex;
    justify-content: center;
    image {
      width: 358rpx;
      height: 295rpx;
    }
  }
  .text-content {
    margin-top: 46rpx;
    font-family: Jost, Jost;
    font-weight: 500;
    font-size: 31rpx;
    color: #000000;
    line-height: 36rpx;
    text-align: center;
    font-weight: bold;
  }
}
</style>
