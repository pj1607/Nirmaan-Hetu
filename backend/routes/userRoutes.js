import express from 'express';
import { register, login } from '../controllers/userControllers.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModels.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


export default router;
