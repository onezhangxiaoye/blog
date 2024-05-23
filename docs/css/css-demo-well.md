---
title: "CSS能实现的高级玩意儿"
date: 2021-01-19T12:57:39+08:00
lastmod: 2021-02-25T09:23:36+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - Css
tags:
  - Css
  - 动画
---

# 用CSS能够实现一些你完全想不到的效果

<!--more-->

## 多样的border

### 可变长度的border

> 利用伪类 `:before` `:after`，放置在底部，悬浮调整其高宽,障眼法

参照[CSS 奇思妙想边框动画](https://juejin.cn/post/6918921604160290830)

[CodePen](https://codepen.io/onezhangxiaoye/pen/VwKROXx)

<div class="stacking-context">
    <div class="wonderful-css-border-1"></div>
</div>

<style>
    .stacking-context {
        position: relative;
        z-index: 0;
    }
    .wonderful-css-border-1 {
        height: 80px;
        width: 240px;
        background-color: red;
        margin: 30px;
        border: 2px solid #FFFFFF;
        position: relative;
    }
    .wonderful-css-border-1::before,.wonderful-css-border-1::after{
        content: '';
        display: block;
        height: 40%;
        width: 20%;
        position: absolute;
        z-index: -1;
        background-color: red;
        transition: all .5s;
        box-sizing: content-box;
    }
    .wonderful-css-border-1::before {
        left: -4px;
        top: -4px;
    }
    .wonderful-css-border-1::after {
        right: -4px;
        bottom: -4px;
    }
    .wonderful-css-border-1:hover::before, .wonderful-css-border-1:hover::after {
        height:  calc(100% + 8px);
        width: calc(100% + 8px);
    }
</style>
