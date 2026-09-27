import { test, before, after, afterEach } from 'node:test';
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
   let mounted=pathname.startsWith('/diorrego/')?pathname.slice('/diorrego'.length):pathname;
   if(mounted.startsWith('/es/'))mounted=mounted.slice(3)||'/';
   const path=resolve(root,'.'+((mounted==='/'||mounted==='/es')?'/index.html':mounted));
   if(!path.startsWith(root+'/')) throw Error('invalid');
   const data=await readFile(path);
   res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8'})[extname(path)]||'application/octet-stream');
   res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 }).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 url=`http://127.0.0.1:${server.address().port}`;
 const bundled=chromium.executablePath();
 const executablePath=process.env.CHROME_TEST_BIN||(existsSync(bundled)?bundled:existsSync('/opt/google/chrome/chrome')?'/opt/google/chrome/chrome':bundled);
 browser=await chromium.launch({headless:true,executablePath});
});
afterEach(async()=>{for(const context of browser?.contexts()||[])await context.close();});
after(async()=>{await browser?.close(); await new Promise(r=>server?.close(r));});
async function canvasPixels(locator) {
 return locator.evaluate(canvas=>{
  let pixels;
  const gl=canvas.getContext('webgl');
  if(gl){ pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels); }
  else pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
  let hash=2166136261;
  for(let i=0;i<pixels.length;i++)hash=Math.imul(hash^pixels[i],16777619);
  return hash>>>0;
 });
}
async function page(options={}){const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...options});context.setDefaultTimeout(5000);const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);return {p,context};}

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
 test('procedural black hole animates without a pause control and respects reduced motion',async()=>{
  const {p,context}=await page({reducedMotion:'no-preference'});
  assert.equal(await p.locator('#motion-toggle').count(),0);
  await p.waitForFunction(()=>document.querySelector('#universe').dataset.artReady==='true');
  assert.equal(await p.locator('#universe').getAttribute('data-motion'),'running');
  const first=await canvasPixels(p.locator('#space-canvas'));await p.waitForTimeout(600);
  const second=await canvasPixels(p.locator('#space-canvas'));assert.notEqual(first,second);
  await context.close();
  const reduced=await page({reducedMotion:'reduce'});
  await reduced.p.waitForFunction(()=>document.querySelector('#universe').dataset.artReady==='true');
  assert.equal(await reduced.p.locator('#universe').getAttribute('data-motion'),'reduced');
  const still=await canvasPixels(reduced.p.locator('#space-canvas'));await reduced.p.waitForTimeout(400);
  const stillLater=await canvasPixels(reduced.p.locator('#space-canvas'));assert.equal(still,stillLater);
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
  await p.getByRole('button',{name:'Read in Spanish',exact:true}).click();
  assert.equal(new URL(p.url()).pathname,'/');
  await p.waitForFunction(()=>document.documentElement.lang==='es');
  assert.equal(await p.locator('html').getAttribute('lang'),'es');
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  assert.match(await p.locator('h1').innerText(),/Diego Orrego/);
  await p.getByRole('button',{name:'Leer en inglés',exact:true}).click();
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
  assert.equal(await p.locator('[data-language="es"]').getAttribute('aria-pressed'),'true');
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
  assert.equal(await p.locator('#motion-toggle').count(),0);
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

 test('X profile is available in the introduction and footer',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('.hero-links a[href="https://x.com/diorrego"]').count(),1);
  assert.equal(await p.locator('footer a[href="https://x.com/diorrego"]').count(),1);
  await context.close();
 });

 test('toolbox reflects the current declared tools',async()=>{
  const {p,context}=await page();
  const text=await p.locator('#capabilities .tech-line').innerText();
  assert.equal(/Python/i.test(text),false);
  for(const tool of ['Azure','LangSmith','Orca','Claude Code','Kimi','Codex','OpenCode'])assert.ok(text.includes(tool),`missing ${tool}`);
  await context.close();
 });

 test('the procedural black hole occupies two thirds of the desktop hero without project overlays',async()=>{
  const {p,context}=await page();
  const ratio=await p.evaluate(()=>document.querySelector('#universe').getBoundingClientRect().width/document.querySelector('.hero').getBoundingClientRect().width);
  assert.ok(ratio>=.64&&ratio<=.70,`hero art ratio ${ratio}`);
  assert.equal(await p.locator('#universe .orbit-node').count(),0);
  assert.equal(await p.locator('#universe a').count(),0);
  assert.equal(await p.locator('#black-hole-reference').count(),0);
  await p.waitForFunction(()=>document.querySelector('#universe').dataset.procedural==='true');
  await context.close();
 });
 test('procedural geometry is a complete fallback without JavaScript',async()=>{
  const {p,context}=await page({javaScriptEnabled:false});
  assert.equal(await p.locator('#black-hole-fallback').isVisible(),true);
  assert.equal(await p.locator('#universe').getAttribute('data-motion'),'static');
  assert.equal(await p.locator('[data-project]:visible').count(),9);
  await context.close();
 });

 test('black-hole rendering is generated in code without loading the reference bitmap',async()=>{
  const {p,context}=await page();const requests=[];
  p.on('request',request=>requests.push(request.url()));await p.reload();
  await p.waitForFunction(()=>document.querySelector('#universe').dataset.artReady==='true');
  assert.equal(await p.locator('#universe').getAttribute('data-procedural'),'true');
  assert.equal(requests.some(url=>url.includes('black-hole-pixel.png')),false);
  assert.equal(await p.locator('#universe img').count(),0);
  await context.close();
 });

 test('the complete animated disk keeps a transparent margin at every viewport size',async()=>{
  const {p,context}=await page();
  await p.waitForFunction(()=>document.querySelector('#universe').dataset.artReady==='true');
  for(const width of [320,390,768,1280,1440,1920]){
   await p.setViewportSize({width,height:1000});
   const bounds=await p.locator('#universe').boundingBox();
   assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1,`art exceeds viewport at ${width}`);
  }
  const edgeInk=await p.locator('#space-canvas').evaluate(canvas=>{
   let pixels;const gl=canvas.getContext('webgl');
   if(gl){pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);}
   else pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
   let count=0;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    if(x<5||y<5||x>=canvas.width-5||y>=canvas.height-5){if(pixels[(y*canvas.width+x)*4+3]>0)count++;}
   }
   return count;
  });
  assert.equal(edgeInk,0,'the outer disk must end before all four canvas edges');
  await context.close();
 });

 test('research visibly establishes scientific foundations and the Happiness Director role',async()=>{
  const {p,context}=await page();
  await p.locator('header').getByRole('link',{name:'Research',exact:true}).click();
  assert.equal(new URL(p.url()).hash,'#research');
  const text=await p.locator('#research').innerText();
  assert.match(text,/scientific and statistical foundations/i);
  assert.match(text,/second Happiness Management Department in Chile/);
  assert.match(text,/Happiness Director/);
  assert.match(text,/174/);assert.match(text,/Mann.?Whitney/);
  assert.equal(await p.locator('#research a[href*="repositorio.udec.cl"]').count(),1);
  assert.equal(/\bthesis\b/i.test(text),false);
  await context.close();
 });
 test('research command and Spanish content describe the applied study explicitly',async()=>{
  const {p,context}=await page();await p.goto(url+'/es/');
  const input=p.getByRole('textbox',{name:'Comando de terminal'});
  await input.fill('research');await input.press('Enter');
  assert.equal(new URL(p.url()).hash,'#research');
  const text=await p.locator('#research').innerText();
  assert.match(text,/bases científicas y estadísticas/);
  assert.match(text,/segunda Gerencia de Felicidad de Chile/);
  assert.match(text,/Director de Felicidad/);
  assert.match(text,/-0,512/);assert.match(text,/-0,251/);
  assert.equal(/(^|[^\p{L}])tesis([^\p{L}]|$)/iu.test(text),false);
  await context.close();
 });
 test('research and its public PDF source remain accessible without JavaScript',async()=>{
  const {p,context}=await page({javaScriptEnabled:false});
  assert.equal(await p.locator('#research').isVisible(),true);
  assert.equal(await p.locator('#research a[href*="repositorio.udec.cl"]').getAttribute('href'),'https://repositorio.udec.cl/server/api/core/bitstreams/44fc5fab-5b09-49b1-b5a6-4e13c93eaa0d/content');
  await context.close();
 });

 test('SEM is explicitly highlighted as the research statistical foundation',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('#research').getByRole('heading',{name:'Structural equation modeling · SEM',exact:true}).count(),1);
  await p.goto(url+'/es/');await p.waitForFunction(()=>document.documentElement.lang==='es');
  assert.equal(await p.locator('#research').getByRole('heading',{name:'Modelos de ecuaciones estructurales · SEM',exact:true}).count(),1);
  await context.close();
 });

 test('research prioritizes all five PERMA SEM models and identifies failed global fit',async()=>{
  const {p,context}=await page();
  const section=p.locator('#research');
  const text=await section.innerText();
  assert.match(text,/global PERMA model/i);
  assert.match(text,/did not achieve acceptable fit/i);
  for(const value of ['-0.512','-0.481','-0.251','-0.508','-0.361'])assert.ok(text.includes(value),value);
  for(const construct of ['Positive emotions','Engagement','Positive relationships','Meaning','Accomplishment'])assert.ok(text.includes(construct),construct);
  assert.match(text,/RMSEA/);assert.match(text,/0.146/);
  assert.equal(text.includes('7.46'),false);
  assert.equal(await section.locator('tbody tr').count(),5);
  await context.close();
 });

 test('GitHub Pages project root loads its assets and changes languages without URL parameters',async()=>{
  const {p,context}=await page();const requests=[];p.on('request',request=>requests.push(request.url()));
  await p.goto(url+'/diorrego/');
  await p.waitForFunction(()=>document.querySelector('#universe').dataset.artReady==='true');
  assert.equal(await p.locator('html').getAttribute('lang'),'en');
  await p.getByRole('button',{name:'Read in Spanish',exact:true}).click();
  await p.waitForFunction(()=>document.documentElement.lang==='es');
  assert.equal(new URL(p.url()).pathname,'/diorrego/');assert.equal(new URL(p.url()).search,'');
  for(const request of requests.filter(path=>/\/(js|css|locales|assets)\//.test(path)))assert.ok(new URL(request).pathname.startsWith('/diorrego/'),request);
  assert.equal(await p.locator('#research').getByRole('heading',{name:'Modelos de ecuaciones estructurales · SEM',exact:true}).count(),1);
  await context.close();
 });

 test('SEO metadata includes canonical URLs and English-first raw JPG social previews',async()=>{
  const {p,context}=await page();
  const enImage='https://diorrego.github.io/diorrego/assets/og/og-en.jpg';
  assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://diorrego.github.io/diorrego/');
  assert.equal(await p.locator('meta[property="og:image"]').getAttribute('content'),enImage);
  assert.equal(await p.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
  assert.equal(await p.locator('meta[name="twitter:image"]').getAttribute('content'),enImage);
  await p.getByRole('button',{name:'Read in Spanish',exact:true}).click();await p.waitForFunction(()=>document.documentElement.lang==='es');
  assert.equal(await p.locator('meta[property="og:image"]').getAttribute('content'),'https://diorrego.github.io/diorrego/assets/og/og-es.jpg');
  assert.equal(await p.locator('meta[property="og:locale"]').getAttribute('content'),'es_CL');
  for(const language of ['en','es']){
   const bytes=await readFile(`assets/og/og-${language}.jpg`);assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);
  }
  await context.close();
 });
 test('website text and metadata contain no em dash in either language',async()=>{
  const html=await readFile('index.html','utf8');
  const forbidden=String.fromCharCode(0x2014);
  assert.equal(html.includes(forbidden),false);
  for(const language of ['en','es']){
   const data=await readFile(`locales/${language}.json`,'utf8');assert.equal(data.includes(forbidden),false);
  }
  const {p,context}=await page();
  for(const language of ['en','es']){
   if(language==='es'){await p.getByRole('button',{name:'Read in Spanish',exact:true}).click();await p.waitForFunction(()=>document.documentElement.lang==='es');}
   const content=await p.evaluate(()=>document.body.innerText+' '+document.title+' '+[...document.querySelectorAll('meta')].map(node=>node.content).join(' '));
   assert.equal(content.includes(forbidden),false);
  }
  await context.close();
 });

 test('mobile menu overlays the page without shifting the hero and aligns its trigger right',async()=>{
  const {p,context}=await page({viewport:{width:496,height:844}});await p.evaluate(()=>document.fonts.ready);
  const trigger=p.getByRole('button',{name:'Open menu'});
  const before=await p.locator('.hero').boundingBox();const buttonBounds=await trigger.boundingBox();
  assert.ok(buttonBounds.x+buttonBounds.width>460,'menu trigger belongs on the right');
  await trigger.click();
  assert.equal(await p.locator('#navigation').evaluate(node=>getComputedStyle(node).position),'fixed');
  const after=await p.locator('.hero').boundingBox();assert.equal(after.y,before.y);
  await p.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  await context.close();
 });

 test('LLM overview is public at the site root and discoverable through the footer',async()=>{
  const {p,context}=await page();
  assert.equal(await p.locator('footer a[href="llms.txt"]').count(),1);
  assert.equal(await p.locator('link[rel="describedby"][href="llms.txt"]').count(),1);
  for(const prefix of ['', '/diorrego']){
   const response=await p.request.get(url+prefix+'/llms.txt');
   assert.equal(response.status(),200);
   assert.match(response.headers()['content-type'],/text\/plain/);
   const overview=await response.text();
   assert.match(overview,/^# Diego Orrego\n/);
   assert.match(overview,/\n> /);
   assert.match(overview,/## Profile/);
   assert.match(overview,/\[.*\]\(https:\/\/diorrego.github.io\/diorrego\/profile.md\)/);
   assert.match(overview,/repositorio.udec.cl/);
   assert.equal(overview.includes(String.fromCharCode(0x2014)),false);
   const profile=await p.request.get(url+prefix+'/profile.md');
   assert.equal(profile.status(),200);
   assert.match(await profile.text(),/0.146/);
  }
  await p.locator('footer a[href="llms.txt"]').click();
  assert.equal(new URL(p.url()).pathname,'/llms.txt');
  assert.equal(new URL(p.url()).search,'');
  await context.close();
 });
