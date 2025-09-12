import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : String,
    email : {type: String , unique : true},
    passwrod : String
} , { timestamps: true })

export default mongoose.model('User', userSchema);