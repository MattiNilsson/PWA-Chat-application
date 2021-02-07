import {vapidPublic, urlBase64ToUint8Array} from "./constants/constants";

export default function swDev(){
    if("serviceWorker" in navigator){
        function determineAppServerKey() {   
            return urlBase64ToUint8Array(vapidPublic);
        }
        // REGISTRERA EN SERVICE WORKER
        let swURL = `${process.env.PUBLIC_URL}/sw.js`
        navigator.serviceWorker.register(swURL, {scope: '/'})
        .then((reg) => {
            console.log("service worker registered", reg)
            return reg.pushManager.getSubscription()
                .then(() => { 
                    const subscription = reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: determineAppServerKey()
                    })

                    return subscription;
                }
            ) 
        })
        .catch((err) => console.log("service worker not registered", err))
    }
}