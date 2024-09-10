import axios from "axios";
import axiosRetry from 'axios-retry';
import logger from "../../config/logger.js";
import { ALCHEMY_API_KEY } from "../../config/environment.js";

// Create the Axios instance
const transactionApi = axios.create({
  baseURL: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`, // Correct Alchemy URL
  timeout: 10000, // 10 seconds timeout
});

// Axios retry logic
axiosRetry(transactionApi, {
  retries: 5,
  retryDelay: (retryCount, error) => {
    const delay = Math.pow(2, retryCount) * 1000;

    // Cool-off for 10 seconds after multiple consecutive 429 errors
    if (error.response?.status === 429 && retryCount >= 3) {
      logger.warn('Hit rate limit multiple times. Cool-off for 10 seconds.');
      return 10000; // 10 seconds cool-off
    }

    return delay;
  },
  retryCondition: (error) => {
    return error.response?.status === 429 || error.code === 'ECONNABORTED';
  },
});

// Intercept request and log it
transactionApi.interceptors.request.use((config) => {
  logger.debug(`Starting request to ${config.url}`);
  return config;
});

// Intercept response and log it
transactionApi.interceptors.response.use(
  (response) => {
    logger.debug(`Received response with status: ${response.status}`);
    return response;
  },
  (error) => {
    logger.error(`Error in Axios request: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Request config: ${JSON.stringify(error.config)}`);
    }
    return Promise.reject(error);
  }
);

export default transactionApi;