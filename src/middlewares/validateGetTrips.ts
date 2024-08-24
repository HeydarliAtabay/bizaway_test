import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const schema = Joi.object({
  origin: Joi.string().pattern(/^[A-Z]{3}$/).required().messages({
    'string.pattern.base': 'Origin must be a 3-letter IATA code.',
  }),
  destination: Joi.string().pattern(/^[A-Z]{3}$/).required().messages({
    'string.pattern.base': 'Destination must be a 3-letter IATA code.',
  }),
  sort_by: Joi.string().valid('fastest', 'cheapest').required().messages({
    'any.only': 'Sort_by must be either "fastest" or "cheapest".',
  }),
});

export const validateGetTrips = (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      message: 'Invalid query parameters',
      error: error.details.map(detail => detail.message).join(', '),
    });
  }
  next();
};
