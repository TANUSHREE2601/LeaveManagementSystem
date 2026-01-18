const morgan = require('morgan');

// Custom token for morgan
morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    return JSON.stringify(req.body);
  }
  return '-';
});

// Development logger
const developmentLogger = morgan('dev');

// Production logger
const productionLogger = morgan('combined');

// Choose logger based on environment
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

module.exports = logger;
