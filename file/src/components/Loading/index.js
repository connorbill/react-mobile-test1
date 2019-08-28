const LOADING = {
    install(Vue) {
        if (document.getElementsByClassName('.loading-status').length) return
        if (typeof window !== 'undefined' && window.Vue) {
            Vue = window.Vue
        }
        let tpl;
        // 挂载到vue原型上，暴露两个方法
        Vue.prototype.$loading = {
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
export default LOADING

export function loadingShow() { // js调用方法
    var temp = '<div class="loading-status">' +
                    '<div class="load-content">' + 
                        '<div class="c1"></div><div class="c2"></div>' + 
                        '<div class="c3"></div><div class="c4"></div>' + 
                    '</div><span>loading</span>' + 
                '</div>'
    var tem = "<p class='acddd'>ccc</p>"
    var div = document.createElement("div");
        div.id = 'loading-status';
        div.innerHTML = temp;
        document.body.appendChild(div)
}

export function loadingHidden() {
    if(document.getElementById('loading-status')) {
        document.body.removeChild(document.getElementById('loading-status'));
    }
}