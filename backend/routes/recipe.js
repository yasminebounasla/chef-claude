import express from "express";
import { 
    getHistory, 
    addToHistory, 
    clearHistory, 
    deleteHistory, 
    addToFavorite, 
    toggleFavorite, 
    removeFavorite, 
    getFavorites 
} from "../controllers/recipeControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// History routes
router.get('/history', auth, getHistory);
router.post('/history', auth, addToHistory);
router.delete('/history', auth, clearHistory);  
router.delete('/history/:recipeId', auth, deleteHistory);  

// Favorite routes
router.get('/favorites', auth, getFavorites);  
router.post('/favorites', auth, addToFavorite); 
router.put('/favorites/:recipeId/toggle', auth, toggleFavorite);  
router.delete('/favorites/:recipeId', auth, removeFavorite);  

export default router;