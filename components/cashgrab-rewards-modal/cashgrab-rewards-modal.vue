<template>
    <view class="rewards_popup_container">
        <uni-popup ref='popup' type="center" @change="popupChange">
            <view class="rewards_popup_content">
                <view class="close_img" @tap="close">
                    <image
                        class="img"
                        src="@/static/images/checkout_icon/close@2x.png"
                        mode="scaleToFill"
                    />
                </view>
                <view class="top_box font-family-KronaOne">
                    <view class="order_now_and">{{toastData.order_now_and}}</view>
                    <view class="get_cash_count">{{toastData.get}}<text class="text">{{toastData.rewards}}</text></view>
                    <view class="instantly">{{toastData.instantly}}</view>
                    <view class="bg_box">
                        <view class="bg_img">
                            <image
                                class="img"
                                src="@/static/images/new-cashgrab-rewards/reward_cash_popup_top@2x.png"
                                mode="scaleToFill"
                            />
                        </view>
                    </view>
                </view>
                <view class="bottom_box">
                    <view class="register_now font-bold flex align-items-center justify-content-center" @tap="handleToRegister">{{toastData.register_now}}</view>
                    <view class="flex align-items-center justify-content-center flex-column">
                        <view class="coin_img">
                            <image
                                class="img"
                                src="@/static/images/new-cashgrab-rewards/reward_cash_coins@2x.png"
                                mode="scaleToFill"
                            />
                        </view>
                        <view class="register_to_get">{{toastData.register_to_get}}</view>
                    </view>
                    <view class="register_lists">
                        <view class="list_item flex" v-for="(item,ind) in toastData.tips" :key="ind">
                            <view class="item">
								<text :class="it['is-Bold'] == true ? 'font-bold' : ''" v-for="(it,index) in item">
									{{it.text}}
									<text class="text-margin"></text>
								</text>
							</view>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>
<script>

export default {
    data(){
        return {
			toastData: {}
        }
    },
    methods: {
        open() {
			this.$apis.getFissionToastData().then((res) => {
				if(res.code == '200'){
					this.toastData = res.data;
					if(res.data.flag && !this.$store.getters.hasLogin) {
						this.$refs['popup'].open();
						const obj = {
							type1: {
								text: res.data.check_tips_bottom,
								showClose: 1
							},
							type2: {
								text: res.data.register_tips_bottom,
								showGo: 1,
								rightText: res.data.go_tips_bottom
							}
						}
						uni.setStorageSync('footer_tip_data', JSON.stringify(obj));
						// 曝光
						const utmParams = uni.getStorageSync("utmParams") || {};
						this.$maEvent.impression_event({
							event_category: 'cashgrab_register_window',
							event_action: 'cashgrab_register_window_page',
							event_name: 'cashgrab_register_window_page',
							event_data: {
								utm_channel_source: utmParams
							},
							module: 'cashgrab_register_window'
						});
					}
				}
			});
        },
        close() {
			this.closeCustomEvent('close');
            this.$refs['popup'].close()
			this.$emit('showFooterTips', 2);
        },
		popupChange(e) {
			if(e && !e.show) {
				this.$emit('showFooterTips', 2);
			}
		},
        handleToRegister() {
			this.closeCustomEvent('register now');
			if(!this.$store.getters.hasLogin) {
				uni.navigateTo({
					 url: '/pages/login/index?page=register&in_site_source=cashgrab_register_window&is_special=2'
				});				
			}
            this.$refs['popup'].close();
        },
		closeCustomEvent(value) {
			const utmParams = uni.getStorageSync("utmParams") || {};
			this.$maEvent.custom_event({
				event_category: 'cashgrab_register_window',
				event_action: 'cashgrab_register_window_button',
				event_name: 'cashgrab_register_window_button',
				event_data: {
					event_value: value,
					utm_channel_source: utmParams
				},
				module: 'cashgrab_register_window'
			});
		}
    }
}
</script>
<style lang="scss" scoped>
.rewards_popup_content{
    text-align: center;
    width: 658rpx;
    background: #fff;
    border-radius: 31rpx 31rpx 31rpx 31rpx;
    overflow: hidden;
    position: relative;
    padding-bottom: 59.62rpx;
    .close_img{
        z-index: 1;
        position: absolute;
        right: 30.77rpx;
        top: 30.77rpx;
        width: 34.62rpx;
        height: 34.62rpx;
        .img{
            width: 100%;
            height: 100%;
        }
    }
    .top_box{
        padding-top: 84.62rpx;
        height: 382.69rpx;
        width: 100%;
        background-color: #FF8B4A;
        position: relative;
        font-size: 38rpx;
        font-weight: 400;
        .order_now_and{
            color: #000000;
            line-height: 45rpx;
        }
        .get_cash_count{
            font-size: 81rpx;
            color: #000000;
            line-height: 95rpx;
            margin: 15.38rpx 0;
            .text{
                color: #fff;
                -webkit-text-stroke: 3px #000000;
                margin-left: 30.77rpx;
            }
        }
        .bg_box{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 140.38rpx;
            background-position: 100% 100%;
            .bg_img{
                width: 100%;
                height: 100%;
                .img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .bottom_box{
        width: 100%;
        padding: 61.54rpx 67.31rpx 0;
        .register_now{
            width: 100%;
            height: 92.31rpx;
            background: #000000;
            font-size: 31rpx;
            color: #FFFFFF;
            line-height: 36rpx;
            text-align: center;
            margin-bottom: 50rpx;
        }
        .coin_img{
            width: 63.46rpx;
            height: 50rpx;
            .img{
                width: 100%;
                height: 100%;
            }
        }
        .register_to_get{
            font-weight: 400;
            font-size: 27rpx;
            color: #333333;
            line-height: 69rpx;
            height: 69rpx;
            margin-bottom: 15.38rpx;
            position: relative;
            &:before{
                content: '';
                position: absolute;
                width: 123rpx;
                height: 1rpx;
                background: #999999;
                left: -50rpx;
                top: 50%;
                transform: translate(-100%,-50%);
            }
            &:after{
                content: '';
                position: absolute;
                width: 123rpx;
                height: 1rpx;
                background: #999999;
                right: -50rpx;
                top: 50%;
                transform: translate(100%,-50%);
            }
        }
        .register_lists{
            .list_item{
                font-size: 27rpx;
                color: #333333;
                line-height: 32rpx;  
                margin-bottom: 7.69rpx; 
                .item{
                    text-align: left;
                    position: relative;
                    line-height: 32rpx; 
                    &::before{
                        content: '';
                        position: absolute;
                        left: -20rpx;
                        width: 8rpx;
                        height: 8rpx;
                        background: #000000;
                        border-radius: 50%;
                        line-height: 1;
                        transform: translate(0, 14rpx);
                    }
					.text-margin {
						display: inline-block;
						width: 6rpx;
					}
                }
            }
        }
    }
}
</style>
