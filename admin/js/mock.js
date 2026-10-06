/* DEV-ONLY mock adapter. Used ONLY in ?preview mode to demonstrate the UI. Replace by real backend via api.js. */
window.Mock=(()=>{const NM=['Aarav Sharma','Priya Verma','Rohan Gupta','Sneha Iyer','Vikram Singh','Neha Kapoor','Arjun Mehta','Isha Reddy'],AD=['Meera Nair','Kabir Anand','Tara Joshi'];
const pk=(a,i)=>a[i%a.length],dt=i=>new Date(Date.now()-i*3.1e7).toISOString(),f=s=>s.slice(0,16).replace('T',' ');
const mob=i=>'+91 98'+String(10000000+i*79193).slice(0,8),nm=i=>pk(NM,i),amt=i=>'₹'+(100+(i*377)%4900);
const B={users:i=>({id:'U'+(1000+i),name:nm(i),mobile:mob(i),email:nm(i).split(' ')[0].toLowerCase()+i+'@example.com',kyc:pk(['Pending','Approved','Rejected','Not submitted'],i),wallet:pk(['Active','Active','Frozen'],i),status:pk(['Active','Active','Active','Locked'],i),joined:f(dt(i*9))}),
kyc:i=>({id:'K'+(500+i),user:nm(i),status:pk(['Pending','Approved','Rejected'],i),submitted:f(dt(i*7)),reviewed:i%3?f(dt(i*6)):'—',reviewer:i%3?pk(AD,i):'—'}),
wallet:i=>({id:'T'+(9000+i),user:nm(i),type:pk(['Credit','Debit','Deposit','Withdrawal','Refund','Adjustment'],i),amount:amt(i),status:pk(['Success','Pending','Failed'],i),ref:'REF'+(70000+i*13),created:f(dt(i*3))}),
payments:i=>({id:'P'+(3000+i),user:nm(i),amount:amt(i),order:'ORD'+(81000+i*7),status:pk(['Pending','Success','Failed','Expired'],i),created:f(dt(i*4)),updated:f(dt(i*4-1))}),
withdrawals:i=>({id:'W'+(200+i),user:nm(i),amount:amt(i),method:pk(['UPI','Bank'],i),status:pk(['Pending','Processing','Completed','Rejected'],i),requested:f(dt(i*5)),updated:f(dt(i*5-1))}),
rooms:i=>({id:'R'+(7000+i),game:'Ludo Classic',players:pk(['1/2','2/2','2/4','4/4'],i),status:pk(['Waiting','Full','Active','Finished','Cancelled'],i),created:f(dt(i*2)),started:i%5?f(dt(i*2-1)):'—'}),
results:i=>({id:'GR'+(400+i),room:'R'+(6900+i),winner:nm(i),players:pk(['2','4'],i),duration:(6+i%14)+' min',finished:f(dt(i*3))}),
referrals:i=>({referrer:nm(i),referred:nm(i+3),code:'NEL'+(100+i*3),status:pk(['Active','Pending','Inactive'],i),created:f(dt(i*6)),commission:'₹'+(i*13%400)}),
agents:i=>({id:'A'+(10+i),name:nm(i+2),mobile:mob(i+5),email:'agent'+i+'@example.com',status:pk(['Active','Active','Inactive'],i),customers:20+i*7%90,created:f(dt(i*30))}),
admins:i=>({name:i?pk(AD,i):'Admin Owner',email:'admin'+i+'@example.com',mobile:mob(i+9),role:pk(['Super Admin','Admin','Sub Admin'],i),status:pk(['Active','Active','Inactive'],i),last:f(dt(i*8)),created:f(dt(i*40))}),
announcements:i=>({title:pk(['New rooms live','Maintenance notice','Welcome'],i),message:'Sample announcement text '+i,status:pk(['Active','Draft','Expired'],i),start:f(dt(i*20)).slice(0,10),expiry:f(dt(i*20-300)).slice(0,10),priority:pk(['High','Normal','Low'],i)}),
notifications:i=>({title:pk(['Withdrawal update','KYC reviewed','System maintenance','New referral'],i),type:pk(['User','System','Broadcast'],i),target:pk(['U1003','All users','Admins'],i),status:pk(['Unread','Read'],i),created:f(dt(i*4)),sent:f(dt(i*4-1))}),
support:i=>({id:'S'+(600+i),user:nm(i),subject:pk(['Deposit not reflected','KYC rejected','Game disconnected','Withdrawal delay'],i),priority:pk(['High','Normal','Low'],i),status:pk(['Open','In Progress','Waiting','Resolved','Closed'],i),created:f(dt(i*5)),updated:f(dt(i*5-1)),assigned:i%2?pk(AD,i):'Unassigned'}),
audit:i=>({ts:f(dt(i*2)),admin:pk(AD,i),role:pk(['Admin','Sub Admin'],i),action:pk(['user.lock','kyc.review','announcement.update','login'],i),target:'U'+(1000+i),ip:'device/IP placeholder',result:pk(['Success','Success','Failed'],i)}),
sessions:i=>({device:pk(['Android · Chrome','iPhone · Safari','Windows · Edge'],i),ip:'IP placeholder',last:f(dt(i*10)),status:i?'Expired':'Active'})};
const N=37;
function list(res,p){let r=Array.from({length:N},(_,i)=>{const o=B[res](i);o.__d=dt(i*3).slice(0,10);return o});
 if(p.tab&&p.tab!=='all')r=r.filter(o=>String(o[p.tabField||'status']).toLowerCase()===p.tab.toLowerCase());
 Object.entries(p.f||{}).forEach(([k,v])=>{if(!v)return;if(k==='from')r=r.filter(o=>o.__d>=v);else if(k==='to')r=r.filter(o=>o.__d<=v);else r=r.filter(o=>String(o[k]).toLowerCase()===v.toLowerCase())});
 if(p.q)r=r.filter(o=>JSON.stringify(o).toLowerCase().includes(p.q.toLowerCase()));
 const s=p.page*p.limit;return new Promise(ok=>setTimeout(()=>ok({rows:r.slice(s,s+p.limit),total:r.length,hasMore:s+p.limit<r.length}),250))}
const stats={'Users':[['Total Users','12,480'],['Active Users','3,214'],['Pending KYC','86'],["Today's New Users",'142']],'Wallet & Platform':[['Total Wallet Balance','₹48.2L'],['Pending Deposits','23'],['Pending Withdrawals','17'],["Today's Transactions",'1,204']],'Games':[['Active Rooms','64'],['Players Online','212'],['Games Today','1,930'],['Completed Games','1,866']],'System':[['Open Support Tickets','31'],['Unread Notifications','9'],['Active Announcements','2']]};
const admin={id:'preview',name:'Preview Admin',email:'preview@local',role:'Super Admin',permissions:Object.fromEntries(MODULES.map(m=>[m,ACTIONS.slice()]))};
return{list,B,stats,admin}})();
