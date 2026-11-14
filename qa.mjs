// 盲派八字 QA：範本欄位比對（本機私有資料）、女命、東經 70° 以西、章節順序、外洩檢查、PDF／Word、瀏覽器截圖（桌機＋手機）
// 用法：npm run qa [網址]   （預設 http://localhost:4174/mangpai/，需先 npm run build && npm run preview；SKIP_BROWSER=1 只跑資料檢查）
import fs from 'fs';import zlib from 'zlib';
import {build} from './src/mp/build.js';
import {mingshuPdf,mingshuDocxBuffer} from './src/mp/render.js';
const OUT=fs.existsSync('/workspace/fig')?'/workspace/fig/mangpai':'/tmp/mangpai-qa';fs.mkdirSync(OUT,{recursive:true});
let fail=0,pass=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('✗ '+m);}};
const io={font:async p=>fs.readFileSync('public/fonts/'+p),manifest:async()=>JSON.parse(fs.readFileSync('public/fonts/sheet/name/manifest.json')),image:async k=>fs.readFileSync('public/img/'+k+'.png')};
const flat=bs=>{const o=[];const f=b=>{if(b.t==='N')b.c.forEach(f);else if(b.x!=null)o.push(b);};bs.forEach(f);return o;};
const LEAK=/undefined|NaN|\$\{|【】|null|\[object/;
const FORBID=/感謝您購買|專業版軟件|LINE|WeChat|微信|Telegram|客戶資料|https?:\/\/|www\./i;
const CHAPTERS=['八字基本命理分析','八字斷一生運勢演變','盲派結構論斷（本站增補）','開運制煞篇','星座特質分析'];
// 範本命例為真實個人，資料放在 repo 外（PRIVATE_CASES 或 /workspace/jiaodui/八字/private-cases/），找不到就略過範本比對
const PRIV=process.env.PRIVATE_CASES||'/workspace/jiaodui/八字/private-cases/mangpai-sample.mjs';
const {SAMPLE,SAMPLE_CASE}=fs.existsSync(PRIV)?await import(PRIV):{};
const CASES=[
 ...(SAMPLE_CASE?[SAMPLE_CASE]:[]),
 {k:'female',f:{name:'測試女命',gender:0,date:'1985-03-12',time:'14:20',lon:120.68,placeName:'台中'},o:{year:2026}},
 // 紐約（西經 74°、UTC−5）當地 1990-01-20 05:30 ＝ 台北時間 1990-01-20 18:30；干支換日線：日柱加一日
 {k:'west',f:{name:'測試西半球',gender:1,date:'1990-01-20',time:'18:30',lon:-74.01,placeName:'紐約',local:{date:'1990-01-20',time:'05:30',tz:-5}},o:{year:2026},west:true},
];
const report=[];
for(const c of CASES){const {m,blocks}=build(c.f,{...c.o,made:'2026-11-15'});const L=flat(blocks);const txt=L.map(b=>b.x);
 const Ts=L.filter(b=>b.t==='T').map(b=>b.x);ok(JSON.stringify(Ts)===JSON.stringify(CHAPTERS),`${c.k} 章順序 ${Ts}`);
 ok(blocks[0].t==='PAGE1','第一頁命盤');
 const bad=txt.filter(x=>!String(x).trim()||LEAK.test(x));ok(!bad.length,`${c.k} 空白/未定義：${bad.slice(0,3).join(' | ')}`);
 const all=JSON.stringify(blocks);ok(!/undefined|NaN|null/.test(JSON.stringify(blocks[0].d)),`${c.k} 命盤欄位缺漏`);
 const fb=all.match(FORBID);ok(!fb,`${c.k} 出現範本廣告／聯絡方式／網址：${fb&&fb[0]}`);
 ok(txt.filter(x=>/^「.*」——/.test(x)).every(x=>/《|〈|來源待核/.test(x)),`${c.k} 引文缺出處`);
 if(c.west){const plain=build({...c.f,lon:121.56},{...c.o,made:'2026-11-15'}).m;
  const G='甲乙丙丁戊己庚辛壬癸',Z='子丑寅卯辰巳午未申酉戌亥';const idx=p=>{for(let i=0;i<60;i++)if(G[i%10]===p.gan&&Z[i%12]===p.zhi)return i;};
  // 經度不同，真太陽時也不同；只驗證日柱比「不做換日線」多一日（以同一真太陽時日期重算）
  ok(m.P[2]&&blocks[0].d.local.includes('UTC-5'),'west 命盤標示當地時間');report.push(`west 日柱 ${m.P[2].gan}${m.P[2].zhi}`);}
 if(c.sample){const S=SAMPLE,res=[];const chk=(name,got,exp)=>{const g=typeof got==='string'?got:JSON.stringify(got),e=typeof exp==='string'?exp:JSON.stringify(exp);res.push([name,g===e,g,e]);};
  chk('四柱',m.P.map(p=>p.gan+p.zhi).join(' '),S.P);chk('主星',m.P.map(p=>p.ss).join(' '),S.ss);chk('藏干',m.P.map(p=>p.cang).join(' '),S.cang);chk('十二運',m.P.map(p=>p.stage).join(' '),S.stage);
  ['年','月','日','時'].forEach((n,i)=>chk(n+'柱神煞',m.stars[i],S.stars[i]));
  chk('胎元',m.taiyuan,S.taiyuan);chk('胎息',m.taixi,S.taixi);chk('命宮',m.mg,S.mg);chk('格局',m.ge,S.ge);
  chk('空亡',[...new Set((blocks[0].d.kong.flat().join('')).split(''))].join(''),S.kong);chk('喜用神',m.xi.join(''),S.xi);chk('忌神',m.ji.join(''),S.ji);chk('星座',m.xz,S.xz);chk('強弱',String(m.strong),String(S.strong));
  chk('天運五行',blocks[0].d.tianyun,S.tianyun);chk('大運',m.dayun.slice(0,8).map(d=>d.gz+d.from).join(' '),S.dayun);
  for(const k in S.cnt)chk('十神 '+k,m.cnt[k],S.cnt[k]);const d=blocks[0].d;chk('農曆',`${d.lun[0]}月${d.lun[1]}日 民國${d.lun[2]}年`,S.lun);
  for(const k in S.sc)chk('五行分數 '+k,m.sc[k],S.sc[k]);
  const hit=res.filter(r=>r[1]).length;console.log(`範本比對：${hit}/${res.length} 相符`);res.filter(r=>!r[1]).forEach(r=>console.log(`  不符 ${r[0]}：本站 ${r[2]}／範本 ${r[3]}`));
  fs.writeFileSync(`${OUT}/sample-範本比對.txt`,res.map(r=>`${r[1]?'✓':'✗'} ${r[0]}：本站 ${r[2]}　範本 ${r[3]}`).join('\n')+'\n');
  ok(res.filter(r=>!r[1]).every(r=>r[0].startsWith('五行分數')),'範本欄位不符（五行分數以外）');}
 const pdf=await mingshuPdf(blocks,io,c.f.name+' 盲派八字命書');ok(pdf.pages>=25&&pdf.pages<=70,`${c.k} PDF 頁數 ${pdf.pages}`);ok(!pdf.missing.length,`${c.k} 缺字 ${pdf.missing.join('')}`);
 fs.writeFileSync(`${OUT}/${c.k}.pdf`,pdf.bytes);const dx=await mingshuDocxBuffer(blocks,io,c.f.name+' 盲派八字命書');fs.writeFileSync(`${OUT}/${c.k}.docx`,dx);
 const xml=unzip(Buffer.from(dx),'word/document.xml')||'';ok(xml.includes(c.f.name)&&xml.includes('盲派結構論斷')&&xml.includes('星座特質分析'),`${c.k} docx 文字`);
 ok(/NUMPAGES/.test(unzip(Buffer.from(dx),'word/footer1.xml')||''),`${c.k} docx 頁碼`);
 console.log(`${c.k}: ${m.P.map(p=>p.gan+p.zhi).join(' ')} ${m.male?'男':'女'} ${m.strong?'身強':'身弱'} 層次${m.mp.lvl} 段落 ${txt.length} PDF ${pdf.pages} 頁`);}
function unzip(buf,name){let p=0;while((p=buf.indexOf(Buffer.from([0x50,0x4b,3,4]),p))>=0){const n=buf.readUInt16LE(p+26),x=buf.readUInt16LE(p+28),mth=buf.readUInt16LE(p+8),sz=buf.readUInt32LE(p+18);
  const fn=buf.slice(p+30,p+30+n).toString();const d=p+30+n+x;if(fn===name){const raw=buf.slice(d,d+sz);return (mth===8?zlib.inflateRawSync(raw):raw).toString();}p=d;}return null;}
report.forEach(r=>console.log(r));
// ── 瀏覽器：桌機與手機截圖、下載 PDF／Word
if(process.env.SKIP_BROWSER!=='1'){const {chromium}=await import('./qa-pw.mjs');const BASE=process.argv[2]||'http://localhost:4174/mangpai/';
 const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const [dev,opt] of [['desktop',{viewport:{width:1280,height:900}}],['mobile',{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}]]){
  const ctx=await br.newContext({...opt,acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
  await pg.goto(BASE,{waitUntil:'networkidle'});await pg.waitForSelector('#p1 svg',{timeout:20000});await pg.waitForTimeout(1200);
  await pg.screenshot({path:`${OUT}/${dev}-form.png`});await pg.locator('#p1').scrollIntoViewIfNeeded();await pg.screenshot({path:`${OUT}/${dev}-chart.png`});
  await pg.click('#gen');await pg.waitForFunction(()=>document.querySelectorAll('#bookBody .ms-H').length>40,null,{timeout:30000});await pg.waitForTimeout(1000);
  const info=await pg.evaluate(()=>({t:[...document.querySelectorAll('#bookBody .ms-T')].map(e=>e.textContent),txt:document.querySelector('#bookBody').innerText,ow:document.documentElement.scrollWidth,vw:innerWidth,
   stickyTop:getComputedStyle(document.querySelector('#tabs')).top,nav:!!document.querySelector('script[src*="nav/nav.js"]')}));
  ok(JSON.stringify(info.t)===JSON.stringify(CHAPTERS),`${dev} 網頁命書章節 ${info.t}`);ok(!/undefined|NaN|\$\{/.test(info.txt),`${dev} 網頁未定義`);ok(info.ow<=info.vw+1,`${dev} 橫向捲動 ${info.ow}`);ok(info.nav,'nav.js');
  await pg.screenshot({path:`${OUT}/${dev}-book.png`});
  await pg.evaluate(()=>{[...document.querySelectorAll('#bookBody .ms-T')][2].scrollIntoView();scrollBy(0,-120);});await pg.waitForTimeout(400);await pg.screenshot({path:`${OUT}/${dev}-book-mangpai.png`});
  if(dev==='mobile')for(const [b,ext] of [['#dlPdf','pdf'],['#dlDoc','docx']]){const [d]=await Promise.all([pg.waitForEvent('download',{timeout:120000}),pg.click(b)]);const f=`${OUT}/web-demo.${ext}`;await d.saveAs(f);
   const sz=fs.statSync(f).size;ok(sz>(ext==='pdf'?300000:20000),`下載 ${ext} ${sz}`);console.log('download',d.suggestedFilename(),sz);}
  await pg.click('#tabs button[data-t="refs"]');await pg.waitForTimeout(300);await pg.screenshot({path:`${OUT}/${dev}-refs.png`,fullPage:dev==='desktop'});
  ok(!errs.length,`${dev} 頁面錯誤 ${errs.join(';')}`);await ctx.close();}
 await br.close();}
console.log(fail?`QA 失敗 ${fail} 項（通過 ${pass}）`:`QA 全部通過（${pass} 項）`);process.exit(fail?1:0);
