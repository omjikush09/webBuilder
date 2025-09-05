import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export interface ValidationErrorResponse {
	success: false;
	error: "Validation error";
	details: string;
	fields?: Record<string, string[]>;
}

export const validateRequest = (schema: ZodObject<any>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validate request using the provided schema (body, query, params)
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				// Format validation errors
				const fieldErrors: Record<string, string[]> = {};

				error.issues.forEach((err) => {
					const field = err.path.join(".");
					if (!fieldErrors[field]) {
						fieldErrors[field] = [];
					}
					fieldErrors[field].push(err.message);
				});

				const response: ValidationErrorResponse = {
					success: false,
					error: "Validation error",
					details: "Request validation failed",
					fields: fieldErrors,
				};

				return res.status(400).json(response);
			}

			// Handle other errors
			return res.status(500).json({
				success: false,
				error: "Internal server error",
			});
		}
	};
};
