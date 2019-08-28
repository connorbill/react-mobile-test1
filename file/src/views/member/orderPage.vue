<template lang="jade">
    .order(:class="from == 'countDown' ? 'order-countDown' : ''")
        vue-header(v-show="from != 'countDown'")
        .order-flex(:class="[from == 'checkDetails' ? 'ftop45' : '']")
            ul.order-status(v-show="from != 'countDown' && from != 'checkDetails'")
                li(v-for="list, index in status", :class="curSettleStatus == list.settleStatus ? 'active' : ''", @touchend.prevent="getActive(list.settleStatus)") {{ list.name }}
            ul.order-title(:class="from == 'countDown' ? 't19' : ''")
                .order-title-box
                    li(v-for="list, index in tite", v-if="!curOrderList.length == 0") {{ list }}
        vue-pull-to(:class="[from == 'checkDetails' ? 'mt74' : '']", :bottom-load-method="from != 'countDown' ? pullUp : null", is-bottom-keep-scroll=true, ref="orderListHeigth")
            ul.order-list(:class="[from == 'checkDetails' ? 'mtop1' : from == 'countDown' ? 'top5' : '' , phoneModel, preventScroll]", @touchend.prevent="changePos")
                li(v-for="list, index in curOrderList", @touchend="getActiveDetails(index)", v-show="!isLoading", @touchmove="getDetailsMove($event,index)", @touchstart="getDetailsStart($event,index)")
                    span {{ list.lotteryName }}
                    span {{ list.betOnValue }}_{{ list.betValue }}@{{ list.odds }}
                    span {{ list.amount | isEmpty }}
                    span {{ list.winLoss | isEmpty }}
                    div.oredr-details(v-show="activeDetails === index")
                        span 注单号：{{ list.betNo | betNoFilters}}
                        span 下注时间：{{ list.betTime | betTimeFilters}}
                        span 彩种：{{ list.lotteryName }}
                        span 期号：{{ list.gameNo }} 期
                        span 下注金额：{{ list.amount }}
                        span 结算金额：{{ list.settleAmount | settleAmountFilters}}
                        span 下注详情：{{ list.betOnValue }}_{{ list.betValue }}@{{ list.odds }}
                        span 当期开奖结果：{{ list | prizeNoFilters}}
                .noMore(v-if='noMore && curOrderList.length != 0') 已经加载全部
                .noData(v-if="curOrderList && curOrderList.length == 0 && !isLoading")
                    .content-box
                        svg-icon.none.noneinfo(icon-class="noneData")
                        span 暂无投注信息
                        span.slinkfields 不要让大奖溜走，投注去~
                        em.nodatatest(@touchend.prevent="toRoute") 立即投注
                vue-loading-gif(v-show="isLoading")

</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import PullTo from 'vue-pull-to' // 分页
import { getOrderPage } from '@/api/home' // API
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'OrderPage', // 投注记录
    components: {
        "vue-header": header, // 头部组件
        "vue-pull-to": PullTo, // 分页
        'vue-loading-gif': loadingGif // loading
    },
    computed: {
        ...mapState({
            curOrderList: state => state.home.curOrderList, // 当前投注记录
            curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
            curSettleStatus: state => state.home.curSettleStatus, // 当前投注状态传参 0:未结算 3:已结算
            scrollValue: state => state.home.scrollValue, // 滚动条滚动值
            initializeScroll: state => state.home.initializeScroll, // 是否初始化滚动条滚动值
            infoCurParMenu: state => state.home.infoCurParMenu, // 信息类一级彩种code
            quickActiveCode: state => state.home.quickActiveCode, // 投注弹窗选中的tab切换code
            pitchOnTime: state => state.home.pitchOnTime, // 结算详情选中的日期
            curParSelectMenuId: state => state.home.curParSelectMenuId, // 当前选中信息一级彩种ID
            isLoading: state => state.home.isLoading, // 是否显示loading
            activeDetails: state => state.home.activeDetails, // 当前详情显示
            serviceTime: state => state.home.serviceTime, // 服务器时间
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
            noMore: state => state.home.noMore, // 是否已加载全部
        })
    },
    data() {
        return{
            status: [
                    {'id':'0', 'name':'未结算', 'settleStatus':'0'},
                    {'id':'1', 'name':'已结算', 'settleStatus':'3'},
                ],
            tite: ['彩种','详情','金额','输赢'],
            // activeDetails: '', // 当前详情显示
            active: '',
            from: '', // 路径来自哪
            topId:'' , // 用于结算与未结算切换时给来判断滚动条是否要初始化
            countTime: [], // 选择时间集合
            phoneModel:'', // 用于手机型号样式兼容
            preventScroll:'', // 阻止遮罩层显示时底部盒子滚动
            isTouchMove: false,
        }
    },
    filters: {
        isEmpty: function(v) { //  判断是否为空
            if(v == undefined || v == '') {
                return '--'
            } else {
                return v
            }
        },
        betTimeFilters: function(v) { // 过滤下注时间去除年份
            if(v) {
                let vv = v.replace(/\-/g, '') // 去掉 - 线
                return vv.slice(2)
            }
            return vv
        },
        betNoFilters: function(v) { // 过滤注单号，截取末尾九位字符、
            if(v) {
                return v.slice(-9)
            }
            return v
        },
        prizeNoFilters: function(v) { // 六合彩开奖结果过滤
            let str1,
                name = v.lotteryName, // 玩法名称
                prizeNos = v.prizeNo, // 开奖结果
                str
            if(v.prizeNo) { // 判断是否存在  防报错
                str1 = (prizeNos.split(",")).join("、")
                if(name.indexOf('六合彩') >= 0) { // 判断玩法名称是否包含六合彩
                    str = prizeNos.split(",") // 以逗号分割成数组
                    str1 = (str.slice(0,6)).join('、') + " + " + (str.slice(-1)) // 前面六个号用、号隔开，倒数第一和第二用+号隔开
                }
            }
            if(str1 == undefined) { // 如果没有开奖号码
                str1 = '暂无'
            }
            return str1
        },
        settleAmountFilters: function(v) { // 结算金额过滤操作
            if(v == undefined ) {
                v = '--'
            }
            return v
        }
    },
    created() {

    },
    mounted() {
        this.from = this.$route.query.from // 路径来自哪
        if(this.from == 'checkDetails') { // 判断从哪进入投注详情页  如果是从结算详情进入
            this.getOrderPage() // 结算详情
        }
        this.$store.dispatch('getCurSettleStatus', 0) // 重置默认选中为未结算
        if(navigator.userAgent.match("Android")){  
            this.phoneModel = 'android-mobile'
        }else if(navigator.userAgent.match("iPhone")){  
            this.phoneModel = 'iPhone-mobile'   
        }else if(navigator.userAgent.match("iPad")){  
            this.phoneModel = 'iPad-mobile'  
        }else{  
        //      alert(navigator.userAgent);  
            this.phoneModel = 'android-mobile' 
        }
    },
    watch: {
        scrollValue:{ // 监听滚动条滚动值
            handler:function (newVal,oldVal) {
                if(this.scrollValue == 0 && this.initializeScroll == true) {
                    this.$refs.orderListHeigth.scrollTop = 0
                }
            },
            immediate:false
        },
        quickActiveCode:{ // 监听投注弹窗选中的tab切换code
            handler:function (newVal,oldVal) {
                if(newVal == "curBet" || newVal == 'allBet') {
                    this.$refs.orderListHeigth.$el.firstElementChild.scrollTop = 0
                }
            }
        },
        showAllMenu: { // 监听彩种选择弹窗显示  显示时阻止遮罩层底部的盒子滚动
            handler: function (newVal,oldVal) {
                if(newVal == true) {
                    this.preventScroll = 'preventScroll'
                }else {
                    this.preventScroll = ''
                }
            }
        },
    },
    methods: {
        settime_serviceTime(d){
           let val = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            return val;
       },
        toRoute() { // 点击立即投注跳转首页
            this.$store.dispatch('getShowQuick', false)  // 投注快捷菜单是否显示 false:不显示， true:显示
            this.$router.push({
                path:'/'
            })
        },
        getActive(id) { // 获取当前选中状态 id:当前选中项
            this.$store.dispatch('getIsLoading', true) // 显示loading
            if(this.topId != id) { // 判断是否初始化滚动条
                this.$refs.orderListHeigth.scrollTop = 0
                this.$store.dispatch('getCurrentPage', 0) // 初始化当前页码
                this.topId = id
                this.active = ''
                this.$store.dispatch("getActiveDetails", '')
                this.$store.dispatch("getNoMore",false) // 初始化是否已加载全部 
            }
            this.$store.dispatch('getCurSettleStatus', id) // 存储状态
            this.getOrderPage() // 获取投注记录数据
        },
        getActiveDetails(id) { // 获取当前详情选中状态 id:当前选中项
            if (!this.isTouchMove){
                if(id === this.activeDetails) {
                    if(this.active == id){
                        this.$store.dispatch("getActiveDetails", '')
                        return
                    }
                    this.$store.dispatch("getActiveDetails", id)
                    this.active = id
                } else {
                    this.$store.dispatch("getActiveDetails", id)
                    this.active = id
                }
            }
            // if(id === this.activeDetails) {
            //     if(this.active == id){
            //         this.$store.dispatch("getActiveDetails", '')
            //         return
            //     }
            //     this.$store.dispatch("getActiveDetails", id)
            //     this.active = id
            // } else {
            //     this.$store.dispatch("getActiveDetails", id)
            //     this.active = id
            // }
        },
        getDetailsMove($event,index){
            this.isTouchMove = true;
        },
        getDetailsStart($event,index){
            this.isTouchMove = false;
        },
        getOrderPage(id) { // 获取投注记录 id:当前子菜单ID
            this.$store.dispatch('getIsLoading', true) // 显示loading
            if(this.curParSelectMenuId == 'all') { // 根据一级菜单id赋值子级菜单id
                id = 'subAll'
            } else {
                if(!id) { // 如果未传ID 则为默认ID
                    id = this.curSubMenuId // id:当前子菜单ID
                }
            }
            let params = {}
            if(this.from == 'checkDetails') { // 判断从哪进入投注详情页  如果是从结算详情进入
                let time = (this.pitchOnTime).split(' ')
                params = {
                    // settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                    beginTime: time[0] + ' ' + '00:00:00', // 下注起始时间【yyyy-MM-dd HH:mm:ss】
                    endTime: time[0] + ' ' + '23:59:59', // 下注截止时间【yyyy-MM-dd HH:mm:ss】
                    page: this.$store.state.home.currentPage, // 页码
                    size: 20 // 每页条数
                }
            } else { // 从我的页面进入
            let serviceTime =  new Date(this.serviceTime).getTime()-24*60*60*1000*6; // 当前服务器时间的前7个数据
            let datatime = this.settime_serviceTime(new Date(serviceTime)) // 标准时间转化为【yyyy-MM-dd HH:mm:ss】格式
            let time = (datatime).split(' ') // 截取时间
                if(id == 'subAll') { // 判断子菜单id是否为全部
                    params = {
                        beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                        page: this.$store.state.home.currentPage, // 页码
                        size: 20 // 每页条数
                    }
                }else {
                    params = {
                          beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        lotteryId: id, // 二级彩种id
                        settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                        page: this.$store.state.home.currentPage, // 页码
                        size: 20 // 每页条数
                    }
                }
            }
            this.$store.dispatch('getOrderPage', params)
        },
        changePos(e) { /// 滑动事件
            let pathArr = e.path[2].scrollTop;
            this.$store.dispatch("getScrollValue", pathArr)
        },
        pullUp(loaded) { // 上拉加载更多
            if(this.curParSelectMenuId == 'all') { // 判断一级菜id是否为全部
                this.$store.dispatch("getCurSubMenuId",'subAll')
            }
            let page = this.$store.state.home.currentPage // 获取当前页码
            page++ // 每次上拉当前页码+1
            this.$store.dispatch("getCurrentPage", page) // 当前页码存状态
            let params = {}
            if(this.from == 'checkDetails') { // 判断从哪进入投注详情页  如果是从结算详情进入
                let time = (this.pitchOnTime).split(' ')
                params = {
                    beginTime: time[0] + ' ' + '00:00:00', // 下注起始时间【yyyy-MM-dd HH:mm:ss】
                    endTime: time[0] + ' ' + '23:59:59', // 下注截止时间【yyyy-MM-dd HH:mm:ss】
                    page: this.$store.state.home.currentPage, // 页码
                    size: 20 // 每页条数
                }
            }else { // 从我的页面进入
              let serviceTime =  new Date(this.serviceTime).getTime()-24*60*60*1000*6; // 当前服务器时间的前7个数据
              let datatime = this.settime_serviceTime(new Date(serviceTime)) // 标准时间转化为【yyyy-MM-dd HH:mm:ss】格式
              let time = (datatime).split(' ') // 截取时间
                if(this.curParSelectMenuId == 'all') { // 判断一级菜单id是否为全部
                    params = {
                        beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                        page: this.$store.state.home.currentPage, // 页码
                        size: 20 // 每页条数
                    }
                }else { // 非全部
                    params = {
                        beginTime:time[0] + ' ' + '00:00:00', // 投注开始时间
                        lotteryId: this.curSubMenuId, // 二级彩种id
                        settleStatus: this.curSettleStatus, // 结算状态: 0未结算,3已结算
                        page: this.$store.state.home.currentPage, // 页码
                        size: 20 // 每页条数
                    }
                }

            }
            getOrderPage(params).then(response => {
                if(response && response.success == 1){
                    if(response.content.content.length > 0) { // 判断数据不为空
                        let res = response.content.content
                        res.forEach((v,k) => {
                            this.$store.state.home.curOrderList.push(v)
                        })
                        loaded("done")
                    }else {
                        this.$store.dispatch("getNoMore",true) // 是否已加载全部
                        loaded("done")
                    }
                }
            })
        }
    },
    destroyed() { // 组件销毁时清除定时器
        this.$store.dispatch("getActiveDetails", '') // 组件销毁时初始化当前选中详情初始
    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue";
.active
    color $date-active-font
    border 0.01rem solid $date-active-font!important
    font-weight bold
.order
    // min-height calc(100vh - 0.65rem)
    margin-top 0.65rem
.order-flex
    position fixed
    top 0.44rem
    left 0rem
    padding-top 0.16rem
    background $allmenu-bg
    width 100%
    z-index 8
    -webkit-overflow-scrolling touch
.ftop45
    top 0.26rem!important
// .mtop1
//     margin-top 1rem!important
.order-status
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    text-align center
    align-items center
    width 3.47rem
    margin 0 auto
    color $order-font
    li
        border 0.01rem solid $odds-line
        width 50%
        border-radius 0.05rem 0 0 0.05rem
        line-height 0.3rem
        font-size 0.15rem
        cursor pointer
        &:nth-child(2)
            border-radius 0rem 0.05rem 0.05rem 0rem
.order-title
    // width 3.47rem
    padding 0 0.14rem
    margin 0.12rem auto 0
    font-size 0
    .order-title-box
        display flex
        flex-wrap wrap
        justify-content space-around
        flex-direction row
        text-align center
        align-items center
        background $order-tit-bg
        font-size 0
        li
            // width 25%
            // flex 1
            line-height 0.4rem
            font-size 0.15rem
            color $order-title-font
            // &::after
            //     content ""
            //     display inline-block
            //     width 0.01rem
            //     height 0.18rem
            //     background $order-tit-cut-off
            //     float right
            //     position relative
            //     top 0.06rem
            &:nth-child(4)
                width 0.6rem
                &::after
                    content ""
                    display inline
                    width 0
            &:nth-child(1)
                width 0.9rem
            &:nth-child(2)
                flex 1
                padding-left 0.15rem
            &:nth-child(3)
                width 0.6rem
.order-list
    // margin-top 1.34rem
    height calc(100vh - 1.35rem)
    // overflow auto
    padding 0 0.14rem
    li
        display flex
        flex-wrap wrap
        justify-content flex-start
        flex-direction row
        text-align center
        align-items center
        border-bottom 0.01rem solid $odds-line
        &:nth-child(1)
            border-top 0.01rem solid $odds-line
        &:nth-last-of-type(1)
            margin-bottom 0.55rem
        span
            // width 25%
            line-height 0.4rem
            font-size 0.14rem
            color $order-tit-font
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            &:nth-child(1)
                width 0.9rem
            &:nth-child(2)
                flex 1
                padding-left 0.15rem
            &:nth-child(3)
                width 0.6rem
            &:nth-child(4)
                width 0.6rem
        .oredr-details
            display flex
            flex-wrap wrap
            justify-content flex-start
            flex-direction row
            text-align center
            align-items center
            width 3.45rem
            margin 0rem auto
            span
                width 50%
                line-height 0.3rem
                font-size 0.12rem
                color $order-tit-font
                white-space nowrap
                text-overflow ellipsis
                overflow hidden
                text-align left
                padding-left 0.15rem
                &:nth-child(2n)
                    padding-left 0
                    padding-right 0.15rem
                &:nth-child(7),
                &:nth-child(8)
                    width 100%
                    padding-left 0.15rem
                    padding-right 0
    .noMore
        text-align center
        line-height 0.42rem
        color $order-tit-font
    .noData
        width 100%
        height 80%
        .content-box
            // margin-top 0.6rem
            margin auto 
            span
                font-size .15rem
            .noneinfo
                width 1.6rem
                margin-bottom 0.15rem
            .slinkfields
                font-size .12rem
                margin-top 0.03rem
                color $slinkfields-tit-font
            .nodatatest
                font-weight bold
.vue-pull-to-wrapper
    margin-top 1.44rem!important
    background $allmenu-bg
.mt74
    margin-top 0.94rem!important
.oredr-details
    display none
    background $order-tit-bg-details
    border-top 0.01rem solid $odds-line
    span
        color $order-details-font!important
.top5.order-list
    margin-top 0rem!important
    padding-top 0.4rem
    height calc(100vh - 2.06rem)
    // overflow auto
.order-countDown
    margin-top -1.44rem
    position relative
    .vue-pull-to-wrapper
        margin-top 0
    .order-flex
        position absolute
        top 0rem
        padding-top 0
        .t19.order-title
            margin-top 0rem !important
            background none
    .order-title-box
        background none
// 遮罩层显示时阻止遮罩层底部的内容滚动
.preventScroll
    overflow hidden !important
@media screen and (min-width:320px)
    .iPhone-mobile
        height calc(100vh - 2.3rem)
@media screen and (min-width:325px) and (max-width:375px)
    .iPhone-mobile
        height calc(100vh - 2.2rem)
    .android-mobile
        height calc(100vh - 1.45rem)
@media screen and (min-width:376px) and (max-width:414px)
    .iPhone-mobile
        height calc(100vh - 2.5rem)
    .android-mobile
        // height calc(100vh - 2.0rem)
        // 兼容安卓自带浏览器
        height calc(100vh - 1.45rem)
// 华为 mate9 Pro
@media screen and (min-width:325px) and (max-width:375px) and (min-height:500px) and (max-height:530px)
    .android-mobile
        height calc(100vh - 1.95rem)
</style>
