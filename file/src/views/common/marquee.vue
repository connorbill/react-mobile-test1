<template lang="jade">
    .marque-wrap
        .marque-left
            svg-icon(icon-class ="voice")
        .marque-right
            .box(ref='box', :style="{transform:'translateX(' + distance + 'px)'}")
                .marquee(ref='marquee') {{ text }}
                div {{ copyText }}
</template>

<script>
import {mapState} from 'vuex'
    export default {
        name: "playMsg",
        data() {
            return {
                text: '公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息公告消息',
                copyText:'',
                width:200,
                distance:0,
                setInter:''
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.setInter = setInterval(() => {
                    this.move();
                },20)
            })
        },
        methods:{
            move () {
                 this.$nextTick(() => {
                    // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
                    this.copyText = this.text; // 文字副本填充
                    //设置位移
                    this.width = this.$refs.marquee.clientWidth + 16;

                    this.distance = this.distance - 1;
                    // 如果位移超过文字宽度，则回到起点
                    if (this.distance <= -(this.width)) {
                        this.distance = 1
                    }
                })
            }
        },
        // 更新的时候运动
        updated() {

        },
        destroyed() {
            clearInterval(this.setInter) // 清除定时器
        }
    }
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.marque-wrap{
    // width 3.55rem
    // margin auto
    display flex 
    flex-direction row
    line-height 0.2rem
	height: 0.2rem;
	background-color: #32374a;

    // background-color $main-msg-color 
    color $head-font-color
}
.marque-left
    overflow hidden
    width 0.4rem
    text-align center
    line-height 0.2rem
    .svg-icon
        width 0.115rem
        height 0.115rem
.marque-right
    overflow: hidden
    width 3rem
.box
    width 80000%
.box div
    float left
.marquee
    margin 0 16px 0 0
</style>