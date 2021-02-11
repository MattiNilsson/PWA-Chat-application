'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
    process.nextTick(() =>{
      const webpush = require("web-push");
      const vapidPublic = "BL9vqX2LKJVIL8f4B3v7wnFT0jxb1Yy6ijSLkweCd8stu4TqawA0o8cCdM9Juoti4lejwDc91JKlx_KQmAqpSLU";
      const vapidPrivate = "K9tKxbRI73Pj6xJp1YzcCrdNzWRZHj8cxiDQCVJ119o"

      webpush.setVapidDetails("mailto:test@test.com", vapidPublic, vapidPrivate)

      var io = require('socket.io')(strapi.server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "DELETE", "PUT"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
      });
      io.on('connection', async function(socket) {
        console.log(`a user connected`)
        // join room
        socket.on("join", (data) => {
            let parsed = JSON.parse(data);
            socket.join(parsed.room);
            socket.to(parsed.room).emit(parsed.user + " joined " + parsed.room);
            console.log(parsed.user + " JOINED " + parsed.room)
        })

        socket.on("notify-join", (data) => {
          let parsed = JSON.parse(data);
          for(let i = 0; i < parsed.rooms.length; i++){
            socket.join("" + parsed.rooms[i]);
            console.log(parsed.user + " IS LISTENING TO " + parsed.rooms[i])
          }
        })
        
        socket.on("message", async data => {
          const parsed = JSON.parse(data);
          console.log(parsed)

          for(let i = 0; i < parsed.otherUsers.length; i++){
            if(parsed.otherUsers[i].id !== parsed.userID){
              console.log("USER", parsed.otherUsers[i].username)
              const test = await strapi.services.subscriptions.find({
                user_contains: parsed.otherUsers[i].id
              })
              if(test){
                const subscription = JSON.parse(test[0].sub);
                console.log("TEST", subscription.endpoint);
                webpush.sendNotification(subscription, JSON.stringify(parsed)).catch(err => console.error(err))
              }else{
                console.log("NO SUB")
              }
            }
          }
  
          console.log(parsed.author + " send a message TO ROOM " + parsed.room[0])
          socket.to("" + parsed.room[0]).emit("broad-message", {author: parsed.author, message: parsed.message})
          socket.to("" + parsed.room[0]).emit("broad-notify", {author: parsed.author, message: parsed.message, room : parsed.room[0], roomName : parsed.roomname})
        })
  
        // listen for user diconnect
        socket.on('disconnect', () =>{
          console.log('a user disconnected')
        });

        socket.on('logoff', () =>{
          console.log('a user logged off')
        });
      });
      strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
    })
  
  };