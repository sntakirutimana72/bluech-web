import axios from 'axios';

const Axios = axios.create({
  baseURL: process.env.REACT_APP_BLUECH_RB_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Axios;
