import express from 'express';
import { rechargeWallet,getWalletAmount } from '../../controllers/Recharge/RechargeWallet.js'
import { deductPerMinute } from '../../controllers/Recharge/Decudition.js'
const router = express.Router();

// Deduct balance per minute and credit the receiver
router.post('/rechargeWallet', rechargeWallet);


router.post('/deductPerMinute', deductPerMinute);
router.get('/balance/:userId', getWalletAmount);

export default router;
