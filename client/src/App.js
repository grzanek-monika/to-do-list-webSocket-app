
import { useState, useEffect } from "react";
import io from 'socket.io-client';
import { nanoid } from "nanoid";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    setSocket(io("localhost:8000", { transports: ['websocket'] }));
  }, []);

  useEffect(() => {
    if(socket) {
      socket.on('updateData', (data) => updateTasks(data));
      socket.on('addTask', (task) => addTask(task));
      socket.on('removeTask', (id) => removeTask(id));
    }
  }, [socket]);
  
  const updateTasks = tasksData => {
    setTasks(tasksData);
  }

  const removeTask = (id, local) => {
    setTasks((tasks => tasks.filter(task => task.id !== id)));
    if(local) {
      socket.emit("removeTask", id);
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    const task = {id: nanoid(), name: taskName}
    addTask(task);
    setTaskName('');
    socket.emit("addTask", task);
  }

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
    console.log("tasks:", tasks);
  }

  
  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => 
            <li className="task" key={task.id}>
              {task.name}
              <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>
                Remove
              </button>
            </li>)}
          </ul>
          <form id="add-task-form" onSubmit={e => submitForm(e)}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" value={taskName} onChange={(e) => setTaskName(e.currentTarget.value)} id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </header>
    </div>
  );
}

export default App;
