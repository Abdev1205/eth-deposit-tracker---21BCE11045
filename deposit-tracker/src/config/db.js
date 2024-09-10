import mongoose from "mongoose";
import logger from "./logger.js";
mongoose.set('strictQuery', false);

const connectDb = async (uri) => {
  return mongoose.connect(uri).then(() => {
    logger.info('Connected to Database Successfully');
  }).catch((error) => {
    console.log(error);
  })
}

export default connectDb;
