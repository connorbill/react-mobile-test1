<template lang="jade">
    #app
        .nav-content
            router-view // 路由
        //- 弹出框
        vue-alert(v-if="flag_alert == true")
            template(slot='alertTit', v-show="!alertTit") {{ alertTit }}
            template(slot='alertIcon', :class="alertIcon ? 'alertH17' : ''") 
                svg-icon.alert-icon(:icon-class="alertIcon", v-if='alertIcon != "goback"')
                //- img.alert-img(v-if='alertIcon == "goback"')
            template(slot='alertCon', :class="alertIcon ? 'alertH17' : ''") 
                .alert-con {{ alertCon }}
        div.bg(v-if="flag_alert == true")

</template>
<script>
import { getToken } from '@/utils/auth' // getToken from cookie
import header from "@/views/common/header";
import alert from '@/views/common/alert' // 弹出组件
import { mapState } from 'vuex';
export default {
    name: 'App',
    components:{
        'vue-alert': alert // 弹出组件
    },
    metaInfo: {
      meta: [
        // { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    },
    computed:{
        ...mapState({
            flag_homeData: state => state.home.flag_homeData, // 余额
            alertTit: state => state.home.alertTit,  // 弹出组件标题
            alertCon: state => state.home.alertCon,  // 弹出组件内容
            alertIcon: state => state.home.alertIcon, // 弹出组件图标
            flag_alert: state => state.home.flag_alert,  // 弹出蒙层组件
            tempMenu: state => state.home.tempMenu, // 显示菜单组件
        })
    },
    data() {
        return {
            getToken: false,
            urlName: "",
        }
    },
    mounted() {
        this.getTokenIcon()
        this.stopTouchendPropagationAfterScroll() // 在滚动时就给停止touchend事件冒泡
    },
    methods: {
        getTokenIcon() { // 判断是否登入
           if(getToken()) {
               this.getToken = true
           }
        },
        stopTouchendPropagationAfterScroll(){ // 在滚动时就给停止touchend事件冒泡
            var flag = false;
            window.addEventListener('touchmove', function(ev){
                flag || (flag = true, window.addEventListener('touchend', stopTouchendPropagation, true));
            }, false);
            function stopTouchendPropagation(ev){
                ev.stopPropagation();
                setTimeout(function(){
                    window.removeEventListener('touchend', stopTouchendPropagation, true);
                    flag = false;
                }, 50);
            }
        },
    }
}
</script>
<style lang="stylus">
@import "assets/stylus/base";
@import "assets/stylus/mint-ui";
#app
    padding 0rem
    width 100%
    height 100vh
    position relative
.nav-content
    width 100%
    -webkit-overflow-scrolling touch
    overflow hidden
    height 100vh
    position fixed
    bottom 0
    left 0
    right 0
    top 0rem
    background-color $tips-text-color
img.alert-img
    width 1rem
    height 1rem
    background-image url('./assets/images/home/goback.jpg')
    background-size 100%
    border-radius 50%
</style>
