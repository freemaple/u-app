<template>
    <view class="order_aftersale_wrapper dui-padding-top-header">
        <pageHeader :title="$t('orderAftersales.title')"></pageHeader>
        <view class="application_steps">
            <view class="flow_box flex">
                <view class="step step1">1</view>
                <view class="step_name">{{ $t('orderAftersales.select_items') }}</view>
                <view class="icons">
                    <i class="iconfont"></i>
                    <i class="iconfont"></i>
                    <i class="iconfont arrow"></i>
                </view>
                <view :class="'step ' + (showNextStep ? 'step2' : '') ">2</view>
                <view class="step_name  ">{{ $t('orderAftersales.select_method') }}</view>
            </view>
            <view class="tips">{{ $t('orderAftersales.tips') }}</view>
        </view>
        <view v-show="!showNextStep" class="step_box1">
            <view class="aftersale_list_wrapper flex">
                <view v-if="orderInfo.increment_id" class="flex align-items-center">
                    <view class="order_id">{{ $t('orderAftersales.order') }}: {{ orderInfo.increment_id }} </view>
                    <view class="copy_btn" @tap="()=>{$copyId(orderInfo.increment_id)}">{{ $t('order.copy') }}</view>
                </view>                
                <view class="product_list" >
                    <view v-for="(item, index) in product_lists" :key="index" class="product_item_wrapper flex justify-content-between align-items-center">
                        <view :class="'check_box ' + (item.checked ? 'checked' : '')" @tap="handleCheckItem(item)">
                            <i class="iconfont"></i>
                        </view>
                        <view class="right_wrapper">
                            <view class="product_item flex">
                                <view class="img_box">
                                    <image class="prod_img" :src="item.image" alt=""/>
                                </view>
                                <view class="product_right flex justify-content-between">
                                    <view class="prod_attrs_box flex justify-content-between">
                                        <view class="product_name">
                                            <view :href="item.image" class="text-grey-dark-1 text-hover-primary text-product-name text-multiple-ellipsis" :title="item.name">{{ item.name }}                                               </view>
                                        </view>
                                        <!-- <view class="product_size">Color: red</view> -->
                                        <view class="product_price font-bold">{{ orderInfo.currency_symbol }} {{ item.product_price }} </view>
                                    </view>
                                    <view class="product_count flex justify-content-between align-items-center column">
                                        <view class="maximum">
                                            <view>{{ $t('orderAftersales.maxium') + ':&nbsp;'}}</view>
											<view class="max">{{ item.qty }}</view>
                                        </view>
                                        <view class="count_box flex">
                                            <view @tap="handleDec(item)" :class="'count_dec count_btn ' + (item.after_qty <= 1 ? 'disabled' : '') ">-</view>
                                            <input @blur="(e)=>{handleChangeInput(item,e)}" type="number" v-model="item.after_qty" class="count_input "  autocomplete="off" maxlength="5" tttt="1" value="1">
                                            <view @tap="handleInc(item)" :class="'count_inc count_btn ' + (item.after_qty>=item.qty ? 'disabled' : '')">+</view>
                                        </view>
                                    </view>

                                </view>
                            </view>
                            <view class="reason_box">
                                <view class="reason_select_wrapper flex" @tap="handleOpenPopup(item, index)">
                                    <view class="reason_label">*</view>
                                    <view :class="'fake_input ' + (item.reason_id ? '' : 'fakeInputPlaceholder ')">{{ item.reason_id ? getReasonText(item.reason_id) : $t('orderAftersales.pls_choose_reason')}}</view>

                                    <i class="iconfont"></i>
                                </view>
                                <view class="error-without-reason" v-show="item.checked&&!item.reason_id">{{ $t('orderAftersales.reason_tip') }}</view>
								<!-- 图片上传一直都在，当need_image等于1时，必填 -->
                                <view class="upload_img_box" v-show="item.reason_id" >
                                    <view class="upload_title"><span v-show="item.need_image == 1" style="color: red;">*{{'&nbsp;'}}</span><span>{{ $t('orderAftersales.upload_photos') }}</span></view>
                                    <view class="upload_wrapper flex align-items-center">
                                        <view class="uploaded_imgs flex ">
                                            <view class="reviewImgDiv" style="display:inline-block" v-for="(img, index) in item.imageshtml" :key="index">
                                                <i class="iconfont" @tap="handleOpenDel(item.imageshtml, index)"></i>
                                                <view class="view_div" @tap="handlePreview(index)">{{ $t('orderAftersales.preview') }}</view>
                                                <image class="reviewImg"  mode="widthFix" :lazy-load="true" style="width:100px;height:100px;" :src="img.imgUrl"/>
                                            </view>
            
                                          
                                        </view>
                                        <view class="uploaded_count flex column" @tap="handleClickUpload(item.imageshtml)">
                                            <i class="iconfont picture"></i>
                                            <view>{{ $t('orderAftersales.photos') }}</view>
                                            <view><span class="nowcount">{{ item.imageshtml&&item.imageshtml.length || 0 }}</span>/3</view>
                                        </view>
                                    </view>
                                </view>
                                <view class="error-tip" v-show="item.checked&&item.need_image == 1&&item.imageshtml&&!item.imageshtml.length">{{ $t('orderAftersales.no_img_tip') }}</view>

                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="product_lists.length" class="flex policy_wrapper justify-content-center">{{ $t('orderAftersales.have_question') }}<view class="link" @tap="handleToPolicy">{{ $t('orderAftersales.return_policy') }}</view><view>{{ $t('orderAftersales.or') }}</view><view class="link" @tap="handleToService">{{ $t('orderAftersales.contact_customer_service') }}</view></view>

        </view>
        <view v-show="showNextStep" class="step_box2">
            <view class="return_method">
                <view class="title font-bold">{{ $t('orderAftersales.return_method') }}</view>
                <view class="reason_select_wrapper flex" @tap="handleOpenMethodPopup()">
                    <view class="reason_label">*</view>
                    <view :class="'fake_input ' + (returnMethod ? '' : 'fakeInputPlaceholder ')">{{ returnMethod ? returnMethod : $t('orderAftersales.please_select_return')}}</view>
                    <i class="iconfont"></i>
                </view>
                <view class="ups_label_desc" v-show="returnMethodTag=='1'">{{ $t('orderAftersales.ups_label_desc') }}<view style="color:red;display: inline;margin:0 .1rem;">{{ orderInfo.currency_symbol }}{{ tag_money }}</view>{{ $t('orderAftersales.ups_label_end') }}<view style="display: inline;">（</view><view style="display: inline;" @tap.stop="handleGoUps" class="find_store">{{ $t('orderAftersales.find_a_store') }}</view><view style="display: inline;">）</view></view>
            </view>
            <view class="return_method">
                <view class="title font-bold">{{ $t('orderAftersales.refund_items') }}</view>
                <view class="order_id" style="margin-bottom: 20rpx;">{{ $t('orderAftersales.order') }}: {{ orderInfo.increment_id }}</view>
                <scroll-view scroll-x="true" id="list_products">
                    <view class="refund_items flex">
                        <view class="product_item" v-for="item in checkedProducts" :key="item.product_id">
                            <view style="padding-bottom:calc(4 / 3 *100%);width:100%;">
                                <image class="porduct_img" :src="item.image" alt=""/>
                                <view class="count flex">x{{ item.after_qty }}</view>
                            </view> 
                        </view>
                    </view>
                </scroll-view>
                <view class="reason_select_wrapper flex" @tap="handleOpenAccountPopup()">
                    <view class="reason_label">*</view>
                    <view :class="'fake_input ' + (returnAccount ? '' : 'fakeInputPlaceholder ')">{{ returnAccount ? returnAccount : $t('orderAftersales.please_select_refund')}}</view>
                    <i class="iconfont"></i>
                </view>
                <view class="refund_desc" v-show="returnAccount">{{ returnAccountTag==2 ? $t('orderAftersales.my_wallet_desc') : $t('orderAftersales.payment_account_desc') }}</view>
            </view>
            <view class="btns">
                <view :class="'btn_submit flex font-bold ' + (submitDisabled ? 'disabled' : '')" @tap="handleSubmit">{{ $t('orderAftersales.submit') }}</view>
                <view class="btn_back flex" @tap="()=>{showNextStep = false}">{{ $t('orderAftersales.go_back') }}</view>
            </view>
        </view>
        <view v-show="!showNextStep" class="bottom_opt_bars flex">
            <view :class="'opt_bars_left flex ' + (allSelect ? 'checked' : '')" @tap="handleSelectAll">
                <i class="iconfont"></i>
                <view class="select_all">{{ $t('orderAftersales.select_all') }}</view>
            </view>
            <view @tap="handleClickNext" :class="'bottom_opt_right font-bold ' + (nextStepBtnDisabled ? '' : 'disabled')">{{ $t('orderAftersales.next_step') }}</view>
        </view>
        <view v-show="showNextConfirm" class="modal to_next_step">
            <view class="content">
                <view class="text">{{ $t('orderAftersales.confirm_tips') }}</view>
                <view class="confirm_btns flex">
                    <view class="btn_ok" @tap="handleToNext">{{ $t('orderAftersales.ok') }}</view>
                    <view class="btn_cancel" @tap="()=>{showNextConfirm = false}">{{ $t('orderAftersales.cancel') }}</view>
                </view>
            </view>
        </view>
        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_reason_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{ $t('orderAftersales.reason_return') }}</view>
                            <i class="iconfont" @tap="closePopup"></i>
                        </view>
                        <view class="track_wrapper">
                            <view @tap="handleChooseReason(index)" :class="'track_item flex ' + (item.checked ? 'checked ' : '') " v-for="(item,index) in reason" :key="index">
                                <view class="item_left" >
                                    <i class="iconfont"></i>
                                </view>
                                <view class="item_right">
                                    <view class="status">{{ item.title }}</view>
                                </view>
                            </view>
                            
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>

        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_method_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{ $t('orderAftersales.return_method') }}</view>
                            <i class="iconfont" @tap="closePopup('bottom_method_popup')"></i>
                        </view>
                        <view class="method_type">
                            <view class="title font-bold">{{ $t('orderAftersales.ups_store') }}</view>
                             <view style="flex-wrap: nowrap;" :class="'content flex ' + (can_ups =='1' ? '' : 'disabled ') + (returnMethodObj.checkedTag == '1' ? 'checked' : '')" @tap="handleSelectMethod('1',$t('orderAftersales.ups_store'))">
                                <i class="iconfont"></i>
                                <text class="text">
									{{ $t('orderAftersales.return_ups') }}
									<text>（</text>
									<text class="find_store" @tap.stop="handleGoUps">{{ $t('orderAftersales.find_a_store') }}</text>
									<text>）</text>
								</text>
                             </view>  
                             <view class="ups_dis_text" v-show="can_ups !='1'">{{$t('orderAftersales.can_not_ups_des')}}</view> 
                        </view>
                        <view class="method_type ">
                            <view class="title font-bold">{{ $t('orderAftersales.self_sending') }}</view>
                             <view style="flex-wrap: nowrap;" :class="'content flex ' + (returnMethodObj.checkedTag == '2' ? 'checked' : '')" @tap="handleSelectMethod('2', $t('orderAftersales.self_sending'))">
                                <i class="iconfont"></i>
                                <view class="text">{{ $t('orderAftersales.return_coast') }}</view>
                             </view>   
                        </view>
                        <view class="bottom_confirm flex">
                            <view @tap="handleConfirmMethod" :class="'btn_confirm font-bold flex ' + (returnMethodConfirmDisable ? 'disabled' : '')"> {{ $t('orderAftersales.confirm') }} </view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>

        <view @touchmove.stop.prevent="()=>{}">
            <uni-popup ref='bottom_account_popup' type="bottom">
                <view class="pop_wrapper" >
                    <scroll-view scroll-y="true" id="pop-lists" class="pop-lists flex flex-column justify-content-between"
                        :style="'max-height:' + screenHeight*0.75 + 'px'">
                        <view class="pop_header">
                            <view class="header_title flex">{{ $t('orderAftersales.refund_method') }}</view>
                            <i class="iconfont" @tap="closePopup('bottom_account_popup')"></i>
                        </view>
                        <view class="order_id" style="padding:12px;" >{{ $t('orderAftersales.order') }}: {{ orderInfo.increment_id }}</view>
                        <view style="padding:12px">
                            <scroll-view scroll-x="true" id="pop_products">
                                <view   class="refund_items flex">
                                    <view class="product_item" v-for="item in checkedProducts" :key="item.product_id">
                                        <view style="padding-bottom:calc(4 / 3 *100%);width:100%;">
                                            <image class="porduct_img" :src="item.image" alt=""/>
                                            <view class="count flex">x{{ item.after_qty }}</view>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                        </view>
                        
                        <view :class="'account_type flex ' + (returnAccountObj.checkedTag == '1' ? 'checked' : '')" @tap="handleSelectAccount('1', $t('orderAftersales.original_account'))">
                            <i class="iconfont"></i>
                            <view class="right">
                                <view class="title font-bold">{{ $t('orderAftersales.original_account') }}</view>
                                <view class="desc">{{ $t('orderAftersales.payment_account_desc') }}</view>
                            </view>
                        </view>
                        <view :class="'account_type flex ' + (returnAccountObj.checkedTag == '2' ? 'checked' : '')" @tap="handleSelectAccount('2', $t('orderAftersales.my_wallet'))">
                            <i class="iconfont"></i>
                            <view class="right">
                                <view class="title font-bold">{{ $t('orderAftersales.my_wallet') }}</view>
                                <view class="desc">{{ $t('orderAftersales.my_wallet_desc') }}</view>
                            </view>
                        </view>
                        <view class="bottom_confirm flex">
                            <view @tap="handleConfirmAccount" :class="'btn_confirm font-bold flex ' + (returnAccountConfirmDisable ? 'disabled' : '')">{{ $t('orderAftersales.confirm') }}</view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>
        </view>
    </view>
  
</template>

<script>
export default {
    data(){
        return {
            can_ups: '1',
            order_id: '',
            returnMethod: '',
            returnMethodTag: '',
            returnAccountTag: '',
            returnAccount: '',
            sale_no: '',
            screenHeight: '',
            nowPopupIndex: 0,
            orderInfo: {},
            nextStepBtnDisabled: false,
            allSelect: false,//是否全选
            showNextStep: false,
            showNextConfirm: false,
            checkedProducts: [],
            returnMethodConfirmDisable: true,
            returnAccountConfirmDisable: true,
            submitDisabled: true,
            returnMethodObj: {
                checked: false,
                checkedTag: '',
                checkedName: '',
            },
            returnAccountObj: {
                checked: false,
                checkedTag: '',
                checkedName: '',
            },
            product_lists: [],
            reason: [],
            ups_url: '',
            tag_money: '',
            symbol: '',
			after_qty: '',
            imageList: []

            
        }
    },
    onLoad(options) {
        const {order_id, sale_no} = options
        this.order_id = order_id
        this.sale_no = sale_no
        this.initAftersale()
    },
    computed: {
        
    },
    created() {
		const that = this
		uni.getSystemInfo({
			success: (res)=> {
				that.screenHeight = res.screenHeight
			}
		})
	},
    methods: {
        handleGoUps(){
            const url = this.ups_url
            //#ifdef APP-PLUS
            plus.runtime.openURL(
            url, 
                function(err) {  
                    console.log(err);  
                }
            ); 
            //#endif
            // #ifdef H5
				window.open(url);
			// #endif
        },
        handleToPolicy(){
            uni.navigateTo({ url: '/pages/cms/article/article?url_key=app-return-policy' })
        },
        handleToService(){
            uni.navigateTo({ url: '/pages/contact/contact' })

        },
        getReasonText(id) {   
            let title = ''         
            this.reason.forEach(item => {
                if(item.id == id) {
                    title =  item.title
                }
            })
            return title
        },
        initAftersale() {
            const that = this            
            const {order_id, sale_no} = that
            const params = {
                order_id,
            }
            if(sale_no){
                Object.assign(params, {sale_no})
            }
            that.$apis.initAftersale(params).then(res=>{
                uni.hideLoading()
                if(res.code == '200') {
                    const {orderInfo, reason, ups_url, symbol, tag_money, pay_type} = res.data
                    that.reason = reason
                    that.orderInfo = orderInfo
                    that.ups_url = ups_url
                    that.symbol = symbol
                    that.tag_money = tag_money
                    that.returnMethodTag = orderInfo.tag
                    if(orderInfo.tag == '1') {
                        that.returnMethod = that.$t('orderAftersales.ups_store')
                    }else if(orderInfo.tag == '2') {
                        that.returnMethod = that.$t('orderAftersales.self_sending')
                    }else {
                        that.returnMethod = ''
                    }
                    if(pay_type==1){
                        that.returnAccount = that.$t('orderAftersales.original_account')
                    }else if(pay_type==2){
                        that.returnAccount = that.$t('orderAftersales.my_wallet')
                    }else{
                        that.returnAccount =  ''
                    }
                    that.returnAccountTag = pay_type
                    that.submitDisabled = (!that.returnAccountTag || !that.returnMethodTag)
                    orderInfo.products.forEach(item=>{
                        if(!item.imageshtml){
                            that.$set(item, 'imageshtml', [])
                        }
                        if(!item.after_qty) {
                            item.after_qty = item.qty
                        }
                    })
                    that.product_lists = orderInfo.products
                    that.initCheckNext()
                    that.initCheckAll()
                }
            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleDec(item){
            if(item.after_qty <= 1)return
            item.after_qty--
        },
        handleInc(item){
            if(item.after_qty>=item.qty)return
            item.after_qty++
        },
        handleChangeInput(item, e) {            
			const count = e.detail.value.replace(/\D|^0/g,'1')
            if(count < 1){
                item.after_qty = 1
                return '1'
            }
            if(count > item.qty) {
                item.after_qty = item.qty
                return item.qty
            }
        },
        closePopup(key){
            this.$refs[key].close()
        },
        openPopup(key){
            this.$refs[key].open()
        },
        handleOpenPopup(item, index) {
            const that = this
            const {reason_id} = item
            that.nowPopupIndex = index
            that.reason.forEach(ite => {
                if(ite.id == reason_id) {
                    that.$set(ite,'checked', true)
                }else{
                    that.$set(ite,'checked', false)
                }
            })
            that.openPopup('bottom_reason_popup')
        },
        initCheckNext(){
            const that = this
            const val =  that.product_lists.find(item => item.checked)
            if(val) that.nextStepBtnDisabled = true
        },
        initCheckAll() {
            const that = this
            that.allSelect = true
            that.product_lists.forEach(item => {
                if(!item.checked) {
                    that.allSelect = false
                }
            })
        },
        handleSelectAll() {
            const that = this
            if(that.allSelect){
                that.allSelect = false
                that.nextStepBtnDisabled = false
                that.product_lists.forEach(item => {
                    item.checked = false
                })
            return
            }
            that.allSelect = true
            that.nextStepBtnDisabled = true
            that.product_lists.forEach(item => {
                item.checked = true
            })
        },
        handleCheckItem(item){
            const that = this
            that.allSelect = true
            that.nextStepBtnDisabled = false
            if(item.checked) {
                item.checked = false
            }else {
                item.checked = true
            }
            that.product_lists.forEach( ite => {
                if(!ite.checked) {
                    that.allSelect = false
                }else {
                    that.nextStepBtnDisabled = true
                }
            })
        },
        handleChooseReason(index) {
            const that = this
            const item = that.reason[index]
            const {need_image, checked} = item
            if(item.checked) {
                item.checked = false
            }else {
                that.reason.forEach(ite=>{
                    ite.checked = false
                })
                item.checked = true
                that.product_lists[that.nowPopupIndex].reason_id = item.id
                that.product_lists[that.nowPopupIndex].need_image = need_image
                that.closePopup('bottom_reason_popup')
            }
        },
        
        handleClickNext(){
            const that = this
            if(!that.nextStepBtnDisabled)return
            let allChecked = true
            const result = that.product_lists.find(item => {
                if(!item.checked){
                    allChecked = false
                }
                return item.checked && (!item.reason_id || item.need_image=='1' && !item.imageshtml.length)
            })
            if(result) return
            if(!allChecked) {
                that.showNextConfirm = true               
            }else{
                that.handleToNext()
            }
            
            
        },
        handleToNext() {
            const that = this
            that.showNextStep = true
            that.showNextConfirm = false
            const checkedProducts = []
            // checkedProducts
            const obj = that.product_lists.forEach(item =>{
                if(item.checked){
                    checkedProducts.push(item)
                }
            })
            that.checkedProducts = checkedProducts
            const item_list = that.checkedProducts.map(item=>{
                const { after_qty, item_id, reason_id, imageshtml} = item
                let arr = []
                imageshtml.forEach(ite=>{
                    arr.push(ite.relativeImgUrl)
                })
                const image = arr.join(',')
                return {
                    qty: after_qty,
                    item_id,
                    image,
                    reason_id
                }
            })
            const sale_no = that.sale_no 
            const params = {
                order_id: that.order_id,
                item_list: JSON.stringify(item_list)                
            }
            if(sale_no){
                Object.assign(params, {sale_no})
            }
            this.$apis.canUps(params).then(res=>{
                uni.hideLoading()
                if(res.code == '200'){
                    console.log(res,'res');
                    that.can_ups = res.data.can_ups
                }
            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleOpenMethodPopup() {
            const that = this
            const tag =  that.returnMethodTag
            const name = that.returnMethod
            that.returnMethodObj.checkedTag = tag
            that.returnMethodObj.checkedName = name
            that.returnMethodConfirmDisable = that.returnMethodObj.checkedTag == ''
            this.openPopup('bottom_method_popup')
        },
        handleOpenAccountPopup() {
            const that = this
            const tag =  that.returnAccountTag
            const name = that.returnAccount
            that.returnAccountObj.checkedTag = tag
            that.returnAccountObj.checkedName = name
            that.returnAccountConfirmDisable = that.returnAccountObj.checkedTag == ''
            this.openPopup('bottom_account_popup')
        },
        handleSubmit(){
            const that = this
            if(!that.returnMethod || !that.returnAccount)return
            const item_list = that.checkedProducts.map(item=>{
                const { after_qty, item_id, reason_id, imageshtml} = item
                let arr = []
                imageshtml.forEach(ite=>{
                    arr.push(ite.relativeImgUrl)
                })
                const image = arr.join(',')
                return {
                    qty: after_qty,
                    item_id,
                    image,
                    reason_id
                }
            })
            const params = {
                order_id: that.order_id,
                tag: that.returnMethodTag,
                sale_no: that.sale_no || '',
                item_list: JSON.stringify(item_list),
                pay_type: that.returnAccountTag
            }
            that.$apis.submitAftersale(params).then(res => {
                uni.hideLoading()
                if(res.code == '200') {
                    uni.showToast({
                        title: res.message,
                        icon: 'success',
                        mask: true
                    })
                    const {sale_no, order_id} = res.data
                    uni.redirectTo({
                        url: '/pages/return-track/return-track?' + 'order_id='+ order_id+ '&sale_no=' + sale_no
                    })
					that.$trackEvent.refund({
						transaction_id: res.data.sale_no,
						value: res.data.return_total,
						currency_code: res.data.currency_code,
						increment_id: res.data.increment_id
					});
                }
            }).catch(err=>{
                uni.hideLoading()
            })
        },
        handleSelectMethod(type, name) {
            const that = this
            if(type == '1' && that.can_ups != '1')return
            if(that.returnMethodObj.checkedTag == type) {
                that.returnMethodObj.checkedTag = ''
                that.returnMethodObj.checkedName = ''
                that.returnMethodObj.checked = false

            }else {
                that.returnMethodObj.checkedTag = type
                that.returnMethodObj.checkedName = name
                that.returnMethodObj.checked = true
            }
            
            that.returnMethodConfirmDisable = that.returnMethodObj.checkedTag == ''
           
        },
        handleSelectAccount(type, name) {
            const that = this            
            if(that.returnAccountObj.checkedTag == type) {
                that.returnAccountObj.checkedTag = ''
                that.returnAccountObj.checkedName = ''
                that.returnAccountObj.checked = false

            }else {
                that.returnAccountObj.checkedTag = type
                that.returnAccountObj.checkedName = name
                that.returnAccountObj.checked = true
            }
            
            that.returnAccountConfirmDisable = that.returnAccountObj.checkedTag == ''
           
        },        
        handleConfirmMethod() {
            const that = this
            if(that.returnMethodConfirmDisable)return
            
            that.returnMethod = that.returnMethodObj.checkedName
            that.returnMethodTag = that.returnMethodObj.checkedTag
            that.submitDisabled = !that.returnMethod||!that.returnAccount

            that.closePopup('bottom_method_popup')
        },
        handleConfirmAccount() {
            const that = this
            if(that.returnAccountConfirmDisable)return            
            that.returnAccount = that.returnAccountObj.checkedName
            that.returnAccountTag = that.returnAccountObj.checkedTag
            that.submitDisabled = !that.returnMethod||!that.returnAccount
            that.closePopup('bottom_account_popup')
        },
        handleOpenDel(imageshtml, index){
            imageshtml.splice(index,1)
            this.imageList.splice(index,1)
        },
        handleClickUpload(imageshtml) {
            if(imageshtml.length >= 3)return
            const that = this
            uni.chooseImage({
                count: 3 - imageshtml.length,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: res => {
                    const {tempFilePaths} = res
                    const files = []
                    tempFilePaths.forEach((item, index) => {
                        files.push({
                            name: 'upload_file' + index,
                            uri: item
                        })
                    })
                    that.$apis.reasonImgUpload({files}).then(res=>{
                        uni.hideLoading()
                        if(res.code == '200') {
                            res.data.images.forEach(ite => {
                                imageshtml.push(ite)
                                this.imageList.push(ite.imgUrl)
                            })                                                     
                        }

                    }).catch(err =>{
                        uni.hideLoading()
                    })
                    
                }
            })
        },
        handlePreview(index) {
            uni.previewImage({
                current: index, // 当前显示图片的索引
                urls: this.imageList // 需要预览的图片http链接列表
            });
        },
		trackEvent(data){
			this.$trackEvent.refund(data);
		}
        
    }
}
</script>

<style lang="scss" scoped>
@import "@/common/mixins.scss";
.error-without-reason{
    font-size: 24rpx;
    color: red;
}
.ups_dis_text{
    color: red;
    font-size: 23rpx;
}
.refund_items{
    width: 100%;
    margin-bottom: 40rpx;
    flex-wrap: nowrap;

    .product_item{
        position: relative;
        //padding: 20rpx;
        margin-right: 20rpx;
        width: 220rpx;
        flex-shrink: 0;
        &:last-child{
            margin-right: 0;
        }
        .porduct_img{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);  
            width: 100%;
            height: 100%;
        }
        .count{
            justify-content: center;
            align-items: center;
            background: rgba(256,256,256,0.8);
            color: #222;
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            right: 0;
            bottom: 0;
			font-size: 28rpx;
        }
    }
}
.refund_desc,.ups_label_desc{
    font-size: 28rpx;
    margin-bottom: 20rpx;
}
.find_store{
    text-decoration: underline;
    color: #2d68a8;
    margin: 0 6rpx;
}
.step_box1{
    padding-bottom: 100rpx;
    background: #fff;
}
.copy_btn{
    padding: 5rpx 10rpx;
    border: 1px solid #333;
    border-radius: 5rpx;
    margin-left: 10rpx;
    font-size: 28rpx;
}
.policy_wrapper>.link{
    margin-left: 10rpx;
    margin-right: 10rpx;
    text-decoration: underline;
    color: #0071E3;
    }
.order_aftersale_wrapper{
    background: #f2f2f2;
}
.application_steps{
    background: #fff;
    padding: 24rpx;
    margin-bottom: 30rpx;
}
.flow_box{
    justify-content: center;
    align-items: center;
    .step{
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
		font-size: 30rpx;
        color: #222;
        border: 1px solid #222;
    }
    .step1{
        background: #222;
        color: #fff;
        border: 0;
    }
    .step2{
        margin-left: 20rpx;
        background: #222;
        color: #fff;
        border: 0;

    }
    .step_name{
        margin: 0 20rpx;
        font-size: 28rpx;
    }
    .icons{
        i{
            color: #222;
            font-size: 24rpx;
            &:before{
                content: '\e627';
            }
        }
        .arrow:before{
            content: '\e609';
        }
    }
}
.tips{
    text-align: center;
    color: red;
    font-size: 24rpx;
    margin: 16rpx 0;
}
.aftersale_list_wrapper {
    background: #fff;
    padding: 24rpx;
}
.check_box{
    width: 100rpx;
    i{
        font-size: 40rpx;
        &:before{
            content: '\e63b';
        }
    }
}
.check_box.checked{
    i{
        &:before{
            content: '\e6c2';
        }
    }
}
.product_item_wrapper{
    width: 100%;
    justify-content: start;
    flex-wrap: nowrap;
    overflow: hidden;
    .right_wrapper{
        overflow: hidden;
         flex: 1;
         .product_item{
            align-items: center;
            justify-content: space-between;
            height: auto;
            padding: 20rpx 0;
            min-height: 240rpx;
            margin-bottom: 40rpx;
            overflow: hidden;
            .img_box{
                width: 180rpx;
                min-height: 240rpx;
                height: 240rpx;
                margin-right: 40rpx;
                .prod_img{
                    width: 100%;
                    height: 100%;
                }
            }
            .product_right{
                position: relative;
                justify-content: space-between;
                flex: 1;
                flex-direction: column;
                min-height: 200rpx;
                height: 100%;
                overflow: hidden;
                .prod_attrs_box{
                    width: 300rpx;
                    height: 100%;
                    font-size: 24rpx;
                    min-height: 200rpx;
                    .product_name{
                        min-width: 80%;
                    }
                    .product_size{
                        min-width: 80%;
                    }
                }
            }
         }
    }
}
.product_count{
    position: absolute;
    font-size: 12px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    bottom: 0;
    right: 0;
    font-size: 12px;
    .count_input{
        width: 40rpx;
       text-align: center;
    }
    .count_box{
        font-size: 24rpx;
    }
    /deep/input{
        font-size: 24rpx;
    }
    .count_btn{
        width: 40rpx;
        background: #f2f2f2;
        display: inline-block;
        height: 40rpx;
        text-align: center;
        line-height: 40rpx;
        border-radius: 0 50% 50% 0;
        color: #222;
    }
    .count_btn.disabled{
        color: #ccc;
    }
    .count_dec{
        border-radius: 50% 0 0 50%;
    }
}
.maximum{
    font-size: 24rpx;
    display: flex;
    flex-wrap: nowrap;
    .max{
        color: red;
    }
}
.bottom_opt_bars{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    height: 100rpx;
    background: #fff;
    padding: 0 12px;
    justify-content: space-between;
    align-items: center;
    .opt_bars_left{
        align-items: center;
        i{
            font-size: 40rpx;
            &:before{
                content: '\e63b';
            }
        }
        .select_all{
			font-size: 28rpx;
            margin-left: 20rpx;
        }
    }
    .opt_bars_left.checked i{
            &:before{
                content: '\e6c2';
            }
        }
    .bottom_opt_right{
        font-size: 36rpx;
        padding: 20rpx 40rpx;
        background: #333;
        color: #fff;
    }
    .bottom_opt_right.disabled{
        opacity: .5;
    }
}
.upload_img_box{
    margin-top: 20rpx;
}
.upload_title{
    font-size: 28rpx;
}
.reason_box{
    width: 100%;
    padding: 40rpx 0;
    overflow: hidden;
    

}
.pop_wrapper{
    width: 100%;
	background-color: #fff;
	overflow-y: auto;
    min-height: 600rpx;
    background: #fff;
    .pop_header{
        padding: 10rpx 30rpx;
        position: relative;
        height: 80rpx;
        @include onepxBorder(#e0e0e0);
        i{
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            color: #999;
            font-size: 24rpx;
            &:before{
                content: '\e6ab';
            }
        }
    }
    .header_title{
        font-size: 28rpx;
        width: 100%;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .track_wrapper{
        padding: 24rpx;
        .track_item{
            position: relative;
            width: 100%;
            height: 80rpx;
            justify-content: start;
            align-items: center;
            .item_left{
                margin-right: 40rpx;
                line-height: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                i{
                    font-size: 40rpx;
                    color: #222;
                    &:before{
                        content: '\e63b';
                    }
                }
                
            }
            .item_right{
                color: #222;
                flex: 1;
                overflow: hidden;
				font-size: 28rpx;
                .status{
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
           
        }
        .track_item.checked{
            i:before{
                content: '\e640';
            }
        }
       
       
    }
    .method_type{
        padding: 24rpx;
        width: 100%;
        color: #222;
        .title{
           font-size: 32rpx; 
        }
        .content{
            margin-top: 20rpx;
            padding: 30rpx 0;
            justify-content: start;
            align-items: center;
            i{
                font-size: 40rpx;
                &:before{
                content: '\e63b';
            }
            }
            .text{
                margin-left: 40rpx;
                font-size: 28rpx;
            }
        }
        .content.checked{
            i{
                &::before{
                content: '\e6c2'; 
            }
            }
        }
        .content.disabled{
            i{
                color: #eee;
            }
        }
    }
    .account_type{
        padding: 24rpx;
        justify-content: satrt;
        margin-bottom: 40rpx;
      
        i{
            display: inline-block;
            width: 60rpx;
            padding-right: 20rpx;
            font-size: 40rpx;
                &:before{
                content: '\e63b';
            }
            }
        .right{
            flex: 1;
			font-size: 28rpx;
            .title{
                height: 40rpx;
                margin-bottom: 20rpx;
            }
            .desc{
                color:#999;
            }
        }
    }
    .account_type.checked{
        i:before{
            content: '\e6c2';
        }
    }
    .bottom_confirm{
        width: 100%;
        @include onepxBorderTop(#e0e0e0);
        align-items: center;
        padding: 24rpx;
        .btn_confirm{
            height: 90rpx;
            width: 100%;
            background: #222;
            font-size: 32rpx;
            color: #fff;
            align-items: center;
            justify-content: center;
        }
        .btn_confirm.disabled{
            opacity: 0.5;
        }
    }
}
.fake_input{
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.product_list{
    overflow: hidden;
}
.step_box2{
    background: #fff;
    padding: 24rpx;
	font-size: 28rpx;
    .return_method{
        .title{
            margin-bottom: 30rpx;
        }
        .reason_select_wrapper{
            margin-bottom: 20rpx;
        }
        .refund_items{
            width: 100%;
            margin-bottom: 40rpx;
            flex-wrap: nowrap;

            .product_item{
                position: relative;
                margin-right: 20rpx;
                width: 220rpx;
                flex-shrink: 0;
                &:last-child{
                    margin-right: 0;
                }

                .porduct_img{
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                }
                .count{
                    justify-content: center;
                    align-items: center;
                    background: rgba(256,256,256,0.8);
                    color: #222;
                    width: 40rpx;
                    height: 40rpx;
                    position: absolute;
                    right: 0;
                    bottom: 0;
					font-size: 28rpx;
                }
            }
        }
    }
    .btns{
        width: 100%;
        margin-top: 80rpx;
        .btn_submit{
            width: 100%;
            background: #222;
            color: #fff;
            height: 80rpx;
            margin-bottom: 30rpx;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
        }
        .btn_submit.disabled{
            opacity: .5;
        }
        .btn_back{
            width: 100%;
            background: #fff;
            color: #222;
            height: 80rpx;
            border: 1px solid #222;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
        }
    }
}
.to_next_step{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 2;
    .content{
        position: absolute;
        padding: 30rpx;
        top: 50%;
        left: 50%;
        width: 75%;
        background: #fff;
        transform: translate(-50%,-50%);
		font-size: 28rpx;
        .text{
            text-align: left;
            margin-bottom: 60rpx;
        }
        .confirm_btns{
            justify-content: space-between;
            .btn_ok{
                color: #fff;
                background: #222;
                padding: 10rpx;
                width: 40%;
                text-align: center;
            }
            .btn_cancel{
                padding: 10rpx;
                width: 40%;
                color: #222;
                background: #fff;
                text-align: center;
                border: 1px solid #222;
            }
        }
    }
}
.reason_select_wrapper{
    overflow: hidden;
    background: #eee;
    width: 100%;
    height: 60rpx;
    position: relative;
    .reason_label{
        position: absolute;
        left: 10rpx;
        top: 50%;
        color: red;
        transform: translateY(-50%);
        line-height: 60rpx;
        font-size: 28rpx;
    }
    .fakeInputPlaceholder{
        color: #999;
    }
    .fake_input{            
        width: 100%;
        height: 100%;
        line-height: 60rpx;
        margin-left: 30rpx;
        padding-right: 50rpx;
        font-size: 24rpx;
    }
    i{
        position: absolute;
        right: 30rpx;
        top: 50%;
		font-size: 48rpx;
        transform: translateY(-50%);
        &:before{
            content: '\e661';
        }
    }
    }
    .iconfont.picture{
        font-size: 32rpx;
        &:before{
            content: '\e643';
        }
    }
    .uploaded_count{
        justify-content: center;
        color: #666;
        align-items: center;
        flex-direction: column;
        width: 120rpx;
        height: 120rpx;
        border: 1px dashed #ccc;
        font-size: 24rpx;
    }
    
    .uploaded_imgs{
        margin-top: 20rpx;
    }
    .reviewImgDiv{
        margin-right: 20rpx;
        position: relative;
        height: 120rpx;
        width: 120rpx;
        flex-shrink: 0;
        .view_div{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40rpx;
            background: rgba(0,0,0,0.5);
            color: #fff;
            z-index: 1;
            font-size: 24rpx;
            text-align: center;
            line-height: 40rpx;
        }
        i{
            position: absolute;
            right: -10rpx;
            top: -10rpx;
            z-index: 1;
            font-size: 28rpx;
            &:before{
                content: '\e6c3';
            }
            }
        .reviewImg{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            max-height: 100%;
            max-width: 100%;
        }
    }
    .order_id{
        font-size: 28rpx;
    }
    .error-tip{
        color: red;
        font-size: 24rpx;
        
    }
.preview_img{
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    z-index: 2;
    i{
        position: absolute;
        right: 20rpx;
        z-index: 1;
        top: 100rpx;
        color: #fff;
        &:before{
            content: '\e6ab';
        }
    }
    .content{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        height: 400rpx;
        justify-content: center;
        align-content: center;
        background: #fff;
        .picture{
            max-height: 100%;
            max-width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
.policy_wrapper {
	font-size: 28rpx;
}
</style>