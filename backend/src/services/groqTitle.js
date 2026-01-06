const axios = require("axios");
require("dotenv").config();
const logger = require('../utils/logger');

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

exports.generateListingTitle = async (apartment) => {
  // Validate input
  if (!apartment) {
    logger.warn('generateListingTitle called without apartment data');
    return "Could not generate title.";
  }

  if (!process.env.GROQ_API_KEY2) {
    logger.warn('GROQ_API_KEY2 not configured');
    return "Could not generate title.";
  }

  const prompt = `
You are a creative assistant helping brokers write attractive apartment listing titles.

Your task:
- Generate a short, catchy title (max 8 words)
- Make it feel real-estate ready and appealing
- Highlight key elements like layout, location, or standout features

Examples:
- Spacious 2BHK Near Central Park
- Modern Loft with Skyline View
- Peaceful Studio in Quiet Neighborhood

Now create a title for this apartment:
${JSON.stringify(apartment, null, 2)}
`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a creative assistant generating real estate listing titles.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        timeout: 10000, // 10 second timeout
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY2}`,
        },
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      logger.warn('Groq API returned invalid response format');
      return "Could not generate title.";
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      logger.warn('Groq API timeout');
    } else if (error.response) {
      logger.error("Groq API error:", {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      logger.error("Groq API error:", error.message);
    }
    return "Could not generate title.";
  }
};
