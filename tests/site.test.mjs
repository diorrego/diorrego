import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

let browser, server, url;
const errors=[];
before(async()=>{
 const root=resolve('.');
 server=createServer(async(req,res)=>{
  try {
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
   if(!path.startsWith(root+'/')) throw Error('invalid');
   const data=await readFile(path);
   res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');
   res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 }).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 url=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_TEST_BIN||'/home/marie/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome'});
});
after(async()=>{await browser?.close(); await new Promise(r=>server?.close(r));});
async function page(options={}){const context=await browser.newContext({viewport:{width:1440,height:1000},...options});context.setDefaultTimeout(1500);const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);return {p,context};}

 test('profile and navigation expose real projects, history and contact',async()=>{
  const {p,context}=await page();assert.equal(await p.locator('h1').count(),1);
  assert.match(await p.locator('h1').innerText(),/idea.*producto/s);
  assert.match(await p.locator('main').innerText(),/Diego Orrego/);
  await p.locator('header').getByRole('link',{name:'Proyectos',exact:true}).click();assert.equal(new URL(p.url()).hash,'#proyectos');
  assert.equal(await p.locator('a[href="mailto:diego@woku.app"]').count()>0,true);
  assert.equal(await p.locator('a[href="https://github.com/diorrego"]').count()>0,true);
  await context.close();
 });
 test('project filters and Inpla detail preserve verified dates',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('[data-project]').count(),9);
  await p.getByRole('button',{name:'Herramientas',exact:true}).click();
  assert.equal(await p.locator('[data-project]:visible').count(),3);
  assert.match(await p.locator('#filter-status').innerText(),/3/);
  await p.getByRole('button',{name:'Todos',exact:true}).click();
  await p.locator('#inpla summary').click();assert.match(await p.locator('#inpla').innerText(),/enero de 2026/);
  assert.equal(await p.locator('#inpla details').getAttribute('open'),'');
  await context.close();
 });
 test('animation supports manual pause and respects reduced motion',async()=>{
  const {p,context}=await page();
  await p.getByRole('button',{name:'Pausar animaciones'}).click();
  assert.equal(await p.locator('#universe').getAttribute('data-motion'),'paused');
  assert.equal(await p.getByRole('button',{name:'Reanudar animaciones'}).getAttribute('aria-pressed'),'true');
  await p.getByRole('button',{name:'Reanudar animaciones'}).click();assert.equal(await p.locator('#universe').getAttribute('data-motion'),'running');
  await context.close();
  const reduced=await page({reducedMotion:'reduce'});
  assert.equal(await reduced.p.locator('#universe').getAttribute('data-motion'),'reduced');
  assert.equal(await reduced.p.getByRole('button',{name:'Movimiento reducido'}).isDisabled(),true);
  await reduced.context.close();
 });
 test('mobile menu, keyboard navigation and overflow from 320px',async()=>{
  const {p,context}=await page({viewport:{width:390,height:844}});
  await p.getByRole('button',{name:'Abrir menú'}).click();
  assert.equal(await p.getByRole('button',{name:'Cerrar menú'}).getAttribute('aria-expanded'),'true');
  await p.locator('header').getByRole('link',{name:'Trayectoria',exact:true}).click();assert.equal(new URL(p.url()).hash,'#trayectoria');
  assert.equal(await p.getByRole('button',{name:'Abrir menú'}).getAttribute('aria-expanded'),'false');
  for(const width of [320,390,768,1280,1440,1920]){
   await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`);
  }
  await p.goto(url);await p.keyboard.press('Tab');assert.match(await p.locator(':focus').innerText(),/Saltar al contenido/);
  await context.close();
 });
 test('content works without JavaScript and does not depend on canvas',async()=>{
  const {p,context}=await page({javaScriptEnabled:false});
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  await p.locator('#inpla summary').click();assert.match(await p.locator('#inpla').innerText(),/enero de 2026/);
  assert.equal(await p.locator('#contacto').isVisible(),true);
  assert.equal(await p.getByRole('button',{name:'Pausar animaciones'}).count(),0);
  await context.close();
 });
 test('AA accessibility, valid section links and no JavaScript errors',async()=>{
  const {p,context}=await page();
  await p.evaluate(()=>document.fonts.ready);
  const results=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  assert.deepEqual(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  const missing=await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.hash.length>1&&!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
  assert.deepEqual(missing,[]);assert.deepEqual(errors,[]);
  await context.close();
 });
 test('public manifest excludes private sources and session documents',async()=>{
  const manifest=await readFile('public-files.txt','utf8');
  assert.ok(manifest.includes('index.html'));
  assert.equal(manifest.includes('documentos'),false);assert.equal(manifest.includes('fuentes'),false);
 });
