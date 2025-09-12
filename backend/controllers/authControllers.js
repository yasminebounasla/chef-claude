import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { validatePassword } from "../utils/validatePassword.js"; 


export const register = async (req, res) => {
    const { email, password, confirmPassword, name } = req.body;
    
    try {
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

    } catch (err) {
        res.status(500).json({
            message: "Failed to register user",
            error: err.message
        });
    }
};


export const login = async (req, res) => {
    const {email , password } = req.body;

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ 
                message: "JWT_SECRET is not configured" 
            });
        }

        const userExist =await User.findOne({
            email : email.trim().toLowerCase()
        })

        if(!userExist) {
            return res.status(400).json({
                message : "User not found"
            })
        }

        const validPassword = await bcrypt.compare(password, userExist.password);
        if(!validPassword) {
            return res.status(400).json({
                 message : "Invalid password"
            })
        }

        const token = jwt.sign({ userId: userExist._id, name: userExist.name }, jwtSecret, { expiresIn: "1h" });

        res.status(201).json({
            message: "User login successfully",
            data : {userExist, token}
        })

    } catch(err) {
        res.status(500).json({
            message: "Login user failed",
            error: err.message
        })
    }
}