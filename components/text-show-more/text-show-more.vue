<!-- 超出N行 items 点击more展开更多 -->
<template>
    <view :class="'show_more_box flex ' + (can_not_show? 'can_not_show ' : '')">
        <view v-for="(item, index) in nowShowItems" @tap="handleTapKey(item)" :class="clsName + ' calcitem search-item align-items-center flex ' + (isRecently&&!showOpenDelete ? 'delete_item' : ' ') + (isHotItems||isTrending ? 'hot_search_item flex hot_item ' : '') " :key="index+'item'">
            <image
                v-if="(isHotItems&&index < 4)||(isTrending&&item.hot)"
                class="hot_img"
                src="@/static/images/icon/ishot_icon@2x.png"
            />	
            <view class="key_content">{{ isTrending ? item.search_key : item }}</view>
            <i class="iconfont del_icon" v-if="isRecently"></i>
        </view>
        <view class="expand_btn more_btn search-item flex align-items-center" v-show="showExpandBtn" @tap="handleShowMore">
            <text>{{ $t('search.more') }}</text>
            <image
                class="img"
                src="@/static/images/more@2x.png"
            />	
        </view>
        <view class="expand_btn less_btn search-item flex align-items-center" v-show="showLessBtn" @tap="handleShowLess">
            <text>{{ $t('search.less') }}</text>
            <image
                class="img"
                src="@/static/images/more@2x.png"
            />		
        </view>
    </view>
</template>
<script>
    export default{
        props: {
            allItems: {
                type: Array,
                default: [],
                // 数据数组
            },
            showOpenDelete: {
                type: Boolean,
                default: false,
                // 是否显示叉
            },
            isHotItems: {
                type: Boolean,
                default: false,
                // 是否是热搜
            },
            isRecently: {
                type: Boolean,
                default: false,
                // 是否是最近搜索记录
            },
            isTrending: {
                type: Boolean,
                default: false,
                // 是否是trending search
            },
            clsName: {
                type: String,
                default: '',
                // 类名，避免类名相同重复计算
            },
            maxLines: {
                type: Number,
                default: 3,
            }
        },
        data(){
            return{
                showExpandBtn: false,
                showLessBtn: true,
                staticAllWords: [...this.allItems],
                nowShowItems: [...this.allItems],
                can_not_show: true,
            }
        },
        watch:{
            allItems(newVal, oldVal){
                this.staticAllWords = [...this.allItems]
                this.nowShowItems = [...this.allItems]
                if(this.isRecently&&!this.showOpenDelete)return
                if(oldVal.length||newVal.length){
                    this.$nextTick(()=>{
                        // this.initLines()
                        setTimeout(() => {
                            this.can_not_show = false
                            this.handleShowLess()
                        }, 300);
                    })
                }
            },
            showOpenDelete(newVal, oldVal){
                if(!newVal&&oldVal){
                    this.handleShowMore()
                    this.showLessBtn = false
                    this.showExpandBtn = false
                }else{
                    this.showExpandBtn = false
                    this.showLessBtn = true
                    this.handleShowLess()

                }
            }
        },
        mounted(){
            if(this.allItems.length){
                // this.initLines()
                setTimeout(() => {
                    this.can_not_show = false
                    this.handleShowLess()
                }, 300);
            }
        },
        methods: {
            handleTapKey(item){
                const value = this.isTrending ? item.search_key : item
                this.$emit('tapKey', value)
            },
            handleShowMore(){
                this.nowShowItems = [...this.staticAllWords]
                this.showExpandBtn = false
                this.showLessBtn = true
				this.$emit('showItmsChange',this.nowShowItems)
            },
            handleShowLess(){
                this.showLessBtn = false                
                this.showExpandBtn = true
                // this.calcLinesFunc()
                this.$nextTick(this.calcLinesFunc)
            },
            initLines(){		
                // this.$nextTick(this.calcLinesFunc)	                
            },
            calcLinesFunc(){
                const that = this
                uni.createSelectorQuery().selectAll(`.${this.clsName}`).boundingClientRect(rects =>{
                    if(!rects[0])return
                    const firstLeft = rects[0].left
                    let count = 0
                    let k = 0
                    let btnWidth
                    uni.createSelectorQuery().select('.more_btn').boundingClientRect(res =>{
                        btnWidth = res.width          
                        rects.forEach((item, index) => {
                            if(item.left == firstLeft){
                                count++
                                if(count == (that.maxLines + 1)){
                                    k = index - 1
                                    // console.log(rects[k].right - btnWidth -16 - firstLeft < 0,k);
                                    if(rects[k].right - btnWidth -16 - firstLeft < 0){
                                        k--
                                    }
                                }
                            }
                            
                        });
                        if(count > that.maxLines) {
                            this.showExpandBtn = true
                            const nowShowItems = [...this.staticAllWords]
                            const arr = nowShowItems.splice(0, k)
                            this.nowShowItems = arr
							this.$emit('showItmsChange',this.nowShowItems)
                        }else{
                            this.showExpandBtn = false
							this.$emit('showItmsChange',this.nowShowItems)
                        }
                    }).exec()
                }).exec()
            }

        }
    }
</script>
<style lang="scss" scoped>
    .hot_img{
        width: 30.77rpx;
        height: 30.77rpx;
        margin-right: 7.69rpx;
    }
    .can_not_show{
        opacity: 0;
    }
   .expand_btn{
        padding-right: 0!important;
        .img{
            width: 34.62rpx;
            height: 34.62rpx;
        }
        &.less_btn{
            .img{
                transform: rotate(-180deg);
            }
        }
    }
    .more{
        max-height: 136.76rpx;
        overflow: hidden;
    }
    .more_tag{
        position: absolute;
        right: 0;
        bottom: 0;
        background: pink;
    }
    .search-item {
        box-sizing: border-box;
        padding: 0 23.08rpx;
        height: 54rpx;
        line-height: 54rpx;
        margin: 0 15.38rpx 15.38rpx 0;
        font-size: 26.92rpx;
        color: #666666;
        background-color: #F5F5F5;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        position: relative;
        &.delete_item{
			padding-right: 0rpx;
			i{
				font-size: 24rpx;
				height: 100%;
    			transform: translateY(-20%) scale(0.8);
				padding: 0 8rpx 0 16rpx;
				color: #666;
				&:before{
					content: '\e6ab';
				}
			}

		}
        .key_content{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            flex: 1;
            max-width: 200rpx;
        }
        
    }
    .hot_search_item .hot_icon{
        color: #fa6338;
        margin-right: 6rpx;
        font-size: 24rpx;
        &:before{
            content: '\e690';
        }
    }
    .delete_item{
        padding-right: 0rpx;
        .del_icon{
            font-size: 20rpx;
            height: 100%;
            transform: translateY(-20%) scale(0.8);
            padding: 0 8rpx 0 16rpx;
            color: #666;
            &:before{
                content: '\e6ab';
            }
        }

    }
    .expand_btn{
        padding-right: 0!important;
        .img{
            width: 34.62rpx;
            height: 34.62rpx;
        }
        &.less_btn{
            .img{
                transform: rotate(-180deg);
            }
        }
    }
    .more_btn,.less_btn{
        background: #fff;
    }
		
</style>