import debounce from '../debounce'
let btn = ''
let mountNode = ''
let scrollTop = 0
export default {
    data() {
        return {}
    },
    mounted() {
        window.addEventListener('scroll', debounce(this.scrollToTop,200));       
        if (mountNode) return
        const div = document.createElement('div')
        const img = document.createElement('img')
        img.src = ""
        div.appendChild(img)
        div.classList.add('global-top-btn')        
        div.addEventListener('click', this.backTop)
        btn = div
    },
    methods: {
        backTop() {
            let timer = setInterval(() => {
                let speed = Math.floor(-scrollTop / 5)
                document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed
                if (scrollTop === 0) {
                    clearInterval(timer)
                }
            }, 16)
        },
        scrollToTop() {
            let nowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            scrollTop = nowScrollTop
            //超过150开始展示回到顶部            
            if (scrollTop > 150) {
                if (!mountNode) {
                    document.body.appendChild(btn)
                    mountNode = document.querySelector('.global-top-btn')
                }
                mountNode.classList.remove('global-btn-none')

            } else if (scrollTop <= 150){
                mountNode&&mountNode.classList.add('global-btn-none')
            }
        }
    },

}