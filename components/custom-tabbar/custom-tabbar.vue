<template>
    <view class="custom_tabbar_container page-max-width flex">
        <view :class="'tabbar_item flex ' + (item.type =='Cart' ? 'add_to_cart_animation_icon' : '')" v-for="(item, index) in initData" :key="index" @tap="handleSwitch(item)">
            <view class="img_box flex justify-content-center">
                <uni-badge absolute="rightTop" type="error" size="small" :max-num=999 :text="item.type =='Cart' ? cartCount : ''">
                    
                        <image
                            :src="currentTab == item.type ? item.pathActive : item.path"
                            mode="scaleToFill"
                            class="img"
                        />
                    
                </uni-badge>
            </view>
            
            <view :class="'text ' + (currentTab == item.type ? 'active' : '')">{{ item.text }}</view>
        </view>        
    </view>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        data(){
            return {
                initData: [
                    {
                        path: "/static/images/tabbar/home_icon@2x.png",
                        pathActive: "/static/images/tabbar/home_icon_active@2x.png",
                        type: "Home",
                        text: this.$t('custom_tabbar.home'),
                        url: "/pages/index/index",

                    },
                    {
                        path: "/static/images/tabbar/category_icon@2x.png",
                        pathActive: "/static/images/tabbar/category_icon_active@2x.png",
                        type: "Category",
                        text: this.$t('custom_tabbar.category'),
                        url: "/pages/cate/index",

                    },
                    {
                        path: "/static/images/tabbar/wishlist_icon@2x.png",
                        pathActive: "/static/images/tabbar/wishlist_icon_active@2x.png",
                        type: "Wishlist",
                        text: this.$t('custom_tabbar.wishlist'),
                        url: "/pages/fav-list/fav-list",
                    },
                    {
                        path: "/static/images/tabbar/cart_icon@2x.png",
                        pathActive: "/static/images/tabbar/cart_icon_active@2x.png",
                        type: "Cart",
                        text: this.$t('custom_tabbar.cart'),
                        url: "/pages/cart/cart",

                    },
                    {
                        path: "/static/images/tabbar/account_icon@2x.png",
                        pathActive: "/static/images/tabbar/account_icon_active@2x.png",
                        type: "Account",
                        text: this.$t('custom_tabbar.account'),
                        url: "/pages/my/my",
                    },
                ]
            }
        },
        props: {
            currentTab: {
                default: 'Category',
                type: String
            },
			realPageName: {
				default:'',
				type: String
			}
        },
        computed: {
            ...mapState(['cartCount'])
        },
        methods: {
            handleSwitch(item){
				this.$maEvent.custom_event({
					event_category: 'tabBar',
					event_action: 'tabBar_button',
					event_name: 'tabBar_button',
					module: 'tabBar',
					event_data: {
						event_value: item.type.toLowerCase()
					},
				});
				if((this.realPageName &&this.realPageName != item.type) || this.currentTab != item.type) {
					if(item.type == 'Cart'){
						uni.navigateTo({ url: '/pages/cart/cartPage' })
					}else{
						uni.switchTab({ url: item.url })
					}   
				}
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "@/common/mixins.scss";
    .custom_tabbar_container{
        // @include onepxBorder(#000000);
        position: fixed;
        bottom: 0;
        left: 0;
		right: 0;
        width: 100%;
        height: 115.38rpx;
        background: #fff;        
        z-index: 98;
		flex-wrap: nowrap;
        .tabbar_item{
            width: 150rpx;
            height: 115.38rpx;
            padding-top: 21.15rpx;
            .img_box{
                width: 100%;
                height: 42.31rpx;
                .img{
                    width: 42.31rpx;
                    height: 42.31rpx;
                }                
            }
            .text{
                    font-size: 23rpx;
                    line-height: 27rpx;
                    color: #999999;
                    width: 100%;
                    text-align: center;
                    &.active{
                        color: #000000;
                    }
                }
        }
    }
</style>