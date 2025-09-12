import mongoose from "mongoose";
import User from "./userModel";

const recipeSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required: true   
    },
    recipe : String,
    isFavorite :  { type: Boolean, default : false}

} , { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);