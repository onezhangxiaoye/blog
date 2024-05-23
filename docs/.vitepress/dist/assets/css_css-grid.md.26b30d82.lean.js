import{d as N,r as c,_ as P,o as y,c as m,b as o,n as t,e as B,w as R,T as z,f as k,v as E,g as n,F as O,h as J,i as U,t as H,p as K,j as M,a as j}from"./app.abea79e5.js";function q(){return[{key:"a",index:1,class:{"grid-item1":!0},style:{"background-color":"rgb(239,52,41)"}},{key:"b",index:2,class:{"grid-item2":!0},style:{"background-color":"rgb(246,143,37)"}},{key:"c",index:3,class:{"grid-item3":!0},style:{"background-color":"rgb(75,168,70)"}},{key:"d",index:4,class:{"grid-item4":!0},style:{"background-color":"rgb(4,118,194)"}},{key:"e",index:5,class:{"grid-item5":!0},style:{"background-color":"rgb(192,119,175)"}},{key:"f",index:6,class:{"grid-item6":!0},style:{"background-color":"rgb(248,210,157)"}},{key:"g",index:7,class:{"grid-item7":!0},style:{"background-color":"rgb(180,168,127)"}},{key:"h",index:8,class:{"grid-item8":!0},style:{"background-color":"rgb(208,228,168)"}},{key:"j",index:9,class:{"grid-item9":!0},style:{"background-color":"rgb(77,199,236)"}}]}let Q=100;function W(){return{key:Q+++"",class:{},style:{"background-color":"#fff"}}}const X=N({setup(){const s=c(0),l=c("css-grid-box-row-column"),i=c([]),g=c(void 0),F=c(!0),C=c(!1);function e(a){F.value=a==="rowColumnLinesActive",C.value=a==="gridTemplateColumnsActive"}function b(a){e("rowColumnLinesActive"),l.value="css-grid-box-row-column",g.value=a;let r=[],D=0,G=q();for(let A=1;A<8;A++)for(let h=1;h<8;h++)r.push(A%2|h%2?W():G[D++]);i.value=r,console.log(i.value)}b(void 0);function d(a){for(let r=0,D=0;r<i.value.length;r++)r!==0&&r%7===0&&D++,i.value[r].class["css-grid-high-light-animation"]=a(D,r%7)}const f=c(!1),v=c(!1),w=c(!1),x=c(!1);function u(a){f.value=a==="rowLinesActive",v.value=a==="columnLinesActive",w.value=a==="columnActive",x.value=a==="rowActive"}function T(){u("rowLinesActive"),d(()=>!1),setTimeout(()=>{d(a=>a%2===0)})}function _(){u("columnLinesActive"),d(()=>!1),setTimeout(()=>{d((a,r)=>r%2===0)})}function $(){u("rowActive"),d(()=>!1),setTimeout(()=>{d((a,r)=>a%2===1)})}function S(){u("columnActive"),d(()=>!1),setTimeout(()=>{d((a,r)=>r%2===1)})}function L(){d(()=>!1),i.value=q(),g.value=5,e("gridTemplateColumnsActive"),l.value="css-grid-box-grid-template-columns1",console.log(i.value)}function I(a){return g.value===a?"button-active":""}function V(a,r){g.value=a,typeof r=="string"?l.value=r:r()}return{rowColumnLinesActive:F,gridTemplateColumnsActive:C,activeIndex:g,count:s,arr:i,rowLinesActive:f,columnLinesActive:v,columnActive:w,rowActive:x,boxClass:l,rowColumnLinesTest:b,highlightRowLines:T,highlightColumnLines:_,highlightRows:$,highlightColumns:S,gridTemplateColumnsTest:L,isActive:I,itemClick:V}}});const p=s=>(K("data-v-707819d1"),s=s(),M(),s),Y={class:"grid-test"},Z={class:"css-grid-buttons"},ss=p(()=>o("br",null,null,-1)),ls={class:"css-grid-buttons"},os=p(()=>o("strong",null,"点击下方样式进行切换",-1)),ns={style:{"max-height":"40vh",overflow:"auto"}},es=p(()=>o("strong",null,"/**  grid-template-columns: repeat(3, 90px);  **/ ",-1)),as=p(()=>o("strong",null,"/**   grid-template-columns: repeat(auto-fill, 40px);  **/ ",-1)),ts=p(()=>o("strong",null,"/**   grid-template-columns:30px 1fr 2fr;  **/ ",-1)),rs=p(()=>o("strong",null,"/**    grid-template-columns:30% 30% 40%;  **/ ",-1)),ps=p(()=>o("strong",null,"/**   grid-template-columns: repeat(3, auto);  **/ ",-1)),cs=p(()=>o("strong",null,"/**   justify-content: left; align-content: center;  **/ ",-1)),is=p(()=>o("strong",null,"/**   grid-auto-flow: column;  **/",-1)),ds=p(()=>o("strong",null,"/**   grid-auto-flow: row dense;  **/",-1)),gs=p(()=>o("strong",null,"/**   grid-auto-flow: row;  **/",-1)),us=p(()=>o("strong",null,"/**   justify-items: left;align-items 同理  **/",-1)),Ds=p(()=>o("strong",null,"/**   grid-auto-rows: 45px;grid-auto-columns: 45px;  **/",-1)),ys=p(()=>o("strong",null,"/**   grid-column-start: 5;grid-column-end: 6;  **/",-1)),ms=p(()=>o("strong",null,"/**   grid-row-start: 4;grid-row-end: 5;  **/",-1)),Fs=p(()=>o("strong",null,"/**   grid-column: 1 / 3;grid-row: 1 / 3;  **/",-1)),Cs=p(()=>o("strong",null,"/**   grid-column: 1 / 3;grid-row: 1 / 3;  **/",-1));function As(s,l,i,g,F,C){return y(),m("div",Y,[o("div",Z,[o("button",{class:t(s.rowColumnLinesActive?"button-active":""),onClick:l[0]||(l[0]=e=>s.rowColumnLinesTest(1))},"行列及网格线区分实验",2),o("button",{class:t(s.gridTemplateColumnsActive?"button-active":""),onClick:l[1]||(l[1]=(...e)=>s.gridTemplateColumnsTest&&s.gridTemplateColumnsTest(...e))},"grid-template-columns实验",2)]),ss,B(z,{class:t([s.boxClass,"css-grid-box"]),name:"flip-list",tag:"div"},{default:R(()=>[(y(!0),m(O,null,J(s.arr,e=>(y(),m("div",{key:e.key,style:U(e.style),class:t(e.class)},H(e.index||""),7))),128))]),_:1},8,["class"]),o("div",ls,[os,k(o("div",null,[o("button",{class:t(s.isActive(0)),onClick:l[2]||(l[2]=e=>s.itemClick(0,s.highlightRows))},"高亮行",2),o("button",{class:t(s.isActive(1)),onClick:l[3]||(l[3]=e=>s.itemClick(1,s.highlightColumns))},"高亮列",2),o("button",{class:t(s.isActive(2)),onClick:l[4]||(l[4]=e=>s.itemClick(2,s.highlightRowLines))},"高亮行网格线",2),o("button",{class:t(s.isActive(3)),onClick:l[5]||(l[5]=e=>s.itemClick(3,s.highlightColumnLines))},"高亮列网格线",2)],512),[[E,s.rowColumnLinesActive]]),k(o("div",ns,[o("pre",{class:t(s.isActive(5)),onClick:l[6]||(l[6]=e=>s.itemClick(5,"css-grid-box-grid-template-columns1"))},[n("    "),es,n(`
    .css-grid-box-grid-template-columns1 {
        grid-template-columns: repeat(3, 90px);
        row-gap: 15px;
        column-gap: 15px;
    }
                `)],2),o("pre",{class:t(s.isActive(6)),onClick:l[7]||(l[7]=e=>s.itemClick(6,"css-grid-box-grid-template-columns2"))},[n("    "),as,n(`
    .css-grid-box-grid-template-columns2 {
        grid-template-columns: repeat(auto-fill, 40px);
        row-gap: 15px;
        column-gap: 15px;
    }
                `)],2),o("pre",{class:t(s.isActive(7)),onClick:l[8]||(l[8]=e=>s.itemClick(7,"css-grid-box-grid-template-columns3"))},[n("    "),ts,n(`
    .css-grid-box-grid-template-columns3 {
        grid-template-columns:30px 1fr 2fr;
        row-gap: 15px;
        column-gap: 15px;
    }
                `)],2),o("pre",{class:t(s.isActive(8)),onClick:l[9]||(l[9]=e=>s.itemClick(8,"css-grid-box-grid-template-columns4"))},[n("    "),rs,n(`
    .css-grid-box-grid-template-columns4 {
        grid-template-columns:30% 30% 40%;
        row-gap: 15px;
    }
                `)],2),o("pre",{class:t(s.isActive(9)),onClick:l[10]||(l[10]=e=>s.itemClick(9,"css-grid-box-grid-template-columns5"))},[n("    "),ps,n(`
    .css-grid-box-grid-template-columns5 {
        grid-template-columns: repeat(3, auto);
        row-gap: 15px;
        column-gap: 15px;
    }
                `)],2),o("pre",{class:t(s.isActive(10)),onClick:l[11]||(l[11]=e=>s.itemClick(10,"css-grid-box-grid-template-columns6"))},[n("    "),cs,n(`
    .css-grid-box-grid-template-columns6 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: left;
        align-content: center;
    }
                `)],2),o("pre",{class:t(s.isActive(11)),onClick:l[12]||(l[12]=e=>s.itemClick(11,"css-grid-box-grid-template-columns8"))},[n("    "),is,n(`
    .css-grid-box-grid-template-columns8 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: column;
    }
                `)],2),o("pre",{class:t(s.isActive(12)),onClick:l[13]||(l[13]=e=>s.itemClick(12,"css-grid-box-grid-template-columns9"))},[n("    "),ds,n(`
    .css-grid-box-grid-template-columns9 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row dense;
    }

    .css-grid-box-grid-template-columns9 .grid-item1,
    .css-grid-box-grid-template-columns9 .grid-item2{
        grid-row-start: 1;
        grid-row-end: 3;
    }
                `)],2),o("pre",{class:t(s.isActive(13)),onClick:l[14]||(l[14]=e=>s.itemClick(13,"css-grid-box-grid-template-columns10"))},[n("    "),gs,n(`
    .css-grid-box-grid-template-columns10 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row;
    }

    .css-grid-box-grid-template-columns10 .grid-item1,
    .css-grid-box-grid-template-columns10 .grid-item2{
        grid-row-start: 1;
        grid-row-end: 3;
    }
                `)],2),o("pre",{class:t(s.isActive(14)),onClick:l[15]||(l[15]=e=>s.itemClick(14,"css-grid-box-grid-template-columns11"))},[n("    "),us,n(`
    .css-grid-box-grid-template-columns11 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        justify-items: left;
    }
                `)],2),o("pre",{class:t(s.isActive(15)),onClick:l[16]||(l[16]=e=>s.itemClick(15,"css-grid-box-grid-template-columns12"))},[n("    "),Ds,n(`
    `),ys,n(`
    `),ms,n(`
    .css-grid-box-grid-template-columns12 {
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(3, 100px);
        grid-auto-rows: 45px;
        grid-auto-columns: 45px;
    }
    .css-grid-box-grid-template-columns12 .grid-item3 {
        grid-column-start: 5;
        grid-column-end: 6;
    }
    .css-grid-box-grid-template-columns12 .grid-item8 {
        grid-row-start: 4;
        grid-row-end: 5;
    }
                `)],2),o("pre",{class:t(s.isActive(16)),onClick:l[17]||(l[17]=e=>s.itemClick(16,"css-grid-box-grid-template-columns13"))},[n("    "),Fs,n(`
    .css-grid-box-grid-template-columns13 {
        grid-template-columns: repeat(4, auto);
        grid-template-rows: repeat(4, auto);
    }
    .css-grid-box-grid-template-columns13 .grid-item1 {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
    }
    .css-grid-box-grid-template-columns13 .grid-item2 {
        grid-column: 3 / span 2;
        grid-row: 1;
    }
                `)],2),o("pre",{class:t(s.isActive(17)),onClick:l[18]||(l[18]=e=>s.itemClick(17,"css-grid-box-grid-template-columns14"))},[n("    "),Cs,n(`
    .css-grid-box-grid-template-columns14 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: center;
        align-content: center;
    }
    .css-grid-box-grid-template-columns14 .grid-item1 {
        justify-self: left;
    }
    .css-grid-box-grid-template-columns14 .grid-item3 {
        align-self: start;
    }
    .css-grid-box-grid-template-columns14 .grid-item9 {
        place-self:end right;
    }
                `)],2)],512),[[E,s.gridTemplateColumnsActive]])])])}const hs=P(X,[["render",As],["__scopeId","data-v-707819d1"]]);const bs=j("",6),fs=j("",40),xs=JSON.parse('{"title":"CSS-Grid-网格布局","description":"","frontmatter":{},"headers":[{"level":2,"title":"这是一个简单的例子","slug":"这是一个简单的例子","link":"#这是一个简单的例子","children":[]},{"level":2,"title":"可操作实例","slug":"可操作实例","link":"#可操作实例","children":[]},{"level":2,"title":"容器属性","slug":"容器属性","link":"#容器属性","children":[{"level":3,"title":"grid-template-columns 和 grid-template-rows","slug":"grid-template-columns-和-grid-template-rows","link":"#grid-template-columns-和-grid-template-rows","children":[{"level":5,"title":"grid-template-columns 和 grid-template-rows 多种写法","slug":"grid-template-columns-和-grid-template-rows-多种写法","link":"#grid-template-columns-和-grid-template-rows-多种写法","children":[]},{"level":5,"title":"repeat()","slug":"repeat","link":"#repeat","children":[]},{"level":5,"title":"auto","slug":"auto","link":"#auto","children":[]},{"level":5,"title":"fr","slug":"fr","link":"#fr","children":[]},{"level":5,"title":"auto-fill","slug":"auto-fill","link":"#auto-fill","children":[]},{"level":5,"title":"百分比","slug":"百分比","link":"#百分比","children":[]},{"level":5,"title":"网格线的名称","slug":"网格线的名称","link":"#网格线的名称","children":[]}]},{"level":3,"title":"grid-row-gap 和 grid-column-gap 和 grid-gap","slug":"grid-row-gap-和-grid-column-gap-和-grid-gap","link":"#grid-row-gap-和-grid-column-gap-和-grid-gap","children":[]},{"level":3,"title":"grid-auto-flow","slug":"grid-auto-flow","link":"#grid-auto-flow","children":[]},{"level":3,"title":"justify-items 和 align-items 和 place-items","slug":"justify-items-和-align-items-和-place-items","link":"#justify-items-和-align-items-和-place-items","children":[]},{"level":3,"title":"justify-content 和，align-content 和 place-content","slug":"justify-content-和-align-content-和-place-content","link":"#justify-content-和-align-content-和-place-content","children":[]},{"level":3,"title":"grid-auto-columns 和 grid-auto-rows","slug":"grid-auto-columns-和-grid-auto-rows","link":"#grid-auto-columns-和-grid-auto-rows","children":[]},{"level":3,"title":"grid-template 和 grid","slug":"grid-template-和-grid","link":"#grid-template-和-grid","children":[]}]},{"level":2,"title":"项目属性","slug":"项目属性","link":"#项目属性","children":[{"level":3,"title":"grid-column-start 和 grid-column-end 和 grid-row-start 和 grid-row-end 和 grid-column 和 grid-row","slug":"grid-column-start-和-grid-column-end-和-grid-row-start-和-grid-row-end-和-grid-column-和-grid-row","link":"#grid-column-start-和-grid-column-end-和-grid-row-start-和-grid-row-end-和-grid-column-和-grid-row","children":[]},{"level":3,"title":"justify-self 和 align-self 和 place-self","slug":"justify-self-和-align-self-和-place-self","link":"#justify-self-和-align-self-和-place-self","children":[]}]}],"relativePath":"css/css-grid.md","lastUpdated":1677164864000}'),vs={name:"css/css-grid.md"},ks=Object.assign(vs,{setup(s){return(l,i)=>(y(),m("div",null,[bs,B(hs),fs]))}});export{xs as __pageData,ks as default};
