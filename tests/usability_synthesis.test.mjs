import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {TASKS,parseStudy,analyze,report} from '../qa/summarise_usability.mjs';

const study = (participant, taskOverrides={}) => ({
  study:'MHAK FC offline first-click pilot',schemaVersion:1,
  notes:'Anonymous observations; qualitative sample only',
  sessions:[{
    participant,audience:'player',
    tasks:TASKS.map((title,i)=>({
      task:i+1,title,completion:'independent',confusion:'no',severity:'none',evidence:'',
      ...(taskOverrides[i+1]||{})
    }))
  }]
});

test('reader validates five ordered task records and exports correct count',()=>{
  const sessions=parseStudy(study('P01'),'fixture');
  assert.equal(sessions.length,1);
  const outcome=analyze([sessions]);
  assert.equal(outcome.participants,1);
  assert.equal(outcome.totalEvaluated,5);
  assert.equal(outcome.tasks[0].independent,1);
  assert.equal(outcome.issues.length,0);
});

test('misconception is highest-priority alert even if manually coded as minor',()=>{
  const a=parseStudy(study('P01',{4:{confusion:'yes',severity:'minor',completion:'independent',evidence:'Tried to look for trials'}}));
  const b=parseStudy(study('P02',{3:{completion:'blocked',severity:'major',evidence:'Could not open story'}}));
  const findings=analyze([a,b]);
  assert.equal(findings.participants,2);
  assert.equal(findings.issues[0].task,4);
  assert.equal(findings.tasks[3].misconception,1);
  assert.equal(findings.tasks[2].blocked,1);
});

test('exports do not repeat raw notes, even if the input contains contact details',()=>{
  const unsafe='Contact me at private.person@example.com on 076123456.';
  const sessions=parseStudy(study('P01',{2:{completion:'blocked',severity:'blocking',evidence:unsafe}}));
  const output=report(analyze([sessions]));
  assert.match(output,/Task 2/);
  assert.match(output,/Human acceptance gate/);
  assert.doesNotMatch(output,/private\.person@example\.com|076123456/);
  assert.match(output,/No raw quotes/);
});

test('duplicate participants across files and invalid data fail before any report is produced',()=>{
  const s=parseStudy(study('P01'));
  assert.throws(()=>analyze([s,s]),/Duplicate anonymous code/);
  assert.throws(()=>parseStudy({...study('P01'),schemaVersion:2}),/schema version/);
  assert.throws(()=>parseStudy(study('P01',{1:{completion:'made-up'}})),/invalid completion/);
  assert.throws(()=>parseStudy(study('P01',{1:{evidence:'a'.repeat(501)}})),/invalid evidence/);
  assert.throws(()=>parseStudy(study('Bad Name')),/anonymous code/);
});

test('CLI performs local offline synthesis and fails closed for unrelated JSON',()=>{
  const dir=mkdtempSync(join(tmpdir(),'mhak-study-test-'));
  try {
    const input=join(dir,'pilot.json'), output=join(dir,'memo.md');
    writeFileSync(input,JSON.stringify(study('P01',{4:{confusion:'yes',severity:'major',evidence:'Assumed squad is established'}})));
    const result=spawnSync(process.execPath,['qa/summarise_usability.mjs',input,'--output',output],{cwd:resolve(import.meta.dirname,'..'),encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    const memo=readFileSync(output,'utf8');
    assert.match(memo,/Task 4/);
    assert.match(memo,/mistaken-trial/);
    writeFileSync(input,JSON.stringify({sessions:[]}));
    const rejected=spawnSync(process.execPath,['qa/summarise_usability.mjs',input],{cwd:resolve(import.meta.dirname,'..'),encoding:'utf8'});
    assert.notEqual(rejected.status,0);
    assert.match(rejected.stderr,/unexpected study or schema version/);
  }finally {rmSync(dir,{recursive:true,force:true});}
});
