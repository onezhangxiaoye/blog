# tapable

[参照](https://juejin.cn/post/7164175171358556173#heading-21)

[Tapable](https://github.com/webpack/tapable#tapable) 是一个类似于 `Node.js` 中的 [EventEmitter](https://www.npmjs.com/package/events) 的库，但它更专注于自定义事件的触发和处理。通过 `Tapable` 我们可以注册自定义事件，然后在适当的时机去执行自定义事件

## tapable 中可使用的 hook

``` javascript
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
} = require("tapable");

// 创建 hook 时需要传入参数名称数组，他表示未来所执行的回调函数所期望的参数数量
// 在 异步hook 中，callback 会放在回调函数的最后一个参数中
const hook = new AsyncSeriesHook(['arg1', 'arg2'])

hook.tapAsync('监听器1', (arg1, arg2, callback) => {
    // 执行异步操作
    // 完成后执行 callback(需要返回的数据)
})
```

## hook 分类

在 `tapable` 中的` hook` 可以按照 **同步异步** 或者 **监听器执行方式** 进行分类

## 同步异步 hook

按照 **同步异步** 可以分为 **同步hook** 和 **异步hook** ，他们的差别是：

1. 异步hook的回调中需要使用 `callback()` 返回执行结果
2. 添加监听器同步使用 `tap` ，异步使用 `tapAsync`
3. 执行hook 同步使用 `call` ，异步使用 `callAsync`

## SyncHook

``` javascript
const { SyncHook, AsyncParallelHook } = require("tapable");

function sleep(t = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(3)
        }, t)
    })
}

const syncHook = new SyncHook(['arg1', 'arg2'])

syncHook.tap('监听器1', (arg1, arg2) => {
    console.log('监听器1', arg1, arg2)
})

syncHook.tap('监听器2', (arg1, arg2) => {
    console.log('监听器2', arg1, arg2)
})

syncHook.call('1111', '2222')

// 监听器1 1111 2222
// 监听器2 1111 2222
 
```

## AsyncParallelHook


``` javascript
const asyncHook = new AsyncParallelHook(['arg1', 'arg2'])

asyncHook.tapAsync('Async监听器1', async (arg1, arg2, callback) => {
    await sleep(2000)
    console.log('Async监听器1', arg1, arg2)
    callback()
})

asyncHook.tapAsync('Async监听器2', async (arg1, arg2, callback) => {
    await sleep()
    console.log('Async监听器2', arg1, arg2)
    callback()
})

asyncHook.callAsync(3333, 4444, (error, result) => {
    // 所有的异步监听器执行了  callback ，成功的回调才会执行
    console.log('成功后的回调: ', error, result)
})

// Async监听器2 3333 4444
// Async监听器1 3333 4444
// 成功后的回调:  undefined undefined
```


## 监听器执行方式

按照 **监听器执行方式** 可以分为:

- **Waterfall 瀑布流** 前一个事件函数的结果 `result !== undefined` ，则 `result` 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）
- **Loop 循环** 不停的循环执行事件函数，直到所有函数结果 `result === undefined` ，不符合条件就调头重新开始执行
- **Bail 保险的** 只要其中一个返回值 `result !== undefined` ，后面的就不执行了

## SyncWaterfallHook

``` javascript
const { SyncWaterfallHook } = require("tapable");

const syncWaterfallHook = new SyncWaterfallHook(['arg1', 'arg2'])

syncWaterfallHook.tap('syncWaterfallHook监听器1', (arg1, arg2) => {
    console.log('syncWaterfallHook监听器1', arg1, arg2)
    return 3
})

syncWaterfallHook.tap('syncWaterfallHook监听器2', (arg1, arg2, arg3) => {
    console.log('syncWaterfallHook监听器2', arg1, arg2, arg3)
    return 4
})

syncWaterfallHook.call('1111', '2222')

// syncWaterfallHook监听器1 1111 2222
// syncWaterfallHook监听器2 3 2222 undefined

```

## SyncLoopHook


``` javascript
const { SyncLoopHook } = require("tapable");

const syncLoopHook = new SyncLoopHook(['count'])

syncLoopHook.tap('syncLoopHook监听器1', (count) => {
    console.log('syncLoopHook监听器1', count)
    if(count === 6) {
        return
    }

    return count
})

let i = 2

syncLoopHook.tap('syncLoopHook监听器2', (count) => {
    console.log('syncLoopHook监听器2', count)
    if(i-- <= 0) {
        return
    }
    return i
})

let j = 1

syncLoopHook.tap('syncLoopHook监听器3', (count) => {
    console.log('syncLoopHook监听器3', count)

    if(j-- <= 0) {
        return
    }

    return j
})

syncLoopHook.call(6)

// syncLoopHook监听器1 6
// syncLoopHook监听器2 6
// syncLoopHook监听器1 6
// syncLoopHook监听器2 6
// syncLoopHook监听器1 6
// syncLoopHook监听器2 6
// syncLoopHook监听器3 6
// syncLoopHook监听器1 6
// syncLoopHook监听器2 6
// syncLoopHook监听器3 6 
```

## SyncBailHook


``` javascript
const { SyncBailHook } = require("tapable");

const syncBailHook = new SyncBailHook(['count'])

const syncBailHook = new SyncBailHook(['arg1', 'arg2'])

syncBailHook.tap('syncBailHook监听器1', (arg1, arg2) => {
    console.log('syncBailHook监听器1', arg1, arg2)
})

syncBailHook.tap('syncBailHook监听器2', (arg1, arg2) => {
    console.log('syncBailHook监听器2', arg1, arg2)
    return 4
})

syncBailHook.tap('syncBailHook监听器3', (arg1, arg2) => {
    console.log('syncBailHook监听器3', arg1, arg2)
})

syncBailHook.call('1111', '2222')

// syncBailHook监听器1 1111 2222
// syncBailHook监听器2 1111 2222

```


## 并行(Parallel)、串行(Series) hook

- **并行(Parallel)：** 所有监听器同步启动
- **串行(Series)：** 只有等待上一个监听器执行完成了才会执行下一个

## AsyncParallelBailHook

`AsyncParallelBailHook` 同步启动， 只要有一个执行了 `callback` ，成功的回调就会执行

``` javascript
const { AsyncParallelBailHook } = require("tapable");

const asyncParallelBailHook = new AsyncParallelBailHook(['arg1'])

asyncParallelBailHook.tapAsync('asyncParallelBailHook监听器1', async (arg1, callback) => {
    await sleep(2000)
    console.log('asyncParallelBailHook监听器1', arg1)
    callback(null, 333)
})

asyncParallelBailHook.tapAsync('asyncParallelBailHook监听器2', async (arg1, callback) => {
    await sleep(1000)
    console.log('asyncParallelBailHook监听器2', arg1)
    callback(null, 222)
})

asyncParallelBailHook.callAsync('1111', (error, result) => {
    console.log(error, result)
})

// asyncParallelBailHook监听器2 1111
// asyncParallelBailHook监听器1 1111
// null 333
```

## AsyncSeriesBailHook

`AsyncParallelBailHook` 等待上一个监听器中 callback 执行后才会继续执行下一个， 只要有一个返回值 `result !== undefined`，后面的监听器将不会再执行

``` javascript
const asyncSeriesBailHook = new AsyncSeriesBailHook(['arg1'])

asyncSeriesBailHook.tapAsync('asyncSeriesBailHook监听器1', async (arg1, callback) => {
    await sleep(2000)
    console.log('asyncSeriesBailHook监听器1', arg1)
    callback()
})

asyncSeriesBailHook.tapAsync('asyncSeriesBailHook监听器2', async (arg1, callback) => {
    await sleep(1000)
    console.log('asyncSeriesBailHook监听器2', arg1)
    callback(null, 222)
})

asyncSeriesBailHook.tapAsync('asyncSeriesBailHook监听器3', async (arg1, callback) => {
    await sleep(1000)
    console.log('asyncSeriesBailHook监听器3', arg1)
    callback(null, 222)
})

asyncSeriesBailHook.callAsync('1111', (error, result) => {
    console.log(error, result)
})

// asyncSeriesBailHook监听器1 1111
// asyncSeriesBailHook监听器2 1111
// null 222

```
