<template>
  <div class="blogs">
    <div class="blogs-menu" v-if="innerWidth > 800">
        <el-col>
            <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="transparent"
            @select="handleSelect"
            text-color="#000"
            active-text-color="#409EFF">
            <el-menu-item v-for="blogType in blogTypes" :index="blogType.blogTypeId + ''" :key="blogType.blogTypeId">
                <i class="el-icon-menu"></i>
                <span slot="title">{{blogType.blogTypeTitle}}</span>
            </el-menu-item>
            </el-menu>
        </el-col>
    </div>
    <el-tabs v-else v-model="activeName" @tab-click="handleClick" class="tab">
      <el-tab-pane 
        v-for="blogType in blogTypes" 
        :label="blogType.blogTypeTitle" 
        :name="blogType.blogTypeId + ''"
        :key="blogType.blogTypeId"
      ></el-tab-pane>
    </el-tabs>
    <div class="blogs-list">
        <ul>
            <li v-for="blog in blogs" @click="toBlog(blog.blogId)">
                <img src="../assets/img/blog.png" alt="">
                <div>
                    <h2>{{blog.blogTitle}}</h2>
                    <p>{{blog.blogContent}}</p>
                    <span>{{blog.blogTimestamp}}</span>
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
      blogTypes:[],
      innerWidth:0,
      activeName:''
    }
  },
  components:{
    MarkdownHtml
  },
  mounted() {
      this.innerWidth = document.body.clientWidth;

      window.addEventListener('resize',(e) => {
        this.innerWidth = e.target.innerWidth;
      })

      this.selectBlogs(1);
      axiosPost('/BlogTypeController/selectAll',{}).then(res => {
        if (res.status == 0) {
          this.blogTypes = res.data;
          this.activeName = res.data[0].blogTypeId + '';
          localStorage.setItem('blogTypes',JSON.stringify(res.data));
        }
      })
  },
  methods: {
      handleSelect(key, keyPath) {
        this.selectBlogs(key);
      },
      toBlog(blogFileName){
        this.$router.push('/Blog/' + blogFileName)
      },
      handleClick(){
        this.selectBlogs(this.activeName);
      },
      selectBlogs(blogTypeId){
        axiosPost('/BlogsController/selectBlogsByUserId',{
          userId:3,
          blogTypeId:blogTypeId,
        }).then(res => {
          if (res.status == 0) {
            this.blogs = res.data;
          }
        })
      }
  },
}
</script>

<style lang='stylus' scoped>
.blogs
    .blogs-menu
        width 165px
    .blogs-list
        li
            background-color #fff
            margin 20px
            border 2px solid #ccc
            border-radius 6px
            cursor pointer
            transition border-color .5s
            overflow hidden
            &:hover 
              border-color #409EFF
            img 
                max-width 128px
                float left
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
// 宽度大于 800px
@media screen and (min-width 800px)
  .blogs
    display flex
    padding 0 40px
    .blogs-list
        width calc(100% - 165px)
        box-sizing border-box
</style>
