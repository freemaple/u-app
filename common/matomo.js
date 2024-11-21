import store from "@/store"
import md5 from "@/common/md5.js"
import config from "@/config.js"
import utils from "../common/utils";
let matomoUrl = config.matomoUrl;
let idsite = config.matomoSiteid;
const domainUrl = "http://127.0.0.1:8080";
import $mUtils from '@/utils/util.js';
export default {
	//请求
	request(data){
		// #ifdef H5
			return false;
		// #endif
		var d = new Date();
		return new Promise((resolve, reject) => {
			let url = domainUrl + this.pageUrl(1);
			let systemInfo = uni.getSystemInfoSync();
			var query = {
				idsite: idsite,
				rec: 1,
				r: this.generateRandomNumber(),
				h: d.getHours(),
				m: d.getMinutes(),
				s: d.getSeconds(),
				uid: this.getUserId(),
				_id: this.getId(),
				url: url,
				res: "" + systemInfo.windowWidth + "x" + systemInfo.windowHeight
			}
			query = { ...query,
				...data
			};
			if(!query.cvar){
				query.cvar = {};
			}
			if(!query.cvar['2']){
				let module_data_str = this.moduleData({});
				if(module_data_str){
					query.cvar['2'] = ['module_data', module_data_str];
				}
			}
			if(query.cvar){
				query.cvar = JSON.stringify(query.cvar);
			}
			
			let options = {
				url: matomoUrl + "/matomo.php",
				method: "POST",
				data: query,
				dataType: "json",
				header: {
					"Accept": "application/json",
					"content-type": "application/x-www-form-urlencoded"
				},
				success: (res) => {
					
				},
				fail: (res) => {
					
				}
			}
			uni.request(options);
		})
	},
	//6位随机数
	generateRandomNumber() {
	  return Math.floor(100000 + Math.random() * 900000); // 生成100000到999999之间的随机整数
	},
	//页面地址
	pageUrl(i){
		let pages = getCurrentPages();
		let pageUrl = '';
		let path = '';
		if(pages.length > 0){
			let c_page = pages[pages.length - i] || false;
			if(!c_page){
				pageUrl = '';
				return pageUrl;
			}
			//#ifdef H5
			let route = c_page.$route;
			path = route && route.path ? route.path : '';
			pageUrl = route.fullPath;
			//#endif
			//#ifndef H5
			path = c_page.route;
			pageUrl = '/' + path;
			var param = [];
			for (let key in c_page.options) {
			    param.push(key + '=' + c_page.options[key]);
			}
			if(param.length > 0){
				pageUrl += "?" + param.join("&");
			}
			//#endif
		}
		let appVersionCode = this.getAppVersionCode();
		if(pageUrl && appVersionCode){
			if(pageUrl.indexOf("?") != -1){
				pageUrl +="&app_v=" + appVersionCode;
			} else {
				pageUrl +="?app_v=" + appVersionCode;
			}
		}
		return pageUrl;
	},
	//页面浏览
	pageView(data){
		this.request(data);
	},
	//事件跟踪
	trackEvent(data){
		this.request(data);
	},
	//自定义点击事件
	custom_event(data){
		let event_type = data.event_type ? data.event_type : 'click';
		let cvar = {"1":["event_type", event_type]};
		let module_data_str = this.moduleData(data);
		if(module_data_str){
			cvar['2'] = ['module_data', module_data_str];
		}
		var track_data = {
			e_c: data.event_category,
			e_a: data.event_action,
			e_n: data.event_name || '',
			cvar: cvar
		};
		if(data.event_value){
			track_data['e_v'] = data.event_value;
		}
		if(data.product_sku){
			track_data['_pks'] = data.product_sku;
		}
		if(data.product_name){
			track_data['_pkn'] = data.product_name;
		}
		if(data.product_price){
			track_data['_pkp'] = data.product_price;
		}
		if(data.ec_items){
			track_data['ec_items'] = data.ec_items;
		}
		this.trackEvent(track_data);
	},
	//自定义曝光事件
	impression_event(data){
		data.event_type = 'impression';
		this.custom_event(data);
	},
	//自定义曝光事件
	visit_event(data){
		data.event_type = 'visit';
		if(!data.event_data){
			data.event_data = {};
		}
		let event_data = this.page_query_data();
		data.event_data = {...data.event_data,
			...event_data
		};
		this.custom_event(data);
	},
	page_query_data(){
		let event_data = {};
		try{
			let page_url = this.pageUrl(1);
			let insite_mkt_type = this.getQueryVariable(page_url, 'insite_mkt_type');
			let message_id = this.getQueryVariable(page_url, 'message_id');
			if(insite_mkt_type){
				event_data.insite_mkt_type = insite_mkt_type;
			}
			if(message_id){
				event_data.message_id = message_id;
			}
			let utm_source = this.getQueryVariable(page_url, "utm_source");
			let utm_medium = this.getQueryVariable(page_url, "utm_medium");
			let utm_campaign = this.getQueryVariable(page_url, "utm_campaign");
			if(utm_source){
				event_data.utm_source = utm_source;
			}
			if(utm_medium){
				event_data.utm_medium = utm_medium;
			}
			if(utm_campaign){
				event_data.utm_campaign = utm_campaign;
			}
			let switchIndex = $mUtils.checkSwitch(page_url);
			if (switchIndex != -1) {
				var push_data = store.state.pushData;
				if(push_data){
					if(push_data.insite_mkt_type){
						event_data.insite_mkt_type = push_data.insite_mkt_type;
					}
					if(push_data.message_id){
						event_data.message_id = push_data.message_id;
					}
					store.commit('SET_PUSHDATA', {});
				}
			}
		} catch(e){
			
		}
		return event_data;
	},
	//设备id
	getDeviceId(){
		let deviceId = utils.getDeviceId();
		return deviceId;
	},
	//mauid
	getMaId(){
		let ma_id = this.getDeviceId();
		return ma_id;
	},
	//_id参数
	getId(){
		let systemInfo = uni.getSystemInfoSync();
		let deviceId = systemInfo.deviceId;
		deviceId = md5(deviceId).substring(0, 16);
		return deviceId;
	},
	//用户id
	getUserId(){
		let global_mauid = store.state.global_mauid;
		if(!global_mauid){
			global_mauid = this.getMaId();
		}
		return global_mauid;
	},
	//模块数据
	moduleData(data){
		let appVersionCode = this.getAppVersionCode();
		if(appVersionCode){
			appVersionCode =  "" + appVersionCode;
		}
		let deviceId = this.getDeviceId();
		let module_data = {'app_v': appVersionCode, 'device_id': deviceId};
		if(data){
			let mkeys = ['rec_code', 'rec_engine', 'module','ab_key'];
			mkeys.forEach((mkey, index) => {
				if(data[mkey]){
					if(!module_data){
						module_data = {};
					}
					module_data[mkey] = data[mkey];
				}
			})
		}
		//自定义的事件数据
		if(data.event_data && typeof data.event_data == 'object'){
			for(var e_key in data.event_data){
				module_data[e_key] = data.event_data[e_key];
			}
		}
		let module_data_str = module_data ? JSON.stringify(module_data) : '';
		return module_data_str;
	},
	getAppVersionCode(){
		let appVersionCode = utils.getAppVersionCode();
		return appVersionCode;
	},
	getQueryVariable(url, variable){
		if(!url){
			return '';
		}
		if(url.split("?").length <=1){
			return '';
		}
	    var q = url.split("?")[1];
	    var vars = q.split("&");
	    for (var i=0;i<vars.length;i++) {
	        var pair = vars[i].split("=");
	        if(pair[0] == variable){return pair[1];}
	    }
	    return(false);
	},
	//app_open
	app_open(){
		this.custom_event({
			event_category: 'app',
			event_action: 'appopen',
			event_name: 'appopen'
		});
	},
	//app_open
	app_visit(data){
		this.visit_event({
			event_category: 'app',
			event_action: 'app_visit',
			event_name: 'app_visit',
			event_data: data
		});
	},
	//launching_app
	launching_app(){
		this.custom_event({
			event_category: 'app',
			event_action: 'launching_app',
			event_name: 'launching app'
		});
	},
	//搜索页面
	search(keyword){
		var data = {
			action_name: 'search-' + keyword,
			search: keyword,
			search_cat: 'product',
			cvar: {"1":["page_type","search"]}
		}
		this.pageView(data);
	},
	//分类主页
	cateIndexView(){
		var data = {
			action_name: 'category',
			cvar: {"1":["page_type","category"]}
		}
		this.pageView(data);
	},
	//分类页面
	cateListView(category){
		var data = {
			action_name: 'category-' + category.name,
			_pkc: category.name,
			cvar: {"1":["page_type","category_view"]}
		}
		this.pageView(data);
	},
	impression_product_item(product, index){
		if(product.sku){
			var data = {
				e_c: 'product',
				e_a: 'product_impression',
				e_n: 'product_impression',
				_pks: product.sku,
				_pkn: product.name || '',
				cvar: {"1":["event_type","impression"]}
			}
			product.event_data =  {
				goods_location: index + 1
			};
			let module_data_str = this.moduleData(product);
			if(module_data_str){
				data['cvar']['2'] = ['module_data', module_data_str];
			}
			setTimeout(() => {
				this.trackEvent(data);
			}, 0);
		}
	},
	//浏览产品
	product_click(track_data, index){
		track_data.event_data =  {
			goods_location: index + 1
		};
		var data = {
			e_c: 'product',
			e_a: 'product_click',
			e_n: 'product_click',
			_pks: track_data.sku,
			_pkn: track_data.name,
			cvar: {"1":["event_type","click"]}
		}
		let module_data_str = this.moduleData(track_data);
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//浏览产品
	view_item(track_data){
		var data = {
			action_name: 'product-' + track_data.name,
			e_c: 'product',
			e_a: 'product_view',
			e_n: 'product_view',
			_pks: track_data.sku,
			_pkn: track_data.name,
			cvar: {"1":["event_type","click"]}
		}
		let module_data_str = this.moduleData(track_data);
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//quick view
	quick_view_item(track_data){
		if(!track_data.event_data){
			track_data.event_data = {};
		}
		let event_data = {'view_type': 'quick_view'};
		track_data.event_data = { ...track_data.event_data,
			...event_data
		}
		this.view_item(track_data);
	},
	//add_to_wish
	add_to_wishlist(track_data){
		var data = {
			e_c: 'wishlist',
			e_a: 'wishlist_add_button',
			e_n: 'wishlist_add_button',
			_pks: track_data.sku,
			_pkn: track_data.name,
			cvar: {"1":["event_type","click"]}
		}
		let module_data_str = this.moduleData(track_data);
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//remove_wishlist
	remove_wishlist(track_data){
		var data = {
			e_c: 'wishlist',
			e_a: 'wishlist_remove_button',
			e_n: 'wishlist_remove_button',
			_pks: track_data.sku,
			_pkn: track_data.name,
			cvar: {"1":["event_type","click"]}
		}
		let module_data_str = this.moduleData(track_data);
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//添加购物车
	add_to_cart(product, quantity){
		var price = parseFloat(product.price_info.price.value);
		if(product.price_info && product.price_info.special_price && product.price_info.special_price.value){
			price = parseFloat(product.price_info.special_price.value);
		}
		if(product.member_product && product.isVip){
			price = parseFloat(product.member_price.value);
		}
		var data = {
			e_c: 'add_cart',
			e_a: 'add_cart_button',
			e_n: 'add_cart_button',
			e_v: quantity,
			_pks: product.sku,
			_pkn: product.name,
			_pkp: price,
			cvar: {"1":["event_type","click"], "3":["quantity", quantity]}
		}
		let module_data_str = this.moduleData(product);
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//添加购物车
	remove_from_cart(product, currency){
		var data = {
			e_c: 'cart',
			e_a: 'cart_delete_button',
			e_n: 'cart_delete_button',
			e_v: product.qty,
			_pks: product.sku,
			_pkn: product.name,
			cvar: {"1":["event_type","click"], "3":["quantity", product.qty]},
		}
		let module_data_str = this.moduleData({
			module: "cart",
			event_data: {
				num: product.qty
			}
		});
		if(module_data_str){
			data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(data);
	},
	//查看购物车
	view_cart(){
		var data = {
			action_name: 'cart',
			cvar: {"1":["page_type","view_cart"]}
		}
		this.pageView(data);
		this.view_cart_page();
	},
	//查看购物车
	view_cart_page(){
		this.impression_event({
			event_category: 'cart',
			event_action: 'cart_page',
			event_name: 'cart_page',
			module: 'cart'
		});
	},
	//查看结账
	view_checkout_page(){
		this.impression_event({
			event_category: 'checkout',
			event_action: 'checkout_page',
			event_name: 'checkout_page',
			module: 'checkout'
		});
	},
	//checkout
	checkout(checkout){
		var items = [];
		checkout.items.forEach((item, index) => {
			items.push([item.sku,item.name,"", parseFloat(item.price),item.quantity])
		});
		var data = {
			action_name: 'checkout',
			revenue: checkout.base_total,
			ec_items: JSON.stringify(items),
			cvar: {"1":["page_type","checkout"]}
		}
		this.pageView(data);
		let track_data = {
			e_c: 'cart',
			e_a: 'cart_checkout_button',
			e_n: 'cart_checkout_button',
			revenue: checkout.base_total,
			ec_items: JSON.stringify(items),
			cvar: {"1":["event_type","click"]}
		};
		let module_data_str = this.moduleData({
			module: "cart",
		});
		if(module_data_str){
			track_data['cvar']['2'] = ['module_data', module_data_str];
		}
		this.trackEvent(track_data);
	},
	//选择运输方式
	choose_shipping_method(data){
		this.custom_event({
			event_category: 'checkout',
			event_action: 'shipping_methods_button',
			event_name: 'shipping_methods_button',
			event_value: data.shipping_method,
			module: "checkout",
			event_data: {
				event_value: data.shipping_method,
				on_time: data.on_time,
				split_packages: data.split_packages
			}
		});
	},
	//添加billing付款地址
	add_billing_info(){
		this.custom_event({
			event_category: 'checkout',
			event_action: 'add_billing_info',
			event_name: 'add_billing_info'
		});
	},
	//添加地址信息
	add_shipping_info(){
		this.custom_event({
			event_category: 'checkout',
			event_action: 'add_shipping_info',
			event_name: 'add_shipping_info'
		});
	},
	//添加地址信息
	add_payment_info(data){
		this.custom_event({
			event_category: 'checkout',
			event_action: 'payment_methods_button',
			event_name: 'payment_methods_button',
			module: "checkout",
			event_data: {
				event_value: data.payment_method
			}
		});
	},
	//place order
	place_order(checkout){
		this.custom_event({
			event_category: 'checkout',
			event_action: 'place_order_button',
			event_name: 'place_order_button',
			module: "checkout",
			event_value: parseFloat(checkout.value)
		});
	},
	//结账
	purchase (order){
		var items = [];
		order.products.forEach((o_item, o_index) => {
			if(o_item.products){
				o_item.products.forEach((item, index) => {
					items.push([item.sku,item.name,"", parseFloat(item.base_price), parseInt(item.qty)])
				});
			}
		});
		let params = {
			action_name: 'purchase',
			ec_id: order.increment_id,
			idgoal: 0,
			currency: order.order_currency_code,
			revenue: parseFloat(order.base_grand_total), // Total Revenue
			ec_st: parseFloat(order.base_subtotal),
			ec_tx: parseFloat(order.base_tax_total),
			ec_sh: parseFloat(order.base_shipping_total),
			ec_items: JSON.stringify(items)
		};
		this.pageView(params);
	},
	//登录
	login(data){
		this.custom_event({
			event_category: 'login',
			event_action: 'login',
			event_name: 'login'
		});
	},
	//注册
	sign_up(data){
		this.custom_event({
			event_category: 'sign_up',
			event_action: 'sign_up',
			event_name: 'sign_up'
		});
	},
	//复制裂变邀请码
	share_code_old(data){
		var event_category = "distribute_share_code"; //事件类别
		var event_action = data.hasOwnProperty("event_action") ? data["event_action"] : "";//事件action: copy_code/copy_link_app/copy_link_app_email等
		var event_name = data.hasOwnProperty("event_name") ? data["event_name"] : ""; //事件名称
		var cvar_vals = {"1":["app_name","appserver"]}; //自定义变量
		var copy_val = data.hasOwnProperty("copy_val") ? data["copy_val"] : ""; //复制的值，code或url
		var data_share_link_type = data.hasOwnProperty("data_share_link_type") ? data["data_share_link_type"] : ""; //分享渠道,app/web
		var share_type = data.hasOwnProperty("share_type") ? data["share_type"] : ""; //分享的app, email/facebook等

		if(copy_val){
			cvar_vals["2"] = ["copy_val",copy_val];
		}
		if(data_share_link_type){
			cvar_vals["3"] = ["data_share_link_type",data_share_link_type];
		}
		if(share_type){
			cvar_vals["4"] = ["share_type",share_type];
		}
		var data = {
			e_c: event_category,
			e_a: event_action, 
			e_n: event_name, 
			cvar: cvar_vals 
		}
		this.request(data);
	},
	//复制裂变邀请码
	share_code(data){
		var event_category = "distribute_share_code"; //事件类别
		var event_action = data.hasOwnProperty("event_action") ? data["event_action"] : "";//事件action: copy_code/copy_link_app/copy_link_app_email等
		var event_name = data.hasOwnProperty("event_name") ? data["event_name"] : ""; //事件名称
		var cvar_vals = {"1":["app_name","app"]}; //自定义变量
		var copy_val = data.hasOwnProperty("copy_val") ? data["copy_val"] : ""; //复制的值，code或url
		var data_share_link_type = data.hasOwnProperty("data_share_link_type") ? data["data_share_link_type"] : ""; //分享渠道,app/web
		var share_type = data.hasOwnProperty("share_type") ? data["share_type"] : ""; //分享的app, email/facebook等
	
		if(copy_val){
			cvar_vals["2"] = ["copy_val",copy_val];
		}
		if(data.from_page){
			cvar_vals["3"] = ["from_page",data.from_page];
		}
		if(share_type){
			cvar_vals["4"] = ["share_type",share_type];
		}
		if(data.product_id){
			cvar_vals["5"] = ["product_id", data.product_id];
		}
		var data = {
			e_c: event_category,
			e_a: event_action, 
			e_n: event_name, 
			cvar: cvar_vals 
		}
		this.request(data);
	},
	//打开分享弹框
	open_share_code(data){
		let event_category = "distribute_share_code"; //事件类别
		let e_n = '';
		if(!data['event_name']){
			e_n = 'open share';
		} else {
			e_n = data['event_name'];
		}
		let cvar = {"1":["app_name","app"],"3":["from_page",data.from_page]};
		if(data.product_id){
			cvar["5"] = ["product_id", data.product_id];
		}
		var track_data = {
			e_c: event_category,
			e_a: data.event_action || '',
			e_n: e_n,
			cvar: cvar
		};
		this.trackEvent(track_data);
	},
	//消息点击
	appPushClick(msg, payload){
		let client_type = uni.getSystemInfoSync().platform;
		let event_data = {
			insite_mkt_type: 'push',
			client_type: client_type
		}
		if(payload.message_id){
			event_data.message_id = payload.message_id;
		}
		this.custom_event({
			event_category: 'push',
			event_action: 'push_click',
			event_name: 'push_click',
			event_data: event_data
		});
	},
	//消息点击日志
	appPushClickLog(msg){
		let client_type = uni.getSystemInfoSync().platform;
		let event_data = {
			msg: JSON.stringify(msg),
			client_type: client_type
		}
		this.custom_event({
			event_category: 'push_log',
			event_action: 'push_click_log',
			event_name: 'push_click_log',
			event_data: event_data
		});
	},
	//消息接受日志
	appPushReceiveLog(msg){
		let client_type = uni.getSystemInfoSync().platform;
		let event_data = {
			msg: JSON.stringify(msg),
			client_type: client_type
		}
		this.custom_event({
			event_category: 'push_log',
			event_action: 'push_receive_log',
			event_name: 'push_receive_log',
			event_data: event_data
		});
	}
}
