import Recipe from "../models/recipeModel.js";

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const recipes = await Recipe.find({ userId });
        
        res.status(200).json({
            message: recipes.length > 0 ? "History fetched successfully" : "Empty History",
            data: recipes
        });
    } catch(err) {
        res.status(500).json({
            message: "Fetch data failed",
            error: err.message
        });
    }
};


export const addToHistory = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({
            message: "Add recipe to history failed",
            error: err.message
        });
    }
};
 
export const deleteHistory = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({
            message: "Delete recipe failed",
            error: err.message
        });
    }
};

export const clearHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await Recipe.deleteMany({ userId });
        
        res.status(200).json({
            message: `Cleared ${result.deletedCount} recipes from history`,
            deletedCount: result.deletedCount
        });
    } catch(err) {
        res.status(500).json({
            message: "Clear history failed",
            error: err.message
        });
    }
};

export const addToFavorite = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({
            message: "Failed to add recipe to favorites",
            error: err.message
        });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({
            message: "Toggle favorite failed",
            error: err.message
        });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const favoriteRecipes = await Recipe.find({
            userId,
            isFavorite: true
        });
        
        res.status(200).json({
            message: favoriteRecipes.length > 0 ? "Favorites fetched successfully" : "No favorite recipes",
            data: favoriteRecipes
        });
    } catch(err) {
        res.status(500).json({
            message: "Fetch favorites failed",
            error: err.message
        });
    }
};

export const removeFavorite = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({
            message: "Remove favorite failed",
            error: err.message
        });
    }
};