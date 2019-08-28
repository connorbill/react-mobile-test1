<template lang="jade">
    .quick-view-warp
        vue-quickHeader
        .quick-con
            vue-trend(v-show="quickActiveCode == 'trend'")
            vue-draw(v-show="quickActiveCode == 'draw'")
            vue-curBet(v-show="quickActiveCode == 'curBet' || quickActiveCode == 'allBet'")
            vue-explain(v-show="quickActiveCode == 'explain'")
</template>
<script>
import { mapState } from 'vuex'
import quickHeader from "@/views/gamePlay/quickView/quickHeader" // 菜单
import trend from "@/views/gamePlay/quickView/trend" // 路子
import draw from "@/views/member/history" // 开奖
import curBet from "@/views/member/orderPage" // 投注
import explain from "@/views/member/playRule" // 说明

export default {
    name: 'QuickView', // 快捷查看
    components: {
        'vue-quickHeader': quickHeader, // 倒计时
        'vue-trend': trend, // 路子
        'vue-draw': draw, // 开奖
        'vue-curBet': curBet, // 投注
        'vue-explain': explain, // 说明
    },
    computed: {
        ...mapState({
            showBg: state => state.home.showBg, // 菜单
            quickActiveCode: state => state.home.quickActiveCode, // 选中菜单code
            curSubMenuId: state => state.home.curSubMenuId, // 当前子菜单ID
            curParMenu: state => state.home.curParMenu, // 当前父菜单Code
            subPlayCur: state => state.home.subPlayCur, // 选中二级玩法CODE
            subPlayCurId: state => state.home.subPlayCurId, // 选中二级玩法Id
        })
    },
    data() {
        return{
            sid: '' // 二级彩种ID
        }
    },
    watch: {
       quickActiveCode: function(val, oldVal) {
            this.sid = this.$route.query.id // 二级彩种ID
            if(val == 'trend') {
                this.getTrendData(this.sid) // 请求路子数据
            }else if(val == 'draw') {
                this.getHistory(this.sid) // 获取开奖数据
            }else if(val == 'curBet') {
                this.getOrderPage(this.sid) // 获取投注数据
            }else if(val == 'allBet') {
                this.getOrderPage() // 获取全部投注数据
            }else if(val == 'explain') {
                this.getPlayRule(this.subPlayCurId) // 获取说明数据
            }
       } 
    },
    created() {

    },
    mounted() {
        
    },
    destroyed() {

    },
    methods: {
        getTrendData() { // 请求路子数据
            this.$store.dispatch('getIsLoading',true) // 显示loading
            let data = {
                lotteryId: this.$route.query.id, // 二级彩种id
                betOn: this.subPlayCur, // 二级玩法ID
                height: 6, // 高【可不传，默认6】
                width: 12, // 宽【可不传，默认11】
                reverse: 1 // 【1-翻转，最新的在下面】【0或不传】
            }
            this.$store.dispatch('getTrentLst', data)
            // getTrentLst(data).then((res) => {
            //     if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
            //         let s = res.content 
            //         this.$store.dispatch('getTrentDataList', s) // 路子列表数据 
            //     }
            // })
        },
        getHistory(id) { // 获取历史记录 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) { // 如果未传ID 则为默认ID
                id = this.curSubMenuId // id:当前子菜单ID
            }
            let params = {
                lotteryId: id, // 二级彩种id
                page: 0, // 页码
                size: 50 // 每页条数
            }
            this.$store.dispatch('getHistory', params)
        },
        getOrderPage(id) { // 获取投注 id:当前子菜单ID
            let params = {}
            if(!id) { // 如果未传ID 则为默认ID
                params = {
                    page: 0, // 页码
                    size: 50 // 每页条数
                }
            }else{
                params = {
                    lotteryId: this.$route.query.id, // 二级彩种id
                    page: 0, // 页码
                    size: 50 // 每页条数
                }
            }
            this.$store.dispatch("getActiveDetails",'') // 收起详情
            this.$store.dispatch('getIsLoading',true) // 显示loading
            this.$store.dispatch('getOrderPage', params)
        },
        getGameRules(id) { // 获取游戏说明 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) { // 如果未传ID 则为默认ID
                id = this.curSubMenuId // id:当前子菜单ID
            }
            let params = {
                lotteryId: id, // 二级彩种id
            }
            this.$store.dispatch('getGameRules', params)
        },
        getPlayRule(id) { // 获取游戏说明 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) { // 如果未传ID 则为默认ID
                id = this.subPlayCurId // id:当前子菜单ID
            }
            let params = {
                playRuleId: id, // 二级彩种id
            }
            this.$store.dispatch('getPlayRule', params)
        }
    },
}
</script>
<style lang="stylus" scoped>
@import "../../../assets/stylus/blue";
.quick-view-warp
    height calc(100vh - 1.6rem)
    position fixed
    bottom calc(1.38rem - 100vh)
    left 0
    width 100%
    background $quick-wrap-bg
    z-index 1000
    border-radius 0.1rem 0.1rem 0 0
    -webkit-overflow-scrolling touch
.quick-con
    position absolute
    top 0.45rem
    left 0
    width 100%
    overflow hidden
</style>

