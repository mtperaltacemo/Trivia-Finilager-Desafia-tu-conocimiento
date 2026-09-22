/* Service Worker minimo de "Desafiando tu Conocimiento" (FINILAGER).
   Su unico proposito es cumplir el requisito tecnico que pide Chrome/Android
   para poder mostrar la opcion de instalar la app / agregarla a la pantalla
   de inicio (sin un Service Worker registrado, esa opcion no aparece).
   No cachea nada de forma agresiva: siempre intenta traer la version mas
   nueva de la red primero, y solo recurre a la cache si no hay conexion. */

const CACHE_NAME = 'finilager-trivia-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
