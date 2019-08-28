<template lang="jade">
    .news-explain(:class="alertUrl && alertUrl.length > 0 ? '' : ''")
        .news-explain-box
            p.title(v-if="alertTit")
                slot(name="alertTit")
            .news-explain-content-box(:class="alertTit ? '' : 'alertH17'")
                .news-explain-content(:class="['news-' + alertClass, alertTit ? '' : 'alertH17']")
                    div
                        slot(name="alertIcon")
                        slot(name="alertCon")
        .btnGroup(v-if="alertBut == '退出'")
            button.confirm(v-if="alertShowConfirm", @touchend="clickBtn('confirm', alertUrl, alertBut,alertUrlyes)", :class="alertBut == '退出' ? '' : 'click-btn'") {{ alertBut }}
            button.cancel-btn(v-if="alertShowCancel", @touchend="clickBtn('cancel')", :class="alertBut == '退出' ? 'click-btn' : 'click-no'") 取消
        .btnGroup(v-else)
            button.cancel-btn(v-if="alertShowCancel", @touchend="clickBtn('cancel')", :class="alertBut == '退出' ? 'click-btn' : 'click-no'") 取消
            button.confirm(v-if="alertShowConfirm", @touchend="clickBtn('confirm', alertUrl, alertBut,alertUrlyes)", :class="alertBut == '退出' ? '' : 'click-btn'") {{ alertBut }}
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'Alert', //  弹出提示
    components: {

    },
    props: [],
    computed: {
        ...mapState({
            alertTit: state => state.home.alertTit,  // 弹出组件标题
            alertBut: state => state.home.alertBut,  // 弹出按扭名称
            alertUrlyes: state => state.home.alertUrlyes,  // 是否跳转商户连接
            alertShowConfirm: state => state.home.alertShowConfirm,  // 弹出 是否显示确认按钮
            alertShowCancel: state => state.home.alertShowCancel,  // 弹出 是否显示取消按钮
        }),
        alertClass: { // 对齐方式
            get() {
                return this.$store.state.home.alertClass
            }
        },
        alertUrl: { // 跳转连接
            get() {
                return this.$store.state.home.alertUrl
            }
        },
       
    },
    data() {
        return{
            btnColor:""
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        closeNews() { // 关闭当前窗口
            this.$store.dispatch('getFlagalert', false)
        },
        gotoUrl(url) { // 跳转连接
            var reURL = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
            if(url && url != '') {
                if(url.match(reURL)) {
                    window.location.href = url
                } else {
                    window.location.href = 'http://' + url
                }
                return
            }
            this.closeNews() // 关闭当前窗口
        },
        clickBtn(val, url, alertBut,alertUrlyes) { // 确认 / 取消
            this.closeNews() // 关闭当前窗口
            if(val == 'confirm' && alertUrlyes == 'yes' || alertBut == "退出") { // 如果是退出，与被动退出点确定的跳到相对应的url中，如果是后台其他报错则不做跳转
                if(url && url != '') {
                    this.gotoUrl(url) // 跳转url
                }
            }
        }
    },
    destroyed() { // 组件销毁时清除定时器

    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue"
.alert-icon
    width 0.75rem!important
    height 0.75rem!important
    background-size 100% auto
    background-repeat no-repeat
    display block
    margin 0 auto
    color $alert-but-font
.alert-con
    width 100%
    line-height 0.2rem
    height 0.2rem
    color $alert-font
    font-size 0.14rem
    margin-top 0.13rem
.click-btn
    color $menu-bg-color!important
.news-explain
    position fixed
    padding 0
    width 2.5rem
    height 1.8rem
    left 50%
    top 50%
    transform translate(-50%,-50%)
    z-index 100
    background $tips-text-color
    border-radius 0.07rem
    text-align center
    overflow hidden
    -webkit-overflow-scrolling touch
    .btnGroup
        display flex
        flex-direction row
        width 100%
        button
            //width 50%
            flex 1
            border-radius 0
            text-align center
            background-color $tips-text-color
            color $notarize-wager-scrollbar-bg
            line-height 0.4rem
            height 0.4rem
            border 0.01rem solid $odds-show
        button:last-child
            border-left none
    .cancel
        position absolute
        right 0.1rem
        top 0.05rem
        width 0.25rem
        height 0.25rem
        z-index 15
        cursor pointer
    .news-explain-box
        color $game-explain-color
        position relative
        z-index 12
        p.title
            height 0.3rem
            line-height 0.3rem
            text-align center
            background $hint-title-bg
            border-radius 0.05rem 0.05rem 0px 0px
            overflow hidden
            color $hint-title-color
        .news-explain-content-box
            padding 0 0.15rem
            height 1.4rem
            overflow auto
            &::-webkit-scrollbar
                width  0.06rem
            &::-webkit-scrollbar-thumb
                background-color transparent
                border-radius 0.03rem
            &::-webkit-scrollbar-track  /*滚动条里面轨道*/
                border-radius: 0.03rem
                background transparent
            &:hover
                &::-webkit-scrollbar-track  /*滚动条里面轨道*/
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
                &::-webkit-scrollbar-thumb
                    background-color $game-explain-scrollbar-bg
            .news-explain-content
                display block
                width 100%
                text-align center
                line-height 0.2rem
                margin auto
            .news-center
                display flex
                justify-content center
                align-items center
                height 1.4rem
.alertH17
    height 1.4rem!important
// .cancel-btn
//     color $alert-but-font!important
.click-no
    color $menu-font!important
#icon-warring
    width 0.5rem
    height 0.5rem
</style>
