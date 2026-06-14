const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const base = 'http://localhost:3000';
const outDir = path.join(process.cwd(), 'audit');
const shotDir = path.join(outDir, 'screenshots');
fs.mkdirSync(shotDir, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const pages = [
  ['Public Home','/'], ['How It Works','/how-it-works'], ['Services','/services'], ['Industries','/industries'], ['Results','/results'], ['About','/about'], ['Contact','/contact'], ['Privacy Policy','/privacy-policy'], ['Terms','/terms'], ['Cookie Policy','/cookie-policy'], ['Get Started','/get-started'],
  ['Login','/login'], ['Forgot Password','/forgot-password'], ['Reset Password','/reset-password'], ['Activate','/activate'],
  ['Admin Dashboard','/admin/dashboard'], ['Admin Prospects','/admin/prospects'], ['Admin Clients','/admin/clients'], ['Admin Client Detail','/admin/clients/test'], ['Admin Leads','/admin/leads'], ['Admin Campaigns','/admin/campaigns'], ['Admin Invoices','/admin/invoices'], ['Admin New Invoice','/admin/invoices/new'], ['Admin Invoice Detail','/admin/invoices/test'], ['Admin Payments','/admin/payments'], ['Admin Reports','/admin/reports'], ['Admin Settings','/admin/settings'], ['Admin Prospect Detail','/admin/prospects/test'],
  ['Client Dashboard','/client/dashboard'], ['Client Leads','/client/leads'], ['Client Invoices','/client/invoices'], ['Client Invoice Detail','/client/invoices/test'], ['Client Messages','/client/messages'], ['Client Account','/client/account']
];
const apiTests = [
  ['POST /api/contact','/api/contact','POST',{name:'Test User',businessName:'Test Business',email:'test@example.com',phone:'07111111111',industry:'Other',message:'Audit test'}],
  ['POST /api/lead-form','/api/lead-form','POST',{name:'Test User',email:'test@example.com',phone:'07111111111',service:'Other',city:'London',message:'Audit test'}],
  ['GET /api/admin/prospects','/api/admin/prospects','GET'], ['GET /api/admin/clients','/api/admin/clients','GET'], ['GET /api/admin/leads','/api/admin/leads','GET'], ['GET /api/admin/campaigns','/api/admin/campaigns','GET'], ['GET /api/admin/invoices','/api/admin/invoices','GET'], ['GET /api/admin/payments','/api/admin/payments','GET'], ['GET /api/admin/payments/overview','/api/admin/payments/overview','GET'], ['GET /api/admin/reports/agency','/api/admin/reports/agency','GET'], ['GET /api/admin/settings','/api/admin/settings','GET'],
  ['GET /api/client/dashboard','/api/client/dashboard','GET'], ['GET /api/client/leads','/api/client/leads','GET'], ['GET /api/client/invoices','/api/client/invoices','GET'], ['GET /api/client/messages','/api/client/messages','GET'],
  ['POST /api/stripe/pay-invoice','/api/stripe/pay-invoice','POST',{invoiceId:'test'}], ['POST /api/admin/payments/owner-withdrawal','/api/admin/payments/owner-withdrawal','POST',{amount:1000}], ['POST /api/jobs/reconcile','/api/jobs/reconcile','POST',{}], ['POST /api/jobs/backup','/api/jobs/backup','POST',{}]
];
(async()=>{
 const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox']});
 const results=[];
 for (const [name,url] of pages) {
   const page = await browser.newPage();
   await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
   const consoleMessages=[]; const pageErrors=[]; const failed=[];
   page.on('console', msg => { if (['error','warning'].includes(msg.type())) consoleMessages.push(`${msg.type()}: ${msg.text()}`); });
   page.on('pageerror', err => pageErrors.push(err.message));
   page.on('requestfailed', req => failed.push(`${req.failure()?.errorText || 'failed'} ${req.url()}`));
   let status=null, title='', screenshot='', loaded=false, styled=false, h1='', bodyText='', error=null, cssStatus='unknown', jsStatus='unknown';
   try {
     const resp = await page.goto(base+url, {waitUntil:'networkidle2', timeout:60000});
     status = resp ? resp.status() : null;
     await wait(800);
     title = await page.title();
     const info = await page.evaluate(async () => {
       const styles = getComputedStyle(document.body);
       const h = document.querySelector('h1');
       const hStyle = h ? getComputedStyle(h) : null;
       const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l=>l.href);
       const scripts = [...document.querySelectorAll('script[src*="/_next/static"]')].map(s=>s.src);
       return { bg: styles.backgroundColor, color: styles.color, font: styles.fontFamily, h1: h?.textContent?.trim() || '', h1Size: hStyle?.fontSize || '', cssLinks, scripts, bodyText: document.body.innerText.slice(0,1600) };
     });
     h1 = info.h1; bodyText = info.bodyText;
     styled = info.cssLinks.length > 0 && (info.bg.includes('10, 10, 10') || info.bg.includes('0, 0, 0') || Number((info.h1Size||'0').replace('px','')) > 34);
     loaded = status >= 200 && status < 400 && !bodyText.includes('Application error') && !bodyText.includes('Unhandled Runtime Error') && !bodyText.includes('Internal Server Error');
     if (info.cssLinks[0]) { try { const r = await fetch(info.cssLinks[0]); cssStatus = r.status; } catch(e) { cssStatus = e.message; } }
     if (info.scripts[0]) { try { const r = await fetch(info.scripts[0]); jsStatus = r.status; } catch(e) { jsStatus = e.message; } }
     screenshot = path.join(shotDir, `${url.replace(/^\/$/,'home').replace(/^\//,'').replace(/[\/\[\]:?*"<>|]/g,'_') || 'home'}.png`);
     await page.screenshot({path:screenshot, fullPage:true});
   } catch(e) { error = e.message; }
   results.push({type:'page', name, url, status, title, h1, loaded, styled, cssStatus, jsStatus, screenshot, consoleMessages, pageErrors, failedRequests: failed.slice(0,12), error, bodyExcerpt: bodyText.slice(0,500)});
   await page.close();
 }
 await browser.close();
 const apiResults=[];
 for (const [name,url,method,body] of apiTests) {
   const started = Date.now();
   try {
     const resp = await fetch(base+url, {method, headers:{'content-type':'application/json'}, body: method==='POST'?JSON.stringify(body||{}):undefined});
     const text = await resp.text();
     apiResults.push({type:'api', name, url, method, status:resp.status, ok:resp.ok, durationMs:Date.now()-started, response:text.slice(0,1000)});
   } catch(e) { apiResults.push({type:'api', name, url, method, status:null, ok:false, durationMs:Date.now()-started, response:e.message}); }
 }
 const report={generatedAt:new Date().toISOString(), base, pages:results, apis:apiResults};
 fs.writeFileSync(path.join(outDir,'test-results.json'), JSON.stringify(report,null,2));
 console.log(JSON.stringify({pages:results.length, apis:apiResults.length, failedPages:results.filter(r=>!r.loaded||!r.styled||r.error).length, failedApis:apiResults.filter(r=>!r.ok).length}, null, 2));
})();
