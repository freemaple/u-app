<template>
    <view class="recently-box dui-padding-top-header">
		<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
        <pageHeader :title="$t('recently_viewed.recently_viewed')"></pageHeader>
		<view class="recently-viewed-content">
			<good-list module_name="recently_viewed" ref="good_list_ref_re" @popupChange="(value)=>{pageMetaShow=value}" :showLoading="!isLastPage&&products.length>0" :goods="products" :isViewedRecord="true" @toDeleteViewed="toDeleteViewed">
			</good-list>
            <block v-if="showEmpty">
                
                <view class="no_result flex align-items-center justify-content-center">
                    <view>
                        <image src="@/static/images/empty_goods.png" class="no-order-img" style="display: block; margin: 0 auto;"></image>
                        <view class="empty_text">{{$t('recently_viewed.not_viewed_any')}}</view>
                    </view>
                </view>
            </block>
            <view v-if="isLastPage" class="flex align-items-center justify-content-center">{{$t('recently_viewed.end')}}</view>
            <back-top :showBtn="showBtn"></back-top>
		</view>
    </view>
</template>
<script>
import backTop from '../../components/back-top/back-top.vue'
const app = getApp(); // 语言

export default {
  components: { backTop },
    data() {
        return {
			pageMetaShow:false,
            products: [],
            showBtn: false,
            viewed_product_id: '',
            page: 1,
            isLastPage: false,
            showEmpty: false,
            showLoading: false,
        }
    },
    onLoad() {
        this.getStorageIds();
    },
	onShow() {
		this.$maEvent.visit_event({
			event_category: 'recent_view',
			event_action: 'recent_view_visit',
			event_name: 'recent_view_visit'
		})
	},
    onReachBottom() {
		//判断是否到 最后一页了
		if (!this.isLastPage) {
            this.page += 1
			this.queryViewedList()
		}

		console.log('onReachBottom() ');
	},
    methods: {
        toDeleteViewed(product_id, index){
            const that = this
            // 弹窗确认
            uni.showModal({
                title: '',
                content: 'Are you sure you want to delete this item?',
                showCancel: true,
                success: ({ confirm, cancel }) => {
                    if(confirm) {
                        that.$apis.deleteViewed({
                            product_id
                        }).then(res=> {
                            if(res.code == '200') {
                                const products = that.products
                                products.splice(index,1)
                                that.products = products
                                that.page = 1
                                that.queryViewedList()
                                uni.showToast({
                                    title: res.data.content,
                                    icon: 'success',
                                    mask: true
                                })
                            }
                        })
                    }else if(cancel) {

                    }
                }
            })
            
        },
        getStorageIds() {
            uni.showLoading({
                title: '',
                mask: true
            })
            uni.getStorage({
                key: 'viewed_product_id',
                success: res => {
                    this.viewed_product_id = res.data
                    this.queryViewedList(true)
                },
                fail: () => {
                    this.queryViewedList()
                }
            })
        },
        queryViewedList(need_id = false) {
            const that = this
            let params = {
                p: that.page,
            }
            if(need_id) {
                Object.assign(params, {viewed_product_id: that.viewed_product_id})
            }
            that.$apis.queryViewedList(params).then(res=> {
                uni.hideLoading()
                if(res.code == '200') {
                    const {products, page_count, update_view_record} = res.data
                    products.forEach(item=>{
                        item.showMask = false
                    })
                    if(that.page == 1) {
                        that.products = []
                    }
                    const newProducts = that.products.concat(products)
                    that.setData({
                        products: newProducts,
                    })
                    if(that.page >= page_count) {
                        // 最后一页
                        that.setData({
                            isLastPage: true
                        })
                    }
                    if(update_view_record) {
                        // 更新缓存 保留30条最近记录
                        const arr = that.viewed_product_id.split(',')
                        if(arr.length > 30) {
                            const newArr = arr.slice(arr.length-30, arr.length)
							const str = newArr.join(',')
							uni.setStorage({
								key: 'viewed_product_id',
								data: str,
								success: (res)=> {

								}
							})
                        }
                        
                        
                    }
                    if(!that.products.length) {
                        that.setData({
                            showEmpty: true,
                            isLastPage: false
                        })
                    }
                }
            }).catch(()=>{
                uni.hideLoading()
            })
        }
    },
    onPageScroll: function (t) {
        if (t.scrollTop >= 180) {
            this.showBtn = true
            uni.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#ffffff'
            });
            app.globalData.fadeInOut(this, 'fadeAni', 1);
        } else {
            this.showBtn = false
            uni.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#ffffff'
            });
            app.globalData.fadeInOut(this, 'fadeAni', 0);
        }
		this.$debounce(() => {
			this.$refs['good_list_ref_re']&&this.$refs['good_list_ref_re'].startObserver();
		}, 300)
    },
}
</script>
<style>
.no_result{
    width: 100%;
    flex-wrap: wrap;
    height: 500rpx;
}
.empty_text{
    text-align: center;
}
.recently-box .recently-viewed-content {
	padding-top: 32rpx;
}
</style>