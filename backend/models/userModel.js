import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : String,
    email : {type: String , unique : true},
    passwrord : String
} , { timestamps: true })

export default mongoose.model('User', userSchema);