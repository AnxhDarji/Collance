import express from 'express';
import { signup, signin, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google-login', googleLogin);

export default router;