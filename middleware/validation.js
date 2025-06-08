const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    next();
  };
};

const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

const validatePassword = (req, res, next) => {
  if (req.body.password && req.body.password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  next();
};

module.exports = { validateRequired, validateEmail, validatePassword };