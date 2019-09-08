const axios = require("axios");
const BASE = "http://localhost:3001";

export const list = () => {
  return axios.get(`${BASE}/api/gateways`);
};

export const get = id => {
  return axios.get(`${BASE}/api/gateways/${id}`);
};

export const add = form => {
  return axios({
    method: "post",
    url: `${BASE}/api/gateways`,
    data: form
  });
};

export const set = form => {
  return axios({
    method: "put",
    url: `${BASE}/api/gateways`,
    data: form
  });
};

export const remove = id => {
  return axios.delete(`${BASE}/api/gateways/${id}`);
};
