
import { useState, useEffect } from "react";
import io from 'socket.io-client';
import { nanoid } from "nanoid";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskNameEdit, setTaskNameEdit] = useState(taskName);
  const [edit, setEdit] = useState('');
  //const [editTask, setEditTask] = useState(taskName);

  useEffect(() => {
    setSocket(io("localhost:8000", { transports: ['websocket'] }));
  }, []);

  useEffect(() => {
    if(socket) {
      socket.on('updateData', (data) => updateTasks(data));
      socket.on('addTask', (task) => addTask(task));
      socket.on('editTask', (task) => editTask(task));
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

  const editTask = (taskId, taskNameEdit) => {
    setTasks(tasks.map(task => task.id === taskId ? { id: task.id, name: taskNameEdit } : task));
    setEdit('');
    console.log('tasks', tasks);
  }

  const submitEditTask = (e, taskId, taskNameEdit) => {
    e.preventDefault();
    editTask(taskId, taskNameEdit);
    socket.emit("editTask", {id: taskId, name: taskNameEdit});
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
              {edit !== task.id && <p>{task.name}</p>}
              {edit === task.id 
              && <form onSubmit={e => submitEditTask(e, task.id, taskNameEdit)}>
                <div className="editForm">
                  <input className="text-input" placeholder={taskNameEdit} type="text" value={taskNameEdit} onChange={(e) => setTaskNameEdit(e.target.value)} />
                  <button className="btn btn--green" type="submit">Save</button>
                </div>
                </form>}
              <div className="btns">
                <button className="btn btn--blue" onClick={() => setEdit(task.id)}>
                  Edit
                </button>
                <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>
                  Remove
                </button>
              </div>
            </li>)}
          </ul>
          <form id="add-task-form" onSubmit={e => submitForm(e)}>
            <input className="text-input" id="task-name" autocomplete="off" type="text" placeholder="Type your description" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </header>
    </div>
  );
}

export default App;
