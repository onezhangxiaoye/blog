# js-eventLoop

- 参照
- [ssh 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://mp.weixin.qq.com/s/l9pGe7-xY08DeaFMnk0xuA)
- [Vue源码详解之nextTick：MutationObserver只是浮云，microtask才是核心！](https://segmentfault.com/a/1190000008589736)

## 动机
写了一个小测试代码，来体现 `宏任务（UI事件，setTimeout）`，`微任务(promise)`，[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)(浏览器在下次重绘之前调用)，[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)(浏览器空闲时期被调用)，的执行顺序

写这个问题的来源是关于 `vue` 的 `$nextTick` 为什么最优先使用 `Promise` ， 而最后的兜底方案才是 `setTimeout` 。

还有一个实际的问题是下面两个例子，为什么 `setTimeout` 实现的 `$nextTick` 的方块在滚动条滚动时会出现 **抖动**

[$nextTick-promise实现-CodePen](https://codepen.io/onezhangxiaoye/pen/poNYQVY)

[$nextTick-setTimeout实现-CodePen](https://codepen.io/onezhangxiaoye/pen/GRNewQM)

## 例子的解释

[在线测试地址-event-loop-test](https://cai12317.gitee.io/vite-vue-app-2021-01-13/#/event-loop-test)

例子是基于 Vue3.0 开发的
1. 在组件初始化时，设置递归进行的 `requestAnimationFrame` 和 `requestIdleCallback`，在每次回调执行时输出日志信息
2. 在其中一个 `dom` 上绑定了 `scroll` 事件
3. 在 `scroll` 事件执行时输出日志
4. 设置一个 `Promise` ，在 `then` 的回调中输出日志
6. 在设置 `Promise` 后，再次输出日志
7. 在最后，设置两个宏任务 `setTimeout` ，等待时间均不设置，在两个 `setTimeout` 输出不同的日志
8. 在界面中滚动滚动条，然后查看日志输出情况，判断对应的执行顺序

## 日志解析

::: tip
这是 scroll 事件执行的完整代码，主要的日志输出位置
:::
``` javascript
function scroll() {
    let a = count++
    // scroll 执行日志输出
    log(`---scroll---${a}`)
    // 设置一个 Promise ，在 then 的回调中输出日志
    resolve.then(() => {
        log(`---Promise---${a}`)
    })
    // 在设置 Promise 后，再次输出日志
    log(`---scroll---after---${a}`)
    // 添加两个宏任务
    setTimeout(() => {
        log(`---setTimeout---1---${a}`)
    })
    setTimeout(() => {
        log(`---setTimeout---2---${a}`)
    })
}
```


::: tip
打印的日志很多，只截取了部分用以说明；实际过程中 浏览器刷新率不同(下面日志60fps)，滚动条滚动的速度不同等都会造成打印的日志不完全一样，但是整体逻辑时一样的；日志最前面的数字表示日志重复次数，最后面的数字没有什么意义
:::

- `3-6行`：此时页面没有任何操作，我们发现存在 `requestAnimationFrame(重绘)` 执行了两次才执行了 `requestIdleCallback`，说明即使在浏览器空闲情况下，`requestIdleCallback` 的执行频率和重绘都不一定一致
- `7-9行`：第一次触发 `scroll` 事件，先执行了主代码，主代码执行过程中向微任务队列添加了一个任务，最后执行了微任务，在这个宏任务执行完成后，浏览器在 **第九行** 执行了一次重绘
- `7-18行`：`scroll` 事件触发了三次，我们在 `scroll` 回调里面设置的 `setTimeout` ，一个都没有机会执行，浏览器执行了优先级更高的 `scroll` 事件，**若是在 `setTimeout` 中修改数据，意味着修改后的数据会错过这三次浏览器重绘**
- `19-24行`：执行两次 `setTimeout` ，然后执行 `scroll` 事件，然后进行浏览器重绘
- `7-87行`：浏览器重绘始终都发生在两次宏任务之间，但是视乎始终在 UI 事件执行完成后进行；微任务一定会在当前宏任务执行过程中执行完成；用户添加的宏任务 `setTimeout` 优先级比 UI 事件触发的宏任务低，*这里不确定的是，` UI 事件回调` 是在任务队列里面被优先取出来了，还是本就在队列中排在了靠前的位置*
- `87-88行`：`requestIdleCallback` 在 `7-87行` 完全没有机会执行(浏览器没有空闲)，最后在浏览器又一次执行了重绘，然后才执行了 `requestIdleCallback`

```
// .................前面省略了一部分......................

2--------requestAnimationFrame--------- 
--------requestIdleCallback---------
1--------requestAnimationFrame---------
--------requestIdleCallback---------
---scroll---1
---scroll---after---1
---Promise---1
--------requestAnimationFrame---------
---scroll---2
---scroll---after---2
---Promise---2
--------requestAnimationFrame---------
---scroll---3
---scroll---after---3
---Promise---3
--------requestAnimationFrame---------
---setTimeout---1---1
---setTimeout---2---1
---scroll---4
---scroll---after---4
---Promise---4
--------requestAnimationFrame---------
---setTimeout---1---2
---setTimeout---2---2
---setTimeout---1---3
---setTimeout---2---3
---scroll---5
---scroll---after---5
---Promise---5
--------requestAnimationFrame---------
---setTimeout---1---4
---setTimeout---2---4
---scroll---6
---scroll---after---6
---Promise---6
--------requestAnimationFrame---------
---scroll---7
---scroll---after---7
---Promise---7
--------requestAnimationFrame---------
---setTimeout---1---5
---setTimeout---2---5
---scroll---8
---scroll---after---8
---Promise---8
--------requestAnimationFrame---------
---setTimeout---1---6
---setTimeout---2---6
---setTimeout---1---7
---setTimeout---2---7
---scroll---9
---scroll---after---9
---Promise---9
--------requestAnimationFrame---------
--------requestAnimationFrame---------

// .................中间省略了一部分......................

--------requestAnimationFrame---------
---setTimeout---1---41
---setTimeout---2---41
---scroll---46
---scroll---after---46
---Promise---46
--------requestAnimationFrame---------
---setTimeout---1---42
---setTimeout---2---42
---scroll---47
---scroll---after---47
---Promise---47
--------requestAnimationFrame---------
---setTimeout---1---43
---setTimeout---2---43
--------requestAnimationFrame---------
---setTimeout---1---44
---setTimeout---2---44
--------requestAnimationFrame---------
---setTimeout---1---45
---setTimeout---2---45
--------requestAnimationFrame---------
---setTimeout---1---46
---setTimeout---2---46
--------requestAnimationFrame---------
---setTimeout---1---47
---setTimeout---2---47
1--------requestAnimationFrame---------
--------requestIdleCallback---------

// .................后面省略了一部分......................
```

## 例子源码
::: details 点击查看代码
``` vue
<template>
    <div class="event-loop-test" @scroll="scroll">
        <div class="event-loop-test-box">
            滚动屏幕，进行实验：下方内容为输出的日志👇👇👇
            最大日志条数 {{ maxLogStackLength }}
            <button class="event-loop-test-button" style="right: 20px" @click="handleClick">{{ closeLog ? '关闭' : '打开' }}日志输出</button>
            <button class="event-loop-test-button" style="right: 130px" @click="clearLog">清空日志</button>
            <div v-for="(item, i) in logStack" :key="i">{{ item }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {reactive, defineComponent, ref} from 'vue'

    export default defineComponent({
        setup() {

            let count = 1
            const maxLogStackLength = 500
            const closeLog = ref(true)
            let logStack = reactive([])

            function pushLog(log) {

                if(!closeLog.value) {
                    return;
                }

                if(!logStack.length) {
                    logStack.push(log)
                    return
                }

                // 取出日志的最后一条
                let lastLog = logStack[logStack.length - 1]

                if (lastLog.endsWith(log)) {
                    logStack.splice(logStack.length - 1, 1, lastLog.replace(/^\d*/, match => +(match || 0) + 1))
                } else {
                    if(logStack.length >= maxLogStackLength) {
                        logStack.shift()
                    }
                    logStack.push(log)
                }

            }

            function log(log) {

                if(!closeLog.value) {
                    return;
                }

                pushLog(log)
                console.log(log)
            }

            function onRefresh() {
                requestAnimationFrame(() => {
                    onRefresh()
                    log('--------requestAnimationFrame---------')
                })
            }

            function myRequestIdleCallback() {
                window.requestIdleCallback(() => {
                    log('--------requestIdleCallback---------')
                    myRequestIdleCallback()
                })
            }

            // 设置 递归进行的 requestAnimationFrame 和 requestIdleCallback
            onRefresh()
            myRequestIdleCallback()

            const resolve = Promise.resolve()


            function scroll() {
                let a = count++

                // scroll 执行日志输出
                log(`---scroll---${a}`)

                // 设置一个 Promise ，在 then 的回调中输出日志
                resolve.then(() => {
                    log(`---Promise---${a}`)
                })

                // 在设置 Promise 后，再次输出日志
                log(`---scroll---after---${a}`)

                // 添加两个宏任务
                setTimeout(() => {
                    log(`---setTimeout---1---${a}`)
                })

                setTimeout(() => {
                    log(`---setTimeout---2---${a}`)
                })

            }

            function handleClick() {
                closeLog.value = !closeLog.value
            }

            function clearLog() {
                logStack.splice(0, logStack.length)
            }

            return {
                scroll,
                closeLog,
                logStack,
                handleClick,
                clearLog,
                maxLogStackLength,
            }
        }
    })
</script>

<style scoped>
.event-loop-test {
    height: 100vh;
    overflow: auto;
}
.event-loop-test-box {
    height: 200vh;
}
.event-loop-test-button {
    position: fixed;
    top: 20px;
}
</style>
```
:::
