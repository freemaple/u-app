<template>
    <view v-show="showFilter" @touchmove.stop.prevent="()=>{}">
		<uni-popup ref='popup' type="right">
            <view @touchmove.stop.prevent="()=>{}" class="pop_right_wrapper flex" :style="'height:' + screenHeight-statusBarHeight + 'px'">
                <view class="pop_right_header flex justify-content-center align-items-center">
                    <view class="img_box" @tap="close">
                        <image
                            class="img"
                            src="@/static/images/header_back_icon@2x.png"
                            mode="scaleToFill"
                        />
                    </view>
                    <view class="filter_tittle font-bold">{{ $t('popupright.filter') }}</view>
                </view>
                <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
					>					
					<view class="pop-attrs">
                        <view class="attr_item">
                            <view :class="'attr_tittle font-bold flex justify-content-between align-items-center ' + (!showPrice ? 'opened' : '')" @tap="()=>{showPrice=!showPrice}">
                                <view class="text">{{ $t('popupright.price') }}</view>
                                <view class="icon flex align-items-center">
                                    <image
                                        class="img"
                                        src="@/static/images/header_back_icon@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                            </view>
                            <view v-show="showPrice" class="inputs_wrapper flex justify-content-between align-items-center">
                                <view class="flex">
                                    <view class="currency">{{ symbol }}</view>
                                    <input class="price_input" type="number" v-model="price1" @input="(e)=>{handleInputPrice(e,'1')}">
                                </view>
                                <view class="bar"></view>
                                <view class="flex">
                                    <view class="currency">{{ symbol }}</view>
                                    <input class="price_input" type="number" v-model="price2" @input="(e)=>{handleInputPrice(e,'2')}">
                                </view>
                            </view>
                        </view>
						<view class="attr_item" v-for="(v, k) in filter_info" :key="k">
                            <view :class="'attr_tittle font-bold flex justify-content-between align-items-center ' + (v.opened ? '' : 'opened')" @tap="()=>{v.opened=!v.opened}">
                                <view class="text">{{ v.label }}</view>
                                <view class="icon flex align-items-center">
                                    <image
                                        class="img"
                                        src="@/static/images/header_back_icon@2x.png"
                                        mode="scaleToFill"
                                    />
                                </view>
                            </view>
                            <view :class="'attr_vals flex ' + (v.opened ? '' : 'opened')" v-show="v.opened">
                                <view @tap="()=>{v_child.selected = !v_child.selected;}" :class="'items ' + (v_child.selected ? 'checked' : '') " v-for="(v_child,k_child) in v.items" :key="k_child">{{ v_child.label }}</view>
                            </view>
                        </view>
					</view>
					
				</scroll-view>
                <view class="pop_btns">
                    <view class="flex wrapper justify-content-end">
                        <view class="clear flex align-items-center justify-content-center" @tap="handleClear">{{ $t('popupright.clear') }}</view>    
                        <view class="done flex align-items-center justify-content-center" @tap="handleDone">{{ $t('popupright.done') }}</view>    
                    </view>
                </view>
            </view>
        </uni-popup>
	</view>
</template>
<script>
const app = getApp();
export default {
    data() {
		return {
			screenHeight: 0,
            showPrice: false,
            price1: '',
            price2: '',
		};
	},
    props: {
        showFilter: {
            type: Boolean,
            default: false,
        },
        symbol: {
            type: String,
            default: '$',
        },
        filter_info: {
            type: Object,
            default: ()=>{{}},
        },
		belong_module: {
			type: String,
			default: ''
		}
    },
    created(){
        const that = this
        uni.getSystemInfo({
			success: (res)=> {
				that.screenHeight = res.screenHeight
			}
		})
    },
    computed: {
        statusBarHeight() {
            return app.globalData.statusBarHeight
        },
    },
    methods: {
        // 选中tag
        checkSelectedTag(checkedData){
            if(!checkedData)return
            const that = this
            const selected_filter_info = JSON.parse(checkedData)
            for(let key in selected_filter_info) {
                for(let k in that.filter_info){
                    for(let k_ in that.filter_info[k]){
                        if(k_ == 'items'){
                            for(let item_name in that.filter_info[k][k_]){
                                if(selected_filter_info[key].includes(that.filter_info[k][k_][item_name]['_id'])) {
                                    that.filter_info[k][k_][item_name]['selected'] = true
                                }
                            }
                            
                        }
                    }
                }
            }
        },
        open(){
            this.$refs['popup'].open()
        },
        close(){
            this.$refs['popup'].close()
        },
        handleInputPrice(e,type){
            const val = e.target.value
            const regVal = val.replace(/[^\d.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
            if(regVal){                
                if(type == '1') {
                    this.price1 = String(Number(regVal))
                }else{
                    this.price2 = String(Number(regVal))
                }
            }
        },
        getAttrs(){
            const filterAttrs ={}
            for(let key in this.filter_info){
                for(let k in this.filter_info[key]['items']){
                    const items = this.filter_info[key]['items']
                    const arr = []
                    for(let k_ in items){
                        if(items[k_].selected){
                            arr.push(items[k_]['_id'])
                        }
                    }
                    if(arr.length){
                        filterAttrs[this.filter_info[key]['name']] = arr
                    }
                }
            }
            return Object.keys(filterAttrs).length ? JSON.stringify(filterAttrs) : ''
            
        },
        getPriceRange(){
            let val = ''
            const that = this
            let price1 = that.price1
            let price2 = that.price2
            if(price1){
                price1 = Number(price1)
            }
            if(price2){
                price2 = Number(price2)
            }
            
            if(price1 > price2 &&that.price1&&that.price2){
                that.price2 = String(price1)
                that.price1 = String(price2)
                price1 = that.price1
                price2 = that.price2
            }
			if(that.price1&&that.price2){
				val = `${price1}-${price2}`
			}else if(price1 || price2){
				val = that.price1 ? `${price1}-` : `-${price2}`
			}
            return val
        },
        handleDone(){
            const filterAttrs = this.getAttrs()      
            const priceRange = this.getPriceRange()            
            this.$emit('handleFilterQuery', {filterAttrs, priceRange})
            this.close() 
			let maParams = {};
			if(this.belong_module == 'category') {
				maParams = {
					event_category: 'category',
					event_action: 'category_filter_done_button',
					event_name:'done',
					module: 'category_filter'
				}
			}
			if(this.belong_module == 'search') {
				maParams = {
					event_category: 'search',
					event_action: 'search_filter_done_button',
					event_name:'done',
					module: 'search_filter'
				}
			}
			this.$maEvent.custom_event(maParams)
        },
        handleClear(){
            for(let key in this.filter_info){
                for(let k in this.filter_info[key]['items']){
                    const items = this.filter_info[key]['items']
                    items[k]['selected'] = false
                }
            }
            this.price1 = ''
            this.price2 = ''
            this.$emit('handleFilterQuery', {filterAttrs: '', priceRange: ''})
            this.close() 
			let maParams = {};
			if(this.belong_module == 'category') {
				maParams = {
					event_category: 'category',
					event_action: 'category_filter_clear_button',
					event_name:'clear',
					module: 'category_filter'
				}
			}
			if(this.belong_module == 'search') {
				 maParams = {
					event_category: 'search',
					event_action: 'search_filter_clear_button',
					event_name:'clear',
					module: 'search_filter'
				}
			}
			this.$maEvent.custom_event(maParams)
        },
    }
}
</script>
<style lang="scss" scoped>
@import '@/common/mixins.scss';

.pop_right_wrapper{
    height: calc(100vh - var(--window-top));
    background: #fff;
    border-radius: 15.38rpx 0 0 15.38rpx;
    flex-direction: column;
    .pop_right_header{
        height: 184.62rpx;
        width: 100%;
        padding: 105.77rpx 28.85rpx 32.69rpx;  
        position: relative;     
        @include onepxBorder(#eee); 
        .img_box{
            width: 46.15rpx;
            height: 46.15rpx;
            position: absolute;
            left: 28.85rpx;
            top: 105.77rpx;
            .img{
                width: 46.15rpx;
                height: 46.15rpx;
            }
        }
        .filter_tittle{
            font-size: 30.77rpx;
            color: #000000;
        }
    }
}
.pop-lists{
    width: 80vw;
    height: calc(100% - 184.62rpx - 163.46rpx);
    flex: 1;
    overflow-y: auto;
    .pop-attrs{
        padding: 48.08rpx 30.77rpx;
        .inputs_wrapper{
            .price_input{
                width: 123rpx;
                height: 46rpx;
                background: #F5F5F5;
                text-align: center;
                font-size: 27rpx;
                color: #000;
            }
            .currency{
                font-size: 27rpx;
                margin-right: 31rpx;
                color: #000;
            }
            .bar{
                @include onepxBorder(#ccc); 
                width: 31rpx;
                height: 0;
            }
        }
        .attr_item{
            margin-bottom: 40rpx;
        }
    }
        .attr_tittle{
            color: #000000;
            font-size: 30.77rpx;
            line-height: 36rpx;
            height: 44rpx;
            margin-bottom: 20rpx;
            .icon{
                width: 23rpx;
                height: 23rpx;
                .img{
                    width: 23rpx;
                    height: 23rpx;
					transform: rotate(90deg);
                    transition: all 200ms;
                }
            }
            &.opened .img{
                width: 23rpx;
                height: 23rpx;
                transform: rotate(-90deg);
            }
        }
        .attr_vals{            
            overflow: hidden;
            transition: all 200ms;
            .items{
                color: #999;
                padding: 6rpx 20rpx;
                background: #eee;
                margin-right: 20rpx;
                border-radius: 8rpx;
                margin-bottom: 20rpx;
                font-size: 26.92rpx;
                white-space: nowrap;
                transition: all 200ms;
                &.checked{
                    color: #fff;
                    background: #333;
                }
            }
            
        }
}
.pop_btns{
    width: 100%;
    height: 163.46rpx;
    @include onepxBorderTop(#eee);
    .wrapper{
        margin-top: 31rpx;
        margin-right: 31rpx;
    }
    .clear{
        width: 121rpx;
        height: 62rpx;
        background: #FFFFFF;
        color: #000;
        border: 2rpx solid #CCCCCC;
        font-size:26.92rpx;
    }
    .done{
        width: 121rpx;
        color: #fff;
        // font-size: 27rpx;
        height: 62rpx;
        background: #000000;
        margin-left: 23.08rpx;
        font-size:26.92rpx;
    }
}
</style>