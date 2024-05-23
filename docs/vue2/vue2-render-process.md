# vue2组件渲染逻辑

## 例子代码

``` js
const Time = {
    data(){
        return {
            time: '123',
        }
    },
    render(h) {
        const h2 = h('h2', {
            on: {
                click: () => {
                    this.time = Date.now()
                }
            }
        }, this.time)

        return h('div', [h2])
    }
}

const vue = new Vue({
  el: '#app',
  data(){
    return {
      count: 1,
    }
  },
  render(h) {
    const h1 = h('h1', {
      on: {
        click: () => {
          this.count++
        }
      }
    }, this.count)

    return h('div', [h1, h(Time)])
  }
})
```

## 渲染流程

- 起始 `new Vue()`
- `Vue.prototype._init` 初始化
- `vm.$mount(vm.$options.el);` 挂载
- `mount.call(this, el, hydrating)`
- `mountComponent(this, el, hydrating)`

``` js
updateComponent = function () {
  vm._update(vm._render(), hydrating);
};
// 创建 renderWatcher
// Watcher 的 get 会设置为 updateComponent
// 实例化 Watcher 时会把当前的 RenderWatcher 设置 vm._watcher = this;
// 然后 vm._watchers.push(this); 把当前的 RenderWatcher 推到 _watchers 中
new Watcher(vm, updateComponent, noop, {
  before: function before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate');
    }
  }
}, true /* isRenderWatcher */);

function Watcher(){
  this.value = this.lazy
      ? undefined
      : this.get();
}
```

- ` this.get()`  执行 `updateComponent()`
- `vm._update(vm._render(), hydrating);` 实例更新 `Vue.prototype._update`
- `vm._render()`
- `vnode = render.call(vm._renderProxy, vm.$createElement);` 走到了组件的 `render`
- 然后通过 `h` 创建子节点的 `vnode`
- `vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };` 创建子 `vnode`
- `_createElement(context, tag, data, children, normalizationType)`
- `vnode = createComponent(tag, data, context, children);` 创建组件的 `vnode`
- `Ctor = baseCtor.extend(Ctor);` 继承 `Vue` 的原型上的方法
- `installComponentHooks(data);` 安装组件钩子函数

- `vm._update()`
- `vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);` 执行 `__patch__`

``` js
Vue.prototype.__patch__ = inBrowser ? patch : noop;

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });
```

- `patch()`

``` js
// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
);

function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index ) {
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
}
```

- `createChildren(vnode, children, insertedVnodeQueue);`
``` js
function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
    }
  }
}
```

- 当子节点为组件时 `createComponent(vnode, insertedVnodeQueue, parentElm, refElm)`
``` js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  var i = vnode.data;
  if (isDef(i)) {
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */);
    }
  }
}
```
- `i.init` 为 `installComponentHooks` 的 `componentVNodeHooks.init`
``` js
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    var child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    );
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  }
}

function createComponentInstanceForVnode (vnode, parent) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // 每个组件实例都是继承于 Vue ，然后再进行实例化
  // 在这里 vnode.componentOptions.Ctor = 下面的函数
  return new vnode.componentOptions.Ctor(options)
}

Vue.extend = function (extendOptions) {
  // vnode.componentOptions.Ctor = 这里
  var Sub = function VueComponent (options) {
    this._init(options);
  };
  return Sub
}

```

- 接下来就走到了子组件的 `Vue.prototype._init` 在这里面进行子组件的初始化
- 然后又回到 `componentVNodeHooks.init` 中的 `child.$mount(hydrating ? vnode.elm : undefined, hydrating);`
- `Vue.prototype.$mount`

``` js
// 新的 $mount
Vue.prototype.$mount = function (el, hydrating) {
  return mount.call(this, el, hydrating) 
}
// 原始的 $mount
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};
```

- 后面的流程就和前面一样了

> 每一个组件都有一个唯一的 `RenderWatcher` 它也是组件内部众多 `Watcher` 中第一个创建的，它保存在 `vm._watcher` ，组件内部的 `ComputedWatch` 、 `WatchWatcher` 都保存在 `vm._watchers` 中，




