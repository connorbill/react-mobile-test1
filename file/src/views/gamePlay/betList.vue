<template lang="jade">
    div.betlist
        ul.bet-list-tit
            li(v-for="val in titel") {{ val }}
            li {{ isSucceed ? '状态' : '删除'}}
        ul.bet-list
            li(v-for="val in readyBetList", @touchend.prevent="delBet(val.betType)")
                p
                    span.bet-list-span {{ val.betOnValue }}_{{ val.betValue }}
                    span @{{ val.odds }}
                p {{ betAmount == '' ? 0 : betAmount }}
                p {{ getWin(val.odds) }}
                p
                    svg-icon(icon-class="cancel", v-show="isSucceed == false")
                    svg-icon(icon-class="dui", v-show="isSucceed")
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'BetList', // 投注列表
    components: {

    },
    computed: {
        ...mapState({
            readyBetList: state => state.home.readyBetList, // 准备投注列表
            totalWin: state => state.home.totalWin, // 总返还
            betAmount: state => state.home.betAmount, // 单注金额
            curParMenu: state => state.home.curParMenu, // 当前父菜单Code
            subPlayCur: state => state.home.subPlayCur, // 选中二级玩法CODE
            isSucceed: state => state.home.isSucceed, // 是否投注成功
        }),
        allOddActive: { // 当前赔率状态
            get() {
                return this.$store.state.home.allOddActive
            },
            set(item) {
                return item
            }
        },
        oddActive: { // 当前批量下注值
            get() {
                return this.$store.state.home.oddActive
            },
            set(item) {
                return item
            }
        },
        
    },
    data() {
        return {
            // titel: ['详情', '金额', '返还', '删除'],
            titel: ['详情', '金额', '返还'],
            cnn: 1, // 排列组合 1: 未排列, 2: 两项排列, 3:三项排列,
        }
    },
    filters: {
        
    },
    created() {

    },
    mounted() {

    },
    methods: {
        judgeCnn(pm, p) { // 判断是否组选 pm:当前一级玩法菜单  p:当前二级游戏玩法
            if((pm == "HK" && (p == 'SHENGXIAO6_2' || p == 'SHENGXIAOLIAN_Y_2' || p == 'SHENGXIAOLIAN_N_2' || p == 'WEISHULIAN_Y_2' || p == 'WEISHULIAN_N_2'))){
                this.cnn = 2;
                return
            }
            if((pm == "HK" && (p == 'SHENGXIAO6_3' || p == 'SHENGXIAOLIAN_Y_3' || p == 'SHENGXIAOLIAN_N_3' || p == 'WEISHULIAN_Y_3' || p == 'WEISHULIAN_N_3'))){
                this.cnn = 3;
                return
            }
            this.cnn = 1;
        },
        getWin(odds) { // 单注返还 odds:赔率
            let a = this.betAmount, // 预备下注列表
                total = 0 // 返还
            let n = (Math.floor(parseInt(a * 100))) * (Math.floor(parseInt(odds * 100))) // 赔率 * 单注金额
                total += Math.floor(n) / 100
            let zs = Math.floor(total * 100) / 100, // 整数部分
                s = zs.toString() //  转字符串
            let xs =  s.substring(s.length - 2, s.length) // 小数部分
                total =  parseInt(zs / 100) + '.' + xs  // 返回保留两位小数的值
                return total
        },
        delBet(v) { // 删除当前下注项
            if(this.isSucceed == true) { // 判断是否下注成功  
                return // 下注成功禁止删除下注项
            }
            this.$store.dispatch('getChoiceBet', 0)
            let delCnnArr = {}, // 组选被删对像
                delBetOn = '' // 组选被删除二级CODE
            let arrNew = this.readyBetList.filter((value, index, arr) => { // 得到删除后的数组
                if(v != value.betType) {
                    return value
                } else {
                    this.judgeCnn(this.curParMenu, value.betOn) // 判断是否组选
                    if(this.cnn == 1) { // 非组选全部选中项设置
                        this.oddActive.forEach((ov, ok) => { // 当前选中项设置
                            this.$set(this.oddActive[ok], value.betType, false)  // 当前赔率初始全部设为false
                        })
                        this.allOddActive[value.betOn].forEach((val, key) => { // 全部选中项设置
                            for(let i in val) {
                                if(i == value.betType) {
                                    this.allOddActive[value.betOn].forEach((ov, ok) => {
                                        this.$set(this.allOddActive[value.betOn][ok], value.betType, false)  // 当前赔率初始全部设为false
                                    })
                                }
                            }
                        })
                    } else { // 组选全部选中项设置
                        delBetOn = value.betOn // 组选被删除二级CODE
                        delCnnArr[delBetOn] = value.betType.split(',') // 组选被删对像转为数组
                    }
                }
            });


            if(this.cnn != 1) { 
                let allnArr = {}, // 临时存放不能删除的排列选项
                    nArr = {}, // 临时存放不能删除的排列选项
                    noArr = false // 判断当前二级玩法列表是事为空 false：空，oddActive全置为false
                if(arrNew.length > 0) { // 如果下注条数不为0
                    arrNew.forEach((v, k) => { // 查找组选是否删除完成
                        let betArr = v.betType.split(','), // 组选未被删对像
                            betOn = v.betOn // 二级玩法CODE
                            if(v.betOn == this.subPlayCur) {
                                noArr = true  // 判断当前二级玩法列表是事为空 false：空，oddActive全置为false
                            }
                        for(let i in betArr) {
                            if(delBetOn == betOn && delCnnArr[delBetOn].includes(betArr[i])) { // 如果被删除BetOn
                                nArr[betArr[i]] = delCnnArr[delBetOn].includes(betArr[i]) // 如果排列组合还有其它组合，则不能删除
                                allnArr[betOn] = nArr
                            }
                        }
                    })
                    
                    arrNew.forEach((value, key) => { // 查找组选是否删除完成
                        if(noArr == false) { // 如果当前二级玩法CODE全部下注项被删除
                            this.oddActive.forEach((ov, ok) => { // 当前选中项设置
                                for(let v in ov) {
                                    this.$set(this.oddActive[ok], v, false)  // 当前赔率初始全部设为false
                                }
                            })
                        }

                        let betOn = value.betOn, // 二级玩法CODE
                            inArr = [] // 暂存不需要删除的
                            for(let di in delCnnArr[delBetOn]) {
                                for(let ai in allnArr[delBetOn]) {
                                    if(!inArr.includes(ai)) { // 去重
                                        inArr.push(ai) // 暂存不需要删除的
                                    }
                                }
                            }
                            for(let i in delCnnArr[delBetOn]) { // 删除非当前二级玩法下的下注项
                                let delBet = delCnnArr[delBetOn][i] // 需要删除的下注项
                                if(!inArr.includes(delBet)) { // 去重
                                    this.allOddActive[delBetOn].forEach((dv, dk) => {
                                        for(let di in dv) {
                                            this.$set(this.allOddActive[delBetOn][dk], delBet, false)  // 所有选中赔率初始全部设为false
                                        }
                                    })
                                }
                            }                         
                    })
                } else { // 下注表列已被全部删除
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
                }
            }

            this.$store.dispatch('getReadyBetList', arrNew) // 删除后的数组
            let betLen = arrNew.length // 总下注条数
            this.$store.dispatch('getTotalBets' , betLen) // 投主长度
            if(betLen <= 0) {
                this.$store.dispatch("getBetAmount",0) // 没有下注项时投注金额清空
                this.$store.dispatch('getShowBetList', false)  // 下注列表是否显示 false:不显示， true:显示
                this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
            }
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
.betlist
    position fixed
    bottom 0.85rem
    left 0
    width 100%
    border-radius 0.08rem 0.08rem 0rem 0rem
    z-index 100
    -webkit-overflow-scrolling touch
    font-size 0
.bet-list-tit
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    background $bet-tot-bg
    color $order-tit-font
    border-radius 0.08rem 0.08rem 0rem 0rem
    li
        text-align center
        width 18%
        font-size 0.15rem
        height 0.45rem
        line-height 0.45rem
        &:nth-child(1)
            width 46%
.bet-list
    background $bet-bg
    max-height calc(100vh - 2.5rem)
    overflow auto
    position relative
    top -0.01rem
    li
        display flex
        flex-wrap wrap
        justify-content space-around
        flex-direction row
        width 100%
        height 0.45rem
        line-height 0.45rem
        border-top 0.01rem solid $bet-but-line
        box-sizing content-box
        p
            height 100%
            text-align center
            width 18%
            color $order-font
            font-size: 0.14rem;
            &:nth-child(1)
                width 46%
                padding-left 0.1rem
                display flex
                flex-flow nowrap
                span
                    display inline-block
                    font-size: 0.14rem;
                .bet-list-span
                    max-width 75% 
                    white-space nowrap
                    text-overflow ellipsis !important
                    overflow hidden !important
            &:nth-child(4)
                svg 
                    font-size 0.18rem
</style>