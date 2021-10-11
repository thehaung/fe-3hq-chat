import axios from 'axios';
import qs from 'qs';
import { firebase } from '../config/firebase';
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ..
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error.toJSON();
  },
);
export default axiosClient;