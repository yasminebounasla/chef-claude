import mongoose from "mongoose";
import { getNextSequence } from "./counterModel.js";

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },
   
    name: {
        type: String,
        required: true,
        trim: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
   
    password: {
        type: String,
        required: true
    }
   
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isNew) return next();
   
    try {
        this.userId = await getNextSequence('user');
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);