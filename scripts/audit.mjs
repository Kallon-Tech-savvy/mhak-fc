import {readFileSync, existsSync, statSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const source=join(root,'public');
const required=['index.html','privacy.html','styles.css','script.js','contact-config.json','robots.txt','_headers','assets/mhak-mark-black.svg','assets/mhak-mark-white.svg','assets/share-preview.png'];
let failed=false;
const check=(condition,message)=>{console.log((condition?'PASS':'FAIL')+' '+message);if(!condition) failed=true;};
for(const name of required) check(existsSync(join(source,name)),'public/'+name+' exists');
const html=readFileSync(join(source,'index.html'),'utf8');
const privacy=readFileSync(join(source,'privacy.html'),'utf8');
const config=JSON.parse(readFileSync(join(source,'contact-config.json'),'utf8'));
const robots=readFileSync(join(source,'robots.txt'),'utf8');
check(html.includes('name="robots" content="noindex, nofollow"'),'source preview carries noindex');
check(robots.includes('Disallow: /'),'source preview has crawler disallow');
check(config.enabled===false && config.turnstileSiteKey==='','source enquiry form cannot activate');
check(/NOT APPROVED|DRAFT NOTICE/i.test(privacy),'draft privacy notice is clearly labelled');
check(html.includes('mhak@alhajikallon.com'),'selected mailbox appears in site content');
check(/#17283C/i.test(readFileSync(join(source,'styles.css'),'utf8')),'obsidian palette exists');
check(!existsSync(join(source,'functions')),'private functions are not in static output');
check(!existsSync(join(source,'.env')),'no .env file in static output');
// Basic local links: make sure local relative resources exist.
const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const ref of refs){if(ref.startsWith('#')||ref.startsWith('mailto:')||ref.startsWith('http'))continue;
  const [file,fragment]=ref.split('#');
  if(file)check(existsSync(join(source,file)),'local reference '+ref+' resolves');
  if(!file && fragment)check(html.includes(`id="${fragment}"`),'fragment '+fragment+' resolves');
}
if(failed){process.exitCode=1;console.error('AUDIT FAILED');} else console.log('AUDIT PASS — only local staging guarantees; production and real-world delivery remain unverified.');
