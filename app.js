const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDatabase = require('./src/database/connect.mongodb');
connectDatabase();

// Import routes
const superAdminRoutes = require('./src/routes/superAdminRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const hotelRoutes = require('./src/routes/hotelRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const checkUserAuth = require('./src/middleware/auth');
const {searchHotels,getTopRatedHotels }= require('./src/controllers/filterController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/hotels', hotelRoutes );
app.use('/rooms',checkUserAuth, roomRoutes);
app.use('/reservation', reservationRoutes);
app.use('/filter', searchHotels, getTopRatedHotels);
app.use('/review', reviewRoutes);
app.use('/password', checkUserAuth);
// router.use('/loggeduser', checkUserAuth);
app.use('/superAdmin', superAdminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
