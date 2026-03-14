import express from 'express';
import { signup, signin } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
router.post('/signin', signin);

export default router;