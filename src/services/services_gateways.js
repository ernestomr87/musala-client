import { config } from "./../config";
const axios = require("axios");

export const list = () => {
  return axios.get(`${config.BASE}/api/gateways`);
};

export const get = id => {
  return axios.get(`${config.BASE}/api/gateways/${id}`);
};

export const add = form => {
  return axios({
    method: "post",
    url: `${config.BASE}/api/gateways`,
    data: form
  });
};

export const set = form => {
  return axios({
    method: "put",
    url: `${config.BASE}/api/gateways`,
    data: form
  });
};

export const remove = id => {
  return axios.delete(`${config.BASE}/api/gateways/${id}`);
};
