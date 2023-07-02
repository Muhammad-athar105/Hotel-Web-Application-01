const Hotel = require('../models/hotel.model');
const Review = require('../models/review.model');
const Room = require('../models/room.model');

// Get top-rated hotels
const getTopRatedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ rating: -1 }).limit(10);
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const searchHotels = async (req, res) => {
  try {
    const { hotelName, hotelAddress, minPrice, maxPrice, roomType, amenities, sector, checkIn, checkOut, persons, rooms } = req.query;
    const query = {};

    if (hotelName) {
      query.hotelName = { $regex: hotelName, $options: 'i' };
    }

    if (hotelAddress) {
      query.hotelAddress = { $regex: hotelAddress, $options: 'i' };
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice) };
    }

    if (roomType) {
      query['rooms.roomType'] = { $regex: roomType, $options: 'i' };
    }

    if (amenities) {
      query['rooms.amenities'] = { $regex: amenities, $options: 'i' };
    }

    if (sector) {
      query.sector = { $regex: sector, $options: 'i' };
    }

    // Check-in and Check-out date filtering
    if (checkIn && checkOut) {
      query['rooms.availableDates.checkIn'] = { $lte: new Date(checkOut) };
      query['rooms.availableDates.checkOut'] = { $gte: new Date(checkIn) };
    }

    // Number of persons filtering
    if (persons) {
      query['rooms.capacity.persons'] = { $gte: parseInt(persons) };
    }

    // Number of rooms filtering
    if (rooms) {
      query['rooms.quantity'] = { $gte: parseInt(rooms) };
    }

    const hotels = await Hotel.find(query);
    // const roo = await Room.find(query);

    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Sorry, we cannot find any hotels matching your search criteria.' });
    }

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getTopRatedHotels, searchHotels };





















// const searchHotels = async (req, res) => {
//   try {
//     const { hotelName, hotelAddress, minPrice, maxPrice, roomType, facilities, sector, checkIn, checkOut, persons, rooms, topRated } = req.query;
//     const queryBuilder = Hotel.find();

//     if (hotelName) {
//       queryBuilder.where('hotelName').equals(hotelName);
//     }

//     if (hotelAddress) {
//       queryBuilder.where('hotelAddress').regex(new RegExp(hotelAddress, 'i'));
//     }

//     if (minPrice && maxPrice) {
//       queryBuilder.where('rooms.price').gte(parseInt(minPrice)).lte(parseInt(maxPrice));
//     } else if (minPrice) {
//       queryBuilder.where('rooms.price').gte(parseInt(minPrice));
//     } else if (maxPrice) {
//       queryBuilder.where('rooms.price').lte(parseInt(maxPrice));
//     }

//     if (roomType) {
//       const roomId = await Room.distinct('_id', { roomType: new RegExp(roomType, 'i') });
//       queryBuilder.where('rooms').in(roomId);
//     }

//     if (facilities) {
//       queryBuilder.where('rooms.facilities').regex(new RegExp(facilities, 'i'));
//     }

//     if (sector) {
//       queryBuilder.where('sector').regex(new RegExp(sector, 'i'));
//     }

//     if (checkIn && checkOut) {
//       queryBuilder.where('rooms.checkIn').lte(new Date(checkOut));
//       queryBuilder.where('rooms.checkOut').gte(new Date(checkIn));
//     }

//     if (persons) {
//       queryBuilder.where('rooms.persons').gte(parseInt(persons));
//     }

//     if (rooms) {
//       queryBuilder.where('rooms.quantity').gte(parseInt(rooms));
//     }

//     if (topRated) {
//       queryBuilder.populate({
//         path: 'reviews',
//         model: 'Review',
//         options: { sort: { rating: -1 }, limit: 1 }
//       });
//     }

//     const hotels = await queryBuilder.exec();

//     if (hotels.length === 0) {
//       return res.status(404).json({ message: 'Sorry, we cannot find any hotels matching your search criteria.' });
//     }

//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = searchHotels;


// app.get('/hotels', async (req, res) => {
//   try {
//     const queryBuilder = Hotel.find();

//     // Example: Filter by hotel name
//     const hotelName = req.query.name;
//     if (hotelName) {
//       queryBuilder.where({ name: hotelName }).regex(new RegExp(hotelName, 'i'));
//     }

//     // Example: Sort by hotel rating
//     queryBuilder.sort('-rating');

//     // Example: Limit the number of results
//     const limit = parseInt(req.query.limit) || 10;
//     queryBuilder.limit(limit);

//     // Execute the query
//     const hotels = await queryBuilder.exec();

//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
