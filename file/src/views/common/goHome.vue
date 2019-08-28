<template lang="jade">
    .goHome
        div.company-name
            svg-icon.logo-icon(icon-class="logo1",@click="goHome")
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "goHome", // 返回首页
    computed:{
        ...mapState({
            hotGameList: state => state.home.hotGameList, // 获取推荐游戏列表
        })
    },
    data() {
        return {
        }
    },
    methods: {
        goHome() {
            this.$store.dispatch('getCurGameList', this.hotGameList)  // 重置推荐记录游戏列表
            this.$store.dispatch('getMenuActive', 1) // 当前选中菜单  
            this.$router.push({name: 'home', query:{'id':1, 'temp':'hotGames'}})
            this.$store.dispatch('getTempMenu', 'hotGames')
            this.$store.dispatch('getMenuActive', 1) // 当前选中菜单
        }
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.company-name   // 名称
    width 1.2rem!important
    height 0.44rem!important
.logo-icon
    width 0.86rem!important
    height 0.44rem!important
</style>