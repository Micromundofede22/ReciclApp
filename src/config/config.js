import { config } from "dotenv";

config();

export const PORT= process.env.PORT; 

export const MONGO_URI= process.env.MONGO_URI;

export const MONDO_DB_NAME= process.env.MONDO_DB_NAME;

export const JWT_PRIVATE_KEY= process.env.JWT_PRIVATE_KEY;

export const SIGNED_COOKIE_NAME= process.env.SIGNED_COOKIE_KEY;

export const SIGNED_COOKIE_SECRET= process.env.SIGNED_COOKIE_SECRET;

//google
export const GOOGLE_CLIENT_ID= process.env.GOOGLECLIENTID;
export const GOOGLE_CLIENT_SECRET= process.env.GOOGLECLIENTSECRET;
export const GOOGLE_CALLBACK_URL= process.env.GOOGLECALLBACKURL;

