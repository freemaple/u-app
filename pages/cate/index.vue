<template>
    <view>
        <view class="top_search_header flex justify-content-between align-items-center">
            <view class="fake_input flex justify-content-between align-items-center ma-search-input" @tap="handleToSearch">
                <view class="search_placeholder">{{ $t('category.search_by_di', {site_name: $store.state.site_name_upper}) }}</view>
                <view class="search_icon">
                    <image
                        class="img"
                        :src="getImgPathFunc('/static/images/category_top_search')"
                        mode="aspectFill"
                    />
                </view>
            </view>
            <view class="sign_in_icon" @tap="navBuriedPoint">
                <image
                    class="img"
                    :src="getImgPathFunc('/static/images/category_sign_in')"
                    mode="aspectFill"
                />
            </view>
        </view>
        <view class="container">
            <view class="type-container-boxx flex">
                <view class="flex top_wrapper">
                    <scroll-view scroll-x="true" @scroll="handleScrollStartObserver()" class="first_type_container" show-scrollbar="false">
                        <view class="flex">
                            <view class="flex first_type_wrapper">
                                <view @tap="handleClickFirst(item)" :id="'maCategoryItem'+item.custom_id" :class="'first_type_item flex align-items-center justify-content-center font-bold ' + (categories.length == 2 ? ' first_type_item_double ' : '') + (activeCategoryId==item.id ? 'checked ' : '')" v-for="item in categories" :key="item.id">{{ item.name }}</view>
                            </view>
                        </view>
                    </scroll-view>  
                </view>              
                <view class="flex bottom_wrapper">
                    <scroll-view scroll-y="true" @scroll="handleScrollStartObserver()" class="second_type_container" show-scrollbar="false"> 
                        <view class="flex">
                            <view class="flex second_type_wrapper">
                                <view @tap="handleClickSecond(item)" :id="'maCategoryItem'+item.custom_id" :class="'second_type_item flex  align-items-center ' + (activeCategoryIdSecond==item.id ? 'checked font-bold ' : '')" v-for="item in nowCategorySecond" :key="item.id">
                                    <view class="text">{{ item.name }}</view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                    <scroll-view scroll-y="true" @scroll="handleScrollStartObserver('thirdFourthCategories')" class="third_type_container" show-scrollbar="false"> 
                        <view class="flex">
                            <view class="flex third_type_wrapper">
                                <view class="third_type_item flex align-items-center justify-content-center" v-for="item in nowCategoryThird" :key="item.id">
                                    <view class="third_tittle font-bold" :id="'maCategoryItem'+item.custom_id" @tap="handleClickThird(item)">{{ item.name }}</view>
                                    <view class="fourth_type_container flex">
                                        <view @tap="handleClickFourth(ite)" :id="'maCategoryItem'+ite.custom_id" class="fourth_type_item flex align-items-center justify-content-start" v-for="ite in item.fourthArr" :key="ite.name">
                                            <view class="img_wrapper">
                                                <image
                                                    class="img"
                                                    mode="aspectFill"
                                                    lazy-load="true"
                                                    :src="ite.icon"
                                                />
                                            </view>
                                            <view class="name flex align-items-start justify-content-center">{{ite.name}}</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                
            </view>
            
        </view>
        <view v-if="!search" :class="'search-box ' + iponesc">
            <view v-if="!searchidden" class="goods-box" @tap="toDetailsTap" :data-id="item.id" v-for="(item, index) in searchs" :key="index">
                <view class="img-box">
                    <image :src="item.pic + '_m'" class="image" mode="widthFix" :lazy-load="true" />
                    <view class="goods-characteristic">
                        <text>{{ item.characteristic }}</text>
                    </view>
                </view>

                <view class="goods-title">{{ item.name }}</view>

                <view style="display: flex">
                    <view class="goods-price">Ұ{{ item.minPrice }}</view>
                    <view class="goods-price-naver">已售{{ item.numberOrders }}</view>
                </view>
            </view>
            <view v-if="!nonehidden" class="goods-none">
                <image src="/static/images/search_empty.png" />
                <!-- <text>您寻找的商品还未上架</text> -->
            </view>
        </view>
        <view class="top-line"></view>
        <view class="bottom-lin"></view>
    </view>
</template>

<script>
import navigation from '@/components/navigation/navigation';
//index.js
var app = getApp(); // 语言


export default {
    components: {
        navigation
    },
    data() {
        return {
            activeCategoryId: 0,
            activeCategoryIdSecond: 0,
            nowCategorySecond: [],
            nowCategoryThird: [],
            search: true,
            nonehidden: true,
            firstTypeObj: {},
            secondTypeObj: {},
            //语言 - end
            searchidden: true,

            banner: {},
            categoriesListAll: [],
            categorieslist: [],
            categoriesThreelist: [],
            categories: [],
			firstSecondCategories:[],//一级二级分类集合
			thirdFourthCategories:[],//三级四级分类集合
            iphone: '',
            iponesc: '',
            searchs: '',
            searchinput: false,
            banners: '',
			menuObj: {},
            isNetworkOk: false,
			isSearchBoxImpression:false,
        };
    },
	onTabItemTap(item) {
		this.$maEvent.custom_event({
			event_category: 'tabBar',
			event_action: 'tabBar_button',
			event_name: 'tabBar_button',
			module: 'tabBar',
			event_data: {
				event_value: 'category'
			},
		});
	},
    onPullDownRefresh() {
        this.initCategory();
    },
	mounted() {
		this.$nextTick(()=>{
			this.startSearchBoxObserver();
		})
	},
    onLoad: function () {
        var that = this; // 语言
        uni.$off('languageChange').$on('languageChange',that.initCategory)

        uni.getSystemInfo({
            success: function (res) {
                if (res.model.search('iPhone X') != -1) {
                    that.setData({
                        iphone: 'iphoneTop',
                        iponesc: 'iphonesearch'
                    });
                }
            }
        });
		this.$maEvent.cateIndexView();
    },
	destroyed(){
		if(this.observer){
			this.observer.disconnect();
			this.observer = null;
		}
	},
    onShow: function () {		
        var that = this;
		const params = getApp().globalData.paramsData	
		params&&that.setData({
			activeCategoryId:params.id
		})
        if(!that.isNetworkOk){
            that.initCategory();
        }        
		// that.getGoodsList(that.activeCategoryId);
		getApp().globalData.getShopCartNum();
		
		this.setCateGoryShow();
		uni.$emit('appDateLog');
		this.$maEvent.visit_event({
			event_category: 'category',
			event_action: 'category_visit',
			event_name: 'category_visit'
		})
    },
    computed: {
        // getImgPath(){
        //     const pixelRatio = uni.getSystemInfoSync().pixelRatio
        //     const imageName = pixelRatio >= 2 ? '@2x.png' : '.png'; 
        //     return `/static/images/category_top_search${imageName}`
        // },
        // getImgPathSignin(){
        //     const pixelRatio = uni.getSystemInfoSync().pixelRatio
        //     const imageName = pixelRatio >= 2 ? '@2x.png' : '.png'; 
        //     return `/static/images/category_sign_in${imageName}`
        // }
    },
    methods: {   
		startSearchBoxObserver() {
			if(!this.searchObserver){
				this.searchObserver = this.$public.createIntersectionObserver();
			}
			let elementSelector = ".ma-search-input";
			this.$public.observeVisibility(this.searchObserver, elementSelector, () => {
				if(this.isSearchBoxImpression){
					return false;
				}
				this.isSearchBoxImpression = true;
				this.$maEvent.impression_event({
					event_category: 'search',
					event_action: 'search_box_page',
					event_name: 'category',
					module: 'search_box',
					event_data: {
						page_in: 'category'
					}
				})
			});
		},
		handleScrollStartObserver(type) {
			this.$debounce(() => {
				this.startObserver(type);
			}, 200)
		},
		// 开始观察产品曝光
		startObserver(type) {
			if(!this.observer){
				this.observer = this.$public.createIntersectionObserver();
			}
			if(this.observer){
				let impressionList = this.firstSecondCategories;
				// let nowCategoryThirdArr = [];
				if(type) {
					impressionList = this.thirdFourthCategories;
					// this.nowCategoryThird.map(item=>{
					// 	nowCategoryThirdArr.push(item);
					// 	if(item.fourthArr) {
					// 		item.fourthArr.map(citem=>{
					// 			nowCategoryThirdArr.push(citem);
					// 		})
					// 	}
					// })
				}
				impressionList.forEach((item, index) => {
					if(!item.observer){
						const elementSelector = "#maCategoryItem" + item.custom_id;
						this.$public.observeVisibility(this.observer, elementSelector, () => {
							this.handleVisibilityChange(item, index,type);
						});
					}
				});
			}
		},
		handleVisibilityChange(item, index,type) {
			if(item.observer){
				return false;
			}
			if(type) {
				this.thirdFourthCategories[index].observer = true;
			} else {
				this.firstSecondCategories[index].observer = true;
			}
			item.observer = true;
			this.$maEvent.impression_event({
				event_category: 'category',
				event_action: 'category_index_button',
				event_name: item.name,
				module: 'category_index',
				event_data: {
					event_value: item.name,
					level: item.level
				}
			});
		  // 记录曝光数据或进行其他操作
		},
        getImgPathFunc(path){
            const pixelRatio = uni.getSystemInfoSync().pixelRatio
            const imageName = pixelRatio >= 2 ? '@2x.png' : '.png'; 
            return `${path}${imageName}`
        },
        handleClickFirst(item){
            this.activeCategoryId = item.id
            this.nowCategorySecond = this.firstTypeObj[item.id]
            this.activeCategoryIdSecond = this.nowCategorySecond[0]&&this.nowCategorySecond[0].id
            this.nowCategoryThird = this.secondTypeObj[this.activeCategoryIdSecond]||[]
			// 这个变量主要用于此功能：用户首页点击 women，进入列表也展示的也是women。这里同步设置一下
			// 防止出现,用户首页点击 women进入列表，点击men,进入详情,返回,展示了women的情况
			// this.$store.commit('SET_CATEGORYSHOWID', item.id);
			this.maCategoryClick(item.name,item.level);
        },    
		maCategoryClick(name,level) {
			this.$maEvent.custom_event({
				event_category: 'category',
				event_action: 'category_index_button',
				event_name: name,
				module: 'category_index',
				event_data: {
					event_value: name,
					level: level
				}
			});
		},
        handleClickSecond(item){
            this.activeCategoryIdSecond = item.id
            this.nowCategoryThird = this.secondTypeObj[item.id]
			this.maCategoryClick(item.name,item.level);
			this.$nextTick(()=>{
				if(this.nowCategoryThird.length) {
					this.startObserver('thirdFourthCategories')
				}
			})
        },
        handleClickThird(item){
			this.maCategoryClick(item.name,item.level);
            const {id, jump_to, name} = item
            if(!jump_to)return
            uni.navigateTo({
                url: `/pages/cate/list?id=${id}&type=${name}`
            })
        },
       
        handleClickFourth(item){
			this.maCategoryClick(item.name,item.level);
            const {cate_id, type, id, name} = item
            if(cate_id && type) {
                // 特殊分类
                uni.navigateTo({
                    url: "/pages/search/search?specialcate=" + encodeURIComponent(JSON.stringify({type,cate_id}))
                })
            }else{
                uni.navigateTo({
                    url: `/pages/cate/list?id=${id}&type=${name}`
                })
            }
        },

        handleToSearch(){
            uni.navigateTo({
                url: '/pages/search/search'
            })
			this.$maEvent.custom_event({
				event_category: 'search',
				event_action: 'search_box_button',
				event_name: 'category',
				module: 'search_box',
				event_data: {
					page_in: 'category'
				}
			})
        },
        initCategory: function () {
            const that = this;
            uni.stopPullDownRefresh();
            that.$apis.initCate().then(res =>{
                uni.hideLoading()
                if(res.code == 200) {
                    that.isNetworkOk = true
                    let {categoriesThreelist, categorieslist, banners, categories,categoriesFourlist} = res.data
					categories = this.formatCustomId(categories,'level1');
					categorieslist = this.formatCustomId(categorieslist,'level2');
					categoriesThreelist = this.formatCustomId(categoriesThreelist,'level3');
					categoriesFourlist = this.formatCustomId(categoriesFourlist,'level4');
                    that.formatTypes(categories, categorieslist, categoriesThreelist, categoriesFourlist)
                    that.activeCategoryId = categories[0] && categories[0].id
                    that.nowCategorySecond = that.firstTypeObj[that.activeCategoryId]
                    that.activeCategoryIdSecond = that.nowCategorySecond[0]&&that.nowCategorySecond[0].id
                    that.nowCategoryThird = that.secondTypeObj[that.activeCategoryIdSecond]
                   
                    that.setData({
                        categories,
                        categoriesListAll: categorieslist,
                        categorieslist,
                        banners,
                        categoriesThreelist,
                        // activeCategoryId: 0
                    }); 
					that.setCateGoryShow();
					that.$nextTick(() => {
						that.startObserver();
						if(that.nowCategoryThird.length) {
							that.startObserver('thirdFourthCategories')
						}
					})
                }
            }).catch(err =>{
                uni.hideLoading()
            })            
        },		
        formatTypes(first, second, third, fourth){ 
            const that = this           
            first.forEach(item => {
                const arr = []
                second.forEach(ite =>{
                    if(item.id == ite.pid) {       
                        arr.push(ite)    
                    }
                    that.$set(that.firstTypeObj, item.id, arr)
                })
            })
            second.forEach(item => {
                const arr = []
                third.forEach(ite =>{
                    if(item.id == ite.pid) { 
                        const fourthArr = []
                        fourth.forEach(it =>{
                            if(it.pid == ite.id) {
                                fourthArr.push(it)
                            }
                        })
                        ite.fourthArr = fourthArr
                        arr.push(ite)    
                    }
                    that.$set(that.secondTypeObj, item.id, arr)
                })
            })
			that.firstSecondCategories = first.concat(second);
			that.thirdFourthCategories = third.concat(fourth);
        },
		formatCustomId(list,prefix) {
			// custom_id用于埋点
			let num = 1;
			let newList = list.map(item=>{
				item['custom_id'] = 'Custom_'+prefix+'_'+num;
				num++;
				return item;
			})
			return newList
		},
        getGoodsList: function (categoryId) {
            var that = this;
            var categorieslist = [];
            var categoriesListAll = that.categoriesListAll;
            const categoriesThreelist = that.categoriesThreelist
			if(that.menuObj[categoryId]&&that.menuObj[categoryId].length){
				that.setData({
				    categorieslist: that.menuObj[categoryId]
				});		
				return 
			}			
            if (categoryId == 0) {
				that.menuObj['0'] = categoriesListAll
                that.setData({
                    categorieslist: categoriesListAll
                });
                return;
            }
            
            for (var x in categoriesListAll) {
                var category = categoriesListAll[x];
                category.threeCategory = []
                categoriesThreelist.forEach((item)=> {
                    if(item.pid == category.id) {
                        category.threeCategory.push(item)
                    }
                })
                var pid = category.pid;

                if (pid == categoryId) {
                    categorieslist.push(category);
                }
            }
			that.menuObj[categoryId] = categorieslist
            that.setData({
                categorieslist: that.menuObj[categoryId]
            });
        },

        toDetailsTap: function (e) {
            uni.navigateTo({
                url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id
            });
            this.setData({
                search: true,
                searchinput: false
            });
        },
		// 设置大分类哪个显示
		setCateGoryShow() {
			const id = this.$store.getters.getCateGoryShowId;
			if(this.categories.length && id != -1) {
				this.handleClickFirst({ id });
				this.$store.commit('SET_CATEGORYSHOWID', -1); // 点击了一次后就不再触发，防止分类页面出现BUG
			}
		},
		// 顶部签到 按钮埋点
		navBuriedPoint() {
			this.$maEvent.custom_event({
				event_category: 'menu_box',
				event_action: 'menu_box_button',
				event_name: 'menu_box_button',
				module: 'menu_box',
				event_data: {
					event_value: 'check_in',
					checkin_type: 'category'
				}
			});
			this.$public.handleNavTo('/pages/my/checkin');
		},
    }
};
</script>
<style lang="scss" scoped>
@import "@/common/mixins.scss";

/**index.wxss**/

.top_search_header{
    margin-bottom: 3.85rpx;
    width: 100%;
    height: 92rpx;
    padding: 0 31rpx;
    .fake_input{
        padding: 0 34.62rpx;
        width: 615rpx;
        height: 69rpx;
        background: #EEEEEE;
        border-radius: 58rpx 58rpx 58rpx 58rpx;
        .search_placeholder{
            color: #999999;
            font-size: 29.77rpx;
        }
        .search_icon{
            width: 46.15rpx;
            height: 46.15rpx;
            .img{
                width: 46.15rpx;
                height: 46.15rpx;
            }
        }
    }
    .sign_in_icon{
        width: 46.15rpx;
            height: 46.15rpx;
        .img{
            width: 46.15rpx;
            height: 46.15rpx;
        }
    }
}
.top_wrapper{
    width: 100%;
    height: 92rpx;
    ::-webkit-scrollbar{
    display: none;
    width: 0!important;
    height: 0!important;
    -webkit-appearance: none;
    background: transparent;
}
}
.first_type_wrapper{
    flex-wrap: nowrap;
    height: 92rpx;
    position: relative;
    @include onepxBorder(#eee);
}
.first_type_item{
    width: calc(100vw / 3);
    font-size: 30.77rpx;
    position: relative;
    color: #999999;
    height: 92rpx;
    white-space: nowrap;
    overflow: hidden;
    &.first_type_item_double{
        width: 50vw;
    }
    
}
.first_type_item.checked{
    color: #000;
    &:after{
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    transform: translateX(-50%);
    left: 50%;
    width: 50rpx;
    height: 4rpx;
    background: #000;
}
}
.bottom_wrapper{
    flex: 1;
    height: calc(100vh - 184rpx);
}
.second_type_container{
    width: 208rpx;
    height: 100%;
    background-color: #F5F5F5;
    ::-webkit-scrollbar{
    display: none;
    width: 0!important;
    height: 0!important;
    -webkit-appearance: none;
    background: transparent;
}
}
.third_type_container{
    height: 100%;
    flex: 1;
    ::-webkit-scrollbar{
    display: none;
    width: 0!important;
    height: 0!important;
    -webkit-appearance: none;
    background: transparent;
}
}
.second_type_wrapper{
    height: 100%;
    width: 208rpx;
    flex-wrap: wrap;
    background: #F5F5F5;
    font-size: 26.92rpx;
        .second_type_item{
            width: 100%;            
            padding: 42.31rpx 31rpx;           
            .text{
                line-height: 1.2083;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                display: -webkit-box;
                color: #333333;
            }
            &.checked{
                position: relative;
                background: #fff;
                &:before{
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8rpx;
                    height: 31rpx;
                    background: #E30057;
                }
            }
        }
    }
.third_type_wrapper{
    flex: 1;
    width: 100%;
    background: #fff;
    
    .third_type_item{
        width: 100%;
        margin-bottom: 43rpx;
        .third_tittle{
            text-align: left;
            font-size: 26.92rpx;
            color: #000000;
            width: 100%;
            padding: 32rpx;
        }
        .fourth_type_container{
            width: 100%;    
            padding-left: 32.69rpx;        
            .fourth_type_item{
                // width: calc(100% / 3);
                width: 160rpx;
                margin-bottom: 21.15rpx;
                // height: 185rpx;
                flex-direction: column;
            }
            .img_wrapper{                
                width: 131rpx;
                height: 131rpx;
                margin-bottom: 15.38rpx;
                background:#EEEEEE;
                border-radius: 50%;
                overflow: hidden;
            }
            .img{
                width: 131rpx;
                height: 131rpx;
                border-radius: 50%;
            }
            .name{
                width: 100%;
                min-height: 38rpx;
                font-size: 26.92rpx;
                text-align: center;
                color: #333333;
            }
        }
    }
}

page {
    height: 100%;
    min-height: 100%;
    background-color: #fff;
}
.all-cate{
    display: inline-block;
    width: 60rpx;
}
.type-level-two-tittle{
    height: 80rpx;
    line-height: 80rpx;
    position: relative;
    padding-right: 60rpx;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* padding-left: 40rpx; */
    width: calc(100% - 80rpx);
}
.type-level-two-tittle>i{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24rpx;
    font-weight: 400;
}
.type-level-two-tittle{
    font-size: 28rpx;
}
.type-level-two-tittle>i:after{
    content: '\e609';
}
.type-level-two-wrapper{
    margin-bottom: 48rpx;
    background: #FFF;
    margin-left: 20rpx;
    padding-left: 20rpx;
}
.container {
    height: 100%;
    display: block;
    font-family:  SF UI Text,Roboto,Helvetica,Arial,sans-serif;
}

.iphoneTop {
    line-height: 0;
}

.type-header-menu {
    height: 130rpx;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 99999;
    border-bottom: 1px solid #f5f5f5;
}

.type-header-menu .type-search {
    width: 70%;
    margin-left: 30rpx;
    position: relative;
    height: 66rpx;
    overflow: hidden;
    margin-top: 60rpx;
}

.type-header-menu .type-search image {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 14rpx;
    left: 16rpx;
}

.type-header-menu .type-search .input {
    width: 80%;
    height: 60rpx;
    background-color: #f5f5f5;
    border-radius: 50rpx;
    font-size: 28rpx;
    padding-left: 65rpx;
    display: inline-block;
    transition: all 0.6s;
}

.type-header-menu .type-search .active {
    width: 60%;
    transition: all 0.6s;
}

.type-header-menu .type-search .header-search-btn {
    float: right;
    font-size: 30rpx;
    line-height: 60rpx;
    color: #b5272d;
    margin-right: 46rpx;
}

.iphoneTop .type-header-menu {
    height: 180rpx;
}

.iphoneTop .type-search {
    margin-top: 100rpx;
}

.type-container-boxx {
    width: 100%;
    height: calc(100vw - 184rpx);
    /* position: fixed;
    top: 10vh;
    left: 0; */
}
.iphoneTop .type-container-boxx {
    top: 12vh;
    height: 88vh;
}

.type-container {
    width: 25%;
    height: 100%;
    border-right: 1px solid #f5f5f5;
    background-color: #fff;
    overflow-y: auto;
    display: inline-block;
    float: left;
}

.type-box:nth-child(1) {
    /* margin-top: 20rpx; */
}

.type-box {
    padding: 5px 0;
    height: auto;
    line-height: 40rpx;
    /* margin: 20rpx 0; */
	padding: 20rpx 0;
    text-align: left;
	position: relative;
}

.type-navbar-item {
    font-size: 24rpx;
    text-align: left;
    border-left: 70rpx;
    padding-left: 20rpx;
	color: #333;
}

.type-item-on {
   font-weight: 700;
}
.type-item-box::before{
	position: absolute;
	left: 0;
	top: 0;
	content: "";
	transform: scale(.5);
	transform-origin: 0 0;
	width: 200%;
	height: 200%;
	font-size: 10rpx;
	border-left: 14rpx #333 solid;
	font-weight: 700;
}

.type-list {
    width: 74%;
    height: 100%;
    overflow: scroll;
    float: left;
    background: #f5f5f5;

}

.goods-title {
    font-size: 30rpx;
    white-space: nowrap;
}

.swiper-container {
    width: 95%;
    position: relative;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 20rpx;
}

.swiper_box,
.slide-image,
.swiper_box {
    width: 100%;
    height: 115px;
    border-radius: 5px;
}

.dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 46rpx;
    display: flex;
    justify-content: center;
}

.dots .dot {
    margin: 0 5rpx;
    width: 12rpx;
    height: 5rpx;
    background: #fff;
    border-radius: 2rpx;
    transition: all 0.6s;
    opacity: 0.5;
}

.dots .dot.active {
    width: 12rpx;
    opacity: 1;
}

.type-menu {
    margin: 0 auto;
    transition: all 0.3s;
    padding-right: 20rpx;
}

.type-img {
    width: 156rpx;
    height: 156rpx;
    display: block;
    margin: 0 auto;
    border-radius: 8rpx;
    margin-bottom: 10rpx;
}

.iphoneTop .type-img {
    width: 80%;
    display: block;
    margin: 0 auto;
    margin-bottom: 10rpx;
    border-radius: 8rpx;
}

.type-level-box {
    display: inline-block;
    text-align: center;
    margin-bottom: 10px;
    width: 33%;
}

.type-level-item {
    color: #333;
    font-size: 26rpx;
}

.type-level-item text {
    display: block;
    text-align: center;
    width: 100%;
    height: 40rpx;
    line-height: 40rpx;
}

.top-line {
    width: 100%;
    height: 1px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f5f5f5;
    z-index: 99999;
}

.bottom-lin {
    width: 100%;
    height: 1px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f5f5f5;
    z-index: 99999;
}

.search-box {
    position: fixed;
    top: 130rpx;
    width: 100%;
    height: 90vh;
    background-color: #fff;
    z-index: 9999;
    overflow: scroll;
}

.iphonesearch {
    top: 180rpx;
}

.goods-box {
    width: 45%;
    margin: 20px 0 0 13px;
    display: inline-block;
}

.img-box image {
    width: 100%;
    display: block;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

.img-box {
    width: 100%;
    background-color: #f5f5f5;
    margin-bottom: 5px;
    position: relative;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
}

.goods-characteristic {
    font-size: 22rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #f0ece1;
    color: #a18d65;
    height: 35px;
    line-height: 35px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.goods-characteristic text {
    padding-left: 5px;
}

.goods-title {
    font-size: 28rpx;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
}

.goods-price {
    color: #b5272d;
    font-size: 28rpx;
    text-align: left;
    width: 100%;
    padding: 3px 4px;
}

.goods-price-naver {
    color: #999;
    font-size: 24rpx;
    line-height: 28px;
    width: 100%;
    text-align: right;
    padding: 0 3px;
}

.goods-none {
    margin-top: 25%;
}

.goods-none image {
    width: 200rpx;
    height: 200rpx;
    display: block;
    margin: 0 auto;
}

.goods-none text {
    font-size: 28rpx;
    display: block;
    color: #999;
    text-align: center;
    margin-top: 10rpx;
}
</style>
