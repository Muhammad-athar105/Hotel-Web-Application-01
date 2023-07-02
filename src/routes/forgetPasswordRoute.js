const express = require('express');
const forgetPasswordController = require('../controllers/forgetPasswordController');
const router = express.Router();

//Routes
router.post('/send-reset-password-email', forgetPasswordController.sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token', forgetPasswordController.userPasswordReset);
router.post('/changepassword', forgetPasswordController.changeUserPassword);
//router.get('/loggeduser', forgetPasswordController.loggedUser);
