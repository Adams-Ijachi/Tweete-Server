import express from 'express';

import { register,login, logout,getUser } from '../controllers/user.js';
import { auth } from './../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',auth ,logout);
router.post('/getUser',auth,  getUser)

export default router;