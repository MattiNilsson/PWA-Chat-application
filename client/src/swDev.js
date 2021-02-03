export default function swDev(){

    // REGISTRERA EN SERVICE WORKER
    let swURL = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swURL).then(res => {
        console.warn("response", res);
    })
}