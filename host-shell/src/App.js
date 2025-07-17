import React, { useState, useEffect, lazy, Suspense } from 'react';

const LoginPage = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Invalid credentials');
            }
            return res.json();
        })
        .then(data => {
            if (data.token) {
                setToken(data.token);
            }
        })
        .catch(err => setError(err.message));
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <p>Try: <strong>admin@logistics.co</strong> or <strong>admin@retail.gmbh</strong> (pass: password123)</p>
            <div>
                <input type="email" value={email} placeholder="admin@logistics.co" onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <input type="password" value={password} placeholder="password123" onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

const Dashboard = ({ token, onLogout }) => {
    const [screens, setScreens] = useState([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:3001/me/screens', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch screens');
                    }
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setScreens(data);
                    } else {
                        setScreens([]);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch screens:", err);
                    setScreens([]); // Set to empty array on error to prevent crash
                });
        }
    }, [token]);

    // This checks if screens is an array before calling .map
    const remoteApps = Array.isArray(screens) ? screens.map(screen => {
        const Component = lazy(() => import('tickets_mfe/SupportTicketsApp'));
        return <Component key={screen.screen} token={token} />;
    }) : [];

    return (
        <div>
            <button onClick={onLogout} style={{float: 'right'}}>Logout</button>
            <h1>Dashboard Shell</h1>
            <p>Your screens are loading below:</p>
            <hr />
            <Suspense fallback={<div>Loading App...</div>}>
                {remoteApps}
            </Suspense>
        </div>
    );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  const handleSetToken = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
      localStorage.removeItem('jwt_token');
      setToken(null);
  }

  return token ? <Dashboard token={token} onLogout={handleLogout} /> : <LoginPage setToken={handleSetToken} />;
}

export default App;