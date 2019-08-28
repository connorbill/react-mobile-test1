<template lang="jade">
    .allmenu
        .menu-w
            ul.all-par-menu
                li(@touchend.prevent="getParMenu('all')", v-show="cname == '投注记录'") 
                    span(:class="curParSelectMenuId == 'all' ? 'active' : ''") 全部
                    span(v-show='curParSelectMenuId == "all"')
                li(v-for="list, index in allMenuTree", :key="index", @touchend.prevent="getParMenu(list.id)") 
                    span(:class="curParSelectMenuId == list.id ? 'active' : ''") {{ list.name }}
                    span(v-show='curParSelectMenuId == list.id')
            ul.all-sub-menu
                li(v-if="curParSelectMenuId == 'all' && cname == '投注记录'", :class="curSubSelectMenuId =='subAll' ? 'activeBut' : ''", @touchend.prevent="getOrderPage('subAll')") 全部
                    svg-icon.activebet(icon-class="odds", v-show="curSubSelectMenuId=='subAll'")
                li(v-else, v-for="list, index in subMenuTree", :key="index", @touchend.prevent="getSubMenu(list.id, list.code,'close')", :class="curSubSelectMenuId==list.id ? 'activeBut' : ''") {{ list.name }}
                    svg-icon.activebet(icon-class="odds", v-show="curSubSelectMenuId==list.id")
</template>
<script>
import { getToken } from '@/utils/auth' // getToken from cookie
import { allMenu } from '@/api/home' // API
import { mapState } from 'vuex'
export default {
    name: "allMenu",
    computed:{
        ...mapState({
            allMenuTree: state => state.home.allMenuTree, // 彩种树
            subMenuTree: state => state.home.subMenuTree, // 二级彩种集合
            curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
            infoCurSubMenuName: state => state.home.infoCurSubMenuName, // 当前子菜单中文名
            curParSelectMenuId: state => state.home.curParSelectMenuId, // 当前选中信息一级彩种ID
            curSubSelectMenuId: state => state.home.curSubSelectMenuId, // 当前选中信息二级彩种ID
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
            showDataDialog: state => state.home.showDataDialog, // 是否显示时间选择框 true:显示， false:不显示
            dateArrStore: state => state.home.dateArrStore, // 最近10天
            activeDate: state => state.home.activeDate, // 选中日期
            infoCurParMenu: state => state.home.infoCurParMenu, // 信息类一级彩种code
            curSettleStatus: state => state.home.curSettleStatus, // 当前投注状态传参 0:未结算 3:已结算
            urlCname: state => state.home.urlCname, // 当前路径中文模板
            scrollValue: state => state.home.scrollValue, // 滚动条滚动值
            serviceTime: state => state.home.serviceTime // 服务器时间
        })
    },
    data() {
        return {
            cname: '', // 中文名
            countTime: [], // 选择时间集合
            betDate: '', // 下注日期 
            state: '', // 是否结算 
            from: '', // 路径来自哪
            twoId:"", // 
            pcode: ''
        }
    },
    created() {

    },
    mounted() {
        // this.getSaverTime() // 获取服务器时间
        this.cname = this.$route.query.temp // 当前路径中文模板
        this.from = this.$route.query.from // 路径来自哪
        this.betDate = this.$route.query.betDate // 下注日期
        this.state = this.$route.query.state // 是否结算
        this.$store.dispatch("getPitchOnTime",this.betDate) // 结算详情选中的下注日期
        this.$store.dispatch('getUrlCname', this.cname ) // 当前路径中文模板
        if(this.from != 'countDown' && this.from != 'checkDetails') {
            this.allMenu() // 所有彩种树
        }
    },
    methods: {
        settime_serviceTime(d){
           let val = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
            return val;
       },
        initialize() { // 是否初始化滚动条方法
            if(this.scrollValue != 0) { // 判断滚动条滚动的距离是要否初始化
                this.$store.dispatch("getScrollValue",0) // 滚动条的滚动距离赋值为0使其回到顶部  存状态
                this.$store.dispatch("getInitializeScroll",true) // 初始化滚动条  存状态
            }
        },
        getSaverTimeAsyn() { // 获取服务器时间
            this.$store.dispatch('getSaverTimeAsyn').then((res) => {
                let st = res.content.serverTime // 服务器时间
            })
        },
        close() { // 关闭选择
            if(this.showAllMenu == true) { // 是否显示彩种选择 true:显示，false:不显示
                this.$store.dispatch('getShowAllMenu', false)
            }
            if(this.showDataDialog == true) { // 时间选择框 true:显示， false:不显示
                this.$store.dispatch('getShowDataDialog', false) 
            }
            this.$store.dispatch('getShowBg', false) // 背景层是否显示 true:显示， false:不显示
        },
        judgeList(url) { // 判断是请求哪个接口 url: url名称
            switch(url) {
                case '历史开奖':
                    this.$store.dispatch('getIsLoading',true) // 显示loading
                    this.getHistory()
                    break;
                case '投注记录':
                    this.$store.dispatch('getIsLoading',true) // 显示loading
                    this.$store.dispatch('getSaverTimeAsyn').then((res) => {
                        let st = res.content.serverTime, // 服务器时间
                            curId = this.curSubSelectMenuId // 当前子级ID
                        this.countTime = this.getDayCount(st, -6)
                        if(!this.curSubSelectMenuId) {
                            curId = 'subAll'
                        }
                        this.getOrderPage(curId)
                    })
                    break;
                case '游戏规则':
                    // this.$store.dispatch('getIsLoading',true) // 显示loading
                    this.getGameRules()
                    break;
                case '盘口信息':
                    // this.$store.dispatch('getIsLoading',true) // 显示loading
                    this.getPostionInfo()
                    break;
            }
        },
        getDateStr(st, addDayCount) { // 最近n天 st:服务器时间, addDayCount:前n天
            let now = new Date(st);
            now.setDate(now.getDate() + addDayCount); //获取AddDayCount天后的日期
            let y = now.getFullYear(), // 当前年
                m = now.getMonth() + 1, // 当前月1: 补0开始
                d = now.getDate() // 当前日
            return y + "/" + m + "/" + d;
        },
        getDayCount(t, addDayCount) { // 获取最近七天本周上周时间 t:服务器时间, addDayCount：近n天
            let st = t.replace(/-/g, "/"), // IE,safari时间格式兼容
                now = new Date(st), // 实例化当前时间 服务器时间为准
                nowDayOfWeek = now.getDay(), // 今天本周的第几天
                nowDay = now.getDate() 
            let weekStart = this.getDateStr(st, - nowDayOfWeek + 1) + ' ' + '00:00:00', // /获得本周的开始日期
                weekEnd = this.getDateStr(st, 7 - nowDayOfWeek) + ' ' + '23:59:59', // 获得本周的结束日期
                lastWeekStart = this.getDateStr(st, nowDay - nowDayOfWeek - 8) + ' ' + '00:00:00', // /获得本周的开始日期
                lastWeekEnd = this.getDateStr(st, nowDay - nowDayOfWeek - 2) + ' ' + '23:59:59' // 获得本周的结束日期
    
            let foremaDay7Start = this.getDateStr(st, addDayCount) + ' ' + '00:00', // 格式化最近七天的开始日期
                foremaDay7End = this.getDateStr(st, 0) + ' ' + '23:59' // 格式化最近七天的结束日期
            let data = { // 返回数据
                        'thisWeek': {'start': weekStart, 'end': weekEnd}, // 本周开始结束时间
                        'lastWeek': {'start': lastWeekStart, 'end': lastWeekEnd}, // 上周开始结束时间
                        'Day7': {'start': foremaDay7Start, 'end': foremaDay7End}, // 最近七天的开始结束时间
                       }
            return data
        },
        allMenu() { // 所有彩种树
            allMenu().then(response => {
                let res = response
                if(res && res.success == 1) {
                    let t = res.content, // 彩种树
                        s = res.content[0].children, // 默认初始二级彩种集合
                        i = res.content[0].id, // 默认初始一级彩ID
                        sid = res.content[0].children[0].id // 当前子级菜单Id
                    this.pcode = res.content[0].code // 信息类一级彩种code
                    this.$store.dispatch('getAllMenuTree', t) // 彩种树
                    this.$store.dispatch('getSubMenuTree', s) // 默认初始二级彩种集合
                    this.$store.dispatch('getInfoCurParMenu', this.pcode) // 信息类一级彩种code
                    if(this.cname == '投注记录') {
                        this.$store.dispatch('getCurParSelectMenuId', 'all') // 默认初始一级彩ID
                        this.$store.dispatch('getInfoCurSubMenuName', '全部') // 当前子级菜单中文名
                    }else{
                        this.$store.dispatch('getCurParSelectMenuId', i) // 默认初始一级彩ID
                    }
                    this.getSubMenu(sid)
                } else { // 获取服务器时间失败
                    
                }
            })
        },
        getParMenu(id) { // 切换彩种事件  获取一级菜单 id:当前一级彩种ID
            this.initialize() // 调用是否初始化滚动条方法
            this.$store.dispatch("getCurrentPage",0) // 初始化当前页码
            if(id == 'all') {
                this.$store.dispatch('getCurParSelectMenuId', 'all') // 默认初始一级彩ID
            } else {
                this.allMenuTree.forEach((v, k) => {
                    if(id == v.id) {
                        let s = v.children, // 默认初始二级彩种集合
                            i = v.id, // 当前子级菜单Id
                            sid = v.children[0].id // 当前子级菜单Id
                        this.pcode = v.code // 信息类一级彩种code
                        this.$store.dispatch('getCurParSelectMenuId', i) // 默认初始一级彩ID
                        this.$store.dispatch('getSubMenuTree', s) // 默认初始二级彩种集合
                        
                        // this.getSubMenu(sid)
                        // s.forEach((v, k) => {
                        //     if(id == v.id) {
                        //         let i = v.id, // 当前子级菜单Id
                        //             c  = v.name // 当前子级菜单中文名
                        //         this.$store.dispatch('getCurSubMenuId', i) // 当前子级菜单Id
                        //         this.$store.dispatch('getInfoCurSubMenuName', c) // 当前子级菜单中文名
                        //         this.$store.dispatch('getCurSubSelectMenuId', i) // 默认初始二级彩ID
                        //         this.judgeList(this.cname)
                        //     }
                        // });
                    }
                });
            }
        },
        getSubMenu(id, code, close) { // 选择玩法事件 获取二级菜单 id:当前一级彩种ID, code:一级彩种CODE, close: 关闭 非必填，传了为关闭彩种选择
            this.$store.dispatch('getIsLoading',true) // 显示loading
            this.$store.dispatch("getCurrentPage",0) // 初始化当前页码
            this.$store.dispatch('getActiveDate', 0) // 初始化当前时间范围选中
            this.$store.dispatch("getNoMore",false) // 初始化是否已加载全部 
            this.$store.dispatch('getInfoCurParMenu', this.pcode) // 信息类一级彩种code
            if((this.curParSelectMenuId && this.curParSelectMenuId != 'all') || this.cname != '投注记录') {
                this.subMenuTree.forEach((v, k) => {
                    if(id == v.id) {
                        let i = v.id, // 当前子级菜单Id
                            c  = v.name // 当前子级菜单中文名
                        this.$store.dispatch('getCurSubMenuId', i) // 当前子级菜单Id
                        this.$store.dispatch('getInfoCurSubMenuName', c) // 当前子级菜单中文名
                        this.$store.dispatch('getCurSubSelectMenuId', i) // 默认初始二级彩ID
                        this.judgeList(this.cname)
                    }
                });
                if(close == 'close') { // 点击选择，并关闭选择面板
                    this.close()
                    if(this.twoId != id) {
                        this.initialize() // 调用是否初始化滚动条方法
                        this.twoId = id
                    }
                }   
            } else {
                this.getOrderPage('subAll')
            }
        },
        getHistory(id) { // 获取历史记录 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            let d = null, // 当前时间
                curDate = null,
                starDate = null,
                endDate = null
            if(this.curSubMenuId != 8) {
                d = this.dateArrStore[this.activeDate] // 当前时间
                curDate = d.year + '-' + d.month + '-' + d.day // 当前年月日
                starDate = curDate + ' ' + '00:00:00' // 开始时间
                endDate = curDate + ' ' + '23:59:59' // 结束时间
            }
            if(this.curSubMenuId == 8) {
                let date = this.getNowFormatDate(), // 获取当前时间
                    now = new Date(date)
                    now.setDate(now.getDate() -20)
                let y = now.getFullYear(), // 当前年
                    m = now.getMonth() + 1, // 当前月1: 补0开始
                    d = now.getDate() // 当前日
                starDate = y + "-" + m + '-' + d + ' ' + '00:00:00'  // 开始时间
                endDate = date + ' ' + '23:59:59' // 结束时间
                this.$store.dispatch("getHkDateArrStore", {'start':starDate, 'end':endDate}) // 香港彩初始选中的时间范围存状态
            }
            if(!id) { // 如果未传ID 则为默认ID
                id = this.curSubMenuId // id:当前子菜单ID
            }
            let params = {
                lotteryId: id, // 二级彩种id
                page: this.$store.state.home.currentPage, // 页码
                size: 20, // 每页条数
                govPrizeTimeBegin: starDate, // 开始时间
                govPrizeTimeEnd: endDate // 结束时间
            }
            this.$store.dispatch('getHistory', params)
        },
        getOrderPage(id) { // 获取投注记录 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) { // 如果未传ID 则为默认ID
                id = this.curSubMenuId // id:当前子菜单ID
            }
            this.$store.dispatch('getCurSubSelectMenuId', id) // 默认初始二级彩ID
            let params = {}
            if(this.from == 'checkDetails') { // 判断从哪进入投注详情页  如果是从结算详情进入
                let time = (this.betDate).split(' ')
                params = {
                    settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                    beginTime: time[0] + ' ' + '00:00:00', // 下注起始时间【yyyy-MM-dd HH:mm:ss】
                    endTime: time[0] + ' ' + '23:59:59', // 下注截止时间【yyyy-MM-dd HH:mm:ss】
                    page: 0, // 页码
                    size: 20 // 每页条数
                }
            } else { // 从我的页面进入
                let serviceTime =  new Date(this.serviceTime).getTime()-24*60*60*1000*6; // 当前服务器时间的前7个数据
                let datatime = this.settime_serviceTime(new Date(serviceTime)) // 标准时间转化为【yyyy-MM-dd HH:mm:ss】格式
                let time = (datatime).split(' ') // 截取时间
                if(id == 'subAll') {
                    params = {
                        beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        settleStatus: this.curSettleStatus, // 开奖状态【0:未结算 3:已结算】
                        page: 0, // 页码
                        size: 20, // 每页条数
                    }
                    this.$store.dispatch('getCurSubSelectMenuId', 'subAll') // 默认初始二级彩ID
                    this.$store.dispatch('getInfoCurSubMenuName', '全部') // 当前子级菜单中文名
                    this.close()
                } else {
                    params = {
                        beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        lotteryId: id, // 二级彩种id
                        settleStatus: this.curSettleStatus, // 开奖状态【0:未结算 3:已结算】
                        page: 0, // 页码
                        size: 20, // 每页条数
                    }
                }

            }
            this.$store.dispatch('getOrderPage', params)
        },
        getGameRules(id) { // 游戏规则 id:当前子菜单ID
            // this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) {
                id = this.curSubMenuId
            }
            let params = {
                lotteryId: id, // 二级彩种id
            }
            this.$store.dispatch('getGameRules', params)
        },
        getPostionInfo(id) { // 盘口信息
            // this.$store.dispatch('getIsLoading',true) // 显示loading
            if(!id) {
                id = this.curSubMenuId
            }
            let params = {
                lotteryId: id, // 二级彩种id
            }
            this.$store.dispatch('getPostionInfo', params)
        },
        getNowFormatDate() { // 转换时间格式为 xxxx-xx-xx xx:xx:xx
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    // + " " + date.getHours() + seperator2 + date.getMinutes()
                    // + seperator2 + date.getSeconds();
            return currentdate;
        }
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.active
    color $font-active!important
    font-weight bold
.activeBut
    color $font-active!important
    border 0.01rem solid $font-active!important
    font-weight bold
.activebet
    position absolute
    right -0.01rem
    top -0.02rem
    width 0.16rem
    height 0.16rem
    border-radius 0 0.05rem 0.05rem 0
    color $count-active
.menu-w
    position relative
    z-index 100
.allmenu
    position fixed
    width 100%
    height 2.5rem
    background $allmenu-bg
    border-radius 0.08rem 0.08rem 0 0
    -webkit-overflow-scrolling touch
.all-par-menu
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    text-align center
    align-items center
    background $parmenu-bg
    line-height 0.4rem
    border-radius 0.08rem 0.08rem 0 0
    li
        color $menu-font
        display flex
        flex-direction column
        span 
            font-size 0.15rem
            &:nth-child(2)
                width 0.195rem
                height 0.02rem
                background $font-active
                margin auto
.all-sub-menu
    display flex
    flex-wrap wrap
    justify-content flex-start
    flex-direction row
    align-items center
    line-height 0.46rem
    width 3.5rem
    margin 0.15rem auto
    li
        color $menu-font
        height 0.34rem
        width 1.06rem
        margin-right 0.15rem
        text-align center
        line-height 0.34rem
        border-radius 0.05rem
        border 0.01rem solid $odds-line
        box-shadow 0.01rem 0.01rem 0.04rem $odds-show
        margin-bottom 0.12rem
        position relative
        font-size 0.13rem
        &:nth-child(3n)
            margin-right 0rem
</style>
