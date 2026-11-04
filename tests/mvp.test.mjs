import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';

const root=resolve(import.meta.dirname,'../public');
const read=path=>readFileSync(resolve(root,path),'utf8');
const home=read('index.html');
const stories=['stories/why-mhak.html','stories/identity-in-progress.html'];

test('player-first journey exposes status, progress and contact availability',()=>{
 const order=['id="status"','id="story"','id="journal"','id="principles"','id="pathways"','id="participate"'];
 let last=0;
 for(const anchor of order){const i=home.indexOf(anchor);assert.ok(i>last,anchor+' must follow prior section');last=i;}
 assert.match(home,/No confirmed coach, playing squad or trials/i);
 assert.match(home,/Interested in playing\?/i);
 assert.match(home,/COACHES & VOLUNTEERS/i);
 assert.match(home,/COMMUNITY & PARTNERS/i);
 assert.match(home,/not open/i);
});

test('founding cards lead to full stories without inventing a third milestone',()=>{
 for(const s of stories)assert.ok(home.includes('href="'+s+'"'),s+' must be linked');
 assert.match(home,/Work in progress — no programme or training results/i);
 const pages=stories.map(read);
 for(const html of pages){
   assert.match(html,/Working founding note/i);
   assert.match(html,/A public publication date has not been established/i);
   assert.match(html,/content="noindex, nofollow"/);
   assert.ok(html.length>3000,'story has substantive content');
 }
});

test('preview does not accept enquiries or claim open trials',()=>{
 const cfg=JSON.parse(read('contact-config.json'));
 assert.equal(cfg.enabled,false);
 assert.equal(cfg.turnstileSiteKey,'');
 assert.match(home,/<fieldset id="enquiry-fields" disabled>/);
 assert.match(home,/ask a responsible adult/i);
 assert.match(home,/no announced trials/i);
});

test('all local story and homepage links and fragments resolve',()=>{
 for(const page of ['index.html',...stories]){
   const file=resolve(root,page),html=readFileSync(file,'utf8');
   const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
   assert.equal(new Set(ids).size,ids.length,page+' should not repeat IDs');
   for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
     if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(url))continue;
     const [pathname,frag] = url.split('#');
     const target=pathname?resolve(dirname(file),pathname):file;
     assert.ok(existsSync(target),page+' missing '+url);
     if(frag){
       const targetHtml=readFileSync(target,'utf8');
       assert.ok(targetHtml.includes('id="'+frag+'"'),page+' fragment not found '+url);
     }
   }
 }
});
