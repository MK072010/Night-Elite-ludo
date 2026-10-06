(()=>{const $=i=>document.getElementById(i),al=$('al');const show=(t,m)=>al.innerHTML=m?`<div class="al ${t}">${UI.esc(m)}</div>`:'';
$('pv').innerHTML=Auth.configured()?'':'Backend not configured yet. <a href="#" id="prev">Open UI preview (mock data, dev only)</a>';
if(!Auth.configured())show('in','Supabase is not configured. Add the project URL and anon key in js/config.js to enable sign-in.');
$('prev')&&($('prev').onclick=e=>{e.preventDefault();sessionStorage.setItem('nel-preview','1');location.href='index.html#/dashboard'});
$('f').onsubmit=async e=>{e.preventDefault();const em=$('em').value.trim(),pw=$('pw').value;if(!em||!pw)return show('er','Enter your email and password.');
 const b=$('go');b.disabled=true;b.textContent='Signing in…';show('in','Verifying…');
 try{await Auth.login(em,pw,$('rm').checked);show('ok','Signed in. Redirecting…');location.href='index.html'}catch(x){show('er',x.message||'Sign-in failed.');b.disabled=false;b.textContent='Sign in'}};
$('fg').onclick=async()=>{const em=$('em').value.trim();if(!em)return show('er','Enter your email first.');try{await Auth.forgot(em);show('ok','If the account exists, a reset link has been sent.')}catch(x){show('er',x.message)}}})();
