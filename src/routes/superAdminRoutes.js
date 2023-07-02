const express = require('express');
const router = express.Router();
const {
  superAdminLogin,
  toggleHotel,
  approveHotel,
  rejectHotel
} = require('../controllers/superAdminController');


//Routes
// router.put('/enable/:id', superAdminLogin);
router.put('/enable/:id', toggleHotel);
router.put('/approve/:id/accept', approveHotel);
router.delete('/approve/:id/reject', rejectHotel);

//Export the routers
module.exports = router;
