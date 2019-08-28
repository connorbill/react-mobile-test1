<template lang="jade">
    .header-wrap
        .header
            vue-goBack
            //- span(class="goback", @click="goBack()")
            //-     svg-icon(icon-class="arrows-left")
            div {{ cname }}
            div(class="more", @touchend.prevent="more()", v-show="isAllMenu") {{ infoCurSubMenuName }}
        vue-allMenu(:class="showAllMenu ? 'show-allMenu' : 'hid-allMenu'")
        .bg(v-if="showBg", @touchend.prevent="close()")
</template>
<script>
import { getToken } from '@/utils/auth' // getToken from cookie
import { gameHotList, gameHistoryList } from '@/api/home' // API
import { mapState } from 'vuex'
import allMenu from '@/views/member/allMenu'  // 选择彩种
import { setTimeout } from 'timers';
import goBack from "@/views/common/goBack" // 返回上一页
export default {
    name: "Index",
    components: {
        'vue-allMenu': allMenu, // 选择彩种
        'vue-goBack': goBack, // 返回上一页
    },
    computed:{
        ...mapState({
            infoCurSubMenuName: state => state.home.infoCurSubMenuName, // 当前信息类二级菜单中文名
            curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
            showDataDialog: state => state.home.showDataDialog, // 是否显示时间选择框 true:显示， false:不显示
            showBg: state => state.home.showBg, // 背景层是否显示 true:显示， false:不显示
        })
    },
    data() {
        return {
            cname: '', // 中文名
            from: '', // 路径来自哪
            isAllMenu: true // 全部菜单是否显示 true:显示， false：不显示
        }
    },
    created() {

    },
    mounted() {
        this.cname = this.$route.query.temp, // 当前路径中文模板
        this.from = this.$route.query.from // 路径来自哪
        this.judgeAllMenu(this.cname) 
    },
    methods: {
        goBack() { // 返回上一页
            this.$router.back(-1)
        },
        judgeAllMenu(url) { // 判断是请求哪个接口 url: url名称
            switch(url){
                case '历史开奖':
                    this.isAllMenu = true
                    break;
                case '投注记录':
                    if(this.from == 'checkDetails') {
                        this.isAllMenu = false
                    } else {
                        this.isAllMenu = true
                    }
                    break;
                case '结算详情':
                    this.isAllMenu = false
                    break;
                default:
                    this.isAllMenu = true
                    break;
            }
        },
        more() { // 选择彩种
            this.$store.dispatch('getShowAllMenu', !this.showAllMenu) // 是否显示彩种选择 true:显示，false:不显示
            this.$store.dispatch('getShowBg', this.showAllMenu)
        },
        close() { // 关闭选择
            if(this.showAllMenu == true) { // 是否显示彩种选择 true:显示，false:不显示
                this.$store.dispatch('getShowAllMenu', false)
            }
            if(this.showDataDialog == true) { // 时间选择框 true:显示， false:不显示
                this.$store.dispatch('getShowDataDialog', false) 
            }
            this.$store.dispatch('getShowBg', false) // 背景层是否显示 true:显示， false:不显示
        }
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.header-wrap
    position relative
    z-index 10
.header
    position fixed
    top 0
    left 0
    width 100%
    line-height 0.44rem
    height 0.44rem
    background $menu-bg-color
    color $menu-font-color
    -webkit-overflow-scrolling touch
    div
        width 0.42rem
        font-size 0.2rem
        text-align center
        &:nth-child(1)
            position absolute
            left 0
            top 0
            svg 
                position relative
                top -0.02rem
        &:nth-child(2)
            font-size 0.188rem
            width 100%
            display block
            font-weight 700
        &:nth-child(3)
            font-size 0.14rem
            width auto
            position absolute
            right 0
            top 0
            text-align right
            padding-right 0.22rem
.show-allMenu
    bottom 0rem
    transition bottom 0.5s ease-in
    z-index 100
.hid-allMenu
    bottom -2.5rem
    transition bottom 0.5s ease-out
</style>
