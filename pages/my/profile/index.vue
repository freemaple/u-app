<template>
	<view class="my-profile-box dui-padding-top-header">
		<pageHeader :title="$t('my.my_profile.title')"></pageHeader>
		<view class="container">
			<uni-forms label-position="top" ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item :label="$t('my.my_profile.form.first_name')+' *'" name="firstname">
					<input type="text" v-model="formData.firstname" :placeholder="$t('my.my_profile.form.first_name_placeholder')" />
				</uni-forms-item>
				<uni-forms-item :label="$t('my.my_profile.form.last_name')+' *'" name="lastname">
					<input type="text" v-model="formData.lastname" :placeholder="$t('my.my_profile.form.last_name_placeholder')" />
				</uni-forms-item>
				<uni-forms-item :label="$t('my.my_profile.form.sex')" name="sex">
					<radio-group class="uni-flex uni-row radio-group">
						<radio v-for="(item,index) in sexArr" :key="index" @click="formData.sex = item.value" :value="String(item.value)" :checked="item.value == formData.sex" color="#000" class="radio">{{item.label}}</radio>
					</radio-group>
				</uni-forms-item>
				<uni-forms-item :label="$t('my.my_profile.form.birthday')" name="birth_date">
					<view class="birthday-box">
						<view class="birthday-item" @click="$refs.day.open('bottom')">
							<view>{{formData.day}}</view>
							<i class="iconfont icon-goto"></i>
						</view>
						<view class="birthday-item" @click="$refs.month.open('bottom')">
							<view>{{formData.month}}</view>
							<i class="iconfont icon-goto"></i>
						</view>
						<view class="birthday-item" @click="$refs.year.open('bottom')">
							<view>{{formData.year}}</view>
							<i class="iconfont icon-goto"></i>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item :label="$t('my.my_profile.form.phone')" name="phone">
					<view class="int-tel-input-box">
						<int-tel-input ref="intTel" :showflags="false" :showLoding="true" :initialCountry="formData.phone_country_code" refName="popupIntTel" @change="handleChangeIntTel"></int-tel-input>
						<input type="text" v-model="formData.phone" :placeholder="$t('my.my_profile.form.phone_placeholder')" />
					</view>
				</uni-forms-item>
			</uni-forms>
			<view class="save" @click="submit()">{{$t('my.my_profile.save_btn')}}</view>
			<text class="get-points" v-if="!formData.firstname&&Number(points)">+{{points}} {{$t('my.points')}}</text>
		</view>
		
		<singleSelect ref="day" refName="popupDay" :textCenter="true" :isShowTitle="false" :currentIndex="null" :options="dayOptions"
			@change="handleChangeDay">
		</singleSelect>
		<singleSelect ref="month" refName="popupMonth" :textCenter="true" :isShowTitle="false" :currentIndex="null" :options="monthOptions"
			@change="handleChangeMonth">
		</singleSelect>
		<singleSelect ref="year" refName="popupYear" :textCenter="true" :isShowTitle="false" :currentIndex="null" :options="yearOptions"
			@change="handleChangeYear">
		</singleSelect>
	</view>
</template>

<script>
	import pageHeader from "@/components/pageHeader/pageHeader.vue"
	export default {
		components: {
			pageHeader,
		},
		data() {
			return {
				sexArr:[
					{
						value:1,
						label: this.$t('my.my_profile.sex_arr.female')
					},
					{
						value:2,
						label: this.$t('my.my_profile.sex_arr.male')
					},
					{
						value:3,
						label: this.$t('my.my_profile.sex_arr.unspecified')
					}
				],
				points:'',
				dayOptions:[],
				monthOptions:[],
				yearOptions:[],
				
				// 表单数据
				formData: {
					firstname: "",
					lastname: "",
					sex:3,
					birth_date:'',
					day:'',
					month:'',
					year:'',
					phone:'',
					phone_area_code:'',
					phone_country_code:'',
				},
				rules: {
					firstname: {
						rules: [{
							required: true,
							errorMessage: this.$t("my.my_profile.form.first_name_placeholder")
						}]
					},
					lastname: {
						rules: [{
							required: true,
							errorMessage: this.$t("my.my_profile.form.last_name_placeholder")
						}]
					},
					/*phone: {
						rules: [{
							required: true,
							errorMessage: this.$t("my.my_profile.form.phone_placeholder")
						}]
					}*/

				}
			};
		},
		onLoad(e) {
			this.getDateOption();
			this.getInfo();
		},
		methods: {
			getInfo() {
				this.$apis.getEditAccountInfo().then(res=>{
					this.formData = {...this.formData,...res.data}
					if(!this.formData.sex) {
						this.formData.sex = 3
					}
					if(!this.formData.phone_area_code) {
						this.formData.phone_area_code = '1'
					}
					if(!this.formData.phone_country_code) {
						this.formData.phone_country_code = 'us'
					}
					this.points = res.data.full_profile_points;
				})
			},
			handleChangeDay(index,data) {
				this.formData.day = data.label;
                this.checkDate();
				this.$refs.day.close();
			},
			handleChangeMonth(index,data) {
				this.formData.month = data.label;
                this.checkDate();
				this.$refs.month.close();
			},
			handleChangeYear(index,data) {
				this.formData.year = data.label;
                this.checkDate();
				this.$refs.year.close();
			},
            // 校验年月日格式是否正常
            checkDate() {                
				const year = this.formData.year;
				const month = this.formData.month;
				const day = this.formData.day;
				const isLeapYear = (year % 4 == 0 && year % 100!= 0 || year % 400 == 0) ? true : false; // 是否是闰年
				const hava31Days = ['01', '03', '05', '07', '08', '10', '12']; // 31天的月份
				// 当前月份应该只有30天
				if (hava31Days.indexOf(month) == -1) {
					this.setLabelShowType(this.dayOptions, 31, false);
					if(parseInt(day) > 30) {
						this.formData.day = 30;
					}
				}else{
					this.setLabelShowType(this.dayOptions, 31, true);
				}
				// 2月单独判断
				if (month == '02') {
					if (isLeapYear) {
						this.setLabelShowType(this.dayOptions, 29, true);
						if(parseInt(day) > 29) {
							this.formData.day = 29;
						}
					} else {
						this.setLabelShowType(this.dayOptions, 29, false);
						if(parseInt(day) > 28) {
							this.formData.day = 28;
						}
					}
					this.setLabelShowType(this.dayOptions, 30, false);
				}else{
					this.setLabelShowType(this.dayOptions, 30, true);
				}
            },
			// 设置标签的值是否显示
			setLabelShowType(arr, val, type) {
				arr.map(e => {
					if(e.label == val) {
						e.needShow = type;
					}
				})
			},
			handleChangeIntTel(index,data) {
				this.formData.phone_area_code = data.code;
				this.formData.phone_country_code = data.c_code;
				this.$refs.intTel.close();
			},
			// 触发提交表单
			submit() {
				this.$refs.form.validate().then(res => {
					uni.showLoading()
					var birth_date='';
					if(this.formData.year && this.formData.month && this.formData.day) {
						birth_date = this.formData.year+'-'+this.formData.month+'-'+this.formData.day
					}
					this.$apis.updateAccountInfo({...this.formData,birth_date:birth_date}).then(res=>{
						uni.hideLoading()
						uni.showToast({title:'Success!'})
						this.getInfo()
					}).catch(e=>{uni.hideLoading()})
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			getDateOption() {
				this.dayOptions = [...new Array(31).keys()].map(item=> {return {label:item+1<10?'0'+(item+1):item+1}})
				this.monthOptions = [...new Array(12).keys()].map(item=> {return {label:item+1<10?'0'+(item+1):item+1}})
				var y = new Date().getFullYear();
				this.yearOptions = [...new Array(100).keys()].map(item=> {return {label:y-item}})
			}
		}
	};
</script>
<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.my-profile-box .container {
		padding: 24rpx;
	}
	::v-deep .uni-forms {
		.uni-forms-item__label {
			font-size: 28rpx;
		}
		.uni-forms-item__error {
			font-size: 24rpx;
		}
		.uni-forms-item__content {
			font-size: 28rpx;
		}
		.uni-forms-item {
			border-bottom: 1px solid #e5e5e5;
		}
		uni-input {
			font-size: 28rpx;
			min-height: 64rpx;
			line-height: 64rpx;
		}
		.uni-forms-item.is-direction-top .uni-forms-item__label {
			white-space: nowrap;
		}
	}

	.customer-input {
		padding-bottom: 8px;
	}
	.radio-group {
		padding-bottom: 16rpx;
		padding-top: 10rpx;
	}
	.radio-group .radio {
		margin-right: 20rpx;
	}
	.birthday-box {
		display: flex;
		align-items: center;
		padding-bottom: 16rpx;
		padding-top: 10rpx;
	}
	.birthday-box .birthday-item .icon-goto {
		transform: rotate(90deg);
		display: inline-block;
		margin-left: 2px;
	}
	.birthday-box .birthday-item {
		display: flex;
		align-items: center;
        border: 1px solid #dddddd;
        padding: 8rpx;
		margin-right: 20rpx;
		
	}
	.birthday-box .birthday-item view {
		width: 120rpx;
	}
	.save {
		display: inline-block;
		background: #000;
		color: #fff;
		padding: 10rpx 20rpx;
	}
	.int-tel-input-box {
		display: flex;
		align-items: center;
		padding-bottom: 16rpx;
		padding-top: 10rpx;
	}
	::v-deep .int-tel-input-box uni-input {
		width: 100%;
	}
	.get-points {
		color:#fa6338;
		display:inline-block;
		margin-left: 8rpx;
		text-transform: uppercase;
	}
</style>
