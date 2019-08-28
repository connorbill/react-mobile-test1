<template lang="jade">
    div.odds
        .odds-menu-box
            //- v-touch.vtouch(v-on:swipeleft='left(parPlayCurIndex)', v-on:swiperight='right(parPlayCurIndex)', style="touch-atction:pan-y", :swipe-options="{direction: 'horizontal'}")
            .odds-menu 
                .menu-wrap
                    //- (:style="'transform: translate(' + parTranslat +'rem, 0rem); transition:transform 300ms ease'")
                    .par-Menu-warp
                        ul.odds-par-menu(:class="parMenuWidth", :style="'transform: translate(' + parTranslat +'rem, 0rem); transition:transform 300ms ease'", ref='onePlaying')
                            li(v-for="list, index in parCurMenuArr", :key="index", :class="parPlayCurIndex === index ? 'active' : ''", @touchend="getActiveParMenu(list.id, index)") {{ list.betOnValue }}
                    .sub-Menu-warp(:style="'transform: translate(' + subTranslat +'rem, 0rem); transition:transform 300ms ease'")
                        ul.odds-sub-menu(v-if="curParMenu =='HK'",:class="(parPlayCur ==6)||(parPlayCur ==7)?'odds-sub-menu-set':''")
                            li(v-for="list, index in subCurMenuArr", :key="index", :class="subPlayCurIndex === index ? 'suAactive' : ''", @touchend="getActiveSubMenu(list.betOn, index)")
                                span {{ list.betOnValue }}
            .odds-con(ref="getScroll", :class="[curParMenu =='HK'? 'mt243' : 'mt223', preventScroll]", v-for="val,key in curOddsArr", v-show="curOddsArr.length > 0", :key="key") 
                ul.odds-list(v-for="v,i in (flag ? twoLevel : 1)", :class="[totalBets >= 1 ? 'mt100' : '', 'column' + column, numOdds, 'odds-list-' + curParMenu, dynamicClass]")
                    li(v-for="item,index, k in (flag ? twoList[i] : val)", :key="index", :class="[judgeDiable(oddActive[key][index]) ? 'betDisabled' : '', oddhight, oddActive[key][index] ? 'oddsActive' : '']")
                        svg-icon.activebet(icon-class="odds", v-if="oddActive[key][index]")
                        .check-box(v-model="oddActive[key][index]", :disabled="judgeDiable(oddActive[key][index])", :checked="oddActive[key][index]", class="check-list", @touchend="checkBox(key, index)")
                            span
                                i(:class="item.betType | ball", v-if="curParMenu != 'HK' && curParMenu != 'FT' && subPlayCur != 'GOLD_SILVER'") {{ item.betValue }}
                                i(:class="[item.color, item.color ? 'ball-small' : '']", v-if="curParMenu == 'HK'") {{ item.betValue }}
                                i(:class="item.betType | ball1", v-if="curParMenu == 'PKT' && subPlayCur == 'GOLD_SILVER'") {{ item.betValue }}
                                //- 快三 三军，短牌, 全骰
                                img(v-for="val in arrToStr(item.betValue).length", v-if="curParMenu == 'FT' && subPlayCur == 'SAN_JUN' || subPlayCur == 'PAIR' || (subPlayCur == 'TRIPLE' && item.betValue != '全骰')", :src="item.betValue | k3icon")
                                //- 全骰
                                i(v-if="curParMenu == 'FT' && ((subPlayCur == 'TRIPLE' && item.betValue == '全骰') || subPlayCur == 'TOTAL')") {{ item.betValue }}
                                //- 长牌
                                img(v-if="curParMenu == 'FT' && subPlayCur == 'SPEC_TWO' ", :src="item.betValue | k3icon1")
                                img(v-if="curParMenu == 'FT' && subPlayCur == 'SPEC_TWO' ", :src="item.betValue | k3icon2")
                            span.ball-list(v-show="column == 1", :class="getLen(item.ballList)") 
                                i(v-for="i,n in item.ballList", :class="[i.color, i.color ? 'ball-small' : '']") {{ i.ballNo }}
                            span.ball-listtow {{ judgeOdds(item.odds) }}
</template>

<script>
import { mapState } from "vuex";
import { oddsList } from '@/api/home' // 获取中奖榜单
export default {
    name: 'Odds',
    components: {

    },
    computed: {
        ...mapState({
            curSubMenuId: state => state.home.curSubMenuId, // 当前子菜单ID
            oddsArr: state => state.home.oddsArr, // 赔率列表
            parPlayCur: state => state.home.parPlayCur, // 一级菜单选中ID
            subPlayCur: state => state.home.subPlayCur, // 选中二级玩法CODE
            parPlayCurIndex: state => state.home.parPlayCurIndex, // 一级菜单选中Index
            subPlayCurIndex: state => state.home.subPlayCurIndex, // 二级菜单选中Index
            parCurMenuArr: state => state.home.parCurMenuArr, // 当前一级玩法
            subCurMenuArr: state => state.home.subCurMenuArr, // 当前二级玩法
            curParMenu: state => state.home.curParMenu, // 当前父菜单Code
            oddActive: state => state.home.oddActive, // 当前赔率初始全部设为false
            readyBetList: state => state.home.readyBetList, // 准备投注列表
            choiceBet: state => state.home.choiceBet, // 是否选择来的下注 0:不是，1:是
            betDisabled: state => state.home.betDisabled, // 是否可选下注项false:  继续下注, true：超过不可下注
            totalBets: state => state.home.totalBets, // 总下注条数
            betAmount: state => state.home.betAmount, // 单注金额
            curDisable: state => state.home.curDisable, // 当前期开盘状态 true:关盘, false:开盘
            allOddsList: state => state.home.allOddsList, // 获取所有赔率
            betShowBg: state => state.home.betShowBg, // 遮罩层是否显示
        }),
        curOddsArr: { // 当前赔率列表
            get() {
                if(this.$refs.getScroll) { // 滚动条重置为顶部
                    this.$refs.getScroll[0].scrollTop = 0 // 滚动条置为顶部
                }
                return this.$store.state.home.curOddsArr
            },
            set(item) {
                return item
            }
        },
        allOddActive: { // 曾被选中所有赔率
            get() {
                return this.$store.state.home.allOddActive
            },
            set(item) {
                return item
            }
        },
        flag() { //是否需要拆分数组
            if(this.curParMenu == 'HK') { // 如果是特码或正特1-6
                if(this.subPlayCur == 'TEMA' || this.subPlayCur.indexOf("ZHENGTE_") != -1) { // 特码或正特1-6
                    return 'TEMA'
                }
                if(this.subPlayCur == 'TEMA_TOU') {
                    return 'TEMA_TOU'
                }
            }
            if(this.curParMenu == 'PKT' && this.subPlayCur == 'GOLD_SILVER') { // 如果是PK10冠亚和
                return 'GOLD_SILVER'
            }
            let list = ['BALL_1','BALL_2','BALL_3','BALL_4'],
                list2 = ['BALL_5','BALL_6','BALL_7','BALL_8']
            if(this.curParMenu == 'KLT' && list.includes(this.subPlayCur)) { // 快乐十分
                return 'KLT'
            }else if(this.curParMenu == 'KLT' && list2.includes(this.subPlayCur)){
                return 'KLT1'
            }
        },
        twoLevel() { // 拆分的数组需循环的次数
            if(this.flag == 'TEMA') { // 特码、正特1-6
                let obj1 = {}, // 号码对象
                    obj2 = {} // 非号码对象
                this.twoList = [] // 数据拆分后又合成的数组
                this.oddsArr.forEach((item,key) => {
                    if(item.betOnValue == '特码') {
                        let arr1 = item.playRuleList
                        arr1.forEach((val,index) => {
                            if(val.betOn == 'TEMA') {
                                let arr2 = val.betTypeList[0]
                                for(let i in arr2) {
                                    if(arr2[i].betType.indexOf("NO_") != -1) {
                                        obj1[i] = arr2[i] // 号码球
                                    }else {
                                        obj2[i] = arr2[i] // 非号码球
                                    }
                                }
                            }
                        })
                    }
                })
                this.twoList.push(obj2)
                this.twoList.push(obj1)
                return 2
            }
            if(this.flag == 'TEMA_TOU') { // 特码头尾
                let obj1 = {}, // 特码头对象
                    obj2 = {} // 特码尾对象
                this.twoList = [] // 数据拆分后又合成的数组
                this.oddsArr.forEach((item,key) => {
                    if(item.betOnValue == '特码') {
                        let arr1 = item.playRuleList
                        arr1.forEach((val,index) => {
                            if(val.betOn == 'TEMA_TOU') {
                                let arr2 = val.betTypeList[0]
                                for(let i in arr2) {
                                    if(arr2[i].betType.indexOf("TEMA_TOU_") != -1) {
                                        obj1[i] = arr2[i] // 特码头
                                    }else {
                                        obj2[i] = arr2[i] // 特码尾
                                    }
                                }
                            }
                        })
                    }
                })
                this.twoList.push(obj1)
                this.twoList.push(obj2)
                return 2
            }
            if(this.flag == 'GOLD_SILVER') { // 冠亚和
                let obj1 = {}, // 号码对象
                    obj2 = {} // 非号码对象
                this.twoList = [] // 数据拆分后又合成的数组
                this.oddsArr.forEach((item,key) => {
                    if(item.betOnValue == '冠亚和') {
                        let arr1 = item.playRuleList[0].betTypeList[0]
                        for(let i in arr1) {
                            if(arr1[i].betType.indexOf("GUAN_YA_HE_") != -1) {
                                obj1[i] = arr1[i] // 号码球
                            }else {
                                obj2[i] = arr1[i] // 非号码球
                            }
                        }
                    }
                })
                this.twoList.push(obj1)
                this.twoList.push(obj2)
                return 2
            }
            if(this.flag == 'KLT') { // 快乐十分
                let obj1 = {}, // 号码对象
                    obj2 = {}, // 非号码对象 不包含龙、虎
                    obj3 = {} // 非号码对象 龙、虎
                this.twoList = [] // 数据拆分后又合成的数组
                this.oddsArr.forEach((item,key,arr) => {
                    if(item.betOnValue.indexOf("第") != -1) {
                        let arr1 = item.playRuleList[0].betTypeList[0]
                        for(let i in arr1) {
                            if(arr1[i].betType.indexOf("NO_") != -1) {
                                obj1[i] = arr1[i] // 号码球
                            }else if(arr1[i].betType == 'DRAGON' || arr1[i].betType == "TIGER") {
                                obj3[i] = arr1[i] // 非号码球 龙、虎
                            }else {
                                obj2[i] = arr1[i] // 非号码球 不包含龙、虎
                            }
                        }
                    }
                })
                this.twoList.push(obj2)
                this.twoList.push(obj3)
                this.twoList.push(obj1)
                return 3
            }
            if(this.flag == 'KLT1') { // 快乐十分
                let obj1 = {}, // 号码对象
                    obj2 = {} // 非号码对象 不包含龙、虎
                this.twoList = [] // 数据拆分后又合成的数组
                this.oddsArr.forEach((item,key,arr) => {
                    if(item.betOnValue.indexOf("第") != -1) {
                        let arr1 = item.playRuleList[0].betTypeList[0]
                        for(let i in arr1) {
                            if(arr1[i].betType.indexOf("NO_") != -1) {
                                obj1[i] = arr1[i] // 号码球
                            }else if(arr1[i].betType == 'DRAGON' || arr1[i].betType == "TIGER") {
                                // obj3[i] = arr1[i] // 非号码球 龙、虎
                            }else {
                                obj2[i] = arr1[i] // 非号码球 不包含龙、虎
                            }
                        }
                    }
                })
                this.twoList.push(obj2)
                this.twoList.push(obj1)
                return 2
            }
        },
        dynamicClass() {
            let list = ['BALL_1','BALL_2','BALL_3','BALL_4'],
                list2 = ['BALL_5','BALL_6','BALL_7','BALL_8']
            if(this.subPlayCur == 'TEMA' || this.subPlayCur.indexOf("ZHENGTE_") != -1 || this.subPlayCur == 'TEMA_TOU') {
                return 'odds-list-tema'
            }else if(this.subPlayCur == 'GOLD_SILVER') {
                return 'odds-list-gyh'
            }else if(this.curParMenu == 'KLT' && list.includes(this.subPlayCur)) {
                return 'odds-list-klt'
            }else if(this.curParMenu == 'KLT' && list2.includes(this.subPlayCur)) {
                return 'odds-list-klt1'
            }else {
                return ''
            }
        }
    },
    data() {
        return {
            numOdds: '', // 动态类名
            column: 2, // 显示列数
            oddhight: '', // 1列高度
            parMenuWidth: '', // 父级菜单宽度
            parTranslat: 0, // 一级玩法位移
            subTranslat: 0, // 二级玩法位移
            readyBet: [], // 准备下注
            cnn: 1, // 排列组合 1: 未排列, 2: 两项排列, 3:三项排列,
            co: {}, // 临时存二字，三字组合集含下标betType
            ca: [], // 临时存二字，三字组合集列表betType
            coCname: {}, // 临时存二字，三字组合集含下标中文字
            caCname: [], // 临时存二字，三字组合集列表中文字
            scrollVal:0, // 滚动条滚到的位置
            twoList: [],　// 数据拆分后又合成的数组
            preventScroll:'', // 阻止遮罩层显示时底部盒子滚动
        }
    },
    watch: {
        totalBets: { // 总下注条数
            handler: function (val, oldVal) { // 回调函数
                this.getBetListAcount(val)
            },
            immediate: false // 确认是否初始执行handler
        },
        curDisable: { // 当前期开盘状态 true:关盘, false:开盘
            handler: function (val, oldVal) { // 回调函数
                if(val == true) { // 关盘
                    this.$store.dispatch('getReadyBetList' , this.readyBet) // 准备投注列表
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
            },
            immediate: false // 确认是否初始执行handler
        },
        betShowBg: { // 监听遮罩层显示  显示时阻止遮罩层底部的盒子滚动
            handler: function (newVal,oldVal) {
                if(newVal == true) {
                    this.preventScroll = 'preventScroll'
                }else {
                    this.preventScroll = ''
                }
            }
        }
    },
    filters: {
        judgeDiable: function(v) { // 判断是否封盘
            return v
        },
        ball: function(v) { // 判断球的样式
            let rv = ''
            let n = v.charAt(v.length - 1)
            if(v.indexOf('NO_') >= 0) {
                rv = 'ball-small ball-color' + n;
            }
            return rv
        },
        ball1: function(v) { // 北京PK10 冠亚和过滤添加类名
            if(v.indexOf('GUAN_YA_HE_') >= 0) {
                return 'ball-small-pkt'
            }
        },
        k3icon: function(v) {
            let a = '../../../static/images/dice',
                b = '.png',
                n = v.charAt(v.length - 1)
            return a + n + b
            
        },
        k3icon1: function(v) { // 快三长牌第1个骰子
            let a = '../../../static/images/dice',
                b = '.png',
                n = v.slice(0, 1)
            return a + n + b
            
        },
        k3icon2: function(v) { // 快三长牌第2个骰子
            let a = '../../../static/images/dice',
                b = '.png',
                n = v.slice(-1)
            return a + n + b
        }
    },
    created() {

    },
    mounted() {
        this.oddsList();
    },
    methods: {
        // stopTouchendPropagationAfterScroll(){ // 在滚动时就给停止touchend事件冒泡
        //     var flag = false;
        //     window.addEventListener('touchmove', function(ev){
        //         flag || (flag = true, window.addEventListener('touchend', stopTouchendPropagation, true));
        //     }, false);
        //     function stopTouchendPropagation(ev){
        //         ev.stopPropagation();
        //         setTimeout(function(){
        //             window.removeEventListener('touchend', stopTouchendPropagation, true);
        //             flag = false;
        //         }, 50);
        //     }
        // },
        getLen(l) {
            if(l) {
                if(l.length <= 6) {
                    return 'pt8'
                } else {
                    return ''
                }
            }
        },
        arrToStr(v) { // 数组转字符串
            let str = v.replace(/,/g, "") // 去除字符串中的,号
            return str
        },
        judgeOdds(v) { // 判断是否可下注 赔率显示
            if(this.curDisable == true) { // 如果当期已关盘
                return '--'
            } else {
                return v
            }
        },
        judgeDiable(v) { // 判断是否可下注
            if(this.curDisable == true) { // 如果当期已关盘
                return true
            } else {
                if(this.betDisabled == false) { // 如果未超过下注个数
                    return false
                } else {
                    if (v == true) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        },
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
        defaultOddAction() { // 初始设置选中状态全为false
            this.$store.dispatch('getOddActive', []) // 重置赔率状态
            this.curOddsArr.forEach((v,k) => { // 遍历当前赔率 初始设置选中状态全部为false
                this.oddActive.push({});
                for(let key in v){
                    this.$set(this.oddActive[k], key, false)  // 当前赔率初始全部设为false
                }
            });
            this.$store.dispatch('getOddActive', this.oddActive)
        },
        getBetListAcount(val) { // 总条数判断 val:总下注条数
            if(val >= 10) { // 超过10个下注项
                this.$store.dispatch('getBetDisabled', true) // 超过不可下注
            } else {
                this.$store.dispatch('getBetDisabled', false) // 继续下注
            }
        },
        checkBox(key, index) { // item:当前下注项 下注项下标
                if(this.curDisable == true) { // 当前期开盘状态 true:关盘, false:开盘
                    return
                }
                this.$store.dispatch('getChoiceBet', 1) // 是否选择来的下注 0:不是，1:是
                this.$set(this.allOddActive, this.subPlayCur, this.oddActive) // 设置预备下注项
                if(this.totalBets <= 0) { // 重置已选下注项
                    this.co = {} // 临时存二字，三字组合集含下标betType
                    this.coCname = {} // 临时存二字，三字组合集含下标中文字
                }
                this.allOddActive[this.subPlayCur].map((v, k) => { // 设置预备下注项
                    for(let i in v) {
                        if(key === k && index === i) {
                            if(this.readyBet.length >= 10 ) { // 如果没有下注项不显示下注列表
                                if(v[i] == true) {
                                    v[i] == false
                                } else {
                                    return
                                }
                            }
                            v[i] = !v[i]
                        }
                        this.$set(this.oddActive[k], i, v[i])  // 当前赔率初始全部设为false
                    }
                })
                let arr = this.allOddActive // 曾被选中所有赔率
                if(JSON.stringify(arr) !=  '{}') { // 判断数据不为空时
                    this.readyBet = [] // 重置预备下单数组
                    for(let v in arr) { // 找到当前赔率
                        for(let val in arr[v]) {
                            this.ca = [] // 重置临时存二字，三字组合集列表betType
                            this.caCname = [] // 临时存二字，三字组合集含下标中文字
                            for(let value in arr[v][val]) {
                                let bet = arr[v][val][value] // 预备下注项
                                this.oddsArr.forEach((ov, ok) => {
                                    for(let pv in ov.playRuleList) {
                                        if(bet == true && v == ov.playRuleList[pv].betOn) { // 如果选中
                                            this.judgeCnn(this.curParMenu, v) // 判断是否组选
                                            let odds = ov.playRuleList[pv]['betTypeList'][val][value].odds, // 获取下注项赔率
                                                betValue = ov.playRuleList[pv]['betTypeList'][val][value].betValue, // 获取下注项中文名
                                                betOnValue = ov.playRuleList[pv].betOnValue, // 获取二级玩法中文名
                                                betOn = ov.playRuleList[pv].betOn, // 获取二级玩法CODE
                                                id = ov.playRuleList[pv].id // 二级玩法ID
                                            if(this.cnn != 1) { // 如果是排列组合下注
                                                this.ca.push(value) // 临时存二字，三字组合集列表betType
                                                this.co[v] = this.ca // 临时存二字，三字组合集含下标betType
                                                this.caCname.push(betValue) // 临时存二字，三字组合集含下标中文字
                                                this.coCname[v] = this.caCname // 临时存二字，三字组合集含下标中文字
                                            } else { // 单个下注
                                                let o = {'betOn': betOn, 'betOnValue': betOnValue, 'playRuleId': id, 'betType':value, 'odds':odds, 'amount': this.betAmount,'betValue':betValue } // 预备下注集合
                                                this.readyBet.push(o) // 选中的预备下注集合
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                }

                // 排列组合下注
                for(let cnv in this.co) { // this.co临时存二字，三字组合集含下标， cnv:二级玩法code
                    this.judgeCnn(this.curParMenu, cnv) // 判断是否组选 cnv:二级玩法code
                    let cnnArr = this.groupSplit(this.co[cnv], this.cnn), // 排列组合新数组betType
                        cnnArrCname = this.groupSplit(this.coCname[cnv], this.cnn) // 排列组合新数组中文字
                    cnnArr.forEach((cnav, cnak) => { // 遍历排列组合所得到的新数组
                        let oddsRatio = [], // 赔率对比
                            oddsRatio01 = [], // 赔率对比
                            betOnValue = [], // 获取二级玩法中文名
                            betOn = [], // 获取二级玩法CODE
                            id = '' // 获取二级玩法ID
                        for(let newVal in cnav) {
                            this.oddsArr.forEach((ov, ok) => { // 去赔率集合里匹配最小赔率
                                for(let pv in ov.playRuleList) {
                                    let curBetOn = ov.playRuleList[pv].betOn // 当前下注betOn Code
                                    if(cnv == curBetOn) { // 如果选中
                                        let oddList = ov.playRuleList[pv].betTypeList // 当前下注列表
                                        oddList.forEach((val, key) => {
                                            for(let oddVal in val) {
                                                if(cnav[newVal] == oddVal) {
                                                    oddsRatio.push(val[oddVal].odds) // 临时存排列组合得到的数组
                                                    oddsRatio01.push(val[oddVal].betValue) // 临时存排列组合得到的数组
                                                    betOnValue = ov.playRuleList[pv].betOnValue, // 获取二级玩法中文名
                                                    betOn = ov.playRuleList[pv].betOn, // 获取二级玩法CODE
                                                    id = ov.playRuleList[pv].id // 获取二级玩法ID
                                                }
                                            }
                                        })

                                    }
                                }
                            })
                        }
                        
                        let maxOdds = this.getMinOdds(oddsRatio), // 得到最小赔率
                            s = cnav.join(','), // 排列组合下注项数组转字符串
                            t = cnnArrCname[cnak].join(','), // 排列组合新数组中文字数组转字符串 
                            o = {'betOn': betOn, 'betOnValue': betOnValue, 'playRuleId':id, 'betType':s,'betValue': t, 'odds':maxOdds, 'amount':this.betAmount, } // 预备下注集合
                            this.readyBet.push(o) // 选中的预备下注集合
                    })
                }

            let betLen = this.readyBet.length // 总下注条数
            this.getBetListAcount(betLen) // 超过10个下注项
            if(betLen >= 0) { // 如果有下注条数
                this.$store.dispatch('getTotalBets' , betLen) // 投主长度
                this.$store.dispatch('getReadyBetList' , this.readyBet) // 准备投注列表
            }
            if(this.readyBet.length <= 0) { // 如果没有下注项不显示下注列表
                this.$store.dispatch('getShowBetList', false) // 是否显示下注列表 false:不显示， true:显示
                this.$store.dispatch("getBetAmount",0) // 没有下注项时投注金额清空
            }
        },
        groupSplit(arr, size) {  // 排例组合
            if(arr.length < size) {
                return [];
            }
            let r = []; //result
            function _(t, a, n) { //tempArr, arr, num
                if (n === 0) {
                    r[r.length] = t;
                    return;
                }
                for (var i = 0, l = a.length - n; i <= l; i++) {
                    var b = t.slice();
                    b.push(a[i]);
                    _(b, a.slice(i + 1), n - 1);
                }
            }
            _([], arr, size);
            return r;
        },
        getMinOdds(arr) { // 获取数组里的最小值
            let min = parseFloat(arr[0]) // 将数组第一个元素赋给min
            arr.forEach((v, k) => { // 遍历数组
                let vv = parseFloat(v)
                min = min < vv ? min : vv
            })
            return min // 返回最小值
        },
        // left(index) { // index: 选中一级玩法index下标
        //     if(this.subPlayCurIndex < this.subCurMenuArr.length - 1 ) { // 如果未滑到二级玩法未到最后一个 进到下一个二级玩法
        //         if(this.subPlayCurIndex >= 1 && this.subPlayCurIndex < this.subCurMenuArr.length - 3) {
        //             this.subTranslat = -0.9 * this.subPlayCurIndex
        //         }
        //         this.$store.dispatch('getSubPlayCur', this.subCurMenuArr[this.subPlayCurIndex].betOn)  // 选中二级玩法CODE
        //         this.$store.dispatch('getSubPlayCurId', this.subCurMenuArr[this.subPlayCurIndex].id)  // 选中二级玩法Id
        //         this.$store.dispatch('getSubPlayCurIndex', this.subPlayCurIndex + 1) // 选中二级玩法index下标
        //         this.$store.dispatch('getCurOdds', this.subCurMenuArr[this.subPlayCurIndex].betTypeList) // 选中赔率

        //     } else { // 如果滑到一级彩种最后一个 进到下一个菜单
        //         if(this.parPlayCurIndex < this.parCurMenuArr.length - 1 ) { // 如果未滑到一级菜单最后一个 进到父级菜单滑动
        //             this.$store.dispatch('getParPlayCurIndex', this.parPlayCurIndex + 1) // 初始游戏一级玩法
        //             if(this.parPlayCurIndex >= 2 && this.parPlayCurIndex < this.parCurMenuArr.length - 2) { // 一级玩法位移
        //                 this.parTranslat = -0.7 * (this.parPlayCurIndex - 2)
        //             }
        //             let pid = this.parCurMenuArr[this.parPlayCurIndex].id // 父级Id
        //             this.getActiveParMenu(pid, index + 1) // 得到默认二级玩法
        //             this.subTranslat = -0.9 * this.subPlayCurIndex
        //         }
        //     }
        // },
        // right(index) { // index: 选中模一级玩法
        //     if(this.subPlayCurIndex > 0 ) { // 如果未滑到二级玩法未到最后一个 进到下一个二级玩法
        //         this.$store.dispatch('getSubPlayCur', this.subCurMenuArr[this.subPlayCurIndex].betOn)  // 选中二级玩法CODE
        //         this.$store.dispatch('getSubPlayCurId', this.subCurMenuArr[this.subPlayCurIndex].id)  // 选中二级玩法Id
        //         this.$store.dispatch('getSubPlayCurIndex', this.subPlayCurIndex - 1) // 选中二级玩法index下标
        //         this.$store.dispatch('getCurOdds', this.subCurMenuArr[this.subPlayCurIndex].betTypeList) // 选中赔率
        //         if(this.subPlayCurIndex >= 1 && this.subPlayCurIndex < this.subCurMenuArr.length - 3) { // 如果滑动下标大小1，并小于长度-3
        //             this.subTranslat = -0.9 * (this.subPlayCurIndex - 2) // 滑动宽度设置为 下标为2 设为当前项
        //         } else {
        //             if(this.subPlayCurIndex >= this.subCurMenuArr.length - 3) {
        //                 this.subTranslat = -0.9 * (this.subPlayCurIndex - 2) 
        //                 if(this.subPlayCurIndex == 1) {
        //                     this.subTranslat = -0.9 * (this.subPlayCurIndex - 1) 
        //                 }
        //             } else {
        //                 this.subTranslat = -0.9 * this.subPlayCurIndex
        //             }
        //         }
        //     } else { // 如果滑到一级彩种最后一个 进到下一个菜单
        //         if(this.parPlayCurIndex > 0 ) { // 如果未滑到一级菜单最后一个 进到父级菜单滑动
        //             this.$store.dispatch('getParPlayCurIndex', this.parPlayCurIndex - 1) // 初始游戏一级玩法
        //             if(this.parPlayCurIndex >= 2 && this.parPlayCurIndex <= this.parCurMenuArr.length - 2) {
        //                 if(this.parPlayCurIndex == 0) { // 滑动到第一个时
        //                     this.parTranslat = -0.7 * this.parPlayCurIndex // 一级玩法位移
        //                 } else {
        //                     this.parTranslat = -0.7 * (this.parPlayCurIndex - 2) // 一级玩法位移
        //                     if(this.parPlayCurIndex == this.parCurMenuArr.length - 2){
        //                         this.parTranslat = -0.7 * (this.parPlayCurIndex - 3) // 一级玩法位移
        //                     }
        //                 }
        //             }
        //             let pid = this.parCurMenuArr[this.parPlayCurIndex].id // 父级Id
        //             this.getActiveParMenu(pid, index - 1) // 得到默认二级玩法
        //             if(this.subPlayCurIndex >= 3 && this.subPlayCurIndex < this.subCurMenuArr.length - 3) {
        //                 this.subTranslat = -0.9 * (this.subPlayCurIndex - 2)
        //             } else {
        //                 this.subTranslat = -0.9 * this.subPlayCurIndex
        //             }
        //         }
        //     }

        // },
        judgeColumn(pm, p) { // 判断模板列数 pm:当前一级玩法菜单  p:当前二级游戏玩法
            this.oddhight = '' // 重置样式
            this.parMenuWidth = '' // 重置样式
            if((pm == "SSC" || pm == 'PKT' || pm == 'KLT')){
                this.parMenuWidth = 'w200';
                return
            }
            if((pm == "HK" && (p == 'SHENGXIAO_1_Y' || p == 'SHENGXIAO_1_N' || p == 'SHENGXIAOLIAN_Y_2' || p == 'WEISHULIAN_Y_2' || p == 'WEISHULIAN_Y_3' || p == 'WEISHULIAN_N_3' || p == 'WEISHULIAN_N_2' || p == 'SHENGXIAOLIAN_Y_3' || p == 'SHENGXIAOLIAN_N_2' || p == 'SHENGXIAOLIAN_N_3'|| p == 'WUXING' || p == 'BANBO' || p == 'SHENGXIAO_TE' || p == 'SHENGXIAO6_2' || p == 'SHENGXIAO6_3'))){
                this.column = 1;
                if(p == 'WUXING' || p == 'BANBO') {
                    this.oddhight = 'h70'
                } else {
                    this.oddhight = ''
                }
                return
            }
            if((pm == "HK" && (p == 'TEMA' || p == 'ZHENGMA' || p == 'ZHENGTE_1' || p == 'ZHENGTE_2' || p == 'ZHENGTE_3' || p == 'ZHENGTE_4' || p == 'ZHENGTE_5' || p == 'ZHENGTE_6'))){
                this.column = 4;
                return
            }
            if(pm == "FT") {
                if(p == 'TRIPLE') {
                    this.numOdds = 'k3-qs'
                }else {
                    this.numOdds = ''
                }
            }
            this.column = 2;
        },
        reqOdd() {
            let params = {
                    lotteryId: this.curSubMenuId // 当前子级菜单Id
                }
                oddsList(params).then(response => {
                    let res = response,
                        parr = [] // 当前一级玩法
                    if(res && res.success == 1) {
                        let o = res.content // 赔率列表
                        this.$store.dispatch('getOdds', o) // 赔率 
                        o.forEach((v, k) => {
                            let carr = [] // 临时存数组
                            for(let l in v.playRuleList) {
                                let val = v.playRuleList[l],
                                    c = {'betTypeList':val.betTypeList, 'betOnValue':val.betOnValue, 'betOn':val.betOn, 'id':val.id}
                                    carr.push(c)
                            }
                            let a = {'id':v.id, 'betOnValue':v.betOnValue, 'child':carr}
                            parr.push(a)
                        });
                        this.$store.dispatch('getParCurMenuArr', parr) // 当前一级玩法
                        this.getActiveParMenu() // 初始选中父级样式
                    } else {
                        
                    }
                })
        },
        storOdd() {
            let o = this.allOddsList[this.curSubMenuId], // 赔率列表 t 率 
                parr = [] // 当前一级玩法
                this.$store.dispatch('getOdds', o) // 赔率 
            o.forEach((v, k) => {
                let carr = [] // 临时存数组
                for(let l in v.playRuleList) {
                    let val = v.playRuleList[l],
                        c = {'betTypeList':val.betTypeList, 'betOnValue':val.betOnValue, 'betOn':val.betOn, 'id':val.id}
                        carr.push(c)
                }
                let a = {'id':v.id, 'betOnValue':v.betOnValue, 'child':carr}
                parr.push(a)
            });
            this.$store.dispatch('getParCurMenuArr', parr) // 当前一级玩法
            this.getActiveParMenu() // 初始选中父级样式
        },
        oddsList() { // 上一期开奖期号
            let id = this.$route.query.id
            if(this.allOddsList[id]) { // 如果所有赔率中有匹配的彩种，直接取当前库里面的数据，
                this.storOdd()
            } else {  // 如果所有赔率中没有匹配的彩种，就重新请求接口，
                this.reqOdd()
            }
        },
        getActiveParMenu(id, index) { // 初始选中一级样式 id:一级玩法ID, index: 一级玩法index
            let ind = index // 一级玩法下标
            if(typeof(index) == 'undefined') {
                ind = 0
            } else {
                ind = index
            }
            this.parCurMenuArr.forEach((v, k) => {
                if(!id) { // 如果不传ID默认显示第一个数据
                    if(k == 0) {
                        let i = v.id // 选中一级ID
                        this.$store.dispatch('getParPlayCur', i) // 选中一级ID
                        this.$store.dispatch('getParPlayCurIndex', k) // 选中一级Index
                        let smarr = [] // 临时存数组
                        v.child.forEach((val, key) => {
                            let a = {'betOnValue':val.betOnValue, 'betOn':val.betOn, 'betTypeList':val.betTypeList, 'id':val.id}
                                smarr.push(a) // 当前二级玩法
                        })
                        this.$store.dispatch('getSubCurMenuArr', smarr)// 当前二级玩法
                        this.getActiveSubMenu() // 得到二级玩法
                        this.parTranslat = 0
                    }
                } else { // 如果传id
                    if(id == v.id) {
                        this.$store.dispatch('getParPlayCur', v.id) // 选中一级ID
                        this.$store.dispatch('getParPlayCurIndex', index) // 选中一级Index
                        let smarr = [] // 临时存数组
                        v.child.forEach((val, key) => {
                            let a = {'betOnValue':val.betOnValue, 'betOn':val.betOn, 'betTypeList':val.betTypeList, 'id':val.id}
                                smarr.push(a) // 当前二级玩法
                        })
                        this.$store.dispatch('getSubCurMenuArr', smarr)// 当前二级玩法
                        this.getActiveSubMenu() // 得到二级玩法
                        if(index >= 2 && index <= this.parCurMenuArr.length - 2) { // 一级玩法位移 居中
                            this.parTranslat = -0.85 * (index - 2) // 一级玩法位移
                            if(this.parPlayCurIndex == this.parCurMenuArr.length - 2) {
                                this.parTranslat = -0.85 * (this.parPlayCurIndex - 3) 
                            }
                        } else {
                            if(index == 1) {
                                this.parTranslat = 0 // 一级玩法位移
                            }
                        }
                    }
                }
                this.$store.dispatch('getParPlayCurIndex', ind) // 初始游戏一级玩法
            })
        },
        getActiveSubMenu(id, index) { // 初始选中二级样式 id:选中二级玩法的 betOn, index:选中二级玩法index下标
            let i = '', // 选中二级ID
                ind = index // 二级玩法下标
            if(!ind) {
                ind = 0
            }
            this.subCurMenuArr.forEach((v, k) => {
                if(!id) { // 如果不传ID默认显示第一个数据
                    if(k == 0) {
                            i = v.betOn // 选中二级CODE
                            let o = v.betTypeList // 选中赔率
                        this.$store.dispatch('getSubPlayCur', i) // 选中二级玩法CODE
                        this.$store.dispatch('getSubPlayCurId', v.id)  // 选中二级玩法Id
                        this.$store.dispatch('getSubPlayCurIndex', k) // 选中二级玩法index下标
                        this.$store.dispatch('getCurOdds', o) // 选中赔率
                        this.$store.dispatch('getOddActive', this.allOddActive[v.betOn]) // 重置赔率状态
                    }
                } else { // 如果传id
                    if(id == v.betOn) {
                            i = v.betOn // 选中二级CODE
                            let o = v.betTypeList // 选中赔率
                        this.$store.dispatch('getSubPlayCur', i) // 选中二级CODE
                        this.$store.dispatch('getSubPlayCurId', v.id)  // 选中二级玩法Id
                        this.$store.dispatch('getSubPlayCurIndex', index) // 选中二级玩法index下标
                        this.$store.dispatch('getCurOdds', o) // 选中赔率
                        this.$store.dispatch('getOddActive', this.allOddActive[v.betOn]) // 重置赔率状态
                    }
                }
            })
            
            this.judgeColumn(this.curParMenu, i) // 判断样式
            let hasCurOdd =  this.allOddActive[this.subPlayCur] // 记忆曾选中赔率
            if(!hasCurOdd) { // 如果未被选择，初始全部设为false
                this.defaultOddAction() // 初始设置选中状态全为false 
            }
            if(this.subPlayCurIndex >= 1 && this.subPlayCurIndex < this.subCurMenuArr.length - 1) { // 滑动位置
                this.subTranslat = -0.7 * (this.subPlayCurIndex - 1) 
                if(this.subPlayCurIndex == this.subCurMenuArr.length - 2) {
                    this.subTranslat = -0.7 * (this.subPlayCurIndex - 2)
                }
            } else {
                if(this.subPlayCurIndex >= this.subCurMenuArr.length - 3) {
                    this.subTranslat = -0.7 * (this.subPlayCurIndex - 3) 
                    if(this.subPlayCurIndex == 1) {
                        this.subTranslat = -0.7 * (this.subPlayCurIndex - 1) 
                    }
                    if(this.subPlayCurIndex == 0) {
                        this.subTranslat = -0.7 * this.subPlayCurIndex
                    }
                } else {
                    this.subTranslat = -0.7 * this.subPlayCurIndex
                }
            }
            this.$store.dispatch('getSubPlayCurIndex', ind) // 选中二级玩法index下标
        }
    },
    beforeDestroy() { // 根组件被beforeDestroy
        this.$store.dispatch('getAllOddActive', {})
    },
    destroyed() { // 组件销毁时清除定时器
        
    }
}
</script>

<!-- 添加“scoped”属性以仅将CSS限制为此组件 -->
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.vtouch
    overflow-y scroll
.mt223
    margin-top 0.07rem
    min-height calc(100vh - 2.57rem)
.mt243
    margin-top 0.12rem
    min-height calc(100vh - 2.72rem)
.w200
    width 200%
.odds-menu-box
    position relative
    top 1.96rem
    background $count-bg
    z-index 9
    -webkit-overflow-scrolling touch
.odds-menu
    width 3.75rem
    // overflow hidden
.menu-wrap
    width 3.55rem
    margin-left 0.18rem
    overflow hidden
.odds-par-menu
    display flex
    flex-wrap nowrap
    justify-content space-between
    flex-direction nowrap
    text-align left
    line-height 0.26rem
    white-space nowrap
    width max-content
    color $menu-stair-color
    margin 0.1rem 0
    li
        font-size 0.15rem
        cursor pointer
        text-align center
        width auto
        margin 0 0.08rem 0 0.08rem
        padding 0 0.08rem
        // width 0.7rem
        //  margin-right 0.2rem   margin: 0 0.08rem 0 0.02rem
.odds-sub-menu
    display flex
    flex-wrap wrap
    justify-content space-between
    flex-direction row
    text-align left
    white-space nowrap
    line-height 0.20rem
    width max-content
    color $menu-stair-color
    
    li
        cursor pointer
        text-align center
        margin 0 0.11rem 0 0.12rem
        // width 0.85rem
        span
            width auto
            display inline-block
            background-color $nosuAactive-tips-bg-color
            height: 100%
            padding 0.03rem 0.07rem
            border-radius 50px 50px 50px 50px
            font-size 0.13rem
.odds-sub-menu-set 
    li
        margin: 0 0.06rem 0 0rem !important            
.odds-con
    width 100%
    height calc(100vh - 2.6rem)
    overflow auto
.active
    color $menu-font-color-active
    font-weight bold
    font-size 0.17rem !important
.suAactive
    color $tips-text-color
    font-weight bold
    font-size 0.15rem !important
    span
        width auto
        display inline-block
        background-color $suAactive-tips-bg-color!important
        height: 100%
        padding 0.03rem 0.1rem !important
        border-radius 50px 50px 50px 50px
.activebet
    position absolute
    right -0.01rem
    top -0.02rem
    width 0.2rem
    height 0.2rem
    border-radius 0 0.05rem 0.05rem 0
    color $count-active
.betDisabled
    border 0.01rem solid $count-disable-line!important
    box-shadow 0.01rem 0.01rem 0.01rem $odds-disable-show!important
    background $count-disable-bg!important
    color $count-disable-font!important
.oddsActive
    border 0.01rem solid $count-active!important
    // box-shadow 0.01rem 0.01rem 0.01rem $count-active!important
    span
        &:nth-child(1)
            i
                color $count-active
                // font-size 0.17rem
                font-weight bold
            .ball-small 
                color $quickView-font
                // font-weight 400
        &:nth-child(2)
            font-weight bold
        &:nth-child(3)
             color $count-active
             font-weight bold
.pt8
    padding-top 0.08rem!important
.odds-list
    display flex
    flex-wrap wrap
    justify-content flex-start
    flex-direction row
    text-align center
    width 3.45rem
    margin 0px auto 1.8rem
    li
        height 0.48rem
        line-height 0.46rem
        border-radius 0.03rem
        border 0.01rem solid $odds-line
        box-shadow 0rem 0.02rem 0.05rem $odds-show
        position relative
        div
            display flex
            flex-wrap wrap
            flex-direction row
            justify-content flex-start
            width 100%
            .check-list
                position absolute
                right -0.01rem
                top -0.01rem
                width 100%
                height 100%
            span
                color $count-font
                font-size 0.16rem
                &:nth-child(1)
                    width 50%
                    img 
                        width 0.25rem
                        height 0.25rem
                        vertical-align middle
                        margin-right 0.05rem
                        &:nth-last-of-type(1)
                            margin-right 0rem
                &:nth-child(2)
                    width 50%
                    padding-right 0.05rem
                    text-align center
                i
                    font-style normal
                    text-align center
    .h70
        height 0.7rem
        line-height 0.65rem
.mt100
    margin-bottom 2rem!important
// 快三 
.odds-list.odds-list-FT
    li
        span
            &:nth-child(3)
                width 50%
.odds-list-FT.k3-qs
    li
        span
            &:nth-child(1)
                width 1.07rem
            &:nth-child(3)
                flex 1
.odds-list.column1
    li
        width 3.45rem
        margin-bottom 0.15rem
        span
            &:nth-child(1)
                width 25%
            &:nth-child(2)
                width 50%
                display flex
                flex-wrap wrap
                flex-direction row
                justify-content flex-start
                align-items center
                padding 0.05rem 0 0 0
                text-align left
                display inline-block
                i
                    margin 0 0.05rem
            &:nth-child(3)
                width 25%
                padding-right 0.05rem
            i
                font-style normal
                text-align center
.pt08
    padding-top 0.08rem!important
.odds-list.column2
    li
        width 1.6rem
        margin 0 0.25rem 0.15rem 0rem
        span
            width 50%
        &:nth-child(2n)
            margin-right 0
        .ball-small
            width 0.24rem!important
            height 0.24rem!important
            line-height 0.24rem!important
            font-size 0.14rem!important
.odds-list.column4
    li
        width 0.81rem
        margin 0 0.07rem 0.1rem 0rem
        &:nth-child(4n)
            margin-right 0
        span
            font-size 0.14rem
            width 50%
.odds-list.column4.odds-list-HK        
   .ball-listtow
        margin-left -0.05rem
.odds-list.column2.odds-list-PKT
    li
        div
            span
                &:nth-child(1)
                    .ball-small-pkt
                        display inline-block
                        width 0.24rem
                        line-height 0.24rem
                        border-radius 50%
                        border 0.01rem solid
                        font-size 0.14rem
                &:nth-child(2)
                    width 40%
.ball-list
    line-height 0.28rem
.odds-list-tema
.odds-list-gyh
.odds-list-klt1
    &:nth-child(1)
        margin-bottom 0 !important
.odds-list-klt
    &:nth-child(1)
    &:nth-child(2)
        margin-bottom 0 !important
.preventScroll
    overflow hidden !important 
</style>