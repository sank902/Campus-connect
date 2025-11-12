// This is our "blueprint" for Event data
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  description: { type: String, required: true },
  registeredUsers: [{ type: String }] // We'll just store the user IDs
});

const Event = mongoose.model('Event', eventSchema);

export default Event;