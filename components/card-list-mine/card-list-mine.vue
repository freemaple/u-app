<template>
    <view class="card-list">
		<block v-for="(item, index) in filteredCardList" :key="index">
			<view @tap="handleTo(item)" :key="item.title" v-if="item.show !=='false'"
				class="card-item">
				<block v-if="item.type">
					<i :class="'iconfont2 ' + item.type"></i>
				</block>
				<view v-else class="item_icon">
					<image :src="item.src" mode="width"></image>
				</view>
				<view class="card-content flex align-items-center justify-content-between">
					<view class="text">
						{{ item.language ? $t(item.language,{site_name: $store.state.site_name_upper}) : item.title }}
					</view>
					<!-- <i class="iconfont"></i> -->
				</view>
			</view>
		</block>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import chatPlugin from '@/utils/chatPlugin.js'
export default {
    props: {
        cardListData: {
            type: Array,
            default: []
        }
    },
    // 及时语客服功能动态显示
    computed: {
        ...mapState({
            serviceScriptUrl: state => state.appConfig.scriptUrl,
			serviceWebviewSrc: state => state.appConfig.webviewSrc
        }),
        filteredCardList() {
            if(this.serviceWebviewSrc){
                return this.cardListData;
            }else{
                return this.cardListData.filter(item => item.url !== '/pages/contact/web');
            }
        }
    },
    methods: {
        handleTo(item) {
            if (item.url) {
				if(item.wishlist){
					uni.setStorageSync('wishlist_back_url', this.$uitls.getCurrentPageLink());
				}
                //  #ifdef APP-PLUS 
                    uni.navigateTo({
                        url: item.url
                    })
               //   #endif
				// #ifdef H5
				if(this.serviceScriptUrl && item.url === '/pages/contact/web'){
					this.$maEvent.visit_event({
						event_category: 'contact',
						event_action: 'contact_visit',
						event_name: 'contact_visit'
					})
                    chatPlugin.openTidioChat(this.serviceScriptUrl);
                }else{
                    uni.navigateTo({
                        url: item.url
                    })
                }
                //  #endif 
               
            } else {
				this.$emit('emitClick',item)
			}
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";

.card-list {
    width: 100%;
    z-index: 1;
    .card-item {
        width: 100%;
        height: 107.69rpx;
		 // flex align-items-center justify-content-center
		display: flex;
		align-items: center;
		padding: 0 30.77rpx 0 61.54rpx ;
		//       >i {
		//           width: 54rpx;
		//           font-size: 46.5rpx;
		//           color: #444;
		//           height: 100%;
		//           line-height: 90rpx;
		//       }
		//       .address::before {
		//           content: "\e7e7";
		//       }
		//       .wishlist::before {
		//           content: "\e63e";
		//       }
		//       .review::before {
		//           content: "\e695";
		//       }
		//       .coupons::before {
		//           content: "\e609";
		//       }
		//       .services::before {
		//           content: "\e601";
		//       }
		// 		.vip::before {
		// 			content: "\e60a";
		// 		}
		.item_icon {
			display: flex;
			image {
				justify-content: flex-end;
				text-align: right;
				width: 42.31rpx;
				height: 42.31rpx; 
			}
		}
        .card-content {
			display: flex;
			flex: 1;
            height: 100%;
			margin-left: 30.77rpx;
            border-bottom: 2rpx solid #EEEEEE;
			font-size: 27rpx;
			color: #393939;
			
			// @include onepxBorder(#e0e0e0);
            // >i {
            //     font-size: 40rpx;
            //     &::before {
            //         color: #ccc;
            //         content: "\e609";
            //     }
            // }
        }
    }
}
</style>