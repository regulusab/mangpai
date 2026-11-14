// 盲派八字：排盤資料與盲派結構分析（賓主、體用、做功、虛實、墓庫、穿破）。純邏輯，瀏覽器與 Node 皆可用。
// 曆法沿用八字論命站（DE421 節氣定年月柱、真太陽時定日時柱、東經 70° 干支換日線），見 ../mingshu/engine.js。
import {model,G,Z,ANIMAL,SS10,GROUP_OF,relEl,isChong,liuhe,hai,isXing,sanheGroup,isBanhe,ganhe,ganKe,mainQi,stage12,suiShen} from '../mingshu/engine.js';
import {ganWx,zhiWx,shiShen,WX,hide} from '../bazi.js';
import {analyze} from '../analysis.js';
import {nayin as nayinRev} from '../sheetData.js';
export {G,Z,ANIMAL,SS10,GROUP_OF,relEl,isChong,liuhe,hai,isXing,sanheGroup,isBanhe,ganhe,ganKe,mainQi,stage12,suiShen,ganWx,zhiWx,shiShen,WX};
export const PIL=['年','月','日','時'];
export const elOf=ch=>G.includes(ch)?ganWx(ch):zhiWx(ch);
const gen=(a,b)=>(WX.indexOf(a)+1)%5===WX.indexOf(b), ctl=(a,b)=>(WX.indexOf(a)+2)%5===WX.indexOf(b);
export {gen,ctl};
// ── 神煞（依範本命盤反推之取用範圍；規則出處見 SOURCES.md）
const LU={甲:'寅',乙:'卯',丙:'巳',丁:'午',戊:'巳',己:'午',庚:'申',辛:'酉',壬:'亥',癸:'子'};
const REN={甲:'卯',乙:'辰',丙:'午',丁:'未',戊:'午',己:'未',庚:'酉',辛:'戌',壬:'子',癸:'丑'};
const GUI={甲:'丑未',戊:'丑未',庚:'丑未',乙:'子申',己:'子申',丙:'亥酉',丁:'亥酉',辛:'午寅',壬:'卯巳',癸:'卯巳'};
const WC={甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯'};
const JY={甲:'辰',乙:'巳',丙:'未',丁:'申',戊:'未',己:'申',庚:'戌',辛:'亥',壬:'丑',癸:'寅'};
const GS={申子辰:{劫煞:'巳',災煞:'午',華蓋:'辰',驛馬:'寅',將星:'子',亡神:'亥',桃花:'酉'},寅午戌:{劫煞:'亥',災煞:'子',華蓋:'戌',驛馬:'申',將星:'午',亡神:'巳',桃花:'卯'},
 巳酉丑:{劫煞:'寅',災煞:'卯',華蓋:'丑',驛馬:'亥',將星:'酉',亡神:'申',桃花:'午'},亥卯未:{劫煞:'申',災煞:'酉',華蓋:'未',驛馬:'巳',將星:'卯',亡神:'寅',桃花:'子'}};
const LIUE={申子辰:'卯',寅午戌:'酉',巳酉丑:'子',亥卯未:'午'};
const TIANXI={子:'酉',丑:'申',寅:'未',卯:'午',辰:'巳',巳:'辰',午:'卯',未:'寅',申:'丑',酉:'子',戌:'亥',亥:'戌'};
const HONGLUAN={子:'卯',丑:'寅',寅:'丑',卯:'子',辰:'亥',巳:'戌',午:'酉',未:'申',申:'未',酉:'午',戌:'巳',亥:'辰'};
const GUCHEN={寅:'巳',卯:'巳',辰:'巳',巳:'申',午:'申',未:'申',申:'亥',酉:'亥',戌:'亥',亥:'寅',子:'寅',丑:'寅'};
const GUASU={寅:'丑',卯:'丑',辰:'丑',巳:'辰',午:'辰',未:'辰',申:'未',酉:'未',戌:'未',亥:'戌',子:'戌',丑:'戌'};
const TIANDE={寅:'丁',卯:'申',辰:'壬',巳:'辛',午:'亥',未:'甲',申:'癸',酉:'寅',戌:'丙',亥:'乙',子:'巳',丑:'庚'};
const TDHE={丁:'壬',申:'巳',壬:'丁',辛:'丙',亥:'寅',甲:'己',癸:'戊',寅:'亥',丙:'辛',乙:'庚',巳:'申',庚:'乙'};
const YUEDE={寅午戌:'丙',申子辰:'壬',亥卯未:'甲',巳酉丑:'庚'};
const KUIGANG=['庚辰','壬辰','戊戌','庚戌'],GULUAN=['乙巳','丁巳','辛亥','戊申','甲寅','壬子','丙午','戊午'],LIUXIU=['丙午','丁未','戊子','戊午','己丑','己未'];
const SHIE=['甲辰','乙巳','丙申','丁亥','戊戌','己丑','庚辰','辛巳','壬申','癸亥'];
export const SUI12=['太歲','太陽','喪門','太陰','五鬼','死符','歲破','龍德','白虎','福德','天狗','病符'];
export const sui12=(yz,z)=>SUI12[((Z.indexOf(z)-Z.indexOf(yz))%12+12)%12];
export const SHA_ORDER=['金匱','五鬼','龍德','天狗','太陽','喪門','太陰','死符','歲破','白虎','福德','病符','月破','六厄','災煞','羊刃','將星','天德','天德合','月德','月德合','天乙貴人','文昌','祿神','金輿','驛馬','華蓋','紅鸞','天喜','孤辰','寡宿','亡神','劫煞','沐浴','桃花','外桃花','魁罡','六秀日','十惡大敗','孤鸞'];
export function pillarStars(P,k){const r=new Set(),p=P[k],yz=P[0].zhi,mz=P[1].zhi,dg=P[2].gan,dz=P[2].zhi,z=p.zhi,g=p.gan;
 const yg=GS[sanheGroup(yz)],dgp=GS[sanheGroup(dz)];
 if(k>0){const s=sui12(yz,z);if(s!=='太歲')r.add(s);
  for(const n of ['劫煞','災煞','亡神','驛馬','華蓋','桃花'])if(yg[n]===z)r.add(n);if(yg.將星===z)r.add('金匱');if(LIUE[sanheGroup(yz)]===z)r.add('六厄');
  if(TIANXI[yz]===z)r.add('天喜');if(HONGLUAN[yz]===z)r.add('紅鸞');if(GUCHEN[yz]===z)r.add('孤辰');if(GUASU[yz]===z)r.add('寡宿');}
 if(k!==1&&isChong(z,mz))r.add('月破');
 for(const n of ['劫煞','災煞','亡神','驛馬','華蓋','將星','桃花'])if(dgp[n]===z&&!(k===2&&n!=='將星'&&n!=='華蓋'))r.add(n);
 if(k===3&&r.has('桃花'))r.add('外桃花');
 if(g===TIANDE[mz]||z===TIANDE[mz])r.add('天德');if(g===TDHE[TIANDE[mz]]||z===TDHE[TIANDE[mz]])r.add('天德合');
 const yd=YUEDE[sanheGroup(mz)];if(g===yd)r.add('月德');if(g===ganhe(yd))r.add('月德合');
 if(LU[dg]===z)r.add('祿神');if(REN[dg]===z)r.add('羊刃');if(GUI[dg].includes(z))r.add('天乙貴人');if(WC[dg]===z)r.add('文昌');if(JY[dg]===z)r.add('金輿');
 if(stage12(dg,z)==='沐浴')r.add('沐浴');
 if(k===2){const gz=g+z;if(KUIGANG.includes(gz))r.add('魁罡');if(LIUXIU.includes(gz))r.add('六秀日');if(GULUAN.includes(gz))r.add('孤鸞');if(SHIE.includes(gz))r.add('十惡大敗');}
 return SHA_ORDER.filter(n=>r.has(n));}
export const LU_TABLE=LU,REN_TABLE=REN,GUI_TABLE=GUI,TIANXI_T=TIANXI,HONGLUAN_T=HONGLUAN;
export const taohuaOf=z=>GS[sanheGroup(z)].桃花, yimaOf=z=>GS[sanheGroup(z)].驛馬, huagaiOf=z=>GS[sanheGroup(z)].華蓋;
// ── 地支關係（盲派用語：害稱「穿」；破取子卯、卯午、午酉三組，見 SOURCES.md）
const PO=['子卯','卯午','午酉'];
export const isPo=(a,b)=>PO.includes(a+b)||PO.includes(b+a);
export const isChuan=(a,b)=>hai(a)===b;
export const MU={水:'辰',木:'未',火:'戌',金:'丑',土:'戌'}; // 土隨火入戌（段氏體系：戊入戌；己土另論，從簡）
export const KU_EL={辰:'水',未:'木',戌:'火',丑:'金'};
export function zhiRels(a,b){const r=[];if(isChong(a,b))r.push('沖');if(liuhe(a)===b)r.push('合');if(isBanhe(a,b))r.push('半合');
 if(isXing(a,b)||isXing(b,a))r.push(a===b?'自刑':'刑');if(isChuan(a,b))r.push('穿');if(isPo(a,b))r.push('破');return r;}
export function ganRels(a,b){const r=[];if(ganhe(a)===b)r.push('合');else if(ctl(ganWx(a),ganWx(b))||ctl(ganWx(b),ganWx(a)))r.push('剋');return r;}
// ── 年柱納音
export const nayin=gz=>[...nayinRev(gz)].reverse().join('');
// ── 主函式
const pad=n=>String(n).padStart(2,'0');
export function mpModel(form,opt={}){
 const m=model(form,opt);const {P,dm,dw}=m;const male=Number(form.gender)===1;
 // 旺衰（沿用本站 analysis.js：得令得地得勢；用以排盤顯示「強弱、喜用、忌神」）
 const W=[.6,.3,.1],score={木:0,火:0,土:0,金:0,水:0};
 const pillars=P.map((p,i)=>({label:PIL[i]+'柱',gan:p.gan,zhi:p.zhi,ss:i===2?'日主':p.ss,hide:hide(p.zhi).map(g=>({g,ss:shiShen(dm,g)}))}));
 pillars.forEach((p,i)=>{score[ganWx(p.gan)]+=1;const k=i===1?2:1;p.hide.forEach((x,j)=>score[ganWx(x.g)]+=(p.hide.length===1?1:W[j])*k);});
 const tot=Object.values(score).reduce((a,b)=>a+b);const yin=relEl(dw,4);const self=(score[dw]+score[yin])/tot;
 const A=analyze({pillars,dw,dm,score,self});
 const strong=A.lev==='身強'||A.lev==='偏強';
 const xi=[A.yong,A.xi].sort((a,b)=>WX.indexOf(a)-WX.indexOf(b));const ji=[A.ji[0]];const jiAll=A.ji;
 const role=w=>xi.includes(w)?'喜':jiAll.includes(w)?'忌':'閒';
 const stars=P.map((p,k)=>pillarStars(P,k));
 P.forEach((p,i)=>{p.nayin=nayin(p.gan+p.zhi);});
 const mp=analyzeMP(P,dm,male);
 return {...m,male,strong,lev:A.lev,A,xi,ji,jiAll,role,stars,mp,form,opt,score6:score};}
// ── 盲派結構分析
export const TI=['日主','比肩','劫財','正印','偏印','食神'];export const YONG=['正財','偏財','正官','七殺','傷官'];
export const tiyong=ss=>TI.includes(ss)?'體':'用';
export function analyzeMP(P,dm,male){
 const N=[];P.forEach((p,i)=>{N.push({k:'g',i,ch:p.gan,ss:i===2?'日主':p.ss,wx:ganWx(p.gan)});N.push({k:'z',i,ch:p.zhi,ss:shiShen(dm,mainQi(p.zhi)),wx:zhiWx(p.zhi)});});
 N.forEach(n=>{n.ty=tiyong(n.ss);if(n.k==='z'&&LU[dm]===n.ch){n.lu=1;n.ty='體';}n.zhu=n.i>=2;n.name=PIL[n.i]+(n.k==='g'?'干':'支')+n.ch;});
 const cnt={};WX.forEach(w=>cnt[w]=N.filter(n=>n.wx===w).length);
 const camp=n=>n.ty;const campCnt={體:N.filter(n=>n.ty==='體').length,用:N.filter(n=>n.ty==='用').length};
 const shi=w=>cnt[w];
 // 關係
 const rels=[];
 for(let a=0;a<N.length;a++)for(let b=a+1;b<N.length;b++){const x=N[a],y=N[b];if(x.k!==y.k)continue;
  const rs=x.k==='g'?ganRels(x.ch,y.ch):zhiRels(x.ch,y.ch);for(const r of rs)rels.push({a:x,b:y,r,near:Math.abs(x.i-y.i)===1});}
 // 墓：支之五行（寅申巳亥必入）或干之五行入他支之墓
 const mus=[];for(const x of N){const muZ=MU[x.wx];if(x.wx==='土')continue;for(const y of N){if(y.k!=='z'||y===x||y.ch!==muZ)continue;
  if(x.k==='z'&&!'寅申巳亥'.includes(x.ch)&&cnt[x.wx]<2)continue;if(x.k==='g'&&x.i===y.i)continue;mus.push({a:x,b:y,r:'墓'});}}
 rels.push(...mus);
 // 做功判定
 const gong=[];const used=new Set();const mark=(...ns)=>ns.forEach(n=>used.add(n));
 const strongerOrEq=(x,y)=>shi(x.wx)>=shi(y.wx);
 for(const R of rels){const {a,b,r}=R;const zhuIn=a.zhu||b.zhu;
  const T=a.ty==='體'?a:b.ty==='體'?b:null,U=T===a?b:a;
  if(['剋','沖','穿','刑','破'].includes(r)&&T&&U.ty==='用'){
   const tCtl=ctl(T.wx,U.wx)||(r!=='剋'&&strongerOrEq(T,U));
   if(tCtl&&shi(T.wx)>=shi(U.wx)-1){const zheng=T.zhu&&!U.zhu?'正向':(!T.zhu&&U.zhu?'反向':'同位');gong.push({type:'制用',how:r,t:T,u:U,dir:zheng,zhu:zhuIn});mark(T,U);}
   else if(ctl(U.wx,T.wx)){gong.push({type:'受制',how:r,t:T,u:U,dir:U.zhu&&!T.zhu?'正向':'反向',zhu:zhuIn});}}
  if((r==='合'||r==='半合')&&zhuIn){const x=a.zhu?a:b,y=x===a?b:a;
   if((x.ss==='日主'||x.ty==='體')&&y.ty==='用'){gong.push({type:'合用',how:r,t:x,u:y,dir:y.zhu?'同位':'正向',zhu:true});mark(x,y);}
   else if(x.ty==='用'&&y.ty==='體'&&y.ss!=='日主'){gong.push({type:'合用',how:r,t:y,u:x,dir:'反向',zhu:true});mark(x,y);}}
  if(r==='墓'){const box=b,obj=a;if(box.zhu&&obj.ty==='用'){gong.push({type:'墓用',how:'入墓',t:box,u:obj,dir:obj.zhu?'同位':'正向',zhu:true});mark(box,obj);}
   else if(!box.zhu&&obj.zhu&&obj.ty==='體')gong.push({type:'體入墓',how:'入墓',t:obj,u:box,dir:'反向',zhu:true});}}
 // 化用：官殺生印（相鄰或同柱、或三合印局）
 const gsN=N.filter(n=>n.ss==='正官'||n.ss==='七殺'),yinN=N.filter(n=>n.ss==='正印'||n.ss==='偏印');
 for(const g of gsN)for(const y of yinN){if(Math.abs(g.i-y.i)<=1&&gen(g.wx,y.wx)||(g.k==='z'&&y.k==='z'&&(isBanhe(g.ch,y.ch)||liuhe(g.ch)===y.ch))){if(g.zhu||y.zhu){gong.push({type:'化用',how:'相生',t:y,u:g,dir:g.zhu?'同位':'正向',zhu:true});mark(g,y);}}}
 // 生用：食傷生財
 const shN=N.filter(n=>n.ss==='食神'||n.ss==='傷官'),caiN=N.filter(n=>n.ss==='正財'||n.ss==='偏財');
 for(const s of shN)for(const c of caiN){if(Math.abs(s.i-c.i)<=1&&gen(s.wx,c.wx)&&(s.zhu||c.zhu)){gong.push({type:'生用',how:'相生',t:s,u:c,dir:'同位',zhu:true});mark(s,c);}}
 // 去重
 const seen=new Set();const G2=gong.filter(g=>{const k=g.type+g.t.name+g.u.name+g.how;if(seen.has(k))return false;seen.add(k);return true;});
 const fei=N.filter(n=>!used.has(n)&&n.ss!=='日主');
 // 勢：五行或同營（體／用）佔四個以上字為成勢
 const topWx=WX.slice().sort((a,b)=>cnt[b]-cnt[a])[0];const shiOK=cnt[topWx]>=3||campCnt.體>=5||campCnt.用>=5;
 const posGong=G2.filter(g=>['制用','合用','墓用','化用','生用'].includes(g.type)&&g.zhu);
 const negN=G2.filter(g=>(g.type==='受制'||g.type==='體入墓')&&g.zhu).length;const sc=posGong.length-negN;
 const lvl=!posGong.length?0:sc>=3&&shiOK?3:sc>=2||(sc>=1&&shiOK)?2:1;
 // 虛實：天干之財官無根為虛透
 const xu=N.filter(n=>n.k==='g'&&n.ss!=='日主'&&!P.some(p=>hide(p.zhi).some(h=>ganWx(h)===n.wx)));
 // 墓庫
 const ku=N.filter(n=>n.k==='z'&&KU_EL[n.ch]).map(n=>{const el=KU_EL[n.ch];const ss=shiShen(dm,G[WX.indexOf(el)*2+(G.indexOf(dm)%2)]);const open=N.some(o=>o.k==='z'&&o!==n&&(isChong(o.ch,n.ch)||isXing(o.ch,n.ch)));return {n,el,ss,open};});
 return {N,rels,gong:G2,fei,cnt,campCnt,shiOK,topWx,lvl,xu,ku};}
