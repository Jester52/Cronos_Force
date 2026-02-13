// Archivo sw.js
self.addEventListener('fetch', (event) => {
  // No necesita hacer nada complejo, solo existir para que Chrome permita la instalación
  event.respondWith(fetch(event.request));
});
