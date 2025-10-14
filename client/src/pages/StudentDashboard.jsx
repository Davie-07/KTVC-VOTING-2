import { useEffect, useMemo, useState } from 'react';
import { ContestantAPI, VoteAPI, AdminAPI } from '../api';
import { createSocket } from '../socket';

export default function StudentDashboard() {
  const [contestants, setContestants] = useState([]);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState(null);
  const [voted, setVoted] = useState({}); // position -> contestantId
  const votingOpen = settings?.votingStatus === 'open';

  useEffect(() => {
    ContestantAPI.list().then(r => setContestants(r.data));
    AdminAPI.status().then(r => setSettings(r.data));
    VoteAPI.live().then(r => setResults(r.data));
  }, []);

  useEffect(() => {
    const s = createSocket();
    s.on('voting_status', data => {
      setSettings(prev => ({ ...(prev || {}), votingStatus: data.status }));
    });
    s.on('voting_schedule', data => {
      setSettings(prev => ({ ...(prev || {}), scheduledStartAt: data.startAt, scheduledEndAt: data.endAt }));
    });
    s.on('vote_cast', () => {
      VoteAPI.live().then(r => setResults(r.data));
    });
    return () => s.close();
  }, []);

  const byPosition = useMemo(() => {
    const map = {};
    for (const c of contestants) {
      map[c.position] = map[c.position] || [];
      map[c.position].push(c);
    }
    return map;
  }, [contestants]);

  const leadingByPosition = useMemo(() => {
    const map = {};
    for (const r of results) {
      if (!map[r.position]) map[r.position] = r;
    }
    return map;
  }, [results]);

  const cast = async (contestant) => {
    if (!confirm(`You are voting for ${contestant.fullName} as ${contestant.position}. Confirm your vote?`)) return;
    try {
      await VoteAPI.cast(contestant._id);
      alert(`✅ You have voted for ${contestant.fullName}. Thank you for voting!`);
      setVoted(v => ({ ...v, [contestant.position]: contestant._id }));
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to vote.');
    }
  };

  const scheduledMsg = settings?.scheduledStartAt ? `Voting is scheduled on ${new Date(settings.scheduledStartAt).toLocaleString()}. Please check back then.` : '';

  return (
    <div className="container full-viewport">
      <h2><img src="/KTVC-LOGO.png" alt="KTVC Logo" className="logo-sm" /> <span className="title-orange">Kandara College</span> — Student Dashboard</h2>
      {scheduledMsg && <div className="notice">{scheduledMsg}</div>}

      {Object.keys(byPosition).map(pos => (
        <div key={pos} className="section">
          <h3>{pos}</h3>
          <div className="cards">
            {byPosition[pos].map(c => {
              const locked = voted[pos];
              const canVote = votingOpen && !locked;
              const leader = leadingByPosition[pos]?.contestantId === c._id;
              return (
                <div key={c._id} className="card">
                  <img src={c.imageUrl} alt={c.fullName} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <h4>{c.fullName}</h4>
                  <p>{c.course}</p>
                  <p><b>{c.position}</b></p>
                  <p>{c.manifesto}</p>
                  {leader && <div className="tag">Leading</div>}
                  <button disabled={!canVote} onClick={() => cast(c)}>{canVote ? 'Vote' : locked ? 'Voted' : 'Voting Closed'}</button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="section">
        <h3>Live Results</h3>
        <ul>
          {results.map(r => (
            <li key={r.contestantId}>{r.position} — {r.name}: {r.total}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}


