<template>
  <view class="box">
    <view class="uni-list">
      <checkbox-group @change="checkboxChange">
        <label v-for="item in dataLists" :key="item.value" :class="
          'uni-list-cell uni-list-cell-pd flex align-items-center justify-content-between ' +
          (item.checked ? 'isChecked' : '')
        ">
          <view>{{ item.name }}</view>
          <view class="right-box">
            <span v-if="item.singnature" class="iconfont">{{ item.singnature }}</span>
            <checkbox :value="item.value" :checked="item.checked" />
          </view>
        </label>
      </checkbox-group>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    dataLists: {
      type: Array,
      default() {
        return [
          {
            // name: "EUR",
            // value: "EUR",
            // checked: false,
            // singnature: "€",
            // valueList: [],
          },
        ];
      },
    },
    multiple: {
      type: Boolean,
      default: false, //单选/多选
    },
  },
  methods: {
    checkboxChange(e) {
      const that = this;
      const { value } = e.detail;
      const { dataLists } = that;
      that.multiple ? (that.multipleFunc(value)) : (that.single(value, dataLists))
      that.$emit('checkBoxChange', that.valueList)
    },

    multipleFunc(value) {
      this.dataLists.forEach((item) => {
        value.indexOf(item.value) > -1 ? (item.checked = true) : (item.checked = false)
      });
      this.valueList = value
    },

    single(value, lists) {
      if (value.length > 1) {
        lists.forEach(item => {
          if (item.checked) {
            item.checked = false;
          } else if (value.indexOf(item.value) > -1) {
            item.checked = true;
          }
        });
      } else if (value.length < 1) {
        //单选时取消唯一一个勾选不做特殊处理，按照M端的逻辑直接跳转出去，根据数据判断。
        lists.forEach(item => {
          item.checked = false;
        });
      } else {
        lists.forEach(item => {
          value.indexOf(item.value) > -1 ? (item.checked = true) : (item.checked = false)
        });
      }
      //获取已选中的值
      let flag = true;
      lists.forEach(item => {
        if (item.checked) {
          flag = false;
          this.valueList = [item.value]
        }
      });
      flag ? (this.valueList = []) : ''
    },
  },

};
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  box-sizing: border-box;
  padding: 16rpx 30rpx 0;
  background-color: #fff;


  .uni-list-cell {
    height: 96rpx;
    font-size: 28rpx;

    /deep/.uni-checkbox-input {
      width: 34rpx;
      height: 34rpx;
      color: #fff !important;
      border-color: #d1d1d1;

      &::before {
        font-size: 48rpx;
      }
    }
  }

  .isChecked {
    color: #000;
	font-weight: bold;

    /deep/.uni-checkbox-input {
      background-color: #000 !important;
    }
  }

  .right-box {
    >span {
      font-family: SF UI Text, Roboto, Helvetica, Arial, sans-serif;
      font-size: 24rpx;
      margin-right: 32rpx;
    }
  }
}
</style>