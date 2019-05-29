<template>
  <div class="home">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
      <el-tab-pane label="首页" name="first">
        <blogs></blogs>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs> -->
    <blogs></blogs>
  </div>
</template>

<script>
import Blogs from './Blogs'
export default {
  name: 'Home',
  components:{
    Blogs
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
}
</script>

<style lang='stylus' scope>
  .home
    margin 0 auto
// 宽度大于 450px
@media screen and (min-width 450px)
  .tab
    padding 0 40px
</style>
