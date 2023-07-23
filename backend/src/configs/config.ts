
export const configs = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 5001,

  SECRET_SALT: process.env.SECRET_SALT,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
