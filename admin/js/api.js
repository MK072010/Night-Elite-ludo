/* Single backend boundary. Live mode: Postgres RPC (RLS-protected) + Edge Functions. Preview: Mock. No money/KYC/payment logic lives in the browser. */
window.Api=(()=>{const live=()=>!State.preview;
const NOTCONN=e=>{const m=e?.message||String(e);return new Error(/not found|404|FunctionsHttpError|does not exist|Could not find/i.test(m)?'Backend endpoint not available yet ('+m+')':m)};
async function list(res,p){if(!live())return Mock.list(res,p);
 const sb=Auth.client(),{data,error}=await sb.rpc('admin_list_'+res,{p_tab:p.tab||null,p_q:p.q||null,p_filters:p.f||{},p_limit:p.limit,p_offset:p.page*p.limit});
 if(error)throw NOTCONN(error);return{rows:data?.rows||[],total:data?.total??null,hasMore:!!data?.has_more}}
async function get(name,id){if(!live())return{...Mock.B[name==='user'?'users':name](+String(id).replace(/\D/g,'')%37||0)};
 const{data,error}=await Auth.client().rpc('admin_get_'+name,{p_id:id});if(error)throw NOTCONN(error);return data}
async function stats(){if(!live())return Mock.stats;const{data,error}=await Auth.client().rpc('admin_dashboard_stats');if(error)throw NOTCONN(error);return data}
/* Sensitive actions: server decides. Preview never executes anything. */
async function action(name,payload={}){if(!live()){UI.toast('Preview mode — nothing was saved or executed.','info');return{preview:true}}
 const{data,error}=await Auth.client().functions.invoke('admin-'+name.replace(/\./g,'-'),{body:payload});if(error)throw NOTCONN(error);UI.toast('Done','ok');return data}
return{list,get,stats,action}})();
