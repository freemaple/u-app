<template>
    <!-- logs.wxml -->
    <view class="container log-list">
        <block v-for="(log, index) in logs" :key="index">
            <text class="log-item">{{ index + 1 }}. {{ log }}</text>
        </block>
    </view>
</template>

<script>
//logs.js
const util = require('../../utils/util.js');

export default {
    data() {
        return {
            logs: [],
            log: ''
        };
    },
    onLoad: function () {
        this.setData({
            logs: (uni.getStorageSync('logs') || []).map((log) => {
                return util.formatTime(new Date(log));
            })
        });
    },
    methods: {}
};
</script>
<style>
.log-list {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
}
.log-item {
    margin: 10rpx;
}
</style>
