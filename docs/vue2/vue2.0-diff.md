---
title: "Vue2.0-diff"
date: 2021-02-01T16:57:22+08:00
lastmod: 2021-02-01T18:24:32+08:00
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
  
# Vue2.0-diff

Vue diff 双端指针比较

<!--more-->

## 简易的逻辑图

![](/images/vue/diff.png)

## 对 diff 的理解
- `diff` 的每一轮比较都会顺序和交叉的比较，`首首、尾尾、首尾、尾首、查找(newStartVnode是否在oldCh存在相同节点)`
- 基础的`dom`,每一次`patchVnode`都是操作的`elm`
- 节点复用，实际是在`patchVnode`时，`var elm = vnode.elm = oldVnode.elm;`,直接使用了旧节点的dom，[相关源码](https://github.com/vuejs/vue/blob/dev/dist/vue.runtime.js#L6265)
- 每次找到可复用节点，但可复用节点所在指针位置不同时，都会在`patchVnode`后执行`insertBefore`，把新的`elm`插入到`parentElm`的对应位置，`insertBefore`会把存在的`dom`-`移动、移动、移动（重要的事情要说三遍😂）`到插入的位置，所以并不会出现移动后，再去移除原先位置的节点
## 节点新增、删除
- `新增节点`：`oldStartIdx > oldEndIdx`，旧节点的开始指针越过尾部指针
- `删除节点`：`newStartIdx > newEndIdx`，新节点的开始指针越过尾部指针

## 源码分析

``` javascript

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      // 初始化 指针的初始位置
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }
      // 循环检查 新旧节点中的可复用节点
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
		// - 检查 旧左指针节点(oldStartVnode) 是否 Undef
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	    // - 检查 旧右指针节点(oldEndVnode) 是否 Undef
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
		// - 检查 新旧左指针节点(oldStartVnode, newStartVnode) 是否为相同节点
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
		// - 检查 新旧右指针节点(oldStartVnode, newStartVnode) 是否为相同节点
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
		// - 检查 旧左、新右指针节点(oldStartVnode, newStartVnode) 是否为相同节点
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
		// - 检查 旧右、新左指针节点(oldStartVnode, newStartVnode) 是否为相同节点
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        // 当前面的判断都不满足时，处理新旧左节点
        } else {
		  // 生成 key => 数组index 的映射 用于 检查是否有可复用的节点
          if (isUndef(oldKeyToIdx)) { 
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); 
          }
          // 存在key则去map中直接查找对应的 index；不存在 则使用循环去查找对应的index
          // 循环查找 时未使用 数组的 findIndex 一是它属于es6的语法，2是当前的查找区间可以判定，而findIndex会遍历整个数组
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          // 若未在 旧节点中 未找可复用节点，直接重新创建节点，插入到指定位置
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            // 进行节点的移动
            vnodeToMove = oldCh[idxInOld];
            // 若找到了对应的节点，检查新旧两个节点是否未相同的节点
            // 是两个相同的节点,通过 patchVnode
            // var elm = vnode.elm = oldVnode.elm; 复用节点
            // 通过比对新旧节点数据，update elm;
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              // 把旧节点位置的数据置空，在后面指针移动时候，可以直接跳过
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      // 比较完成后 检查当前为插入节点 或者 移除节点
      if (oldStartIdx > oldEndIdx) {
        // refElm 在此节点前插入节点
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
        // https://github.com/vuejs/vue/blob/dev/dist/vue.runtime.js#L5693
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        // 
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }


```

## 如何判定为相同节点
- key相同、tag相同、都是注释节点、[data](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)状态保持一致、Input有相同的类型
> `data`大致是`createElement`的`数据对象`，还包含部分其他数据

```javascript
// 这样就会被认定为两个不相同的Vnode, 不建议不添加key
h('p', 'text');
h('p', {}, 'text');
```

[sameVnode源码](https://github.com/vuejs/vue/blob/dev/dist/vue.runtime.js#L5799)
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

