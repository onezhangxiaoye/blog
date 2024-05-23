---
title: "Vue Key不写或者使用index"
date: 2021-02-04T00:11:45+08:00
lastmod: 2021-02-04T09:22:36+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - Vue2.0
tags:
  - Vue
  - Vue2.0
---

# vue Key不写或者使用index

在`Vue`中使用循环时，为什么要使用`key`[官方文档](https://cn.vuejs.org/v2/api/#key)，但是很多时候，我们发现即使不使用`key`也不会导致任何异常。现在通过源码，我们来实验在什么情况下`不使用key`或者`使用数组下标为key`会导致渲染不符合预期。

<!--more-->

## key的作用
官方文档中说明了，`key` 是特殊的 `attribute`， 主要用在 `Vue` 的虚拟 `DOM` 算法，在新旧 `nodes` 对比时辨识 `VNodes`，从而进行`Dom`的复用。

## html 对应 的 Vnode

```html
<li> 小白菜 <input /> </li>

{
  tag: 'li',
  children: [
    {tag: undefined, text: '小白菜'},
    {tag: 'input', text: undefined},
  ]
}

```


## 新旧nodes的对比

```javascript
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
- 由上面代码可以了解到，在判断是否是相同 `vdom` 时，最先判断的就是是否存在相同的 `key` ，当然，假若 `key` 都是 `undefined` 条件也是可以成立的。
- 通常会在循环组件时使用 `key` ，一般 `key` 会使用数据的唯一值，在某些情况下我们也会使用 `index` 作为 `key` 。
- 很多文章都提到过关于 `Vue` 的 `key` ,说到 `key` 需要使用唯一的值，但是其实在实际项目中，经常会使用到 `index` 来作为 `key` ，而且基本上也没有出现什么问题，

> 接下来实验在什么情况下，使用 `index` 作为 `key` 和不使用 `key` 会导致更新异常，并且结合源码分析具体更新异常的原因。

## 例子代码
[codepen传送门](https://codepen.io/onezhangxiaoye/pen/NWbqddg)

<iframe height="320" style="width: 100%;" scrolling="no" title="Vue key test" src="https://codepen.io/onezhangxiaoye/embed/NWbqddg?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/onezhangxiaoye/pen/NWbqddg'>Vue key test</a> by zhangxiaoye
  (<a href='https://codepen.io/onezhangxiaoye'>@onezhangxiaoye</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## patchVnode
在经过 `diff` 查找到相同的 `vdom` 之后，就需要 `patchVnode` 进行 `vdom` 和 `elm` 的更新了，先帖上 `patchVnode` 的源码。移除了部分代码


``` javascript
function patchVnode (oldVnode,vnode,
      insertedVnodeQueue,ownerArray,
      index,removeOnly
    ) {
      if (oldVnode === vnode) {return}
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }
      // 复用了oldVnode的elm
      var elm = vnode.elm = oldVnode.elm;
      
      // .....此处移除部分代码....
      
      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        // 更新操作---更新操作---更新操作
        for (i = 0; i < cbs.update.length; ++i) { 
          cbs.update[i](oldVnode, vnode); 
        }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      // 不是文本节点 更新 子节点
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          // 存在子节点 更新子节点 这里又走到了 diff 那边的逻辑
          if (oldCh !== ch) { 
            updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); 
            }
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      // 是文本节点 直接重新设置文本
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }
```

## 循环 li 不使用 key

![](https://static01.imgkr.com/temp/4ff4048b40524e9696414778496ede69.gif)

1. 不使用 `key` ，然后把 list 倒转
2. 在 `diff` 中 会判断新旧节点的第一个为相同的节点 `key` 都是 `undefined` ，`tag` 相同...
3. `patchVnode` ，这里会进入下面的代码中，更新如下内容：
>  updateAttrs, updateClass, updateDOMListeners, updateDOMProps, updateStyle, update, updateDirectives,

```javascript
if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { 
        cbs.update[i](oldVnode, vnode); 
      }
      if (isDef(i = data.hook) && isDef(i = i.update)) { 
        i(oldVnode, vnode); 
      }
}
```
4. 虽然新旧的 `vdom` 的背景色不一致，但在复用了 `elm` 之后，又对 `elm` 进行了更新，所以并不会出现更新之后背景色不会更新

## 循环input不使用key
![](/images/vue/循环input不使用key.gif)

## 循环input使用index-key
![](/images/vue/循环input使用index-key.gif)

## 循环input使用唯一-key
![](/images/vue/循环input使用唯一-key.gif)

当循环 `input` 时，在不使用 `key` 或者 使用数组的 `index` 作为 `key` 的时候，前面的文本可以成功更新，但是 `input` 的更新就出现了问题，填写的内容并没有并没有切换过去，当使用了 `key` 之后，`input` 中填写的内容也进行也切换了过去。

> 情况1：不使用 `key` 或者 使用数组的 `index` 作为 `key`

1. `sameVnode` 会把新旧第一个 `vnode` 看作相同的 `vnode`
2. `patchVnode` 时，先更新 `li` ，再 `updateChildren` `文本节点` 和 `input`
3. 先找到 `文本节点` ，然后更新成功
4. 再找到了 `input` 的 `Vnode` ,这里没有 `key` 但是 `tag` 是一致的 认定为相同的节点，复用旧的 `elm`
5. 更新 `input`，对 `dom` 的更新值会涉及到 `class、style、listeners` 但是并不会去更新 `input` 的 `value`，**`所以在更新完成后，输入框的内容并不会改变`**

> 情况2：循环input使用唯一-key

1. `sameVnode` 会把 `新的第一个vnode` 和 `旧的最后一个vnode`  看作相同的 `vnode`
2. 后面的跟新步骤和上述前面的就是差不多了，主要是在第一步的时候，由于 `使用了唯一的key` ，找到了预期的需要复用的那个 `Vnode`

## 循环组件
`循环组件` 和上面的 `循环输入框` 其实是类似的。有点不同的是，是在更新完父组件的状态后，再进行更新的子组件。由于每个组件内部都会保存本身独特的数据，若未使用 `唯一的key` ，就会导致在父组件的 `Vnode` 进行比较时，匹配到的相同的 `Vnode` 就是非预期的。这种情况，可以简单的理解为，只是单纯的修改了循环的每个组件的 `props` ，而未对组件的顺序进行数据修改后的重新排序

