const app = require("./app");
const { initializeSentry } = require("./sentry");

// Initialize Sentry
initializeSentry();

app.listen(3200, () => {
  console.log("Started express server at 3200");
});

// require('dotenv').config()
// const app = require('./app')
// // const https = require("https");
// // const fs = require("fs");
// // const path = require("path");
// app.listen(process.env.PORT, () => {
//   console.log('Started express server at 3400')
// })

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(process.env.PORT, () =>
//   console.log("Secure Started express server at 3300")
// );
// sslServer.on("error", (error) => {
//   console.error("HTTPS Server Error:", error);
// });
