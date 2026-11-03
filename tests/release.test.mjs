import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync,mkdtempSync,mkdirSync,cpSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
test('staging build succeeds and keeps form closed',()=>{
  const result=spawnSync(process.execPath,['scripts/build.mjs','staging'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const path=join(root,'release','staging');
  assert.ok(readFileSync(join(path,'index.html'),'utf8').includes('noindex, nofollow'));
  assert.ok(readFileSync(join(path,'_headers'),'utf8').includes('X-Robots-Tag: noindex, nofollow, noarchive'));
  assert.deepEqual(JSON.parse(readFileSync(join(path,'contact-config.json'),'utf8')),{enabled:false,turnstileSiteKey:''});
  assert.ok(!existsSync(join(path,'functions')));
});
test('public and enquiry builds cannot activate without evidence',()=>{
  for (const mode of ['public','enquiries']){
    const result=spawnSync(process.execPath,['scripts/build.mjs',mode],{cwd:root,encoding:'utf8'});
    assert.notEqual(result.status,0,'Unexpected '+mode+' release without approval evidence');
  }
});

test('public release builder changes SEO only after approved evidence (synthetic fixture)',()=>{
  const temp=mkdtempSync(join(tmpdir(),'mhak-release-check-'));
  try{
    mkdirSync(join(temp,'scripts'),{recursive:true});
    cpSync(join(root,'scripts','build.mjs'),join(temp,'scripts','build.mjs'));
    cpSync(join(root,'public'),join(temp,'public'),{recursive:true});
    writeFileSync(join(temp,'package.json'),JSON.stringify({type:'module'}));
    const evidence=JSON.parse(readFileSync(join(root,'launch-evidence.example.json'),'utf8'));
    for (const key of Object.keys(evidence.checks)) evidence.checks[key]=true;
    writeFileSync(join(temp,'launch-evidence.json'),JSON.stringify(evidence));
    // Fixture only, not real approval or legal advice.
    writeFileSync(join(temp,'approved-privacy.html'),'<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>Privacy</title></head><body><h1>Privacy</h1><p>Contact mhak@alhajikallon.com.</p><p>'+ 'Test-only placeholder. '.repeat(60) +'</p></body></html>');
    let r=spawnSync(process.execPath,['scripts/build.mjs','public'],{cwd:temp,encoding:'utf8'});
    assert.equal(r.status,0,r.stderr);
    const output=join(temp,'release','public');
    const html=readFileSync(join(output,'index.html'),'utf8');
    assert.ok(html.includes('href="https://mhak.alhajikallon.com/"'));
    assert.ok(!html.includes('content="noindex, nofollow"'));
    assert.ok(!html.includes('CONCEPT PREVIEW'));
    assert.ok(readFileSync(join(output,'robots.txt'),'utf8').includes('Sitemap: https://mhak.alhajikallon.com/sitemap.xml'));
    assert.equal(JSON.parse(readFileSync(join(output,'contact-config.json'),'utf8')).enabled,false);
    assert.ok(!readFileSync(join(output,'_headers'),'utf8').includes('X-Robots-Tag: noindex'));
    r=spawnSync(process.execPath,['scripts/build.mjs','enquiries'],{cwd:temp,encoding:'utf8',env:{...process.env,MHAK_TURNSTILE_SITE_KEY:'public_example_key_1234'}});
    assert.equal(r.status,0,r.stderr);
    assert.equal(JSON.parse(readFileSync(join(temp,'release','enquiries','contact-config.json'),'utf8')).enabled,true);
  } finally {rmSync(temp,{recursive:true,force:true});}
});
