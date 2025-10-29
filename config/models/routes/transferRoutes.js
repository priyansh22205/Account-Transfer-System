const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// POST /transfer
router.post('/transfer', async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  try {
    // Validate request
    if (!fromUserId || !toUserId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Find users
    const sender = await User.findById(fromUserId);
    const receiver = await User.findById(toUserId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Check balance
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform transfer (sequential updates)
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: `Transferred $${amount} from ${sender.name} to ${receiver.name}`,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    });

  } catch (error) {
    console.error("Error during transfer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
