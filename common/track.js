import google from "@/common/google.js"
import facebook from "@/common/facebook.js"
import matomo from "@/common/matomo.js"
export default {
	//app加载
	app_open(){
		google.app_open();
		facebook.app_open();
		matomo.app_open();
	},
	//页面浏览
	pageView(data){
		matomo.pageView(data);
	},
	//强更
	app_force_update(){
		google.app_force_update();
	},
	//普通更新
	app_update(){
		google.app_update();
	},
	//取消更新
	app_update_cancel(){
		google.app_update_cancel();
	},
	//查看列表产品
	view_list_item(category){
		google.view_list_item(category);
		facebook.view_list_item(category);
	},
	//浏览分类主页
	cate_index_view(){
		matomo.cate_index_view();
	},
	//搜索
	search(keyword){
		google.search(keyword);
		facebook.search(keyword);
		matomo.search(keyword);
	},
	//曝光当个产品
	impression_product_item(product, index){
		matomo.impression_product_item(product, index);
	},
	//查看当个产品
	view_item(product){
		google.view_item(product);
		facebook.view_item(product);
		matomo.view_item(product);
	},
	//查看当个产品
	quick_view_item(product){
		matomo.quick_view_item(product);
	},
	//列表选择产品
	select_item(data){
		google.select_item(data);
		facebook.select_item(data);
	},
	//add_to_wish
	add_to_wishlist(product){
		google.add_to_wishlist(product);
		facebook.add_to_wishlist(product);
		matomo.add_to_wishlist(product);
	},
	//remove_to_wish
	remove_wishlist(product){
		matomo.remove_wishlist(product);
	},
	//添加购物车
	add_to_cart(product, quantity){
		google.add_to_cart(product, quantity);
		facebook.add_to_cart(product, quantity);
		matomo.add_to_cart(product, quantity);
	},
	//删除购物车
	remove_from_cart(product, currency){
		google.remove_from_cart(product, currency);
		facebook.remove_from_cart(product, currency);
		matomo.remove_from_cart(product, currency);
	},
	//查看购物车
	view_cart(){
		google.view_cart();
		facebook.view_cart();
		matomo.view_cart();
	},
	//checkout
	checkout(checkout){
		google.checkout(checkout);
		facebook.checkout(checkout);
		matomo.checkout(checkout);
	},
	choose_shipping_method(data){
		google.choose_shipping_method(data);
		facebook.choose_shipping_method(data);
		matomo.choose_shipping_method(data);
	},
	add_billing_info(){
		google.add_billing_info();
		facebook.add_billing_info();
		matomo.add_billing_info();
	},
	//add_shipping_info
	add_shipping_info(){
		google.add_shipping_info();
		facebook.add_shipping_info();
		matomo.add_shipping_info();
	},
	//add_payment_info
	add_payment_info(data){
		google.add_payment_info(data);
		facebook.add_payment_info(data);
		matomo.add_payment_info(data);
	},
	place_order(checkout){
		google.place_order(checkout);
		facebook.place_order(checkout);
		matomo.place_order(checkout);
	},
	//结账
	purchase (order){
		google.purchase(order);
		facebook.purchase(order);
		matomo.purchase(order);
	},
	//登录
	login(data){
		google.login(data);
		facebook.login(data);
		matomo.login(data);
	},
	//注册
	sign_up(data){
		google.sign_up(data);
		facebook.sign_up(data);
		matomo.sign_up(data);
	},
	//申请退款
	refund(data){
		google.refund(data);
		facebook.refund(data);
	},
	//签到
	checkin(data){
		google.checkin(data);
		facebook.checkin(data);
	},
	//shareProduct
	shareProduct(data){
		google.shareProduct(data);
		facebook.shareProduct(data);
	},
	//shareandwin
	shareandwin(){
		google.shareandwin();
		facebook.shareandwin();
	},
	//分享站点
	shareSite(data){
		google.shareSite(data);
		facebook.shareSite(data);
	},
	//首页banner点击
	banner_click(index, data){
		google.banner_click(index, data);
		facebook.banner_click(index, data);
	},
	//裂变邀请码复制
	share_code(data){
		matomo.share_code(data);
	},
	//打开分享弹框
	open_share_code(data){
		matomo.open_share_code(data);
	},
	//push消息点击
	appPushClick(msg, payload){
		matomo.appPushClick(msg, payload);
	},
	appPushClickLog(msg){
		matomo.appPushClickLog(msg);
	},
	//app消息接受
	appPushReceiveLog(msg){
		matomo.appPushReceiveLog(msg);
	}
}
