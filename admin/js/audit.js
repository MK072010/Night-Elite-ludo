Pages.data('audit',{res:'audit',title:'Audit Logs',mod:'audit',sub:'Read-only. Immutable logging is written by the backend.',dates:true,
 filters:[{k:'admin',l:'Admin',o:['Meera Nair','Kabir Anand','Tara Joshi']},{k:'action',l:'Action',o:['user.lock','kyc.review','announcement.update','login']},{k:'result',l:'Result',o:['Success','Failed']}],
 cols:[{k:'ts',l:'Timestamp'},{k:'admin',l:'Admin'},{k:'role',l:'Role',b:1},{k:'action',l:'Action'},{k:'target',l:'Target'},{k:'ip',l:'IP / Device'},{k:'result',l:'Result',b:1}],
 detail:r=>UI.modal({title:'Audit entry',drawer:true,body:UI.kv(r)+'<p class="hint">Before/after values appear here once the backend writes them.</p>'})});
