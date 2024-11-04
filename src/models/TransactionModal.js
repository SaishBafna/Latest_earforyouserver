// transactionModel.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  merchantTransactionId: { type: String, required: true, unique: true },
  phonepeTransactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  responseCode: { type: String },
  responseMessage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
