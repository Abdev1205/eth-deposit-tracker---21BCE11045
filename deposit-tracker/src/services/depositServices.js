import Deposit from "../models/deposit.js";
import logger from "../config/logger.js";
import notificationApi from "../utils/axios/notificationApi.js";

const saveDepositToDb = async (depositData) => {
  try {
    console.log("deposit data in saveDepositToDb", depositData);

    const deposit = new Deposit(depositData);
    await deposit.save();
    logger.info(`Deposit stored in MongoDB: ${JSON.stringify(depositData)}`);

  } catch (error) {
    logger.error('Error saving deposit to MongoDB:', error);
  }
}

// Function to get transaction details
const getTransactionDetails = async (txHash) => {
  try {
    console.log(`Fetching transaction details for: ${txHash}`);
    const response = await alchemy.core.getTransaction(txHash);
    console.log("Response for transaction details: ", response);
    return response;
  } catch (error) {
    logger.error(`Error fetching transaction details for ${txHash}: ${error.message}`);
    console.log(`Error fetching transaction details for ${txHash}: ${error.message}`);
    throw error;
  }
};

// Function to process a transactions
const processTransactions = async (logs) => {
  let depositCount = 0;

  await Promise.all(logs.map(async (log) => {
    try {
      const txDetails = await getTransactionDetails(log.transactionHash);

      if (txDetails && txDetails.to && txDetails.to.toLowerCase() === BEACON_DEPOSIT_CONTRACT.toLowerCase()) {
        logger.info(`New deposit detected! Transaction Hash: ${txDetails.hash}`);

        // Waiting for transaction confirmation
        const receipt = await provider.waitForTransaction(log.transactionHash);

        if (receipt && receipt.blockNumber) {
          const block = await provider.getBlock(receipt.blockNumber);
          const gasPrice = txDetails.gasPrice ? ethers.BigNumber.from(txDetails.gasPrice) : ethers.BigNumber.from(0);
          const fee = ethers.utils.formatEther(receipt.gasUsed.mul(gasPrice));

          // deposit data
          const depositData = {
            blockNumber: receipt.blockNumber,
            blockTimestamp: new Date(block.timestamp * 1000),
            fee,
            hash: txDetails.hash,
            publicKey: txDetails.from,
          };

          // Notify about the new deposit
          const alertMessage = `🚨 New Deposit Detected!\n\nTransaction Hash: ${txDetails.hash}\nBlock Number: ${receipt.blockNumber}\nFee: ${fee}\nPublic Key: ${txDetails.from}`;
          await notify(alertMessage);

          // Save deposit data to the database
          await saveDepositToDb(depositData);
          logger.info(`Deposit data saved for transaction ${txDetails.hash}`);

          depositCount++;
        }
      } else {
        logger.info(`Transaction not directed to the deposit contract. Transaction Hash: ${log.transactionHash}`);
      }
    } catch (error) {
      logger.error(`Error processing transaction ${log.transactionHash}: ${error.message}`);
    }
  }));

  return depositCount;
};




export { saveDepositToDb, processTransactions };
