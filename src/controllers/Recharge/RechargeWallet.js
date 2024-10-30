import Wallet from '../../models/Wallet/Wallet.js';

export const rechargeWallet = async (req, res) => {
  try {
    const { userId, amount, rechargeMethod, transactionId } = req.body;

    // Find the user's wallet
    let wallet = await Wallet.findOne({ userId });


    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum recharge amount is 100',
      });
    }

    // If the wallet does not exist, create one
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
      });
    }

    // Update wallet balance and add a new recharge record
    wallet.balance += amount;
    wallet.recharges.push({
      amount,
      rechargeMethod,
      transactionId,
    });

    // Save the updated wallet
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet recharged successfully',
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Recharge Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to recharge wallet',
    });
  }
};


// Amount 

export const getWalletAmount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });

    // If wallet is not found, return an error response
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    // Return the wallet balance
    res.status(200).json({
      success: true,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Get Wallet Amount Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve wallet amount',
    });
  }
};