const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Task schema
const taskSchema = new mongoose.Schema({
  text: String,
  date: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// API endpoint to get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// API endpoint to add a new task
app.post('/tasks', async (req, res) => {
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      res.json(newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Failed to add task', details: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
