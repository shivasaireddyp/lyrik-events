const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require('../utils/emailUtils.js');
require("dotenv").config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.isVerified) {
        // (Optional: We can add resend logic here later)
        return res.status(400).json({ message: 'This email is already registered but not verified. Please check your inbox.' });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {

      const verificationToken = generateToken(user._id, '1h');

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      const emailHtml = `
        <h1>Welcome to FestApp!</h1>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Please Verify Your Email for FestApp',
        html: emailHtml,
      });

      res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id, user.role),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });

    // Generate a new token
    const token = generateToken(user._id, '1h');


    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    
    const emailHtml = `
      <h2>Hello again, ${user.name}!</h2>
      <p>Here’s a new verification link for your account:</p>
      <a href="${verifyLink}" 
         style="background:#2563EB;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `

      await sendEmail({
        to: user.email,
        subject: 'Please Verify Your Email for FestApp',
        html: emailHtml,
      });


    res.status(200).json({ message: "Verification email resent successfully!" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};


// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

      if (!user.isVerified) {
        return res.status(403).json({
          message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        });
      }

      res.json({
        message: "Login successful",
        token: generateToken(user._id, user.role),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.body;

  console.log(token)

  if (!token) {
    return res.status(400).json({ message: 'Verification token is missing.' });
  }

  try {
    // 1. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3. Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // 4. Update the user to be verified
    user.isVerified = true;
    await user.save();

    // 5. Respond with success, a new login token, and user data
    res.json({
      message: 'Email verified successfully! You are now logged in.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id), // Generate a standard login token
    });
  } catch (error) {
    // This will catch expired or invalid tokens
    console.error('Email verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired verification link.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification
};
