---
title: "CSS渐变"
date: 2021-02-19T15:58:38+08:00
lastmod: 2021-02-19T15:58:38+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - Css
tags:
  - Css
---

# (重复) 线性/锥形/径向渐变 Demo

<!--more-->


## 线性渐变 linear-gradient

[MDN-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient())

[张鑫旭-gradient斜向线性渐变](https://www.zhangxinxu.com/wordpress/2013/09/%e6%b7%b1%e5%85%a5%e7%90%86%e8%a7%a3css3-gradient%e6%96%9c%e5%90%91%e7%ba%bf%e6%80%a7%e6%b8%90%e5%8f%98/)


### 线性渐变-demo

<div class="linear-gradient-demo"></div>

### 线性渐变-demo源码


``` html
<div class="linear-gradient-demo"></div>
<style>
  .linear-gradient-demo {
      height: 100px;
      background-image: linear-gradient(to right,blanchedalmond 20%, palegreen 30%, deepskyblue);
  }
</style>
```



## 重复线性渐变 repeating-linear-gradient
[MDN-repeating-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/repeating-linear-gradient())

### 重复线性渐变-demo
<div class="repeating-linear-gradient-demo"></div>

### 重复线性渐变-demo源码

``` html
<div class="repeating-linear-gradient-demo"></div>
<style>
  .repeating-linear-gradient-demo {
      height: 100px;
      --line-color: #AAA;
      background-image: repeating-linear-gradient(var(--line-color), var(--line-color) 1px, transparent 1px, transparent 10px),
      repeating-linear-gradient(to right , var(--line-color), var(--line-color) 1px, transparent 1px, transparent 10px);
  }
</style>
```

## 径向渐变 radial-gradient

[MDN-radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient())

[张鑫旭-10个demo示例学会CSS3 radial-gradient径向渐变](https://www.zhangxinxu.com/wordpress/2017/11/css3-radial-gradient-syntax-example/)


### 径向渐变-demo
<div class="radial-gradient-demo"></div>

### 径向渐变-demo源码

``` html
<div class="radial-gradient-demo"></div>
<style>
  .radial-gradient-demo {
      height: 100px;
      background-image: radial-gradient(circle at 10% 30% , gold 1%, deepskyblue 6%, deepskyblue 0%);
  }
</style>
```

## 重复径向渐变 repeating-radial-gradient

[MDN-repeating-radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/repeating-radial-gradient())

[张鑫旭-可重复径向渐变repeating-radial-gradient唱片效果](https://www.zhangxinxu.com/study/201711/radial-gradient-repeating.html)



### 重复径向渐变-demo
<div class="repeating-radial-gradient-demo"></div>

### 重复径向渐变-demo源码

``` html
<div class="repeating-radial-gradient-demo"></div>
<style>
  .repeating-radial-gradient-demo {
      --line-color: #AAA;
      height: 100px;
      background-image: repeating-radial-gradient(circle at 10% center, var(--line-color), var(--line-color) 1px, white 1px, white 10px);
  }
</style>
```

## 锥形渐变 conic-gradient
[MDN-conic-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/conic-gradient())

[张鑫旭-锥形渐变简介](https://www.zhangxinxu.com/wordpress/2020/04/css-conic-gradient/)

### 锥形渐变-demo

<div class="conic-gradient-demo"></div>

### 锥形渐变-demo源码

``` html
<div class="conic-gradient-demo"></div>
<style>
  .conic-gradient-demo {
      height: 100px;
      --line-color: #AAA;
      background-image: conic-gradient(var(--line-color) 25%, white 0deg 50%, var(--line-color) 0deg 75%, white 0deg);
      background-repeat: repeat;
      background-size: 20px 20px;
  }
</style>
```



## 重复锥形渐变 repeating-conic-gradient

[MDN-repeating-conic-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-conic-gradient())

### 锥形渐变-demo

<div class="repeating-conic-gradient-demo"></div>

### 锥形渐变-demo源码

``` html
<div class="repeating-conic-gradient-demo"></div>
<style>
  .repeating-conic-gradient-demo {
      height: 100px;
      background-image: repeating-conic-gradient(from 40deg at 10% center, deepskyblue 5%, palegreen 10%, aquamarine 15%, darkturquoise 20%);
  }
</style>
```
### 渐变的重复使用
在 `background-image` 中使用  `gradient` ，且可以重复多次使用，定义在前面的层级会比后面的更高

<div class="repeating-use-gradient"></div>

``` html
<div class="repeating-use-gradient"></div>
<style>
.repeating-use-gradient {
    height: 100px;
    background-image: radial-gradient(circle at center center, transparent 50%, #ffffff 50%, #ffffff 100%),
    linear-gradient(to right, #ff8d55, #fa4e42);
}
</style>
```

<style>
.linear-gradient-demo {
  height: 100px;
  background-image: linear-gradient(to right bottom,blanchedalmond 20%, palegreen 30%, deepskyblue);
}
.repeating-linear-gradient-demo {
  height: 100px;
  --line-color: #AAA;
  background-image: repeating-linear-gradient(var(--line-color), var(--line-color) 1px, transparent 1px, transparent 10px),
  repeating-linear-gradient(to right , var(--line-color), var(--line-color) 1px, transparent 1px, transparent 10px);
}
.radial-gradient-demo {
  height: 100px;
  background-image: radial-gradient(circle at 10% 30% , gold 1%, deepskyblue 6%, deepskyblue 0%);
}
.repeating-radial-gradient-demo {
  --line-color: #AAA;
  height: 100px;
  background-image: repeating-radial-gradient(circle at 10% center, var(--line-color), var(--line-color) 1px, white 1px, white 10px);
}
.conic-gradient-demo {
  height: 100px;
  --line-color: #AAA;
  background-image: conic-gradient(var(--line-color) 25%, white 0deg 50%, var(--line-color) 0deg 75%, white 0deg);
  background-repeat: repeat;
  background-size: 20px 20px;
}
.repeating-conic-gradient-demo {
  height: 100px;
  background-image: repeating-conic-gradient(from 40deg at 10% center, deepskyblue 5%, palegreen 10%, aquamarine 15%, darkturquoise 20%);
}
.repeating-use-gradient {
    height: 100px;
    background-image: radial-gradient(circle at center center, transparent 50%, #ffffff 50%, #ffffff 100%),
    linear-gradient(to right, #ff8d55, #fa4e42);
}
</style>
