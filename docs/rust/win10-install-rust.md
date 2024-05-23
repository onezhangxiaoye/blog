# win10安装rust

- [安装教程及第一个WebAssemblyDemo](https://juejin.cn/post/7156250334082367496)
- win10 安装包下载 https://www.rust-lang.org/zh-CN/tools/install
- 安装后的路径 `C:\Users\adminc\.cargo` ， 安装后可能需要手动配置 `path 环境变量`


## 记录一点问题

### wasm-pack 安装出现的问题

```
# 安装编译打包工具
cargo install wasm-pack
```

出现了下面的报错

```
error: failed to run custom build command for `openssl-sys v0.9.65`

Caused by:
  process didn't exit successfully: `C:\Users\vilgo\AppData\Local\Temp\cargo-install2J8ZNz\release\build\openssl-sys-932395a164949059\build-script-main` (exit code: 101)
  --- stdout
  cargo:rustc-cfg=const_fn
  cargo:rerun-if-env-changed=X86_64_PC_WINDOWS_MSVC_OPENSSL_NO_VENDOR
  X86_64_PC_WINDOWS_MSVC_OPENSSL_NO_VENDOR unset
  cargo:rerun-if-env-changed=OPENSSL_NO_VENDOR
  OPENSSL_NO_VENDOR unset
  openssl-src: Enable the assembly language routines in building OpenSSL.
  running "perl" "./Configure" "--prefix=C:\\Users\\vilgo\\AppData\\Local\\Temp\\cargo-install2J8ZNz\\release\\build\\openssl-sys-a51d272dcebf1fc5\\out\\openssl-build\\install" "no-dso" "no-shared" "no-ssl3" "no-unit-test" "no-comp" "no-zlib" "no-zlib-dynamic" "no-md2" "no-rc5" "no-weak-ssl-ciphers" "no-camellia" "no-idea" "no-seed" "no-engine" "VC-WIN64A"

  --- stderr
  thread 'main' panicked at 'called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "Det går inte att hitta filen." }', C:\Users\vilgo\.cargo\registry\src\github.com-1ecc6299db9ec823\openssl-src-111.15.0+1.1.1k\src\lib.rs:469:39
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
error: failed to compile `wasm-pack v0.10.0`, intermediate artifacts can be found at `C:\Users\vilgo\AppData\Local\Temp\cargo-install2J8ZNz`

Caused by:
  build failed
```

[解决办法](https://stackoverflow.com/questions/68646684/cant-install-cargo-wasm-pack)，直接官网下载 [wasm-pack-init.exe](https://rustwasm.github.io/wasm-pack/installer/#) 进行安装

### cargo-generate 的安装

```
# 安装编译打包工具
cargo install cargo-generate
```

由于网络问题，`cargo-generate` 可能不容易安装成功，可以仓库直接下载 https://github.com/cargo-generate/cargo-generate/releases  `cargo-generate-v0.18.1-x86_64-pc-windows-msvc.tar.gz` ，解压后把 `cargo-generate.exe` 放到 `C:\Users\adminc\.cargo\bin` 下即可 
