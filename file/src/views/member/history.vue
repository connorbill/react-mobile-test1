// 历史开奖弹窗
<template lang="jade">
    .history(:class="from != 'countDown' ? '' : 'history-countDown'", @touchend.prevent="changePos")
        .history-top(v-if="from != 'countDown'")
            vue-header
            .data-w
                vue-datawrap
        .history-con(:class="from != 'countDown' ? '' : 'top5'", v-show="infoCurParMenu", :bottom-config="pullUpText")
            ul.history-tit(:class="['history-tit-' + infoCurParMenu ]", v-show="curHistoryList.length > 0") 
                li(v-for="val, index in titList", :key="index", v-html="val")
            vue-pull-to.scroll-con(:bottom-load-method="from != 'countDown' ? pullUp : null", is-bottom-keep-scroll=true, ref="historyHeight")
                vue-loading-gif(v-show="isLoading")
                ul.history-list(:class="['history-list-' + infoCurParMenu, phoneModel, preventScroll]", v-show="!isLoading")
                    li(v-for="list, index in curHistoryList", :key="index") 
                        span {{ list.gameNo | issueFiltration }}期
                        span {{ list.govPrizeTime | timeFiltration }} 
                        span
                            //- 非香港彩
                            em(v-for="v, i in list.playBalls", :key="i" v-if="infoCurParMenu != 'HK' ")
                                span.ball-number(:class='["ball-color" + v.ballValue]', v-if = "infoCurParMenu != 'FT' ") {{ v.ballValue }}
                                img(v-if="infoCurParMenu == 'FT' ", :src="'../../static/images/dice' + v.ballValue + '.png'")
                            //- 香港彩
                            em(v-for="v, i in list.playBalls", :key="i" v-if="infoCurParMenu == 'HK' && i <= 5")
                                span.ball-number(:class='v.color') {{ v.ballValue }}
                                span(v-if="i == 5") +
                                span.ball-shengxiao {{ v.shengxiao }}
                            em(v-for="v, i in list.playBalls", :key="i" v-if="infoCurParMenu == 'HK' && i == 6")
                                span.ball-number(:class='v.color') {{ v.ballValue }}
                                span.ball-shengxiao {{ v.shengxiao }}
                    .noMore(v-if='noMore && curHistoryList.length != 0') 已经加载全部
                    .noData(v-if="curHistoryList && curHistoryList.length == 0") 
                        .content-box
                            svg-icon.none(icon-class="noneData")
                            span 暂无开奖信息
</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import datawrap from '@/views/member/datawrap'  // 时间容器
import { getHistory } from '@/api/home' // API
import { debug } from 'util';
import PullTo from 'vue-pull-to' // 滑动请求数据插件 
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'History', // 历史记录
    components: {
        "vue-header": header, // 头部组件
        "vue-datawrap": datawrap, // 时间容器
        "vue-pull-to": PullTo, // 分页
        'vue-loading-gif':loadingGif // loading
    },
    computed: {
        ...mapState({
            curHistoryList: state => state.home.curHistoryList, // 所有注单例表
            infoCurParMenu: state => state.home.infoCurParMenu, // 信息类一级彩种code
            curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
            dateArrStore: state => state.home.dateArrStore, // 最近10天
            activeDate: state => state.home.activeDate, // 选中日期
            scrollValue: state => state.home.scrollValue, // 滚动条滚动值
            initializeScroll: state => state.home.initializeScroll, // 是否初始化滚动条滚动值
            quickActiveCode: state => state.home.quickActiveCode, // 投注弹窗选中的tab切换code
            isLoading: state => state.home.isLoading, // 是否显示loading
            showDataDialog: state => state.home.showDataDialog, // 是否显示时间选择框
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
            showBg: state => state.home.showBg, // 背景层是否显示
            hkDateArrStore: state => state.home.hkDateArrStore, // 香港彩选中的时间范围
            noMore: state => state.home.noMore, // 是否已加载全部
        })
    },
    data() {
        return{
            from: '', // 路径来自哪
            titList: [
                        '期号',   
                        '时间',
                        '结果'
                    ],
            pullUpText:{ // 上拉提示文本
                pullText: '上拉加载更多',
                triggerText: '释放更新',
                loadingText: '加载中...',
                doneText: '加载完成',
                failText: '加载失败',
                loadedStayTime: 400,
                stayDistance: 50,
                triggerDistance: 70
            },
            phoneModel:'', // 用于手机型号样式兼容
            preventScroll:'', // 阻止遮罩层显示时底部盒子滚动
        }
    },
    created() {
        this.from = this.$route.query.from // 路径来自哪
    },
    mounted() {
        if(navigator.userAgent.match("Android")){  // 判断使用的是什么系统的手机
            this.phoneModel = 'android-mobile' // 安卓
        }else if(navigator.userAgent.match("iPhone")){  
            this.phoneModel = 'iPhone-mobile'   // 苹果
        }
        // else if(navigator.userAgent.match("iPad")){  
        //     this.phoneModel = 'iPad-mobile'  
        // }else{  
        // //      alert(navigator.userAgent);  
        //     this.phoneModel = 'android-mobile' 
        // }
        // this.getBrowser()
    },
    filters: { // 过滤处理
        issueFiltration: function (v) { // 过滤期号 截取末尾三位字符
            return v.slice(-3)
        },
        timeFiltration: function (v) { // 过滤时间 去除年份
            let str = v.split("-")
            return str[1]+"-"+str[2]
        }
    },
    watch: {
        scrollValue:{
            handler:function (newVal,oldVal) {
                let c = this.$refs.historyHeight.$el.children
                if(c) { // 判断是否存在元素
                    if(this.scrollValue == 0 && this.initializeScroll == true) {
                        this.$refs.historyHeight.$el.children[0].scrollTop = 0
                    }
                }
                
            },
            immediate:false
        },
        quickActiveCode:{ // 监听投注弹窗选中的tab切换code
            handler:function (newVal,oldVal) {
                if(newVal == "draw") {
                    this.$refs.historyHeight.$el.children[0].scrollTop = 0
                }
            }
        },
        showDataDialog: { // 监听时间选择框显示  显示时阻止遮罩层底部的盒子滚动
            handler: function (newVal,oldVal) {
                if(newVal == true) {
                    this.preventScroll = 'preventScroll'
                }else {
                    this.preventScroll = ''
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
        showBg: { // 监听遮罩层显示  
            handler :function (newVal, oldVal) {
                if(!newVal) { // 遮罩层消失时香港彩选择时间弹窗隐藏
                    this.$store.dispatch("getHkShowDataDialog",newVal) // 是否显示时间选择框
                }
            }
        }
    },
    methods: {
        changePos(e) { /// 滑动事件
            let pathArr = e.path;
            this.$store.dispatch("getScrollValue",pathArr[5].scrollTop)
            for (let i = 0; i < pathArr.length; i++) {
                if(pathArr[i].className == "scroll-container") {
                    this.$store.dispatch("getScrollValue",pathArr[i].scrollTop)
                }
            }
        },
        pullUp(loaded) { // 上拉
            let page = this.$store.state.home.currentPage
            page++
            this.$store.dispatch("getCurrentPage",page)
            let d = null, // 当前时间
                curDate = null,
                starDate = null,
                endDate = null
            if(this.curSubMenuId != 8) {
                d = this.dateArrStore[this.activeDate], // 当前时间
                curDate = d.year + '-' + d.month + '-' + d.day,
                starDate = curDate + ' ' + '00:00:00',
                endDate = curDate + ' ' + '23:59:59'
            }else {
                starDate = this.hkDateArrStore.start,
                endDate = this.hkDateArrStore.end
            }

            let params = {
                lotteryId: this.curSubMenuId, // 二级彩种id
                page: this.$store.state.home.currentPage, // 页码
                size: 20, // 每页条数
                govPrizeTimeBegin: starDate, // 开始时间
                govPrizeTimeEnd: endDate // 结束时间
            }
            getHistory(params).then(response => {
                if(response && response.success == 1){
                    if(response.content.content.length > 0) { // 判断数据不为空
                        let res = response.content.content
                        res.forEach((v,k) => {
                            this.$store.state.home.curHistoryList.push(v)
                        })
                        loaded("done") // 加载完成
                    }else {
                        this.$store.dispatch("getNoMore",true) // 是否已加载全部
                        loaded("done") // 加载完成
                    }
                }
            })
        },
        // 判断是否是手机端浏览器
        getBrowser(){
            var ua = navigator.userAgent.toLowerCase();
            var btypeInfo = (ua.match( /firefox|chrome|safari|opera/g ) || "other")[ 0 ];
            if( (ua.match( /msie|trident/g ) || [] )[ 0 ] ) {
                btypeInfo = "msie";
            }
            var pc = ""; 
            var prefix = "";
            var plat = "";
            if(navigator.userAgent.match("Android")){  
                pc = 'android'
            }else if(navigator.userAgent.match("iPhone")){  
                pc = 'iPhone'   
            }
            switch( btypeInfo ) {
                case "chrome":
                    prefix = "webkit";
                    break;
                case "safari":
                    prefix = "safari";
                    break;
                case "mobile":
                    prefix = "mobile";
                    break;
                case "msie":
                    prefix = "ms";
                    break;
                case "firefox":
                    prefix = "Moz";
                    break;
                case "opera":
                    prefix = "O";
                    break;
                default:
                    prefix = "webkit";
                    break
            }
            plat = (ua.indexOf( "android" ) > 0) ? "android" : navigator.platform.toLowerCase();
            let obj = {
                version: (ua.match( /[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[ 1 ],     //版本
                plat: plat,                   //系统
                type: btypeInfo,              //浏览器
                pc: pc,
                prefix: prefix,                //前缀
                isMobile: (pc == "pc") ? false : true              //是否是移动端
            }
            alert(obj.type)
            return obj
        }
    },
    destroyed() { // 组件销毁时清除定时器

    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue";
.history-top
    position fixed
    top 0.44rem
    left 0rem
    z-index 5
    height 0.6rem
    width 100%
    text-align center
    background $allmenu-bg
    -webkit-overflow-scrolling touch
.data-w
    margin-top 0.16rem
.history-con
    margin-top 1.44rem
    z-index 1
.history-tit
    // history-con
    position fixed
    top 1.04rem
    display flex
    justify-content space-between
    flex-wrap wrap
    flex-direction row
    // width 100%
    height auto
    line-height 0.4rem
    height 0.4rem
    box-sizing border-box
    // overflow auto
    // padding 0 0.14rem
    // background $allmenu-bg  
    background $order-tit-bg
    margin 0 0.14rem
    width 92.5%
    z-index 3
    -webkit-overflow-scrolling touch
    color $order-tit-font
    li
        text-align center
        font-size 0.15rem
        &:nth-child(1)
            width 0.46rem
        &:nth-child(2)
            width 1.68rem
        &:nth-child(3)
            flex 1
            // padding-left 0.08rem
// 香港彩
.history-tit-HK
    li 
        &:nth-child(1)
            width 0.4rem
        &:nth-child(2)
            width 1.08rem
            margin 0 0.08rem
        &:nth-child(3)
            flex 1
            padding-left 0rem
// pk10
.history-tit-PKT
    li 
        &:nth-child(1)
            width 0.5rem
            box-sizing border-box
            padding-right 0.06rem
        &:nth-child(2)
            flex 1
        &:nth-child(3)
            width 1.49rem
            padding-left 0rem
// 快乐十分
.history-tit-KLT
    li 
        &:nth-child(1)
            width 0.44rem
        &:nth-child(2)
            width 1.2rem
            margin 0 0.37rem
        &:nth-child(3)
            flex 1
            padding-left 0rem
// 快三
.history-tit.history-tit-FT 
    li
        &:nth-child(1)
            width 0.44rem
        &:nth-child(2)
            width 2.05rem
        &:nth-child(3)
            flex 1
            padding-left 0rem
.history-list
    padding 0 0.14rem
    height calc(100vh - 2rem)
    li
        display flex
        flex-wrap wrap
        justify-content space-around
        align-items center
        flex-direction row
        width 100%
        border-top 0.01rem solid $odds-line
        box-sizing border-box
        padding 0.05rem 0
        &:nth-last-of-type(1)
            margin-bottom 0.55rem
            border-bottom 0.01rem solid $odds-line
        span
            text-align center
            display flex
            flex-wrap wrap
            justify-content space-around
            align-items center
            flex-direction row
            color $order-tit-font
            font-size 0.14rem
            &:nth-child(1)
                width 0.46rem
            &:nth-child(2)
                width 1.68rem
                margin auto
            &:nth-child(3)
                flex 1
                text-align left
                margin-bottom 0.05rem
                // padding-left 0.08rem
            em
                margin 0.05rem 0.04rem 0rem 0
                font-style normal
                .ball-number
                    display inline-block
                    width 0.22rem
                    text-align center
                    line-height 0.22rem
                    color $history-number-color
                    border-radius 50%
                    color $history-color
                img 
                    display block
                    width 0.25rem
                    height 0.25rem
    .noMore
        text-align center
        line-height 0.42rem
        color $order-tit-font
// 香港彩
.history-list-HK
    li 
        span 
            flex-wrap nowrap
            &:nth-child(1)
                width 0.4rem
            &:nth-child(2)
                width 1.08rem
                margin 0 0.08rem
            &:nth-child(3)
                flex 1
                padding-left 0rem
                margin-bottom 0.02rem
            em
                display flex
                flex-direction column
                margin-right 0.02rem
                span 
                    &:nth-child(2)
                        width 0.22rem
                        line-height 0.22rem
                        margin 0 0
                &:nth-child(6)
                    margin-right 0
                    flex-direction row
                    flex-wrap wrap
                    width 0.36rem
                    span
                        &:nth-child(2)
                            width 0.14rem
                        &:nth-child(3)
                            width 0.22rem
                            line-height 0.22rem
                            margin 0 0
                            box-sizing border-box
                            padding-right 0.14rem
                &:nth-child(7)
                    margin-right 0
// pk10
.history-list-PKT
    li
        span 
            &:nth-child(1)
                width 0.5rem
                box-sizing border-box
                padding-right 0.06rem
            &:nth-child(2)
                flex 1
            &:nth-child(3)
                width 1.49rem
                padding-left 0rem
                em
                    margin-right 0.05rem
                    span 
                        padding-right 0rem
// 快乐十分
.history-list-KLT
    li
        span 
            &:nth-child(1)
                width 0.44rem
            &:nth-child(2)
                width 1.2rem
                margin 0 0.37rem
            &:nth-child(3)
                flex 1
                padding-left 0rem
// 快三
.history-list-FT
    li
        span 
            &:nth-child(1)
                width 0.44rem
            &:nth-child(2)
                width 2.05rem
            &:nth-child(3)
                flex 1
                padding-left 0rem
.history-countDown
    .history-con
        margin-top 0.4rem
        height calc(100vh - 2.47rem)!important
        overflow auto 
    .history-tit
        position absolute
        top 0
// 遮罩层显示时阻止遮罩层底部的内容滚动
.preventScroll
    overflow hidden !important 
.loading
    margin-top 2.1rem !important
.history-countDown
    .loading
        margin-top 0 !important
 // 投注弹框页面中开奖的表头的背景色  
.top5
    .history-tit
        background $allmenu-bg  
// iPhone5
@media screen and (min-width:320px)
    .iPhone-mobile 
        height calc(100vh - 2.3rem)
// iPhone6、7、8 
@media screen and (min-width:325px) and (max-width:375px)
    .iPhone-mobile 
        height calc(100vh - 2.2rem)
    .android-mobile
        height calc(100vh - 1.45rem)
@media screen and (min-width:376px) and (max-width:414px)
    .iPhone-mobile 
        height calc(100vh - 2.5rem)
    .android-mobile
        // height calc(100vh - 2rem)
        // 兼容安卓自带浏览器
        height calc(100vh - 1.45rem)
// 华为 mate9 Pro
@media screen and (min-width:325px) and (max-width:375px) and (min-height:500px) and (max-height:530px)
    .android-mobile
        height calc(100vh - 1.95rem)
</style>