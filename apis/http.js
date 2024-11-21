import store from "@/store"
import utils from "../common/utils";
import qs from 'qs';

export function HTTP(obj, config) {
	let defaultConfig = {
		isRes: false,
		loading: false,
		error: true
	}

	config = { ...defaultConfig,
		...config
	}


	// 如果需要显示loading,mask防止点击穿透
	let showMask = true;
	if(config.mask=='false') {
		showMask = false
	}
	config.loading && uni.showLoading({mask: showMask});

	return new Promise((resolve, reject) => {

		let options = {
			url: "",
			method: "GET",
			data: {},
			dataType: "json",
			header: {
				"Accept": "application/json",
				"content-type": "application/json"			
			},
			success: (res) => {
				/**
				 * 考虑到一个情况是：
				 * 比如：执行一个接口后紧接着需要再次调取另一个接口，
				 * 此时会出现loading闪烁，所以统一把hideloading注释
				 */
				// uni.hideLoading();
				// 状态码为200
				if (res.statusCode == 200) {
					if(res.header){
						let token = '';
						if(res.header['Access-Token']){
							token = res.header['Access-Token'];
						}
						if(res.header['access-token']){
							token = res.header['access-token'];
						}
						if(token){
							let current_token = uni.getStorageSync("access-token", '');
							if(token != current_token){
								store.dispatch('login', {
									access_token: token
								});
							}
						}
						if(res.header['fecshop-uuid']) {
							uni.setStorageSync('uuid',res.header['fecshop-uuid']);
						}
					}
                    let data = res.data;
					if(res.data.code == 200 || res.data.status == 'success' || res.data.status == 'OK' || res.data.status == 'ZERO_RESULTS' || config.resNoStatus) {
						resolve(data)
						// uni.hideLoading()
					} else {
						uni.hideLoading()
						reject(data)
						//自动校验用户是否登录过期
						if (data && data.code && data.code == "1100003") {
							store.dispatch("reLogin");
							return;
						}
						if(config.error){
							let error = data.errors || data.message || data.content || data.error_message || '';
							error && uni.showToast({
							    title: error,
							    icon: 'none',
							    duration: 3000
							});
						}
					}
				} else {
					uni.hideLoading(); // 此时状态码非200，应该要隐藏loading 吧？不然用户都无法点击了
					let data = res.data;
					//自动校验用户是否登录过期
					if (data && data.code && data.code == "1100003") {
						store.dispatch("reLogin");
						return;
					}
					reject("");
				}
			},
			fail: (err) => {
				uni.hideLoading();
				/*uni.showToast({
					title: "Network error, try again later!",
					icon: "none",
				})*/
				reject("");
			},
			complete: () => {}
		}
		options = { ...options,
			...obj
		};
		
		let token = uni.getStorageSync("access-token");
		if (token) {
			options["header"]["access-token"] =  token;
		}
		let footer_mobile_id =uni.getStorageSync("footer_mobile_id");
		if(footer_mobile_id){
			options["header"]["forter-mobile-id"] = footer_mobile_id;
		}
		let fecshop_currency = uni.getStorageSync("fecshop-currency");
		if (fecshop_currency) {
			options["header"]["fecshop-currency"] =  fecshop_currency;
		}
		
		let header_fecshop_lang = uni.getStorageSync('fecshop-lang');
		if (header_fecshop_lang) {
		    options["header"]["fecshop-lang"] =  header_fecshop_lang;
		}
		let header_uuid = uni.getStorageSync('uuid');
		if (header_uuid) {
		    options["header"]["fecshop-uuid"] =  header_uuid;
		}
		let deviceId = utils.getDeviceId();
		if(deviceId){
			options["header"]["deviceId"] =  deviceId;
		}
		let appVersion = utils.getAppVersion();
		if(appVersion){
			options["header"]["app-version"] = appVersion;
		}
		let appVersionCode = utils.getAppVersionCode();
		if(appVersionCode){
			options["header"]["app-version-code"] =  appVersionCode;
		}
		// #ifdef H5
		options["header"]["x-custom-header"] = 1;
		// #endif
		if (options.url && options.method) {
			uni.request(options);
		} else {
			uni.showToast({
				title: 'HTTP：missing parameter',
				icon: "none",
				duration: 2000
			})
		}
	})
}



export default {
	GET(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	POST(url, data = {}, config) {
		return HTTP({
			url,
			data: qs.stringify(data),
			header: {
				"Accept": "application/json",
				"content-type": "application/x-www-form-urlencoded"
			},
			method: "POST"
		}, config);
	},

	POSTformdata(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	},
	
	UploadFile(url, data = {}, config){
		return new Promise((resolve, reject) => {
		
			data = data || {};
			data.filePath = data.filePath || null;//要上传文件资源的路径。   
			data.name = data.name || null;//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 
			
			data.success = data.success || function() {};
			
			var header = {};
			
			let token = uni.getStorageSync("access-token");
			if (token) {
				header["access-token"] =  token;
			}
			
			let fecshop_currency = uni.getStorageSync("fecshop-currency");
			if (fecshop_currency) {
				header["fecshop-currency"] =  fecshop_currency;
			}
			
			let header_fecshop_lang = uni.getStorageSync['fecshop-lang'];
			if (header_fecshop_lang) {
			    header["fecshop-lang"] =  header_fecshop_lang;
			}
			
			let appVersion = utils.getAppVersion();
			if(appVersion){
				header["app-version"] = appVersion;
			}
			let appVersionCode = utils.getAppVersionCode();
			if(appVersionCode){
				header["app-version-code"] =  appVersionCode;
			}
			
			let options = {
				url: url,
				formData: data.formData,
				filePath: data.filePath,
				name: data.name,
				header: header,
				success: function(res){
					// 状态码为200
					if (res.statusCode == 200) {
						 let data = JSON.parse(res.data);
						if(data.code == 200 || data.status == 'success' || data.status == 'OK' || data.status == 'ZERO_RESULTS') {
							resolve(data)
							// uni.hideLoading()
						} else {
							uni.hideLoading()
							reject(data)
							//自动校验用户是否登录过期
							if (data && data.code && data.code == "1100003") {
								store.dispatch("reLogin");
								return;
							}
							uni.showToast({
							    title: data.errors || data.message || String(data.content) ,
							    icon: 'none',
							    duration: 3000
							});
						}
					} else {
						reject("Network error！");
					}
				},
				fail: function () {
					uni.showToast({
						title: 'Network error, try again later!'
					});
				}
			};
			
			// #ifdef H5
			options["header"]["x-custom-header"] = 1;
			// #endif
			
			if(data.files){
				options.files = data.files;
			} 
			uni.uploadFile(options);
		})
	}
}
