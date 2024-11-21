<template>
    <view style="width:50%;">
        <view class="size_item" @tap="handleOpenPopup">
        <view class="left">
            <view class="item_label">{{ label }}</view>
            <view class="item_value">{{ getVal }}</view>
        </view>
        <i class="iconfont"></i>
    </view>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup :ref="refName" type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" :scroll-into-view="scrollId" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{label}}</view>
                            <i class="iconfont" @tap="closePopup"></i>
                        </view>
                        <view class="flex select_options">
                            <view @tap="handleCheck(item.key)" :id="'scroll_' + item.key" :class="'select_option flex '+ (item.key==value ? 'checked' : '')" v-for="item in options" :key="item.name" >
                                <i class="iconfont"></i>
                                <view class="select_option_text">{{ item.name }}</view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            refName: {
                default: '',
                type: String
            },
            screenHeight: {
                default: 0,
                type: Number
            },
            label: {
                default: '',
                type: String,
            },
            value: {
                default: '',
                type: String
            },
            options: {
                default: ()=>[],
                type: Array
            }
        },
        data(){
            return {
                scrollId: '',
            }
        },
        created(){
            
            
        },
        computed: {
            getVal(){
                let val = ''
                this.options.forEach(item => {
                    if(item.key == this.value){
                        val = item.name
                    }
                })
                return val
            }
        },
        methods: {
            handleOpenPopup(){
                if(this.value) {                
                    this.options.forEach(item=>{
                        if(item.key == this.value){
                            this.scrollId = 'scroll_' + item.key
                        }
                    })
                }
                this.$refs[this.refName].open()
            },
            closePopup(){
                this.$refs[this.refName].close()
            },
            handleCheck(key){
                this.$emit('changeChecked', {key, name: this.refName})
                this.closePopup()
            }
        }
    }
</script>
<style lang="scss" scoped>
.size_item{
    position: relative;
    margin: auto 10rpx;
    padding: 10rpx 0;
    &:after{
        position: absolute;
        bottom: 0;
        left: 0;
        background: #e5e5e5;
        content: "";
        width: 100%;
        height: 1px;
    }
    i{
        position: absolute;
        right: 5rpx;
        top: 50%;
        color: #767676;
        font-size: 28rpx;
        transform: translateY(-50%);
        &:before{
            content: '\e661';
        }
    }
    .item_label{
        font-size: 24rpx;
        color: #767676;
        line-height: 1.5;
    }
    .item_value{
        font-size: 28rpx;
        color: #222;
        line-height: 1.5;
    }
}
@media (min-resolution: 2dppx) {
    .size_item{
        &:after{                    
            height: 2px;
            transform: scaleY(0.5);
        }
        

    }
    
};
@media (min-resolution: 3dppx) {
    .size_item{
        &:after{                    
            height: 3px;
            transform: scaleY(0.3333);
        }
    }
}
.pop_wrapper{
    width: 100%;
    background-color: #fff;
    overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
    position: relative;
    .pop_header{
        padding: 10rpx 30rpx;
        position: fixed;
        background: #fff;
        top: 0;
        left: 0;
        width: 100%;
        height: 80rpx;
        i{
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #999;
            font-size: 24rpx;
            &:before{
                content: '\e6ab';
            }
        }
    }
    .header_title{
        font-size: 28rpx;
        width: 100%;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
}
.select_options{
    width: 100%;
    padding-top: 80rpx;
    .select_option{
        width: 100%;
        padding: 24rpx;
        font-size: 28rpx;
        color: #222;
    }
    .select_option i{
        font-size: 36rpx;
        color: #222;
        &::before{
            content:'\e63b';
        }
    }
    .select_option.checked i{
        &::before{
            content:'\e640';
        }
    }
}
</style>