const express = require('express');
const router = express.Router();
const NetworkService = require('../services/networkService');

// Get all contacts
router.get('/contacts', (req, res) => {
  res.json(NetworkService.getContacts());
});

// Get contact by ID
router.get('/contacts/:id', (req, res) => {
  const contact = NetworkService.getContactById(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

// Create contact
router.post('/contacts', (req, res) => {
  const contact = NetworkService.createContact(req.body);
  res.status(201).json(contact);
});

// Update contact
router.patch('/contacts/:id', (req, res) => {
  const contact = NetworkService.updateContact(req.params.id, req.body);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

// Delete contact
router.delete('/contacts/:id', (req, res) => {
  const success = NetworkService.deleteContact(req.params.id);
  if (!success) return res.status(404).json({ error: 'Contact not found' });
  res.json({ success: true });
});

// Get interactions
router.get('/interactions', (req, res) => {
  const { contactId } = req.query;
  res.json(NetworkService.getInteractions(contactId));
});

// Create interaction
router.post('/interactions', (req, res) => {
  const interaction = NetworkService.createInteraction(req.body);
  res.status(201).json(interaction);
});

// Get touch reminders
router.get('/touch-reminders', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  res.json(NetworkService.getTouchReminders(days));
});

// Get deal flow
router.get('/deal-flow', (req, res) => {
  const { contactId } = req.query;
  res.json(NetworkService.getDealFlow(contactId));
});

// Add deal flow
router.post('/deal-flow', (req, res) => {
  const deal = NetworkService.addDealFlow(req.body);
  res.status(201).json(deal);
});

// Get introductions
router.get('/introductions', (req, res) => {
  res.json(NetworkService.getIntroductions());
});

// Create introduction
router.post('/introductions', (req, res) => {
  const intro = NetworkService.createIntroduction(req.body);
  res.status(201).json(intro);
});

// Get network metrics
router.get('/metrics', (req, res) => {
  res.json(NetworkService.getNetworkMetrics());
});

// Get top deal sources
router.get('/top-deal-sources', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  res.json(NetworkService.getTopDealSources(limit));
});

module.exports = router;
