const dayjs = require('dayjs');
const Setting = require('../models/Setting');
const { emitLiveUpdate } = require('./socket');

async function evaluateScheduleNow() {
  const s = await Setting.findOne();
  if (!s) return;
  const now = dayjs();
  if (s.scheduledStartAt && now.isAfter(dayjs(s.scheduledStartAt)) && s.votingStatus !== 'open' && s.votingStatus !== 'ended') {
    s.votingStatus = 'open';
    await s.save();
    emitLiveUpdate('voting_status', { status: 'open', auto: true });
  }
  if (s.scheduledEndAt && now.isAfter(dayjs(s.scheduledEndAt)) && s.votingStatus !== 'ended') {
    s.votingStatus = 'ended';
    await s.save();
    emitLiveUpdate('voting_status', { status: 'ended', auto: true });
  }
}

function startScheduler(intervalMs = 15000) {
  const timer = setInterval(() => {
    evaluateScheduleNow().catch(() => {});
  }, intervalMs);
  return () => clearInterval(timer);
}

module.exports = { startScheduler, evaluateScheduleNow };

