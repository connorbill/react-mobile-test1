import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件

// 全局注册Svg图标
Vue.component('svg-icon', SvgIcon)
const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
//requireAll(req)
export default requireAll(req)