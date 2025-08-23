import express from 'express';
import { register, login ,getProfile,updateProfile} from '../controllers/userControllers.js';
import { verifyToken } from '../auth/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.put("/update-profile", verifyToken, updateProfile);
router.get('/get-profile', verifyToken, getProfile);


export default router;
