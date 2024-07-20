const Users = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.register = async (req, res) => {
  try {
    const payload = req.body;
    const user = await Users.findOne({ email: payload.email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const otp = generateOTP();
    console.log(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60000); //valid for 10min
    payload.otp = otp;
    payload.otpExpire = otpExpiry;
    const newUser = new Users(payload);
    const content = `Your OTP code to confirm your email address is ${otp}. It will expire in 10 minutes.`;
    const sendOtp = await sendEmail(payload.email, "Your SignUp OTP", content);
    if (sendOtp) {
      newUser
        .save()
        .then((data) => {
          res.status(200).json({
            message: "User registered. Please check your email for the OTP.",
            data: data,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Error registering user.", err: err });
        });
    } else {
      res.status(500).json({ message: "Error sending email." });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP please check once again" });
    }
    user.otp = null;
    user.otpExpire = null;
    user.isVerified = true;
    user
      .save()
      .then(() => {
        res.status(200).json({ message: "User verified successfully" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Error verifying user", err: err });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }
    const otp = generateOTP();
    const content = `Your OTP code for login is ${otp}. It will expire in 10 minutes.`;
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60000);
    user.save().then(() => {
      const sendOtp = sendEmail(user.email, "Your Login OTP", content);
      if (!sendOtp) {
        return res.status(500).json({ message: "Error sending OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.otp = null;
    user.otpExpire = null;
    user.save().then(() => {
      let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 86400000),
      });
      res.status(200).send({ message: "Login successful" });
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProfileDetails = async (req, res) => {
  try {
    const id = req.id;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile details fetched successfully", user: user });
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.updateProfileDetails = async (req, res) => {
  try {
    const id = req.id;
    const { name, mobileNumber, gender, address, state, country } = req.body;
    const user = await Users.findByIdAndUpdate(
      id,
      {
        name,
        mobileNumber,
        gender,
        address,
        state,
        country,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile details updated successfully", user: user });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
