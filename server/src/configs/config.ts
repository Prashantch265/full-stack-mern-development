import dotenv from 'dotenv';

// Load environment variables. It will load from the .env file by default.
dotenv.config();

/**
 * Interface for JWT configuration
 */
interface IJwtConfig {
  accessTokenExpiresIn?: string;
  refreshTokenExpiresIn?: string;
  accessTokenSecret?: string;
  refreshTokenSecret?: string;
}

/**
 * Interface for Mailer configuration
 */
interface IMailerConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
  templateEngine: string;
}

/**
 * Interface for MongoDB configuration
 */
interface IMongoConfig {
  uri: string;
}

/**
 * Interface for MySQL configuration
 */
interface IMysqlConfig {
  host: string;
  user: string;
  password?: string;
  port: number;
  database: string;
}

/**
 * Interface for PostgreSQL configuration
 */
interface IPostgresConfig {
  host: string;
  user: string;
  password?: string;
  port: number;
  database: string;
}

/**
 * Interface for Woocommerce configuration
 */
interface IWoocommerceConfig {
    consumerKey: string;
    consumerSecret: string;
}

/**
 * Main Configuration Interface
 */
interface IConfig {
  port: number;
  env: string;
  logLevel: string;
  dialect: { [key: string]: string };
  jwtConfig: IJwtConfig;
  mailerConfig: IMailerConfig;
  mongo: IMongoConfig;
  mysql: IMysqlConfig;
  postgres: IPostgresConfig;
  woocommerce: IWoocommerceConfig;
  syncupCronSchedule: string;
  cleanupCronSchedule: string;
}

// Define and export the configuration object with types
const config: IConfig = {
  /**
   * Server Configuration
   */
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || "",
  logLevel: process.env.LOG_LEVEL || "info",

  /**
   * Database Dialect Configuration
   */
  dialect: process.env.DIALECT
    ? JSON.parse(process.env.DIALECT)
    : { postgres: "postgres", mysql: "mysql" },

  /**
   * JWT Token Configuration
   */
  jwtConfig: {
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },

  /**
   * Mailer Configuration
   */
  mailerConfig: {
    host: process.env.MAIL_HOST || "smtp.example.com",
    port: Number(process.env.MAIL_PORT) || 587,
    auth: {
      user: process.env.MAIL_USER || "user@example.com",
      pass: process.env.MAIL_PASSWORD || "password",
    },
    templateEngine: process.env.TEMPLATE_ENGINE || "ejs",
  },

  /**
   * MongoDB Configuration
   */
  mongo: {
    uri:
      process.env.MONGO_URI || '',
  },

  /**
   * MySQL Database Configuration
   */
  mysql: {
    host: process.env.MYSQL || "localhost",
    user: process.env.MYSQL_USER || "prashant",
    password: process.env.MYSQL_PASSWORD || "9591",
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DATABASE || "testdb",
  },

  /**
   * PostgreSQL Database Configuration
   */
  postgres: {
    host: process.env.POSTGRES || "localhost",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DATABASE || "express-boilerplate",
  },

  /**
   * WooCommerce Configuration
   */
  woocommerce: {
    consumerKey: process.env.WOOCOMMERCE_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_SECRET || "",
  },

  /**
   * Cron Job Configuration
   */
  // Defaults to 12:00 PM every day for WooCommerce data sync.
  syncupCronSchedule: process.env.CRON_SCHEDULE || "0 12 * * *",
  // Defaults to 1:00 AM every day for cleanup old data.
  cleanupCronSchedule: process.env.CLEANUP_CRON_SCHEDULE || "0 1 * * *",
};

export default config;