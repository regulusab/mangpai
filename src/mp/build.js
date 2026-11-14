// 盲派八字命書：依範本章節順序產生區塊（版面與輸出沿用 ../mp/layout.js、render.js）。
// 區塊：{t:'T'|'H'|'S'|'R'|'P'|'Q', x}；{t:'N',n,c:[…]}；{t:'GRID',cap,head,rows,w}；{t:'PAGE1',d}
import {mpModel,PIL,G,Z,ANIMAL,SS10,GROUP_OF,relEl,isChong,liuhe,isXing,isBanhe,ganhe,mainQi,stage12,ganWx,zhiWx,shiShen,WX,gen,ctl,
 zhiRels,ganRels,sui12,isChuan,isPo,MU,KU_EL,taohuaOf,yimaOf,HONGLUAN_T,TIANXI_T,nayin} from './engine.js';
import {SS_CORE,GROUP_LONG,GONG,SS_AT,GAN_DTS,ZHI_XIANG,NAYIN_TXT,STAGE_TXT,ELEM} from './t-core.js';
import {SRC,INTRO_ZUOGONG,GONG_TYPE,DIR_TXT,REL_TXT,QUOTE_ZHI,QUOTE_KONG,KONG_EL,XU_TXT,BODY,LUCK_SS,ROLE_TXT,JOB_GONG,XIANG_XG,SUI_TXT} from './t-mp.js';
import {ST} from './t-static.js';
import {XZ,XZ_EN,XZ_EL,XZ_ORDER,RANK_MARRY,RANK_HUSBAND,RANK_WIFE,RANK_JEALOUS,LIFE_NUM} from './t-xz.js';
import {JIE} from '../terms.js';
import {xunkong} from '../sheetData.js';
const gzOf=y=>G[((y-4)%10+10)%10]+Z[((y-4)%12+12)%12];
const p2=n=>String(n).padStart(2,'0');
export function build(form,opt={}){
 const m=mpModel(form,opt);const {P,dm,dw,male,xi,ji,jiAll,mp}=m;const YR=m.Y;const by=m.birth.y;const B=[];
 const T=x=>B.push({t:'T',x}),H=x=>B.push({t:'H',x}),Sx=x=>B.push({t:'S',x}),R=x=>B.push({t:'R',x}),Pp=x=>B.push({t:'P',x}),Q=(x,s)=>B.push({t:'Q',x:`「${x}」——${s}`});
 let num=0;const resetN=()=>{num=0;};const N=c=>B.push({t:'N',n:++num,c:c.map(x=>typeof x==='string'?{t:'P',x}:x)});
 const r_=x=>({t:'R',x}),q_=(x,s)=>({t:'Q',x:`「${x}」——${s}`});
 const role=w=>xi.includes(w)?'喜':jiAll.includes(w)?'忌':'閒';
 const ssG=g=>shiShen(dm,g),ssZ=z=>shiShen(dm,mainQi(z));
 const ages=['1-16','17-32','33-48','49-64'];
 const kong=m.dkong,ykong=m.ykong;
 const ganOfSS=s=>[...G].find(g=>ssG(g)===s);
 const cntG=k=>SS10.filter(s=>GROUP_OF[s]===k).reduce((a,s)=>a+m.cnt[s],0);
 const hasSS=s=>m.cnt[s]>0;const flat=m.stars.flat();const hasStar=n=>flat.includes(n);
 const starAt=n=>m.stars.map((a,i)=>a.includes(n)?i:-1).filter(i=>i>=0);
 const minguo=y=>y-1911;const age=y=>y-by+1;
 const dys=m.dayun;const dyOf=a=>dys.find(d=>a>=d.from&&a<=d.to);
 const dWx=dw;const name=m.name;const TA='您';
 const zs=P.map(p=>p.zhi),gs=P.map(p=>p.gan);
 const nm=n=>`${n.name}（${n.ss}）`;
 // 關係（運、年對原局）
 const luckRels=gz=>{const o=[];P.forEach((p,i)=>{for(const r of ganRels(gz[0],p.gan))o.push({i,k:'g',r,ch:p.gan});for(const r of zhiRels(gz[1],p.zhi))o.push({i,k:'z',r,ch:p.zhi});
  if(MU[zhiWx(p.zhi)]===gz[1]&&'寅申巳亥'.includes(p.zhi))o.push({i,k:'z',r:'墓',ch:p.zhi});});return o;};
 const rv=r=>r==='半合'?'半合':'相'+r;
 const relLine=(o,lbl)=>o.r==='墓'?`${PIL[o.i]}支${o.ch}入${lbl}地支之墓`:`${lbl}${o.k==='g'?'天干':'地支'}與${PIL[o.i]}${o.k==='g'?'干':'支'}${o.ch}${rv(o.r)}`;
 // ───── 第 1 頁：命盤
 const ly=[];for(let y=YR-3;y<=YR+11;y++){const gz=gzOf(y);ly.push({y,age:age(y),gz,ss:[ssG(gz[0]),ssZ(gz[1])]});}
 const birth=m.birth;const lun=birth.l;
 B.push({t:'PAGE1',d:{name,sex:male?'男':'女',birth,lun:[Math.abs(lun[1]),lun[2],minguo(lun[0]),lun[1]<0],P:P.map(p=>({gan:p.gan,zhi:p.zhi,ss:p.ss,cang:p.cang,fu:p.fu,stage:p.stage})),
  sc:m.sc,cnt:m.cnt,dw,stars:m.stars,dayun:dys.slice(0,8),ly,ages,tianyun:P[0].nayin.slice(-1),taixi:m.taixi,taiyuan:m.taiyuan,mg:m.mg,ge:m.ge,blood:m.blood,
  kong:[ykong,kong],xi,ji,xz:m.xz,strong:m.strong,chusheng:m.chusheng,made:opt.made||'',place:form.placeName||'',local:form.local&&form.local.tz!==8?`當地 ${form.local.date} ${form.local.time}（UTC${form.local.tz>=0?'+':''}${form.local.tz}）`:''}});
 // ═════ 八字基本命理分析
 T('八字基本命理分析');
 H('由八字五行論斷性格優缺點');resetN();
 {const yz=P[0].zhi,ny=P[0].nayin;N([r_(`${P[0].gan}${yz}年生`),`您生年納音為「${ny}」，生肖屬${ANIMAL[yz]}。${NAYIN_TXT[ny]||''}`]);}
 for(let k=0;k<5;k++){const c=cntG(k);const s0=SS10.filter(s=>GROUP_OF[s]===k);
  if(c>=3){const top=s0.slice().sort((a,b)=>m.cnt[b]-m.cnt[a])[0];N([r_(`八字${GROUP_LONG[k]}偏多（共 ${c} 個）`),`${GROUP_LONG[k]}代表${SS_CORE[top].p}。份量重時，長處是${SS_CORE[top].good}；需要留意的是${SS_CORE[top].bad}。`]);}
  if(c===0)N([r_(`八字不見${GROUP_LONG[k]}`),`${GROUP_LONG[k]}代表${SS_CORE[s0[0]].p}。命局不見此類十神，代表這方面的能力需要後天刻意培養；行運遇到${GROUP_LONG[k]}的年份，常是這方面發生轉變的時候。`]);}
 N([r_(`由日干看本性：${dm}${dWx}`),q_(GAN_DTS[dm][0],'《滴天髓·天干論》'),GAN_DTS[dm][1]]);
 const scSort=WX.slice().sort((a,b)=>m.sc[b]-m.sc[a]);
 for(const w of WX)if(m.sc[w]>=18)N([r_(`五行${w}偏旺（${m.sc[w]} 分）`),`${w}主${ELEM[w].trait}。偏旺時：${ELEM[w].over}。`]);
 for(const w of WX)if(m.sc[w]<=3)N([r_(`五行${w}偏弱（${m.sc[w]} 分）`),`${ELEM[w].under}。`]);
 P.forEach((p,i)=>{if(i!==2)N([r_(`${PIL[i]}干見${p.ss}`),`${GONG[i].name}代表${GONG[i].kin}。${SS_AT[p.ss][i]}。`]);});
 P.forEach((p,i)=>{const s=ssZ(p.zhi);N([r_(`${PIL[i]}支${p.zhi}為${s}`),`${p.zhi}為${ZHI_XIANG[p.zhi]}。落在${GONG[i].name}，${SS_AT[s][i]}。`]);});
 H('六十甲子命格與空亡之現象');resetN();
 N([r_(`年柱${P[0].gan}${P[0].zhi}：${P[0].nayin}`),NAYIN_TXT[P[0].nayin]]);
 N([r_(`日柱${P[2].gan}${P[2].zhi}：${P[2].nayin}`),`日柱代表自己與配偶。${NAYIN_TXT[P[2].nayin]}`]);
 {const kp=P.map((p,i)=>kong.includes(p.zhi)&&i!==2?i:-1).filter(i=>i>=0);
  N([r_(`日柱旬空：${kong}`),`以日柱${P[2].gan}${P[2].zhi}所在之旬推算，${kong[0]}、${kong[1]}兩支為空亡。${kp.length?'命局'+kp.map(i=>PIL[i]+'柱').join('、')+'落空。':'命局其他三柱地支未落日空。'}`]);
  for(const i of kp){const s=ssZ(P[i].zhi);N([r_(`${PIL[i]}柱落空亡`),`${GONG[i].name}代表${GONG[i].kin}，落空表示這方面的助力較虛，期待與結果易有落差；${PIL[i]}支為${s}，${s}所代表的「${SS_CORE[s].people}」緣分也較淡，宜多經營。`,
   q_(QUOTE_KONG.t,QUOTE_KONG.s),KONG_EL[zhiWx(P[i].zhi)]]);}
  const yk=P.map((p,i)=>ykong.includes(p.zhi)&&i!==0?i:-1).filter(i=>i>=0);
  if(yk.length)N([r_(`年柱旬空：${ykong}`),`以年柱推算之空亡落在${yk.map(i=>PIL[i]+'柱').join('、')}，古法認為與祖上、長輩相關之助力較虛。`]);}
 H('由八字看出生之富貴貧賤命格');Ps(INTRO_ZUOGONG);resetN();
 function Ps(a){a.forEach(Pp);}
 {const dg=mp.N.find(n=>n.k==='g'&&n.i===2),dzN=mp.N.find(n=>n.k==='z'&&n.i===2);
  const dgRel=mp.rels.filter(r=>(r.a===dg||r.b===dg));const dzRel=mp.rels.filter(r=>(r.a===dzN||r.b===dzN));
  const other=(r,n)=>r.a===n?r.b:r.a;
  N([r_('先看日干（主）'),dgRel.length?dgRel.map(r=>`日干${dm}與${nm(other(r,dg))}${rv(r.r)}`).join('；')+`。日干有所作用，代表${TA}本人主動追求的目標就在這裡。`:`日干${dm}與其他天干無合無剋，本人的追求不直接表現在天干，改看日支。`]);
  N([r_('再看日支（主位）'),dzRel.length?dzRel.map(r=>`日支${dzN.ch}與${nm(other(r,dzN))}${r.r==='墓'?'有入墓關係':rv(r.r)}`).join('；')+'。':'日支與其他地支無明顯作用，主位力量較為安靜。']);
  const g2=mp.gong;if(!g2.length)N(['命局找不到明顯的做功結構，屬於「平穩型」八字：一生較少大起大落，宜以專業技能、穩定工作為本，配合好運時段進取。']);
  for(const g of g2){const how=g.how==='剋'?(ctl(g.t.wx,g.u.wx)?`${g.t.name}剋${g.u.name}`:`${g.u.name}剋${g.t.name}`):`${g.t.name}與${g.u.name}${g.how}`;
   N([r_(`${g.type}：${how}`),`${nm(g.t)}為「${g.t.ty}」，${nm(g.u)}為「${g.u.ty}」。${GONG_TYPE[g.type]}${DIR_TXT[g.dir]||''}`]);}
  const fe=mp.fei;if(fe.length)N([r_('廢神'),`${fe.map(nm).join('、')}未參與主要作用，屬於較閒置的字；行運引動時才會發揮。`]);
  const lvTxt=['結構以穩定為主，做功不明顯，宜以專業與穩定為本，靠時間累積成果。','主位有做功，屬中等層次，有一技之長與穩定發展，好運時可更上一層。','主位做功明確，屬中上層次，事業與財富有較大的發揮空間。','主位做功多且有勢，屬較高層次，有機會在專業或組織中取得領導地位。'];
  N([r_('層次評估'),`主位參與的做功共 ${g2.filter(g=>g.zhu&&['制用','合用','墓用','化用','生用'].includes(g.type)).length} 處，${mp.shiOK?`五行${mp.topWx}或同營之字成勢`:'命局未明顯成勢'}。${lvTxt[mp.lvl]}`,'（盲派以「有勢、有功、效率高」論層次，本站依規則推算，僅供參考。）']);
  for(const n of mp.xu)N([r_(`虛透：${n.name}`),XU_TXT[n.ss]+'（象法摘要，來源待核）']);
  for(const k of mp.ku)N([r_(`墓庫：${k.n.name}為${k.el}庫（${k.ss}之庫）`),`${k.n.ch}藏有${k.el}氣，為${k.ss}的庫。${k.open?'命局中有沖刑將庫打開，庫中之物可以取用。':'命局中無沖刑開庫，屬「閉庫」，需待運歲沖開才見收穫。'}`]);}
 H('八字看一生婚姻訊息');resetN();
 {const dz=P[2].zhi,gongSS=ssZ(dz),star=male?['正財','偏財']:['正官','七殺'];const starName=male?'妻星（財）':'夫星（官殺）';
  N([r_(`夫妻宮（日支）為${dz}：${gongSS}`),`${SS_AT[gongSS][2]}。此宮五行為${zhiWx(dz)}，屬${role(zhiWx(dz))}神，${role(zhiWx(dz))==='喜'?'配偶宮為喜，婚姻多能互相扶持。':role(zhiWx(dz))==='忌'?'配偶宮為忌，相處宜多包容，婚前宜多了解對方。':'婚姻吉凶視運程而定。'}`]);
  zs.forEach((z,i)=>{if(i===2)return;for(const r of zhiRels(dz,z))N([r_(`夫妻宮與${PIL[i]}支${z}${rv(r)}`),`${REL_TXT[r]}${GONG[i].name}代表${GONG[i].kin}，${r==='合'||r==='半合'?'與'+GONG[i].kin+'關係緊密，婚姻易受其影響。':'婚姻中宜留意與'+GONG[i].kin+'之間的摩擦或聚少離多。'}`]);});
  const sc_=mp.N.filter(n=>star.includes(n.ss));
  N([r_(`${starName}：${sc_.length?sc_.map(n=>n.name).join('、'):'命局不見'}`),sc_.length?`${starName}在${[...new Set(sc_.map(n=>n.zhu?'主位':'賓位'))].join('與')}。${sc_.some(n=>n.zhu)?'星在主位，伴侶與自己的生活緊密相連。':'星在賓位，緣分常來自外地、工作或朋友介紹。'}${sc_.length>=3?'星多則選擇多，感情上宜專一。':''}`:`配偶星不現，緣分較晚或較淡，宜以夫妻宮與運程判斷時機。`]);
  const dg=P[2].gan,heG=gs.map((g,i)=>i!==2&&ganhe(dg)===g?i:-1).filter(i=>i>=0);
  if(heG.length)N([r_(`日干${dg}合${heG.map(i=>PIL[i]+'干'+gs[i]).join('、')}`),`日干相合者，即本人心之所向。合的是${ssG(gs[heG[0]])}${heG.length>=2?'，且一干合兩字，感情上易有比較與猶豫，宜專一':''}。`]);
  if(male&&cntG(0)>=3&&cntG(2)>0)N([r_('比劫多而見財'),'比劫有奪財之象，男命宜留意朋友介入感情或財務，婚後錢財宜清楚規劃。']);
  if(!male&&hasSS('傷官')&&(hasSS('正官')))N([r_('傷官與正官同見'),'女命傷官見官，對伴侶要求高、言語較直，相處宜多肯定對方。']);
  if(hasStar('孤鸞'))N([r_('日柱孤鸞'),'孤鸞日主個性獨立，感情上不輕易妥協；晚婚或婚後各有天地，反而較和諧。']);
  const th=starAt('桃花');if(th.length)N([r_(`桃花在${th.map(i=>PIL[i]+'柱').join('、')}`),'桃花主人緣與魅力。'+(th.includes(3)?'時柱為牆外桃花，婚後宜與異性保持適當距離。':'在年月日為牆內桃花，多主社交人緣佳。')]);
  if(kong.includes(dz))N([r_('夫妻宮落空亡'),'夫妻宮空亡，對婚姻的期待與現實易有落差，宜晚婚或多溝通。']);
  if(hasStar('羊刃')&&starAt('羊刃').includes(2))N([r_('日坐羊刃'),'日坐羊刃，個性剛烈，夫妻宜避免爭強，凡事商量。']);}
 H('由八字看六親互動現象');resetN();
 {N([r_(`祖上（年柱${P[0].gan}${P[0].zhi}）`),`年干${P[0].ss}、年支${ssZ(P[0].zhi)}。${SS_AT[P[0].ss][0]}。`+(isChong(P[0].zhi,P[2].zhi)?'年支與日支相沖，主早年離鄉或與祖上家族較疏遠。':'')]);
  N([r_(`父母兄弟（月柱${P[1].gan}${P[1].zhi}）`),`月干${P[1].ss}、月支${ssZ(P[1].zhi)}。${SS_AT[P[1].ss][1]}。`+(isChong(P[1].zhi,P[2].zhi)?'月日相沖，與父母觀念不同，成年後宜分居各自發展。':'')]);
  const fa=mp.N.filter(n=>n.ss==='偏財'),mo=mp.N.filter(n=>n.ss==='正印');
  N([r_('父星（偏財）'),fa.length?`父星在${fa.map(n=>n.name).join('、')}。`+(fa.some(n=>n.i===1||n.i===0)?'在年月，父親對早年影響大。':'在日時，父子（女）關係到成年後更緊密。'):'命局不見偏財，與父親相處時間較少或父親較忙碌，可以正財參看。']);
  N([r_('母星（正印）'),mo.length?`母星在${mo.map(n=>n.name).join('、')}。母親是重要的依靠與貴人。`+(mo.some(n=>kong.includes(n.ch))?'母星落空，母親助力較虛或聚少離多。':''):'命局不見正印，母親的照顧多以實際行動表現，可以偏印參看。']);
  const bj=cntG(0);N([r_(`兄弟姊妹（比劫 ${bj} 個）`),bj>=3?'比劫多，兄弟朋友多，但在錢財上宜分清楚。':bj===0?'比劫不見，手足緣較淡或靠自己打拼。':'比劫適中，與手足互動平和。']);
  const kid=male?['正官','七殺']:['食神','傷官'];const kn=mp.N.filter(n=>kid.includes(n.ss));
  N([r_(`子女（時柱${P[3].gan}${P[3].zhi}）`),`時干${P[3].ss}、時支${ssZ(P[3].zhi)}。${SS_AT[P[3].ss][3]}。子女星（${kid.join('、')}）${kn.length?'在'+kn.map(n=>n.name).join('、'):'不現，子女緣以時柱論'}。`+(kong.includes(P[3].zhi)?'時柱落空，子女緣較晚或聚少離多。':'')+(isChong(P[2].zhi,P[3].zhi)?'日時相沖，與子女觀念差異大，宜多溝通。':'')]);
  if(starAt('驛馬').includes(0)||'寅申巳亥'.includes(P[0].zhi))N([r_('年支見寅申巳亥（驛馬之地）'),'祖上或長輩多奔波遷徙，本人自幼活潑好動，適應力強。']);}
 H('由八字看身體疾厄現象');resetN();
 {const hi=scSort[0],lo=scSort[4];
  N([r_(`五行${hi}最旺`),`宜留意${ELEM[hi].organ}方面的保養，避免過度使用。`]);N([r_(`五行${lo}最弱`),`${ELEM[lo].organ}較需調養，作息與飲食可多照顧此方面。`]);
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(const r of zhiRels(zs[i],zs[j]))if(['沖','穿','刑','破'].includes(r))N([r_(`${PIL[i]}支${zs[i]}與${PIL[j]}支${zs[j]}${rv(r)}`),`象法以${PIL[i]}柱主${BODY[PIL[i]]}、${PIL[j]}柱主${BODY[PIL[j]]}，${REL_TXT[r]}平時宜注意相關部位的碰撞、扭傷與保養。（象法摘要，來源待核）`]);
  N([r_('日常養生建議'),`宜多攝取有助於${xi.join('、')}的食物：${xi.map(w=>ELEM[w].food).join('；')}。作息以規律為主，最弱五行${lo}對應${ELEM[lo].organ}，宜避免過勞、定期檢查。`,'以上依命理五行推論，僅供參考，身體不適請以醫師診斷為準。']);}
 H('由八字看職業取向論斷');resetN();
 {const types=[...new Set(mp.gong.filter(g=>JOB_GONG[g.type]).map(g=>g.type))];
  for(const t of types)N([r_(`做功型態：${t}`),JOB_GONG[t]]);
  for(const w of xi)N([r_(`喜用五行：${w}`),`適合與${w}相關的行業：${ELEM[w].job}。發展方位以${ELEM[w].dir}較有利。`]);
  for(let k=0;k<5;k++){if(cntG(k)>=3){const s=SS10.filter(x=>GROUP_OF[x]===k).sort((a,b)=>m.cnt[b]-m.cnt[a])[0];N([r_(`${GROUP_LONG[k]}偏多`),`${SS_CORE[s].p}的特質明顯，職場上宜發揮：${SS_CORE[s].good}。`]);}}}
 H('八字補述(該告訴您的秘密)');resetN();
 {const zc=s=>zs.filter(z=>s.includes(z)).length;
  if(zc('子午卯酉')>=2)N([r_(`地支子午卯酉見 ${zc('子午卯酉')} 個`),XIANG_XG.find(x=>x.k==='四正多').t]);
  if(zc('寅申巳亥')>=2)N([r_(`地支寅申巳亥見 ${zc('寅申巳亥')} 個`),XIANG_XG.find(x=>x.k==='四生多').t]);
  if(zc('辰戌丑未')>=2)N([r_(`地支辰戌丑未見 ${zc('辰戌丑未')} 個`),XIANG_XG.find(x=>x.k==='四庫多').t]);
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){if(P[i].gan+P[i].zhi===P[j].gan+P[j].zhi)N([r_(`${PIL[i]}柱與${PIL[j]}柱伏吟`),'兩柱相同為伏吟，主同一類事情反覆發生，凡事宜有耐心。']);
   if(isChong(zs[i],zs[j])&&ctl(ganWx(gs[i]),ganWx(gs[j]))||isChong(zs[i],zs[j])&&ctl(ganWx(gs[j]),ganWx(gs[i])))N([r_(`${PIL[i]}柱與${PIL[j]}柱天剋地沖`),`${GONG[i].kin}與${GONG[j].kin}之間的變動較大。`]);}
  if(hasStar('華蓋')&&(cntG(4)>0))N([r_('華蓋與印星同見'),'對宗教、哲學、藝術或玄學有興趣，獨處時特別有靈感。']);
  if(hasStar('魁罡'))N([r_('日柱魁罡'),'魁罡主剛毅果斷、有領導力，個性鮮明，不喜被管。']);
  if(hasStar('羊刃')&&(hasSS('七殺')))N([r_('羊刃與七殺同見'),'刃殺相見，主有威權、敢負責，適合紀律嚴明的環境。']);
  if(flat.filter(x=>x==='天乙貴人').length>=2)N([r_('天乙貴人兩見以上'),'一生貴人多，遇困難時常有人伸出援手，宜廣結善緣。']);
  const dzc=G.split('').find(g=>gs.filter(x=>x===g).length>=2);if(dzc&&dzc!==dm)N([r_(`天干${dzc}兩見`),`${ssG(dzc)}的作用加倍，${SS_CORE[ssG(dzc)].p}的事情在一生中反覆出現。`]);
  if(!num)N(['命局結構平和，無特殊組合。']);}
 H('用納音十二長生來論命');resetN();
 P.forEach((p,i)=>N([r_(`日干${dm}在${PIL[i]}支${p.zhi}為「${p.stage}」（${ages[i]}歲）`),`${STAGE_TXT[p.stage]}。${GONG[i].name}主${GONG[i].time}與${GONG[i].kin}。`]));
 H('職業命理師直斷八字命運');
 Sx('以下用盲派象法直斷您的性格及一生常見的現象，好的請保持，不好的請留意改進。');resetN();
 {const dzs=ssZ(P[2].zhi);const keyD='日支'+(P[2].zhi===({甲:'卯',乙:'辰',丙:'午',丁:'未',戊:'午',己:'未',庚:'酉',辛:'戌',壬:'子',癸:'丑'})[dm]?'羊刃':dzs);
  const xs=XIANG_XG.find(x=>x.k===keyD)||XIANG_XG.find(x=>x.k==='日支'+dzs);if(xs)N([xs.t]);
  if(hasSS('傷官')&&P.some((p,i)=>i!==2&&p.ss==='正官'))N([XIANG_XG.find(x=>x.k==='傷官見官').t]);
  if(mp.gong.some(g=>g.type==='化用'))N([XIANG_XG.find(x=>x.k==='殺印相生').t]);
  if(hasSS('食神')&&hasSS('七殺'))N([XIANG_XG.find(x=>x.k==='食神制殺').t]);
  if(cntG(0)>=3)N([XIANG_XG.find(x=>x.k==='比劫多').t]);if(cntG(2)>=3)N([XIANG_XG.find(x=>x.k==='財多').t]);if(cntG(4)>=3)N([XIANG_XG.find(x=>x.k==='印多').t]);
  if(hasSS('正官')&&hasSS('七殺'))N([XIANG_XG.find(x=>x.k==='官殺混雜').t]);}
 Sx('以下用盲派象法看先天體質，有病早治、無病早防。');resetN();
 {const dz=P[2].zhi;const bad=zs.map((z,i)=>i===2?[]:zhiRels(dz,z).filter(r=>['沖','穿','刑','破'].includes(r)).map(r=>({i,r}))).flat();
  if(bad.length)bad.forEach(b=>N([`日支（${BODY['日']}）與${PIL[b.i]}支相${b.r}：心腦、腰部與${BODY[PIL[b.i]]}宜注意保養，避免過勞。`]));else N(['日支（自身）未受沖穿，先天底子較穩定，保持規律作息即可。']);
  const k=WX.find(w=>m.sc[w]===0);if(k)N([`命局缺${k}：${ELEM[k].organ}較需留意。`]);}
 Sx('以下是依做功結構推斷的職業傾向，可作為選擇行業的參考。');resetN();
 {const t=mp.gong.find(g=>JOB_GONG[g.type]);N([t?`主結構為「${t.type}」：${JOB_GONG[t.type]}`:'結構偏靜，宜從事穩定、可累積專業的工作，如行政、技術、專業證照類。']);
  if((hasStar('華蓋')||hasStar('文昌'))&&cntG(4)>0)N(['華蓋、文昌與印星相見：可在學術、文化、宗教或教育界發展。']);}
 Sx('以下推斷您的工作位階與職業命格。');resetN();
 {const lv=['宜穩定上班、累積專業資歷，以專業技術立足。','可擔任專業執行者或基層主管，靠能力逐步晉升。','可擔任中高階主管或專業領域的佼佼者，有一定決策權。','有機會成為組織的領導者或自行創業，掌握資源與人事。'];N([lv[mp.lvl]]);
  if(hasSS('七殺')&&cntG(4)>0)N(['七殺有印：能在壓力中掌權，適合紀律、管理職。']);if(hasSS('正官')&&cntG(2)>0)N(['財官相見：事業與收入互相支撐，適合在制度內穩定升遷。']);}
 Sx('以下看您的學業、才華與考運。');resetN();
 {if(cntG(4)>0)N([`印星 ${cntG(4)} 見：好學有耐心，考試、證照運不錯。`]);else N(['印星不見：學習靠興趣驅動，宜選擇實作型的學習方式。']);
  if(cntG(1)>0)N([`食傷 ${cntG(1)} 見：有表達力與創意，適合以作品展現才華。`]);else N(['食傷不見：不擅自我推銷，宜培養表達能力。']);
  if(hasStar('文昌'))N(['命帶文昌：文筆與理解力佳，利考試。']);}
 Sx('以下看您的婚姻狀況，作為經營感情的參考。');resetN();
 {const dz=P[2].zhi;const r0=zs.some((z,i)=>i!==2&&zhiRels(dz,z).some(r=>['沖','穿','刑'].includes(r)));
  N([r0?'夫妻宮受沖穿刑，婚姻中磨合較多，晚婚或多溝通可減少波折。':'夫妻宮安穩，婚姻基礎較穩定。']);
  N([role(zhiWx(dz))==='喜'?'配偶宮為喜用，伴侶能成為助力。':'配偶宮非喜用，宜選擇個性互補、能包容的對象。']);}
 H('小兒關煞檢查表');
 Pp('「小兒關煞」是民間對幼兒成長時期的提醒，依出生月份與時辰對照。各家流傳的對照表不盡相同，以下兩項為較常見的版本（來源待核），僅作為照顧上的提醒，不必過度擔心。');resetN();
 {const mz=P[1].zhi,hz=P[3].zhi;const SZ={寅:'巳亥',申:'巳亥',卯:'辰戌',酉:'辰戌',辰:'卯酉',戌:'卯酉',巳:'寅申',亥:'寅申',子:'丑未',午:'丑未',丑:'子午',未:'子午'};
  N([r_(`四柱關：${SZ[mz].includes(hz)?'有犯':'不犯'}`),SZ[mz].includes(hz)?'民俗說法主幼時宜少坐高處、少抱出遠門，多注意跌撞。':'未犯此關。']);
  const g1='寅申巳亥',g2='子午卯酉',g3='辰戌丑未';const bai=(g1.includes(mz)&&g3.includes(hz))||(g2.includes(mz)&&g1.includes(hz))||(g3.includes(mz)&&g2.includes(hz));
  N([r_(`百日關：${bai?'有犯':'不犯'}`),bai?'民俗說法主出生百日內宜少出門、注意保暖與飲食衛生。':'未犯此關。']);}
 B.push({t:'GRID',cap:'大運干支十神總表',head:['大運','歲數','西元','干支','天干十神','地支十神','十二運','與日柱關係'],w:[1,1.2,1.6,1,1.1,1.1,1,2.4],
  rows:dys.slice(0,8).map((d,i)=>[`第${i+1}運`,`${d.from}-${d.to}`,`${by+d.from-1}-${by+d.to-1}`,d.gz,d.ss,d.zs,stage12(dm,d.gz[1]),[...ganRels(d.gz[0],dm).map(r=>'干'+r),...zhiRels(d.gz[1],P[2].zhi).map(r=>'支'+r)].join('、')||'—'])});
 B.push({t:'GRID',cap:'流年干支總表',head:['西元','歲數','干支','天干十神','地支十神','生肖歲神','與日柱關係'],w:[1,0.8,1,1.1,1.1,1.1,2.4],
  rows:ly.map(u=>[String(u.y),String(u.age),u.gz,u.ss[0],u.ss[1],sui12(P[0].zhi,u.gz[1]),[...ganRels(u.gz[0],dm).map(r=>'干'+r),...zhiRels(u.gz[1],P[2].zhi).map(r=>'支'+r)].join('、')||'—'])});
 // ═════ 八字斷一生運勢演變
 T('八字斷一生運勢演變');
 H('一生中的財富演變預估');Pp('財富一半看先天結構，一半靠後天經營。以下從盲派「財在何處、如何取得」的角度，推估您先天的財富模式與較有利的時段。');
 Sx('一生中的財富從哪裡來：');resetN();
 {const cai=mp.N.filter(n=>n.ss==='正財'||n.ss==='偏財');
  if(!cai.length)N(['命局不見財星，財富多以食傷（才藝）或官印（職位）轉化而來，宜以專業換取收入。']);
  else{if(cai.some(n=>n.zhu))N([`財星在主位（${cai.filter(n=>n.zhu).map(n=>n.name).join('、')}），屬於「自己的財」，宜自營或掌握實權。`]);
   if(cai.some(n=>!n.zhu))N([`財星在賓位（${cai.filter(n=>!n.zhu).map(n=>n.name).join('、')}），屬於「外面的財」，需透過工作、交易或合作取得${cai.some(n=>n.i===0)?'，年柱為遠方，往外地發展較有利':''}。`]);
   const gc=mp.gong.filter(g=>['制用','合用','墓用'].includes(g.type)&&(g.u.ss==='正財'||g.u.ss==='偏財'));if(gc.length)N([`財星有被主位取得的作用（${[...new Set(gc.map(g=>g.type))].join('、')}），代表有能力把財拿到手。`]);}}
 Sx('一生中發財與破財的時機：');resetN();
 {const goodSS=m.strong?['食神','傷官','偏財','正財','正官','七殺']:['比肩','劫財','正印','偏印'];const lines=[];
  dys.slice(0,8).forEach(d=>{[[d.gz[0],d.ss,0],[d.gz[1],d.zs,5]].forEach(([ch,ss,off])=>{const a0=d.from+off,a1=a0+4;if(a1<age(YR)-20)return;const w=elOf(ch);
   const isCai=GROUP_OF[ss]===2;const good=role(w)==='喜'||(!jiAll.includes(w)&&goodSS.includes(ss));
   if(isCai||GROUP_OF[ss]===0||GROUP_OF[ss]===4)lines.push(`${a0}─${a1}歲：行${ss}運（${w}，${role(w)}神），${good?'較有利進財':'宜防破財'}。`);});});
  N([m.strong?'您命局屬身強，行食傷財官運較能發揮，行比劫運宜防破財：':'您命局屬身弱，行印比運較能發揮，行財官運宜量力而為、防破財：',...lines.slice(0,8)]);
  const ys=gzOf(YR);N([`西元${YR}年上半年行${ssG(ys[0])}（${role(ganWx(ys[0]))}），下半年行${ssZ(ys[1])}（${role(zhiWx(ys[1]))}）。`]);}
 Sx('以命局中之喜用神在四柱中的位置論財富：');resetN();
 for(const w of xi){const at=P.map((p,i)=>(ganWx(p.gan)===w||zhiWx(p.zhi)===w)?i:-1).filter(i=>i>=0);
  N([r_(`喜用神${w}${at.length?'在'+at.map(i=>PIL[i]+'柱').join('、'):'不在原局'}`),at.length?at.map(i=>`${PIL[i]}柱：${['早年即有助力，宜善用家族資源','青壯年時期在工作單位中得力','中年後自己與配偶能守財','晚年財運較佳，子女亦有助力'][i]}`).join('；')+'。':`喜用神不現於原局，需待大運流年補足，${w}運時是累積財富的好時機。`]);}
 // 流年婚姻
 const yGz=gzOf(YR),yAge=age(YR);const yl=`西元：${YR} 農曆：${minguo(YR)}${yGz}年 ${yAge}歲`;
 H('八字斷流年婚姻狀況');Sx(yl);resetN();
 {const dz=P[2].zhi,yz=P[0].zhi,lz=yGz[1];const curDy=dyOf(yAge);let any=false;
  if(isChong(lz,P[1].zhi)||liuhe(lz)===P[1].zhi){N([r_('流年與月令沖合'),'月令被引動，生活環境有變化，感情上容易出現新的機會。']);any=true;}
  if(zhiRels(lz,dz).length){N([r_(`流年${lz}與夫妻宮${dz}${zhiRels(lz,dz).map(rv).join('、')}`),'夫妻宮被引動，已婚者家庭有變化（搬家、添丁或磨合），未婚者有感情契機。']);any=true;}
  const star=male?['正財','偏財']:['正官','七殺'];if(star.includes(ssG(yGz[0]))||star.includes(ssZ(lz))){N([r_(`流年見${male?'妻':'夫'}星`),'配偶星透出或到位，感情事件較多，是交往或論及婚嫁的時機。']);any=true;}
  if(HONGLUAN_T[yz]===lz||TIANXI_T[yz]===lz){N([r_(`流年逢${HONGLUAN_T[yz]===lz?'紅鸞':'天喜'}`),'喜事星到，利婚嫁、添丁與喜慶。']);any=true;}
  if(taohuaOf(yz)===lz||taohuaOf(dz)===lz){N([r_('流年逢桃花'),'人緣與異性緣增強，單身者機會多，已婚者宜守分寸。']);any=true;}
  if(curDy&&zhiRels(curDy.gz[1],dz).length){N([r_(`大運${curDy.gz}引動夫妻宮`),'本大運期間婚姻宮持續有動，宜多經營家庭關係。']);any=true;}
  if(!any)N(['今年夫妻宮與配偶星較少被引動，感情生活以平穩為主。']);}
 H('八字斷一生運勢彙整');resetN();
 {const PAIR=['年','月','日','時'];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(const r of zhiRels(zs[i],zs[j]))
   N([r_(`${PAIR[i]}支${zs[i]}與${PAIR[j]}支${zs[j]}${rv(r)}`),`${REL_TXT[r]}應在${GONG[i].kin}與${GONG[j].kin}之間，時間上多在${GONG[i].time.split('、')[0]}或${GONG[j].time.split('、')[0]}。`]);
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(const r of ganRels(gs[i],gs[j]))N([r_(`${PAIR[i]}干${gs[i]}與${PAIR[j]}干${gs[j]}相${r}`),r==='合'?`${gs[i]}${gs[j]}相合，${GONG[i].kin}與${GONG[j].kin}之間情感聯繫緊密。`:`天干相剋，主${GONG[i].kin}與${GONG[j].kin}在觀念上有落差。`]);
  if(isChong(m.mg[1],P[2].zhi)||isChong(m.mg[1],P[0].zhi))N([r_(`命宮${m.mg}與${isChong(m.mg[1],P[2].zhi)?'日支':'年支'}相沖`),'命宮受沖，一生變動較多，宜培養穩定的生活節奏。']);
  QUOTE_ZHI.forEach(q=>Q(q.t,q.s));Pp('以上三句說明地支作用的輕重：四生（寅申巳亥）怕沖、四庫（辰戌丑未）喜沖開、四正（子午卯酉）逢沖要細看旺衰。');}
 // 大運
 H('八字斷大運(看大運發生的事)');
 const ci=Math.max(0,dys.findIndex(d=>yAge>=d.from&&yAge<=d.to));
 const luckBlock=(gz,lbl,isY)=>{resetN();const sg=ssG(gz[0]),sz=ssZ(gz[1]);
  {const a=role(ganWx(gz[0])),b=role(zhiWx(gz[1]));const sum=a==='喜'&&b==='喜'?'干支皆為喜用，整體助力較多，宜積極把握。':a==='忌'&&b==='忌'?'干支皆為忌神，宜守成、多做準備，凡事留餘地。':a==='喜'||b==='喜'?'喜忌參半，'+(a==='喜'?(isY?'上半年':'前五年')+'較順，'+(isY?'下半年':'後五年')+'宜保守。':(isY?'上半年':'前五年')+'宜保守，'+(isY?'下半年':'後五年')+'漸入佳境。'):'吉凶視與原局的作用而定。';
  N([r_(`天干${gz[0]}為${sg}，地支${gz[1]}為${sz}`),`天干五行${ganWx(gz[0])}為${a}神，地支五行${zhiWx(gz[1])}為${b}神。${sum}`]);}
  for(const o of luckRels(gz)){const i=o.i;let t=`${GONG[i].name}代表${GONG[i].kin}。${REL_TXT[o.r]||''}`;
   if(i===2&&o.k==='g'&&o.r==='合')t+=male&&GROUP_OF[sg]===2||!male&&GROUP_OF[sg]===3?'日干合配偶星，感情、婚姻有進展。':'日干被合，心有所繫，多有新的目標。';
   if(i===2&&o.k==='z'&&['沖','穿','刑'].includes(o.r))t+='日支（自己與配偶）被引動，宜注意身體、居所與夫妻關係的變化。';
   N([r_(relLine(o,lbl)),t]);}
  const yong=mp.N.filter(n=>n.zhu&&n.ty==='體');const tg=[gz[0],gz[1]].map(ch=>({ch,ss:G.includes(ch)?ssG(ch):ssZ(ch),wx:elOf(ch)}));
  for(const x of tg){if(['正財','偏財','正官','七殺'].includes(x.ss)){const ctr=yong.find(n=>ctl(n.wx,x.wx)||(n.k==='z'&&!G.includes(x.ch)&&(liuhe(n.ch)===x.ch||isBanhe(n.ch,x.ch))));
   if(ctr)N([r_(`${lbl}帶來${x.ss}（${x.ch}），主位${ctr.name}可取之`),'用神到位而主位有能力取得，為「得用」之象，主有實際收穫。']);}}
  const kongHit=[gz[1]].filter(z=>kong.includes(z));if(kongHit.length)N([r_(`${lbl}地支${gz[1]}落空亡`),'逢空亡，好壞皆減半，計畫宜保守，不宜孤注一擲。']);
  if(gz===P[2].gan+P[2].zhi)N([r_(`${lbl}與日柱伏吟`),'伏吟主反覆、悶滯，舊事重提，宜沉著。']);
  if(isChong(gz[1],P[2].zhi)&&ctl(ganWx(gz[0]),dWx))N([r_(`${lbl}與日柱天剋地沖`),'變動最大的時段，健康、居所、婚姻宜特別留意。']);
  N([r_(`${sg}：`),LUCK_SS[sg]]);if(sz!==sg)N([r_(`${sz}：`),LUCK_SS[sz]]);};
 const c0=Math.max(0,ci-1);dys.slice(c0,c0+3).forEach((d,k)=>{Sx(`第${c0+k+1}大運　${d.gz}　${d.from}～${d.to}歲（西元${by+d.from-1}～${by+d.to-1}年）`);luckBlock(d.gz,'大運');});
 H('八字斷流年(看流年發生的事)');Sx(yl);luckBlock(yGz,'流年',true);
 {const curDy=dyOf(yAge);if(curDy&&curDy.gz===yGz)N([r_('歲運並臨'),'流年與大運干支相同，力量加倍，吉凶皆顯，宜謹慎行事。']);
  const s=sui12(P[0].zhi,yGz[1]);N([r_(`生肖歲神：${s}`),SUI_TXT[s][0]]);}
 H('八字斷流月(看流月發生的事)');
 {const ygi=G.indexOf(yGz[0]);for(let i=0;i<12;i++){const gz=G[((ygi%5)*2+2+i)%10]+Z[(2+i)%12];const k=(21+2*i)%24;const yy=i===11?YR+1:YR;
   const j=JIE.find(t=>t.k===k&&new Date(t.ms).getUTCFullYear()===yy);const ds=j?(()=>{const d=new Date(j.ms);return `${d.getUTCFullYear()}年${d.getUTCMonth()+1}月${d.getUTCDate()}日${j.name}起`;})():'';
   Sx(`${minguo(YR)}${yGz}年　${gz}月（西元${ds}）`);resetN();const sg=ssG(gz[0]),sz=ssZ(gz[1]);
   N([`天干${sg}（${role(ganWx(gz[0]))}）、地支${sz}（${role(zhiWx(gz[1]))}）。${LUCK_SS[sz].replace('行','本月行')}`]);
   const rr=zhiRels(gz[1],P[2].zhi);if(rr.length)N([`月支${gz[1]}與日支${P[2].zhi}${rr.map(rv).join('、')}：${REL_TXT[rr[0]]}本月宜留意自身與家庭事務。`]);
   if(kong.includes(gz[1]))N(['本月地支逢空亡，計畫易有延誤，重要事項宜預留時間。']);}}
 // ═════ 開運制煞篇

 // ═════ 盲派結構論斷（本站增補章節：範本未設此章，依盲派理法自行設計）
 T('盲派結構論斷（本站增補）');
 Pp('【說明】範本命書沒有「賓主、體用、做功、象法、應期」等盲派專章；本章為本站依盲派理法自行設計的增補內容，論斷文字為本站白話原創，理法出處列於每節末與附錄，請以老師審訂為準。');
 H('一、賓主與體用一覽（本站增補）');
 Pp('盲派先分賓主：年、月兩柱為「賓」（外界、別人的），日、時兩柱為「主」（自己、自家的）。再分體用：日主、比劫、祿、印、食神屬「體」（我能運用的本錢）；財、官殺、傷官屬「用」（我要追求的目標）。');
 {const fu=new Set(mp.gong.flatMap(g=>[g.t.name,g.u.name]));
  B.push({t:'GRID',cap:'八字之賓主、體用、功廢',head:['位置','字','十神','五行','賓／主','體／用','功神／廢神'],w:[2,1,1.4,1,1.2,1.2,1.6],
   rows:mp.N.map(n=>[PIL[n.i]+(n.k==='g'?'干':'支'),n.ch,n.ss,n.wx,n.zhu?'主':'賓',n.ty+(n.lu?'（祿）':''),n.ss==='日主'?'—':fu.has(n.name)?'功神':'廢神'])});}
 Pp(`（體用、賓主之分，摘要自${SRC.duan}；本表為規則推算。）`);
 H('二、做功結構總評（本站增補）');resetN();
 {const pos=mp.gong.filter(g=>['制用','合用','墓用','化用','生用'].includes(g.type));const neg=mp.gong.filter(g=>!pos.includes(g));
  const ty=[...new Set(pos.map(g=>g.type))];
  N([r_('主要做功方式'),ty.length?`${ty.join('、')}。${ty.map(t=>GONG_TYPE[t]).join('')}`:'命局沒有明顯的做功結構，屬平穩型。']);
  const dirs={正向:0,反向:0,同位:0};pos.forEach(g=>dirs[g.dir]++);
  N([r_('做功方向'),`正向 ${dirs.正向} 處、反向 ${dirs.反向} 處、同位 ${dirs.同位} 處。`+(dirs.正向>=dirs.反向?'以主動向外取得為主，成果較能落在自己手上。':'外在力量進入自家的作用較多，成敗較受環境牽動，宜慎選合作對象。')]);
  if(neg.length)N([r_('受牽制之處'),neg.map(g=>`${g.t.name}（${g.t.ss}）${g.type==='體入墓'?'入'+g.u.name+'之墓':'被'+g.u.name+'（'+g.u.ss+'）'+g.how}`).join('；')+'。這些位置代表付出多、受牽制的人事，行運引動時要特別留意。']);
  N([r_('勢'),`五行以${mp.topWx}最多（${mp.cnt[mp.topWx]} 字），體方 ${mp.campCnt.體} 字、用方 ${mp.campCnt.用} 字。${mp.shiOK?'已成勢，做功有黨群支持。':'未明顯成勢，做功力量要靠行運補足。'}`]);
  N([r_('層次'),['平穩型：重在穩定累積。','一般層次：有一處做功，能靠專長立足。','中上層次：做功兩處以上或有勢，有機會在專業上出頭。','較高層次：做功多且有勢，有機會在組織中領導或自行創業。'][mp.lvl]]);}
 Pp(`（做功、勢、層次之理法摘要自${SRC.duan}、${SRC.zongshu}；本節判斷為規則推算，僅供參考。）`);
 H('三、虛實與墓庫（本站增補）');resetN();
 {let any=0;for(const n of mp.xu){any=1;N([r_(`虛透：${n.name}（${n.ss}）`),XU_TXT[n.ss]||'天干無根，主虛名、想法多於實際。']);}
  for(const k of mp.ku){any=1;N([r_(`墓庫：${k.n.name}`),`${k.n.ch}為${k.el}之庫（${k.ss}）。${k.open?'命局已有沖刑開庫，庫中之物可取用。':'庫未被沖開，所藏之物要等行運沖刑打開時才較能取用。'}`]);}
  if(!any)N(['命局沒有明顯的虛透或墓庫結構。']);}
 Pp(`（虛實、墓庫之用法摘要自${SRC.zongshu}、${SRC.peiweng}。）`);
 H('四、象法提要（本站增補）');resetN();
 for(const i of [0,1,2,3]){const g=P[i];N([r_(`${PIL[i]}柱${g.gan}${g.zhi}：${GONG[i].kin}`),`宮位象：${GONG[i].space}；身體象：${BODY[PIL[i]]}。天干${ssG(g.gan)==='日元'||i===2?'日主':ssG(g.gan)}主「${i===2?'自己':SS_CORE[ssG(g.gan)].p}」，地支${ssZ(g.zhi)}主「${SS_CORE[ssZ(g.zhi)].p}」。`]);}
 Pp(`（宮位、身體之象為象法常見對應，摘要自${SRC.hanshou}。）`);
 H('五、應期提要：未來十年哪些年份會引動命局（本站增補）');resetN();
 Pp('盲派看應期，常取「功神、廢神被流年沖合引動」「墓庫被沖開」「空亡被填實」之年。以下依規則列出未來十年值得留意的年份：');
 {const zs=mp.N.filter(n=>n.k==='z');const gongZ=new Set(mp.gong.flatMap(g=>[g.t,g.u]).filter(n=>n.k==='z').map(n=>n.name));let c=0;
  for(let y=YR;y<YR+10;y++){const gz=gzOf(y),lz=gz[1];const ev=[];
   for(const n of zs){if(isChong(lz,n.ch))ev.push(`沖${n.name}${gongZ.has(n.name)?'（功神）':''}`);else if(liuhe(lz)===n.ch)ev.push(`合${n.name}${gongZ.has(n.name)?'（功神）':''}`);}
   for(const k of mp.ku)if(isChong(lz,k.n.ch))ev.push(`沖開${k.el}庫`);
   if(kong.includes(lz))ev.push('填實空亡');
   if(ev.length){c++;N([r_(`西元${y}年（${gz}，${age(y)}歲）`),`流年${lz}${[...new Set(ev)].join('、')}。${ev.some(e=>e.includes('功神'))?'做功結構被引動，是事情發生、成果或變動顯現的年份。':'命局相關宮位被引動，宜留意該宮位所代表的人事。'}`]);}}
  if(!c)N(['未來十年沒有明顯的引動年份，整體較平穩。']);}
 Pp(`（應期取法摘要自${SRC.hanshou}；為規則推算，實際應驗請以老師論斷為準。）`);
 T('開運制煞篇');
 H('運用先天八字欠缺或過多的補運法則');Ps(ST.BUYUN);resetN();
 {const ctrlEl=s=>{const k=GROUP_OF[s];return [relEl(dw,(k+1)%5),relEl(dw,(k+3)%5)];};
  for(let k=0;k<5;k++){const c=cntG(k);const s0=SS10.filter(s=>GROUP_OF[s]===k);
   if(c>=3){const top=s0.slice().sort((a,b)=>m.cnt[b]-m.cnt[a])[0];const [xie,zhi]=ctrlEl(top);
    N([r_(`八字中${top}偏多（${GROUP_LONG[k]}共 ${c} 個）`),`長處：${SS_CORE[top].good}。`,`過多時：${SS_CORE[top].bad}。影響所及的人際對象為${SS_CORE[top].people}。`,(()=>{const pick=[xie,zhi].find(e=>role(e)!=='忌');return `調和方法：以${xie}（洩其氣）或${zhi}（制其勢）來平衡。`+(pick?`其中${pick}對您不屬忌神，生活上可多運用${pick}的顏色（${ELEM[pick].color}）與方位（${ELEM[pick].dir}）。`:`兩者在您命局中皆屬忌神，宜以修養心性代替外在調整，凡事量力而為。`);})()]);}
   if(c===0){const s=s0.find(x=>x.startsWith('正'))||s0[0];const w=relEl(dw,k);
    N([r_(`八字先天缺少${GROUP_LONG[k]}（以${s}為代表）`),`不容易自然展現的長處：${SS_CORE[s].good}。`,`補足方法：在${w}五行的年運多把握機會；平時刻意培養「${SS_CORE[s].p}」方面的能力，例如找相關的學習或團體。`]);}}}
 H('由命盤看本命空亡');Ps(ST.KONG);resetN();
 {const kp=P.map((p,i)=>kong.includes(p.zhi)&&i!==2?i:-1).filter(i=>i>=0);
  if(!kp.length)N(['命局四柱未落日空，空亡影響較小。']);
  for(const i of kp)N([r_(`${PIL[i]}柱（${P[i].zhi}）空亡`),`${GONG[i].name}主${GONG[i].kin}。${role(zhiWx(P[i].zhi))==='喜'?'空亡之字為喜用，逢'+liuhe(P[i].zhi)+'（六合）或'+Z[(Z.indexOf(P[i].zhi)+6)%12]+'（沖）之年月，空亡被填實，是把握機會之時。':'空亡之字非喜用，落空反減其害，不必刻意填實。'}`]);}
 H('從命盤看先天桃花');Ps(ST.TAOHUA_INTRO);resetN();
 {const ths=zs.map((z,i)=>(taohuaOf(P[0].zhi)===z||taohuaOf(P[2].zhi)===z)?i:-1).filter(i=>i>=0);const zw=zs.filter(z=>'子午卯酉'.includes(z));
  N([r_(`桃花位：${ths.length?ths.map(i=>PIL[i]+'支'+zs[i]).join('、'):'無'}　四正之支：${zw.join('、')||'無'}`),ths.length>=2||zw.length>=3?'桃花偏多，人緣魅力佳，感情選擇也多，宜專一以免糾葛。':ths.length?'桃花適中，人緣不錯。':'桃花不顯，感情較被動，可多參與社交活動。']);}
 H('如何才能催旺桃花、姻緣，讓感情順利');Ps(ST.YINYUAN);resetN();
 {const dz=P[2].zhi;const yrs=[];for(let y=YR;y<=YR+11;y++){const z=gzOf(y)[1];const why=[];if(liuhe(z)===dz)why.push('六合夫妻宮');if(HONGLUAN_T[P[0].zhi]===z)why.push('紅鸞');if(TIANXI_T[P[0].zhi]===z)why.push('天喜');if(taohuaOf(P[0].zhi)===z||taohuaOf(dz)===z)why.push('桃花');if(why.length)yrs.push(`西元${y}年（${gzOf(y)}）：${why.join('、')}`);}
  N([r_('未來十二年較有利感情的年份'),...(yrs.length?yrs:['近年較少感情星到位，宜靠自己擴大生活圈。'])]);}
 H('如何才能制化、年月日時之空亡現象');Ps(ST.KONG_FIX);resetN();
 {const ygz=gzOf(YR);if(kong.includes(ygz[1]))N([`西元${YR}年地支${ygz[1]}逢空亡：此年計畫宜保守，民俗上可留意與${liuhe(ygz[1])}相合之物以為提醒。`]);
  const ygi=G.indexOf(ygz[0]);for(let i=0;i<12;i++){const z=Z[(2+i)%12];if(kong.includes(z))N([`西元${YR}年${G[((ygi%5)*2+2+i)%10]}${z}月逢空亡：本月好事減半、壓力較重，宜放慢腳步。`]);}
  if(!num)N(['今年流年與流月未逢空亡。']);}
 H('流年十二神煞分析及解法');Ps(ST.SUISHA);Sx(`西元：${YR}年　農曆：${minguo(YR)}年（${yGz}）${yAge}歲`);
 {const s1=sui12(P[0].zhi,yGz[1]),s2=sui12(m.mg[1],yGz[1]);R(`本命生肖（${ANIMAL[P[0].zhi]}）值「${s1}」`);Pp(SUI_TXT[s1][0]);Pp('【建議】'+SUI_TXT[s1][1]);
  R(`本命命宮（${m.mg}）值「${s2}」`);Pp(SUI_TXT[s2][0]);Pp('【建議】'+SUI_TXT[s2][1]);}
 H('出生後上大運該做什麼');Pp(`由您的命盤推算，${m.chusheng.replace('出生後','您出生後')}。`);Ps(ST.DAYUN);Pp('以下是每五年（天干、地支交替）的交運日期：');resetN();
 m.jiaoyun.forEach(j=>N([`西元：${j.s[0]}年${j.s[1]}月${j.s[2]}日　農曆：${minguo(j.l[0])}年${j.l[1]}月${j.l[2]}日`]));
 H('善用五行開運方法');Ps(ST.WUXING);
 for(const w of xi){R(`您的喜用神為「${w}」`);const e=ELEM[w];Pp(`顏色：${e.color}。方位：${e.dir}。數字：${e.num}。`);Pp(`飲食：${e.food}。相關臟腑：${e.organ}，平時宜多保養。`);Pp(`有利時段：${e.time}，適合做重要決定或運動散步。`);Pp(`適合行業：${e.job}。`);}
 for(const w of ji){R(`忌神「${w}」宜少用`);Pp(`${ELEM[w].color}等顏色不宜大面積使用；${ELEM[w].dir}不宜作為長期發展的主要方位。`);}
 H('人生最重要的轉折時間點');
 Sx('用八字找出較有利的好運點');Ps(ST.GOOD_POINT);resetN();
 {const out=[];for(let y=YR;y<=YR+11&&out.length<6;y++){const g=gzOf(y);if(role(ganWx(g[0]))==='喜'&&role(zhiWx(g[1]))!=='忌'&&!zhiRels(g[1],P[2].zhi).some(r=>['沖','穿'].includes(r)))out.push(`西元${y}年（${g}，${age(y)}歲）：天干${ganWx(g[0])}為喜用，宜積極規劃。`);}
  N(out.length?out:['未來十二年中，流年干支同時為喜用的年份較少，宜以大運為主要參考。']);}
 Sx('用八字找出需謹慎的時段');Ps(ST.BAD_POINT);resetN();
 {const out=[];for(let y=YR;y<=YR+11;y++){const g=gzOf(y);const why=[];const dy=dyOf(age(y));
   if(isChong(g[1],P[2].zhi)&&(ctl(ganWx(g[0]),dWx)||ctl(dWx,ganWx(g[0]))))why.push('天剋地沖日柱');else if(isChong(g[1],P[2].zhi))why.push('沖日支');
   if(isChuan(g[1],P[2].zhi))why.push('穿日支');if(dy&&dy.gz===g)why.push('歲運並臨');if(why.length)out.push(`西元${y}年（${g}，${age(y)}歲）：${why.join('、')}。`);}
  N(out.length?out:['未來十二年未見特別需要警惕的年份。']);}
 H('用八字找出男女命有無犯破月');Ps(ST.POYUE);
 H('用流年斷永世空亡');Ps(ST.YONGSHI);
 H('用出生年生肖斷過逝時辰');Ps(ST.GUOSHI);
 H('去除久病的小秘方');Ps(ST.JIUBING);
 H('升官進爵與金榜提名小秘方');Ps(ST.GUANYUN);
 H('求助事業的小偏方');Ps(ST.SHIYE);
 H('增加桃花的小偏方');Ps(ST.TAOHUA_FANG);
 H('其他特殊開運的小秘方');ST.TESHU.forEach(([a,b])=>{Sx(a);Pp(b);});
 H('如果能這樣做幫助最大');ST.HUANJING.forEach(([a,b])=>{Sx(a);Pp(b);});
 H('轉變生命之妙法');ST.ZHUANBIAN.forEach(([a,q,b])=>{Sx(a);if(q)Q(q.q,q.s);Pp(b);});
 H('觀音祈福開運祈禱文');Ps(ST.GUANYIN);
 H('環香、臥香：煙供諸佛菩薩法');Ps(ST.HUANXIANG);
 H('如何朝拜地基主，灶神君及各神尊');ST.BAIBAI.forEach(([a,b])=>{Sx(a);Pp(b);});
 H('地藏王菩薩求願法');Ps(ST.DIZANG);
 H('過香爐');Ps(ST.GUOXIANGLU);
 H('香腳這樣用可過運');Ps(ST.XIANGJIAO);Pp(ST.NOTE);
 // ═════ 星座特質分析
 T('星座特質分析');const xz=m.xz,X=XZ[xz];
 H('十二星座特質個性另類解說');R(`【${xz}座】`);Pp(X.alt);
 H('十二星座與生命靈數');{const ds=String(birth.y)+p2(birth.m)+p2(birth.d);let n=[...ds].reduce((a,c)=>a+ +c,0);while(n>9)n=[...String(n)].reduce((a,c)=>a+ +c,0);
  R(`${xz}座（${XZ_EN[xz]}）　生命靈數：${n}`);Pp(`把出生年月日（${ds}）的數字逐位相加，直到剩一位數，得到生命靈數 ${n}。`);Pp(LIFE_NUM[n]);}
 H('十二星座如何開好運');R(`${xz}座`);Pp(X.luck);
 H('十二星座行為第一名');R(`${xz}座：${X.first}`);
 H('十二星座職場工作傾向分析');R(`${xz}座職場 EQ：`);Pp(X.eq);R(`${xz}座員工特性：`);Pp(X.staff);R(`${xz}座最適合的工作：`);Pp(X.fit);R(`${xz}座不適合的工作：`);Pp(X.unfit);R(`${xz}座老闆作風：`);Pp(X.boss);
 H('十二星座如何有效捉住男人的心');R(`和${xz}座男人在一起一定要做的事：`);Pp(X.mDo);R(`和${xz}座男人在一起絕不能做的事：`);Pp(X.mDont);
 H('十二星座如何有效捉住女人的心');R(`和${xz}座女人在一起一定要做的事：`);Pp(X.wDo);R(`和${xz}座女人在一起絕不能做的事：`);Pp(X.wDont);
 H('十二星座結婚概念排行榜');Pp(`想早點安定下來的排名：${RANK_MARRY.map((s,i)=>`${i+1}.${s}`).join('　')}`);R(`${xz}座排第 ${RANK_MARRY.indexOf(xz)+1} 名`);
 H('十二星座對愛情最笨的地方');R(`${xz}座`);Pp(X.dumb);
 H('十二星座伴侶的禁忌');R(`${xz}座`);Pp(X.taboo);
 H('十二星座戀愛最瞎的地方');R(`${xz}座`);Pp(X.blind);
 H('十二星座雙方到底配不配');{const el=XZ_EL[xz];const pair={火:'風',風:'火',土:'水',水:'土'}[el];const same=XZ_ORDER.filter(s=>XZ_EL[s]===el&&s!==xz),comp=XZ_ORDER.filter(s=>XZ_EL[s]===pair);
  Pp(`${xz}座屬${el}象星座。同屬${el}象的${same.join('、')}座步調相近，容易聊得來；${pair}象的${comp.join('、')}座與您互補，能互相激勵。`);}
 H('十二星座中最佳配對組合');{const el=XZ_EL[xz];const pair={火:'風',風:'火',土:'水',水:'土'}[el];const i=XZ_ORDER.indexOf(xz);const best=XZ_ORDER[(i+6)%12];
  R(`${xz}座 ✕ ${best}座`);Pp(`對宮星座個性一陰一陽，彼此身上有對方欠缺的特質，磨合後最能長久（屬趣味參考）。`);}
 H('十二星座好壞老公、老婆排行榜');R(`好老公第 ${RANK_HUSBAND.indexOf(xz)+1} 名：${xz}座`);R(`好老婆第 ${RANK_WIFE.indexOf(xz)+1} 名：${xz}座`);Pp('排行為本站整理的趣味觀點，每段婚姻都需要雙方共同經營。');
 H('十二星座醋罈子排行榜');Pp(RANK_JEALOUS.map((s,i)=>`${i+1}.${s}`).join('　'));R(`${xz}座排第 ${RANK_JEALOUS.indexOf(xz)+1} 名`);
 H('十二星座死不認錯篇');R(`${xz}座`);Pp(X.stubborn);Pp('（星座篇屬坊間趣談，僅供娛樂參考。）');
 // 附錄
 H('附錄：本命書之依據與參考資料');resetN();
 N(['曆法：年柱、月柱依 JPL DE421 星曆計算之節氣交接時刻；日柱、時柱依出生地真太陽時；出生地在東經 70 度以西者，依王中和老師「干支換日線」日序加一日。']);
 N(['盲派理法（賓主、體用、做功、功神廢神）：'+SRC.duan+'，本書僅摘要其架構並以白話重寫。']);
 N(['穿、破、墓庫、虛實：'+SRC.zongshu+'；'+SRC.peiweng+'。']);N(['象法（宮位、虛透之象）：'+SRC.xiangfa+'；'+SRC.hanshou+'。']);
 N(['古籍引文：'+SRC.dts+'；'+SRC.smth+'；'+SRC.hongfan+'。']);
 N(['完整網址與說明見網站「參考資料」頁。本命書由規則自動推算，非個別人工論斷，內容僅供參考，不構成醫療、法律、投資建議。']);
 return {m,blocks:B};}
function elOf(ch){return G.includes(ch)?ganWx(ch):zhiWx(ch);}
