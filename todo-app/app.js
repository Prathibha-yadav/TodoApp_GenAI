/* eslint-disable new-cap */
/* eslint-disable eqeqeq */
/* eslint-disable n/handle-callback-err */

const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const Sentry = require("@sentry/node"); // Import Sentry
const { initializeSentry } = require("./sentry");

const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
// const OpenAI = require('openai')
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Initialize Sentry
initializeSentry();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("sshh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

// Initialize i18next and i18next-http-middleware
const languageDetector = new middleware.LanguageDetector(null, {
  order: ["session", "cookie", "header"],
  lookupSession: "language",
});

i18next
  .use(Backend)
  .use(languageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}.json",
    },
  });

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Configure session middleware
app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(middleware.handle(i18next));
app.use((req, res, next) => {
  req.language = req.session.language || "en";
  console.log("Detected language:", req.language);
  next();
});
// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set local variables for flash messages
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

// Passport configuration
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          if (!user) {
            return done(null, false, { message: i18next.t("user_not_found") });
          }

          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: i18next.t("invalid_password"),
            });
          }
        })
        .catch((error) => {
          return done(null, false, {
            message: i18next.t("invalid_credentials"),
          });
        });
    }
  )
);
// Serialize and deserialize user
passport.serializeUser((user, done) => {
  console.log("Serializing user in session : ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializing user from session: ", id);
  User.findByPk(id)
    .then((users) => {
      done(null, users);
    })
    .catch((error) => {
      done(error, null);
    });
});

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post(
  "/addTodoWithGemini",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const prompt = req.body.prompt;
    try {
      // Fetch title and date from Gemini API
      const { title, dueDate } = await getTitleAndDateFromGemini(prompt);

      // Adding todo to the database
      await Todo.addTodo({
        title,
        dueDate,
        userId: req.user.id,
      });

      // Redirecting to todos page after adding the todo
      return res.redirect("/todos");
    } catch (error) {
      console.error("Error adding todo with Gemini API:", error);
      req.flash("error", "Error adding todo with Gemini API: " + error.message);
      return res.redirect("/todos");
    }
  }
);

async function getTitleAndDateFromGemini(prompt) {
  try {
    // Strong system prompt to guide Gemini API
    const systemPrompt =
      "You are assisting a user in managing their tasks. Your task is to extract the to-do item and its due date from the given message. " +
      "If the message contains a task followed by a due date, extract both. Otherwise, extract only the task. " +
      "The due date should be in the format 'YYYY-MM-DD'. " +
      "To compute relative dates, assume that the current timestamp is " +
      new Date().toISOString() +
      ". " +
      "Return the title and due date in the format 'Title - Due Date'.";

    // Fetch suggestion from Gemini API with the system prompt
    const suggestion = await askGemini(systemPrompt + " " + prompt);

    // Assuming the response format is "Title - Due Date"
    const [title, date] = suggestion.split("-").map((str) => str.trim());
    console.log("Extracted title and date: " + title + date);
    if (!title || !date) {
      throw new Error(
        "Unable to extract the title and date from the suggestion."
      );
    }

    // Validate and parse the due date
    const dueDate = new Date(date);
    if (isNaN(dueDate.getTime())) {
      throw new Error("Invalid due date format.");
    }

    return { title, dueDate };
  } catch (error) {
    console.error("Error getting title and date from Gemini API:", error);
    throw error;
  }
}

async function askGemini(prompt) {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Input by user:", text);
    return text;
  } catch (error) {
    console.error("Error making a query to Gemini API:", error);
    return null;
  }
}

app.get("/", async function (request, response) {
  try {
    if (request.user) {
      return response.redirect("/todos");
    } else {
      response.render(
        "index",
        {
          title: "Todo application",
          csrfToken: request.csrfToken(),
          lang: i18next.language || "en",
          i18next,
        },
        console.log("Language:", request.session.language || "en")
      );
    }
  } catch (error) {
    // Capture and report the error to Sentry
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/changeLanguage", (req, res) => {
  try {
    const { language } = req.body;
    if (!language) {
      throw new Error("Language parameter missing");
    }
    i18next.changeLanguage(language);
    console.log(language);
    res.redirect("/");
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return res.status(422).json(error);
  }
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    try {
      const loggedInUser = request.user.id;
      const overDueItems = await Todo.overdue(loggedInUser);
      const dueTodayItems = await Todo.dueToday(loggedInUser);
      const dueLaterItems = await Todo.dueLater(loggedInUser);
      const completedItems = await Todo.completedItems(loggedInUser);
      const allTodos = await Todo.getTodos();
      const lang = request.session.language || "en";
      const currentLanguage = i18next.language;
      if (request.accepts("html")) {
        response.render("todos", {
          loggedInUser: request.user,
          title: "Todo Application",
          overDueItems,
          dueTodayItems,
          dueLaterItems,
          completedItems,
          allTodos,
          csrfToken: request.csrfToken(),
          lang,
          currentLanguage,
          i18next,
        });
      } else {
        response.json({
          overDueItems,
          dueTodayItems,
          dueLaterItems,
          completedItems,
          allTodos,
        });
      }
    } catch (error) {
      // Capture and report the error to Sentry
      Sentry.captureException(error);
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/signup", (request, response) => {
  try {
    if (request.isAuthenticated()) {
      return response.redirect("/todos");
    }
    response.render("signup", {
      title: "Signup",
      csrfToken: request.csrfToken(),
      lang: i18next.language || "en",
      i18next,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/users", async (request, response) => {
  if (
    request.body.firstName.length != 0 &&
    request.body.email.length != 0 &&
    request.body.password.length == 0
  ) {
    request.flash("error", i18next.t("password_empty"));
    return response.redirect("/signup");
  }

  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);

  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });

    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }

      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);

    if (error.name == "SequelizeValidationError") {
      const errMsg = error.errors.map((error) => error.message);
      console.log(errMsg);
      errMsg.forEach((message) => {
        if (message == "Validation notEmpty on firstName failed") {
          request.flash("error", i18next.t("first_name_empty"));
        }
        if (message == "Validation notEmpty on email failed") {
          request.flash("error", i18next.t("email_empty"));
        }
      });
      response.redirect("/signup");
    } else if (error.name == "SequelizeUniqueConstraintError") {
      const errMsg = error.errors.map((error) => error.message);
      console.log(errMsg);
      errMsg.forEach((message) => {
        if (message == "email must be unique") {
          request.flash("error", i18next.t("email_unique"));
        }
      });
      response.redirect("/signup");
    } else {
      Sentry.captureException(error);
      console.log(error);
      return response.status(422).json(error);
    }
  }
});

app.get("/login", (request, response) => {
  try {
    if (request.isAuthenticated()) {
      return response.redirect("/todos");
    }
    response.render("login", {
      title: "Login",
      csrfToken: request.csrfToken(),
      lang: i18next.language || "en",
      i18next,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (request, response) => {
    try {
      console.log(request.user);
      response.redirect("/todos");
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/signout", (request, response, next) => {
  try {
    request.logout((err) => {
      if (err) {
        return next(err);
      }
      response.redirect("/");
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/homepage", (request, response, next) => {
  try {
    request.logout((err) => {
      if (err) {
        return next(err);
      }
      response.redirect("/");
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos");
  try {
    const todo = await Todo.findAll();
    return response.json(todo);
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return response.status(422).json(error);
  }
});

// Creating a new Todo
app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Creating a todo", request.body);
    console.log(request.user);

    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        const errMsg = error.errors.map((error) => error.message);
        console.log(errMsg);
        errMsg.forEach((message) => {
          if (message == "Validation isDate on dueDate failed") {
            request.flash("error", i18next.t("due_date_empty"));
          }
          if (message == "Validation len on title failed") {
            request.flash("error", i18next.t("title_length_error"));
          }
        });
        response.redirect("/todos");
      } else {
        Sentry.captureException(error);
        console.log(error);
        return response.status(422).json(error);
      }
    }
  }
);

// setCompletetionStatus
app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Delete a Todo with ID: ", request.params.id);
    try {
      await Todo.remove(request.params.id, request.user.id);
      return response.json({ success: true });
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

module.exports = app;
