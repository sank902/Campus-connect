import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import our models
import Event from './models/event.model.js';
import Item from './models/item.model.js';
import User from './models/user.model.js';

// Import auth middleware
import authMiddleware from './middleware/auth.js';

// Load environment variables
dotenv.config();

// --- 1. App & Middleware Setup ---
const app = express();
const PORT = process.env.PORT || 5001; // Use port 5001
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors()); 
app.use(express.json());

// --- 2. Database Connection ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- 3. API Routes ---

app.get('/', (_req, res) => {
  res.send('Campus Connect Backend is running!');
});

// --- AUTH ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Determine user role (simple logic: admin email)
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'student';

    user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '3h' }, // Token expires in 3 hours
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: payload.user // Send user info back to frontend
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// === EVENT ROUTES ===

// --- NEW: Function to create demo data ---
const createDemoEvents = async () => {
  console.log("No events found. Creating demo events...");
  // Note: Dates are set for late 2025
  const demoEvents = [
    {
      title: "Tech-Connect: 2025 Placement Drive",
      date: "2025-11-20T09:00:00.000Z", // Nov 20, 2025
      location: "Auditorium Complex",
      description: "Final year placement drive. Top tech companies will be recruiting. Bring your resumes and be prepared for interviews.",
      registeredUsers: []
    },
    {
      title: "Innovate '25: 24-Hour Hackathon",
      date: "2025-11-28T18:00:00.000Z", // Nov 28, 2025
      location: "Engineering Building, Labs 101-105",
      description: "Join us for 24 hours of coding, innovation, and fun. Build a project, compete for prizes, and enjoy free food!",
      registeredUsers: []
    },
    {
      title: "Workshop: Intro to AI & Machine Learning",
      date: "2025-12-05T14:00:00.000Z", // Dec 5, 2025
      location: "Library Seminar Hall",
      description: "A 3-hour hands-on workshop on the fundamentals of AI/ML, led by Dr. Evelyn Reed. No prior experience required.",
      registeredUsers: []
    },
    {
      title: "Enigma '25: Annual Cultural Fest",
      date: "2025-12-15T17:00:00.000Z", // Dec 15, 2025
      location: "Main Campus Grounds",
      description: "Get ready for three days of music, dance, art, and celebration. Featuring live bands, food stalls, and competitions.",
      registeredUsers: []
    }
  ];

  try {
    await Event.insertMany(demoEvents);
    console.log("Demo events created successfully!");
  } catch (err) {
    console.error("Error creating demo events:", err);
  }
};

// GET all events
app.get('/api/events', authMiddleware, async (_req, res) => {
  try {
    let events = await Event.find().sort({ date: 1 });
    
    // --- NEW SEEDING LOGIC ---
    // If the database is empty, create demo events
    if (events.length === 0) {
      await createDemoEvents();
      // Re-fetch the events after creating them
      events = await Event.find().sort({ date: 1 });
    }
    // --- END NEW LOGIC ---

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new event (for admin)
app.post('/api/events', authMiddleware, async (req, res) => {
  // Admin check
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { title, date, location, description } = req.body;
  const newEvent = new Event({ 
    title, 
    date, 
    location, 
    description,
    registeredUsers: []
  });
  
  try {
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST to register for an event (for student)
app.post('/api/events/:id/register', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const userId = req.user.id;
    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
      await event.save();
    }
    // Return the updated event
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// === LOST & FOUND ROUTES ===

// GET all items (lost and found)
app.get('/api/items', authMiddleware, async (_req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 }); // Newest first
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new item (lost or found)
app.post('/api/items', authMiddleware, async (req, res) => {
  const { item, location, date, status, description } = req.body;
  const newItem = new Item({ 
    item, 
    location, 
    date, 
    status, 
    description, 
    reporter: req.user.id // Use authenticated user's ID
  });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 4. Start The Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});