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

module.exports = { createContestant, listContestants };

