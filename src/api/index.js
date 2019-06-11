const axios = require("axios");

exports.getList = () => {
  return axios.get("http://localhost:3000/public/country.json");
};
