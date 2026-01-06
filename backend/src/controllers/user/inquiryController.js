/**
 * Inquiry-related controller functions
 */

const Inquiry = require('../../models/Inquiry');
const Apartment = require("../../models/Apartment");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const validator = require("../../utils/validators");

/**
 * Contact broker (create inquiry)
 */
exports.contactBroker = async (req, res) => {
  try {
    const { apartmentId, message, name, contactNumber } = req.body;
    const userEmail = req.session.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate required fields
    if (!apartmentId) {
      return res.status(400).json({ error: 'Apartment ID is required' });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Validate apartment ID format
    if (apartmentId.length !== 24) {
      return res.status(400).json({ error: 'Invalid apartment ID format' });
    }

    const apartment = await Apartment.findById(apartmentId).populate('broker');
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (!apartment.isActive) {
      return res.status(400).json({ error: 'This apartment listing is no longer active' });
    }

    const brokerEmail = apartment.broker?.email;
    if (!brokerEmail) {
      return res.status(404).json({ error: 'Broker not found for this apartment' });
    }

    // Sanitize inputs
    const inquiry = new Inquiry({
      userEmail,
      brokerEmail,
      apartmentId,
      message: message.trim(),
      name: name.trim(),
      contactNumber: contactNumber ? contactNumber.trim() : null
    });

    await inquiry.save();

    logger.info('Inquiry submitted:', { 
      userEmail, 
      brokerEmail, 
      apartmentId 
    });
    res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (err) {
    logger.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

