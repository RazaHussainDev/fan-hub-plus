const express = require('express');
const router = express.Router();
const { manager } = require('../ai/nlpManager');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await manager.process('en', message);
    const answer = response.answer || "Sorry, main thoda samajh nahi paya. Can you rephrase?";
    res.json({ success: true, reply: answer, intent: response.intent });
  } catch (error) {
    console.error('AI Route Error:', error.message);
    res.status(500).json({ success: false, message: 'AI Error' });
  }
});

module.exports = router;
