import config from "@/config.js"
// #ifdef APP-PLUS
import {fbEvent} from "@/uni_modules/ut-fb";
// #endif
export default {
	//fb跟踪
	event(event_name, data){
		try{
			if(config.env != 'production'){
				return false;
			}
			// #ifdef APP-PLUS
			let platform = uni.getSystemInfoSync().platform;
			if(data){
				data.platform = platform;
			}
			if(platform == 'android'){
				this.androidEvent(event_name, data);
			}
			else if(platform == 'ios'){
				this.iosEvent(event_name, data);
			}
			// #endif
		} catch(e) {
			
		}
	},
	androidEvent(event_name, data){
		let mainActivity = plus.android.runtimeMainActivity();
		let AppEventsLogger = plus.android.importClass("com.facebook.appevents.AppEventsLogger");
		let logger = new AppEventsLogger.newLogger(mainActivity);
		if(data){
			let bundle = this.objectToBundle(data);
			logger.logEvent(event_name, bundle);
		} else {
			logger.logEvent(event_name);
		}
	},
	objectToBundle(obj){
		let Bundle = plus.android.importClass("android.os.Bundle");
		let bundle = new Bundle(); 
		for(let i in obj){
			var val = obj[i];
			if(typeof val == 'string'){
				bundle.putString(i, val);
			}
			if(typeof val == 'number'){
				bundle.putDouble(i, val);
			}
		}
		return bundle;
	},
	iosEvent(event_name, data) { 
		if(!data || typeof data != 'object'){
			data = {};
		}
		fbEvent(event_name, JSON.stringify(data));
	},
	app_open(){
		this.event('app_open');
	},
	search(keyword){
		this.event('fb_mobile_search', {
			fb_content_type: "product",
			fb_search_string: keyword
		})
	},
	eventName(name){
		let AppEventsConstants = plus.android.importClass("com.facebook.appevents.AppEventsConstants");
		let event_name = AppEventsConstants[name];
		return event_name;
	},
	//查看产品列表
	view_list_item(category){
		var items = [];
		category.products.forEach((product, index) => {
			if(product.sku){
				items.push({
					id: product.sku,
					name: product.name,
					price: product.price.value && parseFloat(product.price.value)
				});
			}
		});
		this.event('fb_mobile_content_view_list', {
			fb_content_type: "product",
			fb_category_id : category.id || '',
			fb_description: category.name,
			fb_content: JSON.stringify(items)
		});
	},
	view_item(product){
		let param = {
			fb_content_type: "product",
			fb_currency: product.price_info.price.code,
			fb_content_id : product.sku,
			fb_description: product.name,
			_valueToSum: parseFloat(product.price_info.price.value),
		}
		this.event('fb_mobile_content_view', param);
	},
	select_item(data){
		this.event('select_item', data);
	},
	add_to_wishlist(product){
		let param = {
			fb_content_type: "product",
			fb_content_id : product.sku,
			fb_description: product.name,
		};
		this.event('fb_mobile_add_to_wishlist', param);
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
			fb_content_type: "product",
			fb_currency: product.price_info.price.code,
			fb_content_id : product.sku,
			fb_description: product.name,
			fb_price: price,
			_valueToSum: quantity * price,
			fb_num_items: quantity
		};
		this.event('fb_mobile_add_to_cart', param);
	},
	remove_from_cart(product, currency){
		let param = {
			fb_content_type: "product",
			fb_content_id : product.sku,
			fb_description: product.name,
			fb_currency: currency.code,
			fb_price: parseFloat(product.product_price),
			fb_num_items: product.qty,
			_valueToSum: product.qty * parseFloat(product.product_price)
		};
		this.event('fb_remove_from_cart', param);
	},
	view_cart(){
		this.event('view_cart');
	},
	checkout(checkout){
		var items = this.productItems(checkout.items)
		this.event('fb_mobile_initiated_checkout', {
			fb_content_type: "product",
			fb_currency: checkout.currency,
			_valueToSum: parseFloat(checkout.value), // Total Revenue
			fb_content: JSON.stringify(items)
		});
	},
	add_billing_info(){
		this.event('fb_mobile_add_billing_info');
	},
	add_shipping_info(){
		this.event('fb_mobile_add_shipping_info');
	},
	add_payment_info(data){
		this.event('fb_mobile_add_payment_info', data);
	},
	choose_shipping_method(data){
		this.event('choose_shipping_method', data);
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
	place_order(checkout){
		var items = this.productItems(checkout.items)
		this.event('fb_mobile_place_order', {
			fb_content_type: "product",
			fb_currency: checkout.currency,
			_valueToSum: parseFloat(checkout.value), // Total Revenue
			fb_content: JSON.stringify(items)
		});
	},
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
			fb_currency: order.order_currency_code,
			_valueToSum: parseFloat(order.grand_total), // Total Revenue
			tax: parseFloat(order.tax_total),
			shipping: parseFloat(order.shipping_total),
			fb_content: JSON.stringify(items)
		};
		this.event('fb_mobile_purchase', params);
	},
	//登录
	login(data){
		this.event('login', data);
	},
	//注册
	sign_up(data){
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