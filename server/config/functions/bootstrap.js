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
        
        socket.on("message", data => {
          const parsed = JSON.parse(data);
          console.log(data);
          console.log(parsed);
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