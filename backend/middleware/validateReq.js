import { z, ZodError } from "zod";

export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source]; // body, query, params
      if (!dataToValidate || typeof dataToValidate !== 'object') {
        return res.status(400).json({
          message: `Request ${source} is required`,
          errors: [{ field: source, message: `Request ${source} cannot be empty` }]
        });
      }
      
      const validatedData = schema.parse(dataToValidate);
      req[source] = validatedData; 
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