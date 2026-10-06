/* Reusable data page: tabs, filters, date range, table (cards on mobile), cursor/offset pagination, states, row actions */
window.Pages={routes:{},cfg:{},add(r,p){this.routes[r]=p},
data(r,cfg){this.cfg[cfg.res]=cfg;this.add(r,{title:cfg.title,mod:cfg.mod,render:root=>dataPage(cfg,root)})}};
function cell(c,row){const v=c.r?c.r(row):c.b?UI.badge(row[c.k]):UI.esc(row[c.k]);return v}
function tableHtml(cols,rows,actions){return `<div class="tw"><table><thead><tr>${cols.map(c=>`<th>${UI.esc(c.l)}</th>`).join('')}${actions?'<th></th>':''}</tr></thead><tbody>${rows.map((r,i)=>`<tr>${cols.map(c=>`<td data-l="${UI.esc(c.l)}">${cell(c,r)}</td>`).join('')}${actions?`<td class="ac" data-i="${i}"></td>`:''}</tr>`).join('')}</tbody></table></div>`}
function mini(res,root,n=5){const c=Pages.cfg[res];root.innerHTML=UI.skeleton(3);Api.list(res,{page:0,limit:n}).then(r=>{root.innerHTML=r.rows.length?tableHtml(c.cols,r.rows):UI.empty()}).catch(e=>{root.innerHTML='';root.appendChild(UI.errorBox(e.message))})}
Pages.mini=mini;
function dataPage(cfg,root){const st={tab:cfg.tabs?cfg.tabs[0].k:'all',q:'',f:{},page:0,limit:10};
 root.innerHTML=`<div class="ph"><div><h2>${UI.esc(cfg.title)}</h2>${cfg.sub?`<p>${UI.esc(cfg.sub)}</p>`:''}</div><div id="hb"></div></div>${cfg.top?'<div id="top"></div>':''}<div id="tb"></div><div id="tbl"></div><div class="pgr" id="pg"></div>`;
 if(cfg.top)cfg.top(root.querySelector('#top'));
 if(cfg.create&&Permissions.can(cfg.mod,'create')){const b=document.createElement('button');b.className='btn p';b.textContent=cfg.create.label;b.onclick=()=>cfg.create.open();root.querySelector('#hb').appendChild(b)}
 if(cfg.tabs)root.insertBefore(UI.tabs(cfg.tabs,st.tab,k=>{st.tab=k;st.page=0;load()}),root.querySelector('#tb'));
 const tb=root.querySelector('#tb');tb.className='tb';
 if(cfg.search!==false){const s=document.createElement('input');s.type='search';s.placeholder='Search…';s.setAttribute('aria-label','Search');let t;s.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{st.q=s.value.trim();st.page=0;load()},350)};if(location.hash.includes('q=')){s.value=st.q=decodeURIComponent(location.hash.split('q=')[1])}tb.appendChild(s)}
 (cfg.filters||[]).forEach(fl=>{const s=document.createElement('select');s.setAttribute('aria-label',fl.l);s.innerHTML=`<option value="">${UI.esc(fl.l)}: All</option>`+fl.o.map(o=>`<option>${UI.esc(o)}</option>`).join('');s.onchange=()=>{st.f[fl.k]=s.value;st.page=0;load()};tb.appendChild(s)});
 if(cfg.dates)['from','to'].forEach(k=>{const d=document.createElement('input');d.type='date';d.setAttribute('aria-label',k==='from'?'From date':'To date');d.onchange=()=>{st.f[k]=d.value;st.page=0;load()};tb.appendChild(d)});
 const tbl=root.querySelector('#tbl'),pg=root.querySelector('#pg');
 async function load(){tbl.innerHTML=UI.skeleton();pg.innerHTML='';
  try{const r=await Api.list(cfg.res,{tab:st.tab,tabField:(cfg.tabs&&cfg.tabs.find(t=>t.k===st.tab)||{}).field||cfg.tabField,q:st.q,f:st.f,page:st.page,limit:st.limit});
   if(!r.rows.length){tbl.innerHTML=UI.empty(cfg.emptyMsg||'No records match your filters.');return}
   const acts=cfg.actions;tbl.innerHTML=tableHtml(cfg.cols,r.rows,true);
   tbl.querySelectorAll('td.ac').forEach(td=>{const row=r.rows[td.dataset.i];const v=document.createElement('button');v.className='btn s';v.textContent='View';v.onclick=()=>cfg.detail(row);td.appendChild(v);
    const list=(acts?acts(row):[]).filter(a=>!a.perm||Permissions.can(cfg.mod,a.perm));if(list.length){const d=document.createElement('details');d.className='dd';d.innerHTML='<summary class="btn s" style="list-style:none">⋯</summary><div class="pop"></div>';list.forEach(a=>{const b=document.createElement('button');b.textContent=a.label;if(a.danger)b.className='dg';b.onclick=async()=>{d.open=false;if(a.confirm&&!await UI.confirm({title:a.label,msg:a.confirm,danger:a.danger,label:a.label}))return;try{await a.run(row);}catch(e){UI.toast(e.message||'Action failed','er')}};d.querySelector('.pop').appendChild(b)});td.appendChild(d)}});
   pg.innerHTML=`<span>Page ${st.page+1}${r.total!=null?` · ${r.total} result${r.total==1?'':'s'}`:''}</span><div><select aria-label="Rows per page">${[10,25,50].map(n=>`<option ${n==st.limit?'selected':''}>${n}</option>`).join('')}</select><button class="btn s" ${st.page?'':'disabled'} data-p="-1">← Prev</button><button class="btn s" ${r.hasMore?'':'disabled'} data-p="1">Next →</button></div>`;
   pg.querySelector('select').onchange=e=>{st.limit=+e.target.value;st.page=0;load()};pg.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{st.page+=+b.dataset.p;load()})}
  catch(e){tbl.innerHTML='';tbl.appendChild(UI.errorBox(e.message||'Failed to load.',load))}}
 load()}
