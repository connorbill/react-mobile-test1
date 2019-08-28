<template lang="jade">
    div.content
        vue-header // 头部
        //- v-touch.vtouch(v-on:swipeleft='left(tempMenu)', v-on:swiperight='right(tempMenu)', style="touch-atction:pan-y", :swipe-options="{direction: 'horizontal'}")
        div(:class="judgeTemp(tempMenu) == 'memberCenter'? 'addvtouch' : 'vtouch'", ref='homeScroll')
            vue-hotGames.hot-history(v-show="judgeTemp(tempMenu) == 'gameList'")
            vue-member.memberheard(v-show="judgeTemp(tempMenu) == 'memberCenter'")
        //- div.quitSkipImg(v-if="quitImgShow")
        //-     img(src='../../assets/images/home/quitSkipImg.jpg')
        //- vue-gamePlay.member(v-show="judgeTemp(tempMenu) == 'gamePlay'")
</template>

<script>
import hotGames from '@/views/home/hotGames'  // 热门彩种
import member from '@/views/home/member'  // 个人中心
// import gamePlay from '@/views/gamePlay/index'  // 游戏中心
import { mapState } from 'vuex'
import { gameHotList, gameHistoryList, gameMenuClass, oddsAllList } from '@/api/home' // API
import header from "@/views/common/header"
import { setInterval } from 'timers';
export default {
    name: 'Index',
    components: {
        'vue-hotGames': hotGames, // 热门彩种种
        'vue-member': member, // 个人中心
        "vue-header": header, // 头部组件
        // 'vue-gamePlay': gamePlay, // 游戏中心
    },
    computed:{
        ...mapState({
            homeBg: state => state.home.homeBg, // 图片背景样式
            tempMenu: state => state.home.tempMenu, // 显示菜单组件
            alertMenu: state => state.home.alertMenu, // 获取菜单是否完毕 true:已完，false:未完
            menu: state => state.home.menu, // 菜单
            menuActive: state => state.home.menuActive, // 当前菜单选中样式
            parMenu: state => state.home.parMenu, // 获取父级菜单
            parMenuActiveId: state => state.home.parMenuActiveId, // 获取初始父级菜单KEY
            parMenuCurId: state => state.home.parMenuCurId, // 获取初始父级菜单Id
            hotGameList: state => state.home.hotGameList, // 获取推荐游戏列表
            allGameList: state => state.home.allGameList, // 获取所有分类游戏列表
            historyGameList: state => state.home.historyGameList, // 获取历史游戏列表
            flag_back: state => state.home.flag_back,  // 是否点击返回键
            // quitImgShow: state => state.home.quitImgShow,  // 退出图片显示
        }),
        lotteryPoll: { // 彩种定时任务
            get() {
                return this.$store.state.home.lotteryPoll
            },
            set(item) {
                return item
            }
        },
    },
    data() {
        return {
            firstHot: true,  // 推荐是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
            firstClass: true,  // 分类是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
            firstHistory: true,  // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
        }
    },
    watch: {
        tempMenu: {  // 当前选中模板
            handler: function (val, oldVal) { // 回调函数
                    if(oldVal != val){
                        this.showTemp(this.tempMenu) // 判断显示模板
                        this.firstHot = true
                        window.clearInterval(this.getLotteryPoll)
                        if(val == 'hotGames') {
                            this.hotGamesPoll()
                        }
                        if(val == 'classGames') {
                            this.classGamesPoll()
                        }
                        if(val == 'historyGames') {
                            this.historyGamesPoll()
                        }
                        if(val == 'memberCenter') {
                            window.clearInterval(this.getLotteryPoll)
                        }
                    }
                },
            immediate: true // 确认是否初始执行handler
        },
        menuActive: { // 监听当前菜单选中变化
            handler: function(newVal, oldVal) {
                if(newVal != oldVal) {
                    this.$refs.homeScroll.scrollTop = 0 // 首页tab切换时滚动条初始化
                }
            }
        }
    },
    created() {
        // this.getSaverTime()
        this.oddsAllList() // 获取所有赔率
    },
    mounted() {
        this.gameHotList(1)
        this.gameMenuClass(1)
        this.gameHistoryList(1)
        let temp = this.$route.query.temp, // 路由模板传参
            id = this.$route.query.id // 路由传参选中一级菜单ID
        if(temp) {
            this.$store.dispatch('getTempMenu', temp) // 初始默认模板
            this.$store.dispatch('getMenuActive', id) // 初始选中一级菜单ID
            this.judgeTemp(temp)
        } else {
            this.$store.dispatch('getTempMenu', 'hotGames') // 初始默认模板
            this.$store.dispatch('getMenuActive', this.menu[0].id) // 初始选中一级菜单ID
        }
    },
    methods: {
        hotGamesPoll() { // 推荐定时任务 temp:模板名称
            this.getLotteryPoll = window.setInterval(() => {
                if(this.tempMenu != 'hotGames') {
                    window.clearInterval(this.getLotteryPoll)
                } else {
                    this.gameHotList(0)
                }
            }, 3000)
        },
        classGamesPoll() { // 分类定时任务 temp:模板名称
            this.getLotteryPoll = window.setInterval(() => {
                if(this.tempMenu != 'classGames') {
                    window.clearInterval(this.getLotteryPoll)
                } else {
                    this.gameMenuClass(0)
                }
            }, 3000)
        },
        historyGamesPoll() { // 历史定时任务 temp:模板名称
            this.getLotteryPoll = window.setInterval(() => {
                if(this.tempMenu != 'historyGames') {
                    window.clearInterval(this.getLotteryPoll) // 清除轮询接口
                } else {
                    if(this.historyGameList && this.historyGameList.length <= 0) {
                        this.gameHotList(0) // 如果没有历史记录，轮询推荐接口
                    } else {
                        this.gameHistoryList(0) // 如果有历史记录，轮询历史记录的接口
                    }
                }
            }, 3000)
        },
        judgeTemp(t) {
            let arr = ['hotGames', 'classGames', 'historyGames']
            if(arr.includes(t) == true) { // 推荐 分类 历史
                if(t == 'classGames') {
                    let hasPid = false
                    this.parMenu.forEach((v, k) => {
                        if(this.parMenuCurId == v.pid) {
                            hasPid = true
                        }
                    })
                    if(hasPid == false) {
                        this.parMenu.forEach((v, k) => {
                            if(this.parMenuActiveId == k) {
                                this.$store.dispatch('getParMenuCurId', v.pid)
                            }
                        })
                    }
                }
                return 'gameList'
            }
            if(t == 'memberCenter') { // 我的
                return 'memberCenter'
            }
            if(t == 'gamePlay') { // 游戏中心
                return 'gamePlay'
            }
        },
        left(t) { // t: 选中模板
            if(this.tempMenu == 'classGames') { // 分类
                if(this.parMenuActiveId < this.parMenu.length -1 ) { // 如果未滑到一级菜单最后一个 进到父级菜单滑动
                    this.$store.dispatch('getParMenuActiveId', this.parMenuActiveId + 1) // 初始游戏一级彩种
                    let cpid = this.parMenu[this.parMenuActiveId].pid // 当前选中一级彩种ID
                    this.$store.dispatch('getParMenuCurId', cpid) // 初始游戏一级彩种
                    this.getDefaultMenu(cpid) // 杳找一级彩种对应二级彩种 'subId':queryJson.subId, 'parId':queryJson.parId
                    this.$router.push({name: 'home', query:{'id':cpid, 'temp':'classGames', 'from':'classGames','subId':this.parMenuActiveId, 'parId':cpid}})
                } else { // 如果滑到一级彩种最后一个 进到下一个菜单
                    this.menu.forEach((v, k) => {
                        if(t == v.tempName && k <= this.menu.length - 2) {
                            let tp = this.menu[k + 1].tempName, // 模板
                                id = this.menu[k + 1].id // 当前一级菜单ID
                            this.$store.dispatch('getTempMenu', tp) // 初始默认模板
                            this.$store.dispatch('getMenuActive', id) // 当前选中彩种
                            this.$router.push({name: 'home', query:{'id':id, 'temp':tp, 'from':tp}})
                        }
                    })
                }
            } else { // 如果不是分类，进到下一个彩种
                this.menu.forEach((v, k) => {
                    if(t == v.tempName && k <= this.menu.length - 2) {
                        let tp = this.menu[k + 1].tempName, // 模板
                            id = this.menu[k + 1].id // 当前一级菜单ID
                        this.$store.dispatch('getTempMenu', tp) // 初始默认模板
                        this.$store.dispatch('getMenuActive', id) // 当前选中彩种
                        this.$router.push({name: 'home', query:{'id':id, 'temp':tp, 'from':tp}})
                    }
                })
            }
        },
        right(t) { // t: 选中模板
            if(this.tempMenu == 'classGames') {
                if(this.parMenuActiveId > 0) { // 如果未滑到一级彩种第一个 进到一级彩种滑动
                    this.$store.dispatch('getParMenuActiveId', this.parMenuActiveId - 1) // 初始游戏一级彩种
                    let cpid = this.parMenu[this.parMenuActiveId].pid // 当前选中一级彩种ID
                    this.$store.dispatch('getParMenuCurId', cpid) // 初始游戏一级彩种
                    this.getDefaultMenu(cpid)
                    this.$router.push({name: 'home', query:{'id':cpid, 'temp':'classGames', 'from':'classGames','subId':this.parMenuActiveId, 'parId':cpid}})
                } else { // 如果滑到一级彩种第一个 进到上一个菜单
                    this.menu.forEach((v, k) => {
                        if(t == v.tempName && k > 0) {
                            let tp = this.menu[k - 1].tempName, // 模板
                                id = this.menu[k - 1].id // 当前一级菜单ID
                            this.$store.dispatch('getTempMenu', tp) // 初始默认模板
                            this.$store.dispatch('getMenuActive', id) // 当前选中彩种
                            this.$router.push({name: 'home', query:{'id':id, 'temp': tp, 'from':tp}})
                        }
                    })
                }
            } else { // 如果不是分类，进到上一个彩种
                this.menu.forEach((v, k) => {
                    if(t == v.tempName && k > 0) {
                        let tp = this.menu[k - 1].tempName, // 模板
                            id = this.menu[k - 1].id // 当前一级菜单ID
                        this.$store.dispatch('getTempMenu', tp) // 初始默认模板
                        this.$store.dispatch('getMenuActive', id) // 当前选中彩种
                        this.$router.push({name: 'home', query:{'id':id, 'temp': tp, 'from':tp}})
                    }
                })
            }
        },
        showTemp(t) { // 刷新模板数据
            this.judgeTemp(t) // 判断显示模板
            switch(t) {
                case 'hotGames':
                    if(this.firstHot == true) {  // 如果是第一次请求
                        return
                    } else {
                        this.$store.dispatch('getCurGameList', this.hotGameList) // 获取当前游戏列表
                        this.gameHotList(1) // 1 正常请求
                    }
                    break;
                case 'classGames':
                    if(this.firstClass == true) { // 如果是第一次请求
                        // this.$store.dispatch('getCurGameList', this.allGameList) // 获取当前游戏列表
                        this.getDefaultMenu() // 初始化一级玩法
                        this.gameMenuClass(1) // 1 正常请求
                    } else {
                        // this.$store.dispatch('getCurGameList', this.allGameList) // 获取当前游戏列表
                        this.getDefaultMenu() // 初始化一级玩法
                        this.gameMenuClass(0) // 1 正常请求
                    }
                    break;
                case 'historyGames':
                    if(this.firstHistory == true) { // 如果是第一次请求
                        return
                    } else {
                        this.$store.dispatch('getCurGameList', this.historyGameList) // 获取当前游戏列表
                        this.gameHistoryList(1) // 1 正常请求
                    }
                    break;
                case 'memberCenter':
                    this.getAccount() // 获取用户信息
                    break;
            }
        },
        getAccount() { // 获取用户信息
            this.$store.dispatch('getAccount')
        },
        oddsAllList(i) { // 获取所有赔率
            oddsAllList().then((response) => {
                let res = response,
                    oddArr = {}
                if(res && res.success == 1) {
                   let allOdd = res.content
                   allOdd.forEach((v, k) => {
                       oddArr[v.lotteryId] = v.oddsList
                   })
                   this.$store.dispatch('getAllOddsList', oddArr)
                }
            })
        },
        gameHotList(i) { // 获取推荐游戏 i:是否轮询, 0论询 1正常操作
            gameHotList().then((response) => {
                let res = response
                if(res && res.success == 1) {
                    let l =  res.content.lotteryList, // 获取推荐游戏列表
                        s =  res.content.serverTime // 获取服务器时间
                    this.$store.dispatch('getHotGameList', l) // 获取推荐游戏列表
                    if(((!this.flag_back || !this.curGameList)  && this.tempMenu == 'hotGames') || (this.tempMenu == 'historyGames' && this.historyGameList && this.historyGameList.length <= 0)) { // 防止第一次初始化时首页数据错误
                        this.$store.dispatch('getCurGameList', l) // 获取当前游戏列表
                    }
                    this.$store.dispatch('getSaverTime', s) // 获取服务器时间
                    this.$store.dispatch('getAlertMenu', true ) // 菜单获取完毕
                    this.firstHot = false // 推荐是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
                }
            })
        },
        gameMenuClass(i, pid) { // 获取全部菜单游戏 i:是否轮询, 0论询 1正常操作， pid:一级菜单ID
            gameMenuClass().then((response) => {
                let res = response
                if(res && res.success == 1) {
                    if(this.tempMenu != 'classGames' && this.firstClass == false) { // 防轮询接口影响数据错误
                        return
                    }
                    let l =  res.content.lotteryList, // 获取历史游戏
                        s =  res.content.serverTime, // 获取服务器时间
                        p = [] // 父级菜单
                    l.forEach((v, k) => {
                        if(this.parMenuCurId && this.parMenuCurId == v.id) {
                            if(this.firstClass == false && this.tempMenu == 'classGames') { // 防止第一次初始化时首页数据错误
                                this.$store.dispatch('getCurGameList', v.children) // 初始当前游戏列表
                                this.$store.dispatch('getParMenuCurId', v.id) // 初始游戏一级菜单
                                this.$store.dispatch('getParMenuActiveId', k) // 初始游戏一级彩种
                                this.$store.dispatch('getSaverTime', s) // 获取服务器时间
                            }
                        } else {
                            if(k == 0) {  // !this.flag_back 并且不是否返回按扭 
                                if(!this.flag_back && this.firstClass == false && this.tempMenu == 'classGames') { // 防止第一次初始化时首页数据错误
                                    this.$store.dispatch('getCurGameList', v.children) // 初始当前游戏列表
                                    this.$store.dispatch('getParMenuCurId', this.parMenuCurId) // 初始游戏一级菜单
                                    this.$store.dispatch('getParMenuActiveId', k) // 初始游戏一级彩种
                                    this.$store.dispatch('getSaverTime', s) // 获取服务器时间
                                }
                            }
                        }
                        
                        let parr = {'name': v.name, 'pcode': v.code, 'pid': v.id}
                        p.push(parr)
                        // 'subId':queryJson.subId, 'parId':queryJson.parId
                    })


                    
                    this.$store.dispatch('getParMenu', p ) // 所有父级菜单
                    this.$store.dispatch('getAllGameList', l) // 初始游所有戏列表
                    this.$store.dispatch('getAlertMenu', true ) // 菜单获取完毕
                    this.firstClass = false // 分类是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
                }
            })
        },
        gameHistoryList(i) { // 获取历史游戏 i:是否轮询, 0论询 1正常操作
            gameHistoryList().then((response) => {
                let res = response
                if(res && res.success == 1){
                    if(this.tempMenu != 'historyGames' && this.firstHistory == false) { // 防轮询接口影响数据错误
                        return
                    }
                    let l =  res.content.lotteryList, // 获取历史游戏
                        s =  res.content.serverTime // 获取服务器时间
                    this.$store.dispatch('getHistoryGameList', l) // 获取历史游戏
                    if(!this.flag_back && this.firstHistory == false && this.tempMenu == 'historyGames') { // 防止第一次初始化时首页数据错误
                        if(l.length <= 0) {
                            this.$store.dispatch('getCurGameList', this.hotGameList) // 获取当前游戏列表
                        } else {
                            this.$store.dispatch('getCurGameList', l) // 获取当前游戏
                        }
                    }
                    this.$store.dispatch('getSaverTime', s) // 获取服务器时间
                    this.$store.dispatch('getAlertMenu', true ) // 菜单获取完毕
                    this.firstHistory = false // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
                }
            })
        },
        getDefaultMenu() { // 初始化分类菜单 i:一级彩种ID

            this.$store.dispatch('getParMenuCurId', this.parMenuCurId) // 初始游戏一级菜单
            this.allGameList.forEach((v, k) => {
                if(this.parMenuCurId == v.id) {
                    this.$store.dispatch('getCurGameList', v.children)  // 重置当前游戏列表
                }
            })
            // if(!i) { // 如果不传id
            //     this.allGameList.forEach((v, k) => {
            //         if(k == 0) {
            //             this.$store.dispatch('getParMenuCurId', v.id) // 初始游戏一级菜单
            //             this.$store.dispatch('getCurGameList', v.children)  // 重置当前游戏列表
            //         }
            //     })
            // } else {
            //     this.$store.dispatch('getParMenuCurId', i) // 初始游戏一级菜单
            //     this.allGameList.forEach((v, k) => {
            //         if(i == v.id) {
            //             this.$store.dispatch('getCurGameList', v.children)  // 重置当前游戏列表
            //         }
            //     })
            // }
        }
    },
    destroyed() { // 组件销毁时清除定时器
        window.clearInterval(this.getLotteryPoll)
    }
}
</script>

<!-- 添加“scoped”属性以仅将CSS限制为此组件 -->
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.content
    width 100%
    position fixed
    -webkit-overflow-scrolling touch
.hot-history
    // position absolute
    z-index 1
    width 100%
    // min-height calc(100vh - 1.17rem)
.v-enter,.v-leave-to
    opacity 0
    transform translateX(150px)

.v-enter-active,.v-leave-active
    transition all 0.5s ease
.vtouch
    overflow auto
    height 100vh
    position fixed
    bottom 0
    left 0
    right 0
    top 0rem
    background-color $tips-text-color
.addvtouch
    overflow auto
    height 100vh
    position fixed
    bottom 0
    left 0
    right 0
    top 0rem
    background-color $menu-bg-color
.memberheard
    // bottom 0
    // top 0
    // left 0
    // right 0
    // transition bottom 0.5s ease-in
    max-height calc(93vh - 1.2rem)!important
    padding-top 0.8rem
    overflow auto!important 
.quitSkipImg
    img
        width 100vh
        height 100vh
        position relative
        z-index 99999
</style>
