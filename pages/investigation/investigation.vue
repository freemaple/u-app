<template>
    <view>
        <nav-back :title="$t('investigation.my_profile')"></nav-back>
        <view class="investigation-wrapper">
			<block v-for="item in initData">
				<view v-if="item.key !='women_collection' && item.key !='man_collection'" :key="item.key" class="question-box">
					<view class="question">{{ item.title }}</view>
					<view class="check-items">
						<view @tap="checkItem(item_child,item)" :class="'single-item ' + (item_child.checked ? 'single-item-checked' : '') " v-for="(item_child, index_child) in item.value" :key="index_child">{{ item_child.value }}</view>
						<!-- <view class="flex align-items-center" v-if="item.key =='creator_write'&&showEmail">
							<text class="email-label">{{$t('investigation.email_label')}}:</text><input placeholder-class="email-placeholder" type="text" v-model="email" :placeholder="$t('investigation.email')" />
							<view v-if="showEmailError" class="email-error">{{$t('investigation.email')}}</view>
						</view> -->
					</view>
				</view>
				<block v-else>
					<view v-if="(questionShowType =='man' && item.key == 'man_collection' )|| (questionShowType=='women' && item.key == 'women_collection')" :key="item.key" class="question-box">
						<view class="question">{{ item.title }}</view>
						<view class="check-items">
							<view @tap="checkItem(item_child,item)" :class="'single-item ' + (item_child.checked ? 'single-item-checked' : '') " v-for="(item_child, index_child) in item.value" :key="index_child">{{ item_child.value }}</view>
						</view>
					</view>
				</block>
			</block>
        </view>
        <view class="btn-box page-max-width">
            <view class="dui-primary-btn" @tap="saveInvest">{{$t('investigation.save')}}<text class="get-points" v-if="reward_points">+{{point}} {{$t('investigation.point')}}</text></view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            initData: [],
			questionShowType:'',// 如果空，不展示；等于 man 展示男装问题 ；等于women 展示女装问题
			showEmail:false, // 是否展示邮箱
			email:'',
			showEmailError: false,
			reward_points:false,
			point:'',
        }
    },
	watch: {
		email:{
			handler(newValue,oldValue) {
				if(newValue) {
					this.showEmailError = false
				} else {
					this.showEmailError = true
				}
			}
		}
	},
    onLoad: function() {
        this.initInvestigation()
    },
    methods: {
        checkItem(item_child,item_parent) {
			if(item_parent.radio) {
				// 单选
				item_parent.value.forEach(e=>{
					e.checked = (e.key == item_child.key)
				})
			} else {
				// 多选
				item_child.checked = !item_child.checked       
			}
			// 男女装分类交互
			if(item_parent.key == "favorite_categories") {
				this.questionShowType = item_child.key
				if(item_child.key == 'man') {
					this.initData.forEach(item=>{
						if(item.key == 'women_collection') {
							item.value.forEach(item_child_child=>{
								item_child_child.checked = false
							})
						}
					})
				}
				if(item_child.key == "women") {
					this.initData.forEach(item=>{
						if(item.key == 'man_collection') {
							item.value.forEach(item_child_child=>{
								item_child_child.checked = false
							})
						}
					})
				}
			}
			// 是否成功创作者
			if(item_parent.key == "creator_write") {
				this.email = '';
				this.showEmail = item_child.key =='yes'?true:false;
			}
        },

        saveInvest() {
			// if(this.showEmail && !this.email) {
			// 	this.showEmailError = true;
			// 	return false
			// }
            const that = this
            // 获取已选中的数据
            const value = {
				// email:that.email
			}
            that.initData.forEach((item)=>{
                const arr = []                
                item.value.forEach(item_child => {
                    if(item_child.checked) {
                        arr.push(item_child.key)
                    }
                })
                const obj = {}
                if(arr.length) {
                    obj[item.key] = arr
                }
                Object.assign(value, obj)
            })
            const param = {
                editForm: JSON.stringify({
                        value
                    })
            }
			const hasSelection = Object.keys(value).length > 0;
			if (!hasSelection) {
				uni.showToast({
					title: 'Please select at least one option!',
					icon: 'none'
				});
				return; 
			}
            that.$apis.investigationSave(param).then(res=>{
                uni.hideLoading()
				if (res.code == 200) {
					this.initInvestigation();
					uni.showToast({
						title: res.data.content,
					});
				}
            }).catch(err=>{
                uni.hideLoading()
            })
        },

        initInvestigation() {
            const that = this
            this.$apis.initInvestigation({}).then((res)=>{
                uni.hideLoading()
				that.point = res.data.get_points;
				that.reward_points = res.data.reward_points;
				const investigations = res.data.investigations || []
				const customer_investigations = res.data.customer_investigations || {}
				investigations.forEach((item, index) => {
					item.value.forEach((item_child, index_child) =>{
						item_child.checked = false
					})
					customer_investigations[item.key] && customer_investigations[item.key].forEach(item_child =>{
						item.value.forEach(e =>{
							if(e.key == item_child) {
								e.checked = true
							}
						})
					})
				})
				that.initData = investigations;
				that.questionShowType = customer_investigations['favorite_categories'].length?customer_investigations['favorite_categories'][0]:'';
				that.showEmail = customer_investigations['creator_write'] && customer_investigations['creator_write'][0]=='yes'?true:false;
				that.email = customer_investigations['email'];
            }).catch((err)=>{
                uni.hideLoading()
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
.investigation-wrapper{
    padding: 16rpx 32rpx;
	padding-bottom: 156rpx;
}
.question-box{
    
    margin-top: 20rpx;
}
.question{
    font-size: 34rpx;
}
.check-items{
    display: flex;
    display: -webkit-flex;
    width: 100%;
    margin-top: 20rpx;
    flex-wrap: wrap;
    .single-item{
        margin-right: 20rpx;
        padding: 4rpx 12rpx;
        font-size: 16rpx;
        background: #f7f7f7;
		border: 1px solid #bcbcbc;
        display: inline-block;
        border-radius: 3px;
        margin-bottom: 10px;
        font-size: 28rpx;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
		color: #333;
    }
    .single-item-checked{
        background-color: #e3e3e3;
    }
    
}
.btn-box{
        width: 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        position: fixed;
        bottom: 0;
        height: 116rpx;
        padding-bottom: 20rpx;
		background: #fff;
		padding-left: 24rpx;
		padding-right: 24rpx;
        .btn{
        width: calc( 100% - 32rpx);
        text-align: center;
        line-height: 96rpx;
        background-color: #f85184;
        height: 96rpx;
        color: #fff;
        font-size: 28rpx;
        // @include onepxBorder(rgba(0,0,0,.08));
        box-shadow: 0 1PX 2.5rpx rgba(0,0,0,.08)
    }

    }
.email-label {
	margin-right: 10rpx;
}
::v-deep .investigation-wrapper {
	input {
		border: 1px solid #222;
		padding: 0rpx 20rpx;
		height: 48rpx;
	}
	.email-placeholder {
		font-size: 24rpx;
	}
	.email-error {
		color: #e30057;
		font-size: 24rpx;
	}
}
.get-points {
	color: #fa6338;
	margin-left: 10rpx;
	font-weight: normal;
	font-size: 26rpx;
}
</style>