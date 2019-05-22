<template>
  <div class="hello">
    <div class="hello-head">
      <el-button type="primary" :loading="true">发布文章</el-button>
    </div>
    <div class="marked-body">
      <div>
        <ul>
          <li><a @click="edit(0)"></a></li>
          <li><a @click="edit(1)"></a></li>
          <li><a @click="dialogVisible = true"></a></li>
          <li><a @click="edit(3)"></a></li>
        </ul>
      </div>
      <div>
        <div>
          <textarea 
            name="markdown2" 
            ref="markdown_textarea"
            @input="textareaFocus"
            @click="textareaFocus"
            @select="textareaFocus"
            id="markdown_textarea" 
            v-model="markdownText"
          ></textarea>
        </div>
        <div>
          <div class="marked" v-html="msg" id="marked"></div>
        </div>
      </div>  
    </div>
  <el-dialog
    title="图片上传"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <el-upload
      class="upload-demo"
      ref="upload"
      :multiple="false"
      :on-success='fileUploadSuccess'
      :before-upload="beforeAvatarUpload"
      action="http://47.105.161.197:8123/FileController/onefileUpload"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
    </el-upload>
  </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import hljs from 'highlight.js'
import marked from 'marked'
import {markdown} from 'markdown'
import {axiosPost} from '../utils/js/requestApi.js'
import baseData from '../utils/js/baseData.js'
// import {ElDialog} from 'element-ui'
export default {
  name: 'HelloWorld',

  data () {
    return {
      markdownText: '123456789',
      filesrc:'',
      fileList:[],
      selectionStart: 0,
      selectionEnd: 0,
      dialogVisible:false
    }
  },
  mounted() {
      this.markdown()
  },
  computed: {
      msg(){
          let markedHtml = marked( this.markdownText ,{ sanitize: true });
          // let markedHtml = markdown.toHTML( this.markdownText);
          setTimeout(() => {
            let blocks = document.getElementById('marked').querySelectorAll('pre code');
            blocks.forEach((block)=>{
              hljs.highlightBlock(block)
            })
          }, 100);
          return markedHtml;
      }
  },
  methods: {
    /**
     * 配置markdown
     */
      markdown() {
          marked.setOptions({
              renderer: new marked.Renderer(),
              gfm: true,
              tables: true,
              breaks: true,
              pedantic: false,
              sanitize: false,
              smartLists: true,
              smartypants: false
          });
      },
      /**
       * 监听图片上传 用户预览上传图片
       */
      fileInput(e){
        let file = e.target.files[0];
        let arr = ['png','jpg','gif','jpeg',]
        //图片不能大于 2MB
        if (file.size > 1024*1024*2) {
          this.$message.warning('图片不能大于 2MB！');
          return;
        }else if(arr.some(item => item == file.type)){
          this.$message.warning('文件格式错误！');
          return;
        }
        this.file = file;
        if(window.FileReader) {
          var fr = new FileReader();
          fr.onloadend = (even) => {
            this.filesrc = even.target.result;
          }
          fr.readAsDataURL(this.file);
        }
      },
      /**
       * 上传文件
       */
      upload(){
        axiosPost('/FileController/onefileUpload',{
          file:this.file
        }).then(res => {
          
        })
      },
      /**
       * 用于监听  textarea 的点击事件 及 输入事件
       */
      textareaFocus(e){
        const {selectionEnd,selectionStart} = e.target;
        this.selectionStart = selectionStart;
        this.selectionEnd = selectionEnd;
      },
      /**
       * 文件上传的回调
       */
      submitUpload(){
        this.$refs.upload.submit();
      },
      /**
       * 文件上传之前得钩子
       */
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 jpg/png/gif 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      /**
       * 文件上传成功得回调
       */
      fileUploadSuccess(response, file, fileList){

        if (response.status == 0) {
          let imgUrl = '![123213](' + baseData.imgPath + response.data.imgName + ')';
          this.$message.warning('上传成功！');
          this.$refs.upload.clearFiles();
          let value = this.markdownText;
          let chooseStr1 = value.substring( 0,this.selectionStart);
          let chooseStr2 = value.substring( this.selectionEnd);
          this.markdownText = chooseStr1 + imgUrl + chooseStr2;
          this.dialogVisible = false;
        }else{
          this.$message.warning('上传图片出错！');
        }
      },
      /**
       * 
       * @param {Number} editType  编辑类型 0加粗 1斜体 2图片插入
       */
      edit(editType){
        let {markdownText,selectionStart,selectionEnd} = this;
        //获取 0~起始选中文字 的文本内容
        let chooseStr1 = markdownText.substring( 0,selectionStart);
        //获取选中位置末到 文本末的 文本内容
        let chooseStr2 = markdownText.substring( selectionEnd);
        //获取 选中文字 的文本内容
        let chooseStr3 = markdownText.substring( selectionStart,selectionEnd);
        //获取选中初始位置-2 ~ 选中末位置+2 的文本内容
        let chooseStr4 = markdownText.substring( selectionStart - 2,selectionEnd + 2);
        let len1 = chooseStr1.length;
        let str,str1,str2;
        var _this = this;
        function name(_str) {
          let num = _str.length;
          if (selectionStart === selectionEnd) {
            _this.markdownText =  chooseStr1 + _str + '待编辑文本' + _str + chooseStr2;
          }else{          
            str = _str + chooseStr3 + _str;
            if (str === chooseStr4) {
              _this.markdownText = chooseStr1.substring(0,len1 - num) + chooseStr3 + chooseStr2.substring(num);
              selectionStart = selectionStart - num;
              selectionEnd = selectionEnd - num;
            }else{
              _this.markdownText = chooseStr1 + _str + chooseStr3 + _str + chooseStr2;
              selectionStart = selectionStart + num;
              selectionEnd = selectionEnd + num;
            }
          }
        }
        switch (editType) {
          case 0:{
            name('**');
            break;
          }
          case 1:{
            if (selectionStart === selectionEnd) {
              this.markdownText =  chooseStr1 + '*待编辑文本*' + chooseStr2;
              break;
            }
            //获取选中初始位置-3 ~ 选中末位置+1 的文本内容
            let chooseStr5 = markdownText.substring( selectionStart - 3,selectionEnd + 3);
            //获取选中初始位置-1 ~ 选中末位置+1 的文本内容
            let chooseStr6 = markdownText.substring( selectionStart - 1,selectionEnd + 1);
            let chooseStr7 = markdownText.substring( selectionStart - 2,selectionEnd + 2);

            str = '***' + chooseStr3 + '***';
            str1 = '**' + chooseStr3 + '**';
            str2 = '*' + chooseStr3 + '*';
            if (str === chooseStr5 || str2 === chooseStr6 && str1 !== chooseStr7) {
              this.markdownText = chooseStr1.substring(0,len1 - 1) + chooseStr3 + chooseStr2.substring(1);
              selectionStart = selectionStart - 1;
              selectionEnd = selectionEnd - 1;
            }else{
              this.markdownText = chooseStr1 + '*' + chooseStr3 + '*' + chooseStr2;
              selectionStart = selectionStart + 1;
              selectionEnd = selectionEnd + 1;
            }
            break;
          }
          case 3:{
            name('```');
            break;
          }
        }
        this.selectionStart = selectionStart;
        this.selectionEnd = selectionEnd;
        const ref_markdown_textarea = this.$refs.markdown_textarea;
        ref_markdown_textarea.blur();
        //延迟设置 文本的选中
        setTimeout(() => {
          ref_markdown_textarea.selectionStart = selectionStart;
          ref_markdown_textarea.selectionEnd = selectionEnd;
          ref_markdown_textarea.focus();
        }, 100);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="stylus">
.hello
  height: 100vh
  margin 0 20px
  .hello-head
    height: 100px
    img
      width: 60px
  .marked-body
    height: calc(100% - 100px)
    padding-bottom 10px
    box-sizing border-box
    overflow: hidden
    >:first-child
      height 30px
      border: 1px solid #ccc
      border-bottom none
      ul
        height 100%
        display flex
        align-items center
        li
          height 100%
          display flex
          align-items center
          justify-content center
          width 30px
          margin 0 5px
          background-color #ffffff
          transition background-color .5s
          a
            display inline-block
            height 16px
            width  20px
            background-repeat no-repeat
            cursor pointer
        li:hover
          background-color #ccc
        li:nth-child(1)
          a
            background-image url('../assets/bianji/B.png') 
        li:nth-child(2)
          a
            background-image url('../assets/bianji/I.png')
        li:nth-child(3)
          a
            background-image url('../assets/bianji/img.png')
        li:nth-child(4)
          a
            background-image url('../assets/bianji/dm.png')
    >:last-child
      height calc(100% - 30px)
      >div
        width: 50%
        float: left
        height: 100%
        box-sizing: border-box
        border: 1px solid #ccc
      textarea,.marked
        resize:none
        width: 100%
        height: 100%
        border none
      .marked
        padding: 10px
        overflow: auto
        blockquote
          border-left: 2px solid #009A61
          padding: 20px 0 20px 10px
          margin: 10px 0
        ul
          padding-left: 10px
        pre
          margin: 10px 0
        img 
          width 100%
</style>
