/**
 * 返回上一级
 */
function handleGoBack() {
	const routes = getCurrentPages(); // 获取当前打开过的页面路由数组  
	const routesLen = routes.length;
	if (routesLen > 1) {
		uni.navigateBack({
			delta: 1
		});
	} else {
		// 在H5端开发时改动代码触发刷新/手动刷新当前页面后, routesLen = 1, 若直接用uni.navigateBack()会反复刷新当前页, 这种情况可直接跳转至首页  
		uni.switchTab({
			url: '/pages/index/index'
		});
	}
}
// 跳转指定页面
function handleNavTo(url) {
	uni.navigateTo({
		url
	})
}
// 静态块跳转
function staticBlockJump(data) {
	if(data && data.route) {
		const type = data.routeType || 'navigateTo'
		uni[type]({
			url:data.route
		})
	}
}
// 动态开启关闭下拉刷新
function isPullDown(isPull) {
	// #ifdef APP-PLUS
	//获取当前 Webview 窗口对象
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];  
	const currentWebview = page.$getAppWebview();
	//根据状态值来切换禁用/开启下拉刷新
	currentWebview.setStyle({  
	  pullToRefresh: {  
		support: isPull,
		style:'circle'  
	  }  
	});
	//#endif
}
//判断元素是否存在
function elementExists(selector) {
	try{
	  return new Promise((resolve, reject) => {
		uni.createSelectorQuery()
		  .select(selector)
		  .boundingClientRect(rect => {
			if (rect) {
			  resolve(true);
			} else {
			  resolve(false);
			}
		  })
		  .exec();
	  });
	} catch(e){
		
	}
}
//创建Observer监听器
function createIntersectionObserver(){
	try{
		const observer = uni.createIntersectionObserver(this, {
		  thresholds: [0.5]
		});
		return observer;
	} catch(e){
		
	}
}
//可视区域
function observeVisibility(observer, el, callback,  options = { threshold: 0.5, delay: 600 }) {
	//#ifdef H5
		let targetElement = document.querySelector(el);
		return observeH5ElementVisibility(targetElement, callback,options);
	// #endif
	elementExists(el).then(() => {
		let visibleTimeout = null;
		let isCurrentlyVisible = false;
		try {
			observer.relativeToViewport().observe(el, (entry) => {
				if (entry.intersectionRatio >= options.threshold) {
				  // 如果目标元素至少 50% 可见
				  if (!isCurrentlyVisible) {
					isCurrentlyVisible = true;
					// 启动计时器
					visibleTimeout = setTimeout(() => {
					  if (isCurrentlyVisible && entry.intersectionRatio >= options.threshold) {
						callback(entry.id);
					  }
					}, options.delay); // 1 秒钟
				  }
				} else {
				  // 如果目标元素不再符合条件，清除计时器
				  if (isCurrentlyVisible) {
					clearTimeout(visibleTimeout);
					visibleTimeout = null;
					isCurrentlyVisible = false;
				  }
				}
			})
		} catch(e){
			
		}
	})
}
//曝光检测
function observeH5ElementVisibility(targetElement, callback, options = { threshold: 0.5, delay: 600 }) {
	try{
		var timer = null;
		var observer = new IntersectionObserver((entries) => {
		    entries.forEach(entry => {
		        if (entry.isIntersecting && entry.intersectionRatio >= options.threshold) {
		            if (!timer) {
		                timer = setTimeout(() => {
		                    if (entry.isIntersecting && entry.intersectionRatio >= options.threshold){
		                        callback();
		                    }
		                    // 触发回调后清除定时器
		                    timer = null;
		                }, options.delay);
		            }
		        } else {
		            if (timer) {
		                clearTimeout(timer);
		                timer = null;
		            }
		        }
		    });
		}, {
		    threshold: [options.threshold] // 50% visibility
		});
		
		observer.observe(targetElement);
	} catch(e){
		
	}
}

/* 
  将价格区分为整数加小数
*/
function transformPrice(value, key) {
	if (value == null || value == undefined) {
		value = 0.00
	}
	const intLabel = `${key}_int`, decimalLabel =  `${key}_decimal`
	const valueArr = value.toString().split('.');
	return {
		[intLabel]: valueArr[0],
		[decimalLabel]: valueArr[1] ? `.${valueArr[1]}` : '.00'
	}
}

module.exports = {
	handleGoBack,
	handleNavTo,
	staticBlockJump,
	isPullDown,
	createIntersectionObserver,
	observeVisibility,
	transformPrice
}
