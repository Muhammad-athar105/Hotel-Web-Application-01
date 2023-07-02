const Room = require('../models/room.model')
// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { hotelId, roomNumber, ...roomData } = req.body;

    // Check if a room with the same room number already exists
    // const existingRoom = await Room.findOne({ roomNumber });
    // if (existingRoom) {
    //   return res.status(409).json({ error: 'Room with the same room number already exists' });
    // }

    const room = new Room({
      hotelId,
      roomNumber,
      ...roomData
    }); // Create a new room instance

    await room.save(); // Save the room to the database

    res.status(201).json({ message: "Successfully added the room" });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};


// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(req.params.roomId).populate('hotelId');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({message: "Room Updated Successfully"});
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


