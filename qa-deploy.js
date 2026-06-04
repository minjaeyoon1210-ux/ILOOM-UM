const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const failed = [];
  page.on('requestfailed', r => { if(!r.url().includes('jsdelivr')) failed.push(r.url().split('/').slice(-2).join('/')); });
  const url = 'file:///' + path.resolve('C:/upmotion_deploy/um7k2x9p4q/index.html').split(path.sep).join('/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const imgs = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('img').forEach(i => { if(!i.complete || i.naturalWidth===0) out.push(i.getAttribute('src')); });
    return out;
  });
  console.log('BROKEN_IMG:', JSON.stringify(imgs));
  console.log('REQ_FAILED:', JSON.stringify(failed.filter(f=>!f.includes('.mp3'))));
  // bgm
  await page.mouse.click(960, 400);
  await page.waitForTimeout(1000);
  const bgm = await page.evaluate(() => { const a=document.getElementById('bgm'); return {paused:a.paused, vol:Math.round(a.volume*100)/100}; });
  console.log('BGM:', JSON.stringify(bgm));
  await browser.close();
})();
