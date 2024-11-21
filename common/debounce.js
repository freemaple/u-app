let timer = ''
const debounce = function (method, wait = 200,params = []) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        method(...params)
    }, wait);
}
export default debounce