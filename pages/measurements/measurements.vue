<template>
    <view class="measurement_wrapper">
        <pageHeader :title="$t('measurement.my_measurement')"></pageHeader>
        <view class="measurement_content">
            <view class="measurement_des">
                <view class="tittle">{{ $t('measurement.top_title') }}</view>
                <view class="tittle">{{ $t('measurement.title_label') }}</view>
                <view class="tips">{{ $t('measurement.content1') }}</view>
                <view class="tips">{{ $t('measurement.content2', {site_name: $store.state.site_name_upper}) }}</view>
            </view>
            <view class="measurement_bottom">
                <view class="measurement_selects">
                    <view class="select_group">
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.height=key}" :options="height_list" :label="$t('measurement.height')" :value="oriParams.height" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.weight=key}" :options="weight_list" :label="$t('measurement.weight')" :value="oriParams.weight" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                    </view>
                    <view class="select_group">
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.bra_size=key}" :options="bra_size_list" :label="$t('measurement.bra_size')" :value="oriParams.bra_size" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.bust=key}" :options="bust_list" :label="$t('measurement.bust_size')" :value="oriParams.bust" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                    </view>
                    <view class="select_group">
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.hips=key}" :options="hips_list" :label="$t('measurement.hips')" :value="oriParams.hips" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.waist=key}" :options="waist_list" :label="$t('measurement.waist')" :value="oriParams.waist" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                    </view>
                    <view class="select_group">
                        <size-select-popup @changeChecked="({key, name})=>{oriParams.preference=key}"  :options="perfer_list" :label="$t('measurement.preference')" :value="oriParams.preference" :screenHeight="screenHeight" refName="bottom_select_popup"></size-select-popup>
                    </view>
                </view>
                <view class="measurement_help">
                    <view class="help_switch" @tap="handleSwitch">{{ $t('measurement.measurement_help') }}</view>
                    <view class="help_content_box" v-show="showHelpContent">
                        <view class="help_item flex">
                            <image
                                class="help_img"
                                src="@/static/images/measurement_size_guide.png"
                                mode="widthFix"
                            />
                        </view>
                        <view class="help_item">
                            <view class="help_tittle">
                                <text class="help_index">1</text>
                                <text class="help_text">{{ $t('measurement.bust') }}</text>
                            </view>
                            <text class="help_content">
                                {{ $t('measurement.bust_content') }}
                            </text>
                        </view>
                        <view class="help_item">
                            <view class="help_tittle">
                                <text class="help_index">2</text>
                                <text class="help_text">{{ $t('measurement.waist') }}</text>
                            </view>
                            <text class="help_content">
                                {{ $t('measurement.waist_content') }}
                            </text>
                        </view>
                        <view class="help_item">
                            <view class="help_tittle">
                                <text class="help_index">3</text>
                                <text class="help_text">{{ $t('measurement.hips') }}</text>
                            </view>
                            <text class="help_content">
                                {{ $t('measurement.hips_content') }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="submit_btn_wrapper">
            <view @tap="handleSubmit" class="btn submit_btn flex align-items-center justify-content-center">{{ $t('measurement.submit') }}</view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                screenHeight: 0,
                height_list: [],
                bra_size_list: [],
                bust_list: [],
                hips_list: [],
                perfer_list: [],
                waist_list: [],
                weight_list: [],  
                showHelpContent: false,
                oriParams: {
                    bra_size: '',
                    bust: '',
                    height: '',
                    hips: '',
                    preference: '',
                    waist: '',
                    weight: ''
                }
            }
        },
        created() {
            const that = this
            
            uni.getSystemInfo({
                success: (res)=> {
                    that.screenHeight = res.screenHeight
                }
            })
        },
        onLoad(){
            this.initMeasurement()
        },
        methods: {
            handleSwitch(){
                this.showHelpContent = !this.showHelpContent
            },
            closePopup(){
                this.$refs['bottom_select_popup'].close()
            },
            obj2array(obj){
                const arr = []
                for (const key in obj) {
                    arr.push({
                        name: obj[key],
                        key
                    })
                }
                return arr
            },
            
            initMeasurement(){
                const that = this
                that.$apis.initMeasurement().then(res=>{
                    uni.hideLoading()
                    if(res.code == '200'){
                        const {
                            height_list, 
                            bra_size_list, 
                            bust_list, 
                            hips_list, 
                            perfer_list, 
                            waist_list, 
                            weight_list, 
                            customer_measurement_info
                        } = res.data

                        const {
                            bra_size, 
                            bust, 
                            height, 
                            hips, 
                            preference, 
                            waist, 
                            weight
                        } = customer_measurement_info

                        that.oriParams = {
                            bra_size, 
                            bust, 
                            height, 
                            hips, 
                            preference, 
                            waist, 
                            weight
                        }



                        that.height_list = that.obj2array(height_list)
                        that.bra_size_list = that.obj2array(bra_size_list)
                        that.perfer_list = that.obj2array(perfer_list)
                        that.bust_list = that.obj2array(bust_list)
                        that.hips_list = that.obj2array(hips_list)
                        that.waist_list = that.obj2array(waist_list)
                        that.weight_list = that.obj2array(weight_list)
                    }
                }).catch(err=>{
                    uni.hideLoading()
                    uni.showToast({
                        title: 'error',
                        icon: 'none',
                    })
                })
            },
            handleSubmit(){
                const that = this
                const oriParams =  that.oriParams
                const params = {editForm:JSON.stringify(oriParams)}
                console.log(params);
                that.$apis.saveMeasurement(params).then(res=>{
                    uni.hideLoading()
                    if(res.code == '200'){
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                }).catch(err=>{
                    uni.hideLoading()
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .measurement_wrapper{
        padding-top: 88rpx;
        position: relative;
        .submit_btn_wrapper{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #fff;
            height: 118rpx;
            padding: 0 12px;
            .submit_btn{
                margin-top: 15rpx;
                width: 100%;
                height: calc(100% - 30rpx);
                background: #222;
                color: #fff;
                font-size: 32rpx;
                font-weight: 700;
                text-align: center;
                
            }
        }
    }
    .measurement_content{
        margin-top: 30rpx;
        padding-bottom: 118rpx;
    }
   .measurement_des{
        margin-bottom: 24rpx;
        padding: 24rpx;
        background: #fff;
        color: #666;
    .tittle{
        margin-bottom: 6rpx;
    }
    .tips{
        color: #a86104;
        margin-bottom: 6rpx;
    }
   }
   .measurement_bottom{
        padding: 12px;
        .measurement_selects{
            width: 100%;
        }
        .select_group{
            width: 100%;
            display: flex;
            margin-top: 20rpx;            
        }
   }
   .measurement_help{
        margin-top: 40rpx;
        .help_switch{
            color: #999;
            display: inline-block;
            text-decoration: underline;
            font-size: 24rpx;
        }
        .help_content_box{
            margin-top: 16rpx;
        }
        .help_item{
            margin-top: 18rpx;
            .help_tittle{
                font-weight: 700;
                color: #222;
                line-height: 60rpx;
                .help_index{
                    margin-right: 16rpx;
                    text-align: center;
                    background: #222;
                    border-radius: 100%;
                    width: 60rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    color: #fff;
                    display: inline-block;
                    vertical-align: middle;
                }
                .help_text{
                    
                }
                
            }
            .help_content{
                font-size: 24rpx;  
            }
        }
   }
   .help_img{
        margin: 0 auto;
        width: 575rpx;
   }
   
</style>