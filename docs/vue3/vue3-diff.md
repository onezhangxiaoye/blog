# vue3 diif
## 对 vue3 diif 流程理解

- 设置三个指针数组的起始下标 `i`、新数组的结束下标 `e1` 、旧数组的结束下标 `e2`
- 顺序比较新旧起始节点，相同则更新 `i++` ，不同则退出
- 倒序比较新旧结束节点，相同则更新 `e1--` ，不同则退出 `e2--`
- 若 `i > e1` 则表明所有旧的节点已经更新完成，需要把新数组剩下的节点插入进去
- 若 `i > e2` 则表明所有新的节点都已更新完成，旧的数组中剩下的节点需要被删除
- 若上述条件都不满足，则进入通用更新
    - 生成  `keyToNewIndexMap` 新节点 `key -> index` 的 `map`
    - 遍历剩下的旧数组，并在 `keyToNewIndexMap` 中检查是否能找到相同 `key` 的节点，有则更新，没有则移除当前节点
        - `newIndexToOldIndexMap` 缓存 `新节点下标 -> 旧节点下标` 的 `map`
        - `maxNewIndexSoFar` 缓存上一次更新节点在新数组中的下标，因为是从小到大遍历的，若下一次更新的节点的下标比这个值小，则表明前后节点的顺序是相反的，此时会设置 `moved = true` 表明 `dom` 需要移动
    - 当 `moved === true` 时候计算 `newIndexToOldIndexMap` 的 **`最长递增子序列：increasingNewIndexSequence`**
        - 这里的 **`最长递增子序列`** 返回的是新节点最长的那一段的下标数组
        - 这是为了保证在移动节点时候，**`最长递增子序列`** 的那部分节点是可以不移动的，这样就减少了 `dom` 的操作量
    - 倒序遍历剩下的新节点
        - 把当前节点的后一个节点作为 `anchor(锚点)`
            - 在 `dom` 操作的 `api` 中有一个 [insertBefore](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore) 是向提供的 `dom` 前插入节点，若为 `null` 则插入到最后
        - 若当前节点 `newIndexToOldIndexMap[i] === 0` 则表明当前节点在旧节点中不存在，需要新增节点
        - 否则，若当前节点需要移动 `moved === true`
            - 若当前节点不在 `increasingNewIndexSequence` 中，则进行节点移动

## isSameVNodeType 是否为相同的节点

``` javascript
function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 /* ShapeFlags.COMPONENT */ && hmrDirtyComponents.has(n2.type)) {
        // #7042, ensure the vnode being unmounted during HMR
        // bitwise operations to remove keep alive flags
        n1.shapeFlag &= ~256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */;
        n2.shapeFlag &= ~512 /* ShapeFlags.COMPONENT_KEPT_ALIVE */;
        // HMR only: if the component has been hot-updated, force a reload.
        return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
}
```

## diff

``` javascript
// 源码位置 vue3.runtime.esm-browser.js
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1; // prev ending index
    let e2 = l2 - 1; // next ending index
    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = (c2[i] = optimized
            ? cloneIfMounted(c2[i])
            : normalizeVNode(c2[i]));
        if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
            break;
        }
        i++;
    }
    // 2. sync from end
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = (c2[e2] = optimized
            ? cloneIfMounted(c2[e2])
            : normalizeVNode(c2[e2]));
        if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
            break;
        }
        e1--;
        e2--;
    }
    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
        if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
                patch(null, (c2[i] = optimized
                    ? cloneIfMounted(c2[i])
                    : normalizeVNode(c2[i])), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
                i++;
            }
        }
    }
        // 4. common sequence + unmount
        // (a b) c
        // (a b)
        // i = 2, e1 = 2, e2 = 1
        // a (b c)
        // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
        while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
        }
    }
        // 5. unknown sequence
        // [i ... e1 + 1]: a b [c d e] f g
        // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
        const s1 = i; // prev starting index
        const s2 = i; // next starting index
        // 5.1 build key:index map for newChildren
        const keyToNewIndexMap = new Map();
        for (i = s2; i <= e2; i++) {
            const nextChild = (c2[i] = optimized
                ? cloneIfMounted(c2[i])
                : normalizeVNode(c2[i]));
            if (nextChild.key != null) {
                if (keyToNewIndexMap.has(nextChild.key)) {
                    warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
                }
                keyToNewIndexMap.set(nextChild.key, i);
            }
        }
        // 5.2 loop through old children left to be patched and try to patch
        // matching nodes & remove nodes that are no longer present
        let j;
        let patched = 0;
        // 新节点中需要被更新的长度
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        // used to track whether any node has moved
        let maxNewIndexSoFar = 0;
        // works as Map<newIndex, oldIndex>
        // Note that oldIndex is offset by +1
        // and oldIndex = 0 is a special value indicating the new node has
        // no corresponding old node.
        // used for determining longest stable subsequence
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
            newIndexToOldIndexMap[i] = 0;
        // 遍历剩下的旧节点
        for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];
            if (patched >= toBePatched) {
                // all new children have been patched so this can only be a removal
                unmount(prevChild, parentComponent, parentSuspense, true);
                continue;
            }
            let newIndex;
            if (prevChild.key != null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
                // key-less node, try to locate a key-less node of the same type
                for (j = s2; j <= e2; j++) {
                    if (newIndexToOldIndexMap[j - s2] === 0 &&
                        isSameVNodeType(prevChild, c2[j])) {
                        newIndex = j;
                        break;
                    }
                }
            }
            if (newIndex === undefined) {
                unmount(prevChild, parentComponent, parentSuspense, true);
            } else {
                newIndexToOldIndexMap[newIndex - s2] = i + 1;
                if (newIndex >= maxNewIndexSoFar) {
                    maxNewIndexSoFar = newIndex;
                } else {
                    moved = true;
                }
                patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
                patched++;
            }
        }
        // 5.3 move and mount
        // generate longest stable subsequence only when nodes have moved
        // 最长稳定子序列 保存的是最长的那段序列对应元素的下标
        // 最长稳定子序列 是为了把 dom 的移动数量降到最低
        const increasingNewIndexSequence = moved
            ? getSequence(newIndexToOldIndexMap)
            : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        // looping backwards so that we can use last patched node as anchor
        // 在 dom 操作的 api 中有 insertBefore 可以向当前节点的前面插入节点，锚点就用来调用此 api
        for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            // 把对应节点插入到锚点的前面
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
            // newIndexToOldIndexMap 中没有表示是新增的节点
            if (newIndexToOldIndexMap[i] === 0) {
                // mount new
                patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (moved) {
                // move if:
                // There is no stable subsequence (e.g. a reverse)
                // OR current node is not among the stable sequence
                // j < 0 则表明 最长稳定子序列 中的 dom 已经完全跳过
                // i !== increasingNewIndexSequence[j] 表明当前的节点不属于 最长稳定子序列 中的 dom
                if (j < 0 || i !== increasingNewIndexSequence[j]) {
                    move(nextChild, container, anchor, 2 /* MoveType.REORDER */);
                } else {
                    j--;
                }
            }
        }
    }
};
```

## getSequence 最长递增子序列

> 减少在节点移动过程中的 `dom` 操作了，递增的那部分是顺序的，是不需要操作的

``` javascript
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                } else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
```
