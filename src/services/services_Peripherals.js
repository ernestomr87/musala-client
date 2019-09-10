import { config } from "./../config";
const axios = require("axios");

export const list = () => {
  return axios.get(`${config.BASE}/api/peripherals`);
};

export const listByGateway = id => {
  return axios.get(`${config.BASE}/api/peripherals/${id}`);
};

export const add = form => {
  return axios({
    method: "post",
    url: `${config.BASE}/api/peripherals`,
    data: form
  });
};

export const set = form => {
  return axios({
    method: "put",
    url: `${config.BASE}/api/peripherals`,
    data: form
  });
};

export const remove = id => {
  return axios.delete(`${config.BASE}/api/peripherals/${id}`);
};
