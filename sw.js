/* SW v1.4 */
const VERSION='v1.4.0';
const STATIC=`horizon-static-${VERSION}`;
const ASSETS=['./','./index.html','./manifest.webmanifest','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(STATIC).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('horizon-static-')&&k!==STATIC).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{const r=e.request; if(r.method!=='GET') return; e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(resp=>{const copy=resp.clone(); caches.open(STATIC).then(c=>c.put(r,copy)); return resp;}).catch(()=>caches.match('./index.html'))))});