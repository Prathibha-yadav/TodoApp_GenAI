const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    x = all.filter((element) => element.dueDate == yesterday);
    return x;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    y = all.filter((element) => element.dueDate == today);
    return y;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    z = all.filter((element) => element.dueDate == tomorrow);
    return z;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    a = list
      .map((i) => {
        const isCompelete = i.completed ? "[x]" : "[ ]";
        const display = i.dueDate == today ? "" : i.dueDate;
        return `${isCompelete} ${i.title.trim()} ${display.trim()}`;
      })
      .join("\n");
    return a;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
