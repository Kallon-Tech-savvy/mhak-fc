// Cloudflare Pages Function. No persistence. Requires all configured secrets and TURNSTILE validation.
const json = (value,status=200) => new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const clean = (value,max) => typeof value==='string' && value.length<=max ? value.trim() : '';
const emailOk = s => /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(s) && s.length<=254;
const roles = new Set(['player','coach','partner','general']);
const expectedAction = 'mhak_enquiry';
const configureOk = env => env.ENQUIRIES_ENABLED==='true' && env.PRIVACY_NOTICE_APPROVED==='true' && env.RESEND_API_KEY && emailOk(env.MHAK_CONTACT_TO||'') && emailOk(env.MHAK_CONTACT_FROM||'') && env.TURNSTILE_SECRET_KEY && /^https:\/\/[^/]+$/.test(env.PUBLIC_ORIGIN||'');

export async function onRequestPost({request,env}) {
  if (!configureOk(env)) return json({ok:false,message:'Official enquiries are not yet available.'},503);
  if (request.headers.get('Origin')!==env.PUBLIC_ORIGIN || new URL(request.url).origin!==env.PUBLIC_ORIGIN) return json({ok:false,message:'Request not permitted.'},403);
  if (!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json')) return json({ok:false,message:'Expected a JSON enquiry.'},415);
  if (Number(request.headers.get('Content-Length')||0)>8192) return json({ok:false,message:'Enquiry too large.'},413);
  let input;
  try {
    const body = await request.text();
    if (body.length>8192) return json({ok:false,message:'Enquiry too large.'},413);
    input=JSON.parse(body);
    if (!input || Array.isArray(input) || typeof input!=='object') throw Error('bad-json');
  } catch {return json({ok:false,message:'Invalid enquiry.'},400);}

  // Discard honeypot submissions without delivery or disclosure.
  if (input.website) return json({ok:true});
  const role=clean(input.role,20),name=clean(input.name,70),email=clean(input.email,254),message=clean(input.message,1200);
  // Avoid control characters in header-like fields carried into the mail body.
  if (/[\r\n\x00-\x1F\x7F]/.test(name)) return json({ok:false,message:'Please use a single-line name.'},400);
  const token=clean(input.turnstileToken,2048);
  if (!roles.has(role) || name.length<2 || !emailOk(email) || message.length<20 || input.adult!==true || input.consent!==true || !token) {
    return json({ok:false,message:'Check the required fields and consent statements.'},400);
  }

  // Turnstile MUST be validated server-side; an absent/failed check cannot send mail.
  let verification;
  try {
    const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token}),
      signal:AbortSignal.timeout(8000),
    });
    if (!response.ok) throw Error('verification-service');
    verification=await response.json();
  } catch {return json({ok:false,message:'Security check unavailable. Please try again.'},502);}
  const expectedHost=new URL(env.PUBLIC_ORIGIN).hostname;
  if (verification.success!==true || verification.hostname!==expectedHost || verification.action!==expectedAction) return json({ok:false,message:'Security check failed. Please retry.'},403);

  const bodyText=`MHAK FC — ${role.toUpperCase()} enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSender confirmed they are an adult and accepted enquiry-use notice.`;
  // To/From addresses are administrator-controlled env settings, never user input.
  let sent;
  try {
    sent=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:env.MHAK_CONTACT_FROM,to:[env.MHAK_CONTACT_TO],reply_to:email,subject:`MHAK FC enquiry — ${role}`,text:bodyText}),
      signal:AbortSignal.timeout(10000),
    });
  } catch {return json({ok:false,message:'Delivery unavailable. Please try again later.'},502);}
  if (!sent.ok) return json({ok:false,message:'Delivery unavailable. Please try again later.'},502);
  try {
    const receipt = await sent.json();
    if (!receipt || typeof receipt.id !== 'string' || !receipt.id.trim()) throw Error('no-message-id');
  } catch { return json({ok:false,message:'Delivery could not be confirmed. Please try again later.'},502); }
  return json({ok:true},200);
}

export function onRequestGet(){return json({ok:false,message:'Method not allowed.'},405);}
