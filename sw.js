const VERSION='v1.6.1';
const STATIC=`horizon-static-${VERSION}`;
const ASSETS=[
  './','./index.html','./manifest.webmanifest',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js','https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(STATIC).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('horizon-static-')&&k!==STATIC).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET') return;
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{ const copy=res.clone(); caches.open(STATIC).then(cache=>cache.put(r,copy)); return res; }).catch(()=>caches.match('./index.html'))));
});
