const express = require('express');
const Account = require('../models/Account');
const router = express.Router();

router.post('/link', async (req, res) => {
  try {
    const { platform } = req.body;
    let account = await Account.findOne({ platform });

    if (!account) {
      account = new Account({ platform, linked: true });
      await account.save();
    } else {
      account.linked = true;
      await account.save();
    }

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to link account' });
  }
});

router.post('/permissions', async (req, res) => {
  try {
    // Implement the logic to request permissions
    res.status(200).json({ message: 'Permissions granted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request permissions' });
  }
});

module.exports = router;
