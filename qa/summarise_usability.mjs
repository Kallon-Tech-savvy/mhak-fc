// MHAK FC MVP 06 — local study export synthesis; no network or stored participant data.
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const TASKS = ['First impression','Find the current position','Find the founding story','Consider playing','Make an informed decision'];
const OUTCOMES = new Set(['not-tested','independent','assisted','blocked']);
const SEVERITIES = new Set(['none','minor','major','blocking']);
const CONFUSIONS = new Set(['unknown','no','yes']);
const AUDIENCES = new Set(['player','coach','partner','other']);
const assertValid=(condition,message)=>{if(!condition)throw Error(message);};
const count=(arr,key,value)=>arr.filter(x=>x[key]===value).length;

export function parseStudy(doc,source='input'){
  assertValid(doc && typeof doc==='object' && !Array.isArray(doc),source+': expected JSON object');
  assertValid(doc.study==='MHAK FC offline first-click pilot' && doc.schemaVersion===1,source+': unexpected study or schema version');
  assertValid(Array.isArray(doc.sessions) && doc.sessions.length<=100,source+': sessions must be an array of at most 100');
  return doc.sessions.map((session,i)=>{
    const origin=source+' session '+(i+1);
    assertValid(session && typeof session==='object' && /^[A-Za-z0-9_-]{1,12}$/.test(session.participant||''),origin+': invalid anonymous code');
    assertValid(AUDIENCES.has(session.audience),origin+': invalid audience');
    assertValid(Array.isArray(session.tasks)&&session.tasks.length===5,origin+': expected five task observations');
    const tasks=session.tasks.map((t,j)=>{
      assertValid(t && t.task===j+1 && t.title===TASKS[j],origin+': task sequence or title mismatch');
      assertValid(OUTCOMES.has(t.completion),origin+': invalid completion');
      assertValid(SEVERITIES.has(t.severity),origin+': invalid severity');
      assertValid(CONFUSIONS.has(t.confusion),origin+': invalid misconception flag');
      assertValid(typeof t.evidence==='string' && t.evidence.length<=500,origin+': invalid evidence field');
      return {task:j+1,completion:t.completion,confusion:t.confusion,severity:t.severity,hasNote:!!t.evidence.trim()};
    });
    return {participant:session.participant,audience:session.audience,tasks};
  });
}

export function analyze(studies){
  assertValid(Array.isArray(studies),'Provide parsed study arrays');
  const sessions=studies.flat();
  const ids=new Set();
  for(const s of sessions){
    assertValid(!ids.has(s.participant),'Duplicate anonymous code '+s.participant+'. Use unique participant codes across exports.');
    ids.add(s.participant);
  }
  const tasks=TASKS.map((title,index)=>{
    const observations=sessions.map(s=>({...s.tasks[index],participant:s.participant}));
    const tested=observations.filter(t=>t.completion!=='not-tested');
    const serious=observations.filter(t=>t.severity==='blocking'||t.severity==='major');
    const misconception=observations.filter(t=>t.confusion==='yes');
    const blocking=count(observations,'severity','blocking');
    const major=count(observations,'severity','major');
    const blocked=count(tested,'completion','blocked');
    const assisted=count(tested,'completion','assisted');
    return {
      task:index+1,title,tested:tested.length,independent:count(tested,'completion','independent'),
      assisted,blocked,major,blocking,misconception:misconception.length,
      notAssessed:count(observations,'confusion','unknown'),
      missingEvidence:serious.filter(t=>!t.hasNote).length,
      affected:[...new Set([...serious,...misconception,...tested.filter(t=>t.completion==='blocked')].map(t=>t.participant))],
      priority:misconception.length*1000+blocking*100+blocked*50+major*10+assisted
    };
  });
  return {
    participants:sessions.length,
    audiences:Object.fromEntries([...AUDIENCES].map(a=>[a,sessions.filter(s=>s.audience===a).length])),
    totalEvaluated:tasks.reduce((sum,t)=>sum+t.tested,0),
    tasks,issues:tasks.filter(t=>t.priority>0).sort((a,b)=>b.priority-a.priority||a.task-b.task)
  };
}

export function report(result){
  const lines=[
    '# MHAK FC — Anonymous MVP usability evidence summary','',
    '> **Qualitative researcher-coded observations, not verified participant identities.** This report does not establish player demand, recruitment interest or product acceptance.','',
    '## Scope','',
    'Anonymous sessions imported: **'+result.participants+'**  ',
    'Tasks assessed: **'+result.totalEvaluated+' of '+result.participants*5+'**  ',
    'Audience codes: '+(Object.entries(result.audiences).filter(([,v])=>v).map(([k,v])=>k+': '+v).join(', ')||'No sessions'), '',
    '## Observed task outcomes','',
    '| Task | Assessed | Independent | Assisted | Blocked | Major | Blocking | Believed trials/squad open |',
    '|---|---:|---:|---:|---:|---:|---:|---:|',
    ...result.tasks.map(t=>'| '+t.task+'. '+t.title+' | '+t.tested+' | '+t.independent+' | '+t.assisted+' | '+t.blocked+' | '+t.major+' | '+t.blocking+' | '+t.misconception+' |'),'',
    '## Triage queue',''
  ];
  if(!result.participants) lines.push('No sessions imported. There is no participant evidence yet.');
  else if(!result.issues.length) lines.push('No blocking, major, assisted or mistaken-trial findings were flagged. This is not a pass: confirm that tasks were genuinely assessed and that notes were accurately coded.');
  else for(const t of result.issues){
    lines.push('### Task '+t.task+' — '+t.title);
    lines.push('- Flagged: '+t.misconception+' mistaken-trial/squad assumption(s); '+t.blocking+' blocking issue(s); '+t.major+' major issue(s); '+t.blocked+' blocked task(s); '+t.assisted+' assisted task(s).');
    lines.push('- Anonymous participants to review: '+(t.affected.join(', ')||'Review the original export')+'.');
    if(t.missingEvidence)lines.push('- Evidence gap: '+t.missingEvidence+' serious finding(s) without a note. Capture the observed behaviour before selecting a fix.');
    lines.push('- Decision: review the original observations locally, reproduce the confusion, fix the smallest relevant issue, then retest with fresh participants.','');
  }
  lines.push('## Human acceptance gate','',
    '- Any mistaken belief that trials or squad places are open blocks MVP acceptance until understood and corrected.',
    '- Reproduce blocked tasks and review severe findings; an automated score is not a product decision.',
    '- No raw quotes are included here. Review the original anonymous files locally; never publish identifying notes.',
    '- A small qualitative sample cannot establish population demand or statistical significance.',
    '- The user study, safeguarding, live enquiry and public launch gates remain separate.',
    '', '**Status: '+(result.participants?'Human review required; not approved.':'No participant evidence; not approved.')+'**','');
  return lines.join('\n');
}

function main(){
  const args=process.argv.slice(2);
  if(args.includes('--help')||args.includes('-h')){
    console.log('Usage: node qa/summarise_usability.mjs study1.json [study2.json ...] [--output local-report.md]\nReads MVP 05 JSON exports and prints or locally saves an anonymised synthesis. No network.');
    return;
  }
  const outputAt=args.indexOf('--output');
  let output;
  if(outputAt>=0){
    assertValid(args[outputAt+1]&&!args[outputAt+1].startsWith('--'),'--output requires a report path');
    output=args.splice(outputAt,2)[1];
  }
  assertValid(args.length>0,'Supply one or more MVP 05 JSON exports. Use --help for instructions.');
  const studies=args.map(path=>{
    assertValid(path.toLowerCase().endsWith('.json'),'Expected a JSON export: '+path);
    let data;
    try{data=JSON.parse(readFileSync(resolve(path),'utf8'))}catch(err){throw Error(path+': '+err.message);}
    return parseStudy(data,path);
  });
  const markdown=report(analyze(studies));
  if(output){writeFileSync(resolve(output),markdown,'utf8');console.log('Local report created: '+resolve(output));}
  else process.stdout.write(markdown);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{main()}catch(error){console.error('MHAK SUMMARY ERROR: '+error.message);process.exitCode=1;}
}
