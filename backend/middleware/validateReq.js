import { z, ZodError } from "zod";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Check if req.body exists
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
          message: "Request body is required",
          errors: [{ field: "body", message: "Request body cannot be empty" }]
        });
      }
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
     
      next();

    } catch (error) {
      if (error instanceof ZodError) {
        // Zod stores validation errors in 'issues'
        const errors = error.issues.map(err => ({
          field: err.path?.join('.') || 'root',
          message: err.message
        }));
       
        return res.status(400).json({
          message: "Validation failed",
          errors: errors
        });
      }
      // Handle other types of errors
      console.error("Non-Zod validation error:", error);
      return res.status(500).json({
        message: "Internal server error during validation"
      });
    }
  };
};