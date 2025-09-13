import Recipe from "../models/recipeModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getHistory =  catchAsync(async (req, res, next) => {
    const userId = req.user.id; 
    
    const recipes = await Recipe.find({ userId });
    
    res.status(200).json({
        message: recipes.length > 0 ? "History fetched successfully" : "Empty History",
        data: recipes
    });
});

export const addToHistory = catchAsync(async (req, res) => {
    const userId = req.user.id; 
    const recipe = await Recipe.create({
        userId,
        recipe: req.body.recipe,
        isFavorite: req.body.isFavorite || false
    });
    
    res.status(201).json({
        message: "Recipe added to history successfully",
        data: recipe
    });
});
 
export const deleteHistory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    
    const deletedRecipe = await Recipe.findOneAndDelete({
        _id: recipeId,
        userId 
    });
    
    if(!deletedRecipe){
        return res.status(404).json({
            message: "Recipe not found or doesn't belong to you"
        });
    }
    
    res.status(200).json({
        message: "Recipe deleted successfully",
        data: deletedRecipe
    });
});

export const clearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await Recipe.deleteMany({ userId });
    
    res.status(200).json({
        message: `Cleared ${result.deletedCount} recipes from history`,
        deletedCount: result.deletedCount
    });
});

export const addToFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const favoriteRecipe = await Recipe.create({
        userId,
        recipe: req.body.recipe,
        isFavorite: true
    });
    
    res.status(201).json({
        message: "Recipe added to favorites successfully",
        data: favoriteRecipe
    });
});

export const toggleFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    
    const recipe = await Recipe.findOne({
        _id: recipeId,
        userId
    });
    
    if(!recipe){
        return res.status(404).json({
            message: "Recipe not found or doesn't belong to you"
        });
    }
    
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    
    res.status(200).json({
        message: `Recipe ${recipe.isFavorite ? 'added to' : 'removed from'} favorites`,
        data: recipe
    });
});

export const getFavorites = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const favoriteRecipes = await Recipe.find({
        userId,
        isFavorite: true
    });
    
    res.status(200).json({
        message: favoriteRecipes.length > 0 ? "Favorites fetched successfully" : "No favorite recipes",
        data: favoriteRecipes
    });
});

export const removeFavorite = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    
    const updatedRecipe = await Recipe.findOneAndUpdate(
        {
            recipeId:parseInt(recipeId),
            userId
        },
        { isFavorite: false },
        { new: true }
    );
    
    if(!updatedRecipe){
        return res.status(404).json({
            message: "Recipe not found or doesn't belong to you"
        });
    }
    
    res.status(200).json({
        message: "Recipe removed from favorites successfully",
        data: updatedRecipe
    });
});