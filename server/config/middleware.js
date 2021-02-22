/*
module.exports = {
    //...
    settings: {
      cors: {
        enabled: true, //<--
        origin: ['*'], // ['*'] to allow all origins
        headers: ["*"], // ['*'] to allow all headers
      },
    }
    //...
  };
*/

module.exports = {
    load: {
      before: ['timer', 'responseTime', 'logger', 'cors', 'responses', 'gzip'],
      after: ['parser', 'router'],
    },
    settings: {
      cors: {
        enabled: true,
        origin: ["*"]
      },
    },
  };