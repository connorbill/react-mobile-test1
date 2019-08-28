<template lang="jade">
    .datewrap
        div.date-con(@touchend.prevent="getDataDialog", v-for="item,index in dateArrStore",:key="index", v-if="index == activeDate && curSubMenuId != 8")
            .date-cur
                span {{ item.year }} 年
                span {{ item.month }}月{{item.day}}日
                span {{ item.week }}
            .date-ico
                svg-icon(icon-class="arrows-down", :class="showDataDialog ? 'up' : 'down'")
        div.date-con(@touchend.prevent="getDataDialog", v-if="curSubMenuId == 8")
            .date-cur
                span {{ activeDate | filtrationActiveDate }}
            .date-ico
                svg-icon(icon-class="arrows-down", :class="showDataDialog ? 'up' : 'down'")
        vue-dataDialog(:class="showDataDialog && curSubMenuId != 8 ? 'show-datadialog' : 'hid-datadialog'")
        vue-hk-dataDialog(:class="hkShowDataDialog && curSubMenuId == 8 ? 'show-datadialog' : 'hid-datadialog'")
</template>
<script>
import { mapState } from 'vuex'
import dataDialog from '@/views/member/dataDialog'  // 时间选择
import hkDataDialog from '@/views/member/hkDataDialog'  // 香港彩时间选择
export default {
    name: "DateWrap",
    components: {
        "vue-dataDialog": dataDialog, // 时间选择
        "vue-hk-dataDialog": hkDataDialog, // 香港彩时间选择
    },
    computed:{
        ...mapState({
            showDataDialog: state => state.home.showDataDialog, // 是否显示时间选择框
            hkShowDataDialog: state => state.home.hkShowDataDialog, // 是否显示香港彩时间选择框
            dateArrStore: state => state.home.dateArrStore, // 最近10天
            activeDate: state => state.home.activeDate, // 选中日期
            curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
        })
    },
    data() {
        return {
            
        }
    },
    filters: {
        filtrationActiveDate(v) {
            v = v + ''
            switch (v) {
                case '0':
                    v = '近三周'
                    break;
                case '1':
                    v = '近一个月'
                    break;
                case '2':
                    v = '近三个月'
                    break;
                case '3':
                    v = '近六个月'
                    break;
                case '4':
                    v = '近十二个月'
                    break;
                default:
                    break;
            }
            return v
        }
    },
    created() {

    },
    mounted() {
    },
    methods: {
        getDataDialog() { // 时间弹出框
            if(this.curSubMenuId != 8) { // 当前子菜单id不为香港彩id
                this.$store.dispatch('getShowDataDialog', !this.showDataDialog) // 是否显示时间选择框
                this.$store.dispatch('getShowBg', this.showDataDialog) // 是否显示遮罩层
            }else {
                this.$store.dispatch("getHkShowDataDialog",true) // 是否显示时间选择框
                this.$store.dispatch('getShowBg', this.hkShowDataDialog) // 是否显示遮罩层
            }
            
        }
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.datewrap
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    text-align center
    align-items center
    width 2.1rem
    height 0.32rem
    line-height 0.32rem
    border 1px solid $odds-line
    border-radius 0.05rem
    color $menu-font
    padding 0rem
    margin 0px auto
    .date-con
        display flex
        flex-wrap wrap
        justify-content space-around
        flex-direction row
        text-align center
        align-items center
        width 2rem
        line-height 0.2rem
        .date-cur
            width 1.7rem
            span
                display inline-block
                padding 0 0.02rem
                font-size 0.15rem
        .date-ico
            line-height 0.2rem 
            .svg-icon
                width 0.15rem
                height 0.15rem
                margin-top 0.05rem
                margin-right 0.03rem
.up
    transform rotate(180deg);
    transition transform 300ms ease 0s
.down
    transform rotate(0deg);
    transition transform 300ms ease 0s
.show-datadialog
    visibility visible!important
    opacity 1!important
    transition opacity 0.3s ease-in
.hid-datadialog
    visibility hidden!important
    opacity 0
    transition opacity 0.3s ease-out
</style>
