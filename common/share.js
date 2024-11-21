import store from "@/store"
// #ifdef APP-PLUS
import {fbShare} from "@/uni_modules/ut-fb";
// #endif
export default class Share {
	//android包
	static getPackage(shareType){
		const type = shareType;
		let _package = ''
		switch (type) {
			case 'whatsapp':
				_package = 'com.whatsapp';
				break;
			case 'facebook':
				_package = 'com.facebook.katana';
				break;
			case 'twitter':
				_package = 'com.twitter.android';
				break;
				break;
			case 'instagram':
				_package = 'com.instagram.android';
				break;
			case 'pinterest':
				_package = 'com.pinterest';
				break;
			default:
				break;
		}
		return _package;
	}
	//android判断是否安装app
	static isInstalledApp(pkgname) { 
        plus.android.importClass('java.util.ArrayList');  
        plus.android.importClass('android.content.pm.PackageInfo');  
        plus.android.importClass('android.content.pm.PackageManager');  
        var MainActivity = plus.android.runtimeMainActivity();  
        var PackageManager = MainActivity.getPackageManager();  
        var pinfo = plus.android.invoke(PackageManager, 'getLaunchIntentForPackage', pkgname) 
        return pinfo != null;  
    }
	//分享初始化
	static init(shareObj, callback){
		if(!shareObj || !shareObj.type){ 
			return;
		}
		// #ifdef APP-PLUS  
		let platform = uni.getSystemInfoSync().platform;
		if(platform == 'android'){
			this.androidShare(shareObj, callback);
		}
		else if(platform == 'ios'){
			this.iosShare(shareObj, callback);
		} else {
			this.webShare(shareObj, callback);
		}
		//#endif
		// #ifdef H5
		this.webShare(shareObj, callback);
		//#endif
	}
	
	//android分享
	static androidShare(shareObj, callback){
		let shareType = shareObj.type
			, images = shareObj.images
			, subject = shareObj.subject
			, description = shareObj.description
			, url = shareObj.url;
		let Intent = plus.android.importClass("android.content.Intent")
		, Uri = plus.android.importClass('android.net.Uri');
		// 导入后可以使用new方法创建类的实例对象
		//邮件分享
		if(shareType == 'email'){
			let intent = new Intent(Intent.ACTION_VIEW);
			intent.setData(Uri.parse("mailto:")); 
			intent.putExtra(Intent.EXTRA_SUBJECT, subject);
			intent.putExtra(Intent.EXTRA_TEXT, description + " " + url);
			plus.android.runtimeMainActivity().startActivity(intent);
			callback();
			return;
		}
		let intent = new Intent();
		const _package = this.getPackage(shareObj.type);
		if(!this.isInstalledApp(_package)){
			//没有安装app,使用web分享
			this.webShare(shareObj, callback);
			return;
		}
		if(shareType == 'pinterest'){
			var shareUrl = this.webShareUrl(shareObj);
			var intentx = new Intent(Intent.ACTION_VIEW, Uri.parse(shareUrl));
			plus.android.runtimeMainActivity().startActivity(intentx);
			callback();
			return;
		}
		intent.setAction(Intent.ACTION_SEND);
		//调用分享包
		intent.setPackage(_package);
		// var share_desc = description + " " + url;
		var share_desc = description;
		if(shareType == 'facebook') {
			share_desc = description + " " + url;
		}
		if(shareType == 'twitter') {
			if(shareObj.account) {
				share_desc += " @" + shareObj.account;
			} else {
				if(store.state && store.state.appConfig && store.state.appConfig.share_account){
					share_desc += " @" + store.state.appConfig.share_account;
				}
			}
		}
		intent.setType("text/plain");
		intent.putExtra(Intent.EXTRA_TEXT, share_desc);
		intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
		plus.android.runtimeMainActivity().startActivity(intent);
		callback();
	}
	
	//ios分享
	static iosShare(shareObj, callback){
		let shareUrl = this.iosShareUrl(shareObj);
		if(shareUrl){
			if(shareObj.type == 'facebook'){
				var body = shareObj.description + " " + encodeURI(shareObj.url);
				var hashtag = shareObj.hashtag  && '#' + shareObj.hashtag;
				fbShare(shareObj.url, body, hashtag);
				callback();
				return;
			}
			var sharedApplication = plus.ios.importClass("UIApplication");
			var UIApplication = plus.ios.import("UIApplication");  
			var NSURL = plus.ios.import("NSURL");  
			var NSURL = NSURL.URLWithString(shareUrl);  
			var application = UIApplication.sharedApplication();
			if(shareObj.type == 'instagram'){
				if(!application.canOpenURL(NSURL)){
					uni.showToast({
					    title: 'Please install the instagram app first!',
					    icon: 'none',
					    duration: 3000
					});
					plus.runtime.openURL('https://www.instagram.com');
					return;
				}
			}
			application.openURL(NSURL); 
			callback();
		}
	}
	
	//获取ios分享URL
	static iosShareUrl(shareObj){
		let shareUrl = '';
		switch (shareObj.type) {
			case 'instagram':
				// var text = shareObj.description +  " " + encodeURI(shareObj.url);
				var text = shareObj.description;
				shareUrl = 'instagram://sharesheet?text=' + encodeURIComponent(text);
				break;
			default:
				shareUrl = this.webShareUrl(shareObj);
				break;
		}
		
		return shareUrl;
	}
	
	//网页分享
	static webShare(shareObj, callback){
		//无法web分享提示安装app!
		if(shareObj.type == 'instagram'){
			uni.showToast({
				title: 'Please install the ' + shareObj.type + ' app first!',
				icon: 'none'
			});
			return;
		}
		var shareUrl = this.webShareUrl(shareObj);
		if(shareUrl){
			// #ifdef APP-PLUS  
			//没有安装app打开浏览器进行分享
			callback();
			plus.runtime.openURL(shareUrl, function(res) {  
				// 失败才回调
			});
			//#endif
			// #ifdef H5
			window.open(shareUrl);
			callback();	
			//#endif
		}
	}
	
	//网页分享URL
	static webShareUrl(shareObj){
		var shareUrl = '';
		var hashtag = shareObj.hashtag || '';
		switch (shareObj.type) {
			case 'email': 
				var subject = shareObj.subject || '';
				// var body = shareObj.description + " " + encodeURI(shareObj.url);
				var body = shareObj.description;
				shareUrl = 'mailto:?subject='  + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
				break;
			case 'facebook':
				shareUrl = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURI(shareObj.url) + "&hashtag=%23" + hashtag;
				break;
			case 'twitter':
				// shareUrl = 'https://twitter.com/intent/tweet?url=' + shareObj.url + '&text='+ shareObj.description+"&hashtags=" + hashtag;
				shareUrl = 'https://twitter.com/intent/tweet?text='+ encodeURIComponent(shareObj.description)+"&hashtags=" + hashtag;
				if(shareObj.account) {
					shareUrl += '&via=' + shareObj.account;
				} else {
					if(store.state.appConfig && store.state.appConfig.share_account){
						shareUrl += '&via=' + store.state.appConfig.share_account;
					}
				}
				break;
			case 'pinterest':
				var shareUrl = encodeURIComponent(shareObj.url);
				var mediaUrl = '';
				if(shareObj.images.length){
					mediaUrl = encodeURIComponent(shareObj.images[0]);
				}
				var description = shareObj.description || '';
				description = encodeURIComponent(description);
				shareUrl = `https://www.pinterest.com/pin/create/button/?url=${shareUrl}&media=${mediaUrl}&description=${description}`;
				break;
			default:
				break;
		}
		return shareUrl;
	}
}
