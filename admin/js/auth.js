/* Auth adapter: Supabase Auth (anon key only). No fake login. Preview mode is dev-only mock data. */
window.Auth=(()=>{let sb=null;const C=window.FB_CONFIG||{};
const configured=()=>!!(C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&window.supabase);
function client(remember=true){if(sb)return sb;if(!configured())throw new Error('Supabase is not configured (js/config.js).');
 const store=remember?localStorage:sessionStorage;sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{persistSession:true,storage:store,storageKey:'nel-admin-auth'}});return sb}
async function me(){const{data,error}=await client().rpc('admin_me');if(error)throw error;if(!data)throw new Error('This account is not an admin.');return data}/* -> {id,name,email,role,permissions:{module:[actions]}} */
async function login(email,pw,remember){sessionStorage.removeItem('nel-preview');sb=null;const c=client(remember);const{error}=await c.auth.signInWithPassword({email,password:pw});if(error)throw error;try{await me()}catch(e){await c.auth.signOut();throw e}}
async function forgot(email){const{error}=await client().auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname.replace('login.html','login.html')});if(error)throw error}
async function logout(){try{if(configured()&&!sessionStorage.getItem('nel-preview')){sb=null;await client().auth.signOut()}}catch(e){}sessionStorage.removeItem('nel-preview');location.href='login.html'}
async function init(){if(sessionStorage.getItem('nel-preview')){State.preview=true;State.admin=Mock.admin;return true}
 if(!configured())return false;const{data}=await client().auth.getSession();if(!data.session){sb=null;const c2=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{storage:sessionStorage,storageKey:'nel-admin-auth'}});const s2=await c2.auth.getSession();if(!s2.data.session)return false;sb=c2}
 try{State.admin=await me();return true}catch(e){return false}}
return{configured,client,login,forgot,logout,init}})();
