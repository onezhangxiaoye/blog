<template>
  <div 
    id="app"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {isPC} from './utils/js/commonUtils'
import {createCanvas} from './utils/bgcanvas/circleLine.js'
export default {
  name: 'App',
  data() {
    return {
      loading:true
    }
  },
  mounted(){
    //创建背景
    const type = navigator.userAgent;
    if (isPC()) {
        createCanvas();
    }
    this.$nextTick(() => {
      console.log('------');
      this.loading = false;
    })
  }
}
</script>

<style lang="stylus">
#app
  background-color rgba(238, 238, 238, .5)
</style>
