Pages.data('users',{res:'users',title:'Users',mod:'users',sub:'Server-side paginated. Actions are permission-aware hints; backend enforces.',dates:true,
 filters:[{k:'kyc',l:'KYC',o:['Pending','Approved','Rejected','Not submitted']},{k:'status',l:'Account',o:['Active','Locked']}],
 cols:[{k:'name',l:'User',r:r=>`<a href="#/user/${r.id}"><b>${UI.esc(r.name)}</b></a>`},{k:'id',l:'User ID'},{k:'mobile',l:'Mobile'},{k:'email',l:'Email'},{k:'kyc',l:'KYC Status',b:1},{k:'wallet',l:'Wallet Status',b:1},{k:'status',l:'Account Status',b:1},{k:'joined',l:'Joined'}],
 detail:r=>location.hash='#/user/'+r.id,
 actions:r=>[{label:'Open Profile',run:()=>location.hash='#/user/'+r.id},{label:'KYC',run:()=>location.hash='#/kyc?q='+r.name},{label:'Wallet',run:()=>location.hash='#/wallet?q='+r.name},{label:'Transactions',run:()=>location.hash='#/wallet?q='+r.name},
  r.status==='Locked'?{label:'Unlock User',perm:'edit',confirm:'Unlock '+r.name+'?',run:()=>Api.action('user.unlock',{id:r.id})}:{label:'Lock User',perm:'edit',danger:1,confirm:'Lock '+r.name+'? They will be unable to play.',run:()=>Api.action('user.lock',{id:r.id})}]});
Pages.add('user',{title:'User Detail',mod:'users',async render(root,id){
 root.innerHTML=`<div class="ph"><div><h2>User ${UI.esc(id)}</h2><p><a href="#/users">← All users</a></p></div></div><div id="b">${UI.skeleton(5)}</div>`;
 const u=await Api.get('user',id),b=root.querySelector('#b');
 const T=[['profile','Profile'],['kyc','KYC'],['wallet','Wallet'],['tx','Transactions'],['games','Games'],['refs','Referrals'],['sessions','Login Sessions'],['support','Support Tickets'],['audit','Audit History']];const map={kyc:'kyc',tx:'wallet',games:'rooms',refs:'referrals',sessions:'sessions',support:'support',audit:'audit'};
 b.innerHTML='<div class="card"><div id="tt"></div><div id="tc"></div></div>';const tc=b.querySelector('#tc');
 const show=k=>{if(k==='profile')tc.innerHTML=UI.kv({Name:u.name,Mobile:u.mobile,Email:u.email,'User ID':u.id,'Created':u.joined,'Last active':'—','Account status':UI.html(UI.badge(u.status)),'KYC status':UI.html(UI.badge(u.kyc))});
  else if(k==='wallet')tc.innerHTML=UI.kv({Status:UI.html(UI.badge(u.wallet)),'Available':'—','Ledger':'—','Frozen':'—'})+'<p class="hint">Balances load from the server wallet ledger.</p>';
  else{tc.innerHTML='<div></div>';if(k==='sessions')Pages.cfg.sessions||(Pages.cfg.sessions={cols:[{k:'device',l:'Device'},{k:'ip',l:'IP'},{k:'last',l:'Last seen'},{k:'status',l:'Status',b:1}]});Pages.mini(map[k],tc.firstChild)}};
 b.querySelector('#tt').appendChild(UI.tabs(T.map(x=>({k:x[0],label:x[1]})),'profile',show));show('profile');
 const a=document.createElement('div');a.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:14px';
 [['edit','Lock User','user.lock',1],['edit','Unlock User','user.unlock']].forEach(([p,l,n,d])=>{const x=document.createElement('button');x.className='btn'+(d?' d':'');x.textContent=l;x.disabled=!Permissions.can('users',p);x.onclick=async()=>{if(await UI.confirm({title:l,msg:l+' '+u.name+'?',danger:d,label:l}))try{await Api.action(n,{id:u.id})}catch(e){UI.toast(e.message,'er')}};a.appendChild(x)});b.appendChild(a)}});
