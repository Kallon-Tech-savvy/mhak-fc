import {existsSync, readFileSync, mkdirSync, cpSync, writeFileSync, rmSync} from 'node:fs';
import {join,resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const mode=process.argv[2]||'staging';
const modes=new Set(['staging','public','enquiries']);
if(!modes.has(mode)){console.error('Usage: node scripts/build.mjs [staging|public|enquiries]');process.exit(2);}
const output=join(root,'release',mode);
const source=join(root,'public');
const fail=message=>{console.error('BLOCKED:',message);process.exit(1);};
const evidencePath=join(root,'launch-evidence.json');
const verified=['clubIdentityAndCopyApproved','approvedLogoSelected','domainDnsAndTlsVerified','inboxReceivesExternalMail','outboundReplyVerified','privacyNoticeApproved','safeguardingProcessApproved'];
const emailReady=['resendSendingDomainVerified','turnstileProductionKeysConfigured','cloudflareWafRateLimitConfigured','liveEndToEndEnquiryDeliveryTestPassed'];
let evidence;
if(mode!=='staging'){
  if(!existsSync(evidencePath))fail('Missing launch-evidence.json. Copy the example, then record independently verified checks.');
  try{evidence=JSON.parse(readFileSync(evidencePath,'utf8'));}catch{fail('Invalid launch-evidence.json.');}
  if(evidence.domain!=='mhak.alhajikallon.com'||evidence.clubEmail!=='mhak@alhajikallon.com')fail('Unexpected domain or mailbox.');
  const required=mode==='public'?verified:[...verified,...emailReady];
  const missing=required.filter(key=>evidence.checks?.[key]!==true);
  if(missing.length)fail('Unverified launch checks: '+missing.join(', '));
  if(!existsSync(join(root,'approved-privacy.html')))fail('Privacy policy has not been approved and supplied in approved-privacy.html.');
  const notice=readFileSync(join(root,'approved-privacy.html'),'utf8');
  if(notice.length<900||!/<html\b/i.test(notice)||/\bdraft notice\b|\bnot approved\b|noindex/i.test(notice) || !notice.includes('mhak@alhajikallon.com'))fail('Approved privacy notice missing, too short, or still marked as draft. Human review remains necessary.');
  if(mode==='enquiries' && !/^[A-Za-z0-9_-]{8,}$/.test(process.env.MHAK_TURNSTILE_SITE_KEY||''))fail('MHAK_TURNSTILE_SITE_KEY must be supplied for enquiry build (public site key only).');
}
if(!existsSync(source))fail('public/ directory is missing.');
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
cpSync(source,output,{recursive:true});
if(mode!=='staging'){
  const origin='https://mhak.alhajikallon.com';
  let html=readFileSync(join(output,'index.html'),'utf8');
  html=html.replace(/<meta name="robots" content="noindex, nofollow">/,'<meta name="robots" content="index, follow">');
  html=html.replace(/\s*<!-- Staging only:[^>]*-->/,'');
  html=html.replace('</head>',`  <link rel="canonical" href="${origin}/">\n  <meta property="og:url" content="${origin}/">\n</head>`);
  html=html.replace('content="assets/share-preview.png"',`content="${origin}/assets/share-preview.png"`);
  html=html.replace(/<div class="preview-banner">.*?<\/div>/s,'');
  html=html.replace(/CONCEPT PREVIEW — NOT AN OFFICIAL LIVE CLUB WEBSITE/g,'');
  html=html.replace(/DESIGN STAGING PREVIEW · DO NOT PUBLISH WITHOUT THE LAUNCH CHECKLIST/g,'MHAK FC · SIERRA LEONE');
  html=html.replace(/The planned club inbox is mhak@alhajikallon.com\./g,'Our official correspondence address is mhak@alhajikallon.com.');
  html=html.replace(/The planned official contact is mhak@alhajikallon.com\./g,'The official contact is mhak@alhajikallon.com.');
  html=html.replace(/The enquiry form will open only after inbox delivery, safeguarding procedures and secure processing are verified\./g, mode==='enquiries'?'Adult enquiries are open through the protected form.':'The online form is not yet available; please use the club email for initial contact.');
  html=html.replace(/Inbox delivery, a published and approved privacy\/retention notice and bot protection are required before this form can open\. No messages are collected by this preview\./g,mode==='enquiries'?'Adult enquiries are processed in accordance with our privacy notice.':'The online form is currently disabled. Please contact the verified club inbox directly.');
  html=html.replace(/Enquiries are not open yet\. This is a preview of the future contact experience\. Do not enter personal information\./g,'Online enquiries are not currently available. Please use the official club email.');
  html=html.replace(/OFFICIAL ENQUIRIES · PROPOSED CONTACT:/g,'OFFICIAL CONTACT:');
  html=html.replace(/Privacy notice \(draft\)/g,'Privacy notice');
  if(mode!=='enquiries'){
    html=html.replace(/<p id="enquiry-availability"[^>]*>.*?<\/p>/s, '<p id="enquiry-availability" class="form-availability" role="status">Online forms are closed. For initial enquiries, email <a href="mailto:mhak@alhajikallon.com">mhak@alhajikallon.com</a>.</p>');
  }
  writeFileSync(join(output,'index.html'),html);
  writeFileSync(join(output,'privacy.html'),readFileSync(join(root,'approved-privacy.html'),'utf8'));
  writeFileSync(join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
  const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${origin}/</loc></url>\n<url><loc>${origin}/privacy.html</loc></url>\n</urlset>\n`;
  writeFileSync(join(output,'sitemap.xml'),sitemap);
  writeFileSync(join(output,'contact-config.json'),JSON.stringify({enabled:mode==='enquiries',turnstileSiteKey:mode==='enquiries'?process.env.MHAK_TURNSTILE_SITE_KEY:''},null,2)+'\n');
  // Remove staging-specific X-Robots-Tag only after the public release gate passes.
  const headersPath=join(output,'_headers');
  const headers=readFileSync(headersPath,'utf8').split('\n').filter(line=>!/^\s*X-Robots-Tag:/i.test(line)).join('\n');
  writeFileSync(headersPath,headers);
}
// The handler stays OUTSIDE the static output. Deploy this with Cloudflare Pages Git integration or Wrangler using the project root.
console.log(`Built ${mode} static files to ${output}. No deployment or email delivery performed.`);
