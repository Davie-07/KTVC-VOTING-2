const { emitLiveUpdate } = require('../utils/socket');
const Student = require('../models/Student');
const Contestant = require('../models/Contestant');
const Vote = require('../models/Vote');
const Setting = require('../models/Setting');

async function getStatus() {
  const setting = await Setting.findOne();
  return setting || await Setting.create({});
}

async function castVote(req, res) {
  const { contestantId } = req.body;
  const userId = req.user.id;

  const [setting, student, contestant] = await Promise.all([
    getStatus(),
    Student.findById(userId),
    Contestant.findById(contestantId)
  ]);

  if (!contestant) return res.status(404).json({ message: 'Contestant not found' });

  // voting open check
  if (setting.votingStatus !== 'open') {
    return res.status(403).json({ message: 'Voting is not open' });
  }

  const position = contestant.position;

  // backend lock: one vote per position per student
  const existing = await Vote.findOne({ studentId: student._id, position });
  if (existing) return res.status(409).json({ message: `You have already voted for ${position}` });

  await Vote.create({ studentId: student._id, contestantId, position });
  student.votesByPosition.set(position, contestantId);
  await student.save();

  // notify live updates
  emitLiveUpdate('vote_cast', { position, contestantId });

  return res.json({ message: `You have voted for ${contestant.fullName}. Thank you for voting!`, position, contestantId });
}

async function getLiveResults(req, res) {
  const pipeline = [
    { $group: { _id: { contestantId: '$contestantId', position: '$position' }, total: { $sum: 1 } } },
    { $lookup: { from: 'contestants', localField: '_id.contestantId', foreignField: '_id', as: 'contestant' } },
    { $unwind: '$contestant' },
    { $project: { _id: 0, position: '$_id.position', contestantId: '$_id.contestantId', total: 1, name: '$contestant.fullName', course: '$contestant.course' } },
    { $sort: { position: 1, total: -1 } }
  ];
  const results = await Vote.aggregate(pipeline);
  return res.json(results);
}

module.exports = { castVote, getLiveResults };

