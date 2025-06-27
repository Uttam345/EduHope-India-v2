import Joi from 'joi';

// Newsletter subscription validation
export const validateNewsletterSubscription = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email address is required'
      }),
    name: Joi.string()
      .trim()
      .max(100)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Name must not exceed 100 characters'
      }),
    source: Joi.string()
      .valid('website', 'donation', 'event', 'referral', 'other')
      .default('website'),
    preferences: Joi.object({
      frequency: Joi.string()
        .valid('weekly', 'monthly', 'quarterly')
        .default('monthly'),
      topics: Joi.array()
        .items(Joi.string().valid('updates', 'success_stories', 'events', 'fundraising', 'volunteer_opportunities'))
        .default(['updates', 'success_stories'])
    }).optional()
  });

  return schema.validate(data, { abortEarly: false });
};

// Email validation for unsubscribe
export const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email address is required'
      })
  });

  return schema.validate(data);
};

// Bulk email validation
export const validateBulkEmail = (data) => {
  const schema = Joi.object({
    subject: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Subject must be at least 5 characters long',
        'string.max': 'Subject must not exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    content: Joi.string()
      .min(50)
      .required()
      .messages({
        'string.min': 'Content must be at least 50 characters long',
        'any.required': 'Content is required'
      }),
    contentType: Joi.string()
      .valid('html', 'text')
      .default('html'),
    sendTo: Joi.string()
      .valid('all', 'active', 'recent')
      .default('active'),
    testMode: Joi.boolean()
      .default(false)
  });

  return schema.validate(data);
};

export default {
  validateNewsletterSubscription,
  validateEmail,
  validateBulkEmail
};
