import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'qa', 'offline_usability_lab.html'), 'utf8');
const match = (re, name) => assert.match(html, re, name);

test('study is an offline standalone facilitator file, separate from public output', () => {
  match(/<title>MHAK FC — Offline first-click usability lab<\/title>/, 'research title');
  match(/Content-Security-Policy[^>]*default-src 'none'/, 'explicit offline policy');
  match(/connect-src 'none'/, 'network disabled by policy');
  assert.doesNotMatch(html, /<script\s+src\s*=|<link\s+[^>]*href\s*=\s*["']https?:/i);
  assert.doesNotMatch(html, /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\s*\(/);
  match(/No accounts, no analytics, no automatic storage/, 'plain-language privacy disclosure');
});

test('tasks are neutral about recruitment and preserve independent first click', () => {
  for (const id of ['participant','audience','task-heading','task-prompt','completion','confusion','severity','evidence','save','export-json','export-csv']) {
    assert.ok(html.includes('id="' + id + '"'), 'missing control ' + id);
  }
  assert.equal([...html.matchAll(/\{title:'/g)].length, 5, 'exactly five short tasks');
  match(/Do not suggest that recruitment or trials are open or closed/, 'unbiased moderator cue');
  match(/You may stop at any time|Obtain permission to observe/, 'respectful participation guidance');
});

test('export and session lifecycle are explicit and no data is fabricated', () => {
  match(/saved\.push\(/, 'explicit manual save');
  match(/saved = \[\]/, 'empty session record collection');
  match(/Export JSON/, 'manual JSON download');
  match(/Export CSV/, 'manual CSV download');
  match(/URL\.createObjectURL/, 'local-only export');
  match(/safe=\/\^\[=\+@\\-\\t\\r\]\//, 'CSV formula mitigation');
  match(/No saved sessions yet/, 'empty export handled');
  match(/Do not tell participants that there are no trials before the task/, 'research non-leading guidance');
});
