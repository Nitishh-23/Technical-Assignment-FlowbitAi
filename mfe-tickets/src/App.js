import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function App({ token }) {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');

    const fetchTickets = () => {
        fetch(`${API_URL}/tickets`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch tickets');
            }
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setTickets(data);
            } else {
                setTickets([]); 
            }
        })
        .catch(err => {
            console.error("Error fetching tickets:", err);
            setError('Could not load tickets.');
            setTickets([]); // On error, reset to an empty array to prevent crash
        });
    };

    useEffect(() => {
        if (token) {
            fetchTickets();
            const interval = setInterval(fetchTickets, 3000); // Poll for updates
            return () => clearInterval(interval);
        }
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description: 'A new ticket from the UI' })
        }).then(() => {
            setTitle('');
            fetchTickets(); // Re-fetch immediately after creation
        });
    };

    return (
        <div style={{ border: '2px dashed blue', padding: '1rem', marginTop: '1rem' }}>
            <h2>Support Tickets App (Micro-Frontend)</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="New ticket title"
                />
                <button type="submit">Create Ticket</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        {ticket.title} - <strong>Status: {ticket.status}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;