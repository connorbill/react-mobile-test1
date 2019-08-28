//定义一个状态管理容器
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import home from './home/home' // 获取主页数据
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        permission,
        home
    },
    getters
})

export default store;