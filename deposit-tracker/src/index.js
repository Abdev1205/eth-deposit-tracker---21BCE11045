import 'dotenv/config';
import connectDb from './config/db.js';
import express from 'express';

const PORT = process.env.PORT || 4000
const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`server is listening to ${PORT} port`);
})

const databaseConnection = async () => {
  try {
    await connectDb(process.env.DATABASE_URL);
    app.get("/", (req, res) => {
      res.send("Hi Welcome to Abhay deposit tracker project ")
    })
  } catch (error) {
    console.log(error);
  }
}
databaseConnection();
