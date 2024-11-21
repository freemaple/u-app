<template>
	<view class="container position-relative">
		<nav-back :title="$t('choose_rewards.choose_rewards')"></nav-back>
		<view class="wrapper">
			<view class="list_header flex align-items-center justify-content-between">
                <view class="email">Email</view>
                <view class="status flex align-items-center justify-content-center" @tap="handleOpenStatus">
                    <view>Status</view>
                    <view class="img_box">
                        <image
                            class="img"
                            src="@/static/images/fission_sharing/prompt.png"
                            mode="scaleToFill"
                        />
                    </view>
                </view>
            </view>
            <view class="rewards_cards_box" v-if="cards.length">
                <view class="cards">
                    <view class="card" v-for="(card, index) in cards" :key="index">
                        <view class="card_top flex align-items-center justify-content-between">
                            <view>{{ card.email }}</view>
                            <view>{{ card.order_status }}</view>
                        </view>
                        <view class="card_bottom flex align-items-center justify-content-between">
                            <view :class="'option position-relative flex align-items-center justify-content-center ' + (card.type_list&&card.type_list[0]&&card.type_list[0].checked ? 'checked' : '')" @tap="checkOption(card,0,1)">
                                <view>{{card.type_list&&card.type_list[0]&&card.type_list[0].text}}</view>
                                <view class="img_box checked_img" v-show="card.type_list&&card.type_list[0]&&card.type_list[0].checked">
                                    <image
                                        class="img"
                                        src="@/static/images/new-cashgrab-rewards/rewards_checked@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                                <view class="img_box unchecked_img" v-show="card.type_list&&card.type_list[1]&&card.type_list[1].checked">
                                    <image
                                        class="img"
                                        src="@/static/images/new-cashgrab-rewards/rewards_unchecked@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                            </view>
                            <view :class="'option position-relative flex align-items-center justify-content-center ' + (card.type_list&&card.type_list[1]&&card.type_list[1].checked ? 'checked' : '')" @tap="checkOption(card,1,0)">
                                <view v-html="card.type_list&&card.type_list[1]&&card.type_list[1].text"></view>
                                <view class="img_box checked_img" v-show="card.type_list&&card.type_list[1]&&card.type_list[1].checked">
                                    <image
                                        class="img"
                                        src="@/static/images/new-cashgrab-rewards/rewards_checked@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                                <view class="img_box unchecked_img" v-show="card.type_list&&card.type_list[0]&&card.type_list[0].checked">
                                    <image
                                        class="img"
                                        src="@/static/images/new-cashgrab-rewards/rewards_unchecked@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="claim_box">
                    <view class="rewards_content flex align-items-center justify-content-end">
                        <view>
                            <text class="total">{{ $t('choose_rewards.total_rewards') }}</text>
                            <text class="pink">{{ total_value }}</text>
                        </view>
                    </view>
                    <view class="claim_btn flex align-items-center justify-content-center" @tap="handleClaim">{{ $t('choose_rewards.claim_to_wallet') }}</view>
                </view>
            </view>
            <view class="no_data_box" v-else>
                <view class="flex justify-content-center align-items-center wrapper">
                    <view class="img_box">
                        <image class="img" mode="widthFix" src="@/static/images/empty.png" />    
                    </view>
                    <view class="text">{{ $t('distribute_history.empty') }}</view> 
                    <view class="to_shopping_btn" @tap="handleToHome">{{ $t('distribute_history.go_sharing') }}</view>   
                </view>    
            </view>
		</view>
        <message-tip ref='messageTipRef' />

        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='popup_status' type="center" @change="(e)=>{pageMetaShow = e.show;}">
                <view class="pop-wrapper" >
                    <view class="title font-bold flex justify-content-center">{{ $t('choose_rewards.unicoeye_tips',{site_name: $store.state.site_name}) }}</view>
                    <view class="img_box" @tap="handleClosePop">
                        <image
                            src="/static/images/distribute/close.png"
                            class="img"
                        />
                    </view>
                    <scroll-view scroll-y="true" id="pop_status" class="pop-status flex flex-column justify-content-between"
                        >
                        <view class="content" v-html="statusTxt"></view>
                    </scroll-view>
                    <view class="btn_box ">
                        <view @tap="handleClosePop" class="btn flex align-items-center justify-content-center">{{ $t('distribute_history.ok') }}</view>
                    </view>
                </view>
            </uni-popup>
        </view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			cards: [],
            statusTxt: '',
            pageNum: 0,
            total_value: ''
		};
	},
	onLoad(option) {
		const that = this	
        that.getRewardsLists()
	},
    // 滚动到底部
    onReachBottom(){
        this.getRewardsLists();
    },
	methods: {	
        checkOption(card,type0,type1) {
            card.type_list[type0].checked = true;
            card.type_list[type1].checked = false
            this.calcTotal()
        },
        calcTotal() {
            const that = this            
            let money = 0
            let coupon = 0
            that.cards.forEach(history => {
                const amount = history.amount
                const checkedItem = history.type_list.filter(item=>{
                    return item.checked
                })                
                if(checkedItem[0].type == '1') {
                    money+=Number(amount)
                }else{
                    coupon+=1
                }                
            });
            money = money.toFixed(2)
            const coupon_s = coupon > 1 ? that.$t('distribute_history.coupons') : that.$t('distribute_history.coupon')
            const couponText = coupon ? (coupon + coupon_s) : ''
            const currencyText = money > 0 ? ("$"+ money) : ''
            const plus = coupon&&money>0 ? '+' : ''
            that.total_value = currencyText + plus + couponText
        },
        getRewardsLists() {
            const that = this
            that.$apis.getRewardsLists({
                p: that.pageNum,
            }).then((res)=> {
                const {data,code,pageNum} = res
                uni.hideLoading()
                if(code == '200') {
                    that.statusTxt = data.status_tips
                    that.cards = data.historys
                    that.pageNum = pageNum
                    that.calcTotal()                    
                }
                
            })
        },
        handleClaim() {
            const that = this
            const claimArr = that.cards.map(item => {
                const checkedType = item.type_list.filter(type =>{
                    return type.checked
                })
                return {id:item.id,type:checkedType[0].type}
            })
            if(!claimArr.length)return            
            this.$apis.claimRewards({
                data: JSON.stringify(claimArr)
            }).then((res)=>{
                if(res.code == '200') {                    
                    uni.hideLoading()
                    this.$refs.messageTipRef.showMessage(this.$t('distribute.cash.withdraw_success'), 1);

                    setTimeout(()=>{
                        uni.navigateTo({
                            url: '/pages/distribute/generateurl'
                        })
                    }, 3000)
                    
                }
            })
        },
		handleCheck(card, type) {
            card.checked_type = type
        },
        handleOpenStatus(){
            this.$refs['popup_status'].open()
        },
        handleClosePop(){
            this.$refs['popup_status'].close()
        },
        handleToHome(){
            let pages = getCurrentPages();//当前页
            let beforePage = pages.length>=2 && pages[pages.length - 2];//上个页面
            let beforeRoute = '';
            if(beforePage && beforePage.route){
                beforeRoute = beforePage.route;
            }
            if(beforeRoute.indexOf('pages/distribute/generateurl') != -1){
                uni.navigateBack();
            } else {
                uni.redirectTo({
                    url: '/pages/distribute/generateurl'
                })
            }
            this.$maEvent.custom_event({
                event_category: 'share_history',
                event_action: 'sharing_button',
                event_name: 'go sharing',
                module: 'share_history_sharing',
            });
        },
	}
}
</script>

<style scoped lang="scss" >
@import "@/common/mixins.scss";
.container{
    min-height: 100vh;
    /deep/.box{
        &::after{
            background-color: #fff;
        }
        
    }
}
.container>.wrapper{
    background-color: #F5F5F5;
    height: calc(100vh - 96rpx);
    .list_header{
        width: 100%;
        height: 84.62rpx;
        position: sticky;
        top: 96rpx;
        left: 0;
        background-color: #fff;
        padding-left: 63.46rpx;
        padding-right: 57.69rpx;
        z-index: 2;
        .img_box{
            width: 46.15rpx;
            height: 46.15rpx;
            .img{
                width: 46.15rpx;
                height: 46.15rpx;
            }
        }
    }
    .rewards_cards_box{
        background-color: #F5F5F5;
        // height: 100%;
        padding: 26.92rpx 28.85rpx 221rpx 32.69rpx;
        .cards{
			height: calc(100vh - 84.62rpx - 96rpx - 221rpx - 50rpx);
			overflow-y: auto;
            .card{
                height: 235rpx;
                background: #FFFFFF;
                border-radius: 31rpx 31rpx 31rpx 31rpx;
                margin-bottom: 15.38rpx;
                &:last-child{
                    margin-bottom: 0;
                }
                .card_top{
                    width: 100%;
                    height: 76.92rpx;
                    position:relative;
                    @include onepxBorder(#e0e0e0);
                    padding-left: 30.77rpx;
                    padding-right: 28.85rpx;
                }
                .card_bottom{
                    padding-top: 23.08rpx;
                    padding-left: 38.46rpx;
                    padding-right: 38.46rpx;
                    .option{
                        width: 290rpx;
                        height: 108rpx;
                        border-radius: 15rpx 15rpx 15rpx 15rpx;
                        border: 2rpx solid #EEEEEE;
                        font-weight: 400;
                        font-size: 23rpx;
                        padding: 19.23rpx 21.15rpx 19.23rpx 23.08rpx;
                        .img_box{
                            width: 46.15rpx;
                            height: 46.15rpx;
                            position: absolute;
                            right: -11.54rpx;
                            top: -11.54rpx;
                            .img{
                                width: 46.15rpx;
                                height: 46.15rpx;
                            }                            
                        }
                        .img_checked{
                            display: none;
                        }
                        .img_unchecked{
                            display: block;
                        }
                        &.checked{
                            border: 2rpx solid #FF6ED3;
                            font-weight: 500;
                            background: rgba(255,110,211,0.1);
                            .img_checked{
                                display: block;
                            }
                            .img_unchecked{
                                display: none;
                            }
                        }
                    }
                }
            }
        }
        .claim_box{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 221rpx;
            background: #FFFFFF;
            box-shadow: 0rpx -4rpx 31rpx 0rpx rgba(0,0,0,0.05);
            padding: 40.38rpx 30.77rpx 30.77rpx;
            .claim_btn{
                width: 100%;
                height: 81rpx;
                background: #000000;
                border-radius: 40rpx 40rpx 40rpx 40rpx;
                font-weight: 500;
                font-size: 31rpx;
                color: #FFFFFF;
                line-height: 36rpx;
            }
            .rewards_content{
                font-weight: 400;
                font-size: 31rpx;
                color: #000000;
                line-height: 42rpx;
                text-align: right;
                margin-bottom: 26.92rpx;
                .total{

                }
                .pink{
                    margin-left: 15.38rpx;
                    font-weight: 600;
                    color: #FF6ED3;
                    line-height: 42rpx;
                }
            }
        }
    }
}
.pop-wrapper{
    background: #fff;
    width: calc(100vw - 135rpx);
    border-radius: 15.38rpx;
    color: #000;
    position: relative;
    padding: 40rpx;
    .pop-status {
        max-height: 544rpx;
    }
    .content {
        ::v-deep .single_status {
            font-size: 24rpx;
            line-height: 42.31rpx;
        &.mb16 {
            margin-bottom: 16rpx;
        }
            .name{
        
            }
        }
    }
    .title{
        margin-bottom: 30.77rpx;
        font-weight: 600;
        font-size: 31rpx;
        color: #222222;
    }
    .img_box{
        position: absolute;
        right: 23rpx;
        top: 23rpx;
        width: 34.62rpx;
        height: 34.62rpx;
        .img{
            width: 34.62rpx;
            height: 34.62rpx;
        }
    }
    .btn_box{
        width: 100%;
        height: 80.77rpx;
        margin-top: 44rpx;
        .btn{
            width: 100%;
            color: #fff;
            height: 80.77rpx;
            background: #222222;
            border-radius: 40rpx 40rpx 40rpx 40rpx;
            font-size: 27rpx;
        }
    }
}
.no_data_box{
    width: 100%;
    .wrapper{
        flex-direction: column;
        padding: 30rpx 20rpx 20rpx;
    }
    .img_box {
        width: 100%;
        .img{
            width: 100%;
        }
    }
    .text{
        color: #666;
        font-size: 27rpx;
    }
    .to_shopping_btn{
        background: #000;
        color: #ffffff;
        font-size: 27rpx;
        padding: 20rpx 40rpx;
        margin-top: 30rpx;
    }
}
</style>
