import shoppingCartPopup from './shoppingCartPopup.vue'
import Vue from 'vue'
const CartPop = Vue.extend(shoppingCartPopup)
shoppingCartPopup.install = function (id) {
    // const{id,addToBag} = opts
	let instance = new CartPop().$mount()
	document.body.appendChild(instance.$el)
    //支持传入需要调用的方法
    // instance.addToBag = addToBag || null
	Vue.nextTick(()=>{       
		instance.open(id)
	})
}
export default shoppingCartPopup