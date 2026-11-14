// 瀏覽器端（延遲載入）：產生命書、顯示、下載 PDF／Word
import {build} from './build.js';
import {mingshuHtml,mingshuPdf,mingshuDocxBlob} from './render.js';
const url=p=>new URL(p,document.baseURI).href;
const get=p=>fetch(url(p)).then(r=>{if(!r.ok)throw new Error('檔案載入失敗：'+p);return r.arrayBuffer();});
const io={font:p=>get('fonts/'+p),manifest:()=>fetch(url('fonts/sheet/name/manifest.json')).then(r=>r.json()),image:k=>get('img/'+k+'.png').then(b=>new Uint8Array(b))};
let kaiP=null;
export function loadKai(){if(kaiP||typeof FontFace==='undefined')return kaiP;const ff=new FontFace('MingshuKai',`url(${url('fonts/mangpai/MangpaiKai.ttf')})`);document.fonts.add(ff);return kaiP=ff.load().catch(()=>{});}
export function makeBook(form,opt){return build(form,opt);}
export function showBlocks(el,blocks){el.innerHTML=mingshuHtml(blocks,k=>url('img/'+k+'.png'));loadKai();}
export async function pdfBlob(r,title){const x=await mingshuPdf(r.blocks,io,title);return {blob:new Blob([x.bytes],{type:'application/pdf'}),pages:x.pages};}
export async function wordBlob(r,title){return mingshuDocxBlob(r.blocks,io,title);}
