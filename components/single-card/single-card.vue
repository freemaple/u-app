<template>
    <view @click="handleClick(itemData)" :class="'single-card flex align-items-center justify-content-between'">
        <view class="card-left flex align-items-center">
            <i :class="'iconfont ' + itemData.type"></i>
            <view class="text">
                {{ itemData.text }}
            </view>
        </view>
        <view class="card-right flex align-items-center">
            <view v-if="itemData.checked" class="checked">
                {{ itemData.checked }}
            </view>
            <i class="iconfont"></i>
        </view>
    </view>


</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        itemData: {
            type: Object,
            default: {},
        },
    },
    methods: {
        handleClick(item) {
            switch (item.type) {
                case "lang":
                    uni.navigateTo({
                        url: item.url,
                        success: (res) => {
                            res.eventChannel.emit("changeLang", {
                                checkedVal: item.checked,
                            });
                        },
                    });
                    break;
                case "currency":
                    uni.navigateTo({
                        url: item.url,
                        success: (res) => {
                            res.eventChannel.emit("changeCurrency", {
                                checkedVal: item.checked,
                            });
                        },
                    });
                    break;
                default:
                    uni.navigateTo({
                        url: item.url,
                    });
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.single-card {
    height: 96rpx;

    .card-left {
        height: 100%;

        i {
            width: 48rpx;
            height: 48rpx;
            font-size: 48rpx;
            line-height: 1;
            color: #333;

            &::before {
                content: "\E69E";
            }
        }

        .lang::before {
            content: "\E69E";
        }

        .currency::before {
            content: '\E6A4';
        }

        .pwd::before {
            content: '\E69F';
        }
		
		.delete_account::before {
		    content: '\e6b7';
		}

        .policy::before {
            content: '\E69B';
        }

        .privacy::before {
            content: '\E69A';
        }

        .faq::before {
            content: '\E6A0';
        }

        .text {
            font-size: 28rpx;
            padding-left: 24rpx;
        }

    }

    .card-right {
        color: #999;

        .checked {
            font-size: 28rpx;
            margin-right: 8rpx;
        }

        i {
            font-size: 48rpx;

            &::before {
                content: "\E6A5";
            }
        }
    }
}
</style>