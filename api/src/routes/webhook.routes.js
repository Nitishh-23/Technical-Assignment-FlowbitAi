const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
require('dotenv').config();

// R5 (Part 2): n8n calls this back with a shared secret
router.post('/ticket-done', async (req, res) => {
    const sharedSecret = req.headers['x-shared-secret'];

    // Verify shared secret header
    if (sharedSecret !== process.env.SHARED_SECRET_HEADER) {
        return res.status(401).json({ message: 'Unauthorized: Invalid shared secret.' });
    }

    const { ticketId } = req.body;
    if (!ticketId) {
        return res.status(400).json({ message: 'ticketId is required.' });
    }

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        ticket.status = 'done';
        await ticket.save();

        console.log(`Ticket ${ticketId} status updated to 'done' by n8n webhook.`);
        
        // In a real app, you would push this update via WebSocket.
        // For this demo, the UI will poll for changes.

        res.status(200).json({ message: 'Ticket status updated successfully.' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;