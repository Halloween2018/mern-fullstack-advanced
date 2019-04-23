require('babel-register')({
    presets: [
        "node8-es6", "react"
      ]
});

require('./server.js');