import axios from "axios";

export function getList() {
  return axios.get("/public/country.json");
}
