const dayjs = require('dayjs');
const Vote = require('../models/Vote');
const Contestant = require('../models/Contestant');
const Setting = require('../models/Setting');
const { emitLiveUpdate } = require('../utils/socket');

async function getOrCreateSetting() {
  const existing = await Setting.findOne();
  if (existing) return existing;
  return Setting.create({});
}


// Replacement block original one down
async function openVoting(req, res) {
  try {
    const s = await getOrCreateSetting();
    s.votingStatus = 'open';
    await s.save();
    emitLiveUpdate('voting_status', { status: 'open' });
    res.json({ status: s.votingStatus });
  } catch (error) {
    console.error('Error opening voting:', error);
    res.status(500).json({ message: 'Failed to open voting due to a server error.' });
  }
}

async function closeVoting(req, res) {
  try {
    const s = await getOrCreateSetting();
    s.votingStatus = 'closed';
    await s.save();
    emitLiveUpdate('voting_status', { status: 'closed' });
    res.json({ status: s.votingStatus });
  } catch (error) {
    console.error('Error closing voting:', error);
    res.status(500).json({ message: 'Failed to close voting due to a server error.' });
  }
}

async function endVoting(req, res) {
  try {
    const s = await getOrCreateSetting();
    s.votingStatus = 'ended';
    await s.save();
    emitLiveUpdate('voting_status', { status: 'ended' });

    // compute winners per position
    const agg = await Vote.aggregate([
      { $group: { _id: { contestantId: '$contestantId', position: '$position' }, total: { $sum: 1 } } },
      { $sort: { '_id.position': 1, total: -1 } },
    ]);

    const byPosition = new Map();
    for (const row of agg) {
      const pos = row._id.position;
      if (!byPosition.has(pos)) byPosition.set(pos, []);
      byPosition.get(pos).push(row);
    }

    const winners = [];
    for (const [position, rows] of byPosition.entries()) {
      if (rows.length === 0) continue;
      const top = rows[0];
      winners.push({ position, contestantId: top._id.contestantId, total: top.total });
    }

    const populated = await Contestant.find({ _id: { $in: winners.map((w) => w.contestantId) } });
    const detailed = winners.map((w) => ({
      position: w.position,
      total: w.total,
      contestant: populated.find((p) => String(p._id) === String(w.contestantId)),
    }));

    res.json({ winners: detailed });
  } catch (error) {
    console.error('Error ending voting:', error);
    res.status(500).json({ message: 'Failed to end voting due to a server error.' });
  }
}

async function scheduleVoting(req, res) {
  try {
    const { startAt, endAt, scheduleMessage } = req.body; // ISO strings
    const s = await getOrCreateSetting();
    s.scheduledStartAt = startAt ? dayjs(startAt).toDate() : null;
    s.scheduledEndAt = endAt ? dayjs(endAt).toDate() : null;
    s.scheduleMessage = scheduleMessage || null;
    await s.save();
    emitLiveUpdate('voting_schedule', { startAt: s.scheduledStartAt, endAt: s.scheduledEndAt, scheduleMessage: s.scheduleMessage });
    res.json({ startAt: s.scheduledStartAt, endAt: s.scheduledEndAt, scheduleMessage: s.scheduleMessage });
  } catch (error) {
    console.error('Error scheduling voting:', error);
    res.status(500).json({ message: 'Failed to schedule voting due to a server error.' });
  }
}

async function clearScheduleMessage(req, res) {
  try {
    const s = await getOrCreateSetting();
    s.scheduleMessage = null;
    await s.save();
    emitLiveUpdate('voting_schedule', { startAt: s.scheduledStartAt, endAt: s.scheduledEndAt, scheduleMessage: null });
    res.json({ message: 'Schedule message cleared' });
  } catch (error) {
    console.error('Error clearing schedule message:', error);
    res.status(500).json({ message: 'Failed to clear schedule message due to a server error.' });
  }
}

async function getSettings(req, res) {
  try {
    const s = await getOrCreateSetting();
    res.json(s);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Failed to get settings due to a server error.' });
  }
}

module.exports = { openVoting, closeVoting, endVoting, scheduleVoting, getSettings, clearScheduleMessage };





// Original block replaced with the above

// async function openVoting(req, res) {
//   const s = await getOrCreateSetting();
//   s.votingStatus = 'open';
//   await s.save();
//   emitLiveUpdate('voting_status', { status: 'open' });
//   res.json({ status: s.votingStatus });
// }

// async function closeVoting(req, res) {
//   const s = await getOrCreateSetting();
//   s.votingStatus = 'closed';
//   await s.save();
//   emitLiveUpdate('voting_status', { status: 'closed' });
//   res.json({ status: s.votingStatus });
// }

// async function endVoting(req, res) {
//   const s = await getOrCreateSetting();
//   s.votingStatus = 'ended';
//   await s.save();
//   emitLiveUpdate('voting_status', { status: 'ended' });

//   // compute winners per position
//   const agg = await Vote.aggregate([
//     { $group: { _id: { contestantId: '$contestantId', position: '$position' }, total: { $sum: 1 } } },
//     { $sort: { '_id.position': 1, total: -1 } }
//   ]);

//   const byPosition = new Map();
//   for (const row of agg) {
//     const pos = row._id.position;
//     if (!byPosition.has(pos)) byPosition.set(pos, []);
//     byPosition.get(pos).push(row);
//   }

//   const winners = [];
//   for (const [position, rows] of byPosition.entries()) {
//     if (rows.length === 0) continue;
//     const top = rows[0];
//     winners.push({ position, contestantId: top._id.contestantId, total: top.total });
//   }

//   const populated = await Contestant.find({ _id: { $in: winners.map(w => w.contestantId) } });
//   const detailed = winners.map(w => ({
//     position: w.position,
//     total: w.total,
//     contestant: populated.find(p => String(p._id) === String(w.contestantId))
//   }));

//   res.json({ winners: detailed });
// }

// async function scheduleVoting(req, res) {
//   const { startAt, endAt } = req.body; // ISO strings
//   const s = await getOrCreateSetting();
//   s.scheduledStartAt = startAt ? dayjs(startAt).toDate() : null;
//   s.scheduledEndAt = endAt ? dayjs(endAt).toDate() : null;
//   await s.save();
//   emitLiveUpdate('voting_schedule', { startAt: s.scheduledStartAt, endAt: s.scheduledEndAt });
//   res.json({ startAt: s.scheduledStartAt, endAt: s.scheduledEndAt });
// }

// async function getSettings(req, res) {
//   const s = await getOrCreateSetting();
//   res.json(s);
// }

// module.exports = { openVoting, closeVoting, endVoting, scheduleVoting, getSettings };

