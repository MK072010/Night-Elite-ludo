const NAV=[['',[['dashboard','Dashboard','dash']]],['People',[['users','Users','users'],['kyc','KYC','kyc']]],['Money',[['wallet','Wallet','wallet'],['payments','Payments','card'],['withdrawals','Withdrawals','out']]],['Games',[['rooms','Game Rooms','dice'],['results','Game Results','trophy']]],['Growth',[['referrals','Referrals','gift'],['agents','Agents','agent']]],['Communication',[['announcements','Announcements','mega'],['notifications','Notifications','bell'],['support','Support','help']]],['Administration',[['admins','Admins & Permissions','shield'],['game-settings','Game Settings','tune'],['settings','System Settings','gear'],['audit','Audit Logs','log']]]];
const MOD={rooms:'games',results:'games','game-settings':'settings'};
(async()=>{if(!await Auth.init()){location.replace('login.html');return}
 const a=State.admin;document.getElementById('wn').textContent=a.name;document.getElementById('wr').textContent=a.role;document.getElementById('av').textContent=(a.name||'A')[0].toUpperCase();
 document.getElementById('menu').innerHTML=UI.icon('menu');document.getElementById('bell').innerHTML=UI.icon('bell');
 document.getElementById('sb').innerHTML='<div class="logo"><img src="assets/logo-h.png" alt="Night Elite Ludo"></div><nav>'+NAV.map(([g,it])=>(g?`<h6>${g}</h6>`:'')+it.filter(i=>Permissions.can(MOD[i[0]]||i[0],'view')).map(i=>`<a href="#/${i[0]}">${UI.icon(i[2])}<span>${i[1]}</span></a>`).join('')).join('')+'</nav><button class="lo" id="lo" style="margin-top:14px">'+UI.icon('out2')+'<span>Logout</span></button>';
 if(State.preview)document.getElementById('banner').innerHTML='<div class="pv">⚠ UI PREVIEW — mock data only, no backend connected. Nothing is saved or executed.</div>';
 const sb=document.getElementById('sb'),sc=document.getElementById('scrim');document.getElementById('menu').onclick=()=>{sb.classList.add('open');sc.classList.add('on')};sc.onclick=()=>{sb.classList.remove('open');sc.classList.remove('on')};
 document.getElementById('lo').onclick=document.getElementById('lo2').onclick=()=>Auth.logout();
 document.getElementById('gs').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim())location.hash='#/users?q='+encodeURIComponent(e.target.value.trim())};
 /* alias legacy module for permissions of routes */ ['rooms','results'].forEach(r=>Pages.routes[r].mod='games');
 Router.go()})();
