module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "my-secret",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost/poketeams",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "localhost:3000",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "18000s",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "encryption-key",
};
