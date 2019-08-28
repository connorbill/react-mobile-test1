import { getToken } from '@/utils/auth'
const user = {
    state: {
        token: getToken(),
        name: '',          // 设置用户名
        roles: []          // 设置路由
    },
    
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        getStoreToken({ commit }, data) {
            commit('SET_TOKEN', data)
        },
        
        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                let res = [
                    {
                        "urlName": "home",
                        "component": "home/index"
                    }
                ]
            commit('SET_ROLES', res)   // 设置路由
            resolve(res)
        })
    }

  }
}

export default user