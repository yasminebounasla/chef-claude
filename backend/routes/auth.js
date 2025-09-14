import express from "express";
import { register, login, getProfile, editProfile, deleteProfile , changePassword} from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { registerValidation, loginValidation, changePasswordValidation, editProfileValidation, deleteProfileValidation } from "../utils/authValidator.js";
import { validateRequest } from "../middleware/validateReq.js";

const router = express.Router()

router.post('/register', authLimiter, validateRequest(registerValidation), register);
router.post('/login', authLimiter,validateRequest(loginValidation), login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateRequest(editProfileValidation),  editProfile);
router.delete('/profile', auth, validateRequest(deleteProfileValidation), deleteProfile);
router.put('/profile/password', auth, validateRequest(changePasswordValidation), changePassword)

export default router;