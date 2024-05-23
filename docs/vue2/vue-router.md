# vue-router 3.5.3 源码解析

## 单页面应用（SPA）
单页 `Web` 应用 `（single page web application，SPA）`，就是只有一张 `Web` 页面的应用，是加载单个 `HTML` 页面并在用户与应用程序交互时动态更新该页面的 `Web` 应用程序，[百度百科](https://baike.baidu.com/item/SPA/17536313?fr=aladdin)。<br/>
`vue` 应用打包后的文件就有一个 `index.html` ，路由跳转都是由 `JS` 完成。

## 前置内容
在解析 `vue-router` 之前，我们需要先了解几个源码中使用到的浏览器关于 `history` 和 `location` 的原生 `Api` 。
### [History.pushState() -- MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)

`pushState`： 向当前浏览器会话的历史堆栈中添加一个状态（`state`），且不会造成 [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 事件调用

### [History.replaceState() -- MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState)

`replaceState`： 修改当前历史记录实体，且不会造成 [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 事件调用

> `pushState` 和 `replaceState` ，在替换 `Url` 后，浏览器不会加载 `URL` 指示的资源，具体可以看 `MDN` 的例子，他们是保证 `Vue` 在路由跳转后，不刷新页面的关键所在

## 从入口开始

平常我们在使用 `vue-router` 时，基本操作如下面代码

``` javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// 注册 VueRouter
Vue.use(VueRouter)

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: function () {
      return import('../views/About.vue')
    }
  }
]

// 创建路由对象
const router = new VueRouter({
  routes,
  mode: 'hash',
})

export default router

```

## 以插件方式注册

``` javascript
var _Vue;

function install (Vue) {
  // 保证 vue-router 只会被注册一次
  if (install.installed && _Vue === Vue) { return }
  // 设置以注册的状态
  install.installed = true;
  // 缓存 Vue
  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    // registerRouteInstance 只有当前路由对应的 vue 实例中才会存在
    // registerRouteInstance 定义在 RouterView 的 render 中
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };
  // 全局混入
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      // 只有在 new Vue 时 $options 中才会传入 router
      if (isDef(this.$options.router)) {
        // 为根实例设置多个路由相关属性
        // 设置根组件实例为 _routerRoot
        this._routerRoot = this;
        // 设置 new Vue 时的路由对象为 _router
        this._router = this.$options.router;
        // 路由对象的初始化操作
        this._router.init(this);
        // 设置 _route 为响应式的，保证后面路由切换时能通知更新，进行重新渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        // 组件的实例化是从父级到子级的，第一个父级就是 根实例
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      // 把当前路由对应的组件实例绑定到此路由对象的 match.instances 上
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  // 在 Vue 的原型上定义 $router $route, 
  // 可以保证每个 vue 实例内都可以 直接通过 this 访问到路由实例
  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  // 注册两个全局组件 RouterLink RouterView
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

VueRouter.install = install;

```

## 实例化路由对象

- **这里主要要注意是 `createMatcher` 和 `router mode`**
1. 初始化路由对象 数据，`hook` 数组
2. 生成匹配器 `matcher`
3. 确定当前的路由模式 `mode`
4. 创建 `history` 对象

``` javascript
// 用户代码
const router = new VueRouter({
  routes,
  mode: 'hash',
})

// 源码
var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  if (process.env.NODE_ENV !== 'production') {
    warn(this instanceof VueRouter, "Router must be called with the new operator.");
  }
  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  // 生成匹配器
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback =
    mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  // 非浏览器环境下，mode 会被强制设置为 abstract
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;
  // 路由的多种模式  history / hash / abstract
  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};
``` 

## 创建匹配器 createMatcher

1. 创建路由 `Map`

``` javascript

function createMatcher (routes, router) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (raw, currentRoute, redirectedFrom) { /** 内容省略 **/ }
  function redirect (record, location) { /** 内容省略 **/ }
  function alias (record, location, matchAs) { /** 内容省略 **/ }
  function _createRoute (record, location, redirectedFrom) { /** 内容省略 **/ }

  return {
    match: match,
    addRoutes: addRoutes
  }
}
```

1. 循环 `routes` 添加路由记录（`addRouteRecord`）
2. 确保通配符路由总是在最后

``` javascript
function createRouteMap (routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // 确保通配符路由总是在最后
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}
```

1. 标准化路由 `path`，**`normalizePath` 处理 `strict为false` `path:'/'` 的路由时，会把他替换为空字符串**
2. 生成路由记录对象 `record`
3. 添加路由对象至 `pathList` `pathMap` `nameMap`，且相同路由 `name` 和 `path` 的不会被重复添加

``` javascript
function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

function normalizePath (path, parent, strict) {
  // 这里的 replace 会使配置为 path:'/' 的 path 为空字符串
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

function addRouteRecord (pathList, pathMap, nameMap, route, parent, matchAs) {
  var path = route.path;
  var name = route.name;
  /** 省略部分代码 **/ 

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  // 标准化地址
  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    // 把 route.component 放到视图的 default
    components: route.components || { default: route.component },
    instances: {},
    enteredCbs: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter, // 路由独享守卫
    meta: route.meta || {},
    props: route.props == null ? {} : route.components ? route.props : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    /** 省略部分代码 **/ 
  }

  // 相同 path 的路由 不会被保存
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
    for (var i = 0; i < aliases.length; ++i) {
      var alias = aliases[i];
       /** 省略部分代码 **/ 
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    }
  }

  if (name) {
    // 相同 name 的记录不会被保存到 nameMap 中
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      // 重复路由name 警告
    }
  }
}
```

## 创建 HashHistory

- 使用一个自执行函数创建了 `HashHistory`，`HTML5History` 也是类似的方法创建的
- 自己实现了 `push` 和 `replace` 否则会导致页面的刷新

``` javascript
var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = createRoute(null, {path: '/'});
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
  this.listeners = [];
};

var HashHistory = /*@__PURE__*/(function (History) {

  function HashHistory (router, base, fallback) {
    History.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History ) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create( History && History.prototype );
  HashHistory.prototype.constructor = HashHistory;
  /** 省略部分代码 **/

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(
      location,
      function (route) {
        pushHash(route.fullPath);
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      },
      onAbort
    );
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(
      location,
      function (route) {
        replaceHash(route.fullPath);
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      },
      onAbort
    );
  };
  /** 省略部分代码 **/
  return HashHistory;
}(History));

```

## 动态添加路由 addRoutes

- `this.matcher` 在 构造函数 `VueRouter` 中被赋值，通过 `createMatcher` 创建
- `createRouteMap` 在上面有代码，其实就是向已经存在的 `pathList, pathMap, nameMap` 中添加数据，然后在以后的路由跳转中能匹配到对应路由

``` javascript
VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

function addRoutes (routes) {
  createRouteMap(routes, pathList, pathMap, nameMap);
}

// 使用方式   使用方式   使用方式
const routes = [
  {
    path: '/about',
    name: 'About',
    component: function () {
      return import('../views/About.vue')
    }
  }
]
// 创建路由对象
const router = new VueRouter({
  routes: [...],
  mode: 'hash',
})

router.addRoutes(routes)
```



## 记录一次页面刚打开到渲染完成的流程

- 基本路由配置

``` javascript
const routes = [
  {
    path: '/about',
    name: 'About',
    component: function () {
      return import('../views/About.vue')
    }
  }
]
// 创建路由对象
const router = new VueRouter({
  routes,
  mode: 'hash',
})
```


1. `new Vue` 之前的流程不考虑了
2. `new Vue` 之后，`Vue-router` 是从 `install` 混入的生命周期函数 `beforeCreate` 内开始的
3. `beforeCreate` 的执行是从父组件的先执行的，第一次执行时就是我们的根组件，这里会执行到 `this._router.init(this)`

``` javascript
function install (Vue) {
  /** 省略部分代码 **/
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });
  /** 省略部分代码 **/
}
```

4. 我们定义的路由模式是 `hash` ，走到 `init` 函数中后，我们需要注意的是 `history.transitionTo` 和 `history.listen`

``` javascript
VueRouter.prototype.init = function init (app /* Vue component instance */) {
  /** 省略部分代码 **/
  var history = this.history;
  if (history instanceof HTML5History || history instanceof HashHistory) {
    var handleInitialScroll = function (routeOrError) {
      var from = history.current;
      var expectScroll = this$1.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll && 'fullPath' in routeOrError) {
        handleScroll(this$1, routeOrError, from, false);
      }
    };
    var setupListeners = function (routeOrError) {
      history.setupListeners();
      handleInitialScroll(routeOrError);
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupListeners,
      setupListeners
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};
```

5. 然后走到了 `transitionTo`
6. 首先进行路由匹配 `this.router.match(location, this.current)`
7. `match` 使用了定义在 `matcher` 中的 `match` 函数，在 `VueRouter` 构造函数实例化时，在 `createMatcher` 内创建了一个闭包 `match`
8. `normalizeLocation` 标准化路由为 `vue-router` 内部可使用的对象
9. 初始情况下 `name` 为 `‘’`
10. `matchRoute` 会通过正则匹配到路由 `path: '/'` 这个路由
11. 创建路由对象 `_createRoute`，由于存在嵌套路由，所以 route.matched 是一个数组，且父路由会排列在子路由的前面

``` javascript
// 创建路由对象
function createRoute (record, location, redirectedFrom, router) {
  var stringifyQuery = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
  }
  return Object.freeze(route)
}

// createMatcher 函数内部创建的函数
function match (raw, currentRoute, redirectedFrom) {
  var location = normalizeLocation(raw, currentRoute, false, router);
  var name = location.name;

  if (name) {
    /** 省略部分代码 **/
  } else if (location.path) {
    location.params = {};
    for (var i = 0; i < pathList.length; i++) {
      var path = pathList[i];
      var record$1 = pathMap[path];
      if (matchRoute(record$1.regex, location.path, location.params)) {
        return _createRoute(record$1, location, redirectedFrom)
      }
    }
  }
  // no match
  return _createRoute(null, location)
}

VueRouter.prototype.match = function match (raw, current, redirectedFrom) {
  return this.matcher.match(raw, current, redirectedFrom)
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
  var this$1 = this;
  var route;
  // catch redirect option https://github.com/vuejs/vue-router/issues/3201
  try {
    // location 在初始情况下是一个
    route = this.router.match(location, this.current);
  } catch (e) { /** 省略部分代码 **/ }
  
  var prev = this.current;
  this.confirmTransition(
    route,
    function () { /** 省略部分代码 **/ },
    function (err) { /** 省略部分代码 **/ }
  );
};
```

12. `resolveQueue` 获取当前 激活的，失活的，更新的路由对象
13. 提取一系列的路由钩子 保存在 `queue` 中，`resolveAsyncComponents` 在这里返回了一个闭包
14. 迭代 `queue` 并执行这些钩子函数
15. 在我们这个例子中没有设置任何一个路由守卫，所以执行的就是 异步组件的加载了
16. `fn(queue[index], function () { step(index + 1); })` 此时执行了 `iterator` 函数，在他内部执行了 `hook` ，此时 `hook = resolveAsyncComponents执行后返回的闭包`

``` javascript
History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  // 当前路由对象
  var current = this.current;
  this.pending = route;
  var abort = function (err) { /** 省略部分代码 **/ };
  var lastRouteIndex = route.matched.length - 1;
  var lastCurrentIndex = current.matched.length - 1;
   /** 省略部分代码 **/ 
  // 获取当前 激活的，失活的，更新的路由对象
  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  // 提取路由钩子，在数组中的顺序，意味着执行顺序
  // 使用 concat 可以有效的去除后面返回值为 undefined 的参数
  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated), // 提取组件内的后置守卫 beforeRouteLeave
    // global before hooks
    this.router.beforeHooks, // 全局的前置守卫
    // in-component update hooks
    extractUpdateHooks(updated), // 提取组件内的更新守卫
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }), // 提取当前激活路由的路由独享守卫 beforeEnter
    // async components  异步组件
    resolveAsyncComponents(activated)
  );

  // 迭代器，
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort(createNavigationCancelledError(current, route))
    }
    try {
      hook(route, current, function (to) {
        // 主要判断当前导航是否允许跳转，跳转是目的地是否改变
        if (to === false) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(createNavigationAbortedError(current, route));
        } else if (isError(to)) {
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort(createNavigationRedirectedError(current, route));
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  // 执行传入的队列 传入一个迭代器 和一个 回调函数
  runQueue(queue, iterator, function () {
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          handleRouteEntered(route);
        });
      }
    });
  });
};

// runQueue 类似一个迭代器，他的内部使用递归实现的，回调函数 cb 只会在最后执行
function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        // fn 只会在每次对应数组元素为 真 时执行
        // 然后把当前数组元素和下一次执行以回调方式传入
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}
```

17. 异步组件加载首先会执行到 `flatMapComponents`
18. `matched` 是一个数组，当他为嵌套路由时，父级路由在前，子路由在后面，`components` 为所有命名路由视图的 `map` ，像例子中的简单使用，`components = {default: {...}}` ，所以 `flatMapComponents` 他执行的就是对路由的所有依赖组件进行加载
19. 当使用懒加载路由时，这里就暂时执行完成了，后面执行的就是  `Vue` 的执行逻辑
20. 然后会进入到根组件的生命周期钩子 `beforeCreate`，（`install` 时 `vue-router` 全局混入的钩子），这个在上面 **以插件方式注册** 中提到过
21. 当主线程代码执行完成，这里其实已经渲染出来了页面，然后异步加载路由现在已经完成，开始执行其中的代码
22. 这里 `match.components[key] = resolvedDef` 把加载到的这个组件 赋值到 `components` 中，这是的 `key` 应该等于 `default`
23. 由于全程只需要加载一个组件，此时就会走到 `next()`，`next` 就是前面 **16点** `iterator` 执行中 `hook` 中传入的回调函数
24. 这个回调函数判断的就是 **当前导航是否允许跳转，跳转是目的地是否改变**

> 比如我们经常会在全局的前置守卫 `beforeEach` 中判断用户是否有权限访问接下来要跳转的目录，没有权限我们使用 `next(false)` 结束路由跳转，判断当前用户是否登录 `next('/login')` 进行重定向

25. 在我们的例子中没有相关的控制，会直接走到最后面的 `next()` ，这里的 `next` 就是 `runQueue` 中传入的回调 `function () { step(index + 1); }`
26. 下一步就是最后一步，执行到了 `cb()`，他是执行 `runQueue` 时传入的回调函数

``` javascript
// 提取路由对象中的 components 并进行加载
function flatMapComponents (matched, fn) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m.instances[key], m, key);
    })
  }))
}

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    // 一个 pending 状态，会在所有的组件加载完成后再执行 next()
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      // 非懒加载的路由不会走到这里面来
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++; // 每一次回调的执行都使 pending +1

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}
```

27. 提取当前激活组件内的守卫，例子中实际没有，这里最后就走到了回调函数中
28. 然后走到了 onComplete ，onComplete 就是执行 confirmTransition 时传入的回调函数

``` javascript
 runQueue(queue, iterator, function () {
    // wait until async components are resolved before
    // extracting in-component enter guards
    // 提取当前激活组件内的守卫
    var enterGuards = extractEnterGuards(activated);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          handleRouteEntered(route);
        });
      }
    });
  });
```

29. 这里比较重要的是执行了 `this$1.updateRoute(route)`，通过代码可以看出，`updateRoute` 中把当前的路由对象指向了新的路由对象，然后执行了 `cb`
30. `cb` 中循环进行了 对当前 `app._route` 进行赋值的操作
31. 由于在最开始时混入的生命周期钩子中，有这样一行代码 `Vue.util.defineReactive(this, '_route', this._router.history.current);`，给 `_route` 转换为了响应式的对象 所以这里就触发了 `vue` 的 `set` 进行通知更新

``` javascript
History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
  var this$1 = this;
  /** 省略部分代码 **/ 

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  this.current = route;
  this.cb && this.cb(route);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
  var this$1 = this;
  var route;
  // catch redirect option https://github.com/vuejs/vue-router/issues/3201
  try {
    // location 在初始情况下是一个
    route = this.router.match(location, this.current);
  } catch (e) { /** 省略部分代码 **/ }
  
  var prev = this.current;
  this.confirmTransition(
    route,
    function () { 
      this$1.updateRoute(route);
      onComplete && onComplete(route);
      this$1.ensureURL();
      // 执行全局后置路由守卫
      this$1.router.afterHooks.forEach(function (hook) {
        hook && hook(route, prev);
      });

      // fire ready cbs once
      if (!this$1.ready) {
        this$1.ready = true;
        this$1.readyCbs.forEach(function (cb) {
          cb(route);
        });
      }
    },
    function (err) { /** 省略部分代码 **/ }
  );
};
```

32. 后面，在第一次时设置了一个 `popstate` 监听器；执行全局后置路由守卫

``` javascript
var handleRoutingEvent = function () {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === this$1._startLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    };
    window.addEventListener('popstate', handleRoutingEvent);
```


