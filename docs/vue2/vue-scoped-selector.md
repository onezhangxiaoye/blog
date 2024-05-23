---
title: "Vue深度选择器"
date: 2021-01-18T13:39:51+08:00
lastmod: 2021-02-01T18:24:32+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
cover: /images/vue/vue2.jpg
categories:
  - Vue
tags:
  - Vue
---
  
# Vue深度选择器

当我们在使用第三方的UI库时，在某些情况下其样式可能无法满足我们的业务需求，我们需要对其样式做部分的调整。这时候就可能需要使用到`Vue`的`深度作用选择器`了。

<!--more-->
## 1 Vue 的 Scoped 和深度选择器
[官方文档-scoped-css](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#-scoped-css)

### 小笔记，摘抄自官方文档
> 深度作用选择器 `>>>` ,有些像 `Sass` 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

## 2 容易出错的情况
我们在使用`css`的选择器的时候，有时候为了能够更加准确的找到对应的`Dom`，经常会使用多层的选择器，如下，在我们需要调整`组件b`中`h1`的样式时：


``` html
<!-- 组件b -->
<template>
    <div class="component-b">
        <div class="component-b-a">
              <h1>AAAAAAAAA</h1>
        </div>
    </div>
</template>
```


``` html
<!-- 组件a -->
<template>
    <div class="component-a">
        <ComponentB />
    </div>
</template>

<style scoped>
    .component-a .component-b .component-b-a h1 {
        color: red;
    }
</style>
```
上面的代码在编译后生成的代码如下

```
.component-a .component-b .component-b-a h1[data-v-29337792] {
    color: red;
}
```

然而这样的css并没有产生预期的效果，这时候，可能就不清楚`/deep/`应该放到什么位置了，我们先来看一下不同`/deep/`的位置编译后的`css`代码是怎样的：

> 可能大家都会这样写

``` html
<style scoped>
    .component-a .component-b .component-b-a /deep/ h1 {
        color: red;
    }
</style>
```
### 实际编译后1


``` css
    .component-a .component-b .component-b-a[data-v-29337792] h1 {
        color: red;
    }
```
> 很明显，这样的Css也是无法达到预期的效果的


> 再移动一下`/deep/`的位置

``` html
<style scoped>
    .component-a .component-b/deep/ .component-b-a h1 {
        color: red;
    }
</style>
```
### 实际编译后2


``` css
    .component-a .component-b[data-v-29337792] .component-b-a h1 {
        color: red;
    }
```

> 再移动一下`/deep/`的位置

``` html
<style scoped>
    .component-a/deep/ .component-b .component-b-a h1 {
        color: red;
    }
</style>
```
### 实际编译后3


``` css
    .component-a[data-v-29337792] .component-b .component-b-a h1 {
        color: red;
    }
```

> 我们通过移动`/deep/`的位置，发现编译后的属性也在向前移动，实际上属性的位置其实就是 `/deep/`的位置，最后一次的代码，也是能够产生预期效果的样式



