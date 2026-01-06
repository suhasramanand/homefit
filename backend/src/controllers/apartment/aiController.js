/**
 * AI-related apartment controller functions
 */

const { generateListingTitle } = require("../../services/groqTitle");
const logger = require("../../utils/logger");

/**
 * Generate apartment listing title using AI
 */
exports.generateTitleController = async (req, res) => {
  try {
    if (!req.body.apartment) {
      return res.status(400).json({ error: "Apartment data is required" });
    }
    
    const title = await generateListingTitle(req.body.apartment);
    res.status(200).json({ title });
  } catch (error) {
    logger.error("Title generation error:", error);
    res.status(500).json({ error: "Failed to generate title" });
  }
};

