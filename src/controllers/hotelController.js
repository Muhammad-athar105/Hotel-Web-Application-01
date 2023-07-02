const Hotel = require("../models/hotel.model");
const Room = require("../models/room.model");
const Review = require("../models/review.model");
const multer = require("multer");
// const path = require("path");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const accessTokenSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    let hotel = await Hotel.findOne(
      { email: req.body.email },
      { _id: 1, name: 1, email: 1, password: 1 }
    );
    if (hotel?.password == req.body.password) {
      // replace password checking with crypt algo.

      //create jwt
      let accessToken = jwt.sign(
        { _id: hotel._id, name: hotel.name },
        accessTokenSecret
      );

      let hotel_data = {
        _id: hotel._id,
        name: hotel.name,
        email: hotel.email,
        //role:user.role,
        accessToken,
      };

      res
        .status(200)
        .json({ status: 200, data: hotel_data, message: "User logged in" });
    } else {
      res
        .status(404)
        .json({ status: 404, data: [], message: "Invalid email or password" });
    }
  } catch (e) {
    res.status(500).json({ status: 500, data: [], message: e.message });
  }
};
const createHotel = async (req, res) => {
  try {
    // Upload profile picture
    uploadMiddleware(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.json({ message: "File upload error" });
      } else if (err) {
        console.log(err);
        return res.json({ message: "Unknown error" });
      }

      // Check if a profile picture was uploaded
      if (req.files && req.files.length > 0) {
        const file = req.files[0];
        req.body.profilePics = {
          data: file.buffer,
          contentType: file.mimetype,
        };
      }

      // Create the hotel
      const hotel = new Hotel(req.body);
      await hotel.save();

      return res.status(201).json({ message: "Hotel created successfully" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const createHotel = async (req, res) => {
//   try {
//     const hotel = new Hotel(req.body);
//     await hotel.save();
//     res.status(201).json({ message: "Hotel created successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get all hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Hotel by id
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const rooms = await Room.find({ hotelId: req.params.id });
    const reviews = await Review.find({ hotelId: req.params.id });
    if (hotel) {
      res.json({ hotel, rooms, reviews });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      hotel.set(req.body);

      // Check if a new profile picture was uploaded
      if (req.file) {
        hotel.profilePic = req.file.filename;
      }

      await hotel.save();
      res.json({ message: "Hotel successfully updated" });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (hotel) {
      res.json({ message: "Hotel deleted" });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + Date.now() + file.originalname);
  },
});

// Create multer upload instance
const uploadMiddleware = multer({ storage: storage }).array("profilePics", 5);

const uploadHandler = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      res.json({ message: "Unknown error" });
    } else {

      if (req.files && req.files.length > 0) {
        req.body.profilePics = req.files.map((file) => file.filename);
        res.json({ message: "Files uploaded successfully" });
      } else {
        res.json({ message: "No files uploaded" });
      }
      next();
    }
  });
};

module.exports = {
  login,
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  uploadMiddleware,
  uploadHandler,
};
