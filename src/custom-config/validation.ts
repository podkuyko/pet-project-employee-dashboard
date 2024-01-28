import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().default(3000),

  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_DIALECT: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),

  JWT_SECRET: Joi.string().required(),
});
