import { Alchemy, Network } from "alchemy-sdk";
import logger from "../config/logger.js";
import { ALCHEMY_API_KEY, BEACON_DEPOSIT_CONTRACT } from '../config/environment.js';
import notify from '../services/notifyService.js';
import { processTransactions } from "../services/depositServices.js"

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const filter = {
  address: BEACON_DEPOSIT_CONTRACT,
};

// Global counters to track logs processed and deposits found
let totalLogsProcessed = 0;
let totalDepositsFound = 0;

// Function to periodically log processed logs and deposits
const startPeriodicLogging = () => {
  setInterval(async () => {
    logger.info(`Processed ${totalLogsProcessed} logs and found ${totalDepositsFound} deposits in the last minute.`);
    console.log(`Processed ${totalLogsProcessed} logs and found ${totalDepositsFound} deposits in the last minute.`);

    const alertMessage = `🔔 Status Update:\n\nProcessed ${totalLogsProcessed} logs and found ${totalDepositsFound} deposits in the last minute.`;
    await notify(alertMessage);

    // Resets counters every minute after logging
    totalLogsProcessed = 0;
    totalDepositsFound = 0;
  }, 60 * 1000);
};

const startTracking = async () => {
  logger.info('🚀 Service Started! Tracking deposits to the Beacon Deposit Contract');
  await notify('🚀 Service Started! Tracking deposits to the Beacon Deposit Contract');

  // Starting periodic logging of processed logs and deposits
  startPeriodicLogging();

  alchemy.ws.on(filter, async (log) => {

    try {
      totalLogsProcessed++;

      // Process the logs
      const depositCount = await processTransactions([log]);

      if (depositCount > 0) {
        totalDepositsFound += depositCount; // Increment the deposits found counter
        logger.info(`Processed ${totalLogsProcessed} log and found ${depositCount} deposits.`);
        await notify(`Processed ${totalLogsProcessed} log and found ${depositCount} deposits.`);
      } else {
        logger.info(`Processed log ${totalLogsProcessed} but no deposits found.`);
      }
    } catch (error) {
      logger.error(`Error processing log: ${error.message}`);
    }
  });
};

export default startTracking;
