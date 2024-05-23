# vue依赖收集

- 实例 `data` 中，在 `initData` 时，会递归通过 `defineReactive` 为每个属性设置 `getter/setter`， 且 `data` 的每个为对象的属性都会生成一个 `Observer(观察者)` 对象·
- `defineReactive` 这个函数执行时产生的闭包会保存执行过程中的 `var dep = new Dep();`，相当于是为 `data` 内部的每个属性，包括其子对象的属性都添加了一个 `Dep` 用于 `getter` 收集依赖和 `setter` 通知更新
- 每个属性的依赖收集器 `Dep` 都有一个唯一的 id，用于在收集依赖时不会重复收集
- `Dep` 内的  `subs` 存的 `Watcher`
- `initState` 中 ` vm._watchers = [];`
- `Watcher` 中 `this.getter = updateComponent;`
- 在 `watcher.get` 时进行依赖收集 `pushTarget(this);`
- `Dep` 用于收集依赖(与渲染相关的数据才会被收集)，`render watch` 用于观察 `Dep`

> `watch`、`computed`、`renderWtacher` ,在初始化 `new Watcher` 时都会给 `watcher.getter` 赋值，然后通过 `watcher.get` 中主动调用其 `getter`，`renderWtacher.getter = updateComponent`，`computedWatcher.getter = 用于定义的函数`，`watchWatcher.getter`

## Watcher
> `Watcher` 分为了 `user Watcher` 和 `render Watcher`
> - `user Watcher` 比如初始实例中配置的 `computed`、`watch`、还有 `vue 原型上的 $watch`
> - `render Watcher` 在 `mountComponent` 时创建的 `render Watcher`，**每个组件都会有一个单独的 `render Watcher`**
>>  `render Watcher` 在初始化的时候会 调用其 `get` 具体看 重新渲染5.2
> - `render Watcher` 收集与当前 `render` 渲染相关的依赖项

## Dep
> `Dep` 收集了与当前数据有关的 `render Watcher` , 在数据修改时 通知其更新


## 重新渲染
> 当用户触发UI事件从而修改了当前实例的某个值，简单的例子：`this.count = 1`，会按照下面步骤进行 dom 的更新操作

1. 走 `defineReactive` 的 `setter`
2. `dep.notify();`
3. `subs[i].update();` subs 中存储的 `Watcher`
4. `Watcher.prototype.update => queueWatcher(this);`

> `queueWatcher` 用于添加当前被订阅的所有 `Watcher`，在添加第一个时开启一个异步任务，在宏任务执行期间保存后续所有的 `Watcher`
``` javascript
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
var queue = [];
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      // 添加 watcher
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
    // 在当前的宏任务执行过程中不在重新 执行 nextTick
    // 合并更新 Watcher， queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      // 在异步任务中更新队列
      nextTick(flushSchedulerQueue);
    }
  }
}
```
5. flushSchedulerQueue() 执行

``` javascript
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // 按照 Watcher id 递增的方式排序 id ，为了保证下列的运行规则
  // 组件从父组件到子组件的更新顺序(父组件总是在子组件之前创建)
  // 一个组件的 user watchers 在 render watcher 之前允许(user watchers 总是在 render watcher 之前创建的)
  // 如果一个组件在父组件的 watchers 执行期间被销毁，那么应该跳过他的 watchers 执行
  queue.sort(function (a, b) { return a.id - b.id; });

  // 由于在执行 watchers 时可能会添加更对的 watchers 进入队列，所以不缓存队列长度
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      // 通更新前的钩子 beforeUpdate
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    // 执行当前 
    watcher.run();
    // in dev build, check and stop circular updates.
    if (has[id] != null) {
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

5.1. flushSchedulerQueue 中执行 watcher.run


``` javascript
/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    // 这里走到了 Watcher.get 在5.2中
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

5.2. `watcher.run` 中调用 `this.get` 就会走到 `watcher.get`

5.2.1. `get` 中把当前的 `watcher` 推到 `targetStack` 中，且把 `Dep.target` 指定为当前的 `watcher`

``` javascript
  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }
```
5.2.2. `watcher.get`
``` javascript
/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  // 把当前执行的 watcher 
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    // getter 在 new Watcher 时初始化传入的
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

6. `render Watcher` `getter` 就走到了

``` javascript
updateComponent = function () {
  vm._update(vm._render(), hydrating);
};
```

7. 调用 `vm._render()`
> 这里这个 `render` 就是用`户定义的 render` 或者 `通过 template 编译后生成的 render` 了
``` javascript
Vue.prototype._render = function () {
  var vm = this;
  var ref = vm.$options;
  var render = ref.render;
  vnode = render.call(vm._renderProxy, vm.$createElement);
}
```
8. 调用 `render` 生成 `vnode`

``` javascript
const App = {
  name: 'app',
  render(h) {
    return h('div', this.count);
  }
}
```

8.1. 在 `render` 函数调用时，`this.count` 这类似的获取组件实例数据时就会触发 `observer` 设置的 `getter`

``` javascript
function reactiveGetter () {
  var value = getter ? getter.call(obj) : val;
  // 当前组件重新渲染即 render watcher 存在的时候
  // 才会再次进行依赖收集
  if (Dep.target) {
    // 添加依赖
    dep.depend();
    if (childOb) {
      childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
    }
  }
  return value
}
```

9. `target render Watcher` 收集当前相关的依赖项，`dep` 收集当前的` render Watcher` ，用于在修改后通知其更新


``` JavaScript
Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  // 不收集重复的依赖项
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    // 收集 render watcher
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};
```

10. `Watcher.prototype.get` 中 `cleanupDeps`

``` JavaScript
/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  // 如果旧的 deps 有数据
  while (i--) {
    var dep = this.deps[i];
    // 检查新的 newDepIds 里面是否存在这个旧的 dep.id
    if (!this.newDepIds.has(dep.id)) {
      // 若不存在，表示当前 render Watcher 不依赖与此条数据
      // 则可以在 dep 中移除对此 render Watcher 的收集
      dep.removeSub(this);
    }
  }
  // 缓存旧的 depIds
  var tmp = this.depIds;
  // 把新的 newDepIds 赋值给 depIds
  this.depIds = this.newDepIds;
  // 把旧的 depIds 赋值给 newDepIds 重复利用？
  this.newDepIds = tmp;
  // 清空 newDepIds
  this.newDepIds.clear();
  // 重新把 tmp 赋值为 deps
  tmp = this.deps;
  // 把新的 newDeps 再赋值给 deps
  this.deps = this.newDeps;
  // 把旧的 deps 缓存赋值给 newDeps 重复利用？
  this.newDeps = tmp;
  // 直接清空
  this.newDeps.length = 0;
};
```
