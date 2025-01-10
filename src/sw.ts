//@ts-nocheck

import { precacheAndRoute } from 'workbox-precaching'
import { cleanupOutdatedCaches } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// Очистка старого кэша
cleanupOutdatedCaches()

// Предварительное кэширование ассетов
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Обработка share target
self.addEventListener('fetch', async (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/share-target')) {
    // Предотвращаем дефолтную обработку
    event.preventDefault()

    // Отвечаем редиректом на главную страницу
    event.respondWith(Response.redirect('/'));

    // Обрабатываем файлы
    event.waitUntil(
      (async () => {
        try {
          const formData = await event.request.formData();
          const files = formData.getAll('file');

          // Получаем клиент
          const clientId = event.resultingClientId || (await self.clients.matchAll())[0]?.id;
          if (!clientId) return;

          const client = await self.clients.get(clientId);
          if (!client) return;

          // Отправляем информацию о файле в приложение
          if (files.length > 0) {
            const file = files[0] as File;
            client.postMessage({
              file: {
                name: file.name,
                type: file.type,
                size: file.size
              }
            });
          }
        } catch (error) {
          console.error('Error processing share target:', error);
        }
      })()
    );
    return;
  }
})