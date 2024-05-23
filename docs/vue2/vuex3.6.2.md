# vuex3.6.2源码解析

## vuex 的使用 例子代码

``` js
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        num: 1
    },
    modules: { // 设置嵌套模块
        app: {
            state(){
              return { count: 18 }
            },
        }
    }
})

const vue = new Vue({
    el: '#app',
    store,
    render(h) {
        return h('div', this.$store.state.num)
    }
})
```

## 从 install 开始
全局混入 `beforeCreate` ，在这里面把 `store` 赋值到当前 `vue` 实例的 `$store`

``` js
/** 只展示了关键的代码，且对部分代码做出了调整 **/
function install (Vue) {
  applyMixin(Vue)
}

function applyMixin(Vue) {
  // 全局混入
  Vue.mixin({ beforeCreate: vuexInit })

  // Vuex init hook, injected into each instances init hooks list.
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 根组件时，把 store 设置到 $store 上
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 非根组件直接使用父组件的 $store
      this.$store = options.parent.$store
    }
  }
}
```

## new Vuex.Store

用于构建 `Store` 实例的 `Store` 类，实例化时，进行模块收集、绑定 `dispatch` `commit` 函数、初始化模块并收集 `getter` `mutations` `actions` 、初始化负责响应式的 `store` `vue` 实例、应用插件

``` js
/** 只展示了关键的代码，且对部分代码做出了调整 **/
class Store {
 constructor (options = {}) {
    const {
      plugins = [],
      strict = false
    } = options

    // 模块收集
    this._modules = new ModuleCollection(options)
    // 用于 watch 的 Vue实例
    this._watcherVM = new Vue()

    // 绑定 dispatch 和 commit 到 this 上
    // 平常我们使用 this.$store.dispatch 时就走到了这里
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    const state = this._modules.root.state

    // 初始化根模块。它还递归地注册所有子模块
    // 把所有模块的 getter 收集到 this._wrappedGetters 中
    // 把所有模块的 mutations 收集到 this._mutations 中
    // 把所有模块的 actions 收集到 this._actions 中
    installModule(this, state, [], this._modules.root)

    // 初始化负责响应式的 store vue实例，还将为 _wrappedGetters 注册为计算属性
    resetStoreVM(this, state)

    // 应用插件
    plugins.forEach(plugin => plugin(this))
  }
}
```

## ModuleCollection 模块收集
模块收集，循环注册子模块

``` js
/** 只展示了关键的代码，且对部分代码做出了调整 **/
class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }
  get (path) {
    // 第一次走到这 path = [] 返回的就直接是 this.root
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }
  register (path, rawModule, runtime = true) {
    // 创建模块
    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) { //根模块会走到这里
      this.root = newModule
    } else {
      // 获取父级模块 key ,第一次走到这 path.slice(0, -1) = []
      const parent = this.get(path.slice(0, -1))
      // 第一次走到这相当于就是 this.root.addChild 然后就会走到 Module.addChild
      // 根据例子代码 path[path.length - 1] = 'app'
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    if (rawModule.modules) { // 如果在初始配置中设置了嵌套模块就会走到这里
      // 循环嵌套模块进行注册
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        // 按照 例子代码 ，第一次走到这里 path = [] key = 'app' ，然后进行模块注册
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
}

function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

// Base data struct for store's module, package with some attribute and method
class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    // Store some children item
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule
    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
  addChild (key, module) {
    // 为当前模块设置子模块 key 就是对应模块的 key
    this._children[key] = module
  }
}
```

### installModule

installModule 用于把 `getter` `mutations` `actions` 收集起来统一管理，命名空间相关的注册

``` js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // 注册 namespaced map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

function registerMutation (store, type, handler, local) {
  // mutations 是用数组保持的 存储在对应的 type 下
  const entry = store._mutations[type] || (store._mutations[type] = [])
  // 这意味着 mutations 的名字是可以重复的
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}

function registerAction (store, type, handler, local) {
  // actions 是用数组保持的 存储在对应的 type 下
  const entry = store._actions[type] || (store._actions[type] = [])
  // 这意味着 actions 的名字是可以重复的
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(store, {// acttion 传入的第一个参数 ; 第二个参数 payload
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (__DEV__) {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  // getter 直接对应一个函数，后定义的 getter 会覆盖开始定义的
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```
- 命名空间其实就是把模块名称和对应的 `mutations` `actions` 名称进行了拼接，如下

``` js
const store = new Vuex.Store({
    state: {
        num: 1
    },
    mutations: {
        addNum(state, payload) {
            state.num = payload
        }
    },
    modules: {
        user: {
            namespaced: true,
            state: {
                age: 18
            },
            mutations: {
                addNum(state, payload) {
                    state.age = payload
                }
            },
        }
    }
})

// 注册后保存的 mutations 的变化
store._mutations = {
    'addNum': [],
    'user/addNum': []
}

// commit
store.commit('user/addNum')
```



### resetStoreVM

重置 用于响应式的 vue 实例

``` js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // store 绑定公共的 getters
  store.getters = {}
  // 重置本地的 getter 缓存
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    // 使用 computed 利用其延迟缓存机制
    // 直接使用内联函数将导致闭包保留 oldVm
    // 使用 partial 返回函数，只保留闭包环境中的参数
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // 使用Vue实例存储状态树
  // silent = true  禁止警告，防止用户添加了一些奇怪的全局混入
  const silent = Vue.config.silent
  Vue.config.silent = true
  // 这里的 state 将会被转换为响应式的对象
  // 这里是用户在修改 store 值时，能触发重新渲染的关键所在
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    // 销毁旧的 Vm
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

### 插件事件注册

插件事件注册及插件注册的函数调用

``` js
class Store{
  subscribe (fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
  }

  subscribeAction (fn, options) {
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers, options)
  }

  commit (_type, _payload, _options) {
    // 执行插件事件
    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))
  }

  dispatch (_type, _payload) {

    try {
      // actionSubscribers 的前置处理器
      this._actionSubscribers
        .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    } catch (e) {
      if (__DEV__) {
        console.warn(`[vuex] error in before action subscribers: `)
        console.error(e)
      }
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return new Promise((resolve, reject) => {
      result.then(res => {
        try {
          // actionSubscribers 的后置处理器
          this._actionSubscribers
            .filter(sub => sub.after)
            .forEach(sub => sub.after(action, this.state))
        } catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in after action subscribers: `)
            console.error(e)
          }
        }
        resolve(res)
      }, error => {
        try {
          // actionSubscribers 的异常处理器
          this._actionSubscribers
            .filter(sub => sub.error)
            .forEach(sub => sub.error(action, this.state, error))
        } catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in error action subscribers: `)
            console.error(e)
          }
        }
        reject(error)
      })
    })
  }
}

function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn)
  }
  return () => { // 返回一个用于移除插件的闭包
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}
```

























