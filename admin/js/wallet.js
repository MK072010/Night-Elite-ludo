Pages.data('wallet',{res:'wallet',title:'Wallet',mod:'wallet',sub:'Read-only ledger view. No money movement happens from the browser.',dates:true,
 top:el=>{el.innerHTML='<div class="grid g4" style="margin-bottom:12px">'+['Available Balance','Ledger Balance','Pending Amount','Frozen Amount'].map(l=>UI.stat(l,'—')).join('')+'</div>'},
 filters:[{k:'type',l:'Type',o:['Credit','Debit','Deposit','Withdrawal','Refund','Adjustment']},{k:'status',l:'Status',o:['Success','Pending','Failed']}],
 cols:[{k:'id',l:'Transaction ID'},{k:'user',l:'User'},{k:'type',l:'Type',b:1},{k:'amount',l:'Amount'},{k:'status',l:'Status',b:1},{k:'ref',l:'Reference'},{k:'created',l:'Created'}],
 detail:r=>UI.modal({title:'Transaction '+r.id,drawer:true,body:UI.kv({User:r.user,Type:r.type,Amount:r.amount,Status:UI.html(UI.badge(r.status)),Reference:r.ref,Created:r.created})+'<p class="hint">Adjustments/refunds must be executed by the backend with audit logging.</p>'})});
