export default {
  port: 3000,
  logLevel: 'info',
  // defined in custom-environment-variables.ts
  accessTokenPrivateKey: '',
  refreshTokenPrivateKey: '',
  smtp: {
    // in production, use a proper smtp server and set secure to true
    user: 'ggz4rlsxo2yrinxn@ethereal.email',
    pass: '2a7k8u5BhXr7ZwvF95',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
  },
};
