import {REFS} from './mp/refs.js';
import {loadTimeMode,saveTimeMode,timeModeLabel} from './timeMode.js';
const $=s=>document.querySelector(s);
const CITIES=[['— 自訂 —'],['台北',121.56,25.03,8,'Asia/Taipei'],['新北',121.46,25.01,8,'Asia/Taipei'],['桃園',121.30,24.99,8,'Asia/Taipei'],['新竹',120.97,24.80,8,'Asia/Taipei'],['台中',120.68,24.14,8,'Asia/Taipei'],['台南',120.21,22.99,8,'Asia/Taipei'],['高雄',120.31,22.63,8,'Asia/Taipei'],['花蓮',121.60,23.99,8,'Asia/Taipei'],['台東',121.15,22.76,8,'Asia/Taipei'],['宜蘭',121.75,24.76,8,'Asia/Taipei'],
 ['香港',114.17,22.32,8,'Asia/Hong_Kong'],['澳門',113.54,22.20,8,'Asia/Macau'],['北京',116.40,39.90,8,'Asia/Shanghai'],['上海',121.47,31.23,8,'Asia/Shanghai'],['廣州',113.26,23.13,8,'Asia/Shanghai'],['成都',104.07,30.67,8,'Asia/Shanghai'],['新加坡',103.82,1.35,8,'Asia/Singapore'],['吉隆坡',101.69,3.14,8,'Asia/Kuala_Lumpur'],['東京',139.69,35.68,9,'Asia/Tokyo'],
 ['新德里',77.21,28.61,5.5,'Asia/Kolkata'],['倫敦',-0.13,51.51,0,'Europe/London'],['巴黎',2.35,48.86,1,'Europe/Paris'],['紐約',-74.01,40.71,-5,'America/New_York'],['洛杉磯',-118.24,34.05,-8,'America/Los_Angeles'],['溫哥華',-123.12,49.28,-8,'America/Vancouver'],['雪梨',151.21,-33.87,10,'Australia/Sydney']];
$('#city').innerHTML=CITIES.map((c,i)=>`<option value="${i}"${c[0]==='台北'?' selected':''}>${c[0]}</option>`).join('');
$('#city').onchange=e=>{const c=CITIES[e.target.value];if(c.length>1){$('#lon').value=c[1];$('#lat').value=c[2];$('#tz').value=c[3];}};
$('#year').value=new Date().getFullYear();
const p2=n=>String(n).padStart(2,'0');
// 鐘錶模式：日、時柱用當地時鐘所示；真太陽時模式：先換成台北牆鐘再依經度加均時差。
function readForm(){const mode=($('#timeMode')&&$('#timeMode').value)||'clock';
 const [Y,M,D]=$('#date').value.split('-').map(Number),[h,mi]=($('#time').value||'12:00').split(':').map(Number);const tz=Number($('#tz').value||8);
 const lonS=$('#lon').value;const ci=CITIES[$('#city').value];const zone=(ci&&ci[4])||'Asia/Taipei';
 const local={date:$('#date').value,time:$('#time').value||'12:00',tz,zone};
 const base={name:$('#name').value.trim()||'命主',gender:$('#gender').value,lon:lonS===''?null:Number(lonS),dst:$('#dst').checked,timeMode:mode,zone,placeName:ci&&ci.length>1?ci[0]:(lonS?`經度${lonS}`:''),local};
 if(mode==='clock')return {...base,date:local.date,time:local.time};
 const t=new Date(Date.UTC(Y,M-1,D,h,mi)+(8-tz)*36e5);
 return {...base,date:`${t.getUTCFullYear()}-${p2(t.getUTCMonth()+1)}-${p2(t.getUTCDate())}`,time:`${p2(t.getUTCHours())}:${p2(t.getUTCMinutes())}`};}
let W=null;const web=()=>W||(W=import('./mp/web.js'));
let book=null;const today=()=>{const d=new Date();return `${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;};
function tab(t){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id===t));}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.t));
function check(f){if(!/^\d{4}-\d\d-\d\d$/.test(f.date))return '請輸入出生日期';const y=+f.date.slice(0,4);if(y<1900||y>2100)return '出生年份請在 1900～2100 之間';const yr=+$('#year').value;if(!(yr>=1900&&yr<=2100))return '流年請在 1900～2100 之間';return '';}
async function calc(){const f=readForm();const e=check(f);if(e){$('#note').textContent=e;return null;}const w=await web();
 const r=w.makeBook(f,{year:+$('#year').value,made:today()});book=r;const m=r.m;
 w.showBlocks($('#p1'),r.blocks.slice(0,1));
 const g=m.mp.gong.filter(x=>['制用','合用','墓用','化用','生用'].includes(x.type));
 $('#brief').innerHTML=`<h2>盲派結構速覽</h2><p>四柱：<b>${m.P.map(p=>p.gan+p.zhi).join('　')}</b>（${m.male?'乾造':'坤造'}）　日主：${m.dm}　${m.strong?'身強':'身弱'}　喜用：${m.xi.join('')}　忌：${m.ji.join('')}</p>
  <p>做功：${g.length?g.map(x=>`${x.type}（${x.t.name}→${x.u.name}，${x.dir}）`).join('；'):'無明顯做功（平穩型）'}</p><p>層次：${['平穩型','一般','中上','較高'][m.mp.lvl]}　${m.chusheng||''}</p>
  <p class="muted">排盤口徑：${timeModeLabel(f.timeMode)}。${f.timeMode==='solar'&&f.local.tz!==8?`已將當地時間 ${f.local.date} ${f.local.time}（UTC${f.local.tz>=0?'+':''}${f.local.tz}）換算為台北時間 ${f.date} ${f.time} 再以經度校正真太陽時。`:''}${f.lon!=null&&f.lon<70?'出生地在東經 70° 以西，依干支換日線日柱干支進一位（日期不動）。':''}</p>`;
 $('#note').textContent='';$('#bookMsg').textContent='請按「產生命書」。';$('#bookBody').innerHTML='';['#dlPdf','#dlDoc','#prt'].forEach(s=>$(s).disabled=true);return r;}
$('#calc').onclick=async()=>{if(await calc())tab('chart');};
$('#gen').onclick=async()=>{const r=await calc();if(!r)return;const w=await web();w.showBlocks($('#bookBody'),r.blocks);['#dlPdf','#dlDoc','#prt'].forEach(s=>$(s).disabled=false);$('#bookMsg').textContent='命書已產生，可下載 PDF 或 Word。';tab('book');window.scrollTo(0,$('#tabs').offsetTop-50);};
const title=()=>`${book.m.name||'命主'} 盲派八字命書`;
const save=(blob,fn)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},4000);};
$('#dlPdf').onclick=async()=>{const b=$('#dlPdf');b.disabled=true;$('#bookMsg').textContent='PDF 產生中…';try{const w=await web();const x=await w.pdfBlob(book,title());save(x.blob,title()+'.pdf');$('#bookMsg').textContent=`PDF 已產生（${x.pages} 頁）。`;}catch(e){$('#bookMsg').textContent='PDF 產生失敗：'+e.message;}b.disabled=false;};
$('#dlDoc').onclick=async()=>{const b=$('#dlDoc');b.disabled=true;$('#bookMsg').textContent='Word 產生中…';try{const w=await web();save(await w.wordBlob(book,title()),title()+'.docx');$('#bookMsg').textContent='Word 已產生。';}catch(e){$('#bookMsg').textContent='Word 產生失敗：'+e.message;}b.disabled=false;};
$('#prt').onclick=()=>window.print();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#refs').innerHTML=`<div class="card"><h2>參考資料與依據</h2><p>本站盲派論斷以下列資料的理法為架構，論斷文字為本站白話原創。古籍為公有領域，引文均註明書名篇章；現代著作只摘要架構、不引原文；無法查證者標「來源待核」。</p>${REFS.map(g=>`<h3>${esc(g.g)}</h3><ul>${g.items.map(i=>`<li><b>${esc(i.t)}</b>${i.u?`　<a href="${esc(i.u)}" target="_blank" rel="noopener">${esc(decodeURI(i.u))}</a>`:''}<br><span class="muted">${esc(i.n)}</span></li>`).join('')}</ul>`).join('')}</div>`;
{const q=new URLSearchParams(location.search);
 if(q.get('d'))$('#date').value=q.get('d');if(q.get('t'))$('#time').value=q.get('t');if(q.get('g'))$('#gender').value=q.get('g');if(q.get('n'))$('#name').value=q.get('n');if(q.get('lon'))$('#lon').value=q.get('lon');if(q.get('dst'))$('#dst').checked=true;
 if($('#timeMode')){$('#timeMode').value=loadTimeMode();$('#timeMode').onchange=()=>{saveTimeMode($('#timeMode').value);calc();};}}
calc();
