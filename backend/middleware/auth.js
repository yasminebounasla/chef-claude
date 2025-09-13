import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                message: "Not Authorized - No token provided"
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Invalid authorization format. Use 'Bearer <token>'"
            });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Not Authorized - Token missing"
            });
        }

        const decoded = jwt.verify(token, jwtSecret);
        req.user = { id: decoded.userId, name: decoded.name };
        
        next();

    } catch (err) {
        console.error("Token verification error:", err.message);
        
        //specific error messages
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });

        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token format" });

        } else {
            return res.status(401).json({ message: "Invalid Token" });
        }
    }
};