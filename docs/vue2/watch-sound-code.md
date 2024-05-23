# watch源码分析

## 例子代码

``` javascript
  new Vue({
    el: '#app',
    data(){
      return {
        count: 0,
      }
    },
    watch: {
      count() {
        console.log('watch-count')
      }
    },
    render(h) {
      return h('h1', {
        on: {
          click: () => {
            this.count += 1;
          }
        }
      }, this.count)
    }
  })
```

## watch 初始化

``` javascript
// function initState (vm) {} 中的代码

if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch);
}
```
### 定义 watch 的多种方式

``` javascript
//返回一个函数，用于关闭监听器
const unwatch = this.$watch('value', function(newVal, oldVal){
  console.log('$watch-value');
  if(newVal === 1) {
    unwatch();
  }
}, {
  deep: true,
  immediate: true,
})

{
  methods: {
    dosomething(){}
  },
  watch: {
    value(newVal, oldVal){},
    value1: {
      handler(newVal, oldVal){},
      // 是否立即执行 布尔值
      immediate: true,
      // 是否深度监听 布尔值
      deep: true,
    },
    'value2.key': function (newVal, oldVal){},
    value3: [
      'dosomething',
      function(newVal, oldVal){},
      {
        handler(newVal, oldVal){},
        immediate: true,
        deep: true,
      },
    ]
  }
}
```

这里就走到了 `initWatch`，循环 `watch` 对象的 `key`，为每一个单独定义一个 `watcher` ，这里还处理了循环时 `value` 为数组的情况

``` javascript

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```

然后走到了 `createWatcher`，这时定义的 `handler` 可能是 `Object` `string`(获取当前实例中的 `methods` ) `Function`，然后通过 `Vue` 原型上的 `$watch` 创建一个 `Watcher`

``` javascript
function createWatcher (
  vm, expOrFn, handler, options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}
```

这里 `cb` 处理了依旧为对象的逻辑，但是一般应该不会这么写了。 设置 `options.user = true;` ，创建一个 `Watcher` 实例，判断当前 `watch` 是否需要立即执行。最后返回一个取消监听的回调函数 `unwatchFn`

``` javascript
Vue.prototype.$watch = function (
  expOrFn, cb, options
) {
  var vm = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {};
  options.user = true;
  var watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
    }
  }
  return function unwatchFn () {
    watcher.teardown();
  }
};
```

这里 `new Watcher(vm, expOrFn, cb, options)` 在执行的时候，例如顶部例子代码，实际参数是这样的：`expOrFn = 'count'`，`cb = function count(){}`，`options = undefined`

上面的例子代码 `new Watcher` 时就会走到 `this.getter = parsePath(expOrFn);`，在这里面会处理类似于 `obj.val.key` 这种的 `key`，然后 `watch` 创建的 `Watcher` 的 `this.lazy = false`

然后就走到了 `this.get();`，在 `watcher.get` 中会首先执行 `pushTarget(this)`; ，把当前 `watcher` 设置为全局正在执行的唯一 `watcher` ，然后执行 `value = this.getter.call(vm, vm);`，这里就会执行 `parsePath` 返回的函数了，这个返回的函数主要就是获取 `count` 或者更加复杂的`obj.val.key` 的值，**类似于`this.count`或者`this.obj.val.key`目的是主动触发需要监听的属性的`getter`**

由于这时候 `dep.target` 是存在的，所以当前 `dep` 就会收集到这个 `watch定义的watcher`

``` javascript
var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() apinitLifecyclei and directives.
 */
var Watcher = function Watcher (
  vm, expOrFn, cb,
  options, isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
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

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

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

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};
```

``` javascript
/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}
```

## 第一次修改数据 watch 执行

在后面，当用户执行 `this.count = 1;`时，就会走到 `defineReactive` 的 `setter` 中，然后走到 `dep.notify();`
> `count` 的 `dep` 收集了 `renderWatcher` 和 `watchWatcher`

``` javascript
// 省略部分代码
function defineReactive$$1 (
  obj, key, val,
  customSetter, shallow
) {
  var dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {},
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      dep.notify();
    }
  });
}
```

``` javascript
Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};
```

``` javascript
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
```

这两个 `Wathcer` 的执行都会推到 `nextTick` 中，这里主要看 `watchWatcher`，在 `nextTick` 中执行 `flushSchedulerQueue` ，在里面循环 `queue` ，然后执行对应的 `watcher.run()`

``` javascript
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;
  queue.sort(function (a, b) { return a.id - b.id; });
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
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
然后执行对应的 `get` ，这其实就是用于定义的 `handler` 了

``` javascript
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

