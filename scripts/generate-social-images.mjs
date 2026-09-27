import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const bundled = chromium.executablePath();
const executablePath = process.env.CHROME_TEST_BIN || (existsSync(bundled) ? bundled : '/opt/google/chrome/chrome');
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true, executablePath });
await mkdir('assets/og', { recursive: true });
for (const language of ['en', 'es']) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
  await page.goto(origin);
  const role = language === 'en' ? 'Engineer.<br>Entrepreneur.<br>Product builder.' : 'Ingeniero.<br>Emprendedor.<br>Creador de producto.';
  const footer = language === 'en' ? 'Product / code / research' : 'Producto / código / investigación';
  await page.setContent(`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><base href="${origin}"><style>
  @font-face{font-family:Terminal;src:url('assets/fonts/jetbrains-mono-400.ttf');font-weight:400}
  @font-face{font-family:Terminal;src:url('assets/fonts/jetbrains-mono-700.ttf');font-weight:700}
  *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#05070b;color:#d2dbe8;font-family:Terminal,monospace}
  #starfield{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
  header{position:absolute;left:56px;right:56px;top:38px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #293244;padding-bottom:20px;font-size:20px;color:#9db9e7}
  .brand{font-weight:700}.language{font-size:13px;color:#8e9cb1}
  .terminal{position:absolute;left:56px;top:140px;width:390px;border:1px solid #293244;background:rgba(9,14,22,.85)}
  .bar{padding:12px 22px;border-bottom:1px solid #293244;color:#8e9cb1;font-size:12px}
  .body{padding:30px 23px}h1{margin:0 0 24px;font-size:34px;line-height:1.3;letter-spacing:-.025em}h1 span{color:#d3a787}p{margin:0;font-size:21px;line-height:1.65;color:#9db9e7}
  #universe{position:absolute;left:445px;top:102px;width:720px;height:500px}#space-canvas{width:100%;height:100%;image-rendering:pixelated}
  footer{position:absolute;left:56px;bottom:39px;color:#8e9cb1;font-size:14px;line-height:1.9}footer span{color:#9db9e7}
  </style></head><body><canvas id="starfield"></canvas><header><span class="brand">diorrego.</span><span class="language">${language.toUpperCase()} / portfolio</span></header><div class="terminal"><div class="bar">$ whoami</div><div class="body"><h1>Diego Orrego<span>_</span></h1><p>${role}</p></div></div><div id="universe"><canvas id="space-canvas" aria-hidden="true"></canvas></div><footer><span>${footer}</span><br>diorrego.github.io/diorrego</footer><script type="module">
  import { initializeBlackHole } from './js/black-hole.js';
  import { createSpaceBackground } from './js/space-background.js';
  const background=createSpaceBackground();background.render(0);
  const art=await initializeBlackHole();art.render(2.3,true);window.socialReady=true;
  </script></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.socialReady === true);
  await page.screenshot({ path: `assets/og/og-${language}.jpg`, type: 'jpeg', quality: 94 });
  await page.close();
}
await browser.close();
console.log('Generated raw English and Spanish 1200x630 JPG previews from the actual design.');
