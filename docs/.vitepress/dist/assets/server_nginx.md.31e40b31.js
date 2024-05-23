import{_ as s,o as n,c as a,a as l}from"./app.abea79e5.js";const F=JSON.parse('{"title":"nginx笔记","description":"","frontmatter":{},"headers":[{"level":2,"title":"nginx map","slug":"nginx-map","link":"#nginx-map","children":[]},{"level":2,"title":"设置自定义变量","slug":"设置自定义变量","link":"#设置自定义变量","children":[]},{"level":2,"title":"location 匹配规则","slug":"location-匹配规则","link":"#location-匹配规则","children":[]},{"level":2,"title":"nginx 例子代码","slug":"nginx-例子代码","link":"#nginx-例子代码","children":[]}],"relativePath":"server/nginx.md","lastUpdated":1677231411000}'),p={name:"server/nginx.md"},o=l(`<h1 id="nginx笔记" tabindex="-1">nginx笔记 <a class="header-anchor" href="#nginx笔记" aria-hidden="true">#</a></h1><h2 id="nginx-map" tabindex="-1">nginx map <a class="header-anchor" href="#nginx-map" aria-hidden="true">#</a></h2><p><code>map</code> 的主要作用是创建自定义变量，通过使用 <code>nginx</code> 的内置变量，去匹配某些特定规则，如果匹配成功则设置某个值给自定义变量。 而这个自定义变量又可以作于他用。</p><div class="language-nginx"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 解释： 若 $uri 中匹配到了 index.html ，则把 $set_log 设置为 1 ，默认和未匹配到设置未 0</span></span>
<span class="line"><span style="color:#C792EA;">map</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;font-style:italic;">uri</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">set_log {</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">~</span><span style="color:#A6ACCD;">index.html  </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">   </span><span style="color:#89DDFF;"> default</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><h2 id="设置自定义变量" tabindex="-1">设置自定义变量 <a class="header-anchor" href="#设置自定义变量" aria-hidden="true">#</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">set $common_ip http://127.0.0.1:2001;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="location-匹配规则" tabindex="-1">location 匹配规则 <a class="header-anchor" href="#location-匹配规则" aria-hidden="true">#</a></h2><ul><li><code>=</code> 绝对匹配，一个字符也不能差</li><li><code>^~</code> 前缀匹配</li><li><code>~</code>(区分大小写); <code>~*</code>(不区分大小写) <strong>正则匹配</strong></li><li>普通前缀匹配</li></ul><h2 id="nginx-例子代码" tabindex="-1">nginx 例子代码 <a class="header-anchor" href="#nginx-例子代码" aria-hidden="true">#</a></h2><ul><li><a href="http://nginx.org/en/docs/varindex.html" target="_blank" rel="noreferrer">内置变量大全-官网</a></li><li><a href="https://www.cnblogs.com/larry-luo/p/10119842.html" target="_blank" rel="noreferrer">内置变量大全-博客园</a></li><li><a href="https://juejin.cn/post/7134540187064860679" target="_blank" rel="noreferrer">常用配置详解-掘金</a></li></ul><div class="language-nginx"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="color:#C792EA;">map</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;font-style:italic;">uri</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">set_log {</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">~</span><span style="color:#A6ACCD;">index.html  </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">   </span><span style="color:#89DDFF;"> default</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 输出日志格式化</span></span>
<span class="line"><span style="color:#89DDFF;">log_format </span><span style="color:#A6ACCD;"> main-test </span><span style="color:#C3E88D;">&#39;-- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">server_name</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">proxy_add_x_forwarded_for</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">remote_user</span><span style="color:#C3E88D;"> -- [</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">time_local</span><span style="color:#C3E88D;">] -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">request</span><span style="color:#C3E88D;"> --&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                      </span><span style="color:#C3E88D;">&#39;-- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">status</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">body_bytes_sent</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">http_referer</span><span style="color:#C3E88D;"> --&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                      </span><span style="color:#C3E88D;">&#39;-- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">http_user_agent</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">http_x_forwarded_for</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">upstream_addr</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">request_time</span><span style="color:#C3E88D;"> -- </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">upstream_response_time</span><span style="color:#C3E88D;"> --&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">server</span><span style="color:#A6ACCD;"> {</span></span>
<span class="line"><span style="color:#89DDFF;">	listen </span><span style="color:#A6ACCD;">2000</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># 使用 return 返回字符串若发现浏览器显示的文本乱码，可以加上此设置</span></span>
<span class="line"><span style="color:#89DDFF;">	charset </span><span style="color:#A6ACCD;">utf-8</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># 只在uri中匹配到了 index.html 才输出日志</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># format 后的参数必须 写了 format 才是可选的但是若没有配置 format 可以写默认值 combined</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># Syntax:	access_log path [format [buffer=size] [gzip[=level]] [flush=time] [if=condition]];</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># access_log logs/main-test.log combined if=$set_log;</span></span>
<span class="line"><span style="color:#89DDFF;">	access_log </span><span style="color:#A6ACCD;">logs/main-test.log main-test if=</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">set_log</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">	set $</span><span style="color:#A6ACCD;">root F:/test-test-test/example_0820/html</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">	set $</span><span style="color:#A6ACCD;">common_ip http://127.0.0.1:2001</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">/ </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	    </span><span style="color:#676E95;font-style:italic;"># 使用 return 返回字符串需要设置默认类型，否则浏览器会当为文件下载</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">	default_type </span><span style="color:#A6ACCD;">text/html</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">http_user_agent </span><span style="color:#89DDFF;">!~ </span><span style="color:#A6ACCD;">(Weixin|WindowsWechat))</span><span style="color:#F07178;">{</span></span>
<span class="line"><span style="color:#F07178;">			</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">401</span><span style="color:#F07178;"> </span><span style="color:#C3E88D;">&quot;请使用微信打开&quot;</span><span style="color:#F07178;">;</span></span>
<span class="line"><span style="color:#F07178;">		}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">	root </span><span style="color:#A6ACCD;">F:/test-test-test/example_0820/html/Weixin</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">	index </span><span style="color:#A6ACCD;">index.html</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	}</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># 这里是为了移除 /hello/</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">/hello/ </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#676E95;font-style:italic;"># 实际请求地址 http://127.0.0.1:2000/hello/get</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#676E95;font-style:italic;"># 代理后的请求地址 http://127.0.0.1:2001/get</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> proxy_pass </span><span style="color:#A6ACCD;">http://127.0.0.1:2001/</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">/get/ </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 实际请求地址 http://127.0.0.1:2000/get/hello</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 代理后的请求地址 http://127.0.0.1:2001/</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 最后的 / 会导致整个 URI 被移除</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> proxy_pass $</span><span style="color:#A6ACCD;">common_ip/</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">/haha/ </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 实际请求地址 http://127.0.0.1:2000/haha/hello</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 代理后的请求地址 http://127.0.0.1:2001/haha/hello</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> proxy_pass $</span><span style="color:#A6ACCD;">common_ip</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">/api </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 实际请求地址 http://127.0.0.1:2000/api</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 代理后的请求地址 http://127.0.0.1:2001/api</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> proxy_pass $</span><span style="color:#A6ACCD;">common_ip</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;"># 这是个错误的例子 会导致异常</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;"># cannot have URI part in location given by regular expression</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;"># 如果匹配使用的正则表达式，proxy_pass 就不能后面就不能带 URI 了，即使最后带 / 都不行</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">#location ~ ^/ha {</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">#    proxy_pass http://127.0.0.1:2001/get;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">#}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;"># 这是个正确的例子</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">~</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/ha </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 实际请求地址 http://127.0.0.1:2000/get/ha</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># 代理后的请求地址 http://127.0.0.1:2001/get/ha</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> proxy_pass </span><span style="color:#A6ACCD;">http://127.0.0.1:2001</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">	error_page </span><span style="color:#A6ACCD;">404 /404.html</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">location</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/404.html </span><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#89DDFF;"> root </span><span style="color:#A6ACCD;">F:/test-test-test/example_0820/html/404</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">	index </span><span style="color:#A6ACCD;">404.html</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div>`,11),e=[o];function t(c,r,i,y,C,D){return n(),a("div",null,e)}const h=s(p,[["render",t]]);export{F as __pageData,h as default};
