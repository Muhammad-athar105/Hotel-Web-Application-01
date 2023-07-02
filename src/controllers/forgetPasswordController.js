const Hotel = require("../models/hotel.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ForgetPassword {
  //Change User Password
  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await Hotel.findByIdAndUpdate(req.hotel._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "Password changed succesfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ hotel: req.user });
  };

  //Send User Password Reset Email
  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const hotel = await Hotel.findOne({ email: email });
      if (hotel) {
        const secret = hotel._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ hotelID: hotel._id }, secret, {
          expiresIn: "40m",
        });
        const link = `http://127.0.0.1:3000/api/user/reset/${hotel._id}/${token}`;
        console.log(link);

        // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: hotel.email,
          subject: " Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`,
        });
        res.send({
          status: "success",
          message: "Password Reset Email Sent... Please Check Your Email",
        });
      } else {
        res.send({ status: "failed", message: "Email doesn't exists" });
      }
    } else {
      res.send({ status: "failed", message: "Email Field is Required" });
    }
  };

  //User Password Reset
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const hotel = await Hotel.findById(id);
    const new_secret = hotel._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            status: "failed",
            message: "New Password and Confirm New Password doesn't match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await Hotel.findByIdAndUpdate(hotel._id, {
            $set: { password: newHashPassword },
          });
          res.send({
            status: "success",
            message: "Password Reset Successfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid Token" });
    }
  };
}

export default ForgetPassword;
