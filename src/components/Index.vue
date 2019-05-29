<template>
  <div class="index">
    <header>
      <span>张小叶的BLOG</span>
      <a @click="write">写文章</a>
    </header>
    <div class="index-content">
        <router-view/>
    </div>
    <div v-if="scrollTop > 0" @click="toTop" class="to-top">
      <img src="../assets/img/top.png" alt="">
    </div>
  </div>
</template>

<script>
import Home from './Home'
export default {
  name: 'Index',
  components:{
    Home
  },
  data () {
    return {
      activeName: 'first',
      scrollTop:0
    }
  },
  mounted(){
    window.addEventListener('scroll', () => {
      //变量t是滚动条滚动时，距离顶部的距离
      this.scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    toTop(){
      window.scrollTo(0,0);
    },
    write(){
        this.$router.push('/BlogEdit')
    }
  },
}
</script>

<style lang='stylus' scope>
  .index
    margin 0 auto
    header 
        background-color #ccc
        padding 0 40px
        height 50px
        display flex
        align-items center
        justify-content space-between
        span,a
          font-weight 800
          font-size 40px
          cursor pointer
    .index-content
      padding 0 40px
    .to-top
      position fixed
      right 20px
      bottom 40px
      border 2px solid #000
      cursor pointer
      border-radius 12px
      transition border-radius .5s
      &:hover
        border-radius 0px
      img
        width 64px
</style>
