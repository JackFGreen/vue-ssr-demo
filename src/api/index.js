import axios from "axios";

export function getList() {
  return axios.get("http://localhost:3000/public/country.json");
}
