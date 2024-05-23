# webpack笔记

[webpack](https://webpack.docschina.org/concepts/) 是一个用于现代 `JavaScript` 应用程序的 静态模块打包工具。当 `webpack` 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容

## loader

[loader](https://webpack.docschina.org/concepts/loaders/) 用于对模块的源代码进行转换。`loader` 可以使你在 `import` 或 "`load(加载)`" 模块时预处理文件。因此，`loader` 类似于其他构建工具中“任务(`task`)”，并提供了处理前端构建步骤的得力方式。`loader` 可以将文件从不同的语言（如 `TypeScript`）转换为 `JavaScript` 或将内联图像转换为 `data URL`。`loader` 甚至允许你直接在 `JavaScript` 模块中 `import CSS` 文件！

`loader` 本质上是导出为函数的 `JavaScript` 模块。[loader runner](https://github.com/webpack/loader-runner) 会调用此函数，**然后将上一个 `loader` 产生的结果或者资源文件传入进去**。函数中的 `this` 作为上下文会被 `webpack` 填充，并且 `loader runner` 中包含一些实用的方法，比如可以使 `loader` 调用方式变为异步，或者获取 `query` 参数。

起始 `loader` 只有一个入参：资源文件的内容。`compiler` 预期得到最后一个 `loader` 产生的处理结果。这个处理结果应该为 `String` 或者 `Buffer`（能够被转换为 `string`）类型，代表了模块的 `JavaScript` 源码。另外，还可以传递一个可选的 `SourceMap` 结果（格式为 `JSON` 对象）。

如果是单个处理结果，可以在 `同步模式` 中直接返回。如果有多个处理结果，则必须调用 `this.callback()`。在 `异步模式` 中，必须调用 `this.async()` 来告知 `loader runner` **等待异步结果**，它会返回 `this.callback()` 回调函数。随后 `loader` 必须返回 `undefined` 并且调用该回调函数

- **`同步loader`** 无论是 `return` 还是 `this.callback` 都可以同步地返回转换后的 `content` 值
- **`异步loader`** 使用 `this.async` 来获取 `callback` 函数
- **`raw loader`** 默认情况下，资源文件会被转化为 `UTF-8` 字符串，然后传给 `loader`。通过设置 `raw` 为 `true`，`loader` 可以接收原始的 `Buffer`，例如下面的 `ImageLoader`

### 配置 loader

[module.rules](https://webpack.docschina.org/concepts/loaders/#configuration) 允许你在 `webpack` 配置中指定多个 `loader`。 这种方式是展示 `loader` 的一种简明方式，并且有助于使代码变得简洁和易于维护。同时让你对各个 `loader` 有个全局概览：

`loader` 从右到左（或从下到上）地取值(evaluate)/执行(execute)。在下面的示例中，从 `sass-loader` 开始执行，然后继续执行 `css-loader`，最后以 `style-loader `为结束。

``` javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
};
```


### 编写 loader

[链接](https://webpack.docschina.org/contribute/writing-a-loader/) `loader` 是导出为一个函数的 `node` 模块。该函数在 `loader` 转换资源的时候调用。给定的函数将调用 `Loader API`，并通过 `this` 上下文访问。


``` javascript
// 最简单的一个loader
function FirstLoader(source) {
    return source
}
module.exports = {FirstLoader}
```

### 编写一个最简单的 ImageLoader

这个 `loader` 的作用是处理打包过程中的 `png` 图片
1.  生成图片
2. 导出实际的图片路径


``` javascript

module.exports = function (source) {
    const publicPath = './ahsjkdhaj.png'
    // this 上下文中有许多方法提供使用 this.emitfile 产生一个文件
    // https://webpack.docschina.org/api/loaders/#thisemitfile
    this.emitFile('ahsjkdhaj.png', source)
    // 这里参照的 https://github.com/webpack-contrib/file-loader/blob/master/src/index.js#L87
    return `module.exports = "${publicPath}";`;
}

module.exports.raw = true

```

## plugin

**插件** 是 `webpack` 的 [支柱](https://github.com/webpack/tapable) 功能。`Webpack` 自身也是构建于你在 `webpack` 配置中用到的 **相同的插件系统** 之上！

插件目的在于解决 [loader](https://webpack.docschina.org/concepts/loaders) 无法实现的其他事。Webpack 提供很多开箱即用的 [插件](https://webpack.docschina.org/plugins/)。

### compiler

[Compiler](https://webpack.docschina.org/api/compiler-hooks/) 模块是 `webpack` 的主要引擎，它通过 `CLI` 或者 `Node API` 传递的所有选项创建出一个 `compilation` 实例。 它扩展自 `Tapable` 类，用来注册和调用插件。 大多数面向用户的插件会首先在 `Compiler` 上注册。

在为 `webpack` 开发插件时，你可能需要知道每个钩子函数是在哪里调用的。想要了解这些内容，请在 `webpack` 源码中搜索 `hooks.<hook name>.call`。

``` javascript
compiler.hooks.<hookName>.tap/tapAsync/tapPromise(PluginName, cb)
```


### compilation

[Compilation](https://webpack.docschina.org/api/compilation-hooks/) 模块会被 `Compiler` 用来创建新的 `compilation` 对象（或新的 `build` 对象）。` compilation` 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(`literal compilation`)。 在编译阶段，模块会被加载(`load`)、封存(`seal`)、优化(`optimize`)、 分块(`chunk`)、哈希(`hash`)和重新创建(`restore`)。

`Compilation` 类扩自 `Tapable`。 可以按照 `compiler` 钩子的相同方式来调用 `tap`

和 `compiler` 用法相同，取决于不同的钩子类型， 所以也可以在某些钩子上访问 `tapAsync` 和 `tapPromise`

### 编写 plugin

`webpack` 插件是一个具有 `apply` 方法的 `JavaScript` 对象。`apply` 方法会被 `webpack compiler` 调用，**调用 `apply` 时会传入 `compiler`** ，并且在 整个 编译生命周期都可以访问 `compiler` 对象。


``` javascript

function FileListPlugin(option) {
    this.option = option
}

/**
 *
 * @param {import('webpack').Compiler} compiler
 */
FileListPlugin.prototype.apply = function (compiler) {

    /** compiler.hooks.<hookName>.tap/tapAsync/tapPromise(PluginName, cb) */
    compiler.hooks.compilation.tap('FileListPlugin', function (compilation, compilationParams) {
        // https://webpack.docschina.org/api/compilation-hooks/#processassets
        compilation.hooks.processAssets.tap({
            name: 'FileListPlugin',
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE, // 整理现有 asset 列表
        }, (assets) => {

            const entriesAssets = Object.entries(assets)

            if(entriesAssets.length > 0) {
                let content = '\tfilename\tsize\n\n'

                entriesAssets.forEach(([filename, source]) => {
                    content += `\t${filename}\t${source.size()}\n\n`
                })

                compilation.emitAsset('dist-info.md', new compiler.webpack.sources.RawSource(content))
            }
        })
    })

}

module.exports = {
    FileListPlugin
}

```
