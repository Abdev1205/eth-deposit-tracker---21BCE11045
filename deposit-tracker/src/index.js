import 'dotenv/config';
import connectDb from './config/db.js';
import express from 'express';
import { DATABASE_URL } from './config/environment.js';
import trackDeposit from './controllers/depositController.js';
import fetchAndProcessTransactions from './controllers/depositController.js';
import startTracking from './controllers/depositController.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 4000
const app = express();

app.use(express.json());

app.listen(PORT, () => {
  logger.info(`server is listening to ${PORT} port`);
})

const databaseConnection = async () => {
  try {
    await connectDb(DATABASE_URL);
    app.get("/", (req, res) => {
      res.send("Hi Welcome to Abhay deposit tracker project ")
    })
  } catch (error) {
    console.log(error);
  }
}
databaseConnection();

const trackDepositInit = async () => {
  await startTracking();
}

trackDepositInit();

