// This is our "blueprint" for Lost/Found Item data
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Lost', 'Found'], // Status must be one of these
    required: true 
  },
  description: { type: String },
  reporter: { type: String } // The ID of the user who reported it
});

const Item = mongoose.model('Item', itemSchema);

export default Item;