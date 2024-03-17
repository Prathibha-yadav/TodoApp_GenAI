const express = require("express");
const Sentry = require("@sentry/node");
const { Integrations } = require("@sentry/tracing");

const app = express();

function initializeSentry() {
  Sentry.init({
    dsn: "https://b510a9ee305035e7519ba5f0a700466a@o4506925034962944.ingest.us.sentry.io/4506925038239744",
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
