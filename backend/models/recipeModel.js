import mongoose from "mongoose";
import User from "./userModel.js";
import { getNextSequence } from "./counterModel.js";

const recipeSchema = new mongoose.Schema({
    recipeId: {
        type: Number,
        unique: true
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true   
    },
    recipe: String,
    isFavorite: { type: Boolean, default: false }

}, { timestamps: true });

recipeSchema.pre('save', async function(next) {
    if (!this.isNew) return next();
    
    try {
        this.recipeId = await getNextSequence('recipe');
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model("Recipe", recipeSchema);