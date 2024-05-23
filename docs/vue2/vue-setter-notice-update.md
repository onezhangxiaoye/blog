# vue触发setter通知更新

## 通知更新例子代码
``` javascript
new Vue({
    el: '#app',
    data() {
        return {
            count: 0,
        }
    },
    render(h) {
        return h('h1', {
            on: {
                click: () => {
                    this.count += 1;
                }
            }
        }, this.count);
    }
})
```
## 从触发点击事件到重新渲染
当我们点击 `h1` 时会执行 `this.count += 1;`

这是会首先走到 `reactiveGetter`，但是这时 `Dep.target` 为空不会再进行依赖收集

然后走到 `reactiveSetter` ，检查是否为相同的值，检查传入的数据是否为对象否则进行响应式处理，最后进行 `dep.notify();` 通知更新

``` javascript
/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj, key, val,
  customSetter, shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
```

在 `dep.notify();` 中，循环对 `subs` 中收集到的 `watcher` 进行 `update`

``` javascript
Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};
```
在 `update` 时存在三种 `watcher` ；`renderWatcher` `computedWatcher(this.lazy === true)` `watchWatcher`

例子代码这种情况不属于 `lazy` 也不属于 `sync`，就会走到 `queueWatcher(this);`

``` javascript
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
    // 还不知道什么情况下会是 true，用户定义的？
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
```
获取当前 `watcher` 的唯一 `id`

缓存所有 `render Watcher` 的 `id` ，后面进入的重复 `render Watcher` 将不会被 `push` 到 `queue` 中

这里有个全局的开关 `waiting` 在第一次为 `false` 时进入打开开关，并开启一个异步任务 `nextTick`

`flushing = true` 表示当前已进入了 `flushSchedulerQueue` 这个队列刷新的执行过程，但是在执行过程中也会存在有新的队列任务加入，新的任务加入逻辑如下：

1. 如果已经刷新，则根据它的 `id` 拼接到对应位置
2. 如果已经超过了它的`id`，它将立即被运行，会被放到当前执行的 `index` 后

``` javascript
var queue = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```
异步执行 `flushSchedulerQueue`

设置 `flushing = true;`

对 `watcher队列` 进行排序规则如下（翻译过来的）

按照 `Watcher id` 递增的方式排序 `id` ，为了保证下列的运行规则
1. 组件从父组件到子组件的更新顺序(父组件总是在子组件之前创建)
2. 一个组件的 `user watchers` 在 `render watcher` 之前运行(`user watchers` 总是在 `render watcher` 之前创建的)
3. 如果一个组件在父组件的 `watchers` 执行期间被销毁，那么应该跳过他的 `watchers` 执行

队列刷新过程的循环更新问题
1. 在 `watcher.run();` 过程中再次修改数据导致当前的 `render Watcher` 被插入队列的下次执行位置
2. 在下次就会继续执行此 `id` 的 `render Watcher`，循环次数超过 100 次就会被认定为异常的循环更新

``` javascript
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 对于 render Watcher 这是 beforeUpdate
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}
```
> - 依次执行队列中的 `watcher.run` 进行更新

## render watcher run
接下来走到了 `var value = this.get();` ，然后后面的逻辑就和初始渲染时差不多的了

``` javascript
/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
```
## conputed watcher run
### 例子代码
``` javascript
new Vue({
    el: '#app',
    data() {
        return {
            count: 0,
        }
    },
    conputed:{
      name() {
        return this.count + 1;
      }
    },
    render(h) {
        return h('h1', {
            on: {
                click: () => {
                    this.count += 1;
                }
            }
        }, this.name);
    }
})
```
## computed 的依赖收集

在执行 `render` 时，例子代码执行 `this.name`，这里会走到其 `computedGetter` ,然后走到其 `computedWatcher.get` ，在开始 `pushTarget(this);` 把当前 `Dep.target` 赋值为当前的 `computedWatcher` ，并压栈，后面在执行 `computedWatcher.getter` （我们定义的函数）过程中若使用到某些 `vue实例` 下的数据走到其 `getter` 时就会进行对应的依赖收集。

``` javascript
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};
```
`conputed watcher` 由于其 `this.lazy === true`，所以不会在 `dep.notify();` =》` watcher.update()` 中走到 `queueWatcher(this);` ，而走到了 `this.dirty = true;`

在执行 `renderWatcher` 时执行当前定义的 `render` 函数，这时就会走到 `this.name` ，然后执行其 `computedGetter` ，在 `vm._computedWatchers` 中拿到对应的 `computedWatcher` ，在上一步已经把此 `computedWatcher.dirty` 设置为 `true` ，然后在在 `evaluate` 中使用 `computedWatcher.get` 重新取值


``` javascript
function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}
```

``` javascript
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};
```

## watch watcher run

> `watch watcher` ，在执行 `run` 时，其实就是执行定义的函数

