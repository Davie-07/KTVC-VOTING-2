const path = require('path');
const Contestant = require('../models/Contestant');
const { processAndSaveImage } = require('../utils/image');

async function createContestant(req, res) {
  const { fullName, course, position, manifesto } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const outputDir = path.join(process.cwd(), 'server', 'uploads');
  const { url, meta } = await processAndSaveImage(req.file, outputDir);
  const contestant = await Contestant.create({ fullName, course, position, manifesto, imageUrl: url, imageMeta: meta });
  return res.status(201).json(contestant);
}

async function listContestants(req, res) {
  const data = await Contestant.find().sort({ position: 1, createdAt: -1 });
  return res.json(data);
}

async function updateContestant(req, res) {
  const { id } = req.params;
  const { fullName, course, position, manifesto } = req.body;
  const update = { fullName, course, position, manifesto };
  // remove undefined fields
  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

  if (req.file) {
    const outputDir = path.join(process.cwd(), 'server', 'uploads');
    const { url, meta } = await processAndSaveImage(req.file, outputDir);
    update.imageUrl = url;
    update.imageMeta = meta;
  }

  const updated = await Contestant.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return res.status(404).json({ message: 'Contestant not found' });
  return res.json(updated);
}

async function deleteContestant(req, res) {
  const { id } = req.params;
  const deleted = await Contestant.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Contestant not found' });
  return res.json({ ok: true });
}

module.exports = { createContestant, listContestants, updateContestant, deleteContestant };

