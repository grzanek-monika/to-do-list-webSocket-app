import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            <li className="task">Shopping <button className="btn btn--red">Remove</button></li>
            <li className="task">Go out with a dog <button className="btn btn--red">Remove</button></li>
          </ul>
          <form id="add-task-form">
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </header>
    </div>
  );
}

export default App;
