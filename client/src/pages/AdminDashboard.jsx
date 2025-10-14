import { useEffect, useState } from 'react';
import { AdminAPI, ContestantAPI, VoteAPI } from '../api';
import { createSocket } from '../socket';
import ProgressBar from '../components/ProgressBar';

export default function AdminDashboard() {
  const [settings, setSettings] = useState(null);
  const [live, setLive] = useState([]);
  const [form, setForm] = useState({ fullName: '', course: '', position: '', manifesto: '', image: null });
  const [contestants, setContestants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', course: '', position: '', manifesto: '', image: null });
  const API_BASE_ORIGIN = import.meta.env.VITE_API_BASE_ORIGIN || 'http://localhost:5000';
  const [viewMode, setViewMode] = useState('leaders'); // 'leaders' | 'detailed'

  useEffect(() => {
    AdminAPI.status().then(r => setSettings(r.data));
    VoteAPI.live().then(r => setLive(r.data));
    ContestantAPI.list().then(r => setContestants(r.data));
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
    setForm({ fullName: '', course: '', position: '', manifesto: '', image: null });
    const { data } = await ContestantAPI.list();
    setContestants(data);
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ fullName: c.fullName, course: c.course, position: c.position, manifesto: c.manifesto, image: null });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ fullName: '', course: '', position: '', manifesto: '', image: null });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (const k of ['fullName','course','position','manifesto']) if (editForm[k] !== undefined) fd.append(k, editForm[k]);
    if (editForm.image) fd.append('image', editForm.image);
    await ContestantAPI.update(editingId, fd);
    cancelEdit();
    const { data } = await ContestantAPI.list();
    setContestants(data);
    alert('Contestant updated');
  };

  const remove = async (id) => {
    if (!confirm('Delete this contestant? This cannot be undone.')) return;
    await ContestantAPI.remove(id);
    setContestants(prev => prev.filter(x => x._id !== id));
    alert('Contestant deleted');
  };

  const groupedResults = live.reduce((acc, r) => {
    (acc[r.position] ||= []).push(r);
    return acc;
  }, {});
  const leadingByPosition = Object.fromEntries(
    Object.entries(groupedResults).map(([pos, arr]) => [pos, arr[0]])
  );

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h3>Voting Controls</h3>
          <p>Status: <b>{settings?.votingStatus}</b></p>
          <div className="row">
            <button className="btn-success" onClick={() => AdminAPI.open()}>Open Voting</button>
            <button className="btn-warning" onClick={() => AdminAPI.close()}>Close Voting</button>
            <button className="btn-danger" onClick={() => AdminAPI.end()}>End Voting</button>
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

        <div className="card">
          <h3>Manage Contestants</h3>
          <div className="cards">
            {contestants.map(c => (
              <div key={c._id} className="card">
                {editingId === c._id ? (
                  <form onSubmit={saveEdit} className="form">
                    <input value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Full Name" required />
                    <input value={editForm.course} onChange={e => setEditForm(f => ({ ...f, course: e.target.value }))} placeholder="Course" required />
                    <input value={editForm.position} onChange={e => setEditForm(f => ({ ...f, position: e.target.value }))} placeholder="Position" required />
                    <textarea value={editForm.manifesto} onChange={e => setEditForm(f => ({ ...f, manifesto: e.target.value }))} placeholder="Manifesto" required />
                    <input type="file" accept="image/*" onChange={e => setEditForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
                    <div className="row">
                      <button type="submit" className="btn-success">Save</button>
                      <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <img src={`${API_BASE_ORIGIN}${c.imageUrl}`} alt={c.fullName} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    <h4>{c.fullName}</h4>
                    <p>{c.course}</p>
                    <p><b>{c.position}</b></p>
                    <div className="row">
                      <button className="btn-secondary" onClick={() => startEdit(c)}>Edit</button>
                      <button className="btn-danger" onClick={() => remove(c._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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


