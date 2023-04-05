/*console.log('Hello 1');

// Print message after 100 millisecond
setTimeout(function() {
   console.log('Hello 2');
}, 100);
console.log('Hello 3');
*/
let toggleTodoCompletedStatus = (todoItem) => {
  todoItem.completed = !todoItem.completed;
  return todoItem;
};

let testToggleCompletion = () => {
  let item = {
    title: "Buy Milk",
    completed: false,
  };
  item = toggleTodoCompletedStatus(item);

  console.assert(item.completed === true, "Todo item should be completed");
};

testToggleCompletion();
