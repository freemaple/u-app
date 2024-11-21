<template>
    <view>
        <template name="no-goods" v-if="list.length == 0">
            <view class="title-box">
                <image class="box-none" src="/static/images/none/cart_empty.png"></image>
                {{ language.add_same_product_to_cart }}
            </view>
        </template>

        <template name="cart-goods-list" v-if="list.length > 0">>
            <view class="goodsList">
                <view class="a-gooods" v-for="(item, index) in list" :key="index">
                    <view
                        :data-itemid="item.item_id"
                        :class="'a-goods-conts ' + (item.active ? 'active' : '')"
                        @tap="selectTap"
                        @touchstart="touchS"
                        @touchmove="touchM"
                        @touchend="touchE"
                        :data-index="index"
                        :style="item.left"
                    >
                        <view class="goods-info">
                            <view class="img-box">
                                <image :src="item.pic" class="img" />
                            </view>
                            <view class="text-box">
                                <view class="goods-title">{{ item.name }}</view>
                                <view class="goods-label">{{ item.label }}</view>
                                <view class="goods-price">{{ currencySymbol }} {{ item.price }}</view>
                                <view class="buy-num">
                                    <view
                                        :class="'jian-btn ' + (item.number == 1 ? 'disabled' : '')"
                                        @tap.stop.prevent="jianBtnTap"
                                        :data-index="index"
                                        :data-itemid="item.item_id"
                                    >
                                        -
                                    </view>
                                    <input type="number" :value="item.number" disabled />
                                    <view :class="'jia-btn ' + (item.number == 50 ? 'disabled' : '')" @tap.stop.prevent="jiaBtnTap" :data-index="index" :data-itemid="item.item_id">
                                        +
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="delete-btn" :data-index="index" @tap.stop.prevent="delItem" :data-itemid="item.item_id">
                            {{ language.remove }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="jiesuan-box">
                <view class="left-price">
                    <view :class="'all-selected  ' + (allSelect ? 'active' : '')" @tap="bindAllSelect">{{ language.select_all }}</view>
                    <view class="total" v-if="!noSelect">{{ language.grand_total }}:{{'&nbsp;'}}{{ currencySymbol }}{{ totalPrice }}</view>
                </view>
                <view :class="'to-pay-btn ' + (noSelect ? 'no-select' : '')" v-if="saveHidden" @tap="toPayOrder">{{ language.place_order }}</view>
                <view :class="'to-pay-btn ' + (noSelect ? 'no-select' : '')" v-if="!saveHidden" @tap="deleteSelected">{{ language.remove }}</view>
            </view>
        </template>
    </view>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            currencySymbol: '',

            language: {
                remove: '',
                select_all: '',
                grand_total: '',
                place_order: ''
            },

            allSelect: false,
            noSelect: '',
            totalPrice: '',
            saveHidden: ''
        };
    },
    onLoad: function () {
        uni.showLoading({
            title: '加载中...',
            mask: true
        });
    },
    methods: {
        selectTap() {
            console.log('占位：函数 selectTap 未声明');
        },

        touchS() {
            console.log('占位：函数 touchS 未声明');
        },

        touchM() {
            console.log('占位：函数 touchM 未声明');
        },

        touchE() {
            console.log('占位：函数 touchE 未声明');
        },

        jianBtnTap() {
            console.log('占位：函数 jianBtnTap 未声明');
        },

        jiaBtnTap() {
            console.log('占位：函数 jiaBtnTap 未声明');
        },

        delItem() {
            console.log('占位：函数 delItem 未声明');
        },

        bindAllSelect() {
            console.log('占位：函数 bindAllSelect 未声明');
        },

        toPayOrder() {
            console.log('占位：函数 toPayOrder 未声明');
        },

        deleteSelected() {
            console.log('占位：函数 deleteSelected 未声明');
        }
    }
};
</script>
<style>
@import '@/static/template-cart.css';
</style>
