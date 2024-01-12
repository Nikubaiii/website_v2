import React, { useState, useEffect } from 'react';
import '/Users/nikhilvelagapudi/Desktop/Projects/Website_V2/website_v2/web-v2/src/App.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  useEffect(() => {
    // Load tasks from the backend when the component mounts
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem = { text: newTask, date: newTaskDate, completed: false };
  
      // Save the new task to the backend
      fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskItem),
      })
        .then(response => response.json())
        .then(data => {
          setTasks(prevTasks => [...prevTasks, data]);
          setNewTask("");
          setNewTaskDate("");
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const toggleCompletion = (clickedTask) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === clickedTask._id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    // Update the task on the backend
    fetch(`http://localhost:3001/tasks/${clickedTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !clickedTask.completed }),
    })
      .then(response => response.json())
      .then(() => setTasks(updatedTasks))
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (clickedTask) => {
    const updatedTasks = tasks.filter(task => task._id !== clickedTask._id);

    // Delete the task on the backend
    fetch(`http://localhost:3001/tasks/${clickedTask._id}`, {
      method: 'DELETE',
    })
      .then(() => setTasks(updatedTasks))
      .catch(error => console.error('Error deleting task:', error));
  };

  const currentDate = new Date().toLocaleDateString();
  
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.date || "No Date";
    acc[date] = acc[date] || [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>Todo List</h1>
        <p className="current-date">{currentDate}</p>
      </div>
      <div className="todo-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
        >
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
          />
          <input
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            placeholder="Select date"
          />
          <button type="submit">Add Task</button>
        </form>
        {Object.keys(groupedTasks).map((date) => (
          <div key={date} className="date-group">
            <h3 className="section-header">{date}</h3>
            <ul className="task-list">
              {groupedTasks[date].map((task) => (
                <li key={task._id} className={task.completed ? "completed" : ""}>
                  <span>{task.text}</span>
                  <button onClick={() => toggleCompletion(task)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
