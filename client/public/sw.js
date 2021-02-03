let cacheData = "appV1";

this.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheData).then((cache) => {
            //LÄGGER TILL FILER I CACHE MINNET PÅ BROWSERN
            cache.addAll([
                "/static/js/main.chunk.js",
                "/static/js/bundle.js",
                "/static/js/0.chunk.js",
                "/index.html",
                "/",
                "/home"
            ])
        })
    )
})

this.addEventListener("fetch", (e) => {
    if(!navigator.onLine){
        e.respondWith(
            caches.match(e.request).then((res) => {
                if(res){
                    return res
                }
            })
        )
    }
})

/*
this.addEventListener("activate", (e) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(cacheData);

    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )
})
*/