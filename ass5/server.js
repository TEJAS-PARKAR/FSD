const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB connection failed:', err.message);
    console.log('Starting with in-memory database instead...');
  });

// Define Schema
const packageSchema = new mongoose.Schema({
  id: Number,
  name: String,
  destination: String,
  duration: String,
  price: Number,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  id: Number,
  packageId: Number,
  packageName: String,
  customerName: String,
  email: String,
  phone: String,
  travelers: Number,
  totalPrice: Number,
  bookingDate: { type: Date, default: Date.now }
});

// Models
const Package = mongoose.model('Package', packageSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// ROUTES

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Get all packages
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    if (packages.length === 0) {
      // Initialize with sample data
      const samplePackages = [
        {
          id: 1,
          name: 'Bali Paradise',
          destination: 'Bali, Indonesia',
          duration: '5 Days',
          price: 799,
          description: 'Experience the tropical beauty of Bali with beaches, temples, and cultural experiences.',
          image: 'https://via.placeholder.com/400x250?text=Bali+Paradise'
        },
        {
          id: 2,
          name: 'Tokyo Explorer',
          destination: 'Tokyo, Japan',
          duration: '7 Days',
          price: 1299,
          description: 'Discover modern Tokyo with traditional temples, street food, and shopping.',
          image: 'https://via.placeholder.com/400x250?text=Tokyo+Explorer'
        },
        {
          id: 3,
          name: 'Paris Romance',
          destination: 'Paris, France',
          duration: '4 Days',
          price: 999,
          description: 'Fall in love with the City of Light. Eiffel Tower, museums, and fine dining.',
          image: 'https://via.placeholder.com/400x250?text=Paris+Romance'
        },
        {
          id: 4,
          name: 'Safari Adventure',
          destination: 'Kenya, Africa',
          duration: '6 Days',
          price: 1499,
          description: 'Witness the Big Five and stunning African landscapes on an unforgettable safari.',
          image: 'https://via.placeholder.com/400x250?text=Safari+Adventure'
        }
      ];
      await Package.insertMany(samplePackages);
      return res.json(samplePackages);
    }
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single package
app.get('/api/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findOne({ id: req.params.id });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { packageId, packageName, customerName, email, phone, travelers, totalPrice } = req.body;
    
    if (!packageId || !customerName || !email || !phone || !travelers || !totalPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const bookingCount = await Booking.countDocuments();
    const booking = new Booking({
      id: bookingCount + 1,
      packageId,
      packageName,
      customerName,
      email,
      phone,
      travelers,
      totalPrice
    });

    await booking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new package (admin)
app.post('/api/packages', async (req, res) => {
  try {
    const { name, destination, duration, price, description, image } = req.body;
    
    if (!name || !destination || !price) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const packageCount = await Package.countDocuments();
    const newPackage = new Package({
      id: packageCount + 1,
      name,
      destination,
      duration: duration || '3 Days',
      price,
      description: description || 'Amazing travel experience',
      image: image || 'https://via.placeholder.com/400x250?text=Travel+Package'
    });

    await newPackage.save();
    res.status(201).json({ message: 'Package added!', package: newPackage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/packages`);
});
