import axios from 'axios';
import { openNotification } from '../admin/layout/store/layoutSlice';
import useSessionStorage from './useSessionStorage';
import useLocalStorage from './useLocalStorage';

const useAxios = (dispatch) => {
  const { getItemWithDecryption, removeItem: removeLocalStorageItem } = useLocalStorage();
  const { removeItem, setItem } = useSessionStorage();

  axios.interceptors.request.use(async (config) => {
    const data = getItemWithDecryption('data');
    if (data) {
      const { access_token } = JSON.parse(data);
      console.log(access_token);
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeLocalStorageItem('data');
        window.location = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  const sendRequest = async (axiosCallback, errorCallback) => {
    try {
      setItem('processing', 'true');
      window.dispatchEvent(new Event('storage'));
      const response = await axiosCallback();
      if (dispatch) {
        dispatch(
          openNotification({
            message: 'Hecho',
            description: response.data.message,
            placement: 'top',
            type: 'success',
            show: true,
          })
        );
      }
      return response.data;
    } catch (err) {
      const error = err?.response?.data.message || err.response || err.message;
      if (dispatch) {
        dispatch(
          openNotification({
            message: 'Error',
            description: error,
            placement: 'top',
            type: 'error',
            show: true,
          })
        );
      }

      return errorCallback ? errorCallback(error) : { error };
    } finally {
      removeItem('processing');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const callService = ({ url, errorCallback }) => {
    return {
      get: async (config = {}) => {
        const request = async () => await axios.get(url, config);
        return await sendRequest(request, errorCallback);
      },
      post: async (data = {}, config = {}) => {
        const request = async () => await axios.post(url, data, config);
        return await sendRequest(request, errorCallback);
      },
      put: async (data = {}, config = {}) => {
        const request = async () => await axios.put(url, data, config);
        return await sendRequest(request, errorCallback);
      },
      delete: async (data = {}) => {
        const request = async () => await axios.delete(url, data);
        return await sendRequest(request, errorCallback);
      },
    };
  };

  return { callService, axios };
};

export default useAxios;
