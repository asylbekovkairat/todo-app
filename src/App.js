import { useEffect, useState } from "react";
import { Button, Input, Radio } from "antd";
import "./App.css";
import { Todo } from "./components/Todo/Todo";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filterType, setFilterType] = useState("COMPLETED");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [notCompletedTodos, setNotCompletedTodos] = useState([]);

  const getAllTodos = () => {
    fetch("https://64f860a7824680fd217f7ae8.mockapi.io/todos")
      .then((response) => response.json())
      .then((data) => setTodoList(data));
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    const completed = todoList.filter((item) => item?.isDone === true);
    const notCompleted = todoList.filter((item) => item?.isDone === false);
    setCompletedTodos(completed);
    setNotCompletedTodos(notCompleted);
  }, [todoList]);

  const onChange = (e) => {
    const { value } = e.target;
    setFilterType(value);
  };

  const deselectOnClick = (e) => {
    const { value } = e.target;
    if (value === filterType) {
      setFilterType(null);
    }
  };

  const handleCheck = (status, todoId) => {
    fetch(`https://64f860a7824680fd217f7ae8.mockapi.io/todos/${todoId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isDone: status }),
    })
      .then((response) => response.json())
      .then(() => {
        getAllTodos();
        setNewTodo("");
      });
  };

  const handleEdit = (newTodo, todoId) => {
    fetch(`https://64f860a7824680fd217f7ae8.mockapi.io/todos/${todoId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ taskText: newTodo }),
    })
      .then((response) => response.json())
      .then(() => {
        getAllTodos();
        setNewTodo("");
      });
  };

  const handleDelete = (todoId) => {
    fetch(`https://64f860a7824680fd217f7ae8.mockapi.io/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        getAllTodos();
        setNewTodo("");
      });
  };

  const handleCreateTodo = () => {
    const newTodoItem = {
      isDone: false,
      taskText: newTodo,
      id: Math.random(),
    };

    fetch(`https://64f860a7824680fd217f7ae8.mockapi.io/todos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newTodoItem),
    })
      .then((response) => response.json())
      .then((data) => {
        getAllTodos();
        setNewTodo("");
      });
  };

  return (
    <div className="todo_wrapper">
      <div className="todo_amount">Todos ({todoList.length})</div>
      <div className="todolist">
        <div className="todo_search">
          <Input
            className="todo_input"
            placeholder="Enter todo here"
            onChange={(event) => setNewTodo(event.target.value)}
            value={newTodo}
          />
          <Button
            className="todo_button"
            type="primary"
            onClick={handleCreateTodo}
          >
            + Add
          </Button>
        </div>
        <Radio.Group className="filter" onChange={onChange} value={filterType}>
          <Radio.Button onClick={deselectOnClick} value={"COMPLETED"}>
            Completed
          </Radio.Button>
          <Radio.Button onClick={deselectOnClick} value={"NOT_COMPLETED"}>
            Not Completed
          </Radio.Button>
        </Radio.Group>
        <div className="todos">
          {filterType === "COMPLETED" &&
            completedTodos.map((item, index) => (
              <Todo
                key={`${item}_${index}`}
                text={item.taskText}
                isEven={index % 2 === 0}
                todoId={item.id}
                isDone={item.isDone}
                handleDelete={handleDelete}
                todoStatus={item.isDone}
                handleCheck={handleCheck}
                handleEdit={handleEdit}
              />
            ))}
          {filterType === "NOT_COMPLETED" &&
            notCompletedTodos.map((item, index) => (
              <Todo
                key={`${item}_${index}`}
                text={item.taskText}
                isEven={index % 2 === 0}
                todoId={item.id}
                isDone={item.isDone}
                handleDelete={handleDelete}
                todoStatus={item.isDone}
                handleCheck={handleCheck}
                handleEdit={handleEdit}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
