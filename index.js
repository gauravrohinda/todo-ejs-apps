require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Flash Messages
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI = "mongodb+srv://gjain0279:9r28zn14IYSs5Lwh@task-7.ostklop.mongodb.net/Task-7?retryWrites=true&w=majority&appName=task-7")
    .then(() => console.log('✅ MongoDB connected...'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Schema
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Home Route - Display Todos
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ date: -1 }); // Sort by latest
        res.render('index', { todos, messages: req.flash() });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Add Todo
app.post('/add', async (req, res) => {
    const { task, priority } = req.body;

    if (!task || !priority) {
        req.flash('error', 'Task and priority are required!');
        return res.redirect('/');
    }

    try {
        const newTodo = new Todo({ task, priority });
        await newTodo.save();
        req.flash('success', 'Task added successfully!');
    } catch (error) {
        req.flash('error', 'Error adding task!');
    }

    res.redirect('/');
});

// Mark as Completed
app.post('/complete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndUpdate(id, { completed: true });
        req.flash('success', 'Task marked as completed!');
    } catch (error) {
        req.flash('error', 'Error marking task as completed!');
    }
    res.redirect('/');
});

// Edit Todo
app.post('/edit', async (req, res) => {
    const { id, task, priority } = req.body;

    if (!task || !priority) {
        req.flash('error', 'Task and priority are required!');
        return res.redirect('/');
    }

    try {
        await Todo.findByIdAndUpdate(id, { task, priority });
        req.flash('success', 'Task updated successfully!');
    } catch (error) {
        req.flash('error', 'Error updating task!');
    }

    res.redirect('/');
});

// Delete Todo
app.post('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await Todo.findByIdAndDelete(id);
        req.flash('success', 'Task deleted successfully!');
    } catch (error) {
        req.flash('error', 'Error deleting task!');
    }
    res.redirect('/');
});

// Filter Todos by Priority
app.get('/filter/:priority', async (req, res) => {
    try {
        const filteredTodos = await Todo.find({ priority: req.params.priority }).sort({ date: -1 });
        res.render('index', { todos: filteredTodos, messages: req.flash() });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
