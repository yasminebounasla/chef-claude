import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { validatePassword } from "../utils/validatePassword.js"; 
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req,res, next) => {

    const { email, password, confirmPassword, name } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ 
            message: "JWT_SECRET is not configured" 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordErr = validatePassword(password);
    if (passwordErr) {
        return res.status(400).json({ message: passwordErr });
    }

    if (password !== confirmPassword) { 
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({
        email: email.trim().toLowerCase()
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name.trim()
    });

    const token = jwt.sign({ userId: user._id, name: user.name }, jwtSecret, { expiresIn: "1h" });
    user.password = undefined;

    res.status(201).json({
        message: "User registered successfully",
        data: { user, token }
    });

    
});

export const login = catchAsync (async (req, res, next) => {
    const {email , password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ 
            message: "JWT_SECRET is not configured" 
        });
    }

    const userExist = await User.findOne({
        email : email.trim().toLowerCase()
    });

    if(!userExist) {
        return res.status(400).json({
            message : "User not found"
        });
    }

    const validPassword = await bcrypt.compare(password, userExist.password);
    if(!validPassword) {
        return res.status(400).json({
            message : "Invalid password"
        });
    }

    const token = jwt.sign({ userId: userExist._id, name: userExist.name }, jwtSecret, { expiresIn: "1h" });
    
    userExist.password = undefined;

    res.status(200).json({
        message: "User login successfully",
        data : {user: userExist, token}
    });
});

export const getProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const profile = await User.findById(userId).select('name email createdAt');
    
    if (!profile) {
        return res.status(404).json({
            message: "Profile not found"
        });
    }
    
    res.status(200).json({
        message: "Profile retrieved successfully",
        data: {
            id: profile._id,
            name: profile.name,
            email: profile.email,
            memberSince: profile.createdAt
        }
    });

});


export const deleteProfile = catchAsync (async (req, res, next) => {
    const userId = req.user.id;
    const { password } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: "Password incorrect" });
    }

    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "Account deleted successfully" });
});


export const editProfile = catchAsync (async (req, res, next) => {
    const userId = req.user.id;
    
    const { name, email } = req.body;
    const updates = {};

    if (name !== undefined) {
        if (!name.trim()) {
            return res.status(400).json({ message: "Name cannot be empty" });
        }
        updates.name = name.trim(); 
    }

    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
            email: email.trim().toLowerCase(),
            _id: { $ne: userId } 
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        
        updates.email = email.trim().toLowerCase(); 
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
        return res.status(404).json({
            message: "Profile not found"
        });
    }
    
    res.status(200).json({
        message: "Profile updated successfully",
        data: {
            id: updatedProfile._id,
            name: updatedProfile.name,
            email: updatedProfile.email,
            memberSince: updatedProfile.createdAt
        }
    });

});

export const changePassword = catchAsync(async  (req, res, next) => {
    
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if(newPassword !== confirmNewPassword) {
        return res.status(400).json({
            message : "Passwords don't match"
        })
    }

    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({
            message : "user not found"
        })
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if(!validPassword){
        return res.status(401).json({
            message: "Current password incorrect"
        })
    }

    const passwordErr = validatePassword(newPassword);
    if(passwordErr) {
        return res.status(400).json({
            message : passwordErr
        })
    }

    const samepassword = await bcrypt.compare(newPassword, user.password);
    if(samepassword) {
        return res.status(400).json({ message: "New password must be different" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate( userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });

});