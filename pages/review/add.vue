<template>
	<view class="review-add-box dui-padding-top-header">
		<pageHeader :title="$t('review_add.header')"></pageHeader>
		<view class="review-add-content p-24rpx">
			<view class="tip-box">
				{{ $t('review_add.tip_1_1') }}
				<text class="link" @click="$public.handleNavTo('/pages/cms/article/article?url_key=app-review-guidance')">{{ $t('review_add.review_guidance') }}</text>
				{{ $t('review_add.tip_1_2') }}
			</view>
			<view class="tip-box">
				{{ $t('review_add.tip_2') }}
			</view>
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item class="uni-forms-item-review_content" label="" name="review_content">
					<view class="review-word-box flex align-items-end">
						<image v-if="productDetail.thumbnail_img" :src="productDetail.thumbnail_img[0]" mode="aspectFill"></image>
						<view class="textarea-box">
							<textarea v-model="formData.review_content" :maxlength="1000" :placeholder="$t('review_add.add_review_placeholder')"/>
							<view class="word-num">{{ formData.review_content.length }} / 1000</view>
						</view>
						<view v-if="pointConfig.text_review" class="point-tip">+ {{pointConfig.text_review}} {{$t('review_add.points')}}</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="">
					<view class="review_content_tip">
						{{$t('review_add.review_content_tip1')}}
						<text>{{'&nbsp;'}}{{(20-formData.review_content.length) > 0?20-formData.review_content.length:0}}{{'&nbsp;'}}</text>
						{{$t('review_add.review_content_tip2')}}
					</view>
					<view class="measurements-box">
						<uni-collapse>
							<uni-collapse-item :show-animation="true" :title="$t('review_add.My Measurements')" :open="false">
								<view class="body-size-box">
									<view class="body-size-item flex align-items-center no-wrap">
										<view class="s_label">{{$t('review_add.Height')}}:</view>
										<view class="input-box"><input type="number" v-model="formData.size_height" /></view>
										<view class="unit">{{$t('review_add.cm')}}</view>
									</view>
									<view class="body-size-item flex align-items-center no-wrap">
										<view class="s_label">{{$t('review_add.Weight')}}:</view>
										<view class="input-box"><input type="number" v-model="formData.size_weight" /></view>
										<view class="unit">{{$t('review_add.kg')}}</view>
									</view>
									<view class="body-size-item flex align-items-center no-wrap">
										<view class="s_label">{{$t('review_add.Bust')}}:</view>
										<view class="input-box"><input type="number" v-model="formData.size_bust" /></view>
										<view class="unit">{{$t('review_add.cm')}}</view>
									</view>
									<view class="body-size-item flex align-items-center no-wrap">
										<view class="s_label">{{$t('review_add.Waist')}}:</view>
										<view class="input-box"><input type="number" v-model="formData.size_waist" /></view>
										<view class="unit">{{$t('review_add.cm')}}</view>
									</view>
									<view class="body-size-item flex align-items-center no-wrap">
										<view class="item-box">
											<view class="s_label">{{$t('review_add.Hips')}}:</view>
											<view class="input-box"><input type="number" v-model="formData.size_hips" /></view>
											<view class="unit">{{$t('review_add.cm')}}</view>
										</view>
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</uni-forms-item>
				<uni-forms-item label="">
					<view class="body-size-footer">
						<view class="desc" v-if="pointConfig.size_review">{{$t('review_add.Fill in all sizes to get points reward')}}<text class="add-point-show-box">+ {{pointConfig.size_review}} {{$t('review_add.points')}}</text></view>
						<view class="select-box flex align-items-center">
							<view>{{$t('review_add.Overall Fit')}}: </view>
							<view class="overall-fit" @click="$refs.overallFit.open('bottom')">{{$t(overallFitData[currentFitIndex].language)}}<i class="iconfont icon-goto"></i></view>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="review-star-info-wrap flex align-items-center">
						<view class="rating">{{$t('review_add.Rating')}}:</view>
						<fiveStarPraise @changeStar="(num)=>{formData.rate_star = num}" starSize="46rpx" :num="formData.rate_star"></fiveStarPraise>
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="review-star-info-wrap flex align-items-center">
						<view class="rating">{{$t('review_add.logistics_service_rating')}}:</view>
						<fiveStarPraise @changeStar="(num)=>{formData.logistics_star = num}" starSize="46rpx" :num="formData.logistics_star"></fiveStarPraise>
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="review-image-wrap flex align-items-center">
						<view class="upload-image">{{$t('review_add.Upload Image', {limit: 4})}}: </view>
						<view class="upload-image-btn" @click="uploadImage">{{$t('review_add.Browse Files')}}</view><text class="add-point-show-box" v-if="pointConfig.photo_review">+ {{pointConfig.photo_review}} {{$t('review_add.points')}}</text>
					</view>
					<view class="image-box">
						<view class="_image" v-for="(item,index) in imagesArr" :key="index">
							<view class="img">
								<view class="remove-btn" @click="handleDelImg(index)">x</view>
								<image mode="aspectFit" :src="item.img_url"></image>
							</view>
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<div class="tip-box">
				{{ $t('review_add.upload_tip') }}
			</div>
			<view class="add-review-btn dui-primary-btn" :class="{
    disabled: isSubmit
   }" @click="submit">{{$t('review_add.Add Review')}}</view>
		</view>
		<singleSelect ref="overallFit" refName="popupOverallFit" :currentIndex="currentFitIndex" :options="overallFitData"
			@change="handleChangeFit">
		</singleSelect>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					review_content: "",
					size_height: "",
					size_weight: "",
					size_bust: "",
					size_waist: "",
					size_hips: "",
					size_fit: "True to Size",
					rate_star: 5,
					logistics_star: 5,
				},
				overallFitData:[{
					label: 'True to Size',
					language: 'review_add.options.True to Size',
					value: 'True to Size'
				},
				{
					label: 'Small',
					language: 'review_add.options.Small',
					value: 'Small'
				},
				{
					label: 'Large',
					language: 'review_add.options.Large',
					value: 'Large'
				}],
				currentFitIndex:0,
				rules: {
					review_content: {
						rules: [{
							required: true,
							errorMessage: this.$t("review_add.review_content_rule")
						}]
					},
				},
				imagesArr: [],
				order_id:'',
				item_id:'',
				product_id:'',
				productDetail: {},
				pointConfig:{},
    isSubmit: false  // 防止重复提交, 是否正在提交
			}
		},
		methods: {
			handleChangeFit(index,data) {
				this.currentFitIndex = index;
				this.formData.size_fit = this.overallFitData[index].value;
				this.$refs.overallFit.close();
			},
			handleDelImg(index) {
				this.imagesArr.splice(index,1)
			},
			uploadImage() {
				var that = this;
				uni.chooseImage({
					count: 4 - that.imagesArr.length,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						const tempFilePaths = res.tempFilePaths;
						let files = [];
						var checkFlag = true;
						var tempFiles = res.tempFiles;
						tempFiles.forEach((tempFile,index) =>{
							var maxSize = 1024*1024*8;//定义文件的最大的大小：8M
							var fileSize = tempFile.size;//获取文件的大小
							if(fileSize && fileSize>maxSize){
								uni.showToast({
								    title: that.$t('review_add.upload_file_size_max', ['8M!']),
								    icon: 'none',
								    duration: 3000
								});
								checkFlag = false;
								return false;
							}
						});
						if(!checkFlag){
							return false;
						}
						tempFilePaths.map((item,index) =>{
							files.push({
								name: 'upload_file' + index,
								uri: item
							})
						})
						that.$apis.reviewImageUpload({files: files}).then(res => {
							that.imagesArr = that.imagesArr.concat(res.data.img)
						})
						// tempFilePaths.map(item => {
						// 	that.$apis.reviewImageUpload({filePath: item,name: "upload_file0"}).then(res => {
						// 		that.imagesArr.push({"img_path": res.data.img_path,"img_url":res.data.img_url})
						// 	})
						// })
					}
				});
			},
			handleAdd() {
				const images = this.imagesArr.map(item => {
					return item.img_path
				})
				const review_images = images.join('####')
    if(this.isSubmit) return
    this.isSubmit = true
				this.$apis.addReview({...this.formData,review_images,product_id:this.product_id,order_id:this.order_id,item_id:this.item_id}).then(res => {
					uni.redirectTo({
						url: '/pages/review/list'
					})
				}).finally(()=> {
       this.isSubmit = false
    })
			},
			getProductDetails() {
				this.$apis.getProductDetail({product_id: this.product_id},{loading:false}).then(res =>{
					this.productDetail = res.data.product;
				})
			},
			submit() {
				this.$refs.form.validate().then(res => {
					this.handleAdd()
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			getPointConfig() {
				this.$apis.getPointConfig({page:'review'}).then(res => {
					this.pointConfig = res.data;
				})
			}
		},
		onLoad(e) {
			this.order_id = e.order_id;
			this.item_id = e.item_id;
			this.product_id = e.product_id || '654'
			this.getProductDetails();
			this.getPointConfig()
		}
	}
</script>

<style lang="scss" scoped>
.tip-box {
	margin-bottom: 20rpx;
	color: #777;
	font-size: 26rpx;
	.link {
		text-decoration: underline;
		padding: 0px 8rpx;
	}
}
.review-add-box {
	.add-review-btn {
		margin-top: 60rpx;
  &.disabled {
    opacity: 0.65;
    pointer-events: none;
  }
	}
	.review-add-content {
		::v-deep .uni-collapse-item__title-box {
			padding: 0;
			color: #000000;
			height: auto;
			line-height: 1;
			padding-bottom: 16rpx;
		}
		::v-deep .uni-collapse-item__title-arrow .uni-icons {
			color: #000000 !important;
		}
		
		.image-box {
			display: flex;
			flex-wrap: wrap;
			margin-top: 50rpx;
			._image {
				width: calc((100% - 30rpx) / 4);
				margin-right: 10rpx;
				margin-top: 10rpx;
				.img {
					width: 100%;
					padding-bottom: 100%;
					position: relative;
					background: #f2f2f2;
					.remove-btn {
						position: absolute;
						left: 0;
						top: -38rpx;
						font-size: 35rpx;
						line-height: 1;
						color: #333;
					}
					image {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
					}
				}
			}
			._image:nth-of-type(4n) {
				margin-right: 0;
			}
			._image:nth-child(-n+4) {
				margin-top: 0;
			}
		}
		.review-star-info-wrap {
			padding: 20rpx 0;
			.rating {
				margin-right: 8rpx;
			}
		}
		.review-image-wrap {
			.upload-image {
				margin-right: 8rpx;
			}
			.upload-image-btn {
				border: 1px solid #ccc;
				line-height: 1;
				padding: 8rpx;
			}
		}
		.add-point-show-box {
		    color: #fa6338;
		    padding-left: 10rpx;
			font-size: 24rpx;
		}
		::v-deep .uni-forms-item-review_content .uni-forms-item__error.msg--active {
			margin-left: 202rpx;
			position: unset;
		}
		
		::v-deep .uni-forms-item {
			margin-bottom: 8rpx;
		}
		.measurements-box {
			margin-top: 16rpx;
			font-size: 32rpx;
			color: #000000;
			.body-size-box {
				display: flex;
				flex-wrap: wrap;
				font-size: 28rpx;
				overflow: hidden;
				padding-bottom: 16rpx;
				.body-size-item:nth-child(-n+2) {
				    padding-top: 20rpx;
					margin-top: 0;
				}
				.body-size-item:nth-of-type(2n) {
					margin-right: 0;
				}
				.body-size-item {
					width: calc(50% - 20rpx);
					margin-right: 20rpx;
					margin-top: 20rpx;
					.item-box {
						position: relative;
						display: flex;
						align-items: center;
					}
					.s_label {
					    width: 140rpx;
					}
					.unit {
					    min-width: 40rpx;
					}
					.input-box {
					    margin-right: 10rpx;
					    flex: 1;
						input,select {
							width: 100%;
						}
						input {
							border: 1px solid #ccc;
						}
					}
				}
			}
		}
		.body-size-footer {
			.desc {
				font-size: 24rpx;
				color: #767676;
				margin-bottom: 20rpx;
			}
			.select-box {
				.overall-fit {
					border: 1px solid #ccc;
					margin-left: 10rpx;
					padding: 8rpx;
					line-height: 1;
					.icon-goto {
						transform: rotate(90deg);
						display: inline-block;
						margin-left: 4rpx;
					}
				}
			}
		}
		.review_content_tip {
			font-size: 24rpx;
			color: #767676;
			text {
				color: #fa6338;
				margin: 0 4rpx;
			}
		}
		.review-word-box {
			image {
				width: 148.5rpx;
				height: 198rpx;
				margin-right: 4rpx;
			}
			.textarea-box {
				border: 1px solid #ccc;
				flex: 1;
				.word-num {
					height: 32rpx;
					padding: 0 8rpx;
					font-size: 24rpx;
					text-align: right;
					color: #767676;
				}
			}
			textarea {
				width: 100%;
				height: 162rpx;
				padding: 8rpx;
			}
			.point-tip {
				color: #fa6338;
				font-size: 24rpx;
				margin-left: 4rpx;
			}
			::v-deep .uni-textarea-placeholder {
				font-size: 24rpx;
			}
		}
	}
}
</style>
