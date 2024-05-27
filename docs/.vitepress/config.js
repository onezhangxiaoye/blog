import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'ZhangXiaoYe',
    description: 'ZhangXiaoYe的文档记录',
    base: '/',
    lastUpdated: true,
    locales: {
        // 默认中文显示
        root: {
            label: '中文',
            lang: 'zh'
        },
    },
    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                href: '/blog/images/cai-32.png'
            }
        ]
    ],
    themeConfig: {
        logo: '/images/cai-32.png',
        // 右侧目录显示层级 h2 - h3
        outline: [2, 3],
        nav: [
            {
                text: 'Home',
                link: '/'
            },
            {
                text: '实验田',
                link: 'https://cai12317.gitee.io/code-example'
            },
            {
                text: 'CodePen',
                link: 'https://codepen.io/your-work'
            },
            {
                text: 'Github',
                link: 'https://github.com/onezhangxiaoye'
            },
            {
                text: 'Gitee',
                link: 'https://gitee.com/cai12317/blog/tree/vuePress-dev/'
            },
            {
                text: 'MD-Nice',
                link: 'https://mdnice.com/'
            },
        ],
        sidebar: [
            {
                text: '其他',
                // 手风琴样式是否展开
                collapsed: false,
                items: [
                    {
                        text: '前端知识点',
                        link: '/other/web-knowledge',
                    },
                    {
                        text: 'markdown技巧',
                        link: '/other/markdown',
                    },
                    {
                        text: 'webstorm无法识别项目alias',
                        link: '/other/webstorm-alias',
                    },
                    {
                        text: 'vue3+vite配置eslint&prettier',
                        link: '/other/vue3-vite-setting-eslint-prettier',
                    },
                    {
                        text: '前端水印实现与包构建发布',
                        link: '/other/ts-rollup-build',
                    },
                    {
                        text: '正则表达式速查',
                        link: '/other/regex',
                    },
                ]
            },
            {
                text: '服务器',
                collapsed: false,
                items: [
                    {
                        text: 'linux笔记',
                        link: '/server/linux',
                    },
                    {
                        text: 'nginx笔记',
                        link: '/server/nginx',
                    },
                ]
            },
            {
                text: '笔记',
                collapsed: false,
                items: [
                    {
                        text: '随便记录一点东西',
                        link: '/note/record-anything',
                    },
                    {
                        text: '小白菜的烂笔头',
                        link: '/note/cai-cai',
                    },
                    {
                        text: 'svg笔记',
                        link: '/note/svg',
                    },
                ]
            },
            {
                text: 'css相关',
                collapsed: false,
                items: [
                    {
                        text: 'css动画',
                        link: '/css/css-animation',
                    },
                    {
                        text: 'css渐变',
                        link: '/css/css-gradient',
                    },
                    {
                        text: 'css能实现的高级玩意儿',
                        link: '/css/css-demo-well',
                    },
                    {
                        text: 'css语法规则',
                        link: '/css/css-syntax-rules',
                    },
                    {
                        text: 'css-flex-弹性布局',
                        link: '/css/css-flex',
                    },
                    {
                        text: 'css-grid-网格布局',
                        link: '/css/css-grid',
                    },
                    {
                        text: 'sass常用语法笔记',
                        link: '/css/sass',
                    },
                    {
                        text: 'less常用语法笔记',
                        link: '/css/less',
                    },
                ]
            },
            {
                text: 'js相关',
                collapsed: false,
                items: [
                    {
                        text: 'js原型链',
                        link: '/js/js-prototype',
                    },
                    {
                        text: 'event-loop实验',
                        link: '/js/js-eventLoop',
                    },
                    {
                        text: 'web-worker',
                        link: '/js/web-worker',
                    },
                ]
            },
            {
                text: 'vue3',
                collapsed: false,
                items: [
                    {
                        text: 'vue3_diff算法',
                        link: '/vue3/vue3-diff',
                    },
                ]
            },
            {
                text: 'vue2',
                collapsed: false,
                items: [
                    {
                        text: '基于脚手架搭建vue的多种方式',
                        link: '/vue2/create-vue',
                    },
                    {
                        text: '深入vue2响应式原理',
                        link: '/vue2/vue2-reactive-theory',
                    },
                    {
                        text: '手写vue-diff进行dom更新',
                        link: '/vue2/write-vue-diff',
                    },
                    {
                        text: 'vue-key不写或者使用index',
                        link: '/vue2/vue-disabled-key-or-use-index',
                    },
                    {
                        text: 'vue2-diff',
                        link: '/vue2/vue2.0-diff',
                    },
                    {
                        text: 'vue深度选择器',
                        link: '/vue2/vue-scoped-selector',
                    },
                    {
                        text: 'vue从入口到响应式转换到依赖收集',
                        link: '/vue2/vue-entry-reactive-depend-collect',
                    },
                    {
                        text: 'vue的$nextTick',
                        link: '/vue2/vue-$nextTick',
                    },
                    {
                        text: 'vue依赖收集',
                        link: '/vue2/vue-depend-collect',
                    },
                    {
                        text: 'vue触发setter通知更新',
                        link: '/vue2/vue-setter-notice-update',
                    },
                    {
                        text: 'computed源码分析',
                        link: '/vue2/computed-sound-code',
                    },
                    {
                        text: 'watch源码分析',
                        link: '/vue2/watch-sound-code',
                    },
                    {
                        text: '为什么说computed会被缓存',
                        link: '/vue2/computed-catch',
                    },
                    {
                        text: 'vue-router@3.5.3源码解析',
                        link: '/vue2/vue-router',
                    },
                    {
                        text: 'vuex@3.6.2源码解析',
                        link: '/vue2/vuex3.6.2',
                    },
                    {
                        text: 'v-if和v-for优先级',
                        link: '/vue2/v-if-v-for',
                    },
                    {
                        text: 'vue2组件渲染逻辑',
                        link: '/vue2/vue2-render-process',
                    },
                ]
            },
            {
                text: 'canvas',
                collapsed: false,
                items: [
                    {
                        text: 'canvas笔记',
                        link: '/canvas/canvas-api',
                    },
                ]
            },
            {
                text: '浏览器相关',
                collapsed: false,
                items: [
                    {
                        text: '浏览器缓存',
                        link: '/browser/browser-catch',
                    },
                    {
                        text: 'v8垃圾回收',
                        link: '/browser/gc',
                    },
                ]
            },
            {
                text: '基础知识',
                collapsed: false,
                items: [
                    {
                        text: '基础算法',
                        link: '/base/arithmetic',
                    },
                    {
                        text: '位运算的使用',
                        link: '/base/bit-operation',
                    },
                ]
            },
            {
                text: 'webpack',
                collapsed: false,
                items: [
                    {
                        text: 'webpack笔记',
                        link: '/webpack/webpack',
                    },
                    {
                        text: 'tapable',
                        link: '/webpack/tapable',
                    },
                ]
            },
            {
                text: '架构相关',
                collapsed: false,
                items: [
                    {
                        text: 'monorepo',
                        link: '/project-manager/monorepo',
                    },
                    {
                        text: 'package-json',
                        link: '/project-manager/package-json',
                    },
                ]
            },
            {
                text: 'Rust',
                collapsed: false,
                items: [
                    {
                        text: 'web-assembly',
                        link: '/rust/web-assembly',
                    },
                    {
                        text: 'win10-install-rust',
                        link: '/rust/win10-install-rust',
                    },
                ]
            },
            {
                text: 'Hugo',
                collapsed: false,
                items: [
                    {
                        text: '使用hugo-theme-dream主题',
                        link: '/hugo/use-hugo-theme-dream',
                    },
                    {
                        text: '使用Hugo',
                        link: '/hugo/use-hugo',
                    },
                ]
            },
        ]
    }
})
