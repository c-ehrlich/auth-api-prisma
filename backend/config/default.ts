export default {
  port: 3000,
  dbUri: 'mongodb://localhost:27017/crud-boilerplate-express-ts',
  logLevel: 'info',
  smtp: {
    // in production, use a proper smtp server and set secure to true
    user: 'ggz4rlsxo2yrinxn@ethereal.email',
    pass: '2a7k8u5BhXr7ZwvF95',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
  }
};
