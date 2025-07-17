const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  customerId: { type: String, required: true }, // Tenant ID
  status: { type: String, enum: ['open', 'processing', 'done'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;