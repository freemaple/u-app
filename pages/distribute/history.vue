<template>
    <view class="distribute_history_container">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
        <pageHeader :title="pageType ? $t('distribute_history.choose_your_rewards') : $t('distribute_history.title')" :isTitleUppercase="true" :styleType="2"></pageHeader>
        <view class="history_content">
            <view class="history_bars_container flex">
                <view class="bars flex justify-content-between align-items-center">
                    <view @tap="handleClickBar(item)" :class="'bar font-bold ' + (item.key == activeBar ? 'active' : '')" v-for="item in bars" :key="item.key">{{ item.name }}</view>
                </view>
            </view>
            <view class="list_header flex justify-content-between align-items-center">
                <view v-for="item in listHeaders" :key="item.key" class="header_title flex font-bold align-items-center">
                    <text>{{ item.name }} </text>
                    <view class="img_box" v-show="item.key=='status'" @tap="handleOpenStatus">
                        <image
                            src="/static/images/distribute/history/show_details@2x.png"
                            class="img"
                        />
                    </view>
                </view>
            </view>
            <view class="card_list" v-show="history_lists.length">
                <view v-for="item in history_lists" :key="item.id" :class="'single_card ' + (item.amount2 ? 'unselected' : '') ">
                    <view class="top_box flex justify-content-between align-items-center">
                        <view class="email ">{{ item.email }}</view>
                        <view>{{ item.withdraw_type==1? ($t('distribute_history.reward')+  ' '+item.amount_text):(item.amount_text) }}</view>
                        <view class="status flex justify-content-end align-items-center">{{ item.status_text }}</view>
                    </view>
                    <view class="bottom_box flex justify-content-center align-items-center">
                        <view class="view_details flex justify-content-center align-items-center" v-show="!item.expand" @tap="()=>{item.expand=true}">
                            <view class="text">{{ $t('distribute_history.view_details') }}</view>
                            <view class="img_box">
                                <image
                                    src="/static/images/distribute/history/expand@2x.png"
                                    class="img"
                                />
                            </view>
                        </view>
                    </view>

                    <transition name="dropdown">
                        <view class="history_details" v-show="item.expand">
                            <view class="date flex justify-content-between align-items-center">
                                <view class="title">{{ $t('distribute_history.date') }}</view>
                                <view class="content">{{ item.created_at_text }}</view>
                            </view>
                            <view class="date flex justify-content-between align-items-center" v-if="item.show_status_reward">
                                <view class="title">{{ $t('distribute_history.channel') }}</view>
                                <view class="content">{{ item.platform }}</view>
                            </view>
                            <view class="date flex justify-content-between align-items-center" v-if="item.show_status_reward">
                                <view class="title">{{ $t('distribute_history.reward') }}</view>
                                <view class="content" v-if="item.amount">{{ item.amount_text }}</view>
                            </view>
                            <view class="date flex justify-content-between align-items-center">
                                <view class="title">{{ $t('distribute_history.status') }}</view>
                                <view class="content">{{ item.status_text }}</view>
                            </view>
                            <view class="close_expand view_details flex justify-content-center align-items-center" @tap="()=>{item.expand = false}">
                                <view class="text">{{ $t('distribute_history.view_details') }}</view>
                                <view class="img_box">
                                    <image
                                        src="/static/images/distribute/history/expand@2x.png"
                                        class="img"
                                    />
                                </view>
                            </view>
                        </view>
                    </transition>
                    
                </view>
            </view>
            <view class="no_data_box" v-show="!history_lists.length">
                <view class="flex justify-content-center align-items-center wrapper">
                    <view class="img_box">
                        <image class="img" mode="widthFix" src="@/static/images/empty.png" />    
                    </view>
                    <view class="text">{{ $t('distribute_history.empty') }}</view> 
                    <view class="to_shopping_btn" @tap="handleToHome">{{ $t('distribute_history.go_sharing') }}</view>   
                </view>    
            </view>
        </view>
        <view v-if="pageType=='1'" class="save_container">
            <view class="rewards flex justify-content-end align-items-center">
                <view class="label">{{ $t('distribute_history.total_rewards') }}</view>
                <view class="count font-bold">{{base_symbol}}{{ totalAmount }}</view>    
            </view>    
            <view @tap="handleSubmit" :class="'btn save_btn font-bold flex justify-content-center align-items-center ' +(totalAmount&&isRequested ? '' : 'disabled')">{{ $t('distribute_history.save_to_my_wallet') }}</view>
        </view>
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

		<!-- 提示弹窗 -->
		<uni-popup ref="popupTip" background-color="#fff" @change="(e)=>{pageMetaShow = e.show;}">
			<view class="popup-content" style="width:calc(100vw - 60px)">
				<view class="tip-box">
					<view class="close">
						<image @click="$refs.popupTip.close()" class="close-btn" src="@/static/images/distribute/close.png" mode=""></image>
					</view>
					<view class="tip-title">
						{{toastData.title}}
					</view>
					<view class="tip-content" v-html="toastData.content"></view>
					<view class="btn-ok" @click="$refs.popupTip.close()">{{$t('distribute_history.ok')}}</view>
				</view>
			</view>
		</uni-popup>
    </view>
</template>
<script>
    let oriTotal = 0.00
    export default {
        data(){
            return {
				pageMetaShow:false,
				isRequested:true,
                canSubmit: false,
                activeBar: '6',
                base_symbol: '$',
                pageNum: 0,
                totalPage: '1',
                totalAmount: 0.00,
                pageType: '',
                bars: [
                    {
                        name: this.$t('distribute_history.half_year'),
                        key: "6"
                    },
                    {
                        name: this.$t('distribute_history.one_year'),
                        key: "12"
                    },
                    {
                        name: this.$t('distribute_history.all'),
                        key: "all"
                    },
                ],
                listHeaders: [
                    {
                        name: this.$t('distribute_history.email'),
                        key: 'email',
                    },
                    {
                        name: this.$t('distribute_history.my_reward'),
                        key: 'reward',
                    },
                    {
                        name: this.$t('distribute_history.status'),
                        key: 'status',
                    },
                ],
                history_lists: [],
				toastData: {
					title: '',
					content: ''
				}, // 当前展示的那一个弹窗数据
				toastDataCopy: {}, // 弹窗数据
                currentType: '2',
				member_discount: '', // 折扣率
				statusTxt: '', // 提示信息内容
            }
        },
        onLoad(e){
            if(e.type){
                this.pageType = e.type
            }
            this.initDistributeHistory(true);
        },
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'share_history',
				event_action: 'share_history_visit',
				event_name: 'share_history_visit'
			})
		},
		// 滚动到底部
		onReachBottom(){
			this.initDistributeHistory();
		},
        methods: {
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
            initDistributeHistory(isFirst=false){
                const that = this;
				if(this.totalPage == this.pageNum) {
					return
				}
				that.pageNum += 1;
                that.$apis.initDistributeHistory({
                    month: that.activeBar,
					p: that.pageNum,
                    type: that.pageType ? '1' : ''
                }).then(res => {
                    uni.hideLoading()
                    if(res.code == '200'){
                        const data = res.data
                        const {historys, base_symbol, countTotal, totalPage, pageNum, totalAmount, member_discount} = data
                        oriTotal = Number(totalAmount).toFixed(2)
                        historys.map(e => {
							e.expand = false;
                            e.selected = false
                            e.bottom_amount = that.pageType&&e.amount2 ? e.amount2 :e.amount
                            if(e.amount2){
                               e.checkedType = '2' 
                            }else{
                                e.checkedType = '1'
                            }
						})
						that.history_lists = that.history_lists.concat(historys);
                        if(that.history_lists[0] && !that.history_lists[0].amount2){
                            that.canSubmit = true
                        }
                        that.base_symbol = base_symbol
                        that.countTotal = countTotal
                        that.totalPage = totalPage
                        that.pageNum = pageNum
                        that.totalAmount = Number(totalAmount).toFixed(2);
						that.member_discount = member_discount;
						if(isFirst) {
							that.getStaticblock();
						}
                    }
                }).catch(err=>{
                    uni.hideLoading()
                    uni.showToast({
                        title: 'err',
                        icon: 'none'
                    })
                })
            },
            handleSubmit(){
				if(this.isRequested) {
					const that = this
					if(!that.canSubmit){
						uni.showToast({
							title: this.$t('distribute_history.can_submit_tip'),
							icon: 'none'
						})
						return
					}
					const params = {
						withdraw_type: that.currentType
					}
					that.isRequested = false;
					that.$apis.withdrawToWallet(params).then(res=>{
						that.isRequested = true;
						uni.hideLoading()
						if(res.code == '200'){
							uni.showToast({
								icon: 'none',
								title: res.message
							})
							setTimeout(()=>{
								uni.navigateTo({
									url: '/pages/distribute/generateurl'
								})
							}, 3000)
							this.$maEvent.custom_event({
								event_category: 'my_rewards',
								event_action: 'claim_method_button',
								event_name: 'save to my wallet',
								module: 'rewards_claim',
							});
						}
					}).catch(err=>{
						that.isRequested = true;
						uni.hideLoading()
						uni.showToast({
							title: 'error',
							icon: 'none'
						})
					})
				}
            },
            handleClickBar(item){
                this.activeBar = item.key;
				this.pageNum = 0;
                this.totalPage = '1';
                this.totalAmount = 0.00;
				this.history_lists = [];
				this.initDistributeHistory();
				this.$maEvent.custom_event({
					event_category: 'share_history',
					event_action: 'share_history_time_button',
					event_name: item.name,
					event_data: {
						event_value: item.name && item.name.toLowerCase()
					},
					module: 'share_history_time'
				});
            },
            handleOpenStatus(){
                this.$refs['popup_status'].open()
            },
            handleClosePop(){
                this.$refs['popup_status'].close()
            },
			// 获取静态块
			getStaticblock() {
				this.$apis.getStaticblock({identify:'app-distribute-history-toast,distribute-history-status'}).then(res=>{
					const data = res.data['app-distribute-history-toast'];
					for(let key in data) {
						for(let k in data[key]) {
							data[key][k] = data[key][k].replace(/\{member_discount\}/g, this.member_discount)
						}
					}
					this.toastDataCopy = data;
				})
				this.$apis.getDistributeHistoryBlock().then( ({data: { status_tips } }) => {
					this.statusTxt = status_tips
				})
			},

            showToast(show_type2) {
                let type = ''
                if(show_type2 == 'plus'){
                    type = 'dressinPlus'
                }else{
                    type = 'discount'
                }
				if(type && this.toastDataCopy[type]) {
					this.toastData = JSON.parse(JSON.stringify(this.toastDataCopy[type]));
					this.$refs.popupTip.open('center');
				}
			},
            
           
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/common/mixins.scss';

    .distribute_history_container{
        .not_show_text{
            white-space: wrap;
            color: #999;
            font-size: 12px;
        }
        width: 100%;
        padding-top: 96rpx;
        padding-bottom: 208rpx;
        color: #000;
        .history_content{
            width: 100%;
            padding: 0 28.85rpx 0 32.69rpx;
            .list_header{
                width: 100%;
                height: 90.38rpx;
                padding: 0 46.15rpx;
                font-size: 27rpx;                
                .header_title{
                    width: calc(300% / 7);
                    justify-content: center;
                    &:first-child{
                        width: calc(200% / 7);
                        justify-content: flex-start;
                    }
                    &:last-child{
                        width: calc(200% / 7);
                        justify-content: flex-end;
                    }
                    height: 100%;
                    .img_box{
                        width: 46.15rpx;
                        height: 46.15rpx;
                        .img{
                            width: 46.15rpx;
                            height: 46.15rpx;
                        }
                    }
                }
            }
            .card_list{
                .single_card{
                    &:last-child{
                        @include onepxBorder(#DDD);
                    }
                    width: 100%;
                    // height: 292rpx;
                    background: #FFFFFF;
                    @include onepxBorderTop(#DDD);
                    border-radius: 31rpx;
                    margin-bottom: 28.85rpx;
                    padding: 26.92rpx 34.62rpx 0;
                    font-size: 23rpx;
                    color: #000;
                    &.unselected{
                        box-shadow: 0rpx 8rpx 31rpx 0rpx rgba(207,167,113,0.2);
                        &:before{
                            height: 0;
                        }
                    }
                    .top_box{
                        flex-wrap: nowrap;
                        .status{
                            width: calc(200% / 7);
                        }
                        .email{
                            width: calc(200% / 7);
                            text-align: left;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            padding-right: 5rpx;
                        }
                        .select_box{
                            flex-wrap: wrap;
                            font-size: 23rpx;
                            flex: 1;
                            .single_select{
                                flex-wrap: nowrap;
                                &.checked{
                                    .img_box{
                                        display: none;
                                    }
                                    .checked_img{
                                        display: block;
                                    }
                                    
                                }
                                &.disabled{
                                    .img_box{
                                        display: none;
                                    }
                                    .disabled_img{
                                        display: block;
                                    }
                                }
                                .img_box{
                                    display: none;
                                }
                                .unchecked_img{
                                    display: block;
                                }
                                width: 100%;
                                &:nth-child(2){
                                    margin-top: 30.77rpx;
                                }
                                .text {
                                    white-space: nowrap;
                                    .underline{
                                        text-decoration: underline;
                                        text-decoration-style: dashed;
                                    }
                                }
                                .img_box{
                                    width: 34.62rpx;
                                    height: 34.62rpx;
                                    margin-right: 15.38rpx;
                                    .img{
                                        width: 34.62rpx;
                                        height: 34.62rpx;
                                    }
                                }
                            }
                        }
                        .status{
                            // white-space: nowrap;
							text-align: right
                        }
                        .email{
                            white-space: nowrap;
                        }
                    }
                    .bottom_box{
                        margin-top: 34.62rpx;
                        .confirm_btn{
                            font-size: 23rpx;
                            color: #fff;
                            width: 205.77rpx;
                            height: 57.69rpx;
                            border-radius: 30.77rpx;
                            background: #000;
                            margin-right: 38.46rpx;
                        }                        
                    }
                    .view_details{
                            height: 42rpx;
                            .text{
                                color: #0071E3;
                                margin-right: 7.69rpx;
                                line-height: 42rpx;
                            }
                            .img_box{
                                width: 34.62rpx;
                                height: 34.62rpx;
                                .img{
                                    width: 34.62rpx;
                                    height: 34.62rpx;
                                }
                            }
                        }
                    .history_details{
                        background: #F5F5F5;
                        padding: 9.62rpx 23.08rpx;
                        margin-top: 23.08rpx;
                        font-size: 23rpx;
                        color: #666;
                        .date{
                            height: 42rpx;
                            line-height: 42rpx;
                        }
                        .view_details{
                            .img_box .img{
                                transform: rotate(180deg);
                            }
                        }
                    }
                }
            }
        }
    }
    .history_bars_container{
        margin-top: 23rpx;
        width: 100%;
        height: 73rpx;
        .bars{
            height: 100%;
            font-size: 27rpx;
            color: #333;
            padding: 7.69rpx 9.62rpx;
            flex-wrap: nowrap;
            height: 73rpx;
            background: #F5F1F9;
            border-radius: 90rpx 90rpx 90rpx 90rpx;
            .bar{
                padding: 7.69rpx 15.38rpx;  
                line-height: 42rpx;   
                margin-left: 15.38rpx; 
                &:first-child{
                    margin-left: 0;
                }
                &.active{
                    border-radius: 48.08rpx;
                    background: #FF753A;
                    background:linear-gradient(-90deg,#FF753A,#FFD058);
                    color: #fff;
                    height: 58rpx;
                    background: linear-gradient( 90deg, #780EFF 0%, #DA49D6 54%, #FF6EA7 100%);
                    box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(141,68,0,0.3);
                    border-radius: 48rpx 48rpx 48rpx 48rpx;
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
    .save_container{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 208rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(0,0,0,0.15);
        padding: 40.38rpx 30.77rpx 17.31rpx;
        .rewards{
            .label{
                height: 42rpx;
                font-size: 31rpx;
                color: #000000;
                line-height: 42rpx;
            }
            .count{
                height: 42rpx;
                font-size: 46rpx;
                color: #FF005D;
                line-height: 42rpx;
                margin-left: 11.54rpx;
            }
        }
        .save_btn{
            height: 81rpx;
            background: #000000;
            font-size: 31rpx;
            color: #FFFFFF;
            line-height: 36rpx;
            margin-top: 26.92rpx;
            &.disabled{
                opacity: 0.5;
            }
        }
    }
    .dropdown-enter-active, .dropdown-leave-active {
        transition: all 0.3s;
    }

    .dropdown-enter, .dropdown-leave-to {
        opacity: 0;
        transform: translateY(-80rpx);
    }
	::v-deep .uni-popup__wrapper {
		border-radius: 16rpx;
	}
	.close-btn {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		top: 24rpx;
		right: 24rpx;
	}
	.tip-title {
		font-weight: bold;
		font-size: 32rpx;
		text-align: center;
		margin: 60rpx 46rpx 32rpx;
	}
	.tip-content {
		font-size: 28rpx;
		font-weight: 400;
		line-height: 44rpx;
		padding: 0 48rpx;
	}
	.btn-ok {
		background: #000;
		color: #fff;
		border-radius: 8rpx;
		height: 84rpx;
		line-height: 84rpx;
		margin: 88rpx 48rpx 48rpx;
		text-align: center;
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