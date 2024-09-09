import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  blockTimestamp: {
    type: Date,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  pubkey: {
    type: String,
    required: true
  }
})

const Deposit = mongoose.model('Deposit', schema);

export default Deposit;
