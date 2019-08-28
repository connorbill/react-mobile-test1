const SELECT = {
    install(Vue) {
        if (typeof window !== 'undefined' && window.Vue) {
            Vue = window.Vue
        }
        let tpl;
        // 挂载到vue原型上，暴露两个方法
        Vue.prototype.$select = {
            show(){
                var loading = Vue.extend(require('@/components/Loading/Loading').default);
                tpl = new loading().$mount().$el;
                document.body.appendChild(tpl);
                return tpl
            },
            hidden(){
                return document.body.removeChild(tpl);
            }
        }
        this.show = function(){
            var loading = Vue.extend(require('@/components/Loading/Loading').default);
            tpl = new loading().$mount().$el;
            document.body.appendChild(tpl);
            return tpl
        }
    }
}
export default SELECT