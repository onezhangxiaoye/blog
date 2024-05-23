# 为什么说 computed 会被缓存

## 官方解释
[Vue-computed](https://cn.vuejs.org/v2/api/#computed)

> 计算属性的结果会被缓存，除非依赖的响应式 `property` 变化才会重新计算。注意，如果某个依赖 (比如非响应式 `property`) 在该实例范畴之外，则计算属性是**不会**被更新的。

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
      countComputed() {
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

当 `vue` 实例挂载完成，`computed` 已经创建了对应的 `computedWatcher` ，`count` 对应的 `dep` 也已经收集到了该依赖。在初始默认情况下 `computedWatcher.dirty=computedWatcher.lazy=true` ，但是在第一次调用 `render` 时走到了 `computedGetter` 中的 `evaluate` 获取到值后会把 `dirty` 设置为 `false`。后面就只有当 `this.count` 重新被赋值时，通过   的 `watcher.update();` 把 `dirty` 的值设置为 `true` 后才会进入到` watcher.evaluate();` ，从而计算新值。只要 `count` 的 `setter` 不走到 `dep.notify()`，`countComputed` 就不会走到其定义的 `get`，拿到的就永远是旧值。

若 `computed` 依赖的值都是非响应式的，在第一次计算后，由于没有地方可以修改其 `computedWatcher.dirty` ，所以后面再重新渲染永远使用的都是旧值，不会再重新计算。

``` javascript
Watcher.prototype.update = function update () {
  // 只有computedWatcher 的 lazy=true
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
  
function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // 判断是否需要重新计算，只有在 dep.notify => watcher.update 里面才会修改其值了
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
Watcher.prototype.evaluate = function evaluate () {
  // 获取新值
  this.value = this.get();
  this.dirty = false;
};
```
