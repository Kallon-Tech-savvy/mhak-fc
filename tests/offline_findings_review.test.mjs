import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const path=resolve(root,'qa/offline_findings_review.html');
const html=readFileSync(path,'utf8');

test('standalone findings review is outside deployable website',()=>{
  assert.ok(existsSync(path));
  assert.ok(!existsSync(resolve(root,'public/offline_findings_review.html')));
  assert.match(html,/Content-Security-Policy[^>]*default-src 'none'/);
  assert.match(html,/connect-src 'none'/);
  assert.doesNotMatch(html,/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\s*\(/);
  assert.doesNotMatch(html,/<script\s+src=|<link[^>]*href=["']https?:/i);
});

test('a private facilitator can import, review, clear and export local findings',()=>{
  for(const id of ['input-files','analyse','clear','results','sessions','assessed','flags','tasks','triage','export','status']) {
    assert.ok(html.includes('id="'+id+'"'),'missing interaction: '+id);
  }
  assert.match(html,/file\.text\(\)/);
  assert.match(html,/URL\.createObjectURL/);
  assert.match(html,/No raw notes, names, emails or phone numbers/);
  assert.match(html,/Duplicate participant/);
  assert.match(html,/schemaVersion===1/);
  assert.match(html,/This tool does not grant approval/);
});

test('trial misconceptions trigger explicit stop signal and raw notes never appear in memo',()=>{
  assert.match(html,/const safety=data\.tasks\.some\(t=>t\.misconception\|\|t\.blocking\|\|t\.blocked\)/);
  assert.match(html,/Do not declare this MVP accepted/);
  assert.doesNotMatch(html,/\+t\.evidence\+|esc\(t\.evidence\)/);
});
