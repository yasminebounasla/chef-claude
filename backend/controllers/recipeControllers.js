import Recipe from "../models/recipeModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js"; 
import { AppError } from "../utils/AppError.js"; 

export const getHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
   
    const recipes = await Recipe.find({ userId });
   
    const message = recipes.length > 0 ? "History fetched successfully" : "Empty History";
    sendResponse(res, 200, true, message, recipes);
});

export const addToHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipe = await Recipe.create({
        userId,
        recipe: req.body.recipe,
        isFavorite: req.body.isFavorite || false
    });
   
    sendResponse(res, 201, true, "Recipe added to history successfully", recipe);
});
 
export const deleteHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
   
    const deletedRecipe = await Recipe.findOneAndDelete({
        _id: recipeId,
        userId
    });
   
    if (!deletedRecipe) {
        return next(new AppError("Recipe not found or doesn't belong to you", 404));
    }
   
    sendResponse(res, 200, true, "Recipe deleted successfully", deletedRecipe);
});

export const clearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await Recipe.deleteMany({ userId });
   
    const responseData = {
        deletedCount: result.deletedCount
    };

    sendResponse(res, 200, true, `Cleared ${result.deletedCount} recipes from history`, responseData);
});

export const addToFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const favoriteRecipe = await Recipe.create({
        userId,
        recipe: req.body.recipe,
        isFavorite: true
    });
   
    sendResponse(res, 201, true, "Recipe added to favorites successfully", favoriteRecipe);
});

export const toggleFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
   
    const recipe = await Recipe.findOne({
        _id: recipeId,
        userId
    });
   
    if (!recipe) {
        return next(new AppError("Recipe not found or doesn't belong to you", 404));
    }
   
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
   
    const message = `Recipe ${recipe.isFavorite ? 'added to' : 'removed from'} favorites`;
    sendResponse(res, 200, true, message, recipe);
});

export const getFavorites = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const favoriteRecipes = await Recipe.find({
        userId,
        isFavorite: true
    });
   
    const message = favoriteRecipes.length > 0 ? "Favorites fetched successfully" : "No favorite recipes";
    sendResponse(res, 200, true, message, favoriteRecipes);
});

export const removeFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
   
    const updatedRecipe = await Recipe.findOneAndUpdate(
        {
            recipeId: parseInt(recipeId), 
            userId
        },
        { isFavorite: false },
        { new: true }
    );
   
    if (!updatedRecipe) {
        return next(new AppError("Recipe not found or doesn't belong to you", 404));
    }
   
    sendResponse(res, 200, true, "Recipe removed from favorites successfully", updatedRecipe);
});