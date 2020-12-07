const API_URL = {
  local: "/api/",
  dev: "https://mapi.igeidao.dev/api/",
  test: "https://mapi.igeidao.tech/api/",
  production: "https://mapi.igeidao.com/api/",
};

const APP_ENV = process.env.NODE_ENV;

const DEFINE_VALUES = {
  APP_ENV: JSON.stringify(APP_ENV),
  API_URL: JSON.stringify(API_URL[APP_ENV]),
};

module.exports = {
  APP_ENV,
  DEFINE_VALUES,
};
