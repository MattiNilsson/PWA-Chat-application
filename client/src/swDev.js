const vapidPublic = "BL9vqX2LKJVIL8f4B3v7wnFT0jxb1Yy6ijSLkweCd8stu4TqawA0o8cCdM9Juoti4lejwDc91JKlx_KQmAqpSLU";
const vapidPrivate = "K9tKxbRI73Pj6xJp1YzcCrdNzWRZHj8cxiDQCVJ119o"

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const saveSubscription = async subscription => {
    const SERVER_URL = 'https://pwa-bitechat.herokuapp.com/subscriptions'
    const userID = JSON.parse(localStorage.getItem("user"));
    console.log(userID.id)
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sub: JSON.stringify(subscription), user: [userID.id]}),
    })
    return response.json()
}

export default function swDev(){
    if("serviceWorker" in navigator){
        // REGISTRERA EN SERVICE WORKER
        let swURL = `${process.env.PUBLIC_URL}/sw.js`
        navigator.serviceWorker.register(swURL, {scope: '/'}).then(function() {
            return navigator.serviceWorker.ready;
        }).then(async (reg) => {

            try {
                const applicationServerKey = urlB64ToUint8Array(vapidPublic);
                const options = {applicationServerKey, userVisibleOnly : true};
                const subscription = await reg.pushManager.subscribe(options);
                const response = await saveSubscription(subscription);
                
                console.log("WE DID IT!", response);
            } catch (err){
                console.log("error", err)
            }
        })
        .catch((err) => console.log("service worker not registered", err))
    }
}