// Read-only network checks. Does not mutate DNS, inbox, or Cloudflare settings.
import {lookup,resolveCname,resolveMx} from 'node:dns/promises';
const host='mhak.alhajikallon.com';
const domain='alhajikallon.com';
let ok=true;
try{const addresses=await lookup(host,{all:true});console.log('DNS A/AAAA:',addresses.map(a=>a.address).join(', '));}catch(e){console.log('DNS: failed —',e.code||e.message);ok=false;}
try{const cnames=await resolveCname(host);console.log('DNS CNAME:',cnames.join(', '));}catch(e){console.log('CNAME: unavailable or not configured —',e.code||e.message);}
try{const mx=await resolveMx(domain);console.log('Parent-domain MX records:',mx.map(x=>`${x.priority} ${x.exchange}`).join('; '));console.log('This does NOT prove the mhak mailbox exists or accepts messages.');}catch(e){console.log('MX: unavailable —',e.code||e.message);}
try{const r=await fetch(`https://${host}/`,{signal:AbortSignal.timeout(8000),redirect:'follow'});console.log('HTTPS homepage:',r.status,r.url);console.log('Site content type:',r.headers.get('content-type'));if(!r.ok)ok=false;
  const body=await r.text(); console.log('MHAK branding visible:',body.includes('MHAK FC')); if(!body.includes('MHAK FC'))ok=false;
  console.log('Robots header:',r.headers.get('x-robots-tag')||'none');
}catch(e){console.log('HTTPS: unavailable —',e.message);ok=false;}
console.log(ok?'Network verification passed for DNS/HTTPS only. Manual inbox and enquiry checks remain mandatory.':'Network verification incomplete. Do not claim this domain is live.');
if(!ok)process.exitCode=1;
