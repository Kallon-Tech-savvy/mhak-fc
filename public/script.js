(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navlinks');
  if (!toggle || !nav) return;
  const close = (restoreFocus = false) => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) close(true);
  });
  document.addEventListener('pointerdown', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', () => close());
})();


// v1.2: form is strictly disabled by default. Enable only with approved contact and working server-side verification.
(async () => {
  const form = document.getElementById('enquiry-form');
  const fields = document.getElementById('enquiry-fields');
  const availability = document.getElementById('enquiry-availability');
  const feedback = document.getElementById('enquiry-response');
  const submit = document.getElementById('enquiry-submit');
  if (!form || !fields || !availability || !feedback || !submit) return;
  let config;
  try {
    const response = await fetch('./contact-config.json', {cache:'no-store'});
    if (!response.ok) return;
    config = await response.json();
  } catch {return;}
  if (config?.enabled !== true || !/^[A-Za-z0-9_-]{8,}$/.test(config.turnstileSiteKey || '')) return;
  // Fail closed when the Turnstile script cannot load.
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (!window.turnstile?.render) return;
    try {
      window.turnstile.render('#turnstile-slot', {sitekey:config.turnstileSiteKey,action:'mhak_enquiry'});
      fields.disabled = false;
      form.hidden = false;
      availability.textContent = 'Adult enquiries are open. This is not a player registration or a promise of trials. Please share only what is needed for an initial conversation.';
    } catch { /* keep disabled */ }
  };
  document.head.append(script);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (fields.disabled) return;
    feedback.textContent = '';
    feedback.classList.remove('form-error');
    if (!form.reportValidity()) return;
    const token = window.turnstile?.getResponse?.();
    if (!token) { feedback.textContent = 'Complete the security check before sending.'; return; }
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { role:data.role,name:data.name,email:data.email,message:data.message,website:data.website||'',adult:data.adult==='on',consent:data.consent==='on',turnstileToken:token };
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const response = await fetch('./api/enquiry', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'same-origin'});
      const result = await response.json().catch(()=>({}));
      if (!response.ok || result.ok !== true) throw new Error(result.message || 'The enquiry could not be delivered. Please try again later.');
      form.reset();
      feedback.textContent = 'Enquiry received by the delivery service. MHAK has not promised a response time.';
    } catch(error) {
      feedback.textContent = error.message || 'Unable to send your enquiry.';
      feedback.classList.add('form-error');
    } finally {
      window.turnstile?.reset?.();
      submit.disabled = false;
      submit.textContent = 'Send enquiry ↗';
    }
  });
})();
