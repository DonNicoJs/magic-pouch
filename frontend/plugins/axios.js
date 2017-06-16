import axios from 'axios';

const instance = axios.create();

instance.defaults.headers.common['Authorization'] = '';

const handleResponse = r => {
  return r;
};

const handleError = e => {
  const status = Object.assign({}, e).response.status;
  console.warn(status);
  return Promise.reject(e);
};

// if mock-api is active error and response are the same object

instance.interceptors.response.use(handleResponse, handleError);

export default instance;
export { handleError, handleResponse };
