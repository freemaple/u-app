import $mRoutesConfig from "@/config/routes.config.js"
import { saveViewRecords } from '@/apis/index.js'
import config from "@/config.js"
export default {
	/**	
	 * 获取当前页面的地址
	 */
	getCurrentPageLink:function(){
		let pages = getCurrentPages();
		let link = '';
		if(pages.length > 0){
			let c_page = pages[pages.length - 1];
			//#ifdef H5
			let route = c_page.$route;
			link = route.fullPath;
			//#endif
			//#ifndef H5
			link = '/' + c_page.route;
			link = this.objParseUrlAndParam(link, c_page.options);
			//#endif
		}
		return link;
	},
	/**
	 * 判断是否微信浏览器打开
	 */
	isWeixinBrowser(){
		if(navigator && navigator.userAgent){
			return /micromessenger/.test(navigator.userAgent.toLowerCase())
		}
		return false;
	},
	// 判断第三方程序(微信) 是否安装，只在APP中有效
	checkInstallApp(pname, action){
		if(plus.runtime.isApplicationExist({pname:pname,action: action})){
			return true;
		}else{
			return false;
		}
	},
	//app判断是否安装微信
	checkInstallWeixin(){
		return this.checkInstallApp('com.tencent.mm', 'weixin://');
	},
	//app判断是否安装支付宝
	checkInstallAlipay(){
		return this.checkInstallApp('com.eg.android.AlipayGphone', 'alipay://');
	},
	getQueryString(url, name) {         
		var reg = new RegExp('[?&]' + name + '=([^&#]*)', 'i');
		var string = reg.exec(url);
		return string ? string[1] : null;
	},
	/* 
	 * 将cityNo 转 cityName
	 * cityData:原数据
	 * cityNo：二级地区编码
	 */
	getCityName(cityData, cityNo) {
		if (!cityNo) return;
		if (!(cityData instanceof Array)) return;
		// 9112
		cityNo += "";
		for (let i = 0; i < cityData.length; i++) {
			let sheng = cityData[i];
			for (let j = 0; j < sheng.children.length; j++) {
				let shi = sheng.children[j];
				if (shi.value == cityNo) {
					// 使用return 终止循环
					return `${sheng.label}-${shi.label}`;
				}
			}
		}
	},

	/* 
	 * obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = "";
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/* 
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || "/";
		let paramsStr = "";
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		if(url.indexOf('?') ==  -1){
			paramsStr && (url += "?");
		} else {
			paramsStr && (url += "&");
		}
		url += paramsStr;
		return url;
	},

	/* 
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || "";
		let theRequest = new Object();
		let str = href.split("?")[1];
		if (str != undefined) {
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},

	/* 
	 * 银行卡每四位空格
	 */
	formatCardNo(cardNo) {
		cardNo += "";
		return cardNo.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
	},

	/**
	 * 乘法，解决js精度损失问题
	 * @param {*} arg1 
	 * @param {*} arg2 
	 */
	accMul(arg1, arg2) {
		arg1 = arg1 || 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},
	
	/* 
	 * 格式化手机号码返回 131****1234
	 */
	formatPhone(phoneNo) {
		var tel = String(phoneNo);
		var dh = tel.substr(0, 3) + "****" + tel.substr(-4, 4);
		return dh;
	},
	
	/* 
	 * 校验手机号格式
	 */
	checkPhone(phoneNo) {
		var reg = /^1[3|4|5|6|7|8|9]\d{9}$/; 
		return reg.test(phoneNo) 
	},
	
	/* 
	 * 校验身份证格式
	 */
	checkIdcard(idcard) {
		var reg = /^\d{17}[\d|X]$/;
		return reg.test(idcard) 
	},
	/**
	 * 确认链接是否在switchtab中
	 */
	checkSwitch(path, app) {
		let routePath = path.indexOf('?') > -1 ? path.split('?')[0] : path
		let switchTabList = $mRoutesConfig.switchTabList
		let switchIndex = switchTabList.findIndex(item => item.path.indexOf(routePath) > -1)
		return switchIndex
	},
	/**
	 * 确认图片链接是否可以打开
	 */
	checkImgExists(imgurl) {
		//没有图片，则返回false
		return new Promise((rs, rj) => {
			uni.getImageInfo({
				src: imgurl,
				success: res => {
					rs(res);
				},
				fail: err => {
					rj(err)
				}
			})
		}).catch((error) => {
			return false
		});
	},
	checkPassWord(password) {//密码必须包含数字和字母
		var str = password;
		if (str == null || str.length < 6 || str.length > 18) {
			return false;
		}
		var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
		if (reg.test(str)){
			return true;
		} else {
			return false;
		}
	},
	checkNumPassWord(password) {//密码只能为数字
		var str = password;
		if (str == null || str.length !== 6) {
			return false;
		}
		var reg = new RegExp(/^[0-9]{6}$/);
		if (reg.test(str)){
			return true;
		} else {
			return false;
		}
	},
	urlToBlob(image_url, index){
		return new Promise((rs, rj) => {
			var request = new XMLHttpRequest();
			request.open('GET', image_url, true);
			request.responseType = 'blob';
			request.onload = function () {
				let res = {
					blob: request.response,
					index: index
				}
				rs(res);
			};
			request.send();
		});
	},
	//图片转blob对象
	getUrlBlob(image_url){
		let self = this;
		return new Promise((rs, rj) => {
			var image = new Image();
			image.src = image_url;
			image.onload = function() {
				var canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				canvas.getContext('2d').drawImage(image, 0, 0);
				let img_data = canvas.toDataURL();
				var blob = self.dataURItoBlob(img_data);
				rs(blob);
			};
		}).catch((error) => {
			
		});
	},
	//base64转blob
	dataURItoBlob(dataURI) {
		// Convert Base64 image to binary
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {type:mimeString});
	},
	
	
	// H5 图片转base64方法
	h5UrlTobase64(filePath) {
		return new Promise(function(resolve, reject) {
			let img = new Image();
			img.onload = function() {
				let canvas = document.createElement("canvas");
				let ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);
				let base64 = canvas.toDataURL("image/png");
				resolve(base64);
			}
			img.onerror = function(err) {
				reject(err);
			}
			img.src = filePath;
		})
	},
	//富文本标签、图片宽度处理
	descFormat(html){
		html = html.replace(/\<p><img/gi, '<p style="line-height:0;"><img style="max-width:100%;height: auto"');
		html = html.replace(/\<p style='text-align: center'><img/gi, '<p style="line-height:0;text-align: center;"><img style="max-width:100%;height: auto"');
		html = html.replace(/\<p style='text-align: left'><img/gi, '<p style="line-height:0;text-align: left;"><img style="max-width:100%;height: auto"');
		html = html.replace(/\<p style='text-align: right'><img/gi, '<p style="line-height:0;text-align: right;"><img style="max-width:100%;height: auto"');
		html = html.replace(/\<table/gi, '<table style="width: 100% !important"');
		return html;
	},
	// 微信小程序 图片转base64方法
	wxUrlTobase64(filePath) {
		return new Promise(function(resolve, reject) {
			wx.getFileSystemManager().readFile({
				filePath: filePath,
				encoding: 'base64',
				success: res => {
					let base64 = 'data:image/png;base64,' + res.data;
					resolve(base64);
				}
			})
		})
	},
	// 分享链接公共参数处理
	shareLinkCode(link) {
		if(!link){
			return '';
		}
		const userData = uni.getStorageSync("userData");
		let rcode = userData && userData.rcode ? userData.rcode : '';
		if(rcode){
			if(!this.getQueryString(link, 'rcode')){
				if(link.indexOf('?') ==  -1){
					link += "?rcode=" + rcode;
				} else {
					link += "&rcode=" + rcode;
				} 
			}
		}
		return link;
	},
	timeago(dateTimeStamp){   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
	    var result = '';
		var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
	    var hour = minute * 60;
	    var day = hour * 24;
	    var week = day * 7;
	    var halfamonth = day * 15;
	    var month = day * 30;
	    var now = new Date().getTime();   //获取当前时间毫秒
	    var diffValue = now - dateTimeStamp;//时间差
	
	    if(diffValue < 0){
	        return;
	    }
	    var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
	    var hourC = diffValue/hour;
	    var dayC = diffValue/day;
	    var weekC = diffValue/week;
	    var monthC = diffValue/month;
	    if(monthC >= 1 && monthC <= 3){
	        result = " " + parseInt(monthC) + "月前"
	    }else if(weekC >= 1 && weekC < 4){
	        result = " " + parseInt(weekC) + "周前"
	    }else if(dayC >= 1 && dayC < 7){
	        result = " " + parseInt(dayC) + "天前"
	    }else if(hourC >= 1 && hourC < 24){
	        result = " " + parseInt(hourC) + "小时前"
	    }else if(minC >= 1 && minC <= 59){
	        result =" " + parseInt(minC) + "分钟前"
	    }else if(diffValue >= 0 && diffValue <= minute){
	        result = "刚刚"
	    }else {
	        var datetime = new Date();
	        datetime.setTime(dateTimeStamp);
	        var Nyear = datetime.getFullYear();
	        var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	        var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	        var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	        var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	        var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	        result = Nyear + "-" + Nmonth + "-" + Ndate
	    }
	    return result;
	},
	
	// 获取时间差
	timeDiffer(dateTimeStamp){
	    var result = '';
		var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
	    var hour = minute * 60;
	    var day = hour * 24;
	    var week = day * 7;
	    var halfamonth = day * 15;
	    var month = day * 30;
	    var now = new Date().getTime();   //获取当前时间毫秒
	    var diffValue = dateTimeStamp - now;//时间差

	    var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
	    var hourC = diffValue/hour;
	    var dayC = diffValue/day;
	    var weekC = diffValue/week;
	    var monthC = diffValue/month;
	    return {min:minC,hour:hourC,day:dayC,week:weekC,month:monthC,diffValue}
	},
	
	// 判断是否小数
	checkInt(num){
		let numPlus = Math.ceil(num)
	    return numPlus - num == 0;
	},
	// 比较版本号大小 version1 >= version2返回true
	checkVersion(version1, version2){
		let version1Arr = version1.split('.')
		let version2Arr = version2.split('.')
		if (version1Arr[0] > version2Arr[0]) {
			return true
		} else if (version1Arr[0] == version2Arr[0]) {
			if (version1Arr[1] > version2Arr[1]) {
				return true;
			} else if (version1Arr[1] == version2Arr[1]) {
				if (version1Arr[2] >= version2Arr[2]) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}else{
			return false;
		}
	},
	//订单来源
	getOrderFrom(){
		let order_from = '';
		//#ifdef H5 
		order_from = 'H5';
		//#endif
		//#ifdef APP-PLUS
		order_from = 'APP';
		//#endif
		//#ifdef MP-WEIXIN
			order_from = 'MP-WEIXIN';
		//#endif
		//#ifdef MP-ALIPAY
			order_from = 'MP-ALIPAY';
		//#endif
		//#ifdef MP-BAIDU
			order_from = 'MP-BAIDU';
		//#endif
		//#ifdef MP-TOUTIAO
			order_from = 'MP-TOUTIAO';
		//#endif
		//#ifdef MP-QQ
			order_from = 'MP-QQ';
		//#endif
		return order_from;
	},
	// 浏览记录
	viewRecords() {
		let viewed_product_id = ''		
		uni.getStorage({key: 'viewed_product_id', success: (res)=> {
			if(res.data) {
				viewed_product_id = res.data	
				saveViewRecords({
					viewed_product_id
				}).then(res=>{
					if(res.code == '200') {
						// 判断本地缓存的条数是否超过30，超过就只保留最新的30条
						const arr = viewed_product_id.split(',')
						const {login_status, update_record} = res.data
						if(login_status && update_record && arr.length > 30) {
							const newArr = arr.slice(arr.length-30,arr.length)
							const str = newArr.join(',')
							uni.setStorage({
								key: 'viewed_product_id',
								data: str,
								success: (res)=> {

								}
							})
						}
					}
				})
			}
		}})
	},
	copyId(content) {
		const that = this
            uni.setClipboardData({
                data: content,
                success: (result) => {
                    uni.showToast({
                        title: that.$t('order.copy_success'),
                        icon: 'none',
                        duration: 3000
                    })
                },
                fail: (error) => {}
            })
	},
	getDeviceId(){
		let deviceId = '';
		try{
			deviceId = uni.getStorageSync('deviceIdCache');
			if (!deviceId) {
				let systemInfo = uni.getSystemInfoSync();
				deviceId = systemInfo.deviceId;
			}
			uni.setStorageSync('deviceIdCache', deviceId);
		} catch(e){}
		return deviceId;
	},
	// 千分位展示
	formatNumber : function (number) {
	  let numStr = String(number)
	  // 检查是否有小数部分
	  let decimalPart = '';
	  const decimalIndex = numStr.indexOf('.');
	  if (decimalIndex !== -1) {
	    decimalPart = numStr.slice(decimalIndex);
	    numStr = numStr.slice(0, decimalIndex);
	  }
	  // 从右到左每三位添加逗号
	  let result = '';
	  for (let i = numStr.length - 1, j = 1; i >= 0; i--, j++) {
	    result = numStr[i] + result;
	    if (j % 3 === 0 && i !== 0) {
	      result = ',' + result;
	    }
	  }
	  // 拼接小数部分
	  result += decimalPart;
	  return result;
	},
	getNewUseTimeDiff(){
		let sign_behavior = uni.getStorageSync('sign_behavior');
		if(sign_behavior){
			return false;
		}
		let app_open_time = uni.getStorageSync('app_open_time');
		if(!app_open_time){
			app_open_time = Math.floor(new Date().getTime() / 1000);
		}
		let time = Math.floor(new Date().getTime() / 1000);
		return time - app_open_time;
	},
	//当前日期
	currentDate(){
		var now = new Date();
		var year = now.getFullYear(); //得到年份
		var month = now.getMonth(); //得到月份
		var date = now.getDate(); //得到日期
		month = month + 1;
		if (month < 10) month = "0" + month;
		if (date < 10) date = "0" + date;
		var c = year + "-" + month + "-" + date; //（格式化"yyyy-MM-dd"）
		return c;
	},
	getAppVersion(){
		let appVersion = '';
		let appInfo = uni.getAppBaseInfo();
		if(appInfo && appInfo.appVersion){
			appVersion =  appInfo.appVersion;
		}
		try{
			if (process.env && process.env.NODE_ENV === 'development') {
				if(config.version){
					appVersion = config.version;
				}
			}
		} catch(e){
			
		}
		return appVersion;
	},
	getAppVersionCode(){
		let appVersionCode = '';
		let appInfo = uni.getAppBaseInfo();
		if(appInfo && appInfo.appVersionCode){
			appVersionCode =  appInfo.appVersionCode;
		}
		try{
			if (process.env && process.env.NODE_ENV === 'development') {
				if(config.version_code){
					appVersionCode = config.version_code;
				}
			}
		} catch(e){
			
		}
		return appVersionCode;
	},
}
