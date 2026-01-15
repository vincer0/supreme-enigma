import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

const SirAxios = axios.create({
  baseURL: process.env.NEXT_SERVER_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

export { SirAxios };

export default instance;