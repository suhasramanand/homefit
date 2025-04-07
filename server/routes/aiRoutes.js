
const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
require('dotenv').config();

// Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Get an explanation for an apartment match
router.post('/explain', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    // Check if Groq API key is available
    if (!GROQ_API_KEY) {
      return res.status(503).json({ 
        message: 'AI explanation service not configured',
        serviceUnavailable: true
      });
    }
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert real estate advisor. Provide helpful, accurate, and concise information about apartment matches.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.5,
        max_tokens: 250
      })
    });
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || '';
    
    res.json({ explanation });
  } catch (error) {
    console.error('Error in AI explanation service:', error);
    res.status(500).json({ 
      message: 'Error generating explanation', 
      error: error.message 
    });
  }
});

module.exports = router;
