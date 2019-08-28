<template lang="jade">
    div.game-play
        vue-countDown
        vue-odds
        .quick(v-show="totalBets < 1", @touchend.prevent="showQuickView()", :class="inBottom == true || totalBets >= 1  ? 'quick-scroll' : ''")
            svg-icon(icon-class="betRecord")
            //- p 点点
        vue-quickView(:class="showQuick ? 'show-quick' : 'hid-quick'")
        vue-bet(v-show="totalBets >= 1")
        vue-betList(v-show="showBetList")
        vue-keyboard(v-show="showKeyboard")
        .bg(v-if="betShowBg", @touchend.prevent="close()")
</template>
<script>
import { mapState } from 'vuex'
import countDown from '@/views/gamePlay/countDown'  // 倒计时
import odds from '@/views/gamePlay/odds'  // 下注主页
import quickView from '@/views/gamePlay/quickView/index'  // 投注快捷显示
import { getTrentLst } from '@/api/home'
import keyboard from '@/views/gamePlay/keyboard'  // 键盘
import bet from '@/views/gamePlay/bet'  // 下注
import betList from '@/views/gamePlay/betList'  // 下注列表
export default {
    name: 'gamePlay',
    components: {
        'vue-countDown': countDown, // 倒计时
        'vue-odds': odds, // 下注主页
        'vue-quickView': quickView, // 投注快捷显示
        'vue-keyboard': keyboard, // 键盘
        'vue-bet': bet, // 下注
        'vue-betList': betList, // 下注列表
    },
    data() {
        return{
            showBg: false
        }
    },
    computed: {
        ...mapState({
            showQuick: state => state.home.showQuick, // 投注快捷菜单是否显示 false:不显示， true:显示
            subPlayCur: state => state.home.subPlayCur, // 二级玩法ID
            inBottom: state => state.home.inBottom, // 滚动条是否到底
            totalBets: state => state.home.totalBets, // 总下注条数
            showBetList: state => state.home.showBetList, // 下注列表是否显示
            betShowBg: state => state.home.betShowBg, // 下注页背景层是否显示 true:显示，false:不显示
            showKeyboard: state => state.home.showKeyboard, // 是否显示键盘 false:不显示， true:显示
            oddActive: state => state.home.oddActive, // 当前赔率初始全部设为false
            allOddActive: state => state.home.allOddActive, // 曾被选中所有赔率
            isSucceed: state => state.home.isSucceed, // 下注是否成功
        })
    },
    created() {
        this.$store.dispatch('getTempMenu', 'gamePlay') // 初始默认模板
        let id = this.$route.query.id, // 二级彩种ID
            code = this.$route.query.code, // 二级彩种code
            name = this.$route.query.temp, // 二级彩种中文名
            pcode = this.$route.query.pcode // 一级彩种code
        this.$store.dispatch('getCurSubMenu', code) //  二级彩种ID
        this.$store.dispatch('getCurSubMenuId', id) // 二级彩种code
        this.$store.dispatch('getCurSubMenuName', name) // 二级彩种中文名
        this.$store.dispatch('getCurParMenu', pcode) // 一级彩种code
    },
    mounted() {
        this.initialization() // 初始化清空下注项
    },
    destroyed() {
        
    },
    methods: {
        initialization() { // 初始化清空下注项
            this.oddActive.forEach((ov, ok) => { // 当前选中项设置全部置为 false
                for(let v in ov) {
                    this.$set(this.oddActive[ok], v, false)  // 当前赔率初始全部设为false
                }
            })
            for(let v in this.allOddActive) { // 所有选中项设置全部置为 false
                this.allOddActive[v].forEach((dv, dk) => {
                    for(let di in dv) {
                        this.$set(this.allOddActive[v][dk], di, false)  // 所有选中赔率初始全部设为false
                    }
                })
            }
            this.$store.dispatch('getisSucceed',false) // 恢复下注状态
            this.$store.dispatch('getShowBetList', false) // 是否显示下注列表 false:不显示， true:显示
            this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
            this.$store.dispatch('getReadyBetList',[]) // 清空下注项
            this.$store.dispatch('getTotalBets',0) // 清除下注条数
            this.$store.dispatch('getBetAmount',0) // 清空单注下注金额
            this.message = '' // 恢复下注按钮
            if(this.showQuick) { // 判断投注快捷菜单是否是显示的
                this.$store.dispatch('getBetShowBg', true) // 下注页背景层是否显示 true:显示，false:不显示
                return
            }
            this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
        },
        getTrendData() { // 请求路子数据
            this.$store.dispatch("getIsLoading",true) // 显示loading
            let data = {
                lotteryId: this.$route.query.id, // 二级彩种id
                betOn: this.subPlayCur, // 二级玩法ID
                height: 6, // 高【可不传，默认6】
                width: 12, // 宽【可不传，默认11】
                reverse: 1 // 【1-翻转，最新的在下面】【0或不传】
            }
            getTrentLst(data).then((res) => {
                this.$store.dispatch("getIsLoading",false) // 隐藏loading
                if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                    let s = res.content 
                    this.$store.dispatch('getTrentDataList', s) // 路子列表数据 
                }
            })
        },
        showQuickView() { // 显示投注捷快模块
            this.$store.dispatch('getShowQuick', !this.showQuick)  // 投注快捷菜单是否显示 false:不显示， true:显示
            this.$store.dispatch('getQuickActiveCode', 'trend') // 选中菜单code
            if(this.showQuick == true) {
                this.$store.dispatch('getBetShowBg', true) // 下注页背景层是否显示 true:显示，false:不显示
                this.getTrendData(); // 点击且显示页面时请求路子
            } else {
                this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
            }
        },
        close() { // 关闭选择
            // if(this.isSucceed == false) {
            //     return
            // }
            if(this.showQuick == true) {
                this.$store.dispatch('getShowQuick', false)  // 投注快捷菜单是否显示 false:不显示， true:显示
            }
            if(this.showBetList == true) {
                this.$store.dispatch('getShowBetList', false)  // 下注列表是否显示 false:不显示， true:显示
            }
            if(this.showKeyboard == true) {
                this.$store.dispatch('getShowKeyboard', false)  // 下注列表是否显示 false:不显示， true:显示
            }
            this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
        }
    },
}
</script>
<style lang="stylus" scoped>
@import "../../assets/stylus/blue";
.game-play
    margin-top 0rem
.quick
    position fixed
    right 0.1rem
    bottom 0.2rem
    width 0.6rem
    height 0.6rem
    border-radius 50%
    background $quickView-bg
    text-align center
    padding 0.05rem
    color $quickView-font
    transition bottom 0.5s ease-out
    -webkit-overflow-scrolling touch
    z-index 9
    box-shadow 0rem 0.01rem 0.05rem $odds-show
    display flex
    svg
        width 0.25rem
        height 0.26rem
        background $count-bg
        border-radius 0.03rem
        margin auto
    p
        line-height 0.26rem
.show-quick
    bottom 0rem!important
    transition bottom 0.5s ease-in
    z-index 100
    visibility visible!important
.hid-quick
    bottom calc(1.38rem - 100vh)!important
    transition bottom 0.5s ease-out
.quick-scroll
    bottom 0.9rem
    transition bottom 0.5s ease-out
</style>

