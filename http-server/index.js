const http = require("http");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, projects) => {
  if (err) {
    throw err;
  }
  projectContent = projects;
});
fs.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  registrationContent = registration;
});
const server = http.createServer((request, response) => {
  let url = request.url;
  response.writeHeader(200, { "Content-Type": "text/html" });
  switch (url) {
    case "/projects":
      response.write(projectContent);
      response.end();
      break;
    case "/registration":
      response.write(registrationContent);
      response.end();
      break;
    default:
      response.write(homeContent);
      response.end();
      break;
  }
});

const port = argv.port || 9000;
server.listen(port, () => {
  console.log(`port no. ${port}`);
});
