import $mRoutesConfig from "@/config/routes.config.js"
function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

/**
 * 确认链接是否在switchtab中
 */
function checkSwitch(path, app) {
	let routePath = path.indexOf('?') > -1 ? path.split('?')[0] : path
	let switchTabList = $mRoutesConfig.switchTabList
	let switchIndex = switchTabList.findIndex(item => item.path.indexOf(routePath) > -1)
	return switchIndex
}

 /* obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
function objParseParam(obj) {
	let paramsStr = "";
	if (obj instanceof Array) return paramsStr;
	if (!(obj instanceof Object)) return paramsStr;
	for (let key in obj) {
		paramsStr += `${key}=${obj[key]}&`;
	}
	return paramsStr.substring(0, paramsStr.length - 1);
}

/* 
 * obj 转 路由地址带参数
 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
 */
function objParseUrlAndParam(path, obj) {
	let url = path || "/";
	let paramsStr = "";
	if (obj instanceof Array) return url;
	if (!(obj instanceof Object)) return url;
	paramsStr = objParseParam(obj);
	if(url.indexOf('?') ==  -1){
		paramsStr && (url += "?");
	} else {
		paramsStr && (url += "&");
	}
	url += paramsStr;
	return url;
}

module.exports = {
    formatTime: formatTime,
	checkSwitch: checkSwitch,
	objParseUrlAndParam: objParseUrlAndParam
};
