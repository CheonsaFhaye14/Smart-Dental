// Toggle this to true for local development, false for production
const IS_LOCAL = true;

export const BASE_URL = IS_LOCAL
  ? "http://localhost:3000" // your local backend URL
  : "https://smart-dental-backend-s3kl.onrender.com";
