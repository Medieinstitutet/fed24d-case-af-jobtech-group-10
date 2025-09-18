import axios from 'axios';

const taxonomyApi = axios.create({
  baseURL: 'https://taxonomy.api.jobtechdev.se',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default taxonomyApi;