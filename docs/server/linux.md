# linux笔记
## 查看进程pid
- `ps -ef|grep nginx`


## 通过pid查看占用端口
- `netstat -nap | grep 进程pid`

## 列出所有端口
- `netstat -ntlp`

## 查看内存使用前十名 [链接](https://www.jianshu.com/p/539bcac6bb8a)
- `ps aux|head -1;ps aux|grep -v PID|sort -rn -k +4|head`

## 查看动态文本内容
- `tail -f -n 200 text.txt` `-f` 文档内容自动更新
- `tail -n 200 text.txt`

## ll ls 相关命令


```
ls -lh 
# 可以查看文件的格式化大小信息
# 输出
[root@lsJrcfk3Ow play-video]# ls -lh
total 68K
-rw-r--r-- 1 root root  911 Jul 29 11:09 aria2Util.js
-rw-r--r-- 1 root root 2.4K Jul 11 14:41 cai.png
-rw-r--r-- 1 root root 1.5K Jul 29 09:59 emailUtil.js

```

## df 查看磁盘使用情况 [链接](https://www.cnblogs.com/qiangspecial/p/15379127.html)
- `df -h`： -h：以人们较易阅读的GB,MB,KB等格式自行显示
- `du -h --max-depth=1`：查看当前路径下所有文件夹的内存使用情况，`注意只能看到文件夹`


## 文件删除
- `rm -rf /text`
- `-f`：强制删除（force），和 `-i` 选项相反，使用 `-f`，系统将不再询问，而是直接删除目标文件或目录。
- `-i`：和 `-f` 正好相反，在删除文件或目录之前，系统会给出提示信息，使用 `-i` 可以有效防止不小心删除有用的文件或目录。
- `-r`：递归删除，主要用于删除目录，可删除指定目录及包含的所有内容，包括所有的子目录和文件。


## vi 命令（vi命令模式下使用）
- `x` 删除当前字符
- `nx` 删除从光标开始的n个字符
- `dd` 删除当前行
- `2dd` 向下删除当前行在内的2行
- `u` 撤销上一步操作
- `U` 撤销对当前行的所有操作
- `2+` 向下跳2行
- `2-` 向上跳2行
- `2G` 跳到行号为2的行
- `G` 跳至文件的底


## 防火墙相关

- 开启指定端口：`firewall-cmd --zone=public --add-port=端口号/tcp --permanent`
- 移除指定端口：`firewall-cmd --zone=public --remove-port=端口号/tcp --permanent`
- 查看防火墙状态 `systemctl status firewalld.service`
- 重启防火墙 `systemctl restart firewalld.service`
- 开启防火墙 `systemctl start firewalld.service`
- 关闭防火墙 `systemctl stop firewalld.service`
- 禁止开机启动 `systemctl disable firewalld.service`
- 开启开机启动 `systemctl enable firewalld.service`
- 查看已开放端口 `firewall-cmd --list-ports`

## arai2

- 启动 `aria2c  --conf-path="/root/aria2/aria2.conf" -D`
- 服务器 `arai2` 配置文件地址 `/root/aria2/aria2.conf`
