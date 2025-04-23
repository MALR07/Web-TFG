require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "user1",
    password: process.env.DB_PASSWORD || "malr07@",
    database: process.env.DB_NAME || "WEB_BAR_TFG_db",
    host: process.env.DB_HOST || "WEB_BAR_TFG_db",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_USER || "user1",
    password: process.env.DB_PASSWORD || "malr07@",
    database: process.env.DB_NAME || "WEB_BAR_TFG_db",
    host: process.env.DB_HOST || "WEB_BAR_TFG_db",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USER || "user1",
    password: process.env.DB_PASSWORD || "malr07@",
    database: process.env.DB_NAME || "WEB_BAR_TFG_db",
    host: process.env.DB_HOST || "WEB_BAR_TFG_db",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres"
  }
};