
# monorepo

[monorepo](https://en.wikipedia.org/wiki/Monorepo) 是一种软件开发策略，把多个项目放在同一个仓库下进行管理

## 优势

- 易于代码的重用
- 易于依赖管理
- 利于跨团队协作

## 缺点

- 项目的版本缺失
- 缺乏每个项目的权限控制
- 默认需要更多的存储空间

## 基于 pnpm 的 monorepo

[pnpm](https://pnpm.io/zh/) 快速的，节省磁盘空间的包管理工具。

- 节约磁盘空间并提升安装速度
    -  如果你用到了某依赖项的不同版本，只会将不同版本间有差异的文件添加到仓库
    -  所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会 `硬链接` 到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。
-  创建非扁平化的 `node_modules` 文件夹
    -  默认情况下，pnpm 使用软链的方式将项目的直接依赖添加进模块文件夹的根目录


## pnpm-workspace.yaml

`pnpm-workspace.yaml` 定义了 工作空间 的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

> 即使使用了自定义目录位置通配符，根目录下的package目录也总是被包含

``` yaml
packages:
  # 所有包在 packages/ 的直接子目录内
  - ''
  # 所有包在 components/ 的子目录内
  - 'components/**'
  # 排除 test 目录中的包
  - '!**/test/**'
```

## 项目文件树

```
- monorepo-test
    - client
        - v3-demo
    - packages
        - utils
            - array
                - index.js
                - package.json
            - index.js
            - package.json
    - web
        - components
            - button
                - index.js
                - package.json
            - index.js
            - package.json
    - package.json
    - pnpm-workspace.yaml
```

## pnpm-workspace.yaml 文件配置

- `packages/*` 和 `packages/**` 的区别
    - `packages/*` 他的直接子目录会作为单独的项目进行检测，**比如上面的 `packages/utils/array` 就不会被检测到**
    - `web/**` 他下级的所有目录都会作为单独的项目进行检测，**比如上面的 `web/components/button` 就会被检测到**

```
packages:
  - "packages/*"
  - "client/*"
  - "web/**"
```

## monorepo-test/web/components/button/package.json

- 在 `package.json` 中有三个比较重要的配置
    - `name` 这就是安装时包的名称，尽量不使用用文件夹名称，这样容易和第三方的包名冲突，类似 `vue3` 源码更加倾向于用 `@monorepo-test/button` 这种方式命名
    - `version` 是包的版本
    - `main` 引入包的入口

``` json
{
  "name": "@monorepo-test/button",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash-es": "^4.17.21"
  }
}

```

## 本地依赖的安装


```
# 在根目录安装到指 定package_name 下
pnpm add <本地 package_name / npm package_name> --filter <安装到此 package_name 下>

# 不使用 --filter/-F 先进入到指定目录
pnpm add <本地 package_name / npm package_name>

# 在项目下任意目录安装到根目录下 --workspace/-w
pnpm add <npm package_name> -w
```
