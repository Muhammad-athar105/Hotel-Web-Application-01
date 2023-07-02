const Hotel = require("../models/hotel.model");
const Review = require("../models/review.model");

// Create a new review for a room
const createReview = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { rating, comment } = req.body;

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId is required" });
    }

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const existingReview = await Review.findOne({ hotelId });

    if (existingReview) {
      return res.status(400).json({ message: "You already gave a review" });
    }

    const review = new Review({
      hotelId,
      rating,
      comment,
    });

    await review.save();

    // Calculate new average rating for the room
    const reviews = await Review.find({ hotel: hotelId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    hotel.rating = totalRating / reviews.length;
    await hotel.save();

    // Populate the hotel field in the review document
    const populatedReview = await Review.findById(review._id).populate(
      "hotelId"
    );

    // Return the room name in the response
    const reviewWithHotelName = {
      _id: populatedReview._id,
      hotelId: populatedReview.hotelId,
      rating: populatedReview.rating,
      comment: populatedReview.comment,
    };

    res.status(201).json(reviewWithHotelName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a review for a room
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a review for a room
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.deleteOne({ _id: reviewId });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createReview, updateReview, deleteReview };
