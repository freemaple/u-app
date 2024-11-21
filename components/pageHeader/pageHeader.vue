<template>
	<view class="page-header-box page-max-width flex align-items-center" :class="judgeClass()">
		<image v-if="showIcon&&color=='black'" mode="widthFix" class="goback" @click="goback()" :src="iconUrl || require('@/static/images/p_detail_left_arrow@2x.png')" />
		<image v-if="showIcon&&color=='white'" mode="widthFix" class="goback" @click="goback()" :src="iconUrl || require('@/static/images/p_detail_left_arrow_white@2x.png')" />
		
		<view class="title flex-1" :style="judgeStyle()" :class="isTitleUppercase?'uppercase':''">
			<slot name="title">{{ title }}</slot>
			<slot name="extend"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"pageHeader",
		props: {
			color:{
				type: String,
				default: 'black', // white 白色 黑色
			},
			iconUrl: {
				type: String,
				default:''
			},
			isTitleUppercase: {
				type: Boolean,
				default: false
			},
			showShadow:{
				type: Boolean,
				default: true
			},
			styleType: {
				type: Number,
				default: 1, //
			},
			title: {
				type: String,
				default: ''
			},
			showIcon:{
				type:Boolean,
				default: true
			},
			backSelf: {
				type: Object,
				default: ()=>{
					return {}
				}
			}, // 自定义返回逻辑需要传的对象 【backSelf.type】跳转方式 共5种 4种路由{navigateTo、redirectTo、reLaunch、switchTab}  1种抛出方法【backSelf.url】 路径
			showImg: {
				type: Boolean,
				default: false
			},
			imgSrc: {
				type: String,
				default: ''
			},
			useFlex: {
				type: Boolean,
				default: false
			},
			// 埋点数据
			buriedPointData: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		methods: {
			judgeStyle() {
				let style="";
				if(this.title.length>24) {
					style="font-size:30rpx;";
				}
				if(this.color=="white") {
					style=style+'color:#fff;'
				}
				return style;
			},
			judgeClass() {
				let className = '';
				if(this.styleType == 2&&this.title.length<=24) {
					className=className+' type2'
				}
				if(this.showShadow) {
					className=className+' has-shadow'
				}
				return className
			},
			goback() {
				if(JSON.stringify(this.buriedPointData) != '{}') {
					this.$maEvent.custom_event(this.buriedPointData);
				}
				if(this.backSelf.type) {
					if(this.backSelf.type == 'emit') {
						this.$emit('handleClick')
					} else {
						uni[this.backSelf.type]({
							url: this.backSelf.url
						})
					}
				} else {
					this.$public.handleGoBack()
				}
			}
		}
	}
</script>

<style scoped>
.page-header-box {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	background: #fff;
	z-index: 2;
	height: 96rpx;
	padding: 0 32rpx;
}
.page-header-box.has-shadow {
	box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);
}
.page-header-box .goback {
	width: 48rpx;
}
.page-header-box .title {
	font-family: "Montserrat-SemiBold";
	font-size: 34.62rpx;
	color: #000;
	margin-left: 24rpx;
	font-weight: 600;
	position: relative;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	align-items: center;
	justify-content: center;
}
.page-header-box .title.uppercase {
	text-transform: uppercase;
}
.page-header-box.type2 .goback{
	position: absolute;
	z-index: 1;
}
.page-header-box.type2 .title {
	text-align: center;
	margin-left: 0;
	align-items: center;
	justify-content: center;
}
</style>