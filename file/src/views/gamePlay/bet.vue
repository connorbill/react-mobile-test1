<template lang="jade">
    article.bet(:class="showKeyboard ? 'bottom200' : ''")
        ul.tot-bet(@touchend.prevent="getShowList") 
            li
                span.bet-num {{ totalBets }}
                span 注
            li  
                span 总金额：
                span.bet-num {{ betAmount * totalBets }}
            li  
                span 总返还: 
                span.bet-num {{ totalWin }}
        ul.bet-con
            li(@touchend.prevent="getShowKeyBoard", :class='hint') 
                span.bet-num(v-if="betAmount != ''  && betAmount != 0") ￥
                span(:class="betAmount != '' && betAmount != 0 ? 'bet-num' : ''") {{ isAmount(betAmount) }} 
                span(v-if="betAmount != ''  && betAmount != 0") (单注金额)
            li(@touchend.prevent="goToBet") 
                span 投注{{ message }}
                vue-loading(v-show="isLoading")
</template>

<script>
import { mapState } from "vuex";
import { betOrder } from '@/api/home' // API接口
import loading from '@/views/member/loading' // loading
export default {
    name: 'Bet', // 投注
    components: {
        'vue-loading': loading
    },
    computed: {
        ...mapState({
            totalAmount: state => state.home.totalAmount, // 总下注金额
            readyBetList: state => state.home.readyBetList, // 准备投注列表
            totalWin: state => state.home.totalWin, // 总返还
            showBetList: state => state.home.showBetList, // 是否显示下注列表 false:不显示， true:显示
            showKeyboard: state => state.home.showKeyboard, // 是否显示键盘 false:不显示， true:显示
            curSubMenuId: state => state.home.curSubMenuId, // 当前子菜单ID
            isSucceed: state => state.home.isSucceed, // 是否投注成功
            oddActive: state => state.home.oddActive, // 当前赔率初始全部设为false
            allOddActive: state => state.home.allOddActive, // 曾被选中所有赔率
            curDisable: state => state.home.curDisable, // 当前期开盘状态  true:关盘,  false 开盘
            betShowBg: state => state.home.betShowBg, // 遮罩层是否显示
            showQuick: state => state.home.showQuick, // 投注快捷菜单是否显示 false:不显示， true:显示
            newAmount: state => state.home.newAmount, // 临时金额
        }),
        totalBets: { // 总下注条数
            get() {
                let a = this.betAmount // 单注金额
                this.getTotWin(a) // 总返还
                return this.$store.state.home.totalBets
            },
            set(item) {
                return item
            }
        },
        betAmount: { // 单注金额
            get() {
                return this.$store.state.home.betAmount
            },
            set(item) {
                this.$store.dispatch('getBetAmount', item)
                this.getTotWin(item) // 总返还
                return item
            }
        }
    },
    data() {
        return {
            isClick: false,  // 防多点击 true 不可点, false 可点
            isLoading:false, // 投注是否显示加载图标
            message:'', // 投注按钮显示投注成功与否
            hint:'', // 用于提示用户为输入投注金额
        }
    },
    watch: {
        betShowBg: { // 监听遮罩层点击操作
            handler: function(newVal,oldVal) {
                if(newVal == false && this.isLoading) { // 判断是否在投注中
                    this.$store.dispatch('getBetShowBg', true) // 显示遮罩层   投注中防止遮罩层消失继续增减下注项
                    return
                }
                if(newVal == false && this.isSucceed){  // 点击遮罩层时判断是否为投注成功状态  
                    // 投注成功状态时点击关闭遮罩层并初始化
                    this.initialization() // 初始化赋值
                }
            }
        },
        curDisable: { // 监听是否关盘
            handler: function(newVal,oldVal) {
                if(newVal == true) {
                    this.initialization() // 初始化赋值
                    if(this.isLoading) { // 关盘时判断是否在投注中  投注中择不初始化  等其返回数据后 初始化
                        return
                    }
                }
            }
        },
        betAmount: { // 监听单注金额是否为空
            handler: function(newVal,oldVal) {
                if(newVal != 0 && newVal != '') {
                    this.hint = ''
                }
            }
        },
        readyBetList: { // 监听准备投注列表是否为空
            handler: function(newVal,oldVal) {
                if(newVal.length <= 0) {
                    this.hint = ''
                }
            }
        }
    },
    filters: {
        
    },
    created() {

    },
    mounted() {

    },
    methods: {
        isAmount(v) { // 过滤输入金额
            let amount = v // 
            if(v == 0 || v == '') {
                this.$store.dispatch("getNewAmount",'') // 输入的第一个数字为0时清除临时单注金额
                amount = '请输入金额(单注金额)'
            }
            if(v != '') { // 判断金额不为空
                if(v.substring(0 , 1) == 0) { // 截取第一个字符串判断是否为0
                    if(v.substring(1) == 0) { // 判断后面的字符是否为0  防止输入金额第一个字符为0
                        amount = '请输入金额(单注金额)'
                    }else { // 后面的字符不为0
                        amount = v.substring(1)
                    }
                }else { // 第一个字符不为0
                    amount = v
                }
            } 
            return amount
        },
        getTotWin(a) { // 获取总返还 a:单注金额
            let list = this.readyBetList, // 预备下注列表
                total = 0 // 返还
                list.forEach((v, k) => {
                    let n = (Math.floor(parseInt(a * 100))) * (Math.floor(parseInt(v.odds * 100))) // 赔率 * 单注金额
                    total += Math.floor(n) / 100
                });
                let zs = Math.floor(total * 100) / 100, // 整数部分
                    s = zs.toString() //  转字符串
                let xs =  s.substring(s.length - 2, s.length) // 小数部分
                total =  parseInt(zs / 100) + '.' + xs  // 返回保留两位小数的值
                this.$store.dispatch('getTotalWin', total) // 总返还
        },
        getShowList() { // 是否显示下注列表
            let s = this.showBetList
            this.$store.dispatch('getBetShowBg', !s) // 下注页背景层是否显示 true:显示，false:不显示
            this.$store.dispatch('getShowBetList', !s) // 是否显示下注列表 false:不显示， true:显示
            this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
        },
        getShowKeyBoard() { // 是否显示键盘
            if(this.isSucceed) {
                return
            }
            let s = this.showKeyboard
            if(s == false) {
                this.$store.dispatch('getShowBetList', false) // 是否显示下注列表 false:不显示， true:显示
            }
            this.$store.dispatch('getBetShowBg', !s) // 下注页背景层是否显示 true:显示，false:不显示
            this.$store.dispatch('getShowKeyboard', !s) // 是否显示键盘 false:不显示， true:显示
            this.hint = ''
        },
        goToBet() { // 确这投注
            this.$store.dispatch("getNewAmount", '') // 初始临时单注金额
            if(this.betAmount == '' || this.betAmount == 0) {
                this.hint = 'hint-warning'
            }
            if(this.curDisable == false) { // 判断是否已关盘
                if(this.isSucceed) { // 判断是否为下注成功状态
                    this.initialization() // 初始化赋值
                    return
                }
                if(this.isClick == true) {   // 防多点击 true 不可点, false 可点
                    setTimeout(() => {
                        this.isClick = false 
                    }, 5000)
                    return;
                }
                this.$store.dispatch('getisSucceed',false) // 恢复下注状态
                this.isClick = true;  // 防多点击 true 不可点, false 可点
                let cOddsArr = [] // 临时存确认下注项
                let cOdds = {} // 临时存确认下注项
                for(var i=0, l=this.readyBetList.length; i<l; i++){
                    let amount = this.readyBetList[i].amount // 下注金额
                    // if(this.readyBetList[i].amount == 0) {
                    //     amount = this.betAmount
                    // }
                    amount = this.betAmount
                    if(this.betAmount == 0 && amount == 0) {
                        // this.$tips.success('请输入下注金额') // 投注失败提示
                        this.isClick = false
                        return
                    }
                    cOdds = {
                                "playRuleId": this.readyBetList[i].playRuleId, // 玩法
                                "betType": this.readyBetList[i].betType, // 下注号码
                                "odds": this.readyBetList[i].odds, // 赔率
                                "amount": amount // 单注金额
                            }
                    cOddsArr.push(cOdds) // 确定下注数组
                }
                if(cOddsArr.length > 0) { // 如果有下注值
                    this.$store.dispatch('getBetShowBg', true) // 下注页背景层是否显示 true:显示，false:不显示
                    this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
                    this.message = '中'
                    this.isLoading = true // 显示loading图标
                    let params = {
                        lotteryId: parseInt(this.curSubMenuId),
                        betList: cOddsArr // 下注列表
                    }
                    betOrder(params).then((response) => { // 提交下注注单号
                        this.isClick = false;  // 防多点击 true 不可点, false 可点
                        let res = response
                        if(res && res.success == 1) { // 如果请求成功
                            this.isLoading = false // 投注成功隐藏loading图标 
                            // this.$tips.success('投注成功') // 投注成功提示
                            this.$store.dispatch("getisSucceed",true)
                            this.message = '完成'
                            this.$store.dispatch('getShowBetList', true) // 是否显示下注列表 false:不显示， true:显示 
                        } else {
                            // this.$tips.success('投注失败') // 投注失败提示
                            this.isLoading = false // 投注成功隐藏loading图标
                            this.message = ''
                            // this.$store.dispatch("getisSucceed",true) // 恢复下注状态
                            let arr = ['160013','160010']
                            if(arr.includes(res.respCode) == true) {
                                this.$store.dispatch('getNewAmount',this.betAmount) // 投注失败时保存投注金额
                            }
                        }
                    }).catch((err) => {
                        // console.log("请求超时，请重新投注",err)
                    })
                }
            } else {
                // this.$tips.success('已关盘,投注失败') // 关盘提示 
                this.initialization() // 初始化清空下注项
            }
        },
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
            this.$store.dispatch('getisSucceed', false) // 恢复下注状态
            this.$store.dispatch('getShowBetList', false) // 是否显示下注列表 false:不显示， true:显示
            this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
            this.$store.dispatch('getReadyBetList', []) // 清空下注项
            this.$store.dispatch('getTotalBets', 0) // 清除下注条数
            this.$store.dispatch('getBetAmount', 0) // 清空单注下注金额
            this.$store.dispatch("getNewAmount", '') // 初始临时单注金额
            this.message = '' // 恢复下注按钮
            this.isLoading = false // 隐藏loading
            if(this.showQuick) { // 判断投注快捷菜单是否是显示的
                this.$store.dispatch('getBetShowBg', true) // 下注页背景层是否显示 true:显示，false:不显示
                return
            }
            this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
        }
    },
    beforeDestroy() { // 根组件被beforeDestroy

    },
    destroyed() { // 组件销毁时清除定时器
        
    }
}
</script>

<!-- 添加“scoped”属性以仅将CSS限制为此组件 -->
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.bet
    position fixed
    bottom 0
    left 0
    width 100%
    z-index 101
    -webkit-overflow-scrolling touch
.bottom200
    bottom 2rem
.tot-bet
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    height 0.35rem
    line-height 0.35rem
    background $bet-tot-bg
    color $bet-font
    box-shadow 0 0 0.02rem $bet-tot-bg2
    &::before
        content ''
        height 0.01rem
        width 100%
        background $bet-tot-bg
        position relative
        top -0.01rem
    li
        span
            color $bet-font-d
            font-size 0.14rem
        .bet-num
            color $bet-font-a
            font-weight bold
            font-family Arial, Helvetica, sans-serif
            padding-right 0.04rem
.bet-con
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    background $bet-tot-bg1
    li
        line-height 0.5rem
        height 0.5rem
        &:nth-child(1)
            width 2.25rem
            line-height 0.5rem
            height 0.5rem
            color $bet-font
            text-align center
            span 
                font-size 0.15rem
            .bet-num
                color $count-active
                padding-right 0.02rem
                &:nth-child(2)
                    font-size 0.2rem
                    font-weight bold
                    font-family Arial, Helvetica, sans-serif
        &:nth-child(2)
            flex 1
            display flex
            justify-content center
            background $count-down-bg-color
            text-align center
            color $bet-but-font
            cursor pointer
            span 
                margin-right 0.05rem
                font-size 0.16rem
                font-weight bold
.hint-warning
    color red !important
    border 0.01rem solid red
</style>