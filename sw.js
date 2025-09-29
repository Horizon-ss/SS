/* SW v1.2 */
const VERSION='v1.2.0';
const STATIC=`horizon-static-${VERSION}`;
const ASSETS=[
  './','./index.html','./manifest.webmanifest',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(STATIC).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('horizon-static-')&&k!==STATIC).map(k=>caches.delete(k)))))
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(cached=>cached||fetch(req).then(resp=>{
      // runtime cache copy
      const copy=resp.clone(); caches.open(STATIC).then(c=>c.put(req,copy)); return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});