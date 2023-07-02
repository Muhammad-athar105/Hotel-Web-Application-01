const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  roomType: 
  { 
    type: String, 
    required: true 
  },
  roomSize: 
  { 
    type: Number,
     equired: true 
  },
  roomNumber: 
  { 
    type: Number, 
    required: true 
  },
  occupancy:
   { 
    type: Number, 
    required: true 
  },
  bedTypes: 
  { 
    type: String, 
    required: true 
  },
  price: 
  { 
    type: Number, 
    required: true 
  },
  roomView: 
  { type: String, 
    required: true 
  },
  amenities: 
  { 
    type: [String], required: true 
  },
  bookingPolicy: 
  { 
    type: String, 
    required: true 
  },
 
});


//module.exports= mongoose.model('Room', roomSchema);

//export default mongoose.model.Rooms || mongoose.model('Room', roomSchema)
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
