export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV,
  appKey: process.env.APP_KEY,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});
