# Wanderlust Travels - Travel Agency Website

A simple, functional travel agency website built with Node.js, Express, and MongoDB.

## Features

- **Browse Packages**: View all available travel packages
- **Book Packages**: Book a travel package with customer details
- **View Bookings**: See all confirmed bookings
- **Admin Panel**: Add new travel packages
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Additional**: Body-parser, CORS

## Project Structure

```
travel-agency/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env                     # Environment variables
└── public/
    ├── index.html           # Home page
    ├── packages.html        # All packages page
    ├── book.html            # Booking form
    ├── bookings.html        # View bookings
    ├── admin.html           # Admin add package
    └── style.css            # All styles
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup
#### Option A: Using Local MongoDB
- Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  - Windows: `mongod` in terminal
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

#### Option B: Using MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Copy your connection string
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel_agency?retryWrites=true&w=majority
   ```

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Access the Website
- **Home**: http://localhost:3000/
- **All Packages**: http://localhost:3000/packages.html
- **View Bookings**: http://localhost:3000/bookings.html
- **Admin Panel**: http://localhost:3000/admin.html

## API Endpoints

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create new package (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings

## Sample Data

When you first access the packages endpoint, the app automatically seeds 4 sample packages:
1. Bali Paradise - 5 Days - $799
2. Tokyo Explorer - 7 Days - $1,299
3. Paris Romance - 4 Days - $999
4. Safari Adventure - 6 Days - $1,499

## For Development

Use nodemon for auto-restart:
```bash
npm install -D nodemon
npm run dev
```

## Notes

- The app works without MongoDB (graceful fallback) but data won't persist
- Sample packages are auto-loaded on first access
- All bookings are saved to MongoDB (if available)
- Admin panel has no authentication - add security for production

## License

ISC
