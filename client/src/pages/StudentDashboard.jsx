import { useEffect, useMemo, useState } from 'react';
import { ContestantAPI, VoteAPI, AdminAPI } from '../api';
import { createSocket } from '../socket';
import ProgressBar from '../components/ProgressBar';

export default function StudentDashboard() {
  const [contestants, setContestants] = useState([]);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState(null);
  const [voted, setVoted] = useState({}); // position -> contestantId
  const votingOpen = settings?.votingStatus === 'open';
  const API_BASE_ORIGIN = import.meta.env.VITE_API_BASE_ORIGIN || 'http://localhost:5000';
  const [viewMode, setViewMode] = useState('leaders'); // 'leaders' | 'detailed'

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

  const groupedResults = useMemo(() => {
    const map = {};
    for (const r of results) {
      if (!map[r.position]) map[r.position] = [];
      map[r.position].push(r);
    }
    return map;
  }, [results]);

  const leadingByPosition = useMemo(() => {
    const leaders = {};
    for (const pos of Object.keys(groupedResults)) {
      leaders[pos] = groupedResults[pos][0];
    }
    return leaders;
  }, [groupedResults]);

  const cast = async (contestant) => {
    if (!confirm(`You are voting for ${contestant.fullName} as ${contestant.position}. Confirm your vote?`)) return;
    try {
      await VoteAPI.cast(contestant._id);
      alert(`✅ You have voted for ${contestant.fullName}. Thank you for voting!`);
      setVoted(v => ({ ...v, [contestant.position]: contestant._id }));
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to vote then.');
    }
  };

  const scheduledMsg = settings?.scheduledStartAt ? `Voting is scheduled on ${new Date(settings.scheduledStartAt).toLocaleString()}. Please check back then.` : '';

  return (
    <div className="container full-viewport">
      {!votingOpen && settings?.scheduleMessage && (
        <div className="notice">
          {settings.scheduleMessage}
        </div>
      )}
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
                  <img src={`${API_BASE_ORIGIN}${c.imageUrl}`} alt={c.fullName} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
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
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Live Votes</h3>
          <div className="row">
            <button onClick={() => setViewMode('leaders')} disabled={viewMode === 'leaders'}>Leading Summary</button>
            <button onClick={() => setViewMode('detailed')} disabled={viewMode === 'detailed'}>Detailed View</button>
          </div>
        </div>

{viewMode === 'leaders' ? (
          <div className="leaders-summary">
            {Object.keys(leadingByPosition).map(pos => {
              const lr = leadingByPosition[pos];
              if (!lr) return null;
              const maxVotes = Math.max(...Object.values(groupedResults).flat().map(r => r.total));
              return (
                <div key={pos} className="leader-card">
                  <div className="leader-info">
                    <h4>{pos}</h4>
                    <p><strong>{lr.name}</strong> ({lr.course})</p>
                  </div>
                  <ProgressBar 
                    value={lr.total} 
                    max={maxVotes} 
                    label="Leading with" 
                    className="leader-progress"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="detailed-results">
            {Object.keys(groupedResults).map(pos => {
              const positionResults = groupedResults[pos];
              const maxInPosition = Math.max(...positionResults.map(r => r.total));
              return (
                <div key={pos} className="card position-results">
                  <h4 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>{pos}</h4>
                  {positionResults.map(r => (
                    <ProgressBar
                      key={r.contestantId}
                      value={r.total}
                      max={maxInPosition}
                      label={`${r.name} (${r.course})`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


