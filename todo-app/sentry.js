const express = require("express");
const Sentry = require("@sentry/node");
const { Integrations } = require("@sentry/tracing");

const app = express();

function initializeSentry() {
  Sentry.init({
    dsn: "https://e28c1f905839f97f82f40821b4b6a455@o4506936972083200.ingest.us.sentry.io/4506936982241280",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  // app.use(Sentry.Handlers.requestHandler())
  // app.use(Sentry.Handlers.tracingHandler())

  app.use(function onError(err, req, res, next) {
    console.log(err);
    res.status(422).send(err);
  });
}

module.exports = { initializeSentry };
