import notificationApi from "../utils/axios/notificationApi.js";
import logger from "../config/logger.js";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "../config/environment.js";

const notify = async (message) => {
  try {
    await notificationApi.post(`/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    logger.info(`Notification sent to Telegram: ${message}`);
  } catch (error) {
    console.log(error)
    logger.error('Error sending notification to Telegram:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : 'No response data'
    });
  }
}

export default notify;
