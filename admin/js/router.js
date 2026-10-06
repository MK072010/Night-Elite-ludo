window.Router=(()=>{const view=()=>document.getElementById('view');
async function go(){const [r,id]=(location.hash.slice(2).split('?')[0]||'dashboard').split('/'),p=Pages.routes[r]||Pages.routes.dashboard,root=view();
 document.getElementById('ttl').textContent=p.title;document.title=p.title+' — Night Elite Admin';
 document.querySelectorAll('#sb a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+(Pages.routes[r]?r:'dashboard')));
 document.getElementById('sb').classList.remove('open');document.getElementById('scrim').classList.remove('on');
 if(!Permissions.can(p.mod,'view')){root.innerHTML=UI.empty('You do not have access to this section.');return}
 root.innerHTML='';try{await p.render(root,id)}catch(e){root.innerHTML='';root.appendChild(UI.errorBox(e.message||'Page error'))}root.focus({preventScroll:true})}
return{go}})();
window.addEventListener('hashchange',()=>window.Router.go());
