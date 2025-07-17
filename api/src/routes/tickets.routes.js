const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Ticket = require('../models/ticket.model');
const axios = require('axios');
require('dotenv').config();

// Get all tickets for the logged-in user's tenant
router.get('/', protect, async (req, res) => {
    const tickets = await Ticket.find({ customerId: req.user.customerId });
    res.json(tickets);
});

// R5 (Part 1): Create a ticket and trigger n8n workflow
router.post('/', protect, async (req, res) => {
    const { title, description } = req.body;

    const ticket = new Ticket({
        title,
        description,
        customerId: req.user.customerId,
        createdBy: req.user.id,
        status: 'processing', // Set status to processing
    });

    const createdTicket = await ticket.save();

    // Trigger n8n workflow
    try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
            ticketId: createdTicket._id,
            customerId: createdTicket.customerId,
        });
        console.log(`n8n workflow triggered for ticket ${createdTicket._id}`);
    } catch (error) {
        console.error('Error triggering n8n workflow:', error.message);
        // Note: In a real app, you might want to handle this failure
    }

    res.status(201).json(createdTicket);
});

module.exports = router;