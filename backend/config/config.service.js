import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const WHITE_LIST = process.env.WHITE_LIST || "http://localhost:5173,http://127.0.0.1:5173";
export const SALT = process.env.SALT || 10;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
const devSecret = (name) => NODE_ENV === "production" ? undefined : `local-${name}-secret`;
export const TOKEN_ACCESS_USER_SECRET_KEY = process.env.TOKEN_ACCESS_USER_SECRET_KEY || devSecret("user-access");
export const TOKEN_REFRESH_USER_SECRET_KEY = process.env.TOKEN_REFRESH_USER_SECRET_KEY || devSecret("user-refresh");
export const TOKEN_ACCESS_ADMIN_SECRET_KEY = process.env.TOKEN_ACCESS_ADMIN_SECRET_KEY || devSecret("admin-access");
export const TOKEN_REFRESH_ADMIN_SECRET_KEY = process.env.TOKEN_REFRESH_ADMIN_SECRET_KEY || devSecret("admin-refresh");
export const ACCESS_EXPIRES = "24h";
export const REFRESH_EXPIRES = "7d";
export const CLIENT_ID = process.env.CLIENT_ID;
export const USER_EMAIL = process.env.USER_EMAIL;
export const USER_PASSWORD = process.env.USER_PASSWORD; 
