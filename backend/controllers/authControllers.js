import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const register = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return next(new AppError("JWT_SECRET is not configured", 500));
    }

    const existingUser = await User.findOne({
        email: email.toLowerCase() 
    });

    if (existingUser) {
        return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name 
    });

    const token = jwt.sign({ userId: user._id, name: user.name }, jwtSecret, { expiresIn: "1h" });
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        message: "User registered successfully",
        data: { user, token }
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return next(new AppError("JWT_SECRET is not configured", 500));
    }

    const userExist = await User.findOne({
        email: email.toLowerCase() 
    });

    if (!userExist) {
        return next(new AppError("Invalid email or password", 401));
    }

    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
        return next(new AppError("Invalid email or password", 401));
    }

    const token = jwt.sign({ userId: userExist._id, name: userExist.name }, jwtSecret, { expiresIn: "1h" });
    userExist.password = undefined;

    res.status(200).json({
        status: 'success',
        message: "User login successfully",
        data: { user: userExist, token }
    });
});

export const getProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const profile = await User.findById(userId).select('name email createdAt');
    
    if (!profile) {
        return next(new AppError("Profile not found", 404));
    }
    
    res.status(200).json({
        status: 'success',
        message: "Profile retrieved successfully",
        data: {
            id: profile._id,
            name: profile.name,
            email: profile.email,
            memberSince: profile.createdAt
        }
    });
});

export const deleteProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { password } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return next(new AppError("Password incorrect", 401));
    }

    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ 
        status: 'success',
        message: "Account deleted successfully" 
    });
});

export const editProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    
    const updates = {};

    if (name !== undefined) {
        updates.name = name;
    }

    if (email !== undefined) {
        const existingUser = await User.findOne({ 
            email: email.toLowerCase(), 
            _id: { $ne: userId } 
        });

        if (existingUser) {
            return next(new AppError("Email already in use", 400));
        }
        
        updates.email = email.toLowerCase();
    }

    const updatedProfile = await User.findByIdAndUpdate(
        userId,
        updates,
        { 
            new: true,
            runValidators: true,
            select: 'name email createdAt'
        }
    );
    
    if (!updatedProfile) {
        return next(new AppError("Profile not found", 404));
    }
    
    res.status(200).json({
        status: 'success',
        message: "Profile updated successfully",
        data: {
            id: updatedProfile._id,
            name: updatedProfile.name,
            email: updatedProfile.email,
            memberSince: updatedProfile.createdAt
        }
    });
});

export const changePassword = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
        return next(new AppError("Current password incorrect", 401));
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
        return next(new AppError("New password must be different from current password", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ 
        status: 'success',
        message: "Password updated successfully" 
    });
});