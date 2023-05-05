const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");

let server;
let agent;

function fetchCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("todo test suits", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(process.env.PORT || 3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("create a new todo item", async () => {
    const getResponse = await agent.get("/");
    const csrfToken = fetchCsrfToken(getResponse);
    const response = await agent.post("/todos").send({
      title: "Go to movie",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
  test("updating markAsCompleted", async () => {
    const getResponse = await agent.get("/");
    let csrfToken = fetchCsrfToken(getResponse);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const TodosItems = await agent.get("/").set("Accept", "application/json");
    const TodosItemsParse = JSON.parse(TodosItems.text);
    const calculateTodosTodayITem = TodosItemsParse.dueToday.length;
    const Todo = TodosItemsParse.dueToday[calculateTodosTodayITem - 1];
    const boolStatus = Todo.completed ? false : true;
    const anotherRes = await agent.get("/");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodo = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus });

    const UpadteTodoItemParse = JSON.parse(changeTodo.text);
    expect(UpadteTodoItemParse.completed).toBe(true);
  });
  test("deleting a todo", async () => {
    const getResponse = await agent.get("/");
    let csrfToken = fetchCsrfToken(getResponse);
    await agent.post("/todos").send({
      title: "Deleting todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const TodosItems = await agent.get("/").set("Accept", "application/json");
    const TodosItemsParse = JSON.parse(TodosItems.text);
    const calculateTodosTodayITem = TodosItemsParse.dueToday.length;
    const Todo = TodosItemsParse.dueToday[calculateTodosTodayITem - 1];
    const boolStatus = Todo.completed ? false : true;
    const anotherRes = await agent.get("/");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodo = await agent
      .delete(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus });

    const boolResponse = Boolean(changeTodo.text);
    expect(boolResponse).toBe(true);
  });

  test("marking an item as incomplete", async () => {
    const getResponse = await agent.get("/");
    let csrfToken = fetchCsrfToken(getResponse);
    await agent.post("/todos").send({
      title: "marking incomplete",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const TodosItems = await agent.get("/").set("Accept", "application/json");
    const TodosItemsParse = JSON.parse(TodosItems.text);
    const calculateTodosTodayITem = TodosItemsParse.dueToday.length;
    const Todo = TodosItemsParse.dueToday[calculateTodosTodayITem - 1];
    const boolStatus = !Todo.completed;
    let anotherRes = await agent.get("/");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodo = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus });

    const UpadteTodoItemParse = JSON.parse(changeTodo.text);
    expect(UpadteTodoItemParse.completed).toBe(true);

    anotherRes = await agent.get("/");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodos = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: !boolStatus });

    const UpadteTodoItemParsed = JSON.parse(changeTodos.text);
    expect(UpadteTodoItemParsed.completed).toBe(false);
  });
});
