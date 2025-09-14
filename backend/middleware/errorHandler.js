import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    
    // Invalid MongoDB ID 
    if (err.name === 'CastError') {
        message = 'Invalid ID format';
        statusCode = 400;
    }
    
    // user already exists
    if (err.code === 11000) {
        message = 'This email is already registered';
        statusCode = 400;
    }
    
    // Missing required fields
    if (err.name === 'ValidationError') {
        message = 'Please fill in all required fields';
        statusCode = 400;
    }
    
    // Invalid or expired JWT token
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        message = 'Please log in again';
        statusCode = 401;
    }

    // Send the error response
    res.status(statusCode).json({
        status: 'error',
        message: message
    });
};