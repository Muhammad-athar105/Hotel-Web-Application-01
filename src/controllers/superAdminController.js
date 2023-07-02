 const Hotel = require('../models/hotel.model');

// Super admin can login in any hotel 
const superAdminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Fetch the hotel's login credentials from the database
  try {
    const hotel = await Hotel.findOne({ username, password });
    if (!hotel) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Super admin logged in successfully', token: 'TOKEN_VALUE' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};

// Enable or disable a hotel
const toggleHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    hotel.enabled = !hotel.enabled;
    await hotel.save();
    res.json({ message: 'Hotel enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hotel' });
  }
};

// Hotel Approve Section
const approveHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel registration approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve hotel registration' });
  }
};

// Hotel Reject Section
const rejectHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndRemove(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel registration rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject hotel registration' });
  }
};

module.exports = { superAdminLogin, toggleHotel, approveHotel, rejectHotel };

