import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';

const root=resolve(import.meta.dirname,'../public');
const read=path=>readFileSync(resolve(root,path),'utf8');
const home=read('index.html');
const script=read('script.js');
const styles=read('styles.css');
const stories=['stories/why-mhak.html','stories/identity-in-progress.html'];

test('primary journey reveals status before evidence, principles and role pathways',()=>{
 const order=['id="status"','id="story"','id="journal"','id="principles"','id="pathways"','id="participate"'];
 let last=0;
 for(const anchor of order){const i=home.indexOf(anchor);assert.ok(i>last,anchor+' must follow prior section');last=i;}
 assert.match(home,/A club to belong to/i);
 assert.match(home,/No announced trials or player applications/i);
 assert.match(home,/Interested in playing\?/i);
 assert.match(home,/COACHES & VOLUNTEERS/i);
 assert.match(home,/COMMUNITY & PARTNERS/i);
});

test('one visually primary hero CTA and optional detailed club status',()=>{
 const hero=home.split('<section id="top"')[1]?.split('</section>')[0];
 assert.ok(hero,'hero section must exist');
 assert.equal((hero.match(/class="button button-orange"/g)||[]).length,1,'one prominent hero CTA');
 assert.ok(!hero.includes('button button-outline'),'secondary link should not look like equal primary button');
 assert.match(hero,/href="#status">See where we stand/);
 assert.match(hero,/class="hero-secondary-link"/);
 const status=home.split('<section id="status"')[1]?.split('</section>')[0];
 assert.ok(status);
 assert.match(status,/<details class="status-details">/);
 assert.match(status,/<summary>See what is defined and what is still planned/);
 assert.match(status,/No coach, training methodology or recurring programme/);
 assert.ok(!home.includes('class="ticker"'),'no redundant decorative ticker');
});

test('two working story cards lead to real readable pages; no fake third release',()=>{
 for(const p of stories)assert.ok(home.includes('href="'+p+'"'),p+' linked from homepage');
 const journal=home.split('<section id="journal"')[1]?.split('</section>')[0];
 assert.ok(journal);
 assert.equal((journal.match(/class="story-card"/g)||[]).length,2,'only two substantiated founding notes');
 const pages=stories.map(read);
 for(const html of pages){
   assert.match(html,/Working founding note/i);
   assert.match(html,/A public publication date has not been established/i);
   assert.match(html,/content="noindex, nofollow"/);
   assert.ok(html.length>3000,'story has substantive content');
 }
});

test('staging hides unusable enquiry UI and preserves minor guidance',()=>{
 const config=JSON.parse(read('contact-config.json'));
 assert.equal(config.enabled,false);
 assert.equal(config.turnstileSiteKey,'');
 assert.match(home,/<form id="enquiry-form"[^>]*\shidden>/);
 assert.match(home,/<fieldset id="enquiry-fields" disabled>/);
 assert.match(styles,/\.enquiry-form\[hidden\]\{display:none!important\}/);
 assert.match(script,/form\.hidden = false;/);
 assert.ok(script.indexOf('window.turnstile.render(')<script.indexOf('form.hidden = false;'),'reveal only after Turnstile render');
 assert.match(home,/ask a responsible adult/i);
 assert.match(home,/no trial or player registration open yet/i);
 assert.match(home,/mhak@alhajikallon\.com/);
});

test('all relative resources and local anchors resolve',()=>{
 for(const page of ['index.html',...stories]){
   const file=resolve(root,page),html=readFileSync(file,'utf8');
   const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
   assert.equal(new Set(ids).size,ids.length,page+' should not repeat IDs');
   for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
     if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(url))continue;
     const [pathname,frag]=url.split('#');
     const target=pathname?resolve(dirname(file),pathname):file;
     assert.ok(existsSync(target),page+' missing '+url);
     if(frag){
       const targetHtml=readFileSync(target,'utf8');
       assert.ok(targetHtml.includes('id="'+frag+'"'),page+' fragment not found '+url);
     }
   }
 }
});
