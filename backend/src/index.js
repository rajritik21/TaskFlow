const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Initialize express app
const app = express();
const port = process.env.PORT || 5001;
dotenv.config();
const corsOptions = {
  origin: [
    'https://task-flow-f7jkica2n-rajritik21s-projects.vercel.app',
    'https://task-flow-r9ketxcd3-rajritik21s-projects.vercel.app',
    'https://task-flow-tau-teal.vercel.app',
    'https://task-flow-git-main-rajritik21s-projects.vercel.app',
    'https://task-flow-gc6fhky9m-rajritik21s-projects.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
    res.send("Server is running");
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager')
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', require('./routes/teams'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});