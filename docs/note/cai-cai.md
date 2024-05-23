# 好记性不如烂骨头

<!--more-->

## 日常Git提交规范
[规范参照](https://github.com/jiayisheji/blog/issues/12)

- `build`:影响构建系统或外部依赖关系的更改（示例范围：gulp, broccoli, npm）
- `ci`: 更改我们的配置文件和脚本（示例范围：Travis, Circle, BrowserStack, SauceLabs）
- `docs`: 仅文档更改，比如README, CHANGELOG, CONTRIBUTE等等
- `feat`: 一个新功能
- `fix`: 一个错误修复
- `perf`: 一个改进性能的代码更改，比如提升性能、体验
- `refactor`: 代码更改，既不修复错误也不添加功能
- `style`: 不改变代码逻辑，仅仅修改代码风格（空格，格式化，分号分号等）
- `test`: 添加缺失测试或更正现有测试（测试用例，包括单元测试、集成测试等）
- `revert`: 回滚到某一个版本（带上版本号）

## win10
- `netstat -aon|findstr “8080”` 查找端口号
- `tasklist|findstr 2524` 查找端口对应进程
- `gc -wait -encoding utf8 -tail 3 .\logs\main-test.log` `windows` 下实时查看日志

## git proxy
#### http proxy
- `git config --global https.proxy http://127.0.0.1:10800`
- `git config --global https.proxy https://127.0.0.1:10800`

#### socks5 proxy
- `git config --global http.proxy socks5://127.0.0.1:10800`
- `git config --global https.proxy socks5://127.0.0.1:10800`

#### 查看 proxy
- `git config --global --get http.proxy`
- `git config --global --get https.proxy`

#### 取消 proxy
- `git config --global --unset http.proxy`
- `git config --global --unset https.proxy`
