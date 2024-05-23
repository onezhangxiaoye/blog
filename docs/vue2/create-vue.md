# 基于脚手架搭建 Vue 的多种方式

`vue-cli` 基于 `webpack`，而 `create-vue` 基于 `vite` ，若需要基于 `vite` 创建 `vue2.x` 的项目推荐使用 `create-vue`

## create-vue

[官网链接](https://github.com/vuejs/create-vue)

创建基于 `vite` 的 `vue` 项目

```
npm create vue@3
```

或者使用下面命令创建基于 `vue2.x` 的项目


```
npm create vue@2
```

## vite

[官网链接](https://cn.vitejs.dev/guide/)

使用 NPM:

```
npm create vite@latest
```

使用 PNPM:

```
pnpm create vite
```

使用 `pnpm` 创建 `vue3 + ts` 的项目


```
pnpm create vite my-vue-app --template vue
```

## vue-cli

[官网链接](https://cli.vuejs.org/zh/)

安装：


```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```


创建一个项目：


```
vue create my-project
# OR
vue ui
```
