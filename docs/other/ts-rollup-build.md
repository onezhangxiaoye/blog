# 前端水印实现与包构建发布

## 前端水印的实现
- 推荐文章 [掘金-从破解某设计网站谈前端水印(详细教程)](https://juejin.cn/post/6900713052270755847)

基于 `background-image` 的 `url` 支持 `svg`，的背景水印实现。使用一个高宽撑满的 `div` 作为背景载体放在 `body` 下，层级设置为最高，利用 `css` 属性 [pointer-events](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) 保证点击穿透

[代码仓库](https://gitee.com/cai12317/bg-svg-watermark) <br/>
[在线实验](https://cai12317.gitee.io/vite-vue-app-2021-01-13/#/watermark)

### 使用svg实现水印效果
<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
  <g transform="rotate(45,72,72),translate(39,43)">
    <text stroke="rgb(0,0,0)" style="font-weight: normal;font-size: 16px;opacity: 0.5;color: red;" x="9.3828125" y="8">好好学习</text>
    <text stroke="rgb(0,0,0)" style="font-weight: normal;font-size: 16px;opacity: 0.5;color: red;" x="0" y="37">天天向上</text>
  </g>
</svg>


``` html
<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
  <g transform="rotate(45,72,72),translate(39,43)">
    <text stroke="rgb(0,0,0)" style="font-weight: normal;font-size: 16px;opacity: 0.5;color: red;" x="9.3828125" y="8">好好学习</text>
    <text stroke="rgb(0,0,0)" style="font-weight: normal;font-size: 16px;opacity: 0.5;color: red;" x="0" y="37">天天向上</text>
  </g>
</svg>
```

使用 `svg` 显示几行文字是很容易的，但是实际场景中，由于**显示的文字行数、文字大小、字体粗细、期望的文本间距都是不确定的**，而且 `svg` 和我们平常使用的 `html` 是不一样的，不会像流式布局依次排列，所以这些都需要 `js` 去进行计算

### 布局计算

1. 计算文本渲染后的尺寸

``` ts
interface TextDomOptions {
    // 文本大小 默认值：16
    fontSize?: string
    // 文本加粗 默认值：normal
    fontWeight?: string
}

/** 获取文本渲染后的尺寸
 *
 * @param text 文本
 * @param textDomOptions 相关配置
 */
export function getTextSize(text: string, textDomOptions?: TextDomOptions) {
    const {
        fontSize = '16px',
        fontWeight = 'normal',
    } = textDomOptions || {}

    const span = document.createElement('span')
    span.innerText = text
    span.style.fontSize = fontSize
    span.style.fontWeight = fontWeight
    document.body.appendChild(span)
    const rect = span.getBoundingClientRect()
    document.body.removeChild(span)
    return rect
}
```

2. 计算文本布局定位信息，省略了部分代码，可以去代码仓库或查看具体代码，主要逻辑就是获取文本渲染后的尺寸，手动排版，文本旋转
``` ts
class Watermark {
        /** 创建水印，并且渲染到 body 下
         *
         * @param watermarkText
         * @param watermarkOption
         */
        render(watermarkText: string | string[], watermarkOption?: InterfaceWatermarkOptions) {
            watermarkOption = watermarkOption || {}
            this.watermarkOption = watermarkOption

            const {
                rotate = '45',
                opacity = '0.1',
                fontSize = '16px',
                fontWeight = 'normal',
                padding = 20,
                space = 8,
                color = 'rgb(0,0,0)',
            } = watermarkOption

            if(this.watermarkId && document.querySelector('#'+this.watermarkId)) {
                this.removeWatermark()
            }

            const dom = document.createElement('div')
            dom.id = this.createDomId()
            dom.style.width = '100vw'
            dom.style.height = '100vh'
            dom.style.position = 'fixed'
            dom.style.zIndex = '9999'
            dom.style.left = '0'
            dom.style.top = '0'
            dom.style.pointerEvents = 'none'

            if(typeof watermarkText === "string") {
                watermarkText = [watermarkText]
            }

            this.watermarkText = watermarkText

            let bgSetting = {
                height: 0,
                width: 0,
                text: [] as InterfaceText[],
                g: {
                    x: 0,
                    y: 0,
                    centerX: 0,
                    centerY: 0,
                    transform: '',
                },
                contentWidth: 0,
                contentHeight: 0,
                textStyle: '',
            }

            bgSetting = watermarkText.reduce((a, b) => {
                const rect = this.getTextSize(b, watermarkOption)

                a.text.push({
                    x: 0,
                    y: a.contentHeight + space,
                    text: b,
                    width: rect.width,
                })
                a.contentHeight += (rect.height + space)
                a.contentWidth = Math.max(a.contentWidth, rect.width)

                return a
            }, bgSetting)

            // 计算对角线长度
            bgSetting.width = Math.hypot(bgSetting.contentWidth + 2*padding, bgSetting.contentHeight + 2*padding)
            // 高度直接使用对角线长度
            bgSetting.height = bgSetting.width

            // 文本居中
            bgSetting.text.forEach(v => {
                v.x = (bgSetting.contentWidth - v.width) / 2
            })

            // 内容居中
            bgSetting.g.x = (bgSetting.width - bgSetting.contentWidth) / 2
            bgSetting.g.y = (bgSetting.height - bgSetting.contentHeight) / 2
            bgSetting.g.centerX = bgSetting.width/2
            bgSetting.g.centerY = bgSetting.height/2
            bgSetting.g.transform = `rotate(${rotate},${bgSetting.g.centerX},${bgSetting.g.centerY}),translate(${bgSetting.g.x},${bgSetting.g.y})`

            bgSetting.textStyle = `font-weight: ${fontWeight};font-size: ${fontSize};opacity: ${opacity};color: red;`

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bgSetting.width}" height="${bgSetting.height}"><g transform="${bgSetting.g.transform}">${
                bgSetting.text.map(({x, y, text}) => {
                    return `<text stroke="${color}" style="${bgSetting.textStyle}" x="${x}" y="${y}">${text}</text>`
                }).join('')
            }</g></svg>`

            dom.style.backgroundImage = `url('data:image/svg+xml;utf8,${svg}')`

            document.body.appendChild(dom)
            this.watermarkDom = dom

            const observer = this.initObserver()
            observer.observe(dom, Watermark.observerOptions)
            observer.observe(document.body, Watermark.observerBodyOptions)
        }
}
```

3. 简单的防破解处理，使用 MutationObserver 监听节点的删除和属性修改
``` ts
class Watermark {
        /** 初始化响应器
         *  使用 MutationObserver 进行简单的防破解处理
         */
        initObserver() {
            this.observer = new MutationObserver(mutationsList => {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const removedNodes = mutation.removedNodes
                        if(Array.from(removedNodes).some(v => (v as Element).id === this.watermarkId)) {
                            this.resetWatermark()
                        }
                    } else if (mutation.type === 'attributes') {
                        this.resetWatermark()
                    }
                }
            })
            return this.observer
        }
}
```


## typescript 声明文件
开发完成后，为了在 `npm` 安装包后使用时可以获取智能的提示，需要为项目写入 `typescript` 的声明文件。

- 发布声明文件相关的文档 [TypeScript声明文件发布](https://www.tslang.cn/docs/handbook/declaration-files/publishing.html)

> 其实在编写声明文件时有很多不确定，不知道哪些定义需要放到声明文件中，这些可以去看一些开源库的声明文件怎么写的，定义了哪些内容在里面，照着写，比如参照 `vue` 和 `vue-router` 的源码。 特别是在 `webstorm` 中安装包后的使用时，始终无法正常提示，而且还难以加载出来提示。若在 `webstorm` 中无法正常提示，有可能不是你代码的问题，这时候你试着关掉他，然后重新打开就可以正常提示了，或者 移除 `node_modules` 重新安装。后面试了试 `vscode` ，发现在 `webstorm` 无法正常提示的时候他里面可以，但是对比下来 `webstorm` 中提示的内容详细。若试了多种方法都无法正常提示，可能就是代码的问题了。

### package.json

``` json
{
  "name": "bg-svg-watermark",
  "version": "1.0.28",
  "description": "基于backgroundImage的背景水印",
  "directories": {
    "test": "test"
  },
  "scripts": {
    "build": "rollup --config rollup.config.ts" // 构建命令
  },
  "main": "dist/bg-svg-watermark.common.js.js", // 指定 npm 安装时使用的包
  "module": "dist/bg-svg-watermark.es.js",
  "author": {
    "name": "ZhangXiaoYe"
  },
  "license": "ISC",
  "devDependencies": {
    "@rollup/plugin-typescript": "^8.3.0",
    "rollup": "^2.60.2",
    "tslib": "^2.3.1",
    "typescript": "^4.5.2"
  },
  "types": "types/index.d.ts", // 设置 types 属性指向捆绑在一起的声明文件
  "homepage": "https://gitee.com/cai12317/bg-svg-watermark", // 这里会显示到 npm 包首页的 homepage 位置
  "keywords": [ // npm 包首页底部的 keywords 位置
    "bg-svg-watermark",
    "watermark"
  ]
}
```

### index.d.ts
把使用此包时实际需要用到 `class` `function` 等定义在里面就好了

``` ts
export declare interface TextDomOptions {
    // 文本大小 默认值：16
    fontSize?: string
    // 文本加粗 默认值：normal
    fontWeight?: string
}

export declare interface WatermarkOptions extends TextDomOptions{
    // 文本透明度 默认值：0.1
    opacity?: string
    // 旋转角度 默认值：45
    rotate?: string
    // 文本距离外边的 padding 默认值：20
    padding?: number
    // 文本间距 默认值：8
    space?: number
    // 文本颜色 使用16进制颜色会渲染不出来，原因未知 默认值：rgb(0,0,0)
    color?: string
}

/** 获取文本渲染后的尺寸
 *
 * @param text 文本
 * @param textDomOptions 相关配置
 */
export declare interface getTextSize {
    (text: string, textDomOptions?: TextDomOptions): DOMRect
}

/**
 * 水印类
 */
export declare class Watermark {
    // 渲染配置
    watermarkOption?: WatermarkOptions
    // 渲染文本
    watermarkText?: string | string[]
    // 唯一的节点id
    watermarkId?: string
    // 监听器
    observer?: MutationObserver
    // 水印节点
    watermarkDom?: Element

    /** 创建水印，并且渲染到 body 下
     *
     * @param watermarkText
     * @param watermarkOption
     */
    render(watermarkText: string | string[], watermarkOption?: WatermarkOptions): void

    /** 初始化响应器
     *  使用 MutationObserver 进行简单的防破解处理
     */
    initObserver(): void

    /** 获取文本渲染后的尺寸
     *
     * @param text
     * @param watermarkOption
     */
    getTextSize(text: string, watermarkOption?: WatermarkOptions): DOMRect

    /**
     * 创建水印dom的唯一id
     */
    createDomId(): string

    /**
     * 重置水印
     */
    resetWatermark(): void

    /**
     * 移除水印
     */
    removeWatermark(): void
}

```

## 基于 rollup 进行构建

参照：<br/>
[掘金-Rollup打包工具的使用（超详细，超基础，附代码截图超简单）](https://juejin.cn/post/6844904058394771470)<br/>
[rollupjs官网](https://rollupjs.org/guide/en/#configuration-files)

### rollup.config.ts

由于项目是用 `ts` 写的，所以需要安装  `typescript` 相关插件，项目本身比较简单，所以配置就很简单

参照文章中使用的 `rollup-plugin-babel` 但这个包现在已经弃用了，所以选择了推荐的 `@rollup/plugin-babel`

```
npm i --save @rollup/plugin-typescript tslib typescript
```

``` ts
import {defineConfig} from 'rollup'
import typescript from '@rollup/plugin-typescript'
import {terser} from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";

export default defineConfig({
    input: 'src/index.ts', // 定义入口文件
    output: [ // 使用数组指定多个输出
        {
            format: 'iife', // 文件输出类型 iife 包是为了直接在浏览器中使用
            name: 'Watermark', // UMD 导出对应的 Name，或直接放在全局环境下
            file: 'dist/bg-svg-watermark.js', // 文件输出位置及输出的文件名
        },
        {
            format: 'es',
            file: 'dist/bg-svg-watermark.es.js',
        },
        {
            format: 'cjs', // 是通过 npm 安装使用，这里需要在 package.json 的 main 中指定
            file: 'dist/bg-svg-watermark.common.js',
        },
    ],
    plugins: [
        typescript({ // 使用插件
            sourceMap: false,
            tsconfig: './tsconfig.json'
        }),
        // 转换为 es5 代码
        babel({
            exclude: "node_modules/**",
            extensions: ['.js', '.ts'],
        }),
        // 代码压缩
        terser()
    ]
})

```

### build
```
rollup --config rollup.config.ts // 指定配置文件
```


## 包发布
`npm` 登录相关的可以参照此文章：[掘金-从0到1发布一个npm包](https://juejin.cn/post/6844903919106129933)<br/>

## 包更新
每次更新包 需要更新 `package.json` 中的 `version` ，否则会发布失败。可以使用 `npm version 1.0.1` 进行更新，或者直接手动修改  `package.json` 中的 `version`然后再进行 `npm publish` 进行发布。然后在项目中 `npm install package-name` 进行安装，会自动安装最新的包，当然你也可以指定你当前包的版本 `npm install package-name@1.0.1` ，这种情况下若安装失败，你需要等待一下再重新安装，这是包发布后的延迟导致的。若使用 `cnpm` 可能延迟就会更久了
