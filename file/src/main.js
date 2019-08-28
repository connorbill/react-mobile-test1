import Vue from 'vue'
import 'babel-polyfill' // 转ES5
import router from './router' // 路由
import store from './store' // 状态库
import './components/SvgIcon/icons' // svg图标
import loading from './components/Loading/index' // Loading
import vTips from './components/Tips/index' // Loading
import './permission' // 权限控制
import App from './App'
import {  MessageBox } from 'mint-ui' // UI组件
import VueTouch from 'vue-touch' // 滑动组件
import Meta from 'vue-meta' // 设置heard头信息

Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Meta)
Vue.use(vTips)
// Vue.use(InfiniteScroll);
Vue.use(loading)
Vue.component(MessageBox)

// 图片 (全局调用)
Vue.prototype.imgBg = function (url) {
    if(!url) {
        return false
    }
    if(!/^http/.test(url)) {
        url = url
    }
    return 'background-image:url(' + url + ')'
};

// Vue.component(Checklist.name, Checklist) 
// Vue.component(DatetimePicker.name, DatetimePicker) 
Vue.prototype.$messageBox = MessageBox; // 弹出框挂到Vue原型


//1.部分部件按需引入
Vue.config.productionTip = false // Vue.config.productionTip

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})