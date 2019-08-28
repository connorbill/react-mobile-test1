<template lang="jade">
    .goback
        div.m-icon-left(@touchend.prevent="judgeBack",v-if ="shwoicon()")
            svg-icon(icon-class="arrows-left")
        div.m-icon-left(v-else ="shwoicon()")
</template>
<script>
import { mapState } from 'vuex'
import { debug } from 'util';
import Cookies from 'js-cookie'
export default {
    name: "goBack", // 返回上一页
    computed:{
        ...mapState({
            allGameList: state => state.home.allGameList, // 获取所有游戏列表
            hotGameList: state => state.home.hotGameList, // 获取推荐游戏列表
            historyGameList: state => state.home.historyGameList, // 获取历史游戏列表
            urlFrom: state => state.home.urlFrom, // 路径来自哪个 路由
            customerUrl: state => state.home.customerUrl, // 商户连接地址
            flag_urlParameter: state => state.home.flag_urlParameter, // 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
        })
    },
    data() {
        return {
            menuIndex: 0  // 一级玩法选中下标
        }
    },
    mounted(){
        this.menuIndex = this.$route.query.menuIndex // 一级玩法选中下标

    },
    methods: {
        shwoicon(){
            let id = this.$route.query.id;
            let temp = this.$route.query.temp;
            let from = this.$route.query.from;
            let subId = this.$route.query.subId;
            let parId = this.$route.query.parId;
            let flagdata =Cookies.get('flag')
            // temp=memberCenter&from=memberCenter store.getters.customerUrl
            let hotGames = flagdata == 1 && id == 1 && temp == "hotGames" && from == "hotGames"
            let classGames = flagdata == 1 && id == 2 && temp == "classGames" && from == "classGames"
            let historyGames = flagdata == 1 && id ==3 && temp == "historyGames" && from == "historyGames"
            let memberCenter = flagdata == 1 && id == 4 && temp == "memberCenter" && from == "memberCenter"
            let back = flagdata == 1 && id == 1 && temp == "hotGames"
            let nulldata = flagdata == 1 && !id && !temp && !from
            if(back||hotGames||classGames||historyGames||memberCenter||nulldata){
                return false
            }else{
                return true
            }
        },
        gotoHome() { // 返回推荐首页
            let queryJson = {'id':1, 'temp':'hotGames', 'from':'hotGames'}
            this.$router.push({name: 'home', query:queryJson})
            this.$store.dispatch('getTempMenu', 'hotGames')
            this.$store.dispatch('getMenuActive', 1) // 当前选中菜单  
            this.$store.dispatch('getCurGameList', this.hotGameList)  // 重置推荐记录游戏列表
        },
        judgeBack() { // 判断返回地址
            let name = this.$route.name, // 路由名称
                temp = this.$route.query.temp // 路由名称
            if(name == 'home') {
                // if(temp == 'memberCenter') {
                //     this.gotoHome() // 返回推荐首页
                //     return
                // }
                this.$store.dispatch('getFlagalert', true) // 弹出框显示
                this.$store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                this.$store.dispatch('getAlertCon', '是否退出GG彩票平台？') // 弹出提示内容存状态库
                this.$store.dispatch('getAlertIcon', "goback") // 弹出提示图标
                this.$store.dispatch('getAlertClass', 'center') // 弹出样式
                this.$store.dispatch('getAlertBut', '退出') // 弹出按扭文字
                let url = this.$store.getters.customerUrl // 商户连接
                    if(!url) {
                        let host = window.location.host // 获取host地址
                        url = host + '/#/login'
                    }
                this.$store.dispatch('getAlertUrl', url) // 商户连接
            } else {
                let formtemp = this.$route.query.from, // 路由来自哪
                    name = this.$route.name // 路由名称
                if(formtemp == 'memberCenter' && name == 'checkDetails') {
                    this.$router.push({name: 'home', query:{'id':4, 'temp':'memberCenter', 'from':'memberCenter'}}) // 返回我的
                } else {
                    this.backHome() // 返回上一页
                }
            }
        },
        backCustomerUrl() { // 返回商户主页
            let url = this.customerUrl  // 商户连接地址
            var reURL = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
            if(url && url != '') {
                if(url.match(reURL)) {
                    window.location.href = url
                } else {
                    window.location.href = 'http://' + url
                }
                return
            }
        },
        backHome() { // 返回上一页
      
            this.$store.dispatch('getFlagBack', true) // 是否点击返回键 false: 不是返回键， true:是返回键
            let len = this.urlFrom.length, // 历史路由长度
                name = this.urlFrom[len-1].name, // 路由对像名称 字符串
                query = this.urlFrom[len-1].query, // 路由对像参数 字符串
                strName = JSON.parse( this.urlFrom[len-1].name), // 路由模板名字符串转对像
                queryJson = JSON.parse(this.urlFrom[len-1].query) // 路由参数字符串转对像
            if(!queryJson.temp && !queryJson.id && !queryJson.subId && !queryJson.parId) { // 如果页面刷新过，历史路由被重置 
                this.gotoHome() // 返回推荐首页
                return
            }
            if(query == '{}') { // 如果到返回最后一个
                this.gotoHome() // 返回推荐首页
            } else {
                this.$router.push({name: strName, query:queryJson})
                this.$store.dispatch('getTempMenu', queryJson.temp)
                this.$store.dispatch('getMenuActive', queryJson.id) // 当前选中菜单  
                this.$store.dispatch('getParMenuActiveId', this.menuIndex) // 初始游戏一级彩种
                this.$store.dispatch('getParMenuCurId', queryJson.parId) // 初始游戏一级彩种
                this.$store.dispatch('getFlagBack', true) // 是否点击返回键 false: 不是返回键， true:是返回键
                let key = queryJson.temp // 当前模板
                switch (key) {
                    case 'hotGames':
                        this.$store.dispatch('getCurGameList', this.hotGameList)  // 重置推荐记录游戏列表
                        break;
                    case 'classGames':
                        this.allGameList.forEach((v, k) => {
                            if(queryJson.parId == v.id) {
                                this.$store.dispatch('getParMenuActiveId', this.menuIndex) // 初始游戏一级彩种
                                this.$store.dispatch('getCurGameList', v.children)  // 重置分类游戏列表
                                this.$router.push({name: 'home', query:{'id':2, 'temp':'classGames', 'from':'classGames', 'subId':queryJson.parId-1 , 'parId':v.id}})
                            }
                        })
                        break; 
                    case 'historyGameList':
                        this.$store.dispatch('getCurGameList', this.historyGameList)  // 重置历史记录游戏列表
                        break;   
                    case '结算详情':
                        this.getActive(queryJson.menuIndex)
                        break;            
                    default:
                        break;
                }
            }
        },





        getActive(id) { // 获取当前选中
            this.$store.dispatch('getActiveCheck', id)
            this.getSaverTimeAsyn(id)
            this.$router.push({name: 'checkDetails', query:{'id':2, 'menuIndex':id, 'temp':'结算详情', 'from':'memberCenter'}})
        },
        getSaverTimeAsyn(id) { // 获取服务器时间
            this.$store.dispatch('getSaverTimeAsyn', id).then((res) => {
                let st = res.content.serverTime, // 服务器时间
                    countTime = this.getDayCount(st, -6), // 获取近7天 本周 上周 开始及结束时间
                    start = null, // 开始时间
                    end = null // 结束时间
                id = id + ""
                switch (id) {
                    case '7':
                        start = countTime['Day7'].start
                        end = countTime['Day7'].end
                        break;
                    case '0':
                        start = countTime['thisWeek'].start
                        end = countTime['thisWeek'].end
                        break;
                    case '1':
                        start = countTime['lastWeek'].start
                        end = countTime['lastWeek'].end
                        break;
                    default:
                        break;
                }
                this.getCheckDetials(start, end)
            })
        },
        getDateStr(st, addDayCount) { // 最近n天 st:服务器时间, addDayCount:前n天
            let now = new Date(st);
            now.setDate(now.getDate() + addDayCount); //获取AddDayCount天后的日期
            let y = now.getFullYear(), // 当前年
                m = now.getMonth() + 1, // 当前月1: 补0开始
                d = now.getDate() // 当前日
            return y + "-" + m + "-" + d;
        },
        getDayCount(t, addDayCount) { // 获取最近七天本周上周时间 t:服务器时间, addDayCount：近n天
            let st = t.replace(/-/g, "/"), // IE,safari时间格式兼容
                now = new Date(st), // 实例化当前时间 服务器时间为准
                nowDayOfWeek = now.getDay(), // 今天本周的第几天
                nowDay = now.getDate() 
            let weekStart = this.getDateStr(st, - nowDayOfWeek + 1) + ' ' + '00:00:00', // /获得本周的开始日期
                weekEnd = this.getDateStr(st, 7 - nowDayOfWeek) + ' ' + '23:59:59', // 获得本周的结束日期
                lastWeekStart = this.getDateStr(st, - now.getDay(0) - 6) + ' ' + '00:00:00', // /获得本周的开始日期
                lastWeekEnd = this.getDateStr(st, - now.getDay(0)) + ' ' + '23:59:59' // 获得本周的结束日期
    
            let foremaDay7Start = this.getDateStr(st, addDayCount) + ' ' + '00:00:00', // 格式化最近七天的开始日期
                foremaDay7End = this.getDateStr(st, 0) + ' ' + '23:59:59' // 格式化最近七天的结束日期
            let data = { // 返回数据
                        'thisWeek': {'start': weekStart, 'end': weekEnd}, // 本周开始结束时间
                        'lastWeek': {'start': lastWeekStart, 'end': lastWeekEnd}, // 上周开始结束时间
                        'Day7': {'start': foremaDay7Start, 'end': foremaDay7End}, // 最近七天的开始结束时间
                       }
            return data
        },
        getCheckDetials(start, end) { // 获取结算详情 start:开始时间 end:结束时间
            let s = start.replace(/\//g, '-'), // 转为后面需要的格式 2019-7-15 00:00:00
                e = end.replace(/\//g, '-'), // 转为后面需要的格式 2019-7-15 00:00:00
                params = {
                    beginTime: s, // 开始时间
                    endTime: e // 结束时间
                }
            this.$store.dispatch('getCheckDetials', params)
        }


    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.goback
    .m-icon-left   // 返回按钮
        font-size 0.2rem
        width 0.3rem
        color $menu-font-color
        text-align right
        height 0.44rem
        svg 
            position relative
            top -0.02rem
            left 0.01rem
</style>