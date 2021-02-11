
/* eslint-disable no-restricted-globals */
const version = 5;
const staticCache = "appV" + version;
const dynamicCache = "dynamicV" + version;

const urlsToCache = [
    "/static/js/main.chunk.js",
    "/static/js/bundle.js",
    "/static/js/0.chunk.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v76/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    "/static/media/Backdrop.5f5287b4.svg",
    "/static/media/ChatLogo-trans.ee4e1aac.png",
    "/index.html",
    "/offline.html",
    "/",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(staticCache).then(cache => {
            console.log("caching shell assets")
            cache.addAll(urlsToCache)
        })
        //LÄGGER TILL FILER I CACHE MINNET PÅ BROWSERN
    )
    console.log("Service worker has been installed")
})

self.addEventListener("activate", async (e) => {

    // Deleting old caches depending on the version 
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key))
            )}
        )
    )
    console.log("service worker has been activated")

})

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log(data);
    self.registration.showNotification(data.author + " - " + data.roomname, {
        body: data.message,
        data: {
            url: data.url
        },
        tag: "new-message-" + data.roomname,
        renotify: false,
    })
})

const notifyRoute = async e => {
    let { url } = e.notification.data
    let clis = await self.clients.matchAll()
    let client = clis.find(c => c.visibilityState === 'visible')
    if(client !== undefined) {
        client.navigate(url)
        client.focus()
    } else {
        self.clients.openWindow(url)
    }
    e.notification.close()
}
  
self.addEventListener('notificationclick', e => {
    e.waitUntil(notifyRoute(e))
})

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

self.addEventListener("fetch", (e) => {

    // kör network first när det gäller att ladda in rooms
    if (e.request.method !== "GET" ||
        e.request.url.includes("/socket.io") ||
        e.request.url.includes("/rooms/")) return
    
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(e.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCache, 30)
                    return fetchRes;
                })
            })
        }).catch((err) => {
            if(e.request.url.indexOf(".html") > -1){
                return caches.match("/offline.html")
            }
        })
    );
    console.log("I JUST FETCHED HEHE")
})
