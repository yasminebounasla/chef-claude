import express from "express";
import { getHistory, addToHistory, clearHistory, deleteHistory, addToFavorite, toggleFavorite, removeFavorite, getFavorites} from "../controllers/recipeControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/history', auth, getHistory);
router.post('/history', auth, addToHistory);
router.delete('/history', auth, clearHistory)
router.delete('/history',auth, deleteHistory);

router.post('/favorite', auth, addToFavorite);
router.delete('/favorite', auth, removeFavorite);
router.get('/favorite', auth, getFavorites);
router.get('/favorite', auth, toggleFavorite);


export default router;