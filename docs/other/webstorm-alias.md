# webstorm无法识别项目alias

在 `webstorm` 中经常拉完项目后无法识别项目中的 alias 的情况，先可以试试 `setting/Languages & Frameworks/JavaScript/Webpack` 设置为 `Automatically` ，先看 `webstorm` 能否自动识别出配置，若不行再参照下面两个方法

## 非 ts 项目中 webstorm 无法识别 alias

1. 项目根目录下创建一个 `webpack.config.js`
2. 在 `setting/Languages & Frameworks/JavaScript/Webpack` 设置为 `Manually` 然后引入此配置

> 参考：[在 WebStorm 中，配置能够识别 Vue CLI 3 创建的项目的别名 alias @](https://juejin.cn/post/6844903802185891848)

``` javascript

const {resolve} = require('path')

module.exports = {
    resolve: {
        // 处理路径无后缀的情况
        extensions: ['.js', '.json', '.vue'],
        // 此配置和 vue.config.js 中的保持一致
        alias: {
            "@": resolve(__dirname, './src')
        }
    }
}

```

## ts 项目中 webstorm 无法识别 alias

1. 在 `tsconfig.json` 中增加配置
2. `setting/Languages & Frameworks/JavaScript/Webpack` 设置为 `Automatically` 即可

> 参考：[How can make TypeScript in WebStorm to parse alias of webpack?](https://stackoverflow.com/questions/47943466/how-can-make-typescript-in-webstorm-to-parse-alias-of-webpack)

``` json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "types": ["vite/client"],
    // 主要是下面这两行代码
    // 主要是下面这两行代码
    // 主要是下面这两行代码
    // 放在 compilerOptions 下
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}

```
