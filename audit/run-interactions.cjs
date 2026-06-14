const fs=require('fs'), path=require('path'), puppeteer=require('puppeteer');
const base='http://localhost:3000'; const outDir=path.join(process.cwd(),'audit'); const shotDir=path.join(outDir,'screenshots'); const wait=ms=>new Promise(r=>setTimeout(r,ms));
const adminPassword=process.env.E2E_ADMIN_PASSWORD;
if(!adminPassword) throw new Error('E2E_ADMIN_PASSWORD is required.');
async function test(name, fn){ const started=Date.now(); try{return {name, ok: await fn(), durationMs:Date.now()-started};}catch(e){return {name, ok:false, error:e.message, durationMs:Date.now()-started};}}
(async()=>{
 const browser=await puppeteer.launch({headless:'new',args:['--no-sandbox']});
 const page=await browser.newPage(); await page.setViewport({width:1440,height:1000});
 const results=[];
results.push(await test('Login with seeded admin credentials redirects to admin dashboard', async()=>{ await page.goto(base+'/login',{waitUntil:'networkidle2'}); await page.type('input[name="email"]','emdadul.hoque@kravex.co.uk'); await page.type('input[name="password"]',adminPassword); const clicked=await page.evaluate(()=>{ const button=[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Sign In')); if(button){ button.click(); return true; } return false; }); if(!clicked) return false; await wait(2500); return page.url().includes('/admin/dashboard'); }));
 await page.screenshot({path:path.join(shotDir,'interaction-login-admin.png'),fullPage:true});
 results.push(await test('Login page has Open Demo Admin shortcut', async()=>{ await page.goto(base+'/login',{waitUntil:'networkidle2'}); return await page.evaluate(()=>[...document.querySelectorAll('a')].some(a=>a.textContent.includes('Open Demo Admin') && a.getAttribute('href')==='/admin/dashboard')); }));
 results.push(await test('Admin dashboard quick action opens modal', async()=>{ await page.goto(base+'/admin/dashboard',{waitUntil:'networkidle2'}); const clicked=await page.evaluate(()=>{ const button=[...document.querySelectorAll('button,a')].find(el=>el.innerText.includes('Add Prospect')); if(button){ button.click(); return true; } return false; }); await wait(500); const ok=await page.evaluate(()=>document.body.innerText.includes('Add Prospect') && document.body.innerText.includes('Business or lead name')); await page.screenshot({path:path.join(shotDir,'interaction-admin-modal.png'),fullPage:true}); return clicked && ok; }));
 results.push(await test('Admin leads search input filters/accepts text', async()=>{ await page.goto(base+'/admin/leads',{waitUntil:'networkidle2'}); const input=await page.$('input[placeholder="Search records"]'); if(!input) return false; await input.type('abc'); const v=await page.evaluate(el=>el.value,input); return v==='abc'; }));
 results.push(await test('Settings tabs switch visible heading', async()=>{ await page.goto(base+'/admin/settings',{waitUntil:'networkidle2'}); const buttons=await page.$$('button'); for(const b of buttons){ const t=await page.evaluate(el=>el.innerText,b); if(t.trim()==='Invoicing'){ await b.click(); break; }} await wait(300); return await page.evaluate(()=>document.querySelector('h2')?.innerText==='Invoicing'); }));
 results.push(await test('Invoice creator calculates VAT/total from inputs', async()=>{ await page.goto(base+'/admin/invoices/new',{waitUntil:'networkidle2'}); await wait(500); const text=await page.evaluate(()=>document.body.innerText); return text.includes('VAT 20%') && text.includes('£300.00') && text.includes('£1,800.00'); }));
 await page.screenshot({path:path.join(shotDir,'interaction-invoice-new.png'),fullPage:true});
 results.push(await test('Client dashboard loads with portal overview shell', async()=>{ await page.goto(base+'/client/dashboard',{waitUntil:'networkidle2'}); const text=await page.evaluate(()=>document.body.innerText); return text.includes('Here is your KRAVEX overview') && text.includes('Latest lead'); }));
 results.push(await test('Client leads page has filter UI but no real lead table/cards', async()=>{ await page.goto(base+'/client/leads',{waitUntil:'networkidle2'}); return await page.evaluate(()=>document.body.innerText.includes('Filter pills') && !document.querySelector('table')); }));
 fs.writeFileSync(path.join(outDir,'interaction-results.json'),JSON.stringify(results,null,2));
 await browser.close();
 console.log(JSON.stringify(results,null,2));
})();
