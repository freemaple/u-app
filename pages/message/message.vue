<template>
	<view class="my-address-box dui-padding-top-header">
		<pageHeader :title="$t('message.header')"></pageHeader>
		<view class="message-list-box">
			<view class="message-list-item" v-for="(item,index) in messageList">
				<view class="message-item-title" v-show="item.message_title">
					{{item.message_title}}
					<view :class="['message-item-title-line', item.is_read == 0 ? '' : 'hide']"></view>
				</view>
				<view :class="['message-item-content', !item.isShowMore ? 'show' : '', 'message-item-content'+index, setSheeMoreBtnShow(index,item)]">
					<view class="content-txt" v-html="item.message_content_app">
						
					</view>
				</view>
				<view class="flex align-items-center justify-content-between">
					<view class="message-item-time">
						{{item.created_at}}
					</view>
					<view v-show="item.isShowMore" class="showMore" @click="showMore(item)">
						{{$t('message.see_more')}}
					</view>
				</view>
			</view>
			<list-loading v-show="isHttp"></list-loading>
			<view class="empty-box" v-if="messageList.length == 0 && !isHttp">
				<image src="@/static/images/message-empty.png" mode="widthFix"/>
				<view class="empty-txt">
					{{$t('message.empty')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	import ListLoading from '@/components/list-loading/list-loading.vue';
import { setTimeout } from "timers";
	export default {
		components: {
			pageHeader, ListLoading
		},
		data() {
			return {
				messageList: [],
				page: 0,
				isOver: false,
				isHttp: false
			};
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			this.$maEvent.visit_event({
				event_category: 'message',
				event_action: 'message_visit',
				event_name: 'message_visit'
			})
		},
		onReachBottom() {
			if (!this.isOver && !this.isHttp) {
				this.getList()
			}
		},
		methods: {
			showMore(item) {
				item.isShowMore = false;
			},
			getList() {
				this.setData({
					page: ++this.page,
					isHttp: true,
				}); 
				const that = this;
				that.$apis.messageList({p: that.page}).then(res=> {
					const list = res.data.lists || {coll: [], count: 0};
					let html = '';
					if(res.data.page_num == that.page) {
						that.setData({
							isOver: true
						})
					}
					that.setData({
						isHttp: false
					})
					if(list.coll.length != 0) {
						let notRead = [];
						list.coll.map(function(item, index){
							item.isShowMore = true;
							if(item.is_read == 0) {
								notRead.push(item.id);
							}
						});
						that.setData({
							messageList: that.messageList.concat(list.coll)
						})
						if(notRead.length) {
							that.setIsRead(notRead);
						}
					}
				});
			},
			// 设置已读
			setIsRead(list) {
				this.$apis.messageSetRead({ids: list}).then(res=> {
					
				});
			},
			// 设置当前元素是否要显示隐藏查看更多按钮
			setSheeMoreBtnShow(ind,item) {
				setTimeout(()=> {
					let height = 0; // 元素当前高度
					let allHeight = 0; // 元素原本高度(未隐藏的)
					// 获取未隐藏元素高度
					const query = uni.createSelectorQuery().in(this);
					query.select('.message-item-content'+ind+' .content-txt').fields({ 
					  size: true, // 获取元素尺寸信息
					}).exec((res) => {
						if(res.length) {
							allHeight = res[0].height;
						}
					});
					// 获取隐藏后元素高度
					const query2 = uni.createSelectorQuery().in(this);
					query2.select('.message-item-content'+ind).fields({ 
					  size: true, // 获取元素尺寸信息
					}).exec((res) => {
						if(res.length) {
							height = res[0].height;
						}
					});
					if(height != allHeight){
						item.isShowMore = true;
					}else{
						item.isShowMore = false;
					}
				},300)
			}
		}
	};
</script>
<style scoped>
	.message-list-box {
		padding: 16rpx 32rpx;
	}

	.message-list-item {
		margin-bottom: 16rpx;
		border-bottom: 1px solid #eee;
	}

	.message-item-title {
		font-size: 32rpx;
		font-weight: bold;
		padding: 24rpx 0;
		color: #000;
		position: relative;
	}

	.message-item-title-line {
		position: absolute;
		left: -20rpx;
		top: 50%;
		transform: translate(0,-50%);
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background: #ff0000;
	}

	.message-item-time {
		padding: 24rpx 0;
		font-size: 24rpx;
	}

	.message-item-content {
		font-size: 32rpx;
		overflow: hidden;
		line-height: 1.5;
		max-height: 100rpx;
		transition: .3s max-height;
	}

	.showMore {
		font-size: 28rpx;
		color: #0071E3;
		line-height: 48rpx;
		/* display: none; */
	}

	.message-item-content.show {
		max-height: none;
	}

	.message-item-title-line.hide {
		display: none;
	}
	.empty-box {
		text-align: center;
		font-weight: bold;
	}
	.empty-box image {
		width: 80%;
		margin: 200rpx auto 50rpx;
	}
</style>
