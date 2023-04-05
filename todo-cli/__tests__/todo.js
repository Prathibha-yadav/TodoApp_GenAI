/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();
describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };

  var dateToday = new Date();
  //const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );

  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrive overdue items", () => {
    const x = {
      title: "Test overdue",
      completed: false,
      dueDate: yesterday,
    };
    add(x);
    expect(overdue().length).toBe(1);
  });

  test("Should retrive due today items", () => {
    expect(dueToday().length).toEqual(2);
  });

  test("Should retrive due Later items", () => {
    const z = {
      title: "Test dueLater",
      completed: false,
      dueDate: tomorrow,
    };
    add(z);
    expect(dueLater().length).toBe(1);
  });
});
