---
title: "手写VueDiff进行dom更新"
date: 2021-02-04T18:31:57+08:00
lastmod: 2021-02-04T18:31:57+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - Vue2.0
tags:
  - Vue2.0
  - Vue
---
  
# 手写vue-diff进行dom更新

看很多遍不如上手写一遍。

<!--more-->

## codepen 例子

[codepen传送门](https://codepen.io/onezhangxiaoye/pen/jOVbRYv)

<iframe height="360" style="width: 100%;" scrolling="no" title="手写Vue diff 进行 dom 更新" src="https://codepen.io/onezhangxiaoye/embed/jOVbRYv?height=272&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/onezhangxiaoye/pen/jOVbRYv'>手写Vue diff 进行 dom 更新</a> by zhangxiaoye
  (<a href='https://codepen.io/onezhangxiaoye'>@onezhangxiaoye</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 相关源码

::: details html 源码

``` html
<p>
    <label>
        <input onchange="tempChange(0)" type="radio" name="temp" checked />
    </label>
    默认：["<span style="color: #f44336;">#f44336</span>","<span style="color: #009688;">#009688</span>","<span style="color: #000000;">#000000</span>","<span style="color: #9C27B0;">#9C27B0</span>"]
</p>
<p>
    <label>
        <input onchange="tempChange(1)" type="radio" name="temp" />
    </label>
    倒序：["<span style="color: #9C27B0;">#9C27B0</span>","<span style="color: #000000;">#000000</span>","<span style="color: #009688;">#009688</span>","<span style="color: #f44336;">#f44336</span>"]
</p>
<p>
    <label>
        <input onchange="tempChange(2)" type="radio" name="temp" />
    </label>
    打乱：["<span style="color: #000000;">#000000</span>","<span style="color: #f44336;">#f44336</span>","<span style="color: #9C27B0;">#9C27B0</span>","<span style="color: #009688;">#009688</span>"]
</p>
<p>
    <label>
        <input onchange="tempChange(3)" type="radio" name="temp" />
    </label>
    清空：[]
</p>
<p>
    <label>
        <input onchange="tempChange(4)" type="radio" name="temp" />
    </label>
    移动+新增+删除：["<span style="color: #000000;">#000000</span>","<span style="color: #FF5722;">#FF5722</span>","<span style="color: #f44336;">#f44336</span>","<span style="color:#8BC34A;">#8BC34A</span>","<span style="color:#3F51B5;">#3F51B5</span>"]
</p>
<p>
    <label>
        <input onchange="tempChange(5)" type="radio" name="temp" />
    </label>
    新增：["<span style="color: #f44336;">#f44336</span>","<span style="color: #009688;">#009688</span>","<span style="color:#8BC34A;">#8BC34A</span>","<span style="color:#3F51B5;">#3F51B5</span>","<span style="color: #000000;">#000000</span>","<span style="color: #9C27B0;">#9C27B0</span>"]
</p>

<p>
    <label>
        <input onchange="tempChange(6)" type="radio" name="temp" />
    </label>
    移除：["<span style="color: #f44336;">#f44336</span>","<span style="color: #9C27B0;">#9C27B0</span>"]
</p>



<p>
    <label>
        <input id="data" style="width: 460px;" value='["#f44336","#009688","#000000","#9C27B0"]' type="text" onchange="inputChange(event)">
    </label>
    <button onclick="render()">渲染</button>
</p>
<div>
    <label>
        <input onchange="keyTypeChange(undefined)" name="key" type="radio" />
        不使用key
    </label>
    <label>
        <input onchange="keyTypeChange('index')" name="key" type="radio" />
        使用index-key
    </label>
    <label>
        <input onchange="keyTypeChange('only')" name="key" type="radio" checked />
        使用唯一-key
    </label>
</div>
<div>在渲染后的 input 中分别输入值，然后切换上面如何使用 key , 最后观察切换渲染数据后使用不同 key 带来的结果差异</div>
<div id="app">

</div>
```
:::

::: details js源码

``` js
let rootDom = document.querySelector("#app");
let keyType = 'only';
let tempValues = [
    '["#f44336","#009688","#000000","#9C27B0"]',
    '["#9C27B0","#000000","#009688","#f44336"]',
    '["#000000","#f44336","#9C27B0","#009688"]',
    '[]',
    '["#000000","#FF5722","#f44336","#8BC34A","#3F51B5"]',
    '["#f44336","#009688","#8BC34A","#3F51B5","#000000","#9C27B0"]',
    '["#f44336","#9C27B0"]',
]
let temp = tempValues[0];
let value = tempValues[0];
const input = document.querySelector('#data');

let preVnodes;

class Vnode {

    constructor(style, key, elm, tag = 'input') {
        this.style = style;
        this.key = key;
        this.tag = tag;
        this.elm = elm;
    }
}

const parentVnode = new Vnode(undefined, undefined, rootDom, 'div');

function keyTypeChange(type) {
    keyType = type;
}

function inputChange(event) {
    console.log(event)
    value = event.target.value;
}

function tempChange(index) {
    temp = tempValues[index];
    input.value = temp;
    value = temp;
}

function render() {
    let data;
    try {
        data = JSON.parse(value);
    } catch (e) {
        confirm("数据错误")
    }
    data = data || [];
    if(!data) return;
    if (Array.isArray(data)) {
        setState(data);
    } else {
        confirm("数据错误")
    }
}

function getKey(v, i) {
    switch (keyType) {
        case 'index':
            return i;
        case 'only':
            return v;
        default:
            return;
    }
}

function createElm(tag, style) {
    let elm = document.createElement(tag);
    for (const styleKey in style) {
        elm.style[styleKey] = style[styleKey];
    }
    return elm;
}

/**
 *
 * @param data {[string | number]}
 */
function setState(data) {
    let vnodes = data.map((v, i) => new Vnode({color: v, 'borderColor': v}, getKey(v, i)));
    if (preVnodes) {
        updateChildren(parentVnode, preVnodes, vnodes);
    } else {
        vnodes = vnodes.map(v => {
            v.elm = createElm(v.tag, v.style);
            return v;
        })
        preVnodes = vnodes;
        addNodes(parentVnode.elm, vnodes, 0, vnodes.length - 1, null);
    }
}

/**
 *
 * @param parentElm
 * @param vnodes {[Vnode]}
 * @param startIndex {number}
 * @param endIndex {number}
 * @param refChild
 */
function addNodes(parentElm, vnodes, startIndex, endIndex, refChild) {
    for (; startIndex <= endIndex; startIndex++) {
        if(!(vnodes[startIndex].elm)) {
            vnodes[startIndex].elm = createElm(vnodes[startIndex].tag, vnodes[startIndex].style);
        }
        parentElm.insertBefore(vnodes[startIndex].elm, refChild);
    }
}

/**
 *
 * @param parentElm
 * @param vnodes {[Vnode]}
 * @param startIndex {number}
 * @param endIndex {number}
 */
function removeNodes(parentElm, vnodes, startIndex, endIndex) {
    for (; startIndex <= endIndex; startIndex++) {
        if(vnodes[startIndex]) {
            parentElm.removeChild(vnodes[startIndex].elm);
        }
    }
}

/**
 *
 * @param a {Vnode}
 * @param b {Vnode}
 * @returns {boolean}
 */
function sameVnode(a, b) {
    return a.key === b.key && a.tag === b.tag;
}

/**
 *
 * @param parentVnode {Vnode}
 * @param oldVnodes {[Vnode]}
 * @param newVnodes {[Vnode]}
 */
function updateChildren(parentVnode, oldVnodes, newVnodes) {

    let oldStartIndex = 0;
    let oldEndIndex = oldVnodes.length - 1;
    let oldStartVnode = oldVnodes[0];
    let oldEndVnode = oldVnodes[oldEndIndex];

    let newStartIndex = 0;
    let newEndIndex = newVnodes.length - 1;
    let newStartVnode = newVnodes[0];
    let newEndVnode = newVnodes[newEndIndex];

    let keyIndexMap, findSameOldIdx;

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if(!oldStartVnode) {
            oldStartVnode = oldVnodes[++oldStartIndex];
        } else if (!oldEndVnode) {
            oldEndVnode = oldVnodes[--oldEndIndex];
        }else if (sameVnode(newStartVnode, oldStartVnode)) {
            patchVnode(newStartVnode, oldStartVnode);
            newStartVnode = newVnodes[++newStartIndex];
            oldStartVnode = oldVnodes[++oldStartIndex];
        } else if (sameVnode(newEndVnode, oldEndVnode)) {
            patchVnode(newEndVnode, oldEndVnode);
            newEndVnode = newVnodes[--newEndIndex];
            oldEndVnode = oldVnodes[--oldEndIndex];
        } else if (sameVnode(newStartVnode, oldEndVnode)) {
            patchVnode(newStartVnode, oldEndVnode);
            // 插入锚点 refChild 会始终再 oldStartVnode 的前面
            parentVnode.elm.insertBefore(newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newVnodes[++newStartIndex];
            oldEndVnode = oldVnodes[--oldEndIndex];
        } else if (sameVnode(newEndVnode, oldStartVnode)) {
            patchVnode(newEndVnode, oldStartVnode);
            parentVnode.elm.insertBefore(newEndVnode.elm, oldEndVnode.elm);
            newEndVnode = newVnodes[--newEndIndex];
            oldStartVnode = oldVnodes[++oldStartIndex];
        } else {
            // 查找 oldVnodes 中 与 newStartVnode 匹配的节点
            if (!keyIndexMap) {
                keyIndexMap = getOldVnodesKeyMap(oldVnodes)
            }
            // 这样写 和 源码比较起来就 low 了
            if(newStartVnode.key && newStartVnode.key in keyIndexMap) {
                findSameOldIdx = keyIndexMap[newStartVnode.key];
            }

            // 在 keyIndexMap 中没有找到匹配的 Vnode
            if(!findSameOldIdx) {
                findSameOldIdx = findIdxInOld(oldVnodes, oldStartIndex, oldEndIndex, newStartVnode)
            }
            if(findSameOldIdx) {
                if (sameVnode(newStartVnode, oldVnodes[findSameOldIdx])) {
                    patchVnode(newStartVnode, oldVnodes[findSameOldIdx]);
                    // 把匹配到的 dom 移动到 oldStartVnode 前
                    parentVnode.elm.insertBefore(newStartVnode.elm, oldStartVnode.elm);
                    oldVnodes[findSameOldIdx] = undefined;
                    newStartVnode = newVnodes[++newStartIndex];
                }
                // 这里不考虑 相同的 key 不同的 tag
                findSameOldIdx = undefined;

            } else { // 都没有找到 直接重新创建 新的节点 插入到 oldStartVnode 前
                newStartVnode.elm = createElm(newStartVnode.tag, newStartVnode.style)
                parentVnode.elm.insertBefore(newStartVnode.elm, oldStartVnode.elm);
                newStartVnode = newVnodes[++newStartIndex];
            }
        }
    }

    // 完成循环后 有可能存在 新节点 或者 就节点 存在部分Vnode 未遍历到

    //若旧节点的 oldStartIndex > oldEndIndex 则新节点可能部分未遍历到，这种情况下 会存在节点的新增
    if(oldStartIndex > oldEndIndex) {
        // 若 newEndIndex + 1 位置存在节点 插入节点的位置 就在这个 Vnode 所对应的真实节点前， 否则就在最后
        let refChild = newVnodes[newEndIndex + 1] ? newVnodes[newEndIndex + 1] .elm : null;
        addNodes(parentVnode.elm, newVnodes, newStartIndex, newEndIndex, refChild)
    } else if(newStartIndex > newEndIndex) {
        removeNodes(parentVnode.elm, oldVnodes, oldStartIndex, oldEndIndex);
    }

    preVnodes = newVnodes;
}

function findIdxInOld(oldVnodes, oldStartIndex, oldEndIndex, newVnode) {
    for (; oldStartIndex < oldEndIndex; oldStartIndex++) {
        if (oldVnodes[oldStartIndex] && sameVnode(oldVnodes[oldStartIndex], newVnode)) {
            return oldStartIndex;
        }
    }
}

/**
 *
 * @param oldVnodes {[Vnode]}
 */
function getOldVnodesKeyMap(oldVnodes) {
    let keyMap = {};
    for (let i = 0; i < oldVnodes.length; i++) {
        if(oldVnodes[i].key) {
            keyMap[oldVnodes[i].key] = i;
        }
    }
    return keyMap;
}

/**
 *
 * @param newVnode {Vnode}
 * @param oldVnode {Vnode}
 */
function patchVnode(newVnode, oldVnode) {
    let elm = newVnode.elm = oldVnode.elm;

    updateStyle(elm, newVnode.style);
}

function updateStyle(elm, style) {
    let elmStyle = elm.style;

    for (const styleKey in style) {
        if(styleKey in elmStyle) {
            elm.style[styleKey] = style[styleKey];
        } else {
            elm.style[styleKey] = '';
        }
    }
}
```
:::

::: details css源码

``` css
#app input{
  display: block;
  margin-top: 8px;
}
```
:::