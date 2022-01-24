/* eslint-env serviceworker */

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

const CACHE_NAME = 'cache-v1';

self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);
    if (requestURL.pathname === '/' || requestURL.pathname === '/index.html') {
        event.respondWith(fetch(event.request));
    } else if (self.location.hostname === requestURL.hostname) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                    );
                });
            })
        );
    }
});
