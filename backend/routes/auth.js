import express from "express";
import { register, login, getProfile, editProfile, deleteProfile } from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/register', register);
router.post('/login', login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth,  editProfile);
router.delete('/profile', auth, deleteProfile);

export default router;