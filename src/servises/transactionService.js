// paymentService.js
import axios from 'axios';
import crypto from 'crypto';
import Transaction from './../models/TransactionModal.js'
import Wallet from './../models/Wallet/Wallet.js'


const PHONEPE_API_URL = process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const SALT_KEY = process.env.SALT_KEY;
const SALT_INDEX = process.env.SALT_INDEX;

export const verifyPhonePePayment = async (merchantId, merchantTransactionId) => {
  try {
    // Using the sandbox/preprod URL
    const baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    const url = `/v3/transaction/${merchantId}/${merchantTransactionId}/status`;
    
    // For preprod environment, the string to hash should include /pg-sandbox
    const stringToHash = `/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}${process.env.SALT_KEY}`;
    
    // Generate checksum
    const checksum = crypto.createHash('sha256')
      .update(stringToHash)
      .digest('hex') + '###' + process.env.SALT_INDEX;

    console.log('String to Hash:', stringToHash);
    console.log('Generated Checksum:', checksum);

    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        'X-VERIFY': checksum,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('PhonePe API Error Details:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
      throw new Error(`PhonePe verification failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`PhonePe verification failed: ${error.message}`);
  }
};

// transactionService.js


export const updateTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  await transaction.save();
};

export const updateWalletBalance = async (userId, amount) => {
  await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true }
  );
};
