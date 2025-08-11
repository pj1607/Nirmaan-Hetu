import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

//REGISTER
export const register = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;
    const confirmpassword = req.body.confirmPassword
    const role = req.body.role

    if (!username || !email || !password || !confirmpassword || !role){
      return res.status(400).json({
        error: 'Please fill in all the required details.',
        success: 'no'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address.',
        success: 'no'
      });
    }

    if (username.length < 4) {
      return res.status(400).json({
        error: 'Username must be at least 4 characters long.',
        success: 'no'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long.',
        success: 'no'
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        message: 'Email already exists, please try with another',
        success: 'no'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '2d'  
    });

    res.status(201).json({
      message: 'User registered successfully',
      success: 'yes',
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token  
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: 'no'
    });
  }
};
//Login
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password;
    const requestedRole = req.body.role; 

    if (!email || !password || !requestedRole) {
      return res.status(400).json({
        error: 'Please fill in all the required details including role.',
        success: 'no'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        success: 'no'
      });
    }

    if (user.role !== requestedRole) {
      return res.status(403).json({
        message: `You do not have access as ${requestedRole}`,
        success: 'no'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
        success: 'no'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: 'yes',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: 'no'
    });
  }
};
