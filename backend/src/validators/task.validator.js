const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional(),
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
}).min(1);

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateTaskUpdate = (req, res, next) => {
  const { error } = updateTaskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  taskSchema,
  updateTaskSchema,
  validateTask,
  validateTaskUpdate
};
