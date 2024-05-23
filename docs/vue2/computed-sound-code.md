# computed源码分析

## 例子代码

``` javascript
  new Vue({
    el: '#app',
    data(){
      return {
        count: 0,
      }
    },
    computed: {
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
      }, this.name)
    }
  })
```

## computed 初始化

### 定义 computed 的多种方式

``` javascript
computed: {
  count() {
    return this.a + 1;
  },
  name: {
    set(val) {
      this.firstName = val;
    },
    get() {
      return this.firstName + 'AAA';
    }
  }
}
```

在 `initComputed` 中，在当前 `vue实例` 内添加一个 `_computedWatchers`  属性，用于保存所有的 `computedWatcher` ，遍历 `computed` 所有属性，为每个属性都单独创建一个 `Watcher` ，为每个计算属性定义一个 `computedWatcher`，

``` javascript
// function initState (vm) {} 中的代码

if (opts.computed) { 
  initComputed(vm, opts.computed); 
}
```

``` javascript
var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    // 判断是否为 对象 或者 function
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}
```
然后走到了 `Watcher` 里面，`expOrFn` 就是计算属性这个函数或者对象里面的 `get` ，`cb` 是个空函数，`options = { lazy: true }`

由于 `this.lazy = true`，就**不会不会不会**走到 `this.get();`

``` javascript
var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
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
``` 
然后就又走到了 `defineComputed`，此时 `typeof userDef === 'function'` 是成立的，所一会走到 `createComputedGetter(key)`，这里生成了一个函数 `computedGetter`，然后把 `sharedPropertyDefinition` 定义到 `vue实例` 上

当执行 `render` 时，若在 `render` 中使用到了这个数据，就会走到 `computedGetter` 中，`computedWatcher` 在初始化完成后 `dirty=lazy=true`，然后就走到了 `watcher.evaluate();` ，然后会走到 `watcher.get`，首先把当前全局的 `Dep.target` 设置为了当前的 `computedWatcher` ，然后再执行 `value = this.getter.call(vm, vm);` 而这个 `getter` 实际是在定义 `computed` 时的函数或者对象 `get`

在例子代码中，会执行到 `return this.count + 1;`； 然后就会走到 `count` 转换后的 `getter` ，此时的 `Dep.target` 就是当前的 `computedWatcher`，然后进入到了 `dep.depend();` ，这时 `count` 的 `dep` 就收集到了此依赖

`watcher.get` 执行完成后，`watcher.dirty = false;` 会被置为 `false`，一个缓存的开关，只要依赖不修改，获取到的都是缓存的值

``` javascript
function defineComputed (
  target, key, userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

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

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};
```

## 第一次重新 get

在例子代码中，只有当用户点击 `h1` 标签触发了 `click` 事件，然后执行 `this.count += 1;` ，然后就会走到 `count` 的 `set` ，然后 `dep.notify();` 通知更新

> `count` 的 `dep` 收集了一个 `computedWatcher` 和一个 `renderWatcher`

`conputed watcher` 由于其 `this.lazy === true`，从而走到了 `this.dirty = true;`

然后走到了 `$nextTick` 回调 `flushSchedulerQueue` ； 然后在异步任务中执行 `renderWatcher` 就走到了当前定义的 `render` 函数。这时就会走到 `this.name` ，然后执行其 `computedGetter` ，在 `vm._computedWatchers` 中拿到对应的 `computedWatcher` ，在上一步已经把此 `computedWatcher.dirty` 设置为 `true` ，然后在在 `evaluate` 中使用 `computedWatcher.get` 重新取值

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

``` javascript
set: function reactiveSetter (newVal) {
  var value = getter ? getter.call(obj) : val;
  // 省略部分代码
  dep.notify();
}
```
