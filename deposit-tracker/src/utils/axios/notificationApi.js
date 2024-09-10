import axios from 'axios'

const notificationApi = axios.create({
  baseURL: 'https://api.telegram.org',
})

export default notificationApi;
