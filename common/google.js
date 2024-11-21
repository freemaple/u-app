import config from "@/config.js"
import utils from "@/common/utils.js"
export default {
	//谷歌跟踪
	event(event_name, data){
		try{
			if(config.env != 'production'){
				return false;
			}
			// #ifdef APP-PLUS
			let platform = uni.getSystemInfoSync().platform;
			if(data){
				data.platform = platform;
			} else {
				data = {
					platform: platform
				}
			}
			//用户级事件处理
			if(data.isUsersEventDate){
				let is_users_event = this.isUsersEventToday(event_name);
				if(is_users_event){
					data[event_name + "_users"] = 1;
				}
				delete data.isUsersEventDate;
				this.setUsersEventDateCache(event_name);
			}
			if(platform == 'android'){
				this.androidEvent(event_name, data);
			}
			else if(platform == 'ios'){
				if(data){
					plus.ios.invoke('FIRAnalytics', 'logEventWithName:parameters:', event_name, data);
				} else {
					plus.statistic.eventTrig(event_name);
				}
			}
			// #endif
		} catch(e) {
			
		}
	},
	//判断当天是否已有事件
	isUsersEventToday(event_name){
		let cache_key = event_name + '_users_event_date';
		let is_users_event = 0;
		let event_date = uni.getStorageSync(cache_key);
		let date = utils.currentDate();
		if(!event_date || date != event_date){
			is_users_event = 1;
		}
		return is_users_event;
	},
	//设置每天时间缓存
	setUsersEventDateCache(event_name){
		let cache_key = event_name + '_users_event_date';
		let date = utils.currentDate();
		uni.setStorageSync(cache_key, date);
	},
	androidEvent(event_name, data){
		let mainActivity = plus.android.runtimeMainActivity();
		let FirebaseAnalytics = plus.android.importClass("com.google.firebase.analytics.FirebaseAnalytics");
		let mFirebaseAnalytics = FirebaseAnalytics.getInstance(mainActivity);
		if(data){
			let bundle = this.objectToBundle(data);
			mFirebaseAnalytics.logEvent(event_name, bundle);
		} else {
			mFirebaseAnalytics.logEvent(event_name);
		}
	},
	objectToBundle(obj){
		let Bundle = plus.android.importClass("android.os.Bundle");
		let params = new Bundle(); 
		for(let i in obj){
			var val = obj[i];
			if(typeof val == 'string'){
				params.putString(i, val);
			}
			if(typeof val == 'number'){
				params.putFloat(i, val);
			}
			if(typeof val == 'object'){
				let Parcelable = plus.android.importClass("android.os.Parcelable");
				var arr = [];
				val.forEach((v, v_index) => {
					let parm = new Bundle(); 
					for(var k in v){
						if(typeof v[k] == 'string'){
							params.putString(k, v[k]);
						}
						if(typeof v[k] == 'number'){
							params.putFloat(k, v[k]);
						}
					}
					arr.push(new Parcelable(parm));
				})
				params.putParcelableArray(i, arr);
			}
		}
		return params;
	},
	//app加载
	app_open(){
		var data = {
			isUsersEventDate: 1
		}
		this.event('app_open', data);
	},
	//强更
	app_force_update(){
		this.event('app_forceupdate_click');
	},
	//普通更新
	app_update(){
		this.event('app_update_click');
	},
	//取消更新
	app_update_cancel(){
		this.event('app_updatecancel_click');
	},
	//查看产品列表
	view_list_item(category){
		var items = [];
		category.products.forEach((product, index) => {
			if(product.sku){
				items.push({
					item_id: product.sku,
					item_name: product.name,
					price: product.price.value && parseFloat(product.price.value)
				});
			}
		});
		let params = {};
		if(category.id){
			params.item_list_id = category.id;
		}
		if(category.name){
			params.name = category.name;
		}
		if(items.length){
			params.items = items;
		}
		this.event('view_item_list', params);
	},
	//搜索
	search(keyword){
		this.event('search', {
			search_term: keyword
		});
	},
	//查看产品
	view_item(product){
		let param = {
			item_id: product.sku,
			item_name: product.name,
			price: parseFloat(product.price_info.price.value),
			currency: product.price_info.price.code,
			value: parseFloat(product.price_info.price.value)
		}
		this.event('view_item', param);
	},
	select_item(data){
		this.event('select_item', data);
	},
	//添加收藏夹
	add_to_wishlist(product){
		let param = {
			item_id: product.sku,
			item_name: product.name
		};
		this.event('add_to_wishlist', param);
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
		let param = {
			item_id: product.sku,
			item_name: product.name,
			currency: product.price_info.price.code,
			price: price,
			quantity: quantity,
			value: quantity * price
		};
		param.isUsersEventDate = 1;
		this.event('add_to_cart', param);
	},
	remove_from_cart(product, currency){
		let param = {
			item_id: product.sku,
			item_name: product.name,
			currency: currency.code,
			price: parseFloat(product.product_price),
			quantity: product.qty,
			value: product.qty * parseFloat(product.product_price)
		};
		this.event('remove_from_cart', param);
	},
	view_cart(){
		this.event('view_cart');
	},
	checkout(checkout){
		var items = this.productItems(checkout.items);
		this.event('begin_checkout', {
			currency: checkout.currency,
			value: parseFloat(checkout.value), // Total Revenue
			items: items,
			isUsersEventDate: 1
		});
	},
	add_billing_info(){
		this.event('add_billing_info');
	},
	add_shipping_info(){
		this.event('add_shipping_info');
	},
	add_payment_info(data){
		this.event('add_payment_info', data);
	},
	choose_shipping_method(data){
		this.event('choose_shipping_method', data);
	},
	place_order(checkout){
		this.event('place_order', {
			currency: checkout.currency,
			value: parseFloat(checkout.value), // Total Revenue
			payment_type: checkout.payment_type,
			items: this.productItems(checkout.items)
		});
	},
	productItems(products){
		var items = [];
		products.forEach((item, index) => {
			items.push({
				item_id: item.sku,
				item_name: item.name,
				price: parseFloat(item.price),
				quantity: item.quantity
			})
		});
		return items;
	},
	//结账
	purchase (order){
		var items = [];
		order.products.forEach((o_item, o_index) => {
			if(o_item.products){
				o_item.products.forEach((item, index) => {
					items.push({
						item_id: item.sku,
						item_name: item.name,
						price: parseFloat(item.price),
						quantity: parseInt(item.qty)
					});
				});
			}
		});
		let params = {
		  transaction_id: order.increment_id,
		  currency: order.order_currency_code,
		  value: parseFloat(order.grand_total), // Total Revenue
		  tax: parseFloat(order.tax_total),
		  shipping: parseFloat(order.shipping_total),
		  items: items
		};
		this.event('purchase', params)
	},
	//登录
	login(data){
		data.isUsersEventDate = 1;
		this.event('login', data);
	},
	//注册
	sign_up(data){
		data.isUsersEventDate = 1;
		this.event('sign_up', data);
	},
	//申请退款
	refund(data){
		this.event('refund', data);
	},
	//checkin
	checkin(data){
		this.event('checkin', data);
	},
	//shareProduct
	shareProduct(data){
		this.event('shareProduct', data);
	},
	//shareandwin
	shareandwin(){
		this.event('share_and_win');
	},
	//分享站点
	shareSite(data){
		this.event('shareSite', data);
	},
	//banner点击
	banner_click(index, data){
		this.event('banner_' + index + "_click", data);
	}
}