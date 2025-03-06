import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { APIError } from "../utils/errorHandler";


// User Schema
const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  // Address Schema
const addressSchema = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    street: Joi.string().min(3).max(100).optional(),
    city: Joi.string().min(2).max(50).optional(),
    state: Joi.string().length(2).required(),
    zip: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional()
  });

  // Post Schema
const postSchema = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(100).required(),
    body: Joi.string().min(3).max(1000).required(),
    created_at: Joi.date().optional()
  }).strict();

  export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { 
        abortEarly: false, 
        stripUnknown: true 
      });
      if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        throw new APIError(errorMessages.join(', '), 400);
      } next();
    }};


    // Export specific validation middleware
export const validateUser = validate(userSchema);
export const validateAddress = validate(addressSchema);
export const validatePost = validate(postSchema);