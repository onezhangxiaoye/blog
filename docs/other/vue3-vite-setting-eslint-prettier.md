# vue3+vite配置eslint&prettier

## 参照
1. [vite+vue3+ts+eslint+prettier 掘金](https://juejin.cn/post/6915378605459521543)
2. [prettier官网-options](https://prettier.io/docs/en/options.html)
3. [ts 代码检查](https://ts.xcatliu.com/engineering/lint.html)
4. [eslint-plugin-vue Available rules](https://eslint.vuejs.org/rules/)
5. [坑-Eslint Vue 3 Parsing error: '>' expected.eslint](https://stackoverflow.com/questions/66597732/eslint-vue-3-parsing-error-expected-eslint)
6. [eslint-规则](https://eslint.org/docs/rules/)
7. [解决eslint和prettier的规则冲突](https://prettier.io/docs/en/install.html#eslint-and-other-linters)

> 2019 年 1 月，TypeScirpt 官方决定全面采用 ESLint 作为代码检查的工具，并创建了一个新项目 typescript-eslint，提供了 TypeScript 文件的解析器 @typescript-eslint/parser 和相关的配置选项 @typescript-eslint/eslint-plugin 等。 [摘抄自](https://ts.xcatliu.com/engineering/lint.html)



## 创建一个 vite + vue3 + ts 项目

```
npm init @vitejs/app vite-eslint
```

## 安装 eslint 依赖
```
npm i typescript eslint eslint-plugin-vue typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

## eslint 相关配置说明

### 环境配置 env
**一个环境定义了一组预定义的全局变量。可用的环境包括**

- 一个环境定义了一组预定义的全局变量。可用的环境包括
- `browser` - 浏览器环境中的全局变量。
- `node` - Node.js 全局变量和 Node.js 作用域。
- `commonjs` - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
- `shared-node-browser` - Node.js 和 Browser 通用全局变量。
- `es6` - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
- `worker` - Web Workers 全局变量。
- `amd` - 将 require() 和 define() 定义为像 amd 一样的全局变量。
- `mocha` - 添加所有的 Mocha 测试全局变量。
- `jasmine` - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
- `jest` - Jest 全局变量。
- `phantomjs` - PhantomJS 全局变量。
- `protractor` - Protractor 全局变量。
- `qunit` - QUnit 全局变量。
- `jquery` - jQuery 全局变量。
- `prototypejs` - Prototype.js 全局变量。
- `shelljs` - ShellJS 全局变量。
- `meteor` - Meteor 全局变量。
- `mongo` - MongoDB 全局变量。
- `applescript` - AppleScript 全局变量。
- `nashorn` - Java 8 Nashorn 全局变量。

### [插件相关 plugins](https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins)

- `ESLint` 支持使用第三方插件。在使用插件之前，你必须使用 `npm` 安装它。
- 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 `eslint-plugin-` 前缀
- `ESLint` 将加载与用户通过从项目 Node 交互解释器运行 (`'eslint-plugin-pluginname'`) 获得的相同的插件

### [规则配置 rules](https://cn.eslint.org/docs/user-guide/configuring#using-configuration-files)

- 配置定义在插件中的一个规则的时候，你必须使用 插件名/规则ID 的形式
- `"rules": {"plugin1/rule1": "error"}`
- 规则 `plugin1/rule1` 表示来自插件 `plugin1` 的 `rule1` 规则
- 当指定来自插件的规则时，确保删除 `eslint-plugin-` 前缀。`ESLint` 在内部只使用没有前缀的名称去定位规则

### [异常等级配置](https://cn.eslint.org/docs/user-guide/configuring#configuring-rules)

- "`off`" 或 0 - 关闭规则
- "`warn`" 或 1 - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- "`error`" 或 2 - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

### [extend 规则继承](https://cn.eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin)

- `plugins` 属性值 可以省略包名的前缀 `eslint-plugin-`。
- `extends` 属性值可以由以下组成：
- ·  `plugin:`
- ·  包名 (省略了前缀，比如，react)
- ·  /
- ·  配置名称 (比如 `recommended`)


### .eslintrc.js 配置规则文件

``` javascript
// 需要安装依赖:  npm i eslint-define-config
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
    root: true,
    /* 指定如何解析语法。*/
    parser: 'vue-eslint-parser',
    /* 优先级低于parse的语法解析配置 */
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    // https://eslint.bootcss.com/docs/user-guide/configuring#specifying-globals
    globals: {
        Nullable: true,
    },
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        // 'plugin:vue/vue3-recommended',
        // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.

        'plugin:vue/vue3-recommended',
        // 此条内容开启会导致 全局定义的 ts 类型报  no-undef 错误，因为
        // https://cn.eslint.org/docs/rules/
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // typescript-eslint推荐规则,
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        // 'no-undef': 'off',
        // 禁止使用 var
        'no-var': 'error',
        semi: 'off',
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            },
        ],
        // 关闭此规则 使用 prettier 的格式化规则， 感觉prettier 更加合理，
        // 而且一起使用会有冲突
        'vue/max-attributes-per-line': ['off'],
        // 强制使用驼峰命名
        'vue/component-name-in-template-casing': [
            'error',
            'PascalCase',
            {
                registeredComponentsOnly: false,
                ignores: [],
            },
        ],
    },
})
```

### .eslintignore 配置 eslint 忽略文件

```

*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
.eslintrc.js
prettier.config.js
/src/mock/*

```

## 安装 prettier 依赖

```
npm i prettier eslint-config-prettier eslint-plugin-prettier -D
```
### .prettierrc.js 配置规则文件

``` javascript
module.exports = {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 4 个空格缩进
    tabWidth: 4,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾不需要有分号
    semi: false,
    // 使用单引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 尾随逗号
    trailingComma: 'all',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf',
}

```


### .prettierignore 配置 prettier 忽略文件

```
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*

```

## 关于 esint + prettier 在 webstorm 中的配置

1. `File | Settings | Languages & Frameworks | JavaScript | Code Quality Tools | ESLint`
   中设置 `Automatic ESLint configuration`
   再设置 `Run eslint --fix on save`

2. `File | Settings | Languages & Frameworks | JavaScript | Prettier`
   中设置 `Run for files` 为 `{**/*,*}.{js,ts,jsx,tsx,vue}`
   其中 `On code reformat` 和 `On save` 不需要勾选，否则会和eslint 有冲突 （可能配置有点问题）

3. 在 `webstorm` 若使用 `ctrl + alt + L` 进行格式化代码，
   很可能会导致 `eslint` 检查不通过，不需要在意，只使用 `eslint` 的代码格式化就好了
