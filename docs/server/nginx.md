# nginx笔记

## nginx map

`map` 的主要作用是创建自定义变量，通过使用 `nginx` 的内置变量，去匹配某些特定规则，如果匹配成功则设置某个值给自定义变量。 而这个自定义变量又可以作于他用。

``` nginx
# 解释： 若 $uri 中匹配到了 index.html ，则把 $set_log 设置为 1 ，默认和未匹配到设置未 0
map $uri $set_log {
    ~index.html  1;
    default 0;
}

```

## 设置自定义变量

```
set $common_ip http://127.0.0.1:2001;
```

## location 匹配规则

- `=` 绝对匹配，一个字符也不能差
- `^~` 前缀匹配
- `~`(区分大小写); `~*`(不区分大小写) **正则匹配**
- 普通前缀匹配

## nginx 例子代码

- [内置变量大全-官网](http://nginx.org/en/docs/varindex.html)
- [内置变量大全-博客园](https://www.cnblogs.com/larry-luo/p/10119842.html)
- [常用配置详解-掘金](https://juejin.cn/post/7134540187064860679)

``` nginx

map $uri $set_log {
    ~index.html  1;
    default 0;
}

# 输出日志格式化
log_format  main-test '-- $server_name -- $proxy_add_x_forwarded_for -- $remote_user -- [$time_local] -- $request --'
                      '-- $status -- $body_bytes_sent -- $http_referer --'
                      '-- $http_user_agent -- $http_x_forwarded_for -- $upstream_addr -- $request_time -- $upstream_response_time --';

server {
	listen 2000;
	
	# 使用 return 返回字符串若发现浏览器显示的文本乱码，可以加上此设置
	charset utf-8;
	
	# 只在uri中匹配到了 index.html 才输出日志
	# format 后的参数必须 写了 format 才是可选的但是若没有配置 format 可以写默认值 combined
	# Syntax:	access_log path [format [buffer=size] [gzip[=level]] [flush=time] [if=condition]];
	
	# access_log logs/main-test.log combined if=$set_log;
	access_log logs/main-test.log main-test if=$set_log;

	set $root F:/test-test-test/example_0820/html;
	set $common_ip http://127.0.0.1:2001;
	
	location / {
	    # 使用 return 返回字符串需要设置默认类型，否则浏览器会当为文件下载
		default_type text/html;

		if ($http_user_agent !~ (Weixin|WindowsWechat)){
			return 401 "请使用微信打开";
		}

		root F:/test-test-test/example_0820/html/Weixin;
		index index.html;
	}
	
	# 这里是为了移除 /hello/
    location /hello/ {
		# 实际请求地址 http://127.0.0.1:2000/hello/get
		# 代理后的请求地址 http://127.0.0.1:2001/get
        proxy_pass http://127.0.0.1:2001/;
    }

    location /get/ {
        # 实际请求地址 http://127.0.0.1:2000/get/hello
        # 代理后的请求地址 http://127.0.0.1:2001/
        # 最后的 / 会导致整个 URI 被移除
        proxy_pass $common_ip/;
    }

    location /haha/ {
        # 实际请求地址 http://127.0.0.1:2000/haha/hello
        # 代理后的请求地址 http://127.0.0.1:2001/haha/hello
        proxy_pass $common_ip;
    }

    location /api {
        # 实际请求地址 http://127.0.0.1:2000/api
        # 代理后的请求地址 http://127.0.0.1:2001/api
        proxy_pass $common_ip;
    }

    # 这是个错误的例子 会导致异常
    # cannot have URI part in location given by regular expression
    # 如果匹配使用的正则表达式，proxy_pass 就不能后面就不能带 URI 了，即使最后带 / 都不行
    #location ~ ^/ha {
    #    proxy_pass http://127.0.0.1:2001/get;
    #}

    # 这是个正确的例子
    location ~ /ha {
        # 实际请求地址 http://127.0.0.1:2000/get/ha
        # 代理后的请求地址 http://127.0.0.1:2001/get/ha
        proxy_pass http://127.0.0.1:2001;
    }

	error_page 404 /404.html;

    location = /404.html {
        root F:/test-test-test/example_0820/html/404;
		index 404.html;
    }

}

```
