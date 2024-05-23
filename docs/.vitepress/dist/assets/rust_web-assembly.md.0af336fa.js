import{_ as s,o as a,c as n,a as l}from"./app.abea79e5.js";const A=JSON.parse('{"title":"WebAssembly尝鲜","description":"","frontmatter":{},"headers":[{"level":2,"title":"通过模板创建第一个 wasm 程序","slug":"通过模板创建第一个-wasm-程序","link":"#通过模板创建第一个-wasm-程序","children":[{"level":3,"title":"lib.rs","slug":"lib-rs","link":"#lib-rs","children":[]}]},{"level":2,"title":"构建 web 使用的 wasm","slug":"构建-web-使用的-wasm","link":"#构建-web-使用的-wasm","children":[{"level":3,"title":"在 pkg 下新建 index.html 测试","slug":"在-pkg-下新建-index-html-测试","link":"#在-pkg-下新建-index-html-测试","children":[]},{"level":3,"title":"build 配置","slug":"build-配置","link":"#build-配置","children":[]}]}],"relativePath":"rust/web-assembly.md","lastUpdated":1683789171000}'),p={name:"rust/web-assembly.md"},e=l(`<h1 id="webassembly尝鲜" tabindex="-1">WebAssembly尝鲜 <a class="header-anchor" href="#webassembly尝鲜" aria-hidden="true">#</a></h1><ul><li><a href="https://juejin.cn/post/7156250334082367496" target="_blank" rel="noreferrer">rust安装教程及第一个 WebAssembly Demo</a></li></ul><h2 id="通过模板创建第一个-wasm-程序" tabindex="-1">通过模板创建第一个 wasm 程序 <a class="header-anchor" href="#通过模板创建第一个-wasm-程序" aria-hidden="true">#</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">cargo generate --git https://github.com/rustwasm/wasm-pack-template.git</span></span>
<span class="line"><span style="color:#A6ACCD;"># 或者使用</span></span>
<span class="line"><span style="color:#A6ACCD;">cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">C:\\Users\\adminc\\Desktop\\123&gt;cargo generate --git https://github.com/rustwasm/wasm-pack-template</span></span>
<span class="line"><span style="color:#A6ACCD;"> Project Name: first-wasm # 输入后会提示填写项目名称</span></span>
<span class="line"><span style="color:#A6ACCD;"> Destination: C:\\Users\\adminc\\Desktop\\123\\wasm2 ...</span></span>
<span class="line"><span style="color:#A6ACCD;"> project-name: first-wasm ...</span></span>
<span class="line"><span style="color:#A6ACCD;"> Generating template ...</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 1/12]   Done: .appveyor.yml</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 2/12]   Done: .gitignore</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 3/12]   Done: .travis.yml</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 4/12]   Done: Cargo.toml</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 5/12]   Done: LICENSE_APACHE</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 6/12]   Done: LICENSE_MIT</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 7/12]   Done: README.md</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 8/12]   Done: src\\lib.rs</span></span>
<span class="line"><span style="color:#A6ACCD;">[ 9/12]   Done: src\\utils.rs</span></span>
<span class="line"><span style="color:#A6ACCD;">[10/12]   Done: src</span></span>
<span class="line"><span style="color:#A6ACCD;">[11/12]   Done: tests\\web.rs</span></span>
<span class="line"><span style="color:#A6ACCD;">[12/12]   Done: tests</span></span>
<span class="line"><span style="color:#A6ACCD;">Moving generated files into: \`C:\\Users\\adminc\\Desktop\\123\\wasm2\`...</span></span>
<span class="line"><span style="color:#A6ACCD;"> Initializing a fresh Git repository</span></span>
<span class="line"><span style="color:#A6ACCD;"> Done! New project created C:\\Users\\adminc\\Desktop\\123\\wasm2</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="lib-rs" tabindex="-1">lib.rs <a class="header-anchor" href="#lib-rs" aria-hidden="true">#</a></h3><div class="language-rs"><button title="Copy Code" class="copy"></button><span class="lang">rs</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#C792EA;">mod</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">utils</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F78C6C;">use</span><span style="color:#FFCB6B;"> wasm_bindgen</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">prelude</span><span style="color:#89DDFF;">::*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// When the \`wee_alloc\` feature is enabled, use \`wee_alloc\` as the global</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// allocator.</span></span>
<span class="line"><span style="color:#89DDFF;">#[</span><span style="color:#A6ACCD;">cfg</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">feature </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">wee_alloc</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)]</span></span>
<span class="line"><span style="color:#89DDFF;">#[</span><span style="color:#A6ACCD;">global_allocator</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> ALLOC</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">wee_alloc</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">WeeAlloc</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">wee_alloc</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">WeeAlloc</span><span style="color:#89DDFF;">::</span><span style="color:#A6ACCD;">INIT</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">#[</span><span style="color:#A6ACCD;">wasm_bindgen</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#C792EA;">extern</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">fn</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">alert</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">s</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#FFCB6B;">str</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">#[</span><span style="color:#A6ACCD;">wasm_bindgen</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#F78C6C;">pub</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">fn</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">greet</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">alert</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Hello, first-wasm!</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="构建-web-使用的-wasm" tabindex="-1">构建 web 使用的 wasm <a class="header-anchor" href="#构建-web-使用的-wasm" aria-hidden="true">#</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;"># 构建 web 可以直接使用的包</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-pack build -t web</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>构建后包被输出到了 <code>pkg</code> 文件夹下</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">- pkg</span></span>
<span class="line"><span style="color:#A6ACCD;">    - .gitignore</span></span>
<span class="line"><span style="color:#A6ACCD;">    - first_wasm.d.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - first_wasm.js</span></span>
<span class="line"><span style="color:#A6ACCD;">    - first_wasm_bg.wasm</span></span>
<span class="line"><span style="color:#A6ACCD;">    - first_wasm_bg.wasm.d.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - package.json</span></span>
<span class="line"><span style="color:#A6ACCD;">    - README.md</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="在-pkg-下新建-index-html-测试" tabindex="-1">在 pkg 下新建 index.html 测试 <a class="header-anchor" href="#在-pkg-下新建-index-html-测试" aria-hidden="true">#</a></h3><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#89DDFF;">&lt;!</span><span style="color:#F07178;">DOCTYPE</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">en</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">charset</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">UTF-8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">http-equiv</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">X-UA-Compatible</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">content</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">IE=edge</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">meta</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">viewport</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">content</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">width=device-width, initial-scale=1.0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">Document</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">module</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> init</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">greet</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">./first_wasm.js</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">doit</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">init</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">greet</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">doit</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">html</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>打开网页会在页面上弹出 <code>Hello, first-wasm!</code></p><h3 id="build-配置" tabindex="-1">build 配置 <a class="header-anchor" href="#build-配置" aria-hidden="true">#</a></h3><ul><li>直接使用 <code>wasm-pack build</code> 进行构建，等同于 <code>wasm-pack build -t bundler</code> 他用来发布到 <code>npm</code> 然后使用</li><li>使用 <code>wasm-pack build -t web</code> 构建可以直接在在网页中使用</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">C:\\Users\\adminc\\Desktop\\123\\wasm2&gt;wasm-pack build --help</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-pack-build 0.10.3</span></span>
<span class="line"><span style="color:#A6ACCD;">🏗️  build your npm package!</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">USAGE:</span></span>
<span class="line"><span style="color:#A6ACCD;">    wasm-pack build [FLAGS] [OPTIONS] [ARGS]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">FLAGS:</span></span>
<span class="line"><span style="color:#A6ACCD;">        --debug            Deprecated. Renamed to \`--dev\`</span></span>
<span class="line"><span style="color:#A6ACCD;">        --dev              Create a development build. Enable debug info, and disable optimizations</span></span>
<span class="line"><span style="color:#A6ACCD;">        --no-typescript    By default a *.d.ts file is generated for the generated JS file, but this flag will disable</span></span>
<span class="line"><span style="color:#A6ACCD;">                           generating this TypeScript file</span></span>
<span class="line"><span style="color:#A6ACCD;">    -h, --help             Prints help information</span></span>
<span class="line"><span style="color:#A6ACCD;">        --profiling        Create a profiling build. Enable optimizations and debug info</span></span>
<span class="line"><span style="color:#A6ACCD;">        --release          Create a release build. Enable optimizations and disable debug info</span></span>
<span class="line"><span style="color:#A6ACCD;">    -V, --version          Prints version information</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">OPTIONS:</span></span>
<span class="line"><span style="color:#A6ACCD;">    -m, --mode &lt;mode&gt;            Sets steps to be run. [possible values: no-install, normal, force] [default: normal]</span></span>
<span class="line"><span style="color:#A6ACCD;">    -d, --out-dir &lt;out-dir&gt;      Sets the output directory with a relative path [default: pkg]</span></span>
<span class="line"><span style="color:#A6ACCD;">        --out-name &lt;out-name&gt;    Sets the output file names. Defaults to package name</span></span>
<span class="line"><span style="color:#A6ACCD;">    -s, --scope &lt;scope&gt;          The npm scope to use in package.json, if any</span></span>
<span class="line"><span style="color:#A6ACCD;">    -t, --target &lt;target&gt;        Sets the target environment. [possible values: bundler, nodejs, web, no-modules]</span></span>
<span class="line"><span style="color:#A6ACCD;">                                 [default: bundler]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">ARGS:</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;path&gt;                The path to the Rust crate. If not set, searches up the path from the current directory</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;extra-options&gt;...    List of extra options to pass to \`cargo build\`</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,17),o=[e];function t(c,r,i,D,y,C){return a(),n("div",null,o)}const d=s(p,[["render",t]]);export{A as __pageData,d as default};
