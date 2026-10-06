Pages.data('referrals',{res:'referrals',title:'Referrals',mod:'referrals',sub:'Commission rate is a display value (2% lifetime). Settlement is handled by the backend.',dates:true,
 top:el=>{el.innerHTML='<div class="grid g4" style="margin-bottom:12px">'+[['Total Referrals','—'],['Active Referrals','—'],['Referral Earnings','—'],['Commission Rate','2% (lifetime)']].map(x=>UI.stat(...x)).join('')+'</div><div class="card" style="margin-bottom:12px"><b>Top Referrers</b><p class="hint">Loaded from the server leaderboard once connected.</p></div>'},
 filters:[{k:'status',l:'Status',o:['Active','Pending','Inactive']}],
 cols:[{k:'referrer',l:'Referrer'},{k:'referred',l:'Referred User'},{k:'code',l:'Referral Code'},{k:'status',l:'Status',b:1},{k:'created',l:'Created'},{k:'commission',l:'Commission'}],
 detail:r=>UI.modal({title:'Referral '+r.code,drawer:true,body:UI.kv(r)})});
