import {readFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const out=join(root,'release','staging');
const required=['index.html','privacy.html','robots.txt','_headers','contact-config.json','styles.css','script.js','assets/mhak-mark-white.svg','assets/mhak-mark-black.svg','assets/share-preview.png'];
const failures=[];
for(const file of required)if(!existsSync(join(out,file)))failures.push(`missing ${file}`);
if(!failures.length){
 const html=readFileSync(join(out,'index.html'),'utf8');
 const headers=readFileSync(join(out,'_headers'),'utf8');
 const robots=readFileSync(join(out,'robots.txt'),'utf8');
 const config=JSON.parse(readFileSync(join(out,'contact-config.json'),'utf8'));
 if(!html.includes('content="noindex, nofollow"'))failures.push('staging meta robots missing');
 if(!headers.includes('X-Robots-Tag: noindex, nofollow, noarchive'))failures.push('staging X-Robots-Tag missing');
 if(!robots.includes('Disallow: /'))failures.push('staging crawler disallow missing');
 if(config.enabled!==false || config.turnstileSiteKey!=='')failures.push('staging form unexpectedly enabled');
 if(existsSync(join(out,'sitemap.xml')))failures.push('staging sitemap unexpectedly present');
 if(!html.includes('CONCEPT PREVIEW'))failures.push('staging preview warning missing');
}
if(failures.length){console.error('STAGING GUARD FAILED:\n'+failures.map(s=>'- '+s).join('\n'));process.exit(1);}
console.log('STAGING GUARD PASS: preview has noindex header/meta, disabled form, no sitemap. This does NOT make the preview private; use Cloudflare Access.');
