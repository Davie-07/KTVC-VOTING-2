import { useEffect, useState } from 'react';
import { AdminAPI, ContestantAPI, VoteAPI } from '../api';
import { createSocket } from '../socket';

export default function AdminDashboard() {
  const [settings, setSettings] = useState(null);
  const [live, setLive] = useState([]);
  const [form, setForm] = useState({ fullName: '', course: '', position: '', manifesto: '', image: null });

  useEffect(() => {
    AdminAPI.status().then(r => setSettings(r.data));
    VoteAPI.live().then(r => setLive(r.data));
  }, []);

  useEffect(() => {
    const s = createSocket();
    s.on('voting_status', () => AdminAPI.status().then(r => setSettings(r.data)));
    s.on('vote_cast', () => VoteAPI.live().then(r => setLive(r.data)));
    return () => s.close();
  }, []);

  const upd = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const upload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (const k of ['fullName','course','position','manifesto']) fd.append(k, form[k]);
    fd.append('image', form.image);
    await ContestantAPI.create(fd);
    alert('Contestant uploaded');
  };

  return (
    <div className="container">
      <h2><img src="/KTVC-LOGO.png" alt="KTVC Logo" className="logo-sm" /> <span className="title-orange">Kandara College</span> — Admin Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Voting Controls</h3>
          <p>Status: <b>{settings?.votingStatus}</b></p>
          <div className="row">
            <button onClick={() => AdminAPI.open()}>Open Voting</button>
            <button onClick={() => AdminAPI.close()}>Close Voting</button>
            <button onClick={() => AdminAPI.end()}>End Voting</button>
          </div>
          <div className="row">
            <label>Schedule Start: <input type="datetime-local" onChange={e => AdminAPI.schedule({ startAt: new Date(e.target.value).toISOString() })} /></label>
            <label>Schedule End: <input type="datetime-local" onChange={e => AdminAPI.schedule({ endAt: new Date(e.target.value).toISOString() })} /></label>
          </div>
        </div>

        <div className="card">
          <h3>Upload Contestant</h3>
          <form onSubmit={upload} className="form">
            <input name="fullName" placeholder="Full Name" onChange={upd} required />
            <input name="course" placeholder="Course" onChange={upd} required />
            <input name="position" placeholder="Position" onChange={upd} required />
            <textarea name="manifesto" placeholder="Manifesto" onChange={upd} required />
            <input name="image" type="file" accept="image/*" onChange={upd} required />
            <button type="submit">Upload Contestants</button>
          </form>
        </div>
      </div>

      <div className="section">
        <h3>Live Votes</h3>
        <ul>
          {live.map(r => <li key={r.contestantId}>{r.position} — {r.name}: {r.total}</li>)}
        </ul>
      </div>
    </div>
  );
}


