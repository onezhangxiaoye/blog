<template>
  <div class="blogs">
    <div class="blogs-menu">
        <el-col>
            <el-menu
            default-active="0"
            class="el-menu-vertical-demo"
            background-color="transparent"
            @select="handleSelect"
            text-color="#000"
            active-text-color="#409EFF">
            <el-menu-item v-for="(BlogType,index) in BlogTypes" :index="index + ''" :key="index">
                <i class="el-icon-menu"></i>
                <span slot="title">{{BlogType.blogTypeTitle}}</span>
            </el-menu-item>
            </el-menu>
        </el-col>
    </div>
    <div class="blogs-list">
        <ul>
            <li v-for="blog in blogs" @click="toBlog(blog.blogId)">
                <div><img src="../assets/img/blog.png" alt=""></div>
                <div>
                    <h1>{{blog.blogTitle}}</h1>
                    <p>{{blog.blogContent}}</p>
                    <span>创建时间：{{blog.blogTimestamp}}</span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import {axiosPost} from '../utils/js/requestApi.js'
import MarkdownHtml from './MarkdownHtml'
export default {
  name: 'Blogs',
  data () {
    return {
      markdownText: '',
      blogs:[],
      BlogTypes:[]
    }
  },
  components:{
    MarkdownHtml
  },
  mounted() {
      axiosPost('/BlogsController/selectBlogsByUserId',{
        userId:3,
        blogTypeId:1,
      }).then(res => {
        if (res.status == 0) {
          this.blogs = res.data;
        }
      })
      axiosPost('/BlogTypeController/selectAll',{}).then(res => {
        if (res.status == 0) {
          this.BlogTypes = res.data;
        }
      })
  },
  methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      toBlog(blogFileName){
        console.log(1321312312);
        this.$router.push('/Blog/' + blogFileName)
      }
  },
}
</script>

<style lang='stylus' scoped>
.blogs
    display flex
    .blogs-menu
        width 165px
    .blogs-list
        width calc(100% - 165px)
        box-sizing border-box
    .el-menu-vertical-demo
        span
            font-weight 800
            font-size 20px
    .blogs-list
        font-weight 800
        font-size 18px
        li
            background-color #fff
            margin 20px
            border 2px solid #ccc
            border-radius 6px
            display flex
            cursor pointer
        li>:first-child
            flex 1
            img 
                max-width 128px
        li>:last-child
            flex 6
            position relative
            padding 0px 20px 40px 20px
            h1
                line-height 60px
            span 
                position absolute
                bottom 5px
                right 5px

</style>
