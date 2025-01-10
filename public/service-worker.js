const CACHE_NAME = 'share-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/main.chunk.js',
    '/static/js/bundle.js',
    '/static/js/vendors~main.chunk.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'POST') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => response || fetch(event.request))
        );
    }
});

self.addEventListener('share-target', async (event) => {
    event.respondWith(Response.redirect('/'));
    event.waitUntil(
        (async () => {
            const formData = await event.request.formData();
            const file = formData.get('file');
            const client = await self.clients.get(event.resultingClientId);
            client.postMessage({
                file: {
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            });
        })()
    );
});