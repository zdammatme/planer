// Działanie offline: najpierw sieć (żeby łapać aktualizacje), a bez internetu wersja z pamięci.
const CACHE = "planer-v2";
const FILES = ["./", "index.html", "manifest.json", "icon-180.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (/goatcounter|zgo\.at/.test(e.request.url)) return; // statystyki idą prosto do sieci
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match("index.html")))
  );
});
