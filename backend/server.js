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
    
    // Determine user role (simple logic: admin email)
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'student';

    user = new User({
      name,
      email,
      password, // Password will be hashed by the 'pre-save' hook in user.model.js
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
    
    // Use the comparePassword method from the user model
    const isMatch = await user.comparePassword(password);
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

// --- Function to create demo events ---
const createDemoEvents = async () => {
  console.log("No events found. Creating demo events...");
  const demoEvents = [
    {
      title: "Tech-Connect: 2025 Placement Drive",
      date: "2025-11-20T09:00:00.000Z",
      location: "Auditorium Complex",
      description: "Final year placement drive. Top tech companies will be recruiting. Bring your resumes and be prepared for interviews.",
      registeredUsers: []
    },
    {
      title: "Innovate '25: 24-Hour Hackathon",
      date: "2025-11-28T18:00:00.000Z",
      location: "Engineering Building, Labs 101-105",
      description: "Join us for 24 hours of coding, innovation, and fun. Build a project, compete for prizes, and enjoy free food!",
      registeredUsers: []
    },
    {
      title: "Workshop: Intro to AI & Machine Learning",
      date: "2025-12-05T14:00:00.000Z",
      location: "Library Seminar Hall",
      description: "A 3-hour hands-on workshop on the fundamentals of AI/ML, led by Dr. Evelyn Reed. No prior experience required.",
      registeredUsers: []
    },
    {
      title: "Enigma '25: Annual Cultural Fest",
      date: "2025-12-15T17:00:00.000Z",
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
    
    if (events.length === 0) {
      await createDemoEvents();
      events = await Event.find().sort({ date: 1 });
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new event (for admin)
app.post('/api/events', authMiddleware, async (req, res) => {
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
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// === LOST & FOUND ROUTES ===

// --- Function to create demo items ---
const createDemoItems = async () => {
  console.log("No items found. Creating demo items...");
  const demoItems = [
    {
      item: "Blue Hydroflask Water Bottle",
      location: "Library, 2nd Floor",
      date: "2025-11-15T10:00:00.000Z",
      status: "Lost",
      description: "Lost my favorite water bottle. It has a 'Code' sticker on it.",
      reporter: "s12345", // Generic ID, won't match a real user
      imageUrl: "https://placehold.co/600x400/FFE4E6/F43F5E?text=Lost+Bottle"
    },
    {
      item: "Set of Keys on Red Lanyard",
      location: "Main Quad, by the fountain",
      date: "2025-11-16T14:30:00.000Z",
      status: "Found",
      description: "Found a set of keys with a car remote and a small red lanyard. Turned into the Admin Office.",
      reporter: "a001", // Generic ID, won't match a real user
      imageUrl: "https://placehold.co/600x400/BFDBFE/3B82F6?text=Found+Keys"
    },
    {
      item: "Black Ray-Ban Sunglasses",
      location: "Cafeteria (South)",
      date: "2025-11-16T12:00:00.000Z",
      status: "Lost",
      description: "Left my sunglasses on a table near the window.",
      reporter: "s56789", // Generic ID
      imageUrl: "https://placehold.co/600x400/FFE4E6/F43F5E?text=Lost+Sunglasses"
    },
    {
      item: "Student ID Card",
      location: "Engineering Building, Hallway",
      date: "2025-11-17T09:15:00.000Z",
      status: "Found",
      description: "Found a Student ID card for 'Alex Johnson'. It's at the front desk of the building.",
      reporter: "a001", // Generic ID
      imageUrl: "https://placehold.co/600x400/BFDBFE/3B82F6?text=Found+ID"
    }
  ];

  try {
    await Item.insertMany(demoItems);
    console.log("Demo items created successfully!");
  } catch (err) {
    console.error("Error creating demo items:", err);
  }
};

// GET all items (lost and found)
app.get('/api/items', authMiddleware, async (_req, res) => {
  try {
    let items = await Item.find().sort({ date: -1 }); // Newest first

    if (items.length === 0) {
      await createDemoItems();
      items = await Item.find().sort({ date: -1 });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new item (lost or found)
app.post('/api/items', authMiddleware, async (req, res) => {
  const { item, location, date, status, description, imageUrl } = req.body;
  const newItem = new Item({ 
    item, 
    location, 
    date, 
    status, 
    description, 
    imageUrl,
    reporter: req.user.id // Use authenticated user's ID
  });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- NEW ROUTE ---
// DELETE an item
app.delete('/api/items/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the user is the owner or an admin
    if (item.reporter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await item.deleteOne(); // Replaces .remove() which is deprecated
    
    res.json({ message: 'Item removed successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- 4. Start The Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});