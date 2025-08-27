import express from 'express';
import { register, login ,getProfile,updateProfile,demoLogin} from '../controllers/userControllers.js';
import { verifyToken } from '../auth/auth.js';

const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

router.post('/register', register);
router.post('/login', login);

router.put("/update-profile", verifyToken, updateProfile);
router.get('/get-profile', verifyToken, getProfile);

router.post("/demo-login", demoLogin);

export default router;
