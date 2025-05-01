'use client';

import { useState } from 'react';

export default function CreateTeamPage() {
  const [form, setForm] = useState({
    name: '',
    region: '',
    country: '',
    created_by: '',
    players: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playersArray = form.players.split(',').map((name, index) => ({
      id: index + 1,
      name: name.trim(),
    }));

    const res = await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        region: form.region,
        country: form.country,
        created_by: form.created_by,
        players: playersArray,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setMessage('Team created successfully!');
      setForm({
        name: '',
        region: '',
        country: '',
        created_by: '',
        players: '',
      });
    } else {
      const error = await res.json();
      setMessage(`Error: ${error.error}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create a Team</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input type="text" name="name" placeholder="Team Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} />
        <input type="text" name="created_by" placeholder="Created By (username)" value={form.created_by} onChange={handleChange} required />
        <input
          type="text"
          name="players"
          placeholder="Players (comma-separated)"
          value={form.players}
          onChange={handleChange}
        />
        <button type="submit">Create Team</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
