<template>
    <view class="custom_tabbar_container page-max-width flex"
		:style="{'box-shadow': currentTab == 'Cart' && cartCount > 0 ? 'none' : '0px -2px 16px 0px rgba(0,0,0,0.1)'}">
        <view :class="'tabbar_item flex ' + (item.type =='Cart' ? 'add_to_cart_animation_icon' : '')" v-for="(item, index) in initData" :key="index" @tap="handleSwitch(item)">
            <view class="img_box flex justify-content-center">
                <uni-badge absolute="rightTop" :offset="[2,2]" type="error" size="small" :max-num=999 :text="item.type =='Cart' ? cartCount : ''">
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
                        path: "/static/images/nav/home-off.png",
                        pathActive: "/static/images/nav/home-on.png",
                        type: "Home",
                        text: this.$t('custom_tabbar.home'),
                        url: "/pages/index/index",

                    },
                    {
                        path: "/static/images/nav/menu-off.png",
                        pathActive: "/static/images/nav/menu-on.png ",
                        type: "Category",
                        text: this.$t('custom_tabbar.category'),
                        url: "/pages/cate/index",

                    },
                    {
                        path: "/static/images/nav/wishlist-off.png",
                        pathActive: "/static/images/nav/wishlist-on.png",
                        type: "Wishlist",
                        text: this.$t('custom_tabbar.wishlist'),
                        url: "/pages/fav-list/fav-list",
                    },
                    {
                        path: "/static/images/nav/cart-off.png",
                        pathActive: "/static/images/nav/cart-on.png",
                        type: "Cart",
                        text: this.$t('custom_tabbar.cart'),
                        url: "/pages/cart/cart",

                    },
                    {
                        path: "/static/images/nav/my-off.png",
                        pathActive: "/static/images/nav/my-on.png",
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
        height: 50px;
        background: #fff;        
        z-index: 7;
		flex-wrap: nowrap;
		box-shadow: 0px -2px 16px 0px rgba(0,0,0,0.1);
        .tabbar_item{
            flex: 1;
            height: 50px;
            padding-top: 8px;
            .img_box{
                width: 100%;
                height: 24px;
                .img{
                    width: 24px;
                    height: 24px;
                }   
				.uni-badge--x{
					font-size: 14px;
				}
            }
            .text{
                    font-size: 10px;
                    line-height: 14px;
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