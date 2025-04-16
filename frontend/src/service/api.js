import axios from "axios";

export const api = axios.create({
  baseURL: "https://figurihasvnw-api.onrender.com/api",
});
