# WebAssembly尝鲜

- [rust安装教程及第一个 WebAssembly Demo](https://juejin.cn/post/7156250334082367496)

## 通过模板创建第一个 wasm 程序

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git
# 或者使用
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
```

```
C:\Users\adminc\Desktop\123>cargo generate --git https://github.com/rustwasm/wasm-pack-template
 Project Name: first-wasm # 输入后会提示填写项目名称
 Destination: C:\Users\adminc\Desktop\123\wasm2 ...
 project-name: first-wasm ...
 Generating template ...
[ 1/12]   Done: .appveyor.yml
[ 2/12]   Done: .gitignore
[ 3/12]   Done: .travis.yml
[ 4/12]   Done: Cargo.toml
[ 5/12]   Done: LICENSE_APACHE
[ 6/12]   Done: LICENSE_MIT
[ 7/12]   Done: README.md
[ 8/12]   Done: src\lib.rs
[ 9/12]   Done: src\utils.rs
[10/12]   Done: src
[11/12]   Done: tests\web.rs
[12/12]   Done: tests
Moving generated files into: `C:\Users\adminc\Desktop\123\wasm2`...
 Initializing a fresh Git repository
 Done! New project created C:\Users\adminc\Desktop\123\wasm2
```

### lib.rs


``` rs
mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, first-wasm!");
}
```

## 构建 web 使用的 wasm


```
# 构建 web 可以直接使用的包
wasm-pack build -t web
```
构建后包被输出到了 `pkg` 文件夹下


```
- pkg
    - .gitignore
    - first_wasm.d.ts
    - first_wasm.js
    - first_wasm_bg.wasm
    - first_wasm_bg.wasm.d.ts
    - package.json
    - README.md
```

### 在 pkg 下新建 index.html 测试

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>

<script type="module">
    import init, {greet} from "./first_wasm.js"
    async function doit(params) {
        await init()
        greet()
    }

    doit()
</script>
</html>
```

打开网页会在页面上弹出 `Hello, first-wasm!`

### build 配置

- 直接使用 `wasm-pack build` 进行构建，等同于 `wasm-pack build -t bundler` 他用来发布到 `npm` 然后使用
- 使用 `wasm-pack build -t web` 构建可以直接在在网页中使用

```
C:\Users\adminc\Desktop\123\wasm2>wasm-pack build --help
wasm-pack-build 0.10.3
🏗️  build your npm package!

USAGE:
    wasm-pack build [FLAGS] [OPTIONS] [ARGS]

FLAGS:
        --debug            Deprecated. Renamed to `--dev`
        --dev              Create a development build. Enable debug info, and disable optimizations
        --no-typescript    By default a *.d.ts file is generated for the generated JS file, but this flag will disable
                           generating this TypeScript file
    -h, --help             Prints help information
        --profiling        Create a profiling build. Enable optimizations and debug info
        --release          Create a release build. Enable optimizations and disable debug info
    -V, --version          Prints version information

OPTIONS:
    -m, --mode <mode>            Sets steps to be run. [possible values: no-install, normal, force] [default: normal]
    -d, --out-dir <out-dir>      Sets the output directory with a relative path [default: pkg]
        --out-name <out-name>    Sets the output file names. Defaults to package name
    -s, --scope <scope>          The npm scope to use in package.json, if any
    -t, --target <target>        Sets the target environment. [possible values: bundler, nodejs, web, no-modules]
                                 [default: bundler]

ARGS:
    <path>                The path to the Rust crate. If not set, searches up the path from the current directory
    <extra-options>...    List of extra options to pass to `cargo build`
```

