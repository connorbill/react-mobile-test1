import { constantRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法


function filterAsyncRouter(roles) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = roles.filter(route => {
        if (route.component) {
            route.component = _import(route.component)
        }
        return true
    })

  return accessedRouters
}

const permission = {
    state: {
        routers: [],
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRouters
                accessedRouters = filterAsyncRouter(roles)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default permission
