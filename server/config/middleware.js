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
  