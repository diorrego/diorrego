import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
   const path=resolve(root,'.'+((pathname==='/'||pathname==='/es/')?'/index.html':pathname));
   if(!path.startsWith(root+'/')) throw Error('invalid');
   const data=await readFile(path);
   res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');
   res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 }).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 url=`http://127.0.0.1:${server.address().port}`;
 const bundled=chromium.executablePath();
 const executablePath=process.env.CHROME_TEST_BIN||(existsSync(bundled)?bundled:existsSync('/opt/google/chrome/chrome')?'/opt/google/chrome/chrome':bundled);
 browser=await chromium.launch({headless:true,executablePath});
});
after(async()=>{await browser?.close(); await new Promise(r=>server?.close(r));});
async function page(options={}){const context=await browser.newContext({viewport:{width:1440,height:1000},...options});context.setDefaultTimeout(1500);const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);return {p,context};}

 test('profile and navigation expose real projects, history and contact',async()=>{
  const {p,context}=await page();assert.equal(await p.locator('html').getAttribute('lang'),'en');assert.equal(await p.locator('h1').count(),1);
  assert.match(await p.locator('h1').innerText(),/Diego Orrego/);
  assert.match(await p.locator('main').innerText(),/Diego Orrego/);
  await p.locator('header').getByRole('link',{name:'Projects',exact:true}).click();assert.equal(new URL(p.url()).hash,'#projects');
  assert.equal(await p.locator('a[href="mailto:diego@woku.app"]').count()>0,true);
  assert.equal(await p.locator('a[href="https://github.com/diorrego"]').count()>0,true);
  await context.close();
 });
 test('project filters and Inpla detail preserve verified dates',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('[data-project]').count(),9);
  await p.getByRole('button',{name:'Tools',exact:true}).click();
  assert.equal(await p.locator('[data-project]:visible').count(),3);
  assert.match(await p.locator('#filter-status').innerText(),/3/);
  await p.getByRole('button',{name:'All',exact:true}).click();
  await p.locator('#inpla summary').click();assert.match(await p.locator('#inpla').innerText(),/January 2026/);
  assert.equal(await p.locator('#inpla details').getAttribute('open'),'');
  await context.close();
 });
 test('animation supports manual pause and respects reduced motion',async()=>{
  const {p,context}=await page();
  await p.getByRole('button',{name:'Pause animations'}).click();
  assert.equal(await p.locator('#universe').getAttribute('data-motion'),'paused');
  assert.equal(await p.getByRole('button',{name:'Resume animations'}).getAttribute('aria-pressed'),'true');
  await p.getByRole('button',{name:'Resume animations'}).click();assert.equal(await p.locator('#universe').getAttribute('data-motion'),'running');
  await context.close();
  const reduced=await page({reducedMotion:'reduce'});
  assert.equal(await reduced.p.locator('#universe').getAttribute('data-motion'),'reduced');
  assert.equal(await reduced.p.getByRole('button',{name:'Reduced motion'}).isDisabled(),true);
  await reduced.context.close();
 });
 test('mobile menu, keyboard navigation and overflow from 320px',async()=>{
  const {p,context}=await page({viewport:{width:390,height:844}});
  await p.getByRole('button',{name:'Open menu'}).click();
  assert.equal(await p.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
  await p.locator('header').getByRole('link',{name:'Journey',exact:true}).click();assert.equal(new URL(p.url()).hash,'#journey');
  assert.equal(await p.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  for(const width of [320,390,768,1280,1440,1920]){
   await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`);
  }
  await p.goto(url);await p.keyboard.press('Tab');assert.match(await p.locator(':focus').innerText(),/Skip to content/);
  await context.close();
 });
 test('content works without JavaScript and does not depend on canvas',async()=>{
  const {p,context}=await page({javaScriptEnabled:false});
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  await p.locator('#inpla summary').click();assert.match(await p.locator('#inpla').innerText(),/January 2026/);
  assert.equal(await p.locator('#contact').isVisible(),true);
  assert.equal(await p.getByRole('button',{name:'Pause animations'}).count(),0);
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

 test('English is the primary route and JavaScript localizes the shared HTML into Spanish',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('html').getAttribute('lang'),'en');
  await p.getByRole('link',{name:'Read in Spanish',exact:true}).click();
  assert.equal(new URL(p.url()).pathname,'/es/');
  await p.waitForFunction(()=>document.documentElement.lang==='es');
  assert.equal(await p.locator('html').getAttribute('lang'),'es');
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  assert.match(await p.locator('h1').innerText(),/Diego Orrego/);
  await p.getByRole('link',{name:'Leer en inglés',exact:true}).click();
  assert.equal(new URL(p.url()).pathname,'/');
  assert.equal(await p.locator('html').getAttribute('lang'),'en');
  await context.close();
 });
 test('Spanish controls, metadata and messages are localized consistently',async()=>{
  const {p,context}=await page({viewport:{width:390,height:844}});
  await p.goto(url+'/es/');
  await p.getByRole('button',{name:'Abrir menú'}).click();
  assert.equal(await p.getByRole('button',{name:'Cerrar menú'}).getAttribute('aria-expanded'),'true');
  await p.getByRole('button',{name:'Cerrar menú'}).click();
  await p.getByRole('button',{name:'Herramientas',exact:true}).click();
  assert.match(await p.locator('#filter-status').innerText(),/3 proyectos/);
  await p.getByRole('button',{name:'Todos',exact:true}).click();
  await p.locator('#inpla summary').click();
  assert.match(await p.locator('#inpla').innerText(),/enero de 2026/);
  assert.match(await p.title(),/producto/);
  assert.equal(await p.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'),'/');
  assert.equal(await p.locator('link[rel="alternate"][hreflang="es"]').getAttribute('href'),'/es/');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await p.locator('body').innerText().then(t=>/\{\{/.test(t)),false);
  await context.close();
 });

 test('Spanish route preserves useful English fallback when JavaScript is disabled',async()=>{
  const {p,context}=await page({javaScriptEnabled:false});await p.goto(url+'/es/');
  assert.equal(await p.locator('html').getAttribute('lang'),'en');
  assert.match(await p.locator('h1').innerText(),/Diego Orrego/);
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  await context.close();
 });
 test('locale catalogs have matching keys and preserve code in English',async()=>{
  const en=JSON.parse(await readFile('locales/en.json','utf8'));
  const es=JSON.parse(await readFile('locales/es.json','utf8'));
  assert.deepEqual(Object.keys(en).sort(),Object.keys(es).sort());
  const {p,context}=await page();await p.goto(url+'/es/');
  assert.match(await p.locator('pre').innerText(),/const product/);
  assert.equal(await p.locator('body').innerText().then(t=>/\{\{/.test(t)),false);
  await context.close();
 });

 test('static distribution ships one HTML and an explicit Spanish route rewrite',async()=>{
  const manifest=(await readFile('public-files.txt','utf8')).split('\n').filter(Boolean);
  assert.deepEqual(manifest.filter(path=>path.endsWith('.html')),['index.html']);
  assert.ok(manifest.includes('_redirects'));
  const redirects=await readFile('_redirects','utf8');
  assert.match(redirects,/\/es\/\s+\/index\.html\s+200/);
  assert.ok(manifest.includes('locales/en.json')&&manifest.includes('locales/es.json'));
 });

 test('featured project metadata follows the project heading',async()=>{
  const {p,context}=await page();
  const order=await p.locator('.feature-copy').evaluateAll(elements=>elements.map(element=>{
   const heading=element.querySelector('h3');const metadata=element.querySelector('.project-role');
   return Boolean(heading.compareDocumentPosition(metadata)&Node.DOCUMENT_POSITION_FOLLOWING);
  }));
  assert.deepEqual(order,[true,true,true]);await context.close();
 });
 test('a failed Spanish catalog preserves English content and explains recovery',async()=>{
  const {p,context}=await page();
  await p.route('**/locales/es.json',route=>route.abort());await p.goto(url+'/es/');
  await p.locator('#locale-status').waitFor({state:'visible'});
  assert.equal(await p.locator('html').getAttribute('lang'),'en');
  assert.match(await p.locator('h1').innerText(),/Diego Orrego/);
  assert.match(await p.locator('#locale-status').innerText(),/Reload to try again/);
  assert.equal(await p.getByRole('button',{name:'Pause animations'}).isVisible(),true);
  await context.close();
 });

 test('the whole site stays in dark space without light or green section surfaces',async()=>{
  const {p,context}=await page();
  const colors=await p.locator('main section,.project-feature,.contact').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).backgroundColor));
  for(const color of colors){
   const [r,g,b,a=1]=(color.match(/[\d.]+/g)||[]).map(Number);
   if(a===0)continue;
   assert.ok(Math.max(r,g,b)<70,`unexpected light surface ${color}`);
   assert.ok(!(g>r+25&&g>b+25),`unexpected green surface ${color}`);
  }
  assert.equal(await p.locator('#starfield').count(),1);
  assert.equal(await p.locator('#starfield').evaluate(element=>getComputedStyle(element).position),'fixed');
  await p.locator('#contact').scrollIntoViewIfNeeded();
  assert.equal(await p.locator('#starfield').evaluate(element=>element.getBoundingClientRect().top),0);
  await context.close();
 });
 test('terminal commands navigate to real content and recover from unknown commands',async()=>{
  const {p,context}=await page();
  const input=p.getByRole('textbox',{name:'Terminal command'});
  await input.fill('ls projects');await input.press('Enter');
  assert.equal(new URL(p.url()).hash,'#projects');
  await input.fill('unknown');await input.press('Enter');
  assert.match(await p.locator('#terminal-output').innerText(),/Unknown command/);
  await input.fill('help');await input.press('Enter');
  assert.match(await p.locator('#terminal-output').innerText(),/whoami.*projects.*journey/s);
  await context.close();
 });
 test('terminal command feedback is localized and cannot execute arbitrary code',async()=>{
  const {p,context}=await page();await p.goto(url+'/es/');
  const input=p.getByRole('textbox',{name:'Comando de terminal'});
  await input.fill('window.location = "https://example.com"');await input.press('Enter');
  assert.equal(new URL(p.url()).origin,url);
  assert.match(await p.locator('#terminal-output').innerText(),/Comando desconocido/);
  await context.close();
 });
