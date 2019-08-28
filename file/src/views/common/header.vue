<template lang="jade">
    header.header(:class="judgeBG()")
        div(class="ts-menu")
            vue-goBack
            vue-goHome
            ul.quick-menu
                li(v-for="item, index in menu", :key="index", :class="menuActive == item.id ? 'menu-active' : ''", @touchend.prevent="clickMenu(item.id, item.tempName)") {{ item.name }}
        img(src='../../assets/images/home/headerBG.png')
        div
            ul.par-menu(v-show="tempMenu == 'classGames'")
                li(v-for="list,index in parMenu", :key="index", :class="parMenuActiveId === index ? 'active': ''", @touchend.prevent="getDefaultMenu(list.pid, index)") {{ list.name }}
</template>
<script>
import { getToken } from '@/utils/auth' // getToken from cookie
// import { getSaverTime, gameHistoryList, gameMenuClass } from '@/api/home' // API
import { mapState } from 'vuex'
import goBack from "@/views/common/goBack" // 返回上一页
import goHome from "@/views/common/goHome" // 返回首页
import { clearInterval } from 'timers';
export default {
    name: "Index",
    components: {
        'vue-goBack': goBack, // 返回上一页
        'vue-goHome': goHome, // 返回首页
    },
    watch:{
        parMenuActiveId:{
            handler: function(newVal,oldVal) {
            }
        }
    },
    computed:{
        ...mapState({
            menu: state => state.home.menu, // 菜单
            menuActive: state => state.home.menuActive, // 当前菜单选中样式
            tempMenu: state => state.home.tempMenu, // 显示菜单组件
            parMenu: state => state.home.parMenu, // 获取父级菜单
            parMenuActiveId: state => state.home.parMenuActiveId, // 获取初始父级菜单key
            allGameList: state => state.home.allGameList, // 获取所有游戏列表
            hotGameList: state => state.home.hotGameList, // 获取推荐游戏列表
            historyGameList: state => state.home.historyGameList, // 获取历史游戏列表
            urlFrom: state => state.home.urlFrom, // 路径来自哪个 路由
            lotteryPoll: state => state.home.lotteryPoll, // 彩种定时任务
        })
    },
    data() {
        return {
        }
    },
    mounted(){
        // this.getSaverTime() // 获取服务器时间
        this.$store.dispatch('getTempMenu', 'hotGames')
    },
    methods: {
        judgeBG() {
            let arr = ['classGames']
            if(arr.includes(this.tempMenu) == true) {
                return 'class-bg'
            }
            if(this.tempMenu == 'memberCenter') {
                return 'home-bg'
            }
        },
        getDefaultMenu(i, index) { // i:父级菜单ID index:当前选中样式
            this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
            this.$store.dispatch('getParMenuCurId', i) // 初始游戏一级菜单
            this.$store.dispatch('getParMenuActiveId', index) // 初始游戏一级彩种
            this.allGameList.forEach((v, k) => {
                if(i == v.id) {
                    this.$store.dispatch('getCurGameList', v.children)  // 重置游戏列表
                    this.$router.push({name: 'home', query:{'id':2, 'temp':'classGames', 'from':'classGames', 'subId':index, 'parId':v.id}})
                }   
            });
        },
        clickMenu(id, t) { // 点击菜单 id: 菜单ID, t:模板名称
            this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
            if(t == 'classGames') { // 如果是分类，而路由需要加subId, parId
                window.clearInterval(this.lotteryPoll);
                this.$store.dispatch('getLotteryPoll', '')  // 重置定时任务
                this.$store.dispatch('getLotteryPoll', null)  // 重置定时任务
                this.$store.dispatch('getParMenuCurId', this.parMenu[0].pid) // 初始游戏一级菜单---手动默认初始数据
                this.$store.dispatch('getParMenuActiveId', 0) // 初始游戏一级彩种---手动默认初始数据
                this.allGameList.forEach((v, k) => {
                    if(k == 0) {
                        this.$store.dispatch('getCurGameList', v.children)  // 重置游戏列表
                    }   
                })
                this.$router.push({name: 'home', query:{'id':2, 'temp':'classGames', 'from':'classGames', 'subId':0, 'parId':this.parMenu[0].pid}})
            } else {
                if(t == 'hotGames') {
                    this.$store.dispatch('getCurGameList', this.hotGameList)  // 重置游戏列表
                }
                if(t == 'historyGames') {
                    this.$store.dispatch('getCurGameList', this.historyGameList)  // 重置游戏列表
                }
                this.$router.push({name: 'home', query:{'id':id, 'temp':t, 'from':t}})
            }
            this.$store.dispatch('getTempMenu', t)
            this.$store.dispatch('getMenuActive', id) // 当前选中菜单
        }
        
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.home-bg-pic
    // background-image url('../../assets/images/home/headerBG.png')
    // background-repeat no-repeat
    // background-position 0 -0.05rem
    // background-size 100% auto
    height 0.5rem
    width 100%
    border-top 0.02rem solid $menu-bg-color
.class-menu-bg
    background-color $allmenu-bg
.home-bg
    background $menu-bg-color
    height 0.6rem!important
    width 100%
.header
    z-index 99
    position fixed
    width 100%
    text-align center
    height 1.18rem
    -webkit-overflow-scrolling touch
    // background-image url('../../assets/images/home/headerBG.png')
    background-position 0 0.4rem
    background-size 100% auto
    background-repeat no-repeat
    .ts-menu  // 头部
        padding 0
        margin 0
        text-align center
        width 100%
        display flex
        flex-wrap wrap
        height 0.44rem
        line-height 0.44rem
        background-color $menu-bg-color
    // .company-name   // 名称
    //     width 1.2rem
    //     height 0.44rem
    // .logo-icon
    //     width 0.86rem
    //     height 0.44rem
    .quick-menu
        display flex
        flex-wrap wrap
        justify-content space-around
        flex-direction row
        width 2.21rem
        li
            font-size 0.17rem
            color $menu-font-color
            cursor pointer
            height 0.5rem
    img 
        position relative
        z-index -1
        height 0.4rem
        width 100%
.class-bg
    background-color $allmenu-bg
.menu-active
    background-image url('../../assets/images/home/menuCur.png')
    background-repeat no-repeat
    background-position center bottom
    background-size 46%
    font-weight bold
.par-menu
    position relative
    z-index 3
    display flex
    justify-content space-around
    flex-direction row
    text-align center
    flex-wrap wrap
    overflow auto
    width 3.65rem
    margin 0 auto
    // margin-top 0.4rem;
    -webkit-overflow-scrolling touch
    li
        cursor pointer
        padding 0px 0rem
        height 0.3rem
        line-height 0.3rem
        font-size 0.15rem
        color $menu-font-color-par
    .active
        color $menu-font-color-active
        font-weight bold
        font-size 0.17rem
</style>
