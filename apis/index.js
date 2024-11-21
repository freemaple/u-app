import http, {HTTP} from "./http.js";

import config from "../config.js";
import store from "../store"
const baseUrl = config.url;

//获取APP基础数据
export const getBaseData = (data) => http.GET(`${baseUrl}/general/base/getbasedata`, data);
export const postAppDateLog = (data) => http.POST(`${baseUrl}/customer/devicelog/add`, data);

// 用户登录
export const postLoginCheck = (data) => http.POST(`${baseUrl}/customer/login/accountcheck`, data);
export const postLogin = (data) => http.POST(`${baseUrl}/customer/login/account`, data, {error: false});
export const postThirdLogin = (data) => http.POST(`${baseUrl}/customer/login/thirdlogin`, data);
export const postBindcode = (data) => http.POST(`${baseUrl}/customer/account/bindcode`, data);

// register
export const registerInit = (data) => http.GET(`${baseUrl}/customer/register/index`, data);

// posCaptch
export const getCaptch = (data) => http.GET(`${baseUrl}/customer/site/captcha`, data);

// postRegister
export const postRegister = (data) => http.POST(`${baseUrl}/customer/register/account`, data, {error: false});

// 买家个人信息GET
export const buyerUserInfo = (data) => http.GET(`${baseUrl}/customer/account/index`, data);

// WISHLIST
export const getUserWishList = (data) => http.GET(`${baseUrl}/customer/productfavorite/index`, data);
export const removeUserWishList = (data) => http.POST(`${baseUrl}/customer/productfavorite/remove`, data);
// size guide
export const getSizeGuide = (data) => http.GET(`${baseUrl}/catalog/product/getsizebyproductid`,data,{loading:true})
export const sizeGuideInit = (data) => http.GET(`${baseUrl}/catalog/product/sizeguide`,data,{loading:true})
//退出登录
export const logout = () => http.POST(`${baseUrl}/customer/account/logout`);

//修改地址初始化
export const addressInfo = (data) => http.GET(`${baseUrl}/customer/address/edit`, data,{loading:true});
export const addressSave = (data) => http.POST(`${baseUrl}/customer/address/save`, data,{loading:true});
export const addressList = (data,config) => http.GET(`${baseUrl}/customer/address/index`, data,{loading:true,...config});
// 从checkout跳转过去的添加/编辑地址接口
export const addressSaveFromCheckout = (data) => http.POST(`${baseUrl}/checkout/onepage/saveaddress`, data,{loading:true});
// checkout页地址选择
export const addressSelectChange = (data) => http.GET(`${baseUrl}/checkout/onepage/changeaddress`, data,{loading:true});
// billingAddress同步为shippingAddress
export const billingToShipping = (data) => http.POST(`${baseUrl}/checkout/onepage/billingtoshipping`,data);
// 设置默认地址
export const changeAddressDefault = (data,config) => http.POST(`${baseUrl}/customer/address/changedefault`, data,{loading:true,...config});
// 切换国家
export const changecountry = (data) => http.GET(`${baseUrl}/customer/address/changecountry`, data,{loading:true});
// 删除地址
export const deleteAddress = (data) => http.GET(`${baseUrl}/customer/address/remove`, data,{loading:true});

// 产品详情页面
// 获取产品详情
export const reviewHelpful = (data,config) => http.GET(`${baseUrl}/catalog/reviewproduct/reviewhelpful`,data,{loading:true});
export const getProductDetail = (data,config) => http.GET(`${baseUrl}/catalog/product/index`,data,{loading:true,...config});
// 获取产品是否被收藏信息
export const getFavInfo = (data) => http.GET(`${baseUrl}/catalog/product/getfav`,data);
// 取消、添加收藏
export const changeFav = (data) => http.GET(`${baseUrl}/catalog/product/favorite`,data,{loading:true});
// 添加到购物车
export const addShopCar = (data) => http.POST(`${baseUrl}/checkout/cart/add`,data,{loading: true});
// 获取购物车列表
export const getCartList = (data,config) => http.GET(`${baseUrl}/checkout/cart/index`,data,{loading:true,...config});
export const checkCartList = (data,config) => http.GET(`${baseUrl}/checkout/cart/checkcart`,data);
// 获取产品列表
export const getReviewProduct = (data) => http.GET(`${baseUrl}/catalog/reviewproduct/lists`,data);
// 获取收藏列表
export const getfavList = (data,config) => http.GET(`${baseUrl}/customer/productfavorite/index`,data,{loading: true,mask:'false',...config});
// 账户中心删除收藏列表
export const removeCustomerFav = (data) => http.POST(`${baseUrl}/customer/productfavorite/remove`,data,{loading:true});
// 购物车选中和取消选中
export const checkoutCartSelectone = (data) => http.GET(`${baseUrl}/checkout/cart/selectone`,data,{loading:true});
// 更改购物车选择接口
export const updateCartItemoptions = (data) => http.POST(`${baseUrl}/checkout/cart/updateitemoptions`,data);
// 购物车全选接口
export const updateCartSelectAll = (data) => http.GET(`${baseUrl}/checkout/cart/selectall`,data,{loading:true})
// 删除购物车产品-remove;减购物车数量-less_one；加购物车数量-add_one
export const updateCartInfo = (data) => http.POST(`${baseUrl}/checkout/cart/updateinfo`,data,{loading:true})

// 账户页获取信息
export const getAccountMsg = (data) => http.GET(`${baseUrl}/customer/account/index`,data);
// sendActiveEmail
export const sendActiveEmail = (data) => http.POST(`${baseUrl}/customer/account/sendactiveemail`, data);

// 修改密码判断是否需要验证码 
export const queryIfNeedCaptcha = (data) => http.POST(`${baseUrl}/customer/forgot/password`,data);
// 获取分类数据
export const queryCateListWxmenu = (data) => http.GET(`${baseUrl}/general/base/wxmenu`,data);
// 获取checkout页面数据
export const getCheckoutOnepage = (data) => http.GET(`${baseUrl}/checkout/onepage/index`,data,{loading:true,mask:'false'});
// 生成订单
export const createOrder = (data) => http.POST(`${baseUrl}/checkout/onepage/submitorder`,data,{loading:true});
//获取验证码
export const queryCaptcha = (data) => http.GET(`${baseUrl}/customer/site/captcha`,data);
//忘记密码 发送验证码到邮箱
export const postSendCode = (data) => http.POST(`${baseUrl}/customer/forgot/sendcode`,data, {error: false});
// checkout页 用户勾选 购买VIP
export const selectBuyVIP = (data) => http.GET(`${baseUrl}/checkout/onepage/buyvip`,data,{loading:true});

// export const googlePlace = (data) => HTTP({url:"/googlePlace/v1/places:autocomplete",data,header: {"X-Goog-Api-Key": store.state.appConfig.google_maps_key},method: "POST"},{resNoStatus:true})
export const googlePlace = (data) => HTTP({url:"https://places.googleapis.com/v1/places:autocomplete",data,header: {"X-Goog-Api-Key": store.state.appConfig.google_maps_key},method: "POST"},{resNoStatus:true})
// export const googlePlaceDetails = (placeId,data) => HTTP({url:`/googlePlace/v1/places/${placeId}`,data,header: {"X-Goog-Api-Key": store.state.appConfig.google_maps_key}},{resNoStatus:true})
export const googlePlaceDetails = (placeId,data) => HTTP({url:`https://places.googleapis.com/v1/places/${placeId}`,data,header: {"X-Goog-Api-Key": store.state.appConfig.google_maps_key}},{resNoStatus:true})

//获取货币类型列表
export const queryCurrencyLists = (data) => http.POST(`${baseUrl}/site/page/currency`,data);
//获取语言类型列表
export const queryLangLists = (data) => http.POST(`${baseUrl}/site/page/lang`,data);
// 保存语言
export const saveLangLists = (data) => http.GET(`${baseUrl}/site/page/changelanguage`,data);
//编辑密码
export const editPwd = (data) => http.POST(`${baseUrl}/customer/editpassword/update`,data);
//更改当前币种
export const changecurrency = (data) => http.GET(`${baseUrl}/site/page/changecurrency`,data);

export const delAccount = (data) => http.GET(`${baseUrl}/customer/account/delaccount`,data);


// faq
// 获取faq的初始数据
export const queryFaqLists = (data) => http.GET(`${baseUrl}/customer/faq/index`,data);
// faq点赞
export const voteFaq = (data) => http.GET(`${baseUrl}/customer/faq/vote`,data);

// 分类产品列表页数据查询
export const queryCatelist = (data) => http.GET(`${baseUrl}/catalog/category/wxindex`,data);
// 推荐
export const recommendProduct = (data) => http.GET(`${baseUrl}/customer/ajax/recommenditem`,{rthtml:2,size: 30,...data});


//订单详情
export const getOrderList = (data) => http.GET(`${baseUrl}/customer/order/index`,data);
export const getOrderDetail = (data) => http.GET(`${baseUrl}/customer/order/view`,data);
export const orderCancel = (data) => http.POST(`${baseUrl}/customer/order/cancel`,data);
export const orderReceive = (data) => http.GET(`${baseUrl}/customer/order/delivery`,data);
export const getAfterStatus = (data) => http.GET(`${baseUrl}/customer/order/getafterstatus`,data);
export const orderReorder = (data) => http.GET(`${baseUrl}/customer/order/reorder`,data);

//订单支付
export const paypalCapture = (data) => http.POST(`${baseUrl}/payment/paypal/standard/review`,data);
export const payOrderData = (data) => http.POST(`${baseUrl}/checkout/onepage/payorder`,data);
export const orderStripeReview = (data) => http.POST(`${baseUrl}/payment/stripe/review`,data);


// vip 主页
export const getVipInfo = (data) => http.GET(`${baseUrl}/customer/vip`,data);
//vip支付页
export const getVipOnepage = (data) => http.GET(`${baseUrl}/customer/vip/onepage`,data);
//创建vip订单
export const createVipOrder = (data) => http.POST(`${baseUrl}/customer/vip/submitorder`,data);
//vip订单PaypalCapture
export const vipPaypalCapture = (data) => http.POST(`${baseUrl}/payment/paypal/standard/vipreview`,data);
//vip订单Stripe支付回调
export const vipStripeReview = (data) => http.POST(`${baseUrl}/payment/stripe/vipreview`,data);
export const vipAppleReview = (data) => http.POST(`${baseUrl}/payment/apple/vipreview`,data);

// 钱包充值
export const WalletTopUp = (data) => http.GET(`${baseUrl}/customer/walletrecharge/submitorder`,data,{loading:true});
//VIPLevel
export const getVipLevelInfo = (data) => http.GET(`${baseUrl}/customer/vip/level`,data);



// 浏览记录固化
export const saveViewRecords = (data) => http.GET(`${baseUrl}/customer/ajax/saveproductview`,data);

// 最近浏览记录
export const queryViewedList = (data) => http.GET(`${baseUrl}/customer/recentlyview/index`,data);
// 删除浏览记录
export const deleteViewed = (data) => http.GET(`${baseUrl}/customer/recentlyview/delete`,data);
// 静态页
export const cmsArticleDetail = (data) => http.GET(`${baseUrl}/cms/article/index`,data);
// 评论图片上传
export const reviewImageUpload = (data) => http.UploadFile(`${baseUrl}/catalog/reviewproduct/imageupload`,data);
// 添加评论
export const addReview = (data) => http.POST(`${baseUrl}/catalog/reviewproduct/add`,data);
// 订单可评论列表
export const orderReviewProductList = (data) => http.GET(`${baseUrl}/customer/order/reviewproduct`,data);
// 个人中心我的评论列表
export const myReviewsList = (data) => http.GET(`${baseUrl}/customer/productreview`,data,{loading:true});
// 个人中心 联系客服
export const contractUsSave = (data) => http.POST(`${baseUrl}/customer/contact/saveinfo`,data,{loading:true});

// investigation 问卷调查
export const initInvestigation = (data) => http.GET(`${baseUrl}/customer/investigation`,data,{loading:true});

// investigation 问卷调查save
export const investigationSave = (data) => http.POST(`${baseUrl}/customer/investigation/save`,data,{loading:true});

// 分类页初始化
export const initCate = (data) => http.GET(`${baseUrl}/general/base/wxmenu`,data,{loading:true,mask:'false'});

// 闪购 flash sale
export const initFlashSaleQuery = (data) => http.POST(`${baseUrl}/catalog/seckill/index`,data,{loading:true});
// 批发 whole sale
export const initWholeSaleQuery = (data) => http.POST(`${baseUrl}/catalog/wholesale/index`,data,{loading:true});

// 产品优惠券列表
export const getProductCouponList = (data) => http.GET(`${baseUrl}/coupon/fetch/lists`,data);
// 个人中心优惠券
export const getMyCouponList = (data) => http.GET(`${baseUrl}/customer/coupon/index`,data);
// 领取优惠券
export const getCoupon = (data) => http.POST(`${baseUrl}/coupon/fetch/customer`,data,{loading:true});
// 优惠券兑换
export const exchangeCoupon = (data) => http.POST(`${baseUrl}/coupon/fetch/customerexchange`,data,{loading:true});
// 积分配置
export const getPointConfig = (data) => http.GET(`${baseUrl}/catalog/pointconfig`,data);
// 个人中心我的积分
export const getMyPoint = (data) => http.GET(`${baseUrl}/customer/point/index`,data);
export const getPointSource = (data) => http.GET(`${baseUrl}/customer/point/pointsource`,data);
// 优惠券x y列表
export const getCouponXYProductList = (data) => http.GET(`${baseUrl}/catalogsearch/index/coupon`,data);
// 会员产品列表
export const getVipProductList = (data) => http.GET(`${baseUrl}/catalogsearch/index/member`,data);
// 使用优惠券
export const useCoupon = (data) => http.GET(`${baseUrl}/checkout/onepage/changecoupon`,data);
// 取消使用优惠券
export const removeUseCoupon = (data) => http.GET(`${baseUrl}/checkout/onepage/removecoupon`,data);
// 使用积分
export const usePoints = (data) => http.GET(`${baseUrl}/checkout/onepage/usepoints`,data);
// 使用钱包
export const useWallet = (data) => http.GET(`${baseUrl}/checkout/onepage/usewallet`,data);

// 裂变分享信息
export const distributeShareInfo = (data) => http.GET(`${baseUrl}/distribute/generateurl/index`,data);
// 保存裂变类型
export const distributeCashType = (data) => http.POST(`${baseUrl}/distribute/account/savecashtype`,data);
// 裂变子用户
export const distributeChild = (data) => http.GET(`${baseUrl}/distribute/child/index`,data);
// 裂变收益记录
export const distributeProfit = (data) => http.GET(`${baseUrl}/distribute/profit/index`,data);
// 裂变钱包记录
export const distributeWallet = (data) => http.GET(`${baseUrl}/distribute/wallet/index`,data);
// 获取钱包信息
export const distributeWalletInfo = (data) => http.GET(`${baseUrl}/distribute/wallet/cash`,data, {loading:true});
// 钱包提现请求
export const distributeCashRequest = (data) => http.POST(`${baseUrl}/distribute/wallet/cashrequest`,data);
// 钱包提现记录
export const distributeCashHistory = (data) => http.GET(`${baseUrl}/distribute/wallet/cashhistory`,data);
// 发送邮箱验证码
export const distributeSendEmailCode = (data) => http.GET(`${baseUrl}/distribute/wallet/sendemailcode`,data, {loading:true});

// 退货退款模块
// 取消订单申请、编辑页面初始化
export const initCancelItems = (data) => http.GET(`${baseUrl}/customer/order/cancelitem`, data, {loading:true});
// 获取当前选择的产品应退款金额
export const queryCancelAmount = (data) => http.POST(`${baseUrl}/customer/order/getcancelorderinfo`, data, {loading:true});
// 提交退款申请
export const submitRefund = (data) => http.POST(`${baseUrl}/customer/order/cancelitem`, data, {loading:true});

// aftersale 退货申请页
export const initAftersale = (data) => http.GET(`${baseUrl}/customer/order/aftersale`, data, {loading:true});

// aftersale submit 提交退货申请
export const submitAftersale = (data) => http.POST(`${baseUrl}/customer/order/aftersale`, data, {loading:true});

// aftersale reason图片上传
export const reasonImgUpload = (data) => http.UploadFile(`${baseUrl}/customer/order/imageupload`, data, {loading:true});
// refund & return records 申请记录列表页
export const queryReturnRecords = (data) => http.GET(`${baseUrl}/customer/order/returnrecord`, data, {loading:true});
// 退货物流编辑提交
export const submitReturnTrack = (data) => http.POST(`${baseUrl}/customer/order/returndispatch`, data, {loading:true});

// returntrack记录详情页
export const queryReturntrack = (data) => http.GET(`${baseUrl}/customer/order/returntrack`, data, {loading:true});
// returntrackJ记录页 取消申请
export const confirmCancel = (data) => http.POST(`${baseUrl}/customer/order/returncancel`, data, {loading:true});

// 订单物流轨迹接口
export const viewShippingTrack = (data) => http.GET(`${baseUrl}/customer/order/shipping`, data, {loading:true});

// 订单列表 获取未支付订单取消原因
export const queryCancelReason = (data) => http.GET(`${baseUrl}/customer/order/getcancelreason`, data);
// 订单列表 submit未支付订单取消原因
export const submitCancelReason = (data) => http.POST(`${baseUrl}/customer/order/cancel`, data, {loading:true});
// 获取最优惠优惠券
export const getBestCoupon = (data) => http.GET(`${baseUrl}/checkout/onepage/getbestcoupon`, data);
// 获取个人信息 
export const getEditAccountInfo = (data) => http.GET(`${baseUrl}/customer/editaccount`, data);
// 更新个人信息
export const updateAccountInfo = (data) => http.POST(`${baseUrl}/customer/editaccount/update`, data);
// 使用、取消及时险
export const updateTimelyInsurance = (data) => http.GET(`${baseUrl}/checkout/onepage/changeshippinginsurance`, data);

// 热词推荐
export const queryHotWords = (data) => http.GET(`${baseUrl}/customer/ajax/popsearch`, data);

// 新人券
export const getNewcomerCoupons = (data) => http.GET(`${baseUrl}/cms/home/getcoupons`, data);
// 获取静态块
export const getStaticblock = (data) => http.GET(`${baseUrl}/customer/ajax/getstaticblock`, data);
// 获取首页特价静态块rules弹窗文案
export const getSaleRulesBlock = (data) => http.GET(`${baseUrl}/cms/home/get-products-rules`, data);
// 获取首页特价数据
export const getSaleStaticblock = (data) => http.GET(`${baseUrl}/cms/home/getdressinsaleproducts`, data);
// 获取钱包来源
export const getWalletSource = (data) => http.GET(`${baseUrl}/distribute/wallet/walletsource`,data);
// 获取红人数据
export const getRedperson = () => http.GET(`${baseUrl}/cms/home/getredpersonimg`, {});

// 获取签到数据
export const getCheckinData = (data) => http.GET(`${baseUrl}/customer/account/getsignindata `, data);
export const postCheckin = (data) => http.POST(`${baseUrl}/customer/account/signin `, data);
export const getCalendarSignData = (data) => http.GET(`${baseUrl}/customer/account/getcalendarsigndata `, data);
export const postRecheckin = (data) => http.POST(`${baseUrl}/customer/account/recheckin `, data);
// dropshipping
export const dropShippingEdit=(data)=>http.GET(`${baseUrl}/customer/dropshipping/edit`,data);
export const dropShippingExamine=(data)=>http.GET(`${baseUrl}/customer/dropshipping/examine`,data);
export const dropShippingSave=(data)=>http.POST(`${baseUrl}/customer/dropshipping/editsave`,data);

// 小b登录
export const dropShippingLogin=(data)=>http.POST(`${baseUrl}/customer/droplogin/account`,data);
// 小b注册
export const dropShippingRegister=(data)=>http.POST(`${baseUrl}/customer/dropregister/account`,data);
// 小b 商品下载
export const getDropshippingGoodsinfo=(data)=>http.POST(`${baseUrl}/customer/dropshipping/goodsinfo`,data);
// 获取国家列表
export const getCountryList=(data)=>http.POST(`${baseUrl}/customer/dropshipping/getcountrylist`,data);

// 搜索接口
export const queryProductLists=(data)=>http.GET(`${baseUrl}/catalogsearch/index/wxindex`,data);

// 产品评论图片
export const getProductReviewsImgList=(data)=>http.GET(`${baseUrl}/catalog/product/reviewimages`,data);
// 获取单个评论详情
export const getReviewsDetail=(data)=>http.GET(`${baseUrl}/catalog/product/getreviewbyid`,data);
// 提现到钱包
export const withdrawToWallet=(data)=>http.POST(`${baseUrl}/distribute/profit/withdraw`,data);

// my measurement init
export const initMeasurement=(data)=>http.GET(`${baseUrl}/customer/measurement`,data, {loading:true});
// my measurement submit
export const saveMeasurement=(data)=>http.POST(`${baseUrl}/customer/measurement/save`,data, {loading:true});

// distribute history init

export const initDistributeHistory=(data)=>http.GET(`${baseUrl}/distribute/child/index`,data, {loading:true});

// 裂变步骤页-获取5%折扣比例等数据
export const distributeShareStepData=(data)=>http.GET(`${baseUrl}/customer/ajax/sharestep`,data);

// 判断当前退货能否使用upslabel
export const canUps=(data)=>http.POST(`${baseUrl}/customer/order/getcancelorderinfo`, data, {loading:true});

// 分享记录埋点
export const shareRecord=(data)=>http.POST(`${baseUrl}/customer/ajax/sharerecord`, data);
// 来货通知
export const stockNotify=(data)=>http.POST(`${baseUrl}/catalog/product/stocknotify`,data,{loading:true});
// 提现 
export const distributeCashwithdraw=(data)=>http.POST(`${baseUrl}/distribute/wallet/cashwithdraw`,data,{loading:true,error: false});
// checkout页 支付 优惠券、积分、钱包开关
export const changeCartByType=(data)=>http.POST(`${baseUrl}/checkout/onepage/changecartbytype`,data);

// 消息中心-列表
export const messageList=(data)=>http.GET(`${baseUrl}/customer/message/paging`,data);
// 设置已读
export const messageSetRead=(data)=>http.POST(`${baseUrl}/customer/message/read`,data);
// 获取当前是否有未读消息
export const messageGetHasNotRead=(data)=>http.POST(`${baseUrl}/customer/message/checkread`,data);
// 特价活动的文案
export const getlowpricepromotion = (data) => http.GET(`${baseUrl}/cms/home/getlowpricepromotion`,data);
// 下单页支付方式切换记录
export const recordChangePay = (data) => http.POST(`${baseUrl}/checkout/onepage/changepaymentmethod`,data);
export const paymentSuccess = (data) => http.GET(`${baseUrl}/payment/success`,data);

// 首页-裂变弹窗
export const getFissionToastData = () => http.GET(`${baseUrl}/customer/ajax/distribute-share-dialog`);
// 更新弹窗
export const getForceupdate = (data) => http.GET(`${baseUrl}/general/base/forceupdate`,data);
// 个人中心裂变主页静态块规则
export const getDistributeRuleDetail = () => http.GET(`${baseUrl}/distribute/generateurl/sharearticle`);

// 获取裂变历史status guide
export const getDistributeHistoryBlock = () => http.GET(`${baseUrl}/customer/ajax/distributehistoryblock`)

// 订单支付无营销库存删除sku接口
export const deleteSkuRemoveOutOff = (data) => http.POST(`${baseUrl}/checkout/onepage/removeoutoffmarketitem`,data);

// 人机交互埋点上报
export const turnstileTrack = (data) => http.POST(`${baseUrl}/customer/errinteractionlog/errinteraction`, data)

// 获取静态块（ 获取html格式，非json）
export const getHtmlBlock = (data) => http.GET(`${baseUrl}/customer/ajax/gethtmlblock`,data)

