// 命書版面：把 build() 的區塊排成 A4 頁面的繪圖指令（點，左上原點），供 PDF 與 SVG 共用。
import {isChong,liuhe,hai,isXing,isBanhe,ganhe} from '../mingshu/engine.js';
import {ganWx,zhiWx} from '../bazi.js';
export const PW=595.28,PH=841.89;
const LH=16.8,XB=66,XN=50,XH=42,RIGHT=556,TOP=44,BOT=784;
export const COLOR={T:'#000000',H:'#0000ff',S:'#008000',R:'#ff0000',P:'#000000',Q:'#8b4513'};
export const SIZE={T:20,H:16,S:14,R:14,P:14,Q:13};
export const IMG={body1:[793,1020],body2:[793,985],taohua:[830,841],caiwei:[478,243]};
const IMGW={body1:492,body2:492,taohua:400,caiwei:297};
const NOSTART='，。、：；！？）」』】》,.;:!?)…％%';
export function wrap(text,width,size,meas){const out=[];
 for(const para of String(text).split('\n')){let cur='';
  let w=0;for(const ch of para){const cw=meas(ch,size);if(cur&&w+cw>width&&!NOSTART.includes(ch)){out.push(cur);cur=ch;w=cw;}else{cur+=ch;w+=cw;}}
  out.push(cur);}
 return out;}
const t=(x,y,s,txt,c='#000000',o={})=>({k:'t',x,y,s,t:String(txt),c,...o});
const ln=(x1,y1,x2,y2,w=0.8,c='#000000')=>({k:'l',x1,y1,x2,y2,w,c});
const rc=(x,y,w,h,o={})=>({k:'r',x,y,w,h,w0:0.8,c:'#000000',...o});
const ci=(cx,cy,r,o={})=>({k:'c',cx,cy,r,w0:0.8,c:'#000000',...o});
// 直書
const vt=(x,y,s,txt,c,step)=>[...String(txt)].map((ch,i)=>t(x,y+i*(step||s*1.08),s,ch,c,{mid:1}));
// 文字置中（mid:1 表示 x 為中心）
const ct=(x,y,s,txt,c)=>t(x,y,s,txt,c,{mid:1});
export const P1_TXT='姓名性別西元農曆時日月年日期主星天干地支藏副十二運星特星神煞歲大運日元閏五行分數比肩劫財食神傷官正財偏財正官七殺正印偏印天運胎息元命宮格局血型空亡喜用忌星座強弱身流本命書由「盲派八字論命」網站依出生資料以規則推算產生，內容僅供參考。：（）產生曆法DE421節氣定柱真太陽東經干支換線合剋沖六半三刑穿破木火土金水0123456789-()年月日時分盲派八字命盤吉凶方位Page of歲';
// 四柱干支關係（a、b 為柱序 0 年…3 時；k：g 干、z 支；n：同一對地支的第幾種關係）
export function p1Rels(d){const out=[],ord=[3,2,1,0];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const a=d.P[ord[i]],c=d.P[ord[j]];
  const gr=ganhe(a.gan)===c.gan?'合':(()=>{const A='木火土金水',x=A.indexOf(ganWx(a.gan)),y=A.indexOf(ganWx(c.gan));return (x+2)%5===y||(y+2)%5===x?'剋':'';})();
  if(gr)out.push({k:'g',a:ord[i],b:ord[j],r:gr,n:0});
  const zr=[];if(isChong(a.zhi,c.zhi))zr.push('沖');if(liuhe(a.zhi)===c.zhi)zr.push('六合');if(isBanhe(a.zhi,c.zhi))zr.push('半三合');if(isXing(a.zhi,c.zhi)||isXing(c.zhi,a.zhi))zr.push('刑');if(hai(a.zhi)===c.zhi)zr.push('穿');
  const PO=['子卯','卯午','午酉'];if(PO.includes(a.zhi+c.zhi)||PO.includes(c.zhi+a.zhi))zr.push('破');
  zr.forEach((r,n)=>out.push({k:'z',a:ord[i],b:ord[j],r,n}));}
 return out;}
export function page1(d){const o=[];const BL='#0000ff',RD='#ff0000',GR='#008000',BK='#000000';
 // ── 右：命盤表（時日月年由左至右，標籤欄在最右）
 const X0=283,CW=57,XL=X0+CW*4,XR=575,cx=i=>X0+CW*i+CW/2;const ord=[3,2,1,0];
 const rows=[44,66,88,110,132,172,226,280,306,346,384,566,588,640];
 o.push(rc(X0,rows[0],XR-X0,rows[rows.length-1]-rows[0],{w0:1.2}));
 for(let i=1;i<rows.length-1;i++)o.push(ln(X0,rows[i],XR,rows[i]));
 for(let i=1;i<4;i++)o.push(ln(X0+CW*i,rows[1],X0+CW*i,rows[11]));o.push(ln(XL,rows[0],XL,rows[13]));
 o.push(ln(X0+40,rows[0],X0+40,rows[1]),ln(XL-50,rows[0],XL-50,rows[1]));
 o.push(ct(X0+20,rows[0]+16,13,'姓名'),ct((X0+40+XL-50)/2,rows[0]+16,13,d.name||'—'),ct(XL-25,rows[0]+16,13,'性別'),ct((XL+XR)/2,rows[0]+16,13,d.sex));
 const b=d.birth,L=d.lun;const sv=[b.h,b.d,b.m,b.y],lv=[b.h,L[1],(L[3]?'閏':'')+L[0],L[2]];
 sv.forEach((v,i)=>o.push(ct(cx(i),rows[1]+16,12,v)));lv.forEach((v,i)=>o.push(ct(cx(i),rows[2]+16,12,v,RD)));
 o.push(ct((XL+XR)/2,rows[1]+16,12,'西元'),ct((XL+XR)/2,rows[2]+16,12,'農曆'));
 ['時','日','月','年'].forEach((s,i)=>o.push(ct(cx(i),rows[3]+16,14,s)));o.push(ct((XL+XR)/2,rows[3]+16,13,'日期'));
 const lab=[[4,'主星'],[5,'天干'],[6,'地支'],[7,'藏'],[8,'副'],[9,'十二運星'],[10,'特星神煞'],[11,'歲'],[12,'大運']];
 for(const [r,s] of lab){const h=rows[r+1]-rows[r];if(s.length===1)o.push(ct((XL+XR)/2,rows[r]+h/2+6,15,s));else if(s.length===2&&h<50)o.push(ct((XL+XR)/2,rows[r]+h/2+5,13,s));
  else if(s.length===2)o.push(...vt((XL+XR)/2,rows[r]+h/2-8,14,s,BK,17));else if(h<50)o.push(ct((XL+XR)/2,rows[r]+16,12,s.slice(0,2)),ct((XL+XR)/2,rows[r]+31,12,s.slice(2)));
  else o.push(...vt((XL+XR)/2,rows[r]+30,14,s,BK,30));}
 ord.forEach((pi,i)=>{const p=d.P[pi],x=cx(i);
  const ss=pi===2?'日元':p.ss;o.push(ct(x,rows[4]+17,13,ss[0]),ct(x,rows[4]+33,13,ss[1]));
  o.push(ct(x,rows[5]+34,20,p.gan,RD),ct(x,rows[5]+49,8,ganWx(p.gan)));
  o.push(ct(x,rows[6]+34,20,p.zhi,RD),ct(x,rows[6]+49,8,zhiWx(p.zhi)));
  o.push(ct(x,rows[7]+18,13,[...p.cang].join('')));
  const fu=p.fu;if(fu.length<=1)o.push(ct(x,rows[8]+24,12,fu[0]||''));else{o.push(ct(x,rows[8]+17,10,fu.map(f=>f[0]).join('')),ct(x,rows[8]+31,10,fu.map(f=>f[1]).join('')));}
  o.push(ct(x,rows[9]+16,13,p.stage),ct(x,rows[9]+32,11,d.ages[pi]));
  (d.stars[pi]||[]).forEach((s,k)=>o.push(ct(x,rows[10]+16+k*14.5,11,s)));});
 // 干支關係箭頭
 const ganLv=[0,0,0],zhiLv=[0,0,0];
 for(const R of p1Rels(d)){const i=ord.indexOf(R.a),j=ord.indexOf(R.b),xa=cx(Math.min(i,j))+8,xb=cx(Math.max(i,j))-8,gap=Math.abs(j-i)-1;
  if(R.k==='g'){const y=rows[5]+7+gap*7;o.push(...arrow(xa,xb,y,BL),ct((xa+xb)/2,y-1.5,7.5,R.r,BL));}
  else{const y=rows[6]+7+(gap*2+R.n)%4*6.5;o.push(...arrow(xa,xb,y,BL),ct((xa+xb)/2,y-1.5,7.5,R.r,BL));}}
 // 大運（由右至左）
 const dy=d.dayun.slice(0,8),DW=(XL-X0)/dy.length;
 dy.forEach((u,i)=>{const x=XL-DW*i-DW/2;if(i)o.push(ln(XL-DW*i,rows[11],XL-DW*i,rows[13]));
  o.push(ct(x,rows[11]+15,8,`${u.from}-${u.to}`),ct(x,rows[12]+15,13,u.gz[0],RD),ct(x,rows[12]+24,6.5,u.ss),ct(x,rows[12]+40,13,u.gz[1],RD),ct(x,rows[12]+49,6.5,u.zs));});
 // ── 左上：五行圓
 const C=[132,118],R=78;const pos={火:-90,土:-18,金:54,水:126,木:198};const A5='木火土金水',de=A5.indexOf(d.dw);
 const GRP=[['比肩','劫財'],['食神','傷官'],['正財','偏財'],['正官','七殺'],['正印','偏印']];
 o.push(ci(C[0],C[1],R));
 for(const e of A5){const a=pos[e]*Math.PI/180,x=C[0]+R*Math.cos(a),y=C[1]+R*Math.sin(a);const gi=(A5.indexOf(e)-de+5)%5,pr=GRP[gi];
  const lx=C[0]+(R+16)*Math.cos(a),ly=C[1]+(R+16)*Math.sin(a);o.push(ct(lx,ly+5,15,e),ct(lx+(Math.cos(a)>0.3?16:Math.cos(a)<-0.3?-16:16),ly+(Math.sin(a)<-0.5?5:18),12,String(d.sc[e]),RD));
  const ix=C[0]+R*0.58*Math.cos(a),iy=C[1]+R*0.58*Math.sin(a);o.push(ct(ix,iy-4,8,`${pr[0]} ${d.cnt[pr[0]]}`),ct(ix,iy+7,8,`${pr[1]} ${d.cnt[pr[1]]}`,RD));}
 o.push(ct(C[0],C[1]+3,8,'五行分數',GR));
 // 直書資料
 const info=[['天運五行',d.tianyun],['胎息',d.taixi],['胎元',d.taiyuan],['命宮',d.mg],['格局',d.ge],['血型',d.blood||'　'],['空亡',[...new Set(d.kong.flat().join('').split(''))].join('')],['喜用神',d.xi.join('')],['忌神',d.ji.join('')],['星座',d.xz],['強弱',d.strong?'身強':'身弱']];
 info.forEach(([k,v],i)=>{const x=24+i*22.5;o.push(...vt(x,232,13,k+'：',BL,14));o.push(...vt(x,232+(k.length+1)*14+4,12,v,i===7||i===8?RD:BK,13));});
 // 左下：流年表（每列五年，由右至左遞增）
 const LX=14,LY=392,LW=52,LH=78;o.push(t(LX,LY-6,11,'流年',BL));
 for(let blk=0;blk<3;blk++){const y0=LY+blk*LH;o.push(rc(LX,y0,LW*5,LH-4,{w0:0.8}));o.push(ln(LX,y0+16,LX+LW*5,y0+16));
  for(let i=0;i<5;i++){const u=d.ly[blk*5+4-i],x=LX+LW*i+LW/2;if(!u)continue;if(i)o.push(ln(LX+LW*i,y0,LX+LW*i,y0+LH-4));
   o.push(ct(x,y0+12,9,`${u.y}(${u.age})`),ct(x-10,y0+38,15,u.gz[0],RD),ct(x-10,y0+62,15,u.gz[1],RD),ct(x+12,y0+36,8,u.ss[0]),ct(x+12,y0+60,8,u.ss[1]));}}
 // 底部說明框
 o.push(rc(30,668,535,64,{rr:9,c:GR,w0:1.2}),ct(297,690,12,'本命書由「盲派八字論命」網站依出生資料以規則推算產生，內容僅供參考。'),
  ct(297,710,10.5,`出生：${d.local?d.local+'＝台北':'西元'}${b.y}年${b.m}月${b.d}日${b.h}時${b.mi}分${d.place?'（'+d.place+'）':''}　產生日期：${d.made||''}`),ct(297,726,9,'曆法：DE421 節氣定年月柱、真太陽時定日時柱、東經 70° 干支換日線'));
 return o;}
const arrow=(xa,xb,y,c)=>[ln(xa,y,xb,y,0.6,c),ln(xa,y,xa+3,y-2,0.6,c),ln(xa,y,xa+3,y+2,0.6,c),ln(xb,y,xb-3,y-2,0.6,c),ln(xb,y,xb-3,y+2,0.6,c)];
function compass(cx,cy,r,title,lab){const o=[ci(cx,cy,r),ci(cx,cy,r*0.35),ct(cx,cy+4,10,'中')];
 const D=['北','東北','東','東南','南','西南','西','西北'];
 D.forEach((dd,i)=>{const a=-Math.PI/2+Math.PI-(i*Math.PI/4);// 上南下北（傳統），東在左
  const ang=Math.PI/2+i*Math.PI/4;const x=cx+Math.cos(ang)*r*0.68,y=cy+Math.sin(ang)*r*0.68;
  o.push(ln(cx+Math.cos(ang+Math.PI/8)*r*0.35,cy+Math.sin(ang+Math.PI/8)*r*0.35,cx+Math.cos(ang+Math.PI/8)*r,cy+Math.sin(ang+Math.PI/8)*r,0.5));
  const L=lab(dd);o.push(ct(x,y-2,10,dd),ct(x,y+11,9,L[0],L[1]));});
 o.push(ct(cx,cy-r-8,12,title,'#0000ff'));return o;}
const shiftY=(p,dy)=>{const q={...p};for(const k of ['y','y1','y2','cy'])if(k in q)q[k]+=dy;return q;};
// 主排版
export function layout(blocks,meas,opt={}){const pages=[];let pg=null,y=TOP;
 let curT=null;const head=()=>{const w=meas(curT,20);pg.push(t((PW-w)/2,y+18,20,curT,COLOR.T,{u:1}));y+=30;};
 const newPage=()=>{pg=[];pages.push(pg);y=TOP;if(curT)head();};newPage();
 const ensure=h=>{if(y+h>BOT)newPage();};
 const lines=(txt,x,size,color,pitch,hang)=>{let ls;if(hang){const hw=hang*size,first=wrap(txt,RIGHT-x,size,meas)[0]||'';const rest=String(txt).slice(first.length);ls=[[first,x],...(rest?wrap(rest,RIGHT-x-hw,size,meas).map(l=>[l,x+hw]):[])];}
  else ls=wrap(txt,RIGHT-x,size,meas).map(l=>[l,x]);
  for(const [l,xx] of ls){ensure(pitch);if(l)pg.push(t(xx,y+size*0.88,size,l,color));y+=pitch;}};
 let prev=null;
 const one=(b,x,inN)=>{switch(b.t){
  case 'T':{curT=b.x;if(pg.length)newPage();else head();break;}
  case 'H':{if(y>TOP)y+=12;ensure(LH*4);lines(b.x,XH,16,COLOR.H,20);y+=6;break;}
  case 'S':{if(!inN&&y>TOP&&prev!=='H')y+=10;lines(b.x,XN,14,COLOR.S,LH);if(!inN)y+=4;break;}
  case 'R':{if(!inN&&y>TOP&&prev!=='H'&&prev!=='S')y+=10;lines(b.x,inN?x:XB,14,COLOR.R,LH);break;}
  case 'P':{if((!inN||b.gap)&&y>TOP&&prev!=='H'&&prev!=='S')y+=10;lines(b.x,x,14,COLOR.P,LH,b.hang);break;}
  case 'N':{if(y>TOP)y+=10;ensure(LH*2);pg.push(t(XN,y+14*0.88,14,b.n+'、'));
   for(const c of b.c)one(c,XB,true);break;}
  case 'IMG':{const [iw,ih]=IMG[b.k],w=IMGW[b.k],h=w*ih/iw;if(y>TOP)y+=8;ensure(h);pg.push({k:'img',key:b.k,x:(PW-w)/2,y,w,h});y+=h+8;break;}
  case 'TBL':{const cw=120,rh=46,x0=(PW-cw*3)/2;if(y>TOP)y+=10;ensure(LH+rh*3+6);lines(b.cap,XN,13,'#000000',LH);y+=4;
   b.rows.forEach((r,i)=>r.forEach((c,j)=>{const hl=b.hl&&b.hl.includes(c.split('\n')[0]);pg.push(rc(x0+j*cw,y+i*rh,cw,rh,{fill:hl?'#ffe0e0':null}));
    c.split('\n').forEach((s,k)=>pg.push(ct(x0+j*cw+cw/2,y+i*rh+19+k*16,k?11:13,s,k?(hl?'#ff0000':'#000000'):'#0000ff')));}));y+=rh*3+8;break;}
  case 'Q':{if(y>TOP&&!inN)y+=6;lines(b.x,inN?x+14:XB+14,13,COLOR.Q,16);break;}
  case 'GRID':{const W=RIGHT-XN+10,tw=b.w.reduce((a,c)=>a+c,0),cw=b.w.map(v=>v/tw*W),rh=19;if(y>TOP)y+=12;ensure(LH+rh*3);lines(b.cap,XN,14,COLOR.H,LH);y+=4;
   const drawRow=(cells,head)=>{ensure(rh);let xx=XN;cells.forEach((c,j)=>{pg.push(rc(xx,y,cw[j],rh,{fill:head?'#e8eefc':null,w0:0.6}));const fs=Math.min(10.5,(cw[j]-4)/Math.max(1,[...String(c)].length)*1.05);pg.push(ct(xx+cw[j]/2,y+13.5,head?10.5:fs,c,head?'#0000ff':'#000000'));xx+=cw[j];});y+=rh;};
   drawRow(b.head,1);for(const r of b.rows){if(y+rh>BOT){newPage();drawRow(b.head,1);}drawRow(r,0);}y+=6;break;}
  case 'COMPASS':{const h=220;if(y>TOP)y+=8;ensure(h);const y0=y;
   pg.push(...compassPrims(b.d).map(p=>shiftY(p,y0)));y+=h+6;break;}
  case 'PAGE1':{if(pg.length)newPage();pg.push(...page1(b.d));pg=[];pages.push(pg);y=TOP;break;}}
  prev=b.t;};
 for(const b of blocks)one(b,XB,false);
 if(!pg.length)pages.pop();
 const N=pages.length;pages.forEach((p,i)=>p.push(t(452,804,10,`Page ${i+1} of ${N}`)));
 return pages;}

// 繪圖指令 → SVG
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const FONT_STACK="MingshuKai,SheetTCX,'BiauKai','DFKai-SB','Kaiti TC','STKaiti',serif";
export function svgOf(prims,box,attrs='',imgUrl=k=>k){const [x0,y0,w,h]=box;const o=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" ${attrs} font-family="${esc(FONT_STACK)}">`];
 for(const p of prims){
  if(p.k==='t'){o.push(`<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${p.s}" fill="${p.c}"${p.mid?' text-anchor="middle"':''}${p.u?' text-decoration="underline"':''}>${esc(p.t)}</text>`);}
  else if(p.k==='l')o.push(`<line x1="${p.x1.toFixed(1)}" y1="${p.y1.toFixed(1)}" x2="${p.x2.toFixed(1)}" y2="${p.y2.toFixed(1)}" stroke="${p.c}" stroke-width="${p.w}"/>`);
  else if(p.k==='r')o.push(`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"${p.rr?` rx="${p.rr}"`:''} fill="${p.fill||'none'}" stroke="${p.c}" stroke-width="${p.w0}"/>`);
  else if(p.k==='c')o.push(`<circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="${p.r}" fill="${p.fill||'none'}" stroke="${p.c}" stroke-width="${p.w0}"/>`);
  else if(p.k==='img')o.push(`<image href="${esc(imgUrl(p.key))}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/>`);}
 o.push('</svg>');return o.join('');}
export function compassPrims(d){const g=new Set(d.gui.map(s=>s.replace(/方$/,'')));const J={};d.ji8.best.concat(d.ji8.good).forEach(z=>J[z.replace(/^正/,'')]=1);
 return [...compass(150,110,85,'貴人方位',dd=>g.has(dd)?['●貴人','#ff0000']:['','#000000']),...compass(PW-150,110,85,'八宅吉凶方位',dd=>J[dd]?['吉方','#008000']:['凶方','#ff0000'])];}
