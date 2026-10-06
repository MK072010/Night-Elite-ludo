const V='nel-v27',A=['/','/index.html','/css/app.css','/css/theme.css','/js/app.js','/js/config.js','/js/ludo-engine.js','/manifest.json','/assets/logo-h.png','/assets/logo.png','/assets/mark.png','/assets/icon-192.png','/assets/ludo-classic.jpg','/assets/ludo-snake.jpg','/assets/support.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// static shell: instant from cache, refreshed in background. Never touch /api (wallet/payment data).
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});
const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit||c.match('/index.html'));return hit||net}))});
