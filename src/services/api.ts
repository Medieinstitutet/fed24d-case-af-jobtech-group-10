import axios from "axios";

const api = axios.create({
  baseURL: "https://jobsearch.api.jobtechdev.se", 
});

export default api;