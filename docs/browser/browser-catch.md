# 浏览器缓存

当用户访问网站时，为了降低服务器压力，加快二次访问时的加载速度，在首次加载完成后，浏览器会对网页资源进行缓存。

## 参考文章
[1.实践这一次，彻底搞懂浏览器缓存机制](https://segmentfault.com/a/1190000017962411)

[2.HTTP 缓存-MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)

[3.如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改 #113](https://github.com/shfshanyue/Daily-Question/issues/113)

## 名词解释

- `memory cache`：缓存至内存，浏览器关闭后下次就需要重新加载
- `disk cache`：缓存至磁盘，浏览器关闭再打开缓存也是生效的
- `Cache-Control: max-age=30` 缓存过期时间 `no-cache`/`max-age=<seconds>` [详细介绍](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)
- `Date: Mon, 26 Apr 2021 16:49:50 GMT` 当前资源服务器响应的时间点，转换为中国时区时间 加上8小时就行
- `ETag: "6084338b-c7"` 当前文件内容标记，文件修改后 ETag 会被修改，文件不修改但是 `Last-Modified` 修改也会导致 `ETag` 改变，具体看参考文章3
- `Last-Modified: Sat, 24 Apr 2021 15:04:43 GMT` 文件的最后一次修改时间
- `Server: nginx/1.18.0` 服务器类型

## Nginx 简单配置

```
server {
    listen 8089;
	
    location / {
      add_header  Cache-Control max-age=100,immutable;

      root D:/soft/qq/Desktop/0820/HTML/nginx;
    }
}

```


## 缓存判断逻辑流程图
![](/images/fe270984-46ea-4e13-81f8-07368c8f5344.png)
