<template>
    <view>
        <view :class="'global-top-btn flex align-items-center justify-content-center '+ (!showBtn ? 'global-btn-none' : '')" @click="backTopBuriedPoint();backTop();">
            <image class="img"
                src="@/static/images/icon/back_top_icon@2x.png"
            />
        </view>
    </view>
</template>

<script>
//获取应用实例
// const app = getApp(); // 语言
export default {
    data() {
        return {
            
        }
    },
    props: {
        showBtn: {
            type: Boolean,
            default: false,
        },
        backTop: {
            type: Function,
            default: ()=>{
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 100
                })
            },
        }
    },
    methods: {
		backTopBuriedPoint() {
			this.$maEvent.custom_event({
				event_category: 'to_top',
				event_action: 'to_top_button',
				event_name: 'to_top_button',
				module: 'to_top',
				event_data: {}
			});
		}
    }
}
</script>